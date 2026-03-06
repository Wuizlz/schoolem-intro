# Pre-Commit Documentation

## Purpose

The pre-commit hook enforces a consistent, local quality gate before code is committed. It prevents:

- Copyleft licenses (GPL/AGPL/LGPL) from entering production deps
- Formatting drift
- ESLint regressions
- Test regressions

This keeps the repo in a healthy state and aligns local checks with CI.

---

## Hook Definition

**File:** `.husky/pre-commit`

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run license:check
npm run precommit:check
```

**What it does**

- Runs the license scan first
- Runs formatting, linting, and tests after
- Fails the commit if any step fails

---

## Scripts Used

**From `package.json`:**

```json
"license:check": "node scripts/license-check.js",
"precommit:check": "prettier . --check && eslint . --ext .js,.jsx && node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
```

**Why these checks**

- `prettier` ensures formatting consistency
- `eslint` enforces code quality rules
- `jest --coverage` protects core logic with unit tests
- `license:check` prevents copyleft licenses in production deps

---

## Cross-Platform License Check

**File:** `scripts/license-check.js`

This script replaces the original `grep`-based command with a Node-based scanner. It works on macOS, Linux, and Windows.

### Full Source

```js
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
```

### Line-by-Line Explanation

1. **Imports**
   - `execFileSync`: runs the license-checker CLI in a portable way.
   - `createRequire`: allows CommonJS `require.resolve` inside an ESM file.
   - `fs`, `path`: read and resolve module paths.

2. **`createRequire`**
   - `createRequire(import.meta.url)` gives us a `require` compatible with ESM.
   - This is needed because `license-checker` is resolved by `require.resolve`.

3. **`resolveLicenseCheckerBin()`**
   - Finds the path to `license-checker/package.json`.
   - Reads its `bin` entry to locate the actual CLI script.
   - Returns an absolute path to the CLI file.

4. **`runLicenseChecker()`**
   - Calls `node <license-checker-bin> --production --json`.
   - Uses `execFileSync` so it works across shells and OSes.
   - Parses JSON output into a JS object.
   - If the command fails, it logs stderr and exits with code `1`.

5. **Scan for copyleft licenses**
   - `copyleft` regex matches `gpl`, `agpl`, or `lgpl` (case-insensitive).
   - Iterates through all deps reported by license-checker.
   - Normalizes `licenses` into an array and checks each entry.
   - Any match is recorded as an offender.

6. **Fail on detection**
   - If any offenders exist, prints them and exits `1`.
   - Otherwise exits `0`.

### Why it’s Cross-Platform

- The original approach used `grep`, which is not available by default on Windows.
- This script runs everything in Node, which is already required by the project.
- It avoids shell pipelines and OS-specific quoting.

---

## Usage

```bash
npm run license:check
npm run precommit:check
```

On commit, Husky runs these automatically.
