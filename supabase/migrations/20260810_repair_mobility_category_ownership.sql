-- Remove transport/logistics products from the Mobility assistance hub.
-- Travel & Outdoors becomes their canonical category owner; bike carriers also
-- receive Fitness & Wellness as a secondary discovery category.

do $$
declare
  mobility_category_id uuid;
  travel_category_id uuid;
  fitness_category_id uuid;
  matching_products integer;
  matching_bike_carriers integer;
begin
  if to_regclass('public.product_category_memberships') is null then
    raise exception 'Apply 20260810_product_category_memberships.sql first';
  end if;

  select id into mobility_category_id from public.categories where slug = 'mobility';
  select id into travel_category_id from public.categories where slug = 'travel-outdoors';
  select id into fitness_category_id from public.categories where slug = 'fitness-wellness';

  if mobility_category_id is null or travel_category_id is null or fitness_category_id is null then
    raise exception 'Required Mobility, Travel & Outdoors, or Fitness & Wellness category is missing';
  end if;

  select count(*) into matching_products
    from public.products
   where category_id = mobility_category_id
     and slug = any(array[
       'bike-towbar-carrier-3bikes',
       'bike-towball-carrier-4bikes',
       'thule-proride-598-roof-bike-carrier',
       'roof-box',
       'transportation-trailer'
     ]::text[]);

  if matching_products <> 5 then
    raise exception 'Expected exactly 5 guarded Mobility products, found %', matching_products;
  end if;

  update public.products
     set category_id = travel_category_id
   where category_id = mobility_category_id
     and slug = any(array[
       'bike-towbar-carrier-3bikes',
       'bike-towball-carrier-4bikes',
       'thule-proride-598-roof-bike-carrier',
       'roof-box',
       'transportation-trailer'
     ]::text[]);

  insert into public.product_category_memberships (product_id, category_id, is_primary)
  select product.id, fitness_category_id, false
    from public.products product
   where product.slug = any(array[
     'bike-towbar-carrier-3bikes',
     'bike-towball-carrier-4bikes',
     'thule-proride-598-roof-bike-carrier'
   ]::text[])
  on conflict (product_id, category_id) do update
    set is_primary = false,
        updated_at = now();

  select count(*) into matching_bike_carriers
    from public.product_category_memberships membership
    join public.products product on product.id = membership.product_id
   where product.slug = any(array[
     'bike-towbar-carrier-3bikes',
     'bike-towball-carrier-4bikes',
     'thule-proride-598-roof-bike-carrier'
   ]::text[])
     and membership.category_id = fitness_category_id
     and not membership.is_primary;

  if matching_bike_carriers <> 3 then
    raise exception 'Expected exactly 3 Fitness secondary memberships, found %', matching_bike_carriers;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_category_memberships membership
        on membership.product_id = product.id
       and membership.category_id = product.category_id
       and membership.is_primary
     where product.slug = any(array[
       'bike-towbar-carrier-3bikes',
       'bike-towball-carrier-4bikes',
       'thule-proride-598-roof-bike-carrier',
       'roof-box',
       'transportation-trailer'
     ]::text[])
       and (product.category_id <> travel_category_id or membership.product_id is null)
  ) then
    raise exception 'Mobility repair did not produce matching Travel & Outdoors primary memberships';
  end if;
end
$$;
