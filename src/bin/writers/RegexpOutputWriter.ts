import { StandardOutputWriter } from "./StandardOutputWriter";
import { PromiseExecutor } from "../utils/types";
import { colorize } from "../utils/utils";

export class RegexpOutputWriter extends StandardOutputWriter<string> {

  protected readonly regexp: RegExp;

  constructor(lock: PromiseExecutor<string, number>, regexp: string | RegExp, flags = "g") {
    super(lock);
    this.regexp = typeof regexp === "string"? new RegExp(regexp, flags) : regexp;
  }

  private test(data: string){
    this.regexp.lastIndex = 0;
    let match;
    try {
      match = this.regexp.exec(data);
    } catch (e: unknown){
      return console.debug(`Failed to parse chunk: ${data}\nError: ${e} `);
    }
    return match;
  }

  protected testAndResolve(data: string){
    const match = this.test(data);
    if (match)
      this.resolve(match[0]);
  }

  protected testAndReject(data: string){
    const match = this.test(data);
    if (match)
      this.reject(match[0]);
  }

  data(chunk: any){
    super.data(chunk);
    this.testAndResolve(String(chunk));
  }

  error(chunk: any){
    super.error(chunk);
    this.testAndReject(String(chunk));
  }

  protected reject(reason: string){
    this.log("stderr", `${this.cmd} failed to execute: ${colorize(reason).red}`);
    this.lock.reject(1);
  }
}
