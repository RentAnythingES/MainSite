-- Convert repeated internal activation boilerplate in active-product FAQs into direct
-- customer-facing inclusion answers without changing the enumerated contents.

do $$
declare
  affected_rows integer;
begin
  update public.product_faqs faq
     set answer = regexp_replace(
       regexp_replace(
         faq.answer,
         '^The documented set contains ',
         'The rental includes '
       ),
       ' The exact physical contents will be confirmed before activation\.$',
       ''
     )
    from public.products product
   where faq.product_id = product.id
     and product.is_active = true
     and faq.locale = 'en'
     and faq.answer like 'The documented set contains % The exact physical contents will be confirmed before activation.';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 27 then
    raise exception 'Expected to repair 27 English inclusion FAQs, updated %', affected_rows;
  end if;

  update public.product_faqs faq
     set answer = regexp_replace(
       regexp_replace(
         faq.answer,
         '^El conjunto documentado contiene ',
         'El alquiler incluye '
       ),
       ' El contenido físico exacto se confirmará antes de la activación\.$',
       ''
     )
    from public.products product
   where faq.product_id = product.id
     and product.is_active = true
     and faq.locale = 'es'
     and faq.answer like 'El conjunto documentado contiene % El contenido físico exacto se confirmará antes de la activación.';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 27 then
    raise exception 'Expected to repair 27 Spanish inclusion FAQs, updated %', affected_rows;
  end if;

  if exists (
    select 1
      from public.product_faqs faq
      join public.products product on product.id = faq.product_id
     where product.is_active = true
       and (
         faq.answer ilike '%exact physical contents will be confirmed before activation.%'
         or faq.answer ilike '%contenido físico exacto se confirmará antes de la activación.%'
       )
  ) then
    raise exception 'Activation boilerplate remains in an active-product FAQ';
  end if;
end
$$;
