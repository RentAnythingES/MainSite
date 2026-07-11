# Booking System
> Last updated: 2026-07-07

## Current Status

Online payments are intentionally paused while the booking system is rebuilt.
All active products are blocked in Supabase availability data through 2029-07-07.

The Stripe webhook transport is working, but paid booking fulfillment is not yet ready
to reopen because the legacy checkout flow does not model rental times,
fulfillment modes, collection, service zones, or booking drafts.

The legacy checkout route has been hardened to resolve `product_slug` to the
Supabase product UUID server-side before creating Stripe Checkout. This is a bridge
fix only; the v2 flow must replace it with booking drafts before reopening payments.

Initial Booking System v2 code is now in place:

- `/api/availability` accepts date-only legacy checks and datetime `startAt`/`endAt`.
- `/api/booking-options` returns active pickup locations and service zones for the booking widget.
- `/api/booking-drafts` creates server-priced booking drafts and temporary inventory holds.
- `/api/checkout` can create Stripe Checkout from a `draftId`.
- `/api/checkout/status` joins Stripe session, booking draft, booking, and inventory state for the success page.
- `/api/webhooks/stripe` can fulfill `checkout.session.completed` from a booking draft.
- `/api/admin/health` exposes authenticated, non-secret configuration status for Stripe, Resend, Supabase, and booking pause flags.
- Expired draft cleanup now runs before availability checks, draft creation, checkout creation, and admin health checks.

This code is not live-safe until the v2 migration has been applied in Supabase and
a full test booking confirms draft creation, Stripe redirect, webhook fulfillment,
admin visibility, cancellation, refund, and inventory release.

## Target Booking Model

### Customer Flow

1. Customer selects start date and time.
2. Customer selects end date and time.
3. Customer selects fulfillment:
   - Customer pickup from a configured pickup location.
   - Delivery only.
   - Delivery and collection.
4. Customer selects/enters delivery and collection addresses where needed.
5. API prices the rental using server-side product pricing and zone fees.
6. API creates a booking draft and temporary inventory hold.
7. Stripe Checkout uses only the booking draft ID in metadata.
8. Stripe webhook marks the draft paid, creates the booking, and converts the hold into a booking inventory block.

### Fulfillment Modes

| Mode | Customer Pays | Required Fields |
|------|---------------|-----------------|
| `customer_pickup` | Rental subtotal only | Pickup location |
| `delivery_only` | Rental subtotal + delivery fee | Delivery address and zone |
| `delivery_and_collection` | Rental subtotal + roundtrip or delivery + collection fees | Delivery address/zone and collection address/zone |

### Time Model

Bookings use `rental_start_at` and `rental_end_at` timestamps in the `Europe/Madrid`
timezone. Date-only `start_date` and `end_date` remain for legacy compatibility,
but new availability and checkout logic must use datetime ranges.

### Inventory Model

New inventory blocks live in `booking_inventory_blocks`:

- `product_id`
- `starts_at`
- `ends_at`
- `quantity`
- `booking_draft_id` for temporary checkout holds
- `booking_id` for paid bookings
- `reason`

Availability must check overlapping datetime blocks and compare against
`products.stock_total`. Date-only `blocked_dates` remains available for legacy admin
views and manual broad blocking, but the new checkout flow should use datetime blocks.

Expired unpaid drafts must not keep inventory blocked. `cleanupExpiredBookingDrafts`
marks expired `draft` / `checkout_created` rows as `expired` and removes unpaid
`booking_inventory_blocks`. It is intentionally called from multiple API routes so
stale holds are cleaned even if a customer only checks availability or an admin opens
health status.

## Stripe Contract

Stripe metadata should contain only stable server-generated identifiers:

- `booking_draft_id`
- `product_id`

Stripe metadata should not be the source of truth for customer details, product slug,
pricing, delivery address, or dates. Those values belong in `booking_drafts` and are
copied into `bookings` after successful payment.

Webhook event required before reopening:

- `checkout.session.completed`

Webhook must be idempotent by:

- `stripe_checkout_session_id`
- `stripe_payment_intent_id`
- `booking_draft_id`

## Rollout Phases

### Phase 1 — Schema Foundation

- Add pickup locations.
- Add service zones.
- Add booking drafts.
- Add datetime inventory blocks.
- Add v2 booking columns for times and fulfillment.
- Add atomic inventory hold function `reserve_booking_inventory`.

Migration:

- `supabase/migrations/20260707_booking_system_v2.sql`

### Phase 2 — Availability API

- Accept `product_slug`, `start_at`, `end_at`, and fulfillment mode.
- Resolve product slug to UUID server-side.
- Check `stock_total`, `stock_available`, and overlapping datetime blocks.
- Return available fulfillment options, pickup locations, and zone fees.

Status: implemented as `/api/availability` with backwards-compatible `start`/`end`
support for the existing date checker. Availability checks also clean expired unpaid
draft holds before calculating overlapping inventory.

Booking options are also exposed through `/api/booking-options` so the widget can
show active pickup locations and configured service zones before the customer
checks availability. Current customer pickup options are Burjassot and Paterna;
central Valencia pickup is disabled until an operational pickup point is ready.

Fulfillment configuration now supports customer-facing instructions, internal
notes, lead times, handoff contacts, and delivery/collection windows. The API uses
these fields when present and falls back to the older `pickup_instructions` /
`description` fields until `supabase/migrations/20260709_fulfillment_instruction_config.sql`
has been applied.

Admins can edit pickup locations and service zones at `/admin/fulfillment`, including
active status, customer instructions, internal notes, lead time, delivery/collection
windows, and zone fees. Public booking APIs still return active options only.

### Phase 3 — Booking Draft API

- Create a server-side booking draft.
- Calculate rental days and all fees server-side.
- Create temporary inventory hold.
- Return draft summary to the client.
- Mark expired drafts and release their temporary inventory holds before creating
  a new draft.

Status: implemented as `/api/booking-drafts`. Requires the v2 migration before it
can run against Supabase. Draft creation uses the shared expired-hold cleanup helper
before attempting a new reservation.

### Phase 4 — Stripe Checkout

- Create Checkout from booking draft only.
- Store `booking_draft_id` in Stripe metadata.
- Set idempotency key from draft ID.
- Never trust client-submitted totals.

Status: `draftId` path implemented in `/api/checkout`. Legacy payload path remains
as a bridge while online bookings are paused. Checkout now cleans expired holds
before loading a draft, and customer-facing checkout failures are shown as payment
startup issues rather than inventory being fully booked.

### Phase 5 — Webhook Fulfillment

- Read booking draft from Supabase.
- Verify draft is payable and not expired.
- Create paid booking with full fulfillment snapshot.
- Convert draft inventory hold to booking inventory block.
- Send confirmation email.

Status: draft fulfillment path implemented for `checkout.session.completed`.
The success page reads `/api/checkout/status` so it can distinguish confirmed
bookings from paid-but-still-processing webhook states.

Confirmation emails now include fulfillment configuration from pickup locations or
service zones when available. The internal admin notification includes customer
details, fulfillment instructions, internal ops notes, and Stripe checkout/payment
IDs.

Payment ledger foundation:

- Migration `supabase/migrations/20260710_booking_payment_events.sql` adds
  `booking_payment_events` for durable finance events.
- Migration `supabase/migrations/20260710_booking_documents.sql` adds
  `booking_documents` and yearly sequential document counters.
- Stripe `checkout.session.completed` records a `payment` event after the booking is
  created.
- Successful payment events create issued invoice records with booking, customer,
  company, and payment snapshots.
- Admin cancellation/refund actions record `refund` events, including failed refund
  attempts.
- Successful refund events create issued refund receipt records.
- Ledger writes are intentionally non-blocking so checkout/refund operations keep
  working even if the migration has not been applied yet.
- Admins can download protected PDF files for invoice and refund receipt records
  from `/admin/bookings`.
- Booking confirmation emails include customer-safe invoice links when an invoice
  document is created. Refund/cancellation emails include customer-safe refund
  receipt links when a refund receipt is created.
- Customer document links use `customer_access_token` and
  `customer_access_expires_at`; they do not expose admin routes.
- Admins can resend an invoice/refund receipt link from the booking document card.
  The resend path repairs missing/expired access tokens and records
  `customer_access_last_sent_at`.
- Admin "Mark Paid Manually" transitions record a `manual` provider payment event,
  create an invoice document, and include the invoice link in the payment received
  email. This supports cash, bank transfer, or other offline payment handling.

### Phase 6 — Admin Operations

- Show rental start/end times.
- Show fulfillment mode, delivery/collection addresses, pickup location, and fees.
- Support status transitions, refunds, cancellations, and inventory release.

Status: admin booking list now shows v2 rental windows, fulfillment mode, pickup
locations, service zones, delivery address, and collection address. Cancelling,
refunding, or completing a booking releases legacy `blocked_dates` and v2
`booking_inventory_blocks`; cancelled/refunded paid bookings attempt a Stripe
refund.

Admin status actions are fulfillment-aware: customer pickup bookings show pickup
language, while delivery bookings show delivery/collection language. Customer
status emails include the full rental datetime window and the configured pickup
location or delivery/collection details.

Migration `supabase/migrations/20260711_booking_ops_tasks.sql` adds internal
per-booking ops checklist tasks. The admin booking detail can track whether the
customer was contacted, equipment prepared, handoff confirmed, return scheduled,
and return inspected without overloading the customer-facing booking status.
Until that additive migration is applied, the bookings list remains available and
shows the default checklist; toggling checklist tasks requires the migration.

Expanded admin booking rows also show payment totals, Stripe checkout/payment IDs,
active/released inventory block status, and a lightweight status timeline so support
can quickly confirm whether a booking is paid, refunded, released, or still holding
inventory.

Expanded rows also show a finance ledger with payment/refund events once
`booking_payment_events` exists in Supabase. This is the first step toward invoice,
refund receipt, deposit, and payment-request parity.

Expanded rows also show booking documents once `booking_documents` exists in
Supabase. New payments create invoice records; new refunds create refund receipt
records. The admin shows document numbers/statuses and links to protected PDF
downloads for each document.

An authenticated `/api/admin/health` endpoint reports whether Stripe, Stripe
webhook secret, Resend, Supabase keys, booking pause flags, active draft counts,
unpaid hold counts, expired hold counts, and last cleanup results are configured.
Email deliverability notes live in `docs/EMAIL_DELIVERABILITY.md`.

### Phase 7 — Test Booking

- Re-enable bookings only after a full test-mode or low-value live booking passes:
  - availability
  - draft creation
  - Stripe Checkout
  - webhook fulfillment
  - admin visibility
  - cancellation/refund path


### Private Stripe Live Test Route

Route:

- `/internal/stripe-test`

This route is unlisted, excluded from `sitemap.ts`, and marked `noindex`. It renders
the real `BookingWidget` and uses the product slug `stripe-test-rental`. The page is
only a customer-facing shell; pricing, stock, availability, booking draft creation,
Stripe Checkout, and webhook fulfillment still come from Supabase and Stripe.

Before testing live payments:

1. Create a Supabase/admin product with slug `stripe-test-rental`.
2. Set it active with `stock_total = 1` and `stock_available = 1`.
3. Add pricing tiers at a low live amount, e.g. EUR 1.00 to EUR 2.00 per day.
4. Do not add the product to `src/data/products.ts`, so it does not appear in public
   product grids or SEO routes.
5. Temporarily set Vercel booking pause flags to false:
   - `BOOKINGS_PAUSED=false`
   - `NEXT_PUBLIC_BOOKINGS_PAUSED=false`
6. Complete a real low-value checkout from `/internal/stripe-test`.
7. Verify:
   - Stripe payment succeeds.
   - `/api/webhooks/stripe` receives `checkout.session.completed`.
   - `/success` shows the confirmed booking state.
   - Admin booking view shows times, fulfillment, fees, customer details, and Stripe IDs.
   - Confirmation email is delivered.
   - Cancelling/refunding releases inventory and issues the Stripe refund.
8. Return booking pause flags to true until the public catalogue is ready.


## Newsletter Consent

Newsletter signup storage is separate from bookings. The `newsletter_subscribers` table stores explicit consent records through `/api/newsletter`; it should not be used for booking-critical notifications.
