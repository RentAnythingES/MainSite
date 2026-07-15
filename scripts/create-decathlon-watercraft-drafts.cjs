const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const products = [
  {
    slug: "tribord-100-plus-inflatable-kayak",
    name: "Tribord 100+ Inflatable Kayak — 2/3 Person",
    brand: "Tribord",
    subcategory: "Kayaks",
    subcategorySlug: "kayaks",
    emoji: "🛶",
    sourceUrl: "https://www.decathlon.es/es/p/canoa-kayak-hinchable-tribord-100-azul-2-3-plazas/365073/c41m8940857",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2855549/k$8a65ffb9687aba2d61fb1176df848593/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Turquoise Tribord 100 Plus inflatable kayak with three raised seats",
    description: "A 410 × 102 cm inflatable kayak for two or three people with a high-pressure drop-stitch floor, three raised seats and a conservative 240 kg load limit.",
    features: ["2 or 3 raised seats", "High-pressure drop-stitch floor", "410 × 102 cm inflated size", "18 kg packed weight", "Three removable fins", "Approximately 10-minute inflation with a compatible double-action pump"],
    specs: {
      Brand: "Tribord",
      Model: "100+",
      Capacity: "2 or 3 people",
      "Conservative maximum load": "240 kg",
      "Source load conflict": "Detailed copy states 245 kg; specification table states 240 kg",
      "Inflated size": "410 × 102 cm",
      "Packed size": "72 × 45 × 37 cm",
      Weight: "18 kg",
      "Floor pressure": "5 PSI / 0.34 bar",
      "Side tube and seat pressure": "3 PSI / 0.2 bar",
      "Navigation limit": "Within 300 m of a place of refuge",
    },
    en: {
      short: "Rent a stable Tribord 100+ inflatable kayak in Valencia for two or three people on suitable sheltered water.",
      detail: "The Tribord 100+ combines wide side tubes with a rigid high-pressure drop-stitch floor to improve stability and glide for beginner recreational paddling. It measures 410 × 102 cm when inflated and packs into a 72 × 45 × 37 cm bag at 18 kg. Three raised seats can be arranged for two or three paddlers. The floor inflates to 5 PSI, while the side tubes and seats inflate to 3 PSI. The supplier's detailed copy states a 245 kg capacity but its specification table states 240 kg, so this draft adopts the lower 240 kg limit. The product is restricted to navigation within 300 metres of a place of refuge. Rental activation requires a complete equipment, safety, weather and operating procedure.",
      includes: "One Tribord 100+ kayak, three raised seats, carry bag, repair patch kit, three fins, inflation nozzle, retaining strap and instructions. Pump, paddles and buoyancy aids are not included unless explicitly added to the rental package.",
      constraints: "Maximum 240 kg and no more than three occupants. Remain within 300 m of a place of refuge. Every occupant must use a correctly fitted buoyancy aid. Do not use in unsuitable wind, waves, current, visibility or weather.",
      setup: "After operational approval, staff must inspect every chamber, valve, seam, seat and fin; confirm the user group, route and weather; issue required safety equipment; and demonstrate inflation to 5 PSI floor and 3 PSI sides and seats.",
      care: "After use, remove seats and fins, rinse every part with fresh water, drain completely, air dry away from direct sun and return clean, dry and loosely packed.",
      title: "Rent an Inflatable Kayak in Valencia",
      meta: "Rent a Tribord 100+ inflatable kayak in Valencia for 2–3 people, with drop-stitch floor, raised seats, 240 kg limit and carry bag.",
      faqs: [
        ["How many people can use the kayak?", "It can be configured for two or three occupants, provided the combined load stays at or below the conservative 240 kg limit."],
        ["Are paddles and a pump included?", "Not in the supplier's kayak contents. They must be added explicitly to the rental package together with correctly sized buoyancy aids."],
        ["Where can it be used?", "The product instructions restrict navigation to within 300 metres of a place of refuge and only in suitable water and weather conditions."],
      ],
    },
    es: {
      short: "Alquila un kayak hinchable Tribord 100+ estable en Valencia para dos o tres personas en aguas resguardadas adecuadas.",
      detail: "El Tribord 100+ combina tubos laterales anchos con un fondo rígido Dropstitch de alta presión para mejorar estabilidad y deslizamiento en uso recreativo de iniciación. Inflado mide 410 × 102 cm y se guarda en una bolsa de 72 × 45 × 37 cm con un peso de 18 kg. Los tres asientos elevados permiten configurarlo para dos o tres palistas. El fondo se infla a 5 PSI y los tubos y asientos a 3 PSI. La descripción detallada del proveedor indica 245 kg, mientras que la tabla técnica indica 240 kg; este borrador adopta el límite conservador de 240 kg. El producto limita la navegación a 300 metros de un lugar de refugio. Su activación requiere un proceso completo de material, seguridad, meteorología y operación.",
      includes: "Un kayak Tribord 100+, tres asientos elevados, bolsa, kit de parches, tres quillas, boquilla, correa e instrucciones. No incluye bomba, remos ni ayudas a la flotación salvo que se añadan expresamente al paquete.",
      constraints: "Máximo 240 kg y tres ocupantes. Permanecer a menos de 300 m de un lugar de refugio. Cada ocupante debe llevar una ayuda a la flotación correctamente ajustada. No utilizar con viento, oleaje, corriente, visibilidad o meteorología inadecuados.",
      setup: "Tras aprobar la operativa, el personal debe revisar cámaras, válvulas, costuras, asientos y quillas; confirmar grupo, ruta y meteorología; entregar el material de seguridad y explicar el inflado a 5 PSI en el fondo y 3 PSI en laterales y asientos.",
      care: "Después del uso, retira asientos y quillas, aclara todas las piezas con agua dulce, vacía, seca al aire lejos del sol directo y devuelve limpio, seco y sin comprimir en exceso.",
      title: "Alquiler Kayak Hinchable en Valencia",
      meta: "Alquila un kayak Tribord 100+ en Valencia para 2–3 personas, con fondo Dropstitch, asientos elevados, límite de 240 kg y bolsa.",
      faqs: [
        ["¿Cuántas personas pueden utilizarlo?", "Puede configurarse para dos o tres ocupantes siempre que la carga combinada no supere el límite conservador de 240 kg."],
        ["¿Incluye remos y bomba?", "No figuran en el contenido del kayak. Deben añadirse expresamente al paquete junto con ayudas a la flotación de talla adecuada."],
        ["¿Dónde se puede utilizar?", "Las instrucciones limitan la navegación a 300 metros de un lugar de refugio y únicamente con agua y meteorología adecuadas."],
      ],
    },
  },
  {
    slug: "decathlon-sup-100-10-6-inflatable-paddleboard",
    name: "Decathlon SUP 100 10'6 Inflatable Paddleboard Set",
    brand: "Decathlon",
    subcategory: "Paddleboards",
    subcategorySlug: "paddleboards",
    emoji: "🏄",
    sourceUrl: "https://www.decathlon.es/es/p/tabla-paddle-surf-hinchable-100-10-6-1-2-personas-hasta-130kg-azul/356321/c40c113m8901115",
    sourceImageUrl: "https://contents.mediadecathlon.com/p2869647/k$66cc0f2aa2626ce9b5d2b58ce1292597/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Blue Decathlon SUP 100 10 foot 6 inflatable paddleboard set",
    description: "A complete 10'6 beginner inflatable paddleboard set with adjustable paddle, pump, fin, leash and backpack for users up to 130 kg.",
    features: ["Complete beginner SUP package", "320 × 84 × 15 cm inflated size", "Designed for users up to 130 kg", "15 PSI operating pressure", "Adjustable aluminium paddle", "Pump, fin, leash and backpack included"],
    specs: {
      Brand: "Decathlon",
      Model: "SUP 100 10'6",
      "Inflated size": "320 × 84 × 15 cm",
      Volume: "290 litres",
      "Board weight": "8.4 kg ±5%",
      "Packed set weight": "9.6 kg ±5%, excluding listed pump and paddle weights",
      "User weight design limit": "130 kg",
      "Maximum flotation load": "Less than 290 kg",
      Pressure: "15 PSI in use; reduce to 10 PSI if left in sun out of water",
      "Navigation limit": "Within 300 m of a place of refuge",
    },
    en: {
      short: "Rent a complete 10'6 inflatable paddleboard set in Valencia for beginner touring and calm-water leisure.",
      detail: "The Decathlon SUP 100 is a 10'6 inflatable board designed for beginner leisure and touring on suitable calm water. Inflated dimensions are 320 × 84 × 15 cm with a 290-litre volume. The board alone weighs 8.4 kg and inflates to 15 PSI. It is designed to maintain suitable paddling performance for a standing user up to 130 kg. The supplier also describes configurations with one standing adult plus seated or kneeling passengers, but the total arrangement must remain stable, within limits and appropriate for the conditions. The complete pack includes an adjustable paddle, manual pump, fin, backpack and leash. Navigation is restricted to within 300 metres of a place of refuge.",
      includes: "One 10'6 SUP, adjustable paddle, manual pump, standard fin, backpack, leash, manual, repair patch and valve key. Repair glue and buoyancy aids are not included.",
      constraints: "Designed for a standing user up to 130 kg. Remain within 300 m of a place of refuge. A correctly fitted buoyancy aid is required. Leash choice and use must match local conditions; do not use in unsuitable wind, current, waves, visibility or weather.",
      setup: "After operational approval, staff must inspect the board, valve, fin, leash, paddle and pump; confirm conditions and user ability; issue safety equipment; and demonstrate inflation to 15 PSI and safe launch and return procedures.",
      care: "Rinse board, paddle, fin and leash with fresh water, dry fully away from direct sun, remove the fin and store deflated and flat or loosely rolled in the backpack.",
      title: "Rent a Paddleboard in Valencia",
      meta: "Rent a complete 10'6 inflatable paddleboard in Valencia with paddle, pump, fin, leash and backpack, designed for users up to 130 kg.",
      faqs: [
        ["What is included in the set?", "The supplier pack includes the board, adjustable paddle, manual pump, fin, backpack, leash, manual, repair patch and valve key."],
        ["What is the rider weight limit?", "The board is designed for a standing user up to 130 kg. Flotation capacity is not the same as a safe standing-user limit."],
        ["How far from shore can it be used?", "The product instructions limit navigation to within 300 metres of a place of refuge."],
      ],
    },
    es: {
      short: "Alquila un pack completo de paddle surf hinchable 10'6 en Valencia para iniciación y paseo en aguas tranquilas.",
      detail: "La Decathlon SUP 100 es una tabla hinchable de 10'6 diseñada para iniciación, ocio y travesías en aguas tranquilas adecuadas. Inflada mide 320 × 84 × 15 cm y tiene 290 litros de volumen. La tabla pesa 8,4 kg y se infla a 15 PSI. Está diseñada para mantener un rendimiento adecuado con un usuario de pie de hasta 130 kg. El proveedor también describe configuraciones con un adulto de pie y pasajeros sentados o de rodillas, pero el conjunto debe conservar estabilidad, respetar los límites y ser adecuado para las condiciones. El pack incluye remo regulable, bomba manual, quilla, mochila y leash. La navegación está limitada a 300 metros de un lugar de refugio.",
      includes: "Una SUP 10'6, remo regulable, bomba manual, quilla estándar, mochila, leash, manual, parche y llave de válvula. No incluye pegamento ni ayudas a la flotación.",
      constraints: "Diseñada para un usuario de pie de hasta 130 kg. Permanecer a menos de 300 m de un lugar de refugio. Es obligatoria una ayuda a la flotación correctamente ajustada. El tipo y uso del leash debe adaptarse a las condiciones; no utilizar con viento, corriente, oleaje, visibilidad o meteorología inadecuados.",
      setup: "Tras aprobar la operativa, el personal debe revisar tabla, válvula, quilla, leash, remo y bomba; confirmar condiciones y capacidad del usuario; entregar seguridad y explicar inflado a 15 PSI, entrada y regreso seguros.",
      care: "Aclara tabla, remo, quilla y leash con agua dulce, seca completamente lejos del sol directo, retira la quilla y guarda desinflada en plano o enrollada sin apretar dentro de la mochila.",
      title: "Alquiler Paddle Surf en Valencia",
      meta: "Alquila una tabla paddle surf hinchable 10'6 en Valencia con remo, bomba, quilla, leash y mochila, diseñada para usuarios de hasta 130 kg.",
      faqs: [
        ["¿Qué incluye el pack?", "Incluye tabla, remo regulable, bomba manual, quilla, mochila, leash, manual, parche y llave de válvula."],
        ["¿Cuál es el límite de peso del usuario?", "La tabla está diseñada para un usuario de pie de hasta 130 kg. La flotabilidad máxima no equivale al límite seguro de navegación de pie."],
        ["¿A qué distancia se puede navegar?", "Las instrucciones limitan la navegación a 300 metros de un lugar de refugio."],
      ],
    },
  },
];

function extensionFor(contentType) {
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/png") return "png";
  return "jpg";
}

async function writeLocalizedContent(client, productId, product) {
  for (const [locale, content] of [["en", product.en], ["es", product.es]]) {
    await client.query(
      `insert into product_localizations
        (product_id, locale, short_description, detail_description, includes_text, constraints_text,
         delivery_setup_note, care_note, seo_title, seo_description)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [productId, locale, content.short, content.detail, content.includes, content.constraints,
        content.setup, content.care, content.title, content.meta],
    );
    for (const [sortOrder, [question, answer]] of content.faqs.entries()) {
      await client.query(
        "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1,$2,$3,$4,$5)",
        [productId, locale, question, answer, sortOrder],
      );
    }
  }
}

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const category = await client.query("select id from categories where slug='travel-outdoors' limit 1");
  if (category.rowCount !== 1) throw new Error("Beach & Outdoor category not found");

  const created = [];
  for (const product of products) {
    const duplicate = await client.query("select id from products where slug=$1", [product.slug]);
    if (duplicate.rowCount > 0) throw new Error(`Product already exists: ${product.slug}`);

    const response = await fetch(product.sourceImageUrl);
    if (!response.ok) throw new Error(`Image download failed for ${product.slug}: ${response.status}`);
    const contentType = (response.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error(`Image source was not an image for ${product.slug}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const storagePath = `${product.slug}/${Date.now()}-primary.${extensionFor(contentType)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, bytes, { contentType, upsert: false });
    if (uploadError) throw uploadError;
    const imageUrl = supabase.storage.from("product-images").getPublicUrl(storagePath).data.publicUrl;

    try {
      await client.query("begin");
      const inserted = await client.query(
        `insert into products
          (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug,
           city, stock_total, stock_available, is_active, meta_title, meta_description, features, specs, content_status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'valencia',0,0,false,$10,$11,$12::jsonb,$13::jsonb,'facts_verified')
         returning id`,
        [product.slug, product.name, product.brand, product.description, product.emoji, imageUrl,
          category.rows[0].id, product.subcategory, product.subcategorySlug, product.en.title, product.en.meta,
          JSON.stringify(product.features), JSON.stringify(product.specs)],
      );
      const productId = inserted.rows[0].id;
      await client.query("insert into pricing_tiers (product_id,min_days,per_day_cents) values ($1,1,0)", [productId]);
      await writeLocalizedContent(client, productId, product);
      await client.query(
        `insert into product_images
          (product_id,image_url,alt_text,source_url,rights_status,is_primary,sort_order)
         values ($1,$2,$3,$4,'unknown',true,0)`,
        [productId, imageUrl, product.imageAlt, product.sourceUrl],
      );
      await client.query("commit");
      created.push({ id: productId, slug: product.slug, imageUrl, active: false });
    } catch (error) {
      await client.query("rollback");
      await supabase.storage.from("product-images").remove([storagePath]);
      throw error;
    }
  }

  const verification = await client.query(
    `select p.id,p.slug,p.is_active,p.content_status,p.stock_total,p.stock_available,p.image_url,
      count(distinct pl.locale) localization_count,
      count(distinct pf.id) faq_count,
      count(distinct pi.id) filter(where pi.is_primary) primary_image_count,
      count(distinct pt.id) pricing_count
     from products p
     left join product_localizations pl on pl.product_id=p.id
     left join product_faqs pf on pf.product_id=p.id
     left join product_images pi on pi.product_id=p.id
     left join pricing_tiers pt on pt.product_id=p.id
     where p.slug=any($1)
     group by p.id order by p.slug`,
    [products.map((product) => product.slug)],
  );
  await client.end();

  if (verification.rowCount !== products.length) throw new Error("Post-import verification did not find both products");
  for (const row of verification.rows) {
    if (row.is_active || row.content_status !== "facts_verified" || Number(row.stock_total) !== 0
      || Number(row.stock_available) !== 0 || row.localization_count !== "2" || Number(row.faq_count) !== 6
      || Number(row.primary_image_count) !== 1 || Number(row.pricing_count) !== 1) {
      throw new Error(`Post-import verification failed: ${JSON.stringify(row)}`);
    }
  }
  console.log(JSON.stringify({ created, verified: verification.rows }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
