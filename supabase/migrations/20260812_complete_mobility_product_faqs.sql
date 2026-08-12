-- Complete fact-bound bilingual FAQ coverage for the remaining mobility products.
-- Product identity, pricing, stock, images and category memberships remain unchanged.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.product_localizations localization
     set seo_description = 'Rent a folding power wheelchair in Valencia with dual 250 W motors, joystick control, removable battery options, and local delivery or pickup.',
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and product.slug = 'mobility-power-wheelchair'
     and localization.locale = 'en'
     and localization.seo_description = 'Hire a folding portable power wheelchair in Valencia. mobility scooters, crutches and walker rental.';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to repair one powered-wheelchair English SEO description, updated %', affected_rows;
  end if;

  update public.product_faqs faq
     set question = case faq.sort_order
       when 3 then 'What is the maximum user weight?'
       when 4 then 'How high is the integrated seat?'
     end,
         answer = case faq.sort_order
       when 3 then 'The rollator supports users up to 135 kg.'
       when 4 then 'The integrated seat is 56 cm high.'
     end
    from public.products product
   where faq.product_id = product.id
     and product.slug = 'rollator-walker'
     and faq.locale = 'en'
     and (
       (faq.sort_order = 3 and faq.question = 'What is the maximum weight that it hold?')
       or
       (faq.sort_order = 4 and faq.question = 'How wide is the integrated seat?')
     );

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to repair two rollator FAQs, updated %', affected_rows;
  end if;

  update public.product_faqs faq
     set question = 'Can I use the wheelchair on the beach?',
         answer = 'No. This transport wheelchair is not designed for use on sand.'
    from public.products product
   where faq.product_id = product.id
     and product.slug = 'transport-wheelchair'
     and faq.locale = 'en'
     and faq.sort_order = 4
     and faq.question = 'Can i use the wheelchair on the beach?';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to repair one transport-wheelchair FAQ, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('mobility-power-wheelchair', 'es', '¿Cuál es el peso máximo de usuario?', 'La ficha de la Toronto Plus indica un peso máximo de usuario de 100 kg.', 0),
      ('mobility-power-wheelchair', 'es', '¿Qué autonomía tiene?', 'La autonomía indicada es de aproximadamente 12–20 km según la batería instalada. La autonomía real varía con el terreno, el peso del usuario, la temperatura y el estado de la batería.', 1),
      ('mobility-power-wheelchair', 'es', '¿Se puede transportar en un coche?', 'Plegada mide aproximadamente 45 × 80 × 74 cm, pero la silla pesa unos 45 kg. Hay que confirmar la apertura del vehículo y cómo manipularla de forma segura.', 2),
      ('rollator-walker', 'es', '¿Cuál es el peso máximo de usuario?', 'El rollator admite usuarios de hasta 135 kg.', 2),
      ('transport-wheelchair', 'es', '¿Cuál es el peso máximo de usuario?', 'La silla admite usuarios de hasta 100 kg.', 2)
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
  if inserted_rows <> 5 then
    raise exception 'Expected to insert five Spanish mobility FAQs, inserted %', inserted_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization
        on localization.product_id = product.id and localization.locale = 'en'
     where product.slug = 'mobility-power-wheelchair'
       and localization.seo_description ilike '%crutches%'
  ) then
    raise exception 'Unrelated powered-wheelchair SEO description text remains';
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in ('mobility-power-wheelchair', 'rollator-walker', 'transport-wheelchair')
     group by product.slug
    having count(*) filter (where faq.locale = 'es') < 3
  ) then
    raise exception 'Spanish mobility FAQ coverage remains incomplete';
  end if;
end
$$;
