-- ============================================
-- RentAnything.es — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📦',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📦',
  image_url TEXT,

  -- Category relationship
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory TEXT NOT NULL,
  subcategory_slug TEXT NOT NULL,

  -- Inventory
  city TEXT NOT NULL DEFAULT 'valencia',
  stock_total INT NOT NULL DEFAULT 1,
  stock_available INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Specs stored as JSONB for flexibility
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_category_memberships (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

-- ============================================
-- PRICING TIERS
-- ============================================
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_days INT NOT NULL,
  per_day_cents INT NOT NULL, -- Store in cents for precision
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(product_id, min_days)
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TYPE booking_status AS ENUM (
  'pending',       -- Customer submitted, awaiting confirmation
  'confirmed',     -- We confirmed availability
  'paid',          -- Payment received
  'delivering',    -- Out for delivery
  'active',        -- Customer has the equipment
  'returning',     -- Pickup scheduled
  'completed',     -- Returned and inspected
  'cancelled',     -- Cancelled by customer or us
  'refunded'       -- Refund processed
);

CREATE TYPE delivery_type AS ENUM ('standard', 'express');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL, -- Human-readable: RA-20260617-XXXX

  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_whatsapp TEXT,

  -- Product
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rental_days INT NOT NULL,

  -- Pricing (snapshot at time of booking, in cents)
  per_day_cents INT NOT NULL,
  subtotal_cents INT NOT NULL,
  delivery_fee_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  deposit_cents INT NOT NULL DEFAULT 0,

  -- Delivery
  delivery_type delivery_type NOT NULL DEFAULT 'standard',
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL DEFAULT 'valencia',
  delivery_notes TEXT,

  -- Status
  status booking_status NOT NULL DEFAULT 'pending',

  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_deposit_intent_id TEXT,
  paid_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_days CHECK (rental_days > 0),
  CONSTRAINT valid_totals CHECK (total_cents >= 0)
);

-- ============================================
-- BLOCKED DATES (for inventory management)
-- ============================================
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason TEXT, -- 'booking', 'maintenance', 'manual'
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(product_id, blocked_date)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);
CREATE UNIQUE INDEX product_category_memberships_one_primary
  ON product_category_memberships(product_id) WHERE is_primary;
CREATE INDEX product_category_memberships_category
  ON product_category_memberships(category_id, product_id);

CREATE INDEX idx_pricing_product ON pricing_tiers(product_id);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_product ON bookings(product_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX idx_bookings_email ON bookings(customer_email);

CREATE INDEX idx_blocked_dates_product ON blocked_dates(product_id, blocked_date);

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read categories, products, and pricing
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product category memberships" ON product_category_memberships FOR SELECT USING (true);
CREATE POLICY "Public read pricing" ON pricing_tiers FOR SELECT USING (true);

-- Bookings: only via API (service role key)
-- No public read/write — all booking mutations go through server-side API routes

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION sync_product_primary_category_membership()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM product_category_memberships
   WHERE product_id = NEW.id AND category_id = NEW.category_id AND NOT is_primary;
  UPDATE product_category_memberships
     SET category_id = NEW.category_id, updated_at = now()
   WHERE product_id = NEW.id AND is_primary;
  IF NOT FOUND THEN
    INSERT INTO product_category_memberships (product_id, category_id, is_primary)
    VALUES (NEW.id, NEW.category_id, true);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_sync_primary_category_membership
  AFTER INSERT OR UPDATE OF category_id ON products
  FOR EACH ROW EXECUTE FUNCTION sync_product_primary_category_membership();

CREATE OR REPLACE FUNCTION replace_product_secondary_categories(
  p_product_id UUID,
  p_category_ids UUID[] DEFAULT '{}'::UUID[]
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  primary_category_id UUID;
  normalized_category_ids UUID[] := COALESCE(p_category_ids, '{}'::UUID[]);
BEGIN
  SELECT category_id INTO primary_category_id FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Product % does not exist', p_product_id; END IF;
  IF primary_category_id = ANY(normalized_category_ids) THEN
    RAISE EXCEPTION 'Primary category cannot also be a secondary category';
  END IF;
  IF cardinality(normalized_category_ids) <>
     (SELECT count(DISTINCT requested.category_id) FROM unnest(normalized_category_ids) AS requested(category_id)) THEN
    RAISE EXCEPTION 'Secondary category IDs must be unique';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(normalized_category_ids) AS requested(category_id)
    LEFT JOIN categories category ON category.id = requested.category_id
    WHERE category.id IS NULL
  ) THEN
    RAISE EXCEPTION 'One or more secondary categories do not exist';
  END IF;
  DELETE FROM product_category_memberships WHERE product_id = p_product_id AND NOT is_primary;
  INSERT INTO product_category_memberships (product_id, category_id, is_primary)
  SELECT p_product_id, requested.category_id, false
  FROM unnest(normalized_category_ids) AS requested(category_id);
END;
$$;

REVOKE ALL ON FUNCTION replace_product_secondary_categories(UUID, UUID[]) FROM PUBLIC;

CREATE OR REPLACE FUNCTION assert_product_primary_category_membership()
RETURNS TRIGGER AS $$
DECLARE
  affected_product_id UUID := COALESCE(NEW.product_id, OLD.product_id);
  expected_category_id UUID;
  matching_primary_count INTEGER;
BEGIN
  SELECT category_id INTO expected_category_id FROM products WHERE id = affected_product_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*) INTO matching_primary_count FROM product_category_memberships
   WHERE product_id = affected_product_id AND is_primary AND category_id = expected_category_id;
  IF matching_primary_count <> 1 THEN
    RAISE EXCEPTION 'Product % must have exactly one primary membership matching products.category_id', affected_product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER product_category_memberships_primary_guard
  AFTER INSERT OR UPDATE OR DELETE ON product_category_memberships
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION assert_product_primary_category_membership();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- BOOKING REF GENERATOR
-- ============================================
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TRIGGER AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  random_part := upper(substring(md5(random()::text) from 1 for 4));
  NEW.booking_ref := 'RA-' || date_part || '-' || random_part;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_generate_ref
  BEFORE INSERT ON bookings FOR EACH ROW
  WHEN (NEW.booking_ref IS NULL)
  EXECUTE FUNCTION generate_booking_ref();
