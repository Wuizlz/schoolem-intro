import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

function resolveLicenseCheckerBin() {
  const pkgPath = require.resolve("license-checker/package.json");
  const pkgDir = path.dirname(pkgPath);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const binRel =
    typeof pkg.bin === "string" ? pkg.bin : pkg.bin["license-checker"];
  return path.resolve(pkgDir, binRel);
}

function runLicenseChecker() {
  const binPath = resolveLicenseCheckerBin();
  try {
    const output = execFileSync(
      process.execPath,
      [binPath, "--production", "--json"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    return JSON.parse(output);
  } catch (err) {
    console.error("Failed to run license-checker.");
    if (err?.stderr) {
      console.error(err.stderr.toString());
    }
    process.exit(1);
  }
}

const data = runLicenseChecker();
const copyleft = /gpl|agpl|lgpl/i;
const offenders = [];

for (const [pkgName, info] of Object.entries(data)) {
  const licenses = info?.licenses;
  const list = Array.isArray(licenses) ? licenses : [licenses].filter(Boolean);
  const matched = list.find((license) => copyleft.test(String(license)));
  if (matched) offenders.push({ pkgName, license: matched });
}

if (offenders.length) {
  console.error("Copyleft license detected:");
  for (const item of offenders) {
    console.error(`- ${item.pkgName}: ${item.license}`);
  }
  process.exit(1);
}

process.exit(0);
