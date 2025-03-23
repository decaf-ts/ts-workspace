import { StandardOutputWriter } from "../writers/StandardOutputWriter";
import { ChildProcessWithoutNullStreams } from "child_process";
import { LogLevel } from "./constants";

/**
 * @description Represents the type of output stream.
 * @summary A union type for standard output and standard error streams.
 * @typedef {("stdout" | "stderr")} OutputType
 * @memberOf module:@decaf-ts/utils
 */
export type OutputType = "stdout" | "stderr";

/**
 * @description Constructor type for output writers.
 * @summary Defines the structure for creating new output writer instances.
 * @template R - The type of the resolved value, defaulting to number.
 * @template C - The type of the output writer, extending StandardOutputWriter<R>.
 * @template E - The type of the error value, defaulting to number.
 * @typedef {new(lock: PromiseExecutor<R, E>, ...args: unknown[]) => C} OutputWriterConstructor
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
export type PromiseExecutor<R, E = Error> = {
  resolve: (value: R | PromiseLike<R>) => void,
  reject: (error: E) => void
}

/**
 * @description Represents the result of a command execution.
 * @summary Extends Promise with additional properties related to the command execution.
 * @template R - The type of the resolved value, defaulting to void.
 * @typedef {Promise<R> & Object} CommandResult
 * @property {AbortController} abort - Controller to abort the command execution.
 * @property {string} command - The executed command string.
 * @property {ChildProcessWithoutNullStreams} cmd - The child process object.
 * @property {string[]} logs - Array of stdout logs.
 * @property {string[]} errs - Array of stderr logs.
 * @memberOf module:@decaf-ts/utils
 */
export type CommandResult<R = void> = Promise<R> & {
  abort: AbortController,
  command: string,
  cmd: ChildProcessWithoutNullStreams,
  logs: string[],
  errs: string[]
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
  error(msg: string): void;

  /**
   * @description Logs a debug message.
   * @param {string} msg - The message to log.
   */
  debug(msg: string): void;
}

/**
 * @description Configuration for logging.
 * @summary Defines the log level and verbosity for logging.
 * @typedef {Object} LoggingConfig
 * @property {LogLevel} level - The logging level.
 * @property {number} verbosity - The verbosity level.
 * @memberOf module:@decaf-ts/utils
 */
export type LoggingConfig = {
  level: LogLevel,
  verbosity: number
}


/**
 * @description Defines the color theme for console output.
 * @summary This type specifies the color scheme for various elements of console output,
 * including foreground and background colors for different log levels and components.
 * Colors are represented by numbers corresponding to ANSI color codes, or undefined for default color.
 *
 * @typedef {Object} Theme
 * @property {Object} FOREGROUND - Foreground color settings.
 * @property {number|undefined} FOREGROUND.CLASS - Color for class names.
 * @property {number|undefined} FOREGROUND.TIMESTAMP - Color for timestamps.
 * @property {Object} FOREGROUND.LEVEL - Colors for different log levels.
 * @property {number|undefined} FOREGROUND.LEVEL.ERROR - Color for error level messages.
 * @property {undefined} FOREGROUND.LEVEL.INFO - Color for info level messages (default).
 * @property {undefined} FOREGROUND.LEVEL.VERBOSE - Color for verbose level messages (default).
 * @property {number|undefined} FOREGROUND.LEVEL.DEBUG - Color for debug level messages.
 * @property {undefined} FOREGROUND.MESSAGE - Color for the main message text (default).
 * @property {number|undefined} FOREGROUND.METHOD - Color for method names.
 *
 * @property {Object} BACKGROUND - Background color settings.
 * @property {number|undefined} BACKGROUND.CLASS - Background color for class names.
 * @property {number|undefined} BACKGROUND.TIMESTAMP - Background color for timestamps.
 * @property {Object} BACKGROUND.LEVEL - Background colors for different log levels.
 * @property {number|undefined} BACKGROUND.LEVEL.ERROR - Background color for error level messages.
 * @property {number|undefined} BACKGROUND.LEVEL.INFO - Background color for info level messages.
 * @property {number|undefined} BACKGROUND.LEVEL.VERBOSE - Background color for verbose level messages.
 * @property {number|undefined} BACKGROUND.LEVEL.DEBUG - Background color for debug level messages.
 * @property {number|undefined} BACKGROUND.MESSAGE - Background color for the main message text.
 * @property {number|undefined} BACKGROUND.METHOD - Background color for method names.
 *
 * @memberOf module:@decaf-ts/utils
 */
export type Theme = {
  FOREGROUND: {
    CLASS: number | undefined,
    TIMESTAMP: number | undefined,
    LEVEL: {
      ERROR: number | undefined,
      INFO: undefined,
      VERBOSE: undefined,
      DEBUG: number | undefined,
    },
    MESSAGE: undefined,
    METHOD: number | undefined,
  },
  BACKGROUND: {
    CLASS: number | undefined,
    TIMESTAMP: number | undefined,
    LEVEL: {
      ERROR: number | undefined,
      INFO: number | undefined,
      VERBOSE: number | undefined,
      DEBUG: number | undefined,
    },
    MESSAGE: number | undefined,
    METHOD: number | undefined,
  }
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