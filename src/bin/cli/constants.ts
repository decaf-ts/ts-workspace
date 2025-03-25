
export const DefaultCommandOptions = {
  verbose: {
    type: "number",
    short: "V",
    default: 0
  },
  version: {
    type: "boolean",
    short: "v",
    default: undefined
  },
  help: {
    type: "boolean",
    short: "h",
    default: false
  },
  logLevel: {
    type: "string",
    default: "info"
  },
  logStyle: {
    type: "boolean",
    default: true,
  },
  timestamp: {
    type: "boolean",
    default: true,
  },
  banner: {
    type: "boolean",
    default: false,
  }
};

export const DefaultCommandValues: {[k in keyof typeof DefaultCommandOptions]: unknown} = Object.keys(DefaultCommandOptions)
  .reduce((acc: Record<keyof typeof DefaultCommandOptions, unknown>, key: string) => {
    acc[key as keyof typeof DefaultCommandOptions] = DefaultCommandOptions[key as keyof typeof DefaultCommandOptions].default;
    return acc;
}, {} as Record<keyof typeof DefaultCommandValues, unknown>)

