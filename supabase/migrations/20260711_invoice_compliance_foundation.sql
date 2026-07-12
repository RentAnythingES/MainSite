-- RentAnything.es — Spanish invoice compliance foundation
-- Additive only: existing booking documents remain unchanged.

CREATE TABLE IF NOT EXISTS invoice_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  domestic_tax_id TEXT NOT NULL,
  eu_vat_id TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'ES',
  currency TEXT NOT NULL DEFAULT 'EUR',
  default_tax_rate_bps INT NOT NULL DEFAULT 2100 CHECK (default_tax_rate_bps BETWEEN 0 AND 10000),
  prices_include_tax BOOLEAN NOT NULL DEFAULT TRUE,
  simplified_invoice_limit_cents INT NOT NULL DEFAULT 40000 CHECK (simplified_invoice_limit_cents >= 0),
  full_invoice_series_prefix TEXT NOT NULL DEFAULT 'RA',
  simplified_invoice_series_prefix TEXT NOT NULL DEFAULT 'RAS',
  rectifying_invoice_series_prefix TEXT NOT NULL DEFAULT 'RAR',
  payment_terms_text TEXT NOT NULL DEFAULT 'Paid by card via Stripe on issue date.',
  invoice_footer_text TEXT,
  tax_policy_status TEXT NOT NULL DEFAULT 'pending_adviser_confirmation'
    CHECK (tax_policy_status IN ('pending_adviser_confirmation', 'confirmed')),
  verifactu_status TEXT NOT NULL DEFAULT 'planned'
    CHECK (verifactu_status IN ('planned', 'in_progress', 'integrated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO invoice_settings (
  id,
  legal_name,
  trading_name,
  domestic_tax_id,
  eu_vat_id,
  address_line_1,
  postal_code,
  city,
  country_code
)
VALUES (
  TRUE,
  'Escalera Labs S.L.',
  'RentAnything.es',
  'B22961221',
  'ESB22961221',
  'Calle Obispo Munoz 73',
  '46100',
  'Burjassot',
  'ES'
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE booking_documents
  ADD COLUMN IF NOT EXISTS invoice_format TEXT
    CHECK (invoice_format IN ('full', 'simplified', 'rectifying')),
  ADD COLUMN IF NOT EXISTS tax_rate_bps INT
    CHECK (tax_rate_bps BETWEEN 0 AND 10000),
  ADD COLUMN IF NOT EXISTS tax_inclusive BOOLEAN,
  ADD COLUMN IF NOT EXISTS tax_base_cents INT,
  ADD COLUMN IF NOT EXISTS customer_tax_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS rectifies_document_id UUID REFERENCES booking_documents(id),
  ADD COLUMN IF NOT EXISTS immutable_at TIMESTAMPTZ;

ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'invoice_settings_updated_at'
  ) THEN
    CREATE TRIGGER invoice_settings_updated_at
      BEFORE UPDATE ON invoice_settings
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
  END IF;
END $$;
