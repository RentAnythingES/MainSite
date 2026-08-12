-- Replace internal inspection language on the folding-chair page with useful product facts.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = 'A lightweight IKEA VIHALS folding chair for extra indoor seating in a Valencia apartment, dining area or temporary workspace.',
         updated_at = now()
   where slug = 'folding-chair'
     and specs ->> 'article' = '005.927.52';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one folding chair, updated %', affected_rows;
  end if;

  update public.product_localizations localization
     set short_description = case localization.locale
           when 'en' then 'Lightweight IKEA VIHALS folding chair for flexible indoor seating.'
           when 'es' then 'Silla plegable IKEA VIHALS ligera para añadir un asiento en interiores.'
         end,
         detail_description = case localization.locale
           when 'en' then 'The IKEA VIHALS folds flat when not in use, making it practical for guests, dining or a temporary desk setup. It measures 43 x 47 x 80 cm, has a 45 cm seat height and is tested for domestic use up to 110 kg.'
           when 'es' then 'La IKEA VIHALS se pliega para ocupar poco espacio cuando no se utiliza, por lo que resulta práctica para invitados, la mesa de comedor o un puesto de trabajo temporal. Mide 43 x 47 x 80 cm, tiene un asiento de 45 cm de altura y está probada para uso doméstico hasta 110 kg.'
         end,
         includes_text = case localization.locale
           when 'en' then 'The rental includes one fully assembled IKEA VIHALS folding chair.'
           when 'es' then 'El alquiler incluye una silla plegable IKEA VIHALS completamente montada.'
         end,
         constraints_text = case localization.locale
           when 'en' then 'For domestic indoor seating only. Do not use the chair as a step, ladder or child seat.'
           when 'es' then 'Solo para sentarse en interiores domésticos. No utilices la silla como escalón, escalera o asiento infantil.'
         end,
         delivery_setup_note = case localization.locale
           when 'en' then 'Delivery and collection options for your Valencia address are shown with your booking.'
           when 'es' then 'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.'
         end,
         care_note = case localization.locale
           when 'en' then 'Wipe clean with a damp cloth and dry with a clean cloth.'
           when 'es' then 'Límpiala con un paño húmedo y sécala con un paño limpio.'
         end,
         seo_title = case localization.locale
           when 'en' then 'IKEA Folding Chair Rental in Valencia'
           when 'es' then 'Alquiler de silla plegable IKEA en Valencia'
         end,
         seo_description = case localization.locale
           when 'en' then 'Rent an IKEA VIHALS folding chair in Valencia for guests, dining or a temporary workspace. Folds flat and supports up to 110 kg.'
           when 'es' then 'Alquila una silla plegable IKEA VIHALS en Valencia para invitados, comedor o teletrabajo. Se pliega y admite hasta 110 kg.'
         end,
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and product.slug = 'folding-chair'
     and localization.locale in ('en', 'es');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to update two folding-chair localizations, updated %', affected_rows;
  end if;

  update public.product_faqs faq
     set question = case faq.sort_order
           when 0 then 'How large is the chair?'
           when 1 then 'What is the tested weight limit?'
           when 2 then 'Can it be used outdoors?'
         end,
         answer = case faq.sort_order
           when 0 then 'It measures 43 cm wide, 47 cm deep and 80 cm high, with a seat height of 45 cm.'
           when 1 then 'IKEA states a tested weight limit of 110 kg for domestic use.'
           when 2 then 'The VIHALS is intended for indoor use. It folds flat for storage when you no longer need the extra seat.'
         end
    from public.products product
   where faq.product_id = product.id
     and product.slug = 'folding-chair'
     and faq.locale = 'en'
     and faq.sort_order in (0, 1, 2);

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then
    raise exception 'Expected to replace three English folding-chair FAQs, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, 'es', faq.question, faq.answer, faq.sort_order
    from (
      values
      (0, '¿Cuánto mide la silla?', 'Mide 43 cm de ancho, 47 cm de fondo y 80 cm de alto, con un asiento a 45 cm del suelo.'),
      (1, '¿Cuál es el peso máximo probado?', 'IKEA indica un peso máximo probado de 110 kg para uso doméstico.'),
      (2, '¿Se puede utilizar en exteriores?', 'La VIHALS está pensada para interiores. Se pliega para guardarla cuando ya no necesitas el asiento adicional.')
    ) as faq(sort_order, question, answer)
    join public.products product on product.slug = 'folding-chair'
   where not exists (
     select 1 from public.product_faqs existing
      where existing.product_id = product.id
        and existing.locale = 'es'
        and existing.sort_order = faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 3 then
    raise exception 'Expected to insert three Spanish folding-chair FAQs, inserted %', inserted_rows;
  end if;
end
$$;
