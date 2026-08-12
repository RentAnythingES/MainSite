# Active Product Page Audit — 12 August 2026

## Scope

This follow-up covered the complete active Valencia catalogue and the next
fact-complete non-AC product-copy group. It did not alter either portable air
conditioner, product identity, URLs, pricing, stock, images or category ownership.

## Complete image-delivery result

The repeatable `scripts/active-product-image-audit.cjs` check derives the live
catalogue from all seven English and Spanish category pages, opens every linked
product page and requests its rendered primary image.

Production result on 12 August 2026:

- 7 bilingual category owners checked;
- 114 unique active products found in each locale;
- 228 EN/ES product pages checked;
- 228 primary image responses returned successfully with an image content type;
- 0 missing or broken rendered product images.

The application deliberately normalizes legacy local `.png` or `.jpg` database
paths to the existing `.webp` assets. Audits must verify the rendered normalized
URL rather than treating the stale database extension as the customer-facing file.

### Visual and administrative follow-up

- The 24-, 27-, 29- and current 32-inch monitor records all use the same generic
  monitor image. Nothing is broken, but distinct verified photos are still needed
  to communicate the variants properly.
- `air-purifier` uses its valid legacy local image without a separate primary
  `product_images` record. This is an editorial/provenance cleanup, not a live
  display failure.
- Three corrected car-seat images load successfully but retain `unknown` rights
  status in the editorial table. Resolve the provenance status separately; do not
  hide or noindex working products because of that internal field.

## Six-product customer-copy repair

The following active pages had sufficient stored product facts for a guarded
bilingual repair:

- `baby-bed-60x120`;
- `bedside-crib`;
- `stroller-all-terrain`;
- `travel-cot`;
- `bed-rail-for-kids`;
- `video-baby-monitor`.

The migration replaces internal import or activation language, malformed supplier
copy and incomplete Spanish descriptions with direct customer information:

- what the product is;
- the verified dimensions, limits or key functions that affect selection;
- what the rental includes;
- the practical compatibility or setup information a customer needs;
- three useful FAQs in English and Spanish.

All twelve metadata titles are below 60 characters and all descriptions are
between 121 and 151 characters. The migration updates exactly six base descriptions,
twelve localization records and thirty-six FAQs, with count guards and a retired-copy
check.

## Spanish FAQ isolation

The product-service fallback previously allowed static English FAQs to appear on a
Spanish product page when that product lacked Spanish database FAQs. Static FAQ
fallback is now English-only. Spanish pages use Spanish database FAQs or omit that
optional section; they never display English fallback questions.

The all-terrain stroller exposed the defect in production and now has three proper
Spanish FAQs. The other five repaired products also receive complete bilingual FAQ
coverage.

## Product identity corrections

The 32-inch monitor had a correct public headline and 32-inch specification but
an incorrect `27-inch-monitor-hdmi-cable` URL. Its canonical slug is now
`32-inch-monitor-hdmi-cable`; permanent English and Spanish redirects preserve the
old URLs. The separate `monitor-27` product remains distinct, and its erroneous
24-inch `Screen` specification is corrected to 27 inches.

The `lifejacket-25-40kg` page now consistently describes the 25–40 kg product named
in its headline. The contradictory Size 6, 10–20 kg, height, chest and internal
review copy has been removed from its base record, bilingual content, metadata and
FAQs. Pricing, stock, images and category memberships are unchanged.

## Remaining work

1. Replace the shared generic monitor image with verified photos of each variant.
2. Continue the same fact-bound review through lower-priority active products,
   correcting only evidenced defects rather than manufacturing copy volume.
