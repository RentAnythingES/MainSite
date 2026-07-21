import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import ProductCard from "@/components/ProductCard";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

interface CategoryContent {
  title: string;
  description: string;
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
    description: "Alquila cochecitos, cunas de viaje, sillas de coche, tronas y más en Valencia. Marcas de primera calidad entregadas en tu alojamiento.",
    editorialHeading: "¿Por qué alquilar artículos de bebé en Valencia?",
    editorialParagraphs: [
      "Viajar con un bebé o un niño pequeño significa hacer maletas con estrategia. Cochecitos, sillas de coche y cunas de viaje son voluminosos, pesados y caros de facturar como equipaje — además del riesgo de daños durante el transporte.",
      "Alquilar localmente resuelve todo esto. Entregamos equipos de bebé de primera calidad directamente en tu hotel, Airbnb o apartamento vacacional antes de que llegues. Todo está limpio e inspeccionado entre alquileres. Cuando termines, recogemos todo en tu puerta. Sin colas, sin cintas de equipaje, sin estrés.",
      "Valencia es una de las ciudades más familiares de Europa — calles llanas para cochecitos, playas suaves para los más pequeños y una cultura que acoge a los niños en todas partes. El equipo adecuado lo hace aún mejor.",
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
  },
  "mobility": {
    title: "Alquiler de Sillas de Ruedas y Scooters en Valencia",
    description: "Alquila sillas de ruedas, scooters de movilidad, andadores y ayudas diarias en Valencia. Entrega en tu hotel o Airbnb.",
    editorialHeading: "Explorar Valencia con equipos de movilidad",
    editorialParagraphs: [
      "Valencia es una de las ciudades más accesibles de España. El terreno llano, el metro totalmente accesible y los amplios paseos marítimos la hacen ideal para usuarios de silla de ruedas y visitantes con movilidad reducida.",
      "Alquilar equipos de movilidad localmente significa que evitas el riesgo de daños en tu propia silla de ruedas o scooter durante el vuelo. Entregamos directamente en tu alojamiento — ya sea un hotel en el centro histórico, un apartamento en la playa de la Malvarrosa o un Airbnb en Ruzafa.",
      "Nuestros scooters de movilidad ligeros son especialmente populares entre los visitantes que quieren independencia para recorrer los 9 km de los Jardines del Turia, la Ciudad de las Artes y las Ciencias, y las playas accesibles con sus servicios de baño asistido.",
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
    title: "Alquiler de Equipamiento para Apartamentos en Valencia",
    description: "Alquila aire acondicionado portátil, purificadores y equipamiento de confort en Valencia, con entrega y recogida para estancias cortas o largas.",
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
    title: "Alquiler de Equipamiento de Playa en Valencia",
    description: "Alquila sombrillas, refugios y sombra familiar en Valencia, con opciones de recogida o entrega para Malvarrosa, Patacona y alojamientos cercanos.",
    editorialHeading: "Alquila material para tus días de playa en Valencia",
    editorialParagraphs: [
      "Las sombrillas y los refugios de playa son difíciles de transportar en avión y pocos apartamentos vacacionales los incluyen. Alquilar equipamiento de playa en Valencia permite disponer de sombra sin comprar artículos voluminosos para una estancia corta.",
      "Elige el producto que encaje con tu grupo y tus planes, desde una sombrilla tradicional hasta un refugio familiar compacto. Cada ficha recoge las medidas, el peso, las piezas incluidas, las instrucciones de montaje y las limitaciones importantes de viento o cuidado antes de comprobar la disponibilidad.",
      "Las opciones de recogida y entrega facilitan el uso del material si te alojas cerca de Malvarrosa, Patacona, Cabanyal o el centro. Las familias que necesiten algo más que sombra también pueden empezar con el Kit de Playa Familiar y solicitar la combinación adecuada para sus fechas.",
    ],
    featuredHeading: "Planifica tus días de playa en Valencia",
    featuredDescription: "Combina el equipamiento con un kit familiar o una guía práctica de la playa más cercana a tu alojamiento.",
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
    searchIntentHeading: "Elige el equipamiento adecuado para la playa",
    searchIntentDescription: "Compara en un único catálogo de Valencia el tipo de equipamiento que necesitas, sin saltar entre páginas de alquiler repetitivas.",
    searchIntents: [
      {
        title: "Sombra para un día sencillo de playa",
        description: "Compara sombrillas y refugios compactos por superficie cubierta, tamaño plegado, montaje y recomendaciones de viento antes de indicar tus fechas.",
      },
      {
        title: "Un conjunto completo para familias",
        description: "Empieza con el Kit de Playa Familiar si necesitas sombra y complementos prácticos como frío, toallas, juguetes o transporte más cómodo.",
      },
      {
        title: "Material más fácil de transportar",
        description: "Consulta neveras, carros de playa, mobiliario plegable y otros artículos publicados para Malvarrosa, Patacona y alojamientos cerca de la costa de Valencia.",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de material de playa en Valencia",
    faqs: [
      {
        question: "¿Puedo alquilar material de playa en Valencia?",
        answer: "Sí. Consulta el catálogo publicado de Playa y Aire Libre, selecciona tus fechas y comprueba la disponibilidad. Las opciones de recogida o entrega aparecen durante la reserva antes del pago.",
      },
      {
        question: "¿Entregáis material de playa en Malvarrosa o Patacona?",
        answer: "La reserva muestra las opciones de recogida y entrega disponibles, los horarios y cualquier coste aplicable para la dirección y las fechas indicadas. Escríbenos si tu alojamiento queda fuera de las zonas mostradas.",
      },
      {
        question: "¿Qué material de playa puedo alquilar?",
        answer: "El catálogo publicado puede incluir sombrillas, refugios, toallas, neveras, carros, mobiliario plegable y juegos de playa. Los artículos concretos y su disponibilidad dependen de las fechas elegidas.",
      },
      {
        question: "¿Me conviene una sombrilla o un refugio de playa?",
        answer: "Una sombrilla resulta flexible y familiar para grupos pequeños. Un refugio puede ofrecer una zona cubierta más amplia para familias. Compara las medidas, el montaje y los límites de viento en cada ficha.",
      },
      {
        question: "¿Puedo reservar material de playa para un solo día?",
        answer: "Introduce la fecha y la hora de inicio y fin en la ficha correspondiente. El proceso de reserva mostrará si el artículo está disponible y calculará el precio aplicable para ese periodo.",
      },
    ],
  },
  "fitness-wellness": {
    title: "Alquiler de Material Deportivo en Valencia",
    description: "Alquila material de tenis, pádel y entrenamiento en Valencia, con fechas flexibles y opciones de recogida o entrega en tu alojamiento o club.",
    image: "/categories/sports-wellness.webp",
    editorialHeading: "Alquila material deportivo durante tu estancia en Valencia",
    editorialParagraphs: [
      "El material deportivo puede resultar difícil de transportar, especialmente cuando necesitas equipamiento de entrenamiento especializado y no solo una raqueta o unas zapatillas. Alquilar en Valencia permite organizarlo según tus fechas sin llevarlo por el aeropuerto ni comprarlo para una estancia corta.",
      "El catálogo publicado de Deporte y Bienestar empieza con material para entrenar tenis y pádel. Cada ficha explica el modelo, las piezas incluidas, la alimentación o carga, el transporte y las condiciones de alquiler para que puedas comprobar si encaja con la sesión prevista.",
      "Comprueba la disponibilidad para tus fechas y revisa las opciones de recogida o entrega antes del pago. Si vas a utilizar el equipo en un club o una pista, confirma también con el recinto el acceso, el espacio disponible y sus normas de uso.",
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
    searchIntentHeading: "Elige el material según la actividad",
    searchIntentDescription: "Compara el equipo, los accesorios incluidos y los requisitos de uso para tus fechas en Valencia en lugar de enviar una solicitud deportiva genérica.",
    searchIntents: [
      {
        title: "Entrenamiento de tenis y pádel",
        description: "Comprueba la capacidad de pelotas, la autonomía, los controles, las medidas de transporte y el espacio necesario para utilizar el equipo con seguridad.",
      },
      {
        title: "Equipamiento para una estancia corta",
        description: "El alquiler local resulta útil cuando comprar material especializado o transportarlo no compensa para una visita temporal.",
      },
      {
        title: "Entrega en un club o alojamiento",
        description: "Revisa las opciones de entrega durante la reserva y confirma por separado que el recinto puede recibir y permite utilizar el equipo.",
      },
    ],
    faqHeading: "Preguntas sobre el alquiler de material deportivo en Valencia",
    faqs: [
      {
        question: "¿Puedo alquilar material de tenis o pádel en Valencia?",
        answer: "Sí, cuando haya un artículo publicado disponible para tus fechas. El catálogo y cada ficha muestran el equipo, las piezas incluidas, el precio y las opciones de recogida o entrega.",
      },
      {
        question: "¿Podéis entregar material deportivo en un club de tenis o pádel?",
        answer: "Selecciona una opción de entrega durante la reserva si la dirección está dentro de una zona disponible. Confirma también con el club el acceso, la recepción y sus normas de uso del material.",
      },
      {
        question: "¿Qué debo comprobar antes de alquilar una máquina lanzapelotas?",
        answer: "Revisa la autonomía, la capacidad, los controles, las medidas, el cargador incluido y las indicaciones de uso seguro. Confirma que la pista elegida permite estas máquinas y dispone de espacio suficiente.",
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
      canonical: `https://rentanything.es/es/rental/${category}`,
      languages: {
        en: `https://rentanything.es/rental/${category}`,
        es: `https://rentanything.es/es/rental/${category}`,
        "x-default": `https://rentanything.es/rental/${category}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://rentanything.es/es/rental/${category}`,
      locale: "es_ES",
      images: [{ url: meta.image ?? `/categories/${category}.webp`, alt: meta.title }],
    },
  };
}

export default async function CategoryPageES({ params }: Props) {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) notFound();

  const categoryProducts = await getProductsByCategoryFromDB(category, "es");

  const subcategories = Array.from(
    new Map(categoryProducts.map((p) => [p.subcategorySlug, { name: p.subcategory, slug: p.subcategorySlug }])).values()
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCategoryCollectionJsonLd({
              name: meta.title,
              description: meta.description,
              url: `https://rentanything.es/es/rental/${category}`,
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
              { name: "Inicio", url: "https://rentanything.es/es" },
              { name: "Valencia", url: "https://rentanything.es/es/valencia" },
              { name: meta.title, url: `https://rentanything.es/es/rental/${category}` },
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
            <li className="text-neutral-800 font-medium">{meta.title.split(" en Valencia")[0]}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-12 md:py-16">
        <div className="container-site">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{meta.title}</h1>
          <p className="text-neutral-600 max-w-2xl">{meta.description}</p>
        </div>
      </section>

      {subcategories.length > 1 && (
        <section className="bg-white border-b border-border py-4">
          <div className="container-site">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm text-neutral-500 flex-shrink-0">Filtrar:</span>
              <span className="px-3 py-1.5 rounded-full bg-brand text-white text-sm font-medium cursor-pointer">
                Todos ({categoryProducts.length})
              </span>
              {subcategories.map((sub) => (
                <span key={sub.slug} className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 cursor-pointer transition-colors flex-shrink-0">
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-site">
          <p className="text-sm text-neutral-500 mb-6">{categoryProducts.length} productos disponibles en Valencia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} id={`cat-product-${product.slug}`} basePath="/es/product" />
            ))}
          </div>
        </div>
      </section>

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
