const baseUrl = (process.env.SEO_BASE_URL || "https://rentandroll.com").replace(/\/$/, "");
const categorySlugs = [
  "baby-gear",
  "kids-family",
  "mobility",
  "remote-work",
  "home-living",
  "travel-outdoors",
  "fitness-wellness",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeSource(source) {
  return source.replaceAll("&amp;", "&");
}

function productSlugs(html, locale) {
  const pattern = locale === "es"
    ? /href="\/es\/product\/([^"?#]+)"/g
    : /href="\/product\/([^"?#]+)"/g;
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function primaryProductImage(html) {
  const tag = [...html.matchAll(/<img[^>]*>/gi)]
    .map((match) => match[0])
    .find((entry) => /class="[^"]*object-contain p-6[^"]*"/i.test(entry));
  return tag?.match(/src="([^"]+)"/i)?.[1] || null;
}

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  const html = await response.text();
  assert(response.ok, `${path} returned ${response.status}`);
  return html;
}

async function mapLimit(values, limit, mapper) {
  const output = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      output[index] = await mapper(values[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return output;
}

async function checkProduct(slug, locale) {
  const prefix = locale === "es" ? "/es" : "";
  const path = `${prefix}/product/${slug}`;
  const html = await get(path);
  const imageSource = primaryProductImage(html);
  assert(imageSource, `${path} has no primary product image`);
  const imageUrl = new URL(decodeSource(imageSource), baseUrl);
  const response = await fetch(imageUrl, { redirect: "follow" });
  assert(response.ok, `${path} product image returned ${response.status}`);
  assert(
    response.headers.get("content-type")?.startsWith("image/"),
    `${path} product image returned ${response.headers.get("content-type") || "no content type"}`,
  );
  return { slug, locale, image: imageUrl.href };
}

async function main() {
  const categoryPages = await Promise.all(categorySlugs.flatMap((category) => [
    get(`/rental/${category}`).then((html) => ({ locale: "en", category, html })),
    get(`/es/rental/${category}`).then((html) => ({ locale: "es", category, html })),
  ]));

  const englishSlugs = new Set(categoryPages
    .filter((page) => page.locale === "en")
    .flatMap((page) => productSlugs(page.html, "en")));
  const spanishSlugs = new Set(categoryPages
    .filter((page) => page.locale === "es")
    .flatMap((page) => productSlugs(page.html, "es")));

  const missingSpanish = [...englishSlugs].filter((slug) => !spanishSlugs.has(slug));
  const missingEnglish = [...spanishSlugs].filter((slug) => !englishSlugs.has(slug));
  assert(missingSpanish.length === 0, `Spanish categories omit products: ${missingSpanish.join(", ")}`);
  assert(missingEnglish.length === 0, `English categories omit products: ${missingEnglish.join(", ")}`);

  const slugs = [...englishSlugs].sort();
  const pages = slugs.flatMap((slug) => [
    { slug, locale: "en" },
    { slug, locale: "es" },
  ]);
  const results = await mapLimit(pages, 10, ({ slug, locale }) => checkProduct(slug, locale));

  console.log(JSON.stringify({
    baseUrl,
    categories: categorySlugs.length,
    activeProductPagesPerLocale: slugs.length,
    checkedPages: results.length,
    status: "passed",
  }, null, 2));
}

main().catch((error) => {
  console.error(`[active-product-image-audit] ${error.message}`);
  process.exit(1);
});
