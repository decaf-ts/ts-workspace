import { OutputType, PromiseExecutor } from "../utils/types";
import { Encoding } from "../utils/constants";
import { colorize } from "../utils/utils";
import { OutputWriter } from "./OutputWriter";

export class StandardOutputWriter<R = number> implements OutputWriter{

  protected cmd?: string;

  constructor(protected lock: PromiseExecutor<R, number>, ...args: unknown[]) {}

  protected log(type: OutputType, data: string | Buffer){
    data = Buffer.isBuffer(data) ? data.toString(Encoding) : data;
    const formatedType = type === "stderr" ? colorize("ERROR").red : type;
    const log = `${new Date().getTime()} - ${formatedType}: ${data}`;
    console.log(log);
  }

  data(chunk: any){
    this.log("stdout", String(chunk));
  }

  error(chunk: any){
    this.log("stderr", String(chunk));
  }

  errors(err: Error){
    this.log("stderr", `Error executing command exited : ${err}`);
  }

  exit(code: number){
    this.log("stdout", `command exited code : ${code === 0 ? colorize(code).green : colorize(code).red}`);
    code === 0 ? this.resolve(code as R) : this.reject(code);
  }

  parseCommand(command: string | string[]): [string, string[]] {
    command = typeof command === "string"? command.split(" ") : command;
    this.cmd = command.join(" ");
    return [command[0], command.slice(1)];
  }

  protected resolve(reason: R){
    this.log("stdout", `${this.cmd} executed successfully: ${colorize(reason ? "ran to completion" : reason).green}`);
    this.lock.resolve(reason)
  }

  protected reject(reason: number | string){
    this.log("stderr", `${this.cmd} failed to execute: ${colorize(typeof reason === 'number' ? `Exit code ${reason}` : reason).red}`);
    this.lock.reject(typeof reason === "number"? reason : 1);
  }
}
