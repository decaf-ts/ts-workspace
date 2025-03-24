import { LoggingConfig, Theme, ThemeOptionByLogLevel } from "./types";

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
 * @description Default encoding for text operations.
 * @summary The standard UTF-8 encoding used for text processing.
 * @const {string} Encoding
 * @memberOf module:@decaf-ts/utils
 */
export const Encoding = "utf-8";

/**
 * @description Regular expression for semantic versioning.
 * @summary A regex pattern to match and parse semantic version strings.
 * @const {RegExp} SemVersionRegex
 * @memberOf module:@decaf-ts/utils
 */
export const SemVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z])))/g

/**
 * @description Enum for semantic version components.
 * @summary Defines the three levels of semantic versioning: PATCH, MINOR, and MAJOR.
 * @enum {string}
 * @memberOf module:@decaf-ts/utils
 */
export enum SemVersion {
  /** Patch version for backwards-compatible bug fixes. */
  PATCH = "patch",
  /** Minor version for backwards-compatible new features. */
  MINOR = "minor",
  /** Major version for changes that break backwards compatibility. */
  MAJOR = "major",
}

/**
 * @description Flag to indicate non-CI environment.
 * @summary Used to specify that a command should run outside of a Continuous Integration environment.
 * @const {string} NoCIFLag
 * @memberOf module:@decaf-ts/utils
 */
export const NoCIFLag = "-no-ci";

/**
 * @description Key for the setup script in package.json.
 * @summary Identifies the script that runs after package installation.
 * @const {string} SetupScriptKey
 * @memberOf module:@decaf-ts/utils
 */
export const SetupScriptKey = "postinstall";

/**
 * @description Enum for various authentication tokens.
 * @summary Defines the file names for storing different types of authentication tokens.
 * @enum {string}
 * @memberOf module:@decaf-ts/utils
 */
export enum Tokens {
  /** Git authentication token file name. */
  GIT = ".token",
  /** NPM authentication token file name. */
  NPM = ".npmtoken",
  /** Docker authentication token file name. */
  DOCKER = ".dockertoken"
}

/**
 * @description Enum for log levels.
 * @summary Defines different levels of logging for the application.
 * @enum {string}
 * @memberOf module:@decaf-ts/utils
 */
export enum LogLevel {
  /** Error events that are likely to cause problems. */
  error = "error",
  /** Routine information, such as ongoing status or performance. */
  info = "info",
  /** Additional relevant information. */
  verbose = "verbose",
  /** Debug or trace information. */
  debug = "debug",
  /** way too verbose or silly information. */
  silly = "silly",
}

/**
 * @description Numeric values associated with log levels.
 * @summary Provides a numeric representation of log levels for comparison and filtering.
 * @const {Object} NumericLogLevels
 * @property {number} error - Numeric value for error level (0).
 * @property {number} info - Numeric value for info level (2).
 * @property {number} verbose - Numeric value for verbose level (4).
 * @property {number} debug - Numeric value for debug level (5).
 * @property {number} silly - Numeric value for silly level (8).
 * @memberOf module:@decaf-ts/utils
 */
export const NumericLogLevels = {
  error: 0,
  info: 2,
  verbose: 4,
  debug: 5,
  silly: 8,
};

export const DefaultTheme: Theme = {
  class: {
    fg: 4
  },
  id: {
    fg: 36
  },
  stack: {},
  timestamp: {},
  message: {
    error: {
      fg: 34
    }
  },
  method: {},
  logLevel: {
    error: {
      fg: 6
    },
    info: {},
    verbose: {},
    debug: {
      fg: 7
    },
  }
}

export const DefaultLoggingConfig: LoggingConfig = {
  verbose: 0,
  level: LogLevel.info,
  style: false,
  timestamp: true,
  timestampFormat: "HH:mm:ss.SSS",
  context: true,
  theme: DefaultTheme,
}