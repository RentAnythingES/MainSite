# Production Backend Audit — 2026-07-23

## Scope and immediate remediation

This audit reviewed production booking, inventory, payment, fulfillment, admin
authorization, monitoring, and operational lifecycle behavior using read-only
production queries, rollback checks, code review, Stripe verification, and a
production build.

Supabase authentication previously acted as authorization: any authenticated user
could pass the admin guards while public email signup was enabled. Commit `67a1a71`
now requires `auth.users.raw_app_meta_data.role = "admin"` throughout the admin
pages, APIs, and login route. The two legitimate operator accounts were assigned
that role. Public signup no longer grants admin access.

## P0 — checkout security

Status: remediated in application code on 2026-07-24. Both retired paths now return
`410 Gone`; production-runtime regression checks confirmed that manipulated legacy
requests create neither a Stripe session nor a booking.

### Remove the legacy client-priced checkout path

`POST /api/checkout` still accepts a legacy payload when `draftId` is absent. That
branch trusts browser-supplied totals and bypasses the atomic v2 reservation flow,
permitting price manipulation and an oversell race.

Resolution: the legacy branch was removed. `/api/checkout` accepts only a valid,
server-priced booking draft.

`POST /api/bookings` previously trusted client totals and used non-atomic date
blocking. It is now permanently unavailable and returns `410 Gone`.

### Add abuse controls

Public draft creation has no application rate limit or bot challenge. Repeated fake
drafts can temporarily reserve single-unit inventory. Contact, newsletter, and
bundle-request endpoints can also generate unwanted writes or email.

Status: booking-draft creation received durable IP, IP/product, and email rate limits
on 2026-07-24. The counters are atomic across Vercel instances and store only HMAC
hashes. Contact, newsletter, bundle-request, strict input-limit, and bot-control work
remains open.

## P1 — revenue and accounting correctness

### Repair the payment ledger and documents

Production has nine paid/refunded bookings but zero payment-ledger events and zero
booking documents. The helper uses `ON CONFLICT (provider, provider_event_id)`, while
the database only has a partial unique index for those columns. PostgreSQL rejects
the conflict target with `42P10`; the helper logs and returns `null`, document
creation is skipped, and the webhook still reports success.

Status: the idempotency index and write helper were repaired on 2026-07-24. A
rollback-only production test confirmed that duplicate provider events resolve to
one ledger row. New payment and refund events can now be recorded correctly.

Remaining action:

1. Make finance-write failures visible to monitoring.
2. Backfill events and documents from verified booking and Stripe records.
3. Reconcile numbering and tax treatment before issuing documents.

### Make refunds financially safe

The admin cancellation/refund route changes the booking and releases inventory
before requesting the Stripe refund. If Stripe rejects it, local state can say
refunded while the captured payment remains.

Status: remediated on 2026-07-24. Stripe must confirm a successful refund before the
booking changes state. Refund creation uses a booking-scoped idempotency key, failed
or pending refunds leave booking and inventory unchanged, and the terminal status
plus both inventory-release operations commit in one database transaction.

Remaining action: subscribe to Stripe refund lifecycle events and alert/reconcile
pending or externally initiated refunds.

### Enforce fulfillment configuration server-side

The widget exposes a custom-region zone with zero fees even though it is meant to be
a manual quote. Express delivery is client-only and is neither priced nor stored.
Configured minimum orders, same-day cutoffs, and lead times are returned but not
enforced by the server quote.

Required action: exclude quote-only zones from automatic checkout and enforce every
fulfillment rule in the server pricing path.

## P1 — booking operations

### Connect checklist activity to lifecycle transitions

The checklist is persistent but independent of booking status. Checking every task
therefore leaves a booking in `paid`. Five paid rentals had ended at audit time and
were still `paid`; several had all five tasks complete. Status emails, completion
emails, and verified-review invitations consequently never run.

New bookings also receive no checklist rows until someone first interacts with the
checklist endpoint.

Required action:

- Define authoritative transition rules and operator overrides.
- Create task rows automatically for every new booking.
- Advance or prompt for lifecycle changes as milestones complete.
- Reconcile overdue statuses on a schedule.
- Preserve audit events for automatic and manual transitions.

### Register and reconcile physical inventory

Production has zero physical units, events, and assignments. The empty assignment
dropdown is accurate: the feature is deployed but unconfigured.

Aggregate stock controls online availability while physical units are an additive
operational layer, so the two models can diverge. Onboard asset-coded units and
reconcile them with stock, or hide assignment controls until onboarding is complete.

### Remove legacy multi-year blocks

Thirteen active products have unlinked legacy `booking` blocks covering 1,081 future
dates each. Four claim one unit in stock while remaining calendar-blocked; nine
claim zero stock.

Required action: identify owned/bookable products, restore those through the guarded
admin action, and use an explicit product state for SEO-only or unowned items instead
of fake multi-year booking blocks.

## P2 — reliability and observability

### Expand operational monitoring

Recent monitoring runs reported healthy despite the missing finance ledger, zero
physical units, stuck lifecycle states, incomplete checklist coverage, and legacy
orphan blocks. Add alerts for those invariants, refund divergence, and quote-only
zones exposed to checkout.

The booking smoke test should assert that a known intended-live product is actually
available. It currently accepts a structurally valid `unavailable` response.

### Broaden Stripe reconciliation

The live webhook listens only for `checkout.session.completed`. External refunds,
disputes, chargebacks, asynchronous payment outcomes, and expired sessions are not
reconciled. Subscribe to relevant events, verify payment state before fulfillment,
and add scheduled reconciliation.

### Refresh admin sessions

Admin cookies last seven days, but the guard validates only the access token and does
not use the refresh token. Implement secure refresh or align the displayed/session
cookie lifetime with actual behavior.

## Production evidence snapshot

- Products: 178 total, 37 active.
- Bookings: 9 total — 7 paid, 2 refunded.
- Drafts: 24 — 9 paid, 8 cancelled, 7 expired.
- Active paid booking blocks: 7, all linked consistently.
- Payment ledger events and booking documents: 0 and 0.
- Physical units/events/assignments: 0/0/0.
- Bookings missing a complete five-task checklist: 1 at audit time.
- Active products with legacy orphan date blocks: 13.
- Recent monitoring runs: healthy despite the issues above.

## Recommended implementation order

1. Disable legacy checkout and booking paths.
2. Rate-limit booking drafts and public email/write endpoints.
3. Repair and backfill the payment ledger/documents.
4. Enforce fulfillment pricing and quote-only behavior.
5. Implement lifecycle/checklist automation and overdue reconciliation.
6. Onboard physical assets and reconcile inventory.
7. Expand monitoring and Stripe event reconciliation.
