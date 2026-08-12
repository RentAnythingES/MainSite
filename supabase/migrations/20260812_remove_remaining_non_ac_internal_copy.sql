-- Remove the remaining non-AC internal workflow prose from active customer pages.
-- Product URLs, pricing, stock, images and category memberships remain unchanged.

do $$
declare
  affected_rows integer;
  deleted_faqs integer;
begin
  update public.products
     set specs = specs - 'Import review',
         updated_at = now()
   where slug in ('baby-playpen', 'bed-rail-for-kids', 'video-baby-monitor')
     and is_active = true
     and specs ->> 'Import review' = 'Confirm product details, physical stock, pricing, and media-use approval before activation.';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then
    raise exception 'Expected to remove three Import review specifications, updated %', affected_rows;
  end if;

  update public.products
     set name = '50N+ Buoyancy Aid - Choose Your Size',
         description = '50N+ buoyancy aid for kayaking, paddleboarding and dinghy use, available in weight-banded sizes from 25 kg.',
         features = '["50N+ buoyancy aid","25–40, 40–60, 60–80 and over 80 kg sizes","Front closure and adjustment","For kayaking, paddleboarding and dinghy use","High-visibility blue and orange design"]'::jsonb,
         specs = specs - 'Variant status',
         updated_at = now()
   where slug = 'buoyancy-aid-size-dependent'
     and is_active = true;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one active size-dependent buoyancy aid, updated %', affected_rows;
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
        '2-in-1-steamer-blender', 'en',
        'Philips Avent steamer blender for steaming and blending baby food in the same jar.',
        'The Philips Avent SCF870/20 steams and blends baby food in the same jar: steam the ingredients, then lift and turn the jar to blend without transferring the food. It holds 800 ml of solids or 450 ml of liquids, has a 200 ml water tank and uses a lid-and-bowl safety lock.',
        'Philips Avent SCF870/20 steamer blender. The measuring cup and spatula are included when listed in your booking confirmation.',
        'Use with a compatible electrical outlet and follow the operating instructions. Wash the food-contact parts after use.',
        'We confirm the supplied accessories with your booking and show how to lock and turn the jar.',
        'Wash the jar, lid and accessories after use and return every supplied part.',
        'Steamer and Blender Rental Valencia | Philips Avent',
        'Rent a Philips Avent steamer blender in Valencia to steam and blend baby food in one jar. Check availability and supplied accessories for your dates.'
      ),
      (
        '2-in-1-steamer-blender', 'es',
        'Batidora-vaporera Philips Avent para cocer y triturar comida de bebé en el mismo recipiente.',
        'La Philips Avent SCF870/20 cuece al vapor y tritura comida de bebé en el mismo recipiente: cuece los ingredientes y después levanta y gira el vaso para triturarlos sin cambiar de recipiente. Admite 800 ml de sólidos o 450 ml de líquidos, tiene un depósito de agua de 200 ml y utiliza un cierre de seguridad de tapa y vaso.',
        'Batidora-vaporera Philips Avent SCF870/20. El vaso medidor y la espátula se incluyen cuando figuran en la confirmación de la reserva.',
        'Utilízala con una toma eléctrica compatible y sigue las instrucciones. Lava las piezas en contacto con alimentos después de usarla.',
        'Confirmamos los accesorios incluidos con la reserva y mostramos cómo bloquear y girar el vaso.',
        'Lava el vaso, la tapa y los accesorios después de usarlos y devuelve todas las piezas suministradas.',
        'Alquiler Batidora-Vaporera Philips Avent Valencia',
        'Alquila una batidora-vaporera Philips Avent en Valencia para cocer y triturar comida de bebé en un mismo recipiente. Consulta disponibilidad.'
      ),
      (
        'baby-bottle-washer', 'en',
        'Baby Brezza Bottle Washer Pro for washing, steam-sterilising and drying compatible bottles and feeding accessories.',
        'The Baby Brezza Bottle Washer Pro washes, steam-sterilises and dries compatible bottles, pump parts, sippy cups and feeding accessories. It uses 20 high-pressure spray jets, removable clean and dirty water tanks, HEPA-filtered drying and six cleaning modes. It holds up to four bottles plus compatible parts.',
        'Baby Brezza Bottle Washer Pro with its removable clean-water and dirty-water tanks. Supplied racks and consumables are listed in your booking confirmation.',
        'Use only compatible bottles and accessories with the manufacturer-specified detergent tablets. Do not overload the racks.',
        'We confirm the supplied racks and detergent tablets with your booking and show how to fill and empty the water tanks.',
        'Empty both tanks after use and return the appliance clean with every supplied rack and accessory.',
        'Baby Bottle Washer Rental Valencia | Baby Brezza',
        'Rent a Baby Brezza bottle washer in Valencia to wash, steam-sterilise and dry compatible bottles and accessories. Check availability for your dates.'
      ),
      (
        'baby-bottle-washer', 'es',
        'Baby Brezza Bottle Washer Pro para lavar, esterilizar al vapor y secar biberones y accesorios compatibles.',
        'El Baby Brezza Bottle Washer Pro lava, esteriliza al vapor y seca biberones, piezas de sacaleches, vasos con boquilla y accesorios compatibles. Utiliza 20 chorros a alta presión, depósitos extraíbles de agua limpia y sucia, secado con filtro HEPA y seis modos de limpieza. Admite hasta cuatro biberones más piezas compatibles.',
        'Baby Brezza Bottle Washer Pro con depósitos extraíbles de agua limpia y sucia. Las rejillas y consumibles incluidos figuran en la confirmación de la reserva.',
        'Utiliza solo biberones y accesorios compatibles con las pastillas de detergente indicadas por el fabricante. No sobrecargues las rejillas.',
        'Confirmamos las rejillas y pastillas de detergente incluidas con la reserva y mostramos cómo llenar y vaciar los depósitos.',
        'Vacía ambos depósitos después de usarlo y devuelve el aparato limpio con todas las rejillas y accesorios suministrados.',
        'Alquiler Lavabiberones Baby Brezza Valencia',
        'Alquila un lavabiberones Baby Brezza en Valencia para lavar, esterilizar al vapor y secar biberones y accesorios compatibles. Consulta disponibilidad.'
      ),
      (
        'walking-treadmill', 'en',
        'Compact powered walking treadmill with a 40 × 120 cm belt, 6 km/h maximum speed and 5% manual incline.',
        'The Clover Fitness Smart A5 is a compact treadmill for indoor walking during a longer Valencia stay. It has a 40 × 120 cm walking surface, a maximum speed of 6 km/h and manual incline up to 5%. Its LCD displays workout information, the remote controls operation and transport wheels help reposition the folded unit. The documented maximum user weight is 102 kg.',
        'Clover Fitness Smart A5 walking treadmill, remote control and power connection.',
        'Indoor home use on a stable, level floor. Maximum user weight is 102 kg and maximum speed is 6 km/h. A compatible electrical outlet and clear operating space are required.',
        'Tell us about stairs, lifts, door widths and the intended room so delivery and placement can be confirmed.',
        'Use indoors, keep the belt area clear and return the remote control with the treadmill.',
        'Walking Treadmill Rental Valencia | Smart A5',
        'Rent a compact walking treadmill in Valencia with a 40 × 120 cm belt, 6 km/h maximum speed, manual incline and local delivery or pickup.'
      ),
      (
        'walking-treadmill', 'es',
        'Cinta andadora eléctrica compacta con superficie de 40 × 120 cm, velocidad máxima de 6 km/h e inclinación manual del 5 %.',
        'La Clover Fitness Smart A5 es una cinta compacta para caminar en interior durante una estancia prolongada en Valencia. Tiene una superficie de 40 × 120 cm, velocidad máxima de 6 km/h e inclinación manual de hasta el 5 %. La pantalla LCD muestra los datos del ejercicio, el mando controla el funcionamiento y las ruedas facilitan moverla plegada. El peso máximo de usuario indicado es de 102 kg.',
        'Cinta andadora Clover Fitness Smart A5, mando a distancia y conexión eléctrica.',
        'Uso doméstico interior sobre un suelo estable y nivelado. Peso máximo de usuario de 102 kg y velocidad máxima de 6 km/h. Requiere una toma compatible y espacio libre alrededor.',
        'Indícanos si hay escaleras, ascensor, puertas estrechas y en qué habitación se utilizará para confirmar la entrega y colocación.',
        'Utilízala en interior, mantén despejada la zona de la banda y devuelve el mando con la cinta.',
        'Alquiler Cinta Andadora Valencia | Smart A5',
        'Alquila una cinta andadora compacta en Valencia con superficie de 40 × 120 cm, velocidad de 6 km/h, inclinación manual y entrega o recogida local.'
      ),
      (
        'buoyancy-aid-size-dependent', 'en',
        '50N+ buoyancy aid for kayaking, paddleboarding and dinghy use, available in weight-banded sizes from 25 kg.',
        'Choose this Itiwit 50N+ buoyancy aid by the user''s current weight: 25–40 kg, 40–60 kg, 60–80 kg or over 80 kg. It has a front closure and adjustable fit for kayaking, stand-up paddleboarding and dinghy use. Tell us the user''s weight and intended activity when booking so we can confirm the appropriate size.',
        'One Itiwit 50N+ buoyancy aid in the confirmed weight size.',
        'Choose by current weight and check that the aid fits securely. It is a 50N+ buoyancy aid, not a lifejacket. Follow the product label and activity limits.',
        'Tell us the user''s weight and intended activity before delivery. We confirm the size and show how to adjust the closure.',
        'Rinse with fresh water after use and allow the buoyancy aid to air-dry before returning it.',
        '50N+ Buoyancy Aid Rental Valencia | Choose Your Size',
        'Rent a 50N+ buoyancy aid in Valencia for kayaking, paddleboarding or dinghy use. Sizes available from 25 kg; tell us the user''s weight.'
      ),
      (
        'buoyancy-aid-size-dependent', 'es',
        'Ayuda a la flotabilidad 50N+ para kayak, paddle surf y vela ligera, disponible en tallas por peso desde 25 kg.',
        'Elige esta ayuda a la flotabilidad Itiwit 50N+ según el peso actual del usuario: 25–40 kg, 40–60 kg, 60–80 kg o más de 80 kg. Tiene cierre frontal y ajuste regulable para kayak, paddle surf y vela ligera. Indícanos el peso y la actividad prevista al reservar para confirmar la talla adecuada.',
        'Una ayuda a la flotabilidad Itiwit 50N+ en la talla de peso confirmada.',
        'Elige según el peso actual y comprueba que quede bien ajustada. Es una ayuda a la flotabilidad 50N+, no un chaleco salvavidas. Respeta la etiqueta y los límites de actividad.',
        'Indícanos el peso del usuario y la actividad prevista antes de la entrega. Confirmamos la talla y mostramos cómo ajustar el cierre.',
        'Aclárala con agua dulce después de usarla y déjala secar al aire antes de devolverla.',
        'Alquiler Ayuda Flotabilidad 50N+ Valencia | Tallas',
        'Alquila una ayuda a la flotabilidad 50N+ en Valencia para kayak, paddle surf o vela ligera. Tallas desde 25 kg; indícanos el peso del usuario.'
      )
    ) as content(
      slug, locale, short_description, detail_description, includes_text,
      constraints_text, delivery_setup_note, care_note, seo_title, seo_description
    )
    join public.products product on product.slug = content.slug
   where localization.product_id = product.id
     and localization.locale = content.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 8 then
    raise exception 'Expected to update eight non-AC localizations, updated %', affected_rows;
  end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id = product.id
     and product.slug in (
       '2-in-1-steamer-blender',
       'baby-bottle-washer',
       'walking-treadmill',
       'buoyancy-aid-size-dependent'
     )
     and faq.locale in ('en', 'es');

  get diagnostics deleted_faqs = row_count;
  if deleted_faqs <> 18 then
    raise exception 'Expected to replace eighteen non-AC FAQs, deleted %', deleted_faqs;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('2-in-1-steamer-blender','en','What can the steamer blender do?','It steams and blends baby food in the same jar. It can also be used to steam or blend separately when used as instructed.',0),
      ('2-in-1-steamer-blender','en','What is included?','The rental includes the Philips Avent SCF870/20. The measuring cup and spatula are included when listed in your booking confirmation.',1),
      ('2-in-1-steamer-blender','en','How much does the jar hold?','It holds up to 800 ml of solids or 450 ml of liquids, with a 200 ml water tank.',2),
      ('2-in-1-steamer-blender','es','¿Qué puede hacer la batidora-vaporera?','Cuece al vapor y tritura comida de bebé en el mismo recipiente. También puede utilizarse solo para cocer o triturar siguiendo las instrucciones.',0),
      ('2-in-1-steamer-blender','es','¿Qué incluye el alquiler?','El alquiler incluye la Philips Avent SCF870/20. El vaso medidor y la espátula se incluyen cuando figuran en la confirmación de la reserva.',1),
      ('2-in-1-steamer-blender','es','¿Qué capacidad tiene el vaso?','Admite hasta 800 ml de sólidos o 450 ml de líquidos y tiene un depósito de agua de 200 ml.',2),
      ('baby-bottle-washer','en','What can the Bottle Washer Pro clean?','It can clean compatible baby bottles, pump parts, sippy cups and feeding accessories. It holds up to four bottles plus compatible parts.',0),
      ('baby-bottle-washer','en','Are detergent tablets included?','The machine uses manufacturer-specified detergent tablets. The supplied quantity is listed in your booking confirmation.',1),
      ('baby-bottle-washer','en','Which cleaning modes are available?','It offers wash/sterilise/dry, wash/dry, sterilise/dry, wash-only, sterilise-only and dry-only modes.',2),
      ('baby-bottle-washer','es','¿Qué puede limpiar el Bottle Washer Pro?','Puede limpiar biberones, piezas de sacaleches, vasos con boquilla y accesorios compatibles. Admite hasta cuatro biberones más piezas.',0),
      ('baby-bottle-washer','es','¿Se incluyen las pastillas de detergente?','La máquina utiliza las pastillas indicadas por el fabricante. La cantidad incluida figura en la confirmación de la reserva.',1),
      ('baby-bottle-washer','es','¿Qué modos de limpieza ofrece?','Ofrece lavado/esterilización/secado, lavado/secado, esterilización/secado, solo lavado, solo esterilización y solo secado.',2),
      ('walking-treadmill','en','What is the maximum speed?','The Smart A5 has a maximum speed of 6 km/h.',0),
      ('walking-treadmill','en','What is the maximum user weight?','The documented maximum user weight is 102 kg.',1),
      ('walking-treadmill','en','Can it be placed in my accommodation?','Tell us about stairs, lifts, door widths, the floor and the intended room so delivery and placement can be confirmed.',2),
      ('walking-treadmill','es','¿Cuál es la velocidad máxima?','La Smart A5 tiene una velocidad máxima de 6 km/h.',0),
      ('walking-treadmill','es','¿Cuál es el peso máximo de usuario?','El peso máximo de usuario indicado es de 102 kg.',1),
      ('walking-treadmill','es','¿Se puede colocar en mi alojamiento?','Indícanos si hay escaleras, ascensor, puertas estrechas, el tipo de suelo y la habitación prevista para confirmar la entrega y colocación.',2),
      ('buoyancy-aid-size-dependent','en','Which size should I choose?','Choose by current weight: 25–40 kg, 40–60 kg, 60–80 kg or over 80 kg. Tell us the user''s weight when booking.',0),
      ('buoyancy-aid-size-dependent','en','Which activities is it for?','It is designed for kayaking, stand-up paddleboarding and dinghy use within the product label and activity limits.',1),
      ('buoyancy-aid-size-dependent','en','Is it a lifejacket?','No. This product is listed as a 50N+ buoyancy aid rather than a lifejacket.',2),
      ('buoyancy-aid-size-dependent','es','¿Qué talla debo elegir?','Elige según el peso actual: 25–40 kg, 40–60 kg, 60–80 kg o más de 80 kg. Indícanos el peso del usuario al reservar.',0),
      ('buoyancy-aid-size-dependent','es','¿Para qué actividades sirve?','Está diseñada para kayak, paddle surf y vela ligera dentro de los límites indicados en la etiqueta.',1),
      ('buoyancy-aid-size-dependent','es','¿Es un chaleco salvavidas?','No. Este producto está clasificado como ayuda a la flotabilidad 50N+, no como chaleco salvavidas.',2)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 24 then
    raise exception 'Expected to insert twenty-four non-AC FAQs, inserted %', affected_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_localizations localization on localization.product_id = product.id
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in (
       '2-in-1-steamer-blender', 'baby-bottle-washer', 'baby-playpen',
       'bed-rail-for-kids', 'buoyancy-aid-size-dependent',
       'video-baby-monitor', 'walking-treadmill'
     )
       and lower(concat_ws(' ',
         product.description, product.features::text, product.specs::text,
         localization.short_description, localization.detail_description,
         localization.includes_text, localization.constraints_text,
         localization.delivery_setup_note, localization.care_note,
         localization.seo_title, localization.seo_description,
         faq.question, faq.answer
       )) similar to '%(before activation|antes de la activación|rentanything must|rentanything debe|submitted url|url proporcionada|import review|physical stock|media-use approval|marketplace variant|variante exacta del marketplace|another clover page|otra página.*clover)%'
  ) then
    raise exception 'Internal workflow or source-dispute copy remains in the non-AC repair set';
  end if;
end
$$;
