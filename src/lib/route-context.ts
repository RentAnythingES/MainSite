/** Root namespaces occupied by application routes. Reserve language-shaped slugs too. */
export const RESERVED_MARKET_SLUGS = new Set([
  "about", "admin", "api", "blog", "booking", "colaboraciones", "contact", "cookies",
  "discover", "faq", "how-it-works", "internal", "partners", "privacy", "product",
  "refunds", "rental", "review", "terms", "newsletter", "_next", "robots", "sitemap",
]);

export function isMarketSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 64 &&
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value) &&
    !/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(value) && !RESERVED_MARKET_SLUGS.has(value);
}

export function isLocaleTag(value: unknown): value is string {
  return typeof value === "string" && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(value);
}

export function isMarketId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
