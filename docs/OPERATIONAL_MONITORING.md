# Operational Monitoring

The production deployment runs `/api/cron/operational-health` daily at 07:00 UTC.
Vercel sends `CRON_SECRET` as a Bearer token; use a random value of at least 16
characters in Production and Preview environment settings.

Each run cleans expired booking drafts and checks unresolved incidents, active-product
stock validity, Stripe/webhook configuration, Resend configuration, and invoice settings.
Results are stored in `monitoring_runs`. Identical issue fingerprints send at most one
alert email per 24 hours. The admin dashboard shows migration/configuration readiness
and the most recent monitoring result.

## Known coverage gaps

The 2026-07-23 production audit found that a healthy run does not currently prove
business-flow health. Monitoring does not yet detect missing payment-ledger events
or documents, overdue booking lifecycle states, missing checklist rows, unlinked
multi-year inventory blocks, zero/unreconciled physical inventory, Stripe refund
divergence, or quote-only service zones exposed to automatic checkout.

These checks should be added before the monitor is treated as a launch-readiness
signal. The full evidence and remediation order are recorded in
`docs/BACKEND_AUDIT_2026-07-23.md`.
