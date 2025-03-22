import { StandardOutputWriter } from "../writers/StandardOutputWriter";
import { ChildProcessWithoutNullStreams } from "child_process";

export type OutputType = "stdout" | "stderr";

export type OutputWriterConstructor<R = number, C extends StandardOutputWriter<R> = StandardOutputWriter<R>, E = number> = {new(lock: PromiseExecutor<R, E>, ...args: unknown[]): C};

export type PromiseExecutor<R, E = Error> = {
  resolve: (value: R | PromiseLike<R>) => void,
  reject: (error: E) => void
}

export type CommandResult<R = void> = Promise<R> & {
  abort: AbortController,
  command: string,
  cmd: ChildProcessWithoutNullStreams,
  logs: string[],
  errs: string[]
}

export interface ParseArgsOptionConfig {
  type: "string" | "boolean";
  multiple?: boolean | undefined;
  short?: string | undefined;
  default?: string | boolean | string[] | boolean[] | undefined;
}

export interface ParseArgsOptionsConfig {
  [longOption: string]: ParseArgsOptionConfig;
}

export type OptionToken =
  | { kind: "option"; index: number; name: string; rawName: string; value: string; inlineValue: boolean }
  | {
  kind: "option";
  index: number;
  name: string;
  rawName: string;
  value: undefined;
  inlineValue: undefined;
};

export type Token =
  | OptionToken
  | { kind: "positional"; index: number; value: string }
  | { kind: "option-terminator"; index: number };

export type ParseArgsResult = {values: {[p: string]: string | boolean | (string | boolean)[] | undefined}, positionals: string[], tokens?: Token[]}