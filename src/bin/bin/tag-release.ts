import { ParseArgsOptionsConfig } from "../utils/types";
import { runCommand } from "../utils/utils";
import { NoCIFLag, SemVersion, SemVersionRegex } from "../utils/constants";
import { UserInput } from "../input/UserInput";
import { DefaultInputOptions } from "../input/common";
import { Logging } from "../utils/logging";

const logger = Logging.for("ReleaseScript");
/**
 * @description Configuration for command-line arguments.
 * @summary Defines the accepted command-line options for the script.
 */
const options: ParseArgsOptionsConfig = {
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

let {tag, message, ci} = UserInput.parseArgs(Object.assign({}, DefaultInputOptions, options)).values;
/**
 * @description Validates and normalizes version strings.
 * @summary This function checks if a given version string is valid according to semantic versioning rules
 * or if it's one of the predefined increment types (patch, minor, major). It normalizes the input to lowercase.
 *
 * @function testVersion
 *
 * @param {string} version - The version string to test. Can be 'patch', 'minor', 'major', or a semver string.
 * @return {string | undefined} The lowercase version string if valid, or undefined if invalid.
 *
 * @memberOf module:@decaf-ts/tag-release
 *
 * @mermaid
 * graph TD
 *   A[Start] --> B{Is version patch, minor, or major?}
 *   B -->|Yes| C[Return lowercase version]
 *   B -->|No| D{Does version match SemVer regex?}
 *   D -->|Yes| E[Return lowercase version]
 *   D -->|No| F[Log debug message]
 *   F --> G[Return undefined]
 *   C --> H[End]
 *   E --> H
 *   G --> H
 */
function testVersion(version: string): string | undefined {
  version = version.trim().toLowerCase()
  switch (version) {
    case SemVersion.PATCH:
    case SemVersion.MINOR:
    case SemVersion.MAJOR:
      logger.verbose(`Using provided SemVer update: ${version}`, 1);
      return version;
    default:
      logger.verbose(`Testing provided version for SemVer compatibility: ${version}`, 1);
      if (!(new RegExp(SemVersionRegex).test(version))) {
        logger.debug(`Invalid version number: ${version}`);
        return undefined;
      }
      logger.verbose(`version approved: ${version}`, 1);
      return version;
  }
}
/**
 * @description Prepares the version tag for the release.
 * @summary Validates and sets the version tag, prompting the user if necessary.
 *
 * @function prepareVersion
 *
 * @mermaid
 * sequenceDiagram
 *   participant Script
 *   participant User
 *   participant Git
 *   Script->>Script: Test initial tag
 *   alt Tag is valid
 *     Script->>Script: Use provided tag
 *   else Tag is invalid or not provided
 *     Script->>Git: List recent tags
 *     Git-->>Script: Recent tags
 *     Script->>User: Prompt for tag
 *     User-->>Script: Provide tag
 *     Script->>Script: Validate tag
 *     Script->>User: Confirm tag
 *     User-->>Script: Confirmation
 *   end
 */
async function prepareVersion(){
  tag = testVersion(tag as string || "");
  if (!tag) {
    logger.verbose("No release message provided. Prompting for one:");
    logger.info(`Listing latest git tags:`)
    await runCommand("git tag --sort=-taggerdate | head -n 5");
    tag = await UserInput.insistForText("tag", "Enter the new tag number (accepts v*.*.*[-...])", (val) => !!val.toString().match(/^v[0-9]+\.[0-9]+.[0-9]+(\-[0-9a-zA-Z\-]+)?$/));
  }
}

/**
 * @description Prepares the release message.
 * @summary Prompts the user for a release message if not provided.
 *
 * @function prepareMessage
 */
async function prepareMessage(){
  if (!message) {
    logger.verbose("No release message provided. Prompting for one:");
    tag = await UserInput.insistForText("message", "What should be the release message/ticket?", (val) => !!val && val.toString().length > 5);
  }
}

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
    await prepareVersion();
    await prepareMessage();
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

