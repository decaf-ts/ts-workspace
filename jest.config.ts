import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: process.cwd(),
  transform: { "^.+\\.ts?$": "ts-jest", },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node",],
  collectCoverage: false,
  coverageDirectory: "./workdocs/reports/coverage",
  collectCoverageFrom: ["src/**/*.{ts,jsx}",],
  coveragePathIgnorePatterns: ["src/cli.ts",],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 100,
      lines: 80,
      statements: 90,
    },
  },
  coverageReporters: ["json-summary", "text-summary", "text", "html",],
  reporters: [
    "default"
  ],
};

export default config;
