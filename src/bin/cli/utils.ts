import { runCommand } from "../utils/utils";
import { ParseArgsOptionsConfig, VerbosityLogger } from "../utils/types";
import { UserInput } from "../input/UserInput";
import { SemVersion, SemVersionRegex } from "../utils/constants";

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

/**
 * @description Validates and normalizes version strings.
 * @summary This function checks if a given version string is valid according to semantic versioning rules
 * or if it's one of the predefined increment types (patch, minor, major). It normalizes the input to lowercase.
 *
 * @param {string} version - The version string to test. Can be 'patch', 'minor', 'major', or a semver string.
 * @param {VerbosityLogger} logger
 * @return {string | undefined} The lowercase version string if valid, or undefined if invalid.
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
export function testVersion(version: string, logger: VerbosityLogger): string | undefined {
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
export async function prepareVersion(logger: VerbosityLogger, tag?: string){
  logger = logger.for(prepareVersion)
  tag = testVersion(tag as string || "", logger);
  if (!tag) {
    logger.verbose("No release message provided. Prompting for one:");
    logger.info(`Listing latest git tags:`)
    await runCommand("git tag --sort=-taggerdate | head -n 5");
    return await UserInput.insistForText("tag", "Enter the new tag number (accepts v*.*.*[-...])", (val) => !!val.toString().match(/^v[0-9]+\.[0-9]+.[0-9]+(\-[0-9a-zA-Z\-]+)?$/));
  }
}


/**
 * @description Prepares the release message.
 * @summary Prompts the user for a release message if not provided.
 *
 * @function prepareMessage
 */
export async function prepareMessage(logger: VerbosityLogger, message?: string){
  logger = logger.for(prepareMessage)
  if (!message) {
    logger.verbose("No release message provided. Prompting for one");
    return await UserInput.insistForText("message", "What should be the release message/ticket?", (val) => !!val && val.toString().length > 5);
  }
}

