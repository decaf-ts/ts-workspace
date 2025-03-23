import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { StandardOutputWriter } from "../writers/StandardOutputWriter";
import { CommandResult, OutputWriterConstructor } from "./types";

/**
 * @description Creates a locked version of a function.
 * @summary This higher-order function takes a function and returns a new function that ensures
 * sequential execution of the original function, even when called multiple times concurrently.
 * It uses a Promise-based locking mechanism to queue function calls.
 *
 * @template R - The return type of the input function.
 * 
 * @param f - The function to be locked. It can take any number of parameters and return a value of type R.
 * @return A new function with the same signature as the input function, but with sequential execution guaranteed.
 * 
 * @function lockify
 * 
 * @mermaid
 * sequenceDiagram
 *   participant Caller
 *   participant LockedFunction
 *   participant OriginalFunction
 *   Caller->>LockedFunction: Call with params
 *   LockedFunction->>LockedFunction: Check current lock
 *   alt Lock is resolved
 *     LockedFunction->>OriginalFunction: Execute with params
 *     OriginalFunction-->>LockedFunction: Return result
 *     LockedFunction-->>Caller: Return result
 *   else Lock is pending
 *     LockedFunction->>LockedFunction: Queue execution
 *     LockedFunction-->>Caller: Return promise
 *     Note over LockedFunction: Wait for previous execution
 *     LockedFunction->>OriginalFunction: Execute with params
 *     OriginalFunction-->>LockedFunction: Return result
 *     LockedFunction-->>Caller: Resolve promise with result
 *   end
 *   LockedFunction->>LockedFunction: Update lock
 * 
 * @memberOf module:@decaf-ts/utils
 */
export function lockify<R>(f: (...params: unknown[]) => R) {
  let lock: Promise<R | void> = Promise.resolve()
  return (...params: unknown[]) => {
    const result = lock.then(() => f(...params))
    lock = result.catch(() => {})
    return result
  }
}

/**
 * @description Executes a command asynchronously with customizable output handling.
 * @summary This function runs a shell command as a child process, providing fine-grained
 * control over its execution and output handling. It supports custom output writers,
 * allows for command abortion, and captures both stdout and stderr.
 *
 * @template R - The type of the resolved value from the command execution.
 *
 * @param command - The command to run, either as a string or an array of strings.
 * @param opts - Spawn options for the child process. Defaults to an empty object.
 * @param outputConstructor - Constructor for the output writer. Defaults to StandardOutputWriter.
 * @param args - Additional arguments to pass to the output constructor.
 * @return A promise that resolves to the command result of type R.
 *
 * @function runCommand
 *
 * @mermaid
 * sequenceDiagram
 *   participant Caller
 *   participant runCommand
 *   participant OutputWriter
 *   participant ChildProcess
 *   Caller->>runCommand: Call with command and options
 *   runCommand->>OutputWriter: Create new instance
 *   runCommand->>OutputWriter: Parse command
 *   runCommand->>ChildProcess: Spawn process
 *   ChildProcess-->>runCommand: Return process object
 *   runCommand->>ChildProcess: Set up event listeners
 *   loop For each stdout data
 *     ChildProcess->>runCommand: Emit stdout data
 *     runCommand->>OutputWriter: Handle stdout data
 *   end
 *   loop For each stderr data
 *     ChildProcess->>runCommand: Emit stderr data
 *     runCommand->>OutputWriter: Handle stderr data
 *   end
 *   ChildProcess->>runCommand: Emit error (if any)
 *   runCommand->>OutputWriter: Handle error
 *   ChildProcess->>runCommand: Emit exit
 *   runCommand->>OutputWriter: Handle exit
 *   OutputWriter-->>runCommand: Resolve or reject promise
 *   runCommand-->>Caller: Return CommandResult
 *
 * @memberOf module:@decaf-ts/utils
 */
export async function runCommand<R = string>(command: string | string[], opts: SpawnOptionsWithoutStdio = {}, outputConstructor: OutputWriterConstructor<R> = StandardOutputWriter<R>, ...args: unknown[]): Promise<R> {
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


