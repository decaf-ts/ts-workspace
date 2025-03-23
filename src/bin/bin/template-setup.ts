import { runCommand } from "../utils/utils";
import fs from "fs";

import { Encoding, SetupScriptKey, Tokens } from "../utils/constants";

async function updateDependencies() {

  await runCommand("npx npm-check-updates -u");
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
  Object.values(Tokens).forEach((token) => {
    try {
      let status;
      try {
        status = fs.existsSync(token);
      } catch (e: unknown) {
        console.log(`Token file ${token} not found. Creating a new one...`);
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
  const gitUser = await runCommand("git config user.name");
  const gitEmail = await runCommand("git config user.email");
  await runCommand("git config user.email \"automation@decaf.ts\"");
  await runCommand("git config user.name \"decaf\"");
  await runCommand("git add .");
  await runCommand(`git commit -m "refs #1 - after repo setup"`);
  await runCommand("git push");
  await runCommand(`git config user.email "${gitEmail}"`);
  await runCommand(`git config user.name "${gitUser}"`);
}

async function main(){
  await fixPackage();
  await createTokenFiles();
  await updateDependencies();
  await auditFix();
  await pushToGit();
}

main()
  .then(() => console.log("Template booted"))
  .catch(e => {
    console.error("Error booting template:", e.message);
    process.exit(1);
  });