const baseUrl = (process.env.SEO_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const productSlug = process.env.SEO_PRODUCT_SLUG || "beach-umbrella-set";
const noindexProductSlug = process.env.SEO_NOINDEX_PRODUCT_SLUG || "toddler-bike-lila";
const productCategory = process.env.SEO_PRODUCT_CATEGORY || "travel-outdoors";

const categoryChecks = [
  {
    slug: "baby-gear",
    pathways: ["/valencia/kits/baby-arrival-kit", "/blog/valencia-with-kids-complete-guide"],
  },
  {
    slug: "kids-family",
    pathways: ["/valencia/kits/toddler-city-kit", "/valencia/kits/family-beach-kit"],
  },
  {
    slug: "mobility",
    pathways: ["/valencia/kits/accessible-valencia-kit", "/blog/wheelchair-accessibility-valencia"],
  },
  {
    slug: "remote-work",
    pathways: ["/valencia/kits/remote-work-apartment-kit", "/blog/digital-nomad-guide-valencia"],
  },
  {
    slug: "home-living",
    pathways: ["/valencia/kits/summer-apartment-survival-kit", "/blog/valencia-summer-survival-guide"],
  },
  {
    slug: "travel-outdoors",
    pathways: ["/valencia/kits/family-beach-kit", "/discover/malvarrosa-beach"],
  },
];

const productPathways = Object.fromEntries(
  categoryChecks.map((category) => [category.slug, category.pathways])
);

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

function assertPathway(html, pathway, context) {
  assert(html.includes(`href="${pathway}"`), `${context} is missing pathway ${pathway}`);
}

async function main() {
  const [home, product, productEs, noindexProduct, robots, sitemap, categoryPages] = await Promise.all([
    get("/"),
    get(`/product/${productSlug}`),
    get(`/es/product/${productSlug}`),
    get(`/product/${noindexProductSlug}`),
    get("/robots.txt"),
    get("/sitemap.xml"),
    Promise.all(
      categoryChecks.map(async (categoryCheck) => ({
        ...categoryCheck,
        en: await get(`/rental/${categoryCheck.slug}`),
        es: await get(`/es/rental/${categoryCheck.slug}`),
      }))
    ),
  ]);

  assert(canonical(home) === "https://rentanything.es", "Homepage canonical is incorrect");
  for (const categoryPage of categoryPages) {
    const englishUrl = `https://rentanything.es/rental/${categoryPage.slug}`;
    const spanishUrl = `https://rentanything.es/es/rental/${categoryPage.slug}`;
    assert(canonical(categoryPage.en) === englishUrl, `${categoryPage.slug} English canonical is incorrect`);
    assert(canonical(categoryPage.es) === spanishUrl, `${categoryPage.slug} Spanish canonical is incorrect`);
    assert(alternate(categoryPage.en, "en") === englishUrl, `${categoryPage.slug} English hreflang is incorrect`);
    assert(alternate(categoryPage.en, "es") === spanishUrl, `${categoryPage.slug} Spanish hreflang is incorrect`);
    assert(alternate(categoryPage.es, "en") === englishUrl, `${categoryPage.slug} Spanish page lacks English hreflang`);
    assert(alternate(categoryPage.es, "es") === spanishUrl, `${categoryPage.slug} Spanish page lacks Spanish hreflang`);

    for (const pathway of categoryPage.pathways) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
      assertPathway(categoryPage.es, pathway, `${categoryPage.slug} Spanish category`);
    }
  }
  assert(
    canonical(product) === `https://rentanything.es/product/${productSlug}`,
    "Product canonical is incorrect"
  );
  assert(!robotsMeta(product).includes("noindex"), "Reference product is unexpectedly noindex");
  assert(
    canonical(productEs) === `https://rentanything.es/es/product/${productSlug}`,
    "Spanish reference product canonical is incorrect"
  );
  assert(!robotsMeta(productEs).includes("noindex"), "Spanish reference product is unexpectedly noindex");
  assert(
    alternate(productEs, "en") === `https://rentanything.es/product/${productSlug}`,
    "Spanish reference product lacks English hreflang"
  );
  assert(
    alternate(productEs, "es") === `https://rentanything.es/es/product/${productSlug}`,
    "Spanish reference product lacks Spanish hreflang"
  );
  assertPathway(product, `/rental/${productCategory}`, "Reference product");
  for (const pathway of productPathways[productCategory] || []) {
    assertPathway(product, pathway, "Reference product");
  }
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
  assert(
    sitemap.includes(`https://rentanything.es/es/product/${productSlug}`),
    "Spanish reference product is missing from the sitemap"
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
    productCanonical: canonical(product),
    spanishProductCanonical: canonical(productEs),
    productCategory,
    checkedCategoryClusters: categoryPages.map((categoryPage) => categoryPage.slug),
    status: "passed",
  }, null, 2));
}

main().catch((error) => {
  console.error(`[seo-regression] ${error.message}`);
  process.exit(1);
});
