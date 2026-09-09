-- Standardize automatic fulfillment fees across all active service zones.
update public.service_zones
set
  delivery_fee_cents = 1000,
  collection_fee_cents = 1000,
  roundtrip_fee_cents = 2000
where is_active = true;
