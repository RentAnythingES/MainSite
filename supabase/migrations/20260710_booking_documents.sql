-- Additive booking document foundation.
-- Creates durable invoice/refund document records tied to payment ledger events.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_document_type') THEN
    CREATE TYPE booking_document_type AS ENUM (
      'invoice',
      'refund_receipt',
      'rental_agreement'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_document_status') THEN
    CREATE TYPE booking_document_status AS ENUM (
      'draft',
      'issued',
      'void'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS booking_document_counters (
  document_type booking_document_type NOT NULL,
  document_year INT NOT NULL,
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (document_type, document_year)
);

CREATE TABLE IF NOT EXISTS booking_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_event_id UUID REFERENCES booking_payment_events(id) ON DELETE SET NULL,

  document_type booking_document_type NOT NULL,
  status booking_document_status NOT NULL DEFAULT 'issued',
  document_number TEXT UNIQUE,
  document_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM now())::INT,

  currency TEXT NOT NULL DEFAULT 'eur',
  subtotal_cents INT NOT NULL DEFAULT 0,
  delivery_fee_cents INT NOT NULL DEFAULT 0,
  collection_fee_cents INT NOT NULL DEFAULT 0,
  deposit_cents INT NOT NULL DEFAULT 0,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL DEFAULT 0,

  customer_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  company_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  booking_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  payment_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,

  pdf_url TEXT,
  notes TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  voided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_booking_document_amounts CHECK (
    subtotal_cents >= 0
    AND delivery_fee_cents >= 0
    AND collection_fee_cents >= 0
    AND deposit_cents >= 0
    AND tax_cents >= 0
    AND total_cents >= 0
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_documents_event_type
  ON booking_documents (payment_event_id, document_type)
  WHERE payment_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_booking_documents_booking
  ON booking_documents (booking_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_booking_documents_number
  ON booking_documents (document_number);

CREATE OR REPLACE FUNCTION next_booking_document_number(
  p_document_type booking_document_type,
  p_document_year INT DEFAULT EXTRACT(YEAR FROM now())::INT
)
RETURNS TEXT AS $$
DECLARE
  next_number INT;
  prefix TEXT;
BEGIN
  INSERT INTO booking_document_counters (document_type, document_year, last_number)
  VALUES (p_document_type, p_document_year, 1)
  ON CONFLICT (document_type, document_year)
  DO UPDATE SET
    last_number = booking_document_counters.last_number + 1,
    updated_at = now()
  RETURNING last_number INTO next_number;

  prefix := CASE p_document_type
    WHEN 'invoice' THEN 'RA-INV'
    WHEN 'refund_receipt' THEN 'RA-REF'
    WHEN 'rental_agreement' THEN 'RA-AGR'
    ELSE 'RA-DOC'
  END;

  RETURN prefix || '-' || p_document_year::TEXT || '-' || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_booking_document_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.document_number IS NULL THEN
    NEW.document_year := COALESCE(NEW.document_year, EXTRACT(YEAR FROM now())::INT);
    NEW.document_number := next_booking_document_number(NEW.document_type, NEW.document_year);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'booking_documents_set_number'
  ) THEN
    CREATE TRIGGER booking_documents_set_number
      BEFORE INSERT ON booking_documents
      FOR EACH ROW EXECUTE FUNCTION set_booking_document_number();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'booking_documents_updated_at'
  ) THEN
    CREATE TRIGGER booking_documents_updated_at
      BEFORE UPDATE ON booking_documents
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

ALTER TABLE booking_document_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_documents ENABLE ROW LEVEL SECURITY;
