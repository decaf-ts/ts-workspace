import { Answers } from "prompts";
import { LoggingConfig, VerbosityLogger } from "../output/types";
import { ParseArgsOptionConfig } from "../input/types";

export type CliFunction<I,R> = (answers: Answers<string>, logger: VerbosityLogger) => Promise<R>;

export type InputOptions = {
  verbose?: number,
  version?: boolean,
  banner?: boolean,
  help?: boolean
}

export type CommandOptions<I> = I & {[k in keyof InputOptions]: ParseArgsOptionConfig} & {[k in keyof LoggingConfig]: ParseArgsOptionConfig}
