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
      "car-seat-britax-i-size",
      "convertible-car-seat",
      "kinderkraft-i-boost-2-booster-seat",
    ],
    published: true,
    content: {
      en: {
        categoryLabel: "Baby & Toddler",
        title: "Car Seat Rental in Valencia | Rent&Roll",
        description: "Compare child car seats for a Valencia stay. Check the child, vehicle, approval label, installation and dates before booking.",
        eyebrow: "Car seat rental in Valencia",
        intro: "Arrange a child car seat before you travel, then match the exact seat to the child and the vehicle that will be used in Valencia. Individual product pages show current prices, date availability, manufacturer limits and installation requirements.",
        productHeading: "Compare car seat options",
        productDescription: "Use the exact listing to check the permitted child range and installation method. We confirm the physical seat, vehicle and required setup before handover.",
        productLabels: {
          "car-seat-britax-i-size": "Forward-facing i-Size car seat",
          "convertible-car-seat": "Group 1 car seat",
          "kinderkraft-i-boost-2-booster-seat": "Belt-positioning booster",
        },
        choiceHeading: "How to choose a car seat for your Valencia stay",
        choiceIntro: "Age alone is not enough to select a child restraint. The exact approval label and current manual control whether a seat is suitable and how it must be installed.",
        choices: [
          {
            title: "Start with the child's measurements",
            description: "Share the child's current height and weight, plus age as supporting information. Compare those details with the permitted range on the exact product rather than relying on a general age label.",
          },
          {
            title: "Confirm the vehicle before payment",
            description: "Provide the vehicle make, model and year, the intended seating position and whether it has the anchorage or three-point belt required by the exact seat. No seat can be assumed to fit every vehicle.",
          },
          {
            title: "Check the complete installation",
            description: "The driver remains responsible for following the current manual and checking the installation before every journey. A familiar brand name or i-Size label does not replace the product-specific instructions.",
          },
        ],
        checklistHeading: "What to have ready before booking",
        checklistIntro: "Most customers arrange equipment before arriving in Valencia. These details let us check the match remotely before the rental is confirmed.",
        checklist: [
          "The child's current height and weight, with age as supporting information.",
          "The vehicle make, model and year, including whether it is a rental car, private car or another vehicle.",
          "The intended seating position and available ISOFIX, top-tether, support-leg or three-point-belt setup, as required by the exact seat.",
          "Any transfer between vehicles during the rental, because each vehicle and seating position must be checked.",
          "The exact seat's approval label, current manual, condition and included installation parts, which we verify before handover.",
        ],
        localHeading: "Planning car travel in Valencia",
        localParagraphs: [
          "You can reserve before arriving, but the match depends on the actual child, vehicle and seating position—not simply the destination or journey type. If a rental-car model has not yet been assigned, send the confirmed model when the provider supplies it so the final vehicle check can be completed.",
          "Plans can involve airport transfers, day trips or more than one vehicle, but those journeys do not make a particular seat suitable by themselves. Tell us about every vehicle you expect to use and follow the supplied manual each time the seat is installed.",
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
          { question: "Which car seat should I rent in Valencia?", answer: "Choose from the child's current height and weight, the exact seat's approval label and manual, and the vehicle and seating position. Age can help describe the child, but it should not be the only selection criterion." },
          { question: "Can I book a child car seat before arriving in Valencia?", answer: "Yes. Send the child and vehicle details available before the trip. If the rental-car provider has not assigned a model yet, the final vehicle and installation check must wait until that information is confirmed." },
          { question: "Does an ISOFIX car seat fit every car?", answer: "No. The vehicle's anchorage points, approved seating position and the exact seat instructions must all be checked. ISOFIX alone is not a universal-fit guarantee." },
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
        description: "Compara sillas de coche infantiles para Valencia. Revisa niño, vehículo, homologación, instalación y fechas antes de reservar.",
        eyebrow: "Alquiler de sillas de coche en Valencia",
        intro: "Organiza la silla infantil antes de viajar y comprueba después que la unidad exacta encaja con el niño y el vehículo que se utilizará en Valencia. Cada ficha muestra precios actuales, disponibilidad por fechas, límites del fabricante y requisitos de instalación.",
        productHeading: "Compara opciones de sillas de coche",
        productDescription: "Consulta la ficha exacta para revisar el rango infantil permitido y la instalación. Confirmamos la unidad física, el vehículo y el montaje necesario antes de la entrega.",
        productLabels: {
          "car-seat-britax-i-size": "Silla i-Size orientada hacia delante",
          "convertible-car-seat": "Silla de coche del grupo 1",
          "kinderkraft-i-boost-2-booster-seat": "Elevador con posicionamiento de cinturón",
        },
        choiceHeading: "Cómo elegir una silla de coche para tu estancia",
        choiceIntro: "La edad por sí sola no basta para elegir un sistema de retención infantil. La etiqueta de homologación y el manual vigente de la unidad exacta determinan su idoneidad y la instalación.",
        choices: [
          {
            title: "Empieza por las medidas del niño",
            description: "Comparte la altura y el peso actuales, además de la edad como dato complementario. Compáralos con el rango permitido de la ficha exacta y no con una etiqueta general de edad.",
          },
          {
            title: "Confirma el vehículo antes del pago",
            description: "Indica marca, modelo y año, la plaza donde se instalará y si dispone del anclaje o cinturón de tres puntos exigido por la silla. Ninguna unidad encaja automáticamente en todos los vehículos.",
          },
          {
            title: "Comprueba toda la instalación",
            description: "El conductor debe seguir el manual vigente y verificar la instalación antes de cada trayecto. Una marca conocida o la etiqueta i-Size no sustituyen las instrucciones específicas del producto.",
          },
        ],
        checklistHeading: "Qué conviene tener preparado antes de reservar",
        checklistIntro: "La mayoría de clientes organiza el material antes de llegar a Valencia. Estos datos permiten comprobar a distancia la combinación antes de confirmar el alquiler.",
        checklist: [
          "La altura y el peso actuales del niño, con la edad como información complementaria.",
          "La marca, el modelo y el año del vehículo, indicando si es de alquiler, particular o de otro tipo.",
          "La plaza prevista y los anclajes ISOFIX, top tether, pata de apoyo o cinturón de tres puntos disponibles, según exija la silla exacta.",
          "Cualquier cambio de vehículo durante el alquiler, porque cada coche y plaza deben comprobarse por separado.",
          "La etiqueta de homologación, el manual vigente, el estado y las piezas de instalación incluidas, que verificamos antes de la entrega.",
        ],
        localHeading: "Planificar los desplazamientos en coche por Valencia",
        localParagraphs: [
          "Puedes reservar antes de llegar, pero la combinación depende del niño, el vehículo y la plaza reales, no solo del destino o del tipo de trayecto. Si la empresa de alquiler todavía no ha asignado un coche, envía el modelo confirmado cuando lo recibas para completar la comprobación.",
          "El viaje puede incluir traslados desde el aeropuerto, excursiones o más de un vehículo, pero esos trayectos no hacen adecuada una silla concreta. Indica todos los vehículos previstos y sigue el manual suministrado cada vez que se instale la silla.",
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
          { question: "¿Qué silla de coche debería alquilar en Valencia?", answer: "Elige según la altura y el peso actuales del niño, la etiqueta de homologación y el manual de la unidad exacta, además del vehículo y la plaza. La edad ayuda a describir al niño, pero no debe ser el único criterio." },
          { question: "¿Puedo reservar una silla infantil antes de llegar a Valencia?", answer: "Sí. Envía antes del viaje los datos disponibles del niño y del vehículo. Si la empresa de alquiler aún no ha asignado un modelo, la comprobación final del vehículo y la instalación debe esperar hasta que se confirme." },
          { question: "¿Una silla ISOFIX sirve para cualquier coche?", answer: "No. Hay que comprobar los anclajes, la plaza autorizada y las instrucciones de la silla exacta. ISOFIX por sí solo no garantiza un ajuste universal." },
          { question: "¿Qué información necesitáis para comprobar la silla?", answer: "Necesitamos la altura y el peso actuales del niño, la marca, el modelo y el año del vehículo, la plaza prevista, los anclajes o cinturón disponibles y los datos de cualquier segundo vehículo." },
          { question: "¿Puedo cambiar la misma silla entre varios vehículos?", answer: "Solo después de comprobar cada vehículo, plaza e instalación exigida por las instrucciones de la silla exacta. El conductor debe reinstalarla y verificarla correctamente antes de cada trayecto." },
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
