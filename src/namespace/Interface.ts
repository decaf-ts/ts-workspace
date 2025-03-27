/**
 * @interface Interface
 * @summary Generic interface with a single method
 * @description This interface defines a contract for objects that have a single generic method.
 * The method takes an argument of any type and returns a Promise that resolves to a string.
 *
 * @memberOf module:ts-workspace.Namespace
 */
export interface Interface {
  /**
   * @method
   * @name Interface#method
   * @summary Generic method that returns a Promise<string>
   * @description This method takes an argument of any type and returns a Promise that resolves to a string.
   * 
   * @template T The type of the input argument
   * @param {T} arg1 - The input argument of type T
   * @returns {Promise<string>} A Promise that resolves to a string
   *
   * @example
   * const obj: Interface = {
   *   method: async <T>(arg: T): Promise<string> => {
   *     return `Processed: ${String(arg)}`;
   *   }
   * };
   * 
   * obj.method(42).then(result => console.log(result)); // Outputs: "Processed: 42"
   */
  method<T>(arg1: T): Promise<string>;
}
