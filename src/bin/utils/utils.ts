import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { StandardOutputWriter } from "../writers/StandardOutputWriter";
import { CommandResult, OutputWriterConstructor } from "./types";

export function colorize(...args: unknown[]) {
  return {
    black: `\x1b[30m${args.join(' ')}`,
    red: `\x1b[31m${args.join(' ')}`,
    green: `\x1b[32m${args.join(' ')}`,
    yellow: `\x1b[33m${args.join(' ')}`,
    blue: `\x1b[34m${args.join(' ')}`,
    magenta: `\x1b[35m${args.join(' ')}`,
    cyan: `\x1b[36m${args.join(' ')}`,
    white: `\x1b[37m${args.join(' ')}`,
    bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
    bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
    bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
    bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
    bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
    bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
    bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
    bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
  };
}


export function lockify<R>(f: (...params: unknown[]) => R){
  let lock: Promise<R | void> = Promise.resolve()
  return (...params: unknown[]) => {
    const result = lock.then(() => f(...params))
    lock = result.catch(() => {})
    return result
  }
}


export async function runCommand<R = void>(command: string | string[], opts: SpawnOptionsWithoutStdio = {}, outputConstructor: OutputWriterConstructor<R> = StandardOutputWriter<R>, ...args: unknown[]): Promise<R> {
  const abort = new AbortController();
  const logs: string[] = [];
  const errs: string[] = [];
  const lock = new Promise<R>((resolve, reject) => {
    let runCommand, output;
    try {
      output = new outputConstructor({
        resolve,
        reject
      }, ...args);

      console.log(`Running command: ${command}`);
      const [cmd, argz] = output.parseCommand(command);
      runCommand = spawn(cmd, argz, {
        ...opts,
        cwd: opts.cwd || process.cwd(),
        env: Object.assign({}, process.env, opts.env),
        shell: opts.shell || false,
        signal: abort.signal
      });
      console.log(`pid : ${runCommand.pid}`);
    } catch (e: unknown){
      throw new Error(`Error running command ${command}: ${e}`);
    }

    runCommand.stdout.setEncoding("utf8");

    runCommand.stdout.on("data", (chunk: any) => {
      chunk = chunk.toString();
      logs.push(chunk);
      output.data(chunk);
    });

    runCommand.stderr.on("data", (data: any) => {
      data = data.toString();
      errs.push(data);
      output.error(data);
    });

    runCommand.once("error", (err: Error) => {
      output.errors(err);
    });

    runCommand.once("exit", (code: number = 0) => {
      output.exit(code);
    });
  });

  Object.assign(lock, {
    abort: abort,
    command: command,
    cmd: runCommand,
    logs,
    errs
  })

  return lock as CommandResult<R>;
}


