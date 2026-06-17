-- Step 3: Pricing Tiers (run AFTER seed_2_products.sql)
-- Values in cents

-- Compact Stroller
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'compact-stroller'), 1, 1400);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'compact-stroller'), 3, 1000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'compact-stroller'), 7, 700);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'compact-stroller'), 14, 500);

-- Double Stroller
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'double-stroller'), 1, 2000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'double-stroller'), 3, 1500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'double-stroller'), 7, 1100);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'double-stroller'), 14, 800);

-- Travel Crib
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'travel-crib'), 1, 1200);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'travel-crib'), 3, 900);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'travel-crib'), 7, 600);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'travel-crib'), 14, 400);

-- Car Seat
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 1, 1000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 3, 800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 7, 500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'car-seat-infant'), 14, 400);

-- High Chair
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'high-chair'), 1, 800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'high-chair'), 3, 600);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'high-chair'), 7, 400);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'high-chair'), 14, 300);

-- Standard Wheelchair
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 1, 1500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 3, 1200);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 7, 800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standard-wheelchair'), 14, 600);

-- Transport Wheelchair
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 1, 1200);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 3, 900);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 7, 600);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'transport-wheelchair'), 14, 500);

-- Lightweight Mobility Scooter
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 1, 3500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 3, 2800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 7, 2000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'mobility-scooter-lightweight'), 14, 1500);

-- Heavy-Duty Mobility Scooter
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 1, 7000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 3, 5500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 7, 4000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'heavy-duty-mobility-scooter'), 14, 3000);

-- Rollator Walker
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'rollator-walker'), 1, 1000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'rollator-walker'), 3, 800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'rollator-walker'), 7, 500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'rollator-walker'), 14, 400);

-- Monitor
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'monitor-27'), 1, 2100);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'monitor-27'), 3, 1500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'monitor-27'), 7, 1000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'monitor-27'), 14, 700);

-- Standing Desk
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standing-desk'), 1, 1800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standing-desk'), 3, 1400);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standing-desk'), 7, 900);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'standing-desk'), 14, 600);

-- Ergonomic Chair
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 1, 1500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 3, 1200);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 7, 800);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'ergonomic-chair'), 14, 600);

-- Air Purifier
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'air-purifier'), 1, 1200);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'air-purifier'), 3, 900);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'air-purifier'), 7, 600);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'air-purifier'), 14, 400);

-- Portable AC
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'portable-ac'), 1, 2500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'portable-ac'), 3, 2000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'portable-ac'), 7, 1400);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'portable-ac'), 14, 1000);

-- Beach Set
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 1, 1500);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 3, 1000);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 7, 700);
INSERT INTO pricing_tiers (product_id, min_days, per_day_cents) VALUES ((SELECT id FROM products WHERE slug = 'beach-umbrella-set'), 14, 500);
