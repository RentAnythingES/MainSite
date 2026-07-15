const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const slug = "decathlon-iwiko-180-compact-beach-shelter";
const sourceUrl = "https://www.decathlon.es/es/p/sombrilla-playa-refugio-compacto-iwiko-180-upf-50-3-plazas/333434/c7c30m8873506";
const sourceImageUrl = "https://contents.mediadecathlon.com/p2615955/k$5950f9ccb370bc5419ff6373fc978de9/picture.jpg?f=3000x0&format=auto";

const product = {
  name: "Decathlon Iwiko 180 Compact Beach Shelter",
  brand: "Decathlon",
  description: "A compact 1.5 kg UPF 50+ beach shelter for up to three adults, with instant opening, integrated groundsheet, sand pockets, pegs, guy lines and a carry bag.",
  features: [
    "UPF 50+ fabric for direct-sun protection",
    "Space for up to three adults",
    "Instant one-action opening and closing system",
    "Integrated waterproof groundsheet",
    "Pegs, sand pockets and guy lines for anchoring",
    "Compact 60 × 15 × 15 cm packed size",
  ],
  specs: {
    Brand: "Decathlon",
    Model: "Iwiko 180",
    "Decathlon product ID": "8873506",
    Capacity: "Up to 3 adults",
    "Open dimensions": "Approximately 180 × 80 × 110 cm",
    "Packed dimensions": "60 × 15 × 15 cm",
    Weight: "1.5 kg",
    "Sun protection": "UPF 50+; blocks at least 98% UVB and 95% UVA",
    "Wind limit": "Do not use above 30 km/h",
    "Main fabric": "100% polyester",
    Groundsheet: "100% polyethylene; integrated waterproof floor",
    Coating: "100% polyurethane",
    "Weather resistance": "Shelter fabric is water-repellent, not waterproof",
    Colour: "Blue-grey and beige",
  },
  meta_title: "Iwiko Beach Shelter Rental Valencia | UPF 50+",
  meta_description: "Rent a compact Decathlon Iwiko 180 beach shelter in Valencia. UPF 50+, space for three adults, integrated groundsheet and carry bag.",
};

const localizations = {
  en: {
    short_description: "Rent a Decathlon Iwiko 180 compact beach shelter in Valencia for easy shade at Malvarrosa, Patacona or nearby beaches, with UPF 50+ fabric, room for up to three adults and a small carry size.",
    detail_description: "The Decathlon Iwiko 180 is a lightweight beach shelter for visitors who want more coverage than a conventional parasol without carrying a full tent. It weighs 1.5 kg, packs to approximately 60 × 15 × 15 cm and opens using a pull ring, with a push-button system for closing. The 180 cm-wide shelter accommodates up to three adults and includes an integrated waterproof groundsheet. Its UPF 50+ fabric blocks at least 98% of UVB and 95% of UVA rays, although reflected sunlight, heat and exposure outside the shelter still require sunscreen, suitable clothing and hydration. Pegs, sand pockets and guy lines provide several anchoring options on suitable ground. Decathlon specifies a maximum wind speed below 30 km/h; the shelter must not be used in stronger wind. The main shelter fabric is water-repellent rather than waterproof, so it is intended primarily for shade and light beach conditions.",
    includes_text: "Decathlon Iwiko 180 shelter with integrated groundsheet, fitted sand pockets, pegs, guy lines and carry bag.",
    constraints_text: "Capacity is up to three adults. Anchor every available fixing point and do not use in winds above 30 km/h. The shelter fabric is water-repellent, not waterproof. UPF 50+ protection applies to covered areas and does not replace sunscreen, protective clothing or hydration.",
    delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. The shelter is supplied folded in its carry bag; the renter is responsible for opening, anchoring and closing it according to the instructions.",
    care_note: "Shake off loose sand, allow the shelter to dry completely and store it in the supplied bag. Do not machine wash, dry clean, iron, tumble dry or bleach it. Report any damaged peg, guy line, seam or opening mechanism before further use.",
    seo_title: "Iwiko Beach Shelter Rental Valencia | UPF 50+",
    seo_description: "Rent a compact Decathlon Iwiko 180 beach shelter in Valencia. UPF 50+, space for three adults, integrated groundsheet and carry bag.",
  },
  es: {
    short_description: "Alquila en Valencia un refugio de playa compacto Decathlon Iwiko 180 para conseguir sombra fácilmente en Malvarrosa, Patacona u otras playas, con tejido UPF 50+, espacio para tres adultos y formato de transporte reducido.",
    detail_description: "El Decathlon Iwiko 180 es un refugio de playa ligero para quienes buscan más cobertura que una sombrilla convencional sin transportar una tienda completa. Pesa 1,5 kg, se guarda en un formato aproximado de 60 × 15 × 15 cm y se abre tirando de una anilla, con cierre mediante botón. El refugio de 180 cm de anchura admite hasta tres adultos e incorpora un suelo impermeable integrado. Su tejido UPF 50+ bloquea como mínimo el 98 % de los rayos UVB y el 95 % de los UVA, aunque el reflejo, el calor y la exposición fuera del refugio siguen exigiendo protector solar, ropa adecuada e hidratación. Las piquetas, bolsillos de arena y tirantes ofrecen varias formas de fijación. Decathlon establece un límite de viento inferior a 30 km/h; no debe utilizarse con viento más fuerte. El tejido exterior es repelente al agua, no impermeable, por lo que está pensado principalmente para sombra y condiciones suaves de playa.",
    includes_text: "Refugio Decathlon Iwiko 180 con suelo integrado, bolsillos de arena, piquetas, tirantes y funda de transporte.",
    constraints_text: "Capacidad máxima de tres adultos. Fija todos los puntos disponibles y no lo utilices con viento superior a 30 km/h. El tejido es repelente al agua, no impermeable. La protección UPF 50+ no sustituye el protector solar, la ropa adecuada ni la hidratación.",
    delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia durante la reserva. El refugio se entrega plegado en su funda; el cliente debe abrirlo, fijarlo y cerrarlo siguiendo las instrucciones.",
    care_note: "Retira la arena suelta, deja que el refugio se seque por completo y guárdalo en su funda. No lavar a máquina, limpiar en seco, planchar, secar en secadora ni usar lejía. Informa de cualquier daño en piquetas, tirantes, costuras o mecanismo.",
    seo_title: "Alquiler Refugio Playa Iwiko 180 Valencia | UPF 50+",
    seo_description: "Alquila en Valencia un refugio de playa Iwiko 180 UPF 50+ para tres adultos, con suelo integrado, piquetas, tirantes y funda compacta de transporte.",
  },
};

const faqs = {
  en: [
    ["How many people fit inside the Iwiko 180 shelter?", "Decathlon states capacity for up to three adults. Comfort will depend on how much beach equipment you place inside and the position of the sun."],
    ["Does UPF 50+ mean we do not need sunscreen?", "No. The fabric blocks at least 98% of UVB and 95% of UVA where it provides coverage, but reflected sunlight and uncovered skin still require appropriate sunscreen, clothing and other protection."],
    ["Can it be used on a windy day?", "Only in suitable conditions and when fully anchored. Decathlon says not to use the shelter in winds above 30 km/h because it could be blown away."],
    ["What anchoring equipment is included?", "The shelter includes pegs, fitted sand pockets and guy lines. Use every suitable anchoring point and adjust the setup to the ground conditions."],
    ["Is it waterproof and easy to carry?", "The integrated groundsheet is waterproof, but the shelter fabric is only water-repellent. The complete shelter weighs 1.5 kg and packs to approximately 60 × 15 × 15 cm in its carry bag."],
  ],
  es: [
    ["¿Cuántas personas caben en el refugio Iwiko 180?", "Decathlon indica una capacidad máxima de tres adultos. La comodidad dependerá del material de playa colocado dentro y de la posición del sol."],
    ["¿Con UPF 50+ no necesitamos protector solar?", "No. El tejido bloquea como mínimo el 98 % de los UVB y el 95 % de los UVA en la zona cubierta, pero el reflejo y la piel expuesta siguen requiriendo protector solar, ropa y otras medidas."],
    ["¿Se puede utilizar en un día de viento?", "Solo en condiciones adecuadas y completamente fijado. Decathlon indica que no debe utilizarse con viento superior a 30 km/h porque podría salir volando."],
    ["¿Qué elementos de fijación incluye?", "Incluye piquetas, bolsillos de arena integrados y tirantes. Utiliza todos los puntos adecuados y adapta la fijación al tipo de terreno."],
    ["¿Es impermeable y fácil de transportar?", "El suelo integrado es impermeable, pero el tejido del refugio solo es repelente al agua. Pesa 1,5 kg y se guarda en una funda de aproximadamente 60 × 15 × 15 cm."],
  ],
};

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const duplicate = await client.query("select id from products where slug = $1", [slug]);
  if (duplicate.rowCount > 0) throw new Error(`Product already exists: ${slug}`);

  const category = await client.query("select id from categories where slug = 'travel-outdoors' limit 1");
  if (category.rowCount !== 1) throw new Error("Travel and Outdoors category not found");

  const template = await client.query(
    "select subcategory, subcategory_slug from products where slug = 'beach-umbrella-with-table-cupholders' limit 1",
  );
  const subcategory = template.rows[0]?.subcategory || "Beach Shade";
  const subcategorySlug = template.rows[0]?.subcategory_slug || "beach-shade";

  const imageResponse = await fetch(sourceImageUrl);
  if (!imageResponse.ok) throw new Error(`Image download failed: ${imageResponse.status}`);
  const imageContentType = imageResponse.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  const imageExtension = imageContentType === "image/webp" ? "webp"
    : imageContentType === "image/png" ? "png"
      : "jpg";
  const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
  const storagePath = `${slug}/${Date.now()}-iwiko-180.${imageExtension}`;
  const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, imageBytes, {
    contentType: imageContentType,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { data: publicImage } = supabase.storage.from("product-images").getPublicUrl(storagePath);

  try {
    await client.query("begin");
    const inserted = await client.query(
      `insert into products
        (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug,
         city, stock_total, stock_available, is_active, meta_title, meta_description, features, specs, content_status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'valencia',0,0,false,$10,$11,$12::jsonb,$13::jsonb,'facts_verified')
       returning id`,
      [slug, product.name, product.brand, product.description, "🏖️", publicImage.publicUrl,
        category.rows[0].id, subcategory, subcategorySlug, product.meta_title, product.meta_description,
        JSON.stringify(product.features), JSON.stringify(product.specs)],
    );
    const productId = inserted.rows[0].id;

    for (const [locale, localization] of Object.entries(localizations)) {
      await client.query(
        `insert into product_localizations
          (product_id, locale, short_description, detail_description, includes_text, constraints_text,
           delivery_setup_note, care_note, seo_title, seo_description)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [productId, locale, localization.short_description, localization.detail_description,
          localization.includes_text, localization.constraints_text, localization.delivery_setup_note,
          localization.care_note, localization.seo_title, localization.seo_description],
      );
    }

    for (const [locale, items] of Object.entries(faqs)) {
      for (const [sortOrder, [question, answer]] of items.entries()) {
        await client.query(
          "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1,$2,$3,$4,$5)",
          [productId, locale, question, answer, sortOrder],
        );
      }
    }

    await client.query(
      `insert into product_images
        (product_id, image_url, alt_text, source_url, rights_status, is_primary, sort_order)
       values ($1,$2,$3,$4,'unknown',true,0)`,
      [productId, publicImage.publicUrl, "Blue-grey and beige Decathlon Iwiko 180 compact UPF 50+ beach shelter", sourceUrl],
    );

    await client.query("commit");
    console.log(JSON.stringify({
      id: productId,
      slug,
      image_url: publicImage.publicUrl,
      category: "travel-outdoors",
      subcategory,
      content_status: "facts_verified",
      is_active: false,
      stock_total: 0,
      pricing_tiers: 0,
      image_rights: "unknown",
      localizations: 2,
      faqs: 10,
    }, null, 2));
  } catch (error) {
    await client.query("rollback");
    await supabase.storage.from("product-images").remove([storagePath]);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
