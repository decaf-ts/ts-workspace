import fs from "fs";
import { TextUtils } from "./text";

function patchFile(path: string, values: Record<string, number | string>) {
  if (!fs.existsSync(path))
    throw new Error(`File not found at path "${path}".`);

  try {
    let content = fs.readFileSync(path, 'utf8');
    content = TextUtils.patchString(content, values);
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Successfully updated "${path}".`);
  } catch (error: unknown) {
    throw new Error(`Error updating JSON file: ${error}`);
  }
}