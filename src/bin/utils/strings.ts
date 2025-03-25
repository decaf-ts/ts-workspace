import {
  BrightBackgroundColors,
  BrightForegroundColors,
  StandardBackgroundColors,
  StandardForegroundColors, styles,
} from "./constants";
import { clear, colorize256, colorizeANSI, colorizeRGB, raw, applyStyle } from "./colors";

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
 * @property {function} clear - Removes all styling from the text.
 * @property {function} raw - Applies raw ANSI codes to the text.
 * @property {function} foreground - Applies a foreground color using ANSI codes.
 * @property {function} background - Applies a background color using ANSI codes.
 * @property {function} style - Applies a text style using ANSI codes.
 * @property {function} color256 - Applies a 256-color foreground color.
 * @property {function} bgColor256 - Applies a 256-color background color.
 * @property {function} rgb - Applies an RGB foreground color.
 * @property {function} bgRgb - Applies an RGB background color.
 *
 * @memberOf module:@decaf-ts/utils
 */
export type ColorizeOptions = {[k in keyof typeof StandardForegroundColors]: StyledString}
  & {[k in keyof typeof BrightForegroundColors]: StyledString}
  & {[k in keyof typeof StandardBackgroundColors]: StyledString}
  & {[k in keyof typeof BrightBackgroundColors]: StyledString}
  & {[k in keyof typeof styles]: StyledString}
  & {
  clear: () => StyledString,
  raw: (raw: string) => StyledString,
  foreground: (n: number) => StyledString,
  background: (n: number) => StyledString,
  style: (n: number | keyof typeof styles) => StyledString,
  color256: (n: number) => StyledString,
  bgColor256: (n: number) => StyledString,
  rgb: (r: number, g: number, b: number) => StyledString,
  bgRgb: (r: number, g: number, b: number) => StyledString
}

/**
 * @description A string with additional colorization methods.
 * @summary Extends the native string type with ColorizeOptions, allowing for easy text styling.
 *
 * @typedef StyledString
 * @type {string & ColorizeOptions}
 *
 * @memberOf module:@decaf-ts/utils
 */
export type StyledString = string & ColorizeOptions;

/**
 * @description Applies styling to a given text string.
 * @summary This function takes a string and returns a StyledString object, which is an enhanced
 * version of the original string with additional methods for applying various ANSI color and style
 * options. It sets up a mapper object with methods for different styling operations and then
 * defines properties on the text string to make these methods accessible.
 *
 * @param {string} text - The input text to be styled.
 * @return {StyledString} A StyledString object with additional styling methods.
 *
 * @function style
 *
 * @memberOf module:@decaf-ts/utils
 */
export function style(text: string): StyledString {
  const mapper = {
    clear: () => {
      text = clear(text);
      return text as StyledString;
    },
    raw: (rawAnsi: string) => {
      text = raw(text, rawAnsi);
      return text as StyledString;
    },
    foreground: (n: number) => {
      text = colorizeANSI(text, n);
      return text as StyledString;
    },
    background: (n: number) => {
      text = colorizeANSI(text, n, true);
      return text as StyledString;
    },
    style: (n: number | keyof typeof styles) => {
      text = applyStyle(text, n);
      return text as StyledString;
    },
    // 256 colors
    color256: (n: number) => {
      text =  colorize256(text, n)
      return text as StyledString;
    },
    bgColor256: (n: number) => {
      text =  colorize256(text, n, true)
      return text as StyledString;
    },
    // RGB colors
    rgb: (r: number, g: number, b: number) => {
      text =  colorizeRGB(text, r, g, b)
      return text as StyledString;
    },
    bgRgb: (r: number, g: number, b: number) => {
      text =  colorizeRGB(text, r, g, b, true)
      return text as StyledString;
    }
  }

  // mapped methods
  Object.entries(mapper).forEach(([name, value]) => {
    Object.defineProperty(text, name, {
      value: value
    });
  });

  // Basic colors
  Object.entries(StandardForegroundColors).forEach(([name, code]) => {
    Object.defineProperty(text, name, {
      get: () => (text as StyledString).foreground(code)
    });
  });

  Object.entries(BrightForegroundColors).forEach(([name, code]) => {
    Object.defineProperty(text, name, {
      get: () => (text as StyledString).foreground(code)
    });
  });

  // Background colors
  Object.entries(StandardBackgroundColors).forEach(([name, code]) => {
    Object.defineProperty(text, name, {
      get: () => (text as StyledString).background(code)
    });
  });

  Object.entries(BrightBackgroundColors).forEach(([name, code]) => {
    Object.defineProperty(text, name, {
      get: () => (text as StyledString).background(code)
    });
  });

  // Styles
  Object.entries(styles).forEach(([name, code]) => {
    Object.defineProperty(text, name, {
      get: () => (text as StyledString).background(code)
    });
  });

  return text as StyledString;
}