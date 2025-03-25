"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../utils/constants.cjs");
const fs_2 = require("../utils/fs.cjs");
const command_1 = require("../cli/command.cjs");
class TemplateSetupScript extends command_1.Command {
    constructor(options) {
        super("TemplateSetupScript", options);
    }
    async fixPackage() {
        try {
            const pkg = JSON.parse(fs_1.default.readFileSync("package.json", constants_1.Encoding));
            delete pkg[constants_1.SetupScriptKey];
            fs_1.default.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
        }
        catch (e) {
            throw new Error(`Error fixing package.json: ${e}`);
        }
    }
    async createTokenFiles() {
        const log = this.log.for(this.createTokenFiles);
        Object.values(constants_1.Tokens).forEach((token) => {
            try {
                let status;
                try {
                    status = fs_1.default.existsSync(token);
                }
                catch (e) {
                    log.info(`Token file ${token} not found. Creating a new one...`);
                    fs_1.default.writeFileSync(token, "");
                    return;
                }
                if (!status) {
                    fs_1.default.writeFileSync(token, "");
                }
            }
            catch (e) {
                throw new Error(`Error creating token file ${token}: ${e}`);
            }
        });
    }
}
new TemplateSetupScript({}).run(async (cmd) => {
    await cmd.fixPackage();
    await cmd.createTokenFiles();
    await (0, fs_2.updateDependencies)();
    await (0, fs_2.auditFix)();
    await (0, fs_2.pushToGit)();
}).then(() => TemplateSetupScript.log.info("Template updated successfully"))
    .catch((e) => {
    TemplateSetupScript.log.error(`Error preparing template: ${e}`);
    process.exit(1);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iaW4vYmluL3RlbXBsYXRlLXNldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGtEQUFzRTtBQUN0RSxvQ0FBc0U7QUFDdEUsNENBQXlDO0FBR3pDLE1BQU0sbUJBQW9CLFNBQVEsaUJBQW1DO0lBQ25FLFlBQVksT0FBNEI7UUFDdEMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVTtRQUNkLElBQUksQ0FBQztZQUNILE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsb0JBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEUsT0FBTyxHQUFHLENBQUMsMEJBQWMsQ0FBQyxDQUFDO1lBQzNCLFlBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFBQyxPQUFPLENBQVUsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQztnQkFDSCxJQUFJLE1BQU0sQ0FBQztnQkFDWCxJQUFJLENBQUM7b0JBQ0gsTUFBTSxHQUFHLFlBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztvQkFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssbUNBQW1DLENBQUMsQ0FBQztvQkFDakUsWUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzVCLE9BQU87Z0JBQ1QsQ0FBQztnQkFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ1osWUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7WUFDSCxDQUFDO1lBQUMsT0FBTyxDQUFVLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUVGO0FBRUQsSUFBSSxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQXdCLEVBQUMsRUFBRTtJQUNoRSxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN2QixNQUFNLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzdCLE1BQU0sSUFBQSx1QkFBa0IsR0FBRSxDQUFDO0lBQzNCLE1BQU0sSUFBQSxhQUFRLEdBQUUsQ0FBQztJQUNqQixNQUFNLElBQUEsY0FBUyxHQUFFLENBQUM7QUFDcEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztLQUN6RSxLQUFLLENBQUMsQ0FBQyxDQUFVLEVBQUUsRUFBRTtJQUNwQixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiYmluL2Jpbi90ZW1wbGF0ZS1zZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IEVuY29kaW5nLCBTZXR1cFNjcmlwdEtleSwgVG9rZW5zIH0gZnJvbSBcIi4uL3V0aWxzL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgYXVkaXRGaXgsIHB1c2hUb0dpdCwgdXBkYXRlRGVwZW5kZW5jaWVzIH0gZnJvbSBcIi4uL3V0aWxzL2ZzXCI7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcIi4uL2NsaS9jb21tYW5kXCI7XG5pbXBvcnQgeyBDb21tYW5kT3B0aW9ucyB9IGZyb20gXCIuLi9jbGkvdHlwZXNcIjtcblxuY2xhc3MgVGVtcGxhdGVTZXR1cFNjcmlwdCBleHRlbmRzIENvbW1hbmQ8Q29tbWFuZE9wdGlvbnM8dm9pZD4sIHZvaWQ+e1xuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBDb21tYW5kT3B0aW9uczxhbnk+KSB7XG4gICAgc3VwZXIoXCJUZW1wbGF0ZVNldHVwU2NyaXB0XCIsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZml4UGFja2FnZSgpe1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhcInBhY2thZ2UuanNvblwiLCBFbmNvZGluZykpO1xuICAgICAgZGVsZXRlIHBrZ1tTZXR1cFNjcmlwdEtleV07XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKFwicGFja2FnZS5qc29uXCIsIEpTT04uc3RyaW5naWZ5KHBrZywgbnVsbCwgMikpO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgZml4aW5nIHBhY2thZ2UuanNvbjogJHtlfWApO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVRva2VuRmlsZXMoKXtcbiAgICBjb25zdCBsb2cgPSB0aGlzLmxvZy5mb3IodGhpcy5jcmVhdGVUb2tlbkZpbGVzKTtcbiAgICBPYmplY3QudmFsdWVzKFRva2VucykuZm9yRWFjaCgodG9rZW4pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzdGF0dXM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc3RhdHVzID0gZnMuZXhpc3RzU3luYyh0b2tlbik7XG4gICAgICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgICAgICBsb2cuaW5mbyhgVG9rZW4gZmlsZSAke3Rva2VufSBub3QgZm91bmQuIENyZWF0aW5nIGEgbmV3IG9uZS4uLmApO1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmModG9rZW4sIFwiXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN0YXR1cykge1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmModG9rZW4sIFwiXCIpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgY3JlYXRpbmcgdG9rZW4gZmlsZSAke3Rva2VufTogJHtlfWApO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxufVxuXG5uZXcgVGVtcGxhdGVTZXR1cFNjcmlwdCh7fSkucnVuKGFzeW5jIChjbWQ6IFRlbXBsYXRlU2V0dXBTY3JpcHQpPT4ge1xuICBhd2FpdCBjbWQuZml4UGFja2FnZSgpO1xuICBhd2FpdCBjbWQuY3JlYXRlVG9rZW5GaWxlcygpO1xuICBhd2FpdCB1cGRhdGVEZXBlbmRlbmNpZXMoKTtcbiAgYXdhaXQgYXVkaXRGaXgoKTtcbiAgYXdhaXQgcHVzaFRvR2l0KCk7XG59KS50aGVuKCgpID0+IFRlbXBsYXRlU2V0dXBTY3JpcHQubG9nLmluZm8oXCJUZW1wbGF0ZSB1cGRhdGVkIHN1Y2Nlc3NmdWxseVwiKSlcbiAgLmNhdGNoKChlOiB1bmtub3duKSA9PiB7XG4gICAgVGVtcGxhdGVTZXR1cFNjcmlwdC5sb2cuZXJyb3IoYEVycm9yIHByZXBhcmluZyB0ZW1wbGF0ZTogJHtlfWApO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfSk7Il19
