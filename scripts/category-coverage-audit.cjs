/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const publicCategories = new Set([
  "baby-gear",
  "kids-family",
  "mobility",
  "remote-work",
  "home-living",
  "travel-outdoors",
  "fitness-wellness",
]);

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const separator = line.indexOf("=");
  if (separator < 1) continue;
  process.env[line.slice(0, separator).trim()] = line
    .slice(separator + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { data, error } = await supabase
    .from("products")
    .select("slug,name,is_active,content_status,stock_total,stock_available,category:categories(slug,name)")
    .order("name");

  if (error) throw error;

  const categories = new Map();
  for (const product of data) {
    const category = Array.isArray(product.category) ? product.category[0] : product.category;
    const slug = category?.slug || "uncategorized";
    const current = categories.get(slug) || {
      slug,
      name: category?.name || "Uncategorized",
      supported: publicCategories.has(slug),
      total: 0,
      active: 0,
      products: [],
    };
    current.total += 1;
    if (product.is_active) current.active += 1;
    current.products.push({
      slug: product.slug,
      name: product.name,
      active: product.is_active,
      contentStatus: product.content_status,
      stock: `${product.stock_available}/${product.stock_total}`,
    });
    categories.set(slug, current);
  }

  console.log(JSON.stringify({
    categories: [...categories.values()].sort((a, b) => a.slug.localeCompare(b.slug)),
    activeUnsupportedProducts: [...categories.values()]
      .filter((category) => !category.supported)
      .flatMap((category) => category.products
        .filter((product) => product.active)
        .map((product) => ({ category: category.slug, ...product }))),
  }, null, 2));
}

main().catch((error) => {
  console.error("[category-coverage-audit]", error);
  process.exit(1);
});
