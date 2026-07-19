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
const stayingTypes = new Set(["neighbourhood"]);
const visitingTypes = new Set(["neighbourhood", "beach", "attraction", "day-trip", "event", "natural-area"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasCompleteStayingSection(destination) {
  return Boolean(
    destination.stayingHere &&
    isNonEmptyString(destination.stayingHere.summary) &&
    destination.stayingHere.pros?.length > 0 &&
    destination.stayingHere.cons?.length > 0 &&
    Array.isArray(destination.stayingHere.gettingElsewhere),
  );
}

function hasCompleteVisitingSection(destination) {
  return Boolean(
    destination.visitingHere &&
    isNonEmptyString(destination.visitingHere.summary) &&
    isNonEmptyString(destination.visitingHere.idealDuration) &&
    isNonEmptyString(destination.visitingHere.bestTimeOfDay) &&
    destination.visitingHere.tips?.length > 0,
  );
}

const rows = destinations.map((destination) => ({
  slug: destination.slug,
  type: destination.type,
  requiresStaying: stayingTypes.has(destination.type),
  hasStaying: hasCompleteStayingSection(destination),
  requiresVisiting: visitingTypes.has(destination.type),
  hasVisiting: hasCompleteVisitingSection(destination),
}));

const issues = rows.flatMap((row) => {
  const rowIssues = [];
  if (row.requiresStaying && !row.hasStaying) rowIssues.push(`${row.slug}:missing_staying`);
  if (row.requiresVisiting && !row.hasVisiting) rowIssues.push(`${row.slug}:missing_visiting`);
  return rowIssues;
});

console.log(JSON.stringify({
  publishedGuides: rows.length,
  guidesRequiringStaying: rows.filter((row) => row.requiresStaying).length,
  completeStayingGuides: rows.filter((row) => row.requiresStaying && row.hasStaying).length,
  guidesRequiringVisiting: rows.filter((row) => row.requiresVisiting).length,
  completeVisitingGuides: rows.filter((row) => row.requiresVisiting && row.hasVisiting).length,
  issues,
  rows,
}, null, 2));

if (issues.length > 0) process.exit(1);
