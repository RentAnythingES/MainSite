# Priority Product Page Audit — 11 August 2026

## Scope and guardrails

This pass reviewed the non-AC product pages that support the current commercial
owners: mobility scooters, wheelchairs, strollers, car seats, travel cots,
monitors, beach equipment and family outdoor products.

The two portable-air-conditioner listings were deliberately excluded. This pass
does not hide, deactivate or noindex products, does not change pricing or stock,
and does not alter category memberships. A missing optional FAQ is a content gap,
not an indexing blocker.

Evidence came from the live product, localization, FAQ and image records plus the
rendered EN/ES route regression. The audit did not use inferred product facts.

## Completed in this batch

### Correct family-owner links on product pages

The shared product-planning component contained scooter-specific text for every
product family. As a result, stroller, car-seat, wheelchair and travel-cot product
pages all displayed a `Compare scooters` card even though their links led to the
correct family routes.

The component now reads the existing bilingual heading and description from the
matched family definition. This repairs the link context for all 17 current
family-owned products:

- three mobility scooters;
- three strollers;
- five car-seat/booster listings;
- two wheelchairs;
- four travel cots or cribs.

Regression assertions now require the correct EN/ES family-owner text for all
five families. The full local production regression passed, including canonical,
hreflang, sitemap, product-family pathways and primary image loading.

### Replace two clearly defective product descriptions

The active Beachminton and family-kayak records had enough verified product data
to repair without guessing.

- `talbot-torro-beachminton-set`: removed generic internal-review language about
  physical activation, frames, fabrics, capacity and compatibility. The EN/ES
  copy now explains the two-player set, exact contents, no-net use and where it is
  practical around Valencia.
- `inflatable-family-kayak-2-3-people`: corrected visible English grammar and
  conflicting package language. The EN/ES copy now distinguishes the included
  kayak, two paddles and carry bag from separately selected pump and buoyancy aids.

Both products retain their identity, slug, prices, stock, images and category
memberships. Each has three direct customer FAQs in both languages.

## Verified current strengths

- All five current product-family owners are indexable in English and Spanish,
  publish reciprocal hreflang and appear in the sitemap.
- Every product assigned to those families links back to its owner route.
- All 17 family product pages tested with a loadable primary image.
- The corrected car-seat identities, imagery and bilingual family mapping remain
  intact.
- Mobility-scooter family content remains complete in both languages.
- Category pages continue to show every active member in one flat catalogue; this
  batch introduces no merchandising caps or product hiding.

## Remaining work, in practical order

### 1. Resolve two genuine identity conflicts before editing their URLs

These are inventory questions, not writing questions:

- `lifejacket-25-40kg` is named and slugged as 25–40 kg, while its stored model,
  features, specifications and copy all describe a Size 6 vest for 10–20 kg.
  Confirm the label on the owned unit, then correct the identity and add a redirect
  if the public slug changes.
- `27-inch-monitor-hdmi-cable` is named and specified as a 32-inch 4K monitor.
  Confirm which physical monitor this stock row represents before deciding whether
  to preserve the legacy URL or migrate it with a redirect.

Neither product was hidden or rewritten in this batch.

### 2. Replace ambiguous shared monitor imagery

The 24-inch, 27-inch, 29-inch and current 32-inch monitor records all reference
the same local image. Their product records remain available and indexable, but
distinct photos would make the variants easier to understand and trust.

### 3. Repair the next thin-copy group — completed 12 August

The child bed rail, generic video baby monitor, baby bed, bedside crib,
all-terrain stroller and Kinderkraft travel cot now have fact-bound EN/ES copy and
three FAQs per locale. Internal activation/import language and wrong-locale FAQ
fallback were removed. See `ACTIVE_PRODUCT_PAGE_AUDIT_20260812.md`.

### 4. Continue image verification beyond the family-owner set — completed 12 August

All 114 active products and all 228 EN/ES product pages passed rendered primary
image delivery checks. A permanent audit script now derives the catalogue from the
seven bilingual category owners and verifies each image response.

## Next action

Start with the two physical identity decisions above, then add distinct verified
monitor photos and continue the lower-priority fact-bound product review. Continue
to protect the two AC listings from broad rewrites while other catalogue defects
are being resolved.
