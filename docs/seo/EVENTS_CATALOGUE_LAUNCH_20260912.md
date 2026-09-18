# Occasions & Events launch — 12 September 2026

Owner approved publication of pizza kits, Ninja slush machines, karaoke and eight games using their existing product photos.

## Implementation

- Existing bilingual product routes and daily pricing tables are unchanged. The new hub is an entry in the existing category templates and catalogue registry.
- Homepage, Valencia, navigation, footer and sitemap use the existing category structure. Outdoor games retain secondary category memberships.
- All 13 listings have English/Spanish copy, FAQs, supplier photos and the standard 1/3/7/14-day rate thresholds.
- Pizza kits include launching and turning peels, an infrared thermometer, cutter, two serving boards, dough box, brush and heat-protective gloves. Fuel, ingredients, a table and a host are excluded.
- Zero owned stock remains zero through product mapping. The shared booking widget offers requests for selected dates and confirmation before payment.
- Existing supplier URLs/provenance are preserved. The owner_approved image status records the business owner’s publication decision, without claiming manufacturer permission or a licence.

## Daily rates (EUR per day)

| Product | 1–2 days | 3–6 days | 7–13 days | 14+ days |
|---|---:|---:|---:|---:|
| badminton-set-three-metre-net | 8 | 5 | 3 | 2 |
| cornhole-portable-set | 8 | 5 | 3 | 1.75 |
| finnish-skittles-compact | 6 | 3.5 | 2 | 1.25 |
| karaoke-kit | 39 | 22 | 16 | 11 |
| kubb-outdoor-team-game | 9 | 5.5 | 3.5 | 2.5 |
| outdoor-pizza-oven-12-inch | 49 | 30 | 22 | 15 |
| outdoor-pizza-oven-16-inch | 69 | 42 | 30 | 21 |
| portable-table-tennis-set | 6 | 3.5 | 2 | 1.25 |
| roundnet-set-four-players | 8 | 5 | 3 | 2 |
| slush-machine-two-flavours | 39 | 28 | 21 | 14 |
| slush-machine-up-to-12-drinks | 35 | 25 | 18 | 12 |
| soft-flying-disc | 2 | 1 | 0.6 | 0.35 |
| soft-petanque-six-ball-set | 5 | 3 | 2 | 1.25 |

## Validation and release

- Publication preflight: 13 bilingual listings, 52 positive daily tiers, 13 primary image HTTP 200 responses, and event category membership for all 13.
- No inventory-unit, booking, draft, item or inventory-block dependencies existed for these products.
- Applied in one guarded transaction; all 13 default-market offers and pricing mirrors matched. Three unconfirmed intake capacity values changed from one to zero with inventory audit records.
- New routes: 26 product locale URLs plus two category locale URLs. Exact live sitemap count and deployed commit are recorded in the final verification receipt.
- Existing whole-duration pricing selects the rate for the complete rental duration; totals can fall at a discount threshold. No event-specific pricing engine or cumulative-rate display was introduced.
- Operational follow-up: confirm procurement and complete pizza-kit packing before accepting a customer reservation.

Detailed before/after evidence remains in agent-work/events-launch-2026-09-12/publication-commit.json in the operational workspace.

Final local production build passed. All 28 release URLs passed HTTP, canonical, hreflang, structured-data, primary-image, daily-price and request-state checks; the sitemap contains 406 URLs including all 28. Existing rental-date tests passed 4/4. A direct mapper regression verified stock 0, 1, 5 and missing values. Browser review confirmed the standard Ninja layout, working photos, request URL with product/dates, and the 21-product category grid with no horizontal overflow at 1280 px.

## Category presentation correction — 12 September 2026

Replaced the category illustration with a photorealistic lifestyle image at `public/categories/events-celebrations.webp`. Moved Occasions & Events to the last position in both language homepage/Valencia lists and the shared category registry (navigation/footer). Existing card markup, overlays, typography and product images are preserved. No routes or prices changed. Generated with the built-in image tool: four adult friends sharing pizza on a leafy Valencia terrace, natural late-afternoon editorial photography, centred composition for existing category-card crops, no text or illustration.
