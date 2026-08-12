-- Replace internal editorial/compliance prose on the two remaining child-water products
-- with concise customer-facing EN/ES copy based on their stored product facts.

do $$
declare
  affected_rows integer;
  deleted_faqs integer;
begin
  update public.products
     set name = 'Child Lifejacket - 15–40 kg',
         description = 'Child lifejacket available in 15–30 kg and 30–40 kg sizes for supervised water activities.',
         features = '["15–30 kg and 30–40 kg sizes","High-visibility orange and grey design","For supervised water activities"]'::jsonb,
         specs = '{"Product type":"Child lifejacket","Available weight sizes":"15–30 kg and 30–40 kg","Overall range":"15–40 kg"}'::jsonb,
         updated_at = now()
   where slug = 'lifejacket-15-40kg'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one active 15–40 kg lifejacket, updated %', affected_rows;
  end if;

  update public.products
     set name = 'Child Swimming Vest - 19–30 kg',
         description = 'Orange child swimming vest for children weighing 19–30 kg, with adjustable buckle straps and a crotch strap.',
         features = '["19–30 kg user range","Adjustable quick-lock buckle straps","Crotch strap","High-visibility orange and black design","EPE foam buoyancy"]'::jsonb,
         specs = jsonb_set(
           coalesce(specs, '{}'::jsonb),
           '{Classification}',
           '"Swimming aid (not a lifejacket)"'::jsonb
         ),
         updated_at = now()
   where slug = 'swimming-vest-19-30kg'
     and specs ->> 'User weight' = '19–30 kg'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one active 19–30 kg swimming vest, updated %', affected_rows;
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
        'lifejacket-15-40kg', 'en',
        'Child lifejacket available in 15–30 kg and 30–40 kg sizes for supervised water activities.',
        'Choose the lifejacket size using the child''s current weight: 15–30 kg or 30–40 kg. The high-visibility orange and grey design is suitable for supervised water activities during your Valencia stay. Tell us the child''s weight when booking so we can confirm the appropriate size. An adult must supervise the child at all times in and around water.',
        'One child lifejacket in the confirmed weight size.',
        'For children weighing 15–40 kg. Choose the size by current weight and check that it fits securely. Adult supervision is required at all times in and around water.',
        'Tell us the child''s current weight before delivery. We will confirm the appropriate size and show how to fit it.',
        'Rinse with fresh water after use and allow the lifejacket to air-dry before returning it.',
        'Child Lifejacket Rental Valencia | 15–40 kg',
        'Rent a child lifejacket in Valencia in 15–30 kg or 30–40 kg sizes. Tell us the child''s weight so we can confirm the appropriate option.'
      ),
      (
        'lifejacket-15-40kg', 'es',
        'Chaleco salvavidas infantil disponible en tallas de 15–30 kg y 30–40 kg para actividades acuáticas supervisadas.',
        'Elige la talla del chaleco según el peso actual del menor: 15–30 kg o 30–40 kg. El diseño naranja y gris de alta visibilidad es adecuado para actividades acuáticas supervisadas durante tu estancia en Valencia. Indícanos el peso del menor al reservar para que podamos confirmar la talla adecuada. Un adulto debe supervisarlo en todo momento dentro y alrededor del agua.',
        'Un chaleco salvavidas infantil en la talla de peso confirmada.',
        'Para menores de 15–40 kg. Elige la talla según el peso actual y comprueba que quede bien ajustada. Es necesaria la supervisión constante de un adulto dentro y alrededor del agua.',
        'Indícanos el peso actual del menor antes de la entrega. Confirmaremos la talla adecuada y mostraremos cómo colocarla.',
        'Acláralo con agua dulce después de usarlo y déjalo secar al aire antes de devolverlo.',
        'Alquiler Chaleco Salvavidas Infantil Valencia | 15–40 kg',
        'Alquila un chaleco salvavidas infantil en Valencia en tallas de 15–30 kg o 30–40 kg. Indícanos el peso del menor para confirmar la opción adecuada.'
      ),
      (
        'swimming-vest-19-30kg', 'en',
        'Orange child swimming vest for children weighing 19–30 kg, with adjustable buckle straps and a crotch strap.',
        'This orange child swimming vest is designed for children weighing 19–30 kg, with approximate age guidance of 3–6 years. Current weight and a secure fit are what matter. Adjustable quick-lock buckles and a crotch strap help keep it in place. It is a swimming aid for supervised practice, not a lifejacket or a substitute for close adult supervision.',
        'One orange child swimming vest for the 19–30 kg weight range.',
        'For children weighing 19–30 kg after checking for a secure fit. This is a swimming aid, not a lifejacket. An adult must remain close and supervise at all times.',
        'Tell us the child''s current weight before delivery. We will show how to adjust the buckles and crotch strap for a secure fit.',
        'Rinse with fresh water after use and allow the vest to air-dry before returning it.',
        'Child Swimming Vest Rental Valencia | 19–30 kg',
        'Rent a child swimming vest in Valencia for children weighing 19–30 kg, with adjustable buckles and a crotch strap. Check availability for your dates.'
      ),
      (
        'swimming-vest-19-30kg', 'es',
        'Chaleco de natación infantil naranja para menores de 19–30 kg, con hebillas ajustables y cinta de entrepierna.',
        'Este chaleco de natación infantil naranja está diseñado para menores de 19–30 kg, con una edad orientativa de 3–6 años. Lo importante es el peso actual y que quede bien ajustado. Las hebillas de cierre rápido y la cinta de entrepierna ayudan a mantenerlo en su sitio. Es una ayuda para aprender a nadar bajo supervisión, no un chaleco salvavidas ni un sustituto de la supervisión adulta cercana.',
        'Un chaleco de natación infantil naranja para el rango de 19–30 kg.',
        'Para menores de 19–30 kg tras comprobar que quede bien ajustado. Es una ayuda de natación, no un chaleco salvavidas. Un adulto debe permanecer cerca y supervisar en todo momento.',
        'Indícanos el peso actual del menor antes de la entrega. Mostraremos cómo ajustar las hebillas y la cinta de entrepierna para que quede firme.',
        'Acláralo con agua dulce después de usarlo y déjalo secar al aire antes de devolverlo.',
        'Alquiler Chaleco Natación Infantil Valencia | 19–30 kg',
        'Alquila un chaleco de natación infantil en Valencia para menores de 19–30 kg, con hebillas ajustables y cinta de entrepierna. Consulta disponibilidad.'
      )
    ) as content(
      slug, locale, short_description, detail_description, includes_text,
      constraints_text, delivery_setup_note, care_note, seo_title, seo_description
    )
    join public.products product on product.slug = content.slug
   where localization.product_id = product.id
     and localization.locale = content.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 4 then
    raise exception 'Expected to update four child-water localizations, updated %', affected_rows;
  end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id = product.id
     and product.slug in ('lifejacket-15-40kg', 'swimming-vest-19-30kg')
     and faq.locale in ('en', 'es');

  get diagnostics deleted_faqs = row_count;
  if deleted_faqs <> 12 then
    raise exception 'Expected to replace twelve child-water FAQs, deleted %', deleted_faqs;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('lifejacket-15-40kg', 'en', 'Which lifejacket size should I choose?', 'Choose by the child''s current weight: 15–30 kg or 30–40 kg. Tell us the weight when booking so we can confirm the appropriate size.', 0),
      ('lifejacket-15-40kg', 'en', 'What is included?', 'The rental includes one child lifejacket in the confirmed weight size.', 1),
      ('lifejacket-15-40kg', 'en', 'Does a child still need adult supervision?', 'Yes. An adult must remain close and supervise the child at all times in and around water.', 2),
      ('lifejacket-15-40kg', 'es', '¿Qué talla de chaleco debo elegir?', 'Elige según el peso actual del menor: 15–30 kg o 30–40 kg. Indícanos el peso al reservar para que podamos confirmar la talla adecuada.', 0),
      ('lifejacket-15-40kg', 'es', '¿Qué incluye el alquiler?', 'El alquiler incluye un chaleco salvavidas infantil en la talla de peso confirmada.', 1),
      ('lifejacket-15-40kg', 'es', '¿Sigue siendo necesaria la supervisión de un adulto?', 'Sí. Un adulto debe permanecer cerca y supervisar al menor en todo momento dentro y alrededor del agua.', 2),
      ('swimming-vest-19-30kg', 'en', 'Who is this swimming vest suitable for?', 'It is designed for children weighing 19–30 kg. The approximate age guidance is 3–6 years, but current weight and a secure fit are what matter.', 0),
      ('swimming-vest-19-30kg', 'en', 'Is this a lifejacket?', 'No. It is a swimming aid for supervised practice, not a lifejacket or a substitute for close adult supervision.', 1),
      ('swimming-vest-19-30kg', 'en', 'How does the vest fasten?', 'It uses adjustable quick-lock buckle straps and a crotch strap. Adjust both so the vest remains secure and comfortable.', 2),
      ('swimming-vest-19-30kg', 'es', '¿Para quién es adecuado este chaleco de natación?', 'Está diseñado para menores de 19–30 kg. La edad orientativa es de 3–6 años, pero lo importante es el peso actual y que quede bien ajustado.', 0),
      ('swimming-vest-19-30kg', 'es', '¿Es un chaleco salvavidas?', 'No. Es una ayuda para aprender a nadar bajo supervisión, no un chaleco salvavidas ni un sustituto de la supervisión adulta cercana.', 1),
      ('swimming-vest-19-30kg', 'es', '¿Cómo se cierra el chaleco?', 'Utiliza hebillas ajustables de cierre rápido y una cinta de entrepierna. Ajusta ambas para que el chaleco quede firme y cómodo.', 2)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 12 then
    raise exception 'Expected to insert twelve child-water FAQs, inserted %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization on localization.product_id = product.id
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in ('lifejacket-15-40kg', 'swimming-vest-19-30kg')
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
       )) similar to '%(before activation|antes de la activación|rentanything must|rentanything debe|physically verified|verificado físicamente|why did one description|por qué una descripción|exact acquired size|talla.*aprobada)%'
  ) then
    raise exception 'Internal editorial or retired source-conflict copy remains';
  end if;
end
$$;
