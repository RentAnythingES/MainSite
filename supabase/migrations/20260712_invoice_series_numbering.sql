-- RentAnything.es — configurable invoice series numbering

ALTER TABLE booking_document_counters
  ADD COLUMN IF NOT EXISTS series_prefix TEXT NOT NULL DEFAULT 'RA-LEGACY';

ALTER TABLE booking_document_counters
  DROP CONSTRAINT IF EXISTS booking_document_counters_pkey;

ALTER TABLE booking_document_counters
  ADD PRIMARY KEY (document_type, document_year, series_prefix);

CREATE OR REPLACE FUNCTION public.set_booking_document_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  selected_prefix TEXT;
  next_number INT;
BEGIN
  IF NEW.document_number IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT CASE COALESCE(NEW.invoice_format, CASE WHEN NEW.document_type = 'refund_receipt' THEN 'rectifying' ELSE 'full' END)
    WHEN 'simplified' THEN simplified_invoice_series_prefix
    WHEN 'rectifying' THEN rectifying_invoice_series_prefix
    ELSE full_invoice_series_prefix
  END
  INTO selected_prefix
  FROM public.invoice_settings
  WHERE id = TRUE;

  IF selected_prefix IS NULL THEN
    RAISE EXCEPTION 'Invoice settings are required before issuing documents';
  END IF;

  NEW.document_year := COALESCE(NEW.document_year, EXTRACT(YEAR FROM now())::INT);

  INSERT INTO public.booking_document_counters (document_type, document_year, series_prefix, last_number)
  VALUES (NEW.document_type, NEW.document_year, selected_prefix, 1)
  ON CONFLICT (document_type, document_year, series_prefix)
  DO UPDATE SET last_number = public.booking_document_counters.last_number + 1, updated_at = now()
  RETURNING last_number INTO next_number;

  NEW.document_number := selected_prefix || '-' || NEW.document_year::TEXT || '-' || LPAD(next_number::TEXT, 6, '0');
  RETURN NEW;
END;
$$;
