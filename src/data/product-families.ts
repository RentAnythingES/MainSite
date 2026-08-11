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
  categoryLabel: string;
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
        categoryLabel: "Mobility & Accessibility",
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
        categoryLabel: "Movilidad y accesibilidad",
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
  {
    slug: "strollers",
    categorySlug: "baby-gear",
    productSlugs: [
      "stroller-travel-compact",
      "stroller-all-terrain",
      "stroller-double",
    ],
    published: true,
    content: {
      en: {
        categoryLabel: "Baby & Toddler",
        title: "Stroller Rental in Valencia | Rent&Roll",
        description: "Compare travel, all-terrain and double stroller options for a Valencia stay. Check child limits, folded size, access and dates before booking.",
        eyebrow: "Stroller rental in Valencia",
        intro: "Arrange a stroller before you arrive, then choose around your child's needs, the routes you expect to use, transport between places and access at your accommodation. Individual product pages show current prices, date availability, exact limits and included accessories.",
        productHeading: "Compare stroller options",
        productDescription: "Start with the type of journey you need to make, then check the exact product page for child limits, dimensions, included parts and dates.",
        productLabels: {
          "stroller-travel-compact": "Compact travel stroller",
          "stroller-all-terrain": "All-terrain stroller",
          "stroller-double": "Double stroller",
        },
        choiceHeading: "How to choose a stroller for Valencia",
        choiceIntro: "The best choice depends less on a product label than on how the stroller must work during your stay.",
        choices: [
          {
            title: "For taxis, trains and limited storage",
            description: "Prioritise folded dimensions, product weight and a manageable folding method. Compact does not automatically mean airline cabin approved, so check the exact measurements with your carrier.",
          },
          {
            title: "For longer walks and uneven paved routes",
            description: "Look at wheel format, recline, handle position and the surfaces allowed by the manufacturer. All-terrain does not mean suitable for running, stairs, beach sand or every rough surface.",
          },
          {
            title: "For twins or two young children",
            description: "Compare the limit for each seat as well as the stroller's total width, folded size and turning space. Check lifts, entrance doors and storage at the accommodation before booking.",
          },
        ],
        checklistHeading: "What to confirm before booking",
        checklistIntro: "These details determine whether a stroller fits the child, the accommodation and the journeys planned for the stay.",
        checklist: [
          "Each child's age, weight and any product-specific seating guidance shown on the exact listing.",
          "Whether newborn use is explicitly supported and which recline position or approved accessory it requires.",
          "The narrowest door, lift, staircase or storage area at the accommodation.",
          "Whether the stroller must fit into a taxi, car boot, train luggage area or airline baggage allowance.",
          "The planned surfaces and distances, plus every accessory that must be included in the booking.",
        ],
        localHeading: "Using a stroller around Valencia",
        localParagraphs: [
          "Many routes through the Turia Gardens and along paved seafront promenades offer generous space, while parts of the historic centre can have narrow pavements, kerbs or uneven surfaces. Access still varies by route, building, transport service and venue, so plan the specific journeys that matter for your stay.",
          "Use strollers only on surfaces allowed for the exact product. Paved promenades are different from beach sand, and an all-terrain description is not permission to use stairs, unsafe ground or a stroller for running. If access or transport is uncertain, share the details before payment.",
        ],
        linksHeading: "Plan the rest of your family stay",
        linksIntro: "Return to the complete baby-equipment collection, combine several needs in one kit or use the family guide to plan before arrival.",
        links: [
          {
            eyebrow: "Baby equipment",
            title: "Browse all baby and toddler gear",
            description: "Compare sleep, feeding, bathing, travel and mobility equipment for the same Valencia stay.",
            href: "/rental/baby-gear",
          },
          {
            eyebrow: "Toddler city kit",
            title: "Configure a toddler city setup",
            description: "Combine practical outing, mobility and play equipment around your child's routine.",
            href: "/valencia/kits/toddler-city-kit",
          },
          {
            eyebrow: "Valencia guide",
            title: "Plan Valencia with babies and children",
            description: "Review neighbourhood, transport, activity and packing considerations before travelling.",
            href: "/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Stroller rental in Valencia: common questions",
        faqs: [
          { question: "Which stroller should I rent in Valencia?", answer: "Choose according to each child's limits, the routes planned, folded size, transport and accommodation access. A compact stroller prioritises storage and transfers, an all-terrain stroller supports suitable uneven paved routes, and a double stroller adds a second seat but needs more access and storage space." },
          { question: "Can I reserve a stroller before arriving in Valencia?", answer: "Yes. Select the product and dates to see current availability and the pickup or delivery options offered for the booking. Share accommodation access details before payment when they affect the handover." },
          { question: "Can a compact stroller travel as airline cabin baggage?", answer: "Do not assume so. Airline size and acceptance rules differ and can change. Compare the exact folded dimensions on the product page with the allowance confirmed directly by your airline." },
          { question: "Which stroller is suitable for a newborn?", answer: "Only choose a product whose exact listing and manufacturer guidance explicitly support the child's age and required seating or recline position. Do not infer newborn suitability from the family page alone." },
          { question: "Will a double stroller fit through my accommodation?", answer: "Measure the narrowest entrance, lift and storage area and compare them with the exact stroller width and folded dimensions. A general description cannot guarantee access to a particular building." },
        ],
        productAction: "View stroller and check dates",
        priceFrom: "From",
        priceUnit: "/ day",
      },
      es: {
        categoryLabel: "Bebés y niños pequeños",
        title: "Alquiler de Cochecitos en Valencia | Rent&Roll",
        description: "Compara sillas de paseo compactas, todoterreno y dobles para tu estancia en Valencia. Revisa límites, plegado, accesos y fechas antes de reservar.",
        eyebrow: "Alquiler de sillas de paseo y cochecitos en Valencia",
        intro: "Puedes organizar el cochecito antes de llegar y elegir según las necesidades del niño, los recorridos previstos, los desplazamientos y el acceso al alojamiento. Cada ficha muestra el precio actual, la disponibilidad por fechas, los límites exactos y los accesorios incluidos.",
        productHeading: "Compara opciones de sillas de paseo",
        productDescription: "Empieza por el tipo de desplazamiento y consulta después la ficha exacta para revisar límites infantiles, medidas, piezas incluidas y fechas.",
        productLabels: {
          "stroller-travel-compact": "Silla de paseo compacta de viaje",
          "stroller-all-terrain": "Silla de paseo todoterreno",
          "stroller-double": "Silla de paseo doble",
        },
        choiceHeading: "Cómo elegir una silla de paseo para Valencia",
        choiceIntro: "La elección depende menos de una etiqueta comercial que de cómo debe funcionar la silla durante la estancia.",
        choices: [
          {
            title: "Para taxis, trenes y poco espacio",
            description: "Prioriza las medidas plegada, el peso del producto y un sistema de plegado manejable. Que sea compacta no significa que la aerolínea la acepte en cabina; confirma las medidas exactas con la compañía.",
          },
          {
            title: "Para paseos largos y firme pavimentado irregular",
            description: "Revisa las ruedas, la reclinación, el manillar y los firmes permitidos por el fabricante. Todoterreno no significa apta para correr, subir escaleras, circular por arena ni pasar por cualquier superficie difícil.",
          },
          {
            title: "Para gemelos o dos niños pequeños",
            description: "Compara el límite de cada asiento, la anchura total, el tamaño plegada y el espacio de giro. Comprueba el ascensor, las puertas y el lugar donde se guardará en el alojamiento.",
          },
        ],
        checklistHeading: "Qué conviene confirmar antes de reservar",
        checklistIntro: "Estos datos determinan si la silla encaja con el niño, el alojamiento y los desplazamientos previstos.",
        checklist: [
          "La edad y el peso de cada niño, además de las indicaciones de asiento de la ficha exacta.",
          "Si el uso con recién nacidos está expresamente permitido y qué reclinación o accesorio aprobado requiere.",
          "La puerta, el ascensor, la escalera o el espacio de almacenamiento más ajustado del alojamiento.",
          "Si debe caber en un taxi, maletero, zona de equipaje del tren o franquicia de equipaje aéreo.",
          "Los firmes y distancias previstos, junto con todos los accesorios que deben figurar en la reserva.",
        ],
        localHeading: "Moverse por Valencia con una silla de paseo",
        localParagraphs: [
          "Muchos recorridos por el Jardín del Turia y los paseos marítimos pavimentados ofrecen bastante espacio, mientras que algunas zonas del centro histórico tienen aceras estrechas, bordillos o firme irregular. El acceso cambia según la ruta, el edificio, el transporte y el lugar visitado, por lo que conviene planificar los trayectos concretos.",
          "Utiliza la silla únicamente sobre los firmes permitidos para el producto exacto. Un paseo marítimo pavimentado no es lo mismo que la arena, y la descripción todoterreno no permite usar escaleras, terreno inseguro ni correr con la silla. Si tienes dudas sobre el acceso o el transporte, comparte los detalles antes del pago.",
        ],
        linksHeading: "Planifica el resto de la estancia en familia",
        linksIntro: "Vuelve a la colección completa, combina varias necesidades en un kit o utiliza la guía familiar para organizar el viaje antes de llegar.",
        links: [
          {
            eyebrow: "Material de bebé",
            title: "Consulta todo el equipamiento para bebés",
            description: "Compara descanso, alimentación, baño, viaje y movilidad para la misma estancia en Valencia.",
            href: "/es/rental/baby-gear",
          },
          {
            eyebrow: "Kit infantil para la ciudad",
            title: "Configura un conjunto para recorrer Valencia",
            description: "Combina paseo, movilidad y juego según la rutina del niño.",
            href: "/es/valencia/kits/toddler-city-kit",
          },
          {
            eyebrow: "Guía de Valencia",
            title: "Planifica Valencia con bebés y niños",
            description: "Revisa barrios, transporte, actividades y equipaje antes de viajar.",
            href: "/es/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Preguntas sobre el alquiler de cochecitos en Valencia",
        faqs: [
          { question: "¿Qué silla de paseo debería alquilar en Valencia?", answer: "Elige según los límites de cada niño, los recorridos, el tamaño plegada, el transporte y el acceso al alojamiento. Una silla compacta facilita el almacenamiento y los traslados, una todoterreno responde mejor en firmes pavimentados irregulares adecuados y una doble añade un segundo asiento, pero necesita más espacio." },
          { question: "¿Puedo reservar un cochecito antes de llegar a Valencia?", answer: "Sí. Selecciona el producto y las fechas para consultar la disponibilidad actual y las opciones de recogida o entrega ofrecidas. Comparte los datos de acceso antes del pago si afectan a la entrega." },
          { question: "¿Puedo llevar una silla compacta como equipaje de cabina?", answer: "No lo des por hecho. Las medidas y normas de aceptación dependen de la aerolínea y pueden cambiar. Compara las dimensiones plegada de la ficha con la franquicia confirmada directamente por tu compañía." },
          { question: "¿Qué silla de paseo es adecuada para un recién nacido?", answer: "Elige únicamente un producto cuya ficha exacta y las instrucciones del fabricante admitan expresamente la edad del niño y la posición o reclinación necesaria. No deduzcas la idoneidad para recién nacidos a partir de esta página general." },
          { question: "¿Cabrá una silla doble en mi alojamiento?", answer: "Mide la entrada, el ascensor y el espacio de almacenamiento más estrechos y compáralos con la anchura y las medidas plegada del producto exacto. Una descripción general no puede garantizar el acceso a un edificio concreto." },
        ],
        productAction: "Ver silla y comprobar fechas",
        priceFrom: "Desde",
        priceUnit: "/ día",
      },
    },
  },
  {
    slug: "car-seats",
    categorySlug: "baby-gear",
    productSlugs: [
      "maxi-cosi-pebble-360-pro2-infant-car-seat",
      "moni-serengeti-i-size-car-seat",
      "peg-perego-viaggio1-duo-fix-car-seat",
      "kinderkraft-i-spark-2-plus-i-size-car-seat",
      "seat-booster",
    ],
    published: true,
    content: {
      en: {
        categoryLabel: "Baby & Toddler",
        title: "Car Seat Rental in Valencia | Rent&Roll",
        description: "Rent a baby or child car seat in Valencia and arrange it before you travel. Compare current options, features, prices and availability.",
        eyebrow: "Car seat rental in Valencia",
        intro: "Travel with less luggage by arranging a car seat for your Valencia stay before you arrive. Compare the current options below, then check the individual listing for features, child-size guidance, prices and availability for your dates.",
        productHeading: "Compare car seat options",
        productDescription: "Choose the option that best matches your child and travel plans. Each listing shows its current price, main features and the information we need before your rental.",
        productLabels: {
          "maxi-cosi-pebble-360-pro2-infant-car-seat": "Infant car seat · 40–87 cm",
          "moni-serengeti-i-size-car-seat": "Rotating car seat · 40–150 cm",
          "peg-perego-viaggio1-duo-fix-car-seat": "Forward-facing car seat · 9–18 kg",
          "kinderkraft-i-spark-2-plus-i-size-car-seat": "High-back car seat · 100–150 cm",
          "seat-booster": "Backless booster for older children",
        },
        choiceHeading: "How to choose a car seat for your Valencia stay",
        choiceIntro: "A few practical details make it much easier to narrow down the right option before you arrive.",
        choices: [
          {
            title: "Start with height and weight",
            description: "Send us your child's current height and weight. Age is useful too, but the measurements shown on each listing are the better starting point for comparing seats.",
          },
          {
            title: "Tell us which car you will use",
            description: "If you know it, share the make, model and year of the car. This is especially useful when choosing between an ISOFIX seat and a booster that uses the car's seat belt.",
          },
          {
            title: "Plan for every vehicle",
            description: "Let us know if the seat will move between a rental car, family car or transfer vehicle. The installation needs to work with each car you plan to use.",
          },
        ],
        checklistHeading: "Helpful details to send us",
        checklistIntro: "You can reserve before arriving in Valencia. Send what you already know, and update the car details later if your rental company has not assigned a model yet.",
        checklist: [
          "Your child's current height, weight and age.",
          "The car's make, model and year, if already confirmed.",
          "Whether the car has ISOFIX or you need an option that uses its three-point seat belt.",
          "Whether you expect to use the seat in more than one vehicle.",
          "Your rental dates and preferred pickup or delivery arrangement.",
        ],
        localHeading: "Planning car travel in Valencia",
        localParagraphs: [
          "Most families arrange their equipment while they are still abroad. If your rental-car company has not assigned a model yet, you can start with your child's details and dates and send the car information when it becomes available.",
          "A car seat can be useful for airport transfers, day trips and everyday journeys during your stay. If you will use several vehicles, mention that when enquiring so we can help you compare the practical options.",
        ],
        linksHeading: "Plan the rest of your family stay",
        linksIntro: "Return to the complete baby-equipment collection, arrange several arrival needs together or use the family guide to plan before travelling.",
        links: [
          {
            eyebrow: "Baby equipment",
            title: "Browse all baby and toddler gear",
            description: "Compare sleep, feeding, bathing, travel and mobility equipment for the same Valencia stay.",
            href: "/rental/baby-gear",
          },
          {
            eyebrow: "Baby arrival kit",
            title: "Prepare your accommodation before arrival",
            description: "Combine sleep, feeding, bathing and mobility essentials around your baby's routine.",
            href: "/valencia/kits/baby-arrival-kit",
          },
          {
            eyebrow: "Valencia guide",
            title: "Plan Valencia with babies and children",
            description: "Review neighbourhood, transport, activity and packing considerations before travelling.",
            href: "/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Car seat rental in Valencia: common questions",
        faqs: [
          { question: "Which car seat should I rent in Valencia?", answer: "Start with your child's current height and weight, then compare the child-size guidance and installation method on each listing. If you share the car model, we can help narrow down the practical options." },
          { question: "Can I book a child car seat before arriving in Valencia?", answer: "Yes. Most customers arrange equipment before travelling. Send your dates and your child's details first, then provide the rental-car model later if it has not yet been assigned." },
          { question: "Does an ISOFIX car seat fit every car?", answer: "No. Cars and approved seating positions differ. If you are considering an ISOFIX seat, send the car make, model and year so the setup can be checked." },
          { question: "What information do you need for a car-seat check?", answer: "We need the child's current height and weight, the vehicle make, model and year, intended seating position, available anchorage or belt setup and details of any second vehicle." },
          { question: "Can I move the same car seat between vehicles?", answer: "Only after checking each vehicle, seating position and required installation against the exact seat instructions. The driver must reinstall and verify it correctly before every journey." },
        ],
        productAction: "View car seat and check dates",
        priceFrom: "From",
        priceUnit: "/ day",
      },
      es: {
        categoryLabel: "Bebés y niños pequeños",
        title: "Alquiler de Sillas de Coche en Valencia | Rent&Roll",
        description: "Alquila una silla de coche para bebé o niño en Valencia y organízala antes de viajar. Compara opciones, características, precios y disponibilidad.",
        eyebrow: "Alquiler de sillas de coche en Valencia",
        intro: "Viaja con menos equipaje organizando una silla de coche para tu estancia en Valencia antes de llegar. Compara las opciones actuales y consulta cada ficha para ver características, orientación de talla, precios y disponibilidad.",
        productHeading: "Compara opciones de sillas de coche",
        productDescription: "Elige la opción que mejor encaje con tu hijo y tus planes. Cada ficha muestra el precio actual, las características principales y la información necesaria antes del alquiler.",
        productLabels: {
          "maxi-cosi-pebble-360-pro2-infant-car-seat": "Silla portabebés · 40–87 cm",
          "moni-serengeti-i-size-car-seat": "Silla giratoria · 40–150 cm",
          "peg-perego-viaggio1-duo-fix-car-seat": "Silla orientada hacia delante · 9–18 kg",
          "kinderkraft-i-spark-2-plus-i-size-car-seat": "Silla con respaldo alto · 100–150 cm",
          "seat-booster": "Elevador sin respaldo para niños mayores",
        },
        choiceHeading: "Cómo elegir una silla de coche para tu estancia",
        choiceIntro: "Unos pocos datos prácticos ayudan a reducir las opciones antes de llegar.",
        choices: [
          {
            title: "Empieza por la altura y el peso",
            description: "Indica la altura y el peso actuales del niño. La edad también ayuda, pero las medidas de cada ficha son el mejor punto de partida para comparar.",
          },
          {
            title: "Indica qué coche vas a utilizar",
            description: "Si lo sabes, comparte la marca, el modelo y el año. Resulta especialmente útil para elegir entre una silla ISOFIX y un elevador que utiliza el cinturón del coche.",
          },
          {
            title: "Ten en cuenta todos los vehículos",
            description: "Avísanos si cambiarás la silla entre un coche de alquiler, un vehículo familiar o un traslado. La instalación debe funcionar con cada coche previsto.",
          },
        ],
        checklistHeading: "Datos útiles para enviarnos",
        checklistIntro: "Puedes reservar antes de llegar a Valencia. Envía lo que ya sepas y completa los datos del coche más adelante si la empresa de alquiler todavía no ha asignado un modelo.",
        checklist: [
          "La altura, el peso y la edad actuales del niño.",
          "La marca, el modelo y el año del coche, si ya están confirmados.",
          "Si el coche tiene ISOFIX o necesitas una opción que utilice el cinturón de tres puntos.",
          "Si utilizarás la silla en más de un vehículo.",
          "Las fechas del alquiler y la opción de recogida o entrega que prefieres.",
        ],
        localHeading: "Planificar los desplazamientos en coche por Valencia",
        localParagraphs: [
          "La mayoría de familias organiza el material cuando todavía está fuera de España. Si la empresa de alquiler aún no ha asignado un coche, puedes empezar con los datos del niño y las fechas y enviar el modelo más adelante.",
          "Una silla puede resultar útil para traslados desde el aeropuerto, excursiones y desplazamientos cotidianos. Si utilizarás varios vehículos, coméntalo al consultar para que podamos ayudarte a comparar las opciones prácticas.",
        ],
        linksHeading: "Planifica el resto de la estancia en familia",
        linksIntro: "Vuelve a la colección completa, organiza varias necesidades para la llegada o consulta la guía familiar antes de viajar.",
        links: [
          {
            eyebrow: "Material de bebé",
            title: "Consulta todo el equipamiento para bebés",
            description: "Compara descanso, alimentación, baño, viaje y movilidad para la misma estancia en Valencia.",
            href: "/es/rental/baby-gear",
          },
          {
            eyebrow: "Kit de llegada del bebé",
            title: "Prepara el alojamiento antes de llegar",
            description: "Combina descanso, alimentación, baño y movilidad según la rutina del bebé.",
            href: "/es/valencia/kits/baby-arrival-kit",
          },
          {
            eyebrow: "Guía de Valencia",
            title: "Planifica Valencia con bebés y niños",
            description: "Revisa barrios, transporte, actividades y equipaje antes de viajar.",
            href: "/es/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Preguntas sobre el alquiler de sillas de coche",
        faqs: [
          { question: "¿Qué silla de coche debería alquilar en Valencia?", answer: "Empieza por la altura y el peso actuales del niño y compara la orientación de talla y el sistema de instalación de cada ficha. Si compartes el modelo del coche, podemos ayudarte a reducir las opciones." },
          { question: "¿Puedo reservar una silla infantil antes de llegar a Valencia?", answer: "Sí. La mayoría de clientes organiza el material antes de viajar. Envía primero las fechas y los datos del niño y facilita después el modelo del coche si todavía no está asignado." },
          { question: "¿Una silla ISOFIX sirve para cualquier coche?", answer: "No. Los vehículos y las plazas compatibles cambian. Si estás valorando una silla ISOFIX, envía la marca, el modelo y el año del coche para revisar la instalación." },
          { question: "¿Qué información necesitáis para comprobar la silla?", answer: "Necesitamos la altura y el peso actuales del niño, la marca, el modelo y el año del vehículo, la plaza prevista, los anclajes o cinturón disponibles y los datos de cualquier segundo vehículo." },
          { question: "¿Puedo cambiar la misma silla entre varios vehículos?", answer: "Solo después de comprobar cada vehículo, plaza e instalación exigida por las instrucciones de la silla exacta. El conductor debe reinstalarla y verificarla correctamente antes de cada trayecto." },
        ],
        productAction: "Ver silla y comprobar fechas",
        priceFrom: "Desde",
        priceUnit: "/ día",
      },
    },
  },
  {
    slug: "travel-cots-cribs",
    categorySlug: "baby-gear",
    productSlugs: [
      "travel-cot",
      "travel-crib",
      "bedside-crib",
      "baby-bed-60x120",
    ],
    published: true,
    content: {
      en: {
        categoryLabel: "Baby & Toddler",
        title: "Travel Cot & Crib Rental in Valencia | Rent&Roll",
        description: "Rent a travel cot or crib in Valencia and arrange it before you arrive. Compare current options, prices and availability for your dates.",
        eyebrow: "Travel cot and crib rental in Valencia",
        intro: "Arrange a suitable sleep space for your Valencia stay without carrying bulky equipment through the airport. The current options are shown below, with exact dimensions, inclusions, prices and availability on each listing.",
        productHeading: "Travel cots and cribs available to rent",
        productDescription: "Choose the sleep format that suits your child and accommodation, then open the listing for its exact limits, footprint, setup and included parts.",
        productLabels: {
          "travel-cot": "Travel cot",
          "travel-crib": "Travel crib",
          "bedside-crib": "Bedside crib",
          "baby-bed-60x120": "Baby bed · 60 × 120 cm",
        },
        choiceHeading: "How to choose a cot or crib for your stay",
        choiceIntro: "The useful differences are the child's current needs, the available space and what the individual rental includes.",
        choices: [
          {
            title: "Start with the child's current stage",
            description: "Check the age, weight or developmental guidance on the exact listing. Choose from the products currently available rather than relying on a general product label.",
          },
          {
            title: "Measure the sleeping area",
            description: "Compare the product footprint with the space beside or inside the bedroom, including room to move around it and reach doors or wardrobes.",
          },
          {
            title: "Check what is included",
            description: "Open the listing to confirm the supplied mattress, fitted sheet or other parts. Bring or request anything not explicitly shown as included.",
          },
        ],
        checklistHeading: "Useful details before booking",
        checklistIntro: "Most families organise sleep equipment while they are still abroad. A few practical details make the choice much easier.",
        checklist: [
          "Your child's age, approximate weight and current sleeping arrangement.",
          "The space available in the bedroom or beside the adult bed.",
          "Any lift, stair or access restrictions at the accommodation.",
          "Which bedding or accessories you plan to bring yourself.",
          "Your dates and preferred pickup or delivery arrangement.",
        ],
        localHeading: "Prepare the accommodation before you arrive",
        localParagraphs: [
          "A cot or crib can be arranged before your flight so the sleeping space is ready around your arrival plan. If the accommodation layout is unclear, ask the host for basic room measurements or a photograph before choosing.",
          "Each product listing remains the source for current availability, exact dimensions and included parts. That keeps the collection useful even when the rentable range changes.",
        ],
        linksHeading: "Plan the rest of your baby setup",
        linksIntro: "Return to the complete baby-equipment catalogue, arrange several arrival needs together or use our family planning guide.",
        links: [
          {
            eyebrow: "Baby equipment",
            title: "Browse all baby and toddler gear",
            description: "See sleep, feeding, bathing, mobility and travel products available for your stay.",
            href: "/rental/baby-gear",
          },
          {
            eyebrow: "Baby arrival kit",
            title: "Arrange several arrival essentials",
            description: "Combine sleep, feeding, bathing and mobility needs in one tailored request.",
            href: "/valencia/kits/baby-arrival-kit",
          },
          {
            eyebrow: "Valencia guide",
            title: "Plan Valencia with a baby or toddler",
            description: "Review accommodation, transport, activities and the bulky equipment worth arranging locally.",
            href: "/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Travel cot and crib rental in Valencia: common questions",
        faqs: [
          { question: "Can I book a travel cot before arriving in Valencia?", answer: "Yes. Choose from the currently published options, enter your dates and review the available pickup or delivery arrangements before payment." },
          { question: "How do I know which cot or crib suits my child?", answer: "Use the age, weight and developmental guidance on the exact product listing, then compare its dimensions and setup with the accommodation space." },
          { question: "Are the mattress and bedding included?", answer: "Inclusions vary by product. The individual listing shows the supplied parts. Confirm anything that is not clearly listed before travelling." },
          { question: "Can the cot be delivered to my accommodation?", answer: "Available pickup and delivery options are shown during booking for your address and dates. Share any stairs, lift limits or access details before handover." },
        ],
        productAction: "View sleep option and check dates",
        priceFrom: "From",
        priceUnit: "/ day",
      },
      es: {
        categoryLabel: "Bebés y niños pequeños",
        title: "Alquiler de Cunas de Viaje en Valencia | Rent&Roll",
        description: "Alquila una cuna de viaje en Valencia y organízala antes de llegar. Compara las opciones, precios y disponibilidad para tus fechas.",
        eyebrow: "Alquiler de cunas de viaje en Valencia",
        intro: "Organiza un espacio de descanso adecuado para tu estancia sin transportar equipamiento voluminoso por el aeropuerto. Consulta las opciones actuales y abre cada ficha para ver medidas, elementos incluidos, precios y disponibilidad.",
        productHeading: "Cunas disponibles para alquilar",
        productDescription: "Elige el formato que encaje con el niño y el alojamiento y consulta la ficha para conocer sus límites, espacio necesario, montaje y piezas incluidas.",
        productLabels: {
          "travel-cot": "Cuna de viaje",
          "travel-crib": "Cuna de viaje compacta",
          "bedside-crib": "Cuna colecho",
          "baby-bed-60x120": "Cuna de bebé · 60 × 120 cm",
        },
        choiceHeading: "Cómo elegir una cuna para la estancia",
        choiceIntro: "Las diferencias útiles son las necesidades actuales del niño, el espacio disponible y lo que incluye cada alquiler.",
        choices: [
          {
            title: "Empieza por la etapa actual del niño",
            description: "Consulta la orientación de edad, peso o desarrollo en la ficha exacta. Elige entre los productos disponibles en lugar de basarte únicamente en una etiqueta general.",
          },
          {
            title: "Mide la zona de descanso",
            description: "Compara el espacio que ocupa la cuna con la zona disponible junto a la cama o dentro del dormitorio, dejando paso hacia puertas y armarios.",
          },
          {
            title: "Comprueba qué está incluido",
            description: "Abre la ficha para confirmar el colchón, la sábana u otras piezas suministradas. Lleva o solicita cualquier elemento que no aparezca expresamente incluido.",
          },
        ],
        checklistHeading: "Datos útiles antes de reservar",
        checklistIntro: "La mayoría de familias organiza el equipamiento de descanso cuando todavía está fuera de España. Unos pocos datos facilitan mucho la elección.",
        checklist: [
          "La edad, el peso aproximado y la forma de dormir actual del niño.",
          "El espacio disponible en el dormitorio o junto a la cama de los adultos.",
          "Cualquier escalera, límite del ascensor o dificultad de acceso.",
          "La ropa de cama o los accesorios que llevarás por tu cuenta.",
          "Las fechas y la opción de recogida o entrega preferida.",
        ],
        localHeading: "Prepara el alojamiento antes de llegar",
        localParagraphs: [
          "Puedes organizar la cuna antes del vuelo para coordinar el espacio de descanso con tu llegada. Si no conoces bien la distribución, pide al alojamiento unas medidas básicas o una fotografía antes de elegir.",
          "Cada ficha sigue siendo la fuente de la disponibilidad, las medidas y los elementos incluidos. Así la colección continúa siendo útil aunque cambien los productos disponibles.",
        ],
        linksHeading: "Planifica el resto del equipamiento del bebé",
        linksIntro: "Vuelve al catálogo completo, organiza varias necesidades para la llegada o consulta nuestra guía familiar.",
        links: [
          {
            eyebrow: "Material de bebé",
            title: "Consulta todo el equipamiento para bebés",
            description: "Ve productos de descanso, alimentación, baño, movilidad y viaje disponibles para la estancia.",
            href: "/es/rental/baby-gear",
          },
          {
            eyebrow: "Kit de llegada del bebé",
            title: "Organiza varios productos para la llegada",
            description: "Combina descanso, alimentación, baño y movilidad en una solicitud adaptada.",
            href: "/es/valencia/kits/baby-arrival-kit",
          },
          {
            eyebrow: "Guía de Valencia",
            title: "Planifica Valencia con un bebé o niño pequeño",
            description: "Consulta alojamiento, transporte, actividades y el equipamiento voluminoso que conviene organizar localmente.",
            href: "/es/blog/valencia-with-kids-complete-guide",
          },
        ],
        faqHeading: "Preguntas sobre el alquiler de cunas de viaje",
        faqs: [
          { question: "¿Puedo reservar una cuna antes de llegar a Valencia?", answer: "Sí. Elige entre las opciones publicadas, introduce tus fechas y revisa las modalidades de recogida o entrega disponibles antes del pago." },
          { question: "¿Cómo sé qué cuna es adecuada para mi hijo?", answer: "Consulta la orientación de edad, peso y desarrollo en la ficha exacta y compara sus medidas y montaje con el espacio del alojamiento." },
          { question: "¿Están incluidos el colchón y la ropa de cama?", answer: "Los elementos incluidos dependen del producto. La ficha individual muestra las piezas suministradas. Confirma antes de viajar cualquier elemento que no figure claramente." },
          { question: "¿Podéis entregar la cuna en mi alojamiento?", answer: "La reserva muestra las opciones de recogida o entrega disponibles para la dirección y las fechas. Comunica antes cualquier escalera, límite del ascensor o dificultad de acceso." },
        ],
        productAction: "Ver cuna y comprobar fechas",
        priceFrom: "Desde",
        priceUnit: "/ día",
      },
    },
  },
  {
    slug: "wheelchairs",
    categorySlug: "mobility",
    productSlugs: [
      "transport-wheelchair",
      "mobility-power-wheelchair",
    ],
    published: true,
    content: {
      en: {
        categoryLabel: "Mobility & Accessibility",
        title: "Wheelchair Rental in Valencia | Rent&Roll",
        description: "Rent a wheelchair in Valencia and arrange it before you travel. Compare current options, prices and availability for your dates.",
        eyebrow: "Wheelchair rental in Valencia",
        intro: "Arrange a wheelchair for your Valencia stay before you arrive. The current options are shown below, with individual listings for dimensions, transport details, prices and availability.",
        productHeading: "Wheelchairs available to rent",
        productDescription: "Start with how the wheelchair will be used, then open the relevant listing for its exact dimensions, weight, controls and current availability.",
        productLabels: {
          "transport-wheelchair": "Lightweight transport wheelchair",
          "mobility-power-wheelchair": "Powered wheelchair",
        },
        choiceHeading: "How to choose a wheelchair for your stay",
        choiceIntro: "The practical choice depends on who will propel the chair, how it will be transported and the access available during the trip.",
        choices: [
          {
            title: "Who will propel the wheelchair?",
            description: "A transport chair is designed to be pushed by another person. A powered chair allows independent electric movement where the route and access suit the chair.",
          },
          {
            title: "Will it travel in a car?",
            description: "Check the folded dimensions, total weight and the available boot space. Powered equipment is heavier and needs a suitable transport plan.",
          },
          {
            title: "What access will you have?",
            description: "Share the narrowest doorway, lift dimensions, steps and the surfaces you expect to use so the available options can be compared realistically.",
          },
        ],
        checklistHeading: "Useful details before booking",
        checklistIntro: "You can organise the rental from abroad. Send the information you already have about the user, accommodation and transport plan.",
        checklist: [
          "Whether the wheelchair will be self-operated or pushed by another person.",
          "The user's approximate height and weight.",
          "Doorway, lift and step information at the accommodation.",
          "Whether the wheelchair must fit in a car and the available boot space.",
          "Your dates, accommodation area and preferred pickup or delivery option.",
        ],
        localHeading: "Arrange wheelchair rental before arriving in Valencia",
        localParagraphs: [
          "Most visitors can organise mobility equipment before travelling. Accommodation photos, doorway measurements and the planned transport method are often enough to identify the practical options before arrival.",
          "Valencia routes vary between wide promenades, older pavements, crossings and indoor attractions. Plan around the places you expect to visit and check each listing for the chair's exact operating and transport details.",
        ],
        linksHeading: "Plan the rest of your Valencia stay",
        linksIntro: "Browse the complete mobility range, combine several support needs or review our practical accessibility guide.",
        links: [
          {
            eyebrow: "Mobility collection",
            title: "Browse all mobility equipment",
            description: "See wheelchairs, mobility scooters, walkers and other available support equipment.",
            href: "/rental/mobility",
          },
          {
            eyebrow: "Accessible Valencia kit",
            title: "Arrange several mobility needs together",
            description: "Request a tailored combination of mobility and daily-living equipment for the same stay.",
            href: "/valencia/kits/accessible-valencia-kit",
          },
          {
            eyebrow: "Valencia guide",
            title: "Plan wheelchair-accessible Valencia",
            description: "Review transport, attractions, beaches and route-planning considerations before arrival.",
            href: "/blog/wheelchair-accessibility-valencia",
          },
        ],
        faqHeading: "Wheelchair rental in Valencia: common questions",
        faqs: [
          { question: "Can I arrange wheelchair rental before travelling to Valencia?", answer: "Yes. Send your dates, accommodation area and the practical details you already know. The product listings show current prices and availability for the selected dates." },
          { question: "What is the difference between a transport and powered wheelchair?", answer: "A transport wheelchair is pushed by another person. A powered wheelchair uses electric controls and requires a suitable route, charging and transport plan. Check each listing for its exact details." },
          { question: "Can the wheelchair be delivered to my accommodation?", answer: "Available pickup and delivery options are shown during booking for your address and dates. Share any steps, lift limits or difficult access before handover." },
          { question: "What measurements should I check?", answer: "Check the narrowest doorway, lift dimensions, any steps, available storage and car boot space. Compare those measurements with the exact dimensions on the product listing." },
        ],
        productAction: "View wheelchair and check dates",
        priceFrom: "From",
        priceUnit: "/ day",
      },
      es: {
        categoryLabel: "Movilidad y accesibilidad",
        title: "Alquiler de Sillas de Ruedas en Valencia | Rent&Roll",
        description: "Alquila una silla de ruedas en Valencia y organízala antes de viajar. Compara las opciones, precios y disponibilidad para tus fechas.",
        eyebrow: "Alquiler de sillas de ruedas en Valencia",
        intro: "Organiza una silla de ruedas para tu estancia en Valencia antes de llegar. Consulta las opciones actuales y abre cada ficha para ver medidas, transporte, precios y disponibilidad.",
        productHeading: "Sillas de ruedas disponibles para alquilar",
        productDescription: "Empieza por cómo se utilizará la silla y consulta después la ficha correspondiente para conocer sus medidas, peso, controles y disponibilidad.",
        productLabels: {
          "transport-wheelchair": "Silla de transporte ligera",
          "mobility-power-wheelchair": "Silla de ruedas eléctrica",
        },
        choiceHeading: "Cómo elegir una silla de ruedas para la estancia",
        choiceIntro: "La elección práctica depende de quién moverá la silla, cómo se transportará y los accesos disponibles durante el viaje.",
        choices: [
          {
            title: "¿Quién moverá la silla?",
            description: "Una silla de transporte está pensada para que otra persona la empuje. Una silla eléctrica permite desplazarse con controles cuando la ruta y los accesos son adecuados.",
          },
          {
            title: "¿Debe viajar en coche?",
            description: "Comprueba las medidas plegada, el peso total y el espacio disponible en el maletero. El equipo eléctrico es más pesado y necesita un plan de transporte adecuado.",
          },
          {
            title: "¿Qué accesos tendrás?",
            description: "Indica la puerta más estrecha, las medidas del ascensor, los escalones y las superficies previstas para comparar las opciones de forma realista.",
          },
        ],
        checklistHeading: "Datos útiles antes de reservar",
        checklistIntro: "Puedes organizar el alquiler desde fuera de España. Envía la información disponible sobre la persona usuaria, el alojamiento y el transporte.",
        checklist: [
          "Si la silla será manejada por la persona usuaria o empujada por otra persona.",
          "La altura y el peso aproximados de la persona usuaria.",
          "Información sobre puertas, ascensor y escalones del alojamiento.",
          "Si debe caber en un coche y el espacio disponible en el maletero.",
          "Las fechas, la zona del alojamiento y la opción de recogida o entrega preferida.",
        ],
        localHeading: "Organiza la silla de ruedas antes de llegar a Valencia",
        localParagraphs: [
          "La mayoría de visitantes puede organizar el equipamiento de movilidad antes de viajar. Las fotos del alojamiento, las medidas de las puertas y el plan de transporte suelen permitir comparar las opciones prácticas con antelación.",
          "Las rutas de Valencia combinan paseos amplios, aceras antiguas, cruces y espacios interiores. Planifica los lugares que quieres visitar y revisa en cada ficha los datos exactos de uso y transporte.",
        ],
        linksHeading: "Planifica el resto de la estancia",
        linksIntro: "Consulta toda la colección de movilidad, combina varias necesidades o revisa nuestra guía práctica de accesibilidad.",
        links: [
          {
            eyebrow: "Colección de movilidad",
            title: "Consulta todo el equipamiento de movilidad",
            description: "Ve sillas de ruedas, scooters, andadores y otros equipos de apoyo disponibles.",
            href: "/es/rental/mobility",
          },
          {
            eyebrow: "Kit de Valencia accesible",
            title: "Organiza varias necesidades juntas",
            description: "Solicita una combinación adaptada de movilidad y apoyo diario para la misma estancia.",
            href: "/es/valencia/kits/accessible-valencia-kit",
          },
          {
            eyebrow: "Guía de Valencia",
            title: "Planifica una Valencia accesible",
            description: "Consulta transporte, atracciones, playas y rutas antes de llegar.",
            href: "/es/blog/wheelchair-accessibility-valencia",
          },
        ],
        faqHeading: "Preguntas sobre el alquiler de sillas de ruedas",
        faqs: [
          { question: "¿Puedo organizar el alquiler antes de viajar a Valencia?", answer: "Sí. Envía las fechas, la zona del alojamiento y los datos prácticos que ya conozcas. Las fichas muestran los precios actuales y la disponibilidad para las fechas elegidas." },
          { question: "¿Qué diferencia hay entre una silla de transporte y una eléctrica?", answer: "Una silla de transporte necesita que otra persona la empuje. Una silla eléctrica utiliza controles y requiere una ruta, carga y transporte adecuados. Consulta los datos exactos de cada ficha." },
          { question: "¿Podéis entregar la silla en mi alojamiento?", answer: "La reserva muestra las opciones de recogida o entrega disponibles para la dirección y las fechas indicadas. Comunica antes cualquier escalón, límite del ascensor o acceso difícil." },
          { question: "¿Qué medidas debo comprobar?", answer: "Comprueba la puerta más estrecha, el ascensor, los escalones, el espacio de almacenamiento y el maletero. Compara esas medidas con las dimensiones exactas de la ficha." },
        ],
        productAction: "Ver silla y comprobar fechas",
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
