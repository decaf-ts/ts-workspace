import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const scripts = [
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/feature_request.md",
  ".github/workflows/codeql-analysis.yml",
  ".github/workflows/jest-coverage.yml",
  ".github/workflows/jest-test.yml",
  ".github/workflows/nodejs-build-prod.yml",
  ".github/workflows/pages.yml",
  ".github/workflows/publish-on-release.yml",
  ".github/workflows/release-alpha-on-tag.yml",
  ".github/workflows/release-on-tag.yml",
  ".github/workflows/snyk-analysis.yml",
  ".github/FUNDING.yml",

  ".run/All Tests.run.xml",
  ".run/build.run.xml",
  ".run/build_prod.run.xml",
  ".run/coverage.run.xml",
  ".run/docs.run.xml",
  ".run/drawings.run.xml",
  ".run/flash-forward.run.xml",
  ".run/Integration Tests.run.xml",
  ".run/lint-fix.run.xml",
  ".run/test_circular.run.xml",
  ".run/uml.run.xml",
  ".run/Unit Tests.run.xml",
  ".run/update-scripts.run.xml",

  ".gitlab-ci.yml",
  ".prettierrc",
  ".eslint.config.js",
  "LICENSE.md",

  "bin/tag-release.sh",
  "bin/template_setup.sh",
  "bin/update-scripts.js"
]

Promise.allSettled(scripts.map(async p => {
  const res = await fetch(`https://raw.githubusercontent.com/decaf-ts/ts-wokspace/master/${p}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${p}: ${res.status}`);
  }
  const content = await res.text();
  return { path: p, content };
})).catch(error => {
  console.error("Error fetching scripts:", error);
  process.exit(1);
}).then(results => {
  results.forEach(({ p, content }) => {
    const targetPath = path.join(process.cwd(), p);
    fs.writeFileSync(targetPath, content);
    console.log(`Downloaded ${p} to ${targetPath}`);
  });
  console.log("All scripts downloaded successfully.");
}).catch(error => {
  console.error("Error overwriting files:", error);
  process.exit(1);
})
