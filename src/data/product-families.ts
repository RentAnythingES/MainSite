export type ProductFamilyLocale = "en" | "es";

type FamilyChoice = {
  title: string;
  description: string;
};

type FamilyLink = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

export type ProductFamilyContent = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  productHeading: string;
  productDescription: string;
  productLabels: Record<string, string>;
  choiceHeading: string;
  choiceIntro: string;
  choices: FamilyChoice[];
  checklistHeading: string;
  checklistIntro: string;
  checklist: string[];
  localHeading: string;
  localParagraphs: string[];
  linksHeading: string;
  linksIntro: string;
  links: FamilyLink[];
  faqHeading: string;
  faqs: Array<{ question: string; answer: string }>;
  productAction: string;
  priceFrom: string;
  priceUnit: string;
};

export type ProductFamilyDefinition = {
  slug: string;
  categorySlug: string;
  productSlugs: string[];
  published: boolean;
  content: Record<ProductFamilyLocale, ProductFamilyContent>;
};

export const productFamilies: ProductFamilyDefinition[] = [
  {
    slug: "mobility-scooters",
    categorySlug: "mobility",
    productSlugs: [
      "mobility-scooter-lightweight-foldable",
      "mobility-scooter-standard",
      "heavy-duty-mobility-scooter",
    ],
    published: true,
    content: {
      en: {
        title: "Mobility Scooter Rental in Valencia | Rent&Roll",
        description: "Compare foldable, standard and higher-capacity mobility scooters in Valencia. Check access, transport and dates before booking.",
        eyebrow: "Mobility scooter rental in Valencia",
        intro: "Choose around the routes you plan to use, access at your accommodation, overnight storage and whether the scooter needs to travel in a vehicle. The individual product pages show current pricing, date availability, exact limits and handover requirements.",
        productHeading: "Compare mobility scooter options",
        productDescription: "Start with the option that matches your transport, access and route needs, then use the individual listing to check exact details and dates.",
        productLabels: {
          "mobility-scooter-lightweight-foldable": "Foldable mobility scooter",
          "mobility-scooter-standard": "Standard mobility scooter",
          "heavy-duty-mobility-scooter": "XL mobility scooter",
        },
        choiceHeading: "How to choose a mobility scooter",
        choiceIntro: "The most useful distinction is not a marketing label. It is how the scooter must fit into your stay.",
        choices: [
          {
            title: "When storage or vehicle transport matters",
            description: "Start with a foldable or separable scooter. Confirm the vehicle opening, available boot space, component weights and who can lift them safely before relying on car transport.",
          },
          {
            title: "For everyday paved routes",
            description: "A standard scooter balances comfort, stability and turning space for step-free urban routes, parks and promenades. Check the narrowest doorway, lift and overnight charging point.",
          },
          {
            title: "When more seat support or capacity is needed",
            description: "A larger scooter may offer more support and capacity, but it requires more space for delivery, turning and storage and is not normally a practical car-transport option.",
          },
        ],
        checklistHeading: "What to confirm before booking",
        checklistIntro: "You do not need to know every detail before browsing. These are the points that can change which scooter is suitable.",
        checklist: [
          "The rider's measurements and the maximum user weight shown on the exact listing.",
          "Any steps, narrow doors, lift dimensions or tight turns at the accommodation.",
          "Whether the scooter must fit into a car and who will handle its separated parts.",
          "The planned surfaces, gradients and approximate daily distance; advertised range is never a guaranteed journey distance.",
          "A dry, secure overnight storage space with access to a suitable charging point.",
        ],
        localHeading: "Using a mobility scooter in Valencia",
        localParagraphs: [
          "Broad pavements, the Turia Gardens and seafront promenades can suit mobility scooters, but access and surface quality vary by route, building and destination. Plan step-free connections and check current venue or transport information rather than assuming every part of the city is accessible.",
          "Mobility scooters are for suitable paved routes. They should not be used on beach sand, steps, high kerbs, flooded surfaces or badly broken ground. If your route or accommodation is unclear, contact us before payment so the relevant constraints can be checked against the exact unit.",
        ],
        linksHeading: "Plan the rest of the stay",
        linksIntro: "Use the broader mobility collection for wheelchairs and walking aids, or continue with practical accessibility planning for Valencia.",
        links: [
          {
            eyebrow: "Mobility collection",
            title: "Compare mobility equipment",
            description: "Browse wheelchairs, scooters, rollators and other currently available mobility support.",
            href: "/rental/mobility",
          },
          {
            eyebrow: "Accessibility kit",
            title: "Configure an Accessible Valencia Kit",
            description: "Request a combination of mobility and daily-living equipment for the same stay.",
            href: "/valencia/kits/accessible-valencia-kit",
          },
          {
            eyebrow: "Valencia guide",
            title: "Plan wheelchair-accessible Valencia",
            description: "Review transport, attractions, beaches and route-planning considerations before arrival.",
            href: "/blog/wheelchair-accessibility-valencia",
          },
        ],
        faqHeading: "Mobility scooter rental: common questions",
        faqs: [
          { question: "Which mobility scooter should I rent?", answer: "Choose according to rider fit, access, storage, transport and the planned route. A foldable scooter prioritises easier storage or vehicle transport, a standard scooter balances everyday comfort and manoeuvrability, and an XL scooter needs more space but may suit higher-capacity requirements. Check the exact listing before booking." },
          { question: "Can a mobility scooter be delivered to my accommodation?", answer: "Available delivery and pickup options are shown during booking. If the building has steps, a small lift, narrow doors or limited storage, share those details before payment so access can be checked against the exact scooter." },
          { question: "Can I transport a mobility scooter in a car?", answer: "Only some scooters separate or fold for vehicle transport, and lightweight is relative. The vehicle opening, boot space, component weights and safe lifting arrangements must all be checked. Larger scooters normally require direct delivery and collection." },
          { question: "Is the advertised battery range guaranteed?", answer: "No. Published range is an upper estimate. Rider weight, gradients, surfaces, temperature, battery condition and driving style can reduce the real distance, so route plans should include a sensible margin." },
          { question: "Can I use a mobility scooter on Valencia's beaches?", answer: "A scooter may use suitable paved seafront promenades, but it must not be driven on beach sand or through salt water. Check current accessible-beach services separately if you need support reaching the water." },
        ],
        productAction: "View scooter and check dates",
        priceFrom: "From",
        priceUnit: "/ day",
      },
      es: {
        title: "Alquiler de Scooters de Movilidad en Valencia | Rent&Roll",
        description: "Compara scooters de movilidad plegables, estándar y de mayor capacidad en Valencia. Revisa accesos, transporte y fechas antes de reservar.",
        eyebrow: "Alquiler de scooters de movilidad en Valencia",
        intro: "Elige según las rutas previstas, el acceso al alojamiento, el almacenamiento nocturno y si necesitas transportar el scooter en un vehículo. Cada ficha individual muestra el precio actual, la disponibilidad por fechas, los límites exactos y las condiciones de entrega.",
        productHeading: "Compara opciones de scooters de movilidad",
        productDescription: "Empieza por la opción que encaje con tus necesidades de transporte, acceso y recorrido y consulta después la ficha individual para comprobar los detalles y las fechas.",
        productLabels: {
          "mobility-scooter-lightweight-foldable": "Scooter de movilidad plegable",
          "mobility-scooter-standard": "Scooter de movilidad estándar",
          "heavy-duty-mobility-scooter": "Scooter de movilidad XL",
        },
        choiceHeading: "Cómo elegir un scooter de movilidad",
        choiceIntro: "La diferencia más útil no es una etiqueta comercial, sino cómo debe encajar el scooter en tu estancia.",
        choices: [
          {
            title: "Si importan el almacenamiento o el transporte en coche",
            description: "Empieza por un scooter plegable o desmontable. Confirma la abertura y el espacio del maletero, el peso de las piezas y quién puede levantarlas con seguridad.",
          },
          {
            title: "Para recorridos diarios pavimentados",
            description: "Un scooter estándar equilibra comodidad, estabilidad y espacio de giro en rutas urbanas sin escalones, parques y paseos. Comprueba puertas, ascensor y punto de carga nocturno.",
          },
          {
            title: "Si necesitas más apoyo de asiento o capacidad",
            description: "Un scooter mayor puede aportar más apoyo y capacidad, pero necesita más espacio para la entrega, el giro y el almacenamiento y normalmente no es práctico para transportarlo en coche.",
          },
        ],
        checklistHeading: "Qué conviene confirmar antes de reservar",
        checklistIntro: "No necesitas tener todos los datos para empezar a comparar. Estos son los puntos que pueden cambiar la opción adecuada.",
        checklist: [
          "Las medidas del usuario y el peso máximo indicado en la ficha exacta.",
          "Escalones, puertas estrechas, medidas del ascensor o giros ajustados en el alojamiento.",
          "Si debe transportarse en coche y quién manipulará las piezas separadas.",
          "El firme, las pendientes y la distancia diaria aproximada; la autonomía anunciada no garantiza un recorrido real.",
          "Un lugar seco y seguro para guardarlo por la noche, con acceso a un punto de carga adecuado.",
        ],
        localHeading: "Usar un scooter de movilidad en Valencia",
        localParagraphs: [
          "Las aceras amplias, el Jardín del Turia y los paseos marítimos pueden ser adecuados, pero el acceso y el firme cambian según la ruta, el edificio y el destino. Planifica conexiones sin escalones y comprueba la información actual del transporte o del lugar que vas a visitar.",
          "Los scooters de movilidad deben utilizarse en rutas pavimentadas adecuadas. No deben circular sobre arena, escalones, bordillos altos, zonas inundadas ni terreno muy deteriorado. Si tienes dudas sobre el recorrido o el acceso, escríbenos antes del pago para comprobarlo con la unidad exacta.",
        ],
        linksHeading: "Planifica el resto de la estancia",
        linksIntro: "Consulta la colección completa para ver sillas de ruedas y andadores o continúa con la planificación práctica de la accesibilidad en Valencia.",
        links: [
          {
            eyebrow: "Colección de movilidad",
            title: "Comparar equipos de movilidad",
            description: "Consulta sillas de ruedas, scooters, andadores y otras ayudas disponibles actualmente.",
            href: "/es/rental/mobility",
          },
          {
            eyebrow: "Kit de accesibilidad",
            title: "Configura un kit para una Valencia accesible",
            description: "Solicita una combinación de movilidad y ayudas para la vida diaria durante la misma estancia.",
            href: "/es/valencia/kits/accessible-valencia-kit",
          },
          {
            eyebrow: "Guía de Valencia",
            title: "Planifica una Valencia accesible",
            description: "Revisa el transporte, las atracciones, las playas y la planificación de rutas antes de llegar.",
            href: "/es/blog/wheelchair-accessibility-valencia",
          },
        ],
        faqHeading: "Preguntas sobre el alquiler de scooters de movilidad",
        faqs: [
          { question: "¿Qué scooter de movilidad debo alquilar?", answer: "Elige según el ajuste del usuario, los accesos, el almacenamiento, el transporte y la ruta prevista. Un scooter plegable facilita el almacenamiento o el transporte, uno estándar equilibra comodidad y maniobrabilidad y uno XL necesita más espacio, pero puede responder a necesidades de mayor capacidad. Revisa siempre la ficha exacta." },
          { question: "¿Podéis entregar el scooter en mi alojamiento?", answer: "La reserva muestra las opciones de entrega y recogida disponibles. Si hay escalones, ascensor pequeño, puertas estrechas o poco espacio para guardarlo, comparte esos datos antes del pago para comprobar el acceso con la unidad exacta." },
          { question: "¿Puedo transportar un scooter de movilidad en coche?", answer: "Solo algunos scooters se separan o se pliegan, y ligero es un término relativo. Hay que comprobar la abertura y el espacio del maletero, el peso de las piezas y cómo se levantarán con seguridad. Los scooters mayores suelen requerir entrega y recogida directa." },
          { question: "¿Está garantizada la autonomía anunciada?", answer: "No. La autonomía publicada es una estimación máxima. El peso, las pendientes, el firme, la temperatura, el estado de la batería y la conducción pueden reducir la distancia real, por lo que conviene dejar un margen razonable." },
          { question: "¿Puedo usar un scooter en las playas de Valencia?", answer: "Puede utilizar paseos marítimos pavimentados adecuados, pero no debe circular por la arena ni entrar en agua salada. Consulta por separado los servicios actuales de playa accesible si necesitas apoyo para llegar al agua." },
        ],
        productAction: "Ver scooter y comprobar fechas",
        priceFrom: "Desde",
        priceUnit: "/ día",
      },
    },
  },
];

export function getProductFamily(categorySlug: string, familySlug: string) {
  return productFamilies.find(
    (family) => family.published && family.categorySlug === categorySlug && family.slug === familySlug,
  );
}

export function getProductFamilyForProduct(productSlug: string) {
  return productFamilies.find(
    (family) => family.published && family.productSlugs.includes(productSlug),
  );
}
