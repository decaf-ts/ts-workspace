import { ParseArgsOptionsConfig } from "../utils/types";
import { runCommand } from "../utils/utils";
import { NoCIFLag, SemVersion, SemVersionRegex } from "../utils/constants";
import { UserInput } from "../input/UserInput";
import { DefaultInputOptions } from "../input/common";
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
  switch (version.toLowerCase()) {
    case SemVersion.PATCH:
    case SemVersion.MINOR:
    case SemVersion.MAJOR:
      return version.toLowerCase();
    default:
      if (!SemVersionRegex.test(version)) {
        console.debug(`Invalid version number: ${version}`);
        return undefined;
      }
      return version.toLowerCase();
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
    console.log(`Listing git tags:`)
    await runCommand("git tag --sort=-taggerdate | head -n 5");
    let confirmation = false;
    do {
      tag = await UserInput.askText("tag", "Enter 'patch', 'minor', 'major', or the new tag number (accepts v*.*.*[-...])");
      if (!testVersion(tag)) continue;
      confirmation = await UserInput.askConfirmation("tag-confirm", "Is the tag number correct?", false);
    } while (!confirmation)
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
    let confirmation = false;
    do {
      message = await UserInput.askText("message", "What should be the release message?");
      confirmation = await UserInput.askConfirmation("message-confirm", `Is "${message}"  correct?`, false);
    } while (!confirmation)
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

