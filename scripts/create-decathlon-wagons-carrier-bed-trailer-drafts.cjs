const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const products = [
  {
    categorySlug: "travel-outdoors",
    slug: "aquastic-folding-transport-wagon",
    name: "AQUASTIC Folding Transport Wagon",
    brand: "AQUASTIC",
    subcategory: "Beach Wagons",
    subcategorySlug: "beach-wagons",
    emoji: "🛒",
    sourceUrl: "https://www.decathlon.es/es/p/mp/carrito-de-transporte-aquastic/52b9d206-2954-4a78-a614-a63f0095a1ad/c5",
    sourceImageUrl: "https://contents.mediadecathlon.com/m23367211/k$8e46f70cf5af77b7a3af0c7fc9bb72fe/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Blue AQUASTIC folding transport wagon with canopy and large wheels",
    description: "A folding equipment wagon with a steel frame, polyester body, canopy, storage bag and wide PU wheels for outdoor transport.",
    features: ["Folding steel frame", "Removable polyester body", "Large wide PU wheels", "Integrated canopy", "Ergonomic pull handle", "Additional folding storage bag"],
    specs: { Brand: "AQUASTIC", Colour: "Blue", Frame: "Steel", Body: "Polyester", Wheels: "Wide PU wheels", Canopy: "Integrated", Foldable: "Yes", "Child transport": "Not approved pending manual and certification review" },
    en: {
      short: "Rent a folding AQUASTIC transport wagon in Valencia for moving beach, picnic and outdoor equipment more easily.",
      detail: "The AQUASTIC folding wagon is designed to reduce repeated carrying between your accommodation, car and outdoor destination. Its steel frame supports a removable polyester body, while the large, wide PU wheels are intended for grass and sand. An ergonomic handle, integrated canopy and additional folding bag make it practical for beach equipment, picnic supplies and family gear around Valencia. The supplier page shows restraint straps, but it does not provide the certification, age range or verified load data needed to approve the wagon for carrying children. This rental draft therefore treats it strictly as an equipment wagon until the physical manual is checked.",
      includes: "One AQUASTIC folding wagon with polyester body, canopy and storage bag. Loose equipment is not included.",
      constraints: "Equipment transport only. Do not carry children or animals unless the exact unit's manual and certification are verified. Maximum load and folded dimensions must be confirmed before activation.",
      setup: "Choose an available Valencia pickup or delivery option. Open the frame completely, attach the body correctly and check the wheels and handle before loading.",
      care: "Remove sand and debris, wipe the frame and fabric, dry completely and return the wagon folded with its bag.",
      title: "Rent a Folding Beach Wagon in Valencia",
      meta: "Rent an AQUASTIC folding wagon in Valencia for beach and picnic equipment, with wide wheels, canopy, steel frame and compact storage.",
      faqs: [["Can it be used to carry children?", "Not in this rental configuration. Child use remains blocked until the exact manual, certification and limits are verified."], ["Is it suitable for sand?", "The supplier describes its wide PU wheels as suitable for grass and sand, although performance varies with load and sand conditions."], ["Does it fold for transport?", "Yes. The frame folds compactly and the set includes an additional storage bag."]],
    },
    es: {
      short: "Alquila un carro plegable AQUASTIC en Valencia para transportar con más facilidad material de playa, pícnic y exterior.",
      detail: "El carro plegable AQUASTIC ayuda a reducir los trayectos cargando material entre el alojamiento, el coche y el destino. La estructura de acero sostiene un cuerpo extraíble de poliéster y las ruedas anchas de PU están pensadas para césped y arena. El asa ergonómica, el toldo integrado y la bolsa plegable adicional lo hacen práctico para material de playa, pícnic y equipamiento familiar en Valencia. La página del proveedor muestra correas, pero no aporta certificación, rango de edad ni carga verificada suficientes para aprobar el transporte de niños. Por ello, este borrador lo considera exclusivamente un carro para material hasta revisar el manual físico.",
      includes: "Un carro plegable AQUASTIC con cuerpo de poliéster, toldo y bolsa. No incluye el material transportado.",
      constraints: "Solo para transportar material. No llevar niños ni animales hasta verificar el manual y la certificación de la unidad exacta. Confirmar carga máxima y medidas plegado antes de activar.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Abre totalmente la estructura, fija correctamente el cuerpo y revisa ruedas y asa antes de cargar.",
      care: "Retira arena y residuos, limpia estructura y tejido, seca por completo y devuelve el carro plegado con su bolsa.",
      title: "Alquiler Carro Playa Plegable en Valencia",
      meta: "Alquila un carro AQUASTIC plegable en Valencia para material de playa y pícnic, con ruedas anchas, toldo, acero y almacenamiento compacto.",
      faqs: [["¿Se puede utilizar para transportar niños?", "No en esta configuración de alquiler. El uso infantil queda bloqueado hasta verificar manual, certificación y límites exactos."], ["¿Es adecuado para arena?", "El proveedor describe las ruedas anchas de PU como aptas para césped y arena, aunque el rendimiento depende de la carga y el estado de la arena."], ["¿Se pliega para transportarlo?", "Sí. La estructura se pliega de forma compacta e incluye una bolsa adicional."]],
    },
  },
  {
    categorySlug: "travel-outdoors",
    slug: "aktive-360-beach-wagon-with-table",
    name: "Aktive 360° Beach Wagon with Removable Table",
    brand: "Aktive",
    subcategory: "Beach Wagons",
    subcategorySlug: "beach-wagons",
    emoji: "🛒",
    sourceUrl: "https://www.decathlon.es/es/p/mp/aktive-carro-playa-con-mesa-desmontable-y-ruedas-grandes-360/65c3007c-3eca-4222-b701-192fd6522dbd/c1?offerId=33236033",
    sourceImageUrl: "https://contents.mediadecathlon.com/m16514256/k$dce14109d0e0c6c702c9ccd9b8a06aea/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Black Aktive folding beach wagon with removable tabletop and large wheels",
    description: "A 2-in-1 folding beach wagon with removable tabletop, washable polyester body, adjustable handle and listed 100 kg load capacity.",
    features: ["Convertible wagon and removable table", "Listed 100 kg load capacity", "Steel frame", "Removable washable polyester body", "Two universal and two 360° wheels with brakes", "Accordion fold and transport bag"],
    specs: { Brand: "Aktive", Colour: "Black", "Maximum load": "100 kg", Frame: "Steel", Body: "Removable washable polyester", Wheels: "4 large wheels; 2 universal and 2 rotating 360° with brakes", Handle: "Ergonomic and multi-angle adjustable", Fold: "Accordion style", Storage: "Main compartment and additional pocket" },
    en: {
      short: "Rent a 100 kg Aktive beach wagon in Valencia with large wheels, brakes and a removable tabletop.",
      detail: "This Aktive 2-in-1 wagon moves chairs, umbrellas, coolers and other bulky outdoor equipment, then converts into a practical table using its removable top. The supplier lists a maximum load of 100 kg. Its solid steel frame carries a removable, washable polyester body with a large main compartment and an extra pocket for smaller items. Four large wheels include two universal wheels and two 360-degree swivel wheels with brakes, while the ergonomic handle adjusts through multiple angles. The frame folds accordion-style using the central handle and stores in the supplied transport bag.",
      includes: "One Aktive wagon, removable tabletop and transport bag. Beach equipment shown in use is not included.",
      constraints: "Maximum listed load 100 kg. For equipment only, not passengers. Apply both wheel brakes when stationary and use the table only on stable, level ground.",
      setup: "Choose an available Valencia pickup or delivery option. Open the frame fully, secure the fabric body and tabletop, then test the brakes and handle before loading.",
      care: "Empty every pocket, remove sand, wipe or wash the removable fabric as instructed, dry completely and return folded in its bag.",
      title: "Rent a Beach Wagon with Table in Valencia",
      meta: "Rent an Aktive 2-in-1 beach wagon in Valencia with removable table, 100 kg listed load, large 360° wheels, brakes and folding bag.",
      faqs: [["What can the wagon carry?", "It is intended for equipment such as chairs, umbrellas and coolers, with a supplier-listed maximum load of 100 kg."], ["Does it become a table?", "Yes. A removable tabletop converts the wagon into an outdoor surface when parked securely."], ["Do the wheels have brakes?", "The supplier describes two rotating 360-degree wheels with brakes alongside two universal wheels."]],
    },
    es: {
      short: "Alquila un carro de playa Aktive de 100 kg en Valencia con ruedas grandes, frenos y mesa desmontable.",
      detail: "Este carro Aktive 2 en 1 transporta sillas, sombrillas, neveras y otro material voluminoso y se convierte en mesa mediante el tablero desmontable. El proveedor indica una carga máxima de 100 kg. La estructura de acero sostiene un cuerpo de poliéster extraíble y lavable con compartimento principal y bolsillo adicional. Las cuatro ruedas grandes incluyen dos universales y dos giratorias 360 grados con freno, mientras que el asa ergonómica se regula en varios ángulos. La estructura se pliega tipo acordeón mediante el asa central y se guarda en la bolsa incluida.",
      includes: "Un carro Aktive, tablero desmontable y bolsa de transporte. No incluye el material mostrado en uso.",
      constraints: "Carga máxima indicada de 100 kg. Solo para material, no pasajeros. Accionar ambos frenos al estacionar y utilizar la mesa sobre terreno estable y nivelado.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Abre completamente la estructura, fija cuerpo y tablero y comprueba frenos y asa antes de cargar.",
      care: "Vacía todos los bolsillos, retira la arena, limpia el tejido extraíble según instrucciones, seca por completo y devuelve plegado en su bolsa.",
      title: "Alquiler Carro Playa con Mesa Valencia",
      meta: "Alquila un carro Aktive 2 en 1 en Valencia con mesa desmontable, carga indicada de 100 kg, ruedas 360°, frenos y bolsa plegable.",
      faqs: [["¿Qué puede transportar?", "Está pensado para material como sillas, sombrillas y neveras, con una carga máxima indicada por el proveedor de 100 kg."], ["¿Se convierte en mesa?", "Sí. El tablero desmontable convierte el carro en una superficie exterior cuando está bien estacionado."], ["¿Las ruedas tienen freno?", "El proveedor describe dos ruedas giratorias 360 grados con freno y dos ruedas universales."]],
    },
  },
  {
    categorySlug: "baby-gear",
    slug: "deuter-kid-comfort-child-carrier",
    name: "Deuter Kid Comfort Child Carrier",
    brand: "Deuter",
    subcategory: "Child Carriers",
    subcategorySlug: "child-carriers",
    emoji: "🎒",
    sourceUrl: "https://www.decathlon.es/es/p/portabebes-rigido-deuter-kid-comfort/X8746948/m8746948",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2130355/k$9998127cb5c4ebf33f4dfede24fde11c/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Deuter Kid Comfort structured child carrier backpack",
    description: "A TÜV GS-certified structured child carrier with adjustable fit, integrated sunshade and a listed 18 kg child plus 4 kg luggage capacity.",
    features: ["TÜV GS safety certification", "Aircomfort Sensic Vario back system", "VariFlex hip stabilisers and VariSlide adjustment", "Integrated UV sunshade", "Height-adjustable child seat and footrests", "Foldable support frame and carry handles"],
    specs: { Brand: "Deuter", Model: "Kid Comfort", "Carrier weight": "3.23 kg", "Maximum child weight": "18 kg", "Maximum luggage": "4 kg", "Minimum age": "Approximately 9 months and able to sit independently", Certification: "TÜV GS", Fabric: "210D polyamide", "Water resistance": "1500 mm", Treatment: "PFC-free water-repellent finish", "Rain cover": "Not included", "Hydration bladder": "Not included" },
    en: {
      short: "Rent a Deuter Kid Comfort carrier in Valencia with TÜV GS certification, adjustable support and integrated sunshade.",
      detail: "The Deuter Kid Comfort is a structured carrier for children who can already sit and support themselves independently, generally from around nine months. Its Aircomfort Sensic Vario back, VariFlex hip stabilisers and VariSlide torso adjustment distribute the listed 3.23 kg carrier weight across the adult wearer. The child seat and footrests adjust for fit, while the integrated sunshade adds protection during Valencia outings. The supplier lists a maximum child weight of 18 kg plus 4 kg of luggage and TÜV GS safety certification. A foldable support frame and two handles assist loading, but every adjustment and buckle must be checked against the manual before use.",
      includes: "One Deuter Kid Comfort carrier with integrated sunshade. Rain cover and hydration bladder are not included.",
      constraints: "Only for a child who can sit upright and support their head independently, approximately from 9 months. Child maximum 18 kg plus 4 kg luggage. Fit and buckle checks are mandatory before every use.",
      setup: "Choose an available Valencia pickup or delivery option. Adjust the adult back length first, place the carrier on stable ground, fit the child seat and footrests, then secure every buckle before lifting.",
      care: "Remove loose items, wipe contact surfaces, dry fully and return with all straps, buckles and the integrated sunshade intact.",
      title: "Rent a Deuter Child Carrier in Valencia",
      meta: "Rent a Deuter Kid Comfort carrier in Valencia with TÜV GS certification, integrated sunshade, adjustable fit and 18 kg child capacity.",
      faqs: [["When can a child use this carrier?", "The child must be able to sit and hold their head independently; the supplier indicates approximately nine months and older."], ["What are the weight limits?", "The listed limits are 18 kg for the child and 4 kg for luggage."], ["Is a rain cover included?", "No. The integrated sunshade is included, but the rain cover and hydration bladder are not."]],
    },
    es: {
      short: "Alquila un portabebés Deuter Kid Comfort en Valencia con certificación TÜV GS, ajuste regulable y toldo integrado.",
      detail: "El Deuter Kid Comfort es un portabebés estructurado para niños que ya se sientan y sostienen la cabeza de forma independiente, generalmente desde unos nueve meses. El respaldo Aircomfort Sensic Vario, los estabilizadores de cadera VariFlex y el ajuste de torso VariSlide reparten los 3,23 kg indicados del portabebés sobre el adulto. El asiento infantil y los reposapiés se regulan y el toldo integrado añade protección durante las salidas por Valencia. El proveedor indica un máximo de 18 kg para el niño más 4 kg de equipaje y certificación TÜV GS. La base plegable y las dos asas facilitan la colocación, pero todos los ajustes y hebillas deben revisarse con el manual antes de usarlo.",
      includes: "Un portabebés Deuter Kid Comfort con toldo integrado. No incluye funda de lluvia ni bolsa de hidratación.",
      constraints: "Solo para un niño capaz de sentarse erguido y sostener la cabeza, aproximadamente desde 9 meses. Máximo 18 kg de niño más 4 kg de equipaje. Revisar ajuste y hebillas antes de cada uso.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Ajusta primero la espalda del adulto, coloca el portabebés sobre suelo estable, regula asiento y reposapiés y cierra todas las hebillas antes de levantarlo.",
      care: "Retira objetos, limpia las superficies de contacto, seca por completo y devuelve con correas, hebillas y toldo integrado intactos.",
      title: "Alquiler Portabebés Deuter en Valencia",
      meta: "Alquila un Deuter Kid Comfort en Valencia con certificación TÜV GS, toldo integrado, ajuste regulable y capacidad infantil de 18 kg.",
      faqs: [["¿Cuándo puede utilizarlo un niño?", "Debe poder sentarse y sostener la cabeza de forma independiente; el proveedor indica aproximadamente desde nueve meses."], ["¿Cuáles son los límites de peso?", "Los límites indicados son 18 kg para el niño y 4 kg para equipaje."], ["¿Incluye funda de lluvia?", "No. Incluye el toldo integrado, pero no la funda de lluvia ni la bolsa de hidratación."]],
    },
  },
  {
    categorySlug: "home-living",
    slug: "intex-ultra-plush-queen-air-bed",
    name: "INTEX Ultra Plush Queen Air Bed with Headboard",
    brand: "INTEX",
    subcategory: "Guest Beds",
    subcategorySlug: "guest-beds",
    emoji: "🛏️",
    sourceUrl: "https://www.decathlon.es/es/p/cama-de-aire-intex-con-cabecero-dura-beam-deluxe-ultra-plush-queen-cd/X9022630/m9022630",
    sourceImageUrl: "https://contents.mediadecathlon.com/p3027110/k$68725e14ef514873044212325802efcf/picture.jpg?format=auto&f=1920x0",
    imageAlt: "INTEX Dura-Beam Deluxe Ultra Plush queen air bed with headboard",
    description: "A 152 × 236 × 46 cm indoor queen air bed for two people with headboard, Fiber-Tech structure and integrated electric pump.",
    features: ["152 × 236 × 46 cm inflated size", "Capacity for two people", "272 kg listed maximum load", "Integrated electric pump", "Raised headboard", "Fiber-Tech interior and flocked ribbed surface"],
    specs: { Brand: "INTEX", Range: "Dura-Beam Deluxe", Model: "Ultra Plush Queen with headboard", Dimensions: "152 × 236 × 46 cm", Capacity: "2 people", "Maximum load": "272 kg", Pump: "Integrated electric pump", Material: "Laminated PVC with flocked ribbed surface", Structure: "Fiber-Tech", Use: "Indoor only" },
    en: {
      short: "Rent an INTEX queen air bed in Valencia for two indoor guests, with integrated electric pump and raised headboard.",
      detail: "The INTEX Dura-Beam Deluxe Ultra Plush Queen provides a temporary indoor sleeping surface for two guests. Inflated dimensions are 152 × 236 cm with a 46 cm height that makes getting in and out easier than a low camping mattress. The raised headboard supports reading and helps keep pillows in place. Fiber-Tech internal construction supports the laminated PVC body and the ribbed, flocked sleeping surface. The supplier lists a maximum load of 272 kg and includes an integrated electric pump for inflation and deflation. Confirm suitable floor space and access to a compatible indoor power socket before delivery.",
      includes: "One INTEX Ultra Plush Queen air bed with integrated electric pump. Bedding and pillows are not included.",
      constraints: "Indoor use only. Maximum listed load 272 kg shared across two people. Keep away from sharp objects, water and heat, and never operate the pump while wet.",
      setup: "Choose an available Valencia pickup or delivery option. Clear a 152 × 236 cm floor area, inspect for sharp objects, position the bed and use the integrated pump according to the manual.",
      care: "Use clean bedding, keep liquids away, deflate with the pump, wipe clean and return completely dry and carefully folded.",
      title: "Rent a Queen Air Bed in Valencia",
      meta: "Rent an INTEX queen air bed in Valencia for two guests, with 152 × 236 cm surface, 46 cm height, headboard and integrated electric pump.",
      faqs: [["How large is the bed?", "The supplier lists inflated dimensions of 152 × 236 cm and a height of 46 cm."], ["Is a pump included?", "Yes. An electric inflation and deflation pump is integrated into the bed."], ["Can it be used outdoors?", "No. This model is specified for indoor use and must be protected from moisture and sharp ground."]],
    },
    es: {
      short: "Alquila una cama hinchable INTEX Queen en Valencia para dos huéspedes, con bomba eléctrica integrada y cabecero elevado.",
      detail: "La INTEX Dura-Beam Deluxe Ultra Plush Queen ofrece una superficie temporal para dormir en interiores para dos huéspedes. Inflada mide 152 × 236 cm y tiene 46 cm de altura, facilitando el acceso frente a una colchoneta baja. El cabecero elevado sirve de apoyo para leer y ayuda a mantener las almohadas en su sitio. La estructura interior Fiber-Tech refuerza el cuerpo de PVC laminado y la superficie acanalada y aterciopelada. El proveedor indica una carga máxima de 272 kg e incluye una bomba eléctrica integrada para inflar y desinflar. Hay que confirmar espacio suficiente y acceso a un enchufe interior compatible antes de la entrega.",
      includes: "Una cama INTEX Ultra Plush Queen con bomba eléctrica integrada. No incluye ropa de cama ni almohadas.",
      constraints: "Solo para interior. Carga máxima indicada de 272 kg entre dos personas. Mantener lejos de objetos afilados, agua y calor y no accionar la bomba con humedad.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Despeja un espacio de 152 × 236 cm, comprueba que no haya objetos punzantes, coloca la cama y utiliza la bomba según el manual.",
      care: "Utiliza ropa de cama limpia, evita líquidos, desinfla con la bomba, limpia y devuelve completamente seca y bien plegada.",
      title: "Alquiler Cama Hinchable Queen Valencia",
      meta: "Alquila una cama INTEX Queen en Valencia para dos, con superficie de 152 × 236 cm, 46 cm de altura, cabecero y bomba eléctrica integrada.",
      faqs: [["¿Qué tamaño tiene la cama?", "El proveedor indica 152 × 236 cm inflada y una altura de 46 cm."], ["¿Incluye bomba?", "Sí. La bomba eléctrica para inflar y desinflar está integrada en la cama."], ["¿Se puede utilizar en exterior?", "No. Este modelo está especificado para interior y debe protegerse de humedad y suelos afilados."]],
    },
  },
  {
    categorySlug: "kids-family",
    slug: "hamax-pionner-child-bike-trailer",
    name: "Hamax Pionner Two-Child Bike Trailer",
    brand: "Hamax",
    subcategory: "Child Bike Trailers",
    subcategorySlug: "child-bike-trailers",
    emoji: "🚲",
    sourceUrl: "https://www.decathlon.es/es/p/remolque-hamax-pionner-azul-marino/X8837213/m8837213",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2488391/k$09a73e4d1bb0f22d29f9d150ca120120/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Navy Hamax Pionner two-child bicycle trailer and stroller",
    description: "A suspended two-child bicycle trailer and stroller with reclining seats, 20-inch wheels, weather protection and rear storage.",
    features: ["Two forward-facing child seats", "Two safety harnesses", "Suspension system", "Bike trailer and stroller functions", "Reclining seats", "20-inch quick-release wheels"],
    specs: { Brand: "Hamax", "Source model spelling": "Pionner", Seats: "2", "Open dimensions": "108 × 95 × 86 cm", "Folded dimensions": "108 × 81 × 30 cm", Weight: "20 kg", "Maximum child weight": "22 kg", "Maximum cargo": "40 kg", "Maximum loaded trailer weight": "60 kg", "Maximum speed": "24 km/h", "Minimum age listed": "6 months", "Maximum child height": "117 cm", "Bike compatibility listed": "26–28 inch wheels" },
    en: {
      short: "Rent a Hamax two-child bike trailer in Valencia with suspension, reclining seats and stroller mode.",
      detail: "The Hamax Pionner source listing describes a suspended trailer for two forward-facing children with separate safety harnesses, reclining seats and storage behind the cabin. PVC side and roof windows, a sunshade and integrated shower protection provide weather coverage; a full rain cover is optional and not included. The 20-inch wheels release by button, and the removable rear-wheel hitch is listed for bicycles with 26–28 inch wheels. Open dimensions are 108 × 95 × 86 cm, folded dimensions 108 × 81 × 30 cm and weight 20 kg. The source lists a 22 kg maximum child weight, 40 kg cargo load, 60 kg maximum loaded trailer weight, 24 km/h maximum speed and 117 cm maximum child height. Activation requires inspection of the physical manual, hitch compatibility and complete safety equipment.",
      includes: "One Hamax Pionner trailer, two seats and harnesses, stroller wheel, bike arm and compatible hitch components present with the inspected unit. Optional ski, running and full rain-cover kits are not included.",
      constraints: "Do not activate until the exact manual, model identity, hitch parts and safety inspection are confirmed. Never exceed 24 km/h or the listed load limits. The source's six-month minimum must not be applied to cycling without manual-specific confirmation.",
      setup: "After approval, select pickup or delivery and provide the bicycle details. Staff must verify wheel size, axle and hitch compatibility, install the connection and safety strap and demonstrate all harnesses and brakes.",
      care: "Remove belongings, brush away sand and dirt, wipe the cabin and frame, dry fully and return every hitch, wheel and safety component.",
      title: "Rent a Child Bike Trailer in Valencia",
      meta: "Rent a Hamax two-child bike trailer in Valencia with suspension, reclining seats, stroller mode, 20-inch wheels and rear storage.",
      faqs: [["How many children can it carry?", "The source lists two forward-facing seats with separate safety harnesses, subject to the stated individual and total load limits."], ["Will it fit any bicycle?", "No. The source mentions 26–28 inch bicycles, but axle and hitch compatibility must be checked for the exact bicycle before use."], ["Can a six-month-old ride while cycling?", "Not automatically. The source lists six months as a minimum, but cycling use requires confirmation from the exact model manual and may require additional approved support."]],
    },
    es: {
      short: "Alquila un remolque Hamax para dos niños en Valencia con suspensión, asientos reclinables y modo cochecito.",
      detail: "La ficha del Hamax Pionner describe un remolque con suspensión para dos niños sentados hacia delante, con arneses separados, asientos reclinables y espacio de carga trasero. Las ventanas laterales y de techo de PVC, el parasol y la protección integrada frente a chaparrones aportan cobertura; la funda completa de lluvia es opcional y no está incluida. Las ruedas de 20 pulgadas se desmontan mediante botón y el enganche extraíble al eje trasero figura para bicicletas de 26–28 pulgadas. Mide 108 × 95 × 86 cm abierto, 108 × 81 × 30 cm plegado y pesa 20 kg. La fuente indica 22 kg de peso máximo infantil, 40 kg de carga, 60 kg de peso máximo total, velocidad máxima de 24 km/h y altura infantil máxima de 117 cm. La activación requiere revisar manual físico, compatibilidad del enganche y equipo de seguridad completo.",
      includes: "Un remolque Hamax Pionner, dos asientos y arneses, rueda de paseo, brazo de bicicleta y componentes de enganche presentes en la unidad inspeccionada. No incluye kits opcionales de esquí, running o funda completa de lluvia.",
      constraints: "No activar hasta confirmar manual exacto, identidad del modelo, piezas de enganche e inspección de seguridad. No superar 24 km/h ni los límites de carga. El mínimo de seis meses de la fuente no debe aplicarse al ciclismo sin confirmación específica del manual.",
      setup: "Tras aprobarlo, elige recogida o entrega e indica los datos de la bicicleta. El personal debe verificar rueda, eje y enganche, instalar conexión y correa de seguridad y explicar arneses y frenos.",
      care: "Retira pertenencias, elimina arena y suciedad, limpia cabina y estructura, seca por completo y devuelve todas las piezas de enganche, ruedas y seguridad.",
      title: "Alquiler Remolque Bicicleta Infantil Valencia",
      meta: "Alquila un remolque Hamax para dos niños en Valencia con suspensión, asientos reclinables, modo cochecito, ruedas de 20 pulgadas y carga trasera.",
      faqs: [["¿Cuántos niños puede llevar?", "La fuente indica dos asientos orientados hacia delante con arneses separados, respetando los límites individuales y totales."], ["¿Sirve para cualquier bicicleta?", "No. La fuente menciona bicicletas de 26–28 pulgadas, pero hay que comprobar eje y enganche de la bicicleta exacta."], ["¿Puede viajar en bicicleta un bebé de seis meses?", "No automáticamente. La fuente indica seis meses como mínimo, pero el uso en bicicleta exige confirmar el manual exacto y puede requerir soporte homologado adicional."]],
    },
  },
];

function extensionFor(contentType) {
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/png") return "png";
  return "jpg";
}

async function writeLocalizedContent(client, productId, product) {
  for (const [locale, content] of [["en", product.en], ["es", product.es]]) {
    await client.query(
      `insert into product_localizations
        (product_id, locale, short_description, detail_description, includes_text, constraints_text,
         delivery_setup_note, care_note, seo_title, seo_description)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [productId, locale, content.short, content.detail, content.includes, content.constraints,
        content.setup, content.care, content.title, content.meta],
    );
    for (const [sortOrder, [question, answer]] of content.faqs.entries()) {
      await client.query(
        "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1,$2,$3,$4,$5)",
        [productId, locale, question, answer, sortOrder],
      );
    }
  }
}

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const categoryRows = await client.query("select id, slug from categories where slug = any($1)", [[...new Set(products.map((product) => product.categorySlug))]]);
  const categoryIds = new Map(categoryRows.rows.map((row) => [row.slug, row.id]));
  if (categoryIds.size !== new Set(products.map((product) => product.categorySlug)).size) throw new Error("One or more product categories were not found");

  const created = [];
  for (const product of products) {
    const duplicate = await client.query("select id from products where slug = $1", [product.slug]);
    if (duplicate.rowCount > 0) {
      const productId = duplicate.rows[0].id;
      await client.query("begin");
      try {
        await client.query(
          `update products set
             name=$2, brand=$3, description=$4, emoji=$5, category_id=$6, subcategory=$7,
             subcategory_slug=$8, stock_total=0, stock_available=0, is_active=false,
             meta_title=$9, meta_description=$10, features=$11::jsonb, specs=$12::jsonb,
             content_status='facts_verified'
           where id=$1`,
          [productId, product.name, product.brand, product.description, product.emoji,
            categoryIds.get(product.categorySlug), product.subcategory, product.subcategorySlug,
            product.en.title, product.en.meta, JSON.stringify(product.features), JSON.stringify(product.specs)],
        );
        await client.query("delete from product_faqs where product_id=$1", [productId]);
        await client.query("delete from product_localizations where product_id=$1", [productId]);
        await writeLocalizedContent(client, productId, product);
        await client.query("update pricing_tiers set per_day_cents=0 where product_id=$1", [productId]);
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
      created.push({ id: productId, slug: product.slug, existing: true, refreshed: true });
      continue;
    }

    const response = await fetch(product.sourceImageUrl);
    if (!response.ok) throw new Error(`Image download failed for ${product.slug}: ${response.status}`);
    const contentType = (response.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error(`Image source was not an image for ${product.slug}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const storagePath = `${product.slug}/${Date.now()}-primary.${extensionFor(contentType)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, bytes, { contentType, upsert: false });
    if (uploadError) throw uploadError;
    const imageUrl = supabase.storage.from("product-images").getPublicUrl(storagePath).data.publicUrl;

    try {
      await client.query("begin");
      const inserted = await client.query(
        `insert into products
          (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug,
           city, stock_total, stock_available, is_active, meta_title, meta_description, features, specs, content_status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'valencia',0,0,false,$10,$11,$12::jsonb,$13::jsonb,'facts_verified')
         returning id`,
        [product.slug, product.name, product.brand, product.description, product.emoji, imageUrl,
          categoryIds.get(product.categorySlug), product.subcategory, product.subcategorySlug, product.en.title, product.en.meta,
          JSON.stringify(product.features), JSON.stringify(product.specs)],
      );
      const productId = inserted.rows[0].id;
      await client.query("insert into pricing_tiers (product_id, min_days, per_day_cents) values ($1,1,0)", [productId]);

      await writeLocalizedContent(client, productId, product);

      await client.query(
        `insert into product_images
          (product_id, image_url, alt_text, source_url, rights_status, is_primary, sort_order)
         values ($1,$2,$3,$4,'unknown',true,0)`,
        [productId, imageUrl, product.imageAlt, product.sourceUrl],
      );
      await client.query("commit");
      created.push({ id: productId, slug: product.slug, imageUrl, active: false });
    } catch (error) {
      await client.query("rollback");
      await supabase.storage.from("product-images").remove([storagePath]);
      throw error;
    }
  }

  const verification = await client.query(
    `select p.id, p.slug, p.is_active, p.content_status, p.stock_total, p.stock_available, p.image_url,
      count(distinct pl.locale) as localization_count,
      count(distinct pf.id) as faq_count,
      count(distinct pi.id) filter (where pi.is_primary) as primary_image_count,
      count(distinct pt.id) as pricing_count
     from products p
     left join product_localizations pl on pl.product_id = p.id
     left join product_faqs pf on pf.product_id = p.id
     left join product_images pi on pi.product_id = p.id
     left join pricing_tiers pt on pt.product_id = p.id
     where p.slug = any($1)
     group by p.id
     order by p.slug`,
    [products.map((product) => product.slug)],
  );
  await client.end();

  if (verification.rowCount !== products.length) throw new Error("Post-import verification did not find all five products");
  for (const row of verification.rows) {
    if (row.is_active || row.content_status !== "facts_verified" || Number(row.stock_total) !== 0
      || Number(row.stock_available) !== 0 || row.localization_count !== "2" || Number(row.faq_count) !== 6
      || Number(row.primary_image_count) !== 1 || Number(row.pricing_count) !== 1) {
      throw new Error(`Post-import verification failed: ${JSON.stringify(row)}`);
    }
  }
  console.log(JSON.stringify({ created, verified: verification.rows }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
