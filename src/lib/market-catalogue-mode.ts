export type MarketCatalogueMode = "legacy" | "shadow" | "offers";
export function marketCatalogueMode(value = process.env.MARKET_CATALOGUE_READ_MODE): MarketCatalogueMode {
  if (value === undefined || value === "" || value === "legacy") return "legacy";
  if (value === "shadow" || value === "offers") return value;
  throw new Error("Invalid MARKET_CATALOGUE_READ_MODE");
}

type ComparableProduct = { id?: string; slug: string; city: string; stockTotal?: number; stockAvailable?: number; pricing: { days: number; perDay: number }[] };
export function catalogueParity(legacy: ComparableProduct[], offers: ComparableProduct[]) {
  const signature = (product: ComparableProduct) => JSON.stringify({ id: product.id, city: product.city,
    stock: product.stockTotal, capacity: product.stockAvailable,
    pricing: [...product.pricing].sort((a, b) => a.days - b.days) });
  const left = new Map(legacy.map(product => [product.slug, signature(product)]));
  const right = new Map(offers.map(product => [product.slug, signature(product)]));
  return [...new Set([...left.keys(), ...right.keys()])].filter(slug => left.get(slug) !== right.get(slug));
}

export async function readMarketCatalogue<T>(input: {
  mode: MarketCatalogueMode; city: string; legacy: () => Promise<T>; offers: () => Promise<T>;
  compare: (legacy: T, offers: T) => void; onShadowError: (error: unknown) => void;
}): Promise<T> {
  if (input.city !== "valencia" && input.mode !== "offers") throw new Error("Non-default city catalogue reads are not enabled");
  if (input.mode === "offers") return input.offers();
  const legacy = await input.legacy();
  if (input.mode === "shadow") {
    try { input.compare(legacy, await input.offers()); } catch (error) { input.onShadowError(error); }
  }
  return legacy;
}
