export const Encoding = "utf-8";

export const SemVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z])))/g

export enum SemVersion {
  PATCH = "patch",
  MINOR = "minor",
  MAJOR = "major",
}

export const NO_CI_FLAG = "-no-ci";

export const SetupScriptKey = "postinstall";

export enum Tokens {
  GIT = ".token",
  NPM = ".npmtoken",
  DOCKER = ".dockertoken"
}