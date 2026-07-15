const { Client } = require("pg");
const { createClient } = require("@supabase/supabase-js");

process.loadEnvFile(".env.local");

const products = [
  {
    slug: "decathlon-xl-game-microfibre-towel",
    name: "Decathlon XL Game Microfibre Towel",
    brand: "Decathlon",
    sourceUrl: "https://www.decathlon.es/es/p/toalla-microfibra-talla-xl-110-x-175-cm-estampada-game/174612/c179c5c228m8982016",
    sourceImageUrl: "https://contents.mediadecathlon.com/p3035026/k$526915482f4cfcd157a99393ab706bbf/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Decathlon XL Game patterned microfibre towel in beige, blue and green",
    description: "An extra-large 110 × 175 cm patterned microfibre towel that packs compactly and dries quickly for Valencia beach, pool and apartment stays.",
    features: [
      "Extra-large 110 × 175 cm format",
      "Compact microfibre construction",
      "Quick-drying fabric for repeat use",
      "Machine washable at up to 30°C",
      "Soft patterned finish",
      "Designed for beach, pool, gym and bathing use",
    ],
    specs: {
      Brand: "Decathlon",
      "Product ID": "8982016",
      Dimensions: "110 × 175 cm",
      Surface: "1.92 m²",
      "Listed weight": "320–340 g; the source page contains both values",
      Weight: "170 g/m²",
      Material: "90% polyester, 10% polyamide",
      Colour: "Linen beige, blue and spring green",
      Style: "Patterned",
      Care: "Machine wash at 30°C; no fabric softener, bleach, ironing, tumble drying or dry cleaning",
    },
    localization: {
      en: {
        short_description: "Rent an XL Decathlon microfibre towel in Valencia for beach, pool or apartment use without packing a bulky cotton towel.",
        detail_description: "This Decathlon XL Game towel measures 110 × 175 cm and provides 1.92 m² of coverage while remaining compact enough for day trips and holiday luggage. Its 170 g/m² microfibre fabric is designed to dry quickly between uses and should be pressed against the skin rather than rubbed for efficient drying. Decathlon lists the main fabric as 90% polyester and 10% polyamide. The source page contains two close weight figures, 320 g and 340 g, so the rental listing records the verified range rather than presenting one as certain. It is a practical individual towel for Malvarrosa, Patacona, a swimming pool or an apartment stay.",
        includes_text: "One Decathlon XL Game patterned microfibre towel, 110 × 175 cm.",
        constraints_text: "This is an individual-use textile item. Do not use fabric softener, bleach, an iron, tumble dryer or dry cleaning. Avoid contact with sharp or heavily soiled surfaces.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. The towel is supplied folded; confirm the required quantity before checkout.",
        care_note: "Shake off sand, allow the towel to dry and return it separately from wet or heavily soiled equipment. Machine wash at no more than 30°C without fabric softener or bleach.",
        seo_title: "Rent an XL Microfibre Beach Towel in Valencia",
        seo_description: "Rent a compact Decathlon XL microfibre towel in Valencia. 110 × 175 cm, quick drying and suitable for beach, pool or apartment use.",
      },
      es: {
        short_description: "Alquila una toalla XL de microfibra Decathlon en Valencia para playa, piscina o apartamento sin llevar una toalla de algodón voluminosa.",
        detail_description: "La toalla Decathlon XL Game mide 110 × 175 cm y ofrece una superficie de 1,92 m² en un formato compacto para excursiones y equipaje de vacaciones. Su tejido de microfibra de 170 g/m² está diseñado para secarse rápidamente entre usos; Decathlon recomienda presionarlo sobre la piel en lugar de frotar. La composición indicada es 90% poliéster y 10% poliamida. La página de origen muestra dos pesos cercanos, 320 g y 340 g, por lo que esta ficha registra el intervalo verificado en lugar de afirmar uno de ellos. Es una toalla individual práctica para Malvarrosa, Patacona, piscina o apartamento.",
        includes_text: "Una toalla de microfibra estampada Decathlon XL Game de 110 × 175 cm.",
        constraints_text: "Artículo textil de uso individual. No utilizar suavizante, lejía, plancha, secadora ni limpieza en seco. Evitar superficies afiladas o muy sucias.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia durante la reserva. La toalla se entrega plegada; confirma la cantidad necesaria antes del pago.",
        care_note: "Retira la arena, deja secar la toalla y devuélvela separada del material mojado o muy sucio. Lavar a máquina a un máximo de 30°C sin suavizante ni lejía.",
        seo_title: "Alquiler Toalla Playa Microfibra XL en Valencia",
        seo_description: "Alquila una toalla XL de microfibra Decathlon en Valencia. Mide 110 × 175 cm, seca rápido y sirve para playa, piscina o apartamento.",
      },
    },
    faqs: {
      en: [
        ["How large is the Decathlon XL towel?", "It measures 110 × 175 cm and has a listed surface area of 1.92 m²."],
        ["Does it dry quickly?", "Yes. Decathlon describes the microfibre construction as quick drying and suitable for reuse between swims once properly aired."],
        ["How should I use and care for it?", "Press the towel against the skin rather than rubbing. Shake off sand, dry it after use and do not use fabric softener, bleach, an iron, tumble dryer or dry cleaning."],
      ],
      es: [
        ["¿Qué tamaño tiene la toalla Decathlon XL?", "Mide 110 × 175 cm y la superficie indicada es de 1,92 m²."],
        ["¿Se seca rápidamente?", "Sí. Decathlon describe la microfibra como de secado rápido y apta para reutilizarla entre baños después de airearla correctamente."],
        ["¿Cómo debo usarla y cuidarla?", "Presiona la toalla sobre la piel en lugar de frotar. Retira la arena, déjala secar y no uses suavizante, lejía, plancha, secadora ni limpieza en seco."],
      ],
    },
  },
  {
    slug: "le-comptoir-xl-marine-striped-beach-towel",
    name: "Le Comptoir XL Marine Striped Microfibre Beach Towel",
    brand: "Le Comptoir de la Plage",
    sourceUrl: "https://www.decathlon.es/es/p/mp/toalla-de-playa-xl-de-microfibra-rayada-marine-140x170cm-220g-m2/802337cd-8748-43ea-8aee-342aefa3ea22/c5",
    sourceImageUrl: "https://contents.mediadecathlon.com/m33930774/k$af3e45d6069438c9838f7b8f7472c60b/picture.jpg?format=auto&f=1920x0",
    imageAlt: "Blue marine striped Le Comptoir de la Plage XL microfibre beach towel",
    description: "A wide 140 × 170 cm blue striped microfibre beach towel with a printed jacquard-velour front, white bouclé reverse and quick-drying 220 g/m² fabric.",
    features: [
      "Wide 140 × 170 cm beach format",
      "Quick-drying microfibre fabric",
      "Blue marine striped design",
      "Printed jacquard-velour front",
      "White bouclé-terry reverse",
      "Oeko-Tex certified according to the supplier listing",
    ],
    specs: {
      Brand: "Le Comptoir de la Plage",
      Dimensions: "140 × 170 cm",
      Weight: "220 g/m²",
      Material: "100% polyester microfibre",
      Front: "Printed jacquard velour",
      Reverse: "White bouclé terry",
      Colour: "Blue marine stripes",
      Certification: "Oeko-Tex according to the supplier listing",
      Size: "One size",
    },
    localization: {
      en: {
        short_description: "Rent a wide 140 × 170 cm marine-striped microfibre beach towel in Valencia for extra coverage without a bulky cotton towel.",
        detail_description: "The Le Comptoir de la Plage XL Marine towel measures 140 × 170 cm, making it wider than a standard bath towel for relaxing on Valencia's beaches or beside a pool. The supplier lists a 220 g/m², 100% polyester microfibre construction designed to dry quickly and take up relatively little luggage space. Its blue marine stripe is printed on a jacquard-velour front, while the reverse is white bouclé terry. The product listing states Oeko-Tex certification. This is a practical individual towel for guests who want generous coverage at Malvarrosa, Patacona or their accommodation without purchasing a towel for a short stay.",
        includes_text: "One Le Comptoir de la Plage XL Marine striped microfibre towel, 140 × 170 cm.",
        constraints_text: "This is an individual-use textile item. Keep it away from sharp surfaces and return it free of excess sand, oils or heavy soiling. Certification is recorded as stated by the supplier.",
        delivery_setup_note: "Choose an available Valencia pickup or delivery option during booking. The towel is supplied folded; confirm the required quantity before checkout.",
        care_note: "Shake off sand and allow the towel to dry fully after use. Follow the care label attached to the physical towel and report any staining or damage before return.",
        seo_title: "Rent an XL Striped Beach Towel in Valencia",
        seo_description: "Rent a 140 × 170 cm XL striped microfibre beach towel in Valencia. Quick drying, lightweight and suitable for beach, pool or apartment use.",
      },
      es: {
        short_description: "Alquila en Valencia una toalla de playa XL de microfibra rayada de 140 × 170 cm para disfrutar de más superficie sin una toalla de algodón voluminosa.",
        detail_description: "La toalla XL Marine de Le Comptoir de la Plage mide 140 × 170 cm y ofrece más anchura que una toalla de baño convencional para descansar en las playas de Valencia o junto a una piscina. El proveedor indica un tejido de microfibra 100% poliéster de 220 g/m², diseñado para secarse rápidamente y ocupar relativamente poco espacio en el equipaje. El estampado de rayas marinas azules está en un anverso de terciopelo jacquard y el reverso es de rizo bouclé blanco. La ficha del producto declara certificación Oeko-Tex. Es una opción individual para Malvarrosa, Patacona o el alojamiento sin comprar una toalla para una estancia corta.",
        includes_text: "Una toalla de microfibra XL Marine rayada de Le Comptoir de la Plage de 140 × 170 cm.",
        constraints_text: "Artículo textil de uso individual. Mantener alejado de superficies afiladas y devolver sin exceso de arena, aceites o suciedad intensa. La certificación se registra tal como aparece en la ficha del proveedor.",
        delivery_setup_note: "Elige una opción disponible de recogida o entrega en Valencia durante la reserva. La toalla se entrega plegada; confirma la cantidad necesaria antes del pago.",
        care_note: "Retira la arena y deja secar la toalla por completo después de usarla. Sigue la etiqueta de cuidado de la toalla física e informa de manchas o daños antes de devolverla.",
        seo_title: "Alquiler Toalla Playa XL Rayada en Valencia",
        seo_description: "Alquila una toalla de playa XL rayada de 140 × 170 cm en Valencia. Microfibra de secado rápido para playa, piscina o apartamento.",
      },
    },
    faqs: {
      en: [
        ["How large is the XL Marine striped towel?", "It measures 140 × 170 cm, giving one person generous coverage for the beach or pool."],
        ["What are the two sides made like?", "The supplier describes a printed jacquard-velour front and a white bouclé-terry reverse, made from 100% polyester microfibre."],
        ["Is the towel quick drying?", "Yes. The supplier describes the 220 g/m² microfibre fabric as quick drying and compact for travel."],
      ],
      es: [
        ["¿Qué tamaño tiene la toalla XL Marine?", "Mide 140 × 170 cm y ofrece una superficie amplia para una persona en la playa o la piscina."],
        ["¿Cómo son las dos caras?", "El proveedor describe un anverso estampado de terciopelo jacquard y un reverso blanco de rizo bouclé, en microfibra 100% poliéster."],
        ["¿La toalla se seca rápido?", "Sí. El proveedor describe el tejido de microfibra de 220 g/m² como de secado rápido y compacto para viajar."],
      ],
    },
  },
];

function extensionFor(contentType) {
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/png") return "png";
  return "jpg";
}

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const category = await client.query("select id from categories where slug = 'travel-outdoors' limit 1");
  if (category.rowCount !== 1) throw new Error("Beach & Outdoor category not found");

  const results = [];
  for (const product of products) {
    const duplicate = await client.query("select id from products where slug = $1", [product.slug]);
    if (duplicate.rowCount > 0) throw new Error(`Product already exists: ${product.slug}`);

    const imageResponse = await fetch(product.sourceImageUrl);
    if (!imageResponse.ok) throw new Error(`Image download failed for ${product.slug}: ${imageResponse.status}`);
    const contentType = (imageResponse.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error(`Image source was not an image for ${product.slug}`);
    const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
    const storagePath = `${product.slug}/${Date.now()}-primary.${extensionFor(contentType)}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, imageBytes, { contentType, upsert: false });
    if (uploadError) throw uploadError;
    const imageUrl = supabase.storage.from("product-images").getPublicUrl(storagePath).data.publicUrl;

    try {
      await client.query("begin");
      const inserted = await client.query(
        `insert into products
          (slug, name, brand, description, emoji, image_url, category_id, subcategory, subcategory_slug,
           city, stock_total, stock_available, is_active, meta_title, meta_description, features, specs, content_status)
         values ($1,$2,$3,$4,'🏖️',$5,$6,'Beach Towels','beach-towels','valencia',0,0,false,$7,$8,$9::jsonb,$10::jsonb,'facts_verified')
         returning id`,
        [product.slug, product.name, product.brand, product.description, imageUrl, category.rows[0].id,
          product.localization.en.seo_title, product.localization.en.seo_description,
          JSON.stringify(product.features), JSON.stringify(product.specs)],
      );
      const productId = inserted.rows[0].id;

      await client.query(
        "insert into pricing_tiers (product_id, min_days, per_day_cents) values ($1,1,0)",
        [productId],
      );

      for (const [locale, localization] of Object.entries(product.localization)) {
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

      for (const [locale, entries] of Object.entries(product.faqs)) {
        for (const [sortOrder, [question, answer]] of entries.entries()) {
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
        [productId, imageUrl, product.imageAlt, product.sourceUrl],
      );

      await client.query("commit");
      results.push({ id: productId, slug: product.slug, imageUrl, contentStatus: "facts_verified", active: false });
    } catch (error) {
      await client.query("rollback");
      await supabase.storage.from("product-images").remove([storagePath]);
      throw error;
    }
  }

  const slugs = products.map((product) => product.slug);
  const verification = await client.query(
    `select p.id, p.slug, p.is_active, p.content_status, p.stock_total, p.image_url,
      count(distinct pl.locale) as localization_count,
      count(distinct pf.id) as faq_count,
      count(distinct pi.id) filter (where pi.is_primary) as primary_image_count,
      count(distinct pt.id) as pricing_count
     from products p
     left join product_localizations pl on pl.product_id = p.id
     left join product_faqs pf on pf.product_id = p.id
     left join product_images pi on pi.product_id = p.id
     left join pricing_tiers pt on pt.product_id = p.id
     where p.slug = any($1)
     group by p.id
     order by p.slug`,
    [slugs],
  );
  await client.end();

  if (verification.rowCount !== products.length) throw new Error("Post-import verification did not find both products");
  for (const row of verification.rows) {
    if (row.is_active || row.content_status !== "facts_verified" || row.localization_count !== "2"
      || Number(row.faq_count) !== 6 || Number(row.primary_image_count) !== 1 || Number(row.pricing_count) !== 1) {
      throw new Error(`Post-import verification failed: ${JSON.stringify(row)}`);
    }
  }

  console.log(JSON.stringify({ created: results, verified: verification.rows }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
