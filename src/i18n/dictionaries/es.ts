import type { Dictionary } from "@/i18n/types";

/**
 * Spanish (Spain) dictionary — Castellano / Español de España
 *
 * Terminology notes:
 * - "Alquiler" not "renta" (Spain vs Mexico)
 * - "Cochecito" / "sillita de paseo" not "carriola" (Spain vs Mexico)
 * - "Trona" not "periquera" (Spain vs Mexico)
 * - "Silla de coche" not "autoasiento" (Spain vs Mexico)
 * - "Teletrabajo" is standard in Spain (remote work)
 * - "Tú" form (informal but respectful, standard for modern brands in Spain)
 * - Valencia-specific references where applicable
 */
const es: Dictionary = {
  locale: "es",
  siteName: "RentAnything.es",

  nav: {
    browse: "Explorar",
    valencia: "Valencia",
    discover: "Descubrir",
    howItWorks: "Cómo Funciona",
    about: "Sobre Nosotros",
    faq: "Preguntas Frecuentes",
    blog: "Blog",
    rentNow: "Reservar",
  },

  home: {
    badge: "📍 Ahora en Valencia",
    headline: "Viaja ligero.",
    headlineAccent: "Alquila todo.",
    subheadline: "Cochecitos, sillas de ruedas, equipos de teletrabajo y más — entregados en tu alojamiento en Valencia. Sin equipaje pesado, sin estrés.",
    ctaPrimary: "Ver alquileres en Valencia",
    ctaSecondary: "Cómo Funciona",
    categoriesTitle: "¿Qué necesitas?",
    categoriesSubtitle: "Todo lo que necesitas para tu estancia en Valencia, en un solo lugar.",
    trustStats: [
      { number: "Valencia", label: "Área de servicio local" },
      { number: "EN · ES", label: "Atención bilingüe" },
      { number: "Flexible", label: "Alquileres cortos y largos" },
      { number: "Local", label: "Opciones de recogida y entrega" },
    ],
    featuredTitle: "Alquileres Destacados",
    featuredSubtitle: "Nuestros artículos más populares en Valencia",
    viewAll: "Ver todo →",
    howItWorksTitle: "Cómo Funciona",
    howItWorksSubtitle: "Tres pasos sencillos para un viaje sin preocupaciones.",
    howItWorksSteps: [
      { title: "Explora y Reserva", description: "Descubre nuestra selección de equipos de primera calidad. Elige tus fechas, añade extras y reserva al instante." },
      { title: "Te lo Llevamos", description: "Entrega a domicilio en tu hotel, Airbnb o apartamento. Todo limpio y revisado para tu seguridad." },
      { title: "Disfruta y Devuelve", description: "¡Úsalo sin preocupaciones! Cuando termine tu viaje, recogemos todo. No necesitas limpiar nada." },
    ],
    startBrowsing: "Empezar a explorar →",
    ctaBannerTitle: "¿Listo para viajar ligero?",
    ctaBannerSubtitle: "Explora nuestra gama completa de equipos de alquiler de primera calidad, entregados directamente en tu alojamiento en Valencia.",
    browseRentals: "Ver alquileres",
    contactUs: "Contacto",
  },

  categories: {
    babyGear: { name: "Bebé y Niños", desc: "Cochecitos, cunas, sillas de coche y tronas" },
    mobility: { name: "Movilidad", desc: "Sillas de ruedas, scooters y andadores" },
    remoteWork: { name: "Teletrabajo", desc: "Monitores, escritorios, sillas y accesorios" },
    homeLiving: { name: "Hogar y Confort", desc: "Purificadores de aire, calefactores y confort" },
    travelOutdoors: { name: "Playa y Aire Libre", desc: "Sombrillas, neveras y equipamiento" },
    pregnancy: { name: "Embarazo", desc: "Almohadas de apoyo, artículos de confort" },
  },

  product: {
    from: "Desde",
    perDay: "/día",
    features: "Características",
    specs: "Especificaciones",
    pricing: "Precios",
    days: "días",
    bookNow: "Reservar Ahora",
    relatedProducts: "Productos Relacionados",
    faqTitle: "Preguntas Frecuentes",
    deliveryNote: "Entrega gratuita en Valencia en pedidos de más de 50 €",
  },

  valencia: {
    badge: "📍 Valencia, España",
    headline: "Alquiler de equipos",
    headlineAccent: "en Valencia",
    subtitle: "Todo lo que necesitas para tu viaje a Valencia — artículos de bebé, ayudas de movilidad, equipos de teletrabajo y más. Marcas de primera, entregados en tu hotel, Airbnb o apartamento.",
    ctaPrimary: "Ver todos los productos ↓",
    ctaSecondary: "Cómo Funciona",
    deliveryBar: [
      "🚚 Entrega gratuita en pedidos de más de 50 €",
      "📍 Centro y zonas de playa",
      "🧼 100% equipos desinfectados",
      "⚡ Entrega en el mismo día disponible",
    ],
    browseByCategory: "Explorar por Categoría",
    allProducts: "Todos los Productos",
  },

  common: {
    home: "Inicio",
    viewAll: "Ver todo →",
    explore: "Explorar →",
    learnMore: "Más información",
    backTo: "Volver a",
  },
};

export default es;
