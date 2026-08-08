-- Normalize the remaining active product slugs and enforce the public URL contract.
-- Product IDs and all dependent booking, pricing, stock, image, and localization
-- relationships remain unchanged.

do $$
declare
  source_count integer;
  target_count integer;
begin
  select count(*)
    into source_count
    from products
   where slug in (
     'Camping Kitchen',
     'electric-cooler-47L',
     'Lifejacket-25-40kg',
     'baby-bottle-steriliser-UV'
   );

  if source_count <> 4 then
    raise exception 'Expected 4 source product slugs, found %', source_count;
  end if;

  select count(*)
    into target_count
    from products
   where slug in (
     'outsunny-folding-camping-kitchen-a20-381v00gy',
     'electric-cooler-47l',
     'lifejacket-25-40kg',
     'baby-bottle-steriliser-uv'
   );

  if target_count <> 0 then
    raise exception 'One or more normalized target slugs already exist';
  end if;
end
$$;

update products
   set slug = case slug
     when 'Camping Kitchen' then 'outsunny-folding-camping-kitchen-a20-381v00gy'
     when 'electric-cooler-47L' then 'electric-cooler-47l'
     when 'Lifejacket-25-40kg' then 'lifejacket-25-40kg'
     when 'baby-bottle-steriliser-UV' then 'baby-bottle-steriliser-uv'
   end,
       updated_at = now()
 where slug in (
   'Camping Kitchen',
   'electric-cooler-47L',
   'Lifejacket-25-40kg',
   'baby-bottle-steriliser-UV'
 );

alter table products
  add constraint products_slug_format_check
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
  not valid;

alter table products validate constraint products_slug_format_check;
