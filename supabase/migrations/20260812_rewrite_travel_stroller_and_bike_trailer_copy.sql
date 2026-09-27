-- Replace internal/process-heavy stroller copy with customer-facing, evidenced facts.
-- The unsupported Hamax "Pioneer" model name is removed without guessing a replacement model.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = case slug
           when 'stroller-and-bike-trailer-for-2' then 'A two-seat Hamax bike trailer that converts into a stroller, giving families one setup for cycling and walking around Valencia.'
           when 'stroller-travel-compact' then 'A lightweight CYBEX Coya travel stroller with a one-hand fold and integrated carry strap for taxis, trains and family days around Valencia.'
         end,
         features = case slug
           when 'stroller-and-bike-trailer-for-2' then '["Seating for up to two children", "Converts between bike-trailer and stroller modes", "Maximum child weight of 22 kg per seat", "Adjustable handle and five-point harnesses"]'::jsonb
           when 'stroller-travel-compact' then '["Compact one-hand fold with integrated carry strap", "Near-flat recline and integrated leg rest", "One-pull harness adjustment", "Travel-system ready with compatible CYBEX infant car seats"]'::jsonb
         end,
         specs = case slug
           when 'stroller-and-bike-trailer-for-2' then jsonb_build_object(
             'Seats', 'Up to two children',
             'Maximum load', '40 kg',
             'Minimum child age', 'Able to sit independently for cycling',
             'Maximum child weight', '22 kg per child',
             'Recommended maximum speed', '24 km/h'
           )
           when 'stroller-travel-compact' then jsonb_build_object(
             'Product weight', '6.6 kg',
             'Open dimensions', '79 x 44 x 105 cm',
             'Folded dimensions', '53.5 x 45 x 22 cm',
             'Age range', 'From birth to approximately 4 years',
             'Maximum child weight', '22 kg'
           )
         end,
         updated_at = now()
   where (slug = 'stroller-and-bike-trailer-for-2' and brand = 'Hamax')
      or (slug = 'stroller-travel-compact' and brand = 'CYBEX');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to update two stroller products, updated %', affected_rows;
  end if;

  update public.product_localizations localization
     set short_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'A two-seat Hamax bike trailer that converts into a stroller for cycling and walking around Valencia.'
           when 'stroller-travel-compact' then 'A lightweight CYBEX Coya travel stroller with a one-hand fold and integrated carry strap.'
         end,
         detail_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Use the Hamax as a two-child bike trailer for family rides or switch to the stroller wheel for walks. It seats up to two children, with a maximum of 22 kg per child, and has an adjustable handle, five-point harnesses and storage behind the seats.'
           when 'stroller-travel-compact' then 'The CYBEX Coya weighs 6.6 kg and folds to 53.5 x 45 x 22 cm, making it easier to carry between your accommodation, taxis and trains. It is suitable from birth to approximately four years, up to 22 kg, with a near-flat recline, integrated leg rest and one-pull harness.'
         end,
         includes_text = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'The rental includes the Hamax trailer, bicycle arm and stroller wheel.'
           when 'stroller-travel-compact' then 'The rental includes the CYBEX Coya stroller with its shopping basket, sun canopy and integrated carry strap.'
         end,
         constraints_text = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'For cycling, each child must be able to sit upright independently and weigh no more than 22 kg. The towing bicycle needs a compatible rear axle and hitch.'
           when 'stroller-travel-compact' then 'The stroller folds to 53.5 x 45 x 22 cm. Airline cabin-baggage rules vary, so confirm the allowance directly with your airline.'
         end,
         delivery_setup_note = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Tell us which bicycle you plan to use so we can confirm the rear-axle and hitch compatibility before delivery.'
           when 'stroller-travel-compact' then 'Delivery and collection options for your Valencia address are shown with your booking.'
         end,
         care_note = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Use the harnesses for every trip and return the trailer clean and dry.'
           when 'stroller-travel-compact' then 'Return the stroller clean and dry. The fabric covers can be machine washed at 30°C according to CYBEX guidance.'
         end,
         seo_title = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Two-Seat Bike Trailer & Stroller Rental Valencia'
           when 'stroller-travel-compact' then 'CYBEX Coya Travel Stroller Rental in Valencia'
         end,
         seo_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Rent a two-seat Hamax bike trailer and stroller in Valencia for family rides and walks, with the bicycle arm and stroller wheel included.'
           when 'stroller-travel-compact' then 'Rent a 6.6 kg CYBEX Coya travel stroller in Valencia with a one-hand fold, near-flat recline and integrated carry strap.'
         end,
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and localization.locale = 'en'
     and product.slug in ('stroller-and-bike-trailer-for-2', 'stroller-travel-compact');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to update two English stroller localizations, updated %', affected_rows;
  end if;

  update public.product_localizations localization
     set short_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Remolque Hamax para dos niños que se convierte en silla de paseo para rutas en bici y caminando por Valencia.'
           when 'stroller-travel-compact' then 'Silla de paseo de viaje CYBEX Coya de 6,6 kg, con plegado a una mano y correa de transporte integrada.'
         end,
         detail_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Utiliza el Hamax como remolque de bicicleta para dos niños en rutas familiares o cambia a la rueda delantera para pasear. Admite hasta dos niños, con un máximo de 22 kg por niño, e incorpora manillar ajustable, arneses de cinco puntos y espacio de carga detrás de los asientos.'
           when 'stroller-travel-compact' then 'La CYBEX Coya pesa 6,6 kg y plegada mide 53,5 x 45 x 22 cm, por lo que resulta fácil de transportar entre el alojamiento, taxis y trenes. Es adecuada desde el nacimiento hasta aproximadamente cuatro años o 22 kg, con reclinación casi plana, reposapiés integrado y arnés de un solo tirón.'
         end,
         includes_text = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'El alquiler incluye el remolque Hamax, el brazo para bicicleta y la rueda de paseo.'
           when 'stroller-travel-compact' then 'El alquiler incluye la silla CYBEX Coya con cesta, capota y correa de transporte integrada.'
         end,
         constraints_text = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Para circular en bicicleta, cada niño debe poder sentarse erguido sin ayuda y pesar como máximo 22 kg. La bicicleta necesita un eje trasero y un enganche compatibles.'
           when 'stroller-travel-compact' then 'Plegada mide 53,5 x 45 x 22 cm. Las normas de equipaje de cabina varían, así que confirma las medidas admitidas directamente con tu aerolínea.'
         end,
         delivery_setup_note = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Indícanos qué bicicleta utilizarás para confirmar la compatibilidad del eje trasero y el enganche antes de la entrega.'
           when 'stroller-travel-compact' then 'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.'
         end,
         care_note = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Utiliza los arneses en cada trayecto y devuelve el remolque limpio y seco.'
           when 'stroller-travel-compact' then 'Devuelve la silla limpia y seca. CYBEX indica que las fundas de tela se pueden lavar a máquina a 30 °C.'
         end,
         seo_title = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Alquiler de remolque bici y silla doble en Valencia'
           when 'stroller-travel-compact' then 'Alquiler de silla CYBEX Coya en Valencia'
         end,
         seo_description = case product.slug
           when 'stroller-and-bike-trailer-for-2' then 'Alquila un remolque de bicicleta Hamax para dos niños que se convierte en silla de paseo, con brazo para bici y rueda delantera incluidos.'
           when 'stroller-travel-compact' then 'Alquila una silla de paseo CYBEX Coya de 6,6 kg en Valencia, con plegado a una mano, reclinación casi plana y correa integrada.'
         end,
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and localization.locale = 'es'
     and product.slug in ('stroller-and-bike-trailer-for-2', 'stroller-travel-compact');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then
    raise exception 'Expected to update two Spanish stroller localizations, updated %', affected_rows;
  end if;

  update public.product_faqs faq
     set question = case product.slug
           when 'stroller-and-bike-trailer-for-2' then case faq.sort_order
             when 0 then 'Can it be used as a stroller?'
             when 1 then 'How many children can ride in it?'
             when 2 then 'Will the trailer fit my bicycle?'
           end
           when 'stroller-travel-compact' then case faq.sort_order
             when 0 then 'How small does the CYBEX Coya fold?'
             when 1 then 'What age and weight is it suitable for?'
             when 2 then 'Can it be used with an infant car seat?'
           end
         end,
         answer = case product.slug
           when 'stroller-and-bike-trailer-for-2' then case faq.sort_order
             when 0 then 'Yes. Replace the bicycle arm with the included stroller wheel to use it for walks.'
             when 1 then 'It seats up to two children, with a maximum of 22 kg per child. For cycling, each child must be able to sit upright independently.'
             when 2 then 'Hamax trailers fit many bicycles, but compatibility depends on the rear axle and frame. Tell us which bicycle you plan to use so we can confirm the correct hitch.'
           end
           when 'stroller-travel-compact' then case faq.sort_order
             when 0 then 'It folds to 53.5 x 45 x 22 cm and weighs 6.6 kg. Confirm cabin-baggage dimensions directly with your airline.'
             when 1 then 'CYBEX lists the Coya from birth to approximately four years, with a maximum child weight of 22 kg.'
             when 2 then 'Yes. It is compatible with CYBEX infant car seats using the correct Coya adapter. The infant car seat and adapter are separate items.'
           end
         end
    from public.products product
   where faq.product_id = product.id
     and faq.locale = 'en'
     and faq.sort_order in (0, 1, 2)
     and product.slug in ('stroller-and-bike-trailer-for-2', 'stroller-travel-compact');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then
    raise exception 'Expected to replace six English stroller FAQs, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('stroller-and-bike-trailer-for-2', 'es', '¿Se puede utilizar como silla de paseo?', 'Sí. Sustituye el brazo para bicicleta por la rueda de paseo incluida para utilizarlo caminando.', 0),
      ('stroller-and-bike-trailer-for-2', 'es', '¿Cuántos niños pueden viajar?', 'Tiene capacidad para dos niños, con un máximo de 22 kg por niño. Para circular en bicicleta, cada niño debe poder sentarse erguido sin ayuda.', 1),
      ('stroller-and-bike-trailer-for-2', 'es', '¿El remolque es compatible con mi bicicleta?', 'Los remolques Hamax son compatibles con muchas bicicletas, pero depende del eje trasero y del cuadro. Indícanos qué bicicleta utilizarás para confirmar el enganche correcto.', 2),
      ('stroller-travel-compact', 'es', '¿Cuánto ocupa la CYBEX Coya plegada?', 'Plegada mide 53,5 x 45 x 22 cm y pesa 6,6 kg. Confirma las medidas de equipaje de cabina directamente con tu aerolínea.', 0),
      ('stroller-travel-compact', 'es', '¿Para qué edad y peso es adecuada?', 'CYBEX indica que la Coya es adecuada desde el nacimiento hasta aproximadamente cuatro años, con un peso máximo de 22 kg.', 1),
      ('stroller-travel-compact', 'es', '¿Se puede utilizar con una silla de coche para bebé?', 'Sí. Es compatible con sillas de coche para bebé CYBEX utilizando el adaptador Coya adecuado. La silla de coche y el adaptador son artículos independientes.', 2)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug
   where not exists (
     select 1 from public.product_faqs existing
      where existing.product_id = product.id
        and existing.locale = faq.locale
        and existing.sort_order = faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 6 then
    raise exception 'Expected to insert six Spanish stroller FAQs, inserted %', inserted_rows;
  end if;

  if exists (
    select 1 from public.products product
     where product.slug = 'stroller-and-bike-trailer-for-2'
       and product.description ilike '%Pioneer%'
  ) or exists (
    select 1
      from public.product_localizations localization
      join public.products product on product.id = localization.product_id
     where product.slug = 'stroller-and-bike-trailer-for-2'
       and concat_ws(' ', localization.short_description, localization.detail_description) ilike '%Pioneer%'
  ) then
    raise exception 'Unsupported Hamax model name remains in customer copy';
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in ('stroller-and-bike-trailer-for-2', 'stroller-travel-compact')
     group by product.id
    having count(*) filter (where faq.locale = 'en') < 3
        or count(*) filter (where faq.locale = 'es') < 3
  ) then
    raise exception 'Stroller bilingual FAQ verification failed';
  end if;
end
$$;
