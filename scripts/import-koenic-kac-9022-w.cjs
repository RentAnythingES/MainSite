const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const slug = "koenic-kac-9022-w-portable-air-conditioner";
const sourcePage = "https://mediamarkt.pl/pl/product/_klimatyzator-koenic-kac-9022-w-wlan-air-conditioner-1464286.html";
const sourceImage = "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_142599577/fee_786_587_png";

const product = {
  name: "KOENIC KAC 9022 W Portable Air Conditioner",
  slug,
  brand: "KOENIC",
  description: "A 9,000 BTU portable air conditioner for cooling suitable rooms during hot Valencia stays, with fan and dehumidification modes, remote control and a 1.5 m exhaust hose.",
  emoji: "❄️",
  subcategory: "AirCons",
  subcategory_slug: "aircons",
  city: "valencia",
  stock_total: 1,
  stock_available: 1,
  is_active: false,
  content_status: "facts_verified",
  features: [
    "9,000 BTU/h (2.6 kW) cooling capacity",
    "Cooling, fan and dehumidification modes",
    "Three fan speeds",
    "Remote control and 24-hour timer",
    "Washable air filters",
    "1.5 m warm-air exhaust hose",
  ],
  specs: {
    Model: "KAC 9022 W",
    "Cooling capacity": "9,000 BTU/h (2.6 kW)",
    "Maximum room volume": "Up to 80 m³ under manufacturer test conditions",
    "Sound power": "62 dB(A)",
    Dehumidification: "2.6 L/h",
    "Energy class": "A",
    EER: "2.7",
    "Indicative cooling consumption": "1.0 kWh per hour",
    Refrigerant: "R290",
    Dimensions: "440 × 770 × 355 mm",
    Weight: "29.5 kg",
    "Exhaust hose": "1.5 m",
    "Pricing review": "Set rental pricing before activation",
  },
};

const localizations = [
  {
    locale: "en",
    short_description: "Rent a 9,000 BTU KOENIC portable air conditioner for a hot apartment or longer Valencia stay.",
    detail_description: "The KOENIC KAC 9022 W is a portable monobloc air conditioner with 9,000 BTU/h (2.6 kW) nominal cooling capacity. It also offers fan and dehumidification modes, three fan speeds, remote control and a 24-hour timer. The manufacturer lists a maximum room volume of 80 m³, but real performance depends on insulation, direct sun, occupancy and correct exhaust setup. Warm air must be vented outdoors through a suitable window or opening, so we confirm the room and access before accepting the booking.",
    includes_text: "KOENIC KAC 9022 W unit, remote control and 1.5 m exhaust hose. Window sealing accessories are included only when stated in the booking confirmation.",
    constraints_text: "Requires a suitable 220–240 V supply and a window or opening for the exhaust hose. The unit weighs 29.5 kg and has a declared sound power of 62 dB(A). Keep it upright and do not modify or open the refrigerant circuit.",
    delivery_setup_note: "Delivery and placement must be confirmed for the Valencia address. We check the window arrangement, hose route, access, ventilation and power point before handover.",
    care_note: "Keep air inlets, outlets and the hose unobstructed. Clean only as instructed, do not move the unit while operating, and report any condensate or fault warning promptly.",
    seo_title: "Rent a KOENIC Portable Air Conditioner Valencia",
    seo_description: "Rent a KOENIC KAC 9022 W portable air conditioner in Valencia. 9,000 BTU cooling with local delivery and setup confirmation.",
  },
  {
    locale: "es",
    short_description: "Alquila un aire acondicionado portátil KOENIC de 9.000 BTU para estancias calurosas en Valencia.",
    detail_description: "El KOENIC KAC 9022 W es un aire acondicionado portátil monobloque con una capacidad nominal de refrigeración de 9.000 BTU/h (2,6 kW). También ofrece modos de ventilación y deshumidificación, tres velocidades, mando a distancia y temporizador de 24 horas. El fabricante indica un volumen máximo de 80 m³, aunque el rendimiento real depende del aislamiento, la exposición solar, la ocupación y una correcta salida de aire. El aire caliente debe evacuarse al exterior por una ventana o abertura adecuada, por lo que confirmamos la habitación y el acceso antes de aceptar la reserva.",
    includes_text: "Unidad KOENIC KAC 9022 W, mando a distancia y tubo de evacuación de 1,5 m. Los accesorios de sellado de ventana solo se incluyen cuando figuran en la confirmación.",
    constraints_text: "Requiere una toma adecuada de 220–240 V y una ventana o abertura para el tubo. La unidad pesa 29,5 kg y declara 62 dB(A) de potencia sonora. Debe mantenerse vertical y no se puede modificar ni abrir el circuito refrigerante.",
    delivery_setup_note: "La entrega y colocación deben confirmarse para la dirección de Valencia. Revisamos la ventana, el recorrido del tubo, el acceso, la ventilación y la toma eléctrica antes de la entrega.",
    care_note: "Mantén libres las entradas, salidas y el tubo. Limpia solo según las instrucciones, no muevas el equipo durante su funcionamiento y avisa de cualquier alarma o problema de condensación.",
    seo_title: "Alquiler Aire Acondicionado Portátil Valencia",
    seo_description: "Alquila un KOENIC KAC 9022 W portátil en Valencia. Refrigeración de 9.000 BTU con entrega local y revisión de instalación.",
  },
];

const faqs = {
  en: [
    ["Does the air conditioner need a window?", "Yes. In cooling mode, the exhaust hose must vent warm air outdoors through a suitable window or opening. We confirm the setup before booking."],
    ["How large a room can it cool?", "The manufacturer states up to 80 m³ under test conditions. Real performance varies with insulation, sun exposure, room layout, occupancy and exhaust setup."],
    ["Is it quiet enough for a bedroom?", "The declared sound power is 62 dB(A), so it is not silent. Noise sensitivity varies and should be considered before booking it for overnight use."],
    ["Can I carry it upstairs myself?", "The unit weighs 29.5 kg. Delivery access and placement should be agreed in advance rather than assuming it can be carried safely by one person."],
  ],
  es: [
    ["¿Necesita una ventana?", "Sí. En modo refrigeración, el tubo debe expulsar el aire caliente al exterior por una ventana o abertura adecuada. Confirmamos la instalación antes de reservar."],
    ["¿Qué tamaño de habitación puede enfriar?", "El fabricante indica hasta 80 m³ en condiciones de ensayo. El resultado real depende del aislamiento, el sol, la distribución, la ocupación y la salida de aire."],
    ["¿Es silencioso para dormir?", "La potencia sonora declarada es de 62 dB(A), por lo que no es silencioso. Conviene valorar la sensibilidad al ruido antes de reservarlo para un dormitorio."],
    ["¿Puedo subirlo por las escaleras yo solo?", "La unidad pesa 29,5 kg. Debemos acordar previamente el acceso y la colocación en lugar de asumir que una sola persona puede transportarla con seguridad."],
  ],
};

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: exact } = await supabase.from("products").select("id,image_url,is_active").eq("slug", slug).maybeSingle();
  if (exact?.is_active) throw new Error("Exact KOENIC listing is already active; refusing to overwrite it");

  const { data: generic } = exact ? { data: null } : await supabase.from("products").select("id,category_id,is_active,content_status").eq("slug", "portable-air-conditioner").maybeSingle();
  if (generic && (generic.is_active || generic.content_status !== "draft")) throw new Error("Generic portable-air-conditioner record is not an inactive draft");

  const { data: category, error: categoryError } = await supabase.from("categories").select("id,name,slug").eq("slug", "home-living").single();
  if (categoryError) throw categoryError;

  let imageUrl = exact?.image_url || null;
  if (!imageUrl) {
    const response = await fetch(sourceImage);
    if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
    const contentType = (response.headers.get("content-type") || "image/png").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error("Image source did not return an image");
    const storagePath = `${slug}/${Date.now()}-${randomUUID()}.png`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, Buffer.from(await response.arrayBuffer()), { contentType, upsert: false });
    if (uploadError) throw uploadError;
    imageUrl = supabase.storage.from("product-images").getPublicUrl(storagePath).data.publicUrl;
  }

  const payload = { ...product, category_id: generic?.category_id || category.id, image_url: imageUrl };
  let productId = exact?.id || generic?.id;
  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) throw error;
    productId = data.id;
  }

  const { data: pricing } = await supabase.from("pricing_tiers").select("id").eq("product_id", productId).limit(1);
  if (!pricing?.length) {
    const { error } = await supabase.from("pricing_tiers").insert({ product_id: productId, min_days: 1, per_day_cents: 0 });
    if (error) throw error;
  }

  for (const localization of localizations) {
    const { error } = await supabase.from("product_localizations").upsert({ product_id: productId, ...localization, updated_at: new Date().toISOString() }, { onConflict: "product_id,locale" });
    if (error) throw error;
  }

  const { error: faqDeleteError } = await supabase.from("product_faqs").delete().eq("product_id", productId);
  if (faqDeleteError) throw faqDeleteError;
  const faqRows = Object.entries(faqs).flatMap(([locale, entries]) => entries.map(([question, answer], sort_order) => ({ product_id: productId, locale, question, answer, sort_order })));
  const { error: faqError } = await supabase.from("product_faqs").insert(faqRows);
  if (faqError) throw faqError;

  const { error: imageDeleteError } = await supabase.from("product_images").delete().eq("product_id", productId).eq("is_primary", true);
  if (imageDeleteError) throw imageDeleteError;
  const { error: imageError } = await supabase.from("product_images").insert({ product_id: productId, image_url: imageUrl, alt_text: "White KOENIC KAC 9022 W portable air conditioner", source_url: sourcePage, rights_status: "unknown", is_primary: true, sort_order: 0 });
  if (imageError) throw imageError;

  const { data: verified, error: verifyError } = await supabase
    .from("products")
    .select("id,slug,is_active,content_status,subcategory,subcategory_slug,image_url,pricing_tiers(min_days,per_day_cents),product_localizations(locale),product_faqs(locale),product_images(image_url,rights_status,is_primary)")
    .eq("id", productId)
    .single();
  if (verifyError) throw verifyError;

  const checks = {
    inactive: verified.is_active === false,
    factsVerified: verified.content_status === "facts_verified",
    airCons: verified.subcategory === "AirCons" && verified.subcategory_slug === "aircons",
    localizations: verified.product_localizations.filter((entry) => ["en", "es"].includes(entry.locale)).length === 2,
    faqs: verified.product_faqs.filter((entry) => entry.locale === "en").length === 4 && verified.product_faqs.filter((entry) => entry.locale === "es").length === 4,
    primaryImage: verified.product_images.some((entry) => entry.is_primary && entry.image_url === imageUrl && entry.rights_status === "unknown"),
    pricingHeldForReview: verified.pricing_tiers.some((entry) => entry.min_days === 1 && entry.per_day_cents === 0),
  };
  if (Object.values(checks).some((value) => !value)) throw new Error(`Post-import verification failed: ${JSON.stringify(checks)}`);

  console.log(JSON.stringify({ id: productId, slug, category: category.name, subcategory: product.subcategory, imageUrl, active: false, contentStatus: "facts_verified", pricing: "review required", checks }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
