const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const products = [
  {
    slug: "aktive-16-5l-soft-cooler-bag",
    name: "Aktive 16.5 L Soft Cooler Bag",
    brand: "Aktive",
    subcategory: "Coolers",
    subcategorySlug: "coolers",
    emoji: "🧊",
    sourceUrl: "https://www.decathlon.es/es/p/mp/bolsa-termica-16-5-litros-aktive-cooler/94dbb572-7e3d-4a50-a5f6-7b4dd764282a/c255",
    sourceImageUrl: "https://contents.mediadecathlon.com/m20921071/k$0620d5106f9f8646d7ee1711fc89ea54/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Aktive 16.5 litre blue and grey soft cooler bag",
    description: "A 16.5 L insulated soft cooler bag with two carrying options, an adjustable shoulder strap and a useful front pocket.",
    features: ["16.5 L capacity", "Insulated for hot or cold contents", "Adjustable shoulder strap", "Two carrying options", "Front storage pocket", "Water-resistant PVC-lined interior"],
    specs: { Brand: "Aktive", Capacity: "16.5 L", Dimensions: "36 × 21 × 22 cm", Colour: "Blue, navy and grey", Exterior: "Polyester", Lining: "Insulating PVC", Format: "Soft cooler bag", Cleaning: "Hand-clean the spill-resistant inner lining" },
    localization: {
      en: {
        short_description: "Rent a compact 16.5 L cooler bag in Valencia for beach days, picnics and short outings.",
        detail_description: "The Aktive 16.5 L soft cooler is a practical size for drinks, snacks and a light picnic during a Valencia beach or park day. It measures 36 × 21 × 22 cm and combines a polyester outer with an insulated PVC lining designed to help retain the temperature of hot or cold contents. Two carrying options, including an adjustable shoulder strap, make it easier to take to Malvarrosa, Patacona or Turia Gardens. A separate front pocket keeps utensils and small essentials away from the main compartment. The supplier does not state a guaranteed cooling duration, so performance depends on starting temperature, ice packs, ambient heat and how often the bag is opened.",
        includes_text: "One Aktive 16.5 L insulated cooler bag. Food, drinks and ice packs are not included.",
        constraints_text: "No guaranteed cooling duration is stated. Use sealed containers and do not place loose liquids inside the bag.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. Add chilled contents and your own ice packs shortly before departure.",
        care_note: "Empty the bag after use, wipe the inner lining by hand and allow it to dry fully before return.",
        seo_title: "Rent a 16.5 L Cooler Bag in Valencia",
        seo_description: "Rent an Aktive 16.5 L insulated cooler bag in Valencia for beach days and picnics. Compact format, shoulder strap and front pocket.",
      },
      es: {
        short_description: "Alquila una bolsa térmica compacta de 16,5 L en Valencia para playa, pícnic y excursiones cortas.",
        detail_description: "La bolsa térmica Aktive de 16,5 L ofrece un formato práctico para bebidas, aperitivos y un pícnic ligero en la playa o los parques de Valencia. Mide 36 × 21 × 22 cm y combina un exterior de poliéster con un forro aislante de PVC diseñado para ayudar a conservar la temperatura de contenidos fríos o calientes. Sus dos opciones de transporte, incluida una correa ajustable para el hombro, facilitan llevarla a Malvarrosa, Patacona o el Jardín del Turia. El bolsillo frontal mantiene cubiertos y pequeños objetos separados del compartimento principal. El proveedor no indica una duración de frío garantizada; el rendimiento depende de la temperatura inicial, los acumuladores, el calor ambiente y las aperturas.",
        includes_text: "Una bolsa térmica Aktive de 16,5 L. No incluye alimentos, bebidas ni acumuladores de frío.",
        constraints_text: "No se indica una duración de refrigeración garantizada. Utiliza recipientes cerrados y no viertas líquidos sueltos en la bolsa.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Añade productos fríos y tus propios acumuladores poco antes de salir.",
        care_note: "Vacía la bolsa, limpia el interior a mano y deja que se seque por completo antes de devolverla.",
        seo_title: "Alquiler Bolsa Térmica 16,5 L en Valencia",
        seo_description: "Alquila una bolsa térmica Aktive de 16,5 L en Valencia para playa y pícnic. Compacta, con correa de hombro y bolsillo frontal.",
      },
    },
    faqs: {
      en: [["How much does the cooler hold?", "Its listed capacity is 16.5 litres, suitable for drinks, snacks and a light picnic."], ["How long will contents stay cold?", "The supplier gives no guaranteed duration. Use pre-chilled contents and suitable ice packs, and limit opening in hot weather."], ["Are ice packs included?", "No. The draft listing includes the cooler bag only; food, drinks and ice packs are not included."]],
      es: [["¿Qué capacidad tiene la bolsa térmica?", "La capacidad indicada es de 16,5 litros, adecuada para bebidas, aperitivos y un pícnic ligero."], ["¿Cuánto tiempo mantiene el frío?", "El proveedor no garantiza una duración. Utiliza productos ya fríos y acumuladores adecuados, y limita las aperturas con calor."], ["¿Incluye acumuladores de frío?", "No. La ficha incluye únicamente la bolsa térmica; no incluye alimentos, bebidas ni acumuladores."]],
    },
  },
  {
    slug: "naturehike-24l-rigid-cooler-box",
    name: "Naturehike 24 L Rigid Cooler Box",
    brand: "Naturehike",
    subcategory: "Coolers",
    subcategorySlug: "coolers",
    emoji: "🧊",
    sourceUrl: "https://www.decathlon.es/es/p/mp/naturehike-cooler-box-24-l-24-h-refrigeracion/d1c79d85-247a-4d35-8bec-ce5ccdf7fe97/c30c27",
    sourceImageUrl: "https://contents.mediadecathlon.com/m28249054/k$1518c8665fcff0c17cdd5040d06dd10e/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Naturehike beige and brown 24 litre rigid cooler box",
    description: "A watertight 24 L rigid cooler with a locking folding handle and a removable lid with integrated cup holders.",
    features: ["24 L rigid capacity", "Watertight construction", "Folding locking handle", "Removable lid", "Integrated cup holders", "PP, PE and expanded-polystyrene construction"],
    specs: { Brand: "Naturehike", Capacity: "24 L", Dimensions: "44 × 26 × 40 cm", Weight: "2.8 kg", Colour: "Beige and brown", Materials: "PP, PE and expanded polystyrene", Watertight: "Yes", "Cooling claim": "Detailed specification states 21 hours; title and description say up to 24 hours" },
    localization: {
      en: {
        short_description: "Rent a 24 L rigid Naturehike cooler in Valencia for longer beach, picnic and road-trip days.",
        detail_description: "This Naturehike rigid cooler provides 24 litres of storage in a 44 × 26 × 40 cm body weighing 2.8 kg. Its watertight PP and PE shell uses expanded-polystyrene insulation, while the folding handle locks for transport. The removable lid includes built-in cup holders for convenient stops at the beach or park. The source is inconsistent about cold retention: its detailed specification states 21 hours, while the title and marketing description claim up to 24 hours. Treat both as supplier test claims rather than a guarantee, because actual performance varies with ice packs, starting temperature, outdoor heat and opening frequency.",
        includes_text: "One Naturehike 24 L rigid cooler box. Food, drinks and ice packs are not included.",
        constraints_text: "Cooling duration is not guaranteed. The source lists both 21 hours and up to 24 hours. Do not sit or stand on the cooler.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option. Pre-chill contents and add suitable ice packs before travel.",
        care_note: "Empty, wipe and dry the cooler after use. Return the lid and handle clean and undamaged.",
        seo_title: "Rent a 24 L Rigid Cooler in Valencia",
        seo_description: "Rent a Naturehike 24 L rigid cooler in Valencia. Watertight body, locking handle and removable lid with cup holders for beach or picnic days.",
      },
      es: {
        short_description: "Alquila una nevera rígida Naturehike de 24 L en Valencia para playa, pícnic y excursiones largas.",
        detail_description: "Esta nevera rígida Naturehike ofrece 24 litros de capacidad en un cuerpo de 44 × 26 × 40 cm y 2,8 kg. La carcasa estanca de PP y PE incorpora aislamiento de poliestireno expandido, mientras que el asa plegable se bloquea para el transporte. La tapa extraíble integra portavasos para las paradas en la playa o el parque. La fuente no es coherente sobre la conservación del frío: la especificación detallada indica 21 horas y el título y la descripción promocional hablan de hasta 24 horas. Ambas cifras deben entenderse como afirmaciones del proveedor, no como garantía, ya que el resultado depende de los acumuladores, la temperatura inicial, el calor y las aperturas.",
        includes_text: "Una nevera rígida Naturehike de 24 L. No incluye alimentos, bebidas ni acumuladores de frío.",
        constraints_text: "La duración del frío no está garantizada. La fuente indica tanto 21 horas como hasta 24 horas. No sentarse ni ponerse de pie sobre la nevera.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Preenfría el contenido y añade acumuladores adecuados antes de salir.",
        care_note: "Vacía, limpia y seca la nevera después de usarla. Devuelve la tapa y el asa limpias y sin daños.",
        seo_title: "Alquiler Nevera Rígida 24 L en Valencia",
        seo_description: "Alquila una nevera rígida Naturehike de 24 L en Valencia. Estanca, con asa bloqueable y tapa extraíble con portavasos.",
      },
    },
    faqs: {
      en: [["How large is the Naturehike cooler?", "It holds 24 litres and measures 44 × 26 × 40 cm."], ["Does it keep contents cold for 24 hours?", "The source conflicts: the detailed specification says 21 hours while the title says up to 24. Neither is a guaranteed rental performance figure."], ["What is included?", "The rental draft includes one cooler box with its removable lid. Food, drinks and ice packs are not included."]],
      es: [["¿Qué tamaño tiene la nevera Naturehike?", "Tiene 24 litros de capacidad y mide 44 × 26 × 40 cm."], ["¿Mantiene el frío durante 24 horas?", "La fuente se contradice: la especificación indica 21 horas y el título dice hasta 24. Ninguna cifra garantiza el rendimiento durante el alquiler."], ["¿Qué incluye?", "El borrador incluye una nevera con su tapa extraíble. No incluye alimentos, bebidas ni acumuladores."]],
    },
  },
  {
    slug: "steamy-cool-50l-wheeled-cooler",
    name: "Steamy Cool 50 L Wheeled Cooler",
    brand: "Steamy",
    subcategory: "Coolers",
    subcategorySlug: "coolers",
    emoji: "🧊",
    sourceUrl: "https://www.decathlon.es/es/p/mp/steamy-cool-50-nevera-portatil-con-ruedas-50l-azul/709fb9d0-9ea2-4944-bc6e-d5a4c625eb41/c5",
    sourceImageUrl: "https://contents.mediadecathlon.com/m15941438/k$521b6f5ea889d67cdd61285dc38798fa/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Blue Steamy Cool 50 litre portable cooler with wheels",
    description: "A large 50 L blue cooler with wheels, folding handles, foam insulation and solid latches for group outings.",
    features: ["Large 50 L capacity", "Wheels for easier transport", "Foam insulation", "Folding carrying handles", "Solid closing latches", "Suitable for group picnics and camping"],
    specs: { Brand: "Steamy", Model: "Steamy Cool 50", Capacity: "50 L", Colour: "Blue", Insulation: "Foam", Transport: "Wheels and folding handles", Closure: "Solid latches", "Unverified by source": "Dimensions, weight and numeric cooling duration are not stated" },
    localization: {
      en: {
        short_description: "Rent a 50 L wheeled cooler in Valencia for family beach days, group picnics and larger food or drink loads.",
        detail_description: "The Steamy Cool 50 offers a large 50-litre insulated compartment for group beach days, picnics and camping trips around Valencia. Wheels reduce the effort of moving a full cooler over firm, level surfaces, while folding handles and solid latches support transport and storage. The manufacturer listing identifies foam insulation and weather-resistant stainless-steel components, but does not publish dimensions, empty weight or a tested cooling duration. Plan the load accordingly and remember that wheels will not eliminate lifting over stairs, kerbs or deep sand.",
        includes_text: "One Steamy Cool 50 L wheeled cooler. Food, drinks and ice packs are not included.",
        constraints_text: "Dimensions, empty weight and guaranteed cooling duration are not stated by the source. The cooler may require two people to lift when full.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option. Pre-chill contents and add suitable ice packs shortly before use.",
        care_note: "Empty, wipe and dry the cooler after use. Keep the latches, handles and wheel area free from sand and debris.",
        seo_title: "Rent a 50 L Wheeled Cooler in Valencia",
        seo_description: "Rent a Steamy Cool 50 L wheeled cooler in Valencia for family beach days and group picnics. Large capacity, folding handles and solid latches.",
      },
      es: {
        short_description: "Alquila una nevera de 50 L con ruedas en Valencia para días de playa en familia, pícnics de grupo y cargas grandes.",
        detail_description: "La Steamy Cool 50 ofrece un compartimento aislado de 50 litros para días de playa en grupo, pícnics y camping en Valencia. Las ruedas reducen el esfuerzo sobre superficies firmes y llanas, mientras que las asas plegables y los cierres sólidos facilitan el transporte y el almacenamiento. La ficha del fabricante indica aislamiento de espuma y componentes de acero inoxidable resistentes a la intemperie, pero no publica las dimensiones, el peso en vacío ni una duración de frío ensayada. Planifica la carga y recuerda que habrá que levantarla en escaleras, bordillos o arena profunda.",
        includes_text: "Una nevera Steamy Cool de 50 L con ruedas. No incluye alimentos, bebidas ni acumuladores de frío.",
        constraints_text: "La fuente no indica dimensiones, peso en vacío ni duración de refrigeración garantizada. Puede requerir dos personas para levantarla cuando está llena.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Preenfría el contenido y añade acumuladores adecuados poco antes de usarla.",
        care_note: "Vacía, limpia y seca la nevera después de usarla. Retira arena y residuos de cierres, asas y ruedas.",
        seo_title: "Alquiler Nevera con Ruedas 50 L Valencia",
        seo_description: "Alquila una Steamy Cool de 50 L con ruedas en Valencia para playa y pícnic. Gran capacidad, asas plegables y cierres sólidos.",
      },
    },
    faqs: {
      en: [["How much does this cooler hold?", "Its listed capacity is 50 litres, making it suitable for a family or group load."], ["Can it be rolled onto the beach?", "The wheels help on firm, level surfaces. Deep sand, kerbs and stairs may still require lifting."], ["How long does it stay cold?", "The source does not publish a tested duration. Performance depends on ice packs, starting temperature, heat and opening frequency."]],
      es: [["¿Qué capacidad tiene esta nevera?", "La capacidad indicada es de 50 litros, adecuada para una carga familiar o de grupo."], ["¿Se puede llevar con ruedas por la playa?", "Las ruedas ayudan en superficies firmes y llanas. La arena profunda, bordillos y escaleras pueden requerir levantarla."], ["¿Cuánto tiempo mantiene el frío?", "La fuente no publica una duración ensayada. Depende de los acumuladores, la temperatura inicial, el calor y las aperturas."]],
    },
  },
  {
    slug: "feroce-18l-portable-cooler",
    name: "Feroce 18 L Portable Cooler",
    brand: "Feroce",
    subcategory: "Coolers",
    subcategorySlug: "coolers",
    emoji: "🧊",
    sourceUrl: "https://www.decathlon.es/es/p/mp/nevera-portatil-18l-amarilla/d425fb41-a8f1-40ec-abad-6fe4a4e5b976/c22",
    sourceImageUrl: "https://contents.mediadecathlon.com/m22828656/k$7c207565b06daaa25bc51023a842e6b2/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Yellow Feroce 18 litre portable insulated cooler",
    description: "An 18 L yellow insulated cooler with water-resistant 900D polyester, reinforced zips and multiple carrying straps.",
    features: ["18 L capacity", "Water-resistant 900D polyester outer", "Polyethylene-foam insulation", "Reinforced water-resistant zips", "Padded adjustable shoulder strap", "Short and long side carrying handles"],
    specs: { Brand: "Feroce", Capacity: "18 L", Dimensions: "30 × 25 × 29.5 cm", Weight: "1.7 kg", Colour: "Yellow", Material: "Polyethylene foam and 900D polyester with water-resistant TPU coating", Closure: "Zip", Transport: "Padded shoulder strap and side handles" },
    localization: {
      en: {
        short_description: "Rent an 18 L Feroce insulated cooler in Valencia with versatile handles for beach and outdoor days.",
        detail_description: "The Feroce 18 L portable cooler measures 30 × 25 × 29.5 cm and weighs 1.7 kg empty. Its insulated polyethylene-foam core is wrapped in 900D polyester with a water-resistant TPU coating, and the reinforced zips are also described as water resistant. Long side straps allow one-person carrying, shorter side handles can be shared between two people and the adjustable shoulder strap has protective padding. It is a useful middle-size option for a couple or small group visiting Valencia's beaches and parks. The source says it keeps provisions cool for hours but gives no guaranteed duration.",
        includes_text: "One Feroce 18 L portable insulated cooler. Food, drinks and ice packs are not included.",
        constraints_text: "Water resistant does not mean submersible or leakproof. No guaranteed cooling duration is stated.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option. Add pre-chilled contents and suitable ice packs before departure.",
        care_note: "Use sealed containers, empty the cooler after use and wipe it clean. Leave it open until fully dry before return.",
        seo_title: "Rent an 18 L Portable Cooler in Valencia",
        seo_description: "Rent a Feroce 18 L portable cooler in Valencia. Insulated, water-resistant and easy to carry for beach days, picnics and festivals.",
      },
      es: {
        short_description: "Alquila una nevera térmica Feroce de 18 L en Valencia con varias asas para playa y actividades al aire libre.",
        detail_description: "La nevera portátil Feroce de 18 L mide 30 × 25 × 29,5 cm y pesa 1,7 kg vacía. El núcleo aislante de espuma de polietileno está recubierto de poliéster 900D con revestimiento de TPU resistente al agua, y las cremalleras reforzadas también se describen como resistentes al agua. Las correas laterales largas permiten transportarla una persona, las asas cortas pueden compartirse entre dos y la correa ajustable para el hombro incorpora acolchado. Es una opción intermedia para una pareja o un grupo pequeño en las playas y parques de Valencia. La fuente dice que conserva el frío durante horas, pero no ofrece una duración garantizada.",
        includes_text: "Una nevera térmica portátil Feroce de 18 L. No incluye alimentos, bebidas ni acumuladores de frío.",
        constraints_text: "Resistente al agua no significa sumergible ni totalmente estanca. No se indica una duración de frío garantizada.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Añade productos preenfriados y acumuladores adecuados antes de salir.",
        care_note: "Utiliza recipientes cerrados, vacía la nevera y límpiala después de usarla. Déjala abierta hasta que se seque por completo.",
        seo_title: "Alquiler Nevera Portátil 18 L en Valencia",
        seo_description: "Alquila una nevera portátil Feroce de 18 L en Valencia. Aislada, resistente al agua y fácil de transportar para playa y pícnic.",
      },
    },
    faqs: {
      en: [["What are the cooler's dimensions?", "It measures 30 × 25 × 29.5 cm and weighs 1.7 kg empty."], ["Is it waterproof?", "The outer coating and reinforced zips are described as water resistant, not submersible or completely leakproof."], ["How can it be carried?", "It has long side straps, shorter two-person handles and an adjustable padded shoulder strap."]],
      es: [["¿Cuáles son las medidas de la nevera?", "Mide 30 × 25 × 29,5 cm y pesa 1,7 kg vacía."], ["¿Es impermeable?", "El revestimiento exterior y las cremalleras se describen como resistentes al agua, no como sumergibles o totalmente estancos."], ["¿Cómo se puede transportar?", "Tiene correas laterales largas, asas cortas para dos personas y una correa de hombro ajustable y acolchada."]],
    },
  },
  {
    slug: "quechua-compact-2-person-camping-table",
    name: "Quechua Compact 2-Person Camping Table",
    brand: "Quechua",
    subcategory: "Camping Tables",
    subcategorySlug: "camping-tables",
    emoji: "🏕️",
    sourceUrl: "https://www.decathlon.es/es/p/mesa-de-camping-compacta-2-personas-blanca/303250/c2c12m8927565",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2817357/k$8aa45b7aa0298ead279c6996b2c30f73/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Compact light grey Quechua camping table for two people",
    description: "A lightweight low camping table for two with a 58 × 58 cm aluminium top, storage net and compact carry bag.",
    features: ["58 × 58 cm top for two people", "Low 40 cm table height", "2.3 kg lightweight design", "Compact folding system", "Under-table net and two pockets", "30 kg maximum tabletop load"],
    specs: { Brand: "Quechua", Capacity: "2 people", Open: "58 × 58 × 40 cm", Folded: "Source lists 62 × 12 × 10 cm in features and 58 × 12 × 10 cm elsewhere", Weight: "2.3 kg", "Maximum tabletop load": "30 kg", Tabletop: "Aluminium", Structure: "90% aluminium, 10% polypropylene", "Carry bag": "100% polyester" },
    localization: {
      en: {
        short_description: "Rent a compact low camping table for two in Valencia for beach picnics, parks and small outdoor setups.",
        detail_description: "This Quechua table opens to a 58 × 58 cm square surface at a low 40 cm height, making it useful for two people at a beach picnic or in a campsite. The aluminium tabletop and structure support a maximum tabletop load of 30 kg, while a storage net and two pockets keep lighter essentials off the ground. Internal elastics help guide the quick assembly, and the 2.3 kg table packs into its carry bag. Decathlon's page lists two slightly different folded lengths, 62 cm in the feature section and 58 cm elsewhere; the verified folded width and depth are 12 × 10 cm.",
        includes_text: "One Quechua compact table, under-table storage net and carry bag. Chairs and tableware are not included.",
        constraints_text: "Low 40 cm height. Maximum tabletop load 30 kg. Do not sit or stand on the table. Folded length varies between 58 and 62 cm in the source.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option. Assembly requires unfolding the cross-frame, fitting the bars and attaching the top and storage net.",
        care_note: "Wipe with a damp cloth or sponge, dry fully and store in the carry bag. Keep it dry between uses.",
        seo_title: "Rent a Compact Camping Table in Valencia",
        seo_description: "Rent a compact Quechua camping table for two in Valencia. Lightweight aluminium design, storage net, carry bag and 30 kg tabletop capacity.",
      },
      es: {
        short_description: "Alquila una mesa baja de camping compacta para dos en Valencia, ideal para pícnic, playa y espacios exteriores pequeños.",
        detail_description: "Esta mesa Quechua ofrece una superficie cuadrada de 58 × 58 cm a 40 cm de altura, adecuada para dos personas en un pícnic de playa o camping. La encimera y la estructura de aluminio soportan una carga máxima de 30 kg, mientras que la red y los dos bolsillos mantienen objetos ligeros separados del suelo. Los elásticos interiores guían el montaje rápido y la mesa de 2,3 kg se guarda en su funda. La página de Decathlon indica dos longitudes plegadas distintas, 62 cm en características y 58 cm en otra sección; la anchura y el grosor plegados verificados son 12 × 10 cm.",
        includes_text: "Una mesa compacta Quechua, red de almacenamiento inferior y funda de transporte. No incluye sillas ni vajilla.",
        constraints_text: "Mesa baja de 40 cm. Carga máxima de 30 kg sobre la encimera. No sentarse ni ponerse de pie. La fuente varía entre 58 y 62 cm de longitud plegada.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Para montarla hay que desplegar la estructura, colocar las barras y fijar la encimera y la red.",
        care_note: "Limpia con un paño húmedo o una esponja, seca por completo y guarda en la funda. Mantener seca entre usos.",
        seo_title: "Alquiler Mesa Camping Compacta en Valencia",
        seo_description: "Alquila una mesa Quechua compacta para dos en Valencia. Aluminio ligero, red inferior, funda y capacidad máxima de 30 kg.",
      },
    },
    faqs: {
      en: [["How high is the table?", "It is a low table with a 40 cm height and a 58 × 58 cm top."], ["How much weight can it hold?", "The listed maximum load on the tabletop is 30 kg. It must not be used as a seat or step."], ["Is it easy to transport?", "It weighs 2.3 kg and packs into a carry bag. The source gives a folded length between 58 and 62 cm, with a 12 × 10 cm cross-section."]],
      es: [["¿Qué altura tiene la mesa?", "Es una mesa baja de 40 cm con encimera de 58 × 58 cm."], ["¿Cuánto peso soporta?", "La carga máxima indicada sobre la encimera es de 30 kg. No debe utilizarse como asiento o escalón."], ["¿Es fácil de transportar?", "Pesa 2,3 kg y se guarda en una funda. La fuente indica entre 58 y 62 cm de longitud plegada, con sección de 12 × 10 cm."]],
    },
  },
  {
    slug: "outsunny-70cm-folding-camping-table",
    name: "Outsunny 70 cm Folding Camping Table",
    brand: "Outsunny",
    subcategory: "Camping Tables",
    subcategorySlug: "camping-tables",
    emoji: "🏕️",
    sourceUrl: "https://www.decathlon.es/es/p/mp/mesa-de-camping-plegable-outsunny-70x70x69-cm-negro/a16bfbf6-1f47-422e-8ce9-3effc6aca834/c1",
    sourceImageUrl: "https://contents.mediadecathlon.com/m16288734/k$69a6f31ab3658c8e704121b360d6eb16/picture.jpg?f=1920x0&format=auto",
    imageAlt: "Black Outsunny 70 centimetre folding camping table",
    description: "A full-height 70 × 70 cm folding camping table with a roll-up aluminium top, lower mesh shelf and carry bag.",
    features: ["70 × 70 × 69 cm table", "Roll-up aluminium tabletop", "Lower mesh storage shelf", "Folds to 71 × 18 × 10 cm", "30 kg total maximum load", "Carry bag and anti-slip feet"],
    specs: { Brand: "Outsunny", Reference: "84B-567", Open: "70 × 70 × 69 cm", Folded: "71 × 18 × 10 cm", Weight: "Source description says 4 kg; specification table says 5 kg", "Maximum total load": "30 kg", "Lower shelf": "48 × 48 × 18 cm; maximum 5 kg", Materials: "Aluminium, iron and mesh fabric", Colour: "Black" },
    localization: {
      en: {
        short_description: "Rent a full-height 70 cm folding camping table in Valencia for outdoor meals, barbecues and group picnics.",
        detail_description: "The Outsunny folding table provides a 70 × 70 cm surface at a practical 69 cm dining height. Its roll-up aluminium top, X-frame and anti-slip feet create a portable setup for camping, garden meals or a Valencia picnic. A 48 × 48 × 18 cm lower mesh shelf holds lighter items up to 5 kg, while the table's total listed maximum load is 30 kg. It folds to 71 × 18 × 10 cm and includes a carry bag. The source contains a weight conflict: the description says 4 kg while the specification table says 5 kg, so the rental draft records a 4–5 kg source range.",
        includes_text: "One Outsunny folding table, lower mesh shelf and carry bag. Chairs, tableware and barbecue equipment are not included.",
        constraints_text: "Maximum total load 30 kg and lower shelf load 5 kg. Assembly is required. Do not sit or stand on the table. Source-listed weight varies from 4 to 5 kg.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option. Assemble the X-frame, fit the roll-up top and secure the lower shelf on stable, level ground.",
        care_note: "Wipe clean, remove sand and moisture, allow all parts to dry and return the folded table in its carry bag.",
        seo_title: "Rent a Folding Camping Table in Valencia",
        seo_description: "Rent an Outsunny 70 cm folding camping table in Valencia. Full dining height, roll-up aluminium top, lower shelf and carry bag.",
      },
      es: {
        short_description: "Alquila una mesa de camping plegable de 70 cm en Valencia para comidas al aire libre, barbacoas y pícnics en grupo.",
        detail_description: "La mesa plegable Outsunny ofrece una superficie de 70 × 70 cm a una altura práctica de 69 cm para comer. La encimera enrollable de aluminio, la estructura en X y los pies antideslizantes crean un conjunto portátil para camping, jardín o pícnic en Valencia. La balda inferior de malla mide 48 × 48 × 18 cm y soporta hasta 5 kg, mientras que la carga máxima total indicada es de 30 kg. Plegada mide 71 × 18 × 10 cm e incluye funda. La fuente contiene una contradicción de peso: la descripción indica 4 kg y la tabla de especificaciones 5 kg, por lo que el borrador registra el intervalo de 4–5 kg.",
        includes_text: "Una mesa plegable Outsunny, balda inferior de malla y funda. No incluye sillas, vajilla ni material de barbacoa.",
        constraints_text: "Carga máxima total de 30 kg y 5 kg en la balda. Requiere montaje. No sentarse ni ponerse de pie. El peso indicado por la fuente varía entre 4 y 5 kg.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia. Monta la estructura en X, coloca la encimera y fija la balda sobre terreno firme y nivelado.",
        care_note: "Limpia, retira arena y humedad, deja secar todas las piezas y devuelve la mesa plegada dentro de su funda.",
        seo_title: "Alquiler Mesa Camping Plegable en Valencia",
        seo_description: "Alquila una mesa Outsunny plegable de 70 cm en Valencia. Altura de comedor, encimera de aluminio, balda inferior y funda.",
      },
    },
    faqs: {
      en: [["Is this a low beach table?", "No. It is 69 cm high, closer to a standard dining-table height than the compact low table."], ["How much weight can it hold?", "The listed maximum is 30 kg total and 5 kg on the lower mesh shelf. It is not a seat or step."], ["How heavy is it?", "The source conflicts: its description says 4 kg and its specification table says 5 kg, so allow for 4–5 kg."]],
      es: [["¿Es una mesa baja de playa?", "No. Tiene 69 cm de altura, más próxima a una mesa de comedor que a una mesa baja compacta."], ["¿Cuánto peso soporta?", "El máximo indicado es 30 kg en total y 5 kg en la balda inferior. No es un asiento ni un escalón."], ["¿Cuánto pesa?", "La fuente se contradice: la descripción indica 4 kg y la tabla de especificaciones 5 kg, así que considera 4–5 kg."]],
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

  const results = [];
  for (const product of products) {
    const duplicate = await client.query("select id from products where slug = $1", [product.slug]);
    if (duplicate.rowCount > 0) throw new Error(`Product already exists: ${product.slug}`);

    const imageResponse = await fetch(product.sourceImageUrl);
    if (!imageResponse.ok) throw new Error(`Image download failed for ${product.slug}: ${imageResponse.status}`);
    const contentType = (imageResponse.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error(`Image source was not an image for ${product.slug}`);
    const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
    const storagePath = `${product.slug}/${Date.now()}-primary.${extensionFor(contentType)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, imageBytes, { contentType, upsert: false });
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
          category.rows[0].id, product.subcategory, product.subcategorySlug,
          product.localization.en.seo_title, product.localization.en.seo_description,
          JSON.stringify(product.features), JSON.stringify(product.specs)],
      );
      const productId = inserted.rows[0].id;

      await client.query("insert into pricing_tiers (product_id, min_days, per_day_cents) values ($1,1,0)", [productId]);

      for (const [locale, localization] of Object.entries(product.localization)) {
        await client.query(
          `insert into product_localizations
            (product_id, locale, short_description, detail_description, includes_text, constraints_text,
             delivery_setup_note, care_note, seo_title, seo_description)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [productId, locale, localization.short_description, localization.detail_description,
            localization.includes_text, localization.constraints_text, localization.delivery_setup_note,
            localization.care_note, localization.seo_title, localization.seo_description],
        );
      }

      for (const [locale, entries] of Object.entries(product.faqs)) {
        for (const [sortOrder, [question, answer]] of entries.entries()) {
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
      results.push({ id: productId, slug: product.slug, imageUrl, contentStatus: "facts_verified", active: false });
    } catch (error) {
      await client.query("rollback");
      await supabase.storage.from("product-images").remove([storagePath]);
      throw error;
    }
  }

  const slugs = products.map((product) => product.slug);
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
    [slugs],
  );
  await client.end();

  if (verification.rowCount !== products.length) throw new Error("Post-import verification did not find all six products");
  for (const row of verification.rows) {
    if (row.is_active || row.content_status !== "facts_verified" || Number(row.stock_total) !== 0
      || Number(row.stock_available) !== 0 || row.localization_count !== "2" || Number(row.faq_count) !== 6
      || Number(row.primary_image_count) !== 1 || Number(row.pricing_count) !== 1) {
      throw new Error(`Post-import verification failed: ${JSON.stringify(row)}`);
    }
  }

  console.log(JSON.stringify({ created: results, verified: verification.rows }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
