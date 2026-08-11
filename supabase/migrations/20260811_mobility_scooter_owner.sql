-- Align the three published scooter listings with the new family owner while
-- preserving product IDs, slugs, pricing, stock, availability and page content.

do $$
declare
  foldable_product_id uuid;
  standard_product_id uuid;
  affected_rows integer;
begin
  select id into foldable_product_id
    from public.products
   where slug = 'mobility-scooter-lightweight-foldable';

  if foldable_product_id is null then
    raise exception 'Foldable mobility scooter product is missing';
  end if;

  select id into standard_product_id
    from public.products
   where slug = 'mobility-scooter-standard';

  if standard_product_id is null then
    raise exception 'Standard mobility scooter product is missing';
  end if;

  update public.products
     set subcategory = 'Mobility Scooters',
         subcategory_slug = 'scooters'
   where id = standard_product_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one standard scooter, updated %', affected_rows;
  end if;

  update public.product_localizations
     set seo_title = 'Foldable Mobility Scooter Rental Valencia',
         seo_description = 'Rent a foldable mobility scooter in Valencia with charger and personal handover. Confirm access, vehicle transport and dates before booking.',
         updated_at = now()
   where product_id = foldable_product_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one English foldable-scooter localization, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.product_localizations
     where product_id = foldable_product_id
       and locale = 'en'
       and (
         seo_title ~* 'wheelchair'
         or seo_description ~* 'same.day|airport|cruise'
       )
  ) then
    raise exception 'Foldable scooter metadata still contains broad or unsupported claims';
  end if;
end
$$;
