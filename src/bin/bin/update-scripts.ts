import fs from "fs";
import { Logging } from "../output/logging";
import path from "path";
import { Command } from "../cli/command";
import { CommandOptions } from "../cli/types";
import { HttpClient } from "../utils/http";

const logger = Logging.for("Template Sync")

const options = {
  templates: [
    ...fs.readdirSync(path.join(process.cwd(), ".github", "ISSUE_TEMPLATE")),
    ".github/FUNDING.yml"
  ],
  workflows: fs.readdirSync(path.join(process.cwd(), ".github", "workflows")),
  ide: fs.readdirSync(path.join(process.cwd(), ".run")),
  docs : [
    ...fs.readdirSync(path.join(process.cwd(), "workdocs", "licences")),
    ...fs.readdirSync(path.join(process.cwd(), "workdocs", "tutorials")),
  ],
  styles: [
    ".prettierrc",
    ".eslint.config.js",
  ],
  licences: fs.readdirSync(path.join(process.cwd(), "workdocs", "licenses")),
  scripts: [
  ]
}

const opts = Object.keys(options).map(k => ({
  type: "boolean",
  default: true,
}));

class TemplateSync extends Command<CommandOptions<typeof opts>, void> {
  constructor(options: CommandOptions<any>) {
    super("TemplateSync", options);
  }
}

const scripts = [


  "LICENSE.md",

  "bin/tag-release.sh",
  "bin/template_setup.sh",
  "bin/update-scripts.js",
  "bin/update-script.js"
]

async function main(){
  return Promise.allSettled(scripts.map(async p => {
    return new Promise<{path: string, result: string}>(async (resolve, reject) => {
      const  data = await HttpClient.downloadFile(`https://raw.githubusercontent.com/decaf-ts/ts-wokspace/master/${p}`)
      return data;
    })
  })).catch(error => {
    logger.error(`Error fetching scripts: ${error}`);
    throw new Error(`Error fetching scripts: ${error}`);
  }).then(results => {
    results.forEach((prom) => {
      if(prom.status === "fulfilled") {
        const { path, result } = prom.value;
        const content = result.toString();
        fs.writeFileSync(path, content);
        logger.verbose(`Updated ${path}`);
      } else {
        logger.debug(`Failed to download: ${prom.reason}`);
      }
    });
  }).catch((error: unknown) => {
    logger.error(`Error fetching scripts: ${error}`);
    throw new Error(`Error overwriting files: ${error}`);
  })
}

main()
  .then(() => logger.info("Scripts and configs updated"))
  .catch(e => {
    logger.error(`Error Updating scripts: ${e}`);
    process.exit(1);
  });
