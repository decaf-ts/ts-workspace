import { VerbosityLogger } from "../output/types";
import { Logging } from "../output/logging";
import { ParseArgsOptionsConfig } from "../input/types";

export class Cli<I> {
  protected log: VerbosityLogger;


  constructor(protected name: string) {
    this.log = Logging.for(Cli).for(name);
  }

  parseArgs(inputs: ParseArgsOptionsConfig){

  }
}