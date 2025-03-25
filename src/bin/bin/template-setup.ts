import fs from "fs";
import { Encoding, SetupScriptKey, Tokens } from "../utils/constants";
import { auditFix, pushToGit, updateDependencies } from "../utils/fs";
import { Command } from "../cli/command";
import { CommandOptions } from "../cli/types";

class TemplateSetupScript extends Command<CommandOptions<void>, void>{
  constructor(options: CommandOptions<any>) {
    super("TemplateSetupScript", options);
  }

  async fixPackage(){
    try {
      const pkg = JSON.parse(fs.readFileSync("package.json", Encoding));
      delete pkg[SetupScriptKey];
      fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
    } catch (e: unknown) {
      throw new Error(`Error fixing package.json: ${e}`);
    }
  }

  async createTokenFiles(){
    const log = this.log.for(this.createTokenFiles);
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

}

new TemplateSetupScript({}).run(async (cmd: TemplateSetupScript)=> {
  await cmd.fixPackage();
  await cmd.createTokenFiles();
  await updateDependencies();
  await auditFix();
  await pushToGit();
}).then(() => TemplateSetupScript.log.info("Template updated successfully"))
  .catch((e: unknown) => {
    TemplateSetupScript.log.error(`Error preparing template: ${e}`);
    process.exit(1);
  });