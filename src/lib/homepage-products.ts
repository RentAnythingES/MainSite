import type { Product } from "@/data/products";
import { getProductsFromDB } from "@/lib/product-service";

const featuredProductSlots = [
  ["stroller-travel-compact", "compact-stroller"],
  ["transport-wheelchair"],
  ["monitor-27"],
  ["heavy-duty-mobility-scooter"],
] as const;

export async function getHomepageFeaturedProducts(locale: "en" | "es"): Promise<Product[]> {
  const products = await getProductsFromDB("valencia", locale);
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));

  return featuredProductSlots
    .map((candidates) => candidates.map((slug) => productsBySlug.get(slug)).find(Boolean))
    .filter((product): product is Product => Boolean(product));
}

export function formatHomepageProductPrice(product: Product): string {
  const prices = product.pricing
    .map((tier) => tier.perDay)
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) return "—";

  const minimum = Math.min(...prices);
  const maximum = Math.max(...prices);
  return minimum === maximum ? `€${minimum}` : `€${minimum} – €${maximum}`;
}
