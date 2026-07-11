# Email Deliverability
> Last updated: 2026-07-08

## Current Sending Setup

Transactional email is sent through Resend.

Environment variables:

- `RESEND_API_KEY`
- `FROM_EMAIL` — defaults to `RentAnything <noreply@rentanything.es>`
- `CONTACT_EMAIL` — defaults to `hello@rentanything.es`

Code paths:

- Contact form: `/api/contact`
- Booking confirmations/status updates: `src/lib/email.ts`
- Authenticated health check: `GET /api/admin/health`
- Authenticated Resend test email: `POST /api/admin/health`

Booking status emails are sent from admin status transitions. They include the
full rental datetime window, fulfillment-specific wording, customer-facing
pickup/delivery instructions, and any customer-safe invoice/refund links created
for the booking.

## DNS Observed From Local Lookup

Observed on 2026-07-08:

- MX records point to Google Workspace (`aspmx.l.google.com`, `alt*.aspmx.l.google.com`).
- Root TXT contains Google site verification.
- `resend._domainkey.rentanything.es` has a DKIM public key.
- `_dmarc.rentanything.es` did not resolve.

## Before Reopening Payments

- Confirm Resend dashboard shows `rentanything.es` as verified.
- Add/confirm SPF record that includes Resend if Resend requires it for the configured sending domain.
- Add a DMARC record, starting conservative if needed:
  - `_dmarc.rentanything.es`
  - `v=DMARC1; p=none; rua=mailto:hello@rentanything.es`
- Trigger `POST /api/admin/health` from an authenticated admin session and confirm the test email arrives.
- Confirm booking confirmation and admin notification emails arrive during the controlled test booking.


## Transactional Email Templates

All main transactional emails are centralized in `src/lib/email.ts` and use the same branded wrapper: teal RentAnything header, neutral body card, clear CTA, WhatsApp fallback, and `Travel light. Feel at home.` footer.

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

Booking confirmation emails can include customer-safe invoice PDF links when a
booking document exists. Refund/cancellation emails can include refund receipt PDF
links after a successful Stripe refund. These links use document access tokens at
`/api/documents/[token]/pdf`, not admin routes.

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

Newsletter/signup storage is now backed by `newsletter_subscribers`. Any future signup form must collect explicit consent and post through `/api/newsletter` so consent text/version, source, IP, user agent, active status, and unsubscribe token are stored.
