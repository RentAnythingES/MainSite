-- RentAnything.es — Supabase Security Advisor hardening
--
-- This migration keeps product image URLs public, but prevents anonymous
-- storage listing and limits the privileged inventory reservation RPC to the
-- server-side service role.

-- Set an immutable search path for trigger functions.
ALTER FUNCTION public.update_updated_at() SET search_path = '';
ALTER FUNCTION public.generate_booking_ref() SET search_path = '';

-- Recreate the document number helper with qualified database objects so it
-- remains valid with an empty search path.
CREATE OR REPLACE FUNCTION public.next_booking_document_number(
  p_document_type public.booking_document_type,
  p_document_year INT DEFAULT EXTRACT(YEAR FROM now())::INT
)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  next_number INT;
  prefix TEXT;
BEGIN
  INSERT INTO public.booking_document_counters (document_type, document_year, last_number)
  VALUES (p_document_type, p_document_year, 1)
  ON CONFLICT (document_type, document_year)
  DO UPDATE SET
    last_number = public.booking_document_counters.last_number + 1,
    updated_at = now()
  RETURNING last_number INTO next_number;

  prefix := CASE p_document_type
    WHEN 'invoice' THEN 'RA-INV'
    WHEN 'refund_receipt' THEN 'RA-REF'
    WHEN 'rental_agreement' THEN 'RA-AGR'
  END;

  RETURN prefix || '-' || p_document_year::TEXT || '-' || LPAD(next_number::TEXT, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_booking_document_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.document_number IS NULL THEN
    NEW.document_year := COALESCE(NEW.document_year, EXTRACT(YEAR FROM now())::INT);
    NEW.document_number := public.next_booking_document_number(NEW.document_type, NEW.document_year);
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate the inventory lock with qualified database objects and an immutable
-- search path. SECURITY DEFINER is required for the atomic row lock and insert.
CREATE OR REPLACE FUNCTION public.reserve_booking_inventory(
  p_product_id UUID,
  p_booking_draft_id UUID,
  p_starts_at TIMESTAMPTZ,
  p_ends_at TIMESTAMPTZ,
  p_quantity INT DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
  FROM public.products
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
  FROM public.booking_inventory_blocks AS bib
  LEFT JOIN public.booking_drafts AS bd ON bd.id = bib.booking_draft_id
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

  INSERT INTO public.booking_inventory_blocks (
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
$$;

-- The booking draft API calls this RPC with SUPABASE_SERVICE_ROLE_KEY. It must
-- not be executable through the public Data API because it bypasses RLS.
REVOKE EXECUTE ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_booking_inventory(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ, INT) TO service_role;

-- Public buckets already serve known public URLs. This RLS policy was only
-- needed for broad object metadata reads, which allowed anonymous listing.
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
