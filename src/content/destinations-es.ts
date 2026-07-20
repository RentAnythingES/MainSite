import { getDestinationBySlug, getDestinationGovernance } from "@/content/destinations";

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
];

export function getPublishedSpanishDestinations(): SpanishDiscoverGuide[] {
  return spanishDiscoverGuides.filter((guide) => Boolean(getDestinationBySlug(guide.slug)));
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
