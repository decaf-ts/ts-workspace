import { StandardOutputWriter } from "../writers/StandardOutputWriter";
import { ChildProcessWithoutNullStreams } from "child_process";
import {
  BrightBackgroundColors,
  BrightForegroundColors,
  LogLevel,
  StandardBackgroundColors,
  StandardForegroundColors, styles,
} from "./constants";

/**
 * @description Represents the type of output stream.
 * @summary A union type for standard output and standard error streams.
 * @typedef {("stdout" | "stderr")} OutputType
 * @memberOf module:@decaf-ts/utils
 */
export type OutputType = "stdout" | "stderr";

/**
 * @description Constructor type for output writers.
 * @summary Defines the structure for creating new output writer instances. This type represents
 * a constructor function that takes a PromiseExecutor and additional arguments to create
 * a new instance of an output writer. It allows for flexible creation of different types
 * of output writers while maintaining a consistent interface.
 *
 * @template R - The type of the resolved value, defaulting to string.
 * @template C - The type of the output writer, extending StandardOutputWriter<R>.
 * @template E - The type of the error value, defaulting to number.
 *
 * @typedef {new(lock: PromiseExecutor<R, E>, ...args: unknown[]) => C} OutputWriterConstructor
 *
 * @param {PromiseExecutor<R, E>} lock - The promise executor for managing asynchronous operations.
 * @param {...unknown[]} args - Additional arguments passed to the constructor.
 * @return {C} An instance of the output writer.
 *
 * @memberOf module:@decaf-ts/utils
 */
export type OutputWriterConstructor<R = string, C extends StandardOutputWriter<R> = StandardOutputWriter<R>, E = number> = {new(lock: PromiseExecutor<R, E>, ...args: unknown[]): C};

/**
 * @description Defines the structure for promise resolution and rejection.
 * @summary Provides methods to resolve or reject a promise.
 * @template R - The type of the resolved value.
 * @template E - The type of the error value, defaulting to Error.
 * @typedef {Object} PromiseExecutor
 * @property {function(value: R | PromiseLike<R>): void} resolve - Function to resolve the promise.
 * @property {function(error: E): void} reject - Function to reject the promise.
 * @memberOf module:@decaf-ts/utils
 */
export interface PromiseExecutor<R, E = Error> {
  resolve: (value: R | PromiseLike<R>) => void,
  reject: (error: E) => void
}

/**
 * @description Represents the result of a command execution.
 * @summary Extends Promise with additional properties related to the command execution.
 * This interface provides a comprehensive way to handle and interact with the results
 * of an asynchronous command execution, including access to the command details,
 * output logs, and the ability to abort the execution.
 *
 * @template R - The type of the resolved value, defaulting to void.
 * @interface CommandResult
 * @extends Promise<R>
 * @memberOf module:@decaf-ts/utils
 */
export interface CommandResult<R = void> extends Promise<R> {
  /**
   * @description Controller to abort the command execution.
   * @summary Provides a mechanism to cancel the ongoing command execution.
   */
  abort: AbortController;

  /**
   * @description The executed command string.
   * @summary Contains the actual command that was executed.
   */
  command: string;

  /**
   * @description The child process object.
   * @summary Represents the Node.js child process that was spawned to execute the command.
   */
  cmd: ChildProcessWithoutNullStreams;

  /**
   * @description Array of stdout logs.
   * @summary Contains all the standard output messages produced during the command execution.
   */
  logs: string[];

  /**
   * @description Array of stderr logs.
   * @summary Contains all the standard error messages produced during the command execution.
   */
  errs: string[];
}

/**
 * @description Configuration for a single command-line argument option.
 * @summary Defines the structure and behavior of a command-line option.
 * @interface ParseArgsOptionConfig
 * @property {("string" | "boolean")} type - The data type of the option.
 * @property {boolean} [multiple] - Whether the option can be specified multiple times.
 * @property {string} [short] - The short (single-character) alias for the option.
 * @property {string | boolean | string[] | boolean[]} [default] - The default value(s) for the option.
 * @memberOf module:@decaf-ts/utils
 */
export interface ParseArgsOptionConfig {
  type: "string" | "boolean";
  multiple?: boolean | undefined;
  short?: string | undefined;
  default?: string | boolean | string[] | boolean[] | undefined;
}

/**
 * @description Configuration for all command-line argument options.
 * @summary A mapping of long option names to their configurations.
 * @interface ParseArgsOptionsConfig
 * @memberOf module:@decaf-ts/utils
 */
export interface ParseArgsOptionsConfig {
  [longOption: string]: ParseArgsOptionConfig;
}

/**
 * @description Represents a parsed command-line option token.
 * @summary Can be either an option with a value or an option without a value.
 * @typedef {Object} OptionToken
 * @memberOf module:@decaf-ts/utils
 */
export type OptionToken =
  | { kind: "option"; index: number; name: string; rawName: string; value: string; inlineValue: boolean }
  | { kind: "option"; index: number; name: string; rawName: string; value: undefined; inlineValue: undefined };

/**
 * @description Represents a parsed command-line token.
 * @summary Can be an option, a positional argument, or an option terminator.
 * @typedef {OptionToken | Object} Token
 * @memberOf module:@decaf-ts/utils
 */
export type Token =
  | OptionToken
  | { kind: "positional"; index: number; value: string }
  | { kind: "option-terminator"; index: number };

/**
 * @description The result of parsing command-line arguments.
 * @summary Contains parsed values, positional arguments, and optionally the parsed tokens.
 * @typedef {Object} ParseArgsResult
 * @property {Object.<string, string | boolean | (string | boolean)[] | undefined>} values - Parsed option values.
 * @property {string[]} positionals - Positional arguments.
 * @property {Token[]} [tokens] - Parsed tokens (if requested).
 * @memberOf module:@decaf-ts/utils
 */
export type ParseArgsResult = {values: {[p: string]: string | boolean | (string | boolean)[] | undefined}, positionals: string[], tokens?: Token[]};

/**
 * @description Interface for a logger with verbosity levels.
 * @summary Defines methods for logging at different verbosity levels.
 * @interface VerbosityLogger
 * @memberOf module:@decaf-ts/utils
 */
export interface VerbosityLogger {
  /**
   * @description Logs a `way too verbose` or a silly message.
   * @param {string} msg - The message to log.
   */
  silly(msg: string): void;
/**
   * @description Logs a verbose message.
   * @param {string} msg - The message to log.
   * @param {number} verbosity - The verbosity level of the message.
   */
  verbose(msg: string, verbosity?: number): void;

  /**
   * @description Logs an info message.
   * @param {string} msg - The message to log.
   */
  info(msg: string): void;

  /**
   * @description Logs an error message.
   * @param {string} msg - The message to log.
   */
  error(msg: string | Error): void;

  /**
   * @description Logs a debug message.
   * @param {string} msg - The message to log.
   */
  debug(msg: string): void;
  for(method?: string | Function): VerbosityLogger
}

/**
 * @description Configuration for logging.
 * @summary Defines the log level and verbosity for logging.
 * @typedef {Object} LoggingConfig
 * @property {LogLevel} level - The logging level.
 * @property {number} verbose - The verbosity level.
 * @memberOf module:@decaf-ts/utils
 */
export type LoggingConfig = {
  level: LogLevel,
  verbose: number
  style?: boolean,
  timestamp?: boolean,
  timestampFormat?: string,
  context?: boolean,
  theme?: Theme
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
/**
 * @description Represents a theme option for console output styling.
 * @summary Defines the structure for styling a specific element in the console output.
 * It allows for customization of foreground color, background color, and additional styles.
 * Colors can be specified as a single number, an RGB array, or left undefined for default.
 *
 * @interface ThemeOption
 * @memberOf module:@decaf-ts/utils
 */
export interface ThemeOption {
  /**
   * @description The foreground color code for the styled element.
   * @summary Can be a single number for predefined colors, an RGB array, or undefined for default color.
   */
  fg?: number | [number] | [number, number, number];

  /**
   * @description The background color code for the styled element.
   * @summary Can be a single number for predefined colors, an RGB array, or undefined for default color.
   */
  bg?: number | [number] | [number, number, number];

  /**
   * @description An array of style codes to apply to the element.
   * @summary These codes represent additional styling options such as bold, italic, etc.
   * Undefined means no additional styles are applied.
   */
  style?: number[] | [keyof typeof styles];
}

export type ThemeOptionByLogLevel = Partial<Record<LogLevel, ThemeOption>>;

/**
/**
 * @description Defines the color theme for console output.
 * @summary This interface specifies the color scheme for various elements of console output,
 * including styling for different log levels and components. It uses ThemeOption to
 * define the styling for each element, allowing for customization of colors and styles
 * for different parts of the log output.
 *
 * @interface Theme
 * @memberOf module:@decaf-ts/utils
 */
export interface Theme {
  /**
   * @description Styling for class names in the output.
   */
  class: ThemeOption | ThemeOptionByLogLevel,

  /**
   * @description Styling for timestamps in the output.
   */
  timestamp: ThemeOption | ThemeOptionByLogLevel,

  /**
   * @description Styling for the main message text in the output.
   */
  message: ThemeOption | ThemeOptionByLogLevel,

  /**
   * @description Styling for method names in the output.
   */
  method: ThemeOption | ThemeOptionByLogLevel,

  /**
   * @description Styling for identifier elements in the output.
   */
  id: ThemeOption | ThemeOptionByLogLevel,
  
  /**
   * @description Styling for identifier elements in the output.
   */
  stack: ThemeOption,

  /**
   * @description Styling for different log levels in the output.
   */
  logLevel: ThemeOptionByLogLevel
}

/**
 * @description Represents a color function in the Kleur library.
 * @summary The Color interface defines a function that can be called with or without arguments
 * to apply color styling to text or chain multiple color operations.
 *
 * @interface Color
 * @memberOf module:@decaf-ts/input
 */
export interface Color {
  /**
   * @description Applies the color to the given text.
   * @param {string | number} x - The text or number to be colored.
   * @return {string} The colored text.
   */
  (x: string | number): string;

  /**
   * @description Allows chaining of multiple color operations.
   * @return {Kleur} The Kleur instance for method chaining.
   */
  (): Kleur;
}

/**
 * @description Represents the main Kleur interface with all available color and style methods.
 * @summary The Kleur interface provides methods for applying various colors, background colors,
 * and text styles to strings in terminal output.
 *
 * @interface Kleur
 * @memberOf module:@decaf-ts/input
 */
export interface Kleur {
  // Colors
  /** @description Applies black color to the text. */
  black: Color;
  /** @description Applies red color to the text. */
  red: Color;
  /** @description Applies green color to the text. */
  green: Color;
  /** @description Applies yellow color to the text. */
  yellow: Color;
  /** @description Applies blue color to the text. */
  blue: Color;
  /** @description Applies magenta color to the text. */
  magenta: Color;
  /** @description Applies cyan color to the text. */
  cyan: Color;
  /** @description Applies white color to the text. */
  white: Color;
  /** @description Applies gray color to the text. */
  gray: Color;
  /** @description Alias for gray color. */
  grey: Color;

  // Backgrounds
  /** @description Applies black background to the text. */
  bgBlack: Color;
  /** @description Applies red background to the text. */
  bgRed: Color;
  /** @description Applies green background to the text. */
  bgGreen: Color;
  /** @description Applies yellow background to the text. */
  bgYellow: Color;
  /** @description Applies blue background to the text. */
  bgBlue: Color;
  /** @description Applies magenta background to the text. */
  bgMagenta: Color;
  /** @description Applies cyan background to the text. */
  bgCyan: Color;
  /** @description Applies white background to the text. */
  bgWhite: Color;

  // Modifiers
  /** @description Resets all applied styles. */
  reset: Color;
  /** @description Applies bold style to the text. */
  bold: Color;
  /** @description Applies dim (decreased intensity) style to the text. */
  dim: Color;
  /** @description Applies italic style to the text. */
  italic: Color;
  /** @description Applies underline style to the text. */
  underline: Color;
  /** @description Inverts the foreground and background colors. */
  inverse: Color;
  /** @description Hides the text (same color as background). */
  hidden: Color;
  /** @description Applies strikethrough style to the text. */
  strikethrough: Color;
}
