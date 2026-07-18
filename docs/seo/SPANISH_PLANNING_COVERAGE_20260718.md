# Spanish Planning Coverage — 18 July 2026

## Objective

Extend Spanish SEO beyond commercial category and product pages without publishing
thin translations. The planning cluster now supports Beach & Outdoor, Apartment
Comfort, Baby & Toddler, Kids & Family, and Mobility & Accessibility.
The final two adaptations add Remote Work and broader destination-planning intent.

## Published Spanish guides

| Spanish route | Primary intent | Commercial owner |
|---|---|---|
| `/es/blog/best-beaches-valencia-families` | mejores playas de Valencia para familias | `/es/rental/travel-outdoors` |
| `/es/blog/valencia-summer-survival-guide` | consejos para el verano y el calor en Valencia | `/es/rental/home-living` |
| `/es/blog/valencia-with-kids-complete-guide` | viajar a Valencia con niños | `/es/rental/baby-gear`, `/es/rental/kids-family` |
| `/es/blog/wheelchair-accessibility-valencia` | Valencia accesible en silla de ruedas | `/es/rental/mobility` |
| `/es/blog/digital-nomad-guide-valencia` | teletrabajar desde Valencia | `/es/rental/remote-work` |
| `/es/blog/best-day-trips-from-valencia` | excursiones desde Valencia | supporting family and mobility guides |

All six adaptations include Spanish metadata, headings, complete article copy,
FAQs, Article/FAQ/Breadcrumb structured data, and links only to public Spanish
commercial pages. They are not literal sentence-by-sentence translations: units,
terminology, cautions and calls to action are adapted for Spanish users.

## Technical model

- `/es/blog` lists only guides with complete Spanish content.
- English and Spanish article routes share one renderer to prevent template drift.
- Reciprocal `en`, `es` and `x-default` hreflang is emitted only for translated
  articles. English-only posts remain self-canonical without false pairs.
- The sitemap includes the Spanish hub and six translated articles.
- Header and footer navigation keep Spanish visitors inside `/es/blog`.
- The rendered technical audit requires CollectionPage schema on the Spanish hub,
  Article and Breadcrumb schema on Spanish details, and reciprocal hreflang.

## Translation status

All six English planning articles now have complete Spanish adaptations. Future
articles should be localized only when the full copy, metadata, FAQs and internal
links are ready. Do not create placeholder Spanish routes or point hreflang at the
Spanish homepage.

## Production verification

The first two guides deployed as commit `c99f2d3` on 18 July 2026. The
post-deployment crawl covered 102 sitemap URLs and returned zero errors, warnings,
orphan pages, broken links or broken images. It confirmed 31 reciprocal hreflang
pairs, including the Spanish blog hub and both translated articles. The hub exposes
`CollectionPage`; each article exposes `Article`, `BreadcrumbList` and `FAQPage`.

The family and accessibility guides deployed as commit `fa361cf` on 18 July 2026.
The production crawl then covered 104 sitemap URLs with zero errors, warnings,
orphan pages, broken links or broken images. It confirmed 33 reciprocal hreflang
pairs. Both new English/Spanish article pairs expose `Article`, `BreadcrumbList`
and `FAQPage` structured data.

The remote-work and day-trip adaptations were added locally on 18 July 2026. Their
production crawl results are recorded after deployment.
