import { PromptObject, Answers, ValueOrFunc, InitialReturnValue, PrevCaller, Falsy, Choice, PromptType } from "prompts";
import prompts from "prompts";
import { Kleur } from "kleur";
import { Readable, Writable } from "stream";
import { parseArgs, ParseArgsConfig } from "util";
import { ParseArgsOptionsConfig, ParseArgsResult, Token } from "../utils/types";

export class UserInput<R extends string = string> implements PromptObject<R> {
  type: PromptType | Falsy | PrevCaller<R, PromptType | Falsy> = "text"
  name: ValueOrFunc<R>;
  message?: ValueOrFunc<string> | undefined;
  initial?: InitialReturnValue | PrevCaller<R, InitialReturnValue | Promise<InitialReturnValue>> | undefined;
  style?: string | PrevCaller<R, string | Falsy> | undefined;
  format?: PrevCaller<R, void> | undefined;
  validate?: PrevCaller<R, boolean | string | Promise<boolean | string>> | undefined;
  onState?: PrevCaller<R, void> | undefined;
  onRender?: ((kleur: Kleur) => void) | undefined;
  min?: number | PrevCaller<R, number | Falsy> | undefined;
  max?: number | PrevCaller<R, number | Falsy> | undefined;
  float?: boolean | PrevCaller<R, boolean | Falsy> | undefined;
  round?: number | PrevCaller<R, number | Falsy> | undefined;
  instructions?: string | boolean | undefined;
  increment?: number | PrevCaller<R, number | Falsy> | undefined;
  separator?: string | PrevCaller<R, string | Falsy> | undefined;
  active?: string | PrevCaller<R, string | Falsy> | undefined;
  inactive?: string | PrevCaller<R, string | Falsy> | undefined;
  choices?: Choice[] | PrevCaller<R, Choice[] | Falsy> | undefined;
  hint?: string | PrevCaller<R, string | Falsy> | undefined;
  warn?: string | PrevCaller<R, string | Falsy> | undefined;
  suggest?: ((input: any, choices: Choice[]) => Promise<any>) | undefined;
  limit?: number | PrevCaller<R, number | Falsy> | undefined;
  mask?: string | PrevCaller<R, string | Falsy> | undefined;
  stdout?: Writable | undefined;
  stdin?: Readable | undefined;

  constructor(name: ValueOrFunc<R>) {
    this.name = name
  }

  setType(type: PromptType | Falsy | PrevCaller<R, PromptType | Falsy>): this {
    this.type = type;
    return this;
  }

  setMessage(value: ValueOrFunc<string> | undefined): this {
    this.message = value;
    return this;
  }

  setInitial(value: InitialReturnValue | PrevCaller<R, InitialReturnValue | Promise<InitialReturnValue>> | undefined): this {
    this.initial = value;
    return this;
  }

  setStyle(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.style = value;
    return this;
  }

  setFormat(value: PrevCaller<R, void> | undefined): this {
    this.format = value;
    return this;
  }

  setValidate(value: PrevCaller<R, boolean | string | Promise<boolean | string>> | undefined): this {
    this.validate = value;
    return this;
  }

  setOnState(value: PrevCaller<R, void> | undefined): this {
    this.onState = value;
    return this;
  }

  setOnRender(value: ((kleur: Kleur) => void) | undefined): this {
    this.onRender = value;
    return this;
  }

  setMin(value: number | PrevCaller<R, number | Falsy> | undefined): this {
    this.min = value;
    return this;
  }

  setMax(value: number | PrevCaller<R, number | Falsy> | undefined): this {
    this.max = value;
    return this;
  }

  setFloat(value: boolean | PrevCaller<R, boolean | Falsy> | undefined): this {
    this.float = value;
    return this;
  }

  setRound(value: number | PrevCaller<R, number | Falsy> | undefined): this {
    this.round = value;
    return this;
  }

  setInstructions(value: string | boolean | undefined): this {
    this.instructions = value;
    return this;
  }

  setIncrement(value: number | PrevCaller<R, number | Falsy> | undefined): this {
    this.increment = value;
    return this;
  }

  setSeparator(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.separator = value;
    return this;
  }

  setActive(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.active = value;
    return this;
  }

  setInactive(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.inactive = value;
    return this;
  }

  setChoices(value: Choice[] | PrevCaller<R, Choice[] | Falsy> | undefined): this {
    this.choices = value;
    return this;
  }

  setHint(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.hint = value;
    return this;
  }

  setWarn(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.warn = value;
    return this;
  }

  setSuggest(value: ((input: any, choices: Choice[]) => Promise<any>) | undefined): this {
    this.suggest = value;
    return this;
  }

  setLimit(value: number | PrevCaller<R, number | Falsy> | undefined): this {
    this.limit = value;
    return this;
  }

  setMask(value: string | PrevCaller<R, string | Falsy> | undefined): this {
    this.mask = value;
    return this;
  }

  setStdout(value: Writable | undefined): this {
    this.stdout = value;
    return this;
  }

  setStdin(value: Readable | undefined): this {
    this.stdin = value;
    return this;
  }

  async ask(){
    return (await UserInput.ask(this))[this.name as keyof Answers<R>];
  }

  static async ask<R extends string = string>(question: UserInput<R> | UserInput<R>[]){
    if (!Array.isArray(question)) {
      question = [question];
    }
    let answers: Answers<R>;
    try {
      answers = await prompts(question);
    } catch (error: unknown) {
      throw new Error(`Error while getting input: ${error}`);
    }
    return answers;
  }


  static async askNumber(name: string, question: string, min?: number, max?: number, initial?: number): Promise<number> {
    const userInput = new UserInput(name)
      .setMessage(question)
      .setType("number");

    if (typeof min === 'number')
      userInput.setMin(min);

    if (typeof max === 'number')
      userInput.setMax(max);

    if (typeof initial === 'number')
      userInput.setInitial(initial);

    return (await this.ask(userInput))[name];
  }

  static async askText(name: string, question: string, mask: string | undefined = undefined, initial?: string): Promise<string> {
    const userInput = new UserInput(name)
      .setMessage(question);

    if (mask)
      userInput.setMask(mask);
    if (typeof initial ==='string')
      userInput.setInitial(initial);
    return (await this.ask(userInput))[name];
  }

  static async askConfirmation(name: string, question: string, initial?: boolean): Promise<boolean> {
    const userInput = new UserInput(name)
      .setMessage(question)
      .setType("confirm")

    if (typeof initial !== "undefined")
      userInput.setInitial(initial);
    return (await this.ask(userInput))[name];
  }

  static parseArgs(options: ParseArgsOptionsConfig): ParseArgsResult {
    const args: ParseArgsConfig = {
      args: process.argv.slice(2),
      options: options
    }
    try {
      return parseArgs(args);
    } catch (error: unknown) {
      throw new Error(`Error while parsing arguments: ${error}`);
    }
  }
}