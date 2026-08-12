-- Remove unsupported brand claims from two legacy products and complete bilingual
-- customer FAQs for the air purifier, ergonomic chair and folding high chair.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = case slug
       when 'air-purifier' then 'A HEPA H13 air purifier for rooms up to 40 m², with a 320 m³/h CADR, air-quality sensor, night mode, timer and app control.'
       when 'ergonomic-chair' then 'An ergonomic mesh office chair with lumbar support, adjustable armrests, recline and seat height for a temporary workspace.'
       else description
     end,
     updated_at = now()
   where slug in ('air-purifier','ergonomic-chair');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then raise exception 'Expected two legacy products, updated %', affected_rows; end if;

  with copy(slug, locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('air-purifier','en',
      'HEPA H13 air purifier with an air-quality sensor and quiet night mode.',
      'Use the purifier in rooms of up to 40 m² during your Valencia stay. Its stored specifications include a 320 m³/h CADR, HEPA H13 filter, air-quality sensor, timer, app control and a noise range of 24 to 48 dB.',
      'The rental includes the air purifier with its filter installed and power cable.',
      'Designed for rooms up to 40 m². Leave clear space around the air inlet and outlet; an air purifier does not replace normal ventilation or medical advice.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Do not cover the air inlet or outlet and do not remove or wet the filter.',
      'HEPA Air Purifier Rental in Valencia',
      'Rent a HEPA H13 air purifier in Valencia for rooms up to 40 m², with an air-quality sensor, timer, app control and quiet night mode.'),
    ('air-purifier','es',
      'Purificador de aire HEPA H13 con sensor de calidad del aire y modo nocturno silencioso.',
      'Utiliza el purificador en habitaciones de hasta 40 m² durante tu estancia en Valencia. Sus especificaciones registradas incluyen un CADR de 320 m³/h, filtro HEPA H13, sensor de calidad del aire, temporizador, control mediante aplicación y un nivel sonoro de 24 a 48 dB.',
      'El alquiler incluye el purificador con el filtro instalado y el cable de alimentación.',
      'Diseñado para habitaciones de hasta 40 m². Deja espacio libre alrededor de la entrada y salida de aire; un purificador no sustituye la ventilación habitual ni el consejo médico.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'No cubras la entrada ni la salida de aire y no retires ni mojes el filtro.',
      'Alquiler de purificador de aire HEPA Valencia',
      'Alquila un purificador HEPA H13 en Valencia para habitaciones de hasta 40 m², con sensor, temporizador, aplicación y modo nocturno silencioso.'),
    ('ergonomic-chair','en',
      'Ergonomic office chair with a mesh back, lumbar support and adjustable height, armrests and recline.',
      'Create a more comfortable temporary workspace with a mesh-backed chair that adjusts to your seating position. The stored specifications list a seat-height range of 40 to 52 cm, adjustable lumbar support and armrests, a recline mechanism and a maximum capacity of 130 kg.',
      'The rental includes the complete office chair with armrests, lumbar support and adjustment mechanisms.',
      'Maximum capacity 130 kg. Adjust the chair on a stable surface and do not use it as a step.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Avoid sharp objects on the mesh and return the chair clean and dry.',
      'Ergonomic Office Chair Rental in Valencia',
      'Rent an ergonomic office chair in Valencia with a mesh back, lumbar support, adjustable armrests, recline and a 40–52 cm seat-height range.'),
    ('ergonomic-chair','es',
      'Silla de oficina ergonómica con respaldo de malla, soporte lumbar y ajustes de altura, brazos e inclinación.',
      'Crea un espacio de trabajo temporal más cómodo con una silla de respaldo de malla que se adapta a tu posición. Las especificaciones registradas indican una altura de asiento de 40 a 52 cm, soporte lumbar y brazos regulables, mecanismo de inclinación y una capacidad máxima de 130 kg.',
      'El alquiler incluye la silla de oficina completa con brazos, soporte lumbar y mecanismos de ajuste.',
      'Capacidad máxima de 130 kg. Ajusta la silla sobre una superficie estable y no la utilices como escalón.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Evita apoyar objetos cortantes sobre la malla y devuelve la silla limpia y seca.',
      'Alquiler de silla ergonómica en Valencia',
      'Alquila una silla ergonómica en Valencia con respaldo de malla, soporte lumbar, brazos regulables, inclinación y asiento de 40 a 52 cm.'),
    ('high-chair','en',
      'Adjustable and foldable Stokke high chair with a five-point harness and removable tray.',
      'Give your child a dedicated place for meals at your Valencia accommodation. The stored product record lists adjustable height, a five-point harness, removable tray, easy-clean surfaces and a folding design for children from approximately 6 months to 3 years and up to 20 kg.',
      'The rental includes the high chair, five-point harness and removable tray.',
      'Suitable for children from approximately 6 months to 3 years and up to 20 kg. Keep the child strapped in and supervised at all times.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Clean the tray after use and return the high chair free of significant food residue.',
      'Folding Baby High Chair Rental Valencia',
      'Rent an adjustable, folding Stokke baby high chair in Valencia with a five-point harness, removable tray and 20 kg maximum capacity.'),
    ('high-chair','es',
      'Trona Stokke regulable y plegable con arnés de cinco puntos y bandeja extraíble.',
      'Ofrece a tu hijo un lugar propio para comer en el alojamiento de Valencia. La ficha registrada indica altura ajustable, arnés de cinco puntos, bandeja extraíble, superficies fáciles de limpiar y diseño plegable para niños de aproximadamente 6 meses a 3 años y hasta 20 kg.',
      'El alquiler incluye la trona, el arnés de cinco puntos y la bandeja extraíble.',
      'Indicada para niños de aproximadamente 6 meses a 3 años y hasta 20 kg. Mantén al niño sujeto y supervisado en todo momento.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Limpia la bandeja después de usarla y devuelve la trona sin restos importantes de comida.',
      'Alquiler de trona plegable en Valencia',
      'Alquila una trona Stokke regulable y plegable en Valencia con arnés de cinco puntos, bandeja extraíble y capacidad máxima de 20 kg.')
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
   where faq.product_id=product.id and product.slug in ('air-purifier','ergonomic-chair','high-chair');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 12 then raise exception 'Expected twelve old FAQs, deleted %', affected_rows; end if;

  insert into public.product_faqs(product_id,locale,question,answer,sort_order)
  select product.id,faq.locale,faq.question,faq.answer,faq.sort_order
    from (values
      ('air-purifier','en',0,'What room size is the purifier designed for?','The stored specification covers rooms up to 40 m² and lists a CADR of 320 m³/h.'),
      ('air-purifier','en',1,'Is it quiet enough for a bedroom?','The listed noise range is 24 to 48 dB, with a quieter night mode for lower-noise operation.'),
      ('air-purifier','en',2,'Can it help with airborne particles?','The HEPA H13 filter is designed to capture airborne particles indoors. The purifier does not replace ventilation or medical advice.'),
      ('air-purifier','es',0,'¿Para qué tamaño de habitación está diseñado?','La especificación registrada cubre habitaciones de hasta 40 m² e indica un CADR de 320 m³/h.'),
      ('air-purifier','es',1,'¿Es suficientemente silencioso para un dormitorio?','El nivel sonoro indicado es de 24 a 48 dB e incluye un modo nocturno para funcionar con menos ruido.'),
      ('air-purifier','es',2,'¿Puede ayudar con las partículas en suspensión?','El filtro HEPA H13 está diseñado para capturar partículas suspendidas en interiores. El purificador no sustituye la ventilación ni el consejo médico.'),
      ('ergonomic-chair','en',0,'What can I adjust on the chair?','You can adjust the seat height, armrests, lumbar support and recline to suit your workspace.'),
      ('ergonomic-chair','en',1,'What is the chair''s maximum capacity?','The stored maximum capacity is 130 kg.'),
      ('ergonomic-chair','en',2,'What seat-height range does it offer?','The seat adjusts from approximately 40 to 52 cm.'),
      ('ergonomic-chair','es',0,'¿Qué se puede ajustar en la silla?','Puedes regular la altura del asiento, los brazos, el soporte lumbar y la inclinación para adaptar el puesto de trabajo.'),
      ('ergonomic-chair','es',1,'¿Cuál es la capacidad máxima de la silla?','La capacidad máxima registrada es de 130 kg.'),
      ('ergonomic-chair','es',2,'¿Qué rango de altura ofrece el asiento?','El asiento se ajusta aproximadamente de 40 a 52 cm.'),
      ('high-chair','en',0,'What age and weight is the high chair for?','It is listed for children from approximately 6 months to 3 years and up to 20 kg.'),
      ('high-chair','en',1,'Does it include a tray and harness?','Yes. The rental includes a removable tray and five-point harness.'),
      ('high-chair','en',2,'Does it fold for storage?','Yes. The stored product record lists a folding design for easier storage at the accommodation.'),
      ('high-chair','es',0,'¿Para qué edad y peso está indicada?','Está indicada para niños de aproximadamente 6 meses a 3 años y hasta 20 kg.'),
      ('high-chair','es',1,'¿Incluye bandeja y arnés?','Sí. El alquiler incluye una bandeja extraíble y un arnés de cinco puntos.'),
      ('high-chair','es',2,'¿Se pliega para guardarla?','Sí. La ficha registrada indica un diseño plegable para facilitar el almacenamiento en el alojamiento.')
    ) as faq(slug,locale,sort_order,question,answer)
    join public.products product on product.slug=faq.slug;

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 18 then raise exception 'Expected eighteen bilingual FAQs, inserted %', inserted_rows; end if;
end
$$;
