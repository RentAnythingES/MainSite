-- Replace machine-generated customer copy on two active outdoor products.
-- Product identity, slugs, pricing, stock, images and category memberships remain unchanged.

do $$
declare
  beachminton_id uuid;
  family_kayak_id uuid;
  affected_rows integer;
begin
  select id into beachminton_id
    from public.products
   where slug = 'talbot-torro-beachminton-set';

  select id into family_kayak_id
    from public.products
   where slug = 'inflatable-family-kayak-2-3-people';

  if beachminton_id is null or family_kayak_id is null then
    raise exception 'Beachminton or family-kayak product is missing';
  end if;

  update public.products
     set description = 'Two-player beachminton set with two lightweight rackets, three shuttlecocks and a compact carry case. No court or net required.',
         updated_at = now()
   where id = beachminton_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one Beachminton product, updated %', affected_rows;
  end if;

  update public.products
     set description = 'Modular inflatable kayak for two or three people, with two paddles and a carry bag. A hand pump and correctly sized buoyancy aids can be selected separately.',
         updated_at = now()
   where id = family_kayak_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected to update one family-kayak product, updated %', affected_rows;
  end if;

  update public.product_localizations
     set short_description = 'Two-player beachminton set with two lightweight rackets, three shuttlecocks and a compact carry case. No court or net required.',
         detail_description = 'A simple racket game for two people that is easy to take to the beach, park or garden. Everything packs into the carry case, making it practical for Malvarrosa, Patacona, Turia Gardens or another suitable open space. Use the two Racer shuttlecocks for faster rallies or the Starter shuttlecock for a slower game.',
         includes_text = 'Two lightweight rackets, two Racer shuttlecocks, one Starter shuttlecock and a carry case.',
         constraints_text = 'Choose a clear open space away from other people and keep all three shuttlecocks together after use.',
         delivery_setup_note = 'Delivered or collected packed in its compact carry case.',
         care_note = 'Brush off sand, keep the rackets and shuttlecocks dry, and return the complete set in its case.',
         seo_title = 'Beachminton Set Rental in Valencia | Rent&Roll',
         seo_description = 'Rent a two-player beachminton set in Valencia with two rackets, three shuttlecocks and a carry case for easy beach, park or garden games.',
         updated_at = now()
   where product_id = beachminton_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English Beachminton localization, updated %', affected_rows;
  end if;

  update public.product_localizations
     set short_description = 'Set de beachminton para dos personas con dos raquetas ligeras, tres volantes y una funda compacta. No necesita pista ni red.',
         detail_description = 'Un juego de raqueta sencillo para dos personas que puedes llevar fácilmente a la playa, al parque o al jardín. Todo se guarda en la funda, por lo que resulta práctico para Malvarrosa, Patacona, el Jardín del Turia u otro espacio abierto adecuado. Utiliza los dos volantes Racer para peloteos más rápidos o el volante Starter para un juego más lento.',
         includes_text = 'Dos raquetas ligeras, dos volantes Racer, un volante Starter y una funda de transporte.',
         constraints_text = 'Elige un espacio abierto y despejado, alejado de otras personas, y guarda los tres volantes después de jugar.',
         delivery_setup_note = 'Se entrega o recoge guardado en su funda compacta.',
         care_note = 'Retira la arena, mantén secas las raquetas y los volantes y devuelve el set completo dentro de la funda.',
         seo_title = 'Alquiler de Set de Beachminton en Valencia | Rent&Roll',
         seo_description = 'Alquila un set de beachminton para dos en Valencia con dos raquetas, tres volantes y funda para jugar en la playa, el parque o el jardín.',
         updated_at = now()
   where product_id = beachminton_id
     and locale = 'es';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one Spanish Beachminton localization, updated %', affected_rows;
  end if;

  update public.product_localizations
     set short_description = 'Modular inflatable kayak for two or three people, with two paddles and a carry bag. Add a hand pump and correctly sized buoyancy aids separately.',
         detail_description = 'Plan a day on suitable water near Valencia with a kayak that packs into a carry bag and inflates in about ten minutes. It can be configured for two or three people and carries up to 245 kg in total. Two paddles are included; select a compatible hand pump and correctly sized buoyancy aids separately if needed for your booking.',
         includes_text = 'Inflatable family kayak, two paddles and a carry bag. A hand pump and buoyancy aids are included only when selected and confirmed separately.',
         constraints_text = 'Maximum combined load: 245 kg. Use only in suitable weather and water, with a correctly fitted buoyancy aid for every passenger. Children must stay with a supervising adult.',
         delivery_setup_note = 'The kayak is handed over packed in its carry bag. We explain inflation, seating and valve use before your rental.',
         care_note = 'Rinse after salt-water use, drain the kayak and return it clean and dry where possible. Keep it away from sharp surfaces.',
         seo_title = 'Family Kayak Rental in Valencia | Rent&Roll',
         seo_description = 'Rent an inflatable family kayak for two or three people near Valencia, with two paddles and a carry bag. Check dates and available add-ons.',
         updated_at = now()
   where product_id = family_kayak_id
     and locale = 'en';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one English family-kayak localization, updated %', affected_rows;
  end if;

  update public.product_localizations
     set short_description = 'Kayak hinchable modular para dos o tres personas, con dos remos y bolsa de transporte. Añade por separado una bomba y chalecos de la talla adecuada.',
         detail_description = 'Organiza un día en aguas adecuadas cerca de Valencia con un kayak que se guarda en una bolsa y se infla en unos diez minutos. Puede configurarse para dos o tres personas y admite hasta 245 kg en total. Incluye dos remos; añade por separado una bomba compatible y chalecos de la talla adecuada si los necesitas para la reserva.',
         includes_text = 'Kayak familiar hinchable, dos remos y bolsa de transporte. La bomba y los chalecos solo se incluyen si se seleccionan y confirman por separado.',
         constraints_text = 'Carga máxima combinada: 245 kg. Utilízalo únicamente con tiempo y agua adecuados, y con un chaleco bien ajustado para cada pasajero. Los menores deben permanecer con un adulto responsable.',
         delivery_setup_note = 'El kayak se entrega guardado en su bolsa. Antes del alquiler explicamos el inflado, la colocación de los asientos y el uso de las válvulas.',
         care_note = 'Acláralo después de usarlo en agua salada, vacíalo y devuélvelo limpio y seco cuando sea posible. Mantenlo alejado de superficies afiladas.',
         seo_title = 'Alquiler de Kayak Familiar en Valencia | Rent&Roll',
         seo_description = 'Alquila un kayak familiar hinchable para dos o tres personas cerca de Valencia, con dos remos y bolsa. Consulta fechas y complementos.',
         updated_at = now()
   where product_id = family_kayak_id
     and locale = 'es';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Expected one Spanish family-kayak localization, updated %', affected_rows;
  end if;

  delete from public.product_faqs
   where product_id = any(array[beachminton_id, family_kayak_id]::uuid[])
     and locale in ('en', 'es');

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  values
    (beachminton_id, 'en', 'What is included with the Beachminton set?', 'Two lightweight rackets, two Racer shuttlecocks, one Starter shuttlecock and a carry case.', 0),
    (beachminton_id, 'en', 'Do I need a net or marked court?', 'No. The set is designed for casual two-player games in a suitable open space without a net or permanent court.', 1),
    (beachminton_id, 'en', 'Where can I use it?', 'Choose a clear open space at the beach, in a park or in a garden, away from other people.', 2),
    (beachminton_id, 'es', '¿Qué incluye el set de Beachminton?', 'Dos raquetas ligeras, dos volantes Racer, un volante Starter y una funda de transporte.', 0),
    (beachminton_id, 'es', '¿Necesito una red o una pista marcada?', 'No. El set está pensado para partidas informales entre dos personas en un espacio abierto adecuado, sin red ni pista fija.', 1),
    (beachminton_id, 'es', '¿Dónde puedo utilizarlo?', 'Elige un espacio abierto y despejado en la playa, un parque o un jardín, alejado de otras personas.', 2),
    (family_kayak_id, 'en', 'What is included with the family kayak?', 'The rental includes the inflatable kayak, two paddles and a carry bag. A hand pump and correctly sized buoyancy aids are included only when selected and confirmed separately.', 0),
    (family_kayak_id, 'en', 'What is the maximum load?', 'The listed maximum combined load is 245 kg, including all passengers and equipment.', 1),
    (family_kayak_id, 'en', 'Can children use the kayak?', 'Yes, when they stay with a supervising adult, wear a correctly fitted buoyancy aid and use the kayak only in suitable weather and water.', 2),
    (family_kayak_id, 'es', '¿Qué incluye el kayak familiar?', 'El alquiler incluye el kayak hinchable, dos remos y una bolsa. La bomba y los chalecos de la talla adecuada solo se incluyen si se seleccionan y confirman por separado.', 0),
    (family_kayak_id, 'es', '¿Cuál es la carga máxima?', 'La carga máxima combinada indicada es de 245 kg, incluidos todos los pasajeros y el equipamiento.', 1),
    (family_kayak_id, 'es', '¿Pueden utilizar el kayak los niños?', 'Sí, cuando permanezcan con un adulto responsable, lleven un chaleco bien ajustado y utilicen el kayak únicamente con tiempo y agua adecuados.', 2);

  if exists (
    select 1
      from public.product_localizations
     where product_id = any(array[beachminton_id, family_kayak_id]::uuid[])
       and (
         detail_description ~* 'physical condition|physical label|before activation|documented capacity|weather and load limits'
         or delivery_setup_note ~* 'physical condition|compatibility checks'
       )
  ) then
    raise exception 'Internal review language remains in the repaired customer copy';
  end if;

  if (
    select count(*)
      from public.product_faqs
     where product_id = any(array[beachminton_id, family_kayak_id]::uuid[])
       and locale in ('en', 'es')
  ) <> 12 then
    raise exception 'Expected twelve bilingual FAQs across the repaired products';
  end if;
end
$$;
