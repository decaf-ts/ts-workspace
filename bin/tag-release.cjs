"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils.cjs");
const constants_1 = require("../utils/constants.cjs");
const input_1 = require("../input/input.cjs");
const command_1 = require("../cli/command.cjs");
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
};
class ReleaseScript extends command_1.Command {
    constructor(options) {
        super("ReleaseScript", options);
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
    async prepareVersion(logger, tag) {
        logger = logger.for(this.prepareVersion);
        tag = this.testVersion(tag || "", logger);
        if (!tag) {
            logger.verbose("No release message provided. Prompting for one:");
            logger.info(`Listing latest git tags:`);
            await (0, utils_1.runCommand)("git tag --sort=-taggerdate | head -n 5");
            return await input_1.UserInput.insistForText("tag", "Enter the new tag number (accepts v*.*.*[-...])", (val) => !!val.toString().match(/^v[0-9]+\.[0-9]+.[0-9]+(\-[0-9a-zA-Z\-]+)?$/));
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
    testVersion(version, logger) {
        logger = logger.for(this.testVersion);
        version = version.trim().toLowerCase();
        switch (version) {
            case constants_1.SemVersion.PATCH:
            case constants_1.SemVersion.MINOR:
            case constants_1.SemVersion.MAJOR:
                logger.verbose(`Using provided SemVer update: ${version}`, 1);
                return version;
            default:
                logger.verbose(`Testing provided version for SemVer compatibility: ${version}`, 1);
                if (!(new RegExp(constants_1.SemVersionRegex).test(version))) {
                    logger.debug(`Invalid version number: ${version}`);
                    return undefined;
                }
                logger.verbose(`version approved: ${version}`, 1);
                return version;
        }
    }
    /**
     * @description Prepares the release message.
     * @summary Prompts the user for a release message if not provided.
     *
     * @function prepareMessage
     */
    async prepareMessage(logger, message) {
        logger = logger.for(this.prepareMessage);
        if (!message) {
            logger.verbose("No release message provided. Prompting for one");
            return await input_1.UserInput.insistForText("message", "What should be the release message/ticket?", (val) => !!val && val.toString().length > 5);
        }
    }
}
new ReleaseScript(options).run(async (cmd, args, log) => {
    let result;
    let { tag, message, ci } = args.values;
    tag = await cmd.prepareVersion(log, tag);
    message = await cmd.prepareMessage(log, message);
    result = await (0, utils_1.runCommand)(`npm run prepare-release -- ${tag} ${message}`, { cwd: process.cwd() });
    result = (0, utils_1.runCommand)("git status --porcelain");
    const resolved = await result;
    if (result.logs.length && await input_1.UserInput.askConfirmation("git-changes", "Do you want to push the changes to the remote repository?", true)) {
        await (0, utils_1.runCommand)("git add .");
        await (0, utils_1.runCommand)(`git commit -m "${tag} - ${message} - after release preparation${ci ? "" : constants_1.NoCIFLag}"`);
    }
    await (0, utils_1.runCommand)(`npm version "${tag}" -m "${message}${ci ? "" : constants_1.NoCIFLag}"`);
    await (0, utils_1.runCommand)("git push --follow-tags");
    if (!ci) {
        await (0, utils_1.runCommand)("NPM_TOKEN=\$(cat .npmtoken) npm publish --access public");
    }
}).then(() => ReleaseScript.log.info("Release pushed successfully"))
    .catch((e) => {
    ReleaseScript.log.error(`Error preparing release: ${e}`);
    process.exit(1);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iaW4vYmluL3RhZy1yZWxlYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTRDO0FBQzVDLGtEQUEyRTtBQUczRSwwQ0FBMkM7QUFFM0MsNENBQXlDO0FBRXpDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxHQUFHO0lBQ2QsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsSUFBSTtRQUNYLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRSxHQUFHO0tBQ1g7SUFDRCxHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRSxHQUFHO1FBQ1YsT0FBTyxFQUFFLFNBQVM7S0FDbkI7Q0FDRixDQUFBO0FBRUQsTUFBTSxhQUFjLFNBQVEsaUJBQTZCO0lBQ3ZELFlBQVksT0FBNEI7UUFDdEMsS0FBSyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBdUIsRUFBRSxHQUFZO1FBQ3hELE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFhLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNULE1BQU0sQ0FBQyxPQUFPLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUE7WUFDdkMsTUFBTSxJQUFBLGtCQUFVLEVBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUMzRCxPQUFPLE1BQU0saUJBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFF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UyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsMkRBQTJELEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUM1SSxNQUFNLElBQUEsa0JBQVUsRUFBQyxXQUFXLENBQUMsQ0FBQztRQUM5QixNQUFNLElBQUEsa0JBQVUsRUFBQyxrQkFBa0IsR0FBRyxNQUFNLE9BQU8sK0JBQStCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBUSxHQUFHLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBQ0QsTUFBTSxJQUFBLGtCQUFVLEVBQUMsZ0JBQWdCLEdBQUcsU0FBUyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQzlFLE1BQU0sSUFBQSxrQkFBVSxFQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDM0MsSUFBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ1AsTUFBTSxJQUFBLGtCQUFVLEVBQUMseURBQXlELENBQUMsQ0FBQztJQUM5RSxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDakUsS0FBSyxDQUFDLENBQUMsQ0FBVSxFQUFFLEVBQUU7SUFDcEIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJiaW4vYmluL3RhZy1yZWxlYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcnVuQ29tbWFuZCB9IGZyb20gXCIuLi91dGlscy91dGlsc1wiO1xuaW1wb3J0IHsgTm9DSUZMYWcsIFNlbVZlcnNpb24sIFNlbVZlcnNpb25SZWdleCB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIjtcbmltcG9ydCB7IFBhcnNlQXJnc1Jlc3VsdCB9IGZyb20gXCIuLi9pbnB1dC90eXBlc1wiO1xuaW1wb3J0IHsgVmVyYm9zaXR5TG9nZ2VyIH0gZnJvbSBcIi4uL291dHB1dC90eXBlc1wiO1xuaW1wb3J0IHsgVXNlcklucHV0IH0gZnJvbSBcIi4uL2lucHV0L2lucHV0XCI7XG5pbXBvcnQgeyBDb21tYW5kT3B0aW9ucyB9IGZyb20gXCIuLi9jbGkvdHlwZXNcIjtcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tIFwiLi4vY2xpL2NvbW1hbmRcIjtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29uZmlndXJhdGlvbiBmb3IgY29tbWFuZC1saW5lIGFyZ3VtZW50cy5cbiAqIEBzdW1tYXJ5IERlZmluZXMgdGhlIGFjY2VwdGVkIGNvbW1hbmQtbGluZSBvcHRpb25zIGZvciB0aGUgc2NyaXB0LlxuICovXG5jb25zdCBvcHRpb25zID0ge1xuICBjaToge1xuICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgIHNob3J0OiBcIm5jXCIsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICBzaG9ydDogXCJtXCIsXG4gIH0sXG4gIHRhZzoge1xuICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgc2hvcnQ6IFwidFwiLFxuICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICB9XG59XG5cbmNsYXNzIFJlbGVhc2VTY3JpcHQgZXh0ZW5kcyBDb21tYW5kPHR5cGVvZiBvcHRpb25zLCB2b2lkPiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IENvbW1hbmRPcHRpb25zPGFueT4pIHtcbiAgICBzdXBlcihcIlJlbGVhc2VTY3JpcHRcIiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFByZXBhcmVzIHRoZSB2ZXJzaW9uIHRhZyBmb3IgdGhlIHJlbGVhc2UuXG4gICAqIEBzdW1tYXJ5IFZhbGlkYXRlcyBhbmQgc2V0cyB0aGUgdmVyc2lvbiB0YWcsIHByb21wdGluZyB0aGUgdXNlciBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBtZXJtYWlkXG4gICAqIHNlcXVlbmNlRGlhZ3JhbVxuICAgKiAgIHBhcnRpY2lwYW50IFNjcmlwdFxuICAgKiAgIHBhcnRpY2lwYW50IFVzZXJcbiAgICogICBwYXJ0aWNpcGFudCBHaXRcbiAgICogICBTY3JpcHQtPj5TY3JpcHQ6IFRlc3QgaW5pdGlhbCB0YWdcbiAgICogICBhbHQgVGFnIGlzIHZhbGlkXG4gICAqICAgICBTY3JpcHQtPj5TY3JpcHQ6IFVzZSBwcm92aWRlZCB0YWdcbiAgICogICBlbHNlIFRhZyBpcyBpbnZhbGlkIG9yIG5vdCBwcm92aWRlZFxuICAgKiAgICAgU2NyaXB0LT4+R2l0OiBMaXN0IHJlY2VudCB0YWdzXG4gICAqICAgICBHaXQtLT4+U2NyaXB0OiBSZWNlbnQgdGFnc1xuICAgKiAgICAgU2NyaXB0LT4+VXNlcjogUHJvbXB0IGZvciB0YWdcbiAgICogICAgIFVzZXItLT4+U2NyaXB0OiBQcm92aWRlIHRhZ1xuICAgKiAgICAgU2NyaXB0LT4+U2NyaXB0OiBWYWxpZGF0ZSB0YWdcbiAgICogICAgIFNjcmlwdC0+PlVzZXI6IENvbmZpcm0gdGFnXG4gICAqICAgICBVc2VyLS0+PlNjcmlwdDogQ29uZmlybWF0aW9uXG4gICAqICAgZW5kXG4gICAqL1xuICBhc3luYyBwcmVwYXJlVmVyc2lvbihsb2dnZXI6IFZlcmJvc2l0eUxvZ2dlciwgdGFnPzogc3RyaW5nKXtcbiAgICBsb2dnZXIgPSBsb2dnZXIuZm9yKHRoaXMucHJlcGFyZVZlcnNpb24pXG4gICAgdGFnID0gdGhpcy50ZXN0VmVyc2lvbih0YWcgYXMgc3RyaW5nIHx8IFwiXCIsIGxvZ2dlcik7XG4gICAgaWYgKCF0YWcpIHtcbiAgICAgIGxvZ2dlci52ZXJib3NlKFwiTm8gcmVsZWFzZSBtZXNzYWdlIHByb3ZpZGVkLiBQcm9tcHRpbmcgZm9yIG9uZTpcIik7XG4gICAgICBsb2dnZXIuaW5mbyhgTGlzdGluZyBsYXRlc3QgZ2l0IHRhZ3M6YClcbiAgICAgIGF3YWl0IHJ1bkNvbW1hbmQoXCJnaXQgdGFnIC0tc29ydD0tdGFnZ2VyZGF0ZSB8IGhlYWQgLW4gNVwiKTtcbiAgICAgIHJldHVybiBhd2FpdCBVc2VySW5wdXQuaW5zaXN0Rm9yVGV4dChcInRhZ1wiLCBcIkVudGVyIHRoZSBuZXcgdGFnIG51bWJlciAoYWNjZXB0cyB2Ki4qLipbLS4uLl0pXCIsICh2YWwpID0+ICEhdmFsLnRvU3RyaW5nKCkubWF0Y2goL152WzAtOV0rXFwuWzAtOV0rLlswLTldKyhcXC1bMC05YS16QS1aXFwtXSspPyQvKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBWYWxpZGF0ZXMgYW5kIG5vcm1hbGl6ZXMgdmVyc2lvbiBzdHJpbmdzLlxuICAgKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBpZiBhIGdpdmVuIHZlcnNpb24gc3RyaW5nIGlzIHZhbGlkIGFjY29yZGluZyB0byBzZW1hbnRpYyB2ZXJzaW9uaW5nIHJ1bGVzXG4gICAqIG9yIGlmIGl0J3Mgb25lIG9mIHRoZSBwcmVkZWZpbmVkIGluY3JlbWVudCB0eXBlcyAocGF0Y2gsIG1pbm9yLCBtYWpvcikuIEl0IG5vcm1hbGl6ZXMgdGhlIGlucHV0IHRvIGxvd2VyY2FzZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb24gLSBUaGUgdmVyc2lvbiBzdHJpbmcgdG8gdGVzdC4gQ2FuIGJlICdwYXRjaCcsICdtaW5vcicsICdtYWpvcicsIG9yIGEgc2VtdmVyIHN0cmluZy5cbiAgICogQHBhcmFtIHtWZXJib3NpdHlMb2dnZXJ9IGxvZ2dlclxuICAgKiBAcmV0dXJuIHtzdHJpbmcgfCB1bmRlZmluZWR9IFRoZSBsb3dlcmNhc2UgdmVyc2lvbiBzdHJpbmcgaWYgdmFsaWQsIG9yIHVuZGVmaW5lZCBpZiBpbnZhbGlkLlxuICAgKlxuICAgKiBAbWVybWFpZFxuICAgKiBncmFwaCBURFxuICAgKiAgIEFbU3RhcnRdIC0tPiBCe0lzIHZlcnNpb24gcGF0Y2gsIG1pbm9yLCBvciBtYWpvcj99XG4gICAqICAgQiAtLT58WWVzfCBDW1JldHVybiBsb3dlcmNhc2UgdmVyc2lvbl1cbiAgICogICBCIC0tPnxOb3wgRHtEb2VzIHZlcnNpb24gbWF0Y2ggU2VtVmVyIHJlZ2V4P31cbiAgICogICBEIC0tPnxZZXN8IEVbUmV0dXJuIGxvd2VyY2FzZSB2ZXJzaW9uXVxuICAgKiAgIEQgLS0+fE5vfCBGW0xvZyBkZWJ1ZyBtZXNzYWdlXVxuICAgKiAgIEYgLS0+IEdbUmV0dXJuIHVuZGVmaW5lZF1cbiAgICogICBDIC0tPiBIW0VuZF1cbiAgICogICBFIC0tPiBIXG4gICAqICAgRyAtLT4gSFxuICAgKi9cbiAgdGVzdFZlcnNpb24odmVyc2lvbjogc3RyaW5nLCBsb2dnZXI6IFZlcmJvc2l0eUxvZ2dlcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgbG9nZ2VyID0gbG9nZ2VyLmZvcih0aGlzLnRlc3RWZXJzaW9uKTtcbiAgICB2ZXJzaW9uID0gdmVyc2lvbi50cmltKCkudG9Mb3dlckNhc2UoKVxuICAgIHN3aXRjaCAodmVyc2lvbikge1xuICAgICAgY2FzZSBTZW1WZXJzaW9uLlBBVENIOlxuICAgICAgY2FzZSBTZW1WZXJzaW9uLk1JTk9SOlxuICAgICAgY2FzZSBTZW1WZXJzaW9uLk1BSk9SOlxuICAgICAgICBsb2dnZXIudmVyYm9zZShgVXNpbmcgcHJvdmlkZWQgU2VtVmVyIHVwZGF0ZTogJHt2ZXJzaW9ufWAsIDEpO1xuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvZ2dlci52ZXJib3NlKGBUZXN0aW5nIHByb3ZpZGVkIHZlcnNpb24gZm9yIFNlbVZlciBjb21wYXRpYmlsaXR5OiAke3ZlcnNpb259YCwgMSk7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAoU2VtVmVyc2lvblJlZ2V4KS50ZXN0KHZlcnNpb24pKSkge1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgSW52YWxpZCB2ZXJzaW9uIG51bWJlcjogJHt2ZXJzaW9ufWApO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoYHZlcnNpb24gYXBwcm92ZWQ6ICR7dmVyc2lvbn1gLCAxKTtcbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFByZXBhcmVzIHRoZSByZWxlYXNlIG1lc3NhZ2UuXG4gICAqIEBzdW1tYXJ5IFByb21wdHMgdGhlIHVzZXIgZm9yIGEgcmVsZWFzZSBtZXNzYWdlIGlmIG5vdCBwcm92aWRlZC5cbiAgICpcbiAgICogQGZ1bmN0aW9uIHByZXBhcmVNZXNzYWdlXG4gICAqL1xuICBhc3luYyBwcmVwYXJlTWVzc2FnZShsb2dnZXI6IFZlcmJvc2l0eUxvZ2dlciwgbWVzc2FnZT86IHN0cmluZyl7XG4gICAgbG9nZ2VyID0gbG9nZ2VyLmZvcih0aGlzLnByZXBhcmVNZXNzYWdlKVxuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbG9nZ2VyLnZlcmJvc2UoXCJObyByZWxlYXNlIG1lc3NhZ2UgcHJvdmlkZWQuIFByb21wdGluZyBmb3Igb25lXCIpO1xuICAgICAgcmV0dXJuIGF3YWl0IFVzZXJJbnB1dC5pbnNpc3RGb3JUZXh0KFwibWVzc2FnZVwiLCBcIldoYXQgc2hvdWxkIGJlIHRoZSByZWxlYXNlIG1lc3NhZ2UvdGlja2V0P1wiLCAodmFsKSA9PiAhIXZhbCAmJiB2YWwudG9TdHJpbmcoKS5sZW5ndGggPiA1KTtcbiAgICB9XG4gIH1cblxufVxuXG5uZXcgUmVsZWFzZVNjcmlwdChvcHRpb25zKS5ydW4oYXN5bmMgKGNtZDogUmVsZWFzZVNjcmlwdCwgYXJnczogUGFyc2VBcmdzUmVzdWx0LCBsb2c6IFZlcmJvc2l0eUxvZ2dlcikgPT4ge1xuICBsZXQgcmVzdWx0OiBhbnk7XG4gIGxldCB7dGFnLCBtZXNzYWdlLCBjaX0gPSBhcmdzLnZhbHVlcztcbiAgdGFnID0gYXdhaXQgY21kLnByZXBhcmVWZXJzaW9uKGxvZywgdGFnIGFzIHN0cmluZyk7XG4gIG1lc3NhZ2UgPSBhd2FpdCBjbWQucHJlcGFyZU1lc3NhZ2UobG9nLCBtZXNzYWdlIGFzIHN0cmluZyk7XG4gIHJlc3VsdCA9IGF3YWl0IHJ1bkNvbW1hbmQoYG5wbSBydW4gcHJlcGFyZS1yZWxlYXNlIC0tICR7dGFnfSAke21lc3NhZ2V9YCwge2N3ZDogcHJvY2Vzcy5jd2QoKX0pO1xuICByZXN1bHQgPSBydW5Db21tYW5kKFwiZ2l0IHN0YXR1cyAtLXBvcmNlbGFpblwiKTtcbiAgY29uc3QgcmVzb2x2ZWQgPSBhd2FpdCByZXN1bHQ7XG4gIGlmIChyZXN1bHQubG9ncy5sZW5ndGggJiYgYXdhaXQgVXNlcklucHV0LmFza0NvbmZpcm1hdGlvbihcImdpdC1jaGFuZ2VzXCIsIFwiRG8geW91IHdhbnQgdG8gcHVzaCB0aGUgY2hhbmdlcyB0byB0aGUgcmVtb3RlIHJlcG9zaXRvcnk/XCIsIHRydWUpKSB7XG4gICAgYXdhaXQgcnVuQ29tbWFuZChcImdpdCBhZGQgLlwiKTtcbiAgICBhd2FpdCBydW5Db21tYW5kKGBnaXQgY29tbWl0IC1tIFwiJHt0YWd9IC0gJHttZXNzYWdlfSAtIGFmdGVyIHJlbGVhc2UgcHJlcGFyYXRpb24ke2NpID8gXCJcIiA6IE5vQ0lGTGFnfVwiYCk7XG4gIH1cbiAgYXdhaXQgcnVuQ29tbWFuZChgbnBtIHZlcnNpb24gXCIke3RhZ31cIiAtbSBcIiR7bWVzc2FnZX0ke2NpID8gXCJcIiA6IE5vQ0lGTGFnfVwiYCk7XG4gIGF3YWl0IHJ1bkNvbW1hbmQoXCJnaXQgcHVzaCAtLWZvbGxvdy10YWdzXCIpO1xuICBpZighY2kpIHtcbiAgICBhd2FpdCBydW5Db21tYW5kKFwiTlBNX1RPS0VOPVxcJChjYXQgLm5wbXRva2VuKSBucG0gcHVibGlzaCAtLWFjY2VzcyBwdWJsaWNcIik7XG4gIH1cbn0pLnRoZW4oKCkgPT4gUmVsZWFzZVNjcmlwdC5sb2cuaW5mbyhcIlJlbGVhc2UgcHVzaGVkIHN1Y2Nlc3NmdWxseVwiKSlcbiAgLmNhdGNoKChlOiB1bmtub3duKSA9PiB7XG4gICAgUmVsZWFzZVNjcmlwdC5sb2cuZXJyb3IoYEVycm9yIHByZXBhcmluZyByZWxlYXNlOiAke2V9YCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9KTtcblxuIl19
