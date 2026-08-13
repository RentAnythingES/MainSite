import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import CategoryProductCatalogue from "@/components/CategoryProductCatalogue";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

interface CategoryContent {
  title: string;
  description: string;
  heading?: string;
  introDescription?: string;
  image?: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  featuredHeading?: string;
  featuredDescription?: string;
  featuredPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
  familyHeading?: string;
  familyDescription?: string;
  familyPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
  searchIntentHeading?: string;
  searchIntentDescription?: string;
  searchIntents?: Array<{
    title: string;
    description: string;
  }>;
  faqHeading?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const categoryMetaES: Record<string, CategoryContent> = {
  "baby-gear": {
    title: "Alquiler de Artículos de Bebé y Niños en Valencia",
    description: "Alquila cochecitos, cunas de viaje, sillas de coche, tronas y más en Valencia, con las opciones de recogida y entrega indicadas en la reserva.",
    editorialHeading: "¿Por qué alquilar artículos de bebé en Valencia?",
    editorialParagraphs: [
      "Viajar con un bebé o un niño pequeño implica decidir qué artículos familiares deben venir de casa y qué equipamiento voluminoso se puede organizar en Valencia antes del viaje. Cada ficha muestra medidas, orientación de edad o peso, piezas incluidas y fechas actuales para tomar esa decisión.",
      "Elige los productos que encajen con la estancia y revisa en la reserva las opciones de recogida o entrega ofrecidas para la dirección y las fechas. Si importan el acceso, el horario, el montaje o un accesorio concreto, confírmalo antes del pago en lugar de depender de una promesa general de la categoría.",
      "Los recorridos y los accesos de los alojamientos cambian según la zona de Valencia. Un ascensor amplio, un traslado en taxi, un paseo marítimo pavimentado y un edificio antiguo con escalones exigen soluciones distintas; revisa los trayectos y espacios concretos de tu estancia.",
    ],
    familyHeading: "¿Necesitas ayuda para comparar productos similares?",
    familyDescription: "El catálogo completo aparece arriba. Estas páginas te ayudan a comparar cochecitos, sillas de coche o equipos de descanso cuando necesitas más detalle.",
    familyPathways: [
      {
        eyebrow: "Colección de cochecitos",
        title: "Compara sillas de paseo de alquiler en Valencia",
        description: "Compara opciones compactas de viaje, todoterreno y dobles en un solo lugar.",
        href: "/es/rental/baby-gear/strollers",
      },
      {
        eyebrow: "Colección de sillas de coche",
        title: "Compara sillas de coche de alquiler en Valencia",
        description: "Compara opciones para bebés, giratorias, orientadas hacia delante y elevadores en un solo lugar.",
        href: "/es/rental/baby-gear/car-seats",
      },
      {
        eyebrow: "Colección de descanso",
        title: "Compara cunas de viaje en Valencia",
        description: "Consulta las opciones actuales y comprueba medidas, elementos incluidos, precios y fechas.",
        href: "/es/rental/baby-gear/travel-cots-cribs",
      },
    ],
    featuredHeading: "Planifica una estancia más sencilla con un bebé",
    featuredDescription: "Empieza con un conjunto completo para la llegada, configura un kit para niños pequeños o consulta nuestra guía familiar para organizar sueño, alimentación y desplazamientos.",
    featuredPathways: [
      {
        eyebrow: "Kit de llegada del bebé",
        title: "Prepara el alojamiento antes de llegar",
        description: "Combina descanso, alimentación, baño y movilidad según la rutina del bebé y la estancia.",
        href: "/es/valencia/kits/baby-arrival-kit",
      },
      {
        eyebrow: "Kit infantil para la ciudad",
        title: "Configura un conjunto para recorrer Valencia",
        description: "Elige movilidad, paseo y juego para explorar Valencia con un niño pequeño.",
        href: "/es/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Planifica Valencia con un bebé o niño pequeño",
        description: "Compara barrios, actividades, transporte y el equipamiento voluminoso que conviene organizar localmente.",
        href: "/es/blog/valencia-with-kids-complete-guide",
      },
      {
        eyebrow: "Guía de decisión",
        title: "Decide qué traer, alquilar o comprar",
        description: "Compara cada artículo según la duración, el transporte y las condiciones del alojamiento.",
        href: "/es/blog/rent-vs-buy-baby-gear-valencia",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de material de bebé en Valencia",
    faqs: [
      { question: "¿Puedo alquilar un cochecito o una cuna de viaje en Valencia?", answer: "Sí. Elige el producto, introduce tus fechas y revisa las opciones de recogida o entrega antes del pago. Cada ficha muestra medidas, piezas incluidas e información de uso." },
      { question: "¿Podéis entregar el material de bebé en mi alojamiento?", answer: "La reserva muestra las opciones de entrega y recogida disponibles para la dirección y las fechas elegidas. Podemos confirmar el acceso, el horario y cualquier necesidad de montaje antes de la entrega." },
      { question: "¿Cómo se prepara el material infantil entre alquileres?", answer: "El equipamiento se revisa y prepara entre reservas. La ficha correspondiente recoge la información específica de cuidado, higiene y seguridad; consúltanos cualquier duda de idoneidad antes de reservar." },
      { question: "¿Me convienen productos sueltos o el Kit de Llegada del Bebé?", answer: "Elige productos individuales si necesitas un artículo concreto. El Kit de Llegada es un punto de partida más sencillo cuando necesitas varios elementos de descanso, alimentación, baño o movilidad." },
    ],
  },
  "kids-family": {
    title: "Alquiler de Equipamiento Infantil y Familiar en Valencia",
    description: "Alquila bicicletas de equilibrio, juguetes y equipamiento familiar práctico en Valencia, con opciones flexibles de recogida y entrega.",
    image: "/discover/turia-gardens-hero.webp",
    editorialHeading: "Equipamiento útil para estancias familiares en Valencia",
    editorialParagraphs: [
      "Las vacaciones en familia son más sencillas cuando los niños disponen de equipamiento adecuado sin tener que transportar cada artículo voluminoso por el aeropuerto. Alquilar en Valencia permite viajar con menos equipaje y elegir lo que realmente encaja con la estancia.",
      "Esta colección reúne equipamiento práctico para niños pequeños, niños mayores y actividades familiares. Cada ficha de producto explica las medidas, la orientación de edad, los elementos incluidos y las condiciones de alquiler para que puedas comprobar si es adecuado antes de reservar.",
      "Tanto si te alojas cerca de los Jardines del Turia como en la playa o en un apartamento de Valencia, podemos ayudarte a coordinar la recogida o la entrega según tus fechas y alojamiento.",
    ],
    featuredHeading: "Planifica una estancia familiar en Valencia",
    featuredDescription: "Combina productos individuales con un kit familiar práctico o utiliza nuestra guía local para organizar la estancia según tus hijos y alojamiento.",
    featuredPathways: [
      {
        eyebrow: "Kit para niños pequeños",
        title: "Configura un kit infantil para la ciudad",
        description: "Combina movilidad, juego y elementos prácticos para recorrer Valencia con un niño pequeño.",
        href: "/es/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Kit de playa familiar",
        title: "Prepara un conjunto familiar de playa",
        description: "Reúne sombra, transporte, frío y juegos para los días de playa en Valencia.",
        href: "/es/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Guía en inglés",
        title: "Planifica Valencia con niños",
        description: "Consulta barrios, actividades y equipamiento útil para organizar una estancia familiar.",
        href: "/es/blog/valencia-with-kids-complete-guide",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de equipamiento infantil en Valencia",
    faqs: [
      {
        question: "¿Qué equipamiento infantil puedo alquilar en Valencia?",
        answer: "El catálogo publicado muestra las bicicletas de equilibrio, material de actividades y otros artículos familiares que se ofrecen actualmente. Elige un producto e introduce tus fechas para comprobar su disponibilidad antes del pago.",
      },
      {
        question: "¿Cómo compruebo si un artículo es adecuado para mi hijo?",
        answer: "Consulta la orientación de edad, los límites de altura o peso, las medidas y los elementos incluidos en la ficha del producto. Si el ajuste no está claro, contáctanos con las medidas del niño antes de reservar.",
      },
      {
        question: "¿Podéis entregar equipamiento infantil en mi alojamiento?",
        answer: "La reserva muestra las opciones de recogida y entrega disponibles para el producto, la dirección y las fechas seleccionadas. Los detalles de acceso, horario o entrega pueden confirmarse previamente.",
      },
      {
        question: "¿Me conviene un producto individual o un kit familiar?",
        answer: "Elige un producto individual para una necesidad concreta. Los kits Infantil para la Ciudad y Playa Familiar son puntos de partida útiles cuando necesitas varios artículos; envía la configuración para que podamos revisar la solicitud completa.",
      },
    ],
  },
  "mobility": {
    title: "Alquiler de Equipos de Movilidad en Valencia",
    description: "Alquila sillas de ruedas, scooters de movilidad, andadores y ayudas diarias en Valencia, con entrega y recogida en tu hotel o apartamento.",
    editorialHeading: "Explorar Valencia con equipos de movilidad",
    editorialParagraphs: [
      "Valencia tiene muchas rutas relativamente llanas, paseos amplios y espacios públicos sin escalones, pero el acceso cambia según la calle, el edificio, la parada de transporte y el destino. Conviene revisar la ruta concreta de la estancia en lugar de dar por accesible toda la ciudad.",
      "Alquilar localmente evita llevar un equipo de movilidad voluminoso en el avión. La reserva muestra las opciones actuales de recogida y entrega; si afectan a la entrega, podemos comprobar escalones, ascensores, puertas estrechas y almacenamiento antes del pago.",
      "Empieza por el tipo de apoyo que necesitas: scooter para recorridos pavimentados adecuados, silla de ruedas para movilidad sentada o andador para apoyo al caminar. Cada ficha explica los límites de ajuste, acceso, transporte y uso correspondientes.",
    ],
    familyHeading: "Compara los equipos de movilidad por tipo",
    familyDescription: "El catálogo completo aparece arriba. Utiliza las páginas de scooters o sillas de ruedas para comparar opciones similares.",
    familyPathways: [
      {
        eyebrow: "Scooters de movilidad",
        title: "Comparar scooters de movilidad en Valencia",
        description: "Compara transporte, espacio de giro, capacidad, almacenamiento y tipo de recorrido antes de elegir.",
        href: "/es/rental/mobility/mobility-scooters",
      },
      {
        eyebrow: "Sillas de ruedas",
        title: "Comparar sillas de ruedas en Valencia",
        description: "Consulta las opciones actuales según la propulsión, el transporte, las medidas y los accesos.",
        href: "/es/rental/mobility/wheelchairs",
      },
    ],
    featuredHeading: "Planifica un viaje accesible en Valencia",
    featuredDescription: "Elige un conjunto de accesibilidad, prepara la visita de familiares mayores o consulta nuestra guía local para conocer rutas y servicios.",
    featuredPathways: [
      {
        eyebrow: "Kit de accesibilidad",
        title: "Configura un kit de Valencia accesible",
        description: "Combina movilidad con apoyo práctico para el baño y la vida diaria en el alojamiento.",
        href: "/es/valencia/kits/accessible-valencia-kit",
      },
      {
        eyebrow: "Kit para visitas familiares",
        title: "Prepara la visita de los abuelos",
        description: "Crea un conjunto adaptado con apoyo para caminar, confort y gestión del calor en Valencia.",
        href: "/es/valencia/kits/grandparents-visiting-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Descubre la Valencia accesible",
        description: "Planifica transporte, atracciones, playas y rutas por barrios con contexto práctico de accesibilidad.",
        href: "/es/blog/wheelchair-accessibility-valencia",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de movilidad en Valencia",
    faqs: [
      { question: "¿Puedo alquilar una silla de ruedas o un scooter en Valencia?", answer: "Sí. Las fichas publicadas muestran las sillas, scooters y ayudas para caminar disponibles. Introduce tus fechas para comprobar el inventario y las opciones de recogida o entrega." },
      { question: "¿Cómo elijo entre silla de ruedas, andador y scooter?", answer: "Valora la capacidad para caminar, las transferencias, la distancia, el espacio de guardado, el transporte y el acceso al alojamiento. Cada ficha incluye medidas y especificaciones para comparar." },
      { question: "¿Entregáis equipos de movilidad en hoteles o apartamentos?", answer: "La reserva muestra las opciones de entrega y recogida disponibles. Indica si hay escalones, ascensor, puertas estrechas o restricciones de recepción para planificar la entrega con seguridad." },
      { question: "¿Valencia es adecuada para usuarios de silla de ruedas o scooter?", answer: "Muchas rutas céntricas, el Jardín del Turia y el paseo marítimo son relativamente llanos, pero las superficies y accesos varían. Consulta nuestra guía y verifica la información actual del transporte o recinto." },
    ],
  },
  "remote-work": {
    title: "Alquiler de Equipos de Teletrabajo en Valencia",
    description: "Alquila monitores, escritorios regulables y sillas ergonómicas en Valencia, con entrega y recogida para teletrabajo y estancias largas.",
    editorialHeading: "Prepara un espacio de trabajo práctico en tu apartamento",
    editorialParagraphs: [
      "Un apartamento temporal puede tener una buena conexión a internet y, aun así, no ofrecer un lugar cómodo para trabajar. Alquilar equipamiento de teletrabajo en Valencia permite añadir la pantalla, el escritorio o la silla que necesitas sin comprar muebles para una estancia corta o media.",
      "Elige un monitor, un escritorio regulable o una silla ergonómica según tu forma de trabajar y el espacio disponible. Cada ficha explica conexiones, medidas, ajustes y compatibilidad para comprobar que el equipo encaja con tu portátil y tu alojamiento antes de reservar.",
      "Para un puesto completo, el Kit de Teletrabajo para Apartamento combina los elementos principales y complementos opcionales en una sola solicitud. Las opciones de entrega y recogida aparecen durante la reserva y podemos confirmar con antelación el acceso, la ubicación y cualquier necesidad de montaje.",
    ],
    featuredHeading: "Planifica tu espacio de trabajo en Valencia",
    featuredDescription: "Empieza con un puesto completo para el apartamento o consulta nuestra guía para decidir dónde y cómo quieres trabajar durante tu estancia.",
    featuredPathways: [
      {
        eyebrow: "Kit de teletrabajo",
        title: "Configura un kit de teletrabajo para el apartamento",
        description: "Combina monitor, escritorio, asiento ergonómico y accesorios prácticos según tu estancia.",
        href: "/es/valencia/kits/remote-work-apartment-kit",
      },
      {
        eyebrow: "Guía de Valencia",
        title: "Planifica una estancia de teletrabajo en Valencia",
        description: "Compara el trabajo desde el apartamento, los espacios de coworking y las zonas más prácticas.",
        href: "/es/blog/digital-nomad-guide-valencia",
      },
      {
        eyebrow: "Lista de preparación",
        title: "Monta un puesto fiable en el apartamento",
        description: "Comprueba conexión, medidas, luz, ruido y equipo mínimo antes de la primera jornada.",
        href: "/es/blog/home-office-setup-valencia-apartment",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de equipos de teletrabajo",
    faqs: [
      { question: "¿Puedo alquilar un monitor en Valencia para una estancia corta?", answer: "Sí. Selecciona un monitor publicado, introduce tus fechas y comprueba la disponibilidad. La ficha muestra tamaño, conexiones y accesorios incluidos para confirmar la compatibilidad." },
      { question: "¿Podéis entregar equipos de oficina en mi apartamento?", answer: "La reserva muestra las opciones de entrega y recogida para la dirección y el periodo elegidos. Podemos confirmar el acceso, el ascensor y cualquier necesidad de montaje antes de la entrega." },
      { question: "¿Qué necesito para una oficina temporal en casa?", answer: "Un monitor, una altura de mesa adecuada y una silla con buen apoyo son la base. El soporte, teclado, ratón o hub dependen de tu equipo. El Kit de Teletrabajo ofrece un punto de partida combinado." },
      { question: "¿Puedo alquilar el equipo durante varias semanas o meses?", answer: "Introduce todo el periodo en la ficha del producto. La calculadora aplica el tramo de duración correspondiente y muestra disponibilidad y precio total antes del pago." },
    ],
  },
  "home-living": {
    title: "Alquiler de Aire Acondicionado Portátil en Valencia",
    description: "Alquila aire acondicionado portátil, purificadores y equipamiento de confort en Valencia, con entrega y recogida para estancias cortas o largas.",
    heading: "Alquiler de Equipamiento para Apartamentos en Valencia",
    introDescription: "Alquila equipos de climatización, calidad del aire, limpieza y artículos prácticos para el hogar en Valencia, con entrega y recogida para estancias cortas o largas.",
    editorialHeading: "Adapta tu apartamento de Valencia a tu estancia",
    editorialParagraphs: [
      "Los apartamentos turísticos y alojamientos temporales no siempre incluyen todo lo necesario para una estancia cómoda. El alquiler de refrigeración portátil, equipos para la calidad del aire y otros complementos permite resolver una necesidad concreta sin comprar, guardar o desechar un aparato voluminoso al terminar el viaje.",
      "Durante el verano, un aire acondicionado portátil puede mejorar el confort de un dormitorio o salón cuando el alojamiento tiene una refrigeración limitada. Estos equipos necesitan una salida adecuada por ventana o puerta de balcón, por lo que cada ficha explica la superficie recomendada, la evacuación del aire, el ruido y el montaje antes de confirmar la disponibilidad.",
      "Los purificadores pueden ayudar a huéspedes sensibles al polvo, el polen o la calidad del aire interior. Elige un producto o empieza con el Kit de Apartamento de Verano para preparar una combinación adaptada. Las opciones de entrega y recogida aparecen durante la reserva y confirmamos los detalles de instalación con el alojamiento.",
    ],
    featuredHeading: "Prepara una estancia más cómoda en Valencia",
    featuredDescription: "Empieza con un kit estacional o consulta nuestra guía práctica para elegir la refrigeración y el equipamiento adecuados para tu alojamiento.",
    featuredPathways: [
      {
        eyebrow: "Kit de apartamento",
        title: "Configura un kit de apartamento de verano",
        description: "Combina refrigeración y equipos para la calidad del aire según tu alojamiento y tus fechas.",
        href: "/es/valencia/kits/summer-apartment-survival-kit",
      },
      {
        eyebrow: "Kit para estancias largas · en inglés",
        title: "Mejora una cocina temporal",
        description: "Combina equipamiento práctico para una estancia larga sin comprar electrodomésticos voluminosos.",
        href: "/es/valencia/kits/long-stay-kitchen-upgrade-kit",
      },
      {
        eyebrow: "Guía práctica",
        title: "Prepárate para el verano en Valencia",
        description: "Consulta horarios locales, estrategias para refrescar el apartamento y consejos para los días de más calor.",
        href: "/es/blog/valencia-summer-survival-guide",
      },
    ],
    faqHeading: "Preguntas sobre aire acondicionado portátil y confort",
    faqs: [
      { question: "¿Puedo alquilar un aire acondicionado portátil en Valencia?", answer: "Sí, cuando haya una unidad publicada disponible para tus fechas. Revisa la superficie recomendada, la salida de aire, las medidas y el ruido antes de reservar." },
      { question: "¿Funcionará un aire acondicionado portátil en mi apartamento?", answer: "La estancia necesita una ventana o puerta de balcón adecuada para el tubo de extracción y espacio alrededor del equipo. Revisa la ficha y consúltanos el tipo de apertura si tienes dudas." },
      { question: "¿Entregáis y recogéis los equipos de aire acondicionado?", answer: "La reserva muestra las opciones de entrega y recogida, horarios y costes disponibles. Conviene confirmar el acceso y la ubicación porque las unidades portátiles son voluminosas." },
      { question: "¿Necesito aire acondicionado, ventilador o purificador?", answer: "El aire acondicionado enfría si puede expulsar el calor al exterior. Un ventilador mueve el aire, pero no reduce la temperatura. Un purificador trata partículas, no el calor. Elige según el problema del alojamiento." },
    ],
  },
  "travel-outdoors": {
    title: "Alquiler de Material de Playa y Aire Libre en Valencia",
    description: "Alquila material de playa y aire libre en Valencia para días junto al mar, actividades familiares y excursiones, con recogida o entrega según tu reserva.",
    editorialHeading: "Material de playa y aire libre para tu estancia en Valencia",
    editorialParagraphs: [
      "El material de playa y aire libre puede ser incómodo de transportar en avión o guardar en un alojamiento temporal. Alquilarlo en Valencia te permite elegir lo que encaja con tus planes sin comprar artículos voluminosos para una estancia corta.",
      "Utiliza el catálogo completo para días de playa, actividades acuáticas, juegos al aire libre, transporte de material o acampada. Cada ficha muestra las medidas, los elementos incluidos, el montaje y las limitaciones de uso antes de comprobar la disponibilidad.",
      "Las opciones de recogida y entrega se muestran para la dirección y las fechas de tu reserva. Para un día junto al mar, el Kit de Playa Familiar también sirve como punto de partida para combinar sombra, asientos, una nevera, juegos y transporte.",
    ],
    featuredHeading: "Planifica días de playa y aire libre en Valencia",
    featuredDescription: "Combina el material con un conjunto familiar de playa o con información local útil para los planes que tengas en mente.",
    featuredPathways: [
      {
        eyebrow: "Kit de playa",
        title: "Prepara un kit de playa familiar",
        description: "Combina sombra con complementos prácticos para los días de playa durante tu estancia en Valencia.",
        href: "/es/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Compara las playas familiares de Valencia",
        description: "Elige entre Malvarrosa, Patacona, Cabanyal y El Saler según el acceso, los servicios y la logística familiar.",
        href: "/es/blog/best-beaches-valencia-families",
      },
      {
        eyebrow: "Guía práctica",
        title: "Prepárate para el verano en Valencia",
        description: "Planifica horarios, protección frente al sol y soluciones prácticas para los días de más calor.",
        href: "/es/blog/valencia-summer-survival-guide",
      },
    ],
    searchIntentHeading: "Elige el material adecuado para la playa o el aire libre",
    searchIntentDescription: "Utiliza un único catálogo de Valencia para encontrar lo que encaja con tus planes; cada ficha ofrece las medidas, elementos incluidos y disponibilidad concretos.",
    searchIntents: [
      {
        title: "Un día cómodo en la playa",
        description: "Compara sombra, asientos, neveras, toallas, transporte y juegos según tu grupo, tus planes y el alojamiento.",
      },
      {
        title: "Actividades acuáticas y al aire libre",
        description: "Comprueba la capacidad, los elementos incluidos, el transporte y las indicaciones de uso en la ficha correspondiente antes de elegir fechas.",
      },
      {
        title: "Acampada, carga y transporte",
        description: "Elige el material según el trayecto, el espacio disponible y el destino, sin asumir que todos los artículos sirven para cualquier salida.",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de material de playa y aire libre",
    faqs: [
      {
        question: "¿Puedo alquilar material de playa y aire libre en Valencia?",
        answer: "Sí. Consulta el catálogo publicado de Playa y Aire Libre, selecciona tus fechas y comprueba la disponibilidad. Las opciones de recogida o entrega aparecen durante la reserva antes del pago.",
      },
      {
        question: "¿Entregáis material de playa en Malvarrosa o Patacona?",
        answer: "La reserva muestra las opciones de recogida y entrega disponibles, los horarios y cualquier coste aplicable para la dirección y las fechas indicadas. Escríbenos si tu alojamiento queda fuera de las zonas mostradas.",
      },
      {
        question: "¿Qué material de playa y aire libre puedo alquilar?",
        answer: "El catálogo actual reúne material para días de playa, actividades acuáticas, juegos al aire libre, carga, transporte y acampada. Los artículos concretos y su disponibilidad dependen de las fechas elegidas.",
      },
      {
        question: "¿Me conviene una sombrilla o un refugio de playa?",
        answer: "Una sombrilla resulta flexible y familiar para grupos pequeños. Un refugio puede ofrecer una zona cubierta más amplia para familias. Compara las medidas, el montaje y los límites de viento en cada ficha.",
      },
      {
        question: "¿Puedo reservar material de exterior para un solo día?",
        answer: "Introduce la fecha y la hora de inicio y fin en la ficha correspondiente. El proceso de reserva mostrará si el artículo está disponible y calculará el precio aplicable para ese periodo.",
      },
    ],
  },
  "fitness-wellness": {
    title: "Alquiler de Material Deportivo en Valencia",
    description: "Alquila material deportivo, de fitness y bienestar en Valencia para entrenar o mantener tu rutina, con recogida y entrega según tu reserva.",
    image: "/categories/sports-wellness.webp",
    editorialHeading: "Alquila material deportivo durante tu estancia en Valencia",
    editorialParagraphs: [
      "El material deportivo y de fitness voluminoso rara vez compensa llevarlo por el aeropuerto o comprarlo para una estancia temporal. Alquilar en Valencia te permite mantener tu rutina, organizar una actividad concreta o hacer más cómoda una visita larga sin añadirlo al equipaje.",
      "Empieza por la actividad y el espacio que tendrás disponible. Cada ficha muestra medidas, elementos incluidos, montaje y precio para que puedas decidir qué encaja en tu alojamiento, en una pista o en otro lugar de Valencia.",
      "Elige el producto, introduce tus fechas y revisa las opciones de recogida o entrega antes del pago. Si vas a utilizarlo en un club o espacio compartido, consulta previamente sus normas de acceso y uso de material.",
    ],
    featuredHeading: "Organiza el material deportivo para tu estancia",
    featuredDescription: "Consulta cómo funciona el alquiler y utiliza nuestras guías de Valencia para coordinar transporte, horarios y actividad.",
    featuredPathways: [
      {
        eyebrow: "Proceso de alquiler",
        title: "Consulta la recogida, entrega y reserva",
        description: "Revisa la disponibilidad, el pago, la entrega del material y su devolución antes de elegir las fechas.",
        href: "/es/how-it-works",
      },
      {
        eyebrow: "Guía local",
        title: "Descubre los Jardines del Turia",
        description: "Planifica una jornada en el gran parque urbano de Valencia y consulta sus zonas de actividad y accesos.",
        href: "/es/discover/turia-gardens",
      },
    ],
    searchIntentHeading: "Elige lo que encaja con tus planes",
    searchIntentDescription: "Piensa dónde vas a utilizar el equipo, cuánto espacio tienes y si necesitarás transportarlo o montarlo durante la estancia.",
    searchIntents: [
      {
        title: "Entrenar en tu alojamiento",
        description: "Comprueba el espacio disponible, el ruido, la alimentación eléctrica y si el equipo cabe por las entradas o el ascensor.",
      },
      {
        title: "Sesiones en pista o al aire libre",
        description: "Confirma el acceso y las normas del recinto, y revisa el tamaño plegado, las piezas incluidas y el transporte del producto.",
      },
      {
        title: "Mantenerte activo durante una estancia larga",
        description: "Elige material adecuado para tu rutina y el espacio disponible sin comprarlo ni guardarlo para una visita temporal.",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de material deportivo en Valencia",
    faqs: [
      {
        question: "¿Puedo alquilar material deportivo o de fitness en Valencia?",
        answer: "Sí. Consulta el catálogo actual de Deporte y Bienestar, abre el producto que te interesa e introduce tus fechas para comprobar la disponibilidad, el precio y las opciones de recogida o entrega.",
      },
      {
        question: "¿Podéis entregar material deportivo en mi alojamiento o en un club?",
        answer: "La reserva muestra las opciones de entrega disponibles para la dirección y las fechas indicadas. Si el destino es un club o un espacio compartido, confirma antes que puede recibir y permite utilizar el equipo.",
      },
      {
        question: "¿Qué debo comprobar antes de elegir el equipo?",
        answer: "Revisa las medidas, el tamaño plegado, las piezas incluidas, el montaje, la alimentación y los requisitos de espacio o del recinto indicados en la ficha. Escríbenos si necesitas comprobar si encaja con tus planes.",
      },
      {
        question: "¿Puedo alquilar material deportivo durante un solo día?",
        answer: "Introduce la fecha y la hora de inicio y fin en la ficha del producto. La comprobación mostrará si está disponible y calculará el precio aplicable para ese periodo.",
      },
    ],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  return Object.keys(categoryMetaES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) return { title: "Categoría No Encontrada" };
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://rentandroll.com/es/rental/${category}`,
      languages: {
        en: `https://rentandroll.com/rental/${category}`,
        es: `https://rentandroll.com/es/rental/${category}`,
        "x-default": `https://rentandroll.com/rental/${category}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://rentandroll.com/es/rental/${category}`,
      locale: "es_ES",
      images: [{ url: meta.image ?? `/categories/${category}.webp`, alt: meta.title }],
    },
  };
}

export default async function CategoryPageES({ params }: Props) {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) notFound();
  const displayTitle = meta.heading ?? meta.title;
  const displayDescription = meta.introDescription ?? meta.description;

  const categoryProducts = await getProductsByCategoryFromDB(category, "es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCategoryCollectionJsonLd({
              name: displayTitle,
              description: displayDescription,
              url: `https://rentandroll.com/es/rental/${category}`,
              locale: "es",
              products: categoryProducts,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Inicio", url: "https://rentandroll.com/es" },
              { name: "Valencia", url: "https://rentandroll.com/es/valencia" },
              { name: displayTitle, url: `https://rentandroll.com/es/rental/${category}` },
            ])
          ),
        }}
      />
      {meta.faqs && meta.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getFaqJsonLd(meta.faqs.map((faq) => ({ q: faq.question, a: faq.answer })))
            ),
          }}
        />
      )}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/es" className="hover:text-brand transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/es/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{displayTitle.split(" en Valencia")[0]}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-7 md:py-8">
        <div className="container-site">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{displayTitle}</h1>
          <p className="mt-2 max-w-2xl text-neutral-600">{displayDescription}</p>
        </div>
      </section>

      <CategoryProductCatalogue products={categoryProducts} locale="es" />

      {meta.familyPathways && meta.familyPathways.length > 0 && (
        <section className="border-y border-border bg-neutral-50 py-10">
          <div className="container-site">
            <div className="mb-5 max-w-3xl">
              <h2 className="text-2xl font-bold">{meta.familyHeading}</h2>
              <p className="mt-2 text-neutral-600">{meta.familyDescription}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {meta.familyPathways.map((pathway) => (
                <Link key={pathway.href} href={pathway.href} className="card group bg-white p-5 hover:shadow-md">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">{pathway.eyebrow}</span>
                  <h3 className="mt-2 text-lg font-bold group-hover:text-brand">{pathway.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{pathway.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {meta.searchIntents && meta.searchIntents.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.searchIntentHeading}</h2>
              <p className="text-neutral-600 leading-relaxed">{meta.searchIntentDescription}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.searchIntents.map((intent) => (
                <div key={intent.title} className="card p-6 bg-white">
                  <h3 className="font-bold text-lg mb-2">{intent.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{intent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{meta.editorialHeading}</h2>
            {meta.editorialParagraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {meta.featuredPathways && meta.featuredPathways.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.featuredHeading}</h2>
              <p className="text-neutral-600">
                {meta.featuredDescription}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.featuredPathways.map((pathway) => (
                <Link
                  key={pathway.href}
                  href={pathway.href}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand mb-3">{pathway.eyebrow}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {pathway.description}
                  </p>
                  <span className="text-sm font-semibold text-brand">Explorar →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {meta.faqs && meta.faqs.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-8">{meta.faqHeading}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {meta.faqs.map((faq) => (
                  <div key={faq.question} className="card p-6 bg-white">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-neutral-50 py-12">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">¿No encuentras lo que buscas?</h2>
          <p className="text-neutral-500 mb-6">Estamos añadiendo nuevos productos constantemente. ¡Escríbenos!</p>
          <a href="https://wa.me/34684708013" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            💬 Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
