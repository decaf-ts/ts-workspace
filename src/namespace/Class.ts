
import { Interface } from "./Interface";

/**
 * @class Class
 * @summary A class implementing the Interface
 * @description This class provides an implementation of the Interface, including a private property,
 * a constructor, an instance method, and a static method.
 * 
 * @implements {Interface}
 *
 * @param {unknown} arg1 - The first argument for the constructor
 * @param {string} arg2 - The second argument for the constructor
 */
export class Class implements Interface {
  /**
   * @private
   * @property {unknown} prop - A private property of unknown type
   */
  private prop!: unknown;

  constructor(arg1: unknown, arg2: string) {
    console.log(arg1, arg2);
  }

  /**
   * @summary Asynchronous method that throws an error
   * @description This method is a generic asynchronous function that always throws an error.
   * The error message is cast to the generic type T and then back to a string.
   * 
   * @template T
   * @returns {Promise<string>} A Promise that always rejects with an error
   * @throws {Error} Always throws an error with the message "error"
   */
  async method<T>(): Promise<string> {
    throw new Error("error" as T as unknown as string);
  }

  /**
   * @summary Static method that throws an error
   * @description This static method always throws an error with the message "error".
   *
   * @static
   * @throws {Error} Always throws an error with the message "error"
   */
  static method() {
    throw new Error("error");
  }
}
