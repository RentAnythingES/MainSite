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
const getDestinationGovernance = moduleShim.exports.getDestinationGovernance;
const maxAgeDays = Number(process.env.DISCOVER_SOURCE_MAX_AGE_DAYS || 180);
const now = new Date();
const issues = [];
const rows = [];
const governanceRows = [];
const validHubTypes = new Set(["neighbourhoods", "beaches", "day-trips", "attractions", "events"]);

function getDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function getAgeDays(value) {
  const date = getDate(value);
  return Number.isNaN(date.getTime())
    ? null
    : Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}

for (const destination of destinations) {
  if (!Array.isArray(destination.hubs) || destination.hubs.length === 0) {
    issues.push(`${destination.slug}:missing_hub_membership`);
  } else {
    for (const hub of destination.hubs) {
      if (!validHubTypes.has(hub)) issues.push(`${destination.slug}:invalid_hub:${hub}`);
    }
  }
  if (destination.type === "beach" && !destination.hubs.includes("beaches")) {
    issues.push(`${destination.slug}:beach_outside_beaches_hub`);
  }
  if (destination.type !== "beach" && destination.hubs.includes("beaches")) {
    issues.push(`${destination.slug}:non_beach_in_beaches_hub`);
  }

  const governance = getDestinationGovernance(destination.slug);
  const governanceRow = {
    slug: destination.slug,
    refreshClass: governance?.refreshClass || null,
    contentReviewedAt: governance?.contentReviewedAt || null,
    nextReviewAt: governance?.nextReviewAt || null,
    sources: governance?.sources?.length || 0,
  };

  if (!governance) {
    issues.push(`${destination.slug}:missing_guide_governance`);
  } else {
    if (!["evergreen", "six-month", "annual-event", "seasonal"].includes(governance.refreshClass)) {
      issues.push(`${destination.slug}:invalid_refresh_class`);
    }

    const reviewedAt = getDate(governance.contentReviewedAt);
    if (Number.isNaN(reviewedAt.getTime())) {
      issues.push(`${destination.slug}:invalid_content_reviewed_date`);
    } else if (reviewedAt > now) {
      issues.push(`${destination.slug}:future_content_reviewed_date`);
    }

    const nextReviewAt = getDate(governance.nextReviewAt);
    if (Number.isNaN(nextReviewAt.getTime())) {
      issues.push(`${destination.slug}:invalid_next_review_date`);
    } else if (nextReviewAt < now) {
      issues.push(`${destination.slug}:guide_review_overdue`);
    }

    if (!Array.isArray(governance.sources) || governance.sources.length === 0) {
      issues.push(`${destination.slug}:missing_guide_sources`);
    }

    for (const source of governance.sources || []) {
      const sourceKey = `${destination.slug}:${source.label || "unnamed-source"}`;
      if (!source.label?.trim()) issues.push(`${sourceKey}:missing_label`);
      if (!source.publisher?.trim()) issues.push(`${sourceKey}:missing_publisher`);
      if (!Array.isArray(source.supports) || source.supports.length === 0) {
        issues.push(`${sourceKey}:missing_supported_claims`);
      }

      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:") issues.push(`${sourceKey}:non_https_source`);
      } catch {
        issues.push(`${sourceKey}:invalid_source_url`);
      }

      const ageDays = getAgeDays(source.checkedAt);
      if (ageDays === null) {
        issues.push(`${sourceKey}:invalid_checked_date`);
      } else if (ageDays < 0) {
        issues.push(`${sourceKey}:future_checked_date`);
      } else if (ageDays > maxAgeDays) {
        issues.push(`${sourceKey}:stale_source`);
      }
    }
  }

  governanceRows.push(governanceRow);

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
  governedGuides: governanceRows.filter((row) => row.sources > 0).length,
  guidesWithRecommendations: new Set(rows.map((row) => row.slug)).size,
  recommendations: rows.length,
  maxAgeDays,
  issues,
  governanceRows,
  rows,
};

console.log(JSON.stringify(report, null, 2));
if (issues.length > 0) process.exitCode = 1;
