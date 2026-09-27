-- Populate base brand fields where exact manufacturer/supplier evidence already
-- supports the brand used in localized customer copy.

do $$
declare
  affected_rows integer;
begin
  update public.products
     set brand = case slug
       when 'baby-bottle-washer' then 'Baby Brezza'
       when 'glamping-table' then 'Aktive'
       when 'beach-umbrella-with-table-cupholders' then 'Aktive'
     end,
     updated_at = now()
   where slug in ('baby-bottle-washer','glamping-table','beach-umbrella-with-table-cupholders');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then raise exception 'Expected three verified product brands, updated %', affected_rows; end if;
end
$$;
