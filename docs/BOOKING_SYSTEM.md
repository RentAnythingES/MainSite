# Booking System
> Last updated: 2026-07-24

## Current Status

Online checkout is controlled by Supabase product availability, blocked dates, and
datetime inventory holds. There is no separate global pause in the v2 checkout path.
Products that should not be purchasable must be made unavailable through the inventory
and availability data rather than through presentation-only or checkout-only blocks.

The admin availability page distinguishes calendar blocks from product-level online
stock. **Restore online availability** verifies that no active booking, draft, or
inventory hold exists, then restores `stock_available` and removes only unlinked
legacy `booking` date rows. Normal date unblocking continues to affect manual and
maintenance calendar blocks without changing product stock.

Item-level inventory is additive: `inventory_units` records physical assets and
`inventory_unit_events` preserves operational history. Live availability continues
to use aggregate product stock until all physical units for a product have been
onboarded and reconciled; this prevents a partial registry from changing sellable stock.

Bookings can now be linked to specific physical assets through
`booking_inventory_unit_assignments`. Admins assign an available unit, mark it handed
over, and mark it returned. These transitions atomically keep the unit status and event
history synchronized. Cancelling or refunding a booking automatically releases units
that have not been handed over, while a booking cannot be completed until every handed-
over unit has been returned. This operational assignment layer does not yet replace the
aggregate availability calculation.

Initial Booking System v2 code is now in place:

- `/api/availability` accepts date-only legacy checks and datetime `startAt`/`endAt`.
- `/api/booking-options` returns active pickup locations and service zones for the booking widget.
- `/api/booking-drafts` creates server-priced booking drafts and temporary inventory holds.
- Booking-draft creation is rate-limited across Vercel instances by IP,
  IP/product, and email before an inventory hold can be created.
- `/api/checkout` can create Stripe Checkout from a `draftId`.
- `/api/checkout/status` joins Stripe session, booking draft, booking, and inventory state for the success page.
- `/api/webhooks/stripe` can fulfill `checkout.session.completed` from a booking draft.
- `/api/admin/health` exposes authenticated, non-secret configuration status for Stripe, Resend, Supabase, and booking health.
- `/api/admin/bookings/[id]/inventory-units` manages physical-unit assignment and lifecycle transitions.
- Expired draft cleanup now runs before availability checks, draft creation, checkout creation, and admin health checks.
- Checkout cancellation expires the open Stripe session and releases the unpaid inventory hold immediately.
- Returning customers can resume their active payment instead of being blocked by their own checkout hold.
- Client-generated draft IDs let failed or timed-out requests release a hold even if the draft response never reaches the browser.
- Stripe Checkout expiry is aligned with the database draft expiry.
- Paid booking inventory blocks always count toward availability, including blocks that retain their paid draft link.
- `npm run smoke:booking` performs safe, read-only checks against booking options and availability.
- `npm run audit:launch` checks required configuration, core tables, active-product readiness, and expired drafts.
- Checkout and signed-webhook processing failures are written to `system_incidents` and surfaced in admin health after the incident migration is applied.

The v2 migrations have been applied and a controlled live-mode test confirmed draft
creation, Stripe redirect, signed webhook fulfillment, success-page display, admin
visibility, refund email, and refunded booking state. Treat the system as controlled-
release rather than fully open until repeated tests cover each fulfillment mode and
inventory release is verified after cancellation and refund.

## Multi-unit bookings and volume pricing

- Customers choose a quantity before checking availability.
- Availability returns the maximum units available for the selected rental window and
  rejects requests above that capacity.
- `booking_drafts.quantity` and `bookings.quantity` preserve the selected unit count.
- `reserve_booking_inventory(...)` atomically reserves that quantity, preventing two
  overlapping checkouts from overselling aggregate stock.
- Rental charges multiply by quantity. Delivery and collection fees remain one charge
  per booking.
- `product_quantity_discounts` stores product-specific thresholds as basis-point
  discounts. The highest qualifying threshold applies to the rental subtotal only.
- Stripe Checkout displays the selected product quantity while charging the exact
  server-calculated discounted rental total.
- Confirmation emails, success status, invoices, and admin booking records display the
  booked quantity.

Example: a threshold of 5 units with a 4,000 basis-point discount means 40% off the
rental subtotal from five units onward, so five units cost the equivalent of three.

## Kit availability bridge

Kit requests remain staff-confirmed rather than automatically charged. The
`/api/bundle-availability` endpoint checks only bundle components with an explicit
product slug against active aggregate stock, manual date blocks, and overlapping
inventory holds. It returns a known-item rental estimate without delivery fees and
marks unmapped or inactive alternatives for manual confirmation. The customer and
admin kit-request interfaces can rerun this check, but it creates no hold and is not
a final quote. Atomic multi-product reservation requires a dedicated grouped-draft
model and complete inventory mapping before it can safely reach Stripe Checkout.

## Invoicing Compliance Roadmap

The current `booking_documents` implementation creates an operational payment
invoice/receipt after a successful Stripe webhook, but it is not yet a Spanish
accounting-compliant invoicing system. It lacks configurable issuer tax identity,
VAT rules, immutable invoice records, accounting exports, and a reviewed legal PDF
template.

### Proposed source of truth

- **Stripe Checkout** processes card payment and returns payment evidence.
- **RentAnything invoice ledger** issues the legal customer invoice and rectifying
  refund document, preserves the immutable issued snapshot, and owns the
  sequential series/numbering.
- **Stripe Invoicing** is not used for normal rental Checkout payments. If used for
  a separate manual or recurring-billing workflow, it must have its own configured
  tax IDs, tax behaviour, customer address collection, and VAT calculation.

### Required implementation work

1. Add admin-managed legal entity, address, NIF/CIF, invoice series, tax policy,
   payment terms, and invoice footer configuration.
2. Store base amount, VAT rate, VAT amount, gross amount, customer tax identity,
   and immutable issuer/customer snapshots per issued document.
3. Replace refund receipts with linked credit/rectifying invoices where the
   business adviser confirms that treatment is required.
4. Add immutable document versioning/audit events, void/rectification flow, and
   accounting CSV export.
5. Obtain tax-adviser confirmation for Spanish IVA classification, customer-facing
   tax-inclusive pricing, invoice series, and the planned VERI*FACTU approach.

The additive migration `20260711_invoice_compliance_foundation.sql` creates the
admin-managed issuer/tax settings record and the extra immutable invoice fields.
It seeds Escalera Labs S.L. with a provisional 21% IVA-inclusive policy that must
remain marked pending adviser confirmation until verified.

`/api/admin/invoicing/export` provides an authenticated CSV export of issued
documents for accounting reconciliation. It includes document identifiers, dates,
format, customer tax ID when supplied, tax base, IVA rate/amount, gross total, and
the rectified document link.

The baseline content and numbering requirements are in Article 6 of Real Decreto
1619/2012. The current invoicing-software timetable and integrity requirements are
in Real Decreto 1007/2023, as amended; confirm the entity-specific deadline with
the company adviser before relying on the system for production invoicing.

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
9. Cancelling Checkout expires the payment session and releases the temporary hold before returning to the product.

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

## Post-booking transport amendments

Staff can change an eligible confirmed or paid customer-pickup booking to delivery
only or delivery and collection without creating a second rental booking. The admin
creates either a quote based on active service-zone fees or an explicit custom-distance
quote. The customer receives a private, expiring, noindex URL and pays only the added
transport fee through Stripe Checkout.

The quote does not mutate the booking when it is created or when Checkout opens. The
signed Stripe webhook records a `manual_adjustment` payment event and calls
`apply_paid_fulfillment_amendment(...)`, which locks both records, verifies that the
booking is still eligible, applies the new fulfillment snapshot once, and increments
the booking total once. The adjustment creates its own VAT-aware invoice document;
the original rental invoice remains unchanged.

Only one open quote can exist per booking. Expired quotes are closed before creating
a replacement, paid Stripe sessions cannot be cancelled, and webhook retries do not
reapply the charge or resend the confirmation. The first release deliberately supports
only `customer_pickup` bookings in `confirmed` or `paid` status before handover starts.

Migration: `supabase/migrations/20260719_fulfillment_amendments.sql`.

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
- `supabase/migrations/20260724_api_rate_limits.sql`
- `supabase/migrations/20260724_fix_api_rate_limit_clock.sql`

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

Status: `/api/checkout` requires `draftId` and uses only the server-priced booking
draft as its source of truth. The legacy client-priced payload path and direct
`/api/bookings` creation route were retired on 2026-07-24 and return `410 Gone`.
Checkout cleans expired holds before loading a draft, and customer-facing checkout
failures are shown as payment startup issues rather than inventory being fully
booked.

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
- Migration `supabase/migrations/20260724_fix_payment_event_idempotency.sql`
  makes provider event IDs a valid atomic upsert target. Future payment/refund
  ledger writes are verified; historical events still require reconciliation.
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

Paid cancellations/refunds are financially ordered: Stripe must confirm a successful,
idempotent refund before the local booking status changes. Failed or pending refunds
leave inventory reserved and return an actionable admin error. The database function
`transition_booking_terminal_status(...)` atomically locks the expected booking
state, applies the terminal status, and releases legacy and v2 inventory blocks.

Moving a booking to `completed` also creates a one-time verified review invitation
when `supabase/migrations/20260719_verified_booking_reviews.sql` is installed. The
completion email links to a private, `noindex` feedback form. Submission and consent
to publish are separate: staff can approve public display only when the customer has
explicitly opted in. Reviews remain tied to completed bookings internally without
exposing customer contact details publicly.

Migration `supabase/migrations/20260711_booking_ops_tasks.sql` adds internal
per-booking ops checklist tasks. The admin booking detail can track whether the
customer was contacted, equipment prepared, handoff confirmed, return scheduled,
and return inspected without overloading the customer-facing booking status.
Checklist completion currently does not advance booking status, and new bookings do
not receive task rows until the checklist endpoint is first used. This is an
operational gap, not a display problem. See `docs/BACKEND_AUDIT_2026-07-23.md`.
Until that additive migration is applied, the bookings list remains available and
shows the default checklist in a disabled state with a migration warning; booking
status, payments, documents, inventory, and customer-email actions remain usable.
The bookings API reports the checklist capability explicitly, and the checklist
update endpoint returns a focused `503` migration-required response instead of a
generic schema-cache failure.
The shared admin shell also runs the authenticated system-health check and displays
an admin-wide warning when any required schema capability is unavailable, so an
operator sees database drift before opening a feature that depends on it.

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
5. Complete a real low-value checkout from `/internal/stripe-test`.
6. Verify:
   - Stripe payment succeeds.
   - `/api/webhooks/stripe` receives `checkout.session.completed`.
   - `/success` shows the confirmed booking state.
   - Admin booking view shows times, fulfillment, fees, customer details, and Stripe IDs.
   - Confirmation email is delivered.
   - Cancelling/refunding releases inventory and issues the Stripe refund.


## Newsletter Consent

Newsletter signup storage is separate from bookings. The `newsletter_subscribers` table stores explicit consent records through `/api/newsletter`; it should not be used for booking-critical notifications.
