import { runCommand } from "../utils/utils";
import { DefaultTheme, LogLevel, NoCIFLag } from "../utils/constants";
import { Logging } from "../output/logging";
import { prepareMessage, prepareVersion } from "../cli/utils";
import { ParseArgsOptionsConfig } from "../input/types";
import { LoggingConfig } from "../output/types";
import { UserInput } from "../input/input";

const logger = Logging.for("ReleaseScript");
/**
 * @description Configuration for command-line arguments.
 * @summary Defines the accepted command-line options for the script.
 */
const options = {
  ci: {
    type: "boolean",
    short: "nc",
    default: true
  },
  message: {
    type: "string",
    short: "m",
  },
  tag: {
    type: "string",
    short: "t",
    default: undefined
  }
}

const opts: typeof options & typeof DefaultInputOptions = Object.assign({}, DefaultInputOptions, options);

const anwsers = UserInput.parseArgs(opts as ParseArgsOptionsConfig);
let {tag, message, ci, verbose, help} = anwsers.values;

const logConfig: LoggingConfig = {
  level: LogLevel.debug,
  verbose: 3,
  style: true,
  timestamp: true,
  timestampFormat: "YYYY-MM-DD HH:mm:ss",
  context: true,
  theme: DefaultTheme
}
Logging.config = logConfig

/**
 * @description Main function to execute the release process.
 * @summary Orchestrates the entire release process including version preparation,
 * message preparation, git operations, and npm publishing.
 *
 * @function main
 *
 * @mermaid
 * sequenceDiagram
 *   participant Script
 *   participant Git
 *   participant NPM
 *   Script->>Script: Prepare Version
 *   Script->>Script: Prepare Message
 *   Script->>NPM: Run prepare-release script
 *   Script->>Git: Check status
 *   alt Changes detected
 *     Script->>Git: Add changes
 *     Script->>Git: Commit changes
 *   end
 *   Script->>NPM: Update version
 *   Script->>Git: Push changes and tags
 *   alt Not CI environment
 *     Script->>NPM: Publish package
 *   end
 */
async function main(){
  let result: any;
  try {
    tag = await prepareVersion(logger, tag as string);
    message = await prepareMessage(logger, message as string);
    result = await runCommand("npm run prepare-release");
    result = runCommand("git status --porcelain");
    await result;
    if (result.logs.length) {
      await runCommand("git add .");
      await runCommand(`git commit -m "${tag} - ${message} - after release preparation${ci ? "" : NoCIFLag}"`);
    }
    await runCommand(`npm version "${tag}" -m "${message}${ci ? "" : NoCIFLag}"`);
    await runCommand("git push --follow-tags");
    if(!ci) {
      await runCommand("NPM_TOKEN=\$(cat .npmtoken) npm publish --access public");
    }
  } catch (e: unknown){
    throw new Error(`Error preparing release: ${e}`);
  }
}

main()
  .then(() => console.log("Release prepared successfully"))
  .catch(e => {
    console.error("Error preparing release:", e.message);
    process.exit(1);
  });

