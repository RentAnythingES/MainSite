-- Disable central Valencia customer pickup until an operational pickup point is ready.

UPDATE pickup_locations
SET
  is_active = false,
  updated_at = now()
WHERE slug = 'valencia-central';
