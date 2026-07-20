-- Add explicit unit quantities to the booking lifecycle.
-- Existing bookings and drafts remain single-unit bookings.

ALTER TABLE public.booking_drafts
  ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 1;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS public.product_quantity_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity INT NOT NULL,
  discount_bps INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_quantity_discount_minimum CHECK (min_quantity >= 2),
  CONSTRAINT valid_quantity_discount_rate CHECK (discount_bps > 0 AND discount_bps < 10000),
  CONSTRAINT unique_product_quantity_discount UNIQUE (product_id, min_quantity)
);

ALTER TABLE public.product_quantity_discounts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_product_quantity_discounts_product
  ON public.product_quantity_discounts (product_id, min_quantity DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_booking_draft_quantity'
      AND conrelid = 'public.booking_drafts'::regclass
  ) THEN
    ALTER TABLE public.booking_drafts
      ADD CONSTRAINT valid_booking_draft_quantity CHECK (quantity > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_booking_quantity'
      AND conrelid = 'public.bookings'::regclass
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT valid_booking_quantity CHECK (quantity > 0);
  END IF;
END
$$;
