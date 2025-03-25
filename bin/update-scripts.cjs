"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const logging_1 = require("../output/logging.cjs");
const path_1 = __importDefault(require("path"));
const command_1 = require("../cli/command.cjs");
const http_1 = require("../utils/http.cjs");
const logger = logging_1.Logging.for("Template Sync");
const options = {
    templates: [
        ...fs_1.default.readdirSync(path_1.default.join(process.cwd(), ".github", "ISSUE_TEMPLATE")),
        ".github/FUNDING.yml"
    ],
    workflows: fs_1.default.readdirSync(path_1.default.join(process.cwd(), ".github", "workflows")),
    ide: fs_1.default.readdirSync(path_1.default.join(process.cwd(), ".run")),
    docs: [
        ...fs_1.default.readdirSync(path_1.default.join(process.cwd(), "workdocs", "licences")),
        ...fs_1.default.readdirSync(path_1.default.join(process.cwd(), "workdocs", "tutorials")),
    ],
    styles: [
        ".prettierrc",
        ".eslint.config.js",
    ],
    licences: fs_1.default.readdirSync(path_1.default.join(process.cwd(), "workdocs", "licenses")),
    scripts: []
};
const opts = Object.keys(options).map(k => ({
    type: "boolean",
    default: true,
}));
class TemplateSync extends command_1.Command {
    constructor(options) {
        super("TemplateSync", options);
    }
}
const scripts = [
    "LICENSE.md",
    "bin/tag-release.sh",
    "bin/template_setup.sh",
    "bin/update-scripts.js",
    "bin/update-script.js"
];
async function main() {
    return Promise.allSettled(scripts.map(async (p) => {
        return new Promise(async (resolve, reject) => {
            const data = await http_1.HttpClient.downloadFile(`https://raw.githubusercontent.com/decaf-ts/ts-wokspace/master/${p}`);
            return data;
        });
    })).catch(error => {
        logger.error(`Error fetching scripts: ${error}`);
        throw new Error(`Error fetching scripts: ${error}`);
    }).then(results => {
        results.forEach((prom) => {
            if (prom.status === "fulfilled") {
                const { path, result } = prom.value;
                const content = result.toString();
                fs_1.default.writeFileSync(path, content);
                logger.verbose(`Updated ${path}`);
            }
            else {
                logger.debug(`Failed to download: ${prom.reason}`);
            }
        });
    }).catch((error) => {
        logger.error(`Error fetching scripts: ${error}`);
        throw new Error(`Error overwriting files: ${error}`);
    });
}
main()
    .then(() => logger.info("Scripts and configs updated"))
    .catch(e => {
    logger.error(`Error Updating scripts: ${e}`);
    process.exit(1);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iaW4vYmluL3VwZGF0ZS1zY3JpcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLCtDQUE0QztBQUM1QyxnREFBd0I7QUFDeEIsNENBQXlDO0FBRXpDLHdDQUEyQztBQUUzQyxNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUUzQyxNQUFNLE9BQU8sR0FBRztJQUNkLFNBQVMsRUFBRTtRQUNULEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RSxxQkFBcUI7S0FDdEI7SUFDRCxTQUFTLEVBQUUsWUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDM0UsR0FBRyxFQUFFLFlBQUUsQ0FBQyxXQUFXLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsSUFBSSxFQUFHO1FBQ0wsR0FBRyxZQUFFLENBQUMsV0FBVyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRSxHQUFHLFlBQUUsQ0FBQyxXQUFXLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQ3JFO0lBQ0QsTUFBTSxFQUFFO1FBQ04sYUFBYTtRQUNiLG1CQUFtQjtLQUNwQjtJQUNELFFBQVEsRUFBRSxZQUFFLENBQUMsV0FBVyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMxRSxPQUFPLEVBQUUsRUFDUjtDQUNGLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsSUFBSTtDQUNkLENBQUMsQ0FBQyxDQUFDO0FBRUosTUFBTSxZQUFhLFNBQVEsaUJBQTBDO0lBQ25FLFlBQVksT0FBNEI7UUFDdEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sR0FBRztJQUdkLFlBQVk7SUFFWixvQkFBb0I7SUFDcEIsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtJQUN2QixzQkFBc0I7Q0FDdkIsQ0FBQTtBQUVELEtBQUssVUFBVSxJQUFJO0lBQ2pCLE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtRQUM5QyxPQUFPLElBQUksT0FBTyxDQUFpQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzNFLE1BQU8sSUFBSSxHQUFHLE1BQU0saUJBQVUsQ0FBQyxZQUFZLENBQUMsaUVBQWlFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakgsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3ZCLElBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xDLFlBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNwQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBYyxFQUFFLEVBQUU7UUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELElBQUksRUFBRTtLQUNILElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDdEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJpbi9iaW4vdXBkYXRlLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBMb2dnaW5nIH0gZnJvbSBcIi4uL291dHB1dC9sb2dnaW5nXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gXCIuLi9jbGkvY29tbWFuZFwiO1xuaW1wb3J0IHsgQ29tbWFuZE9wdGlvbnMgfSBmcm9tIFwiLi4vY2xpL3R5cGVzXCI7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSBcIi4uL3V0aWxzL2h0dHBcIjtcblxuY29uc3QgbG9nZ2VyID0gTG9nZ2luZy5mb3IoXCJUZW1wbGF0ZSBTeW5jXCIpXG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gIHRlbXBsYXRlczogW1xuICAgIC4uLmZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcIi5naXRodWJcIiwgXCJJU1NVRV9URU1QTEFURVwiKSksXG4gICAgXCIuZ2l0aHViL0ZVTkRJTkcueW1sXCJcbiAgXSxcbiAgd29ya2Zsb3dzOiBmcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCIuZ2l0aHViXCIsIFwid29ya2Zsb3dzXCIpKSxcbiAgaWRlOiBmcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCIucnVuXCIpKSxcbiAgZG9jcyA6IFtcbiAgICAuLi5mcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJ3b3JrZG9jc1wiLCBcImxpY2VuY2VzXCIpKSxcbiAgICAuLi5mcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJ3b3JrZG9jc1wiLCBcInR1dG9yaWFsc1wiKSksXG4gIF0sXG4gIHN0eWxlczogW1xuICAgIFwiLnByZXR0aWVycmNcIixcbiAgICBcIi5lc2xpbnQuY29uZmlnLmpzXCIsXG4gIF0sXG4gIGxpY2VuY2VzOiBmcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJ3b3JrZG9jc1wiLCBcImxpY2Vuc2VzXCIpKSxcbiAgc2NyaXB0czogW1xuICBdXG59XG5cbmNvbnN0IG9wdHMgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoayA9PiAoe1xuICB0eXBlOiBcImJvb2xlYW5cIixcbiAgZGVmYXVsdDogdHJ1ZSxcbn0pKTtcblxuY2xhc3MgVGVtcGxhdGVTeW5jIGV4dGVuZHMgQ29tbWFuZDxDb21tYW5kT3B0aW9uczx0eXBlb2Ygb3B0cz4sIHZvaWQ+IHtcbiAgY29uc3RydWN0b3Iob3B0aW9uczogQ29tbWFuZE9wdGlvbnM8YW55Pikge1xuICAgIHN1cGVyKFwiVGVtcGxhdGVTeW5jXCIsIG9wdGlvbnMpO1xuICB9XG59XG5cbmNvbnN0IHNjcmlwdHMgPSBbXG5cblxuICBcIkxJQ0VOU0UubWRcIixcblxuICBcImJpbi90YWctcmVsZWFzZS5zaFwiLFxuICBcImJpbi90ZW1wbGF0ZV9zZXR1cC5zaFwiLFxuICBcImJpbi91cGRhdGUtc2NyaXB0cy5qc1wiLFxuICBcImJpbi91cGRhdGUtc2NyaXB0LmpzXCJcbl1cblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpe1xuICByZXR1cm4gUHJvbWlzZS5hbGxTZXR0bGVkKHNjcmlwdHMubWFwKGFzeW5jIHAgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx7cGF0aDogc3RyaW5nLCByZXN1bHQ6IHN0cmluZ30+KGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0ICBkYXRhID0gYXdhaXQgSHR0cENsaWVudC5kb3dubG9hZEZpbGUoYGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9kZWNhZi10cy90cy13b2tzcGFjZS9tYXN0ZXIvJHtwfWApXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KVxuICB9KSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgIGxvZ2dlci5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgc2NyaXB0czogJHtlcnJvcn1gKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGZldGNoaW5nIHNjcmlwdHM6ICR7ZXJyb3J9YCk7XG4gIH0pLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgcmVzdWx0cy5mb3JFYWNoKChwcm9tKSA9PiB7XG4gICAgICBpZihwcm9tLnN0YXR1cyA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgICAgICBjb25zdCB7IHBhdGgsIHJlc3VsdCB9ID0gcHJvbS52YWx1ZTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGgsIGNvbnRlbnQpO1xuICAgICAgICBsb2dnZXIudmVyYm9zZShgVXBkYXRlZCAke3BhdGh9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZGVidWcoYEZhaWxlZCB0byBkb3dubG9hZDogJHtwcm9tLnJlYXNvbn1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSkuY2F0Y2goKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgbG9nZ2VyLmVycm9yKGBFcnJvciBmZXRjaGluZyBzY3JpcHRzOiAke2Vycm9yfWApO1xuICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igb3ZlcndyaXRpbmcgZmlsZXM6ICR7ZXJyb3J9YCk7XG4gIH0pXG59XG5cbm1haW4oKVxuICAudGhlbigoKSA9PiBsb2dnZXIuaW5mbyhcIlNjcmlwdHMgYW5kIGNvbmZpZ3MgdXBkYXRlZFwiKSlcbiAgLmNhdGNoKGUgPT4ge1xuICAgIGxvZ2dlci5lcnJvcihgRXJyb3IgVXBkYXRpbmcgc2NyaXB0czogJHtlfWApO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfSk7XG4iXX0=
