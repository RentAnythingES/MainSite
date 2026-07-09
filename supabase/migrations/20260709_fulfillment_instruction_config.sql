-- Add richer fulfillment configuration for customer-facing instructions,
-- internal operations notes, and lead-time promises.

ALTER TABLE pickup_locations
  ADD COLUMN IF NOT EXISTS customer_instructions TEXT,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS lead_time_hours INT NOT NULL DEFAULT 24,
  ADD COLUMN IF NOT EXISTS handoff_contact TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_template TEXT;

ALTER TABLE service_zones
  ADD COLUMN IF NOT EXISTS customer_instructions TEXT,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS lead_time_hours INT NOT NULL DEFAULT 24,
  ADD COLUMN IF NOT EXISTS same_day_cutoff TIME,
  ADD COLUMN IF NOT EXISTS delivery_window TEXT,
  ADD COLUMN IF NOT EXISTS collection_window TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_template TEXT;

UPDATE pickup_locations
SET
  customer_instructions = COALESCE(
    customer_instructions,
    pickup_instructions,
    'We will confirm the exact pickup instructions after checking inventory.'
  ),
  lead_time_hours = COALESCE(lead_time_hours, 24)
WHERE customer_instructions IS NULL
   OR lead_time_hours IS NULL;

UPDATE service_zones
SET
  customer_instructions = COALESCE(
    customer_instructions,
    description,
    'We will confirm the exact delivery and collection window after checking inventory.'
  ),
  delivery_window = COALESCE(delivery_window, 'Window confirmed after booking'),
  collection_window = COALESCE(collection_window, 'Window confirmed after booking'),
  lead_time_hours = COALESCE(lead_time_hours, 24)
WHERE customer_instructions IS NULL
   OR delivery_window IS NULL
   OR collection_window IS NULL
   OR lead_time_hours IS NULL;
