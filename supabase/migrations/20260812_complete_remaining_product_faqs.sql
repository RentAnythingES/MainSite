-- Complete the remaining bilingual FAQ queue and replace three weak product records
-- with customer-facing copy grounded in the stored item and manufacturer evidence.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set name = case slug
       when 'padel-racket-adult' then 'Adult Padel Racket'
       when 'transportation-trailer' then 'Enclosed Transport Trailer'
       else name
     end,
     brand = case slug
       when 'baby-playpen-padded-mat' then 'PARVULI'
       when 'padel-racket-adult' then 'Kuikma'
       when 'transportation-trailer' then 'Böckmann'
       else brand
     end,
     description = case slug
       when 'baby-playpen-padded-mat' then 'A 120 x 120 cm PARVULI playpen with breathable mesh, six pull-up handles and a padded play mat for supervised play.'
       when 'padel-racket-adult' then 'A 350 g Kuikma PR Rental padel racket with a round shape, neutral balance and soft EVA foam for comfortable, controlled play.'
       when 'transportation-trailer' then 'A lockable Böckmann TPV KT-EU2 enclosed trailer for moving luggage, furniture, sports equipment and other bulky loads around Valencia.'
     end,
     features = case slug
       when 'baby-playpen-padded-mat' then '["120 x 120 cm play area", "Breathable mesh sides", "Padded play mat", "Six pull-up handles", "Foldable frame"]'::jsonb
       when 'padel-racket-adult' then '["350 g adult racket", "Round head shape", "Neutral balance", "Fibreglass face and frame", "Soft EVA foam", "Integrated head protector"]'::jsonb
       when 'transportation-trailer' then '["Lockable splash-proof lid", "Four internal tie-down points", "13-pin electrical connector", "Jockey wheel and rear support legs", "Lid rails for compatible carriers"]'::jsonb
     end,
     specs = case slug
       when 'baby-playpen-padded-mat' then jsonb_build_object(
         'Play area', '120 x 120 cm',
         'Included', 'Padded play mat and six pull-up handles',
         'Sides', 'Breathable mesh',
         'Use', 'Supervised awake play'
       )
       when 'padel-racket-adult' then jsonb_build_object(
         'Model', 'Kuikma PR Rental',
         'Weight', '350 g',
         'Shape', 'Round',
         'Balance', 'Neutral',
         'Face and frame', 'Fibreglass',
         'Core', 'Soft EVA foam'
       )
       when 'transportation-trailer' then jsonb_build_object(
         'Model', 'Böckmann TPV KT-EU2',
         'Maximum authorised mass', '750 kg',
         'Recorded payload', '490 kg',
         'Approximate internal box', '202 x 108 x 72.5 cm',
         'Overall dimensions', '296 x 152 x 166.5 cm',
         'Closed-lid load', '75 kg',
         'Electrical connector', '13 pin'
       )
     end,
     updated_at = now()
   where slug in ('baby-playpen-padded-mat','padel-racket-adult','transportation-trailer');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then raise exception 'Expected three products, updated %', affected_rows; end if;

  with copy(slug, locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('baby-playpen-padded-mat','en',
      'PARVULI 120 x 120 cm playpen with mesh sides and a padded play mat.',
      'Create a dedicated play space at your Valencia accommodation without travelling with a bulky playpen. This PARVULI model has a 120 x 120 cm play area, breathable mesh sides, six pull-up handles and a padded mat. The foldable frame makes it practical for temporary stays.',
      'The rental includes the 120 x 120 cm playpen, padded play mat and six pull-up handles.',
      'For supervised awake play only. It is not a cot or sleep space, and an adult must remain nearby while the child is inside.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Use on a clean, level indoor surface. Wipe the frame, mesh and mat clean and allow every part to dry before folding.',
      'Baby Playpen Rental Valencia | Padded Mat',
      'Rent a 120 x 120 cm PARVULI baby playpen in Valencia with mesh sides, a padded mat and six pull-up handles for supervised play.'),
    ('baby-playpen-padded-mat','es',
      'Parque PARVULI de 120 x 120 cm con laterales de malla y colchoneta acolchada.',
      'Crea una zona de juego propia en tu alojamiento de Valencia sin viajar con un parque voluminoso. Este modelo PARVULI tiene una superficie de 120 x 120 cm, laterales de malla transpirable, seis asas para levantarse y una colchoneta acolchada. La estructura plegable resulta práctica para estancias temporales.',
      'El alquiler incluye el parque de 120 x 120 cm, la colchoneta acolchada y seis asas para levantarse.',
      'Solo para juego despierto y supervisado. No es una cuna ni un espacio para dormir, y debe haber un adulto cerca mientras el niño esté dentro.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Úsalo sobre una superficie interior limpia y nivelada. Limpia la estructura, la malla y la colchoneta, y deja secar todas las piezas antes de plegarlo.',
      'Alquiler de parque infantil con colchoneta Valencia',
      'Alquila un parque PARVULI de 120 x 120 cm en Valencia con malla, colchoneta y seis asas para juego supervisado.'),
    ('padel-racket-adult','en',
      'Adult Kuikma PR Rental padel racket with a round shape and comfortable 350 g weight.',
      'Play padel in Valencia without packing a racket. The Kuikma PR Rental combines a round head, neutral balance, fibreglass construction and soft EVA foam for easy handling and a forgiving feel. At 350 g, it suits adults looking for control and comfort for a casual game or regular practice.',
      'The rental includes one adult Kuikma PR Rental padel racket. Balls are not included unless selected separately.',
      'Adult racket. Use the wrist strap while playing and use the racket only for padel.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Keep the racket dry and avoid impacts with walls, fencing and the court surface.',
      'Adult Padel Racket Rental in Valencia',
      'Rent a 350 g Kuikma PR Rental padel racket in Valencia, with a round shape, neutral balance and soft EVA foam for comfortable control.'),
    ('padel-racket-adult','es',
      'Pala de pádel Kuikma PR Rental para adultos, con forma redonda y un cómodo peso de 350 g.',
      'Juega al pádel en Valencia sin cargar con una pala. La Kuikma PR Rental combina forma redonda, balance neutro, construcción de fibra de vidrio y espuma EVA blanda para ofrecer manejabilidad y un golpeo tolerante. Con 350 g, es una opción cómoda para adultos que buscan control en un partido informal o en entrenamientos habituales.',
      'El alquiler incluye una pala de pádel Kuikma PR Rental para adultos. Las pelotas no están incluidas salvo que se seleccionen por separado.',
      'Pala para adultos. Utiliza la correa de muñeca durante el juego y úsala únicamente para pádel.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'Mantén la pala seca y evita los golpes contra paredes, vallas y la superficie de la pista.',
      'Alquiler de pala de pádel para adultos Valencia',
      'Alquila una pala Kuikma PR Rental de 350 g en Valencia, con forma redonda, balance neutro y espuma EVA blanda para un control cómodo.'),
    ('transportation-trailer','en',
      'Lockable Böckmann TPV KT-EU2 enclosed trailer for luggage, furniture, sports equipment and other bulky loads.',
      'Move bulky items around Valencia without needing a van. The enclosed Böckmann TPV KT-EU2 has an approximately 202 x 108 x 72.5 cm loading box, a lockable splash-proof lid and internal tie-down points. Its recorded payload is 490 kg within a maximum authorised mass of 750 kg, so the load must be planned around both the trailer limit and your vehicle''s permitted towing capacity.',
      'The rental includes the trailer, locks and keys.',
      'Your vehicle needs an approved towbar, a compatible 13-pin electrical connection and sufficient permitted towing capacity for the loaded trailer.',
      'A valid driving licence, identification and a €200 deposit are required at handover.',
      'Return the loading box empty and reasonably clean. Secure every load to the internal tie-down points before driving.',
      'Enclosed Transport Trailer Rental Valencia',
      'Rent a lockable Böckmann enclosed trailer in Valencia with a 490 kg recorded payload and an approximately 202 x 108 cm loading box.'),
    ('transportation-trailer','es',
      'Remolque cerrado Böckmann TPV KT-EU2 con tapa bloqueable para equipaje, muebles, material deportivo y otras cargas voluminosas.',
      'Transporta objetos voluminosos por Valencia sin alquilar una furgoneta. El Böckmann TPV KT-EU2 ofrece una caja de carga aproximada de 202 x 108 x 72,5 cm, tapa antisalpicaduras con cerradura y puntos interiores de amarre. La carga útil registrada es de 490 kg dentro de una masa máxima autorizada de 750 kg, por lo que debes respetar tanto el límite del remolque como la capacidad de remolque permitida de tu vehículo.',
      'El alquiler incluye el remolque, las cerraduras y las llaves.',
      'El vehículo necesita una bola de remolque homologada, una conexión eléctrica compatible de 13 pines y capacidad de remolque suficiente para el remolque cargado.',
      'En la entrega se requiere permiso de conducir válido, identificación y un depósito de 200 €.',
      'Devuelve la caja de carga vacía y razonablemente limpia. Sujeta cada carga a los puntos de amarre interiores antes de conducir.',
      'Alquiler de remolque cerrado en Valencia',
      'Alquila un remolque cerrado Böckmann en Valencia, con 490 kg de carga útil registrada y una caja de carga aproximada de 202 x 108 cm.')
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
  if affected_rows <> 6 then raise exception 'Expected six product localizations, updated %', affected_rows; end if;

  with faq_copy(slug, sort_order, question, answer) as (
    values
    ('baby-playpen-padded-mat',0,'How large is the play area?','The play area measures 120 x 120 cm and has breathable mesh sides.'),
    ('baby-playpen-padded-mat',1,'What is included?','The rental includes the playpen, padded play mat and six pull-up handles.'),
    ('baby-playpen-padded-mat',2,'Can a baby sleep in the playpen?','No. This product is for supervised awake play, not sleep.'),
    ('bottle-steam-steriliser',0,'Do items need washing first?','Yes. Sterilising does not remove milk residue or replace thorough washing before loading.'),
    ('bottle-steam-steriliser',1,'Can I open it immediately after the cycle?','Allow the steam to clear and follow the supplied instructions. The lid and contents may be very hot.'),
    ('bottle-steam-steriliser',2,'How many bottles fit?','The steriliser holds up to six bottles based on a 260 ml bottle size, depending on their shape and rack arrangement.'),
    ('extra-large-folding-baby-play-mat',0,'How large is the mat?','It measures approximately 196 x 178 cm and is roughly 1 cm thick.'),
    ('extra-large-folding-baby-play-mat',1,'Can a baby sleep on it?','No. It is offered for supervised floor play and is not a sleep surface or cot mattress.'),
    ('extra-large-folding-baby-play-mat',2,'How is it cleaned?','Wipe it with mild soap and water and allow it to dry completely before folding or storing.'),
    ('ezviz-bm1-baby-monitor',0,'What does the monitor include?','The rental includes the EZVIZ BM1 camera, bracket, USB cable and setup guidance.'),
    ('ezviz-bm1-baby-monitor',1,'Does it need Wi-Fi?','Yes. The EZVIZ BM1 uses 2.4 GHz Wi-Fi for app connectivity.'),
    ('ezviz-bm1-baby-monitor',2,'Does it record video?','It supports microSD cards up to 256 GB, but a card is not included.'),
    ('padel-racket-adult',0,'What type of player is this racket for?','It is an adult racket designed for comfortable control and easy handling, making it suitable for casual and intermediate play.'),
    ('padel-racket-adult',1,'How heavy is the racket?','The Kuikma PR Rental weighs 350 g and has a round shape with neutral balance.'),
    ('padel-racket-adult',2,'Are padel balls included?','No. The rental includes one adult padel racket; balls can be selected separately when available.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',0,'Who is the Newborn Support for?','Stokke states that the support can be used from birth to approximately eight months. Stop using it when the child can sit independently.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',1,'Is the bath suitable for a small apartment?','Yes. The bath folds for storage after it has been rinsed and dried completely.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',2,'What safety guidance applies?','An adult must remain within reach at all times. Test the water temperature first, follow the marked water level and never move the bath with a child inside.'),
    ('transportation-trailer',0,'How much can the trailer carry?','The recorded payload is 490 kg within a maximum authorised mass of 750 kg. The load and accessories must remain within that payload.'),
    ('transportation-trailer',1,'How large is the loading box?','The internal loading box is approximately 202 cm long, 108 cm wide and 72.5 cm high.'),
    ('transportation-trailer',2,'Can I tow it with any car?','No. Your vehicle needs an approved towbar, a compatible 13-pin connection and sufficient permitted towing capacity for the loaded trailer.')
  )
  update public.product_faqs faq
     set question=faq_copy.question, answer=faq_copy.answer
    from public.products product, faq_copy
   where faq.product_id=product.id and product.slug=faq_copy.slug
     and faq.locale='en' and faq.sort_order=faq_copy.sort_order;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 21 then raise exception 'Expected twenty-one English FAQs, updated %', affected_rows; end if;

  insert into public.product_faqs(product_id,locale,question,answer,sort_order)
  select product.id,'es',faq.question,faq.answer,faq.sort_order
    from (values
    ('baby-playpen-padded-mat',0,'¿Cuánto mide la zona de juego?','La zona de juego mide 120 x 120 cm y tiene laterales de malla transpirable.'),
    ('baby-playpen-padded-mat',1,'¿Qué incluye?','El alquiler incluye el parque, la colchoneta acolchada y seis asas para levantarse.'),
    ('baby-playpen-padded-mat',2,'¿Puede dormir un bebé en el parque?','No. Este producto es para juego despierto y supervisado, no para dormir.'),
    ('bottle-steam-steriliser',0,'¿Hay que lavar los objetos primero?','Sí. Esterilizar no elimina los restos de leche ni sustituye un lavado completo antes de cargar el aparato.'),
    ('bottle-steam-steriliser',1,'¿Puedo abrirlo justo después del ciclo?','Deja que salga el vapor y sigue las instrucciones suministradas. La tapa y el contenido pueden estar muy calientes.'),
    ('bottle-steam-steriliser',2,'¿Cuántos biberones caben?','Admite hasta seis biberones tomando como referencia un tamaño de 260 ml, según su forma y la colocación en la rejilla.'),
    ('extra-large-folding-baby-play-mat',0,'¿Cuánto mide la alfombrilla?','Mide aproximadamente 196 x 178 cm y tiene alrededor de 1 cm de grosor.'),
    ('extra-large-folding-baby-play-mat',1,'¿Puede dormir un bebé encima?','No. Está destinada al juego en el suelo bajo supervisión y no es una superficie para dormir ni un colchón de cuna.'),
    ('extra-large-folding-baby-play-mat',2,'¿Cómo se limpia?','Límpiala con agua y jabón suave y deja que se seque por completo antes de plegarla o guardarla.'),
    ('ezviz-bm1-baby-monitor',0,'¿Qué incluye el vigilabebés?','El alquiler incluye la cámara EZVIZ BM1, el soporte, el cable USB y las instrucciones de configuración.'),
    ('ezviz-bm1-baby-monitor',1,'¿Necesita Wi-Fi?','Sí. El EZVIZ BM1 utiliza Wi-Fi de 2,4 GHz para conectarse a la aplicación.'),
    ('ezviz-bm1-baby-monitor',2,'¿Graba vídeo?','Admite tarjetas microSD de hasta 256 GB, pero la tarjeta no está incluida.'),
    ('padel-racket-adult',0,'¿Para qué tipo de jugador es esta pala?','Es una pala para adultos pensada para un control cómodo y un manejo sencillo, adecuada para juego informal e intermedio.'),
    ('padel-racket-adult',1,'¿Cuánto pesa la pala?','La Kuikma PR Rental pesa 350 g y tiene forma redonda con balance neutro.'),
    ('padel-racket-adult',2,'¿Incluye pelotas de pádel?','No. El alquiler incluye una pala de pádel para adultos; las pelotas pueden seleccionarse por separado cuando estén disponibles.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',0,'¿Para quién es el soporte para recién nacido?','Stokke indica que puede utilizarse desde el nacimiento hasta aproximadamente ocho meses. Deja de usarlo cuando el niño pueda sentarse sin ayuda.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',1,'¿La bañera sirve para un apartamento pequeño?','Sí. Se pliega para guardarla después de aclararla y secarla por completo.'),
    ('stokke-flexi-bath-baby-bath-and-flexi-bath-newborn-support-bundle',2,'¿Qué indicaciones de seguridad hay que seguir?','Un adulto debe permanecer siempre al alcance. Comprueba primero la temperatura del agua, respeta el nivel marcado y nunca muevas la bañera con un niño dentro.'),
    ('transportation-trailer',0,'¿Cuánto puede cargar el remolque?','La carga útil registrada es de 490 kg dentro de una masa máxima autorizada de 750 kg. La carga y los accesorios deben mantenerse dentro de ese límite.'),
    ('transportation-trailer',1,'¿Cuánto mide la caja de carga?','La caja interior mide aproximadamente 202 cm de largo, 108 cm de ancho y 72,5 cm de alto.'),
    ('transportation-trailer',2,'¿Puedo remolcarlo con cualquier coche?','No. El vehículo necesita una bola homologada, una conexión compatible de 13 pines y capacidad de remolque suficiente para el remolque cargado.')
    ) as faq(slug,sort_order,question,answer)
    join public.products product on product.slug=faq.slug
   where not exists (
     select 1 from public.product_faqs existing
      where existing.product_id=product.id and existing.locale='es' and existing.sort_order=faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 21 then raise exception 'Expected twenty-one Spanish FAQs, inserted %', inserted_rows; end if;
end
$$;
