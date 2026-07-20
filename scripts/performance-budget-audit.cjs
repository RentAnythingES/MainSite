/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const zlib = require("zlib");

const baseUrl = (process.env.PERFORMANCE_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const outputPath = process.env.PERFORMANCE_AUDIT_OUTPUT;
const routes = (process.env.PERFORMANCE_ROUTES || [
  "/",
  "/rental/travel-outdoors",
  "/product/beach-umbrella-set",
  "/valencia/kits/family-beach-kit",
  "/discover/malvarrosa-beach",
  "/discover/ruzafa",
].join(","))
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const budgets = {
  htmlBytes: Number(process.env.PERFORMANCE_HTML_BUDGET || 150_000),
  htmlTransferBytes: Number(process.env.PERFORMANCE_HTML_TRANSFER_BUDGET || 30_000),
  scriptBytes: Number(process.env.PERFORMANCE_SCRIPT_BUDGET || 800_000),
  stylesheetBytes: Number(process.env.PERFORMANCE_STYLESHEET_BUDGET || 120_000),
  preloadImageBytes: Number(process.env.PERFORMANCE_PRELOAD_IMAGE_BUDGET || 150_000),
  responseTimeMs: Number(process.env.PERFORMANCE_RESPONSE_TIME_BUDGET || 2_000),
};

function decodeEntities(value) {
  return String(value || "").replace(/&amp;/g, "&");
}

function extractAttribute(tag, attribute) {
  return decodeEntities(tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, "i"))?.[1] || "");
}

function extractResources(html) {
  const scripts = (html.match(/<script\b[^>]*src=["'][^"']+["'][^>]*>/gi) || [])
    .map((tag) => extractAttribute(tag, "src"));
  const links = html.match(/<link\b[^>]*>/gi) || [];
  const stylesheets = links
    .filter((tag) => /\brel=["']stylesheet["']/i.test(tag))
    .map((tag) => extractAttribute(tag, "href"));
  const preloadImages = links
    .filter((tag) => /\brel=["']preload["']/i.test(tag) && /\bas=["']image["']/i.test(tag))
    .map((tag) => extractAttribute(tag, "href"));
  return { scripts, stylesheets, preloadImages };
}

function normalizeResource(resource) {
  try {
    const url = new URL(resource, baseUrl);
    return url.origin === new URL(baseUrl).origin ? url.toString() : null;
  } catch {
    return null;
  }
}

async function fetchResource(url) {
  const startedAt = performance.now();
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "accept-encoding": "identity",
      "user-agent": "RentAnythingPerformanceBudgetAudit/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  });
  const body = Buffer.from(await response.arrayBuffer());
  return {
    url,
    status: response.status,
    bytes: body.length,
    responseTimeMs: Math.round(performance.now() - startedAt),
    contentType: response.headers.get("content-type") || "",
    cacheControl: response.headers.get("cache-control") || "",
    body,
  };
}

async function inspectPage(route) {
  const pageUrl = new URL(route, `${baseUrl}/`).toString();
  const document = await fetchResource(pageUrl);
  const html = document.body.toString("utf8");
  const htmlTransferBytes = zlib.gzipSync(document.body).length;
  const resources = extractResources(html);
  const resourceGroups = {};

  for (const [groupName, candidates] of Object.entries(resources)) {
    const urls = [...new Set(candidates.map(normalizeResource).filter(Boolean))];
    resourceGroups[groupName] = await Promise.all(urls.map(fetchResource));
  }

  const scriptBytes = resourceGroups.scripts.reduce((total, resource) => total + resource.bytes, 0);
  const stylesheetBytes = resourceGroups.stylesheets.reduce((total, resource) => total + resource.bytes, 0);
  const largestPreloadImageBytes = Math.max(0, ...resourceGroups.preloadImages.map((resource) => resource.bytes));
  const errors = [];
  const warnings = [];

  if (document.status < 200 || document.status >= 400) errors.push(`document_status:${document.status}`);
  if (document.bytes > budgets.htmlBytes) errors.push(`html_budget_exceeded:${document.bytes}`);
  if (htmlTransferBytes > budgets.htmlTransferBytes) errors.push(`html_transfer_budget_exceeded:${htmlTransferBytes}`);
  if (scriptBytes > budgets.scriptBytes) errors.push(`script_budget_exceeded:${scriptBytes}`);
  if (stylesheetBytes > budgets.stylesheetBytes) errors.push(`stylesheet_budget_exceeded:${stylesheetBytes}`);
  if (largestPreloadImageBytes > budgets.preloadImageBytes) errors.push(`preload_image_budget_exceeded:${largestPreloadImageBytes}`);
  if (document.responseTimeMs > budgets.responseTimeMs) warnings.push(`response_time_budget_exceeded:${document.responseTimeMs}`);

  for (const resource of Object.values(resourceGroups).flat()) {
    if (resource.status < 200 || resource.status >= 400) errors.push(`resource_status:${resource.status}:${resource.url}`);
    if (resource.url.includes("/_next/static/") && !/immutable/i.test(resource.cacheControl)) {
      errors.push(`static_resource_not_immutable:${resource.url}`);
    }
  }

  return {
    route,
    url: pageUrl,
    document: {
      status: document.status,
      bytes: document.bytes,
      transferBytes: htmlTransferBytes,
      responseTimeMs: document.responseTimeMs,
      cacheControl: document.cacheControl,
    },
    resourceCounts: Object.fromEntries(Object.entries(resourceGroups).map(([name, entries]) => [name, entries.length])),
    totals: { scriptBytes, stylesheetBytes, largestPreloadImageBytes },
    errors,
    warnings,
  };
}

async function main() {
  const pages = [];
  for (const route of routes) pages.push(await inspectPage(route));

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    budgets,
    summary: {
      pages: pages.length,
      pagesWithErrors: pages.filter((page) => page.errors.length).length,
      pagesWithWarnings: pages.filter((page) => page.warnings.length).length,
      maxHtmlBytes: Math.max(...pages.map((page) => page.document.bytes)),
      maxHtmlTransferBytes: Math.max(...pages.map((page) => page.document.transferBytes)),
      maxScriptBytes: Math.max(...pages.map((page) => page.totals.scriptBytes)),
      maxStylesheetBytes: Math.max(...pages.map((page) => page.totals.stylesheetBytes)),
      maxPreloadImageBytes: Math.max(...pages.map((page) => page.totals.largestPreloadImageBytes)),
      maxResponseTimeMs: Math.max(...pages.map((page) => page.document.responseTimeMs)),
    },
    pages,
  };

  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary, null, 2));
  for (const page of pages) {
    for (const error of page.errors) console.error(`${page.route}:${error}`);
    for (const warning of page.warnings) console.warn(`${page.route}:${warning}`);
  }
  if (report.summary.pagesWithErrors) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[performance-budget-audit] ${error.message}`);
  process.exit(1);
});
