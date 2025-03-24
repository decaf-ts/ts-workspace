import fs from "fs";
import path from "path";
import { TextUtils } from "./text";
import { Logging } from "./logging";

const logger = Logging.for("FS");

/**
 * @description Patches a file with given values.
 * @summary Reads a file, applies patches using TextUtils, and writes the result back to the file.
 * 
 * @param {string} path - The path to the file to be patched.
 * @param {Record<string, number | string>} values - The values to patch into the file.
 * @return {void}
 * 
 * @function patchFile
 * 
 * @mermaid
 * sequenceDiagram
 *   participant Caller
 *   participant patchFile
 *   participant fs
 *   participant readFile
 *   participant TextUtils
 *   participant writeFile
 *   Caller->>patchFile: Call with path and values
 *   patchFile->>fs: Check if file exists
 *   patchFile->>readFile: Read file content
 *   readFile->>fs: Read file
 *   fs-->>readFile: Return file content
 *   readFile-->>patchFile: Return file content
 *   patchFile->>TextUtils: Patch string
 *   TextUtils-->>patchFile: Return patched content
 *   patchFile->>writeFile: Write patched content
 *   writeFile->>fs: Write to file
 *   fs-->>writeFile: File written
 *   writeFile-->>patchFile: File written
 *   patchFile-->>Caller: Patching complete
 * 
 * @memberOf module:fs-utils
 */
function patchFile(path: string, values: Record<string, number | string>) {
  const log = logger.for(patchFile);
  if (!fs.existsSync(path))
    throw new Error(`File not found at path "${path}".`);
  let content = readFile(path);
  
  try {
    log.verbose(`Patching file "${path}"...`);
    log.debug(`with value: ${JSON.stringify(values)}`);
    content = TextUtils.patchString(content, values);
  } catch (error: unknown) {
    throw new Error(`Error patching file: ${error}`);
  }
  writeFile(path, content);
}

/**
 * @description Reads a file and returns its content.
 * @summary Reads the content of a file at the specified path and returns it as a string.
 * 
 * @param {string} path - The path to the file to be read.
 * @return {string} The content of the file.
 * 
 * @function readFile
 * 
 * @memberOf module:fs-utils
 */
function readFile(path: string): string {
  const log = logger.for(readFile);
  try {
    log.verbose(`Reading file "${path}"...`);
    return fs.readFileSync(path, 'utf8');
  } catch (error: unknown) {
    log.verbose(`Error reading file "${path}": ${error}`);
    throw new Error(`Error reading file "${path}": ${error}`);
  }
}

/**
 * @description Writes data to a file.
 * @summary Writes the provided data to a file at the specified path.
 * 
 * @param {string} path - The path to the file to be written.
 * @param {string | Buffer} data - The data to be written to the file.
 * @return {void}
 * 
 * @function writeFile
 * 
 * @memberOf module:fs-utils
 */
function writeFile(path: string, data: string | Buffer): void {
  const log = logger.for(writeFile);
  try {
    log.verbose(`Writing file "${path} with ${data.length} bytes...`);
    fs.writeFileSync(path, data, 'utf8');
  } catch (error: unknown) {
    log.verbose(`Error writing file "${path}": ${error}`);
    throw new Error(`Error writing file "${path}": ${error}`);
  }
}

/**
 * Retrieves the package information from the package.json file.
 * 
 * @description This function attempts to load the package.json file from the specified directory
 * or the current working directory if no path is provided. It returns the parsed contents of the package.json file.
 * 
 * @param {string} [p=process.cwd()] - The directory path where the package.json file is located.
 * Defaults to the current working directory if not specified.
 * 
 * @returns {object} The parsed contents of the package.json file as an object.
 * 
 * @throws {Error} Throws an error if the package.json file cannot be found or parsed.
 */
export function getPackage(p = process.cwd()) {
  try {
    return require(path.join(`package.json`));
  }  catch (error) {
    throw new Error("Failed to retrieve package information");
  }
}