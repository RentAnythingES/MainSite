# Private city setup — first expansion slice

Follow-up: [offer reads and reconciled baseline](MARKET_OFFER_READS_2026-09-27.md) records deployment verification and recovery of all missing applied migration sources. Full Supabase staging remains pending.

## What this adds

- `/admin/markets`: platform-admin city list, private creation and configuration editing.
- Creation sets default, active, public, booking and index flags to false. This screen has no launch controls. Operating/default cities allow name changes only. Slugs are immutable after creation.
- Setup supports EUR and English/Spanish. German remains unavailable until the shared localization phase supports it.
- `save_private_market` uses row locking, optimistic revision checks, an atomic audit event and a second platform-admin check in Postgres. Public roles cannot execute the function or read its audit records.
- `/api/booking-options?marketSlug=valencia&locale=es` resolves explicit context. Omitted city preserves Valencia; empty, unknown, private and disabled contexts fail closed. Response fields remain `pickupLocations` and `serviceZones`.
- Public fulfillment readers require a city UUID. Compatibility queries retain city and automatic-checkout filters. Public database roles cannot read private cities or internal fulfillment notes/contact details.

## Boundaries

`resolveMarketContext` supports public, operator and historical modes. Internal ID resolution is **not authorization**: a caller must authorize the actor or referenced transaction first. Historical resolution bypasses publication gates so retired cities and historical languages remain readable.

This does not yet enable non-Valencia checkout, offer-based inventory writers, operator memberships, city communications, German pages or city SEO. New cities stay dormant. Inventory and pricing authority remain unchanged.

## Verification

Run `npm run test:market-context`, the existing rental-date/fulfillment-policy/mobility-inquiry tests, and `npx --no-install next build`.

Market tests use intercepted HTTP and an ephemeral PGlite Postgres database. They never load `.env.local`, connect to production, send messages or create payment sessions. The fixture uses checked-in market/original fulfillment table definitions plus relevant later columns; it executes the exact new migration. It is not a full Supabase migration replay or production concurrency benchmark.

Cover: missing-schema failure, city/locale validation, public gates, legacy payload, scoped compatibility queries, private fields, admin authorization, same-origin enforcement, dormant creation, audit rollback and stale edits.

## Release sequence and remaining gates

Implementation starts from remote main `d48236a0a5b5944623b85f955ed7f4b36e0a0729`, isolated from the dirty original workspace. No production environment file was copied.

Before deployment:

1. Verify the deployed application SHA against this baseline.
2. Reconcile the live schema ledger and exact applied sources for `20260805_multi_item_bookings.sql` and `20260907_bundle_cart_reservation.sql`, absent from remote main. Review local cart changes against current confirmations/dispatch/accounting; do not merge the dirty tree wholesale.
3. Apply `20260927_private_market_setup.sql` to a disposable full Supabase clone and verify current anon/authenticated grants and representative Valencia reads. Installed foundation and fulfillment migrations are required. Audit direct clients using `select('*')` on fulfillment tables: restricted column grants intentionally reject it.
4. Apply the reviewed additive migration before releasing the admin surface. Missing RPC returns 503; no partial application write occurs. Confirm exactly one default market and unchanged Valencia flags/options after rollout.

Do not use `db:preview:markets`, `db:verify` or `test:telegram` as generic safe checks: existing scripts can target the configured database or send real messages.

## Rollback

Revert/hide the new admin surface if needed. Keep the additive audit table/function and dormant cities; no stock or prices moved. Preserve restrictive public policies and column grants. Do not restore permissive reads as a UI rollback. Continue to fail closed if the installed market foundation becomes unavailable.

## Next slice

Complete release-baseline reconciliation, then Phase 2: city offers for catalogue selection, pricing, availability and reservations. The central-versus-independent seller/payment decision remains open for dependent financial work.
