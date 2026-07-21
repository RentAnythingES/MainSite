/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.local");
const publicCategories = new Set([
  "baby-gear",
  "kids-family",
  "mobility",
  "remote-work",
  "home-living",
  "travel-outdoors",
]);

function loadEnvironment() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

function getLegacySlugs() {
  const source = fs.readFileSync(path.join(projectRoot, "src/data/products.ts"), "utf8");
  return new Set([...source.matchAll(/^\s+slug:\s+"([^"]+)",/gm)].map((match) => match[1]));
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUsableImage(value) {
  const imageUrl = String(value || "").trim();
  return (
    (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) ||
    /^https?:\/\//i.test(imageUrl)
  ) && imageUrl !== "/products/placeholder.png";
}

function evaluateProduct(product, legacySlugs) {
  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  const categorySlug = category?.slug || "uncategorized";
  const english = product.product_localizations.find((localization) => localization.locale === "en");
  const spanish = product.product_localizations.find((localization) => localization.locale === "es");
  const blockersEn = [];

  if (!product.is_active) blockersEn.push("inactive");
  if (!publicCategories.has(categorySlug)) blockersEn.push("unsupported_category");
  if (!hasText(product.name) || !hasText(product.description)) blockersEn.push("missing_core_copy");
  if (!hasUsableImage(product.image_url)) blockersEn.push("missing_usable_image");
  if (product.pricing_tiers.length === 0) blockersEn.push("missing_pricing");
  if (!legacySlugs.has(product.slug) && product.content_status !== "content_ready") {
    blockersEn.push("editorial_approval");
  }

  const indexableEn = blockersEn.length === 0;
  const blockersEs = [...blockersEn];
  if (!legacySlugs.has(product.slug) && product.content_status !== "content_ready") blockersEs.push("content_not_ready");
  if (!spanish || !hasText(spanish.short_description) || !hasText(spanish.seo_title) || !hasText(spanish.seo_description)) {
    blockersEs.push("missing_spanish_seo");
  }

  return {
    slug: product.slug,
    category: categorySlug,
    contentStatus: product.content_status,
    indexableEn,
    indexableEs: indexableEn && blockersEs.length === 0,
    blockersEn,
    blockersEs: [...new Set(blockersEs)],
    hasEnglishSeo: Boolean(english && hasText(english.seo_title) && hasText(english.seo_description)),
  };
}

function incrementReason(target, reason) {
  target[reason] = (target[reason] || 0) + 1;
}

async function main() {
  loadEnvironment();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are missing");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase
    .from("products")
    .select(`
      slug,
      name,
      description,
      image_url,
      is_active,
      content_status,
      category:categories (slug),
      pricing_tiers (min_days),
      product_localizations (locale, short_description, seo_title, seo_description),
      product_images (is_primary, rights_status)
    `)
    .order("slug");
  if (error) throw error;

  const legacySlugs = getLegacySlugs();
  const products = (data || []).map((product) => evaluateProduct(product, legacySlugs));
  const clusters = {};
  const blockerTotals = { en: {}, es: {} };

  for (const product of products) {
    clusters[product.category] ||= { total: 0, active: 0, indexableEn: 0, indexableEs: 0 };
    clusters[product.category].total += 1;
    if (!product.blockersEn.includes("inactive")) clusters[product.category].active += 1;
    if (product.indexableEn) clusters[product.category].indexableEn += 1;
    if (product.indexableEs) clusters[product.category].indexableEs += 1;
    product.blockersEn.forEach((reason) => incrementReason(blockerTotals.en, reason));
    product.blockersEs.forEach((reason) => incrementReason(blockerTotals.es, reason));
  }

  const blockedActiveProducts = products
    .filter((product) => !product.blockersEn.includes("inactive") && !product.indexableEn)
    .map(({ slug, category, contentStatus, blockersEn, blockersEs }) => ({
      slug,
      category,
      contentStatus,
      blockersEn,
      blockersEs,
    }));
  const activeProducts = products
    .filter((product) => !product.blockersEn.includes("inactive"))
    .map(({ slug, category, contentStatus, indexableEn, indexableEs, blockersEn, blockersEs, hasEnglishSeo }) => ({
      slug,
      category,
      contentStatus,
      indexableEn,
      indexableEs,
      hasEnglishSeo,
      blockersEn,
      blockersEs,
    }));

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    totals: {
      products: products.length,
      active: products.filter((product) => !product.blockersEn.includes("inactive")).length,
      indexableEn: products.filter((product) => product.indexableEn).length,
      indexableEs: products.filter((product) => product.indexableEs).length,
    },
    clusters,
    blockerTotals,
    activeProducts,
    blockedActiveProducts,
  }, null, 2));
}

main().catch((error) => {
  console.error(`[product-seo-readiness] ${error.message}`);
  process.exit(1);
});
