-- Make automatic-checkout eligibility and delivery speed explicit.

ALTER TABLE public.service_zones
  ADD COLUMN IF NOT EXISTS automatic_checkout_enabled BOOLEAN NOT NULL DEFAULT true;

UPDATE public.service_zones
SET automatic_checkout_enabled = false
WHERE slug = 'valencia-region-custom';

ALTER TABLE public.booking_drafts
  ADD COLUMN IF NOT EXISTS delivery_type public.delivery_type NOT NULL DEFAULT 'standard';
