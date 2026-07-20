/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadModule(fileName) {
  const source = fs.readFileSync(path.join(process.cwd(), "src", "content", fileName), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText.replace(/require\("@\/content\/destinations"\)/g, "require('./destinations')");
  const moduleShim = { exports: {} };
  new Function("exports", "module", "require", compiled)(
    moduleShim.exports,
    moduleShim,
    (request) => request === "./destinations" ? modules.destinations : require(request),
  );
  return moduleShim.exports;
}

const modules = {};
modules.destinations = loadModule("destinations.ts");
modules.spanish = loadModule("destinations-es.ts");

const englishGuides = modules.destinations.getPublishedDestinations();
const spanishGuides = modules.spanish.getPublishedSpanishDestinations();
const englishBySlug = new Map(englishGuides.map((guide) => [guide.slug, guide]));
const spanishSlugs = new Set();
const issues = [];
const rows = [];
const localizedHubRoutes = new Set(["neighbourhoods", "beaches", "attractions", "day-trips", "events"]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

for (const guide of spanishGuides) {
  const englishGuide = englishBySlug.get(guide.slug);
  const primaryHub = englishGuide?.hubs?.[0] || null;
  const row = {
    slug: guide.slug,
    type: englishGuide?.type || null,
    primaryHub,
    overviewParagraphs: guide.overview?.length || 0,
    sections: guide.sections?.length || 0,
    practicalTips: guide.practicalTips?.length || 0,
    faqs: guide.faqs?.length || 0,
  };

  if (spanishSlugs.has(guide.slug)) issues.push(`${guide.slug}:duplicate_spanish_slug`);
  spanishSlugs.add(guide.slug);
  if (!englishGuide) issues.push(`${guide.slug}:missing_english_guide`);
  if (!primaryHub || !localizedHubRoutes.has(primaryHub)) {
    issues.push(`${guide.slug}:missing_localized_primary_hub:${primaryHub || "none"}`);
  }
  for (const field of ["name", "title", "description", "tagline", "heroImage", "heroImageAlt", "region"]) {
    if (!hasText(guide[field])) issues.push(`${guide.slug}:missing_${field}`);
  }
  if (guide.overview?.length < 2) issues.push(`${guide.slug}:thin_overview`);
  if (guide.sections?.length < 3) issues.push(`${guide.slug}:thin_sections`);
  if (guide.practicalTips?.length < 3) issues.push(`${guide.slug}:thin_practical_tips`);
  if (guide.faqs?.length < 3) issues.push(`${guide.slug}:thin_faqs`);
  if (englishGuide && guide.title.trim() === englishGuide.title.trim()) {
    issues.push(`${guide.slug}:unlocalized_title`);
  }
  if (englishGuide && guide.description.trim() === englishGuide.description.trim()) {
    issues.push(`${guide.slug}:unlocalized_description`);
  }
  for (const relatedSlug of guide.relatedGuides || []) {
    if (!englishBySlug.has(relatedSlug)) issues.push(`${guide.slug}:unknown_related_guide:${relatedSlug}`);
  }
  rows.push(row);
}

console.log(JSON.stringify({
  englishGuides: englishGuides.length,
  spanishGuides: spanishGuides.length,
  localizedHubs: [...localizedHubRoutes],
  issues,
  rows,
}, null, 2));

if (issues.length > 0) process.exit(1);
