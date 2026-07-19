const baseUrl = (process.env.SEO_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const productSlug = process.env.SEO_PRODUCT_SLUG || "beach-umbrella-set";
const noindexProductSlug = process.env.SEO_NOINDEX_PRODUCT_SLUG || "toddler-bike-lila";
const productCategory = process.env.SEO_PRODUCT_CATEGORY || "travel-outdoors";

const discoverHierarchyChecks = [
  { hub: "neighbourhoods", child: "ruzafa" },
  { hub: "day-trips", child: "albufera" },
  { hub: "attractions", child: "city-of-arts-and-sciences" },
  { hub: "events", child: "fallas" },
];

const categoryChecks = [
  {
    slug: "baby-gear",
    pathways: ["/valencia/kits/baby-arrival-kit"],
    englishPathways: ["/blog/valencia-with-kids-complete-guide"],
    spanishPathways: ["/es/blog/valencia-with-kids-complete-guide"],
    requiredEnglishText: ["Baby Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de material de bebé en Valencia"],
    requiredSchemaTypes: ["FAQPage"],
  },
  {
    slug: "kids-family",
    pathways: ["/valencia/kits/toddler-city-kit", "/valencia/kits/family-beach-kit"],
    englishPathways: ["/blog/valencia-with-kids-complete-guide"],
    spanishPathways: ["/es/blog/valencia-with-kids-complete-guide"],
  },
  {
    slug: "mobility",
    pathways: ["/valencia/kits/accessible-valencia-kit"],
    englishPathways: ["/blog/wheelchair-accessibility-valencia"],
    spanishPathways: ["/es/blog/wheelchair-accessibility-valencia"],
    requiredEnglishText: ["Mobility Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de movilidad en Valencia"],
    requiredSchemaTypes: ["FAQPage"],
  },
  {
    slug: "remote-work",
    pathways: ["/valencia/kits/remote-work-apartment-kit"],
    englishPathways: ["/blog/digital-nomad-guide-valencia"],
    spanishPathways: ["/es/blog/digital-nomad-guide-valencia"],
    requiredEnglishText: ["Remote Work Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de equipos de teletrabajo"],
    requiredSchemaTypes: ["FAQPage"],
  },
  {
    slug: "home-living",
    pathways: ["/valencia/kits/summer-apartment-survival-kit"],
    categoryOnlyPathways: ["/valencia/kits/long-stay-kitchen-upgrade-kit"],
    englishPathways: ["/blog/valencia-summer-survival-guide"],
    spanishPathways: ["/es/blog/valencia-summer-survival-guide"],
    requiredEnglishText: ["Portable AC and Apartment Equipment Rental: FAQs"],
    requiredSpanishText: ["Preguntas sobre aire acondicionado portátil y confort"],
    requiredSchemaTypes: ["FAQPage"],
  },
  {
    slug: "travel-outdoors",
    pathways: ["/valencia/kits/family-beach-kit"],
    englishPathways: ["/discover/malvarrosa-beach"],
    spanishPathways: ["/es/blog/best-beaches-valencia-families"],
    requiredEnglishText: ["Choose the Right Beach Setup", "Beach Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: [
      "Elige el equipamiento adecuado para la playa",
      "Preguntas sobre el alquiler de material de playa en Valencia",
    ],
    requiredSchemaTypes: ["FAQPage"],
  },
];

const productPathways = Object.fromEntries(categoryChecks.map((category) => [
  category.slug,
  {
    en: [...category.pathways, ...(category.englishPathways || [])],
    es: [...category.pathways, ...(category.spanishPathways || [])],
  },
]));

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

function assertPageEnhancements(html, expectedText = [], schemaTypes = [], context) {
  for (const text of expectedText) {
    assert(html.includes(text), `${context} is missing required copy: ${text}`);
  }
  for (const schemaType of schemaTypes) {
    assert(
      html.includes(`"@type":"${schemaType}"`),
      `${context} is missing ${schemaType} structured data`
    );
  }
}

async function main() {
  const [home, product, productEs, noindexProduct, robots, sitemap, categoryPages, discoverHierarchyPages, hostServices, hostServicesEs, partners, partnersEs, faqPage, howItWorks] = await Promise.all([
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
    Promise.all(
      discoverHierarchyChecks.map(async (check) => ({
        ...check,
        html: await get(`/discover/${check.child}`),
      }))
    ),
    get("/valencia/host-services"),
    get("/es/valencia/servicios-anfitriones"),
    get("/partners"),
    get("/es/colaboraciones"),
    get("/faq"),
    get("/how-it-works"),
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
    for (const pathway of categoryPage.englishPathways || []) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
    }
    for (const pathway of categoryPage.spanishPathways || []) {
      assertPathway(categoryPage.es, pathway, `${categoryPage.slug} Spanish category`);
    }
    for (const pathway of categoryPage.categoryOnlyPathways || []) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
      assertPathway(categoryPage.es, pathway, `${categoryPage.slug} Spanish category`);
    }
    assertPageEnhancements(
      categoryPage.en,
      categoryPage.requiredEnglishText,
      categoryPage.requiredSchemaTypes,
      `${categoryPage.slug} English category`
    );
    assertPageEnhancements(
      categoryPage.es,
      categoryPage.requiredSpanishText,
      categoryPage.requiredSchemaTypes,
      `${categoryPage.slug} Spanish category`
    );
  }
  for (const hierarchyPage of discoverHierarchyPages) {
    assertPathway(
      hierarchyPage.html,
      `/discover/${hierarchyPage.hub}`,
      `${hierarchyPage.child} Discover hierarchy`,
    );
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
  for (const pathway of productPathways[productCategory]?.en || []) {
    assertPathway(product, pathway, "Reference product");
  }
  assertPathway(productEs, `/es/rental/${productCategory}`, "Spanish reference product");
  for (const pathway of productPathways[productCategory]?.es || []) {
    assertPathway(productEs, pathway, "Spanish reference product");
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
  assert(
    canonical(hostServices) === "https://rentanything.es/valencia/host-services",
    "Host services canonical is incorrect"
  );
  assert(
    canonical(hostServicesEs) === "https://rentanything.es/es/valencia/servicios-anfitriones",
    "Spanish host services canonical is incorrect"
  );
  assert(
    alternate(hostServices, "es") === "https://rentanything.es/es/valencia/servicios-anfitriones",
    "Host services lacks Spanish hreflang"
  );
  assert(
    alternate(hostServicesEs, "en") === "https://rentanything.es/valencia/host-services",
    "Spanish host services lacks English hreflang"
  );
  assertPageEnhancements(
    hostServices,
    ["Guest equipment without permanent storage"],
    ["Service", "FAQPage", "BreadcrumbList"],
    "Host services page"
  );
  assertPageEnhancements(
    hostServicesEs,
    ["Equipamiento para huéspedes sin almacenarlo"],
    ["Service", "FAQPage", "BreadcrumbList"],
    "Spanish host services page"
  );
  assertPathway(
    hostServices,
    "/es/valencia/servicios-anfitriones",
    "Host services locale switch"
  );
  assertPathway(
    hostServicesEs,
    "/valencia/host-services",
    "Spanish host services locale switch"
  );
  assert(
    sitemap.includes("https://rentanything.es/valencia/host-services"),
    "Host services is missing from the sitemap"
  );
  assert(
    sitemap.includes("https://rentanything.es/es/valencia/servicios-anfitriones"),
    "Spanish host services is missing from the sitemap"
  );
  assert(canonical(partners) === "https://rentanything.es/partners", "Partnerships canonical is incorrect");
  assert(
    canonical(partnersEs) === "https://rentanything.es/es/colaboraciones",
    "Spanish partnerships canonical is incorrect"
  );
  assert(
    alternate(partners, "es") === "https://rentanything.es/es/colaboraciones",
    "Partnerships lacks Spanish hreflang"
  );
  assert(
    alternate(partnersEs, "en") === "https://rentanything.es/partners",
    "Spanish partnerships lacks English hreflang"
  );
  assertPathway(partners, "/valencia/host-services", "Partnerships host-services pathway");
  assertPathway(partners, "/valencia/kits", "Partnerships kits pathway");
  assertPathway(partnersEs, "/es/valencia/servicios-anfitriones", "Spanish partnerships host-services pathway");
  assertPathway(partnersEs, "/valencia/kits", "Spanish partnerships kits pathway");
  assertPathway(partners, "/es/colaboraciones", "Partnerships locale switch");
  assertPathway(partnersEs, "/partners", "Spanish partnerships locale switch");
  assertPageEnhancements(
    partners,
    ["Practical partnerships for better Valencia stays", "Our partnership principles"],
    ["BreadcrumbList"],
    "Partnerships page"
  );
  assertPageEnhancements(
    partnersEs,
    ["mejores estancias en Valencia", "Nuestros principios"],
    ["BreadcrumbList"],
    "Spanish partnerships page"
  );
  assert(sitemap.includes("https://rentanything.es/partners"), "Partnerships is missing from the sitemap");
  assert(
    sitemap.includes("https://rentanything.es/es/colaboraciones"),
    "Spanish partnerships is missing from the sitemap"
  );
  assert(canonical(faqPage) === "https://rentanything.es/faq", "FAQ canonical is incorrect");
  assertPageEnhancements(
    faqPage,
    ["Our current online checkout does not automatically add a security deposit."],
    ["FAQPage"],
    "FAQ page"
  );
  assert(canonical(howItWorks) === "https://rentanything.es/how-it-works", "How It Works canonical is incorrect");
  assertPageEnhancements(
    howItWorks,
    ["Extensions depend on the item&#x27;s next booking"],
    ["HowTo", "FAQPage"],
    "How It Works page"
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
    hostServicesCanonical: canonical(hostServices),
    spanishHostServicesCanonical: canonical(hostServicesEs),
    partnershipsCanonical: canonical(partners),
    spanishPartnershipsCanonical: canonical(partnersEs),
    faqCanonical: canonical(faqPage),
    howItWorksCanonical: canonical(howItWorks),
    status: "passed",
  }, null, 2));
}

main().catch((error) => {
  console.error(`[seo-regression] ${error.message}`);
  process.exit(1);
});
