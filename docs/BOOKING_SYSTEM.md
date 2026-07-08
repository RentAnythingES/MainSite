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
support for the existing date checker.

Booking options are also exposed through `/api/booking-options` so the widget can
show Burjassot, Paterna, Valencia pickup, and configured service zones before the
customer checks availability.

### Phase 3 — Booking Draft API

- Create a server-side booking draft.
- Calculate rental days and all fees server-side.
- Create temporary inventory hold.
- Return draft summary to the client.
- Mark expired drafts and release their temporary inventory holds before creating
  a new draft.

Status: implemented as `/api/booking-drafts`. Requires the v2 migration before it
can run against Supabase.

### Phase 4 — Stripe Checkout

- Create Checkout from booking draft only.
- Store `booking_draft_id` in Stripe metadata.
- Set idempotency key from draft ID.
- Never trust client-submitted totals.

Status: `draftId` path implemented in `/api/checkout`. Legacy payload path remains
as a bridge while online bookings are paused.

### Phase 5 — Webhook Fulfillment

- Read booking draft from Supabase.
- Verify draft is payable and not expired.
- Create paid booking with full fulfillment snapshot.
- Convert draft inventory hold to booking inventory block.
- Send confirmation email.

Status: draft fulfillment path implemented for `checkout.session.completed`.
The success page reads `/api/checkout/status` so it can distinguish confirmed
bookings from paid-but-still-processing webhook states.

### Phase 6 — Admin Operations

- Show rental start/end times.
- Show fulfillment mode, delivery/collection addresses, pickup location, and fees.
- Support status transitions, refunds, cancellations, and inventory release.

Status: admin booking list now shows v2 rental windows, fulfillment mode, pickup
locations, service zones, delivery address, and collection address. Cancelling,
refunding, or completing a booking releases legacy `blocked_dates` and v2
`booking_inventory_blocks`; cancelled/refunded paid bookings attempt a Stripe
refund.

An authenticated `/api/admin/health` endpoint reports whether Stripe, Stripe
webhook secret, Resend, Supabase keys, and booking pause flags are configured.
Email deliverability notes live in `docs/EMAIL_DELIVERABILITY.md`.

### Phase 7 — Test Booking

- Re-enable bookings only after a full test-mode or low-value live booking passes:
  - availability
  - draft creation
  - Stripe Checkout
  - webhook fulfillment
  - admin visibility
  - cancellation/refund path
