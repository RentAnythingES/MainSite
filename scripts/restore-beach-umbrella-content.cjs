const { Client } = require("pg");

process.loadEnvFile(".env.local");

const productId = "3c38fea0-7853-42c5-b2b9-c5cd2e0f1bf4";
const productSlug = "beach-umbrella-with-table-cupholders";
const decathlonSource = "https://www.decathlon.es/es/p/mp/aktive-sombrilla-playa-antiviento-8-varillas-210-cm-rayas-azules-con-mesa/74620cec-f001-4371-82e5-10aa1e937cc8/c5c4";

const product = {
  brand: "Aktive",
  description: "A 210 cm UV50 beach umbrella with an integrated table, cupholders, storage pocket, adjustable hook and carry sleeve for comfortable beach days in Valencia.",
  features: [
    "210 cm canopy with UV50 protection",
    "Integrated central table with cupholders and storage pocket",
    "Eight-rib steel structure with ventilation opening",
    "Height-adjustable and tilting steel mast",
    "Spiral sand anchor and adjustable accessory hook",
    "Carry sleeve with shoulder strap",
  ],
  specs: {
    Brand: "Aktive",
    Model: "62330",
    EAN: "8412842623309",
    Diameter: "210 cm",
    Weight: "2.39 kg",
    Fabric: "Oxford polyester",
    Mast: "Steel; height-adjustable and tilting",
    Ribs: "8 steel ribs",
    Protection: "UV50 with silver inner coating",
    Ventilation: "Integrated top vent",
    Colour: "Blue and white stripes",
  },
  metaTitle: "Beach Umbrella Rental Valencia | UV50 & Table",
  metaDescription: "Rent a 210 cm UV50 beach umbrella in Valencia with an integrated table, cupholders and carry bag—ideal for beach days at Malvarrosa or Patacona.",
};

const localizations = [
  {
    locale: "en",
    short_description: "Rent a spacious 210 cm UV50 beach umbrella in Valencia with an integrated table, cupholders and carry sleeve—an easy shade setup for family days at Malvarrosa, Patacona or nearby beaches.",
    detail_description: "Make a Valencia beach day more comfortable without buying and carrying a bulky parasol. This Aktive model 62330 opens to 210 cm and combines UV50 fabric with a silver inner coating, a ventilated eight-rib structure and an adjustable steel mast that tilts as the sun moves. The central table keeps drinks and small essentials away from the sand, with integrated cupholders, a storage pocket and an adjustable accessory hook. A spiral tip helps secure the mast in suitable beach sand, while the included shoulder-strap sleeve makes the 2.39 kg umbrella easier to transport between your accommodation and the coast. It is a practical choice for families and small groups visiting Malvarrosa, Patacona or other Valencia beaches. Wind-resistant features improve stability, but the umbrella must still be firmly installed, supervised and closed in strong or changing winds.",
    includes_text: "Aktive model 62330 beach umbrella, integrated central table with cupholders and pocket, adjustable accessory hook, and carry sleeve with shoulder strap.",
    constraints_text: "The open canopy is 210 cm in diameter and the umbrella weighs 2.39 kg. Install only in suitable sand, secure the spiral tip firmly and never leave it unattended. Wind-resistant design is not stormproof; close it during strong gusts or unsafe weather.",
    delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. The umbrella is supplied folded in its carry sleeve; installation at the beach is the renter's responsibility unless otherwise agreed.",
    care_note: "Keep away from fire. Close the umbrella when unattended, allow it to dry before packing and return it free of loose sand. UV50 shade complements rather than replaces sunscreen and other sun protection.",
    seo_title: "Beach Umbrella Rental Valencia | UV50 & Table",
    seo_description: "Rent a 210 cm UV50 beach umbrella in Valencia with an integrated table, cupholders and carry bag—ideal for beach days at Malvarrosa or Patacona.",
  },
  {
    locale: "es",
    short_description: "Alquila en Valencia una amplia sombrilla de playa UV50 de 210 cm con mesa integrada, posavasos y funda de transporte: una solución cómoda para disfrutar de Malvarrosa, Patacona y otras playas cercanas.",
    detail_description: "Disfruta de un día de playa en Valencia sin comprar ni transportar una sombrilla voluminosa. El modelo Aktive 62330 ofrece 210 cm de diámetro, tejido con protección UV50 y revestimiento interior plateado, estructura ventilada de ocho varillas y mástil de acero regulable e inclinable para adaptar la sombra al movimiento del sol. La mesa central mantiene bebidas y pequeños objetos alejados de la arena e incorpora posavasos, bolsillo y colgador ajustable. La punta en espiral facilita la fijación en arena adecuada, mientras que la funda con bandolera ayuda a transportar sus 2,39 kg entre el alojamiento y la costa. Es una opción práctica para familias y grupos pequeños que visitan Malvarrosa, Patacona u otras playas de Valencia. Su diseño antiviento mejora la estabilidad, pero debe instalarse firmemente, vigilarse y cerrarse si aumenta el viento.",
    includes_text: "Sombrilla de playa Aktive modelo 62330, mesa central integrada con posavasos y bolsillo, colgador ajustable y funda de transporte con bandolera.",
    constraints_text: "La sombrilla abierta mide 210 cm de diámetro y pesa 2,39 kg. Instálala únicamente en arena adecuada, fija bien la punta en espiral y no la dejes sin vigilancia. El diseño antiviento no es apto para temporales; ciérrala con rachas fuertes o tiempo inseguro.",
    delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia durante la reserva. La sombrilla se entrega plegada en su funda; la instalación en la playa corresponde al cliente salvo acuerdo distinto.",
    care_note: "Mantener alejada del fuego. Ciérrala cuando quede sin vigilancia, deja que se seque antes de guardarla y devuélvela sin arena suelta. La protección UV50 no sustituye el protector solar ni otras medidas de protección.",
    seo_title: "Alquiler Sombrilla de Playa Valencia | UV50 y Mesa",
    seo_description: "Alquila en Valencia una sombrilla de playa UV50 de 210 cm con mesa, posavasos y funda de transporte, ideal para Malvarrosa o Patacona.",
  },
];

const faqs = {
  en: [
    ["What is included with the beach umbrella rental?", "The rental includes the Aktive 62330 umbrella, its integrated table with cupholders and pocket, the adjustable accessory hook, and the carry sleeve with shoulder strap."],
    ["How large is the umbrella when open?", "The canopy is 210 cm in diameter. It provides useful shade for a family or small group, although the shaded area changes with the position of the sun."],
    ["Can I use it when the beach is windy?", "The top vent, eight-rib structure and spiral sand tip are designed to improve stability, but the umbrella is not stormproof. Secure it firmly and close it during strong gusts or unsafe weather."],
    ["Can the shade angle be adjusted?", "Yes. The steel mast is height-adjustable and tilts so you can change the shade angle as the sun moves."],
    ["Is it easy to carry to the beach?", "The umbrella weighs 2.39 kg and comes with a carry sleeve with shoulder strap. Its 210 cm size still makes it a long item, so plan your route from the pickup point or delivery address."],
  ],
  es: [
    ["¿Qué incluye el alquiler de la sombrilla?", "Incluye la sombrilla Aktive 62330, la mesa integrada con posavasos y bolsillo, el colgador ajustable y la funda de transporte con bandolera."],
    ["¿Cuánto mide la sombrilla abierta?", "El toldo mide 210 cm de diámetro. Ofrece una zona de sombra útil para una familia o un grupo pequeño, aunque la sombra cambia según la posición del sol."],
    ["¿Puedo usarla si hace viento en la playa?", "La ventilación superior, la estructura de ocho varillas y la punta en espiral mejoran la estabilidad, pero no es una sombrilla para temporales. Fíjala bien y ciérrala con rachas fuertes o tiempo inseguro."],
    ["¿Se puede regular la orientación de la sombra?", "Sí. El mástil de acero permite regular la altura e inclinar la sombrilla para adaptar el ángulo de la sombra al movimiento del sol."],
    ["¿Es fácil transportarla hasta la playa?", "Pesa 2,39 kg e incluye una funda con bandolera. Al medir 210 cm abierta sigue siendo un artículo alargado, por lo que conviene planificar el trayecto desde el punto de recogida o la dirección de entrega."],
  ],
};

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query("begin");
    const existing = await client.query(
      "select id, slug, is_active, stock_total from products where id = $1 for update",
      [productId],
    );
    if (existing.rowCount !== 1 || existing.rows[0].slug !== productSlug) {
      throw new Error("Expected beach umbrella product was not found");
    }

    await client.query(
      `update products
       set brand = $2, description = $3, features = $4::jsonb, specs = $5::jsonb,
           meta_title = $6, meta_description = $7, content_status = 'facts_verified'
       where id = $1`,
      [productId, product.brand, product.description, JSON.stringify(product.features), JSON.stringify(product.specs), product.metaTitle, product.metaDescription],
    );

    for (const localization of localizations) {
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
        [productId, localization.locale, localization.short_description, localization.detail_description,
          localization.includes_text, localization.constraints_text, localization.delivery_setup_note,
          localization.care_note, localization.seo_title, localization.seo_description],
      );
    }

    await client.query("delete from product_faqs where product_id = $1", [productId]);
    for (const [locale, items] of Object.entries(faqs)) {
      for (const [sortOrder, [question, answer]] of items.entries()) {
        await client.query(
          "insert into product_faqs (product_id, locale, question, answer, sort_order) values ($1,$2,$3,$4,$5)",
          [productId, locale, question, answer, sortOrder],
        );
      }
    }

    await client.query(
      `update product_images
       set alt_text = $2, source_url = $3
       where product_id = $1 and is_primary = true`,
      [productId, "Blue-and-white Aktive 210 cm beach umbrella with integrated table and cupholders", decathlonSource],
    );

    await client.query("commit");
    console.log(JSON.stringify({
      restored: productSlug,
      localizations: localizations.length,
      faqs: Object.values(faqs).flat().length,
      preserved: {
        is_active: existing.rows[0].is_active,
        stock_total: existing.rows[0].stock_total,
        pricing: true,
        availability_blocks: true,
        image_url: true,
      },
    }, null, 2));
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
