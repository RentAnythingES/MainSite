-- ============================================
-- RentAnything.es — Seed Data
-- Run AFTER schema.sql
-- ============================================

-- Categories
INSERT INTO categories (slug, name, emoji, description, sort_order) VALUES
  ('baby-gear', 'Baby & Children', '👶', 'Strollers, cribs, car seats, high chairs', 1),
  ('mobility', 'Mobility & Daily Aid', '♿', 'Wheelchairs, scooters, walkers', 2),
  ('remote-work', 'Work & Tech', '💻', 'Monitors, desks, ergonomic chairs', 3),
  ('home-living', 'Home & Living', '🏠', 'Air purifiers, AC units, kitchen', 4),
  ('travel-outdoors', 'Travel & Outdoors', '🏖️', 'Beach gear, camping, recreation', 5);

-- Products: Baby & Children
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs) VALUES
  ('compact-stroller', 'Compact Folding Stroller', 'Kinderkraft',
   'Lightweight, one-hand fold stroller perfect for navigating Valencia''s old town streets and beach promenades. Includes rain cover and cup holder.',
   '🍼', '/products/compact-stroller.png',
   (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Strollers & Accessories', 'strollers',
   '["One-hand fold","Reclining seat","UV canopy","Rain cover included","5-point harness","Shopping basket"]',
   '{"Age":"6m – 3 years","Weight limit":"22 kg","Stroller weight":"7.5 kg","Folded size":"54 × 44 × 28 cm"}'),

  ('double-stroller', 'Double Stroller', 'Baby Jogger',
   'Side-by-side double stroller for twins or siblings. Fits through standard doorways and folds flat for storage.',
   '👶', '/products/double-stroller.png',
   (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Strollers & Accessories', 'strollers',
   '["Side-by-side seating","Independent recline","All-terrain wheels","One-hand fold","UV 50+ canopy"]',
   '{"Age":"6m – 4 years","Weight limit":"2 × 22 kg","Stroller weight":"13 kg","Width":"76 cm"}'),

  ('travel-crib', 'Travel Crib', 'BabyBjörn',
   'Ultra-light travel crib that sets up in seconds. Breathable mesh sides and firm mattress for safe sleep anywhere in Valencia.',
   '😴', '/products/travel-crib.png',
   (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Sleep & Nursery', 'sleep-nursery',
   '["Sets up in one step","Breathable mesh","Firm mattress included","Fitted sheet included","Carry bag"]',
   '{"Age":"0 – 3 years","Weight limit":"12 kg","Crib weight":"6 kg","Open size":"112 × 64 × 82 cm"}'),

  ('car-seat-infant', 'Infant Car Seat (i-Size)', 'Cybex',
   'Rear-facing infant car seat, i-Size certified. Perfect for airport transfers and day trips from Valencia.',
   '🚗', '/products/car-seat-infant.png',
   (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Car Seats', 'car-seats',
   '["i-Size certified","Rear-facing","Side impact protection","Removable newborn insert","ISOFIX compatible"]',
   '{"Age":"0 – 15 months","Weight limit":"13 kg","Height":"45 – 87 cm","Seat weight":"4.2 kg"}'),

  ('high-chair', 'Folding High Chair', 'Stokke',
   'Ergonomic high chair that grows with your child. Easy to clean, folds flat for apartments.',
   '🪑', '/products/high-chair.png',
   (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Feeding', 'feeding',
   '["Adjustable height","5-point harness","Removable tray","Easy clean","Folds flat"]',
   '{"Age":"6m – 3 years","Weight limit":"20 kg","Chair weight":"7 kg"}');

-- Products: Mobility
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs) VALUES
  ('standard-wheelchair', 'Standard Wheelchair', 'Invacare',
   'Lightweight folding wheelchair ideal for exploring Valencia. Fits in most car boots and taxi trunks.',
   '♿', '/products/standard-wheelchair.png',
   (SELECT id FROM categories WHERE slug = 'mobility'), 'Wheelchairs', 'wheelchairs',
   '["Foldable frame","Removable footrests","Padded armrests","Rear wheel brakes","Puncture-proof tyres"]',
   '{"Seat width":"46 cm","Weight capacity":"115 kg","Chair weight":"14 kg","Folded width":"28 cm"}'),

  ('transport-wheelchair', 'Transport Wheelchair (Lightweight)', 'Drive Medical',
   'Ultra-light transport chair at only 9 kg. Perfect for airports, museums, and sightseeing in Valencia.',
   '🦽', '/products/transport-wheelchair.png',
   (SELECT id FROM categories WHERE slug = 'mobility'), 'Wheelchairs', 'wheelchairs',
   '["Ultra-light 9 kg","Companion-push","Swing-away footrests","Seatbelt","Folds compact"]',
   '{"Seat width":"43 cm","Weight capacity":"100 kg","Chair weight":"9 kg"}'),

  ('mobility-scooter-lightweight', 'Lightweight Mobility Scooter', 'Pride',
   'Compact 4-wheel scooter perfect for Valencia''s flat terrain. Disassembles into 5 pieces for transport.',
   '🛵', '/products/mobility-scooter-lightweight.png',
   (SELECT id FROM categories WHERE slug = 'mobility'), 'Mobility Scooters', 'scooters',
   '["4-wheel stability","Disassembles easily","20 km range","Adjustable seat","Front basket"]',
   '{"Max speed":"6 km/h","Range":"20 km","Weight capacity":"115 kg","Scooter weight":"34 kg"}'),

  ('heavy-duty-mobility-scooter', 'Heavy-Duty Mobility Scooter', 'Invacare',
   'Full-size scooter with extended range for all-day exploration. Ideal for the Turia Gardens and City of Arts.',
   '🏍️', '/products/heavy-duty-mobility-scooter.png',
   (SELECT id FROM categories WHERE slug = 'mobility'), 'Mobility Scooters', 'scooters',
   '["Full suspension","40 km range","LED lights","Mirrors","Large tyres"]',
   '{"Max speed":"12 km/h","Range":"40 km","Weight capacity":"160 kg","Scooter weight":"68 kg"}'),

  ('rollator-walker', 'Rollator Walker', 'Drive Medical',
   'An excellent 4-wheel rollator with seat and storage bag. Great for navigating Valencia at your own pace.',
   '🚶', '/products/rollator-walker.png',
   (SELECT id FROM categories WHERE slug = 'mobility'), 'Walkers', 'walkers',
   '["4-wheel design","Built-in seat","Storage bag","Loop brakes","Height adjustable","Foldable"]',
   '{"Weight capacity":"135 kg","Seat height":"56 cm","Walker weight":"6.5 kg"}');

-- Products: Remote Work
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs) VALUES
  ('monitor-27', '27" USB-C Monitor', 'Dell',
   '4K USB-C monitor — plug in your laptop and get a full workspace. Perfect for digital nomads in Valencia.',
   '🖥️', '/products/monitor-27.png',
   (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'monitors',
   '["4K resolution","USB-C (65W charging)","Adjustable stand","Built-in speakers","HDMI + DisplayPort"]',
   '{"Screen":"27 inch IPS","Resolution":"3840 × 2160","Ports":"USB-C, HDMI, DP","Weight":"6.2 kg"}'),

  ('standing-desk', 'Electric Standing Desk', 'FlexiSpot',
   'Height-adjustable electric standing desk. Transform any Valencia apartment into a proper home office.',
   '🪜', '/products/standing-desk.png',
   (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'desks',
   '["Electric height adjust","Memory presets","Cable management","Anti-collision","120 × 60 cm top"]',
   '{"Height range":"72 – 120 cm","Desk weight":"25 kg","Load capacity":"70 kg"}'),

  ('ergonomic-chair', 'Ergonomic Office Chair', 'Herman Miller',
   'Premium mesh office chair with full lumbar support. Say goodbye to kitchen-chair back pain.',
   '💺', '/products/ergonomic-chair.png',
   (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'chairs',
   '["Mesh back","Lumbar support","Adjustable arms","Tilt mechanism","Height adjustable"]',
   '{"Weight capacity":"130 kg","Seat height":"40 – 52 cm","Chair weight":"12 kg"}');

-- Products: Home & Living
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs) VALUES
  ('air-purifier', 'HEPA Air Purifier', 'Dyson',
   'Hospital-grade HEPA filtration for allergy sufferers. Covers rooms up to 40m². Quiet night mode.',
   '🌬️', '/products/air-purifier.png',
   (SELECT id FROM categories WHERE slug = 'home-living'), 'Home Air Quality', 'air-quality',
   '["HEPA H13 filter","Covers 40m²","Night mode","Air quality sensor","App control","Timer"]',
   '{"CADR":"320 m³/h","Noise level":"24 – 48 dB","Weight":"4.7 kg"}'),

  ('portable-ac', 'Portable Air Conditioner', 'De''Longhi',
   'Beat the Valencia summer heat. Cools rooms up to 30m². Essential for older apartments without AC.',
   '❄️', '/products/portable-ac.png',
   (SELECT id FROM categories WHERE slug = 'home-living'), 'Home Air Quality', 'air-quality',
   '["9,000 BTU","3-in-1 (cool, fan, dehumidify)","Remote control","Timer","Quiet mode"]',
   '{"Cooling capacity":"9,000 BTU","Room size":"Up to 30m²","Noise":"52 dB","Weight":"26 kg"}');

-- Products: Travel & Outdoors
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs) VALUES
  ('beach-umbrella-set', 'Beach Umbrella & Chair Set', 'RentAnything',
   'Complete beach setup: XL umbrella, 2 folding chairs, and a cooler bag. Ready for Malvarrosa or Patacona.',
   '🏖️', '/products/beach-umbrella-set.png',
   (SELECT id FROM categories WHERE slug = 'travel-outdoors'), 'Beach Gear', 'beach',
   '["2m umbrella with UV protection","2 × folding chairs","Insulated cooler bag","Sand anchor","Carry bag"]',
   '{"Umbrella diameter":"2m","UV protection":"UPF 50+","Total weight":"6 kg"}');

-- Pricing Tiers (in cents)
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES
  -- Baby
  ((SELECT id FROM products WHERE slug = 'compact-stroller'), 1, 1400),
  ((SELECT id FROM products WHERE slug = 'compact-stroller'), 3, 1000),
  ((SELECT id FROM products WHERE slug = 'compact-stroller'), 7, 700),
  ((SELECT id FROM products WHERE slug = 'compact-stroller'), 14, 500),
  ((SELECT id FROM products WHERE slug = 'double-stroller'), 1, 2000),
  ((SELECT id FROM products WHERE slug = 'double-stroller'), 3, 1500),
  ((SELECT id FROM products WHERE slug = 'double-stroller'), 7, 1100),
  ((SELECT id FROM products WHERE slug = 'double-stroller'), 14, 800),
  ((SELECT id FROM products WHERE slug = 'travel-crib'), 1, 1200),
  ((SELECT id FROM products WHERE slug = 'travel-crib'), 3, 900),
  ((SELECT id FROM products WHERE slug = 'travel-crib'), 7, 600),
  ((SELECT id FROM products WHERE slug = 'travel-crib'), 14, 400),
  ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 1, 1000),
  ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 3, 800),
  ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 7, 500),
  ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 14, 400),
  ((SELECT id FROM products WHERE slug = 'high-chair'), 1, 800),
  ((SELECT id FROM products WHERE slug = 'high-chair'), 3, 600),
  ((SELECT id FROM products WHERE slug = 'high-chair'), 7, 400),
  ((SELECT id FROM products WHERE slug = 'high-chair'), 14, 300),
  -- Mobility
  ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 1, 1500),
  ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 3, 1200),
  ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 7, 800),
  ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 14, 600),
  ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 1, 1200),
  ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 3, 900),
  ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 7, 600),
  ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 14, 500),
  ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 1, 3500),
  ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 3, 2800),
  ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 7, 2000),
  ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 14, 1500),
  ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 1, 7000),
  ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 3, 5500),
  ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 7, 4000),
  ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 14, 3000),
  ((SELECT id FROM products WHERE slug = 'rollator-walker'), 1, 1000),
  ((SELECT id FROM products WHERE slug = 'rollator-walker'), 3, 800),
  ((SELECT id FROM products WHERE slug = 'rollator-walker'), 7, 500),
  ((SELECT id FROM products WHERE slug = 'rollator-walker'), 14, 400),
  -- Remote Work
  ((SELECT id FROM products WHERE slug = 'monitor-27'), 1, 2100),
  ((SELECT id FROM products WHERE slug = 'monitor-27'), 3, 1500),
  ((SELECT id FROM products WHERE slug = 'monitor-27'), 7, 1000),
  ((SELECT id FROM products WHERE slug = 'monitor-27'), 14, 700),
  ((SELECT id FROM products WHERE slug = 'standing-desk'), 1, 1800),
  ((SELECT id FROM products WHERE slug = 'standing-desk'), 3, 1400),
  ((SELECT id FROM products WHERE slug = 'standing-desk'), 7, 900),
  ((SELECT id FROM products WHERE slug = 'standing-desk'), 14, 600),
  ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 1, 1500),
  ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 3, 1200),
  ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 7, 800),
  ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 14, 600),
  -- Home
  ((SELECT id FROM products WHERE slug = 'air-purifier'), 1, 1200),
  ((SELECT id FROM products WHERE slug = 'air-purifier'), 3, 900),
  ((SELECT id FROM products WHERE slug = 'air-purifier'), 7, 600),
  ((SELECT id FROM products WHERE slug = 'air-purifier'), 14, 400),
  ((SELECT id FROM products WHERE slug = 'portable-ac'), 1, 2500),
  ((SELECT id FROM products WHERE slug = 'portable-ac'), 3, 2000),
  ((SELECT id FROM products WHERE slug = 'portable-ac'), 7, 1400),
  ((SELECT id FROM products WHERE slug = 'portable-ac'), 14, 1000),
  -- Outdoors
  ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 1, 1500),
  ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 3, 1000),
  ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 7, 700),
  ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 14, 500);
