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
] as const;

export type SeoCategorySlug = (typeof seoCategoryClusters)[number]["slug"];

export const seoCategorySlugs = seoCategoryClusters.map((cluster) => cluster.slug);
