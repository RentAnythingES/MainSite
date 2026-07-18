# Spanish Planning Coverage — 18 July 2026

## Objective

Extend Spanish SEO beyond commercial category and product pages without publishing
thin translations. The first planning cluster supports the strongest current
commercial paths: Beach & Outdoor and Apartment Comfort.

## Published Spanish guides

| Spanish route | Primary intent | Commercial owner |
|---|---|---|
| `/es/blog/best-beaches-valencia-families` | mejores playas de Valencia para familias | `/es/rental/travel-outdoors` |
| `/es/blog/valencia-summer-survival-guide` | consejos para el verano y el calor en Valencia | `/es/rental/home-living` |

Both adaptations include Spanish metadata, headings, complete article copy,
FAQs, Article/FAQ/Breadcrumb structured data, and links only to public Spanish
commercial pages. They are not literal sentence-by-sentence translations: units,
terminology, cautions and calls to action are adapted for Spanish users.

## Technical model

- `/es/blog` lists only guides with complete Spanish content.
- English and Spanish article routes share one renderer to prevent template drift.
- Reciprocal `en`, `es` and `x-default` hreflang is emitted only for translated
  articles. The four English-only posts remain self-canonical without false pairs.
- The sitemap includes the Spanish hub and two translated articles.
- Header and footer navigation keep Spanish visitors inside `/es/blog`.
- The rendered technical audit requires CollectionPage schema on the Spanish hub,
  Article and Breadcrumb schema on Spanish details, and reciprocal hreflang.

## Next translation order

1. `valencia-with-kids-complete-guide` — supports Baby & Toddler and Kids & Family.
2. `wheelchair-accessibility-valencia` — supports Mobility & Accessibility.
3. `digital-nomad-guide-valencia` — supports Remote Work.
4. `best-day-trips-from-valencia` — planning intent with weaker direct commercial value.

Each guide should be added only as a complete adaptation. Do not create placeholder
Spanish routes or point hreflang at the Spanish homepage.
