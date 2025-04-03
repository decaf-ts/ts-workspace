export interface AddAttachParams {
  attach: string | Buffer;
  description: string | object;
  context?: any;
  bufferFormat?: string;
}
export interface AddMsgParams {
  message: string | object;
  context?: any;
}

export const JestReportersTempPathEnvKey = "JEST_HTML_REPORTERS_TEMP_DIR_PATH"

export async function normalizeImport<T>(
  importPromise: Promise<T>,
): Promise<T> {
  // CommonJS's `module.exports` is wrapped as `default` in ESModule.
  return importPromise.then((m: any) => (m.default || m) as T);
}

let addMsgFunction: (arg: AddMsgParams) => Promise<void>;
let addAttachFunction: (arg: AddAttachParams) => Promise<void>;


async function importHelpers(): Promise<void> {
  if (!process.env[JestReportersTempPathEnvKey])
    process.env[JestReportersTempPathEnvKey] = './workdocs/reports';
  const { addMsg, addAttach } = await normalizeImport(import('jest-html-reporters/helper'));
  addMsgFunction = addMsg;
  addAttachFunction = addAttach;
}

export async function addReportMessage(title: string, message: string | object): Promise<void> {
  if (!addMsgFunction) await importHelpers();
  const msg = `${title}\n${message}`;
  await addMsgFunction({ message: msg });
}

export async function addReportAttachment(title: string, message: string | Buffer): Promise<void> {
  if (!addAttachFunction) await importHelpers();
  const msg = `${title}\n${message}`;
  await addAttachFunction({
    attach: msg,
    description: title,
  });
}