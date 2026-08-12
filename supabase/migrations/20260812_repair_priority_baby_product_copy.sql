-- Repair six fact-complete baby/family product pages and add bilingual FAQs.
-- Identity, slugs, pricing, stock, images and category memberships remain unchanged.

do $$
declare
  affected_rows integer;
begin
  update public.products product
     set description = content.description,
         updated_at = now()
    from (values
      ('baby-bed-60x120', 'Solid-beech baby cot with a 60 x 120 cm sleeping area and two mattress-base heights. The mattress and linen package are confirmed with the booking.'),
      ('bedside-crib', 'Chicco Next2Me Magic Evo bedside crib for newborns, with 11 height settings, a 3D mesh mattress, foldable feet and braked wheels.'),
      ('stroller-all-terrain', 'Bebeconfort Cloudy all-terrain stroller with air-filled wheels, lie-flat recline and an adjustable handlebar for suitable paved and uneven routes.'),
      ('travel-cot', 'Foldable Kinderkraft travel cot with two mattress levels, mesh sides, a side entrance, supplied mattress and carry bag.'),
      ('bed-rail-for-kids', 'Adjustable 180 cm bed rail for one side of a compatible framed bed. It secures beneath the mattress and raises or lowers vertically.'),
      ('video-baby-monitor', 'Video baby monitor with a 3.2-inch parent display, night vision, two-way audio, temperature monitoring and a rechargeable monitor.')
    ) as content(slug, description)
   where product.slug = content.slug
     and product.is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then
    raise exception 'Expected to update six active product descriptions, updated %', affected_rows;
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
        'baby-bed-60x120', 'en',
        'Solid-beech baby cot with a 60 x 120 cm sleeping area and two mattress-base heights. The mattress and linen package are confirmed with the booking.',
        'This full-size baby cot gives families a familiar sleep setup during a Valencia stay. Its solid-beech frame has a 60 x 120 cm sleeping area, an open slatted base and two mattress-base heights. The cot measures 124 x 66 x 80 cm and has a listed maximum load of 20 kg. The mattress, fitted sheet and any additional bedding are confirmed in your booking so you know exactly what will arrive.',
        'One solid-beech 60 x 120 cm cot. A mattress, fitted sheet and other bedding are included only when listed in the booking.',
        'Use a correctly fitting 60 x 120 cm cot mattress. Move the base to its lower position when the child can sit up independently. Maximum listed load: 20 kg.',
        'We confirm the mattress and linen package before arranging delivery or collection.',
        'Use the supplied setup as instructed and return the cot, mattress and linen package clean and dry.',
        'Baby Cot Rental in Valencia | 60 x 120 cm',
        'Rent a solid-beech 60 x 120 cm baby cot in Valencia, with two base heights and the exact mattress and linen package confirmed for your stay.'
      ),
      (
        'baby-bed-60x120', 'es',
        'Cuna de madera maciza con superficie de descanso de 60 x 120 cm y dos alturas para la base. El colchón y la ropa de cama se confirman en la reserva.',
        'Esta cuna de tamaño completo permite preparar un espacio de descanso familiar durante una estancia en Valencia. La estructura de haya maciza tiene una superficie de 60 x 120 cm, base de lamas y dos alturas para el colchón. La cuna mide 124 x 66 x 80 cm y admite una carga máxima indicada de 20 kg. El colchón, la sábana bajera y cualquier otra ropa de cama se confirman en la reserva para que sepas exactamente qué recibirás.',
        'Una cuna de haya maciza de 60 x 120 cm. El colchón, la sábana bajera y otra ropa de cama solo se incluyen cuando aparecen en la reserva.',
        'Utiliza un colchón de cuna de 60 x 120 cm que encaje correctamente. Baja la base cuando el niño pueda sentarse sin ayuda. Carga máxima indicada: 20 kg.',
        'Confirmamos el colchón y la ropa de cama antes de organizar la entrega o recogida.',
        'Utiliza el montaje suministrado según las indicaciones y devuelve la cuna, el colchón y la ropa de cama limpios y secos.',
        'Alquiler de Cuna de Bebé en Valencia | 60 x 120 cm',
        'Alquila una cuna de madera de 60 x 120 cm en Valencia, con dos alturas y el colchón y la ropa de cama confirmados para tu estancia.'
      ),
      (
        'bedside-crib', 'en',
        'Chicco Next2Me Magic Evo bedside crib for newborns, with 11 height settings, a 3D mesh mattress, foldable feet and braked wheels.',
        'Keep your newborn close during a Valencia stay with the Chicco Next2Me Magic Evo. The bedside crib has 11 height settings, a supplied 3D mesh mattress, foldable feet and wheels with brakes. Chicco lists it for newborns up to approximately six months or 9 kg. Because the crib sits beside an adult bed, compatibility depends on the bed frame and height; share those details before your booking so the setup can be confirmed.',
        'Chicco Next2Me Magic Evo bedside crib with its supplied 3D mesh mattress and the attachment parts confirmed for the booking.',
        'Listed for newborns up to approximately six months or 9 kg. Use only with a compatible adult bed and the supplied mattress; do not add another mattress or soft padding.',
        'At handover we confirm the bed setup and demonstrate the side mechanism, height adjustment, attachment and wheel brakes.',
        'Keep the mattress and mesh dry, do not alter the attachment and return all supplied parts together.',
        'Chicco Bedside Crib Rental in Valencia',
        'Rent a Chicco Next2Me Magic Evo bedside crib in Valencia with 11 height settings and a supplied mesh mattress. Confirm bed compatibility for your stay.'
      ),
      (
        'bedside-crib', 'es',
        'Cuna colecho Chicco Next2Me Magic Evo para recién nacidos, con 11 alturas, colchón de malla 3D, patas plegables y ruedas con freno.',
        'Mantén a tu recién nacido cerca durante una estancia en Valencia con la Chicco Next2Me Magic Evo. La cuna colecho tiene 11 alturas, colchón de malla 3D, patas plegables y ruedas con freno. Chicco la indica para recién nacidos hasta aproximadamente seis meses o 9 kg. Como se coloca junto a una cama de adulto, la compatibilidad depende de la estructura y la altura; comparte esos datos antes de reservar para confirmar el montaje.',
        'Cuna colecho Chicco Next2Me Magic Evo con su colchón de malla 3D y las piezas de sujeción confirmadas para la reserva.',
        'Indicada para recién nacidos hasta aproximadamente seis meses o 9 kg. Utilízala solo con una cama de adulto compatible y con el colchón suministrado; no añadas otro colchón ni acolchado blando.',
        'En la entrega confirmamos el montaje junto a la cama y mostramos el mecanismo lateral, el ajuste de altura, la sujeción y los frenos.',
        'Mantén secos el colchón y la malla, no modifiques la sujeción y devuelve juntas todas las piezas suministradas.',
        'Alquiler de Cuna Colecho Chicco en Valencia',
        'Alquila una cuna colecho Chicco Next2Me Magic Evo en Valencia con 11 alturas y colchón de malla. Confirma la compatibilidad con tu cama.'
      ),
      (
        'stroller-all-terrain', 'en',
        'Bebeconfort Cloudy all-terrain stroller with air-filled wheels, lie-flat recline and an adjustable handlebar for suitable paved and uneven routes.',
        'The Bebeconfort Cloudy is a three-wheel all-terrain stroller for children from birth up to 22 kg. Air-filled wheels help on suitable uneven paths, while the adjustable handlebar, large basket and lie-flat recline make it practical for longer family days around Valencia. It is an all-terrain stroller, not a running or skating stroller.',
        'Bebeconfort Cloudy stroller with sun canopy, shopping basket, bumper bar, three wheels and the accessories listed in the booking.',
        'Maximum child weight: 22 kg. Use the harness, apply the brake when stationary and do not use the stroller for running, skating, stairs or beach sand.',
        'At handover we demonstrate folding, brakes, harness adjustment, recline and basic wheel checks.',
        'Return it free from food and heavy sand. Wipe the frame with a damp cloth and do not hang heavy bags from the handlebar.',
        'All-Terrain Stroller Rental in Valencia',
        'Rent a Bebeconfort Cloudy all-terrain stroller in Valencia with air-filled wheels, lie-flat recline and a 22 kg child limit. Check dates and access.'
      ),
      (
        'stroller-all-terrain', 'es',
        'Silla de paseo todoterreno Bebeconfort Cloudy con ruedas neumáticas, reclinación plana y manillar ajustable para rutas adecuadas.',
        'La Bebeconfort Cloudy es una silla de paseo todoterreno de tres ruedas para niños desde el nacimiento hasta 22 kg. Las ruedas neumáticas ayudan en caminos irregulares adecuados, mientras que el manillar ajustable, la cesta amplia y la reclinación plana resultan prácticos para pasar el día en familia por Valencia. Es una silla todoterreno, no una silla para correr o patinar.',
        'Silla Bebeconfort Cloudy con capota, cesta, barra protectora, tres ruedas y los accesorios indicados en la reserva.',
        'Peso máximo del niño: 22 kg. Utiliza el arnés, activa el freno cuando esté parada y no la uses para correr, patinar, subir escaleras ni circular por arena de playa.',
        'En la entrega mostramos el plegado, los frenos, el ajuste del arnés, la reclinación y la comprobación básica de las ruedas.',
        'Devuélvela sin restos de comida ni arena en exceso. Limpia el chasis con un paño húmedo y no cuelgues bolsas pesadas del manillar.',
        'Alquiler de Silla Todoterreno en Valencia',
        'Alquila una Bebeconfort Cloudy todoterreno en Valencia con ruedas neumáticas, reclinación plana y límite de 22 kg. Consulta fechas y accesos.'
      ),
      (
        'travel-cot', 'en',
        'Foldable Kinderkraft travel cot with two mattress levels, mesh sides, a side entrance, supplied mattress and carry bag.',
        'Set up a temporary sleep space without bringing a cot from home. This Kinderkraft travel cot folds into its carry bag and opens without tools. It has mesh sides for airflow and visibility, two mattress levels and a zipped side entrance. The cot weighs 6.8 kg and includes its matching mattress and carry bag.',
        'Kinderkraft travel cot, matching mattress and carry bag.',
        'Listed for children from birth up to three years. Fully open and lock the frame before use, use only the supplied mattress and keep the side entrance secured during sleep.',
        'The cot arrives in its carry bag. At handover we demonstrate opening, locking, changing the mattress level and folding it again.',
        'Return the cot and mattress clean and dry. Keep the mesh and locking mechanism free from damage.',
        'Travel Cot Rental in Valencia | Kinderkraft',
        'Rent a foldable Kinderkraft travel cot in Valencia with two mattress levels, mesh sides, supplied mattress and carry bag.'
      ),
      (
        'travel-cot', 'es',
        'Cuna de viaje Kinderkraft plegable con dos alturas, laterales de malla, entrada lateral, colchón y bolsa de transporte.',
        'Prepara un espacio de descanso temporal sin traer una cuna desde casa. Esta cuna de viaje Kinderkraft se guarda en su bolsa y se abre sin herramientas. Tiene laterales de malla para facilitar la ventilación y la visibilidad, dos alturas para el colchón y una entrada lateral con cremallera. Pesa 6,8 kg e incluye su colchón y bolsa de transporte.',
        'Cuna de viaje Kinderkraft, colchón correspondiente y bolsa de transporte.',
        'Indicada desde el nacimiento hasta los tres años. Abre y bloquea completamente la estructura antes de usarla, utiliza solo el colchón suministrado y mantén cerrada la entrada lateral durante el sueño.',
        'La cuna se entrega dentro de su bolsa. Mostramos cómo abrirla, bloquearla, cambiar la altura del colchón y volver a plegarla.',
        'Devuelve la cuna y el colchón limpios y secos. Evita dañar la malla y el mecanismo de bloqueo.',
        'Alquiler de Cuna de Viaje Kinderkraft en Valencia',
        'Alquila una cuna de viaje Kinderkraft plegable en Valencia con dos alturas, laterales de malla, colchón y bolsa de transporte.'
      ),
      (
        'bed-rail-for-kids', 'en',
        'Adjustable 180 cm bed rail for one side of a compatible framed bed. It secures beneath the mattress and raises or lowers vertically.',
        'Add a barrier to one side of a temporary bed during your family stay. The rail is 180 cm long, adjusts up to 76 cm high and lifts vertically so the bed remains accessible. It must be screwed securely to a compatible bed frame beneath the mattress, so it is not suitable for platform beds or frames that cannot accept the fixing.',
        'One adjustable 180 cm bed rail for one side of the bed.',
        'Requires a compatible framed bed and a secure screw fixing beneath the mattress. Not suitable for platform beds or frames that cannot accept the fixing.',
        'Share the bed-frame type and mattress thickness before handover. We demonstrate the fixing and vertical lift mechanism.',
        'Wipe clean, keep the lift mechanism clear and do not loosen or modify the fixing during the rental.',
        'Children''s Bed Rail Rental in Valencia | 180 cm',
        'Rent an adjustable 180 cm children''s bed rail in Valencia for one side of a compatible framed bed. Check the bed type before booking.'
      ),
      (
        'bed-rail-for-kids', 'es',
        'Barrera de cama ajustable de 180 cm para un lado de una cama con estructura compatible. Se fija bajo el colchón y sube o baja verticalmente.',
        'Añade una barrera a un lado de una cama temporal durante una estancia familiar. Mide 180 cm de largo, se ajusta hasta 76 cm de alto y se eleva verticalmente para facilitar el acceso. Debe atornillarse de forma segura a una estructura de cama compatible bajo el colchón, por lo que no es adecuada para camas de plataforma ni estructuras que no admitan la fijación.',
        'Una barrera ajustable de 180 cm para un lado de la cama.',
        'Requiere una cama con estructura compatible y una fijación atornillada bajo el colchón. No es adecuada para camas de plataforma ni estructuras que no admitan la fijación.',
        'Comparte el tipo de estructura y el grosor del colchón antes de la entrega. Mostramos la fijación y el mecanismo de elevación vertical.',
        'Límpiala con un paño, mantén libre el mecanismo y no aflojes ni modifiques la fijación durante el alquiler.',
        'Alquiler de Barrera de Cama Infantil en Valencia',
        'Alquila una barrera de cama infantil ajustable de 180 cm en Valencia para un lado de una cama compatible. Confirma el tipo de cama.'
      ),
      (
        'video-baby-monitor', 'en',
        'Video baby monitor with a 3.2-inch parent display, night vision, two-way audio, temperature monitoring and a rechargeable monitor.',
        'Check on your baby from another room without relying on the accommodation television or phone. The set pairs one camera with a 3.2-inch parent display and provides night vision, two-way audio, room-temperature monitoring and sound-activated ECO mode. The parent display has a rechargeable battery; the camera needs mains power. The stated range is up to 300 metres in a clear, unobstructed space, while walls and wireless interference reduce the indoor range.',
        'One camera, one 3.2-inch parent monitor and two power adapters.',
        'The camera must stay connected to mains power. Indoor range varies with walls and wireless interference. Keep the camera and power cable away from the cot and out of the child''s reach.',
        'At handover we demonstrate pairing, charging, night vision, two-way audio and temperature display.',
        'Keep both units dry, do not cover the camera or monitor and return both power adapters.',
        'Video Baby Monitor Rental in Valencia',
        'Rent a video baby monitor in Valencia with a 3.2-inch display, night vision, two-way audio, temperature monitoring and two power adapters.'
      ),
      (
        'video-baby-monitor', 'es',
        'Vigilabebés con cámara, pantalla de 3,2 pulgadas, visión nocturna, audio bidireccional, temperatura y monitor recargable.',
        'Supervisa a tu bebé desde otra habitación sin depender del televisor ni del teléfono del alojamiento. El conjunto conecta una cámara con un monitor de 3,2 pulgadas e incluye visión nocturna, audio bidireccional, control de la temperatura y modo ECO activado por sonido. El monitor tiene batería recargable; la cámara necesita estar enchufada. El alcance indicado llega hasta 300 metros en un espacio abierto y sin obstáculos, mientras que las paredes y las interferencias reducen el alcance interior.',
        'Una cámara, un monitor de 3,2 pulgadas y dos adaptadores de corriente.',
        'La cámara debe permanecer conectada a la corriente. El alcance interior varía según las paredes y las interferencias. Mantén la cámara y el cable alejados de la cuna y fuera del alcance del menor.',
        'En la entrega mostramos el emparejamiento, la carga, la visión nocturna, el audio bidireccional y la temperatura.',
        'Mantén secas ambas unidades, no cubras la cámara ni el monitor y devuelve los dos adaptadores.',
        'Alquiler de Vigilabebés con Cámara en Valencia',
        'Alquila un vigilabebés con cámara en Valencia con pantalla de 3,2 pulgadas, visión nocturna, audio bidireccional y control de temperatura.'
      )
    ) as content(
      slug, locale, short_description, detail_description, includes_text,
      constraints_text, delivery_setup_note, care_note, seo_title, seo_description
    )
    join public.products product on product.slug = content.slug
   where localization.product_id = product.id
     and localization.locale = content.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 12 then
    raise exception 'Expected to update twelve product localizations, updated %', affected_rows;
  end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id = product.id
     and product.slug in (
       'baby-bed-60x120', 'bedside-crib', 'stroller-all-terrain',
       'travel-cot', 'bed-rail-for-kids', 'video-baby-monitor'
     )
     and faq.locale in ('en', 'es');

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('baby-bed-60x120', 'en', 'Does the cot include a mattress and bedding?', 'The cot is included. A mattress, fitted sheet and other bedding are supplied only when they appear in your booking summary.', 0),
      ('baby-bed-60x120', 'en', 'What size is the cot?', 'The sleeping area is 60 x 120 cm. The complete cot measures 124 x 66 x 80 cm.', 1),
      ('baby-bed-60x120', 'en', 'When should the mattress base be lowered?', 'Move the base to its lower position when the child can sit up independently. The listed maximum load is 20 kg.', 2),
      ('baby-bed-60x120', 'es', '¿La cuna incluye colchón y ropa de cama?', 'La cuna está incluida. El colchón, la sábana bajera y otra ropa de cama solo se suministran cuando aparecen en el resumen de la reserva.', 0),
      ('baby-bed-60x120', 'es', '¿Qué tamaño tiene la cuna?', 'La superficie de descanso mide 60 x 120 cm. La cuna completa mide 124 x 66 x 80 cm.', 1),
      ('baby-bed-60x120', 'es', '¿Cuándo debe bajarse la base?', 'Baja la base cuando el niño pueda sentarse sin ayuda. La carga máxima indicada es de 20 kg.', 2),

      ('bedside-crib', 'en', 'Who is the bedside crib suitable for?', 'Chicco lists the Next2Me Magic Evo for newborns up to approximately six months or 9 kg.', 0),
      ('bedside-crib', 'en', 'Will it fit any adult bed?', 'No. It has 11 height settings and foldable feet, but compatibility still depends on the adult bed frame and height. Share those details before booking.', 1),
      ('bedside-crib', 'en', 'Does it include a mattress?', 'Yes. The rental includes the supplied 3D mesh mattress. Do not add another mattress or soft padding.', 2),
      ('bedside-crib', 'es', '¿Para quién es adecuada la cuna colecho?', 'Chicco indica la Next2Me Magic Evo para recién nacidos hasta aproximadamente seis meses o 9 kg.', 0),
      ('bedside-crib', 'es', '¿Es compatible con cualquier cama de adulto?', 'No. Tiene 11 alturas y patas plegables, pero la compatibilidad depende de la estructura y la altura de la cama. Comparte esos datos antes de reservar.', 1),
      ('bedside-crib', 'es', '¿Incluye colchón?', 'Sí. El alquiler incluye el colchón de malla 3D suministrado. No añadas otro colchón ni acolchado blando.', 2),

      ('stroller-all-terrain', 'en', 'Can I use this stroller for running or skating?', 'No. It is an all-terrain stroller for suitable paths, but it is not offered for running or skating.', 0),
      ('stroller-all-terrain', 'en', 'What age and weight is it suitable for?', 'The listed range is from birth to approximately four years, with a maximum child weight of 22 kg.', 1),
      ('stroller-all-terrain', 'en', 'Can it handle uneven routes around Valencia?', 'Its air-filled wheels help on suitable uneven paths. Do not use it on stairs or beach sand, and check your planned route and accommodation access.', 2),
      ('stroller-all-terrain', 'es', '¿Puedo usar esta silla para correr o patinar?', 'No. Es una silla todoterreno para caminos adecuados, pero no está indicada para correr ni patinar.', 0),
      ('stroller-all-terrain', 'es', '¿Para qué edad y peso es adecuada?', 'El rango indicado va desde el nacimiento hasta aproximadamente cuatro años, con un peso máximo de 22 kg.', 1),
      ('stroller-all-terrain', 'es', '¿Sirve para caminos irregulares de Valencia?', 'Sus ruedas neumáticas ayudan en caminos irregulares adecuados. No la uses en escaleras ni arena de playa y comprueba la ruta y los accesos del alojamiento.', 2),

      ('travel-cot', 'en', 'Does the travel cot include a mattress?', 'Yes. The rental includes the matching mattress and carry bag.', 0),
      ('travel-cot', 'en', 'What age is it suitable for?', 'The listed range is from birth up to three years. Use the supplied mattress and follow the setup instructions.', 1),
      ('travel-cot', 'en', 'Do I need tools to assemble it?', 'No. It opens and folds without tools. We demonstrate how to fully open and lock the frame at handover.', 2),
      ('travel-cot', 'es', '¿La cuna de viaje incluye colchón?', 'Sí. El alquiler incluye el colchón correspondiente y la bolsa de transporte.', 0),
      ('travel-cot', 'es', '¿Para qué edad es adecuada?', 'El rango indicado va desde el nacimiento hasta los tres años. Utiliza el colchón suministrado y sigue las instrucciones de montaje.', 1),
      ('travel-cot', 'es', '¿Necesito herramientas para montarla?', 'No. Se abre y se pliega sin herramientas. En la entrega mostramos cómo abrir y bloquear completamente la estructura.', 2),

      ('bed-rail-for-kids', 'en', 'Does one rental cover the full bed?', 'No. One rental provides one 180 cm rail for one side of the bed. Book an additional unit only if another compatible side also needs a rail.', 0),
      ('bed-rail-for-kids', 'en', 'How does the rail attach?', 'It must be screwed securely to a compatible bed frame beneath the mattress. It is not suitable for platform beds or frames that cannot accept the fixing.', 1),
      ('bed-rail-for-kids', 'en', 'How tall is the rail?', 'The rail adjusts up to 76 cm high and raises or lowers vertically for bed access.', 2),
      ('bed-rail-for-kids', 'es', '¿Una unidad cubre toda la cama?', 'No. Una unidad incluye una barrera de 180 cm para un lado. Reserva otra solo si otro lado compatible también necesita barrera.', 0),
      ('bed-rail-for-kids', 'es', '¿Cómo se fija la barrera?', 'Debe atornillarse de forma segura a una estructura compatible bajo el colchón. No es adecuada para camas de plataforma ni estructuras que no admitan la fijación.', 1),
      ('bed-rail-for-kids', 'es', '¿Qué altura tiene?', 'La barrera se ajusta hasta 76 cm de alto y sube o baja verticalmente para facilitar el acceso a la cama.', 2),

      ('video-baby-monitor', 'en', 'What is included with the baby monitor?', 'One camera, one 3.2-inch parent monitor and two power adapters.', 0),
      ('video-baby-monitor', 'en', 'Do both units work on battery?', 'No. The parent monitor has a rechargeable battery, while the camera must remain connected to mains power.', 1),
      ('video-baby-monitor', 'en', 'Does it work at night and how far is the range?', 'It has infrared night vision. The stated range is up to 300 metres in an open unobstructed space; walls and wireless interference reduce indoor range.', 2),
      ('video-baby-monitor', 'es', '¿Qué incluye el vigilabebés?', 'Una cámara, un monitor de 3,2 pulgadas y dos adaptadores de corriente.', 0),
      ('video-baby-monitor', 'es', '¿Funcionan ambas unidades con batería?', 'No. El monitor tiene batería recargable, mientras que la cámara debe permanecer conectada a la corriente.', 1),
      ('video-baby-monitor', 'es', '¿Funciona de noche y qué alcance tiene?', 'Tiene visión nocturna por infrarrojos. El alcance indicado llega hasta 300 metros en un espacio abierto; las paredes y las interferencias reducen el alcance interior.', 2)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 36 then
    raise exception 'Expected to insert thirty-six bilingual FAQs, inserted %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      join public.product_localizations localization on localization.product_id = product.id
     where product.slug in (
       'baby-bed-60x120', 'bedside-crib', 'stroller-all-terrain',
       'travel-cot', 'bed-rail-for-kids', 'video-baby-monitor'
     )
       and (
         localization.detail_description ~* 'before activation|physical-unit|physical unit|imported draft|RentAnything must|must verify|not available until'
         or localization.seo_description ~* '#1 Platform|only with a verified|Rent bassinets'
       )
  ) then
    raise exception 'Internal workflow or retired promotional language remains in the repaired copy';
  end if;
end
$$;
