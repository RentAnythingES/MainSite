-- Make the payment-event idempotency key usable as an ON CONFLICT target.
--
-- PostgreSQL unique indexes allow multiple NULL values by default, so the
-- previous partial predicate is unnecessary and prevented Supabase upserts
-- from inferring this index.

DROP INDEX IF EXISTS public.idx_booking_payment_events_provider_event;

CREATE UNIQUE INDEX idx_booking_payment_events_provider_event
  ON public.booking_payment_events (provider, provider_event_id);
