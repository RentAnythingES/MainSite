-- Customer-facing category names and conservative Baby/Kids split.
-- Existing URLs remain unchanged. Only clearly identified toy/bike records move.

UPDATE categories SET name = 'Baby & Toddler', description = 'Sleep, feeding, strollers, car seats and baby setup' WHERE slug = 'baby-gear';
UPDATE categories SET name = 'Mobility & Accessibility', description = 'Wheelchairs, scooters, walkers and daily living support' WHERE slug = 'mobility';
UPDATE categories SET name = 'Remote Work', description = 'Monitors, desks, ergonomic chairs and accessories' WHERE slug = 'remote-work';
UPDATE categories SET name = 'Apartment Comfort', description = 'Cooling, air quality, furniture and temporary-home essentials' WHERE slug = 'home-living';
UPDATE categories SET name = 'Beach & Outdoor', description = 'Beach equipment, outdoor recreation and travel accessories' WHERE slug = 'travel-outdoors';

INSERT INTO categories (slug, name, emoji, description, sort_order)
VALUES ('kids-family', 'Kids & Family', 'K', 'Bikes, toys, activity gear and family outdoor equipment', 2)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

INSERT INTO categories (slug, name, emoji, description, sort_order)
VALUES ('pregnancy', 'Pregnancy & Postpartum', 'P', 'Comfort and support equipment for pregnancy and early recovery', 3)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'kids-family')
WHERE subcategory_slug IN ('toys', 'bike')
  AND category_id = (SELECT id FROM categories WHERE slug = 'baby-gear');

UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'pregnancy')
WHERE subcategory_slug = 'pregnancy'
  AND category_id = (SELECT id FROM categories WHERE slug = 'baby-gear');
