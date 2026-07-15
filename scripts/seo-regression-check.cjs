const baseUrl = (process.env.SEO_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const productSlug = process.env.SEO_PRODUCT_SLUG || "beach-umbrella-set";
const noindexProductSlug = process.env.SEO_NOINDEX_PRODUCT_SLUG || "toddler-bike-lila";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  const text = await response.text();
  assert(response.ok, `${path} returned ${response.status}`);
  return text;
}

function canonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"[^>]*>/i)?.[1] || null;
}

function alternate(html, locale) {
  const links = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+>/gi)].map((match) => match[0]);
  const link = links.find((entry) => new RegExp(`hrefLang="${locale}"`, "i").test(entry));
  return link?.match(/href="([^"]+)"/i)?.[1] || null;
}

function robotsMeta(html) {
  return html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"[^>]*>/i)?.[1] || "";
}

async function main() {
  const [home, category, product, noindexProduct, robots, sitemap] = await Promise.all([
    get("/"),
    get("/rental/travel-outdoors"),
    get(`/product/${productSlug}`),
    get(`/product/${noindexProductSlug}`),
    get("/robots.txt"),
    get("/sitemap.xml"),
  ]);

  assert(canonical(home) === "https://rentanything.es", "Homepage canonical is incorrect");
  assert(
    canonical(category) === "https://rentanything.es/rental/travel-outdoors",
    "Category canonical is incorrect"
  );
  assert(
    alternate(category, "en") === "https://rentanything.es/rental/travel-outdoors",
    "Category English hreflang is incorrect"
  );
  assert(
    alternate(category, "es") === "https://rentanything.es/es/rental/travel-outdoors",
    "Category Spanish hreflang is incorrect"
  );
  assert(
    canonical(product) === `https://rentanything.es/product/${productSlug}`,
    "Product canonical is incorrect"
  );
  assert(!robotsMeta(product).includes("noindex"), "Reference product is unexpectedly noindex");
  assert(
    robotsMeta(noindexProduct).includes("noindex"),
    "Incomplete reference product is unexpectedly indexable"
  );
  assert(!robots.includes("Disallow: /_next/"), "Next.js rendering assets are blocked");
  assert(robots.includes("Disallow: /admin/"), "Admin routes are not blocked in robots.txt");
  assert(
    sitemap.includes(`https://rentanything.es/product/${productSlug}`),
    "Reference product is missing from the sitemap"
  );
  assert(!sitemap.includes("/admin/"), "Admin URL leaked into the sitemap");
  assert(!sitemap.includes("/booking/success"), "Booking success URL leaked into the sitemap");
  assert(
    !sitemap.includes(`https://rentanything.es/product/${noindexProductSlug}`),
    "Incomplete reference product leaked into the sitemap"
  );

  console.log(JSON.stringify({
    baseUrl,
    productSlug,
    noindexProductSlug,
    homepageCanonical: canonical(home),
    categoryCanonical: canonical(category),
    productCanonical: canonical(product),
    categoryAlternates: {
      en: alternate(category, "en"),
      es: alternate(category, "es"),
    },
    status: "passed",
  }, null, 2));
}

main().catch((error) => {
  console.error(`[seo-regression] ${error.message}`);
  process.exit(1);
});
