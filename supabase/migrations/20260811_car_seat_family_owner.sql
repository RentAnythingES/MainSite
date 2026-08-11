-- Align three verified car-seat listings with the bilingual car-seat family owner.
-- The two contradictory active records and the inactive draft remain untouched and excluded.
-- Product IDs, slugs, pricing, stock and availability remain unchanged.

do $$
declare
  britax_id uuid;
  group_one_id uuid;
  booster_id uuid;
  affected_rows integer;
begin
  select id into britax_id from public.products where slug = 'car-seat-britax-i-size';
  select id into group_one_id from public.products where slug = 'convertible-car-seat';
  select id into booster_id from public.products where slug = 'kinderkraft-i-boost-2-booster-seat';

  if britax_id is null or group_one_id is null or booster_id is null then
    raise exception 'One or more car-seat family products are missing';
  end if;

  update public.products
     set subcategory = 'Car Seats',
         subcategory_slug = 'car-seats'
   where id = britax_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one Britax product update, updated %', affected_rows; end if;

  update public.products
     set description = 'Peg Perego Group 1 forward-facing car seat for the stored 9-18 kg child-weight range, subject to the exact approval label, current manual, vehicle and installation check.',
         features = to_jsonb(array[
           'Group 1 car seat',
           'Adjustable Side Impact Protection',
           'Seven-position adjustable headrest',
           'Four recline positions',
           'Adjustable five-point harness'
         ]),
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats'
   where id = group_one_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one Group 1 product update, updated %', affected_rows; end if;

  update public.products
     set description = 'A belt-positioning booster for the stored 125-150 cm child-height range, subject to a vehicle, three-point-belt and installation check.',
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats'
   where id = booster_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one booster product update, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'A Britax Römer i-Size forward-facing car seat, supplied only after the child, physical approval label, vehicle and installation are checked.',
         detail_description = 'This Britax Römer seat is a forward-facing ISOFIX child car seat with a five-point harness. The physical unit''s approval label and current manual determine the permitted child range, approved vehicle seating position and installation. Before handover, we verify the exact model, approval label, condition, supplied parts and the vehicle details provided for the rental. The parent or driver must follow the current manual and check the installation before every journey.',
         includes_text = 'The exact seat, current manual and installation parts confirmed for the booking.',
         constraints_text = 'Available only after the physical approval label, child measurements, vehicle ISOFIX points, seating position, seat condition and installation method are checked.',
         delivery_setup_note = 'Before handover, we record the exact model and condition and check the child and vehicle details supplied for the booking.',
         care_note = 'Follow the supplied manual before every journey. Do not use the seat after a collision or if the shell, harness, labels or ISOFIX connectors are damaged.',
         seo_title = 'i-Size Car Seat Rental in Valencia',
         seo_description = 'Rent a forward-facing Britax Römer i-Size car seat in Valencia after checking child measurements, vehicle ISOFIX points and installation.',
         updated_at = now()
   where product_id = britax_id and locale = 'en';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one English Britax localization, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'Silla de coche Britax Römer i-Size orientada hacia delante, disponible tras comprobar al niño, la etiqueta física de homologación, el vehículo y la instalación.',
         detail_description = 'Esta silla Britax Römer es una silla infantil ISOFIX orientada hacia delante con arnés de cinco puntos. La etiqueta de homologación de la unidad física y el manual vigente determinan el rango infantil permitido, la plaza autorizada y la instalación. Antes de la entrega, verificamos el modelo exacto, la etiqueta, el estado, las piezas suministradas y los datos del vehículo indicados para el alquiler. El padre, la madre o el conductor debe seguir el manual y comprobar la instalación antes de cada trayecto.',
         includes_text = 'La silla exacta, el manual vigente y las piezas de instalación confirmadas en la reserva.',
         constraints_text = 'Disponible solo tras comprobar la etiqueta física de homologación, las medidas del niño, los puntos ISOFIX, la plaza, el estado y la instalación.',
         delivery_setup_note = 'Antes de la entrega, registramos el modelo y el estado exactos y comprobamos los datos del niño y del vehículo facilitados para la reserva.',
         care_note = 'Sigue el manual suministrado antes de cada trayecto. No utilices la silla después de un accidente ni si están dañados la carcasa, el arnés, las etiquetas o los conectores ISOFIX.',
         seo_title = 'Alquiler de Silla i-Size en Valencia',
         seo_description = 'Alquila una silla Britax Römer i-Size en Valencia tras comprobar las medidas del niño, los puntos ISOFIX del vehículo y la instalación.',
         updated_at = now()
   where product_id = britax_id and locale = 'es';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one Spanish Britax localization, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'Peg Perego Group 1 forward-facing car seat for the stored 9-18 kg child-weight range, subject to the exact label, vehicle and installation check.',
         detail_description = 'This Peg Perego Group 1 seat has an adjustable five-point harness, adjustable side-impact protection, a seven-position headrest and four recline positions. The catalogue records a 9-18 kg child-weight range. The physical approval label and current manual remain controlling for the child, vehicle seating position and installation, and must be checked before handover.',
         includes_text = 'The exact Group 1 seat and the installation parts and current instructions confirmed for the booking.',
         constraints_text = 'The catalogue records a 9-18 kg child-weight range. Final suitability depends on the physical approval label, child measurements, vehicle, seating position and current manual.',
         delivery_setup_note = 'Confirm the child, vehicle, approved seating position and installation against the physical label and supplied manual before use.',
         care_note = 'Follow the supplied manual before every journey. Stop using the seat and contact us if it has been in a collision or any shell, harness, label or connector is damaged.',
         seo_title = 'Group 1 Car Seat Rental in Valencia',
         seo_description = 'Rent a Peg Perego Group 1 car seat in Valencia for the stored 9-18 kg range, after checking the child, vehicle and installation.',
         updated_at = now()
   where product_id = group_one_id and locale = 'en';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one English Group 1 localization, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'Silla Peg Perego del grupo 1 orientada hacia delante para el rango de peso registrado de 9-18 kg, sujeta a la comprobación de etiqueta, vehículo e instalación.',
         detail_description = 'Esta silla Peg Perego del grupo 1 dispone de arnés ajustable de cinco puntos, protección lateral regulable, reposacabezas con siete posiciones y cuatro posiciones de reclinación. El catálogo registra un rango infantil de 9-18 kg. La etiqueta física de homologación y el manual vigente siguen determinando la idoneidad para el niño, la plaza del vehículo y la instalación, y deben comprobarse antes de la entrega.',
         includes_text = 'La silla exacta del grupo 1 y las piezas de instalación e instrucciones vigentes confirmadas en la reserva.',
         constraints_text = 'El catálogo registra un rango infantil de 9-18 kg. La idoneidad final depende de la etiqueta física, las medidas del niño, el vehículo, la plaza y el manual vigente.',
         delivery_setup_note = 'Comprueba el niño, el vehículo, la plaza autorizada y la instalación según la etiqueta física y el manual suministrado antes de utilizarla.',
         care_note = 'Sigue el manual antes de cada trayecto. Deja de usar la silla y contacta con nosotros si ha sufrido un accidente o presenta daños en la carcasa, el arnés, las etiquetas o los conectores.',
         seo_title = 'Alquiler de Silla Grupo 1 en Valencia',
         seo_description = 'Alquila una silla Peg Perego del grupo 1 en Valencia para el rango registrado de 9-18 kg, tras comprobar niño, vehículo e instalación.',
         updated_at = now()
   where product_id = group_one_id and locale = 'es';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one Spanish Group 1 localization, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'Kinderkraft belt-positioning booster for the stored 125-150 cm child-height range, subject to a vehicle, three-point-belt and installation check.',
         detail_description = 'The Kinderkraft I-BOOST 2 is a belt-positioning booster recorded for children measuring 125-150 cm. It uses the vehicle''s three-point seat belt and has integrated belt guides, armrests and a removable cover. The physical label and current instructions control suitability and use. Before handover, we check the child''s height, exact booster, vehicle seating position, available belt and installation.',
         includes_text = 'The exact booster and current instructions confirmed for the booking.',
         constraints_text = 'Only for a child within the stored 125-150 cm range and after checking the physical label, vehicle seat, three-point belt, booster condition and installation.',
         delivery_setup_note = 'Before handover, we confirm the child''s height, exact booster, vehicle seating position, three-point belt and installation.',
         care_note = 'Follow the supplied instructions for every journey. Do not use the booster after a collision or if the shell, belt guides, cover or labels are damaged.',
         seo_title = 'Child Booster Seat Rental in Valencia',
         seo_description = 'Rent a Kinderkraft belt-positioning booster in Valencia for the stored 125-150 cm range after checking the vehicle belt and installation.',
         updated_at = now()
   where product_id = booster_id and locale = 'en';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one English booster localization, updated %', affected_rows; end if;

  update public.product_localizations
     set short_description = 'Elevador Kinderkraft con posicionamiento de cinturón para el rango de altura registrado de 125-150 cm, sujeto a comprobar vehículo, cinturón e instalación.',
         detail_description = 'El Kinderkraft I-BOOST 2 es un elevador con posicionamiento de cinturón registrado para niños de 125-150 cm. Utiliza el cinturón de tres puntos del vehículo y dispone de guías integradas, reposabrazos y funda extraíble. La etiqueta física y las instrucciones vigentes determinan la idoneidad y el uso. Antes de la entrega, comprobamos la altura del niño, el elevador exacto, la plaza, el cinturón disponible y la instalación.',
         includes_text = 'El elevador exacto y las instrucciones vigentes confirmadas en la reserva.',
         constraints_text = 'Solo para un niño dentro del rango registrado de 125-150 cm y tras comprobar la etiqueta física, el asiento, el cinturón de tres puntos, el estado y la instalación.',
         delivery_setup_note = 'Antes de la entrega, confirmamos la altura del niño, el elevador exacto, la plaza, el cinturón de tres puntos y la instalación.',
         care_note = 'Sigue las instrucciones suministradas en cada trayecto. No utilices el elevador después de un accidente ni si están dañados la carcasa, las guías, la funda o las etiquetas.',
         seo_title = 'Alquiler de Elevador Infantil en Valencia',
         seo_description = 'Alquila un elevador Kinderkraft en Valencia para el rango registrado de 125-150 cm tras comprobar el cinturón y la instalación.',
         updated_at = now()
   where product_id = booster_id and locale = 'es';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one Spanish booster localization, updated %', affected_rows; end if;

  delete from public.product_faqs
   where product_id = any(array[britax_id, group_one_id, booster_id]::uuid[])
     and locale in ('en', 'es');

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  values
    (britax_id, 'en', 'Is this seat suitable for every child?', 'No. The physical approval label and current manual determine the permitted child range. We check those details against the child before handover.', 0),
    (britax_id, 'en', 'Does this i-Size seat fit every vehicle?', 'No. The vehicle ISOFIX points, approved seating position and exact seat instructions must be checked before rental.', 1),
    (britax_id, 'en', 'What do you check before handover?', 'We verify the exact model, physical approval label, condition, supplied parts and the child and vehicle details provided for the booking.', 2),
    (britax_id, 'es', '¿Esta silla es adecuada para cualquier niño?', 'No. La etiqueta física de homologación y el manual vigente determinan el rango infantil permitido. Los comprobamos con los datos del niño antes de la entrega.', 0),
    (britax_id, 'es', '¿Esta silla i-Size sirve para cualquier vehículo?', 'No. Hay que comprobar los puntos ISOFIX, la plaza autorizada y las instrucciones de la silla exacta antes del alquiler.', 1),
    (britax_id, 'es', '¿Qué comprobáis antes de la entrega?', 'Verificamos el modelo exacto, la etiqueta física, el estado, las piezas suministradas y los datos del niño y del vehículo indicados en la reserva.', 2),
    (group_one_id, 'en', 'What child range is recorded for this seat?', 'The catalogue records a 9-18 kg child-weight range. The physical approval label and current manual must still be checked before use.', 0),
    (group_one_id, 'en', 'Does this seat fit every vehicle?', 'No. The vehicle, approved seating position and installation must match the physical seat label and current manual.', 1),
    (group_one_id, 'en', 'What information is needed before booking?', 'Share the child''s current height and weight and the vehicle make, model, year, seating position and available anchorage.', 2),
    (group_one_id, 'es', '¿Qué rango infantil figura para esta silla?', 'El catálogo registra un rango de peso de 9-18 kg. También hay que comprobar la etiqueta física y el manual vigente antes de utilizarla.', 0),
    (group_one_id, 'es', '¿Esta silla sirve para cualquier vehículo?', 'No. El vehículo, la plaza autorizada y la instalación deben coincidir con la etiqueta física y el manual vigente.', 1),
    (group_one_id, 'es', '¿Qué información necesitáis antes de reservar?', 'Indica la altura y el peso actuales del niño y la marca, modelo, año, plaza y anclajes disponibles del vehículo.', 2),
    (booster_id, 'en', 'Which children is this booster recorded for?', 'The stored range is 125-150 cm. We check the child''s current height and the physical label before handover.', 0),
    (booster_id, 'en', 'How is this booster installed?', 'It uses the vehicle''s three-point seat belt. The driver must follow the supplied instructions and verify the belt position before every journey.', 1),
    (booster_id, 'en', 'Does this booster fit every car?', 'No. The vehicle seat, three-point belt, physical booster and installation instructions must all be checked.', 2),
    (booster_id, 'es', '¿Para qué niños está registrado este elevador?', 'El rango guardado es de 125-150 cm. Comprobamos la altura actual del niño y la etiqueta física antes de la entrega.', 0),
    (booster_id, 'es', '¿Cómo se instala este elevador?', 'Utiliza el cinturón de tres puntos del vehículo. El conductor debe seguir las instrucciones y comprobar la posición del cinturón antes de cada trayecto.', 1),
    (booster_id, 'es', '¿Este elevador sirve para cualquier coche?', 'No. Hay que comprobar el asiento, el cinturón de tres puntos, el elevador físico y las instrucciones de instalación.', 2);

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization on localization.product_id = product.id
     where product.id = any(array[britax_id, group_one_id, booster_id]::uuid[])
       and (
         coalesce(product.description, '') ~* 'maximum safety|fits every|airport or any'
         or coalesce(localization.short_description, '') ~* 'maximum safety|within t125|A 2 belt'
         or coalesce(localization.detail_description, '') ~* 'maximum safety|vehicle\?s|child\?s|125\?150'
         or coalesce(localization.seo_description, '') ~* '360°|from 6 years|airport|airbnb|any point|book now'
       )
  ) then
    raise exception 'Car-seat owner still contains a stale, contradictory or unsupported claim';
  end if;
end
$$;
