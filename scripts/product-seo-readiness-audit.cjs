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
  "fitness-wellness",
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

function normalizedMeasurementText(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replace(/\s+/g, " ");
}

function extractInchSizes(value) {
  return [...normalizedMeasurementText(value).matchAll(/(\d+(?:\.\d+)?)\s*(?:inch|inches|pulgadas)\b/g)]
    .map((match) => match[1]);
}

function findIdentityIssues(product) {
  const headlineSizes = extractInchSizes(product.name);
  if (headlineSizes.length !== 1) return [];

  const expected = headlineSizes[0];
  const fields = [
    ["slug", product.slug.replaceAll("-", " ")],
    ["spec:Screen", product.specs?.Screen],
    ...product.product_localizations.flatMap((localization) => [
      [`${localization.locale}:short_description`, localization.short_description],
      [`${localization.locale}:detail_description`, localization.detail_description],
      [`${localization.locale}:seo_title`, localization.seo_title],
      [`${localization.locale}:seo_description`, localization.seo_description],
    ]),
  ];

  return fields.flatMap(([field, value]) => {
    const actual = extractInchSizes(value);
    if (actual.length === 0 || actual.includes(expected)) return [];
    return [{ field, expected: `${expected} inch`, actual: actual.map((size) => `${size} inch`) }];
  });
}

const internalCopyPatterns = [
  /before activation|antes de la activaci[oó]n/i,
  /rentanything must|rentanything debe|rent&roll must|rent&roll debe/i,
  /submitted url|url submitted|url proporcionada|url enviada/i,
  /physical approval|physical verification|physically verified|verificaci[oó]n f[ií]sica|verificado f[ií]sicamente/i,
  /import queue|activation queue|cola de importaci[oó]n|cola de activaci[oó]n/i,
  /internal review|editorial review|revisi[oó]n interna|revisi[oó]n editorial/i,
  /exact physical contents|contenido f[ií]sico exacto/i,
  /not selected in|no seleccionado en/i,
  /why did one description|por qu[eé] una descripci[oó]n/i,
];

function findInternalCopyIssues(product) {
  const fields = [
    ["description", product.description],
    ["features", JSON.stringify(product.features)],
    ["specs", JSON.stringify(product.specs)],
    ...product.product_localizations.flatMap((localization) =>
      Object.entries(localization)
        .filter(([key]) => key !== "locale")
        .map(([key, value]) => [`${localization.locale}:${key}`, value])
    ),
    ...product.product_faqs.flatMap((faq, index) => [
      [`${faq.locale}:faq:${index}:question`, faq.question],
      [`${faq.locale}:faq:${index}:answer`, faq.answer],
    ]),
  ];

  return fields.flatMap(([field, value]) => {
    const text = String(value || "");
    return internalCopyPatterns
      .filter((pattern) => pattern.test(text))
      .map((pattern) => ({ field, pattern: pattern.source }));
  });
}

function evaluateProduct(product, legacySlugs) {
  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  const categorySlug = category?.slug || "uncategorized";
  const isLegacyProduct = legacySlugs.has(product.slug);
  const english = product.product_localizations.find((localization) => localization.locale === "en");
  const spanish = product.product_localizations.find((localization) => localization.locale === "es");
  const faqCountEn = product.product_faqs.filter((faq) => faq.locale === "en").length;
  const faqCountEs = product.product_faqs.filter((faq) => faq.locale === "es").length;
  const identityIssues = findIdentityIssues(product);
  const internalCopyIssues = findInternalCopyIssues(product);
  const blockersEn = [];

  if (!product.is_active) blockersEn.push("inactive");
  if (!publicCategories.has(categorySlug)) blockersEn.push("unsupported_category");
  if (!hasText(product.name) || !hasText(product.description)) blockersEn.push("missing_core_copy");
  if (!hasUsableImage(product.image_url)) blockersEn.push("missing_usable_image");
  if (product.pricing_tiers.length === 0) blockersEn.push("missing_pricing");
  if (!isLegacyProduct && product.content_status !== "content_ready") {
    blockersEn.push("editorial_approval");
  }

  const indexableEn = blockersEn.length === 0;
  const blockersEs = [...blockersEn];
  if (!isLegacyProduct && product.content_status !== "content_ready") blockersEs.push("content_not_ready");
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
    faqCountEn,
    faqCountEs,
    faqCoverageRequired: !isLegacyProduct && product.content_status === "content_ready",
    identityIssues,
    internalCopyIssues,
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
      features,
      image_url,
      specs,
      is_active,
      content_status,
      category:categories!products_category_id_fkey (slug),
      pricing_tiers (min_days),
      product_localizations (locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description),
      product_faqs (locale, question, answer),
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
    .map(({ slug, category, contentStatus, indexableEn, indexableEs, blockersEn, blockersEs, hasEnglishSeo, faqCountEn, faqCountEs }) => ({
      slug,
      category,
      contentStatus,
      indexableEn,
      indexableEs,
      hasEnglishSeo,
      faqCountEn,
      faqCountEs,
      blockersEn,
      blockersEs,
    }));
  const activeFaqGaps = products
    .filter((product) =>
      !product.blockersEn.includes("inactive") &&
      product.faqCoverageRequired &&
      (product.faqCountEn < 3 || product.faqCountEs < 3)
    )
    .map(({ slug, category, faqCountEn, faqCountEs }) => ({
      slug,
      category,
      faqCountEn,
      faqCountEs,
    }));
  const activeIdentityConflicts = products
    .filter((product) => !product.blockersEn.includes("inactive") && product.identityIssues.length > 0)
    .map(({ slug, category, identityIssues }) => ({ slug, category, identityIssues }));
  const activeInternalCopyConflicts = products
    .filter((product) => !product.blockersEn.includes("inactive") && product.internalCopyIssues.length > 0)
    .map(({ slug, category, internalCopyIssues }) => ({ slug, category, internalCopyIssues }));

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
    activeFaqGaps,
    activeIdentityConflicts,
    activeInternalCopyConflicts,
    blockedActiveProducts,
  }, null, 2));

  if (activeFaqGaps.length > 0) {
    console.warn(
      `[product-seo-readiness] informational: ${activeFaqGaps.length} active content-ready products have fewer than three FAQs in one or both locales`
    );
  }
  if (activeIdentityConflicts.length > 0) {
    throw new Error(`${activeIdentityConflicts.length} active products have conflicting size identities`);
  }
  if (activeInternalCopyConflicts.length > 0) {
    throw new Error(`${activeInternalCopyConflicts.length} active products expose internal workflow copy`);
  }
}

main().catch((error) => {
  console.error(`[product-seo-readiness] ${error.message}`);
  process.exit(1);
});
