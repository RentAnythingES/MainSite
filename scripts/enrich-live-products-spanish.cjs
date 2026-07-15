/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const applyChanges = process.argv.includes("--apply");
const products = [
  {
    slug: "compact-stroller",
    localization: {
      short_description: "Silla de paseo ligera y plegable con una mano, ideal para recorrer el centro histórico y los paseos marítimos de Valencia.",
      detail_description: "Esta silla de paseo Kinderkraft pesa 7,5 kg, admite hasta 22 kg y se pliega hasta 54 × 44 × 28 cm. Incluye asiento reclinable, capota UV, arnés de cinco puntos, cesta, protector de lluvia y portavasos.",
      includes_text: "Silla de paseo, protector de lluvia y portavasos.",
      constraints_text: "Indicada aproximadamente de 6 meses a 3 años, con un peso máximo de 22 kg. Utiliza siempre el arnés y el freno cuando esté parada.",
      delivery_setup_note: "En la entrega explicamos el plegado, el freno, el arnés y el ajuste del asiento.",
      care_note: "Devuélvela sin restos importantes de comida o arena y evita colgar bolsas pesadas del manillar.",
      seo_title: "Alquiler de silla de paseo compacta en Valencia",
      seo_description: "Alquila una silla de paseo compacta Kinderkraft en Valencia, ligera, plegable con una mano y con protector de lluvia incluido.",
    },
    faqs: [
      ["¿Puedo llevar esta silla en el autobús y el metro de Valencia?", "Sí. Su plegado compacto facilita el acceso y almacenamiento. Los autobuses EMT y el metro disponen de opciones de accesibilidad, aunque conviene evitar las horas de mayor afluencia."],
      ["¿Sirve para las calles adoquinadas del centro histórico?", "Se adapta a la mayoría de superficies urbanas. Algunas calles estrechas y adoquinadas de El Carmen pueden resultar irregulares, pero su peso ligero facilita superar bordillos."],
      ["¿Se puede entregar en mi alojamiento?", "Sí, según la zona de servicio y el horario disponible. La entrega o recogida se confirma con los detalles de la reserva."],
    ],
  },
  {
    slug: "double-stroller",
    localization: {
      short_description: "Silla de paseo doble en paralelo para gemelos o hermanos, con asientos reclinables y plegado compacto.",
      detail_description: "La Baby Jogger doble ofrece dos asientos con reclinación independiente, ruedas todoterreno y capotas UV 50+. Mide 76 cm de ancho, pesa 13 kg y admite hasta 22 kg por asiento.",
      includes_text: "Silla de paseo doble con dos asientos, capotas y cesta inferior.",
      constraints_text: "Indicada aproximadamente de 6 meses a 4 años, con un máximo de 22 kg por asiento. Comprueba el ancho de ascensores y accesos del alojamiento.",
      delivery_setup_note: "En la entrega explicamos el plegado, los frenos, los arneses y la reclinación independiente.",
      care_note: "Devuélvela sin restos importantes de comida o arena y utiliza siempre los arneses.",
      seo_title: "Alquiler de silla de paseo doble en Valencia",
      seo_description: "Alquila una silla de paseo doble Baby Jogger en Valencia para gemelos o hermanos, con reclinación independiente y capotas UV 50+.",
    },
    faqs: [
      ["¿Cabe por las puertas habituales?", "Con 76 cm de ancho cabe por muchas puertas estándar, pero recomendamos comprobar ascensores y accesos especialmente estrechos del alojamiento."],
      ["¿Es adecuada para gemelos?", "Sí. Dispone de dos asientos independientes y admite hasta 22 kg por asiento, por lo que resulta adecuada para gemelos o hermanos de edades similares."],
    ],
  },
  {
    slug: "travel-crib",
    localization: {
      short_description: "Cuna de viaje BabyBjörn ultraligera, con montaje rápido, laterales de malla y colchón firme incluido.",
      detail_description: "La cuna de viaje pesa 6 kg y se abre en un solo paso. Sus laterales de malla permiten la ventilación y la visibilidad, y el conjunto incluye colchón firme, sábana bajera y bolsa de transporte.",
      includes_text: "Cuna de viaje, colchón firme, sábana bajera ajustable y bolsa de transporte.",
      constraints_text: "Indicada desde el nacimiento hasta aproximadamente 3 años o 12 kg. Sigue siempre las instrucciones del fabricante para un sueño seguro.",
      delivery_setup_note: "En la entrega mostramos cómo abrir, cerrar y asegurar correctamente la cuna.",
      care_note: "Utiliza únicamente el colchón suministrado y devuelve la sábana separada si necesita lavado.",
      seo_title: "Alquiler de cuna de viaje en Valencia",
      seo_description: "Alquila una cuna de viaje BabyBjörn en Valencia con colchón firme, sábana bajera, laterales de malla y montaje rápido.",
    },
    faqs: [
      ["¿Es adecuada para recién nacidos?", "La ficha del producto indica uso desde el nacimiento hasta aproximadamente 3 años o 12 kg. Deben seguirse siempre las instrucciones de sueño seguro del fabricante."],
      ["¿Qué incluye la cuna?", "Incluye la estructura BabyBjörn, un colchón firme, una sábana bajera ajustable y la bolsa de transporte."],
    ],
  },
  {
    slug: "car-seat-infant",
    localization: {
      short_description: "Silla de coche infantil Cybex orientada a contramarcha y homologada i-Size para traslados y excursiones desde Valencia.",
      detail_description: "Esta silla i-Size está diseñada para bebés de 45 a 87 cm, aproximadamente desde el nacimiento hasta 15 meses y 13 kg. Ofrece protección lateral, reductor para recién nacido y compatibilidad ISOFIX o instalación con cinturón.",
      includes_text: "Silla de coche, reductor para recién nacido y los componentes de instalación confirmados en la reserva.",
      constraints_text: "Para bebés de 45 a 87 cm y hasta 13 kg. La instalación correcta debe comprobarse antes de cada trayecto y la silla debe utilizarse orientada a contramarcha.",
      delivery_setup_note: "Confirmamos el vehículo y mostramos la instalación con ISOFIX o cinturón según corresponda.",
      care_note: "No retires ni laves componentes sin consultar las instrucciones y comunica cualquier impacto durante el alquiler.",
      seo_title: "Alquiler de silla de coche para bebé en Valencia",
      seo_description: "Alquila una silla de coche Cybex i-Size en Valencia, orientada a contramarcha, con protección lateral y opción ISOFIX.",
    },
    faqs: [
      ["¿Es compatible con ISOFIX?", "Sí, es compatible con ISOFIX y también permite instalación con cinturón cuando se siguen las instrucciones correspondientes."],
      ["¿Para qué tamaño de bebé es adecuada?", "La ficha indica una altura de 45 a 87 cm, hasta aproximadamente 15 meses y un peso máximo de 13 kg."],
      ["¿Puedo utilizarla para un traslado desde el aeropuerto?", "Sí, siempre que se confirme previamente el vehículo y el método de instalación adecuado."],
    ],
  },
  {
    slug: "high-chair",
    localization: {
      short_description: "Trona Stokke ergonómica, regulable y plegable para comidas cómodas en apartamentos de Valencia.",
      detail_description: "La trona admite hasta 20 kg y está pensada aproximadamente para niños de 6 meses a 3 años. Incluye altura ajustable, arnés de cinco puntos, bandeja extraíble y superficies fáciles de limpiar.",
      includes_text: "Trona, arnés de cinco puntos y bandeja extraíble.",
      constraints_text: "Indicada aproximadamente de 6 meses a 3 años y hasta 20 kg. El niño debe permanecer sujeto y supervisado en todo momento.",
      delivery_setup_note: "En la entrega explicamos el plegado, el ajuste de altura, la bandeja y el arnés.",
      care_note: "Limpia la bandeja después de usarla y devuelve la trona sin restos importantes de comida.",
      seo_title: "Alquiler de trona infantil en Valencia",
      seo_description: "Alquila una trona Stokke plegable en Valencia, con altura regulable, arnés de cinco puntos y bandeja extraíble.",
    },
    faqs: [
      ["¿La trona se pliega para guardarla?", "Sí. Se pliega para ocupar menos espacio, algo práctico en apartamentos pequeños."],
      ["¿Qué edad y peso admite?", "Está indicada aproximadamente de 6 meses a 3 años y admite un peso máximo de 20 kg."],
    ],
  },
  {
    slug: "air-purifier",
    localization: {
      short_description: "Purificador de aire Dyson con filtro HEPA H13, sensor de calidad del aire y modo nocturno silencioso.",
      detail_description: "El purificador está diseñado para habitaciones de hasta 40 m² y ofrece un CADR de 320 m³/h. Combina filtro HEPA H13, sensor, temporizador, control mediante aplicación y un modo nocturno de 24 dB.",
      includes_text: "Purificador de aire Dyson con filtro instalado y cable de alimentación.",
      constraints_text: "Para habitaciones de hasta 40 m². Debe colocarse con espacio libre alrededor y no sustituye la ventilación ni el tratamiento médico.",
      delivery_setup_note: "En la entrega explicamos la colocación, los modos de funcionamiento y la lectura del sensor.",
      care_note: "No cubras la entrada o salida de aire y no retires ni mojes el filtro.",
      seo_title: "Alquiler de purificador de aire en Valencia",
      seo_description: "Alquila un purificador Dyson HEPA H13 en Valencia para habitaciones de hasta 40 m², con sensor y modo nocturno silencioso.",
    },
    faqs: [
      ["¿Puede ayudar durante episodios de calima?", "Un filtro HEPA puede reducir partículas suspendidas en interiores. No sustituye las recomendaciones sanitarias ni la ventilación cuando las condiciones exteriores lo permiten."],
      ["¿Es silencioso para dormir?", "El modo nocturno funciona a partir de 24 dB y ajusta la velocidad según la calidad del aire detectada."],
    ],
  },
  {
    slug: "beach-umbrella-set",
    localization: {
      short_description: "Conjunto de playa con sombrilla XL, dos sillas plegables, bolsa térmica, anclaje para arena y bolsa de transporte.",
      detail_description: "El conjunto reúne una sombrilla de 2 m con protección UPF 50+, dos sillas plegables y una bolsa térmica aislante. Está pensado para organizar días de playa en la Malvarrosa, la Patacona y otras zonas cubiertas por nuestro servicio.",
      includes_text: "Sombrilla de 2 m, dos sillas plegables, bolsa térmica, anclaje para arena y bolsa de transporte.",
      constraints_text: "No utilices la sombrilla con viento fuerte y asegúrala correctamente con el anclaje. Respeta las normas y condiciones de cada playa.",
      delivery_setup_note: "En la entrega comprobamos el conjunto y explicamos el montaje y anclaje seguro de la sombrilla.",
      care_note: "Sacude y seca los artículos antes de guardarlos. No cierres la sombrilla mojada durante periodos prolongados.",
      seo_title: "Alquiler de sombrilla y sillas de playa Valencia",
      seo_description: "Alquila en Valencia un conjunto de playa con sombrilla UPF 50+, dos sillas plegables, bolsa térmica y anclaje para arena.",
    },
    faqs: [
      ["¿Qué incluye el conjunto de playa?", "Incluye una sombrilla de 2 m con protección UPF 50+, dos sillas plegables, una bolsa térmica, un anclaje para arena y una bolsa de transporte."],
      ["¿Puedo utilizar la sombrilla con viento?", "Debe anclarse correctamente y no utilizarse con viento fuerte. Las condiciones de la playa siempre tienen prioridad sobre la reserva."],
    ],
  },
  {
    slug: "transport-wheelchair",
    localization: {
      short_description: "Silla de ruedas de transporte ultraligera de 9 kg, plegable y pensada para acompañante.",
      detail_description: "Esta silla Drive Medical pesa 9 kg, admite hasta 100 kg y tiene un asiento de 43 cm. Sus reposapiés abatibles, cinturón y plegado compacto facilitan traslados, visitas a museos y recorridos urbanos por Valencia.",
      includes_text: "Silla de transporte, reposapiés abatibles y cinturón.",
      constraints_text: "Capacidad máxima de 100 kg. Es una silla impulsada por acompañante y no está diseñada para autopropulsión independiente.",
      delivery_setup_note: "En la entrega explicamos el plegado, los frenos, los reposapiés y el uso seguro del cinturón.",
      care_note: "Evita arena, agua salada, escalones y bordillos sin asistencia adecuada.",
      seo_title: "Alquiler de silla de ruedas ligera en Valencia",
      seo_description: "Alquila una silla de ruedas de transporte de 9 kg en Valencia, plegable, compacta y con reposapiés abatibles y cinturón.",
    },
    faqs: [
      ["¿En qué se diferencia de una silla de ruedas estándar?", "La silla de transporte tiene ruedas traseras pequeñas y debe impulsarla un acompañante. A cambio, pesa menos y se pliega de forma muy compacta."],
      ["¿Cabe en un taxi?", "Su estructura plegable y su peso de 9 kg facilitan el transporte en el maletero de muchos vehículos. Conviene confirmar el espacio disponible."],
    ],
  },
  {
    slug: "mobility-scooter-lightweight",
    localization: {
      short_description: "Scooter de movilidad compacto de cuatro ruedas, desmontable y con hasta 20 km de autonomía.",
      detail_description: "El scooter ligero Pride ofrece estabilidad de cuatro ruedas, asiento regulable y cesta delantera. Alcanza 6 km/h, admite hasta 115 kg y se desmonta en cinco piezas para facilitar el transporte.",
      includes_text: "Scooter de movilidad, batería, cargador, asiento y cesta delantera.",
      constraints_text: "Capacidad máxima de 115 kg y autonomía indicada de hasta 20 km según carga, terreno y uso. No debe utilizarse en arena ni exponerse al agua.",
      delivery_setup_note: "En la entrega explicamos los controles, la carga, el desmontaje y las comprobaciones de seguridad.",
      care_note: "Recarga según las instrucciones, evita bordillos altos y devuelve el equipo seco y sin arena.",
      seo_title: "Alquiler de scooter de movilidad en Valencia",
      seo_description: "Alquila un scooter de movilidad ligero en Valencia, con cuatro ruedas, hasta 20 km de autonomía y diseño desmontable.",
    },
    faqs: [
      ["¿Qué autonomía tiene?", "La autonomía indicada es de hasta 20 km, aunque varía según el peso, el terreno, las pendientes y el uso."],
      ["¿Se puede transportar en coche?", "Se desmonta en cinco piezas para facilitar el transporte. Debe comprobarse el espacio y la capacidad de manipulación antes de confirmar el vehículo."],
      ["¿Sirve para el centro de Valencia?", "Valencia es mayoritariamente llana y muchas zonas son accesibles, pero hay calles estrechas, adoquines y bordillos que requieren precaución."],
    ],
  },
  {
    slug: "heavy-duty-mobility-scooter",
    localization: {
      short_description: "Scooter de movilidad de gran tamaño con suspensión, luces LED y hasta 40 km de autonomía.",
      detail_description: "Este scooter Invacare alcanza hasta 12 km/h y admite un peso máximo de 160 kg. La suspensión, los neumáticos grandes, las luces y los espejos están pensados para recorridos largos por rutas adecuadas de Valencia.",
      includes_text: "Scooter de movilidad, batería, cargador, asiento, luces y espejos.",
      constraints_text: "Capacidad máxima de 160 kg y autonomía indicada de hasta 40 km. Pesa 68 kg y requiere espacio suficiente para entrega, almacenamiento y maniobra.",
      delivery_setup_note: "Antes de confirmar revisamos accesos y espacio. En la entrega explicamos controles, carga, velocidad y maniobra segura.",
      care_note: "No lo utilices en arena, agua o rutas no adecuadas. Recarga según las instrucciones y comunica cualquier incidencia.",
      seo_title: "Alquiler de scooter movilidad grande Valencia",
      seo_description: "Alquila un scooter de movilidad de gran autonomía en Valencia, con suspensión, luces LED, hasta 40 km de alcance y 160 kg de capacidad.",
    },
    faqs: [
      ["¿Es adecuado para utilizarlo durante todo el día?", "La autonomía indicada es de hasta 40 km y la suspensión mejora la comodidad, pero el alcance real depende de la carga, el terreno y el uso."],
      ["¿Cabe en tiendas y restaurantes?", "Es un modelo de gran tamaño. Funciona mejor en paseos amplios y espacios accesibles; para interiores estrechos puede ser más práctico el modelo ligero."],
    ],
  },
  {
    slug: "rollator-walker",
    localization: {
      short_description: "Andador rollator de cuatro ruedas con asiento, bolsa, frenos y altura regulable.",
      detail_description: "El rollator Drive Medical pesa 6,5 kg y admite hasta 135 kg. Incorpora asiento a 56 cm, bolsa de almacenamiento, frenos de bucle y plegado compacto para desplazarse por Valencia con apoyo y pausas frecuentes.",
      includes_text: "Rollator de cuatro ruedas con asiento, bolsa de almacenamiento y frenos.",
      constraints_text: "Capacidad máxima de 135 kg. Acciona los frenos antes de sentarte y evita utilizarlo en escaleras o superficies inestables.",
      delivery_setup_note: "En la entrega ajustamos la altura y explicamos el plegado, los frenos y el uso del asiento.",
      care_note: "Devuélvelo seco y sin arena; comunica cualquier problema con ruedas o frenos.",
      seo_title: "Alquiler de andador rollator en Valencia",
      seo_description: "Alquila un andador rollator en Valencia con cuatro ruedas, asiento, bolsa, frenos y altura regulable.",
    },
    faqs: [
      ["¿Es útil para hacer turismo por Valencia?", "Valencia es una ciudad bastante llana. El rollator aporta apoyo y permite descansar en el asiento, aunque las rutas deben adaptarse a la movilidad del usuario."],
      ["¿Puedo llevarlo en autobús o metro?", "Se pliega para facilitar el transporte y la red dispone de opciones de accesibilidad. La disponibilidad de espacio puede variar según el servicio y la hora."],
    ],
  },
  {
    slug: "monitor-27",
    localization: {
      short_description: "Monitor Dell 4K de 27 pulgadas con USB-C, carga de 65 W, HDMI y soporte regulable.",
      detail_description: "El monitor IPS ofrece resolución 3840 × 2160, conexión USB-C con hasta 65 W de alimentación, HDMI, DisplayPort, altavoces y soporte ajustable. Permite montar un espacio de trabajo completo en un alojamiento de Valencia.",
      includes_text: "Monitor, soporte, cable de alimentación y cables de conexión confirmados en la reserva.",
      constraints_text: "El portátil debe ser compatible con la conexión elegida. La carga USB-C depende de la compatibilidad del dispositivo.",
      delivery_setup_note: "En la entrega comprobamos la conexión disponible y ayudamos con el montaje básico del puesto de trabajo.",
      care_note: "No presiones el panel ni utilices productos abrasivos. Devuelve todos los cables incluidos.",
      seo_title: "Alquiler de monitor 4K en Valencia",
      seo_description: "Alquila un monitor Dell 4K de 27 pulgadas en Valencia con USB-C de 65 W, HDMI, DisplayPort y soporte ajustable.",
    },
    faqs: [
      ["¿Puedo conectarlo a un MacBook?", "Sí, si el MacBook admite salida de vídeo por USB-C. Un único cable compatible puede transmitir imagen y suministrar hasta 65 W de carga."],
      ["¿Incluye los cables?", "Incluye el cable de alimentación y los cables de conexión especificados en la confirmación. Indícanos el modelo o los puertos del portátil."],
    ],
  },
  {
    slug: "standing-desk",
    localization: {
      short_description: "Escritorio eléctrico FlexiSpot regulable en altura, con tablero de 120 × 60 cm y memoria de posiciones.",
      detail_description: "El escritorio permite ajustar la altura entre 72 y 120 cm y admite hasta 70 kg. Incorpora memoria, gestión de cables y sistema anticolisión para crear una zona de trabajo temporal en el alojamiento.",
      includes_text: "Escritorio eléctrico montado, tablero, estructura, controlador y cable de alimentación.",
      constraints_text: "Requiere aproximadamente 120 × 60 cm de superficie libre y acceso eléctrico. No supera una carga distribuida de 70 kg.",
      delivery_setup_note: "Confirmamos accesos y espacio antes de la entrega. Se instala y comprueba en el lugar acordado.",
      care_note: "Mantén líquidos lejos del sistema eléctrico y no muevas el escritorio cargado.",
      seo_title: "Alquiler de escritorio elevable en Valencia",
      seo_description: "Alquila un escritorio eléctrico regulable en Valencia, con tablero de 120 × 60 cm, memoria de altura y gestión de cables.",
    },
    faqs: [
      ["¿Cabe en un apartamento?", "Necesita una zona libre de aproximadamente 120 × 60 cm, además de espacio para trabajar y ajustar la altura. Conviene comprobar accesos y distribución."],
      ["¿Se entrega montado?", "La entrega incluye el montaje o instalación acordados y una comprobación básica del ajuste eléctrico."],
    ],
  },
  {
    slug: "ergonomic-chair",
    localization: {
      short_description: "Silla de oficina Herman Miller con respaldo de malla, soporte lumbar y ajustes de altura, brazos e inclinación.",
      detail_description: "La silla ergonómica admite hasta 130 kg y ofrece altura de asiento entre 40 y 52 cm. El respaldo de malla, el soporte lumbar, los brazos regulables y el mecanismo de inclinación mejoran el puesto de trabajo temporal.",
      includes_text: "Silla ergonómica completa con brazos, soporte lumbar y mecanismos de ajuste.",
      constraints_text: "Capacidad máxima de 130 kg. Ajusta la silla sobre una superficie estable y no la utilices como escalón.",
      delivery_setup_note: "En la entrega explicamos los ajustes de altura, brazos, soporte lumbar e inclinación.",
      care_note: "Evita apoyar objetos cortantes sobre la malla y devuelve la silla limpia y seca.",
      seo_title: "Alquiler de silla ergonómica en Valencia",
      seo_description: "Alquila una silla ergonómica Herman Miller en Valencia con respaldo de malla, soporte lumbar, brazos regulables e inclinación.",
    },
    faqs: [
      ["¿Qué ajustes tiene la silla?", "Permite regular la altura del asiento, los brazos, el soporte lumbar y la inclinación para adaptar mejor el puesto de trabajo."],
      ["¿Se puede combinar con escritorio y monitor?", "Sí. Puede reservarse junto con el escritorio elevable y el monitor de 27 pulgadas, sujeto a disponibilidad para las mismas fechas."],
    ],
  },
];

function validateBatch() {
  const requiredLocalizationFields = [
    "short_description",
    "detail_description",
    "includes_text",
    "constraints_text",
    "delivery_setup_note",
    "care_note",
    "seo_title",
    "seo_description",
  ];
  const uniqueSlugs = new Set(products.map((product) => product.slug));
  if (uniqueSlugs.size !== products.length) throw new Error("Spanish batch contains duplicate slugs");
  if (products.length !== 14) throw new Error(`Expected 14 live products, found ${products.length}`);

  for (const product of products) {
    for (const field of requiredLocalizationFields) {
      if (!product.localization[field]?.trim()) throw new Error(`${product.slug} is missing ${field}`);
    }
    if (product.localization.seo_title.length > 60) {
      throw new Error(`${product.slug} SEO title exceeds 60 characters`);
    }
    if (product.localization.seo_description.length > 155) {
      throw new Error(`${product.slug} SEO description exceeds 155 characters`);
    }
    if (!product.faqs.length || product.faqs.some(([question, answer]) => !question.trim() || !answer.trim())) {
      throw new Error(`${product.slug} has incomplete Spanish FAQs`);
    }
  }
}

async function main() {
  validateBatch();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const slugs = products.map((product) => product.slug);
  const { data: existingProducts, error: productError } = await supabase
    .from("products")
    .select("id,slug,is_active,content_status")
    .in("slug", slugs);
  if (productError) throw productError;

  const bySlug = new Map((existingProducts || []).map((product) => [product.slug, product]));
  for (const product of products) {
    const existing = bySlug.get(product.slug);
    if (!existing) throw new Error(`${product.slug} was not found`);
    if (!existing.is_active) throw new Error(`${product.slug} is not currently live`);
    if (!applyChanges) {
      console.log(`${product.slug}: ready for Spanish enrichment (${existing.content_status})`);
      continue;
    }

    const { error: localizationError } = await supabase.from("product_localizations").upsert({
      product_id: existing.id,
      locale: "es",
      ...product.localization,
      updated_at: new Date().toISOString(),
    }, { onConflict: "product_id,locale" });
    if (localizationError) throw localizationError;

    const { error: deleteFaqError } = await supabase.from("product_faqs").delete().eq("product_id", existing.id).eq("locale", "es");
    if (deleteFaqError) throw deleteFaqError;
    const { error: faqError } = await supabase.from("product_faqs").insert(
      product.faqs.map(([question, answer], sort_order) => ({
        product_id: existing.id,
        locale: "es",
        question,
        answer,
        sort_order,
      }))
    );
    if (faqError) throw faqError;
    console.log(`${product.slug}: Spanish content updated`);
  }

  console.log(applyChanges ? "Spanish batch applied without product status changes." : "Dry run complete. Re-run with --apply to write translations.");
}

main().catch((error) => {
  console.error(`[spanish-enrichment] ${error.message}`);
  process.exit(1);
});
