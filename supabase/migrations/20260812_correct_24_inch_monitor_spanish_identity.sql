-- Align the 24-inch monitor's Spanish short description with its headline and Screen specification.

do $$
declare
  affected_rows integer;
begin
  update public.product_localizations localization
     set short_description = 'Monitor 4K de 24 pulgadas con HDMI y soporte regulable.',
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and product.slug = '24-inch-monitor-hdmi-cable'
     and product.name = 'Desktop Monitor - 24 inch'
     and product.specs ->> 'Screen' = '24 inch IPS'
     and localization.locale = 'es'
     and localization.short_description = 'Monitor  4K de 27 pulgadas HDMI y soporte regulable.';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to repair one 24-inch monitor Spanish description, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      join public.product_localizations localization on localization.product_id = product.id
     where product.slug = '24-inch-monitor-hdmi-cable'
       and localization.locale = 'es'
       and localization.short_description ~* '27[[:space:]]*pulgadas'
  ) then
    raise exception 'The conflicting 27-inch Spanish description remains';
  end if;
end
$$;
