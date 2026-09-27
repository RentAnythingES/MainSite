# City offer reads and release-baseline reconciliation

## Completed in this continuation

The isolated foundation branch incorporates deployed commit `f970718651d0b701bf82787b6688fb8ad7e66173` from **origin/master**. GitHub deployment `6694394710` reported Production/success. Previous notes called the default branch “main”; its actual name is master. Coupon, confirmation, accounting, dispatch and branding code from that baseline is retained.

All **70 live migration-ledger entries** have matching checked-in source, allowing only CRLF/LF checkout differences. Fifteen missing applied files were recovered from the original workspace and archived local worktrees after SHA-256 matching: multi-item bookings, cart reservation repair, bundle request configuration and twelve historical content migrations. These files are restored history; **do not rerun them**. No live ledger rows or schema were changed.

The migration runner now recognizes only exact or line-ending-equivalent checksums and writes canonical LF checksums for new files. SQL edits, casing, comments and removed trailing newlines still fail checksum validation. The new, unapplied private-city migration no longer opens/commits its own transaction: the runner must atomically own the SQL and ledger insert. A rollback test covers this.

## Offer reader

`src/lib/product-offer-service.ts` joins one global product to its selected city's offer. It reads city stock, online capacity, price tiers and—through a server pricing reader—quantity discounts. Queries filter active offers, active global products and active/public cities even when a service-role client is supplied. Booking-price reads additionally require the city booking gate and a base price.

Card queries load short localization and primary image fields, without FAQ/detail hydration. Reads page in batches of 100. Category membership IDs are deduplicated and split into bounded filters. Detail reads retain aliases and full editorial content. Catalogue products retain global `id` plus explicit `productOfferId` and `marketId`.

Existing public service signatures stay compatible:

```ts
getProductsFromDB(city = "valencia", locale = "en")
getProductBySlugFromDB(slug, locale = "en", city = "valencia")
getProductsByCategoryFromDB(category, locale = "en", city = "valencia")
```

Detail/category cache arguments now include city context. Offer caches use market UUID and locale; category/detail arguments further separate entries. Public market eligibility is resolved outside the data cache on each service call. Existing global catalogue-tag invalidation remains the invalidation boundary. Full-route cache invalidation on market publication changes still belongs to the later launch controls.

## Compatibility gate

`MARKET_CATALOGUE_READ_MODE` is a server environment setting:

| Value | Behavior |
|---|---|
| unset or `legacy` | Existing Valencia reads and informational static fallback. Other cities rejected. |
| `shadow` | Return existing Valencia results, also compare offer product identity/stock/capacity/prices and log mismatch counts with a bounded slug sample. Shadow errors do not replace the legacy result. |
| `offers` | Serve explicit public city offers. Missing schema, unsupported language or unavailable context fails closed. No static or other-city pricing fallback. |

Unknown values fail instead of silently selecting a mode. New database reads have an 8-second per-request timeout. The mode remains **unset**: no production setting was changed. Use a staging environment to exercise shadow/offers before authorizing a release switch. Static build fallback remains available only on the existing legacy path.

## Evidence

- Live read-only SQL: 169 total products, zero missing default offers, zero stock/state or price-tier mismatches.
- Live **anonymous GET-only** PostgREST check through the new reader: 128 active legacy products and 128 offer products, zero mismatches/extra offers; Spanish detail resolved.
- `npm run test:market-offers`: two-city price/stock/identity isolation, cache-argument separation, language separation, category deduplication, cached-market retirement rejection, aliases, scoped discounts, missing-schema failure, rollout modes and migration checksum behavior.
- `npm run test:market-context`: includes proof that rolling back the runner's outer transaction removes the new private-city schema.
- Existing coupon/rental-date/fulfillment/mobility tests protect the reconciled baseline. The standard production build must pass.

The cache test uses an observable substitute for Next's cache; it proves argument separation and service behavior, not Next's production cache internals. Database tests remain isolated fixtures, not a full Supabase staging clone.

## Cart reconciliation and remaining Phase 2 work

| Source | Disposition |
|---|---|
| Local multi-item SQL and cart reservation repair | Exact installed history restored. No live replay. |
| Local `booking-cart.ts`, `bundle-checkout.ts`, cart routes | Keep as implementation references; do not replace deployed source wholesale. |
| Local `quoteBookingCart` and draft/checkout/webhook edits | Need a deliberate port onto current coupon, extra-service and confirmation behavior. Older local cart pricing predates those integrations. |
| Current single-product booking flow | Retained unchanged while offer reads are prepared. |
| `src/lib/queries.ts` | Legacy helper module has no source imports in this baseline. It is not a second live catalogue path; do not reuse it for new city booking code. |

Next: port cart behavior onto this reconciled baseline; move quotes, date blocks, drafts and snapshots to offers; enforce one city per cart; recheck saved context at checkout; verify delayed payment behavior. Reservation SQL also needs explicit public/global-product gates, stable replay semantics and true multi-connection capacity tests. Existing `reserve_booking_cart_inventory` is restored historical code, not newly approved as sufficient for city rollout.

No second-city checkout or new public route is enabled. The offer reader is not an inventory writer or reservation cutover. Full Supabase staging and concurrency verification remain release gates; Docker was unavailable locally. Do not point generic existing DB verification or Telegram scripts at production for these tests.

## Rollback

Before the writer cutover, return the catalogue mode to `legacy` and redeploy/revalidate the catalogue. Retain restored migration history and the additive private-city schema. Once Phase 3 changes write authority, this reader-only rollback rule must be replaced with the approved cutover runbook.
