import { ParseArgsOptionsConfig, VerbosityLogger } from "../utils/types";
import { TextUtils } from "../utils/text";
import { color } from "../utils/colors";

/**
 * @description Base Configuration for command-line arguments.
 * @summary Defines the accepted command-line options for the script.
 */
export const DefaultInputOptions: ParseArgsOptionsConfig = {
  verbose: {
    type: "boolean",
    short: "v",
    default: false
  },
  help: {
    type: "boolean",
    short: "m",
    default: false
  }
}
const reset = "\x1b[0m";
const colors = [
  "\x1b[38;5;215m", // soft orange
  "\x1b[38;5;209m", // coral
  "\x1b[38;5;205m", // pink
  "\x1b[38;5;210m", // peachy
  "\x1b[38;5;217m", // salmon
  "\x1b[38;5;216m", // light coral
  "\x1b[38;5;224m", // light peach
  "\x1b[38;5;230m"  // soft cream
];

export function printBanner(logger?: VerbosityLogger){
  const message = ``;
  const banner: string | string[] =
`#
#  ░▒▓███████▓▒░  ░▒▓████████▓▒░  ░▒▓██████▓▒░   ░▒▓██████▓▒░  ░▒▓████████▓▒░             ░▒▓████████▓▒░  ░▒▓███████▓▒░ 
#  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                       ░▒▓█▓▒░     ░▒▓█▓▒░        
#  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                       ░▒▓█▓▒░     ░▒▓█▓▒░        
#  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓██████▓▒░   ░▒▓█▓▒░        ░▒▓████████▓▒░ ░▒▓██████▓▒░                  ░▒▓█▓▒░      ░▒▓██████▓▒░  
#  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                       ░▒▓█▓▒░            ░▒▓█▓▒░ 
#  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                       ░▒▓█▓▒░            ░▒▓█▓▒░ 
#  ░▒▓███████▓▒░  ░▒▓████████▓▒░  ░▒▓██████▓▒░  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                       ░▒▓█▓▒░     ░▒▓███████▓▒░  
#                                                                                                                       
`.split("\n")
  const maxLength = banner.reduce((max, line) => Math.max(max, line.length), 0);
  banner.push(TextUtils.padEnd(` #  ${message}`, maxLength));
  banner.forEach((line, index) => {
    console.log(color(line).raw(colors[index]));
  })
}