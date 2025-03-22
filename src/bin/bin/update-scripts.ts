import fs from "fs";
import https from "https";

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
  ".github/build.run.xml",
  ".github/build_prod.run.xml",

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

async function main(){
  return Promise.allSettled(scripts.map(async p => {
    return new Promise<{path: string, result: string}>((resolve, reject) => {
      const request = https.get(`https://raw.githubusercontent.com/decaf-ts/ts-wokspace/master/${p}`, res => {
        if (res.statusCode!== 200) {
          console.error(`Failed to fetch ${p} (status: ${res.statusCode})`);
          return reject(new Error(`Failed to fetch ${p}`));
        }
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            path: p,
            result: data
          });
        });
      });
    })
  })).catch(error => {
    console.error("Error fetching scripts:", error);
    process.exit(1);
  }).then(results => {
    results.forEach((prom) => {
      if(prom.status === "fulfilled") {
        const { path, result } = prom.value;
        const content = result.toString();
        fs.writeFileSync(path, content);
        console.log(`Updated ${path}`);
      } else {
        console.warn(`Failed to download: ${prom.reason}`);
      }
    });
  }).catch((error: unknown) => {
    throw new Error(`Error overwriting files: ${error}`);
  })
}

main()
  .then(() => console.log("Scripts and configs updated"))
  .catch(e => {
    console.error("Error Updating scripts:", e.message);
    process.exit(1);
  });
