import { ParseArgsOptionsConfig, ParseArgsResult } from "../input/types";
import { LoggingConfig, VerbosityLogger } from "../output/types";
import { CliFunction } from "./types";
import { Logging } from "../output/logging";
import { DefaultLoggingConfig, LogLevel } from "../utils/constants";
import { UserInput } from "../input/input";
import { DefaultCommandValues } from "./constants";
import { getPackageVersion } from "../utils/fs";
import { printBanner } from "../output/common";

export abstract class Command<I, R> {
  protected static log: VerbosityLogger;

  protected log: VerbosityLogger;
  protected constructor(protected name: string,
                        protected inputs: I & ParseArgsOptionsConfig & Partial<Omit<LoggingConfig, "theme">> = Object.assign({}, DefaultLoggingConfig),
                        protected requirements: string[] = []){
    if (!Command.log){
      Command.log = Logging.for(this.name);
      this.log = Command.log;
    }
    this.log = Command.log.for(this.name);
  }

  protected async checkRequirements(): Promise<void> {

  }

  protected help(args: ParseArgsResult): string | void {
    return this.log.info(`This is help. I'm no use because I should have been overridden.`);
  }

  async run(func: CliFunction<I, R>): Promise<R | void | string> {
    const args = UserInput.parseArgs(this.inputs);
    const options = Object.assign({}, DefaultCommandValues, args.values);
    const {timestamp, verbose, version, help, logLevel, logStyle, banner} = options;
    Logging.setConfig({
      ...options,
      timestamp: !!timestamp,
      level: logLevel as LogLevel,
      style: !!logStyle,
      verbose: verbose as number || 0
    })
    if (version) {
      return getPackageVersion()
    }

    if (help) {
      return this.help(args)
    }

    if (banner)
      printBanner(this.log);


  }
}