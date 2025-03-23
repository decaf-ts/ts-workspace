/**
 * @description A utility class for text manipulation.
 * @summary TextUtils provides static methods for common text operations such as padding and string interpolation.
 * This class is not meant to be instantiated, as all methods are static.
 * 
 * @class
 */
export class TextUtils {
  /**
   * @description Private constructor to prevent instantiation.
   * @summary This class is not meant to be instantiated as it only contains static methods.
   */
  private constructor() {}

  /**
   * @description Pads the end of a string with a specified character.
   * @summary Extends the input string to a specified length by adding a padding character to the end.
   * If the input string is already longer than the specified length, it is returned unchanged.
   * 
   * @param str - The input string to be padded.
   * @param length - The desired total length of the resulting string.
   * @param char - The character to use for padding. Defaults to a space.
   * @return The padded string.
   * @throws {Error} If the padding character is not exactly one character long.
   */
  static padEnd(str: string, length: number, char: string = " "): string {
    if (char.length !== 1)
      throw new Error("Invalid character length for padding. must be one!");
    return str.padEnd(length, char);
  }

  /**
   * @description Replaces placeholders in a string with provided values.
   * @summary Interpolates a string by replacing placeholders of the form ${variableName}
   * with corresponding values from the provided object. If a placeholder doesn't have
   * a corresponding value, it is left unchanged in the string.
   * 
   * @param input - The input string containing placeholders to be replaced.
   * @param values - An object containing key-value pairs for replacement.
   * @return The interpolated string with placeholders replaced by their corresponding values.
   */
  static patchString(input: string, values: Record<string, number | string>): string {
    return input.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (match, variable) => values[variable as string] as string || match);
  }
}

