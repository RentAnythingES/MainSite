// Explicit leading products for each shopping category. These lists only control
// order: every active category member still renders in the complete catalogue.
// Products not listed here retain the database's alphabetical fallback order.
export const categoryProductPriorities: Record<string, readonly string[]> = {
  "baby-gear": [
    "peg-perego-viaggio1-duo-fix-car-seat",
    "travel-cot",
    "stroller-travel-compact",
    "high-chair",
  ],
  "kids-family": [
    "big-bobby-car-classic-ocean",
    "toddler-bike-lila",
    "color-beach-crab-sand-toy-set",
    "thule-chariot-sport-1-bike-trailer",
    "stroller-and-bike-trailer-for-2",
    "beach-tennis-set",
    "talbot-torro-beachminton-set",
    "inflatable-family-kayak-2-3-people",
  ],
  mobility: [
    "mobility-scooter-lightweight-foldable",
    "mobility-scooter-standard",
    "heavy-duty-mobility-scooter",
    "transport-wheelchair",
    "mobility-power-wheelchair",
    "rollator-walker",
  ],
  "remote-work": [
    "monitor-27",
    "24-inch-monitor-hdmi-cable",
    "29-inch-monitor-hdmi-cable",
    "27-inch-monitor-hdmi-cable",
    "standing-desk",
    "ergonomic-chair",
  ],
  "home-living": [
    "koenic-kac-9022-w-portable-air-conditioner",
    "mobile-airconditioner-delonghi-pinguino-compact-classic",
  ],
  "travel-outdoors": [
    "beach-umbrella-set",
    "beach-umbrella-with-table-cupholders",
    "xl-microfibre-towel",
    "beach-chair",
    "color-beach-crab-sand-toy-set",
    "compact-beach-shelter",
    "beach-wagon-with-table",
  ],
};

export function applyCategoryProductPriority<T extends { slug: string }>(
  categorySlug: string,
  products: T[],
): T[] {
  const priorities = categoryProductPriorities[categorySlug];
  if (!priorities?.length) return products;

  const rank = new Map(priorities.map((slug, index) => [slug, index]));
  return products
    .map((product, originalIndex) => ({ product, originalIndex }))
    .sort((left, right) => {
      const leftRank = rank.get(left.product.slug);
      const rightRank = rank.get(right.product.slug);
      if (leftRank !== undefined || rightRank !== undefined) {
        return (leftRank ?? priorities.length) - (rightRank ?? priorities.length);
      }
      return left.originalIndex - right.originalIndex;
    })
    .map(({ product }) => product);
}
