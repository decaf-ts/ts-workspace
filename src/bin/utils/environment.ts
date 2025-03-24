import { toENVFormat } from "./text";

export class Environment {
  private static _instance?: Environment;
  private static cache: Map<string, unknown> = new Map();
  protected static factory: (...args: unknown[]) => Environment = () => new Environment()

  protected constructor() {
  }

  static keys(toEnv = true): string[]{
    return Object.keys(this.instance).map(k => toEnv ? toENVFormat(k): k);
  }

  static process(obj: {[k: string]: any}) {
    const keys = this.keys(false);
    Object.entries(obj).forEach(([key, value]) => {
      if (keys.includes(key)) {
        this[key as keyof typeof Environment] = value;
        return;
      }
      Object.defineProperty(this, key, {
        get: () => this.cache.get(key),
        set: (val: unknown) => this.cache.set(key, val),
        enumerable: true,
        configurable: false,
      })
      this[key as keyof typeof Environment] = process.env[toENVFormat(key)] || value;
    })
  }


  protected static instance(...args: unknown[]): Environment {
    this._instance = !this._instance ? this.factory(...args) : this._instance;
    return this._instance;
  }
}
