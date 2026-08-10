export const seoCategoryClusters = [
  {
    slug: "baby-gear",
    nameEn: "Baby & Toddler",
    nameEs: "Bebé y Primera Infancia",
    emoji: "👶",
    primaryKeywordEn: "baby equipment rental Valencia",
    primaryKeywordEs: "alquiler material bebé Valencia",
  },
  {
    slug: "kids-family",
    nameEn: "Kids & Family",
    nameEs: "Niños y Familia",
    emoji: "🧸",
    primaryKeywordEn: "kids equipment rental Valencia",
    primaryKeywordEs: "alquiler material infantil Valencia",
  },
  {
    slug: "mobility",
    nameEn: "Mobility & Accessibility",
    nameEs: "Movilidad y Accesibilidad",
    emoji: "♿",
    primaryKeywordEn: "mobility equipment rental Valencia",
    primaryKeywordEs: "alquiler ayudas movilidad Valencia",
  },
  {
    slug: "remote-work",
    nameEn: "Remote Work",
    nameEs: "Teletrabajo",
    emoji: "💻",
    primaryKeywordEn: "remote work equipment rental Valencia",
    primaryKeywordEs: "alquiler equipo teletrabajo Valencia",
  },
  {
    slug: "home-living",
    nameEn: "Apartment Comfort",
    nameEs: "Confort de Apartamento",
    emoji: "🏠",
    primaryKeywordEn: "apartment equipment rental Valencia",
    primaryKeywordEs: "alquiler equipamiento apartamento Valencia",
  },
  {
    slug: "travel-outdoors",
    nameEn: "Beach & Outdoor",
    nameEs: "Playa y Aire Libre",
    emoji: "🏖️",
    primaryKeywordEn: "beach equipment rental Valencia",
    primaryKeywordEs: "alquiler material playa Valencia",
  },
  {
    slug: "fitness-wellness",
    nameEn: "Sports & Wellness",
    nameEs: "Deporte y Bienestar",
    emoji: "🎾",
    primaryKeywordEn: "sports equipment rental Valencia",
    primaryKeywordEs: "alquiler material deportivo Valencia",
  },
] as const;

export type SeoCategorySlug = (typeof seoCategoryClusters)[number]["slug"];

export const seoCategorySlugs = seoCategoryClusters.map((cluster) => cluster.slug);

// Kids & Family remains a valid catalogue classification, but it currently has no
// active products. Keep the route available as noindex while excluding it from
// crawlable commercial discovery until a reviewed membership set exists.
export const indexableSeoCategoryClusters = seoCategoryClusters.filter(
  (cluster) => cluster.slug !== "kids-family",
);
export const indexableSeoCategorySlugs = indexableSeoCategoryClusters.map(
  (cluster) => cluster.slug,
);
