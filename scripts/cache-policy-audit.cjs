/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const appRoot = path.join(projectRoot, "src", "app");
const violations = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function check(filePath, pattern, message) {
  if (pattern.test(fs.readFileSync(filePath, "utf8"))) {
    violations.push(`${path.relative(projectRoot, filePath)}: ${message}`);
  }
}

for (const filePath of walk(appRoot)) {
  const relativePath = path.relative(appRoot, filePath);
  const isPublicPage = filePath.endsWith(`${path.sep}page.tsx`) &&
    !relativePath.startsWith(`admin${path.sep}`);
  const isSitemap = relativePath === "sitemap.ts";

  if (isPublicPage || isSitemap) {
    check(filePath, /export\s+const\s+revalidate\s*=/, "use mutation-triggered invalidation instead of a polling TTL");
  }
}

check(
  path.join(projectRoot, "src", "lib", "product-service.ts"),
  /\brevalidate\s*:/,
  "product data must remain cached until the public-products tag is invalidated",
);

for (const productPage of [
  path.join(appRoot, "product", "[slug]", "page.tsx"),
  path.join(appRoot, "es", "product", "[slug]", "page.tsx"),
]) {
  check(productPage, /force-dynamic/, "product content must be static/on-demand; live availability belongs in the API");
}

if (violations.length) {
  console.error("Cache policy audit failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Cache policy audit passed: public content has no polling TTLs.");
