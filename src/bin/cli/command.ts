import { ParseArgsResult } from "../input/types";
import { VerbosityLogger } from "../output/types";
import { CliFunction, CommandOptions } from "./types";
import { Logging } from "../output/logging";
import { DefaultLoggingConfig, LogLevel } from "../utils/constants";
import { UserInput } from "../input/input";
import { DefaultCommandValues } from "./constants";
import { getDependencies, getPackageVersion } from "../utils/fs";
import { printBanner } from "../output/common";

export abstract class Command<I, R> {
  static log: VerbosityLogger;

  protected log: VerbosityLogger;
  protected constructor(protected name: string,
                        protected inputs: CommandOptions<I> = Object.assign({}, DefaultCommandValues, DefaultLoggingConfig) as unknown as CommandOptions<I>,
                        protected requirements: string[] = []){
    if (!Command.log){
      Object.defineProperty(Command, "log",{
        writable: false,
        value: Logging.for(this.name)
      })
      this.log = Command.log;
    }
    this.log = Command.log.for(this.name);
  }

  protected async checkRequirements(): Promise<void> {
    const {prod, dev, peer} = await getDependencies();
    const missing = [];
    const fullList =  Array.from(new Set([...prod, ...dev, ...peer]).values()).map(d => d.name)
    for (const dep of this.requirements)
      if (!fullList.includes(dep))
        missing.push(dep);

    if (!missing.length)
      return;

  }

  protected help(args: ParseArgsResult): string | void {
    return this.log.info(`This is help. I'm no use because I should have been overridden.`);
  }


  async run<C extends Command<I, R>>(func: CliFunction<I, R, C>): Promise<R | void | string> {
    const args: ParseArgsResult = UserInput.parseArgs(this.inputs);
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

    let result;
    try {
      result = await func(this as unknown as C, args, this.log)
    } catch (e: unknown) {
      this.log.error(`Error while running provided cli function: ${e}`);
      throw e;
    }

    return result as R | void | string
  }
}