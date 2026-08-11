-- Correct the five active Valencia car-seat products against business-confirmed
-- physical inventory. Preserve product IDs, prices, bookings, and availability
-- history while replacing false identities and customer-hostile copy.

do $$
declare
  moni_id uuid := 'd9ec347e-8c22-4394-b58e-c8cbd02d1b34';
  maxi_id uuid := '54928c5f-3e30-4d00-90e5-44daa9acc8bc';
  peg_id uuid := '67ce7859-a850-4ff4-b8ef-26256727687b';
  kinderkraft_id uuid := '1cdb7ecb-4a5c-4c05-9d26-a125b8185e30';
  booster_id uuid := '9d978c2d-4e71-463a-9878-a2ba17cf6e2c';
  moni_image text := 'https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/moni-serengeti-i-size-car-seat/primary.jpg';
  maxi_image text := 'https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/maxi-cosi-pebble-360-pro2-infant-car-seat/primary.png';
  kinderkraft_image text := 'https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/kinderkraft-i-spark-2-plus-i-size-car-seat/primary.jpg';
begin
  if not exists (select 1 from public.products where id = moni_id and slug = 'car-seat-britax-i-size') then
    raise exception 'Expected false Britax record is missing or already changed';
  end if;
  if not exists (select 1 from public.products where id = maxi_id and slug = 'car-seat-infant') then
    raise exception 'Expected infant-seat record is missing or already changed';
  end if;
  if not exists (select 1 from public.products where id = peg_id and slug = 'convertible-car-seat') then
    raise exception 'Expected Peg Perego record is missing or already changed';
  end if;
  if not exists (select 1 from public.products where id = kinderkraft_id and slug = 'kinderkraft-i-boost-2-booster-seat') then
    raise exception 'Expected false I-BOOST record is missing or already changed';
  end if;
  if not exists (select 1 from public.products where id = booster_id and slug = 'seat-booster') then
    raise exception 'Expected generic booster record is missing or already changed';
  end if;

  update public.products
     set slug = 'moni-serengeti-i-size-car-seat',
         name = 'Moni Serengeti i-Size Car Seat',
         brand = 'Moni',
         description = 'A rotating i-Size car seat for children from 40 to 150 cm, designed to adapt from newborn journeys through the booster-seat years.',
         features = '["40-150 cm i-Size range","360-degree rotating seat","Rear-facing and forward-facing configurations","ISOFIX and top-tether installation","Five-point harness for smaller children","Four recline positions","Adjustable headrest"]'::jsonb,
         specs = '{"Model":"Serengeti i-Size","Child height":"40-150 cm","Approval":"R129 / i-Size","Rear-facing":"40-105 cm","Forward-facing":"76-150 cm","Installation":"ISOFIX and top tether","Rotation":"360 degrees","Recline":"4 positions"}'::jsonb,
         image_url = moni_image,
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats',
         meta_title = 'Moni Serengeti Car Seat Rental Valencia',
         meta_description = 'Rent a Moni Serengeti i-Size car seat in Valencia for children 40-150 cm, with 360-degree rotation, ISOFIX and local delivery.'
   where id = moni_id;

  update public.products
     set slug = 'maxi-cosi-pebble-360-pro2-infant-car-seat',
         name = 'Maxi-Cosi Pebble 360 Pro2 Infant Car Seat',
         brand = 'Maxi-Cosi',
         description = 'A lie-flat infant car seat for babies from 40 to 87 cm, supplied without the FamilyFix base and installed with the car''s three-point seat belt.',
         features = '["From birth to approximately 18 months","40-87 cm i-Size range","Fully reclined positions","G-CELL side-impact protection","ClimaFlow ventilation","Three-point harness","Integrated sun canopy","Removable newborn insert"]'::jsonb,
         specs = '{"Model":"Pebble 360 Pro2","Child height":"40-87 cm","Approximate age":"Birth to 18 months","Maximum child weight":"13 kg","Approval":"R129 / i-Size","Orientation":"Rear-facing","Installation":"Vehicle three-point seat belt","Product weight":"4.7 kg","FamilyFix base":"Not included"}'::jsonb,
         image_url = maxi_image,
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats',
         meta_title = 'Maxi-Cosi Infant Car Seat Rental Valencia',
         meta_description = 'Rent a Maxi-Cosi Pebble 360 Pro2 infant car seat in Valencia for babies 40-87 cm. Lie-flat comfort, seat-belt installation and no base required.'
   where id = maxi_id;

  update public.products
     set slug = 'peg-perego-viaggio1-duo-fix-car-seat',
         name = 'Peg Perego Viaggio1 Duo-Fix Car Seat - Rouge',
         brand = 'Peg Perego',
         description = 'A comfortable forward-facing car seat for children from 9 to 18 kg, with an adjustable headrest, five-point harness and four recline positions.',
         features = '["9-18 kg child-weight range","Forward-facing seat","Five-point harness","Adjustable side-impact protection","Seven-position headrest","Four recline positions","Vehicle seat-belt installation"]'::jsonb,
         specs = '{"Model":"Viaggio1 Duo-Fix","Colour":"Rouge","Child weight":"9-18 kg","Approximate age":"1-4 years","Orientation":"Forward-facing","Harness":"Five-point","Headrest":"7 positions","Recline":"4 positions","Installation":"Vehicle three-point seat belt; compatible ISOFIX base is separate","Product weight":"10 kg","Dimensions":"45 x 65 x 55 cm"}'::jsonb,
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats',
         meta_title = 'Peg Perego Car Seat Rental Valencia',
         meta_description = 'Rent a Peg Perego Viaggio1 Duo-Fix car seat in Valencia for children 9-18 kg, with a five-point harness, adjustable headrest and recline.'
   where id = peg_id;

  update public.products
     set slug = 'kinderkraft-i-spark-2-plus-i-size-car-seat',
         name = 'Kinderkraft I-SPARK 2 PLUS i-Size Car Seat',
         brand = 'Kinderkraft',
         description = 'A comfortable high-back i-Size seat for children 100 to 150 cm, with ten headrest positions and simple installation using the car''s three-point seat belt.',
         features = '["100-150 cm i-Size range","High-back seat","Converts to a backless booster above 140 cm","Ten-position adjustable headrest","H-GUARD head protection","SPS side protection","Vehicle three-point belt installation","Machine-washable cover"]'::jsonb,
         specs = '{"Model":"I-SPARK 2 PLUS i-Size","Child height":"100-150 cm","Approximate age":"3.5-12 years","Approval":"R129 / i-Size","Installation":"Vehicle three-point seat belt","Headrest":"10 positions","Backless booster mode":"Above 140 cm"}'::jsonb,
         image_url = kinderkraft_image,
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats',
         meta_title = 'Kinderkraft Car Seat Rental Valencia',
         meta_description = 'Rent a Kinderkraft I-SPARK 2 PLUS i-Size car seat in Valencia for children 100-150 cm, with a high back and simple seat-belt installation.'
   where id = kinderkraft_id;

  update public.products
     set name = 'Backless Booster Seat',
         brand = '',
         description = 'A lightweight backless booster for older children, easy to move between cars and installed with the vehicle''s three-point seat belt.',
          features = '["Lightweight backless design","Vehicle three-point belt installation","Forward-facing use","Compact for travel and transfers"]'::jsonb,
         specs = '{"Product type":"Backless booster seat","Installation":"Vehicle three-point seat belt","Orientation":"Forward-facing","Brand or colour":"May vary"}'::jsonb,
         stock_total = 3,
         stock_available = 3,
         subcategory = 'Car Seats',
         subcategory_slug = 'car-seats',
         meta_title = 'Backless Booster Seat Rental Valencia',
         meta_description = 'Rent a lightweight backless booster seat in Valencia for an older child, with simple three-point seat-belt installation and local delivery.'
   where id = booster_id;

  update public.product_offers
     set stock_total = 3,
         online_capacity = 3,
         updated_at = now()
   where product_id = booster_id
     and market_id = (select id from public.markets where slug = 'valencia');

  if not found then
    raise exception 'Valencia offer for generic booster was not updated';
  end if;

  insert into public.product_localizations
    (product_id, locale, short_description, detail_description, includes_text,
     constraints_text, delivery_setup_note, care_note, seo_title, seo_description, updated_at)
  values
    (moni_id, 'en',
     'A rotating i-Size car seat for children from 40 to 150 cm, designed to adapt from newborn journeys through the booster-seat years.',
     'The Moni Serengeti is a 360-degree rotating i-Size seat that covers a wide 40-150 cm height range. Smaller children can travel rear-facing, while later stages use forward-facing configurations as the child grows. The adjustable headrest, four recline positions and padded newborn insert make it a practical option for families who want one seat throughout a Valencia stay.',
     'Moni Serengeti i-Size car seat with integrated base, harness and fitted padding.',
     'For children 40-150 cm. The direction and restraint setup depend on the child''s height. Installation uses ISOFIX and top tether.',
     'Available for collection or delivery to your Valencia accommodation. Share your child''s height and weight and, when available, the car model so we can help with the appropriate setup.',
     'Keep food and drinks away from the seat where possible. Follow the supplied cleaning guidance for the removable cover and padding.',
     'Moni Serengeti Car Seat Rental Valencia',
     'Rent a Moni Serengeti i-Size car seat in Valencia for children 40-150 cm, with 360-degree rotation, ISOFIX and local delivery.', now()),
    (moni_id, 'es',
     'Silla i-Size giratoria para niños de 40 a 150 cm, pensada para acompañarlos desde los primeros viajes hasta la etapa de elevador.',
     'La Moni Serengeti es una silla i-Size con giro de 360 grados y un amplio rango de 40 a 150 cm. Los niños más pequeños viajan a contramarcha y, en etapas posteriores, la silla se utiliza orientada hacia delante. El reposacabezas regulable, las cuatro posiciones de reclinado y el reductor acolchado la convierten en una opción práctica para toda la estancia en Valencia.',
     'Silla Moni Serengeti i-Size con base integrada, arnés y acolchado instalado.',
     'Para niños de 40-150 cm. La orientación y el sistema de sujeción dependen de la altura. Se instala con ISOFIX y top tether.',
     'Disponible para recogida o entrega en tu alojamiento de Valencia. Indica la altura y el peso del niño y, cuando lo sepas, el modelo del coche para ayudarte con la configuración adecuada.',
     'Evita comer o beber en la silla cuando sea posible. Sigue las instrucciones de limpieza de la funda y el acolchado extraíbles.',
     'Alquiler Silla Moni Serengeti Valencia',
     'Alquila una silla Moni Serengeti i-Size en Valencia para niños de 40-150 cm, con giro de 360 grados, ISOFIX y entrega local.', now()),
    (maxi_id, 'en',
     'A lie-flat infant car seat for babies from 40 to 87 cm, supplied without the FamilyFix base and installed with the car''s three-point seat belt.',
     'The Maxi-Cosi Pebble 360 Pro2 is a rear-facing infant carrier for newborns and babies up to 87 cm. Its lie-flat positions, breathable ClimaFlow materials, newborn insert and large sun canopy help keep little passengers comfortable while travelling. This rental does not include the FamilyFix base, so the seat is installed using the vehicle''s three-point seat belt—useful when travelling in a rental car or changing vehicles during your stay.',
     'Maxi-Cosi Pebble 360 Pro2 seat, Baby Hugg newborn insert and integrated sun canopy. FamilyFix base not included.',
     'For babies 40-87 cm and up to 13 kg. Rear-facing use only. Install with the vehicle''s three-point seat belt.',
     'Available for collection or delivery in Valencia. Tell us your dates and your baby''s current height so the seat is ready for your arrival.',
     'The removable cover can be machine washed according to the manufacturer instructions. Keep the harness and buckle free from food and debris.',
     'Maxi-Cosi Infant Car Seat Rental Valencia',
     'Rent a Maxi-Cosi Pebble 360 Pro2 infant car seat in Valencia for babies 40-87 cm. Lie-flat comfort, seat-belt installation and no base required.', now()),
    (maxi_id, 'es',
     'Silla de coche reclinable para bebés de 40 a 87 cm, sin base FamilyFix y con instalación mediante el cinturón de tres puntos del coche.',
     'La Maxi-Cosi Pebble 360 Pro2 es una silla portabebés a contramarcha para recién nacidos y bebés de hasta 87 cm. Sus posiciones reclinadas, los tejidos transpirables ClimaFlow, el reductor y la capota ayudan a que el bebé viaje cómodo. Este alquiler no incluye la base FamilyFix: la silla se instala con el cinturón de tres puntos del vehículo, una solución práctica para coches de alquiler o para cambiar de vehículo durante la estancia.',
     'Silla Maxi-Cosi Pebble 360 Pro2, reductor Baby Hugg y capota integrada. La base FamilyFix no está incluida.',
     'Para bebés de 40-87 cm y hasta 13 kg. Solo a contramarcha. Instalación con el cinturón de tres puntos del vehículo.',
     'Disponible para recogida o entrega en Valencia. Indica las fechas y la altura actual del bebé para tenerla preparada a tu llegada.',
     'La funda extraíble puede lavarse a máquina siguiendo las instrucciones del fabricante. Mantén el arnés y la hebilla libres de restos de comida.',
     'Alquiler Silla Maxi-Cosi Bebé Valencia',
     'Alquila una Maxi-Cosi Pebble 360 Pro2 en Valencia para bebés de 40-87 cm. Reclinable, sin base y con instalación mediante cinturón.', now()),
    (peg_id, 'en',
     'A comfortable forward-facing car seat for children from 9 to 18 kg, with an adjustable headrest, five-point harness and four recline positions.',
     'The Peg Perego Viaggio1 Duo-Fix in Rouge is a padded forward-facing seat for children from 9 to 18 kg. Its five-point harness, adjustable side protection, seven-position headrest and four recline positions combine a secure fit with extra comfort on longer drives around Valencia. The seat can be installed using the vehicle''s three-point seat belt; the compatible Peg Perego ISOFIX base is a separate accessory.',
     'Peg Perego Viaggio1 Duo-Fix car seat in Rouge with integrated five-point harness.',
     'For children from 9 to 18 kg. Forward-facing use. Install with the vehicle''s three-point seat belt unless a compatible Peg Perego base is separately confirmed.',
     'Available for collection or delivery in Valencia. Share your child''s current weight and the car model if known.',
     'Keep the harness and buckle clear and follow the manufacturer instructions when cleaning the removable upholstery.',
     'Peg Perego Car Seat Rental Valencia',
     'Rent a Peg Perego Viaggio1 Duo-Fix car seat in Valencia for children 9-18 kg, with a five-point harness, adjustable headrest and recline.', now()),
    (peg_id, 'es',
     'Silla orientada hacia delante para niños de 9 a 18 kg, con reposacabezas regulable, arnés de cinco puntos y cuatro posiciones de reclinado.',
     'La Peg Perego Viaggio1 Duo-Fix en color Rouge es una silla acolchada orientada hacia delante para niños de 9 a 18 kg. El arnés de cinco puntos, la protección lateral regulable, el reposacabezas con siete posiciones y las cuatro posiciones de reclinado aportan ajuste y comodidad en trayectos por Valencia. Puede instalarse con el cinturón de tres puntos del coche; la base ISOFIX compatible de Peg Perego es un accesorio independiente.',
     'Silla Peg Perego Viaggio1 Duo-Fix en color Rouge con arnés integrado de cinco puntos.',
     'Para niños de 9 a 18 kg. Uso orientado hacia delante. Instalación con el cinturón de tres puntos salvo que se confirme por separado una base Peg Perego compatible.',
     'Disponible para recogida o entrega en Valencia. Indica el peso actual del niño y, si lo sabes, el modelo del coche.',
     'Mantén limpios el arnés y la hebilla y sigue las instrucciones del fabricante para lavar la tapicería extraíble.',
     'Alquiler Silla Peg Perego Valencia',
     'Alquila una Peg Perego Viaggio1 Duo-Fix en Valencia para niños de 9-18 kg, con arnés de cinco puntos, reposacabezas regulable y reclinado.', now()),
    (kinderkraft_id, 'en',
     'A comfortable high-back i-Size seat for children 100 to 150 cm, with ten headrest positions and simple installation using the car''s three-point seat belt.',
     'The Kinderkraft I-SPARK 2 PLUS is a high-back i-Size seat for children from 100 to 150 cm. It uses the car''s three-point seat belt, so it is straightforward to move between suitable vehicles without an ISOFIX base. The ten-position headrest, H-GUARD head protection, SPS side protection and washable cover make it a comfortable option for older children. Above 140 cm, the backrest can be removed and the seat used as a backless booster.',
     'Kinderkraft I-SPARK 2 PLUS i-Size seat with removable backrest and washable cover.',
     'For children 100-150 cm. Install with the vehicle''s three-point seat belt. Backless booster mode is for children above 140 cm.',
     'Available for collection or delivery in Valencia. Share the child''s current height and your rental dates.',
     'The removable cover is machine washable according to the manufacturer instructions. Return the seat dry and free from heavy sand or food residue.',
     'Kinderkraft Car Seat Rental Valencia',
     'Rent a Kinderkraft I-SPARK 2 PLUS i-Size car seat in Valencia for children 100-150 cm, with a high back and simple seat-belt installation.', now()),
    (kinderkraft_id, 'es',
     'Silla i-Size con respaldo alto para niños de 100 a 150 cm, reposacabezas de diez posiciones e instalación sencilla con el cinturón del coche.',
     'La Kinderkraft I-SPARK 2 PLUS es una silla i-Size con respaldo alto para niños de 100 a 150 cm. Se instala con el cinturón de tres puntos del coche, por lo que resulta práctica para cambiarla entre vehículos adecuados sin necesidad de una base ISOFIX. Cuenta con reposacabezas de diez posiciones, protección H-GUARD para la cabeza, protección lateral SPS y funda lavable. A partir de 140 cm puede retirarse el respaldo y utilizarse como elevador.',
     'Silla Kinderkraft I-SPARK 2 PLUS i-Size con respaldo extraíble y funda lavable.',
     'Para niños de 100-150 cm. Instalación con el cinturón de tres puntos del vehículo. El modo elevador sin respaldo es para niños de más de 140 cm.',
     'Disponible para recogida o entrega en Valencia. Indica la altura actual del niño y las fechas del alquiler.',
     'La funda extraíble puede lavarse a máquina siguiendo las instrucciones del fabricante. Devuelve la silla seca y sin restos importantes de arena o comida.',
     'Alquiler Silla Kinderkraft Valencia',
     'Alquila una Kinderkraft I-SPARK 2 PLUS i-Size en Valencia para niños de 100-150 cm, con respaldo alto e instalación mediante cinturón.', now()),
    (booster_id, 'en',
     'A lightweight backless booster for older children, easy to move between cars and installed with the vehicle''s three-point seat belt.',
     'A backless booster is a compact, straightforward option for an older child during a Valencia stay. It sits directly on the vehicle seat and uses the car''s three-point seat belt, making it easy to carry and move between cars. The supplied brand or colour may vary between our functionally equivalent booster seats.',
     'One clean backless booster seat. Brand and colour may vary.',
     'A compact option for an older child who still needs a booster to use the vehicle''s three-point seat belt correctly.',
     'Available for collection or delivery in Valencia. Share the child''s current height and your rental dates.',
     'Keep the belt guides clear and return the booster dry and free from heavy sand or food residue.',
     'Backless Booster Seat Rental Valencia',
     'Rent a lightweight backless booster seat in Valencia for an older child, with simple three-point seat-belt installation and local delivery.', now()),
    (booster_id, 'es',
     'Elevador sin respaldo ligero para niños mayores, fácil de cambiar entre coches y con instalación mediante el cinturón de tres puntos.',
     'Un elevador sin respaldo es una opción compacta y sencilla para un niño mayor durante una estancia en Valencia. Se coloca directamente sobre el asiento y utiliza el cinturón de tres puntos del coche, por lo que resulta fácil de transportar y cambiar de vehículo. La marca o el color pueden variar entre nuestros elevadores funcionalmente equivalentes.',
     'Un elevador sin respaldo limpio. La marca y el color pueden variar.',
     'Para un niño mayor que cumpla la orientación de altura del elevador asignado. Utiliza el cinturón de tres puntos del vehículo.',
     'Disponible para recogida o entrega en Valencia. Indica la altura actual del niño y las fechas del alquiler.',
     'Mantén libres las guías del cinturón y devuelve el elevador seco y sin restos importantes de arena o comida.',
     'Alquiler Elevador Infantil Valencia',
     'Alquila un elevador infantil sin respaldo en Valencia, ligero, fácil de instalar con el cinturón de tres puntos y con entrega local.', now())
  on conflict (product_id, locale) do update set
    short_description = excluded.short_description,
    detail_description = excluded.detail_description,
    includes_text = excluded.includes_text,
    constraints_text = excluded.constraints_text,
    delivery_setup_note = excluded.delivery_setup_note,
    care_note = excluded.care_note,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    updated_at = now();

  delete from public.product_faqs
   where product_id = any(array[moni_id, maxi_id, peg_id, kinderkraft_id, booster_id]::uuid[])
     and locale in ('en', 'es');

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  values
    (moni_id, 'en', 'What child size is the Moni Serengeti for?', 'It covers a broad 40-150 cm height range. The direction and restraint setup change as the child grows, so send us the child''s current height and weight.', 0),
    (moni_id, 'en', 'Does the seat rotate?', 'Yes. The seat rotates through 360 degrees, which makes it easier to place and buckle a younger child.', 1),
    (moni_id, 'en', 'How is it installed?', 'The Serengeti uses ISOFIX and a top tether. If you are hiring a car, send the model when it is assigned so you can plan the installation before arrival.', 2),
    (moni_id, 'es', '¿Para qué talla sirve la Moni Serengeti?', 'Cubre un amplio rango de 40-150 cm. La orientación y la sujeción cambian a medida que crece el niño, por lo que conviene indicar su altura y peso actuales.', 0),
    (moni_id, 'es', '¿La silla es giratoria?', 'Sí. La silla gira 360 grados para facilitar la colocación y el abrochado de los niños más pequeños.', 1),
    (moni_id, 'es', '¿Cómo se instala?', 'La Serengeti utiliza ISOFIX y top tether. Si alquilas un coche, envía el modelo cuando te lo asignen para planificar la instalación antes de llegar.', 2),
    (maxi_id, 'en', 'Is the FamilyFix base included?', 'No. This rental is for the Pebble 360 Pro2 infant carrier without the FamilyFix base.', 0),
    (maxi_id, 'en', 'Can it be installed without the base?', 'Yes. Maxi-Cosi allows the Pebble 360 Pro2 to be installed rear-facing with the vehicle''s three-point seat belt.', 1),
    (maxi_id, 'en', 'What baby size is it for?', 'It is designed from birth to 87 cm, approximately 18 months, with a maximum child weight of 13 kg.', 2),
    (maxi_id, 'es', '¿Está incluida la base FamilyFix?', 'No. El alquiler incluye la silla portabebés Pebble 360 Pro2 sin la base FamilyFix.', 0),
    (maxi_id, 'es', '¿Puede instalarse sin la base?', 'Sí. Maxi-Cosi permite instalar la Pebble 360 Pro2 a contramarcha con el cinturón de tres puntos del vehículo.', 1),
    (maxi_id, 'es', '¿Para qué talla de bebé sirve?', 'Está diseñada desde el nacimiento hasta 87 cm, aproximadamente 18 meses, con un peso máximo de 13 kg.', 2),
    (peg_id, 'en', 'What child size is the Viaggio1 Duo-Fix for?', 'It is designed for children weighing 9-18 kg, approximately one to four years old.', 0),
    (peg_id, 'en', 'Does the seat recline?', 'Yes. It has four recline positions and a seven-position adjustable headrest.', 1),
    (peg_id, 'en', 'How is it installed?', 'The seat can be secured with the vehicle''s three-point seat belt. A compatible Peg Perego ISOFIX base is a separate accessory.', 2),
    (peg_id, 'es', '¿Para qué niño sirve la Viaggio1 Duo-Fix?', 'Está diseñada para niños de 9-18 kg, aproximadamente de uno a cuatro años.', 0),
    (peg_id, 'es', '¿La silla se reclina?', 'Sí. Tiene cuatro posiciones de reclinado y un reposacabezas regulable en siete posiciones.', 1),
    (peg_id, 'es', '¿Cómo se instala?', 'La silla puede fijarse con el cinturón de tres puntos del vehículo. La base ISOFIX compatible de Peg Perego es un accesorio independiente.', 2),
    (kinderkraft_id, 'en', 'What child size is the I-SPARK 2 PLUS for?', 'Kinderkraft lists it for children from 100 to 150 cm, approximately 3.5 to 12 years.', 0),
    (kinderkraft_id, 'en', 'Does it need ISOFIX?', 'No. It installs using the vehicle''s three-point seat belt, so no ISOFIX base is required.', 1),
    (kinderkraft_id, 'en', 'Can the backrest be removed?', 'Yes. Kinderkraft allows backless booster use for children above 140 cm, following the product instructions.', 2),
    (kinderkraft_id, 'es', '¿Para qué talla sirve la I-SPARK 2 PLUS?', 'Kinderkraft la indica para niños de 100 a 150 cm, aproximadamente de 3,5 a 12 años.', 0),
    (kinderkraft_id, 'es', '¿Necesita ISOFIX?', 'No. Se instala con el cinturón de tres puntos del vehículo, por lo que no necesita una base ISOFIX.', 1),
    (kinderkraft_id, 'es', '¿Se puede quitar el respaldo?', 'Sí. Kinderkraft permite utilizarla como elevador sin respaldo para niños de más de 140 cm, siguiendo las instrucciones.', 2),
    (booster_id, 'en', 'Who is a backless booster for?', 'It is a compact option for an older child who still needs a booster to use the vehicle''s three-point seat belt correctly. Share the child''s height when booking.', 0),
    (booster_id, 'en', 'How is it installed?', 'The booster sits on the vehicle seat and the child uses the car''s three-point seat belt.', 1),
    (booster_id, 'en', 'Will I receive the exact brand shown?', 'The supplied brand or colour may vary, but the booking is for the same lightweight backless-booster type.', 2),
    (booster_id, 'es', '¿Para quién es un elevador sin respaldo?', 'Está pensado para un niño mayor que cumpla la orientación de altura del elevador asignado. Indica la altura actual al reservar.', 0),
    (booster_id, 'es', '¿Cómo se instala?', 'El elevador se coloca sobre el asiento y el niño utiliza el cinturón de tres puntos del coche.', 1),
    (booster_id, 'es', '¿Recibiré exactamente la marca de la foto?', 'La marca o el color pueden variar, pero la reserva corresponde al mismo tipo de elevador ligero sin respaldo.', 2);

  delete from public.product_images
   where product_id = any(array[moni_id, maxi_id, kinderkraft_id]::uuid[]);

  insert into public.product_images
    (product_id, image_url, alt_text, source_url, rights_status, is_primary, sort_order)
  values
    (moni_id, moni_image, 'Moni Serengeti i-Size rotating car seat, 40-150 cm', 'https://moni.bg/en/products/product_id/9619/stol-za-kola-serengeti-40-150sm-svetlosiv', 'unknown', true, 0),
    (maxi_id, maxi_image, 'Maxi-Cosi Pebble 360 Pro2 infant car seat without base', 'https://www.maxi-cosi.es/sillas-de-coche/pebble-360-pro2', 'unknown', true, 0),
    (kinderkraft_id, kinderkraft_image, 'Kinderkraft I-SPARK 2 PLUS i-Size high-back car seat', 'https://kinderkraft.es/productos/i-spark-2-plus-i-size?color=gris', 'unknown', true, 0);

  update public.product_images
     set alt_text = 'Peg Perego Viaggio1 Duo-Fix car seat in Rouge',
         source_url = 'https://www.pegperego.com/media/catalog/product/download/Viaggio1Duo-FixK_FI001801I128.pdf'
   where product_id = peg_id and is_primary = true;

  update public.product_images
     set alt_text = 'Lightweight backless booster seat for an older child',
         source_url = null
   where product_id = booster_id and is_primary = true;

  if exists (
    select 1
      from public.products p
      left join public.product_localizations l on l.product_id = p.id
     where p.id = any(array[moni_id, maxi_id, peg_id, kinderkraft_id, booster_id]::uuid[])
       and concat_ws(' ', p.name, p.brand, p.description, l.short_description, l.detail_description, l.seo_title, l.seo_description)
           ~* 'britax|evolvafix|unico evo|chicco|i-boost|physical approval label|stored [0-9]|supplied only after'
  ) then
    raise exception 'Stale false identity or operational copy remains in corrected car-seat content';
  end if;
end
$$;
