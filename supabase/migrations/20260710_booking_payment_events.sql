-- Additive finance ledger for bookings.
-- This records Stripe payments/refunds as durable operational events without
-- changing the existing booking lifecycle.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_payment_event_type') THEN
    CREATE TYPE booking_payment_event_type AS ENUM (
      'payment',
      'refund',
      'deposit_authorization',
      'deposit_capture',
      'deposit_release',
      'manual_adjustment'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_payment_event_status') THEN
    CREATE TYPE booking_payment_event_status AS ENUM (
      'pending',
      'succeeded',
      'failed',
      'cancelled'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS booking_payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  booking_draft_id UUID REFERENCES booking_drafts(id) ON DELETE SET NULL,

  event_type booking_payment_event_type NOT NULL,
  status booking_payment_event_status NOT NULL DEFAULT 'succeeded',
  provider TEXT NOT NULL DEFAULT 'stripe',
  currency TEXT NOT NULL DEFAULT 'eur',
  amount_cents INT NOT NULL,

  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_refund_id TEXT,
  stripe_charge_id TEXT,
  provider_event_id TEXT,

  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_payment_event_amount CHECK (amount_cents >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_payment_events_provider_event
  ON booking_payment_events (provider, provider_event_id)
  WHERE provider_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_booking_payment_events_booking
  ON booking_payment_events (booking_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_booking_payment_events_type_status
  ON booking_payment_events (event_type, status);

ALTER TABLE booking_payment_events ENABLE ROW LEVEL SECURITY;
