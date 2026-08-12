-- Remove one internal pricing-workflow key from the active Koenic AC specifications.
-- No customer copy, pricing, availability, URL, image or category data is changed.

do $$
declare
  affected_rows integer;
begin
  update public.products
     set specs = specs - 'Pricing review',
         updated_at = now()
   where slug = 'koenic-kac-9022-w-portable-air-conditioner'
     and is_active = true
     and specs ->> 'Pricing review' = 'Set rental pricing before activation';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to remove one Koenic internal pricing specification, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products
     where slug = 'koenic-kac-9022-w-portable-air-conditioner'
       and specs ? 'Pricing review'
  ) then
    raise exception 'Koenic internal Pricing review specification remains';
  end if;
end
$$;
