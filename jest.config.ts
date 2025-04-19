import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: __dirname,
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: false,
  reporters: ["default"],
};

export default config;
