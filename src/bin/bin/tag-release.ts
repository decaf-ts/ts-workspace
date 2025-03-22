import { UserInput } from "../input/input";
import { ParseArgsOptionsConfig, ParseArgsResult } from "../utils/types";
import { runCommand } from "../utils/utils";
import { NO_CI_FLAG, SemVersion, SemVersionRegex } from "../utils/constants";

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
  version: {
    type: "string",
    short: "v",
    default: ""
  },
  task: {
    type: "string",
    short: "t",
    default: ""
  }
}

const args: ParseArgsResult = UserInput.parseArgs(options);
let {version, message, ci} = args.values;

async function prepareVersion(){

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

  version = testVersion(version as string || "");

  if (!version) {
    console.log(`Listing git tags:`)
    await runCommand("git tag --sort=-taggerdate | head -n 5");
    let confirmation = false;
    do {
      version = await UserInput.askText("version", "Enter 'patch', 'minor', 'major', or the new version number (accepts v*.*.*[-...])");
      if (!testVersion(version)) continue;
      confirmation = await UserInput.askConfirmation("version-confirm", "Is the version number correct?", false);
    } while (!confirmation)
  }
}


async function prepareMessage(){

  if (!message) {
    let confirmation = false;
    do {
      message = await UserInput.askText("message", "What should be the release message?");
      confirmation = await UserInput.askConfirmation("message-confirm", `Is "${message}"  correct?`, false);
    } while (!confirmation)
  }
}

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
      await runCommand(`git commit -m "${version} - ${message} - after release preparation${ci ? "" : NO_CI_FLAG}"`);
    }
    await runCommand(`npm version "${version}" -m "${message}${ci ? "" : NO_CI_FLAG}"`);
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

