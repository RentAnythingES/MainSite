-- Add a fail-closed, calendar-aware policy for automatic same-day delivery.

ALTER TABLE public.service_zones
  ADD COLUMN IF NOT EXISTS automatic_express_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS express_min_lead_hours INTEGER NOT NULL DEFAULT 6,
  ADD COLUMN IF NOT EXISTS delivery_operating_hours JSONB NOT NULL DEFAULT
    '{"monday":{"open":"09:00","close":"20:00"},"tuesday":{"open":"09:00","close":"20:00"},"wednesday":{"open":"09:00","close":"20:00"},"thursday":{"open":"09:00","close":"20:00"},"friday":{"open":"09:00","close":"20:00"},"saturday":{"open":"09:00","close":"20:00"},"sunday":{"open":"09:00","close":"20:00"}}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'service_zones_express_min_lead_hours_check'
  ) THEN
    ALTER TABLE public.service_zones
      ADD CONSTRAINT service_zones_express_min_lead_hours_check
      CHECK (express_min_lead_hours >= 0 AND express_min_lead_hours <= 72);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'service_zones_delivery_operating_hours_object_check'
  ) THEN
    ALTER TABLE public.service_zones
      ADD CONSTRAINT service_zones_delivery_operating_hours_object_check
      CHECK (jsonb_typeof(delivery_operating_hours) = 'object');
  END IF;
END $$;

COMMENT ON COLUMN public.service_zones.lead_time_hours IS
  'Minimum rolling lead time for a later Europe/Madrid calendar-date delivery.';
COMMENT ON COLUMN public.service_zones.automatic_express_enabled IS
  'Per-zone kill switch for automatically paid same-day express delivery.';
COMMENT ON COLUMN public.service_zones.express_min_lead_hours IS
  'Minimum rolling lead time for same-day express in Europe/Madrid.';
COMMENT ON COLUMN public.service_zones.delivery_operating_hours IS
  'Weekly delivery-start windows interpreted in Europe/Madrid; null day means closed.';
COMMENT ON COLUMN public.service_zones.same_day_cutoff IS
  'Legacy compatibility field; automatic delivery decisions use lead-time bands and delivery_operating_hours.';

-- Set the approved Valencia policy but leave automatic Express disabled until
-- the new application code is deployed and its public boundary checks pass.
UPDATE public.service_zones AS zone
SET
  lead_time_hours = 12,
  express_min_lead_hours = 6,
  automatic_express_enabled = false,
  delivery_operating_hours =
    '{"monday":{"open":"09:00","close":"20:00"},"tuesday":{"open":"09:00","close":"20:00"},"wednesday":{"open":"09:00","close":"20:00"},"thursday":{"open":"09:00","close":"20:00"},"friday":{"open":"09:00","close":"20:00"},"saturday":{"open":"09:00","close":"20:00"},"sunday":{"open":"09:00","close":"20:00"}}'::jsonb
WHERE zone.slug IN ('valencia-central', 'valencia-beach')
  AND zone.market_id IN (
    SELECT market.id
    FROM public.markets AS market
    WHERE market.slug = 'valencia'
  );
