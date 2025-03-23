import { Logging } from "./logging";

const logger = Logging.for("colorize");

/**
 * @description ANSI escape code for resetting text formatting.
 * @summary This constant holds the ANSI escape sequence used to reset all text formatting to default.
 * @const AnsiReset
 * @memberOf module:@decaf-ts/utils
 */
export const AnsiReset = '\x1b[0m';

/**
 * @description Standard foreground color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for standard foreground colors.
 * @const StandardForegroundColors
 * @property {number} black - ANSI code for black text (30).
 * @property {number} red - ANSI code for red text (31).
 * @property {number} green - ANSI code for green text (32).
 * @property {number} yellow - ANSI code for yellow text (33).
 * @property {number} blue - ANSI code for blue text (34).
 * @property {number} magenta - ANSI code for magenta text (35).
 * @property {number} cyan - ANSI code for cyan text (36).
 * @property {number} white - ANSI code for white text (37).
 * @memberOf module:@decaf-ts/utils
 */
export const StandardForegroundColors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
}

/**
 * @description Bright foreground color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for bright foreground colors.
 * @const BrightForegroundColors
 * @property {number} black - ANSI code for bright black text (90).
 * @property {number} red - ANSI code for bright red text (91).
 * @property {number} green - ANSI code for bright green text (92).
 * @property {number} yellow - ANSI code for bright yellow text (93).
 * @property {number} blue - ANSI code for bright blue text (94).
 * @property {number} magenta - ANSI code for bright magenta text (95).
 * @property {number} cyan - ANSI code for bright cyan text (96).
 * @property {number} white - ANSI code for bright white text (97).
 * @memberOf module:@decaf-ts/utils
 */
export const BrightForegroundColors = {
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
}

/**
 * @description Standard background color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for standard background colors.
 * @const StandardBackgroundColors
 * @property {number} bgBlack - ANSI code for black background (40).
 * @property {number} bgRed - ANSI code for red background (41).
 * @property {number} bgGreen - ANSI code for green background (42).
 * @property {number} bgYellow - ANSI code for yellow background (43).
 * @property {number} bgBlue - ANSI code for blue background (44).
 * @property {number} bgMagenta - ANSI code for magenta background (45).
 * @property {number} bgCyan - ANSI code for cyan background (46).
 * @property {number} bgWhite - ANSI code for white background (47).
 * @memberOf module:@decaf-ts/utils
 */
export const StandardBackgroundColors = {
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
}

/**
 * @description Bright background color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for bright background colors.
 * @const BrightBackgroundColors
 * @property {number} bgBrightBlack - ANSI code for bright black background (100).
 * @property {number} bgBrightRed - ANSI code for bright red background (101).
 * @property {number} bgBrightGreen - ANSI code for bright green background (102).
 * @property {number} bgBrightYellow - ANSI code for bright yellow background (103).
 * @property {number} bgBrightBlue - ANSI code for bright blue background (104).
 * @property {number} bgBrightMagenta - ANSI code for bright magenta background (105).
 * @property {number} bgBrightCyan - ANSI code for bright cyan background (106).
 * @property {number} bgBrightWhite - ANSI code for bright white background (107).
 * @memberOf module:@decaf-ts/utils
 */
export const BrightBackgroundColors = {
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107
}

/**
 * @description Text style codes for ANSI text formatting.
 * @summary This object maps style names to their corresponding ANSI codes for various text styles.
 * @const styles
 * @property {number} reset - ANSI code to reset all styles (0).
 * @property {number} bold - ANSI code for bold text (1).
 * @property {number} dim - ANSI code for dim text (2).
 * @property {number} italic - ANSI code for italic text (3).
 * @property {number} underline - ANSI code for underlined text (4).
 * @property {number} blink - ANSI code for blinking text (5).
 * @property {number} inverse - ANSI code for inverse colors (7).
 * @property {number} hidden - ANSI code for hidden text (8).
 * @property {number} strikethrough - ANSI code for strikethrough text (9).
 * @property {number} doubleUnderline - ANSI code for double underlined text (21).
 * @property {number} normalColor - ANSI code to reset color to normal (22).
 * @property {number} noItalicOrFraktur - ANSI code to turn off italic (23).
 * @property {number} noUnderline - ANSI code to turn off underline (24).
 * @property {number} noBlink - ANSI code to turn off blink (25).
 * @property {number} noInverse - ANSI code to turn off inverse (27).
 * @property {number} noHidden - ANSI code to turn off hidden (28).
 * @property {number} noStrikethrough - ANSI code to turn off strikethrough (29).
 * @memberOf module:@decaf-ts/utils
 */
export const styles = {
  reset: 0,
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  inverse: 7,
  hidden: 8,
  strikethrough: 9,
  doubleUnderline: 21,
  normalColor: 22,
  noItalicOrFraktur: 23,
  noUnderline: 24,
  noBlink: 25,
  noInverse: 27,
  noHidden: 28,
  noStrikethrough: 29,
}

/**
 * @description Options for text colorization using ANSI codes.
 * @summary This type defines the structure of the object returned by the colorize function.
 * It includes methods for applying various color and style options to text using ANSI escape codes.
 * 
 * @typedef ColorizeOptions
 *
 * @property {string} [key: StandardForegroundColors] - Getter for each standard foreground color.
 * @property {string} [key: BrightForegroundColors] - Getter for each bright foreground color.
 * @property {string} [key: StandardBackgroundColors] - Getter for each standard background color.
 * @property {string} [key: BrightBackgroundColors] - Getter for each bright background color.
 * @property {string} [key: styles] - Getter for each text style.
 * 
 * @property {function} color256 - Applies a 256-color foreground color.
 * @param {number} n - The color number (0-255).
 * @return {string} The colored text.
 * 
 * @property {function} bgColor256 - Applies a 256-color background color.
 * @param {number} n - The color number (0-255).
 * @return {string} The text with colored background.
 * 
 * @property {function} rgb - Applies an RGB foreground color.
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @return {string} The colored text.
 * 
 * @property {function} bgRgb - Applies an RGB background color.
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @return {string} The text with colored background.
 * 
 * @memberOf module:@decaf-ts/utils
 */
export type ColorizeOptions = {[k in keyof typeof StandardForegroundColors]: string}
  & {[k in keyof typeof BrightForegroundColors]: string}
  & {[k in keyof typeof StandardBackgroundColors]: string}
  & {[k in keyof typeof BrightBackgroundColors]: string}
  & {[k in keyof typeof styles]: string}
  & {
    clear: () => string,
    raw: (raw: string) => string,
    foreground: (n: number) => string,
    background: (n: number) => string,
    style: (n: number | keyof typeof styles) => string,
    color256: (n: number) => string,
    bgColor256: (n: number) => string,
    rgb: (r: number, g: number, b: number) => string,
    bgRgb: (r: number, g: number, b: number) => string
  }
  
  /**
   * @description Applies a basic ANSI color code to text.
   * @summary This function takes a string, an ANSI color code number, and an optional background flag.
   * It returns the text wrapped in the appropriate ANSI escape codes for either foreground or background coloring.
   * This function is used for basic 16-color ANSI formatting.
   * 
   * @param {string} text - The text to be colored.
   * @param {number} n - The ANSI color code number.
   * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
   * @return {string} The text wrapped in ANSI color codes.
   * 
   * @function colorizeANSI
   * @memberOf module:@decaf-ts/utils
   */
  export function colorizeANSI(text: string, n: number, bg = false) {
    if (isNaN(n)){
      logger.error(`Invalid color number on the ANSI scale: ${n}. ignoring...`);
      return text;
    }
    if (bg && (
          (n > 30 && n <= 40)
            || (n > 90 && n <= 100) )){
      n = n + 10
    }
    return `\x1b[${n}m${text}${AnsiReset}`;
  }


/**
 * @description Applies a 256-color ANSI code to text.
 * @summary This function takes a string and a color number (0-255) and returns the text
 * wrapped in ANSI escape codes for either foreground or background coloring.
 * 
 * @param {string} text - The text to be colored.
 * @param {number} n - The color number (0-255).
 * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
 * @return {string} The text wrapped in ANSI color codes.
 * 
 * @function colorize256
 * @memberOf module:@decaf-ts/utils
 */
export function colorize256(text: string, n: number, bg = false) {
  if (isNaN(n)){
    logger.error(`Invalid color number on the 256 scale: ${n}. ignoring...`);
    return text;
  }
  if (n < 0 || n > 255) {
    logger.error(`Invalid color number on the 256 scale: ${n}. ignoring...`);
    return text;
  }
  return `\x1b[${bg ? 48 : 38};5;${n}m${text}${AnsiReset}`;
}

/**
 * @description Applies an RGB color ANSI code to text.
 * @summary This function takes a string and RGB color values (0-255 for each component)
 * and returns the text wrapped in ANSI escape codes for either foreground or background coloring.
 * 
 * @param {string} text - The text to be colored.
 * @param {number} r - The red component of the color (0-255).
 * @param {number} g - The green component of the color (0-255).
 * @param {number} b - The blue component of the color (0-255).
 * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
 * @return {string} The text wrapped in ANSI color codes.
 * 
 * @function colorizeRGB
 * @memberOf module:@decaf-ts/utils
 */
export function colorizeRGB(text: string, r: number, g: number, b: number, bg = false) {
  if (isNaN(r) || isNaN(g) || isNaN(b)){
    logger.error(`Invalid RGB color values: r=${r}, g=${g}, b=${b}. Ignoring...`);
    return text;
  }
  if ([r, g, b].some(v => v < 0 || v > 255)) {
    logger.error(`Invalid RGB color values: r=${r}, g=${g}, b=${b}. Ignoring...`);
    return text;
  }
  return `\x1b[${bg ? 48 : 38};2;${r};${g};${b}m${text}${AnsiReset}`;
}

/**
 * @description Applies an ANSI style code to text.
 * @summary This function takes a string and a style code (either a number or a key from the styles object)
 * and returns the text wrapped in the appropriate ANSI escape codes for that style.
 * 
 * @param {string} text - The text to be styled.
 * @param {number | keyof typeof styles} n - The style code or style name.
 * @return {string} The text wrapped in ANSI style codes.
 * 
 * @function style
 * @memberOf module:@decaf-ts/utils
 */
export function style(text: string, n: number | keyof typeof styles) {
  const styleCode = typeof n === 'number'? n : styles[n];
  return `\x1b[${styleCode}m${text}${AnsiReset}`;
}

/**
 * @description Removes all ANSI formatting codes from text.
 * @summary This function takes a string that may contain ANSI escape codes for formatting
 * and returns a new string with all such codes removed, leaving only the plain text content.
 * It uses a regular expression to match and remove ANSI escape sequences.
 *
 * @param {string} text - The text potentially containing ANSI formatting codes.
 * @return {string} The input text with all ANSI formatting codes removed.
 *
 * @function clear
 * @memberOf module:@decaf-ts/utils
 */
export function clear(text: string): string {
  // Regular expression to match ANSI escape codes
  const ansiRegex = /\x1B\[[0-9;]*[JKmsu]/g;
  return text.replace(ansiRegex, '');
}

/**
 * @description Applies raw ANSI escape codes to text.
 * @summary This function takes a string and a raw ANSI escape code, and returns the text
 * wrapped in the provided raw ANSI code and the reset code. This allows for applying custom
 * or complex ANSI formatting that may not be covered by other utility functions.
 *
 * @param {string} text - The text to be formatted.
 * @param {string} raw - The raw ANSI escape code to be applied.
 * @return {string} The text wrapped in the raw ANSI code and the reset code.
 *
 * @function raw
 * @memberOf module:@decaf-ts/utils
 */
export function raw(text: string, raw: string): string {
  return `${raw}${text}${AnsiReset}`;
}

/**
 * @description Applies ANSI color codes to text.
 * @summary This function takes any number of arguments and returns an object with getters
 * to apply various color and background color ANSI codes to the joined string of arguments.
 * It supports 16 basic colors, 256 colors, and RGB colors for both foreground and background.
 * The color strings are calculated only when accessed, improving performance for large sets of unused colors.
 *
 * @param {...unknown} args - The arguments to be joined and colored.
 * @return {ColorizeOptions} An object with getters for each color type and style.
 * 
 * @function color
 * 
 * @memberOf module:@decaf-ts/utils
 */
export function color(...args: unknown[]): ColorizeOptions {
  const text = args.join(' ');
  
  const result = {
    clear: () => clear(String(text)),
    raw: (rawAnsi: string) => raw(text, rawAnsi),
    foreground: (n: number) => colorizeANSI(text, n),
    background: (n: number) => colorizeANSI(text, n, true),
    style: (n: number | keyof typeof styles) => style(text, n),
    // 256 colors
    color256: (n: number) => colorize256(text, n),
    bgColor256: (n: number) => colorize256(text, n, true),
    // RGB colors
    rgb: (r: number, g: number, b: number) => colorizeRGB(text, r, g, b),
    bgRgb: (r: number, g: number, b: number) => colorizeRGB(text, r, g, b, true)
  } as ColorizeOptions;

  // Basic colors
  Object.entries(StandardForegroundColors).forEach(([name, code]) => {
    Object.defineProperty(result, name, {
      get: () => result.foreground(code)
    });
  });

  Object.entries(BrightForegroundColors).forEach(([name, code]) => {
    Object.defineProperty(result, name, {
      get: () => result.foreground(code)
    });
  });

  // Background colors
  Object.entries(StandardBackgroundColors).forEach(([name, code]) => {
    Object.defineProperty(result, name, {
      get: () => result.background(code)
    });
  });

  Object.entries(BrightBackgroundColors).forEach(([name, code]) => {
    Object.defineProperty(result, name, {
      get: () => result.background(code)
    });
  });

  // Styles
  Object.entries(styles).forEach(([name, code]) => {
    Object.defineProperty(result, name, {
      get: () => result.background(code)
    });
  });

  return result;
}

