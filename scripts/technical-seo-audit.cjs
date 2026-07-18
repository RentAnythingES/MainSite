const baseUrl = (process.env.SEO_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const outputPath = process.env.SEO_AUDIT_OUTPUT;
const concurrency = Number(process.env.SEO_AUDIT_CONCURRENCY || 5);

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function tagContent(html, tagName) {
  return decodeEntities(html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"))?.[1]?.replace(/<[^>]+>/g, "").trim());
}

function metaContent(html, key, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((entry) => new RegExp(`${key}=["']${value}["']`, "i").test(entry));
  return decodeEntities(tag?.match(/content=["']([^"']*)["']/i)?.[1] || "");
}

function linkHref(html, rel, hrefLang) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const tag = tags.find((entry) => {
    if (!new RegExp(`rel=["']${rel}["']`, "i").test(entry)) return false;
    return !hrefLang || new RegExp(`hrefLang=["']${hrefLang}["']`, "i").test(entry);
  });
  return decodeEntities(tag?.match(/href=["']([^"']+)["']/i)?.[1] || "");
}

function extractHreflang(html) {
  const alternates = {};
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    if (!/rel=["']alternate["']/i.test(tag)) continue;
    const locale = tag.match(/hreflang=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (locale && href) alternates[locale] = decodeEntities(href);
  }
  return alternates;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, baseUrl);
    if (url.hostname === "rentanything.es" || url.hostname === "www.rentanything.es") {
      const auditOrigin = new URL(baseUrl);
      url.protocol = auditOrigin.protocol;
      url.hostname = auditOrigin.hostname;
      url.port = auditOrigin.port;
    }
    url.hash = "";
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/$/, "");
    return url.toString().replace(/\/$/, url.pathname === "/" ? "" : "");
  } catch {
    return value;
  }
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.map((match) => match[1].trim()).filter(Boolean);
}

function extractInternalLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = decodeEntities(match[1]);
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    const normalized = normalizeUrl(href);
    if (normalized.startsWith(normalizeUrl(baseUrl))) links.add(normalized);
  }
  return [...links];
}

function extractInternalImages(html) {
  const sources = new Set();
  const candidates = [];
  for (const image of html.match(/<img\b[^>]*>/gi) || []) {
    const source = image.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (source) candidates.push(source);
  }
  candidates.push(metaContent(html, "property", "og:image"));
  candidates.push(metaContent(html, "name", "twitter:image"));

  for (const candidate of candidates) {
    if (!candidate || candidate.startsWith("data:")) continue;
    const normalized = normalizeUrl(decodeEntities(candidate));
    if (normalized.startsWith(normalizeUrl(baseUrl))) sources.add(normalized);
  }
  return [...sources];
}

function getRequiredJsonLdTypes(url) {
  const pathname = new URL(url).pathname.replace(/\/$/, "") || "/";
  if (pathname === "/" || pathname === "/es") return ["LocalBusiness"];
  if (/^\/(?:es\/)?product\/[^/]+$/.test(pathname)) return ["Product", "BreadcrumbList"];
  if (/^\/(?:es\/)?rental\/[^/]+$/.test(pathname)) return ["CollectionPage", "BreadcrumbList"];
  if (/^\/blog\/[^/]+$/.test(pathname)) return ["Article", "BreadcrumbList"];
  if (/^\/valencia\/kits\/[^/]+$/.test(pathname)) return ["Product", "BreadcrumbList"];
  if (/^\/discover\/[^/]+$/.test(pathname) && !["/discover/neighbourhoods", "/discover/day-trips", "/discover/attractions", "/discover/events"].includes(pathname)) {
    return ["BreadcrumbList", "TouristDestination|Event"];
  }
  return [];
}

function inspectPage(url, html, responseLanguage = "") {
  const errors = [];
  const warnings = [];
  const title = tagContent(html, "title");
  const description = metaContent(html, "name", "description");
  const robots = metaContent(html, "name", "robots").toLowerCase();
  const canonical = linkHref(html, "canonical");
  const expectedLanguage = new URL(url).pathname.startsWith("/es") ? "es" : "en";
  const htmlLanguage = html.match(/<html\b[^>]*lang=["']([^"']+)["']/i)?.[1]?.toLowerCase() || "";
  const headerLanguage = responseLanguage.split(",")[0].trim().toLowerCase();
  const hasRuntimeLanguageSetter = html.includes("document.documentElement.lang=location.pathname");
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const images = html.match(/<img\b[^>]*>/gi) || [];
  const missingAlt = images.filter((image) => !/\balt=["'][^"']*["']/i.test(image)).length;
  const jsonLdTypes = [];
  const hreflang = extractHreflang(html);

  if (!title) errors.push("missing_title");
  else if (title.length > 60) warnings.push(`title_too_long:${title.length}`);
  if (!description) errors.push("missing_meta_description");
  else {
    if (description.length > 160) warnings.push(`description_too_long:${description.length}`);
    if (description.length < 100) warnings.push(`description_too_short:${description.length}`);
  }
  if (!canonical) errors.push("missing_canonical");
  else if (normalizeUrl(canonical) !== normalizeUrl(url)) errors.push(`canonical_mismatch:${canonical}`);
  if (robots.includes("noindex")) errors.push("sitemap_url_is_noindex");
  if (h1Count !== 1) errors.push(`invalid_h1_count:${h1Count}`);
  if (
    htmlLanguage !== expectedLanguage &&
    (headerLanguage !== expectedLanguage || !hasRuntimeLanguageSetter)
  ) {
    errors.push(`language_mismatch:${htmlLanguage || "missing"}`);
  }
  if (!metaContent(html, "property", "og:title")) warnings.push("missing_og_title");
  if (!metaContent(html, "property", "og:description")) warnings.push("missing_og_description");
  if (!metaContent(html, "property", "og:image")) warnings.push("missing_og_image");
  if (!metaContent(html, "name", "twitter:card")) warnings.push("missing_twitter_card");
  if (missingAlt > 0) errors.push(`images_without_alt:${missingAlt}`);

  for (const jsonLd of extractJsonLd(html)) {
    try {
      const parsed = JSON.parse(jsonLd);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry?.["@type"]) jsonLdTypes.push(entry["@type"]);
      }
    } catch {
      errors.push("invalid_json_ld");
    }
  }

  for (const requiredType of getRequiredJsonLdTypes(url)) {
    const alternatives = requiredType.split("|");
    if (!alternatives.some((type) => jsonLdTypes.includes(type))) {
      errors.push(`missing_json_ld_type:${requiredType}`);
    }
  }

  return {
    url,
    title,
    titleLength: title.length,
    descriptionLength: description.length,
    canonical,
    h1Count,
    htmlLanguage,
    headerLanguage,
    jsonLdTypes,
    hreflang,
    internalLinks: extractInternalLinks(html),
    internalImages: extractInternalImages(html),
    errors,
    warnings,
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "RentAnythingTechnicalSeoAudit/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  return { response, text: await response.text() };
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

async function main() {
  const [{ response: sitemapResponse, text: sitemap }, { response: robotsResponse, text: robots }] = await Promise.all([
    fetchText(`${baseUrl}/sitemap.xml`),
    fetchText(`${baseUrl}/robots.txt`),
  ]);
  if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
  if (!robotsResponse.ok) throw new Error(`Robots returned ${robotsResponse.status}`);

  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeEntities(match[1]));
  const pages = await mapWithConcurrency(sitemapUrls, async (url) => {
    try {
      const { response, text } = await fetchText(url.replace("https://rentanything.es", baseUrl).replace("https://www.rentanything.es", baseUrl));
      if (!response.ok) {
        return { url, status: response.status, errors: [`http_status:${response.status}`], warnings: [], internalLinks: [], internalImages: [] };
      }
      return {
        status: response.status,
        ...inspectPage(url, text, response.headers.get("content-language") || ""),
      };
    } catch (error) {
      return { url, status: 0, errors: [`fetch_failed:${error.message}`], warnings: [], internalLinks: [], internalImages: [] };
    }
  });

  const pageUrls = new Set(pages.map((page) => normalizeUrl(page.url)));
  const pagesByUrl = new Map(pages.map((page) => [normalizeUrl(page.url), page]));
  const hreflangPairs = [];
  for (const englishPage of pages.filter((page) => !new URL(page.url).pathname.startsWith("/es"))) {
    const pathname = new URL(englishPage.url).pathname;
    const englishUrl = normalizeUrl(englishPage.url);
    const spanishUrl = normalizeUrl(`${baseUrl}/es${pathname === "/" ? "" : pathname}`);
    const spanishPage = pagesByUrl.get(spanishUrl);
    if (!spanishPage) continue;

    for (const page of [englishPage, spanishPage]) {
      const expected = { en: englishUrl, es: spanishUrl, "x-default": englishUrl };
      for (const [locale, expectedUrl] of Object.entries(expected)) {
        if (normalizeUrl(page.hreflang?.[locale]) !== expectedUrl) {
          page.errors.push(`hreflang_mismatch:${locale}`);
        }
      }
    }
    hreflangPairs.push({ englishUrl, spanishUrl });
  }
  const linkedUrls = new Set(pages.flatMap((page) => page.internalLinks || []));
  const orphanPages = pages
    .filter((page) => normalizeUrl(page.url) !== normalizeUrl(baseUrl) && !linkedUrls.has(normalizeUrl(page.url)))
    .map((page) => page.url);
  const errorPages = pages.filter((page) => page.errors.length > 0);
  const warningPages = pages.filter((page) => page.warnings.length > 0);
  const unlistedInternalLinks = [...linkedUrls].filter((url) => !pageUrls.has(url));
  const unlistedLinkChecks = await mapWithConcurrency(unlistedInternalLinks, async (url) => {
    try {
      const { response, text } = await fetchText(url);
      const robots = metaContent(text, "name", "robots").toLowerCase();
      return {
        url,
        status: response.status,
        indexable: response.ok && !robots.includes("noindex"),
        canonical: linkHref(text, "canonical"),
      };
    } catch (error) {
      return { url, status: 0, error: error.message };
    }
  });
  const brokenInternalLinks = unlistedLinkChecks.filter((link) => link.status < 200 || link.status >= 400);
  const indexableUnlistedInternalLinks = unlistedLinkChecks.filter((link) => link.indexable);
  const internalImages = [...new Set(pages.flatMap((page) => page.internalImages || []))];
  const imageChecks = await mapWithConcurrency(internalImages, async (url) => {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "RentAnythingTechnicalSeoAudit/1.0" },
        signal: AbortSignal.timeout(20000),
      });
      return { url, status: response.status, contentType: response.headers.get("content-type") || "" };
    } catch (error) {
      return { url, status: 0, contentType: "", error: error.message };
    }
  });
  const brokenInternalImages = imageChecks.filter(
    (image) => image.status < 200 || image.status >= 400 || !image.contentType.startsWith("image/"),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    sitemapUrlCount: sitemapUrls.length,
    robots: {
      hasSitemap: /Sitemap:\s*https:\/\/rentanything\.es\/sitemap\.xml/i.test(robots),
      blocksAdmin: /Disallow:\s*\/admin\//i.test(robots),
      blocksApi: /Disallow:\s*\/api\//i.test(robots),
    },
    summary: {
      pagesWithErrors: errorPages.length,
      pagesWithWarnings: warningPages.length,
      orphanPages: orphanPages.length,
      unlistedInternalLinks: unlistedInternalLinks.length,
      brokenInternalLinks: brokenInternalLinks.length,
      indexableUnlistedInternalLinks: indexableUnlistedInternalLinks.length,
      hreflangPairs: hreflangPairs.length,
      internalImages: internalImages.length,
      brokenInternalImages: brokenInternalImages.length,
    },
    errorPages: errorPages.map(({ url, errors }) => ({ url, errors })),
    warningPages: warningPages.map(({ url, warnings }) => ({ url, warnings })),
    orphanPages,
    unlistedInternalLinks,
    brokenInternalLinks,
    indexableUnlistedInternalLinks,
    hreflangPairs,
    brokenInternalImages,
    schemaCoverage: pages.map(({ url, jsonLdTypes }) => ({ url, jsonLdTypes })),
  };

  if (outputPath) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({
      generatedAt: report.generatedAt,
      baseUrl: report.baseUrl,
      sitemapUrlCount: report.sitemapUrlCount,
      robots: report.robots,
      summary: report.summary,
      outputPath,
    }, null, 2));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  if (errorPages.length > 0 || brokenInternalLinks.length > 0 || indexableUnlistedInternalLinks.length > 0 || brokenInternalImages.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[technical-seo-audit] ${error.message}`);
  process.exit(1);
});
