-- Clarify mobility search ownership without changing product specifications,
-- safety constraints, pricing, inventory, or canonical product URLs.

do $$
declare
  wheelchair_id uuid;
  trailer_id uuid;
  mobility_id uuid;
  baby_gear_id uuid;
  affected_rows integer;
begin
  select id into wheelchair_id
    from public.products
   where slug = 'mobility-power-wheelchair';
  if wheelchair_id is null then
    raise exception 'Product mobility-power-wheelchair was not found';
  end if;

  select id, category_id into trailer_id, baby_gear_id
    from public.products
   where slug = 'stroller-and-bike-trailer-for-2';
  if trailer_id is null then
    raise exception 'Product stroller-and-bike-trailer-for-2 was not found';
  end if;

  select id into mobility_id
    from public.categories
   where slug = 'mobility';
  if mobility_id is null then
    raise exception 'Category mobility was not found';
  end if;

  if baby_gear_id = mobility_id then
    raise exception 'Trailer unexpectedly has mobility as its primary category';
  end if;

  if exists (
    select 1
      from public.product_category_memberships
     where product_id = trailer_id
       and category_id = mobility_id
       and is_primary
  ) then
    raise exception 'Refusing to delete a primary mobility membership for the trailer';
  end if;

  delete from public.product_category_memberships
   where product_id = trailer_id
     and category_id = mobility_id
     and not is_primary;

  if exists (
    select 1
      from public.product_category_memberships
     where product_id = trailer_id
       and category_id = mobility_id
  ) then
    raise exception 'Trailer mobility membership remains after cleanup';
  end if;

  update public.product_localizations
     set short_description = 'Rent an electric wheelchair in Valencia with fit, control, route and charging checks before handover.',
         seo_title = 'Electric Wheelchair Rental in Valencia | Rent&Roll',
         seo_description = 'Rent an electric wheelchair in Valencia with joystick control, folding frame and local delivery, after fit, route and charging checks.',
         updated_at = now()
   where product_id = wheelchair_id
     and locale = 'en';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English electric-wheelchair localization, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.product_localizations
     where product_id = wheelchair_id
       and locale = 'en'
       and (
         constraints_text is null
         or btrim(constraints_text) = ''
         or detail_description is null
         or btrim(detail_description) = ''
       )
  ) then
    raise exception 'Electric-wheelchair safety or detail content is unexpectedly missing';
  end if;
end
$$;
