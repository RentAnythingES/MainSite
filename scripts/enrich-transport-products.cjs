const { Client } = require("pg");

process.loadEnvFile(".env.local");

const products = [
  {
    id: "73cf1fdd-f2c1-4312-9199-c93498c62512",
    slug: "big-bobby-car-classic-ocean",
    name: "BIG Bobby Car Classic Ocean",
    brand: "BIG",
    description: "A low, stable BIG Bobby Car Classic Ocean ride-on for children from 12 months, suitable for supervised play on smooth, level and traffic-free surfaces during a Valencia stay.",
    features: [
      "Recommended from 12 months",
      "Maximum load 50 kg",
      "Non-slip steering wheel with mechanical horn",
      "Four abrasion-resistant plastic wheels",
      "Stepless Ackermann steering for a small turning circle",
      "Front and rear trailer couplings and knee recess",
    ],
    specs: {
      Brand: "BIG",
      Model: "Bobby Car Classic Ocean",
      "Article number": "800056130",
      EAN: "4004943561303",
      "Recommended age": "From 12 months",
      "Maximum load": "50 kg",
      Dimensions: "58 × 30 × 38 cm",
      Material: "Plastic",
      Colour: "Ocean blue with red details",
      "Country of manufacture": "Germany",
    },
    meta_title: "BIG Bobby Car Rental Valencia | Classic Ocean",
    meta_description: "Rent a BIG Bobby Car Classic Ocean in Valencia for supervised toddler play. Suitable from 12 months on smooth, level, traffic-free surfaces.",
    image_alt: "Blue BIG Bobby Car Classic Ocean toddler ride-on with red steering wheel",
    image_source: "https://www.big.de/big_en/categories/ride-on-toys/big-bobby-car/classic/big-bobby-car-classic-ocean-800056130-en.html",
    localizations: {
      en: {
        short_description: "Rent a BIG Bobby Car Classic Ocean in Valencia for supervised toddler play at your accommodation, on a private terrace or on another smooth, level and traffic-free surface.",
        detail_description: "The BIG Bobby Car Classic Ocean gives younger visitors a familiar ride-on toy without families having to pack one for their Valencia stay. BIG recommends this model from 12 months. Its low centre of gravity, ergonomic body, non-slip steering wheel and stepless Ackermann steering help children manoeuvre on smooth, level surfaces, while the mechanical horn and ocean-themed design add to the play experience. The four plastic wheels are abrasion-resistant, and front and rear couplings accept compatible BIG accessories. A knee recess also gives older children more room to ride. The assembled car measures 58 × 30 × 38 cm and has a manufacturer-stated maximum load of 50 kg. It is intended for one child at a time and must always be used under direct adult supervision, away from roads, traffic, stairs, slopes, swimming pools and other hazards.",
        includes_text: "One BIG Bobby Car Classic Ocean ride-on with steering wheel, mechanical horn and four fitted wheels. Trailer, push handle, rope and other accessories are not included unless listed in the booking.",
        constraints_text: "For one child from 12 months, up to 50 kg. Use only with direct adult supervision on smooth, level, traffic-free surfaces. The child should wear shoes. Never use near roads, stairs, slopes or pools, and never tow it behind a vehicle.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. At handover, check the steering, horn, wheels and body condition together with our team before use.",
        care_note: "Return the ride-on dry and reasonably clean. Do not leave it in standing water, expose it to excessive heat or modify the steering, wheels, body or couplings.",
        seo_title: "BIG Bobby Car Rental Valencia | Classic Ocean",
        seo_description: "Rent a BIG Bobby Car Classic Ocean in Valencia for supervised toddler play. Suitable from 12 months on smooth, level, traffic-free surfaces.",
      },
      es: {
        short_description: "Alquila un BIG Bobby Car Classic Ocean en Valencia para que los más pequeños jueguen bajo supervisión en el alojamiento, una terraza privada u otra superficie lisa, llana y sin tráfico.",
        detail_description: "El BIG Bobby Car Classic Ocean permite que los niños disfruten de un correpasillos conocido sin que la familia tenga que transportarlo durante su estancia en Valencia. BIG recomienda este modelo desde los 12 meses. Su centro de gravedad bajo, carrocería ergonómica, volante antideslizante y dirección Ackermann continua facilitan las maniobras sobre superficies lisas y llanas, mientras que la bocina mecánica y el diseño marino hacen el juego más entretenido. Las cuatro ruedas de plástico son resistentes a la abrasión, y los enganches delantero y trasero admiten accesorios BIG compatibles. También incorpora un hueco para las rodillas de los niños mayores. Montado mide 58 × 30 × 38 cm y soporta una carga máxima de 50 kg según el fabricante. Está pensado para un solo niño y debe utilizarse siempre bajo supervisión directa de un adulto, lejos de carreteras, escaleras, pendientes, piscinas y otros peligros.",
        includes_text: "Un correpasillos BIG Bobby Car Classic Ocean con volante, bocina mecánica y cuatro ruedas instaladas. El remolque, la barra de empuje, la cuerda y otros accesorios solo se incluyen si figuran en la reserva.",
        constraints_text: "Para un niño desde 12 meses y hasta 50 kg. Utilizar únicamente bajo supervisión directa de un adulto sobre superficies lisas, llanas y sin tráfico. El niño debe llevar calzado. No usar cerca de carreteras, escaleras, pendientes o piscinas ni remolcar detrás de un vehículo.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia durante la reserva. En la entrega, revisa con nuestro equipo la dirección, la bocina, las ruedas y el estado de la carrocería.",
        care_note: "Devuelve el correpasillos seco y razonablemente limpio. No lo dejes en agua estancada, no lo expongas a calor excesivo y no modifiques la dirección, las ruedas, la carrocería ni los enganches.",
        seo_title: "Alquiler BIG Bobby Car Valencia | Classic Ocean",
        seo_description: "Alquila un BIG Bobby Car Classic Ocean en Valencia para juego infantil supervisado. Desde 12 meses, en superficies lisas, llanas y sin tráfico.",
      },
    },
    faqs: {
      en: [
        ["What age is the BIG Bobby Car suitable for?", "BIG recommends the Classic Ocean from 12 months. A parent or guardian should also confirm that the child can sit and move safely on a ride-on toy."],
        ["What is the maximum permitted weight?", "The manufacturer states a maximum load of 50 kg. Only one child may use the ride-on at a time."],
        ["Can it be used outdoors?", "Yes, on smooth, level, traffic-free surfaces with direct adult supervision. Do not use it near roads, stairs, steep slopes, pools or other hazards."],
        ["Does the rental include a trailer or push handle?", "No, not unless that accessory is specifically listed in your booking. The car has front and rear couplings for compatible BIG accessories."],
        ["Can it be delivered to our Valencia accommodation?", "Delivery may be available depending on your address and dates. The available pickup and delivery choices are shown during the booking process."],
      ],
      es: [
        ["¿Para qué edad es adecuado el BIG Bobby Car?", "BIG recomienda el Classic Ocean desde los 12 meses. La familia también debe comprobar que el niño puede sentarse y desplazarse con seguridad en un correpasillos."],
        ["¿Cuál es el peso máximo permitido?", "El fabricante indica una carga máxima de 50 kg. Solo puede utilizarlo un niño cada vez."],
        ["¿Se puede utilizar en el exterior?", "Sí, sobre superficies lisas, llanas y sin tráfico, siempre bajo supervisión directa de un adulto. No usar cerca de carreteras, escaleras, pendientes pronunciadas, piscinas u otros peligros."],
        ["¿El alquiler incluye remolque o barra de empuje?", "No, salvo que el accesorio aparezca expresamente en la reserva. El coche dispone de enganches delantero y trasero para accesorios BIG compatibles."],
        ["¿Podéis entregarlo en nuestro alojamiento de Valencia?", "La entrega puede estar disponible según la dirección y las fechas. Las opciones de recogida y entrega disponibles aparecen durante la reserva."],
      ],
    },
  },
  {
    id: "b0aa243a-83d6-440c-ab17-ed2fc8debcb8",
    slug: "g3-reef-580-roof-box",
    name: "G3 Reef 580 Roof Box",
    brand: "G3",
    description: "A G3 Reef 580 dual-opening roof box with approximately 460 litres of retail-rated capacity, available only after vehicle, roof-bar, load and physical safety checks.",
    features: [
      "Approximately 460 L retail-rated capacity",
      "Dual-side opening",
      "Maximum box load rating 75 kg",
      "Internal load straps and central locks subject to handover check",
      "Weather-resistant, UV-stabilised shell",
      "Mandatory vehicle and roof-bar compatibility review",
    ],
    specs: {
      Brand: "G3",
      Model: "Reef 580",
      "Retail-rated capacity": "460 L",
      "ADAC measured usable volume": "440 L",
      Dimensions: "Approximately 198.5 × 89 × 39.5 cm",
      "Empty weight": "Approximately 16 kg",
      "Maximum box load": "75 kg, subject to the lower vehicle and roof-bar limits",
      Opening: "Dual side",
      Locks: "Two central key locks; verify physical unit at handover",
      "Independent safety note": "ADAC 2020 crash-safety score 4.0 (sufficient/poor result requiring strict inspection)",
    },
    meta_title: "G3 Reef 580 Roof Box Rental Valencia",
    meta_description: "Rent a G3 Reef 580 roof box in Valencia after vehicle and roof-bar compatibility checks. Approx. 460 L capacity with dual-side opening.",
    image_alt: "Black G3 Reef 580 car roof box with dual-side opening",
    image_source: null,
    localizations: {
      en: {
        short_description: "Rent a G3 Reef 580 roof box in Valencia for additional luggage space, subject to mandatory vehicle, roof-bar, mounting, load and physical-condition checks before handover.",
        detail_description: "The G3 Reef 580 is a long, dual-opening roof box intended to add luggage capacity for road trips from Valencia. Retail specifications describe approximately 460 litres of capacity, external dimensions around 198.5 × 89 × 39.5 cm, an empty weight of about 16 kg and a maximum box load rating of 75 kg. The safe permitted load is always the lowest limit set by the box, vehicle roof and roof bars, after accounting for the box weight. This model requires a compatibility review covering the exact vehicle, roof-bar system, bar spacing, mounting hardware, lock operation and total vehicle height. An independent ADAC test in 2020 measured 440 litres of usable volume and downgraded the model after failures in the city-crash test. For that reason, RentAnything will not release this unit without a documented physical inspection of the shell, hinges, locks, fasteners, mounting points and internal restraint straps.",
        includes_text: "G3 Reef 580 roof box. Keys, internal straps and mounting hardware are included only after the complete physical kit is checked and recorded in the handover documentation. Roof bars are not included unless explicitly listed.",
        constraints_text: "Booking is provisional until we confirm the vehicle, roof bars, bar spacing, mounting hardware and dynamic roof-load limit. The maximum cargo weight is the lowest applicable vehicle, bar or box limit after subtracting the approximately 16 kg box weight. This model is subject to an enhanced safety inspection because of its ADAC 2020 crash-test result.",
        delivery_setup_note: "Send the vehicle make, model, year, roof type and exact roof-bar model before booking. Fitting and removal arrangements must be agreed in advance; the customer must not improvise fasteners or mounting positions.",
        care_note: "Distribute luggage evenly, secure every load with the internal straps and keep the box locked while travelling. Recheck all fixings after initial driving and during the trip. Observe the vehicle, roof-bar and box instructions, speed guidance and increased vehicle height.",
        seo_title: "G3 Reef 580 Roof Box Rental Valencia",
        seo_description: "Rent a G3 Reef 580 roof box in Valencia after vehicle and roof-bar compatibility checks. Approx. 460 L capacity with dual-side opening.",
      },
      es: {
        short_description: "Alquila un cofre de techo G3 Reef 580 en Valencia para ganar espacio de equipaje, sujeto a comprobaciones obligatorias del vehículo, las barras, el montaje, la carga y el estado físico.",
        detail_description: "El G3 Reef 580 es un cofre de techo alargado con apertura por ambos lados, pensado para ampliar el espacio de equipaje en viajes por carretera desde Valencia. Las especificaciones comerciales indican unos 460 litros de capacidad, dimensiones exteriores aproximadas de 198,5 × 89 × 39,5 cm, un peso en vacío cercano a 16 kg y una carga máxima del cofre de 75 kg. La carga segura siempre será el límite más bajo entre el cofre, el techo del vehículo y las barras, descontando el peso del propio cofre. Este modelo exige revisar el vehículo exacto, el sistema y separación de las barras, los herrajes, las cerraduras y la altura total. En 2020, una prueba independiente de ADAC midió 440 litros útiles y rebajó la valoración tras fallos en el ensayo de choque urbano. Por ello, RentAnything no entregará esta unidad sin inspeccionar y documentar carcasa, bisagras, cerraduras, fijaciones, puntos de montaje y correas interiores.",
        includes_text: "Cofre de techo G3 Reef 580. Las llaves, correas interiores y piezas de montaje solo se incluyen después de comprobar y registrar el kit físico completo. Las barras de techo no se incluyen salvo indicación expresa en la reserva.",
        constraints_text: "La reserva es provisional hasta confirmar vehículo, barras, separación, herrajes y carga dinámica permitida del techo. La carga máxima será el menor límite aplicable después de descontar los aproximadamente 16 kg del cofre. Este modelo requiere una inspección reforzada por el resultado ADAC de 2020.",
        delivery_setup_note: "Envía antes de reservar la marca, modelo y año del vehículo, el tipo de techo y el modelo exacto de las barras. El montaje y desmontaje deben acordarse previamente; no se pueden improvisar fijaciones ni posiciones de montaje.",
        care_note: "Distribuye el equipaje, sujeta toda la carga con las correas interiores y mantén el cofre cerrado durante el viaje. Revisa las fijaciones después de los primeros kilómetros y durante la ruta. Respeta las instrucciones, la velocidad recomendada y la mayor altura del vehículo.",
        seo_title: "Alquiler Cofre de Techo G3 Reef 580 Valencia",
        seo_description: "Alquila un cofre G3 Reef 580 en Valencia tras comprobar vehículo y barras. Capacidad aproximada de 460 L y apertura por ambos lados.",
      },
    },
    faqs: {
      en: [
        ["Will the G3 Reef 580 fit my car?", "Compatibility cannot be assumed. Send the vehicle make, model, year, roof type and exact roof-bar model so we can review the mounting system, bar spacing and roof-load limit."],
        ["Does the name mean it holds 580 litres?", "No. Retail specifications commonly state about 460 litres, while ADAC measured 440 litres of usable volume. We do not market it as a 580-litre box."],
        ["How much luggage can I load?", "The box is rated up to 75 kg, but the safe limit is the lowest permitted by the vehicle, roof bars and box after subtracting the box's approximately 16 kg empty weight."],
        ["Why does this product require an enhanced inspection?", "ADAC's 2020 test downgraded the Reef 580 after the closure and mounting eyes failed in the city-crash test. We therefore inspect the complete physical unit and may decline release if anything is uncertain."],
        ["Are roof bars and fitting included?", "Roof bars are included only if explicitly listed. Keys, straps, mounting parts and fitting arrangements must all be confirmed and documented before handover."],
      ],
      es: [
        ["¿El G3 Reef 580 es compatible con mi coche?", "No se puede dar por hecho. Envíanos marca, modelo y año del vehículo, tipo de techo y modelo exacto de barras para revisar montaje, separación y carga permitida."],
        ["¿El nombre significa que tiene 580 litros?", "No. Las especificaciones comerciales suelen indicar unos 460 litros y ADAC midió 440 litros útiles. No lo presentamos como un cofre de 580 litros."],
        ["¿Cuánto equipaje puedo cargar?", "El cofre admite hasta 75 kg, pero el límite seguro será el menor permitido por el vehículo, las barras y el cofre después de descontar sus aproximadamente 16 kg de peso."],
        ["¿Por qué requiere una inspección reforzada?", "La prueba ADAC de 2020 rebajó el Reef 580 después de fallos en el cierre y los puntos de fijación durante el ensayo de choque urbano. Revisamos toda la unidad y podemos rechazar la entrega si existe cualquier duda."],
        ["¿Se incluyen las barras y el montaje?", "Las barras solo se incluyen si aparecen expresamente en la reserva. Las llaves, correas, piezas de montaje y condiciones de instalación deben confirmarse y documentarse antes de la entrega."],
      ],
    },
  },
  {
    id: "4064fce0-edde-4853-a643-7178aecffb2a",
    slug: "thule-proride-598-roof-bike-carrier",
    name: "Thule ProRide 598 Roof Bike Carrier",
    brand: "Thule",
    description: "A Thule ProRide 598 upright roof bike carrier for one bicycle up to 20 kg, available after confirming the vehicle, roof bars, bicycle frame, wheels and required adapters.",
    features: [
      "Upright transport for one bicycle up to 20 kg",
      "Torque-limiter frame holder",
      "Diagonal quick-release wheel straps",
      "Tool-free switching between vehicle sides",
      "Bike-to-carrier and carrier-to-roof-bar locks",
      "Mandatory roof-bar, frame, wheel and adapter compatibility check",
    ],
    specs: {
      Brand: "Thule",
      Model: "ProRide 598",
      "Model number": "598001",
      "Bike capacity": "1 bicycle",
      "Maximum bike weight": "20 kg",
      "Carrier dimensions": "145 × 32 × 8.5 cm",
      "Carrier weight": "4.2 kg",
      "Round frame diameter": "22–80 mm",
      "Maximum oval frame": "80 × 100 mm",
      "Wheel size": "16–32 in",
      "Maximum tyre width": "3 in without fat-bike adapter",
      "Maximum wheelbase": "1,235 mm",
      "Carbon frames": "Require Thule Carbon Frame Protector",
    },
    meta_title: "Thule ProRide 598 Bike Rack Rental Valencia",
    meta_description: "Rent a Thule ProRide 598 roof bike carrier in Valencia for one bike up to 20 kg, after vehicle, roof-bar, frame and wheel compatibility checks.",
    image_alt: "Thule ProRide 598 upright roof bike carrier in black and aluminium",
    image_source: "https://www.thule.com/es-es/bike-rack/roof-bike-racks/thule-proride-_-598001",
    localizations: {
      en: {
        short_description: "Rent a Thule ProRide 598 upright roof bike carrier in Valencia for one bicycle up to 20 kg, subject to vehicle, roof-bar, frame, wheel and adapter compatibility checks.",
        detail_description: "The Thule ProRide 598 carries one bicycle upright on a compatible vehicle roof-bar system. Its torque-limiter frame holder signals when the frame clamp reaches the intended pressure, while diagonal quick-release straps secure the wheels. The carrier can switch from one side of the vehicle to the other without tools and includes locks for the bicycle and carrier, although no lock removes all theft risk. Thule specifies a maximum bicycle weight of 20 kg, round frame tubes from 22 to 80 mm, oval tubes up to 80 × 100 mm, wheels from 16 to 32 inches, tyres up to 3 inches and a maximum wheelbase of 1,235 mm. Carbon frames require the Thule Carbon Frame Protector, fat bikes need the relevant adapter, and some roof-bar profiles require separate mounting adapters. We confirm the complete vehicle, bar and bicycle setup before accepting the booking.",
        includes_text: "One Thule ProRide 598 carrier with its fitted frame holder, wheel trays, wheel straps and standard locks. Roof bars, carbon-frame protector, fat-bike adapter, SquareBar adapter and T-track adapters are included only when explicitly listed.",
        constraints_text: "One bicycle only, maximum 20 kg. Compatibility depends on the roof bars, frame material and dimensions, wheelbase, wheel size and tyre width. Carbon frames and non-standard bars require the correct approved adapter. We may decline the rental if the setup cannot be confirmed.",
        delivery_setup_note: "Send the vehicle make, model and year, roof-bar make and profile, plus bicycle type, weight, frame material, tube dimensions, wheelbase, wheel size and tyre width. Fitting and removal arrangements must be agreed before handover.",
        care_note: "Follow the Thule fitting instructions, tighten only until the torque limiter confirms the clamp force, secure both wheels and check all fixings before every journey. Recheck after initial driving, observe increased vehicle height and do not rely on the supplied locks as a complete theft guarantee.",
        seo_title: "Thule ProRide 598 Bike Rack Rental Valencia",
        seo_description: "Rent a Thule ProRide 598 roof bike carrier in Valencia for one bike up to 20 kg, after vehicle, roof-bar, frame and wheel compatibility checks.",
      },
      es: {
        short_description: "Alquila un portabicicletas de techo Thule ProRide 598 en Valencia para una bicicleta de hasta 20 kg, sujeto a comprobar vehículo, barras, cuadro, ruedas y adaptadores.",
        detail_description: "El Thule ProRide 598 transporta una bicicleta en posición vertical sobre un sistema de barras de techo compatible. El sujetacuadros con limitador de par indica cuándo alcanza la presión prevista, mientras que las correas diagonales de liberación rápida fijan las ruedas. El soporte puede cambiarse de un lado a otro del vehículo sin herramientas e incluye cerraduras para la bicicleta y el propio portabicicletas, aunque ninguna cerradura elimina por completo el riesgo de robo. Thule especifica una bicicleta de hasta 20 kg, cuadros redondos de 22 a 80 mm, cuadros ovalados de hasta 80 × 100 mm, ruedas de 16 a 32 pulgadas, neumáticos de hasta 3 pulgadas y una distancia entre ejes máxima de 1.235 mm. Los cuadros de carbono requieren el protector Thule, las fat bikes necesitan el adaptador correspondiente y algunos perfiles de barra exigen adaptadores adicionales. Confirmamos todo el conjunto antes de aceptar la reserva.",
        includes_text: "Un Thule ProRide 598 con sujetacuadros, carriles de rueda, correas y cerraduras estándar instaladas. Las barras, el protector para carbono y los adaptadores para fat bike, SquareBar o raíles T solo se incluyen si figuran expresamente.",
        constraints_text: "Una sola bicicleta y máximo 20 kg. La compatibilidad depende de las barras, material y medidas del cuadro, distancia entre ejes, tamaño de rueda y anchura del neumático. Los cuadros de carbono y barras no estándar requieren el adaptador aprobado. Podemos rechazar la reserva si no se confirma el montaje.",
        delivery_setup_note: "Envía marca, modelo y año del vehículo, marca y perfil de las barras, además del tipo y peso de bicicleta, material y medidas del cuadro, distancia entre ejes, rueda y neumático. El montaje y desmontaje deben acordarse antes de la entrega.",
        care_note: "Sigue las instrucciones de Thule, aprieta solo hasta que el limitador confirme la presión, fija ambas ruedas y revisa todo antes de cada trayecto. Comprueba de nuevo tras los primeros kilómetros, recuerda la mayor altura del vehículo y no consideres las cerraduras una garantía total antirrobo.",
        seo_title: "Alquiler Thule ProRide 598 Valencia | Portabicis",
        seo_description: "Alquila un Thule ProRide 598 en Valencia para una bicicleta de hasta 20 kg, tras comprobar vehículo, barras, cuadro, ruedas y adaptadores.",
      },
    },
    faqs: {
      en: [
        ["Will the Thule ProRide 598 fit my car?", "We need the vehicle and exact roof-bar details before confirming. Some bar profiles fit directly while others require an approved Thule adapter."],
        ["What bicycles can it carry?", "Thule states one bicycle up to 20 kg, with round frame tubes of 22–80 mm, oval tubes up to 80 × 100 mm, wheels of 16–32 inches, tyres up to 3 inches and a maximum 1,235 mm wheelbase."],
        ["Can it carry a carbon-frame bicycle?", "Only with the Thule Carbon Frame Protector and after we confirm the exact frame. Never clamp a carbon frame without the required approved protection."],
        ["Can it carry a fat bike or e-bike?", "A fat bike requires the appropriate Thule adapter. An e-bike is possible only if it weighs no more than 20 kg and all frame, wheel and vehicle limits are met; many e-bikes are too heavy."],
        ["Are locks included?", "Standard locks secure the bicycle to the carrier and the carrier to the roof bars. They reduce theft risk but do not provide a complete guarantee, so additional precautions may be appropriate."],
      ],
      es: [
        ["¿El Thule ProRide 598 es compatible con mi coche?", "Necesitamos los datos del vehículo y de las barras exactas. Algunos perfiles son compatibles directamente y otros necesitan un adaptador Thule aprobado."],
        ["¿Qué bicicletas puede transportar?", "Thule indica una bicicleta de hasta 20 kg, cuadros redondos de 22–80 mm, ovalados hasta 80 × 100 mm, ruedas de 16–32 pulgadas, neumáticos hasta 3 pulgadas y distancia entre ejes máxima de 1.235 mm."],
        ["¿Puede transportar una bicicleta de carbono?", "Solo con el protector Thule Carbon Frame Protector y después de confirmar el cuadro exacto. Nunca se debe sujetar un cuadro de carbono sin la protección aprobada requerida."],
        ["¿Sirve para fat bike o bicicleta eléctrica?", "Una fat bike necesita el adaptador Thule correspondiente. Una bicicleta eléctrica solo es posible si pesa como máximo 20 kg y cumple todos los límites; muchas pesan demasiado."],
        ["¿Incluye cerraduras?", "Las cerraduras estándar fijan la bicicleta al soporte y el soporte a las barras. Reducen el riesgo de robo, pero no ofrecen una garantía total, por lo que pueden ser necesarias precauciones adicionales."],
      ],
    },
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query("begin");
    const results = [];

    for (const product of products) {
      const existing = await client.query(
        "select id, slug, is_active, content_status, stock_total from products where id = $1 for update",
        [product.id],
      );
      if (existing.rowCount !== 1 || existing.rows[0].slug !== product.slug) {
        throw new Error(`Expected product was not found: ${product.slug}`);
      }

      await client.query(
        `update products set name = $2, brand = $3, description = $4, features = $5::jsonb,
           specs = $6::jsonb, meta_title = $7, meta_description = $8 where id = $1`,
        [product.id, product.name, product.brand, product.description, JSON.stringify(product.features),
          JSON.stringify(product.specs), product.meta_title, product.meta_description],
      );

      for (const [locale, localization] of Object.entries(product.localizations)) {
        await client.query(
          `insert into product_localizations
            (product_id, locale, short_description, detail_description, includes_text, constraints_text,
             delivery_setup_note, care_note, seo_title, seo_description, updated_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
           on conflict (product_id, locale) do update set
             short_description = excluded.short_description,
             detail_description = excluded.detail_description,
             includes_text = excluded.includes_text,
             constraints_text = excluded.constraints_text,
             delivery_setup_note = excluded.delivery_setup_note,
             care_note = excluded.care_note,
             seo_title = excluded.seo_title,
             seo_description = excluded.seo_description,
             updated_at = now()`,
          [product.id, locale, localization.short_description, localization.detail_description,
            localization.includes_text, localization.constraints_text, localization.delivery_setup_note,
            localization.care_note, localization.seo_title, localization.seo_description],
        );
      }

      await client.query("delete from product_faqs where product_id = $1", [product.id]);
      for (const [locale, items] of Object.entries(product.faqs)) {
        for (const [sortOrder, [question, answer]] of items.entries()) {
          await client.query(
            "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1,$2,$3,$4,$5)",
            [product.id, locale, question, answer, sortOrder],
          );
        }
      }

      const imageUpdate = product.image_source
        ? "update product_images set alt_text = $2, source_url = $3 where product_id = $1 and is_primary = true"
        : "update product_images set alt_text = $2 where product_id = $1 and is_primary = true";
      const imageValues = product.image_source
        ? [product.id, product.image_alt, product.image_source]
        : [product.id, product.image_alt];
      await client.query(imageUpdate, imageValues);

      results.push({
        slug: product.slug,
        preserved: existing.rows[0],
        localizations: Object.keys(product.localizations).length,
        faqs: Object.values(product.faqs).flat().length,
      });
    }

    await client.query("commit");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
