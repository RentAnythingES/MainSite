-- Replace internal workflow and raw supplier prose on five baby-support listings.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = case slug
       when 'bab-high-chair-tray' then 'An easy-clean IKEA ANTILOP high chair with tray and safety belt for mealtimes during your Valencia stay.'
       when 'baby-bathtub-thermometer' then 'A foldable ALMAR baby bath with temperature indicator, newborn support and non-slip feet for easier bath time away from home.'
       when 'baby-bottle-and-food-warmer' then 'A Tommee Tippee Easi-Warm bottle and food warmer with settings for chilled, room-temperature and keep-warm feeds.'
       when 'baby-bottle-steriliser-uv' then 'A compact Nuby UV steriliser with a three-minute cycle for compatible bottles and baby-care items.'
       when 'baby-playpen' then 'A 120 x 120 cm Venture playpen with mesh sides and a padded mat for supervised play at your Valencia accommodation.'
     end,
     features = case slug
       when 'baby-playpen' then '["120 x 120 cm play area", "Breathable mesh sides", "Padded play mat", "Six pull-up handles", "Carry bag"]'::jsonb
       else features
     end,
     specs = case slug
       when 'baby-playpen' then jsonb_build_object('Play area', '120 x 120 cm', 'Use', 'Supervised awake play', 'Assembly', 'Tool-free', 'Included', 'Padded mat, six pull-up handles, basket and carry bag')
       else specs
     end,
     updated_at = now()
   where slug in ('bab-high-chair-tray','baby-bathtub-thermometer','baby-bottle-and-food-warmer','baby-bottle-steriliser-uv','baby-playpen');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 5 then raise exception 'Expected five baby products, updated %', affected_rows; end if;

  with copy(slug, locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('bab-high-chair-tray','en','Easy-clean IKEA ANTILOP high chair with tray and safety belt.','The IKEA ANTILOP gives your child a dedicated place for meals at your accommodation. Its raised-edge tray helps contain spills, the smooth polypropylene surfaces wipe clean, and the legs detach for easier transport and storage.','The rental includes the ANTILOP high chair, tray, safety belt and detachable legs.','For children who can sit independently, up to three years old and a maximum of 15 kg.','The chair arrives assembled and ready for use.','Wipe the seat, tray and legs with mild soapy water, then dry with a clean cloth.','IKEA ANTILOP High Chair Rental Valencia','Rent an IKEA ANTILOP baby high chair with tray in Valencia. Easy-clean, portable and suitable for children who sit independently up to 15 kg.'),
    ('bab-high-chair-tray','es','Trona IKEA ANTILOP fácil de limpiar, con bandeja y cinturón.','La IKEA ANTILOP ofrece a tu hijo un lugar propio para comer en el alojamiento. El borde elevado de la bandeja ayuda a contener los derrames, las superficies lisas se limpian fácilmente y las patas se desmontan para facilitar el transporte y el almacenamiento.','El alquiler incluye la trona ANTILOP, la bandeja, el cinturón de seguridad y las patas desmontables.','Para niños que puedan sentarse sin ayuda, hasta tres años y un máximo de 15 kg.','La trona se entrega montada y lista para usar.','Limpia el asiento, la bandeja y las patas con agua jabonosa suave y seca con un paño limpio.','Alquiler de trona IKEA ANTILOP en Valencia','Alquila una trona IKEA ANTILOP con bandeja en Valencia. Fácil de limpiar y adecuada para niños que se sientan sin ayuda hasta 15 kg.'),
    ('baby-bathtub-thermometer','en','Foldable ALMAR baby bath with temperature indicator and newborn support.','The ALMAR folds down for storage while giving your baby a dedicated bath at the accommodation. It has a temperature indicator, newborn support, drain and non-slip feet. The indicator is a useful guide, but always check the water yourself.','The rental includes the foldable bath and its newborn support.','Use on a stable, level surface with direct adult supervision. Always check the water temperature yourself before placing the baby in the bath.','Delivery and collection options for your Valencia address are shown with your booking.','Drain, rinse and dry the bath after each use.','Foldable Baby Bath Rental in Valencia','Rent a foldable ALMAR baby bath in Valencia with a temperature indicator, newborn support, drain and non-slip feet.'),
    ('baby-bathtub-thermometer','es','Bañera plegable ALMAR con indicador de temperatura y soporte para recién nacido.','La ALMAR se pliega para guardarla y ofrece al bebé una bañera propia en el alojamiento. Incorpora indicador de temperatura, soporte para recién nacido, desagüe y patas antideslizantes. El indicador sirve de orientación, pero comprueba siempre el agua personalmente.','El alquiler incluye la bañera plegable y su soporte para recién nacido.','Úsala sobre una superficie estable y nivelada, siempre con supervisión directa de un adulto. Comprueba personalmente la temperatura del agua antes de meter al bebé.','Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.','Vacía, aclara y seca la bañera después de cada uso.','Alquiler de bañera plegable para bebé Valencia','Alquila una bañera plegable ALMAR en Valencia con indicador de temperatura, soporte para recién nacido, desagüe y patas antideslizantes.'),
    ('baby-bottle-and-food-warmer','en','Tommee Tippee Easi-Warm for warming bottles and baby-food containers.','The Easi-Warm uses a simple dial and timer to warm expressed milk, prepared formula or suitable baby-food containers. Choose a setting for feeds from the fridge, room temperature or keeping warm; timing varies with the volume, container and starting temperature.','The rental includes the Tommee Tippee Easi-Warm appliance. Bottles and food containers are not included.','Use suitable heat-resistant bottles or containers, follow the water-level instructions and always test the feed temperature before serving.','Delivery and collection options for your Valencia address are shown with your booking.','Empty and wipe the warmer after use. Descale it if prompted during a longer rental.','Bottle and Baby Food Warmer Rental Valencia','Rent a Tommee Tippee Easi-Warm bottle and food warmer in Valencia, with settings for chilled, room-temperature and keep-warm feeds.'),
    ('baby-bottle-and-food-warmer','es','Tommee Tippee Easi-Warm para calentar biberones y recipientes de comida infantil.','El Easi-Warm utiliza un selector y temporizador sencillos para calentar leche materna extraída, fórmula preparada o recipientes adecuados de comida infantil. Elige un ajuste para tomas de la nevera, a temperatura ambiente o para mantener caliente; el tiempo varía según el volumen, el recipiente y la temperatura inicial.','El alquiler incluye el aparato Tommee Tippee Easi-Warm. No incluye biberones ni recipientes de comida.','Utiliza biberones o recipientes resistentes al calor, sigue las indicaciones del nivel de agua y prueba siempre la temperatura antes de servir.','Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.','Vacía y limpia el calentador después de usarlo. Descalcifícalo si fuera necesario durante un alquiler largo.','Alquiler de calientabiberones en Valencia','Alquila un Tommee Tippee Easi-Warm en Valencia, con ajustes para tomas frías, a temperatura ambiente y mantenimiento del calor.'),
    ('baby-bottle-steriliser-uv','en','Compact Nuby UV steriliser with a three-minute cycle.','The Nuby 30113 uses ultraviolet light for a three-minute sterilising cycle without water or chemicals. Its countertop format can hold compatible bottles and other baby-care items, provided the UV light can reach their exposed surfaces.','The rental includes the Nuby UV steriliser and power cable.','Wash and dry items first, place only UV-compatible items inside and arrange them so the light can reach their surfaces.','Delivery and collection options for your Valencia address are shown with your booking.','Keep the interior clean and dry and do not look directly at the UV light.','Nuby UV Bottle Steriliser Rental Valencia','Rent a compact Nuby UV bottle steriliser in Valencia with a three-minute, water-free cycle for compatible baby-care items.'),
    ('baby-bottle-steriliser-uv','es','Esterilizador UV Nuby compacto con ciclo de tres minutos.','El Nuby 30113 utiliza luz ultravioleta en un ciclo de esterilización de tres minutos sin agua ni productos químicos. Su formato de sobremesa admite biberones y otros artículos compatibles, siempre que la luz UV pueda alcanzar las superficies expuestas.','El alquiler incluye el esterilizador UV Nuby y el cable de alimentación.','Lava y seca primero los artículos, introduce solo objetos compatibles con UV y colócalos de forma que la luz alcance sus superficies.','Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.','Mantén el interior limpio y seco y no mires directamente a la luz UV.','Alquiler de esterilizador UV Nuby Valencia','Alquila un esterilizador UV Nuby compacto en Valencia con ciclo de tres minutos sin agua para artículos infantiles compatibles.'),
    ('baby-playpen','en','Venture 120 x 120 cm playpen with mesh sides and padded mat.','The Venture creates a defined play space in your accommodation without bringing a bulky playpen from home. Its 120 x 120 cm layout has breathable mesh sides, a padded mat, six pull-up handles and a carry bag, and assembles without tools.','The rental includes the playpen frame, mesh enclosure, padded mat, six pull-up handles, basket and carry bag.','For supervised awake play only. It is not a cot or sleep space, and an adult must remain nearby while the child is inside.','The playpen is delivered packed for transport and assembles without tools.','Wipe the frame and mesh clean and allow every part to dry before packing it away.','Baby Playpen Rental in Valencia','Rent a 120 x 120 cm Venture baby playpen in Valencia with mesh sides, padded mat, pull-up handles and carry bag for supervised play.'),
    ('baby-playpen','es','Parque Venture de 120 x 120 cm con laterales de malla y colchoneta.','El Venture crea una zona de juego definida en el alojamiento sin tener que viajar con un parque voluminoso. Su espacio de 120 x 120 cm tiene laterales de malla transpirable, colchoneta acolchada, seis asas para levantarse y bolsa de transporte, y se monta sin herramientas.','El alquiler incluye la estructura, el cerramiento de malla, la colchoneta, seis asas, la cesta y la bolsa de transporte.','Solo para juego despierto y supervisado. No es una cuna ni un espacio para dormir, y debe haber un adulto cerca mientras el niño esté dentro.','El parque se entrega embalado para transportarlo y se monta sin herramientas.','Limpia la estructura y la malla con un paño y deja secar todas las piezas antes de guardarlo.','Alquiler de parque infantil en Valencia','Alquila un parque Venture de 120 x 120 cm en Valencia con malla, colchoneta, asas y bolsa para juego supervisado.')
  )
  update public.product_localizations localization
     set short_description=copy.short_description, detail_description=copy.detail_description,
         includes_text=copy.includes_text, constraints_text=copy.constraints_text,
         delivery_setup_note=copy.delivery_setup_note, care_note=copy.care_note,
         seo_title=copy.seo_title, seo_description=copy.seo_description, updated_at=now()
    from public.products product, copy
   where localization.product_id=product.id and product.slug=copy.slug and localization.locale=copy.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 10 then raise exception 'Expected ten baby localizations, updated %', affected_rows; end if;

  with faq_copy(slug, sort_order, question, answer) as (
    values
    ('baby-bathtub-thermometer',0,'What is included with the bath?','The rental includes the foldable bath and newborn support. The bath also has a temperature indicator, drain and non-slip feet.'),
    ('baby-bathtub-thermometer',1,'Does the indicator check the water for me?','It provides a temperature guide, but an adult must always check the water personally and supervise the baby throughout the bath.'),
    ('baby-bathtub-thermometer',2,'Does the bath fold for storage?','Yes. It folds down between uses, which makes it easier to store in a bathroom or apartment.'),
    ('baby-bottle-and-food-warmer',0,'Can it warm different bottle brands?','It works with most bottle brands and suitable baby-food containers. Check that your container fits and can be safely heated.'),
    ('baby-bottle-and-food-warmer',1,'How quickly does it warm a feed?','Time varies by volume and starting temperature. Tommee Tippee gives an example of about four minutes for 150 ml from 20°C to 37°C.'),
    ('baby-bottle-and-food-warmer',2,'Does it mix formula automatically?','No. It warms an already prepared feed or suitable food container; it does not mix or dispense formula.'),
    ('baby-bottle-steriliser-uv',0,'How long is the UV cycle?','The Nuby 30113 has a three-minute UV cycle.'),
    ('baby-bottle-steriliser-uv',1,'Does it use water or chemicals?','No. The unit uses ultraviolet light, so the items should be washed and dried before they go inside.'),
    ('baby-bottle-steriliser-uv',2,'What can I put inside?','Use only UV-compatible bottles and baby-care items, arranged so the UV light can reach their exposed surfaces.'),
    ('baby-playpen',0,'How large is the play area?','The playpen measures 120 x 120 cm and has breathable mesh sides so you can see the child inside.'),
    ('baby-playpen',1,'What is included?','It includes the frame, mesh enclosure, padded mat, six pull-up handles, basket and carry bag.'),
    ('baby-playpen',2,'Can a baby sleep in the playpen?','No. This listing is for supervised awake play, not sleep.')
  )
  update public.product_faqs faq set question=faq_copy.question, answer=faq_copy.answer
    from public.products product, faq_copy
   where faq.product_id=product.id and product.slug=faq_copy.slug and faq.locale='en' and faq.sort_order=faq_copy.sort_order;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 12 then raise exception 'Expected twelve English FAQs, updated %', affected_rows; end if;

  insert into public.product_faqs(product_id,locale,question,answer,sort_order)
  select product.id,'es',faq.question,faq.answer,faq.sort_order
    from (values
    ('bab-high-chair-tray',0,'¿Quién puede utilizar esta trona?','Está diseñada para niños que puedan sentarse sin ayuda, hasta tres años y un máximo de 15 kg.'),
    ('bab-high-chair-tray',1,'¿Incluye bandeja y cinturón?','Sí. El alquiler incluye la bandeja elevada y el cinturón de seguridad.'),
    ('bab-high-chair-tray',2,'¿Cómo se limpia?','Limpia el asiento, la bandeja y las patas con agua jabonosa suave y seca con un paño limpio.'),
    ('baby-bathtub-thermometer',0,'¿Qué incluye la bañera?','El alquiler incluye la bañera plegable y el soporte para recién nacido. También incorpora indicador de temperatura, desagüe y patas antideslizantes.'),
    ('baby-bathtub-thermometer',1,'¿El indicador comprueba el agua por mí?','Sirve de orientación, pero un adulto debe comprobar siempre el agua personalmente y supervisar al bebé durante todo el baño.'),
    ('baby-bathtub-thermometer',2,'¿La bañera se pliega para guardarla?','Sí. Se pliega entre usos para ocupar menos espacio en el baño o apartamento.'),
    ('baby-bottle-and-food-warmer',0,'¿Sirve para distintas marcas de biberón?','Funciona con la mayoría de marcas y recipientes adecuados de comida infantil. Comprueba que el recipiente cabe y admite calentamiento.'),
    ('baby-bottle-and-food-warmer',1,'¿Cuánto tarda en calentar una toma?','Depende del volumen y la temperatura inicial. Tommee Tippee da como ejemplo unos cuatro minutos para 150 ml de 20 °C a 37 °C.'),
    ('baby-bottle-and-food-warmer',2,'¿Mezcla la fórmula automáticamente?','No. Calienta una toma ya preparada o un recipiente adecuado; no mezcla ni dispensa fórmula.'),
    ('baby-bottle-steriliser-uv',0,'¿Cuánto dura el ciclo UV?','El Nuby 30113 tiene un ciclo UV de tres minutos.'),
    ('baby-bottle-steriliser-uv',1,'¿Utiliza agua o productos químicos?','No. Utiliza luz ultravioleta, por lo que los artículos deben lavarse y secarse antes de introducirlos.'),
    ('baby-bottle-steriliser-uv',2,'¿Qué puedo introducir?', 'Utiliza solo biberones y artículos infantiles compatibles con UV, colocados para que la luz alcance las superficies expuestas.'),
    ('baby-playpen',0,'¿Cuánto mide la zona de juego?','Mide 120 x 120 cm y tiene laterales de malla transpirable para ver al niño dentro.'),
    ('baby-playpen',1,'¿Qué incluye?','Incluye la estructura, el cerramiento de malla, la colchoneta, seis asas, la cesta y la bolsa de transporte.'),
    ('baby-playpen',2,'¿Puede dormir un bebé en el parque?','No. Este producto es para juego despierto y supervisado, no para dormir.')
    ) as faq(slug,sort_order,question,answer)
    join public.products product on product.slug=faq.slug
   where not exists(select 1 from public.product_faqs existing where existing.product_id=product.id and existing.locale='es' and existing.sort_order=faq.sort_order);

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 15 then raise exception 'Expected fifteen Spanish FAQs, inserted %', inserted_rows; end if;
end
$$;
