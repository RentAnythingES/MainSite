export interface ProductSeoPathway {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

interface ProductSeoPathwaySet {
  en: ProductSeoPathway[];
  es: ProductSeoPathway[];
}

const productSeoPathways: Record<string, ProductSeoPathwaySet> = {
  "baby-gear": {
    en: [
      {
        eyebrow: "Complete setup",
        title: "Baby Arrival Kit",
        description: "Plan the essential equipment for the first days of your Valencia stay.",
        href: "/valencia/kits/baby-arrival-kit",
      },
      {
        eyebrow: "Local guide",
        title: "Valencia with Kids",
        description: "Practical advice for accommodation, transport and family days out.",
        href: "/blog/valencia-with-kids-complete-guide",
      },
    ],
    es: [
      {
        eyebrow: "Kit completo",
        title: "Kit de llegada con bebé",
        description: "Organiza el equipamiento esencial para los primeros días en Valencia.",
        href: "/es/valencia/kits/baby-arrival-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Valencia con niños",
        description: "Consejos prácticos sobre alojamiento, transporte y planes familiares.",
        href: "/es/blog/valencia-with-kids-complete-guide",
      },
    ],
  },
  "kids-family": {
    en: [
      {
        eyebrow: "Family setup",
        title: "Toddler City Kit",
        description: "Combine practical equipment for exploring Valencia with a young child.",
        href: "/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Local guide",
        title: "Valencia with Kids",
        description: "Plan child-friendly neighbourhoods, activities and easier travel days.",
        href: "/blog/valencia-with-kids-complete-guide",
      },
    ],
    es: [
      {
        eyebrow: "Kit familiar",
        title: "Kit urbano para niños pequeños",
        description: "Combina equipamiento práctico para recorrer Valencia con niños pequeños.",
        href: "/es/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Valencia con niños",
        description: "Organiza barrios, actividades y desplazamientos adaptados a la familia.",
        href: "/es/blog/valencia-with-kids-complete-guide",
      },
    ],
  },
  mobility: {
    en: [
      {
        eyebrow: "Accessibility setup",
        title: "Accessible Valencia Kit",
        description: "Combine mobility equipment for a more comfortable stay in Valencia.",
        href: "/valencia/kits/accessible-valencia-kit",
      },
      {
        eyebrow: "Local guide",
        title: "Wheelchair Accessibility in Valencia",
        description: "Review practical routes, transport and accessible places before your visit.",
        href: "/blog/wheelchair-accessibility-valencia",
      },
    ],
    es: [
      {
        eyebrow: "Kit accesible",
        title: "Kit para una Valencia accesible",
        description: "Combina ayudas de movilidad para una estancia más cómoda en Valencia.",
        href: "/es/valencia/kits/accessible-valencia-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Accesibilidad en silla de ruedas",
        description: "Consulta rutas, transporte y lugares accesibles antes de tu visita.",
        href: "/es/blog/wheelchair-accessibility-valencia",
      },
    ],
  },
  "remote-work": {
    en: [
      {
        eyebrow: "Workspace setup",
        title: "Remote Work Apartment Kit",
        description: "Build a comfortable temporary workstation in your Valencia accommodation.",
        href: "/valencia/kits/remote-work-apartment-kit",
      },
      {
        eyebrow: "Local guide",
        title: "Digital Nomad Guide to Valencia",
        description: "Plan neighbourhoods, connectivity and a productive longer stay.",
        href: "/blog/digital-nomad-guide-valencia",
      },
    ],
    es: [
      {
        eyebrow: "Kit de trabajo",
        title: "Kit de teletrabajo para apartamento",
        description: "Monta un espacio de trabajo cómodo en tu alojamiento de Valencia.",
        href: "/es/valencia/kits/remote-work-apartment-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Guía de Valencia para nómadas digitales",
        description: "Planifica barrio, conectividad y una estancia larga más productiva.",
        href: "/es/blog/digital-nomad-guide-valencia",
      },
    ],
  },
  "home-living": {
    en: [
      {
        eyebrow: "Apartment setup",
        title: "Summer Apartment Survival Kit",
        description: "Combine cooling and comfort equipment for Valencia's warmer months.",
        href: "/valencia/kits/summer-apartment-survival-kit",
      },
      {
        eyebrow: "Practical guide",
        title: "Valencia Summer Survival Guide",
        description: "Understand the heat and choose practical ways to stay comfortable.",
        href: "/blog/valencia-summer-survival-guide",
      },
    ],
    es: [
      {
        eyebrow: "Kit de apartamento",
        title: "Kit para el verano en Valencia",
        description: "Combina refrigeración y confort para los meses más cálidos.",
        href: "/es/valencia/kits/summer-apartment-survival-kit",
      },
      {
        eyebrow: "Guía práctica",
        title: "Guía para el verano en Valencia",
        description: "Entiende el calor y elige soluciones prácticas para estar cómodo.",
        href: "/es/blog/valencia-summer-survival-guide",
      },
    ],
  },
  "travel-outdoors": {
    en: [
      {
        eyebrow: "Beach setup",
        title: "Family Beach Kit",
        description: "Combine shade, seating and family essentials for an easier beach day.",
        href: "/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Local beach guide",
        title: "Malvarrosa Beach",
        description: "Plan access, facilities and the equipment that suits this Valencia beach.",
        href: "/discover/malvarrosa-beach",
      },
    ],
    es: [
      {
        eyebrow: "Kit de playa",
        title: "Kit de playa familiar",
        description: "Combina sombra, asientos y básicos familiares para un día más fácil.",
        href: "/es/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Playas familiares de Valencia",
        description: "Compara acceso, servicios y logística familiar en las principales playas de Valencia.",
        href: "/es/blog/best-beaches-valencia-families",
      },
    ],
  },
};

export function getProductSeoPathways(categorySlug: string, locale: "en" | "es") {
  return productSeoPathways[categorySlug]?.[locale] || [];
}
