const { Client } = require("pg");

process.loadEnvFile(".env.local");

const applyChanges = process.argv.includes("--apply");

const products = [
  {
    slug: "bladeless-fan-ventilator",
    status: "facts_verified",
    sourceUrl: "https://es.dreametech.com/products/ventilador-sin-aspas-mf10",
    description: "A Dreame MF10 bladeless fan for circulating air around an apartment during a warm Valencia stay, with ten speed levels and flexible controls.",
    features: [
      "270-degree spatial airflow using two independently rotating GyroWing outlets",
      "Ten speed levels",
      "Automatic horizontal and vertical oscillation",
      "Touchscreen, magnetic remote, Dreamehome app and compatible voice control",
      "Temperature-responsive TempSync mode",
      "Removable, washable air-intake filter",
      "55 W rated power",
    ],
    specs: {
      Model: "Dreame MF10",
      Power: "55 W",
      Weight: "6.3 kg",
      "Oscillation angle": "180 degrees horizontal, 90 degrees vertical",
      "Speed levels": "10",
      "Power cable": "1.8 m",
      Dimensions: "375 x 270 x 1012 mm",
    },
    localizations: {
      en: {
        short_description: "Rent a Dreame MF10 bladeless fan for flexible airflow and local delivery during a warm stay in Valencia.",
        detail_description: "The Dreame MF10 is a freestanding bladeless fan designed to circulate air around a room. Its two GyroWing outlets provide horizontal and vertical oscillation, with ten speed levels and control from the touchscreen, magnetic remote, Dreamehome app or a compatible voice assistant. TempSync can adjust airflow in response to room temperature. This is a fan rather than an air conditioner, so it circulates air but does not actively lower the room temperature.",
        includes_text: "Dreame MF10 fan, magnetic remote control, user manual and installation kit. We confirm the exact handover contents before delivery.",
        constraints_text: "This fan does not refrigerate the air. App and voice features require a suitable local network, account and compatible device. Place the unit on a stable indoor surface with its inlet and outlets clear.",
        delivery_setup_note: "We deliver in Valencia and confirm placement, access to a suitable socket and the control method you plan to use.",
        care_note: "Keep the air inlet and outlets clear, use the removable washable intake filter as instructed, and disconnect the fan before cleaning or moving it.",
        seo_title: "Dreame MF10 Fan Rental in Valencia",
        seo_description: "Rent a Dreame MF10 bladeless fan in Valencia for adjustable apartment airflow, with local delivery and setup guidance.",
      },
      es: {
        short_description: "Alquila un ventilador sin aspas Dreame MF10 para mejorar la circulación del aire durante una estancia cálida en Valencia.",
        detail_description: "El Dreame MF10 es un ventilador sin aspas de pie diseñado para hacer circular el aire por una habitación. Sus dos salidas GyroWing permiten oscilación horizontal y vertical, con diez niveles de velocidad y control desde la pantalla táctil, el mando magnético, la app Dreamehome o un asistente de voz compatible. TempSync puede adaptar el caudal a la temperatura ambiente. Es un ventilador, no un aire acondicionado: mueve el aire, pero no reduce activamente la temperatura de la habitación.",
        includes_text: "Ventilador Dreame MF10, mando magnético, manual de usuario y kit de instalación. Confirmamos el contenido exacto antes de la entrega.",
        constraints_text: "No refrigera el aire. Las funciones de app y voz requieren una red local, una cuenta y un dispositivo compatibles. Colócalo en una superficie interior estable y deja libres la entrada y las salidas de aire.",
        delivery_setup_note: "Entregamos en Valencia y confirmamos la ubicación, una toma adecuada y el método de control que quieras utilizar.",
        care_note: "Mantén libres la entrada y las salidas, limpia el filtro desmontable según las instrucciones y desconecta el ventilador antes de limpiarlo o moverlo.",
        seo_title: "Alquiler ventilador Dreame MF10 en Valencia",
        seo_description: "Alquila un ventilador sin aspas Dreame MF10 en Valencia, con entrega local, caudal regulable y ayuda de instalación.",
      },
    },
    faqs: {
      en: [
        ["Does the Dreame MF10 cool the room like air conditioning?", "No. It circulates room air to improve comfort, but it does not refrigerate or actively lower the room temperature."],
        ["How can I control the fan?", "Dreame lists touchscreen, magnetic remote, Dreamehome app and compatible voice-assistant control. App and voice features depend on the local network and compatible devices."],
        ["What is included?", "Dreame lists the fan, magnetic remote, user manual and installation kit. We confirm the exact handover contents in your booking."],
        ["Is it suitable for sleeping?", "It offers adjustable speed and temperature-responsive modes. Comfort and perceived noise vary, so we avoid promising silent operation."],
      ],
      es: [
        ["¿Enfría la habitación como un aire acondicionado?", "No. Hace circular el aire de la habitación para mejorar el confort, pero no refrigera ni reduce activamente la temperatura."],
        ["¿Cómo se controla el ventilador?", "Dreame indica control mediante pantalla táctil, mando magnético, app Dreamehome y asistentes de voz compatibles. La app y la voz dependen de la red y de dispositivos compatibles."],
        ["¿Qué incluye?", "Dreame indica ventilador, mando magnético, manual de usuario y kit de instalación. Confirmamos el contenido exacto en la reserva."],
        ["¿Es adecuado para dormir?", "Ofrece velocidad regulable y modos que responden a la temperatura. El confort y el ruido percibido varían, por lo que no prometemos un funcionamiento silencioso."],
      ],
    },
  },
  {
    slug: "thule-chariot-sport-1-bike-trailer",
    status: "facts_verified",
    sourceUrl: "https://www.thule.com/-/s/approved/std.lang.all/00/39/560039.pdf",
    description: "A one-seat Thule Chariot Sport multisport carrier for family rides and walks in Valencia, with an adjustable suspension and hand-operated disc brake.",
    features: [
      "One-child multisport carrier",
      "Cycling and strolling configurations",
      "Reclining padded seat",
      "Adjustable leaf-spring suspension",
      "Hand-operated disc brake",
      "Adjustable ventilation and sunshade",
      "Compact fold and onboard kit storage",
      "34 kg maximum carrier capacity",
    ],
    specs: {
      "Number of children": "1",
      "Maximum child weight": "22 kg",
      "Maximum carrier capacity": "34 kg",
      Weight: "14 kg",
      Suspension: "Adjustable",
      "Reclining seat": "Yes",
      "Safety harness": "5-point",
    },
    localizations: {
      en: {
        short_description: "Rent a one-seat Thule Chariot Sport bike trailer and stroller for family outings around Valencia.",
        detail_description: "The Thule Chariot Sport is a one-seat multisport child carrier that can be configured for cycling or strolling. It combines a reclining padded seat, adjustable suspension, ventilation, sun protection, cargo space and a hand-operated disc brake. The fitted activity kit, bicycle compatibility and child suitability must be checked before each handover; jogging use is available only when the correct Thule running kit is included and fitted.",
        includes_text: "One-seat Thule Chariot Sport carrier plus the cycling or strolling parts confirmed in your booking. Running and other activity kits are included only when explicitly listed.",
        constraints_text: "Maximum child weight is 22 kg and maximum carrier capacity is 34 kg. Suitability also depends on the child's age and development, the fitted activity kit, bicycle compatibility and current manufacturer instructions. A helmet is required for the child while cycling.",
        delivery_setup_note: "We confirm the intended activity, bicycle and axle compatibility, fitted kit, harness adjustment and a safe handover location in Valencia.",
        care_note: "Return the carrier dry and reasonably clean. Do not modify the frame or coupling, and stop using it if the harness, brake, wheels, hitch or fabric shows damage.",
        seo_title: "Thule Chariot Bike Trailer Rental Valencia",
        seo_description: "Rent a one-seat Thule Chariot bike trailer in Valencia, with local delivery and a compatibility and setup check before handover.",
      },
      es: {
        short_description: "Alquila un remolque y carrito Thule Chariot Sport de una plaza para paseos familiares por Valencia.",
        detail_description: "El Thule Chariot Sport es un portaniños multideporte de una plaza que puede configurarse para ciclismo o paseo. Combina asiento reclinable y acolchado, suspensión ajustable, ventilación, protección solar, espacio de carga y freno de disco accionado a mano. Antes de cada entrega comprobamos el kit instalado, la compatibilidad con la bicicleta y la idoneidad para el menor; el uso para correr solo está disponible cuando el kit Thule correspondiente está incluido e instalado.",
        includes_text: "Portaniños Thule Chariot Sport de una plaza y las piezas para ciclismo o paseo indicadas en la reserva. Los kits para correr u otras actividades solo se incluyen cuando figuran expresamente.",
        constraints_text: "El peso máximo del menor es de 22 kg y la capacidad máxima total es de 34 kg. La idoneidad también depende de la edad y desarrollo del menor, el kit instalado, la compatibilidad con la bicicleta y las instrucciones vigentes del fabricante. El menor debe llevar casco durante el uso en bicicleta.",
        delivery_setup_note: "Confirmamos la actividad prevista, la compatibilidad de la bicicleta y el eje, el kit instalado, el ajuste del arnés y un lugar seguro de entrega en Valencia.",
        care_note: "Devuelve el carrito seco y razonablemente limpio. No modifiques el chasis ni el enganche y deja de usarlo si observas daños en arnés, freno, ruedas, acoplamiento o tejido.",
        seo_title: "Alquiler remolque bici Thule Chariot Valencia",
        seo_description: "Alquila un remolque de bicicleta Thule Chariot de una plaza en Valencia, con entrega local y comprobación de compatibilidad y montaje.",
      },
    },
    faqs: {
      en: [
        ["Can I use it for cycling and walking?", "Yes, with the correct fitted kit. We confirm the intended activity and include only the parts listed in your booking."],
        ["Is the jogging kit included?", "Only when it is explicitly listed in the booking. Running requires the correct Thule kit to be fitted; the small strolling wheels are not a substitute."],
        ["Will it fit my bicycle?", "Compatibility depends on the bicycle and rear axle. We check the bike details and the required Thule hitch or adapter before handover."],
        ["What are the weight limits?", "The recorded limits are 22 kg maximum child weight and 34 kg maximum total carrier capacity. The current manufacturer instructions and the child's suitability still apply."],
      ],
      es: [
        ["¿Puedo usarlo para bicicleta y paseo?", "Sí, con el kit correcto instalado. Confirmamos la actividad prevista y solo incluimos las piezas indicadas en la reserva."],
        ["¿Está incluido el kit para correr?", "Solo cuando figura expresamente en la reserva. Para correr debe instalarse el kit Thule correspondiente; las ruedas pequeñas de paseo no lo sustituyen."],
        ["¿Es compatible con mi bicicleta?", "Depende de la bicicleta y del eje trasero. Comprobamos los datos y el enganche o adaptador Thule necesario antes de la entrega."],
        ["¿Cuáles son los límites de peso?", "Los límites registrados son 22 kg para el menor y 34 kg de capacidad total. También se aplican las instrucciones vigentes del fabricante y la idoneidad del menor."],
      ],
    },
  },
];

async function upsertLocalization(client, productId, locale, values) {
  const columns = Object.keys(values);
  const params = [productId, locale, ...columns.map((column) => values[column])];
  const updates = columns.map((column) => `${column} = excluded.${column}`).join(", ");
  await client.query(
    `insert into product_localizations (product_id, locale, ${columns.join(", ")}, updated_at)
     values ($1, $2, ${columns.map((_, index) => `$${index + 3}`).join(", ")}, now())
     on conflict (product_id, locale) do update set ${updates}, updated_at = now()`,
    params,
  );
}

async function main() {
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query("begin");

    await client.query(
      "update products set content_status = 'content_ready', updated_at = now() where slug = $1",
      ["mobile-airconditioner-delonghi-pinguino-compact-classic"],
    );

    for (const product of products) {
      const result = await client.query("select id, image_url from products where slug = $1 for update", [product.slug]);
      if (result.rowCount !== 1) throw new Error(`Expected one product for ${product.slug}`);
      const { id, image_url } = result.rows[0];

      await client.query(
        `update products set description = $2, features = $3::jsonb, specs = $4::jsonb,
           content_status = $5, updated_at = now() where id = $1`,
        [id, product.description, JSON.stringify(product.features), JSON.stringify(product.specs), product.status],
      );

      for (const [locale, values] of Object.entries(product.localizations)) {
        await upsertLocalization(client, id, locale, values);
      }

      await client.query("delete from product_faqs where product_id = $1", [id]);
      let sortOrder = 0;
      for (const [locale, entries] of Object.entries(product.faqs)) {
        for (const [question, answer] of entries) {
          await client.query(
            "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1, $2, $3, $4, $5)",
            [id, locale, question, answer, sortOrder++],
          );
        }
      }

      await client.query("delete from product_images where product_id = $1 and is_primary = true", [id]);
      await client.query(
        `insert into product_images (product_id, image_url, alt_text, source_url, rights_status, is_primary, sort_order)
         values ($1, $2, $3, $4, 'unknown', true, 0)`,
        [id, image_url, `${product.slug === "bladeless-fan-ventilator" ? "Dreame MF10 bladeless fan" : "Thule Chariot Sport one-seat child bike trailer"}`, product.sourceUrl],
      );
    }

    if (applyChanges) await client.query("commit");
    else await client.query("rollback");
    console.log(JSON.stringify({ mode: applyChanges ? "applied" : "dry-run", products: ["mobile-airconditioner-delonghi-pinguino-compact-classic", ...products.map((product) => product.slug)] }, null, 2));
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
