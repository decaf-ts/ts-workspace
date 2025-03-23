import { LoggingConfig, VerbosityLogger } from "./types";
import { LogLevel, NumericLogLevels } from "./constants";
import { color } from "./colors";

/**
 * @description A minimal logger implementation.
 * @summary MiniLogger is a lightweight logging class that implements the VerbosityLogger interface.
 * It provides basic logging functionality with support for different log levels and verbosity.
 * 
 * @class
 */
class MiniLogger implements VerbosityLogger {
  /**
   * @description Creates a new MiniLogger instance.
   * @summary Initializes a MiniLogger with the given class name, optional configuration, and method name.
   * 
   * @param clazz - The name of the class using this logger.
   * @param [config] - Optional logging configuration. Defaults to Info level and verbosity 0.
   * @param [method] - Optional method name for more specific logging.
   */
  constructor(
    protected clazz: string,
    protected config: LoggingConfig = { level: LogLevel.Info, verbosity: 0 },
    protected method?: string
  ) {}

  /**
   * @description Creates a formatted log string.
   * @summary Generates a log string with timestamp, colored log level, and message.
   * 
   * @param level - The log level as a string.
   * @param msg - The message to be logged.
   * @return A formatted log string.
   */
  protected createLog(level: string, msg: string): string {
    const timestamp = new Date().toISOString();
    switch (level) {
      case LogLevel.Debug:
        level = color(level).yellow;
        break
      case LogLevel.Error:
        level = color(level).red;
        break;
      case LogLevel.Verbose:
      case LogLevel.Info:
      default:
    }
    return `${timestamp} ${level.toUpperCase()}: ${msg}`;
  }

  /**
   * @description Logs a message with the specified log level.
   * @summary Checks if the message should be logged based on the current log level,
   * then uses the appropriate console method to output the log.
   * 
   * @param level - The log level of the message.
   * @param msg - The message to be logged.
   */
  protected log(level: LogLevel, msg: string): void {
    if (NumericLogLevels[this.config.level] <= NumericLogLevels[level])
      return;
    let method;
    switch (level) {
      case LogLevel.Verbose:
      case LogLevel.Info:
        method = console.log.bind(console);
        break;
      case LogLevel.Debug:
        method = console.debug.bind(console);
        break;
      case LogLevel.Error:
        method = console.error.bind(console);
        break;
      default:
        throw new Error("Invalid log level");
    }
    method(this.createLog(level, msg));
  }

  /**
   * @description Logs a verbose message.
   * @summary Logs a message at the Verbose level if the current verbosity allows it.
   * 
   * @param msg - The message to be logged.
   * @param verbosity - The verbosity level of the message (default: 0).
   */
  verbose(msg: string, verbosity: number = 0): void {
    if (this.config.verbosity >= verbosity) this.log(LogLevel.Verbose, msg);
  }

  /**
   * @description Logs an info message.
   * @summary Logs a message at the Info level.
   * 
   * @param msg - The message to be logged.
   */
  info(msg: string): void {
    this.log(LogLevel.Info, msg);
  }

  /**
   * @description Logs a debug message.
   * @summary Logs a message at the Debug level.
   * 
   * @param msg - The message to be logged.
   */
  debug(msg: string): void {
    this.log(LogLevel.Debug, msg);
  }

  /**
   * @description Logs an error message.
   * @summary Logs a message at the Error level.
   * 
   * @param msg - The message to be logged.
   */
  error(msg: string): void {
    this.log(LogLevel.Info, msg);
  }
}

class ClassLogger extends MiniLogger {
  constructor(clazz: string);
  constructor(clazz: string, config?: LoggingConfig);
  constructor(clazz: string, config: LoggingConfig, method: string);
  constructor(
    clazz: string,
    config: LoggingConfig = { level: LogLevel.Info, verbosity: 0 },
    method?: string
  ) {
    super(clazz, config, method);
  }
}

/**
 * @description A static class for managing logging operations.
 * @summary The Logging class provides a centralized logging mechanism with support for
 * different log levels and verbosity. It uses a singleton pattern to maintain a global
 * logger instance and allows creating specific loggers for different classes and methods.
 * 
 * @class
 */
export class Logging {
  /**
   * @description The global logger instance.
   * @summary A singleton instance of VerbosityLogger used for global logging.
   */
  private static global?: VerbosityLogger;

  /**
   * @description Factory function for creating logger instances.
   * @summary A function that creates new VerbosityLogger instances. By default, it creates a MiniLogger.
   */
  private static _factory : (...args: any[]) => VerbosityLogger = () => new MiniLogger("Logging");

  /**
   * @description Configuration for the logging system.
   * @summary Stores the global verbosity level and log level settings.
   */
  private static _config: { verbosity: number; level: LogLevel } = {
    verbosity: 0,
    level: LogLevel.Info,
  };

  /**
   * @description Private constructor to prevent instantiation.
   * @summary Ensures that the Logging class cannot be instantiated as it's designed to be used statically.
   */
  private constructor() {}

  /**
   * @description Setter for the logging configuration.
   * @summary Allows updating the global logging configuration.
   * 
   * @param config - An object containing verbosity and log level settings.
   */
  static set config(config: { verbosity: number; level: LogLevel }) {
    this._config = config;
  }

  /**
   * @description Retrieves or creates the global logger instance.
   * @summary Returns the existing global logger or creates a new one if it doesn't exist.
   * 
   * @return The global VerbosityLogger instance.
   */
  static get() {
    this.global = this.global ? this.global : this._factory("Logging", this._config);
    return this.global;
  }

  /**
   * @description Logs a verbose message.
   * @summary Delegates the verbose logging to the global logger instance.
   * 
   * @param msg - The message to be logged.
   * @param verbosity - The verbosity level of the message (default: 0).
   */
  static verbose(msg: string, verbosity: number = 0): void {
    return this.get().verbose(msg, verbosity);
  }

  /**
   * @description Logs an info message.
   * @summary Delegates the info logging to the global logger instance.
   * 
   * @param msg - The message to be logged.
   */
  static info(msg: string): void {
    return this.get().info(msg);
  }

  /**
   * @description Logs a debug message.
   * @summary Delegates the debug logging to the global logger instance.
   * 
   * @param msg - The message to be logged.
   */
  static debug(msg: string): void {
    return this.get().debug(msg);
  }

  /**
   * @description Logs an error message.
   * @summary Delegates the error logging to the global logger instance.
   * 
   * @param msg - The message to be logged.
   */
  static error(msg: string): void {
    return this.get().error(msg);
  }

  /**
   * @description Creates a logger for a specific class and method.
   * @summary Uses the factory function to create a new logger instance for a given class and method.
   * 
   * @param clazz - The name of the class for which the logger is being created.
   * @param [method] - The name of the method for which the logger is being created.
   * @return A new VerbosityLogger instance.
   */
  static for(clazz: string | {new(...args: any[]): any}, method?: string | Function): VerbosityLogger {
    clazz = typeof clazz === "string"? clazz : clazz.name;
    method = method
      ? (typeof method === "string" ? method : method.name)
      : undefined;
    return this._factory(clazz, this._config, method);
  }
}
