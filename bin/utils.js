import { exec, spawn } from 'child_process';

export function colorize(...args) {
  return {
    black: `\x1b[30m${args.join(' ')}`,
    red: `\x1b[31m${args.join(' ')}`,
    green: `\x1b[32m${args.join(' ')}`,
    yellow: `\x1b[33m${args.join(' ')}`,
    blue: `\x1b[34m${args.join(' ')}`,
    magenta: `\x1b[35m${args.join(' ')}`,
    cyan: `\x1b[36m${args.join(' ')}`,
    white: `\x1b[37m${args.join(' ')}`,
    bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
    bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
    bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
    bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
    bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
    bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
    bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
    bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
  };
}

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, { encoding: 'utf-8' }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function main() {
  let { stdout } = await sh('ls');
  for (let line of stdout.split('\n')) {
    console.log(`ls: ${line}`);
  }
}

export function lockify(f){
  let lock = Promise.resolve()
  return (...params) => {
    const result = lock.then(() => f(...params))
    lock = result.catch(() => {})
    return result
  }
}

export class CmdOutput {

  constructor(cmd, lock) {
    this.lock = lock;
    this.cmd = cmd;
  }

  createLog(type, data){
    type = type === "stderr"? colorize("ERROR").red : type;
    const log = `${new Date().getTime()} - ${type}: ${data}`;
    console.log(log);
  }

  data(chunk){
    this.createLog("stdout", String(chunk));
  }

  error(chunk){
    this.createLog("stderr", String(chunk));
  }

  errors(err){
    this.createLog("stderr", `Error executing command exited : ${err}`);
  }

  exit(code){
    this.createLog("stdout", `command exited code : ${code === 0 ? colorize(code).green : colorize(code).red}`);
    this.resolve()
  }

  resolve(reason){
    const self = this;
    Promise.resolve(this.lock).then(() => {
      self.createLog("stdout", `${this.cmd} executed successfully: ${colorize(reason ? "ran to completion" : reason).green}`)
    }).catch((e) => {self.createLog("stderr", colorize(`Failed to release command: ${e}`).red)});
  }
}

export class CmdOutputGrabber extends CmdOutput {
  constructor(lock, regexp, flags = "g") {
    super(lock);
    this.regexp = typeof regexp === "string"? new RegExp(regexp, flags) : regexp;
  }

  testAndResolve(data){
    this.regexp.lastIndex = 0;
    const match = this.regexp.exec(data);
    if (match)
      this.resolve();
  }

  data(chunk){
    this.createLog("stdout", String(chunk));
    this.testAndResolve(chunk);
  }

  error(chunk){
    this.createLog("stderr", String(chunk));
    this.testAndResolve(chunk);
  }

}

export async function runCommand(command, opts = {}, outputConstructor = CmdOutput, ...args) {
  let runCommand, output, lock, abort;
  try {
    lock = new Promise()
    output = new outputConstructor(lock, ...args);
    console.log(`Running command: ${command}`);
    command = command.split(" ");
    abort = new AbortController();
    runCommand = spawn(command, {
      ...opts,
      cwd: opts.cwd || process.cwd(),
      env: Object.assign({}, process.env, opts.env),
      shell: opts.shell || false,
      signal: abort.signal
    });
    console.log(`pid : ${runCommand.pid}`);
  } catch (e){
    throw new Error(`Error running command ${command}: ${e.message}`);
  }

  // send stdout encoding to uft8 since sse only support text
  runCommand.stdout.setEncoding("utf8");

  // add event listener to list to data on stdout
  runCommand.stdout.on("data", (chunk) => {
    output.data(chunk);
  });

  // add event listener to list to data on stderr
  runCommand.stderr.on("data", (data) => {
    output.error(data);
  });

  // add event listener to list to errors
  runCommand.once("error", (err) => {
    output.errors(err);
  });

  // when command is exit close connection by sending
  runCommand.once("exit", (code) => {
    output.exit(code);
  });

  Object.assign(lock, {
    abort: abort,
    command: command,
    cmd: runCommand,
  })

  return lock;
}


