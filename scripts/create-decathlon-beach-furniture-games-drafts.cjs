const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const products = [
  {
    slug: "aktive-sabana-adjustable-glamping-table",
    name: "Aktive Sabana Adjustable Glamping Table",
    brand: "Aktive",
    subcategory: "Camping Tables",
    subcategorySlug: "camping-tables",
    emoji: "🏕️",
    sourceUrl: "https://www.decathlon.es/es/p/mesa-plegable-glamping-altura-ajustable-aktive-cd/X8956331/m8956331",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2780336/k$a4a1a596eec98b75cbe5650aa5541205/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Aktive Sabana black and earth-tone adjustable glamping table",
    description: "A 90 × 57 cm aluminium glamping table with adjustable 45–70 cm legs, compact folding parts and a carry bag.",
    features: ["90 × 57 cm tabletop", "Height adjusts from 45 to 70 cm", "5.7 kg aluminium construction", "30 kg maximum load", "Detachable roll-top design", "Carry bag with handle"],
    specs: { Brand: "Aktive", Collection: "Sabana", Open: "90 × 57 × 45–70 cm", Folded: "Approximately 93 × 18 cm", Weight: "5.7 kg", "Maximum load": "30 kg", Material: "Aluminium", Capacity: "1–2 people", Colour: "Black frame and earth-tone top" },
    en: {
      short: "Rent an adjustable-height Aktive glamping table in Valencia for comfortable outdoor meals and picnic setups.",
      detail: "The Aktive Sabana table provides a 90 × 57 cm rectangular surface with individually adjustable legs that raise the tabletop from 45 to 70 cm. This makes it suitable as a low picnic table or a more conventional outdoor dining surface. The aluminium structure weighs 5.7 kg and supports a listed maximum load of 30 kg. Its slatted top detaches from the legs, both sections fold compactly and the set travels in a handled carry bag. The earth-tone top and black frame suit beach, campsite, terrace and garden use around Valencia.",
      includes: "One Aktive Sabana table with adjustable legs and carry bag. Chairs and tableware are not included.",
      constraints: "Maximum load 30 kg. Do not sit or stand on the table. Set all legs securely and use only on stable ground.",
      setup: "Choose an available Valencia pickup or delivery option. Unfold the legs, attach the slatted top and set all four legs to a stable height before loading.",
      care: "Wipe clean, remove sand and moisture, dry all parts and return the dismantled table in its bag.",
      title: "Rent an Adjustable Camping Table in Valencia",
      meta: "Rent an Aktive adjustable camping table in Valencia. 90 × 57 cm aluminium top, 45–70 cm height range, carry bag and 30 kg capacity.",
      faqs: [["What height can the table be set to?", "The legs adjust from 45 to 70 cm."], ["How much weight can it hold?", "The supplier lists a maximum table load of 30 kg. It must not be used as a seat or step."], ["Does it include a carry bag?", "Yes. The slatted top and legs fold into the supplied handled bag."]],
    },
    es: {
      short: "Alquila una mesa glamping Aktive de altura ajustable en Valencia para comidas al aire libre y pícnics cómodos.",
      detail: "La mesa Aktive Sabana ofrece una superficie rectangular de 90 × 57 cm con patas regulables que permiten situar la encimera entre 45 y 70 cm. Puede utilizarse como mesa baja de pícnic o como superficie de comedor exterior. La estructura de aluminio pesa 5,7 kg y soporta una carga máxima indicada de 30 kg. La encimera de lamas se separa de las patas, ambas partes se pliegan y el conjunto se transporta en una bolsa con asa. El tablero color tierra y la estructura negra son adecuados para playa, camping, terraza y jardín en Valencia.",
      includes: "Una mesa Aktive Sabana con patas regulables y bolsa de transporte. No incluye sillas ni vajilla.",
      constraints: "Carga máxima de 30 kg. No sentarse ni ponerse de pie. Fijar bien las patas y utilizar únicamente sobre terreno estable.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Despliega las patas, fija la encimera y nivela las cuatro patas antes de cargarla.",
      care: "Limpia, retira arena y humedad, seca todas las piezas y devuelve la mesa desmontada dentro de su bolsa.",
      title: "Alquiler Mesa Camping Ajustable en Valencia",
      meta: "Alquila una mesa Aktive ajustable en Valencia. Aluminio de 90 × 57 cm, altura de 45–70 cm, bolsa y carga máxima de 30 kg.",
      faqs: [["¿A qué altura se puede colocar?", "Las patas se regulan entre 45 y 70 cm."], ["¿Cuánto peso soporta?", "El proveedor indica una carga máxima de 30 kg. No debe utilizarse como asiento o escalón."], ["¿Incluye bolsa de transporte?", "Sí. La encimera de lamas y las patas se pliegan dentro de la bolsa con asa."]],
    },
  },
  {
    slug: "aktive-striped-reclining-beach-chair-pair",
    name: "Aktive Striped Reclining Beach Chairs — Pair",
    brand: "Aktive",
    subcategory: "Beach Chairs",
    subcategorySlug: "beach-chairs",
    emoji: "🏖️",
    sourceUrl: "https://www.decathlon.es/es/p/mp/silla-playa-aktive-48x58x80-cm-max-110-kg-multiposicion-marinera/058bdd57-c4d7-4fdc-8654-30223d2c4e5b/c5?offerId=530871862",
    sourceImageUrl: "https://contents.mediadecathlon.com/m34987804/k$aea05db278aec8c6b3dcfd1e44f1c81b/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Pair of blue and white striped Aktive reclining beach chairs",
    description: "A pair of five-position aluminium beach chairs with anti-tip feet, pillows, pockets, removable cooler bags and backpack straps.",
    features: ["Pack of two chairs", "Five reclining positions including lounger mode", "110 kg maximum per chair", "Anti-tip feet for uneven surfaces", "Pillow, side and rear pockets", "Removable cooler bag and backpack straps"],
    specs: { Brand: "Aktive", Quantity: "2 chairs", "Open per chair": "48 × 58 × 80 cm", Folded: "64 × 75 cm", "Maximum user weight": "110 kg per chair", Frame: "Aluminium", Fabric: "Quick-drying breathable polyester", Recline: "5 positions", Colour: "Blue and white marine stripes" },
    en: {
      short: "Rent a pair of striped reclining beach chairs in Valencia with storage, cooler pockets and backpack-style transport.",
      detail: "This Aktive pack contains two matching blue-and-white striped beach chairs, each measuring 48 × 58 × 80 cm when open and supporting up to 110 kg. The lightweight aluminium frames recline through five positions, including a lounger mode, and avoid a front bar that could press against the legs. Each chair has anti-tip feet for better stability on sand, an adjustable head pillow, bottle pocket, rear mesh pocket and removable insulated bag. Backpack-style straps make the folded 64 × 75 cm chairs easier to carry. Stability still depends on firm placement and suitable weather conditions.",
      includes: "Two Aktive reclining beach chairs, each with pillow, pockets, removable cooler bag and backpack straps.",
      constraints: "Maximum user weight 110 kg per chair. Place securely on stable ground and do not use in unsafe wind. The cooler pockets do not guarantee a cooling duration.",
      setup: "Choose an available Valencia pickup or delivery option. Open both frames fully, select a locked recline position and check the feet before sitting.",
      care: "Remove sand, empty the pockets and cooler bags, wipe the frames and return both chairs dry and folded.",
      title: "Rent Two Reclining Beach Chairs in Valencia",
      meta: "Rent two Aktive reclining beach chairs in Valencia. Five positions, pillows, storage, cooler pockets, backpack straps and 110 kg capacity each.",
      faqs: [["Is this one chair or two?", "The current supplier page is explicitly a pack of two matching chairs."], ["How much weight can each chair support?", "The listed maximum is 110 kg per chair."], ["How are the chairs transported?", "Each folds to approximately 64 × 75 cm and has backpack-style carrying straps."]],
    },
    es: {
      short: "Alquila dos sillas de playa reclinables a rayas en Valencia con bolsillos, nevera extraíble y correas tipo mochila.",
      detail: "Este pack Aktive contiene dos sillas de playa a rayas azules y blancas de 48 × 58 × 80 cm abiertas, con capacidad máxima de 110 kg por silla. Las estructuras ligeras de aluminio se reclinan en cinco posiciones, incluido modo tumbona, y eliminan el tubo delantero que puede molestar en las piernas. Cada silla incorpora topes antivuelco para mejorar la estabilidad sobre la arena, almohada ajustable, bolsillo portabotellas, bolsillo trasero de malla y bolsa térmica extraíble. Las correas tipo mochila facilitan transportar las sillas plegadas de 64 × 75 cm. La estabilidad sigue dependiendo de una colocación firme y de condiciones meteorológicas adecuadas.",
      includes: "Dos sillas reclinables Aktive, cada una con almohada, bolsillos, bolsa térmica extraíble y correas tipo mochila.",
      constraints: "Peso máximo de 110 kg por silla. Colocar sobre terreno estable y no utilizar con viento inseguro. Las bolsas térmicas no garantizan una duración de frío.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Abre completamente ambas estructuras, bloquea la posición y comprueba los apoyos antes de sentarte.",
      care: "Retira la arena, vacía bolsillos y bolsas térmicas, limpia las estructuras y devuelve ambas sillas secas y plegadas.",
      title: "Alquiler Dos Sillas Playa Reclinables Valencia",
      meta: "Alquila dos sillas Aktive reclinables en Valencia. Cinco posiciones, almohadas, bolsillos, nevera, correas mochila y 110 kg por silla.",
      faqs: [["¿Es una silla o dos?", "La página actual del proveedor indica expresamente un pack de dos sillas iguales."], ["¿Cuánto peso soporta cada silla?", "El máximo indicado es de 110 kg por silla."], ["¿Cómo se transportan?", "Cada silla se pliega aproximadamente a 64 × 75 cm e incorpora correas tipo mochila."]],
    },
  },
  {
    slug: "flamingueo-reclining-beach-chair-with-parasol",
    name: "Flamingueo Reclining Beach Chair with Parasol",
    brand: "Flamingueo",
    subcategory: "Beach Chairs",
    subcategorySlug: "beach-chairs",
    emoji: "🏖️",
    sourceUrl: "https://www.decathlon.es/es/p/mp/flamingueo-silla-playa-reclinable-parasol-poliester-azul/1820acae-c14c-474a-a91a-6f59cf995b5d/c5",
    sourceImageUrl: "https://contents.mediadecathlon.com/m34078254/k$07a85a78e82d46e2b913364e4e177e1a/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Blue Flamingueo reclining beach chair with adjustable parasol",
    description: "A folding aluminium beach chair with UPF 50+ parasol, five-position backrest, three-position footrest and face-down openings.",
    features: ["Adjustable UPF 50+ parasol", "Five-position reclining backrest", "Three-position padded footrest", "Padded face and arm openings", "Insulated side cooler and phone cup-holder pocket", "Pillow and padded backpack straps"],
    specs: { Brand: "Flamingueo", Dimensions: "67.5 × 73 × 101.3 cm", "Maximum user weight": "160 kg", Frame: "Aluminium", Fabric: "Polyester", Capacity: "1 person", Backrest: "5 positions", Footrest: "3 positions", Foldable: "Yes", Colour: "Blue" },
    en: {
      short: "Rent a premium reclining beach chair in Valencia with an adjustable UPF 50+ parasol, footrest and integrated storage.",
      detail: "The Flamingueo chair combines a five-position reclining backrest with a padded footrest adjustable through three positions. Its padded face opening and separate arm openings allow face-down relaxation, while an ergonomic pillow supports conventional sitting. An adjustable UPF 50+ parasol provides personal shade, although users should still apply sun protection and reposition the parasol as the sun moves. The aluminium and polyester chair measures 67.5 × 73 × 101.3 cm and has a listed maximum user weight of 160 kg. An insulated side cooler, phone compartment, cup holder and padded backpack straps complete the setup.",
      includes: "One Flamingueo reclining chair with attached parasol, footrest, pillow, side cooler, storage pocket and backpack straps.",
      constraints: "Maximum user weight 160 kg. UPF protection applies to the parasol fabric, not the whole body. Do not use the parasol or chair in unsafe wind.",
      setup: "Choose an available Valencia pickup or delivery option. Open the frame fully, lock the backrest and footrest, and secure the parasol before use.",
      care: "Remove sand, empty storage and cooler sections, wipe the frame and return the chair dry, folded and complete.",
      title: "Rent a Beach Chair with Parasol in Valencia",
      meta: "Rent a Flamingueo reclining beach chair in Valencia with UPF 50+ parasol, footrest, face opening, cooler pocket and backpack straps.",
      faqs: [["Does the chair include a parasol?", "Yes. It has an adjustable parasol whose fabric is listed as UPF 50+."], ["Can it be used lying face down?", "Yes. It has a padded face opening and separate arm openings for face-down relaxation."], ["What is the maximum user weight?", "The supplier lists a maximum recommended user weight of 160 kg."]],
    },
    es: {
      short: "Alquila una silla de playa reclinable premium en Valencia con parasol UPF 50+, reposapiés y almacenamiento integrado.",
      detail: "La silla Flamingueo combina un respaldo reclinable en cinco posiciones con un reposapiés acolchado regulable en tres. La apertura acolchada para el rostro y las aberturas para los brazos permiten descansar boca abajo, mientras que la almohada ergonómica mejora la postura sentada. El parasol ajustable UPF 50+ aporta sombra personal, aunque sigue siendo necesario utilizar protección solar y orientarlo según se mueve el sol. La silla de aluminio y poliéster mide 67,5 × 73 × 101,3 cm y admite un peso máximo indicado de 160 kg. Incluye nevera lateral aislada, compartimento para móvil, posavasos y correas acolchadas tipo mochila.",
      includes: "Una silla reclinable Flamingueo con parasol, reposapiés, almohada, nevera lateral, bolsillo y correas tipo mochila.",
      constraints: "Peso máximo de 160 kg. La protección UPF corresponde al tejido del parasol, no a todo el cuerpo. No utilizar con viento inseguro.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Abre la estructura, bloquea respaldo y reposapiés y fija el parasol antes de usarla.",
      care: "Retira la arena, vacía bolsillos y nevera, limpia la estructura y devuelve la silla seca, plegada y completa.",
      title: "Alquiler Silla Playa con Parasol en Valencia",
      meta: "Alquila una silla Flamingueo en Valencia con parasol UPF 50+, reposapiés, apertura facial, nevera lateral y correas mochila.",
      faqs: [["¿Incluye parasol?", "Sí. Incorpora un parasol ajustable cuyo tejido figura como UPF 50+."], ["¿Se puede utilizar tumbado boca abajo?", "Sí. Tiene una apertura acolchada para el rostro y aberturas separadas para los brazos."], ["¿Cuál es el peso máximo?", "El proveedor indica un peso máximo recomendado de 160 kg."]],
    },
  },
  {
    slug: "sandever-btr-160-beach-tennis-set",
    name: "Sandever BTR 160 Beach Tennis Set",
    brand: "Sandever",
    subcategory: "Beach Games",
    subcategorySlug: "beach-games",
    emoji: "🏓",
    sourceUrl: "https://www.decathlon.es/es/p/set-palas-de-tenis-playa-btr-160-ov/326784/c344m8738519",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2248434/k$b16ee18c189a5a396360f521163af6ea/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Sandever BTR 160 beach tennis set with two paddles, ball and carry bag",
    description: "A beginner beach-tennis set with two durable polypropylene paddles, one pressureless ball and a sand-friendly carry bag.",
    features: ["Two lightweight beginner paddles", "One durable pressureless ball", "Carry bag that releases sand", "Comfortable polyurethane grips", "Neutral balance and manageable handling", "Suitable for indoor or outdoor recreational play"],
    specs: { Brand: "Sandever", Model: "BTR 160 OV", Contents: "2 paddles, 1 pressureless ball, 1 carry bag", "Paddle weight": "280–300 g", "Paddle thickness": "Feature text says 18 mm; specification table says 20 mm", "Paddle frame": "80% polypropylene, 20% talc", Grip: "100% polyurethane", Level: "Beginner", Origin: "Made in Italy" },
    en: {
      short: "Rent a two-player Sandever beach-tennis set in Valencia with paddles, pressureless ball and carry bag.",
      detail: "The Sandever BTR 160 set is designed for beginner beach-tennis play with friends or family. It includes two manageable polypropylene paddles weighing 280–300 g each, one durable pressureless ball and a carry bag that makes it easier to shake out sand. Neutral balance and comfortable polyurethane grips support casual rallies on the beach or in a park. The source contains a small thickness conflict: the feature section says 18 mm while the specification table says 20 mm, so the draft records both rather than selecting one without checking the physical paddles.",
      includes: "Two Sandever BTR 160 paddles, one pressureless ball and one carry bag.",
      constraints: "Not suitable for children under 3. Use away from crowds, roads and breakable objects. Paddle thickness must be checked on the physical set before publication.",
      setup: "Choose an available Valencia pickup or delivery option. Confirm the bag contains both paddles and the ball before leaving.",
      care: "Shake sand from the bag and equipment, wipe the paddles and ball and return all four components dry.",
      title: "Rent a Beach Tennis Set in Valencia",
      meta: "Rent a Sandever beach-tennis set in Valencia with two beginner paddles, a pressureless ball and carry bag for beach or park games.",
      faqs: [["What is included in the set?", "Two paddles, one pressureless ball and one carry bag."], ["Is it suitable for beginners?", "Yes. The set is designed for discovery and beginner recreational play."], ["Can children use it?", "The supplier says it is not suitable for children under 3. Children should play under appropriate adult supervision."]],
    },
    es: {
      short: "Alquila un set Sandever de tenis playa para dos en Valencia con palas, pelota sin presión y funda.",
      detail: "El set Sandever BTR 160 está pensado para iniciarse en el tenis playa con amigos o familia. Incluye dos palas manejables de polipropileno de 280–300 g cada una, una pelota resistente sin presión y una funda que facilita retirar la arena. El equilibrio neutro y los grips de poliuretano cómodos favorecen los peloteos recreativos en playa o parque. La fuente contiene una pequeña contradicción: las características indican 18 mm de grosor y la tabla técnica 20 mm, por lo que el borrador registra ambas cifras hasta comprobar las palas físicas.",
      includes: "Dos palas Sandever BTR 160, una pelota sin presión y una funda de transporte.",
      constraints: "No apto para menores de 3 años. Jugar lejos de multitudes, carreteras y objetos frágiles. Comprobar el grosor en el set físico antes de publicar.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Comprueba que la funda contiene las dos palas y la pelota antes de salir.",
      care: "Retira la arena de funda y material, limpia palas y pelota y devuelve los cuatro componentes secos.",
      title: "Alquiler Set Tenis Playa en Valencia",
      meta: "Alquila un set Sandever de tenis playa en Valencia con dos palas de iniciación, pelota sin presión y funda para jugar en playa o parque.",
      faqs: [["¿Qué incluye el set?", "Dos palas, una pelota sin presión y una funda de transporte."], ["¿Es adecuado para principiantes?", "Sí. Está diseñado para iniciación y juego recreativo."], ["¿Pueden utilizarlo niños?", "El proveedor indica que no es apto para menores de 3 años. Los niños deben jugar con supervisión adecuada."]],
    },
  },
  {
    slug: "color-beach-crab-sand-toy-set",
    name: "Color Beach Crab Sand Toy Set",
    brand: "Color Beach",
    subcategory: "Kids Beach Toys",
    subcategorySlug: "kids-beach-toys",
    emoji: "🦀",
    sourceUrl: "https://www.decathlon.es/es/p/mp/set-playa-cangrejo-cubo-con-palas-y-moldes-de-color-beach/f83a85dd-9277-4402-8a57-1381270462d4/c255?offerId=127015325",
    sourceImageUrl: "https://contents.mediadecathlon.com/m21773692/k$dbd0b1c2c6986ef56509099e81eca12a/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Color Beach crab-themed sand toy set with bucket, tools and moulds",
    description: "An 11-piece sand-play set for children from 18 months with a 14 cm bucket, digging tools, ice-cream moulds and crab carry net.",
    features: ["11-piece beach-play set", "14 cm diameter bucket", "Digging tools and ice-cream moulds", "Crab-shaped storage net with handle", "Durable plastic with no sharp edges", "Recommended from 18 months"],
    specs: { Brand: "Color Beach", Pieces: "11", "Recommended age": "From 18 months", "Bucket diameter": "14 cm", Contents: "Bucket, digging tools, rake, ice-cream-shaped moulds and crab storage net", Material: "Durable plastic", Storage: "Handled crab-shaped net" },
    en: {
      short: "Rent an 11-piece crab-themed sand toy set in Valencia for toddlers and young children from 18 months.",
      detail: "The Color Beach Crab set gives young children a compact collection for digging, filling and making shapes in the sand. Its 11 pieces include a 14 cm bucket, digging tools, a rake and ice-cream-shaped moulds. Everything stores inside a handled crab-shaped net for easier carrying to Malvarrosa, Patacona or a park sand area. The supplier recommends the set from 18 months and describes the durable plastic pieces as free from sharp edges. Adult supervision remains necessary, especially near water and when counting all small components before and after play.",
      includes: "One complete 11-piece Color Beach set with bucket, tools, moulds and crab storage net.",
      constraints: "Recommended from 18 months with adult supervision. Keep all pieces away from roads and water hazards, and do not allow children to throw the tools.",
      setup: "Choose an available Valencia pickup or delivery option. Count the 11 pieces before use and keep the storage net nearby.",
      care: "Rinse or brush away sand, drain water from every piece, dry fully and return all 11 items in the crab net.",
      title: "Rent Toddler Beach Toys in Valencia",
      meta: "Rent an 11-piece toddler beach-toy set in Valencia with bucket, digging tools, moulds and crab carry net. Recommended from 18 months.",
      faqs: [["How many pieces are included?", "The supplier lists 11 pieces, including the bucket, tools, moulds and storage net."], ["What age is the set for?", "It is recommended from 18 months, always with appropriate adult supervision."], ["How is it carried?", "The pieces store in a crab-shaped mesh net with a handle."]],
    },
    es: {
      short: "Alquila un set de playa Cangrejo de 11 piezas en Valencia para bebés y niños pequeños desde 18 meses.",
      detail: "El set Cangrejo de Color Beach ofrece a los más pequeños una colección compacta para excavar, llenar y crear formas en la arena. Las 11 piezas incluyen un cubo de 14 cm, herramientas, rastrillo y moldes con forma de helado. Todo se guarda dentro de una red con asa en forma de cangrejo para llevarlo a Malvarrosa, Patacona o una zona de arena en el parque. El proveedor lo recomienda desde 18 meses y describe las piezas de plástico resistente como libres de bordes afilados. Sigue siendo necesaria la supervisión adulta, especialmente cerca del agua y al contar todas las piezas antes y después del juego.",
      includes: "Un set Color Beach completo de 11 piezas con cubo, herramientas, moldes y red de almacenamiento Cangrejo.",
      constraints: "Recomendado desde 18 meses con supervisión adulta. Mantener lejos de carreteras y riesgos de agua y no permitir lanzar las herramientas.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Cuenta las 11 piezas antes de usarlo y mantén cerca la red.",
      care: "Aclara o retira la arena, vacía el agua de cada pieza, seca por completo y devuelve los 11 elementos dentro de la red.",
      title: "Alquiler Juguetes Playa para Niños Valencia",
      meta: "Alquila un set de playa infantil de 11 piezas en Valencia con cubo, herramientas, moldes y red Cangrejo. Recomendado desde 18 meses.",
      faqs: [["¿Cuántas piezas incluye?", "El proveedor indica 11 piezas, incluido el cubo, las herramientas, los moldes y la red."], ["¿Para qué edad es?", "Está recomendado desde 18 meses, siempre con supervisión adulta adecuada."], ["¿Cómo se transporta?", "Las piezas se guardan en una red de malla con asa y forma de cangrejo."]],
    },
  },
  {
    slug: "kipsta-bs100-beginner-beach-volleyball-net",
    name: "Kipsta BS100 Beginner Beach Volleyball Net Set",
    brand: "Kipsta",
    subcategory: "Beach Games",
    subcategorySlug: "beach-games",
    emoji: "🏐",
    sourceUrl: "https://www.decathlon.es/es/p/set-red-y-postes-de-voley-playa-de-iniciacion-bs100/325275/c165c382m8585945",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2384450/k$5123a48fb580a3af8763b8703525d299/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Kipsta BS100 four metre beginner beach volleyball net set",
    description: "A compact 4 m beginner beach-volleyball net with three height settings, self-supporting frame, pegs and carry bag.",
    features: ["4 m net width", "Three heights: 1.50, 1.75 and 2 m", "Under-two-minute assembly from age 10", "Self-supporting fibreglass structure", "Four included ground pegs", "2 kg set with carry bag"],
    specs: { Brand: "Kipsta", Model: "BS100", Width: "4 m", Heights: "1.50 m, 1.75 m or 2 m", Weight: "2 kg", Contents: "2 poles, self-supporting base, 2 straps, 4 m net, 4 pegs and carry bag", Structure: "90% fibreglass, 10% polyamide", Net: "100% polyester", Level: "Beginner" },
    en: {
      short: "Rent a compact 4 m beginner beach-volleyball net in Valencia with three heights, pegs and carry bag.",
      detail: "The Kipsta BS100 creates a portable 4 m play area for beginner beach volleyball and other casual beach games. The net can be set at 1.50, 1.75 or 2 metres for children or adults. The complete 2 kg set includes two fibreglass poles, a self-supporting base, two securing straps, four ground pegs, the net and a carry bag. Decathlon states that users aged 10 and over can assemble it in under two minutes. It must be correctly tensioned and pegged, children require constant adult supervision and the supplier advises against use in strong wind.",
      includes: "Two poles, self-supporting base, two straps, 4 m net, four pegs and one carry bag. Volleyball is not included.",
      constraints: "Do not use in strong wind. Secure every connection and peg before play. Children require constant adult supervision.",
      setup: "Choose an available Valencia pickup or delivery option. Select the height, assemble the frame, tension the net and install all four pegs in suitable ground.",
      care: "Shake off sand, wipe and dry all parts, count the pegs and return the complete set packed in its bag.",
      title: "Rent a Beach Volleyball Net in Valencia",
      meta: "Rent a 4 m Kipsta beach-volleyball net in Valencia. Three height settings, 2 kg portable set, pegs and carry bag for beginner games.",
      faqs: [["How wide is the net?", "The net is 4 metres wide."], ["What heights can it use?", "It can be set at 1.50, 1.75 or 2 metres."], ["Is a volleyball included?", "No. The set includes the net system, pegs and bag; the ball is a separate rental item."]],
    },
    es: {
      short: "Alquila una red de vóley playa de iniciación de 4 m en Valencia con tres alturas, piquetas y bolsa.",
      detail: "La Kipsta BS100 crea una zona portátil de 4 m para iniciarse en el vóley playa y otros juegos recreativos. La red puede colocarse a 1,50, 1,75 o 2 metros para niños o adultos. El conjunto completo de 2 kg incluye dos postes de fibra de vidrio, base autoportante, dos correas, cuatro piquetas, red y bolsa. Decathlon indica que usuarios desde 10 años pueden montarlo en menos de dos minutos. Debe quedar correctamente tensado y fijado, los niños necesitan supervisión constante y el proveedor desaconseja utilizarlo con viento fuerte.",
      includes: "Dos postes, base autoportante, dos correas, red de 4 m, cuatro piquetas y bolsa. No incluye balón.",
      constraints: "No utilizar con viento fuerte. Fijar conexiones y piquetas antes de jugar. Los niños requieren supervisión adulta constante.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Selecciona la altura, monta la estructura, tensa la red y coloca las cuatro piquetas.",
      care: "Retira la arena, limpia y seca todas las piezas, cuenta las piquetas y devuelve el conjunto completo dentro de la bolsa.",
      title: "Alquiler Red Vóley Playa en Valencia",
      meta: "Alquila una red Kipsta de vóley playa de 4 m en Valencia. Tres alturas, conjunto portátil de 2 kg, piquetas y bolsa para iniciación.",
      faqs: [["¿Qué anchura tiene la red?", "La red mide 4 metros de ancho."], ["¿Qué alturas permite?", "Puede colocarse a 1,50, 1,75 o 2 metros."], ["¿Incluye balón?", "No. Incluye el sistema de red, piquetas y bolsa; el balón se alquila por separado."]],
    },
  },
  {
    slug: "kipsta-bv100-size-5-beach-volleyball",
    name: "Kipsta BV100 Size 5 Beach Volleyball",
    brand: "Kipsta",
    subcategory: "Beach Games",
    subcategorySlug: "beach-games",
    emoji: "🏐",
    sourceUrl: "https://www.decathlon.es/es/p/balon-de-voley-playa-bv100-classic-talla-5-colorido/342044/c274m8816710",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2637141/k$a1476de5ca06243a0b4b19debd1ab579/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Colourful orange Kipsta BV100 size 5 beach volleyball",
    description: "A soft-touch size 5 beginner beach volleyball with reinforced bladder, 21 cm diameter and 260–280 g weight.",
    features: ["Soft, thick outer for repeated contact", "Size 5 and 21 cm diameter", "260–280 g weight", "Reinforced bladder", "Machine-stitched 18-panel construction", "Designed for beginner leisure play on sand"],
    specs: { Brand: "Kipsta", Model: "BV100 Classic", Size: "5", Diameter: "21 cm", Weight: "260–280 g", Pressure: "0.18–0.22 bar", "Recommended age": "Over 6 years", Finish: "Machine stitched, 18 panels", Approval: "Not competition approved", Colour: "Fire orange / multicolour" },
    en: {
      short: "Rent a soft-touch size 5 Kipsta beach volleyball in Valencia for beginner games on the beach or in the park.",
      detail: "The Kipsta BV100 is a recreational size 5 beach volleyball designed for beginners aged over 6. It measures 21 cm in diameter, weighs 260–280 g and uses a soft, thick outer layer for more comfortable repeated contact. A reinforced bladder helps reduce punctures and deformation, while the 18-panel shell is machine stitched. Decathlon recommends an inflation pressure of 0.18–0.22 bar, lower than an indoor volleyball. The ball is not competition approved and should be kept away from thorns and sharp surfaces.",
      includes: "One Kipsta BV100 size 5 beach volleyball. Pump and pressure gauge are not included.",
      constraints: "Recommended for ages over 6. Not competition approved. Use away from thorny plants and sharp surfaces and supervise children appropriately.",
      setup: "Choose an available Valencia pickup or delivery option. Check the ball is inflated to 0.18–0.22 bar before play; wet the pump needle slightly if adjustment is needed.",
      care: "Brush off sand, wipe with a damp cloth if needed, dry fully and return without overinflating or immersing the ball.",
      title: "Rent a Beach Volleyball in Valencia",
      meta: "Rent a Kipsta BV100 size 5 beach volleyball in Valencia. Soft beginner ball, 21 cm diameter, 260–280 g and designed for sand play.",
      faqs: [["What size is the ball?", "It is a size 5 ball with a listed diameter of 21 cm."], ["What pressure should it use?", "Decathlon recommends 0.18–0.22 bar for this beach volleyball."], ["Is a pump included?", "No. The rental draft includes the ball only unless a pump is later added as an option."]],
    },
    es: {
      short: "Alquila un balón Kipsta de vóley playa talla 5 en Valencia para juegos de iniciación en playa o parque.",
      detail: "El Kipsta BV100 es un balón recreativo de vóley playa talla 5 diseñado para principiantes mayores de 6 años. Mide 21 cm de diámetro, pesa 260–280 g y utiliza una capa exterior gruesa y blanda para ofrecer un contacto más agradable. La cámara reforzada ayuda a limitar pinchazos y deformaciones y la carcasa de 18 paneles está cosida a máquina. Decathlon recomienda una presión de 0,18–0,22 bar, inferior a la de un balón de interior. No está homologado para competición y debe mantenerse lejos de plantas espinosas y superficies afiladas.",
      includes: "Un balón Kipsta BV100 de vóley playa talla 5. No incluye bomba ni manómetro.",
      constraints: "Recomendado para mayores de 6 años. No homologado para competición. Evitar espinas y superficies afiladas y supervisar adecuadamente a los niños.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Comprueba una presión de 0,18–0,22 bar antes de jugar; humedece ligeramente la aguja si hay que ajustarla.",
      care: "Retira la arena, limpia con un paño húmedo si hace falta, seca por completo y devuelve sin sobreinflar ni sumergir el balón.",
      title: "Alquiler Balón Vóley Playa en Valencia",
      meta: "Alquila un balón Kipsta BV100 talla 5 en Valencia. Balón blando de iniciación, 21 cm, 260–280 g y diseñado para jugar en arena.",
      faqs: [["¿Qué talla tiene el balón?", "Es un balón talla 5 con un diámetro indicado de 21 cm."], ["¿Qué presión debe llevar?", "Decathlon recomienda entre 0,18 y 0,22 bar para este balón de playa."], ["¿Incluye bomba?", "No. El borrador incluye solo el balón salvo que se añada una bomba como opción."]],
    },
  },
  {
    slug: "cb-sports-flying-disc-target-game",
    name: "CB Sports Flying Disc Target Game",
    brand: "CB Sports",
    subcategory: "Kids Beach Toys",
    subcategorySlug: "kids-beach-toys",
    emoji: "🥏",
    sourceUrl: "https://www.decathlon.es/es/p/mp/juego-de-lanzamientos-c-disco-volador-cb-sports/b874e9f8-e1b5-45f0-afd9-2b270d249888/c5?offerId=26539500",
    sourceImageUrl: "https://contents.mediadecathlon.com/m15456014/k$3561f72de353b3a0b56f13f94d727f1a/picture.jpg?format=auto&f=1920x0",
    imageAlt: "CB Sports standing flying-disc target game with scoring holes",
    description: "A portable 44 × 47 × 91 cm flying-disc target with four scoring openings and one 14 cm mini disc for children from 3 years.",
    features: ["Four scoring openings: 10, 20, 30 and 50 points", "Stable vertical target", "44 × 47 × 91 cm assembled size", "Includes one 14 cm flying disc", "Easy assembly and dismantling", "Recommended from 3 years"],
    specs: { Brand: "CB Sports", Dimensions: "44 × 47 × 91 cm", Weight: "0.55 kg", "Recommended age": "From 3 years", Contents: "Standing target and one 14 cm flying disc", Scoring: "10, 20, 30 and 50 points", Use: "Individual or group play" },
    en: {
      short: "Rent a portable flying-disc target game in Valencia for children from 3 years, with four scoring zones and one mini disc.",
      detail: "The CB Sports throwing game creates a simple aim-and-score activity for the beach, park or garden. Its freestanding vertical target measures 44 × 47 × 91 cm and has four openings worth 10, 20, 30 and 50 points. One 14 cm mini flying disc is included, and the 0.55 kg structure assembles and dismantles for transport. The supplier recommends the game from age 3 and presents it for individual or group play that develops hand-eye coordination. Adult supervision and a clear throwing area are required.",
      includes: "One CB Sports target structure and one 14 cm flying disc.",
      constraints: "Recommended from age 3 with adult supervision. Use only in a clear area away from roads, crowds, animals and breakable objects.",
      setup: "Choose an available Valencia pickup or delivery option. Assemble the target on level ground and confirm it is stable before throwing.",
      care: "Remove sand and moisture, wipe all pieces, dismantle carefully and return the target and disc together.",
      title: "Rent a Kids Flying Disc Game in Valencia",
      meta: "Rent a CB Sports flying-disc target in Valencia. Four scoring zones, portable 44 × 47 × 91 cm design and mini disc for children from 3.",
      faqs: [["What is included?", "One standing target and one 14 cm flying disc."], ["What age is it suitable for?", "The supplier recommends the game from age 3 with adult supervision."], ["How large is the assembled target?", "It measures 44 × 47 × 91 cm when assembled."]],
    },
    es: {
      short: "Alquila un juego de puntería con disco volador en Valencia para niños desde 3 años, con cuatro zonas de puntuación.",
      detail: "El juego de lanzamiento CB Sports crea una actividad sencilla de puntería para playa, parque o jardín. La diana vertical autoportante mide 44 × 47 × 91 cm e incorpora cuatro aberturas de 10, 20, 30 y 50 puntos. Incluye un mini disco volador de 14 cm y la estructura de 0,55 kg se monta y desmonta para transportarla. El proveedor lo recomienda desde 3 años y lo presenta para juego individual o en grupo y desarrollo de la coordinación ojo-mano. Requiere supervisión adulta y una zona de lanzamiento despejada.",
      includes: "Una estructura de puntería CB Sports y un disco volador de 14 cm.",
      constraints: "Recomendado desde 3 años con supervisión adulta. Utilizar en una zona despejada, lejos de carreteras, multitudes, animales y objetos frágiles.",
      setup: "Elige una opción disponible de recogida o entrega en Valencia. Monta la diana sobre terreno nivelado y comprueba su estabilidad antes de lanzar.",
      care: "Retira arena y humedad, limpia las piezas, desmonta con cuidado y devuelve la diana y el disco juntos.",
      title: "Alquiler Juego Disco Volador Infantil Valencia",
      meta: "Alquila una diana CB Sports en Valencia. Cuatro zonas de puntos, diseño portátil de 44 × 47 × 91 cm y disco para niños desde 3 años.",
      faqs: [["¿Qué incluye?", "Una diana vertical y un disco volador de 14 cm."], ["¿Para qué edad es adecuado?", "El proveedor lo recomienda desde 3 años con supervisión adulta."], ["¿Qué tamaño tiene montado?", "Mide 44 × 47 × 91 cm una vez montado."]],
    },
  },
];

function extensionFor(contentType) {
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/png") return "png";
  return "jpg";
}

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const category = await client.query("select id from categories where slug = 'travel-outdoors' limit 1");
  if (category.rowCount !== 1) throw new Error("Beach & Outdoor category not found");

  const created = [];
  for (const product of products) {
    const duplicate = await client.query("select id from products where slug = $1", [product.slug]);
    if (duplicate.rowCount > 0) throw new Error(`Product already exists: ${product.slug}`);

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
          category.rows[0].id, product.subcategory, product.subcategorySlug, product.en.title, product.en.meta,
          JSON.stringify(product.features), JSON.stringify(product.specs)],
      );
      const productId = inserted.rows[0].id;
      await client.query("insert into pricing_tiers (product_id, min_days, per_day_cents) values ($1,1,0)", [productId]);

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

  if (verification.rowCount !== products.length) throw new Error("Post-import verification did not find all eight products");
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
