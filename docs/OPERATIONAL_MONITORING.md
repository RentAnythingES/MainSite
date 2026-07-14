# Operational Monitoring

The production deployment runs `/api/cron/operational-health` daily at 07:00 UTC.
Vercel sends `CRON_SECRET` as a Bearer token; use a random value of at least 16
characters in Production and Preview environment settings.

Each run cleans expired booking drafts and checks unresolved incidents, active-product
stock validity, Stripe/webhook configuration, Resend configuration, and invoice settings.
Results are stored in `monitoring_runs`. Identical issue fingerprints send at most one
alert email per 24 hours. The admin dashboard shows migration/configuration readiness
and the most recent monitoring result.
