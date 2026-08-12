-- Add useful Spanish FAQ parity for two priority baby products.
-- Avoid propagating the process-heavy FAQ copy found on other listings.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.product_faqs faq
     set question = 'Does it offer sun protection?'
    from public.products product
   where faq.product_id = product.id
     and product.slug = 'stroller-double'
     and faq.locale = 'en'
     and faq.sort_order = 4
     and faq.question = 'Doe it offer sun protection?';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to repair one double-stroller FAQ typo, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('baby-carrier', 'es', '¿Qué posiciones de porteo admite?', 'Admite porteo frontal mirando hacia dentro, frontal mirando hacia fuera, a la cadera y a la espalda.', 0),
      ('baby-carrier', 'es', '¿Cuándo puede el bebé mirar hacia fuera?', 'Ergobaby indica el porteo frontal mirando hacia fuera a partir de unos cinco meses, según el desarrollo y el ajuste del bebé.', 1),
      ('baby-carrier', 'es', '¿Se puede lavar la mochila portabebés?', 'Sí. Esta mochila de malla se puede lavar a máquina siguiendo las indicaciones de la etiqueta de cuidado.', 2),
      ('stroller-double', 'es', '¿Ofrece protección solar?', 'Sí. Las dos capotas tienen protección UV 50+.', 4)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug
   where not exists (
     select 1
       from public.product_faqs existing
      where existing.product_id = product.id
        and existing.locale = faq.locale
        and existing.sort_order = faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 4 then
    raise exception 'Expected to insert four Spanish baby-product FAQs, inserted %', inserted_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in ('baby-carrier', 'stroller-double')
     group by product.slug
    having count(*) filter (where faq.locale = 'en') < 3
        or count(*) filter (where faq.locale = 'es') < 3
  ) then
    raise exception 'Priority baby-product bilingual FAQ coverage remains incomplete';
  end if;
end
$$;
