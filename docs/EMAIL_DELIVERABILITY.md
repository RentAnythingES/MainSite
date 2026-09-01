# Email Deliverability
> Last updated: 2026-08-27

## Current Sending Setup

Transactional email is sent through Resend.

Environment variables:

- `RESEND_API_KEY`
- `FROM_EMAIL` — defaults to `Rent&Roll <bookings@rentandroll.com>`
- `CONTACT_EMAIL` — defaults to `hello@rentandroll.com`

Resend API keys can be restricted to one sending domain. A verified domain and
valid DNS records are not sufficient when the deployed key is still scoped to a
former domain. Domain migrations must explicitly authorize the new domain on the
existing key or replace `RESEND_API_KEY` in every deployed environment.

Code paths:

- Contact form: `/api/contact`
- Booking confirmations/status updates: `src/lib/email.ts`
- Authenticated health check: `GET /api/admin/health`
- Authenticated Resend test email: `POST /api/admin/health`

Booking status emails are sent from admin status transitions. They include the
full rental datetime window, fulfillment-specific wording, customer-facing
pickup/delivery instructions, and any customer-safe invoice/refund links created
for the booking.

## Current Domain Setup

Confirmed during the Rent&Roll migration on 2026-08-07:

- Resend shows the root sending domain `rentandroll.com` as verified.
- Transactional mail uses `Rent&Roll <bookings@rentandroll.com>`; no sending
  subdomain is required for the current startup setup.
- Cloudflare Email Routing is enabled for `rentandroll.com`.
- A catch-all forwards incoming `@rentandroll.com` mail to the existing
  `hello@rentanything.es` inbox.
- Receiving and transactional sending are separate: Cloudflare handles inbound
  forwarding, while Resend handles application-generated outbound mail.

## Before Reopening Payments

- Confirm the deployed production environment uses the verified
  `bookings@rentandroll.com` sender.
- Confirm the deployed `RESEND_API_KEY` is authorized to send from
  `rentandroll.com`; test the exact production sender, not only DNS verification.
- Trigger `POST /api/admin/health` from an authenticated admin session and confirm the test email arrives.
- Confirm booking confirmation and admin notification emails arrive during the controlled test booking.

DMARC monitoring and policy hardening are recommended follow-up deliverability
work, but they do not block the domain cutover or the controlled booking test.


## Transactional Email Templates

All main transactional emails are centralized in `src/lib/email.ts` and use the same branded wrapper: teal Rent&Roll header, neutral body card, clear CTA, WhatsApp fallback, and the shared brand footer.

| Email | Helper | Trigger / Status | Current wiring |
|-------|--------|------------------|----------------|
| Contact admin notification | `sendContactNotification` | Contact form submission | `/api/contact` |
| Contact customer auto-reply | `sendContactAutoReply` | Contact form submission | `/api/contact` |
| Booking confirmation | `sendBookingConfirmation` | Booking created / Stripe checkout fulfilled | `/api/bookings`, `/api/webhooks/stripe` |
| Payment received | `sendBookingStatusUpdate(..., "paid")` | Admin status transition to `paid`, including manual payment invoice link when created | `/api/admin/bookings/[id]` |
| Pickup ready / delivery on the way | `sendBookingStatusUpdate(..., "delivering")` | Admin status transition to `delivering` | `/api/admin/bookings/[id]` |
| Picked up / delivered | `sendBookingStatusUpdate(..., "active")` | Admin status transition to `active` | `/api/admin/bookings/[id]` |
| Return reminder / collection scheduled | `sendBookingStatusUpdate(..., "returning")` | Admin status transition to `returning` | `/api/admin/bookings/[id]` |
| Rental complete | `sendBookingStatusUpdate(..., "completed")` | Admin status transition to `completed` | `/api/admin/bookings/[id]` |
| Cancellation | `sendBookingStatusUpdate(..., "cancelled")` | Admin status transition to `cancelled` | `/api/admin/bookings/[id]` |
| Refund processed | `sendBookingStatusUpdate(..., "refunded")` | Admin status transition to `refunded` | `/api/admin/bookings/[id]` |
| Document resend | `sendBookingDocumentLink` | Admin clicks "Email PDF" on booking document | `/api/admin/bookings/[id]/documents/[documentId]/email` |
| Signup / newsletter welcome | `sendSignupWelcome` | `/api/newsletter` consent capture | Wired on blog newsletter form |
| Health check | `sendEmailHealthCheck` | Admin email test | `/api/admin/health` |
| Operational alert | `sendOperationalAlert` | Daily secure Vercel Cron; deduplicated for 24 hours | `/api/cron/operational-health` |

Booking confirmation emails can include customer-safe invoice PDF links when a
booking document exists. Refund/cancellation emails can include refund receipt PDF
links after a successful Stripe refund. These links use document access tokens at
`/api/documents/[token]/pdf`, not admin routes.

Booking confirmation sends inspect Resend's returned error object, use deterministic
customer/admin idempotency keys, and fail the Stripe webhook when Resend rejects a
message. A Stripe retry for an already-created booking retries the confirmation
instead of skipping it; Resend idempotency prevents normal retries from duplicating
customer or admin messages.

Admins can resend a single invoice/refund receipt link from `/admin/bookings`. The
resend route repairs missing/expired customer document access tokens before sending
and records `customer_access_last_sent_at`.

### Fulfillment-Aware Copy

Booking lifecycle emails adapt to `fulfillmentMode`:

- `customer_pickup`: pickup ready, picked up, return reminder.
- `delivery_only`: delivery on the way, delivered, pickup/return coordination where needed.
- `delivery_and_collection`: delivery window and collection scheduling language.

When fulfillment configuration exists, booking confirmation and lifecycle emails also
include customer-facing pickup/delivery instructions, lead-time expectations, and
delivery/collection windows. The internal admin copy includes ops notes plus Stripe
checkout/payment identifiers for faster support follow-up.

### Current Gap

Newsletter/signup storage is backed by `newsletter_subscribers`. Any signup form must
collect explicit consent and post through `/api/newsletter` so consent text/version,
source, IP, user agent, active status, and unsubscribe token are stored. Welcome emails
include a tokenized link to `/newsletter/unsubscribe`; the confirmation page uses POST
to deactivate the subscription so email-link scanners cannot unsubscribe recipients.
