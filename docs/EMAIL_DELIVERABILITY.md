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
