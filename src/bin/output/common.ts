import { VerbosityLogger } from "./types";
import { padEnd } from "../utils/text";
import slogans from "../../../workdocs/assets/slogans.json";
import { style } from "../utils/strings";

const colors = [
  "\x1b[38;5;215m", // soft orange
  "\x1b[38;5;209m", // coral
  "\x1b[38;5;205m", // pink
  "\x1b[38;5;210m", // peachy
  "\x1b[38;5;217m", // salmon
  "\x1b[38;5;216m", // light coral
  "\x1b[38;5;224m", // light peach
  "\x1b[38;5;230m", // soft cream
  "\x1b[38;5;230m"  // soft cream
];

export function printBanner(logger?: VerbosityLogger){
  const message = getSlogan();
  const banner: string | string[] =`
#                 ░▒▓███████▓▒░  ░▒▓████████▓▒░  ░▒▓██████▓▒░   ░▒▓██████▓▒░  ░▒▓████████▓▒░       ░▒▓████████▓▒░  ░▒▓███████▓▒░ 
#      ( (        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                 ░▒▓█▓▒░     ░▒▓█▓▒░        
#       ) )       ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                 ░▒▓█▓▒░     ░▒▓█▓▒░        
#    [=======]    ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓██████▓▒░   ░▒▓█▓▒░        ░▒▓████████▓▒░ ░▒▓██████▓▒░            ░▒▓█▓▒░      ░▒▓██████▓▒░  
#     \`-----´     ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                 ░▒▓█▓▒░            ░▒▓█▓▒░ 
#                 ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                 ░▒▓█▓▒░            ░▒▓█▓▒░ 
#                 ░▒▓███████▓▒░  ░▒▓████████▓▒░  ░▒▓██████▓▒░  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░                 ░▒▓█▓▒░     ░▒▓███████▓▒░  
#                                                                                                                 
`.split("\n")
  const maxLength = banner.reduce((max, line) => Math.max(max, line.length), 0);
  banner.push(padEnd(` #  ${message}`, maxLength));
  banner.forEach((line, index) => {
    console.log(style(line).raw(colors[index]));
  })
}



export function getSlogan(i?: number): string {
  try {
    i = typeof i === "undefined" ? Math.floor(Math.random() * slogans.length) : i;
    return slogans[i].Slogan;
  }  catch (error) {
    throw new Error("Failed to retrieve package information");
  }
}