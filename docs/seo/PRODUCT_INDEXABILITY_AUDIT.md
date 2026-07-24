# Product Indexability Audit

## Purpose

Track whether active catalogue items can be indexed in English and Spanish, and
surface configuration or editorial blockers before they silently weaken category
clusters.

Run the read-only audit with:

```bash
npm run audit:product-seo
```

## Baseline — July 15, 2026

| Metric | Count |
|---|---:|
| Total catalogue records | 178 |
| Active products | 24 |
| English-indexable products | 20 |
| Spanish-indexable products | 20 |

### Priority cluster coverage

| Cluster | Active | EN indexable | ES indexable |
|---|---:|---:|---:|
| Baby & Toddler | 6 | 5 | 5 |
| Kids & Family | 1 | 0 | 0 |
| Mobility & Accessibility | 4 | 4 | 4 |
| Remote Work | 3 | 3 | 3 |
| Apartment Comfort | 4 | 3 | 3 |
| Beach & Outdoor | 5 | 5 | 5 |

### Immediate findings

1. All 20 English-indexable products now have complete Spanish localization,
   Spanish FAQs and reciprocal EN/ES indexability.
2. Four active products are not English-indexable:
   - `bladeless-fan-ventilator` — editorial approval incomplete.
   - `thule-chariot-sport-1-bike-trailer` — editorial approval incomplete.
   - `toddler-bike-lila` — editorial approval incomplete.
   - `portable-tennis-padel-ball-machine-battery-operated` — category is not in
     the approved public SEO cluster set.
3. Kids & Family has an indexable hub but no indexable active product page. This
   is the weakest product-supported priority cluster.

## Indexing gate

An English product page requires an active product, a supported category, core
copy, a usable image, pricing, and either legacy status or completed editorial
approval with approved primary-image rights. Spanish additionally requires
`content_ready` status and Spanish short description, SEO title, and SEO
description.

## Next actions

The July 18 production rerun confirms the baseline remains 178 catalogue records,
24 active products, and 20 indexable products in each language. Code-side SEO,
image and rendered-page audits pass; the four blocked active products remain
intentional editorial/category decisions rather than technical failures.
The broader launch-readiness audit now applies the same legacy-content,
public-category and approved-image rules, so it reports these four products rather
than incorrectly flagging all 18 active legacy records with draft status.

1. Complete legitimate editorial/image-rights review for the three blocked
   products; do not bypass the approval gate.
2. Translate newly activated products as part of the same publication batch so
   English and Spanish stay aligned.
3. Decide whether Fitness & Wellness becomes a supported public cluster before
   indexing the ball-machine product.
4. Re-run this audit after each catalogue publishing batch and update this file
   when the baseline materially changes.

## Production rerun — July 22, 2026

The live readiness audit now reports 178 catalogue records, 34 active products,
and 31 indexable products in each language.

- `mobile-airconditioner-delonghi-pinguino-compact-classic` is now
  `content_ready` and indexable in English and Spanish. Its manufacturer-sourced
  primary image already had `manufacturer_approved` permission recorded.
- `bladeless-fan-ventilator` and `thule-chariot-sport-1-bike-trailer` now have
  verified core facts, complete English and Spanish editorial content, four FAQs
  per locale, pricing, stock, and primary-image source records.
- Those latter two remain intentionally blocked at `facts_verified` because the
  uploaded images still have `rights_status = unknown`. Official manufacturer
  fact sources do not by themselves prove catalogue image permission.
- `toddler-bike-lila` remains the other blocked active product.

The production sitemap was still serving its cached 192-URL/54-product-URL
version immediately after the database update. Product data caches revalidate
within five minutes and `sitemap.xml` revalidates hourly unless the normal admin
save path explicitly clears them.

## Live follow-up — 22 July 2026

A later readiness audit recorded 178 total products, 34 active, 34 English-indexable
and 33 Spanish-indexable. The next sitemap refresh contains 205 URLs.

- `thule-chariot-sport-1-bike-trailer` is indexable in English and Spanish.
- `toddler-bike-lila` is indexable in English but remains excluded from Spanish
  because localized SEO copy is missing.
- `bladeless-fan-ventilator` is indexable in both locales after explicit publication.
  Its primary image still has `rights_status = unknown`; this remains an internal
  compliance warning and was not changed to an unsupported approval state.
- The regression audit now discovers an active noindex product from rendered
  category links instead of relying on a fixed product that may later be approved.

## Live follow-up — 24 July 2026

The production readiness audit now records 178 total products, 37 active products,
and complete parity at 37 English-indexable and 37 Spanish-indexable pages.

- `toddler-bike-lila` now has verified Spanish short and detail copy, metadata,
  constraints, delivery/care notes, and three localized FAQs.
- The Kids & Family cluster therefore has one indexable product in each locale
  instead of an English-only commercial pathway.
- The next sitemap refresh contains 212 URLs, including the newly indexable Spanish
  toddler-bike URL with reciprocal English and Spanish alternates.
