-- Replace internal handover checklists with direct customer copy for four cleaning products.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = case slug
           when 'carpet-upholstery-cleaner' then 'A compact Kärcher SE 3 spray-extraction cleaner for deep-cleaning carpets, sofas and car seats during a Valencia stay.'
           when 'cordless-vacuum-cleaner' then 'A Shark PowerPro cordless vacuum for carpets and hard floors, with up to 50 minutes of runtime and a flexible tube for cleaning under furniture.'
           when 'karcher-k3-pressure-washer' then 'A Kärcher K 3 pressure washer for patios, outdoor furniture, bicycles and small vehicles, with up to 120 bar pressure.'
           when 'wet-dry-vacuum' then 'A Kärcher WD 3 wet and dry vacuum with a 17 L stainless-steel container for wet, dry, fine and coarse dirt.'
         end,
         specs = case slug
           when 'karcher-k3-pressure-washer' then jsonb_build_object(
             'model', 'K 3', 'voltage', '220-240 V', 'flow_rate', '380 L/h',
             'accessories', 'Water filter, detergent tank, Vario Power spray lance, turbo nozzle',
             'hose_length', '6 m', 'rated_power', '1600 W', 'max_pressure', '120 bar',
             'area_performance', 'Up to 25 m²/h'
           )
           when 'wet-dry-vacuum' then jsonb_build_object(
             'model', 'WD 3 S V-17/4/20', 'filter', 'One-piece cartridge filter',
             'voltage', '220-240 V', 'container', '17 L stainless steel',
             'hose_length', '2 m', 'rated_power', '1000 W', 'cable_length', '4 m',
             'cleaning_modes', 'Wet and dry', 'blower_function', 'Yes'
           )
           else specs
         end,
         updated_at = now()
   where slug in (
     'carpet-upholstery-cleaner', 'cordless-vacuum-cleaner',
     'karcher-k3-pressure-washer', 'wet-dry-vacuum'
   );

  get diagnostics affected_rows = row_count;
  if affected_rows <> 4 then
    raise exception 'Expected to update four cleaning products, updated %', affected_rows;
  end if;

  with copy(slug, locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('carpet-upholstery-cleaner', 'en',
     'Compact Kärcher cleaner for deep-cleaning carpets, sofas and car seats.',
     'The Kärcher SE 3 Compact sprays cleaning solution into textile fibres and extracts the dirty water. Its 500 W motor, separate 1.7 L clean-water and 2.9 L dirty-water tanks, flexible hose and narrow nozzles make it useful for carpets, sofas, upholstered chairs and car seats.',
     'The rental includes the cleaner, 1.9 m spray-extraction hose, upholstery nozzle and crevice nozzle.',
     'Test colourfastness on a hidden area first and allow the surface to dry fully. Do not use on leather, silk, electrical furniture or fabrics that cannot be wet-cleaned.',
     'Delivery and collection options for your Valencia address are shown with your booking.',
     'Empty and rinse both tanks after use, then leave them open to dry.',
     'Kärcher Carpet Cleaner Rental in Valencia',
     'Rent a Kärcher SE 3 Compact carpet and upholstery cleaner in Valencia for sofas, carpets and car seats, with two tanks and narrow cleaning nozzles.'),
    ('carpet-upholstery-cleaner', 'es',
     'Limpiadora Kärcher compacta para alfombras, sofás y asientos de coche.',
     'La Kärcher SE 3 Compact pulveriza la solución de limpieza entre las fibras y extrae el agua sucia. Su motor de 500 W, los depósitos separados de 1,7 L para agua limpia y 2,9 L para agua sucia, la manguera flexible y las boquillas estrechas resultan útiles para alfombras, sofás, sillas tapizadas y asientos de coche.',
     'El alquiler incluye la limpiadora, la manguera de pulverización y aspiración de 1,9 m, la boquilla para tapicería y la boquilla para rincones.',
     'Prueba primero la solidez del color en una zona oculta y deja que la superficie se seque por completo. No la uses en cuero, seda, muebles eléctricos ni tejidos que no admitan limpieza húmeda.',
     'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
     'Vacía y aclara los dos depósitos después de usarla y déjalos abiertos para que se sequen.',
     'Alquiler de limpiadora Kärcher en Valencia',
     'Alquila una Kärcher SE 3 Compact en Valencia para limpiar sofás, alfombras y asientos de coche, con dos depósitos y boquillas estrechas.'),
    ('cordless-vacuum-cleaner', 'en',
     'Shark PowerPro cordless vacuum for carpets, hard floors and furniture.',
     'The Shark PowerPro IZ380EU adjusts its brush speed for carpets and hard floors, helps remove hair from the brush roll and bends to reach under furniture. It converts into a handheld vacuum, has a 0.28 L dust cup and offers up to 50 minutes of runtime in Eco mode.',
     'The rental includes the vacuum, battery, charger, crevice tool, upholstery tool and accessory bag.',
     'Runtime varies by power mode, floor and attachment. This is a dry vacuum and must not be used for liquids, hot ash or hazardous debris.',
     'Delivery and collection options for your Valencia address are shown with your booking.',
     'Empty the dust cup after use and keep the filter and brush roll free of heavy debris.',
     'Cordless Vacuum Cleaner Rental in Valencia',
     'Rent a Shark PowerPro cordless vacuum in Valencia for carpets, hard floors and furniture, with up to 50 minutes of runtime and handheld mode.'),
    ('cordless-vacuum-cleaner', 'es',
     'Aspiradora inalámbrica Shark PowerPro para alfombras, suelos duros y muebles.',
     'La Shark PowerPro IZ380EU ajusta la velocidad del cepillo para alfombras y suelos duros, ayuda a retirar el pelo del rodillo y se dobla para llegar debajo de los muebles. Se convierte en aspiradora de mano, tiene un depósito de 0,28 L y ofrece hasta 50 minutos de autonomía en modo Eco.',
     'El alquiler incluye la aspiradora, la batería, el cargador, la boquilla estrecha, la boquilla para tapicería y la bolsa de accesorios.',
     'La autonomía varía según el modo, el suelo y el accesorio. Es una aspiradora en seco y no debe utilizarse para líquidos, cenizas calientes ni residuos peligrosos.',
     'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
     'Vacía el depósito después de usarla y mantén el filtro y el rodillo libres de residuos acumulados.',
     'Alquiler de aspiradora inalámbrica en Valencia',
     'Alquila una Shark PowerPro inalámbrica en Valencia para alfombras, suelos duros y muebles, con hasta 50 minutos de autonomía y modo de mano.'),
    ('karcher-k3-pressure-washer', 'en',
     'Kärcher K 3 pressure washer with up to 120 bar for outdoor cleaning.',
     'The Kärcher K 3 delivers up to 120 bar and 380 L/h for patios, outdoor furniture, bicycles, garden tools and small vehicles. The 6 m high-pressure hose, adjustable Vario Power lance and turbo nozzle let you match the spray to light dirt or more stubborn outdoor cleaning.',
     'The rental includes the K 3, trigger gun, 6 m high-pressure hose, Vario Power lance, turbo nozzle and garden-hose adapter.',
     'You need permission to clean the property, an outdoor water supply, suitable drainage and a 220-240 V power point. Start at low pressure and test a small area before cleaning paintwork or delicate surfaces.',
     'Delivery and collection options for your Valencia address are shown with your booking.',
     'Disconnect the power and water before changing attachments, and drain the hose after use.',
     'Kärcher K 3 Pressure Washer Rental Valencia',
     'Rent a Kärcher K 3 pressure washer in Valencia for patios, outdoor furniture, bicycles and small vehicles, with up to 120 bar and a 6 m hose.'),
    ('karcher-k3-pressure-washer', 'es',
     'Hidrolimpiadora Kärcher K 3 de hasta 120 bar para limpieza exterior.',
     'La Kärcher K 3 ofrece hasta 120 bar y 380 L/h para patios, muebles de exterior, bicicletas, herramientas de jardín y vehículos pequeños. La manguera de alta presión de 6 m, la lanza Vario Power regulable y la boquilla turbo permiten adaptar el chorro a suciedad ligera o más resistente.',
     'El alquiler incluye la K 3, la pistola, la manguera de alta presión de 6 m, la lanza Vario Power, la boquilla turbo y el adaptador para manguera de jardín.',
     'Necesitas permiso para limpiar la propiedad, una toma de agua exterior, un drenaje adecuado y una toma eléctrica de 220-240 V. Empieza con poca presión y prueba una zona pequeña antes de limpiar pintura o superficies delicadas.',
     'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
     'Desconecta la electricidad y el agua antes de cambiar accesorios y vacía la manguera después de usarla.',
     'Alquiler de hidrolimpiadora Kärcher K 3 Valencia',
     'Alquila una Kärcher K 3 en Valencia para patios, muebles de exterior, bicicletas y vehículos pequeños, con hasta 120 bar y manguera de 6 m.'),
    ('wet-dry-vacuum', 'en',
     'Kärcher WD 3 wet and dry vacuum with a 17 L stainless-steel container.',
     'The Kärcher WD 3 S V-17/4/20 handles wet, dry, fine and coarse dirt with a 1,000 W motor and 17 L stainless-steel container. Its one-piece cartridge filter supports wet and dry cleaning without a filter change, and the blower helps clear dirt from hard-to-reach areas.',
     'The rental includes the vacuum, 2 m suction hose, floor nozzle, crevice nozzle and cartridge filter.',
     'Do not vacuum hot ash, flammable liquids, chemicals or hazardous dust. Empty the container promptly after collecting liquids.',
     'Delivery and collection options for your Valencia address are shown with your booking.',
     'Empty and wipe the container after use and allow the hose and container to dry after collecting liquids.',
     'Kärcher Wet and Dry Vacuum Rental Valencia',
     'Rent a Kärcher WD 3 wet and dry vacuum in Valencia with a 17 L stainless-steel container, cartridge filter and blower function.'),
    ('wet-dry-vacuum', 'es',
     'Aspiradora Kärcher WD 3 en seco y húmedo con depósito de acero de 17 L.',
     'La Kärcher WD 3 S V-17/4/20 aspira suciedad húmeda, seca, fina y gruesa con un motor de 1.000 W y depósito de acero inoxidable de 17 L. Su filtro de cartucho de una pieza permite alternar entre limpieza húmeda y seca sin cambiar el filtro, y la función de soplado ayuda en zonas de difícil acceso.',
     'El alquiler incluye la aspiradora, la manguera de 2 m, la boquilla para suelos, la boquilla para rincones y el filtro de cartucho.',
     'No aspires cenizas calientes, líquidos inflamables, productos químicos ni polvo peligroso. Vacía el depósito poco después de recoger líquidos.',
     'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
     'Vacía y limpia el depósito después de usarla y deja secar la manguera y el depósito tras recoger líquidos.',
     'Alquiler de aspiradora Kärcher en seco y húmedo',
     'Alquila una Kärcher WD 3 en seco y húmedo en Valencia, con depósito de acero de 17 L, filtro de cartucho y función de soplado.')
  )
  update public.product_localizations localization
     set short_description = copy.short_description,
         detail_description = copy.detail_description,
         includes_text = copy.includes_text,
         constraints_text = copy.constraints_text,
         delivery_setup_note = copy.delivery_setup_note,
         care_note = copy.care_note,
         seo_title = copy.seo_title,
         seo_description = copy.seo_description,
         updated_at = now()
    from public.products product, copy
   where localization.product_id = product.id
     and product.slug = copy.slug
     and localization.locale = copy.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 8 then
    raise exception 'Expected to update eight cleaning-product localizations, updated %', affected_rows;
  end if;

  with faq_copy(slug, sort_order, question, answer) as (
    values
    ('carpet-upholstery-cleaner', 0, 'What can I clean with it?', 'It is designed for wet-cleaning carpets, sofas, upholstered chairs and car seats. Test a hidden area first and check that the material can be wet-cleaned.'),
    ('carpet-upholstery-cleaner', 1, 'Does it leave the fabric dry?', 'It extracts the dirty water, but textiles remain damp and need ventilation and time to dry fully.'),
    ('carpet-upholstery-cleaner', 2, 'Which tools are included?', 'The rental includes the 1.9 m spray-extraction hose, upholstery nozzle and narrow crevice nozzle.'),
    ('cordless-vacuum-cleaner', 0, 'How long does the battery last?', 'Shark states up to 50 minutes in Eco mode. Runtime is shorter at higher power or with some attachments.'),
    ('cordless-vacuum-cleaner', 1, 'Can it clean both carpets and hard floors?', 'Yes. FloorDetect adjusts the brush speed for carpets and hard floors, while Anti Hair Wrap helps remove hair from the brush roll.'),
    ('cordless-vacuum-cleaner', 2, 'Can it be used as a handheld vacuum?', 'Yes. The handheld unit detaches for furniture and smaller areas, with crevice and upholstery tools included.'),
    ('karcher-k3-pressure-washer', 0, 'What can I clean with the K 3?', 'It is suitable for patios, outdoor furniture, bicycles, garden tools and small vehicles. Use lower pressure on paintwork and delicate surfaces.'),
    ('karcher-k3-pressure-washer', 1, 'What connections do I need?', 'You need an outdoor water supply, suitable drainage and a 220-240 V power point within safe reach.'),
    ('karcher-k3-pressure-washer', 2, 'Which attachments are included?', 'The rental includes the trigger gun, 6 m high-pressure hose, Vario Power lance, turbo nozzle and garden-hose adapter.'),
    ('wet-dry-vacuum', 0, 'Can it vacuum liquids?', 'Yes. The one-piece cartridge filter supports wet and dry cleaning without changing the filter. Empty the container promptly after collecting liquids.'),
    ('wet-dry-vacuum', 1, 'What kinds of dirt can it handle?', 'It is designed for wet, dry, fine and coarse dirt. Do not use it for hot ash, flammable liquids, chemicals or hazardous dust.'),
    ('wet-dry-vacuum', 2, 'Does it have a blower function?', 'Yes. The blower can help move loose dirt from corners and other areas that are difficult to reach with the nozzle.')
  )
  update public.product_faqs faq
     set question = faq_copy.question,
         answer = faq_copy.answer
    from public.products product, faq_copy
   where faq.product_id = product.id
     and product.slug = faq_copy.slug
     and faq.locale = 'en'
     and faq.sort_order = faq_copy.sort_order;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 12 then
    raise exception 'Expected to replace twelve English cleaning FAQs, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, 'es', faq.question, faq.answer, faq.sort_order
    from (
      values
      ('carpet-upholstery-cleaner', 0, '¿Qué puedo limpiar con ella?', 'Está diseñada para la limpieza húmeda de alfombras, sofás, sillas tapizadas y asientos de coche. Prueba primero una zona oculta y comprueba que el material admite limpieza húmeda.'),
      ('carpet-upholstery-cleaner', 1, '¿Deja el tejido seco?', 'Extrae el agua sucia, pero los tejidos quedan húmedos y necesitan ventilación y tiempo para secarse por completo.'),
      ('carpet-upholstery-cleaner', 2, '¿Qué accesorios incluye?', 'El alquiler incluye la manguera de pulverización y aspiración de 1,9 m, la boquilla para tapicería y la boquilla estrecha para rincones.'),
      ('cordless-vacuum-cleaner', 0, '¿Cuánto dura la batería?', 'Shark indica hasta 50 minutos en modo Eco. La autonomía es menor con más potencia o con algunos accesorios.'),
      ('cordless-vacuum-cleaner', 1, '¿Sirve para alfombras y suelos duros?', 'Sí. FloorDetect ajusta la velocidad del cepillo a alfombras y suelos duros, mientras que Anti Hair Wrap ayuda a retirar el pelo del rodillo.'),
      ('cordless-vacuum-cleaner', 2, '¿Se puede utilizar como aspiradora de mano?', 'Sí. La unidad de mano se separa para muebles y zonas pequeñas e incluye boquillas para rincones y tapicería.'),
      ('karcher-k3-pressure-washer', 0, '¿Qué puedo limpiar con la K 3?', 'Es adecuada para patios, muebles de exterior, bicicletas, herramientas de jardín y vehículos pequeños. Utiliza menos presión sobre pintura y superficies delicadas.'),
      ('karcher-k3-pressure-washer', 1, '¿Qué conexiones necesito?', 'Necesitas una toma de agua exterior, un drenaje adecuado y una toma eléctrica de 220-240 V a una distancia segura.'),
      ('karcher-k3-pressure-washer', 2, '¿Qué accesorios incluye?', 'El alquiler incluye la pistola, la manguera de alta presión de 6 m, la lanza Vario Power, la boquilla turbo y el adaptador para manguera de jardín.'),
      ('wet-dry-vacuum', 0, '¿Puede aspirar líquidos?', 'Sí. El filtro de cartucho de una pieza permite aspirar en seco y húmedo sin cambiar el filtro. Vacía el depósito poco después de recoger líquidos.'),
      ('wet-dry-vacuum', 1, '¿Qué tipos de suciedad puede aspirar?', 'Está diseñada para suciedad húmeda, seca, fina y gruesa. No la uses para cenizas calientes, líquidos inflamables, productos químicos ni polvo peligroso.'),
      ('wet-dry-vacuum', 2, '¿Tiene función de soplado?', 'Sí. La función de soplado ayuda a mover suciedad suelta de rincones y otras zonas difíciles de alcanzar con la boquilla.')
    ) as faq(slug, sort_order, question, answer)
    join public.products product on product.slug = faq.slug
   where not exists (
     select 1 from public.product_faqs existing
      where existing.product_id = product.id
        and existing.locale = 'es'
        and existing.sort_order = faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 12 then
    raise exception 'Expected to insert twelve Spanish cleaning FAQs, inserted %', inserted_rows;
  end if;

  if exists (
    select 1
      from public.products product
      join public.product_localizations localization on localization.product_id = product.id
     where product.slug in (
       'carpet-upholstery-cleaner', 'cordless-vacuum-cleaner',
       'karcher-k3-pressure-washer', 'wet-dry-vacuum'
     )
       and concat_ws(' ', product.description, localization.short_description, localization.detail_description)
           ~* 'staff must|before any rental|confirmed (at|before) handover|mandatory|charla de seguridad del personal|el personal debe'
  ) then
    raise exception 'Internal cleaning-product workflow copy remains';
  end if;
end
$$;
