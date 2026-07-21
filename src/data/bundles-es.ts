import { rentalBundles, type BundleAddon, type BundleFAQ, type BundleItem, type RentalBundle } from "./bundles";

type LocalizedItem = { name: string; note?: string };
type SpanishBundleContent = Pick<RentalBundle, "name" | "shortName" | "eyebrow" | "tagline" | "description" | "bestFor" | "seo"> & {
  includedItems: LocalizedItem[];
  addons: LocalizedItem[];
  faqs: BundleFAQ[];
};

const content: Record<string, SpanishBundleContent> = {
  "family-beach-kit": {
    name: "Kit de playa familiar en Valencia",
    shortName: "Kit de playa familiar",
    eyebrow: "Playa y aire libre",
    tagline: "Sombra, bebidas frías, juegos y una forma cómoda de llevarlo todo.",
    description: "Un punto de partida práctico para días de playa con niños en Malvarrosa, Patacona, Cabanyal o El Saler. Reúne los artículos voluminosos y permite añadir extras según las edades, las fechas y el alojamiento.",
    bestFor: ["Días de playa con niños", "Estancias en Malvarrosa o Patacona", "Familias sin coche", "Viajes en julio y agosto"],
    includedItems: [
      { name: "Carrito o carro de playa", note: "Para toallas, sombra, juguetes y bebidas" },
      { name: "Sombrilla o refugio de playa" },
      { name: "Bolsa o nevera portátil" },
      { name: "Sillas o esterilla de playa" },
      { name: "Juguetes de arena", note: "Set inicial adecuado para la edad" },
      { name: "Funda impermeable", note: "Para móvil, llaves y objetos pequeños" },
    ],
    addons: [
      { name: "Cochecito compacto", note: "Útil para volver cuando los niños están cansados" },
      { name: "Set de sombrilla", note: "Sombra adicional para familias grandes" },
      { name: "Ventilador portátil", note: "Para siestas, terrazas y apartamentos calurosos" },
      { name: "Pack de juguetes", note: "Para los ratos tranquilos en el alojamiento" },
    ],
    seo: {
      title: "Alquiler de kit de playa familiar en Valencia",
      description: "Alquila un kit de playa familiar en Valencia con carro, sombra, nevera, sillas, juguetes y extras adaptados a tu estancia.",
      keywords: ["alquiler kit playa Valencia", "alquiler material playa Valencia", "carrito playa alquiler Valencia"],
    },
    faqs: [
      { question: "¿Podéis entregar el kit antes del día de playa?", answer: "Sí. Confirmamos el horario, la zona y la combinación disponible antes de cerrar la solicitud. La entrega y la recogida se presupuestan según el alojamiento." },
      { question: "¿Podemos personalizar el kit?", answer: "Sí. Puedes quitar artículos y añadir opciones para bebés, niños, sombra o refrigeración. Confirmamos sustituciones y stock antes de cobrar." },
    ],
  },
  "baby-arrival-kit": {
    name: "Kit de llegada con bebé en Valencia",
    shortName: "Kit de llegada con bebé",
    eyebrow: "Bebés y primera infancia",
    tagline: "El equipamiento básico preparado en el alojamiento para vuestra llegada.",
    description: "Un kit inicial para familias que llegan a Valencia con bebés o niños pequeños. Organiza sueño, comidas, paseo, baño y comodidad sin obligarte a viajar con todos los artículos voluminosos.",
    bestFor: ["Bebés y niños pequeños", "Hoteles y apartamentos", "Estancias de una a cuatro semanas", "Familias que quieren viajar con menos equipaje"],
    includedItems: [
      { name: "Cuna de viaje", note: "Con sábana ajustable cuando esté disponible" },
      { name: "Trona" },
      { name: "Cochecito compacto" },
      { name: "Bañera para bebé" },
      { name: "Alfombra de juegos" },
      { name: "Vigilabebés", note: "Sujeto a stock y distribución del alojamiento" },
    ],
    addons: [
      { name: "Cochecito doble", note: "Para gemelos o hermanos" },
      { name: "Silla de coche para bebé", note: "Requiere confirmar cuidadosamente modelo, ajuste y uso" },
      { name: "Persiana o cortina opaca", note: "Útil para las siestas en habitaciones luminosas" },
      { name: "Portabebés", note: "Práctico para trayectos cortos y calles estrechas" },
    ],
    seo: {
      title: "Alquiler de kit para bebé en Valencia",
      description: "Alquila un kit para bebé en Valencia con cuna, trona, cochecito, bañera, zona de juego y extras adaptados a tu alojamiento.",
      keywords: ["alquiler equipamiento bebé Valencia", "kit bebé Valencia", "alquiler cuna viaje Valencia"],
    },
    faqs: [
      { question: "¿Sirve para viajar sin llevar todo el equipamiento del bebé?", answer: "Está pensado para sustituir parte del equipaje más voluminoso. La selección final depende de la edad, el alojamiento y el inventario confirmado." },
      { question: "¿Podemos quitar artículos que no necesitamos?", answer: "Sí. La solicitud permite seleccionar solo lo necesario y añadir extras. Revisamos cada combinación antes de confirmar disponibilidad y precio." },
    ],
  },
  "toddler-city-kit": {
    name: "Kit urbano para niños pequeños en Valencia",
    shortName: "Kit urbano infantil",
    eyebrow: "Niños y familia",
    tagline: "Para parques, paseos marítimos, el Jardín del Turia y piernas cansadas.",
    description: "Un kit urbano para recorrer Valencia con niños pequeños. Combina una opción de paseo, movimiento, casco, tentempiés y pequeños momentos de juego según la edad y el inventario disponible.",
    bestFor: ["Niños pequeños", "Días en el Jardín del Turia", "Paseos urbanos largos", "Familias cerca del centro o la playa"],
    includedItems: [
      { name: "Cochecito compacto" },
      { name: "Patinete o bicicleta de equilibrio", note: "Según la edad y el stock" },
      { name: "Casco" },
      { name: "Bandeja o accesorio de viaje" },
      { name: "Pack de juguetes" },
      { name: "Opción de juguetes de playa" },
    ],
    addons: [
      { name: "Set de sombrilla", note: "Para días de playa" },
      { name: "Cuna de viaje", note: "Si la estancia también necesita equipamiento para dormir" },
      { name: "Cochecito doble", note: "Para hermanos" },
    ],
    seo: {
      title: "Alquiler de kit infantil urbano en Valencia",
      description: "Alquila equipamiento infantil en Valencia con cochecito, patinete o bicicleta, casco, juguetes y extras para playa o alojamiento.",
      keywords: ["Valencia con niños pequeños", "alquiler patinete niño Valencia", "alquiler cochecito Valencia"],
    },
    faqs: [
      { question: "¿En qué se diferencia del kit de llegada con bebé?", answer: "El kit de bebé se centra en sueño y cuidados. El kit urbano se centra en desplazamientos, juego y jornadas fuera del alojamiento con niños algo mayores." },
    ],
  },
  "remote-work-apartment-kit": {
    name: "Kit de teletrabajo para apartamentos en Valencia",
    shortName: "Kit de teletrabajo",
    eyebrow: "Teletrabajo",
    tagline: "Convierte un alojamiento temporal en un espacio de trabajo de verdad.",
    description: "Una configuración práctica para nómadas digitales, profesionales y parejas que trabajan desde apartamentos de Valencia durante más de unos días.",
    bestFor: ["Nómadas digitales", "Profesionales en estancias largas", "Parejas que teletrabajan", "Apartamentos sin escritorio adecuado"],
    includedItems: [
      { name: "Monitor externo", note: "De 27 pulgadas cuando esté disponible" },
      { name: "Soporte para portátil" },
      { name: "Teclado y ratón" },
      { name: "Hub USB-C o kit de cables" },
      { name: "Silla ergonómica", note: "Opcional según el alojamiento y la entrega" },
    ],
    addons: [
      { name: "Escritorio elevable", note: "Para estancias más largas" },
      { name: "Segundo monitor", note: "Para configuraciones de trabajo intensivo" },
      { name: "Cámara o iluminación", note: "Para videollamadas y creación de contenido" },
    ],
    seo: {
      title: "Alquiler de equipo de teletrabajo en Valencia",
      description: "Alquila un kit de teletrabajo en Valencia con monitor, soporte, teclado, ratón, cables y silla ergonómica opcional.",
      keywords: ["alquiler equipo teletrabajo Valencia", "alquiler monitor Valencia", "equipo nómada digital Valencia"],
    },
    faqs: [
      { question: "¿Puede sustituir a un coworking?", answer: "Para algunas estancias sí; para otras lo complementa. El objetivo es disponer de una base cómoda para llamadas y trabajo concentrado en el apartamento." },
    ],
  },
  "summer-apartment-survival-kit": {
    name: "Kit de verano para apartamentos en Valencia",
    shortName: "Kit de verano",
    eyebrow: "Comodidad en el apartamento",
    tagline: "Refrigeración y comodidad para apartamentos calurosos en Valencia.",
    description: "Un kit estacional para julio, agosto y episodios de calor cuando el alojamiento tiene climatización limitada, dormitorios luminosos o poca circulación de aire.",
    bestFor: ["Estancias en julio y agosto", "Apartamentos con climatización limitada", "Familias con siestas", "Huéspedes de larga estancia"],
    includedItems: [
      { name: "Aire acondicionado portátil o ventilador", note: "Elegido según la habitación y el stock" },
      { name: "Persiana o cortina opaca", note: "Útil para dormitorios y siestas" },
      { name: "Purificador de aire", note: "Útil durante periodos de polvo o alergias" },
      { name: "Opción de nevera o sombra de playa" },
    ],
    addons: [
      { name: "Aire acondicionado portátil", note: "Para habitaciones con una salida adecuada al exterior" },
      { name: "Purificador de aire", note: "Para mejorar la calidad del aire" },
      { name: "Set de sombrilla", note: "Para disponer de sombra fuera del apartamento" },
    ],
    seo: {
      title: "Alquiler de climatización portátil en Valencia",
      description: "Alquila aire acondicionado portátil, ventiladores, soluciones opacas, purificadores y sombra para una estancia de verano en Valencia.",
      keywords: ["alquiler aire acondicionado Valencia", "apartamento verano Valencia", "alquiler ventilador Valencia"],
    },
    faqs: [
      { question: "¿Todos los apartamentos pueden usar aire acondicionado portátil?", answer: "No. Necesita evacuar aire caliente por una ventana o puerta exterior. Comprobamos la habitación antes de incluirlo en la propuesta." },
    ],
  },
  "accessible-valencia-kit": {
    name: "Kit de accesibilidad para Valencia",
    shortName: "Kit Valencia accesible",
    eyebrow: "Movilidad y accesibilidad",
    tagline: "Apoyo de movilidad para disfrutar jornadas más largas en Valencia.",
    description: "Un punto de partida cuidadoso para visitantes que necesitan apoyo en el Jardín del Turia, la Ciudad de las Artes y las Ciencias, paseos marítimos o alojamientos accesibles.",
    bestFor: ["Movilidad reducida", "Viajeros mayores", "Turismo accesible", "Jornadas con muchos desplazamientos"],
    includedItems: [
      { name: "Silla de ruedas o andador", note: "Seleccionado según las necesidades del usuario" },
      { name: "Silla de ducha" },
      { name: "Elevador de inodoro", note: "Cuando sea adecuado" },
      { name: "Opción de scooter de movilidad", note: "Requiere confirmar ajuste, batería, acceso y entrega" },
    ],
    addons: [
      { name: "Silla de ruedas ligera de transporte", note: "Para apoyo fiable con acompañante" },
      { name: "Scooter de movilidad", note: "Para distancias más largas" },
      { name: "Rampa portátil", note: "Solo cuando se confirmen medidas y seguridad" },
    ],
    seo: {
      title: "Alquiler de ayudas de movilidad en Valencia",
      description: "Alquila ayudas de movilidad en Valencia con silla de ruedas, andador, silla de ducha, elevador y opción de scooter confirmada.",
      keywords: ["alquiler silla ruedas Valencia", "alquiler scooter movilidad Valencia", "Valencia accesible"],
    },
    faqs: [
      { question: "¿Los artículos de movilidad requieren confirmación adicional?", answer: "Sí. Revisamos ajuste, capacidad, acceso al alojamiento, batería, ruta prevista, entrega y uso seguro antes de confirmar." },
    ],
  },
  "grandparents-visiting-kit": {
    name: "Kit para visitas de abuelos en Valencia",
    shortName: "Kit para visitas de abuelos",
    eyebrow: "Movilidad y accesibilidad",
    tagline: "Comodidad, movilidad y apoyo frente al calor para visitantes mayores.",
    description: "Un kit de apoyo para familias que reciben a padres o abuelos en Valencia. Combina movilidad ligera, seguridad en el baño, refrigeración y comodidad para facilitar los días fuera y el descanso en casa.",
    bestFor: ["Visitantes mayores", "Viajes familiares multigeneracionales", "Estancias de verano", "Jornadas turísticas largas"],
    includedItems: [
      { name: "Andador o silla de ruedas", note: "Seleccionado según las necesidades del visitante" },
      { name: "Silla de ducha" },
      { name: "Opción de elevador de inodoro" },
      { name: "Ventilador o apoyo de refrigeración", note: "Especialmente útil en julio y agosto" },
      { name: "Extras de comodidad", note: "Según el alojamiento y la duración" },
    ],
    addons: [
      { name: "Andador con ruedas", note: "Para caminar con más estabilidad" },
      { name: "Silla de ruedas ligera de transporte", note: "Para jornadas largas con acompañante" },
      { name: "Aire acondicionado portátil", note: "Para dormitorios calurosos con instalación adecuada" },
      { name: "Scooter de movilidad", note: "Para distancias largas tras confirmar la idoneidad" },
    ],
    seo: {
      title: "Alquiler de apoyo para mayores en Valencia",
      description: "Alquila movilidad, seguridad de baño, refrigeración y comodidad para padres, abuelos o visitantes mayores en Valencia.",
      keywords: ["Valencia con abuelos", "viajes mayores Valencia", "alquiler ayudas movilidad Valencia"],
    },
    faqs: [
      { question: "¿Es solo para personas con necesidades de movilidad importantes?", answer: "No. También ayuda a visitantes que caminan de forma autónoma pero agradecen estabilidad, refrigeración o apoyo de reserva durante jornadas largas." },
    ],
  },
  "long-stay-kitchen-upgrade-kit": {
    name: "Kit de cocina para estancias largas en Valencia",
    shortName: "Kit de mejora de cocina",
    eyebrow: "Comodidad en el apartamento",
    tagline: "Haz que un apartamento temporal resulte más fácil para vivir de verdad.",
    description: "Un kit para familias, profesionales y huéspedes de larga estancia con cocinas poco equipadas. Parte de mejoras prácticas de cocina y comedor y se adapta a lo que realmente falta en el alojamiento.",
    bestFor: ["Apartamentos de larga estancia", "Familias que cocinan en casa", "Profesionales que teletrabajan", "Alojamientos con equipamiento mínimo"],
    includedItems: [
      { name: "Opción de freidora de aire o multicocina", note: "Validamos la demanda antes de ampliar stock" },
      { name: "Opción de batidora o cafetera" },
      { name: "Vajilla infantil" },
      { name: "Lista de básicos de cocina", note: "Confirmada según lo que falte en el apartamento" },
    ],
    addons: [
      { name: "Purificador de aire", note: "Para la calidad del aire del apartamento" },
      { name: "Aire acondicionado portátil", note: "Para cocina o salón cuando la instalación lo permita" },
      { name: "Trona", note: "Para estancias familiares largas" },
    ],
    seo: {
      title: "Alquiler de equipamiento de cocina en Valencia",
      description: "Alquila mejoras prácticas de cocina y comodidad en Valencia para apartamentos, familias, teletrabajo y estancias largas.",
      keywords: ["alquiler equipamiento cocina Valencia", "apartamento larga estancia Valencia", "equipamiento Airbnb Valencia"],
    },
    faqs: [
      { question: "¿Estarán disponibles todos los artículos desde el primer día?", answer: "No necesariamente. Esta página también nos ayuda a detectar demanda antes de comprar inventario muy específico. Confirmamos cada solicitud y sus alternativas." },
    ],
  },
};

function localizeItems(base: BundleItem[], localized: LocalizedItem[]): BundleItem[] {
  if (base.length !== localized.length) throw new Error("Spanish bundle item count does not match the canonical bundle");
  return localized.map((item, index) => ({ ...base[index], ...item, requestName: base[index].name }));
}

function localizeAddons(base: BundleAddon[], localized: LocalizedItem[]): BundleAddon[] {
  if (base.length !== localized.length) throw new Error("Spanish bundle add-on count does not match the canonical bundle");
  return localized.map((item, index) => ({ ...base[index], ...item, requestName: base[index].name }));
}

export const spanishRentalBundles: RentalBundle[] = rentalBundles.map((bundle) => {
  const localized = content[bundle.slug];
  if (!localized) throw new Error(`Missing Spanish bundle content for ${bundle.slug}`);
  return {
    ...bundle,
    ...localized,
    includedItems: localizeItems(bundle.includedItems, localized.includedItems),
    addons: localizeAddons(bundle.addons, localized.addons),
  };
});

export function getSpanishBundleBySlug(slug: string): RentalBundle | undefined {
  return spanishRentalBundles.find((bundle) => bundle.slug === slug);
}
