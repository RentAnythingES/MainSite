-- Add free customer pickup options outside central Valencia.

INSERT INTO pickup_locations (
  slug,
  name,
  address,
  city,
  pickup_instructions,
  sort_order
)
VALUES
  (
    'burjassot-pickup',
    'Burjassot pickup',
    'Exact pickup point confirmed after availability check',
    'burjassot',
    'Free pickup option. We will confirm the exact Burjassot pickup point by WhatsApp after checking inventory.',
    20
  ),
  (
    'paterna-pickup',
    'Paterna pickup',
    'Exact pickup point confirmed after availability check',
    'paterna',
    'Free pickup option. We will confirm the exact Paterna pickup point by WhatsApp after checking inventory.',
    30
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  pickup_instructions = EXCLUDED.pickup_instructions,
  sort_order = EXCLUDED.sort_order,
  is_active = true;
