import { LoggingConfig, VerbosityLogger } from "../output/types";
import { ParseArgsOptionConfig, ParseArgsResult } from "../input/types";
import { Command } from "./command";

export type CliFunction<I, R, C extends Command<I,R>> = (command: C, answers: ParseArgsResult, logger: VerbosityLogger) => Promise<R>;

export type InputOptions = {
  verbose?: number,
  version?: boolean,
  banner?: boolean,
  help?: boolean
}

export type CommandOptions<I> = I & Partial<{[k in keyof InputOptions]: ParseArgsOptionConfig}> & Partial<{[k in keyof LoggingConfig]: ParseArgsOptionConfig}>
