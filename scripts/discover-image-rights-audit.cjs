/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const sourcePath = path.join(process.cwd(), "src", "content", "destinations.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const moduleShim = { exports: {} };
new Function("exports", "module", "require", compiled)(moduleShim.exports, moduleShim, require);

const destinations = moduleShim.exports.getPublishedDestinations();
const issues = [];
const licensed = [];
const unverified = [];

for (const destination of destinations) {
  const provenance = destination.heroImageProvenance;
  const prefix = destination.slug;

  if (!destination.heroImage) {
    issues.push(`${prefix}:missing_hero_image`);
    continue;
  }

  const localPath = path.join(process.cwd(), "public", destination.heroImage.replace(/^\//, ""));
  if (!fs.existsSync(localPath)) {
    issues.push(`${prefix}:missing_local_image`);
  }

  if (!provenance || !["licensed", "unverified"].includes(provenance.status)) {
    issues.push(`${prefix}:missing_provenance_status`);
    continue;
  }

  if (provenance.status === "unverified") {
    unverified.push(destination.slug);
    issues.push(`${prefix}:unverified_provenance`);
    continue;
  }

  for (const field of [
    "creator",
    "sourceUrl",
    "license",
    "licenseUrl",
    "verifiedAt",
    "modifications",
  ]) {
    if (!provenance[field]?.trim()) {
      issues.push(`${prefix}:missing_${field}`);
    }
  }

  for (const field of ["sourceUrl", "licenseUrl"]) {
    try {
      const url = new URL(provenance[field]);
      if (url.protocol !== "https:") issues.push(`${prefix}:non_https_${field}`);
    } catch {
      issues.push(`${prefix}:invalid_${field}`);
    }
  }

  const verifiedAt = new Date(`${provenance.verifiedAt}T00:00:00Z`);
  if (Number.isNaN(verifiedAt.getTime())) {
    issues.push(`${prefix}:invalid_verified_date`);
  }

  licensed.push(destination.slug);
}

const report = {
  publishedGuides: destinations.length,
  licensedImages: licensed.length,
  unverifiedImages: unverified.length,
  licensed,
  unverified,
  issues,
};

console.log(JSON.stringify(report, null, 2));
if (issues.length > 0) process.exitCode = 1;
