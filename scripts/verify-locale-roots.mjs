import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, ".next/prerender-manifest.json"), "utf8"));
for (const route of ["/", "/es", "/product/stroller-travel-compact", "/es/product/stroller-travel-compact", "/rental/baby-gear", "/es/rental/baby-gear", "/valencia/kits", "/es/valencia/kits"]) {
  assert.ok(manifest.routes[route], `${route} must remain prerendered`);
}
let checked = 0;
for (const route of Object.keys(manifest.routes)) {
  if (route === "/_global-error" || route === "/_not-found") continue; // Next-generated framework fallbacks, outside locale roots.
  assert.ok(!route.startsWith("/internal/localization/"), "Private drafts must not be prerendered");
  const file = path.join(root, ".next/server/app", `${route === "/" ? "index" : route.slice(1)}.html`);
  if (!fs.existsSync(file)) continue; // Icons and metadata handlers have non-HTML artifacts.
  const html = fs.readFileSync(file, "utf8");
  const expected = route === "/es" || route.startsWith("/es/") ? "es" : "en";
  const actual = html.match(/<html\b[^>]*\blang="([^"]+)"/)?.[1];
  assert.equal(actual, expected, `Server language for ${route}`);
  assert.ok(!html.includes("document.documentElement.lang="), `No hydration-time language rewrite for ${route}`);
  checked++;
}
assert.ok(checked > 0, "No rendered HTML was inspected");
console.log(JSON.stringify({ renderedPagesChecked: checked, staticRoutes: Object.keys(manifest.routes).length, privateDraftsPrerendered: false }));
