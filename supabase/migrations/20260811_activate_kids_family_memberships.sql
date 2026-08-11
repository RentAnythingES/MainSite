-- Give the Kids & Family catalogue a useful, reviewed secondary membership set.
-- Canonical product ownership remains unchanged: these rows affect discovery only.

do $$
declare
  kids_category_id uuid;
  target_slugs constant text[] := array[
    'bed-rail-for-kids',
    'thule-chariot-sport-1-bike-trailer',
    'big-bobby-car-classic-ocean',
    'stroller-and-bike-trailer-for-2',
    'toddler-bike-lila',
    'color-beach-crab-sand-toy-set',
    'beach-tennis-set',
    'kipsta-bv100-size-5-beach-volleyball',
    'kipsta-bs100-beginner-beach-volleyball-net',
    'talbot-torro-beachminton-set',
    'family-roof-tent-4-person',
    'family-tent-1',
    'quechua-arpenaz-4-2-fresh-black-family-tent',
    'family-tent-3',
    'roof-tent-2adults-2kids',
    'inflatable-family-kayak-2-3-people',
    'swimming-vest-19-30kg',
    'seat-booster',
    'kinderkraft-i-spark-2-plus-i-size-car-seat',
    'moni-serengeti-i-size-car-seat'
  ]::text[];
  matching_products integer;
  matching_memberships integer;
begin
  if to_regclass('public.product_category_memberships') is null then
    raise exception 'Apply 20260810_product_category_memberships.sql first';
  end if;

  select id into kids_category_id
    from public.categories
   where slug = 'kids-family';

  if kids_category_id is null then
    raise exception 'Kids & Family category is missing';
  end if;

  select count(*) into matching_products
    from public.products
   where is_active = true
     and slug = any(target_slugs);

  if matching_products <> cardinality(target_slugs) then
    raise exception 'Expected % active Kids & Family products, found %',
      cardinality(target_slugs), matching_products;
  end if;

  insert into public.product_category_memberships (product_id, category_id, is_primary)
  select product.id, kids_category_id, false
    from public.products product
   where product.is_active = true
     and product.slug = any(target_slugs)
  on conflict (product_id, category_id) do update
    set is_primary = false,
        updated_at = now();

  select count(*) into matching_memberships
    from public.product_category_memberships membership
    join public.products product on product.id = membership.product_id
   where membership.category_id = kids_category_id
     and not membership.is_primary
     and product.slug = any(target_slugs);

  if matching_memberships <> cardinality(target_slugs) then
    raise exception 'Expected % Kids & Family secondary memberships, found %',
      cardinality(target_slugs), matching_memberships;
  end if;
end
$$;
