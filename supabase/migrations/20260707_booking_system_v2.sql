-- ============================================
-- RentAnything.es — Booking System v2
-- Additive migration for robust rental bookings.
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_mode') THEN
    CREATE TYPE fulfillment_mode AS ENUM (
      'customer_pickup',
      'delivery_only',
      'delivery_and_collection'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_draft_status') THEN
    CREATE TYPE booking_draft_status AS ENUM (
      'draft',
      'checkout_created',
      'paid',
      'expired',
      'cancelled'
    );
  END IF;
END $$;

-- ============================================
-- FULFILLMENT CONFIGURATION
-- ============================================
CREATE TABLE IF NOT EXISTS pickup_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'valencia',
  postal_code TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  pickup_instructions TEXT,
  opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'valencia',
  description TEXT,
  postal_codes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  delivery_fee_cents INT NOT NULL DEFAULT 0,
  collection_fee_cents INT NOT NULL DEFAULT 0,
  roundtrip_fee_cents INT NOT NULL DEFAULT 0,
  express_surcharge_cents INT NOT NULL DEFAULT 0,
  minimum_order_cents INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_service_zone_fees CHECK (
    delivery_fee_cents >= 0
    AND collection_fee_cents >= 0
    AND roundtrip_fee_cents >= 0
    AND express_surcharge_cents >= 0
    AND minimum_order_cents >= 0
  )
);

-- Seed initial operating options. Adjust addresses/prices before going live.
INSERT INTO pickup_locations (slug, name, address, city, pickup_instructions, sort_order)
VALUES
  ('valencia-central', 'Valencia central pickup', 'Confirm exact pickup point by WhatsApp', 'valencia', 'We will confirm the closest pickup point after checking inventory.', 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_zones (
  slug,
  name,
  city,
  description,
  delivery_fee_cents,
  collection_fee_cents,
  roundtrip_fee_cents,
  express_surcharge_cents,
  sort_order
)
VALUES
  ('valencia-central', 'Valencia central', 'valencia', 'Central Valencia neighborhoods and nearby accommodation.', 1000, 1000, 1500, 500, 10),
  ('valencia-beach', 'Valencia beach area', 'valencia', 'Malvarrosa, Cabanyal, Patacona, and nearby beach stays.', 1500, 1500, 2500, 500, 20),
  ('valencia-region-custom', 'Valencia region custom quote', 'valencia', 'Addresses outside core zones that require manual confirmation.', 0, 0, 0, 0, 90)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BOOKING DRAFTS
-- ============================================
CREATE TABLE IF NOT EXISTS booking_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  rental_start_at TIMESTAMPTZ NOT NULL,
  rental_end_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  rental_days INT NOT NULL,

  fulfillment_mode fulfillment_mode NOT NULL,
  pickup_location_id UUID REFERENCES pickup_locations(id) ON DELETE SET NULL,
  delivery_zone_id UUID REFERENCES service_zones(id) ON DELETE SET NULL,
  collection_zone_id UUID REFERENCES service_zones(id) ON DELETE SET NULL,
  delivery_address TEXT,
  collection_address TEXT,
  delivery_notes TEXT,
  collection_notes TEXT,

  currency TEXT NOT NULL DEFAULT 'eur',
  per_day_cents INT NOT NULL,
  rental_subtotal_cents INT NOT NULL,
  delivery_fee_cents INT NOT NULL DEFAULT 0,
  collection_fee_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  deposit_cents INT NOT NULL DEFAULT 0,
  pricing_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,

  status booking_draft_status NOT NULL DEFAULT 'draft',
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_draft_period CHECK (rental_end_at > rental_start_at),
  CONSTRAINT valid_draft_days CHECK (rental_days > 0),
  CONSTRAINT valid_draft_totals CHECK (
    per_day_cents >= 0
    AND rental_subtotal_cents >= 0
    AND delivery_fee_cents >= 0
    AND collection_fee_cents >= 0
    AND total_cents >= 0
    AND deposit_cents >= 0
  ),
  CONSTRAINT valid_draft_fulfillment CHECK (
    (fulfillment_mode = 'customer_pickup' AND pickup_location_id IS NOT NULL)
    OR (fulfillment_mode = 'delivery_only' AND delivery_address IS NOT NULL)
    OR (fulfillment_mode = 'delivery_and_collection' AND delivery_address IS NOT NULL AND collection_address IS NOT NULL)
  )
);

-- ============================================
-- BOOKING TABLE ADDITIONS
-- ============================================
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_draft_id UUID REFERENCES booking_drafts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rental_start_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rental_end_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  ADD COLUMN IF NOT EXISTS fulfillment_mode fulfillment_mode,
  ADD COLUMN IF NOT EXISTS pickup_location_id UUID REFERENCES pickup_locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS delivery_zone_id UUID REFERENCES service_zones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS collection_zone_id UUID REFERENCES service_zones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS collection_address TEXT,
  ADD COLUMN IF NOT EXISTS collection_notes TEXT,
  ADD COLUMN IF NOT EXISTS collection_fee_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pricing_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT UNIQUE;

-- Backfill datetime fields for legacy rows.
UPDATE bookings
SET
  rental_start_at = COALESCE(rental_start_at, (start_date::text || ' 09:00 Europe/Madrid')::timestamptz),
  rental_end_at = COALESCE(rental_end_at, (end_date::text || ' 09:00 Europe/Madrid')::timestamptz),
  fulfillment_mode = COALESCE(fulfillment_mode, 'delivery_and_collection'::fulfillment_mode),
  collection_address = COALESCE(collection_address, delivery_address)
WHERE rental_start_at IS NULL
  OR rental_end_at IS NULL
  OR fulfillment_mode IS NULL
  OR collection_address IS NULL;

-- ============================================
-- DATETIME INVENTORY BLOCKS
-- ============================================
CREATE TABLE IF NOT EXISTS booking_inventory_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  booking_draft_id UUID REFERENCES booking_drafts(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reason TEXT NOT NULL DEFAULT 'booking',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_inventory_block_period CHECK (ends_at > starts_at),
  CONSTRAINT valid_inventory_block_quantity CHECK (quantity > 0),
  CONSTRAINT inventory_block_owner CHECK (booking_id IS NOT NULL OR booking_draft_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_booking_drafts_product_period
  ON booking_drafts (product_id, rental_start_at, rental_end_at);

CREATE INDEX IF NOT EXISTS idx_booking_drafts_status_expires
  ON booking_drafts (status, expires_at);

CREATE INDEX IF NOT EXISTS idx_bookings_product_rental_period
  ON bookings (product_id, rental_start_at, rental_end_at);

CREATE INDEX IF NOT EXISTS idx_inventory_blocks_product_period
  ON booking_inventory_blocks (product_id, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS idx_inventory_blocks_booking
  ON booking_inventory_blocks (booking_id);

CREATE INDEX IF NOT EXISTS idx_inventory_blocks_draft
  ON booking_inventory_blocks (booking_draft_id);

-- ============================================
-- ATOMIC INVENTORY RESERVATION
-- ============================================
CREATE OR REPLACE FUNCTION reserve_booking_inventory(
  p_product_id UUID,
  p_booking_draft_id UUID,
  p_starts_at TIMESTAMPTZ,
  p_ends_at TIMESTAMPTZ,
  p_quantity INT DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  product_stock_total INT;
  product_stock_available INT;
  overlapping_quantity INT;
BEGIN
  IF p_ends_at <= p_starts_at THEN
    RAISE EXCEPTION 'Rental end must be after rental start';
  END IF;

  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;

  SELECT stock_total, stock_available
  INTO product_stock_total, product_stock_available
  FROM products
  WHERE id = p_product_id
    AND is_active = true
  FOR UPDATE;

  IF product_stock_total IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  IF product_stock_available < p_quantity THEN
    RETURN false;
  END IF;

  SELECT COALESCE(SUM(bib.quantity), 0)
  INTO overlapping_quantity
  FROM booking_inventory_blocks bib
  LEFT JOIN booking_drafts bd ON bd.id = bib.booking_draft_id
  WHERE bib.product_id = p_product_id
    AND bib.starts_at < p_ends_at
    AND bib.ends_at > p_starts_at
    AND (
      bib.booking_id IS NOT NULL
      OR (
        bib.booking_draft_id IS NOT NULL
        AND bd.status IN ('draft', 'checkout_created')
        AND bd.expires_at > now()
      )
    );

  IF overlapping_quantity + p_quantity > product_stock_total THEN
    RETURN false;
  END IF;

  INSERT INTO booking_inventory_blocks (
    product_id,
    booking_draft_id,
    starts_at,
    ends_at,
    quantity,
    reason
  )
  VALUES (
    p_product_id,
    p_booking_draft_id,
    p_starts_at,
    p_ends_at,
    p_quantity,
    'checkout_hold'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_inventory_blocks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pickup_locations' AND policyname = 'Public read active pickup locations'
  ) THEN
    CREATE POLICY "Public read active pickup locations"
      ON pickup_locations FOR SELECT
      USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_zones' AND policyname = 'Public read active service zones'
  ) THEN
    CREATE POLICY "Public read active service zones"
      ON service_zones FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS pickup_locations_updated_at ON pickup_locations;
CREATE TRIGGER pickup_locations_updated_at
  BEFORE UPDATE ON pickup_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS service_zones_updated_at ON service_zones;
CREATE TRIGGER service_zones_updated_at
  BEFORE UPDATE ON service_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS booking_drafts_updated_at ON booking_drafts;
CREATE TRIGGER booking_drafts_updated_at
  BEFORE UPDATE ON booking_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
