-- Product content readiness foundation. Additive: existing products remain unchanged.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS content_status TEXT NOT NULL DEFAULT 'draft'
  CHECK (content_status IN ('draft', 'facts_verified', 'content_ready'));

CREATE TABLE IF NOT EXISTS product_localizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  short_description TEXT,
  detail_description TEXT,
  includes_text TEXT,
  constraints_text TEXT,
  delivery_setup_note TEXT,
  care_note TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, locale)
);

CREATE TABLE IF NOT EXISTS product_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  source_url TEXT,
  rights_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (rights_status IN ('unknown', 'owned', 'licensed', 'manufacturer_approved')),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_localizations_product_locale_idx
  ON product_localizations(product_id, locale);
CREATE INDEX IF NOT EXISTS product_faqs_product_locale_idx
  ON product_faqs(product_id, locale, sort_order);
CREATE INDEX IF NOT EXISTS product_images_product_idx
  ON product_images(product_id, sort_order);

ALTER TABLE product_localizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read product localizations" ON product_localizations;
CREATE POLICY "Public can read product localizations"
  ON product_localizations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products WHERE products.id = product_localizations.product_id AND products.is_active = true
  ));

DROP POLICY IF EXISTS "Public can read product FAQs" ON product_faqs;
CREATE POLICY "Public can read product FAQs"
  ON product_faqs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products WHERE products.id = product_faqs.product_id AND products.is_active = true
  ));

DROP POLICY IF EXISTS "Public can read product images" ON product_images;
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true
  ));
