-- Repair the final three identified legacy product listings using only evidenced
-- base-record facts and the linked Aktive umbrella source.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = case slug
       when 'beach-umbrella-set' then 'A ready-to-go beach set with a 210 cm UV50 umbrella, two folding chairs, an insulated cooler bag, sand anchor and carry bag.'
       when 'standing-desk' then 'A 120 x 60 cm electric standing desk with a 72–120 cm height range, memory presets, cable management and anti-collision protection.'
       when 'travel-crib' then 'A 6 kg travel crib with mesh sides, quick setup, firm mattress, fitted sheet and carry bag for your Valencia accommodation.'
     end,
     features = case slug
       when 'beach-umbrella-set' then '["210 cm umbrella with UV50 protection", "Two folding chairs", "Insulated cooler bag", "Sand anchor", "Carry bag"]'::jsonb
       else features
     end,
     specs = case slug
       when 'beach-umbrella-set' then jsonb_build_object(
         'Umbrella diameter', '210 cm',
         'UV protection', 'UV50',
         'Umbrella construction', 'Eight steel ribs, ventilated canopy and tilting pole',
         'Set contents', 'Umbrella, two folding chairs, cooler bag, sand anchor and carry bag',
         'Total weight', '6 kg'
       )
       else specs
     end,
     updated_at = now()
   where slug in ('beach-umbrella-set','standing-desk','travel-crib');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then raise exception 'Expected three legacy products, updated %', affected_rows; end if;

  with copy(slug, locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('beach-umbrella-set','en',
      'Beach set with a 210 cm UV50 umbrella, two folding chairs and an insulated cooler bag.',
      'Bring shade and seating to a beach day in Valencia without carrying everything from home. The set combines a 210 cm UV50 umbrella with a ventilated canopy and tilting pole, two folding chairs, an insulated cooler bag and the accessories needed to carry and anchor the set.',
      'The rental includes one 210 cm umbrella, two folding chairs, one insulated cooler bag, a sand anchor and a carry bag.',
      'Secure the umbrella with the sand anchor and do not use it in strong winds. Always follow current beach conditions and local rules.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Shake off sand and let every item dry before packing. Do not leave the umbrella closed while wet.',
      'Beach Umbrella and Chair Set Rental Valencia',
      'Rent a Valencia beach set with a 210 cm UV50 umbrella, two folding chairs, cooler bag, sand anchor and carry bag.'),
    ('beach-umbrella-set','es',
      'Conjunto de playa con sombrilla UV50 de 210 cm, dos sillas plegables y bolsa térmica.',
      'Lleva sombra y asientos a un día de playa en Valencia sin traer todo desde casa. El conjunto combina una sombrilla UV50 de 210 cm con chimenea de ventilación y mástil inclinable, dos sillas plegables, una bolsa térmica y los accesorios necesarios para transportarlo y anclarlo.',
      'El alquiler incluye una sombrilla de 210 cm, dos sillas plegables, una bolsa térmica, un anclaje para arena y una bolsa de transporte.',
      'Fija la sombrilla con el anclaje y no la utilices con viento fuerte. Respeta siempre las condiciones actuales de la playa y las normas locales.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Sacude la arena y deja secar todos los artículos antes de guardarlos. No dejes la sombrilla cerrada mientras esté mojada.',
      'Alquiler de sombrilla y sillas de playa Valencia',
      'Alquila un conjunto de playa en Valencia con sombrilla UV50 de 210 cm, dos sillas plegables, bolsa térmica, anclaje y bolsa de transporte.'),
    ('standing-desk','en',
      'Electric standing desk with a 120 x 60 cm top and 72–120 cm height range.',
      'Set up a proper temporary workspace at your Valencia accommodation. The electric desk adjusts from 72 to 120 cm, supports a distributed load of up to 70 kg and includes memory presets, cable management and an anti-collision system.',
      'The rental includes the assembled electric desk, 120 x 60 cm worktop, controller and power cable.',
      'Requires approximately 120 x 60 cm of clear floor space and access to power. Maximum distributed load 70 kg.',
      'The desk is delivered and installed at the agreed location, subject to suitable access and space.',
      'Keep liquids away from the electrical system and do not move the desk while it is loaded.',
      'Electric Standing Desk Rental in Valencia',
      'Rent a 120 x 60 cm electric standing desk in Valencia with a 72–120 cm height range, memory presets and 70 kg capacity.'),
    ('standing-desk','es',
      'Escritorio eléctrico elevable con tablero de 120 x 60 cm y altura de 72 a 120 cm.',
      'Monta un espacio de trabajo adecuado en tu alojamiento de Valencia. El escritorio eléctrico se regula de 72 a 120 cm, admite una carga distribuida de hasta 70 kg e incorpora memoria de posiciones, gestión de cables y sistema anticolisión.',
      'El alquiler incluye el escritorio eléctrico montado, el tablero de 120 x 60 cm, el controlador y el cable de alimentación.',
      'Requiere aproximadamente 120 x 60 cm de espacio libre y acceso eléctrico. Carga distribuida máxima de 70 kg.',
      'El escritorio se entrega e instala en el lugar acordado, siempre que haya espacio y acceso adecuados.',
      'Mantén los líquidos lejos del sistema eléctrico y no muevas el escritorio mientras esté cargado.',
      'Alquiler de escritorio elevable en Valencia',
      'Alquila un escritorio eléctrico de 120 x 60 cm en Valencia, regulable de 72 a 120 cm, con memoria y capacidad de 70 kg.'),
    ('travel-crib','en',
      'A 6 kg travel crib with mesh sides, firm mattress, fitted sheet and carry bag.',
      'Give your child a familiar sleep space at your Valencia accommodation without travelling with a full-size cot. The crib opens in one step, measures 112 x 64 x 82 cm when set up and includes mesh sides, a firm mattress, fitted sheet and carry bag.',
      'The rental includes the travel crib, firm mattress, fitted sheet and carry bag.',
      'Suitable from birth up to approximately 3 years, with a maximum child weight of 12 kg. Use only the supplied mattress and follow the product instructions for safe sleep.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Use only the supplied mattress. Return the fitted sheet separately if it needs washing.',
      'Travel Crib and Baby Cot Rental Valencia',
      'Rent a 6 kg travel crib in Valencia with mesh sides, firm mattress, fitted sheet, carry bag and quick setup.'),
    ('travel-crib','es',
      'Cuna de viaje de 6 kg con laterales de malla, colchón firme, sábana bajera y bolsa.',
      'Ofrece a tu hijo un espacio de descanso familiar en el alojamiento de Valencia sin viajar con una cuna de tamaño completo. La cuna se abre en un paso, mide 112 x 64 x 82 cm montada e incluye laterales de malla, colchón firme, sábana bajera y bolsa de transporte.',
      'El alquiler incluye la cuna de viaje, el colchón firme, la sábana bajera y la bolsa de transporte.',
      'Indicada desde el nacimiento hasta aproximadamente 3 años, con un peso máximo del niño de 12 kg. Utiliza solo el colchón suministrado y sigue las instrucciones del producto para un sueño seguro.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Utiliza únicamente el colchón suministrado. Devuelve la sábana bajera por separado si necesita lavado.',
      'Alquiler de cuna de viaje en Valencia',
      'Alquila una cuna de viaje de 6 kg en Valencia con malla, colchón firme, sábana bajera, bolsa y montaje rápido.')
  )
  update public.product_localizations localization
     set short_description=copy.short_description,
         detail_description=copy.detail_description,
         includes_text=copy.includes_text,
         constraints_text=copy.constraints_text,
         delivery_setup_note=copy.delivery_setup_note,
         care_note=copy.care_note,
         seo_title=copy.seo_title,
         seo_description=copy.seo_description,
         updated_at=now()
    from public.products product, copy
   where localization.product_id=product.id and product.slug=copy.slug and localization.locale=copy.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then raise exception 'Expected six localizations, updated %', affected_rows; end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id=product.id and product.slug in ('beach-umbrella-set','standing-desk','travel-crib');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 15 then raise exception 'Expected fifteen old FAQs, deleted %', affected_rows; end if;

  insert into public.product_faqs(product_id,locale,question,answer,sort_order)
  select product.id,faq.locale,faq.question,faq.answer,faq.sort_order
    from (values
      ('beach-umbrella-set','en',0,'What does the beach set include?','It includes one 210 cm UV50 umbrella, two folding chairs, one insulated cooler bag, a sand anchor and a carry bag.'),
      ('beach-umbrella-set','en',1,'Can I use the umbrella in windy conditions?','Secure it with the sand anchor and do not use it in strong winds. Current beach conditions and local rules always take priority.'),
      ('beach-umbrella-set','en',2,'Is the set practical to carry?','The chairs fold, the umbrella packs into its carry bag and the set includes an insulated cooler bag.'),
      ('beach-umbrella-set','es',0,'¿Qué incluye el conjunto de playa?','Incluye una sombrilla UV50 de 210 cm, dos sillas plegables, una bolsa térmica, un anclaje para arena y una bolsa de transporte.'),
      ('beach-umbrella-set','es',1,'¿Puedo utilizar la sombrilla con viento?','Fíjala con el anclaje y no la utilices con viento fuerte. Las condiciones actuales de la playa y las normas locales siempre tienen prioridad.'),
      ('beach-umbrella-set','es',2,'¿Es práctico para transportarlo?','Las sillas se pliegan, la sombrilla se guarda en su bolsa de transporte y el conjunto incluye una bolsa térmica.'),
      ('standing-desk','en',0,'What height range does the desk offer?','The electric height adjustment runs from approximately 72 to 120 cm.'),
      ('standing-desk','en',1,'How large is the worktop?','The worktop measures 120 x 60 cm, so check that the accommodation has enough clear space.'),
      ('standing-desk','en',2,'What is the maximum load?','The maximum distributed load is 70 kg.'),
      ('standing-desk','es',0,'¿Qué rango de altura ofrece el escritorio?','La regulación eléctrica permite ajustar la altura aproximadamente de 72 a 120 cm.'),
      ('standing-desk','es',1,'¿Cuánto mide el tablero?','El tablero mide 120 x 60 cm, por lo que conviene comprobar que el alojamiento tenga espacio libre suficiente.'),
      ('standing-desk','es',2,'¿Cuál es la carga máxima?','La carga distribuida máxima es de 70 kg.'),
      ('travel-crib','en',0,'What does the travel crib include?','It includes the crib, firm mattress, fitted sheet and carry bag.'),
      ('travel-crib','en',1,'How large and heavy is it?','The crib weighs 6 kg and measures 112 x 64 x 82 cm when set up.'),
      ('travel-crib','en',2,'What age and weight is it suitable for?','It is suitable from birth up to approximately 3 years, with a maximum child weight of 12 kg.'),
      ('travel-crib','es',0,'¿Qué incluye la cuna de viaje?','Incluye la cuna, el colchón firme, la sábana bajera y la bolsa de transporte.'),
      ('travel-crib','es',1,'¿Cuánto mide y pesa?','La cuna pesa 6 kg y mide 112 x 64 x 82 cm cuando está montada.'),
      ('travel-crib','es',2,'¿Para qué edad y peso es adecuada?','Está indicada desde el nacimiento hasta aproximadamente 3 años, con un peso máximo del niño de 12 kg.')
    ) as faq(slug,locale,sort_order,question,answer)
    join public.products product on product.slug=faq.slug;

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 18 then raise exception 'Expected eighteen bilingual FAQs, inserted %', inserted_rows; end if;
end
$$;
