import { getDestinationBySlug, getDestinationGovernance, type HubType } from "@/content/destinations";

export interface SpanishDiscoverSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface SpanishDiscoverGuide {
  slug: string;
  name: string;
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
  lastUpdated: string;
  region: string;
  quickFacts: { label: string; value: string }[];
  overview: string[];
  sections: SpanishDiscoverSection[];
  practicalTips: string[];
  faqs: { question: string; answer: string }[];
  relatedGuides: string[];
}

const spanishDiscoverGuides: SpanishDiscoverGuide[] = [
  {
    slug: "malvarrosa-beach",
    name: "Playa de la Malvarrosa",
    title: "Playa de la Malvarrosa: guía local de Valencia",
    description:
      "Guía práctica de la playa de la Malvarrosa en Valencia: cómo llegar, servicios, accesibilidad, ambiente familiar y consejos para organizar el día.",
    tagline: "La gran playa urbana de Valencia, con paseo marítimo, servicios y fácil acceso desde la ciudad",
    heroImage: "/discover/malvarrosa-beach.webp",
    heroImageAlt: "Playa de la Malvarrosa en Valencia junto al Mediterráneo",
    lastUpdated: "2026-07-20",
    region: "Valencia ciudad",
    quickFacts: [
      { label: "Tipo de playa", value: "Urbana, amplia y con paseo marítimo" },
      { label: "Mejor para", value: "Primeras visitas, familias y acceso sencillo" },
      { label: "Temporada de baño", value: "Principalmente de junio a septiembre" },
      { label: "Tiempo orientativo", value: "De 3 horas a un día completo" },
    ],
    overview: [
      "La Malvarrosa es una de las playas más conocidas y accesibles de Valencia. Su arena amplia, el paseo marítimo y la conexión con el tejido urbano la convierten en una opción práctica para quienes quieren combinar playa, comida y un desplazamiento sencillo desde su alojamiento.",
      "No es una playa de resort: forma parte de la vida diaria de la ciudad. Por la mañana se llena de personas que pasean o hacen deporte y, durante el verano, de familias y visitantes que pasan varias horas junto al mar. La zona cuenta con restaurantes, duchas, aseos y servicios estacionales, aunque conviene confirmar los horarios y la disponibilidad concreta el mismo día.",
    ],
    sections: [
      {
        heading: "Cómo llegar desde Valencia",
        paragraphs: [
          "Se puede llegar en tranvía, autobús, bicicleta o taxi. La mejor ruta depende del punto de partida y de cuánto equipamiento lleves. Metrovalencia y EMT pueden modificar frecuencias o paradas, por lo que recomendamos revisar el trayecto antes de salir.",
        ],
        bullets: [
          "Tranvía: las líneas 4 y 6 conectan distintos puntos de la ciudad con la zona de playa.",
          "Autobús: varias líneas de EMT llegan al paseo marítimo desde el centro y otros barrios.",
          "Bicicleta: existe una ruta mayoritariamente llana desde el Jardín del Turia hacia el litoral.",
          "Coche: el aparcamiento puede ser difícil durante fines de semana y días de verano.",
        ],
      },
      {
        heading: "Servicios y ambiente",
        paragraphs: [
          "El paseo marítimo concentra restaurantes, terrazas y accesos a la arena. En verano suele haber vigilancia y servicios de temporada, pero su calendario exacto puede cambiar. Para comer arroz o paella junto al mar, reserva directamente con el restaurante, especialmente durante el fin de semana.",
        ],
        bullets: [
          "Paseo marítimo amplio y llano para caminar, usar silla de ruedas o desplazarse con carrito.",
          "Duchas, lavapiés y aseos distribuidos a lo largo de la playa según temporada.",
          "Zonas deportivas y espacios de juego en distintos puntos del litoral.",
          "Restaurantes históricos como La Pepica y Casa Carmela en el entorno marítimo.",
        ],
      },
      {
        heading: "Accesibilidad y visitas en familia",
        paragraphs: [
          "La Malvarrosa dispone de un paseo accesible y pasarelas de madera que acercan a la arena. Valencia ofrece servicios estacionales de baño asistido en determinadas playas; antes de desplazarte, confirma con el Ayuntamiento o el servicio responsable las fechas, el punto exacto y si es necesaria reserva.",
          "Con niños pequeños, llegar temprano reduce el calor y facilita encontrar un lugar con espacio. Una sombrilla estable, agua suficiente y un sistema sencillo para transportar toallas, sillas o juguetes hacen una diferencia importante en un día largo de playa.",
        ],
      },
      {
        heading: "Cuándo visitar la Malvarrosa",
        paragraphs: [
          "Junio y septiembre suelen ofrecer una buena combinación de temperatura y menor ocupación que agosto. En julio y agosto, la mañana es normalmente el momento más cómodo. Fuera del verano, el paseo marítimo sigue siendo agradable para caminar, comer o pasar unas horas al aire libre aunque no sea temporada de baño.",
        ],
      },
    ],
    practicalTips: [
      "Lleva protección solar, agua y sombra propia si vas a pasar varias horas en la arena.",
      "Comprueba la bandera de baño y sigue siempre las indicaciones del personal de vigilancia.",
      "Decide primero en qué tramo de la playa quieres instalarte antes de transportar todo el equipo.",
      "Reserva el restaurante por separado; alquilar equipamiento no garantiza mesa ni servicio de comida.",
    ],
    faqs: [
      {
        question: "¿La playa de la Malvarrosa es gratuita?",
        answer: "Sí. El acceso a la playa es gratuito. Solo pagarás por servicios opcionales, comida, bebidas o alquileres privados.",
      },
      {
        question: "¿Es buena para familias con niños pequeños?",
        answer: "Sí. Tiene un paseo amplio, accesos urbanos y servicios próximos. En verano conviene llegar temprano, llevar sombra y revisar el estado del mar antes del baño.",
      },
      {
        question: "¿Se puede acceder con silla de ruedas?",
        answer: "El paseo es llano y existen accesos adaptados y pasarelas estacionales. Los servicios de baño asistido dependen del calendario municipal, por lo que deben confirmarse antes de la visita.",
      },
    ],
    relatedGuides: ["patacona-beach", "pinedo-beach", "el-saler-beach"],
  },
  {
    slug: "patacona-beach",
    name: "Playa de la Patacona",
    title: "Playa de la Patacona: guía local de Valencia",
    description:
      "Planifica un día en la playa de la Patacona: transporte, ambiente, servicios, accesibilidad, restaurantes y consejos para familias cerca de Valencia.",
    tagline: "Una continuación más tranquila del litoral urbano, popular entre familias y residentes",
    heroImage: "/discover/patacona-hero.webp",
    heroImageAlt: "Arena amplia y mar Mediterráneo en la playa de la Patacona",
    lastUpdated: "2026-07-20",
    region: "Alboraia, litoral norte",
    quickFacts: [
      { label: "Tipo de playa", value: "Urbana, amplia y de ambiente local" },
      { label: "Mejor para", value: "Familias, espacio y días tranquilos" },
      { label: "Desde Malvarrosa", value: "Aproximadamente 15 minutos a pie" },
      { label: "Tiempo orientativo", value: "Medio día o día completo" },
    ],
    overview: [
      "La Patacona se encuentra al norte de la Malvarrosa y pertenece al municipio de Alboraia. Las dos playas están unidas por el paseo marítimo, pero la Patacona suele tener un ambiente algo más tranquilo y residencial.",
      "Es una opción especialmente cómoda para familias que buscan más espacio, visitantes alojados al norte de Valencia y quienes quieren combinar el día de playa con una comida frente al mar. Como en cualquier playa urbana, la ocupación aumenta mucho durante los fines de semana de verano.",
    ],
    sections: [
      {
        heading: "Cómo llegar a la Patacona",
        paragraphs: [
          "Puedes llegar caminando desde la Malvarrosa, en transporte público, en bicicleta o en taxi. Si llevas nevera, sillas, juguetes o equipamiento infantil, valora la distancia real desde la parada o el aparcamiento hasta el punto donde quieras instalarte.",
        ],
        bullets: [
          "A pie: sigue el paseo marítimo hacia el norte desde la Malvarrosa.",
          "Tranvía: revisa las rutas actuales de Metrovalencia y la parada más conveniente para tu destino.",
          "Bicicleta: el paseo marítimo permite un acceso llano desde el litoral urbano.",
          "Coche: puede haber más opciones que en Las Arenas, pero el aparcamiento se llena en temporada alta.",
        ],
      },
      {
        heading: "Qué esperar en la playa",
        paragraphs: [
          "La arena es ancha y el paseo ofrece restaurantes, cafeterías y terrazas. El extremo norte suele resultar más tranquilo, mientras que las zonas próximas a los accesos principales y a las pistas de vóley concentran más actividad.",
        ],
        bullets: [
          "Espacio suficiente para una instalación familiar cuando se llega temprano.",
          "Pistas y redes de vóley en determinados tramos.",
          "Duchas, pasarelas y vigilancia sujetas al calendario de temporada.",
          "Restaurantes de arroz y cocina mediterránea a lo largo del paseo.",
        ],
      },
      {
        heading: "Familias y accesibilidad",
        paragraphs: [
          "El paseo es llano y cómodo para carritos y sillas de ruedas. Durante el verano se colocan pasarelas en distintos accesos, pero no todas llegan al mismo punto ni ofrecen los mismos servicios. Si necesitas asistencia específica, confirma la información municipal vigente antes de viajar.",
          "Para familias, el agua poco profunda puede ser una ventaja, pero nunca sustituye la supervisión. Lleva sombra, agua y una bolsa para recoger todos los residuos al terminar.",
        ],
      },
      {
        heading: "Comer y organizar el día",
        paragraphs: [
          "La Patacona permite combinar fácilmente playa y comida, pero los restaurantes más conocidos se llenan durante los fines de semana. Reserva directamente y confirma los horarios. Si prefieres llevar comida, usa una nevera adecuada y evita dejar alimentos perecederos expuestos al calor.",
        ],
      },
    ],
    practicalTips: [
      "Llega antes de las 10:00 en verano si quieres elegir zona con calma.",
      "Evita llevar vidrio y consulta las normas municipales vigentes para el uso de la playa.",
      "Comprueba la bandera y las condiciones del mar antes de entrar al agua.",
      "Una carretilla de playa puede ser útil si transportas equipamiento desde una calle interior.",
    ],
    faqs: [
      {
        question: "¿Es mejor la Patacona o la Malvarrosa?",
        answer: "Depende del plan. La Patacona suele sentirse más tranquila y espaciosa; la Malvarrosa ofrece una conexión urbana muy directa y más actividad. La ubicación de tu alojamiento puede ser el factor decisivo.",
      },
      {
        question: "¿Cómo se llega desde el centro de Valencia?",
        answer: "Se puede llegar en transporte público, bicicleta o taxi. Revisa Metrovalencia y EMT para la ruta actual desde tu punto de partida y calcula también el tramo a pie hasta la arena.",
      },
      {
        question: "¿Hay restaurantes en la Patacona?",
        answer: "Sí. El paseo marítimo cuenta con restaurantes y terrazas. Para comer arroz durante el fin de semana es recomendable reservar directamente con el local.",
      },
    ],
    relatedGuides: ["malvarrosa-beach", "pinedo-beach"],
  },
  {
    slug: "el-saler-beach",
    name: "Playa de El Saler",
    title: "Playa de El Saler: guía natural de Valencia",
    description: "Planifica un día en la playa de El Saler: transporte, dunas protegidas, servicios, accesibilidad y consejos para familias cerca de Valencia.",
    tagline: "Dunas, pinar y una jornada de playa más natural al sur de Valencia",
    heroImage: "/discover/el-saler-beach.jpg",
    heroImageAlt: "Arena, dunas y mar Mediterráneo en la playa de El Saler",
    lastUpdated: "2026-07-20",
    region: "Parque Natural de la Albufera",
    quickFacts: [
      { label: "Longitud", value: "Aproximadamente 2,6 km" },
      { label: "Entorno", value: "Dunas y pinar dentro del paisaje de la Albufera" },
      { label: "Mejor para", value: "Naturaleza, espacio y días completos" },
      { label: "Desde Valencia", value: "Aproximadamente 25-35 minutos" },
    ],
    overview: [
      "El Saler ofrece una experiencia más natural que las playas urbanas de Valencia. Se encuentra al sur de la ciudad, dentro del entorno del Parque Natural de la Albufera, con unos 2,6 kilómetros de arena fina y dorada protegidos por dunas y una amplia zona de pinar.",
      "La playa dispone de servicios estivales, postas sanitarias, aseos, duchas, mesas de pícnic, zonas de sombra y accesos adaptados. Como las instalaciones están repartidas entre diferentes entradas, elegir el punto de llegada es importante cuando se transportan sillas, neveras o equipamiento infantil.",
    ],
    sections: [
      {
        heading: "Cómo llegar a El Saler",
        paragraphs: ["Autobús, taxi, bicicleta y coche son opciones posibles. Revisa la ruta actual y guarda el acceso concreto antes de salir: la playa es larga y la distancia final desde una parada o aparcamiento puede variar mucho."],
        bullets: [
          "Autobús: EMT conecta Valencia con el entorno de El Saler; consulta la ruta vigente.",
          "Bicicleta: es una opción para ciclistas con experiencia, teniendo en cuenta el calor y el regreso.",
          "Coche: utiliza únicamente aparcamientos delimitados y evita dunas o vegetación protegida.",
          "Accesibilidad: el punto municipal se sitúa frente a la posta sanitaria 2 durante la temporada correspondiente.",
        ],
      },
      {
        heading: "Dunas y entorno protegido",
        paragraphs: [
          "El paisaje de dunas y pinar es parte esencial de El Saler. Utiliza siempre pasarelas y caminos señalizados, no cruces zonas valladas y recoge todos los residuos.",
          "El pinar no proporciona sombra sobre la arena. Para una estancia larga necesitas una sombrilla o refugio estable, protección solar y suficiente agua para todo el grupo.",
        ],
      },
      {
        heading: "Servicios y accesibilidad",
        paragraphs: ["La información municipal incluye aparcamiento adaptado, pasarelas, aseos y duchas accesibles, además de un punto estacional junto a la posta 2. La ayuda para entrar al mar requiere confirmación previa con el servicio municipal."],
        bullets: [
          "Postas sanitarias y vigilancia durante la temporada indicada.",
          "Aseos, duchas, lavapiés y fuentes distribuidos por distintos accesos.",
          "Mesas de pícnic y zonas de sombra fuera de la arena.",
          "Ayuda al baño sujeta a cita y disponibilidad estacional.",
        ],
      },
      {
        heading: "Planificar un día completo",
        paragraphs: ["El Saler funciona mejor como salida de medio día o día completo. Lleva comida bien conservada o confirma previamente dónde vas a comer. Llega temprano en fines de semana de verano para reducir el calor y la presión sobre el aparcamiento."],
      },
    ],
    practicalTips: [
      "Guarda el acceso exacto antes de salir y no dependas de un marcador genérico de la playa.",
      "Lleva más agua de la que crees necesaria y conserva los alimentos en frío.",
      "Consulta la bandera, la vigilancia y la ayuda al baño el mismo día.",
      "Protege las dunas utilizando exclusivamente caminos y pasarelas señalizados.",
    ],
    faqs: [
      { question: "¿Cómo se llega a la playa de El Saler?", answer: "Puedes llegar en autobús, taxi, bicicleta o coche. Consulta la ruta actual y elige un acceso específico porque la playa tiene 2,6 kilómetros y los servicios están repartidos." },
      { question: "¿El Saler es buena playa para familias?", answer: "Sí, especialmente para quienes buscan espacio y naturaleza. Requiere más planificación que una playa urbana: lleva sombra, agua y comida y llega temprano en verano." },
      { question: "¿La playa de El Saler es accesible?", answer: "La ciudad publica aparcamiento, accesos, aseos y duchas adaptadas, además de un punto estacional junto a la posta 2. Confirma previamente la ayuda al baño." },
    ],
    relatedGuides: ["pinedo-beach", "malvarrosa-beach", "patacona-beach"],
  },
  {
    slug: "pinedo-beach",
    name: "Playa de Pinedo",
    title: "Playa de Pinedo: guía accesible de Valencia",
    description: "Guía de la playa de Pinedo con accesibilidad, transporte, servicios de temporada y consejos prácticos para organizar una visita desde Valencia.",
    tagline: "Una playa local al sur del puerto con un punto accesible consolidado y ambiente tranquilo",
    heroImage: "/discover/pinedo-beach.jpg",
    heroImageAlt: "Arena amplia y mar Mediterráneo en la playa de Pinedo, Valencia",
    lastUpdated: "2026-07-20",
    region: "Poblats del Sud, Valencia",
    quickFacts: [
      { label: "Longitud", value: "Aproximadamente 1,5 km" },
      { label: "Mejor para", value: "Accesibilidad, familias y ambiente local" },
      { label: "Punto accesible", value: "Junto a la posta sanitaria 1" },
      { label: "Desde Valencia", value: "Aproximadamente 20-30 minutos" },
    ],
    overview: [
      "Pinedo es la primera playa situada al sur del puerto de Valencia y marca el inicio del litoral más natural que continúa hacia la Albufera. La carta municipal de servicios describe unos 1.500 metros de arena fina y dorada, ocupación moderada y un entorno menos urbano que la Malvarrosa.",
      "Su principal ventaja es el punto accesible situado junto a la posta sanitaria 1. Los servicios publicados incluyen pasarelas, aseos, vestuario y duchas adaptadas, aparcamiento reservado, información en braille y ayuda al baño durante la temporada correspondiente.",
    ],
    sections: [
      {
        heading: "Cómo llegar a Pinedo",
        paragraphs: ["Se puede llegar en autobús, taxi, bicicleta o coche. Consulta la ruta actual de EMT y el acceso exacto antes de salir, especialmente si necesitas llegar al punto accesible o transportas equipamiento."],
        bullets: [
          "Autobús: utiliza el planificador actual de EMT para localizar la parada más próxima.",
          "Bicicleta: es posible llegar hacia el sur, pero hay que valorar el calor y la distancia de regreso.",
          "Coche: existen aparcamientos públicos y plazas adaptadas, sin garantía de disponibilidad.",
          "Accesibilidad: toma la posta sanitaria 1 como referencia para organizar la llegada.",
        ],
      },
      {
        heading: "Accesibilidad y baño asistido",
        paragraphs: [
          "Pinedo es una de las playas accesibles designadas por la ciudad. Su punto dispone de rutas y equipamiento adaptado, una zona reservada y asistencia estacional mediante sillas anfibias y otros elementos de apoyo.",
          "Las fechas, horarios, aforo y necesidad de reserva pueden cambiar. Confirma el servicio directamente antes del desplazamiento y no asumas que todos los accesos de la playa ofrecen las mismas instalaciones.",
        ],
      },
      {
        heading: "Servicios y ambiente",
        paragraphs: ["Pinedo combina un entorno local con aseos, duchas, fuentes, pasarelas, vigilancia y servicios temporales durante la temporada de baño. Su ocupación suele ser más moderada que la de las grandes playas urbanas."],
        bullets: [
          "Arena fina y dorada con accesos señalizados.",
          "Servicios públicos y vigilancia sujetos al calendario estacional.",
          "Restaurantes y quioscos en el entorno, con horarios que deben confirmarse.",
          "Zona canina separada cuando el servicio municipal estacional está activo.",
        ],
      },
      {
        heading: "Organizar una visita en familia",
        paragraphs: ["Llega por la mañana para reducir el calor y simplificar la instalación. Lleva agua, protección solar y sombra suficiente. Si viajas con carrito, utiliza los accesos principales: la arena suelta sigue siendo difícil para ruedas convencionales fuera de las pasarelas."],
      },
    ],
    practicalTips: [
      "Comprueba la bandera del estado del mar antes de bañarte.",
      "Reserva o confirma la ayuda al baño cuando el servicio vigente lo requiera.",
      "Elige el acceso antes de salir; las instalaciones no son idénticas en toda la playa.",
      "Si vas con perro, confirma las fechas y normas actuales de la zona canina separada.",
    ],
    faqs: [
      { question: "¿La playa de Pinedo es accesible?", answer: "Sí. Cuenta con un punto accesible junto a la posta sanitaria 1, instalaciones adaptadas y ayuda al baño estacional. Confirma fechas y condiciones antes de viajar." },
      { question: "¿Cómo se llega desde Valencia?", answer: "Puedes llegar en autobús, taxi, bicicleta o coche. Consulta EMT para la ruta actual y selecciona el acceso exacto con antelación." },
      { question: "¿Se admiten perros en Pinedo?", answer: "Valencia ha habilitado una zona canina estacional y separada en Pinedo. Su calendario y normativa pueden cambiar, por lo que debes confirmar la información municipal vigente." },
    ],
    relatedGuides: ["el-saler-beach", "malvarrosa-beach", "patacona-beach"],
  },
  {
    slug: "oceanografic-valencia",
    name: "Oceanogràfic Valencia",
    title: "Oceanogràfic Valencia: guía práctica de visita",
    description: "Planifica tu visita al Oceanogràfic de Valencia con consejos sobre horarios, recorrido, accesibilidad, familias, comida y transporte.",
    tagline: "Acuarios, hábitats marinos y un recorrido que conviene organizar con tiempo",
    heroImage: "/discover/oceanografic-valencia.jpg",
    heroImageAlt: "Edificios blancos curvos y agua en el Oceanogràfic de Valencia",
    lastUpdated: "2026-07-20",
    region: "Ciudad de las Artes y las Ciencias, Valencia",
    quickFacts: [
      { label: "Mejor para", value: "Vida marina, familias y un día de atracción" },
      { label: "Tiempo orientativo", value: "Como mínimo medio día" },
      { label: "Comida exterior", value: "No está permitida dentro del recinto" },
      { label: "Accesibilidad", value: "Rampas, ascensores y recorridos adaptados" },
    ],
    overview: [
      "El Oceanogràfic forma parte de la Ciudad de las Artes y las Ciencias y se presenta como el mayor acuario de Europa. El recorrido conecta hábitats del Mediterráneo, océanos, islas tropicales, Ártico y Antártico mediante edificios interiores y trayectos exteriores.",
      "No es una visita rápida a una sola sala. Conviene organizar el día alrededor de las distancias, las comidas, los descansos y el programa de actividades. Una visita selectiva puede ocupar medio día; una familia que recorra la mayoría de zonas puede utilizar gran parte de la jornada.",
      "Los horarios, precios y actividades cambian según la fecha. Consulta siempre el calendario oficial para el día concreto y revisa el programa al llegar.",
    ],
    sections: [
      {
        heading: "Cómo organizar el recorrido",
        paragraphs: [
          "Consulta el mapa oficial y elige los hábitats prioritarios antes de empezar. El túnel submarino, las zonas polares y las actividades programadas suelen condicionar el orden, pero no es necesario correr para verlo todo.",
        ],
        bullets: [
          "Fotografía o guarda el programa del día al entrar.",
          "Añade tiempo real para caminar entre edificios.",
          "Acuerda un punto de encuentro si el grupo se separa.",
          "Lleva calzado cómodo para varias horas de recorrido.",
        ],
      },
      {
        heading: "Familias, bebés y comidas",
        paragraphs: [
          "El recinto admite carritos y dispone de salas de lactancia y cambio de bebés detrás del punto de información. El tamaño del complejo hace recomendable viajar con un carrito manejable y planificar descansos.",
          "La comida del exterior no está permitida. Revisa las opciones disponibles dentro del recinto y consulta directamente cualquier necesidad alimentaria antes de la visita.",
        ],
      },
      {
        heading: "Accesibilidad",
        paragraphs: [
          "La información oficial describe rampas, ascensores, puertas automáticas, pavimento antideslizante y recorridos adaptados. También ofrece préstamo de sillas de ruedas manuales sujeto a disponibilidad y depósito reembolsable.",
          "Si el préstamo de silla o una ruta concreta es esencial, confirma las condiciones actuales antes de desplazarte. El aparcamiento cuenta con plazas adaptadas, pero su disponibilidad no está garantizada.",
        ],
      },
      {
        heading: "Cómo llegar",
        paragraphs: [
          "Se puede llegar en autobús, bicicleta, taxi, caminando por el Jardín del Turia o en coche. Utiliza el planificador actual de EMT y selecciona Oceanogràfic como destino, no solo el conjunto general de la Ciudad de las Artes y las Ciencias.",
        ],
        bullets: [
          "Autobús: comprueba la parada más próxima y las posibles modificaciones.",
          "Bicicleta: el Jardín del Turia ofrece una aproximación llana.",
          "A pie: el recorrido es agradable, pero añade distancia antes de una visita larga.",
          "Coche: revisa las condiciones vigentes del aparcamiento oficial.",
        ],
      },
    ],
    practicalTips: [
      "Llega cerca de la apertura para empezar con menos concentración de visitantes.",
      "No dependas de horarios o precios publicados en guías antiguas.",
      "Las actividades pueden modificarse por razones operativas, meteorológicas o de bienestar animal.",
      "La salida y reentrada están limitadas; confirma las condiciones antes de abandonar el recinto.",
    ],
    faqs: [
      { question: "¿Cuánto tiempo necesito para visitar el Oceanogràfic?", answer: "Reserva como mínimo medio día. Con niños, actividades programadas y un ritmo tranquilo, la visita puede ocupar gran parte de la jornada." },
      { question: "¿Puedo llevar comida al Oceanogràfic?", answer: "La FAQ oficial indica que no se permite introducir comida del exterior. Consulta las opciones internas y cualquier requisito dietético antes de visitar." },
      { question: "¿Es accesible en silla de ruedas?", answer: "El recinto dispone de rampas, ascensores y recorridos adaptados. También ofrece sillas manuales sujetas a disponibilidad; confirma las condiciones si necesitas depender del servicio." },
      { question: "¿Conviene comprar entradas con antelación?", answer: "Sí para fechas de alta demanda, pero utiliza el calendario oficial del Oceanogràfic porque horarios, precios y combinaciones pueden cambiar." },
    ],
    relatedGuides: ["city-of-arts-and-sciences", "turia-gardens"],
  },
  {
    slug: "central-market-la-lonja",
    name: "Mercado Central y Lonja de la Seda",
    title: "Mercado Central y Lonja de Valencia: guía",
    description: "Organiza una visita al Mercado Central y la Lonja de la Seda de Valencia con ruta, contexto histórico, accesibilidad y consejos prácticos.",
    tagline: "Una ruta de mañana entre el mercado modernista y la Lonja gótica declarada Patrimonio Mundial",
    heroImage: "/discover/central-market-la-lonja.jpg",
    heroImageAlt: "Fachada gótica de la Lonja de la Seda en Valencia",
    lastUpdated: "2026-07-20",
    region: "Centro histórico de Valencia",
    quickFacts: [
      { label: "Orden recomendado", value: "Mercado Central y después la Lonja" },
      { label: "Tiempo orientativo", value: "Entre 2 y 3 horas" },
      { label: "Arquitectura", value: "Mercado modernista y monumento gótico civil" },
      { label: "Ubicación", value: "A ambos lados de la Plaça del Mercat" },
    ],
    overview: [
      "El Mercado Central y la Lonja de la Seda se encuentran frente a frente en el centro histórico, por lo que forman una de las combinaciones culturales más sencillas de Valencia. El mercado es un espacio de alimentación en funcionamiento dentro de un edificio modernista; la Lonja es una obra maestra del gótico civil reconocida por la UNESCO.",
      "Visita primero el mercado mientras mantiene su actividad comercial y cruza después la Plaça del Mercat para entrar en la Lonja. El trayecto es corto, pero los dos edificios merecen tiempo propio: uno por la cultura alimentaria local y el otro por sus columnas helicoidales y la historia comercial de Valencia.",
      "Los horarios del mercado y del monumento son independientes y pueden cambiar. Confirma la información oficial antes de acudir, especialmente en domingos, festivos y fechas con eventos locales.",
    ],
    sections: [
      {
        heading: "El mejor orden para la visita",
        paragraphs: [
          "Empieza por el Mercado Central durante la mañana y continúa después en la Lonja. Si todavía tienes tiempo y energía, la ruta se puede ampliar hacia El Carmen, la Catedral o la Plaça de la Reina sin cruzar la ciudad.",
        ],
        bullets: [
          "Consulta por separado los horarios oficiales de ambos edificios.",
          "Llega temprano para moverte con más facilidad por los pasillos.",
          "Guarda las compras perecederas de forma adecuada si continúas caminando.",
          "No añadas otra gran atracción al otro extremo de Valencia durante la misma mañana.",
        ],
      },
      {
        heading: "Visitar un mercado en funcionamiento",
        paragraphs: [
          "El Mercado Central no es únicamente un escenario turístico. Los comerciantes trabajan y los residentes realizan sus compras. Mantén libres los pasillos y mostradores, pide permiso antes de fotografiar de cerca y aparta el grupo antes de detenerte.",
          "Una bolsa reutilizable resulta útil, pero compra solo lo que puedas transportar y conservar de forma segura durante el resto del día.",
        ],
      },
      {
        heading: "La Lonja de la Seda",
        paragraphs: [
          "La Lonja es uno de los grandes edificios del gótico civil europeo y fue declarada Patrimonio Mundial por la UNESCO. Su Salón Columnario, con columnas helicoidales y bóvedas elevadas, refleja la importancia comercial de Valencia durante el auge de la seda.",
          "El edificio ocupa aproximadamente 1.990 metros cuadrados y se encuentra frente al mercado y junto a la iglesia de los Santos Juanes.",
        ],
      },
      {
        heading: "Accesibilidad y movilidad",
        paragraphs: [
          "La distancia entre ambos edificios es corta y el entorno es principalmente peatonal, pero hay pavimentos históricos, aglomeraciones y accesos monumentales. Confirma la entrada sin escalones vigente para cada edificio si resulta imprescindible.",
          "Para sillas de ruedas o carritos, una visita temprana facilita el movimiento dentro del mercado. El acceso final desde autobús o metro se realiza a pie por superficies urbanas variadas.",
        ],
      },
    ],
    practicalTips: [
      "Trata el mercado como un lugar de trabajo y no bloquees el paso al detenerte.",
      "Utiliza transporte público o camina; acceder en coche al centro histórico suele ser poco práctico.",
      "Comprueba los horarios actuales en fuentes oficiales en lugar de confiar en listados antiguos.",
      "Lleva una bolsa reutilizable y planifica cómo conservar cualquier alimento perecedero.",
    ],
    faqs: [
      { question: "¿Qué debo visitar primero, el Mercado Central o la Lonja?", answer: "Empieza por el Mercado Central durante su actividad de mañana y cruza después a la Lonja. Confirma los horarios oficiales de ambos antes de salir." },
      { question: "¿Cuánto tiempo necesito para ver los dos?", answer: "Reserva entre dos y tres horas para recorrer el mercado sin prisa, visitar la Lonja y disfrutar de la Plaça del Mercat." },
      { question: "¿El Mercado Central es adecuado para niños?", answer: "Sí, pero es un espacio concurrido y operativo. Mantén a los niños cerca, utiliza un carrito compacto y evita bloquear los pasillos." },
      { question: "¿La Lonja de la Seda es Patrimonio Mundial?", answer: "Sí. La UNESCO reconoce la Lonja de la Seda como Patrimonio Mundial y como una obra destacada de la arquitectura gótica civil." },
    ],
    relatedGuides: ["el-carmen", "el-ensanche"],
  },
  {
    slug: "semana-santa-marinera-valencia",
    name: "Semana Santa Marinera",
    title: "Semana Santa Marinera de Valencia: guía 2026",
    description: "Planifica la Semana Santa Marinera de Valencia 2026 con fechas, procesiones principales, rutas, accesibilidad y consejos para familias.",
    tagline: "La Semana Santa de los barrios marítimos, entre procesiones, tradición vecinal y vínculos con el mar",
    heroImage: "/discover/semana-santa-marinera.jpg",
    heroImageAlt: "Procesión de la Semana Santa Marinera en los barrios marítimos de Valencia",
    lastUpdated: "2026-07-20",
    region: "Poblats Marítims, Valencia",
    quickFacts: [
      { label: "Fechas 2026", value: "Del 27 de marzo al 5 de abril" },
      { label: "Zona principal", value: "Cabanyal, Canyamelar y Grau" },
      { label: "Precio", value: "Las procesiones en la calle son gratuitas" },
      { label: "Planificación", value: "Consulta el programa oficial vigente" },
    ],
    overview: [
      "La Semana Santa Marinera es la celebración de Semana Santa propia de los Poblats Marítims de Valencia. Sus procesiones recorren calles residenciales y mantienen tradiciones vinculadas a las comunidades marineras, con 31 hermandades, cofradías y corporaciones participantes en 2026.",
      "Para organizar la visita, conviene elegir uno de los tres grandes actos colectivos: la Visita a los Santos Monumentos del Jueves Santo, la Procesión General del Santo Entierro del Viernes Santo o el Desfile de Resurrección del Domingo de Pascua.",
      "Es una celebración religiosa y vecinal activa, no una representación creada para turistas. Deja paso a los participantes, evita bloquear portales y respeta las imágenes expuestas en viviendas particulares.",
    ],
    sections: [
      {
        heading: "Qué acto elegir",
        paragraphs: [
          "El Santo Entierro ofrece el momento colectivo más solemne. El Desfile de Resurrección tiene un ambiente más festivo y puede resultar más sencillo para una primera visita en familia. Los actos del Jueves Santo permiten conocer la relación entre hermandades, parroquias y barrios.",
        ],
        bullets: [
          "Elige un único tramo de la ruta en lugar de intentar seguir toda la procesión.",
          "Consulta hora, recorrido y posibles cambios en la web oficial.",
          "Llega antes de los cortes de tráfico y mantén libres los cruces.",
        ],
      },
      {
        heading: "Cómo llegar y moverse",
        paragraphs: [
          "Tranvía y autobús conectan el centro con los barrios marítimos, pero las procesiones provocan desvíos y cortes. Selecciona primero el punto de la ruta que quieres ver y después calcula el transporte hasta ese tramo.",
        ],
        bullets: [
          "Comprueba el planificador de Metrovalencia o EMT el mismo día.",
          "Evita depender del aparcamiento dentro de la zona procesional.",
          "Las barreras pueden alargar trayectos cortos entre Cabanyal, Canyamelar y Grau.",
        ],
      },
      {
        heading: "Familias y accesibilidad",
        paragraphs: [
          "El Ayuntamiento publica información inclusiva y orientación sobre espacios reservados para personas con movilidad reducida en los principales actos. Confirma la ubicación y el acceso vigentes antes de desplazarte.",
          "Con niños pequeños, un carrito compacto facilita los desplazamientos. Acuerda un punto de encuentro, lleva agua y elige una zona menos densa en lugar de situarte junto a los cruces principales.",
        ],
      },
      {
        heading: "Tradición durante todo el año",
        paragraphs: [
          "El Museo de la Semana Santa Marinera Salvador Caurín, en la calle Rosario 1, permite conocer el patrimonio de la celebración fuera de las fechas de Pascua. Consulta por separado sus horarios actuales.",
        ],
      },
    ],
    practicalTips: [
      "Descarga el programa oficial del año; las fechas, rutas y horarios cambian.",
      "Guarda un punto de encuentro fuera del recorrido si visitas en grupo.",
      "Lleva calzado cómodo, agua y una capa ligera para los actos nocturnos.",
      "Mantén un comportamiento respetuoso y pide permiso antes de fotografiar a corta distancia.",
    ],
    faqs: [
      { question: "¿Cuándo es la Semana Santa Marinera en 2026?", answer: "El programa oficial de 2026 se celebra del 27 de marzo al 5 de abril. Consulta los horarios y recorridos concretos en la web del Ayuntamiento de Valencia." },
      { question: "¿Hay que comprar entrada?", answer: "No se necesita entrada para ver las procesiones públicas en la calle. Otras actividades o espacios pueden tener condiciones propias." },
      { question: "¿Qué procesión es mejor para familias?", answer: "El Desfile de Resurrección ofrece un ambiente más festivo. Elige un tramo menos congestionado, lleva agua y acuerda un punto de encuentro." },
      { question: "¿Hay zonas accesibles?", answer: "El Ayuntamiento publica información inclusiva y zonas de visionado para personas con movilidad reducida en actos principales. Comprueba la ubicación vigente antes de salir." },
    ],
    relatedGuides: ["cabanyal", "malvarrosa-beach"],
  },
  {
    slug: "gran-fira-valencia",
    name: "Feria de Julio / Gran Fira",
    title: "Feria de Julio Valencia 2026: guía de la Gran Fira",
    description: "Organiza la Feria de Julio de Valencia 2026: Gran Nit, Batalla de Flores, actividades familiares, entradas, calor y transporte.",
    tagline: "Un mes de cultura al aire libre, música, fuegos artificiales y tradiciones por toda Valencia",
    heroImage: "/discover/gran-fira-valencia.jpg",
    heroImageAlt: "Carrozas decoradas con flores durante la Batalla de Flores de Valencia",
    lastUpdated: "2026-07-20",
    region: "Toda Valencia",
    quickFacts: [
      { label: "Programa 2026", value: "Del 1 al 26 de julio" },
      { label: "Escala", value: "Alrededor de 300 actividades" },
      { label: "Gran Nit", value: "18 de julio de 2026" },
      { label: "Batalla de Flores", value: "26 de julio, paseo de la Alameda" },
    ],
    overview: [
      "La Feria de Julio de Valencia, conocida también como Gran Fira, reúne en 2026 alrededor de 300 propuestas de música, cultura, tradición, fuegos artificiales y ocio. No funciona como un recinto único: las actividades se distribuyen por el centro, los barrios, las pedanías y espacios como los Jardines de Viveros.",
      "La Gran Nit del 18 de julio y la Batalla de Flores del 26 de julio son dos hitos del programa, pero responden a planes distintos. La primera concentra actividades nocturnas en varios puntos; la segunda es un acto concreto en el paseo de la Alameda.",
      "El contenido exacto cambia cada año. Utiliza esta guía para elegir el tipo de plan y preparar calor, desplazamientos y multitudes; confirma después horarios, ubicaciones, inscripciones, entradas y posibles cambios en la web oficial.",
    ],
    sections: [
      {
        heading: "Cómo elegir actividades",
        paragraphs: [
          "Filtra el programa oficial por fecha y zona. Combinar dos actividades próximas suele funcionar mejor que cruzar Valencia varias veces, especialmente con calor o durante la Gran Nit.",
        ],
        bullets: [
          "Distingue las actividades gratuitas de conciertos o propuestas con inscripción.",
          "Agrupa los planes por barrio o corredor de transporte.",
          "Comprueba de nuevo el estado del evento el mismo día.",
        ],
      },
      {
        heading: "Gran Nit y Batalla de Flores",
        paragraphs: [
          "La Gran Nit convierte una noche de julio en un programa simultáneo de cultura y entretenimiento. Elige pocos objetivos y deja margen para caminar, esperar y regresar al alojamiento.",
          "La Batalla de Flores cierra tradicionalmente la feria con carrozas cubiertas de flores en el paseo de la Alameda. Confirma las condiciones actuales de acceso, asientos y entradas en el programa oficial.",
        ],
      },
      {
        heading: "Calor, familias y ruido",
        paragraphs: [
          "Julio puede presentar temperaturas altas incluso al final de la tarde. Programa una pausa larga en interior o a la sombra, lleva agua y evita encadenar actividades diurnas con una noche completa de eventos.",
          "Con niños, selecciona propuestas familiares concretas y lleva protección auditiva para fuegos artificiales o actuaciones ruidosas. Un carrito compacto facilita los recorridos entre zonas concurridas.",
        ],
      },
      {
        heading: "Transporte y accesibilidad",
        paragraphs: [
          "No existe una única parada para la feria. Calcula cada trayecto según el recinto indicado y consulta posibles desvíos de EMT, horarios de Metrovalencia y cortes de tráfico.",
          "La accesibilidad depende del lugar. Si necesitas una ruta sin escalones, espacio reservado o asistencia, comprueba la ficha del acto y contacta con la organización antes de asistir.",
        ],
      },
    ],
    practicalTips: [
      "Guarda el programa oficial en el teléfono y revisa cambios el mismo día.",
      "Planifica agua, protección solar y descansos en interior.",
      "Acuerda un punto de encuentro para la Gran Nit y la Batalla de Flores.",
      "Consulta el transporte de vuelta antes de empezar una actividad nocturna.",
    ],
    faqs: [
      { question: "¿Cuándo es la Feria de Julio de Valencia en 2026?", answer: "El programa oficial de 2026 reúne actividades del 1 al 26 de julio. La Gran Nit se celebra el 18 de julio y la Batalla de Flores el 26 de julio." },
      { question: "¿La Feria de Julio es gratuita?", answer: "Muchas actividades son gratuitas, pero algunos conciertos y propuestas requieren entrada o inscripción previa. Revisa cada ficha del programa oficial." },
      { question: "¿Dónde se celebra la Gran Fira?", answer: "En distintos puntos de Valencia, no en un único recinto. El programa incluye espacios céntricos, barrios, pedanías, Viveros y el paseo de la Alameda." },
      { question: "¿Es adecuada para niños?", answer: "Sí, existen actividades familiares. Elige horarios compatibles con el calor, prepara descansos y utiliza protección auditiva en fuegos artificiales o espectáculos ruidosos." },
    ],
    relatedGuides: ["turia-gardens", "malvarrosa-beach", "albufera"],
  },
  {
    slug: "bioparc-valencia",
    name: "BIOPARC Valencia",
    title: "BIOPARC Valencia: entradas, acceso y familias",
    description: "Organiza una visita a BIOPARC Valencia con horarios oficiales, entradas, duración realista, transporte, accesibilidad y normas de comida.",
    tagline: "Una experiencia de fauna africana integrada en el paisaje junto al Parque de Cabecera",
    heroImage: "/discover/bioparc-valencia.jpg",
    heroImageAlt: "Hábitat africano con rocas, agua y vegetación en BIOPARC Valencia",
    lastUpdated: "2026-07-20",
    region: "Oeste de Valencia",
    quickFacts: [
      { label: "Duración", value: "De medio día a una jornada completa" },
      { label: "Apertura", value: "Todos los días; cierre variable" },
      { label: "Accesibilidad", value: "El parque se declara totalmente accesible" },
      { label: "Reentrada", value: "Normalmente no permitida" },
    ],
    overview: [
      "BIOPARC Valencia es un parque de fauna situado junto al Parque de Cabecera, en el extremo occidental del Jardín del Turia. Su diseño de zoo-inmersión conecta hábitats africanos mediante vegetación, agua, rocas y perspectivas abiertas.",
      "No lo trates como una visita rápida. La información oficial indica que la experiencia puede ocupar un día completo e incluye una agenda variable de actividades, restauración y zona infantil. Los animales se desplazan y descansan dentro de sus hábitats, por lo que la visibilidad cambia durante la jornada.",
      "Los horarios de cierre dependen de la fecha y de las horas de luz. Selecciona el día en el calendario oficial antes de comprar entradas y evita depender de precios u horarios publicados en guías antiguas.",
    ],
    sections: [
      {
        heading: "Entradas, horarios y tiempo real",
        paragraphs: ["BIOPARC abre todos los días, pero el cierre varía. La entrada se permite hasta una hora antes del cierre y normalmente no se puede salir y volver a entrar con el mismo ticket."],
        bullets: ["Consulta el calendario para la fecha concreta.", "Elige una franja de entrada compatible con tu ruta.", "Reserva al menos medio día y evita añadir otra gran atracción."],
      },
      {
        heading: "Cómo llegar",
        paragraphs: ["Metrovalencia, EMT, bicicleta por el Jardín del Turia y coche permiten llegar al entorno. Utiliza la página oficial de acceso y el planificador en tiempo real para confirmar el tramo final."],
        bullets: ["Las bicicletas no se pueden utilizar dentro del parque.", "Existe aparcamiento subterráneo con condiciones y tarifas variables.", "Combina la visita únicamente con el cercano Parque de Cabecera."],
      },
      {
        heading: "Familias, comida y descansos",
        paragraphs: ["Las normas actuales no permiten introducir comida o bebida general, salvo agua en recipientes que no sean de cristal, comida para bebés y algunos aperitivos para niños pequeños. El parque ofrece restauración y opciones infantiles."],
      },
      {
        heading: "Accesibilidad",
        paragraphs: ["La FAQ oficial describe el parque como totalmente accesible. Confirma directamente cualquier ayuda, documentación, acompañante gratuito o restricción relacionada con perros guía y de asistencia antes de viajar."],
      },
    ],
    practicalTips: [
      "Llega cerca de la apertura para disponer de más horas y temperaturas más suaves.",
      "Guarda el mapa y la agenda actual antes de iniciar el recorrido.",
      "Planifica comida y descanso antes de que los niños se cansen.",
      "Vuelve a los hábitats favoritos; no todos los animales son visibles en todo momento.",
    ],
    faqs: [
      { question: "¿Cuánto tiempo necesito para BIOPARC Valencia?", answer: "Reserva al menos medio día. La información oficial indica que los hábitats, actividades, restaurantes y zonas familiares pueden ocupar una jornada completa." },
      { question: "¿BIOPARC Valencia es accesible?", answer: "La FAQ oficial describe el parque como totalmente accesible. Confirma cualquier ayuda o requisito documental imprescindible antes de acudir." },
      { question: "¿Puedo llevar comida?", answer: "Las normas actuales permiten agua en recipientes que no sean de cristal, comida para bebés y algunos aperitivos para niños pequeños, pero no comida exterior general." },
      { question: "¿Puedo salir y volver a entrar?", answer: "Normalmente no. La reentrada requiere una entrada nueva o una autorización excepcional del personal." },
    ],
    relatedGuides: ["turia-gardens", "valencia-historic-centre"],
  },
  {
    slug: "valencia-historic-centre",
    name: "Centro histórico de Valencia",
    title: "Centro histórico de Valencia: ruta a pie práctica",
    description: "Recorre el centro histórico de Valencia desde Serranos hasta Quart con monumentos, tiempos realistas, accesibilidad y consejos para familias.",
    tagline: "Una ruta práctica por 2.000 años de historia cívica, religiosa y comercial",
    heroImage: "/discover/valencia-historic-centre.jpg",
    heroImageAlt: "Plaza de la Virgen, Catedral y Basílica en el centro histórico de Valencia",
    lastUpdated: "2026-07-20",
    region: "Ciutat Vella, Valencia",
    quickFacts: [
      { label: "Ruta base", value: "Torres de Serranos a Torres de Quart" },
      { label: "Recorrido sin visitas", value: "Aproximadamente 1 hora" },
      { label: "Visita realista", value: "Medio día con monumentos seleccionados" },
      { label: "Mejor estrategia", value: "Elegir 2 o 3 interiores" },
    ],
    overview: [
      "El centro histórico de Valencia reúne origen romano, murallas islámicas, puertas medievales, arquitectura gótica y espacios cívicos posteriores. Turisme Comunitat Valenciana identifica más de 20 bienes culturales reconocidos dentro de este conjunto histórico.",
      "La ruta municipal propone un recorrido de aproximadamente una hora entre las Torres de Serranos y las Torres de Quart. Ese tiempo corresponde al paseo, no a entrar en la Catedral, la Almoina, la Lonja, el Mercado Central u otros monumentos.",
      "Esta guía organiza la visión general de Ciutat Vella. Utiliza la guía específica del Mercado Central y la Lonja para esa visita de mañana, y la guía de El Carmen para conocer el barrio o valorar una estancia allí.",
    ],
    sections: [
      {
        heading: "Una ruta continua por Ciutat Vella",
        paragraphs: ["Empieza en Serranos, continúa hacia la Plaza de la Virgen y la Catedral, cruza hacia el entorno del Ayuntamiento y la Plaza del Mercado, y termina atravesando El Carmen hasta las Torres de Quart."],
        bullets: ["No intentes entrar en todos los monumentos.", "Selecciona dos o tres interiores antes de salir.", "Consulta el horario oficial de cada edificio por separado."],
      },
      {
        heading: "Plaza de la Virgen y Catedral",
        paragraphs: ["Este conjunto concentra la Catedral, el Micalet, la Basílica y la historia arqueológica de la Almoina. Subir al campanario o visitar interiores requiere tiempo adicional y puede limitar la accesibilidad."],
      },
      {
        heading: "Plaza del Mercado y El Carmen",
        paragraphs: ["El Mercado Central y la Lonja muestran la cultura alimentaria y la riqueza comercial medieval. Desde allí, el recorrido puede terminar por las calles de El Carmen y las Torres de Quart."],
      },
      {
        heading: "Accesibilidad y familias",
        paragraphs: ["Las plazas y muchas calles peatonales permiten una ruta cómoda, pero el pavimento histórico, las entradas monumentales y las multitudes varían. Confirma el acceso sin escalones de cada interior esencial."],
      },
    ],
    practicalTips: [
      "Utiliza la ruta Serranos–Quart como estructura, no como una promesa de verlo todo en una hora.",
      "Empieza por la mañana si quieres visitar el Mercado Central en actividad.",
      "Programa un descanso sentado antes de acumular fatiga.",
      "Lleva calzado cómodo, agua y un mapa guardado sin conexión.",
    ],
    faqs: [
      { question: "¿Cuánto tiempo necesito para el centro histórico?", answer: "La ruta municipal básica dura alrededor de una hora sin entrar en monumentos. Reserva entre tres y cinco horas para una primera visita con dos o tres interiores." },
      { question: "¿Qué debo ver primero?", answer: "Una ruta clara empieza en Serranos, pasa por la Plaza de la Virgen y la Catedral, continúa hacia la Plaza del Mercado y termina en Quart a través de El Carmen." },
      { question: "¿Es accesible el centro histórico?", answer: "Gran parte es peatonal, pero pavimentos y accesos monumentales varían. Comprueba la entrada adaptada de cada interior imprescindible." },
      { question: "¿El centro histórico es lo mismo que El Carmen?", answer: "No. El Carmen es uno de los barrios de Ciutat Vella. El centro histórico también incluye la zona de la Catedral, la Plaza del Mercado y otros sectores." },
    ],
    relatedGuides: ["central-market-la-lonja", "el-carmen", "el-ensanche"],
  },
  {
    slug: "bunol-day-trip",
    name: "Buñol",
    title: "Excursión a Buñol desde Valencia: castillo y casco antiguo",
    description: "Organiza una excursión a Buñol desde Valencia con castillo, casco antiguo, naturaleza, transporte actualizado y avisos específicos para la Tomatina.",
    tagline: "Un pueblo con castillo y paisaje fluvial más allá de su famosa fiesta del tomate",
    heroImage: "/discover/bunol-day-trip.jpg",
    heroImageAlt: "Centro histórico y cúpula de tejas azules vistos desde el Castillo de Buñol",
    lastUpdated: "2026-07-20",
    region: "Hoya de Buñol, Valencia",
    quickFacts: [
      { label: "Mejor para", value: "Castillo, casco antiguo y paisaje interior" },
      { label: "Visita base", value: "Medio día; más con una ruta natural" },
      { label: "Entrada al castillo", value: "Turismo municipal indica acceso gratuito" },
      { label: "Excepción importante", value: "La Tomatina exige una planificación distinta" },
    ],
    overview: [
      "Buñol es conocido internacionalmente por la Tomatina, pero durante el resto del año ofrece una excursión completamente diferente. Su castillo medieval forma parte del casco antiguo, mientras que las calles, fuentes y el paisaje del río permiten organizar una jornada interior compacta.",
      "Empieza por el castillo y el centro histórico. Añade después un único espacio natural si el tiempo, la luz y el transporte de regreso lo permiten. La oferta municipal incluye el Parque de San Luis, Molino Galán, fuentes históricas y rutas por el entorno.",
      "La planificación de un día normal no sirve durante la Tomatina u otros eventos importantes. Los controles de acceso, las aglomeraciones y el transporte pueden cambiar por completo.",
    ],
    sections: [
      {
        heading: "Castillo y casco antiguo",
        paragraphs: ["El castillo de los siglos XI y XII se integra en el núcleo histórico. Combínalo con la iglesia de San Pedro, las calles tradicionales y las fuentes sin intentar recorrer todos los puntos del municipio."],
        bullets: ["Consulta cualquier aviso temporal en la web municipal.", "Lleva calzado para cuestas, escalones y superficies irregulares.", "Empieza la visita antes de las horas de más calor."],
      },
      {
        heading: "Naturaleza y segunda parte del día",
        paragraphs: ["El Parque de San Luis y las rutas naturales ofrecen una segunda parte más verde. Selecciona el recorrido antes de salir y adapta su longitud a la estación y al último transporte de vuelta."],
      },
      {
        heading: "Cómo llegar desde Valencia",
        paragraphs: ["Consulta Renfe Cercanías para comprobar el servicio C-3, posibles transportes alternativos y la última opción de regreso. Los servicios regionales por carretera pueden servir como alternativa según la fecha."],
      },
      {
        heading: "Accesibilidad",
        paragraphs: ["Las pendientes, escalones y superficies históricas pueden dificultar el recorrido completo. Confirma con turismo municipal la entrada práctica al castillo y con el operador la accesibilidad del transporte elegido."],
      },
    ],
    practicalTips: [
      "Comprueba los avisos municipales y el operador de transporte poco antes de viajar.",
      "Guarda el último servicio de regreso y una alternativa.",
      "Separa por completo la planificación de la Tomatina de una visita ordinaria.",
      "Con calor, prioriza castillo y casco antiguo frente a una ruta larga y expuesta.",
    ],
    faqs: [
      { question: "¿Merece la pena visitar Buñol fuera de la Tomatina?", answer: "Sí. El castillo, el casco antiguo, las fuentes y el entorno natural forman una excursión interior propia, mucho más tranquila que la jornada del festival." },
      { question: "¿Puedo ir a Buñol en tren desde Valencia?", answer: "Buñol forma parte de la red de Cercanías Valencia, pero los servicios y transportes alternativos pueden cambiar. Consulta la información actual de la C-3 y el último regreso directamente con Renfe." },
      { question: "¿El Castillo de Buñol es gratuito?", answer: "La web municipal de turismo indica actualmente acceso gratuito. Comprueba posibles cierres o cambios antes de viajar." },
      { question: "¿Buñol es accesible con silla de ruedas o carrito?", answer: "El casco histórico y el castillo presentan pendientes, escalones y superficies irregulares. Confirma una ruta adaptada concreta y prepara una alternativa más corta." },
    ],
    relatedGuides: ["cullera-day-trip", "valencia-historic-centre"],
  },
  {
    slug: "cullera-day-trip",
    name: "Cullera",
    title: "Excursión a Cullera desde Valencia: castillo y playas",
    description: "Planifica una excursión a Cullera desde Valencia con acceso al castillo, elección de playa, traslado desde la estación y consejos de accesibilidad.",
    tagline: "Castillo, casco antiguo y amplias playas mediterráneas en una excursión costera",
    heroImage: "/discover/cullera-day-trip.jpg",
    heroImageAlt: "Playa de San Antonio con palmeras y la montaña de Cullera al fondo",
    lastUpdated: "2026-07-20",
    region: "Ribera Baixa, Valencia",
    quickFacts: [
      { label: "Mejor para", value: "Castillo por la mañana y playa por la tarde" },
      { label: "Visita base", value: "Día completo" },
      { label: "Litoral", value: "Más de 15 km repartidos en 11 playas" },
      { label: "Traslado desde la estación", value: "Planifica autobús local, taxi o caminata larga" },
    ],
    overview: [
      "Cullera combina un núcleo histórico en la ladera con un extenso litoral mediterráneo. El castillo y el santuario dominan el casco antiguo, los arrozales, el río Júcar y la bahía, mientras que sus once playas ofrecen ambientes urbanos, tranquilos, deportivos y naturales.",
      "Para una primera excursión, elige dos puntos principales: el castillo y una sola zona de playa. San Antonio es la opción urbana más sencilla por su paseo y servicios; otras playas permiten buscar más tranquilidad o un entorno diferente.",
      "La estación de tren está en el interior y no junto al mar. La información oficial indica que el autobús local conecta estación, centro, playas y faro, por lo que debes comprobar su horario antes de viajar.",
    ],
    sections: [
      {
        heading: "Castillo de Cullera",
        paragraphs: ["La fortaleza de origen islámico alberga el Museo de Historia y Arqueología y comparte la ladera con el santuario. Horarios y tarifas cambian según la temporada; verifica siempre la fecha concreta."],
        bullets: ["Visita el castillo antes del calor fuerte.", "El Camino del Calvario tiene una subida exigente.", "El ascensor panorámico tiene horarios propios y no funciona con lluvia o viento."],
      },
      {
        heading: "Elegir una playa",
        paragraphs: ["San Antonio, Racó y Los Olivos son opciones urbanas con servicios. Escollera, Marenyet-L'Illa, Brosquil y Estany ofrecen ambientes más tranquilos, mientras que otras zonas se orientan a deportes acuáticos o paisaje dunar."],
      },
      {
        heading: "Cómo llegar y moverse",
        paragraphs: ["Renfe Cercanías conecta Valencia con Cullera en dirección Gandia. Añade al plan el autobús local o taxi entre la estación, el castillo y la costa, y guarda el último tren de regreso."],
      },
      {
        heading: "Accesibilidad",
        paragraphs: ["El autobús local se describe como accesible. San Antonio, Escollera, Racó y Los Olivos disponen de puntos accesibles estacionales. El castillo ofrece aparcamiento adaptado y ascensor panorámico, sujeto a horario y meteorología."],
      },
    ],
    practicalTips: [
      "No des por hecho que la estación está junto a la playa; organiza el traslado local.",
      "Elige la playa antes de salir de Valencia.",
      "Consulta la bandera de baño y el servicio de socorrismo al llegar.",
      "Confirma el ascensor del castillo si es imprescindible para tu visita.",
    ],
    faqs: [
      { question: "¿Puedo visitar Cullera desde Valencia sin coche?", answer: "Sí. Cercanías conecta Valencia con Cullera y el autobús local enlaza la estación con el centro, las playas y el faro. Comprueba ambos horarios y el último regreso." },
      { question: "¿Qué playa de Cullera conviene para una primera visita?", answer: "San Antonio es la opción urbana más sencilla por su paseo y servicios. Si buscas tranquilidad, naturaleza o deportes acuáticos, compara las demás playas antes de elegir." },
      { question: "¿El Castillo de Cullera es accesible?", answer: "Dispone de aparcamiento adaptado y ascensor panorámico, pero el ascensor tiene horario estacional y no funciona con lluvia o viento. Confirma las condiciones actuales." },
      { question: "¿Puedo combinar castillo y playa en un día?", answer: "Sí. Visita el castillo por la mañana y dedica la tarde a una sola playa. Incluye en el horario los traslados locales y el tren de regreso." },
    ],
    relatedGuides: ["el-saler-beach", "bunol-day-trip", "valencia-historic-centre"],
  },
  {
    slug: "ruzafa",
    name: "Ruzafa",
    title: "Ruzafa, Valencia: guía para alojarse y visitar",
    description: "Descubre Ruzafa en Valencia: ambiente, restaurantes, ruido, transporte, teletrabajo, familias y consejos para elegir alojamiento y visitar el barrio.",
    tagline: "Restaurantes, comercio independiente y vida urbana al sur del centro",
    heroImage: "/discover/ruzafa.webp",
    heroImageAlt: "Calle animada con terrazas y fachadas coloridas en Ruzafa",
    lastUpdated: "2026-07-20",
    region: "Eixample, Valencia",
    quickFacts: [
      { label: "Ambiente", value: "Urbano, gastronómico y animado" },
      { label: "Mejor para", value: "Restaurantes, parejas y estancias activas" },
      { label: "A tener en cuenta", value: "Ruido nocturno según la calle" },
      { label: "Conexión", value: "A pie del centro y cerca de València Nord" },
    ],
    overview: [
      "Ruzafa combina mercado, restauración, pequeños comercios y una intensa vida de barrio cerca del centro. Es una base práctica para quienes quieren salir a comer o cenar sin depender constantemente del transporte.",
      "La experiencia cambia mucho entre calles. Algunas zonas son residenciales y otras concentran terrazas y actividad nocturna. Antes de reservar, revisa el entorno inmediato del alojamiento, el aislamiento acústico y la presencia de ascensor.",
      "Para una visita, el mercado y las calles comerciales permiten un paseo corto. Para alojarse, también importan la distancia real al transporte, la climatización del apartamento y el espacio disponible para trabajar, guardar un carrito o recibir equipamiento.",
    ],
    sections: [
      { heading: "Alojarse en Ruzafa", paragraphs: ["Ruzafa funciona bien para quienes priorizan restauración y acceso a pie. Comprueba ruido, ascensor, aire acondicionado y orientación del dormitorio; dos apartamentos próximos pueden ofrecer niveles de descanso muy distintos."] },
      { heading: "Mercado, cafés y restaurantes", paragraphs: ["El Mercado de Ruzafa actúa como referencia del barrio, rodeado por comercios y hostelería. Horarios y días de cierre varían, por lo que conviene confirmar cada local y reservar restaurantes populares."] },
      { heading: "Transporte y conexiones", paragraphs: ["Gran parte del centro histórico y el Ensanche se alcanzan a pie. Las conexiones exactas de metro y autobús dependen de la calle; calcula la ruta desde la dirección del alojamiento, no desde el centro aproximado del barrio."] },
      { heading: "Familias, teletrabajo y accesibilidad", paragraphs: ["Las aceras y edificios no son uniformes. Confirma acceso sin escalones y ascensor si son esenciales. Para teletrabajar, verifica mesa, silla, conexión y ruido diurno en lugar de asumir que un apartamento turístico está preparado."] },
    ],
    practicalTips: [
      "Revisa el ruido nocturno de la calle exacta antes de reservar.",
      "Confirma ascensor y climatización en edificios antiguos.",
      "Reserva restaurantes independientemente del alojamiento.",
      "Calcula trayectos desde la dirección concreta, no solo desde 'Ruzafa'.",
    ],
    faqs: [
      { question: "¿Ruzafa es buen barrio para alojarse?", answer: "Sí, especialmente si valoras restaurantes, ambiente y acceso a pie al centro. Elige la calle con cuidado si necesitas noches tranquilas." },
      { question: "¿Ruzafa es ruidosa por la noche?", answer: "Algunas calles con terrazas y ocio pueden serlo, mientras otras son más residenciales. Revisa comentarios recientes y la orientación del dormitorio." },
      { question: "¿Se puede trabajar desde Ruzafa?", answer: "Sí, hay cafés y servicios, pero el trabajo diario depende del apartamento. Confirma Wi-Fi, mesa, silla, temperatura y ruido antes de reservar." },
      { question: "¿Está Ruzafa cerca del centro?", answer: "Sí. El Ensanche, València Nord y partes del centro histórico quedan a una distancia caminable desde muchas calles del barrio." },
    ],
    relatedGuides: ["el-ensanche", "el-carmen", "benimaclet"],
  },
  {
    slug: "el-carmen",
    name: "El Carmen",
    title: "El Carmen, Valencia: guía del barrio histórico",
    description: "Guía de El Carmen en Valencia para visitar o alojarse: monumentos, calles históricas, ruido, edificios antiguos, transporte, familias y accesibilidad.",
    tagline: "Calles medievales, monumentos y vida nocturna en el corazón de Ciutat Vella",
    heroImage: "/discover/el-carmen-hero.webp",
    heroImageAlt: "Calles históricas y fachadas del barrio del Carmen en Valencia",
    lastUpdated: "2026-07-20",
    region: "Ciutat Vella, Valencia",
    quickFacts: [
      { label: "Ambiente", value: "Histórico, central y activo" },
      { label: "Mejor para", value: "Primera visita y turismo a pie" },
      { label: "A tener en cuenta", value: "Edificios antiguos, adoquines y ocio nocturno" },
      { label: "Cerca de", value: "Serranos, Quart, Catedral y Mercado Central" },
    ],
    overview: [
      "El Carmen ocupa una parte central del casco histórico de Valencia, entre torres, plazas, iglesias, museos y calles estrechas. Permite llegar caminando a muchos monumentos y reduce desplazamientos durante una primera visita.",
      "La misma arquitectura que crea su carácter también genera fricción: portales con escalones, edificios sin ascensor, calles adoquinadas y accesos limitados para vehículos. La actividad nocturna cambia mucho de una plaza a otra.",
      "Como visita, funciona bien dentro de una ruta seleccionada por Ciutat Vella. Como base, conviene comprobar descanso, acceso, climatización y logística de equipaje o entregas antes de reservar.",
    ],
    sections: [
      { heading: "Visitar El Carmen", paragraphs: ["Elige una ruta corta entre Torres de Serranos, plazas históricas, museos o Torres de Quart. Evita convertir cada calle en una parada y confirma horarios de los monumentos que realmente quieras visitar."] },
      { heading: "Alojarse en el casco histórico", paragraphs: ["La posición central es la gran ventaja. Antes de reservar, confirma ascensor, escalones, ventanas, aire acondicionado y acceso para taxi o entrega, especialmente si viajas con equipaje voluminoso."] },
      { heading: "Ruido, restauración y vida diaria", paragraphs: ["Bares, plazas y terrazas pueden mantener actividad hasta tarde. Revisa la calle exacta y no asumas que todo el barrio tiene el mismo ambiente. Supermercados y servicios cotidianos también varían por zona."] },
      { heading: "Movilidad y familias", paragraphs: ["Las distancias son cortas, pero el firme y las multitudes pueden cansar. Un carrito compacto resulta más manejable que uno grande. Con silla de ruedas, prepara rutas por calles principales y confirma accesos de cada monumento."] },
    ],
    practicalTips: [
      "Confirma ascensor y escalones antes de reservar alojamiento.",
      "Elige dos o tres monumentos para una ruta realista.",
      "Revisa ruido nocturno y acceso de taxi en la calle concreta.",
      "Utiliza calzado cómodo para adoquines y recorridos a pie.",
    ],
    faqs: [
      { question: "¿El Carmen es buena zona para una primera visita?", answer: "Sí, porque muchos monumentos quedan cerca. Puede no ser la mejor opción si necesitas silencio, aparcamiento sencillo o acceso moderno sin escalones." },
      { question: "¿El Carmen es ruidoso?", answer: "Algunas plazas y calles tienen mucha actividad nocturna y otras son más tranquilas. Comprueba la ubicación exacta y reseñas recientes del alojamiento." },
      { question: "¿Es accesible en silla de ruedas?", answer: "Las calles principales permiten recorridos accesibles, pero adoquines, portales y monumentos antiguos presentan diferencias. Confirma cada acceso por separado." },
      { question: "¿Necesito transporte para visitar el centro desde El Carmen?", answer: "Para gran parte de Ciutat Vella no. Metro, autobús o taxi siguen siendo útiles para playa, Ciudad de las Artes y otros puntos alejados." },
    ],
    relatedGuides: ["valencia-historic-centre", "central-market-la-lonja", "ruzafa"],
  },
  {
    slug: "cabanyal",
    name: "El Cabanyal",
    title: "El Cabanyal, Valencia: guía del barrio marítimo",
    description: "Descubre El Cabanyal en Valencia: arquitectura, playas cercanas, transporte, restaurantes, ambiente residencial, alojamiento, familias y accesibilidad.",
    tagline: "Arquitectura popular y vida marítima junto a las playas urbanas de Valencia",
    heroImage: "/discover/cabanyal-hero.webp",
    heroImageAlt: "Fachadas coloridas y calles tradicionales del Cabanyal en Valencia",
    lastUpdated: "2026-07-20",
    region: "Poblats Marítims, Valencia",
    quickFacts: [
      { label: "Ambiente", value: "Marítimo, residencial y cultural" },
      { label: "Mejor para", value: "Playa y vida de barrio" },
      { label: "Transporte", value: "Tranvía, autobús y bicicleta" },
      { label: "Cerca de", value: "Malvarrosa, Las Arenas y Marina" },
    ],
    overview: [
      "El Cabanyal es un antiguo barrio marinero con una trama de calles paralelas al mar, fachadas de azulejo, casas populares, mercados y una identidad comunitaria marcada. Combina vida residencial con restaurantes y espacios culturales.",
      "Su principal ventaja para visitantes es el acceso al litoral. Aun así, la distancia a la playa, al tranvía y a los servicios cambia según la calle. Comprueba el recorrido exacto desde el alojamiento y no confundas Cabanyal, Malvarrosa y Marina como una única zona.",
      "El parque de viviendas mezcla edificios renovados y casas antiguas. Antes de una estancia, confirma climatización, humedad, ruido, escalones y seguridad del acceso para tus necesidades concretas.",
    ],
    sections: [
      { heading: "Barrio marítimo y arquitectura", paragraphs: ["Recorre calles seleccionadas y respeta la vida residencial. Las fachadas tradicionales forman parte de un barrio vivo, no de un decorado turístico. Mercados, cultura y restauración tienen horarios propios."] },
      { heading: "Acceso a playas y Marina", paragraphs: ["Malvarrosa y Las Arenas quedan próximas desde muchas zonas, pero no desde todas por igual. Decide primero qué tramo de playa quieres utilizar y calcula el trayecto con equipaje, niños o material de playa."] },
      { heading: "Alojarse en Cabanyal", paragraphs: ["Es una buena base para priorizar costa y ambiente local. Comprueba aislamiento, aire acondicionado, ventilación, escaleras y acceso nocturno del edificio antes de reservar una vivienda antigua."] },
      { heading: "Transporte, familias y accesibilidad", paragraphs: ["Tranvía y autobús conectan con otras zonas de Valencia. Las aceras y accesos varían entre calles. Para familias o movilidad reducida, revisa el camino entre alojamiento, parada y paseo marítimo."] },
    ],
    practicalTips: [
      "Calcula la distancia real entre alojamiento, tranvía y playa.",
      "Confirma ventilación y climatización en viviendas antiguas.",
      "Reserva restaurantes de playa por separado.",
      "Respeta calles residenciales y evita fotografiar viviendas de forma invasiva.",
    ],
    faqs: [
      { question: "¿Cabanyal es buena zona para alojarse cerca de la playa?", answer: "Sí, especialmente si el litoral es una prioridad. Comprueba la calle exacta porque las distancias a playa y transporte varían dentro del barrio." },
      { question: "¿Cómo se llega al centro desde Cabanyal?", answer: "Tranvía, autobús, bicicleta y taxi conectan con el centro. La mejor opción depende de la ubicación concreta y del horario." },
      { question: "¿Cabanyal es adecuado para familias?", answer: "Puede funcionar muy bien por la cercanía a la playa y servicios. Confirma acceso del alojamiento, ruido y trayecto seguro hasta el transporte o paseo marítimo." },
      { question: "¿Es un barrio turístico?", answer: "Recibe visitantes, pero sigue siendo un barrio residencial con fuerte identidad local. Conviene comportarse con respeto hacia vecinos, comercio y espacios comunitarios." },
    ],
    relatedGuides: ["malvarrosa-beach", "patacona-beach", "semana-santa-marinera-valencia"],
  },
  {
    slug: "benimaclet",
    name: "Benimaclet",
    title: "Benimaclet, Valencia: guía para alojarse y visitar",
    description: "Conoce Benimaclet en Valencia: ambiente residencial y estudiantil, transporte, mercado, teletrabajo, estancias largas, familias y consejos de alojamiento.",
    tagline: "Ritmo residencial, cultura estudiantil y servicios cotidianos al norte del centro",
    heroImage: "/discover/benimaclet-hero.webp",
    heroImageAlt: "Calle de ambiente local en el barrio de Benimaclet en Valencia",
    lastUpdated: "2026-07-20",
    region: "Benimaclet, Valencia",
    quickFacts: [
      { label: "Ambiente", value: "Residencial, estudiantil y local" },
      { label: "Mejor para", value: "Estancias largas y vida cotidiana" },
      { label: "Transporte", value: "Metro, tranvía y autobús" },
      { label: "A tener en cuenta", value: "Menos monumentos a pie que en el centro" },
    ],
    overview: [
      "Benimaclet conserva una escala de antiguo núcleo urbano dentro de Valencia, combinada con población estudiantil, asociaciones, comercio local y restauración informal. Ofrece una experiencia más cotidiana que los barrios turísticos centrales.",
      "Puede encajar especialmente bien en estancias largas si se valora supermercado, mercado, transporte y un ritmo residencial. La contrapartida es que muchos monumentos y la playa requieren desplazamiento.",
      "La calidad del alojamiento, la mesa de trabajo, la climatización y el ruido del edificio son decisivos. No asumas que un barrio asociado a estudiantes implica que todos los pisos están preparados para teletrabajo o descanso.",
    ],
    sections: [
      { heading: "Vida diaria y estancias largas", paragraphs: ["Benimaclet ofrece servicios cotidianos y una relación más directa con el barrio. Comprueba distancias a supermercado, mercado y transporte desde la dirección exacta antes de reservar."] },
      { heading: "Transporte hacia centro y playa", paragraphs: ["Metro, tranvía y autobús conectan con distintas zonas. La ruta más rápida depende del destino y de la parada concreta; revisa horarios actuales para tus desplazamientos habituales."] },
      { heading: "Teletrabajo y estudio", paragraphs: ["Existen cafés y proximidad universitaria, pero un puesto de trabajo estable debe resolverse en el alojamiento. Confirma Wi-Fi, silla, mesa, enchufes y temperatura durante toda la estancia."] },
      { heading: "Ambiente, familias y accesibilidad", paragraphs: ["El centro del barrio mezcla calles tranquilas con actividad de bares y eventos. Las aceras y portales varían. Con niños o movilidad reducida, comprueba ascensor, acceso y distancia a la parada que realmente utilizarás."] },
    ],
    practicalTips: [
      "Comprueba el trayecto real a tus destinos frecuentes.",
      "Verifica mesa, silla, Wi-Fi y climatización para teletrabajo.",
      "Revisa ruido del edificio, no solo del barrio.",
      "Consulta horarios actuales de mercados y transporte.",
    ],
    faqs: [
      { question: "¿Benimaclet es buena zona para una estancia larga?", answer: "Sí, por su ambiente residencial, servicios y transporte. La idoneidad depende del apartamento y de la frecuencia con la que necesites ir al centro o la playa." },
      { question: "¿Benimaclet está lejos del centro?", answer: "No está en Ciutat Vella, pero dispone de conexiones de metro, tranvía y autobús. Calcula la ruta desde la dirección exacta." },
      { question: "¿Es adecuado para teletrabajar?", answer: "El barrio ofrece servicios y cafés, pero debes confirmar que el alojamiento tenga conexión, mobiliario y temperatura adecuados para trabajar diariamente." },
      { question: "¿Merece la pena visitarlo como turista?", answer: "Sí si buscas vida local, mercado, restauración informal y un contraste con el centro monumental. No es una zona de grandes atracciones." },
    ],
    relatedGuides: ["ruzafa", "turia-gardens", "el-ensanche"],
  },
  {
    slug: "el-ensanche",
    name: "El Ensanche",
    title: "El Ensanche, Valencia: guía para alojarse y visitar",
    description: "Guía del Ensanche de Valencia: Mercado de Colón, compras, restaurantes, transporte, alojamiento, familias, accesibilidad y conexión con Ruzafa y el centro.",
    tagline: "Avenidas elegantes, compras y restauración entre Ciutat Vella y Ruzafa",
    heroImage: "/discover/el-ensanche-hero.webp",
    heroImageAlt: "Fachada modernista del Mercado de Colón en el Ensanche de Valencia",
    lastUpdated: "2026-07-20",
    region: "Eixample, Valencia",
    quickFacts: [
      { label: "Ambiente", value: "Central, comercial y elegante" },
      { label: "Mejor para", value: "Primera visita, compras y comodidad urbana" },
      { label: "Referencia", value: "Mercado de Colón y calle Colón" },
      { label: "Conexión", value: "A pie de Ruzafa, centro y Jardín del Turia" },
    ],
    overview: [
      "El Ensanche reúne avenidas amplias, arquitectura modernista, tiendas, restaurantes y una posición central entre Ciutat Vella, Ruzafa y el Jardín del Turia. Es una base práctica para quien prioriza comodidad urbana y desplazamientos a pie.",
      "El Mercado de Colón es uno de sus puntos de referencia, junto con la calle Colón y las calles comerciales próximas. No funciona como un mercado tradicional de alimentación comparable al Mercado Central; su uso actual está más vinculado a restauración y encuentro.",
      "Los edificios suelen ofrecer mejor acceso que algunas zonas medievales, pero no existe uniformidad. Confirma ascensor, escalones, aislamiento y climatización en la vivienda concreta.",
    ],
    sections: [
      { heading: "Alojarse en El Ensanche", paragraphs: ["La ubicación reduce trayectos hacia centro, Ruzafa y Turia. Compara precio con espacio, ruido de tráfico, orientación del dormitorio y características reales del edificio."] },
      { heading: "Mercado de Colón y compras", paragraphs: ["El Mercado de Colón combina arquitectura y hostelería. La calle Colón y alrededores concentran comercio, pero horarios y aperturas cambian en domingos y festivos."] },
      { heading: "Restauración y conexiones a pie", paragraphs: ["Ruzafa, Gran Vía y Ciutat Vella quedan próximas desde muchas calles. Reserva restaurantes por separado y calcula el regreso nocturno si el alojamiento está en una avenida con tráfico."] },
      { heading: "Familias y accesibilidad", paragraphs: ["Las avenidas amplias facilitan muchos desplazamientos, aunque portales y comercios mantienen accesos distintos. Confirma ascensor, entrada sin escalones y espacio para carrito o ayuda de movilidad."] },
    ],
    practicalTips: [
      "Confirma si el dormitorio da a una avenida con tráfico.",
      "Comprueba horarios comerciales en domingos y festivos.",
      "Utiliza la posición central para caminar hacia Ruzafa, centro y Turia.",
      "Verifica ascensor y acceso del edificio antes de reservar.",
    ],
    faqs: [
      { question: "¿El Ensanche es buena zona para alojarse?", answer: "Sí, especialmente para una primera visita que combine centro, Ruzafa, compras y transporte. El presupuesto suele ser mayor que en zonas residenciales." },
      { question: "¿Qué es el Mercado de Colón?", answer: "Es un edificio modernista restaurado con cafeterías, restauración y comercios. Su función actual es distinta a la de un mercado tradicional de producto fresco." },
      { question: "¿Se puede ir andando al centro desde El Ensanche?", answer: "Sí, desde muchas calles se llega caminando a Ciutat Vella, Ruzafa y el Jardín del Turia. La distancia exacta depende de la ubicación." },
      { question: "¿Es una zona accesible?", answer: "Las avenidas suelen ser amplias y llanas, pero cada edificio y comercio tiene condiciones propias. Confirma ascensor y entrada sin escalones cuando sean esenciales." },
    ],
    relatedGuides: ["ruzafa", "el-carmen", "turia-gardens"],
  },
  {
    slug: "sagunto",
    name: "Sagunto",
    title: "Sagunto desde Valencia: castillo y teatro romano",
    description: "Planifica una excursión a Sagunto desde Valencia con tren, castillo, teatro romano, judería, recorrido histórico, accesibilidad y consejos prácticos.",
    tagline: "Castillo sobre la sierra, teatro romano y dos mil años de historia a un viaje corto de Valencia",
    heroImage: "/discover/sagunto-hero.webp",
    heroImageAlt: "Vista panorámica de Sagunto y su castillo sobre la montaña",
    lastUpdated: "2026-07-20",
    region: "Camp de Morvedre",
    quickFacts: [
      { label: "Distancia", value: "Aproximadamente 30 km al norte" },
      { label: "Transporte", value: "Tren de Cercanías o coche" },
      { label: "Duración", value: "Medio día o día completo" },
      { label: "Terreno", value: "Subida pronunciada y firme irregular en el castillo" },
    ],
    overview: [
      "Sagunto reúne un castillo construido y transformado durante siglos, un teatro romano y un casco histórico con huellas iberas, romanas, medievales y judías. Su conexión ferroviaria permite organizar una excursión sin coche desde Valencia.",
      "El castillo se extiende por la cresta de la montaña y ofrece amplias vistas, pero exige una subida expuesta y un recorrido sobre superficies irregulares. El teatro romano y las calles principales del casco antiguo permiten una visita más corta si el ascenso no encaja con el grupo.",
      "Una ruta equilibrada comienza por el teatro, continúa hacia el castillo según temperatura y movilidad, y desciende por la judería y el centro histórico. Comprueba horarios y condiciones oficiales porque monumentos, eventos y accesos pueden cambiar.",
    ],
    sections: [
      { heading: "Cómo llegar desde Valencia", paragraphs: ["Los servicios de Cercanías conectan Valencia con Sagunto, pero frecuencias, obras y andenes pueden variar. Consulta Renfe el mismo día y distingue la estación de Sagunto del núcleo costero de Puerto de Sagunto."] },
      { heading: "Castillo y teatro romano", paragraphs: ["El teatro se encuentra al pie del ascenso y puede visitarse por separado. El castillo ocupa una cresta larga, con poco resguardo frente al sol y tramos de piedra. Lleva agua y evita la subida en las horas centrales del verano."] },
      { heading: "Judería y casco histórico", paragraphs: ["El descenso permite recorrer calles estrechas, arcos y plazas del núcleo antiguo. Reserva tiempo para caminar sin prisa y confirma la apertura de museos o centros de interpretación antes de construir la ruta alrededor de ellos."] },
      { heading: "Familias y accesibilidad", paragraphs: ["El castillo no es una visita sencilla con silla de ruedas, carrito pesado o movilidad limitada. El teatro y algunas calles bajas ofrecen alternativas más manejables. Con niños, supervisa de cerca en zonas elevadas y caminos irregulares."] },
    ],
    practicalTips: [
      "Consulta trenes y horarios monumentales antes de salir.",
      "Lleva agua y calzado con agarre para el castillo.",
      "Empieza temprano durante los meses calurosos.",
      "Convierte teatro y casco histórico en plan alternativo si la subida no es adecuada.",
    ],
    faqs: [
      { question: "¿Cómo se llega a Sagunto desde Valencia?", answer: "La opción habitual sin coche es el tren de Cercanías desde Valencia. Confirma línea, frecuencia y posibles incidencias en Renfe para la fecha concreta." },
      { question: "¿Cuánto tiempo necesito en Sagunto?", answer: "Unas cuatro o cinco horas permiten ver teatro, castillo y una parte del casco histórico. Añade tiempo si quieres comer con calma o visitar museos." },
      { question: "¿El castillo de Sagunto es accesible?", answer: "El recorrido principal tiene pendientes y superficies irregulares, por lo que no es plenamente accesible. El teatro y las zonas bajas del casco histórico ofrecen una visita alternativa." },
      { question: "¿Es buena excursión con niños?", answer: "Sí, especialmente para familias interesadas en castillos e historia. Ajusta la subida a la edad, lleva agua y mantén supervisión en murallas y caminos de piedra." },
    ],
    relatedGuides: ["xativa", "albufera", "city-of-arts-and-sciences"],
  },
  {
    slug: "requena",
    name: "Requena",
    title: "Requena desde Valencia: vino, cuevas y casco histórico",
    description: "Organiza una excursión a Requena con transporte, Cuevas de la Villa, barrio medieval, bodegas de Bobal, gastronomía, accesibilidad y reservas.",
    tagline: "Cuevas históricas, calles medievales y cultura del vino en el interior de Valencia",
    heroImage: "/discover/requena-hero.webp",
    heroImageAlt: "Tejados y torres del barrio histórico de La Villa en Requena",
    lastUpdated: "2026-07-20",
    region: "Utiel-Requena",
    quickFacts: [
      { label: "Distancia", value: "Aproximadamente 70 km al oeste" },
      { label: "Mejor para", value: "Historia, gastronomía y cultura del vino" },
      { label: "Duración", value: "Día completo recomendado" },
      { label: "Plan principal", value: "La Villa, cuevas y visita reservada" },
    ],
    overview: [
      "Requena es una ciudad histórica del interior valenciano rodeada por el territorio vitivinícola de Utiel-Requena. Su barrio de La Villa conserva calles estrechas, iglesias, arquitectura medieval y espacios vinculados a siglos de producción y almacenamiento de vino.",
      "Las Cuevas de la Villa son uno de sus principales atractivos, pero horarios, aforo y visitas guiadas deben confirmarse. Las bodegas situadas fuera del casco urbano funcionan con reserva y transporte propios; no deben tratarse como una actividad improvisada al final del día.",
      "Una excursión equilibrada combina mañana en La Villa y las cuevas, comida reservada y una tarde dedicada al museo o a una única bodega. Si habrá degustación, organiza conductor no bebedor, taxi o una opción sin conducción posterior.",
    ],
    sections: [
      { heading: "Llegar y moverse por Requena", paragraphs: ["El coche ofrece más flexibilidad para bodegas rurales. El tren puede servir para visitar la ciudad, pero confirma estación, horarios y conexión con el casco histórico. Las calles de La Villa son estrechas y se recorren mejor a pie."] },
      { heading: "Cuevas de la Villa y barrio medieval", paragraphs: ["La red subterránea mantiene una temperatura más fresca que el exterior y puede incluir escalones o espacios estrechos. Reserva o confirma la visita y lleva una capa ligera incluso en verano."] },
      { heading: "Bobal, bodegas y degustaciones", paragraphs: ["La variedad Bobal es central en la identidad vinícola de Utiel-Requena. Elige una bodega, confirma idioma, duración, accesibilidad y política para menores, y no conduzcas después de beber alcohol."] },
      { heading: "Comida y ritmo de la excursión", paragraphs: ["Los restaurantes y bodegas pueden cerrar determinados días o trabajar solo con reserva. Una comida larga forma parte del plan; evita encadenarla con un tren o visita guiada sin margen suficiente."] },
    ],
    practicalTips: [
      "Reserva cuevas, bodega y restaurante antes de viajar.",
      "Confirma el transporte entre estación, La Villa y bodegas rurales.",
      "Lleva calzado estable para adoquines y una capa para las cuevas.",
      "Designa conductor no bebedor o utiliza transporte profesional tras una cata.",
    ],
    faqs: [
      { question: "¿Se puede visitar Requena sin coche?", answer: "Sí, para el casco histórico y las cuevas puede utilizarse el tren, sujeto a horarios. Un coche o traslado reservado resulta más práctico para bodegas fuera de la ciudad." },
      { question: "¿Hay que reservar las Cuevas de la Villa?", answer: "Es recomendable confirmar horarios y disponibilidad con turismo de Requena, especialmente en fines de semana, festivos o para grupos." },
      { question: "¿Qué vino es típico de Requena?", answer: "La zona de Utiel-Requena está especialmente vinculada a la variedad tinta Bobal, utilizada en vinos tintos y rosados." },
      { question: "¿Es una excursión accesible?", answer: "La parte nueva de la ciudad es más sencilla, mientras que La Villa y las cuevas presentan adoquines, pendientes y escalones. Confirma accesibilidad con cada espacio y bodega." },
    ],
    relatedGuides: ["sagunto", "xativa", "albufera"],
  },
  {
    slug: "xativa",
    name: "Xàtiva",
    title: "Xàtiva desde Valencia: guía del castillo",
    description: "Planifica una excursión a Xàtiva desde Valencia con tren, castillo, casco histórico, legado de los Borja, accesibilidad, calor y consejos prácticos.",
    tagline: "Un castillo doble sobre la montaña y un casco histórico marcado por los Borja",
    heroImage: "/discover/xativa-hero.webp",
    heroImageAlt: "Murallas y torres del castillo de Xàtiva sobre la cresta rocosa",
    lastUpdated: "2026-07-20",
    region: "La Costera",
    quickFacts: [
      { label: "Distancia", value: "Aproximadamente 60 km al sur" },
      { label: "Transporte", value: "Tren de Cercanías o coche" },
      { label: "Duración", value: "Día completo recomendado" },
      { label: "Esfuerzo", value: "Subida pronunciada y castillo extenso" },
    ],
    overview: [
      "Xàtiva está coronada por dos fortificaciones conectadas a lo largo de una cresta rocosa. El castillo domina la excursión, pero el casco histórico, la Colegiata, los museos, las fuentes y la memoria de la familia Borja justifican reservar un día completo.",
      "Desde la estación se llega a pie a la parte baja de la ciudad. El ascenso al castillo es pronunciado y con sombra limitada; confirma las opciones de transporte turístico vigentes antes de depender de ellas, especialmente con niños o movilidad reducida.",
      "La mejor secuencia suele ser castillo temprano, descenso por el casco histórico y comida después. Horarios, entradas y cierres cambian, así que utiliza la información turística y monumental oficial para la fecha concreta.",
    ],
    sections: [
      { heading: "Cómo llegar desde Valencia", paragraphs: ["Los trenes de Cercanías conectan Valencia con Xàtiva. Comprueba frecuencia, obras y último regreso. Desde la estación, el centro histórico queda a una distancia caminable antes de comenzar la subida."] },
      { heading: "Castell Menor y Castell Major", paragraphs: ["El recinto combina dos sectores y requiere tiempo para caminar por terrenos irregulares. Empieza temprano, lleva agua y no subestimes la exposición al sol ni la distancia dentro del propio castillo."] },
      { heading: "Casco histórico y legado de los Borja", paragraphs: ["El descenso permite enlazar la Colegiata, calles históricas, fuentes y museos. El conocido retrato invertido de Felipe V se conserva como símbolo de la memoria local; confirma la apertura del museo antes de incluirlo como punto imprescindible."] },
      { heading: "Familias y accesibilidad", paragraphs: ["Las partes llanas de la ciudad son más manejables, pero el castillo presenta pendientes y firme irregular. Un carrito compacto sirve en zonas urbanas, no en todo el recinto. Con movilidad limitada, confirma el acceso hasta el aparcamiento y qué sectores pueden recorrerse."] },
    ],
    practicalTips: [
      "Consulta trenes, entrada y horario del castillo antes de viajar.",
      "Visita el castillo primero para evitar el mayor calor.",
      "Lleva agua y calzado con agarre.",
      "Reserva comida y deja margen suficiente para bajar desde el castillo.",
    ],
    faqs: [
      { question: "¿Cómo se llega a Xàtiva desde Valencia?", answer: "La opción habitual sin coche es el tren de Cercanías desde València Nord. Revisa horarios y posibles cambios en Renfe antes de salir." },
      { question: "¿Cuánto tiempo necesito en Xàtiva?", answer: "Un día completo permite visitar el castillo, bajar por el casco histórico y comer sin prisas. Una visita más corta obliga a elegir entre fortaleza y ciudad." },
      { question: "¿El castillo de Xàtiva es accesible?", answer: "No es plenamente accesible debido a pendientes, distancias y superficies irregulares. Confirma qué acceso rodado y sectores son viables para tus necesidades." },
      { question: "¿Qué relación tiene Xàtiva con los Borja?", answer: "La ciudad está estrechamente vinculada a la familia Borja, de la que surgieron dos papas. Su historia aparece en monumentos, museos y relatos locales." },
    ],
    relatedGuides: ["sagunto", "requena", "albufera"],
  },
  {
    slug: "fallas",
    name: "Las Fallas de Valencia",
    title: "Las Fallas de Valencia: guía práctica",
    description: "Planifica Las Fallas de Valencia con fechas, mascletàs, monumentos, Cremà, seguridad, movilidad y consejos para visitar la fiesta en familia.",
    tagline: "Arte efímero, pólvora y tradición en una fiesta que transforma toda Valencia",
    heroImage: "/discover/fallas.webp",
    heroImageAlt: "Monumento fallero ardiendo durante la Cremà en Valencia",
    lastUpdated: "2026-07-20",
    region: "Valencia ciudad",
    quickFacts: [
      { label: "Días principales", value: "Del 15 al 19 de marzo" },
      { label: "Mascletàs", value: "Programa anual en la plaza del Ayuntamiento" },
      { label: "Acceso", value: "Actos de calle generalmente gratuitos" },
      { label: "Ambiente", value: "Multitudes, pólvora, música y cortes de tráfico" },
    ],
    overview: [
      "Las Fallas convierten Valencia en una exposición de arte efímero repartida por barrios, acompañada por pólvora, música, indumentaria tradicional y actos comunitarios. Los monumentos falleros se plantan en cientos de cruces y plazas antes de quemarse durante la Cremà del 19 de marzo.",
      "La fiesta no se concentra en un único recinto. Para disfrutarla de forma realista, elige una o dos zonas, consulta el programa oficial del año y deja tiempo adicional para caminar entre calles cerradas, controles y grandes concentraciones.",
      "La mascletà, la Ofrenda, la iluminación de calles, las fallas de sección especial y las cremàs de barrio ofrecen experiencias muy distintas. No es necesario asistir a todo: una ruta corta y bien planificada suele funcionar mejor que cruzar continuamente la ciudad.",
    ],
    sections: [
      {
        heading: "Fechas y programa anual",
        paragraphs: ["Los días centrales son del 15 al 19 de marzo, aunque la actividad fallera empieza antes. Horarios, recorridos, restricciones y actos extraordinarios cambian cada edición; confirma siempre la agenda oficial vigente antes de desplazarte."],
        bullets: [
          "La Plantà marca el momento en que los monumentos quedan terminados para su visita.",
          "La Ofrenda reúne comisiones falleras en un recorrido hacia la plaza de la Virgen.",
          "La Nit del Foc y otros espectáculos pirotécnicos dependen del programa anual.",
          "La Cremà cierra la fiesta el 19 de marzo con horarios escalonados.",
        ],
      },
      {
        heading: "Mascletà y monumentos falleros",
        paragraphs: ["La mascletà es un espectáculo sonoro de pólvora, no un castillo de fuegos visual. La intensidad puede resultar incómoda para niños, personas con sensibilidad auditiva o problemas respiratorios. Los monumentos se disfrutan mejor caminando por un área concreta fuera de las horas de mayor concentración."],
      },
      {
        heading: "Cremà, calor y seguridad",
        paragraphs: ["Durante una cremà hay barreras, bomberos, humo, calor y cambios de acceso. Respeta siempre el perímetro y las instrucciones del personal. Una cremà de barrio puede ofrecer mejor visibilidad y menos presión de público que los puntos más conocidos del centro."],
      },
      {
        heading: "Visitar Fallas en familia o con movilidad reducida",
        paragraphs: ["Con niños pequeños, prioriza monumentos durante el día, descansos y protección auditiva. Con silla de ruedas, andador o carrito, evita itinerarios demasiado largos y confirma los accesos reservados anunciados para actos concretos. Las barreras temporales y las calles llenas pueden modificar rutas accesibles habituales."],
      },
    ],
    practicalTips: [
      "Consulta el programa oficial del año y los avisos de transporte el mismo día.",
      "Lleva protección auditiva adecuada, especialmente para menores.",
      "Fija un punto de encuentro tranquilo por si el grupo se separa.",
      "No intentes cruzar rápidamente la ciudad entre dos actos multitudinarios.",
    ],
    faqs: [
      { question: "¿Cuándo se celebran Las Fallas?", answer: "Los días principales son del 15 al 19 de marzo, con actividades y mascletàs desde fechas anteriores. El programa exacto se publica para cada edición." },
      { question: "¿Hace falta entrada para ver las fallas?", answer: "Los monumentos y la mayoría de actos de calle son gratuitos. Algunas zonas reservadas, experiencias o actividades privadas pueden tener condiciones propias." },
      { question: "¿Las Fallas son adecuadas para niños?", answer: "Sí, si se adapta el plan. Son esenciales la protección auditiva, los descansos y evitar humo, calor o aglomeraciones excesivas. Las visitas diurnas a monumentos suelen ser la opción más sencilla." },
      { question: "¿Se puede visitar en silla de ruedas?", answer: "Sí, pero las multitudes, barreras y calles cerradas complican los recorridos. Consulta las zonas accesibles anunciadas, utiliza transporte adaptado fuera de las horas punta y prepara rutas alternativas." },
    ],
    relatedGuides: ["valencia-historic-centre", "corpus-christi-valencia", "christmas-valencia"],
  },
  {
    slug: "albufera",
    name: "Parque Natural de l’Albufera",
    title: "Albufera de Valencia: guía de excursión",
    description: "Organiza una excursión a l’Albufera desde Valencia con transporte, paseo en barca, El Palmar, arroz, atardecer, accesibilidad y consejos prácticos.",
    tagline: "Laguna, arrozales, rutas naturales y atardeceres al sur de Valencia",
    heroImage: "/discover/albufera.webp",
    heroImageAlt: "Vista de la laguna de l’Albufera desde una barca tradicional",
    lastUpdated: "2026-07-20",
    region: "Parque Natural de l’Albufera",
    quickFacts: [
      { label: "Distancia", value: "Aproximadamente 10 km al sur de Valencia" },
      { label: "Mejor para", value: "Naturaleza, arroz, aves y atardecer" },
      { label: "Duración", value: "Medio día o día completo" },
      { label: "Plan básico", value: "Mirador, paseo en barca y El Palmar" },
    ],
    overview: [
      "L’Albufera es un humedal protegido formado por una gran laguna, arrozales, canales, bosque mediterráneo y poblaciones vinculadas a la pesca y al cultivo del arroz. Está cerca de Valencia, pero cada zona del parque ofrece una experiencia diferente.",
      "El plan más conocido combina un paseo en barca con una comida de arroz en El Palmar y una parada junto a la laguna al atardecer. Las barcas son servicios independientes: confirma punto de salida, horario, duración, accesibilidad y precio directamente con el operador.",
      "También puedes plantear una visita centrada en observación de aves, senderos, Devesa o playas como El Saler. Evita intentar cubrir todo el parque en pocas horas y comprueba transporte de regreso, especialmente después de la puesta de sol.",
    ],
    sections: [
      {
        heading: "Cómo llegar desde Valencia",
        paragraphs: ["Las líneas, frecuencias y paradas cambian según temporada y destino dentro del parque. El transporte hacia El Palmar no equivale al acceso a todos los miradores o playas. Revisa la ruta de ida y el último regreso antes de salir."],
      },
      {
        heading: "Paseos en barca y atardecer",
        paragraphs: ["Los paseos tradicionales recorren canales y zonas abiertas de la laguna. Reserva una salida compatible con la hora real de puesta de sol y confirma si el embarque puede adaptarse a movilidad reducida, carritos o niños pequeños."],
      },
      {
        heading: "El Palmar y la cultura del arroz",
        paragraphs: ["El Palmar concentra restaurantes y embarcaderos, pero una mesa no está incluida con el paseo en barca. Reserva el restaurante por separado y confirma el tipo de arroz, el horario de cocina y el tiempo de preparación."],
      },
      {
        heading: "Naturaleza, playas y accesibilidad",
        paragraphs: ["Pasarelas, caminos, arena, embarcaderos y terreno natural presentan niveles de acceso distintos. Selecciona un punto concreto y consulta las condiciones actuales. Para combinar laguna y playa, El Saler ofrece una conexión lógica sin convertir la salida en una carrera."],
      },
    ],
    practicalTips: [
      "Comprueba el último autobús antes de reservar una barca al atardecer.",
      "Reserva comida y paseo en barca como servicios separados.",
      "Lleva agua, protección solar y repelente en los meses cálidos.",
      "Mantén distancia con aves y respeta senderos y zonas protegidas.",
    ],
    faqs: [
      { question: "¿Cuánto tiempo necesito para visitar l’Albufera?", answer: "Medio día permite combinar un paseo corto, El Palmar y un mirador. Un día completo permite añadir un sendero o una playa sin prisas." },
      { question: "¿Hay que reservar el paseo en barca?", answer: "Es recomendable, sobre todo para el atardecer, fines de semana y grupos. Confirma directamente punto de embarque, precio, duración y condiciones." },
      { question: "¿Se puede llegar en transporte público?", answer: "Sí, existen conexiones desde Valencia, pero las frecuencias y destinos varían. Comprueba EMT y la información oficial del parque para la fecha concreta." },
      { question: "¿Es una excursión accesible?", answer: "Depende del embarcadero, sendero o playa elegidos. Confirma el acceso sin escalones y la ayuda disponible con cada operador antes de reservar." },
    ],
    relatedGuides: ["el-saler-beach", "pinedo-beach"],
  },
  {
    slug: "city-of-arts-and-sciences",
    name: "Ciudad de las Artes y las Ciencias",
    title: "Ciudad de las Artes y las Ciencias: guía",
    description: "Planifica tu visita a la Ciudad de las Artes y las Ciencias de Valencia: recintos, entradas, duración, familias, accesibilidad y rutas cercanas.",
    tagline: "Arquitectura, ciencia, cultura y vida marina junto al Jardín del Turia",
    heroImage: "/discover/city-of-arts-and-sciences.webp",
    heroImageAlt: "Arquitectura blanca y estanques de la Ciudad de las Artes y las Ciencias",
    lastUpdated: "2026-07-20",
    region: "Quatre Carreres, Valencia",
    quickFacts: [
      { label: "Acceso exterior", value: "Paseo por el complejo sin entrada" },
      { label: "Recintos", value: "Entradas y horarios independientes" },
      { label: "Duración", value: "De 2 horas a un día completo" },
      { label: "Cerca de", value: "Oceanogràfic y Jardín del Turia" },
    ],
    overview: [
      "La Ciudad de las Artes y las Ciencias es un conjunto de edificios y espacios públicos en el extremo oriental del Jardín del Turia. El paseo exterior permite disfrutar de la arquitectura y los estanques sin comprar una entrada.",
      "Oceanogràfic, Museu de les Ciències, Hemisfèric, Palau de les Arts y otros espacios funcionan con programas, horarios y entradas diferentes. El error más común es intentar visitarlos todos en un solo día sin considerar colas, distancias y pausas.",
      "Elige primero un recinto principal y utiliza el resto del complejo como paseo complementario. Para familias o personas con movilidad reducida, una planificación por zonas reduce desplazamientos innecesarios y facilita localizar sombra, aseos y descansos.",
    ],
    sections: [
      {
        heading: "Elegir recintos y entradas",
        paragraphs: ["Compra entradas únicamente después de revisar qué incluye cada opción. Oceanogràfic puede ocupar varias horas por sí solo; el museo y el Hemisfèric requieren tiempos adicionales. Consulta siempre horarios, sesiones y cierres en las webs oficiales."],
      },
      {
        heading: "Una ruta realista",
        paragraphs: ["Para una visita corta, recorre los exteriores y elige un solo recinto. Para un día completo, combina como máximo dos espacios con una pausa larga. El complejo es amplio y gran parte del recorrido exterior queda expuesto al sol."],
      },
      {
        heading: "Familias y accesibilidad",
        paragraphs: ["Los recorridos principales son amplios y generalmente accesibles, pero cada edificio mantiene sus propias condiciones. Confirma ascensores, préstamo de sillas, accesos, sesiones adaptadas y restricciones antes de la visita."],
      },
      {
        heading: "Combinar con el Jardín del Turia",
        paragraphs: ["El complejo conecta directamente con el Jardín del Turia. Una ruta corta por el parque o Gulliver funciona mejor que añadir otro museo lejano. En verano, reserva el paseo exterior para primera hora o última tarde."],
      },
    ],
    practicalTips: [
      "Elige un recinto principal antes de comprar entradas combinadas.",
      "Consulta sesiones y horarios oficiales para la fecha concreta.",
      "Lleva agua y protección solar para los recorridos exteriores.",
      "Deja margen entre recintos para caminar, comer y descansar.",
    ],
    faqs: [
      { question: "¿Se puede visitar gratis la Ciudad de las Artes y las Ciencias?", answer: "Sí, los exteriores y el paseo por el complejo pueden recorrerse sin entrada. Los museos, proyecciones, espectáculos y Oceanogràfic tienen entradas propias." },
      { question: "¿Cuánto tiempo necesito?", answer: "Dos o tres horas permiten ver exteriores y un recinto corto. Oceanogràfic suele requerir varias horas; combinar dos grandes espacios puede ocupar el día completo." },
      { question: "¿Es adecuada para niños?", answer: "Sí. Elige actividades según edad y evita una agenda demasiado larga. Las distancias, el calor y las colas pueden cansar más que el contenido de los recintos." },
      { question: "¿Es accesible en silla de ruedas?", answer: "Los espacios exteriores principales son amplios y los recintos ofrecen medidas de accesibilidad, pero conviene revisar las condiciones específicas de cada edificio antes de comprar." },
    ],
    relatedGuides: ["oceanografic-valencia", "turia-gardens", "bioparc-valencia"],
  },
  {
    slug: "turia-gardens",
    name: "Jardín del Turia",
    title: "Jardín del Turia de Valencia: guía práctica",
    description: "Recorre el Jardín del Turia de Valencia con rutas por tramos, Gulliver, bicicleta, familias, accesibilidad y conexiones con las principales atracciones.",
    tagline: "Nueve kilómetros de parque urbano que conectan Valencia de oeste a este",
    heroImage: "/discover/turia-gardens-hero.webp",
    heroImageAlt: "Caminos ajardinados y canal de agua en el Jardín del Turia de Valencia",
    lastUpdated: "2026-07-20",
    region: "Valencia ciudad",
    quickFacts: [
      { label: "Longitud", value: "Aproximadamente 9 km" },
      { label: "Acceso", value: "Parque público y gratuito" },
      { label: "Mejor para", value: "Pasear, bicicleta, juego y descanso" },
      { label: "Conecta", value: "BIOPARC, Gulliver y Ciudad de las Artes" },
    ],
    overview: [
      "El Jardín del Turia ocupa el antiguo cauce del río y atraviesa Valencia durante unos nueve kilómetros. Sus caminos, zonas deportivas, jardines y áreas de juego forman una ruta continua entre el oeste de la ciudad y la Ciudad de las Artes y las Ciencias.",
      "No es necesario recorrerlo entero. La mayoría de visitantes obtiene más valor eligiendo un tramo: Gulliver y la Ciudad de las Artes para familias, el entorno del Palau de la Música para un paseo tranquilo o el extremo occidental para combinar con BIOPARC.",
      "El parque es llano, pero los accesos desde los puentes varían entre rampas y escaleras. En verano, el tramo, la hora y la cantidad de sombra importan más que la distancia aparente en el mapa.",
    ],
    sections: [
      {
        heading: "Elegir el mejor tramo",
        paragraphs: ["Para una primera visita corta, el tramo entre Gulliver y la Ciudad de las Artes ofrece áreas de juego, arquitectura y conexiones sencillas. El recorrido completo funciona mejor en bicicleta o dividido en varias jornadas."],
      },
      {
        heading: "Gulliver y planes en familia",
        paragraphs: ["El parque Gulliver es una gran estructura de juego al aire libre. Comprueba horarios y cierres antes de acudir y evita las horas de mayor calor. El entorno dispone de otras zonas de descanso y juego para adaptar la duración."],
      },
      {
        heading: "Bicicleta, paseo y convivencia",
        paragraphs: ["Ciclistas, corredores y peatones comparten el antiguo cauce mediante caminos diferenciados en muchos tramos. Respeta la señalización, cruza con atención y reduce la velocidad en zonas familiares o concurridas."],
      },
      {
        heading: "Accesibilidad y transporte",
        paragraphs: ["Los caminos principales son llanos y amplios, pero no todos los puentes ofrecen el mismo acceso. Localiza una rampa adecuada antes de iniciar la ruta y comprueba ascensores o transporte accesible para el punto de salida elegido."],
      },
    ],
    practicalTips: [
      "Elige un tramo concreto en lugar de caminar los nueve kilómetros sin plan.",
      "Lleva agua y evita el mediodía durante los meses más calurosos.",
      "Comprueba si el acceso desde tu puente tiene rampa o solo escaleras.",
      "Separa carril ciclista y zona peatonal, especialmente con niños pequeños.",
    ],
    faqs: [
      { question: "¿Cuánto mide el Jardín del Turia?", answer: "Tiene aproximadamente nueve kilómetros entre el oeste de Valencia y la Ciudad de las Artes y las Ciencias. No hace falta recorrerlo entero para disfrutarlo." },
      { question: "¿El Jardín del Turia es gratuito?", answer: "Sí, el parque es público y gratuito. Atracciones próximas como BIOPARC o algunos recintos culturales tienen sus propias entradas y horarios." },
      { question: "¿Se puede recorrer en bicicleta?", answer: "Sí. Es una de las rutas ciclistas más prácticas de Valencia, pero debes respetar los carriles, cruces y zonas con peatones." },
      { question: "¿Es accesible con silla de ruedas o carrito?", answer: "Los caminos principales son llanos y amplios. La principal diferencia está en el acceso desde cada puente, por lo que conviene identificar previamente una rampa adecuada." },
    ],
    relatedGuides: ["city-of-arts-and-sciences", "oceanografic-valencia", "bioparc-valencia"],
  },
  {
    slug: "corpus-christi-valencia",
    name: "Corpus Christi de Valencia",
    title: "Corpus Christi de Valencia: procesión y tradiciones",
    description: "Organiza el Corpus Christi de Valencia con la Cabalgata del Convite, la Moma, las Rocas, la procesión y comprobaciones del programa oficial.",
    tagline: "Danzas históricas, carros ceremoniales y procesiones por el centro antiguo",
    heroImage: "/discover/corpus-christi-valencia.jpg",
    heroImageAlt: "La Moma y otro personaje durante la Cabalgata del Convite del Corpus de Valencia",
    lastUpdated: "2026-07-20",
    region: "Ciutat Vella, Valencia",
    quickFacts: [
      { label: "Origen", value: "Celebrado en Valencia desde 1263" },
      { label: "Zona principal", value: "Ciutat Vella y plaza de la Virgen" },
      { label: "Acceso", value: "Los actos en la calle suelen ser gratuitos" },
      { label: "Fecha", value: "Cambia cada año con el calendario de Pascua" },
    ],
    overview: [
      "El Corpus Christi es una de las celebraciones cívicas y religiosas más antiguas de Valencia. Sus orígenes se remontan a 1263 y la procesión formal se estableció en 1355. El fin de semana combina ceremonia católica, vestuario, música, danza y simbolismo popular.",
      "Entre los actos más característicos están el traslado y paso de las Rocas, los Misterios, la Cabalgata del Convite y la procesión solemne. La Moma, vestida de blanco, representa la virtud frente a los siete pecados capitales.",
      "La fecha se mueve con la Pascua y el programa cambia cada año. Utiliza esta guía para comprender la celebración y confirma después fecha, recorrido, horarios y accesos en la programación oficial vigente.",
    ],
    sections: [
      {
        heading: "Cabalgata del Convite y la Moma",
        paragraphs: ["El Convite reúne gigantes, danzas, personajes simbólicos, músicos y la Degolla. La Moma protagoniza una de las danzas rituales más reconocibles."],
        bullets: ["Elige un tramo amplio si vas con niños.", "Llega antes del inicio publicado.", "Mantén una salida clara entre la multitud."],
      },
      {
        heading: "Rocas y procesión solemne",
        paragraphs: ["Las Rocas son carros ceremoniales históricos conservados en la Casa de las Rocas. La procesión posterior tiene un carácter religioso más formal y reúne parroquias, personajes bíblicos, la Senyera y la Custodia."],
      },
      {
        heading: "Transporte y accesibilidad",
        paragraphs: ["Los actos principales ocupan calles de Ciutat Vella. EMT puede aplicar desvíos y el pavimento histórico, las calles estrechas y las barreras complican el acceso. Confirma cualquier zona adaptada en el programa anual."],
      },
      {
        heading: "Una visita alternativa al museo",
        paragraphs: ["El Museo del Corpus — Casa de las Rocas permite conocer los carros y la historia de la fiesta con más calma fuera del momento de máxima afluencia."],
      },
    ],
    practicalTips: [
      "Comprueba el programa del año actual y no reutilices horarios antiguos.",
      "Elige entre el Convite, más vivo, y la procesión solemne, más formal.",
      "Evita las calles más estrechas con carrito o ayuda de movilidad.",
      "Respeta el carácter religioso de la procesión al moverte o hacer fotografías.",
    ],
    faqs: [
      { question: "¿Cuándo se celebra el Corpus Christi en Valencia?", answer: "La fecha cambia con el calendario de Pascua y los actos principales se concentran alrededor del domingo posterior al Corpus. Confirma siempre el programa vigente." },
      { question: "¿Qué es la Moma?", answer: "Es la figura vestida de blanco que representa la virtud en una danza ritual frente a los siete pecados capitales." },
      { question: "¿Hace falta entrada?", answer: "Los principales desfiles y la procesión en la calle suelen ser gratuitos. Otros espacios o zonas reservadas pueden tener condiciones propias." },
      { question: "¿Es adecuado para niños?", answer: "Sí, especialmente la Cabalgata del Convite, pero la Degolla, los caballos, el ruido y la multitud exigen supervisión y un punto de encuentro." },
    ],
    relatedGuides: ["valencia-historic-centre", "central-market-la-lonja"],
  },
  {
    slug: "christmas-valencia",
    name: "Navidad en Valencia",
    title: "Navidad en Valencia: mercados, luces y tradiciones",
    description: "Planifica la Navidad en Valencia con luces, belenes, mercados, Nochevieja y Reyes Magos, además de transporte y cierres festivos.",
    tagline: "Luces, belenes, mercados y tradiciones de Reyes por toda la ciudad",
    heroImage: "/discover/christmas-valencia.jpg",
    heroImageAlt: "Luces de una estrella y un belén sobre una calle de Valencia por la noche",
    lastUpdated: "2026-07-20",
    region: "Toda Valencia",
    quickFacts: [
      { label: "Temporada", value: "De finales de noviembre al 6 de enero" },
      { label: "Final familiar", value: "Reyes Magos, 5 y 6 de enero" },
      { label: "Zona principal", value: "Centro histórico y plaza del Ayuntamiento" },
      { label: "Programa 2026", value: "Aún no publicado; revisar en noviembre" },
    ],
    overview: [
      "La Navidad en Valencia es una temporada, no un único evento. Las luces, belenes, mercados, conciertos y actividades familiares ocupan diciembre, seguidos por Nochevieja y las tradiciones de Reyes que culminan los días 5 y 6 de enero.",
      "Una primera ruta práctica recorre la plaza del Ayuntamiento, la plaza de la Reina, el entorno del Mercado Central y varios belenes municipales o culturales confirmados. Añade como máximo una actividad con entrada para mantener un ritmo familiar realista.",
      "El programa municipal, los mercados, los horarios de luces y el recorrido de Reyes cambian cada año. En julio de 2026 todavía no se ha publicado la programación de Navidad 2026. Confirma todos los detalles cuando aparezcan las fuentes oficiales.",
    ],
    sections: [
      {
        heading: "Luces y ruta por el centro",
        paragraphs: ["La plaza del Ayuntamiento y las calles comerciales cercanas forman el recorrido nocturno más sencillo cuando comienza la iluminación anual. Comprueba la fecha de encendido y los horarios del año actual."],
      },
      {
        heading: "Belenes y mercados",
        paragraphs: ["Los belenes municipales, museos, iglesias y mercados permiten crear una ruta cultural por Ciutat Vella. Las ubicaciones, fechas y aperturas cambian, por lo que conviene elegir tres puntos próximos del listado vigente."],
      },
      {
        heading: "Nochevieja y Reyes Magos",
        paragraphs: ["La Nochevieja y la Cabalgata del 5 de enero necesitan planes independientes por sus multitudes, cortes de tráfico y transporte. El recorrido y la llegada de los Reyes se confirman cada temporada."],
      },
      {
        heading: "Familias y accesibilidad",
        paragraphs: ["El centro es accesible mediante transporte público, pero los puestos temporales, barreras, adoquines y concentraciones reducen el espacio. Elige una hora temprana y confirma accesos sin escalones en recintos interiores."],
      },
    ],
    practicalTips: [
      "Vuelve a consultar esta guía en noviembre para acceder al programa oficial 2026.",
      "Agrupa plaza del Ayuntamiento, plaza de la Reina y Mercado Central en una sola ruta.",
      "Comprueba la apertura de cada recinto los días 24, 25 y 31 de diciembre y 1 y 6 de enero.",
      "Consulta el último transporte antes de celebraciones nocturnas.",
    ],
    faqs: [
      { question: "¿Cuándo empieza la Navidad en Valencia?", answer: "Normalmente comienza a finales de noviembre o principios de diciembre y continúa hasta Reyes, el 6 de enero. Las fechas de luces, mercados y actividades se confirman cada año." },
      { question: "¿Las actividades de Navidad son gratuitas?", answer: "Las luces, plazas públicas y muchos belenes son gratuitos. Algunos espectáculos, atracciones, talleres o actividades con reserva requieren entrada." },
      { question: "¿Dónde están los principales puntos navideños?", answer: "La plaza del Ayuntamiento, la plaza de la Reina y el entorno del Mercado Central forman una primera ruta práctica, complementada por los listados municipales vigentes." },
      { question: "¿Cuándo es la Cabalgata de Reyes?", answer: "Tradicionalmente se celebra el 5 de enero, pero la llegada, recorrido y hora cambian. Consulta el programa municipal de la temporada." },
    ],
    relatedGuides: ["valencia-historic-centre", "central-market-la-lonja"],
  },
];

export function getPublishedSpanishDestinations(): SpanishDiscoverGuide[] {
  return spanishDiscoverGuides.filter((guide) => Boolean(getDestinationBySlug(guide.slug)));
}

export function getSpanishDestinationsByHub(hub: HubType): SpanishDiscoverGuide[] {
  return getPublishedSpanishDestinations().filter((guide) =>
    getDestinationBySlug(guide.slug)?.hubs.includes(hub)
  );
}

export function getSpanishDestinationBySlug(slug: string): SpanishDiscoverGuide | undefined {
  return getPublishedSpanishDestinations().find((guide) => guide.slug === slug);
}

export function getAllSpanishDestinationSlugsForBuild(): string[] {
  return getPublishedSpanishDestinations().map((guide) => guide.slug);
}

export function hasSpanishDestination(slug: string): boolean {
  return Boolean(getSpanishDestinationBySlug(slug));
}

export function getSpanishDestinationSources(slug: string) {
  return getDestinationGovernance(slug)?.sources ?? [];
}
