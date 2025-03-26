import fs from "fs";
import { Encoding, SetupScriptKey, Tokens } from "../utils/constants";
import { auditFix, pushToGit, updateDependencies, writeFile } from "../utils/fs";
import { Command } from "../cli/command";
import { CommandOptions } from "../cli/types";
import { ParseArgsResult, UserInput } from "../input";
import { HttpClient } from "../utils";
import path from "path";

const baseUrl = "https://raw.githubusercontent.com/decaf-ts/ts-workspace/master"

const options = {
  org: {
    type: "text",
    short: "o",
    default: "decaf-ts"
  },
  name: {
    type: "string",
    short: "n",
    default: undefined
  },
  author: {
    type: "string",
    short: "a",
    default: undefined
  },
  license: {
    type: "string",
    short: "l",
    default: "MIT"
  }
}

class TemplateSetupScript extends Command<CommandOptions<typeof options>, void>{
  constructor(opts: CommandOptions<typeof options>) {
    super("TemplateSetupScript", opts);
  }

  async fixPackage(pkgName: string, author: string, license: string){
    try {
      const pkg = JSON.parse(fs.readFileSync("package.json", Encoding));
      delete pkg[SetupScriptKey];
      pkg.name = pkgName;
      pkg.version = "0.0.1";
      pkg.author = author;
      pkg.license = license;
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getOrg(): Promise<string>{
    const org = await UserInput.askText("Organization", "Enter the organization name (will be used to scope your npm project. leave blank to create a unscoped project):");
    const confirmation = await UserInput.askConfirmation("Confirm organization", "Is this organization correct?", true);
    if (!confirmation) {
      return this.getOrg();
    }
    return org;
  }

  async getLicense(license: string): Promise<void>{
    this.log.info(`Downloading license ${license}`);
    const data = await HttpClient.downloadFile(`${baseUrl}/workdocs/licenses/${license}.md`);
    writeFile(path.join(process.cwd(), "LICENSE.md"), data);
  }

  patchFiles(){
    ["jsdocs.json", ]
  }
}

new TemplateSetupScript(options).run(async (cmd: TemplateSetupScript, args: ParseArgsResult)=> {
  let {org, name, author, license} = args.values;
  if (!org){
    org = await cmd.getOrg();
  }
  if (!name){
    name = await UserInput.insistForText("name", "Enter the name of your project:", (val) =>!!val && val.toString().length > 3);
  }

  if (!author){
    author = await UserInput.insistForText("author", "Enter the name of the project's author:", (val) =>!!val && val.toString().length > 3);
  }

  if (!license){
    license = "MIT"
  }

  const pkgName = org ? `@${org}/${name}` : name;

  await cmd.fixPackage(pkgName as string, author as string, license as string);
  await cmd.createTokenFiles();
  if (license)
    await cmd.getLicense(license as string);

  await updateDependencies();
  await auditFix();
  await pushToGit();
}).then(() => TemplateSetupScript.log.info("Template updated successfully"))
  .catch((e: unknown) => {
    TemplateSetupScript.log.error(`Error preparing template: ${e}`);
    process.exit(1);
  });