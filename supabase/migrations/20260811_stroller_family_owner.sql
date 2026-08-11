-- Align the three published stroller listings with the stroller-family owner.
-- Product IDs, slugs, pricing, stock and availability remain unchanged.

do $$
declare
  compact_product_id uuid;
  all_terrain_product_id uuid;
  double_product_id uuid;
  affected_rows integer;
begin
  select id into compact_product_id
    from public.products
   where slug = 'stroller-travel-compact';

  select id into all_terrain_product_id
    from public.products
   where slug = 'stroller-all-terrain';

  select id into double_product_id
    from public.products
   where slug = 'stroller-double';

  if compact_product_id is null or all_terrain_product_id is null or double_product_id is null then
    raise exception 'One or more stroller-family products are missing';
  end if;

  update public.products
     set name = 'All-Terrain Stroller',
         description = 'All-terrain stroller with air-filled wheels and lie-flat recline for suitable uneven paved routes. It is not approved for running or skating.',
         subcategory = 'Strollers',
         subcategory_slug = 'strollers'
   where id = all_terrain_product_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one all-terrain stroller, updated %', affected_rows;
  end if;

  update public.products
     set subcategory = 'Strollers',
         subcategory_slug = 'strollers'
   where id = compact_product_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one compact stroller, updated %', affected_rows;
  end if;

  update public.products
     set description = 'Side-by-side double stroller for twins or siblings. At 76 cm wide, access depends on the exact doorway, lift and storage space.'
   where id = double_product_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one double stroller, updated %', affected_rows;
  end if;

  update public.product_localizations
     set seo_description = 'Rent a compact-fold travel stroller in Valencia for family days, taxis and apartment stays. Check exact folded dimensions and dates.',
         updated_at = now()
   where product_id = compact_product_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English compact-stroller localization, updated %', affected_rows;
  end if;

  update public.product_localizations
     set short_description = 'All-terrain stroller with air-filled wheels and lie-flat recline for suitable uneven paved routes. Not approved for running or skating.',
         seo_title = 'All-Terrain Stroller Rental in Valencia',
         seo_description = 'Rent an all-terrain stroller in Valencia for suitable uneven paved routes. Check child limits, access, transport and dates before booking.',
         updated_at = now()
   where product_id = all_terrain_product_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English all-terrain-stroller localization, updated %', affected_rows;
  end if;

  update public.product_localizations
     set seo_description = 'Rent a double stroller in Valencia for twins or siblings. Check its 76 cm width, child limits, accommodation access and dates.',
         updated_at = now()
   where product_id = double_product_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English double-stroller localization, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization
        on localization.product_id = product.id
       and localization.locale = 'en'
     where product.id = any(array[compact_product_id, all_terrain_product_id, double_product_id]::uuid[])
       and (
         coalesce(product.name, '') ~* 'jogging'
         or coalesce(product.description, '') ~* 'jogging|fits through standard doorways'
         or coalesce(localization.short_description, '') ~* 'jogging'
         or coalesce(localization.seo_title, '') ~* 'jogging'
         or coalesce(localization.seo_description, '') ~* 'jogging|hand luggage|  double'
       )
  ) then
    raise exception 'Stroller metadata still contains an unsupported or stale claim';
  end if;
end
$$;
