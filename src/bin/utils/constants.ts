import { Theme } from "./types";

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
  Error = "error",
  /** Routine information, such as ongoing status or performance. */
  Info = "info",
  /** Additional relevant information. */
  Verbose = "verbose",
  /** Debug or trace information. */
  Debug = "debug",
}

/**
 * @description Numeric values associated with log levels.
 * @summary Provides a numeric representation of log levels for comparison and filtering.
 * @const {Object} NumericLogLevels
 * @property {number} error - Numeric value for error level (0).
 * @property {number} info - Numeric value for info level (2).
 * @property {number} verbose - Numeric value for verbose level (4).
 * @property {number} debug - Numeric value for debug level (5).
 * @memberOf module:@decaf-ts/utils
 */
export const NumericLogLevels = {
  error: 0,
  info: 2,
  verbose: 4,
  debug: 5,
};

/**
 * @description Environment variables used for logging configuration.
 * @summary Defines the names of environment variables that control logging behavior in the application.
 * These variables can be set to adjust log levels and verbosity at runtime.
 * 
 * @const EnvironmentVariables
 * 
 * @property {string} LOG_LEVEL - Environment variable name for setting the log level.
 * @description Controls the minimum level of messages that will be logged.
 * 
 * @property {string} VERBOSITY - Environment variable name for setting logging verbosity.
 * @description Determines the amount of detail included in log messages.
 * 
 * @memberOf module:@decaf-ts/utils
 */
export const EnvironmentVariables = {
  LOG_LEVEL: "LOG_LEVEL",
  VERBOSITY: "VERBOSITY",
}

export const DefaultTheme: Theme = {
  FOREGROUND: {
    CLASS: 4,
    TIMESTAMP: undefined,
    LEVEL: {
      ERROR: 6,
      INFO: undefined,
      VERBOSE: undefined,
      DEBUG: 7,
    },
    MESSAGE: undefined,
    METHOD: 12
  },
  BACKGROUND: {
    CLASS: undefined,
    TIMESTAMP: undefined,
    LEVEL: {
      ERROR: undefined,
      INFO: undefined,
      VERBOSE: undefined,
      DEBUG: undefined,
    },
    MESSAGE: undefined,
    METHOD: undefined
  }
}