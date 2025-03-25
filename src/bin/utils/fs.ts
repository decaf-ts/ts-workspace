import fs from "fs";
import path from "path";
import { Logging } from "../output/logging";
import { patchString } from "./text";
import { runCommand } from "./utils";

const logger = Logging.for("fs");

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
    content = patchString(content, values);
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
 * @param property
 * @returns {object} The parsed contents of the package.json file as an object.
 *
 * @throws {Error} Throws an error if the package.json file cannot be found or parsed.
 */
export function getPackage(p: string = process.cwd(), property?: string): object | string {
  let pkg: any;
  try {
    pkg = JSON.parse(readFile(path.join(p, `package.json`)));
  } catch (error) {
    throw new Error("Failed to retrieve package information");
  }

  if (property) {
    if (!(property in pkg))
      throw new Error(`Property "${property}" not found in package.json`);
    return pkg[property] as string;
  }
  return pkg;
}

export function getPackageVersion(p = process.cwd()): string {
  return getPackage(p, "version") as string;
}

export async function getDependencies(path: string = process.cwd()) {
  let pkg: any;

  try {
    pkg = JSON.parse(await runCommand(`npm ls --json`, { cwd: path }));
  } catch (e: unknown) {
    throw new Error(`Failed to retrieve dependencies: ${e}`);
  }

  const mapper = (entry: [string, unknown], index: number) => ({name: entry[0], version: (entry[1] as any).version})

  return {
    prod: Object.entries(pkg.dependencies || {}).map(mapper),
    dev: Object.entries(pkg.devDependencies || {}).map(mapper),
    peer: Object.entries(pkg.peerDependencies || {}).map(mapper),
  }
}

export async function updateDependencies() {
  const log = logger.for(updateDependencies);
  log.info("checking for updates...");
  await runCommand("npx npm-check-updates -u");
  log.info("updating...");
  await runCommand("npx npm run do-install");
}

export async function auditFix() {
  return await runCommand("npm audit fix --force");
}

export async function pushToGit(){
  const log = logger.for(pushToGit);
  const gitUser = await runCommand("git config user.name");
  const gitEmail = await runCommand("git config user.email");
  log.verbose(`cached git id: ${gitUser}/${gitEmail}. changing to automation`);
  await runCommand("git config user.email \"automation@decaf.ts\"");
  await runCommand("git config user.name \"decaf\"");
  log.info("Pushing changes to git...");
  await runCommand("git add .");
  await runCommand(`git commit -m "refs #1 - after repo setup"`);
  await runCommand("git push");
  await runCommand(`git config user.email "${gitEmail}"`);
  await runCommand(`git config user.name "${gitUser}"`);
  log.verbose(`reverted to git id: ${gitUser}/${gitEmail}`);
}

export async function installDependencies(dependencies: {prod: string[], dev: string[], peer: string[]}) {
  const {prod, dev, peer} = dependencies;
  if (prod.length) {
    logger.info(`Installing dependencies ${prod.join(', ')}...`);
    await runCommand(`npm install ${prod.join(' ')}`, { cwd: process.cwd() });
  }
  if (dev.length) {
    logger.info(`Installing devDependencies ${dev.join(', ')}...`);
    await runCommand(`npm install --save-dev ${dev.join(' ')}`, { cwd: process.cwd() });
  }
  if (peer.length) {
    logger.info(`Installing peerDependencies ${peer.join(', ')}...`);
    await runCommand(`npm install --save-peer ${peer.join(' ')}`, { cwd: process.cwd() });
  }
}