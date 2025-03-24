import { runCommand } from "../utils/utils";
import fs from "fs";

import { Encoding, SetupScriptKey, Tokens } from "../utils/constants";
import { Logging } from "../utils/logging";

const logger = Logging.for("TemplateSetup");

async function updateDependencies() {
  const log = logger.for(updateDependencies);
  log.info("checking for updates...");
  await runCommand("npx npm-check-updates -u");
  log.info("updating...");
  await runCommand("npx npm run do-install");
}

async function auditFix() {
  await runCommand("npm audit fix --force");
}

async function fixPackage(){
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", Encoding));
    delete pkg[SetupScriptKey];
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  } catch (e: unknown) {
    throw new Error(`Error fixing package.json: ${e}`);
  }
}

async function createTokenFiles(){
  const log = logger.for(createTokenFiles);
  Object.values(Tokens).forEach((token) => {
    try {
      let status;
      try {
        status = fs.existsSync(token);
      } catch (e: unknown) {
        log.info(`Token file ${token} not found. Creating a new one...`);
        fs.writeFileSync(token, "");
        return;
      }
      if (!status) {
        fs.writeFileSync(token, "");
      }
    } catch (e: unknown) {
      throw new Error(`Error creating token file ${token}: ${e}`);
    }
  })
}

async function pushToGit(){
  const log = logger.for(pushToGit);
  const gitUser = await runCommand("git config user.name");
  const gitEmail = await runCommand("git config user.email");
  log.verbose(`cached git id: ${gitUser}/${gitEmail}. changing to automation`);
  await runCommand("git config user.email \"automation@decaf.ts\"");
  await runCommand("git config user.name \"decaf\"");
  log.info("Pushing changes to git...");
  await runCommand("git add .");
  await runCommand(`git commit -m "refs #1 - after repo setup"`);
  await runCommand("git push");
  await runCommand(`git config user.email "${gitEmail}"`);
  await runCommand(`git config user.name "${gitUser}"`);
  log.verbose(`reverted to git id: ${gitUser}/${gitEmail}`);
}

async function main(){
  await fixPackage();
  await createTokenFiles();
  await updateDependencies();
  await auditFix();
  await pushToGit();
}

main()
  .then(() => logger.info("Template booted"))
  .catch(e => {
    logger.error(`Error booting template: ${e.message}`);
    process.exit(1);
  });