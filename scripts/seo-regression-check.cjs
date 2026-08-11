const baseUrl = (process.env.SEO_BASE_URL || "https://rentandroll.com").replace(/\/$/, "");
const productSlug = process.env.SEO_PRODUCT_SLUG || "beach-umbrella-set";
const configuredNoindexProductSlug = process.env.SEO_NOINDEX_PRODUCT_SLUG || null;
const productCategory = process.env.SEO_PRODUCT_CATEGORY || "travel-outdoors";
const referenceKitSlug = "family-beach-kit";
const referenceBlogSlug = "rent-vs-buy-baby-gear-valencia";
const referenceTutorialSlug = "home-office-setup-valencia-apartment";
const configuredFamilyName = process.env.SEO_FAMILY_NAME || null;
const allFamilyChecks = [
  {
    name: "Mobility-scooter",
    path: "/rental/mobility/mobility-scooters",
    productSlug: "mobility-scooter-lightweight-foldable",
    productSlugs: [
      "mobility-scooter-lightweight-foldable",
      "mobility-scooter-standard",
      "heavy-duty-mobility-scooter",
    ],
    requiredEnglishText: ["How to choose a mobility scooter"],
    requiredSpanishText: ["Cómo elegir un scooter de movilidad"],
  },
  {
    name: "Stroller",
    path: "/rental/baby-gear/strollers",
    productSlug: "stroller-travel-compact",
    productSlugs: ["stroller-travel-compact", "stroller-all-terrain", "stroller-double"],
    excludedProductSlugs: ["stroller-and-bike-trailer-for-2"],
    requiredEnglishText: ["How to choose a stroller for Valencia"],
    requiredSpanishText: ["Cómo elegir una silla de paseo para Valencia"],
  },
  {
    name: "Car-seat",
    path: "/rental/baby-gear/car-seats",
    productSlug: "moni-serengeti-i-size-car-seat",
    productSlugs: [
      "maxi-cosi-pebble-360-pro2-infant-car-seat",
      "moni-serengeti-i-size-car-seat",
      "peg-perego-viaggio1-duo-fix-car-seat",
      "kinderkraft-i-spark-2-plus-i-size-car-seat",
      "seat-booster",
    ],
    excludedProductSlugs: [
      "maxi-cosi-emerald-360-s-i-size-car-seat",
    ],
    requiredEnglishText: ["How to choose a car seat for your Valencia stay"],
    requiredSpanishText: ["Cómo elegir una silla de coche para tu estancia"],
  },
  {
    name: "Wheelchair",
    path: "/rental/mobility/wheelchairs",
    productSlug: "transport-wheelchair",
    productSlugs: ["transport-wheelchair", "mobility-power-wheelchair"],
    expectedEnglishH1: "Wheelchair rental in Valencia",
    expectedSpanishH1: "Alquiler de sillas de ruedas en Valencia",
    requiredEnglishText: ["How to choose a wheelchair for your stay"],
    requiredSpanishText: ["Cómo elegir una silla de ruedas para la estancia"],
  },
  {
    name: "Travel-cot",
    path: "/rental/baby-gear/travel-cots-cribs",
    productSlug: "travel-cot",
    productSlugs: ["travel-cot", "travel-crib", "bedside-crib", "baby-bed-60x120"],
    expectedEnglishH1: "Travel cot and crib rental in Valencia",
    expectedSpanishH1: "Alquiler de cunas de viaje en Valencia",
    requiredEnglishText: ["How to choose a cot or crib for your stay"],
    requiredSpanishText: ["Cómo elegir una cuna para la estancia"],
  },
];
const familyChecks = configuredFamilyName
  ? allFamilyChecks.filter((familyCheck) => familyCheck.name === configuredFamilyName)
  : allFamilyChecks;

if (configuredFamilyName && familyChecks.length === 0) {
  throw new Error(`Unknown SEO_FAMILY_NAME: ${configuredFamilyName}`);
}
const legacyProductRedirects = [
  ["/product/portable-ac", "/product/mobile-airconditioner-delonghi-pinguino-compact-classic"],
  ["/es/product/portable-ac", "/es/product/mobile-airconditioner-delonghi-pinguino-compact-classic"],
  ["/product/mobility-scooter-lightweight", "/product/mobility-scooter-lightweight-foldable"],
  ["/es/product/mobility-scooter-lightweight", "/es/product/mobility-scooter-lightweight-foldable"],
  ["/product/compact-stroller", "/product/stroller-travel-compact"],
  ["/es/product/compact-stroller", "/es/product/stroller-travel-compact"],
  ["/product/double-stroller", "/product/stroller-double"],
  ["/es/product/double-stroller", "/es/product/stroller-double"],
  ["/product/car-seat-infant", "/product/maxi-cosi-pebble-360-pro2-infant-car-seat"],
  ["/es/product/car-seat-infant", "/es/product/maxi-cosi-pebble-360-pro2-infant-car-seat"],
  ["/product/car-seat-britax-i-size", "/product/moni-serengeti-i-size-car-seat"],
  ["/es/product/car-seat-britax-i-size", "/es/product/moni-serengeti-i-size-car-seat"],
  ["/product/convertible-car-seat", "/product/peg-perego-viaggio1-duo-fix-car-seat"],
  ["/es/product/convertible-car-seat", "/es/product/peg-perego-viaggio1-duo-fix-car-seat"],
  ["/product/kinderkraft-i-boost-2-booster-seat", "/product/kinderkraft-i-spark-2-plus-i-size-car-seat"],
  ["/es/product/kinderkraft-i-boost-2-booster-seat", "/es/product/kinderkraft-i-spark-2-plus-i-size-car-seat"],
];
const kitSlugs = [
  "family-beach-kit",
  "baby-arrival-kit",
  "toddler-city-kit",
  "remote-work-apartment-kit",
  "summer-apartment-survival-kit",
  "accessible-valencia-kit",
  "grandparents-visiting-kit",
  "long-stay-kitchen-upgrade-kit",
];

const discoverHierarchyChecks = [
  { hub: "neighbourhoods", child: "ruzafa" },
  { hub: "day-trips", child: "albufera" },
  { hub: "attractions", child: "city-of-arts-and-sciences" },
  { hub: "events", child: "fallas" },
];

const categoryChecks = [
  {
    slug: "baby-gear",
    expectedEnglishH1: "Baby & Toddler Gear Rental in Valencia",
    expectedSpanishH1: "Alquiler de Artículos de Bebé y Niños en Valencia",
    pathways: ["/valencia/kits/baby-arrival-kit"],
    comparisonPathways: [
      "/rental/baby-gear/strollers",
      "/rental/baby-gear/car-seats",
      "/rental/baby-gear/travel-cots-cribs",
    ],
    englishPathways: [
      "/rental/baby-gear/strollers",
      "/rental/baby-gear/car-seats",
      "/rental/baby-gear/travel-cots-cribs",
      "/blog/valencia-with-kids-complete-guide",
      "/blog/rent-vs-buy-baby-gear-valencia",
    ],
    spanishPathways: [
      "/es/rental/baby-gear/strollers",
      "/es/rental/baby-gear/car-seats",
      "/es/rental/baby-gear/travel-cots-cribs",
      "/es/blog/valencia-with-kids-complete-guide",
      "/es/blog/rent-vs-buy-baby-gear-valencia",
    ],
    requiredEnglishText: ["Baby Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de material de bebé en Valencia"],
    requiredSchemaTypes: ["FAQPage"],
    expectedLeadingProductSlugs: [
      "peg-perego-viaggio1-duo-fix-car-seat",
      "travel-cot",
      "stroller-travel-compact",
      "high-chair",
    ],
  },
  {
    slug: "kids-family",
    expectedEnglishH1: "Kids & Family Equipment Rental in Valencia",
    expectedSpanishH1: "Alquiler de Equipamiento Infantil y Familiar en Valencia",
    pathways: ["/valencia/kits/toddler-city-kit", "/valencia/kits/family-beach-kit"],
    englishPathways: ["/blog/valencia-with-kids-complete-guide"],
    spanishPathways: ["/es/blog/valencia-with-kids-complete-guide"],
    requiredProductSlugs: [
      "bed-rail-for-kids",
      "thule-chariot-sport-1-bike-trailer",
      "big-bobby-car-classic-ocean",
      "stroller-and-bike-trailer-for-2",
      "toddler-bike-lila",
      "color-beach-crab-sand-toy-set",
      "beach-tennis-set",
      "kipsta-bv100-size-5-beach-volleyball",
      "kipsta-bs100-beginner-beach-volleyball-net",
      "talbot-torro-beachminton-set",
      "family-roof-tent-4-person",
      "family-tent-1",
      "quechua-arpenaz-4-2-fresh-black-family-tent",
      "family-tent-3",
      "roof-tent-2adults-2kids",
      "inflatable-family-kayak-2-3-people",
      "swimming-vest-19-30kg",
      "seat-booster",
      "kinderkraft-i-spark-2-plus-i-size-car-seat",
      "moni-serengeti-i-size-car-seat",
    ],
    expectedLeadingProductSlugs: [
      "big-bobby-car-classic-ocean",
      "toddler-bike-lila",
      "color-beach-crab-sand-toy-set",
      "thule-chariot-sport-1-bike-trailer",
      "stroller-and-bike-trailer-for-2",
      "beach-tennis-set",
      "talbot-torro-beachminton-set",
      "inflatable-family-kayak-2-3-people",
    ],
  },
  {
    slug: "mobility",
    expectedEnglishH1: "Mobility Equipment Rental in Valencia",
    expectedSpanishH1: "Alquiler de Equipos de Movilidad en Valencia",
    pathways: ["/valencia/kits/accessible-valencia-kit"],
    comparisonPathways: ["/rental/mobility/mobility-scooters", "/rental/mobility/wheelchairs"],
    englishPathways: ["/rental/mobility/wheelchairs", "/blog/wheelchair-accessibility-valencia"],
    spanishPathways: ["/es/rental/mobility/wheelchairs", "/es/blog/wheelchair-accessibility-valencia"],
    requiredEnglishText: ["Mobility Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de movilidad en Valencia"],
    requiredSchemaTypes: ["FAQPage"],
    expectedLeadingProductSlugs: [
      "mobility-scooter-lightweight-foldable",
      "mobility-scooter-standard",
      "heavy-duty-mobility-scooter",
      "transport-wheelchair",
      "mobility-power-wheelchair",
      "rollator-walker",
    ],
  },
  {
    slug: "remote-work",
    expectedEnglishH1: "Remote Work Equipment Rental in Valencia",
    expectedSpanishH1: "Alquiler de Equipos de Teletrabajo en Valencia",
    pathways: ["/valencia/kits/remote-work-apartment-kit"],
    englishPathways: [
      "/blog/digital-nomad-guide-valencia",
      "/blog/home-office-setup-valencia-apartment",
    ],
    spanishPathways: [
      "/es/blog/digital-nomad-guide-valencia",
      "/es/blog/home-office-setup-valencia-apartment",
    ],
    requiredEnglishText: ["Remote Work Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Preguntas sobre el alquiler de equipos de teletrabajo"],
    requiredSchemaTypes: ["FAQPage"],
    expectedLeadingProductSlugs: [
      "monitor-27",
      "24-inch-monitor-hdmi-cable",
      "29-inch-monitor-hdmi-cable",
      "27-inch-monitor-hdmi-cable",
      "standing-desk",
      "ergonomic-chair",
    ],
  },
  {
    slug: "home-living",
    expectedEnglishH1: "Apartment Comfort Rentals in Valencia",
    expectedSpanishH1: "Alquiler de Equipamiento para Apartamentos en Valencia",
    pathways: ["/valencia/kits/summer-apartment-survival-kit"],
    categoryOnlyPathways: ["/valencia/kits/long-stay-kitchen-upgrade-kit"],
    englishPathways: ["/blog/valencia-summer-survival-guide"],
    spanishPathways: ["/es/blog/valencia-summer-survival-guide"],
    requiredEnglishText: ["Portable AC and Apartment Equipment Rental: FAQs"],
    requiredSpanishText: ["Preguntas sobre aire acondicionado portátil y confort"],
    requiredSchemaTypes: ["FAQPage"],
    expectedLeadingProductSlugs: [
      "koenic-kac-9022-w-portable-air-conditioner",
      "mobile-airconditioner-delonghi-pinguino-compact-classic",
    ],
  },
  {
    slug: "travel-outdoors",
    expectedEnglishH1: "Beach Equipment Rental in Valencia",
    expectedSpanishH1: "Alquiler de Equipamiento de Playa en Valencia",
    pathways: ["/valencia/kits/family-beach-kit"],
    englishPathways: ["/discover/malvarrosa-beach"],
    spanishPathways: ["/es/blog/best-beaches-valencia-families"],
    requiredEnglishText: ["Choose the Right Beach Setup", "Beach Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: [
      "Elige el equipamiento adecuado para la playa",
      "Preguntas sobre el alquiler de material de playa en Valencia",
    ],
    requiredSchemaTypes: ["FAQPage"],
    expectedLeadingProductSlugs: [
      "beach-umbrella-set",
      "beach-umbrella-with-table-cupholders",
      "xl-microfibre-towel",
      "beach-chair",
      "color-beach-crab-sand-toy-set",
      "compact-beach-shelter",
      "beach-wagon-with-table",
    ],
  },
  {
    slug: "fitness-wellness",
    expectedEnglishH1: "Sports Equipment Rental in Valencia",
    expectedSpanishH1: "Alquiler de Material Deportivo en Valencia",
    pathways: ["/how-it-works", "/discover/turia-gardens"],
    requiredEnglishText: ["Choose What Fits Your Plans", "Sports Equipment Rental in Valencia: FAQs"],
    requiredSpanishText: ["Elige lo que encaja con tus planes", "Preguntas sobre el alquiler de material deportivo en Valencia"],
    forbiddenEnglishText: ["starts with tennis and padel training equipment"],
    forbiddenSpanishText: ["empieza con material para entrenar tenis y pádel"],
    requiredSchemaTypes: ["FAQPage"],
  },
];

const productPathways = Object.fromEntries(categoryChecks.map((category) => [
  category.slug,
  {
    en: [...category.pathways, ...(category.englishPathways || [])],
    es: [...category.pathways.map((pathway) => `/es${pathway}`), ...(category.spanishPathways || [])],
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

async function assertPermanentRedirect(source, destination) {
  const response = await fetch(`${baseUrl}${source}`, { redirect: "manual" });
  const location = response.headers.get("location");
  assert(response.status === 308, `${source} returned ${response.status} instead of 308`);
  assert(
    location && new URL(location, baseUrl).pathname === destination,
    `${source} redirects to ${location || "nothing"} instead of ${destination}`
  );
}

async function assertPrimaryProductImageLoads(html, path) {
  const imageSources = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)]
    .map((match) => match[1].replaceAll("&amp;", "&"));
  const productImage = imageSources.find((source) =>
    source.includes("product-images") || source.startsWith("/products/"),
  );
  assert(productImage, `${path} has no rendered product image`);
  const imageUrl = new URL(productImage, baseUrl);
  const response = await fetch(imageUrl, { redirect: "follow" });
  assert(response.ok, `${path} product image returned ${response.status}`);
  assert(
    response.headers.get("content-type")?.startsWith("image/"),
    `${path} product image returned a non-image content type`,
  );
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

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function assertPathway(html, pathway, context) {
  assert(html.includes(`href="${pathway}"`), `${context} is missing pathway ${pathway}`);
}

function assertPageEnhancements(html, expectedText = [], schemaTypes = [], context) {
  const decodedHtml = decodeHtmlEntities(html);
  for (const text of expectedText) {
    assert(
      html.includes(text) || decodedHtml.includes(decodeHtmlEntities(text)),
      `${context} is missing required copy: ${text}`
    );
  }
  for (const schemaType of schemaTypes) {
    assert(
      html.includes(`"@type":"${schemaType}"`),
      `${context} is missing ${schemaType} structured data`
    );
  }
}

function headingOne(html) {
  const content = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "";
  return decodeHtmlEntities(content.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function assertFullCategoryCatalogue(html, locale, context) {
  const decodedHtml = decodeHtmlEntities(html);
  const cardSlugs = [...html.matchAll(/id="cat-product-([^"]+)"/g)].map((match) => match[1]);
  const countPattern = locale === "es"
    ? /Productos disponibles<\/h2><span[^>]*>(\d+) en Valencia<\/span>/
    : /Available products<\/h2><span[^>]*>(\d+) in Valencia<\/span>/;
  const declaredCount = Number(decodedHtml.match(countPattern)?.[1]);

  assert(Number.isInteger(declaredCount), `${context} does not declare its complete catalogue count`);
  assert(cardSlugs.length === declaredCount, `${context} renders ${cardSlugs.length} full product cards for ${declaredCount} category products`);
  assert(new Set(cardSlugs).size === cardSlugs.length, `${context} renders duplicate full product cards`);
  assert(!decodedHtml.includes("More Available Equipment"), `${context} still demotes products into compact links`);
  assert(!decodedHtml.includes("Más equipamiento disponible"), `${context} still demotes products into compact links`);
  assert(!html.includes('id="subcategory-'), `${context} still forces products into separate vertical subcategory sections`);
  return cardSlugs;
}

async function main() {
  const [sitemap, categoryPages] = await Promise.all([
    get("/sitemap.xml"),
    Promise.all(
      categoryChecks.map(async (categoryCheck) => ({
        ...categoryCheck,
        en: await get(`/rental/${categoryCheck.slug}`),
        es: await get(`/es/rental/${categoryCheck.slug}`),
      }))
    ),
  ]);
  const linkedProductSlugs = [
    ...new Set(categoryPages.flatMap((categoryPage) =>
      [...categoryPage.en.matchAll(/href="\/product\/([^"?#]+)"/g)].map((match) => match[1])
    )),
  ];
  const noindexProductSlug = configuredNoindexProductSlug || linkedProductSlugs.find((slug) =>
    !sitemap.includes(`https://rentandroll.com/product/${slug}`)
  ) || null;
  const familyPages = await Promise.all(
    familyChecks.map(async (familyCheck) => ({
      ...familyCheck,
      en: await get(familyCheck.path),
      es: await get(`/es${familyCheck.path}`),
      productEn: await get(`/product/${familyCheck.productSlug}`),
      productEs: await get(`/es/product/${familyCheck.productSlug}`),
      productPages: await Promise.all(
        familyCheck.productSlugs.map(async (slug) => ({
          slug,
          html: await get(`/product/${slug}`),
        })),
      ),
    })),
  );

  const [home, product, productEs, noindexProduct, robots, discoverHierarchyPages, kitsPage, kitsPageEs, kitPage, kitPageEs, blogPage, blogPageEs, tutorialPage, tutorialPageEs, hostServices, hostServicesEs, partners, partnersEs, faqPage, faqPageEs, howItWorks, howItWorksEs, refundsPage, refundsPageEs, aboutPage, aboutPageEs, contactPage, contactPageEs, privacyPage, privacyPageEs, termsPage, termsPageEs, cookiesPage, cookiesPageEs] = await Promise.all([
    get("/"),
    get(`/product/${productSlug}`),
    get(`/es/product/${productSlug}`),
    noindexProductSlug ? get(`/product/${noindexProductSlug}`) : Promise.resolve(null),
    get("/robots.txt"),
    Promise.all(
      discoverHierarchyChecks.map(async (check) => ({
        ...check,
        html: await get(`/discover/${check.child}`),
      }))
    ),
    get("/valencia/kits"),
    get("/es/valencia/kits"),
    get(`/valencia/kits/${referenceKitSlug}`),
    get(`/es/valencia/kits/${referenceKitSlug}`),
    get(`/blog/${referenceBlogSlug}`),
    get(`/es/blog/${referenceBlogSlug}`),
    get(`/blog/${referenceTutorialSlug}`),
    get(`/es/blog/${referenceTutorialSlug}`),
    get("/valencia/host-services"),
    get("/es/valencia/servicios-anfitriones"),
    get("/partners"),
    get("/es/colaboraciones"),
    get("/faq"),
    get("/es/faq"),
    get("/how-it-works"),
    get("/es/how-it-works"),
    get("/refunds"),
    get("/es/refunds"),
    get("/about"),
    get("/es/about"),
    get("/contact"),
    get("/es/contact"),
    get("/privacy"),
    get("/es/privacy"),
    get("/terms"),
    get("/es/terms"),
    get("/cookies"),
    get("/es/cookies"),
  ]);
  const [homeEs, valenciaPage, valenciaPageEs] = await Promise.all([
    get("/es"),
    get("/valencia"),
    get("/es/valencia"),
  ]);

  await Promise.all(
    legacyProductRedirects.map(([source, destination]) =>
      assertPermanentRedirect(source, destination)
    )
  );

  assert(canonical(home) === "https://rentandroll.com", "Homepage canonical is incorrect");
  assert(home.includes('id="cat-kids-family"'), "English homepage is missing the Kids & Family category card");
  assert(homeEs.includes('id="cat-kids-family"'), "Spanish homepage is missing the Kids & Family category card");
  assert(valenciaPage.includes('id="val-cat-kids-family"'), "English Valencia hub is missing the Kids & Family category card");
  assert(valenciaPageEs.includes('id="val-cat-kids-family"'), "Spanish Valencia hub is missing the Kids & Family category card");
  for (const categoryPage of categoryPages) {
    const englishUrl = `https://rentandroll.com/rental/${categoryPage.slug}`;
    const spanishUrl = `https://rentandroll.com/es/rental/${categoryPage.slug}`;
    assert(canonical(categoryPage.en) === englishUrl, `${categoryPage.slug} English canonical is incorrect`);
    assert(canonical(categoryPage.es) === spanishUrl, `${categoryPage.slug} Spanish canonical is incorrect`);
    assert(alternate(categoryPage.en, "en") === englishUrl, `${categoryPage.slug} English hreflang is incorrect`);
    assert(alternate(categoryPage.en, "es") === spanishUrl, `${categoryPage.slug} Spanish hreflang is incorrect`);
    assert(alternate(categoryPage.es, "en") === englishUrl, `${categoryPage.slug} Spanish page lacks English hreflang`);
    assert(alternate(categoryPage.es, "es") === spanishUrl, `${categoryPage.slug} Spanish page lacks Spanish hreflang`);
    assert(headingOne(categoryPage.en) === categoryPage.expectedEnglishH1, `${categoryPage.slug} English H1 is ${headingOne(categoryPage.en)} instead of ${categoryPage.expectedEnglishH1}`);
    assert(headingOne(categoryPage.es) === categoryPage.expectedSpanishH1, `${categoryPage.slug} Spanish H1 is ${headingOne(categoryPage.es)} instead of ${categoryPage.expectedSpanishH1}`);

    if (categoryPage.indexable === false) {
      assert(robotsMeta(categoryPage.en).includes("noindex"), `${categoryPage.slug} English category should be noindex`);
      assert(robotsMeta(categoryPage.es).includes("noindex"), `${categoryPage.slug} Spanish category should be noindex`);
      assert(!sitemap.includes(englishUrl), `${categoryPage.slug} English category leaked into the sitemap`);
      assert(!sitemap.includes(spanishUrl), `${categoryPage.slug} Spanish category leaked into the sitemap`);
      continue;
    }

    assert(!robotsMeta(categoryPage.en).includes("noindex"), `${categoryPage.slug} English category is unexpectedly noindex`);
    assert(!robotsMeta(categoryPage.es).includes("noindex"), `${categoryPage.slug} Spanish category is unexpectedly noindex`);
    assert(sitemap.includes(englishUrl), `${categoryPage.slug} English category is missing from the sitemap`);
    assert(sitemap.includes(spanishUrl), `${categoryPage.slug} Spanish category is missing from the sitemap`);
    const englishCardSlugs = assertFullCategoryCatalogue(categoryPage.en, "en", `${categoryPage.slug} English category`);
    const spanishCardSlugs = assertFullCategoryCatalogue(categoryPage.es, "es", `${categoryPage.slug} Spanish category`);
    for (const [index, productSlug] of (categoryPage.expectedLeadingProductSlugs || []).entries()) {
      assert(englishCardSlugs[index] === productSlug, `${categoryPage.slug} English product ${index + 1} is ${englishCardSlugs[index]} instead of ${productSlug}`);
      assert(spanishCardSlugs[index] === productSlug, `${categoryPage.slug} Spanish product ${index + 1} is ${spanishCardSlugs[index]} instead of ${productSlug}`);
    }
    for (const productSlug of categoryPage.requiredProductSlugs || []) {
      assertPathway(categoryPage.en, `/product/${productSlug}`, `${categoryPage.slug} English category`);
      assertPathway(categoryPage.es, `/es/product/${productSlug}`, `${categoryPage.slug} Spanish category`);
    }

    for (const pathway of categoryPage.pathways) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
      assertPathway(categoryPage.es, `/es${pathway}`, `${categoryPage.slug} Spanish category`);
    }
    for (const pathway of categoryPage.englishPathways || []) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
    }
    for (const pathway of categoryPage.spanishPathways || []) {
      assertPathway(categoryPage.es, pathway, `${categoryPage.slug} Spanish category`);
    }
    for (const pathway of categoryPage.categoryOnlyPathways || []) {
      assertPathway(categoryPage.en, pathway, `${categoryPage.slug} English category`);
      assertPathway(categoryPage.es, `/es${pathway}`, `${categoryPage.slug} Spanish category`);
    }
    const lastEnglishCardIndex = categoryPage.en.lastIndexOf('id="cat-product-');
    const lastSpanishCardIndex = categoryPage.es.lastIndexOf('id="cat-product-');
    for (const pathway of categoryPage.comparisonPathways || []) {
      assert(categoryPage.en.indexOf(`href="${pathway}"`) > lastEnglishCardIndex, `${categoryPage.slug} English comparison pathway appears before the catalogue`);
      assert(categoryPage.es.indexOf(`href="/es${pathway}"`) > lastSpanishCardIndex, `${categoryPage.slug} Spanish comparison pathway appears before the catalogue`);
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
    const decodedEnglishCategory = decodeHtmlEntities(categoryPage.en);
    const decodedSpanishCategory = decodeHtmlEntities(categoryPage.es);
    for (const text of categoryPage.forbiddenEnglishText || []) {
      assert(!decodedEnglishCategory.includes(text), `${categoryPage.slug} English category retains stale text: ${text}`);
    }
    for (const text of categoryPage.forbiddenSpanishText || []) {
      assert(!decodedSpanishCategory.includes(text), `${categoryPage.slug} Spanish category retains stale text: ${text}`);
    }
  }
  for (const hierarchyPage of discoverHierarchyPages) {
    assertPathway(
      hierarchyPage.html,
      `/discover/${hierarchyPage.hub}`,
      `${hierarchyPage.child} Discover hierarchy`,
    );
  }
  for (const familyPage of familyPages) {
    const englishUrl = `https://rentandroll.com${familyPage.path}`;
    const spanishUrl = `https://rentandroll.com/es${familyPage.path}`;
    assert(canonical(familyPage.en) === englishUrl, `${familyPage.name} family canonical is incorrect`);
    assert(canonical(familyPage.es) === spanishUrl, `Spanish ${familyPage.name} family canonical is incorrect`);
    assert(alternate(familyPage.en, "es") === spanishUrl, `${familyPage.name} family lacks Spanish hreflang`);
    assert(alternate(familyPage.es, "en") === englishUrl, `Spanish ${familyPage.name} family lacks English hreflang`);
    assert(!robotsMeta(familyPage.en).includes("noindex"), `${familyPage.name} family is unexpectedly noindex`);
    assert(!robotsMeta(familyPage.es).includes("noindex"), `Spanish ${familyPage.name} family is unexpectedly noindex`);
    if (familyPage.expectedEnglishH1) {
      assert(headingOne(familyPage.en) === familyPage.expectedEnglishH1, `${familyPage.name} English H1 is incorrect`);
      assert(headingOne(familyPage.es) === familyPage.expectedSpanishH1, `${familyPage.name} Spanish H1 is incorrect`);
    }
    assert(sitemap.includes(englishUrl), `${familyPage.name} family is missing from the sitemap`);
    assert(sitemap.includes(spanishUrl), `Spanish ${familyPage.name} family is missing from the sitemap`);
    assertPageEnhancements(familyPage.en, familyPage.requiredEnglishText, ["CollectionPage", "BreadcrumbList", "FAQPage"], `${familyPage.name} family`);
    assertPageEnhancements(familyPage.es, familyPage.requiredSpanishText, ["CollectionPage", "BreadcrumbList", "FAQPage"], `Spanish ${familyPage.name} family`);
    for (const familyProductSlug of familyPage.productSlugs) {
      assertPathway(familyPage.en, `/product/${familyProductSlug}`, `${familyPage.name} family`);
      assertPathway(familyPage.es, `/es/product/${familyProductSlug}`, `Spanish ${familyPage.name} family`);
    }
    for (const productPage of familyPage.productPages) {
      await assertPrimaryProductImageLoads(productPage.html, `/product/${productPage.slug}`);
    }
    for (const excludedProductSlug of familyPage.excludedProductSlugs || []) {
      assert(!familyPage.en.includes(`href="/product/${excludedProductSlug}"`), `${familyPage.name} family includes excluded product ${excludedProductSlug}`);
      assert(!familyPage.es.includes(`href="/es/product/${excludedProductSlug}"`), `Spanish ${familyPage.name} family includes excluded product ${excludedProductSlug}`);
    }
    assertPathway(familyPage.productEn, familyPage.path, `${familyPage.name} product`);
    assertPathway(familyPage.productEs, `/es${familyPage.path}`, `Spanish ${familyPage.name} product`);
  }
  if (configuredFamilyName) {
    console.log(JSON.stringify({
      baseUrl,
      scope: "family",
      checkedFamilyOwners: familyPages.map((familyPage) => ({
        name: familyPage.name,
        englishCanonical: canonical(familyPage.en),
        spanishCanonical: canonical(familyPage.es),
        includedProducts: familyPage.productSlugs,
        excludedProducts: familyPage.excludedProductSlugs || [],
      })),
      status: "passed",
    }, null, 2));
    return;
  }
  assert(
    canonical(product) === `https://rentandroll.com/product/${productSlug}`,
    "Product canonical is incorrect"
  );
  assert(!robotsMeta(product).includes("noindex"), "Reference product is unexpectedly noindex");
  assert(
    canonical(productEs) === `https://rentandroll.com/es/product/${productSlug}`,
    "Spanish reference product canonical is incorrect"
  );
  assert(!robotsMeta(productEs).includes("noindex"), "Spanish reference product is unexpectedly noindex");
  assert(
    alternate(productEs, "en") === `https://rentandroll.com/product/${productSlug}`,
    "Spanish reference product lacks English hreflang"
  );
  assert(
    alternate(productEs, "es") === `https://rentandroll.com/es/product/${productSlug}`,
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
  if (noindexProductSlug) {
    assert(
      robotsMeta(noindexProduct).includes("noindex"),
      "Incomplete reference product is unexpectedly indexable"
    );
  }
  assert(!robots.includes("Disallow: /_next/"), "Next.js rendering assets are blocked");
  const blocksAllCrawling = /^Disallow:\s*\/\s*$/m.test(robots);
  assert(
    blocksAllCrawling || robots.includes("Disallow: /admin/"),
    "Admin routes are not blocked in robots.txt"
  );
  assert(
    sitemap.includes(`https://rentandroll.com/product/${productSlug}`),
    "Reference product is missing from the sitemap"
  );
  assert(
    sitemap.includes(`https://rentandroll.com/es/product/${productSlug}`),
    "Spanish reference product is missing from the sitemap"
  );
  assert(!sitemap.includes("/admin/"), "Admin URL leaked into the sitemap");
  assert(!sitemap.includes("/booking/success"), "Booking success URL leaked into the sitemap");
  if (noindexProductSlug) {
    assert(
      !sitemap.includes(`https://rentandroll.com/product/${noindexProductSlug}`),
      "Incomplete reference product leaked into the sitemap"
    );
  }
  assert(canonical(kitsPage) === "https://rentandroll.com/valencia/kits", "Kits canonical is incorrect");
  assert(canonical(kitsPageEs) === "https://rentandroll.com/es/valencia/kits", "Spanish kits canonical is incorrect");
  assert(alternate(kitsPage, "es") === "https://rentandroll.com/es/valencia/kits", "Kits hub lacks Spanish hreflang");
  assert(alternate(kitsPageEs, "en") === "https://rentandroll.com/valencia/kits", "Spanish kits hub lacks English hreflang");
  assert(canonical(kitPage) === `https://rentandroll.com/valencia/kits/${referenceKitSlug}`, "Kit canonical is incorrect");
  assert(canonical(kitPageEs) === `https://rentandroll.com/es/valencia/kits/${referenceKitSlug}`, "Spanish kit canonical is incorrect");
  assert(alternate(kitPage, "es") === `https://rentandroll.com/es/valencia/kits/${referenceKitSlug}`, "Kit lacks Spanish hreflang");
  assert(alternate(kitPageEs, "en") === `https://rentandroll.com/valencia/kits/${referenceKitSlug}`, "Spanish kit lacks English hreflang");
  assertPageEnhancements(kitPage, [], ["Product", "BreadcrumbList", "FAQPage"], "English reference kit");
  assertPageEnhancements(kitPageEs, ["Configura este kit"], ["Product", "BreadcrumbList", "FAQPage"], "Spanish reference kit");
  assertPathway(kitsPageEs, `/es/valencia/kits/${referenceKitSlug}`, "Spanish kits hub");
  for (const kitSlug of kitSlugs) {
    assert(sitemap.includes(`https://rentandroll.com/valencia/kits/${kitSlug}`), `${kitSlug} is missing from the English sitemap`);
    assert(sitemap.includes(`https://rentandroll.com/es/valencia/kits/${kitSlug}`), `${kitSlug} is missing from the Spanish sitemap`);
  }
  const blogUrl = `https://rentandroll.com/blog/${referenceBlogSlug}`;
  const blogUrlEs = `https://rentandroll.com/es/blog/${referenceBlogSlug}`;
  assert(canonical(blogPage) === blogUrl, "Reference blog canonical is incorrect");
  assert(canonical(blogPageEs) === blogUrlEs, "Spanish reference blog canonical is incorrect");
  assert(alternate(blogPage, "es") === blogUrlEs, "Reference blog lacks Spanish hreflang");
  assert(alternate(blogPageEs, "en") === blogUrl, "Spanish reference blog lacks English hreflang");
  assertPageEnhancements(
    blogPage,
    ["The short answer: use a hybrid approach", "/blog/rent-vs-buy-baby-gear-valencia.webp"],
    ["Article", "BreadcrumbList", "FAQPage"],
    "Reference comparison blog"
  );
  assertPageEnhancements(
    blogPageEs,
    ["Respuesta breve: combina las cuatro opciones", "/blog/rent-vs-buy-baby-gear-valencia.webp"],
    ["Article", "BreadcrumbList", "FAQPage"],
    "Spanish comparison blog"
  );
  assert(sitemap.includes(blogUrl), "Reference blog is missing from the sitemap");
  assert(sitemap.includes(blogUrlEs), "Spanish reference blog is missing from the sitemap");
  const tutorialUrl = `https://rentandroll.com/blog/${referenceTutorialSlug}`;
  const tutorialUrlEs = `https://rentandroll.com/es/blog/${referenceTutorialSlug}`;
  assert(canonical(tutorialPage) === tutorialUrl, "Reference tutorial canonical is incorrect");
  assert(canonical(tutorialPageEs) === tutorialUrlEs, "Spanish reference tutorial canonical is incorrect");
  assert(alternate(tutorialPage, "es") === tutorialUrlEs, "Reference tutorial lacks Spanish hreflang");
  assert(alternate(tutorialPageEs, "en") === tutorialUrl, "Spanish reference tutorial lacks English hreflang");
  assertPageEnhancements(tutorialPage, ["Start before booking: ask for evidence, not labels"], ["Article", "BreadcrumbList", "FAQPage"], "Reference tutorial");
  assertPageEnhancements(tutorialPageEs, ["Antes de reservar: pide pruebas, no etiquetas"], ["Article", "BreadcrumbList", "FAQPage"], "Spanish reference tutorial");
  assert(sitemap.includes(tutorialUrl), "Reference tutorial is missing from the sitemap");
  assert(sitemap.includes(tutorialUrlEs), "Spanish reference tutorial is missing from the sitemap");
  assert(
    canonical(hostServices) === "https://rentandroll.com/valencia/host-services",
    "Host services canonical is incorrect"
  );
  assert(
    canonical(hostServicesEs) === "https://rentandroll.com/es/valencia/servicios-anfitriones",
    "Spanish host services canonical is incorrect"
  );
  assert(
    alternate(hostServices, "es") === "https://rentandroll.com/es/valencia/servicios-anfitriones",
    "Host services lacks Spanish hreflang"
  );
  assert(
    alternate(hostServicesEs, "en") === "https://rentandroll.com/valencia/host-services",
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
    sitemap.includes("https://rentandroll.com/valencia/host-services"),
    "Host services is missing from the sitemap"
  );
  assert(
    sitemap.includes("https://rentandroll.com/es/valencia/servicios-anfitriones"),
    "Spanish host services is missing from the sitemap"
  );
  assert(canonical(partners) === "https://rentandroll.com/partners", "Partnerships canonical is incorrect");
  assert(
    canonical(partnersEs) === "https://rentandroll.com/es/colaboraciones",
    "Spanish partnerships canonical is incorrect"
  );
  assert(
    alternate(partners, "es") === "https://rentandroll.com/es/colaboraciones",
    "Partnerships lacks Spanish hreflang"
  );
  assert(
    alternate(partnersEs, "en") === "https://rentandroll.com/partners",
    "Spanish partnerships lacks English hreflang"
  );
  assertPathway(partners, "/valencia/host-services", "Partnerships host-services pathway");
  assertPathway(partners, "/valencia/kits", "Partnerships kits pathway");
  assertPathway(partnersEs, "/es/valencia/servicios-anfitriones", "Spanish partnerships host-services pathway");
  assertPathway(partnersEs, "/es/valencia/kits", "Spanish partnerships kits pathway");
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
  assert(sitemap.includes("https://rentandroll.com/partners"), "Partnerships is missing from the sitemap");
  assert(
    sitemap.includes("https://rentandroll.com/es/colaboraciones"),
    "Spanish partnerships is missing from the sitemap"
  );
  assert(canonical(faqPage) === "https://rentandroll.com/faq", "FAQ canonical is incorrect");
  assert(canonical(faqPageEs) === "https://rentandroll.com/es/faq", "Spanish FAQ canonical is incorrect");
  assert(alternate(faqPage, "es") === "https://rentandroll.com/es/faq", "FAQ lacks Spanish hreflang");
  assert(alternate(faqPageEs, "en") === "https://rentandroll.com/faq", "Spanish FAQ lacks English hreflang");
  assertPageEnhancements(
    faqPage,
    ["Our current online checkout does not automatically add a security deposit."],
    ["FAQPage"],
    "FAQ page"
  );
  assertPageEnhancements(
    faqPageEs,
    ["Nuestro proceso de pago online actual no añade una fianza automáticamente."],
    ["FAQPage"],
    "Spanish FAQ page"
  );
  assert(canonical(howItWorks) === "https://rentandroll.com/how-it-works", "How It Works canonical is incorrect");
  assert(canonical(howItWorksEs) === "https://rentandroll.com/es/how-it-works", "Spanish How It Works canonical is incorrect");
  assert(alternate(howItWorks, "es") === "https://rentandroll.com/es/how-it-works", "How It Works lacks Spanish hreflang");
  assert(alternate(howItWorksEs, "en") === "https://rentandroll.com/how-it-works", "Spanish How It Works lacks English hreflang");
  assertPageEnhancements(
    howItWorks,
    ["Extensions depend on the item&#x27;s next booking", "Choose pickup, delivery, or collection", "You pay only the added transport fee through Stripe"],
    ["HowTo", "FAQPage"],
    "How It Works page"
  );
  assertPageEnhancements(
    howItWorksEs,
    ["La ampliación depende de la siguiente reserva del artículo", "Elige recogida, entrega o servicio completo", "Pagas únicamente el transporte añadido mediante Stripe"],
    ["HowTo", "FAQPage"],
    "Spanish How It Works page"
  );
  assert(canonical(refundsPage) === "https://rentandroll.com/refunds", "Refunds canonical is incorrect");
  assert(canonical(refundsPageEs) === "https://rentandroll.com/es/refunds", "Spanish refunds canonical is incorrect");
  assert(alternate(refundsPage, "es") === "https://rentandroll.com/es/refunds", "Refunds lacks Spanish hreflang");
  assert(alternate(refundsPageEs, "en") === "https://rentandroll.com/refunds", "Spanish refunds lacks English hreflang");
  assert(canonical(aboutPage) === "https://rentandroll.com/about", "About canonical is incorrect");
  assert(canonical(aboutPageEs) === "https://rentandroll.com/es/about", "Spanish About canonical is incorrect");
  assert(alternate(aboutPage, "es") === "https://rentandroll.com/es/about", "About lacks Spanish hreflang");
  assert(alternate(aboutPageEs, "en") === "https://rentandroll.com/about", "Spanish About lacks English hreflang");
  assertPageEnhancements(
    aboutPage,
    ["Travel light.", "Rent what you need.", "Cleaned and checked"],
    ["AboutPage", "Organization"],
    "About page"
  );
  assertPageEnhancements(
    aboutPageEs,
    ["Viaja ligero.", "Rent&Roll ayuda", "Nuestra primera zona de servicio"],
    ["AboutPage", "Organization"],
    "Spanish About page"
  );
  assert(canonical(contactPage) === "https://rentandroll.com/contact", "Contact canonical is incorrect");
  assert(canonical(contactPageEs) === "https://rentandroll.com/es/contact", "Spanish Contact canonical is incorrect");
  assert(alternate(contactPage, "es") === "https://rentandroll.com/es/contact", "Contact lacks Spanish hreflang");
  assert(alternate(contactPageEs, "en") === "https://rentandroll.com/contact", "Spanish Contact lacks English hreflang");
  assertPageEnhancements(contactPage, ["Available pickup options appear during booking"], ["ContactPage"], "Contact page");
  assertPageEnhancements(contactPageEs, ["Las opciones de recogida disponibles aparecen al reservar"], ["ContactPage"], "Spanish Contact page");
  const legalPairs = [
    { name: "Privacy", en: privacyPage, es: privacyPageEs, enPath: "/privacy", esPath: "/es/privacy" },
    { name: "Terms", en: termsPage, es: termsPageEs, enPath: "/terms", esPath: "/es/terms" },
    { name: "Cookies", en: cookiesPage, es: cookiesPageEs, enPath: "/cookies", esPath: "/es/cookies" },
  ];
  for (const legalPair of legalPairs) {
    const englishUrl = `https://rentandroll.com${legalPair.enPath}`;
    const spanishUrl = `https://rentandroll.com${legalPair.esPath}`;
    assert(canonical(legalPair.en) === englishUrl, `${legalPair.name} canonical is incorrect`);
    assert(canonical(legalPair.es) === spanishUrl, `Spanish ${legalPair.name} canonical is incorrect`);
    assert(alternate(legalPair.en, "es") === spanishUrl, `${legalPair.name} lacks Spanish hreflang`);
    assert(alternate(legalPair.es, "en") === englishUrl, `Spanish ${legalPair.name} lacks English hreflang`);
  }
  assertPageEnhancements(privacyPage, ["Escalera Labs S.L.", "Google Analytics does not load until you allow analytics"], [], "Privacy page");
  assertPageEnhancements(privacyPageEs, ["Escalera Labs S.L.", "Google Analytics no se carga"], [], "Spanish Privacy page");
  assertPageEnhancements(termsPage, ["does not automatically add a security deposit", "Between 24 and 48 hours"], [], "Terms page");
  assertPageEnhancements(termsPageEs, ["Stripe procesa el pago", "Entre 24 y 48 horas"], [], "Spanish Terms page");
  assertPageEnhancements(cookiesPage, ["rentanything_analytics_consent", "does not load unless you select"], [], "Cookies page");
  assertPageEnhancements(cookiesPageEs, ["rentanything_analytics_consent", "no se carga salvo que selecciones"], [], "Spanish Cookies page");
  for (const path of ["/es/faq", "/es/how-it-works", "/es/refunds", "/es/about", "/es/contact", "/es/privacy", "/es/terms", "/es/cookies"]) {
    assert(sitemap.includes(`https://rentandroll.com${path}`), `${path} is missing from the sitemap`);
  }

  console.log(JSON.stringify({
    baseUrl,
    productSlug,
    noindexProductSlug,
    homepageCanonical: canonical(home),
    productCanonical: canonical(product),
    spanishProductCanonical: canonical(productEs),
    productCategory,
    referenceBlogCanonical: canonical(blogPage),
    spanishReferenceBlogCanonical: canonical(blogPageEs),
    referenceTutorialCanonical: canonical(tutorialPage),
    spanishReferenceTutorialCanonical: canonical(tutorialPageEs),
    checkedFamilyOwners: familyPages.map((familyPage) => ({
      name: familyPage.name,
      englishCanonical: canonical(familyPage.en),
      spanishCanonical: canonical(familyPage.es),
    })),
    checkedCategoryClusters: categoryPages.map((categoryPage) => categoryPage.slug),
    hostServicesCanonical: canonical(hostServices),
    spanishHostServicesCanonical: canonical(hostServicesEs),
    partnershipsCanonical: canonical(partners),
    spanishPartnershipsCanonical: canonical(partnersEs),
    faqCanonical: canonical(faqPage),
    spanishFaqCanonical: canonical(faqPageEs),
    howItWorksCanonical: canonical(howItWorks),
    spanishHowItWorksCanonical: canonical(howItWorksEs),
    refundsCanonical: canonical(refundsPage),
    spanishRefundsCanonical: canonical(refundsPageEs),
    aboutCanonical: canonical(aboutPage),
    spanishAboutCanonical: canonical(aboutPageEs),
    contactCanonical: canonical(contactPage),
    spanishContactCanonical: canonical(contactPageEs),
    spanishLegalCanonicals: legalPairs.map((legalPair) => canonical(legalPair.es)),
    status: "passed",
  }, null, 2));
}

main().catch((error) => {
  console.error(`[seo-regression] ${error.message}`);
  process.exit(1);
});
