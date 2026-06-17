-- Step 2: Products (run AFTER seed_1_categories.sql)

-- Baby
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('compact-stroller', 'Compact Folding Stroller', 'Kinderkraft', 'Lightweight, one-hand fold stroller perfect for navigating Valencia old town streets and beach promenades. Includes rain cover and cup holder.', 'S', '/products/compact-stroller.png', (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Strollers', 'strollers', '["One-hand fold","Reclining seat","UV canopy","Rain cover included","5-point harness","Shopping basket"]', '{"Age":"6m - 3 years","Weight limit":"22 kg","Stroller weight":"7.5 kg","Folded size":"54x44x28 cm"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('double-stroller', 'Double Stroller', 'Baby Jogger', 'Side-by-side double stroller for twins or siblings. Fits through standard doorways and folds flat for storage.', 'S', '/products/double-stroller.png', (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Strollers', 'strollers', '["Side-by-side seating","Independent recline","All-terrain wheels","One-hand fold","UV 50+ canopy"]', '{"Age":"6m - 4 years","Weight limit":"2x22 kg","Stroller weight":"13 kg","Width":"76 cm"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('travel-crib', 'Travel Crib', 'BabyBjorn', 'Ultra-light travel crib that sets up in seconds. Breathable mesh sides and firm mattress for safe sleep anywhere in Valencia.', 'C', '/products/travel-crib.png', (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Sleep and Nursery', 'sleep-nursery', '["Sets up in one step","Breathable mesh","Firm mattress included","Fitted sheet included","Carry bag"]', '{"Age":"0 - 3 years","Weight limit":"12 kg","Crib weight":"6 kg","Open size":"112x64x82 cm"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('car-seat-infant', 'Infant Car Seat (i-Size)', 'Cybex', 'Rear-facing infant car seat, i-Size certified. Perfect for airport transfers and day trips from Valencia.', 'C', '/products/car-seat-infant.png', (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Car Seats', 'car-seats', '["i-Size certified","Rear-facing","Side impact protection","Removable newborn insert","ISOFIX compatible"]', '{"Age":"0 - 15 months","Weight limit":"13 kg","Height":"45 - 87 cm","Seat weight":"4.2 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('high-chair', 'Folding High Chair', 'Stokke', 'Ergonomic high chair that grows with your child. Easy to clean, folds flat for apartments.', 'H', '/products/high-chair.png', (SELECT id FROM categories WHERE slug = 'baby-gear'), 'Feeding', 'feeding', '["Adjustable height","5-point harness","Removable tray","Easy clean","Folds flat"]', '{"Age":"6m - 3 years","Weight limit":"20 kg","Chair weight":"7 kg"}');

-- Mobility
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('standard-wheelchair', 'Standard Wheelchair', 'Invacare', 'Lightweight folding wheelchair ideal for exploring Valencia. Fits in most car boots and taxi trunks.', 'W', '/products/standard-wheelchair.png', (SELECT id FROM categories WHERE slug = 'mobility'), 'Wheelchairs', 'wheelchairs', '["Foldable frame","Removable footrests","Padded armrests","Rear wheel brakes","Puncture-proof tyres"]', '{"Seat width":"46 cm","Weight capacity":"115 kg","Chair weight":"14 kg","Folded width":"28 cm"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('transport-wheelchair', 'Transport Wheelchair (Lightweight)', 'Drive Medical', 'Ultra-light transport chair at only 9 kg. Perfect for airports, museums, and sightseeing in Valencia.', 'W', '/products/transport-wheelchair.png', (SELECT id FROM categories WHERE slug = 'mobility'), 'Wheelchairs', 'wheelchairs', '["Ultra-light 9 kg","Companion-push","Swing-away footrests","Seatbelt","Folds compact"]', '{"Seat width":"43 cm","Weight capacity":"100 kg","Chair weight":"9 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('mobility-scooter-lightweight', 'Lightweight Mobility Scooter', 'Pride', 'Compact 4-wheel scooter perfect for Valencia flat terrain. Disassembles into 5 pieces for transport.', 'S', '/products/mobility-scooter-lightweight.png', (SELECT id FROM categories WHERE slug = 'mobility'), 'Mobility Scooters', 'scooters', '["4-wheel stability","Disassembles easily","20 km range","Adjustable seat","Front basket"]', '{"Max speed":"6 km/h","Range":"20 km","Weight capacity":"115 kg","Scooter weight":"34 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('heavy-duty-mobility-scooter', 'Heavy-Duty Mobility Scooter', 'Invacare', 'Full-size scooter with extended range for all-day exploration. Ideal for the Turia Gardens and City of Arts.', 'S', '/products/heavy-duty-mobility-scooter.png', (SELECT id FROM categories WHERE slug = 'mobility'), 'Mobility Scooters', 'scooters', '["Full suspension","40 km range","LED lights","Mirrors","Large tyres"]', '{"Max speed":"12 km/h","Range":"40 km","Weight capacity":"160 kg","Scooter weight":"68 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('rollator-walker', 'Rollator Walker', 'Drive Medical', 'An excellent 4-wheel rollator with seat and storage bag. Great for navigating Valencia at your own pace.', 'R', '/products/rollator-walker.png', (SELECT id FROM categories WHERE slug = 'mobility'), 'Walkers', 'walkers', '["4-wheel design","Built-in seat","Storage bag","Loop brakes","Height adjustable","Foldable"]', '{"Weight capacity":"135 kg","Seat height":"56 cm","Walker weight":"6.5 kg"}');

-- Remote Work
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('monitor-27', '27 inch USB-C Monitor', 'Dell', '4K USB-C monitor - plug in your laptop and get a full workspace. Perfect for digital nomads in Valencia.', 'M', '/products/monitor-27.png', (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'monitors', '["4K resolution","USB-C (65W charging)","Adjustable stand","Built-in speakers","HDMI + DisplayPort"]', '{"Screen":"27 inch IPS","Resolution":"3840x2160","Ports":"USB-C, HDMI, DP","Weight":"6.2 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('standing-desk', 'Electric Standing Desk', 'FlexiSpot', 'Height-adjustable electric standing desk. Transform any Valencia apartment into a proper home office.', 'D', '/products/standing-desk.png', (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'desks', '["Electric height adjust","Memory presets","Cable management","Anti-collision","120x60 cm top"]', '{"Height range":"72 - 120 cm","Desk weight":"25 kg","Load capacity":"70 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('ergonomic-chair', 'Ergonomic Office Chair', 'Herman Miller', 'Premium mesh office chair with full lumbar support. Say goodbye to kitchen-chair back pain.', 'C', '/products/ergonomic-chair.png', (SELECT id FROM categories WHERE slug = 'remote-work'), 'Remote Working', 'chairs', '["Mesh back","Lumbar support","Adjustable arms","Tilt mechanism","Height adjustable"]', '{"Weight capacity":"130 kg","Seat height":"40 - 52 cm","Chair weight":"12 kg"}');

-- Home
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('air-purifier', 'HEPA Air Purifier', 'Dyson', 'Hospital-grade HEPA filtration for allergy sufferers. Covers rooms up to 40m2. Quiet night mode.', 'A', '/products/air-purifier.png', (SELECT id FROM categories WHERE slug = 'home-living'), 'Home Air Quality', 'air-quality', '["HEPA H13 filter","Covers 40m2","Night mode","Air quality sensor","App control","Timer"]', '{"CADR":"320 m3/h","Noise level":"24 - 48 dB","Weight":"4.7 kg"}');

INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('portable-ac', 'Portable Air Conditioner', 'DeLonghi', 'Beat the Valencia summer heat. Cools rooms up to 30m2. Essential for older apartments without AC.', 'A', '/products/portable-ac.png', (SELECT id FROM categories WHERE slug = 'home-living'), 'Home Air Quality', 'air-quality', '["9000 BTU","3-in-1 (cool, fan, dehumidify)","Remote control","Timer","Quiet mode"]', '{"Cooling capacity":"9000 BTU","Room size":"Up to 30m2","Noise":"52 dB","Weight":"26 kg"}');

-- Outdoors
INSERT INTO products (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug, features, specs)
VALUES ('beach-umbrella-set', 'Beach Umbrella and Chair Set', 'RentAnything', 'Complete beach setup: XL umbrella, 2 folding chairs, and a cooler bag. Ready for Malvarrosa or Patacona.', 'B', '/products/beach-umbrella-set.png', (SELECT id FROM categories WHERE slug = 'travel-outdoors'), 'Beach Gear', 'beach', '["2m umbrella with UV protection","2x folding chairs","Insulated cooler bag","Sand anchor","Carry bag"]', '{"Umbrella diameter":"2m","UV protection":"UPF 50+","Total weight":"6 kg"}');
