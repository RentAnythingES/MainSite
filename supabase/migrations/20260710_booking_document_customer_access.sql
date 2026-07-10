-- Add customer-safe document download tokens.
-- These let booking emails link to PDFs without exposing admin routes.

ALTER TABLE booking_documents
  ADD COLUMN IF NOT EXISTS customer_access_token TEXT,
  ADD COLUMN IF NOT EXISTS customer_access_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS customer_access_last_sent_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_documents_customer_access_token
  ON booking_documents (customer_access_token)
  WHERE customer_access_token IS NOT NULL;

UPDATE booking_documents
SET
  customer_access_token = COALESCE(
    customer_access_token,
    replace(uuid_generate_v4()::text, '-', '') || replace(uuid_generate_v4()::text, '-', '')
  ),
  customer_access_expires_at = COALESCE(customer_access_expires_at, now() + interval '365 days')
WHERE customer_access_token IS NULL
  OR customer_access_expires_at IS NULL;
