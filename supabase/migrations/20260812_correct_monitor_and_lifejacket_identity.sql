-- Align two active catalogue identities with their public product headlines.
-- Pricing, stock, images, bookings and category memberships remain unchanged.

do $$
declare
  affected_rows integer;
  deleted_faqs integer;
begin
  if exists (
    select 1 from public.products where slug = '32-inch-monitor-hdmi-cable'
  ) then
    raise exception 'The target 32-inch monitor slug already exists';
  end if;

  update public.products
     set slug = '32-inch-monitor-hdmi-cable',
         updated_at = now()
   where slug = '27-inch-monitor-hdmi-cable'
     and name = 'Desktop Monitor - 32 inch'
     and specs ->> 'Screen' = '32 inch IPS'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to rename one active 32-inch monitor, updated %', affected_rows;
  end if;

  update public.products
     set specs = jsonb_set(coalesce(specs, '{}'::jsonb), '{Screen}', '"27 inch IPS"'::jsonb),
         updated_at = now()
   where slug = 'monitor-27'
     and name = 'Desktop Monitor - 27 inch'
     and specs ->> 'Screen' = '24 inch IPS'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to correct one genuine 27-inch monitor specification, updated %', affected_rows;
  end if;

  update public.products
     set name = 'Lifejacket / Swimming Vest - 25–40 kg',
         description = 'Child swimming vest for users weighing 25–40 kg, with a front zip and adjustable buckle straps for a secure fit.',
         features = '["25–40 kg user range", "Front zip", "Adjustable buckle straps"]'::jsonb,
         specs = '{"User weight":"25–40 kg","Closure":"Front zip with adjustable buckle straps"}'::jsonb,
         updated_at = now()
   where slug = 'lifejacket-25-40kg'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one active 25–40 kg swimming vest, updated %', affected_rows;
  end if;

  update public.product_localizations localization
     set short_description = content.short_description,
         detail_description = content.detail_description,
         includes_text = content.includes_text,
         constraints_text = content.constraints_text,
         delivery_setup_note = content.delivery_setup_note,
         care_note = content.care_note,
         seo_title = content.seo_title,
         seo_description = content.seo_description,
         updated_at = now()
    from (
      values
      (
        'en',
        'Child swimming vest for users weighing 25–40 kg, with a front zip and adjustable buckle straps.',
        'A child swimming vest for beach and pool days during your Valencia stay. It is intended for children weighing 25–40 kg and fastens with a front zip and adjustable buckle straps. Check that it fits securely before use. An adult should remain close and supervise the child at all times in and around water.',
        'One child swimming vest for the 25–40 kg weight range.',
        'For children weighing 25–40 kg. Fasten and adjust the vest for a secure, comfortable fit. An adult must supervise at all times in and around water.',
        'At handover, we show how to fasten and adjust the vest.',
        'Rinse with fresh water after use and allow the vest to air-dry before returning it.',
        'Child Swimming Vest Rental Valencia | 25–40 kg',
        'Rent a child swimming vest in Valencia for children weighing 25–40 kg, with a front zip and adjustable straps. Check availability for your dates.'
      ),
      (
        'es',
        'Chaleco de natación infantil para usuarios de 25–40 kg, con cremallera frontal y correas ajustables.',
        'Un chaleco de natación infantil para disfrutar de la playa o la piscina durante tu estancia en Valencia. Está pensado para niños de 25–40 kg y se cierra con cremallera frontal y correas ajustables. Comprueba que quede bien ajustado antes de usarlo. Un adulto debe permanecer cerca y supervisar al menor en todo momento dentro y alrededor del agua.',
        'Un chaleco de natación infantil para el rango de 25–40 kg.',
        'Para niños de 25–40 kg. Cierra y ajusta el chaleco para que quede firme y cómodo. Es necesaria la supervisión constante de un adulto dentro y alrededor del agua.',
        'En la entrega mostramos cómo cerrar y ajustar el chaleco.',
        'Acláralo con agua dulce después de usarlo y déjalo secar al aire antes de devolverlo.',
        'Alquiler de Chaleco Infantil en Valencia | 25–40 kg',
        'Alquila un chaleco de natación infantil en Valencia para niños de 25–40 kg, con cremallera frontal y correas ajustables. Consulta disponibilidad.'
      )
    ) as content(
      locale, short_description, detail_description, includes_text,
      constraints_text, delivery_setup_note, care_note, seo_title, seo_description
    )
    join public.products product on product.slug = 'lifejacket-25-40kg'
   where localization.product_id = product.id
     and localization.locale = content.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to update two swimming-vest localizations, updated %', affected_rows;
  end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id = product.id
     and product.slug = 'lifejacket-25-40kg'
     and faq.locale in ('en', 'es');

  get diagnostics deleted_faqs = row_count;
  if deleted_faqs <> 6 then
    raise exception 'Expected to replace six swimming-vest FAQs, deleted %', deleted_faqs;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('en', 'Who is this swimming vest suitable for?', 'It is intended for children weighing 25–40 kg. Check that the vest also fits securely before use.', 0),
      ('en', 'How does the vest fasten?', 'It has a front zip and adjustable buckle straps. Fasten both and adjust the straps for a secure, comfortable fit.', 1),
      ('en', 'Does a child still need adult supervision?', 'Yes. An adult must remain close and supervise the child at all times in and around water.', 2),
      ('es', '¿Para quién es adecuado este chaleco?', 'Está pensado para niños de 25–40 kg. Comprueba también que quede bien ajustado antes de usarlo.', 0),
      ('es', '¿Cómo se cierra el chaleco?', 'Tiene cremallera frontal y correas con hebilla ajustables. Cierra ambas y ajusta las correas para que quede firme y cómodo.', 1),
      ('es', '¿Sigue siendo necesaria la supervisión de un adulto?', 'Sí. Un adulto debe permanecer cerca y supervisar al menor en todo momento dentro y alrededor del agua.', 2)
    ) as faq(locale, question, answer, sort_order)
    join public.products product on product.slug = 'lifejacket-25-40kg';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then
    raise exception 'Expected to insert six swimming-vest FAQs, inserted %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization on localization.product_id = product.id
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug = 'lifejacket-25-40kg'
       and lower(concat_ws(' ',
         product.description,
         product.features::text,
         product.specs::text,
         localization.short_description,
         localization.detail_description,
         localization.includes_text,
         localization.constraints_text,
         localization.delivery_setup_note,
         localization.seo_title,
         localization.seo_description,
         faq.question,
         faq.answer
       )) similar to '%(10–20|10-20|100–120|100-120|64–68|64-68|size 6|talla 6|50n|rentanything must|rentanything deberá)%'
  ) then
    raise exception 'Contradictory swimming-vest identity text remains after the update';
  end if;
end
$$;
