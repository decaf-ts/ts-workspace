import { Interface } from "../Interface";
import { Class } from "../Class";
/**
 * @summary Interface summary
 * @description Interface description
 *
 * @typedef T
 *
 * @interface ChildInterface
 * @extends Interface
 *
 * @memberOf module:ts-workspace.Namespace.ChildNameSpace
 */
export interface ChildInterface<T> extends Interface {
  /**
   * @summary Interface method summary
   * @description Interface method description
   *
   * @param {T} arg1
   */
  method2(arg1: T): Promise<string>;
}

/**
 * @description A child class extending Class and implementing ChildInterface.
 * @summary This class demonstrates inheritance and interface implementation in TypeScript.
 * It provides methods for asynchronous operations and error handling, showcasing
 * the use of generics and promise-based operations.
 *
 * @template T - The type parameter used throughout the class for flexible typing.
 *
 * @param {T} arg1 - The first argument for the constructor, used to initialize prop2.
 * @param {string} arg2 - The second argument for the constructor, passed to the parent class.
 *
 * @interface ChildClass
 * @extends Class
 * @implements ChildInterface<T>
 * @memberOf module:ts-workspace.Namespace.ChildNameSpace
 */
export class ChildClass<T> extends Class implements ChildInterface<T> {
  /**
   * @description A private property of the child class.
   * @summary This property stores a value of type T, which is optional.
   * It's initialized in the constructor with the value of arg1.
   *
   * @property {T} [prop2]
   *
   * @private
   */
  private prop2?: T;

  /**
   * @description Constructs a new instance of ChildClass.
   * @summary Initializes the ChildClass by calling the parent constructor and setting the prop2 property.
   *
   * @param {T} arg1 - The value to be assigned to prop2.
   * @param {string} arg2 - A string argument passed to the parent constructor.
   */
  constructor(arg1: T, arg2: string) {
    super(arg1, arg2);
    this.prop2 = arg1;
  }

  /**
   * @description An asynchronous method that returns a string.
   * @summary This method demonstrates type casting and async/await usage.
   * It always returns "ok" after casting it through multiple types.
   *
   * @template V - A type parameter used for intermediate casting.
   * @return {Promise<string>} A promise that resolves to the string "ok".
   *
   * @throws {Error} Always throws an error, as specified in the interface.
   */
  async method<V>(): Promise<string> {
    return "ok" as unknown as V as unknown as string;
  }

  /**
   * @description A method that always throws an error.
   * @summary This method demonstrates error throwing and the use of generic types in method parameters.
   *
   * @param {T} arg1 - An argument of type T to be included in the error message.
   * @return {Promise<string>} This method never actually returns as it always throws an error.
   * @throws {Error} Always throws an error with a message containing the provided argument.
   */
  method2(arg1: T): Promise<string> {
    throw new Error("error" + arg1);
  }
}
