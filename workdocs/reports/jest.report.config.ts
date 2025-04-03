import { Config } from '@jest/types'
import * as conf from "../../jest.config"

const config: Config.InitialOptions = {
  ...conf.default,
  collectCoverage: true,
  coverageDirectory: "./workdocs/reports/coverage",
  reporters:  [
    "default",
    ["jest-junit", {outputDirectory: './workdocs/reports/junit', outputName: "junit-report.xml"}],
    ["jest-html-reporters", {
      publicPath: "./workdocs/reports/html",
      filename: "test-report.html",
      openReport: true,
      expand: true,
      pageTitle: "TS-Workspace Test Report",
      stripSkippedTest: true,
      darkTheme: true,
      enableMergeData: true,
      dataMergeLevel: 2
    }]
  ],
}

export default config;