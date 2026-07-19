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
const maxAgeDays = Number(process.env.DISCOVER_SOURCE_MAX_AGE_DAYS || 180);
const now = new Date();
const issues = [];
const rows = [];

for (const destination of destinations) {
  for (const recommendation of destination.foodAndDrink?.recommendations || []) {
    const row = {
      slug: destination.slug,
      name: recommendation.name,
      sourceUrl: recommendation.sourceUrl || null,
      sourceCheckedAt: recommendation.sourceCheckedAt || null,
      ageDays: null,
    };

    if (!recommendation.sourceNote?.trim()) {
      issues.push(`${destination.slug}:${recommendation.name}:missing_source_note`);
    }

    try {
      const url = new URL(recommendation.sourceUrl);
      if (url.protocol !== "https:") {
        issues.push(`${destination.slug}:${recommendation.name}:non_https_source`);
      }
    } catch {
      issues.push(`${destination.slug}:${recommendation.name}:invalid_source_url`);
    }

    const checkedAt = new Date(`${recommendation.sourceCheckedAt}T00:00:00Z`);
    if (Number.isNaN(checkedAt.getTime())) {
      issues.push(`${destination.slug}:${recommendation.name}:invalid_checked_date`);
    } else {
      row.ageDays = Math.floor((now.getTime() - checkedAt.getTime()) / 86_400_000);
      if (row.ageDays < 0) {
        issues.push(`${destination.slug}:${recommendation.name}:future_checked_date`);
      } else if (row.ageDays > maxAgeDays) {
        issues.push(`${destination.slug}:${recommendation.name}:stale_source`);
      }
    }

    rows.push(row);
  }
}

const report = {
  publishedGuides: destinations.length,
  guidesWithRecommendations: new Set(rows.map((row) => row.slug)).size,
  recommendations: rows.length,
  maxAgeDays,
  issues,
  rows,
};

console.log(JSON.stringify(report, null, 2));
if (issues.length > 0) process.exitCode = 1;
