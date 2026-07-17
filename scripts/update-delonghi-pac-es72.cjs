const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const applyChanges = process.argv.includes("--apply");
const slug = "portable-ac";
const imageUrl = "/products/delonghi-pinguino-pac-es72.webp";
const imageSourceUrl = "https://www.delonghi.com/es-es/p/aires-acondicionados-portatiles-aire-acondicionado-portatil-pinguino-compact-pac-es72-classic/PACES72CLASSIC.html?pid=0151453004";

const update = {
  name: "De’Longhi Pinguino Compact PAC ES72 CLASSIC",
  brand: "De’Longhi",
  image_url: imageUrl,
  description: "A compact 8,300 BTU portable air conditioner for cooling suitable rooms during hot Valencia stays, with dehumidification, remote control and a 24-hour timer.",
  subcategory: "AirCons",
  subcategory_slug: "aircons",
  content_status: "facts_verified",
  features: [
    "8,300 BTU/h (2.1 kW) cooling capacity",
    "Compact portable design with castors and handles",
    "Dehumidification up to 21 litres per day",
    "Two fan speeds",
    "LCD touch controls and remote control",
    "24-hour timer and room thermostat",
    "1.2 m warm-air exhaust hose",
  ],
  specs: {
    Model: "PAC ES72 CLASSIC",
    SKU: "0151453004",
    "Cooling capacity": "8,300 BTU/h (2.1 kW)",
    Dehumidification: "21 L/day",
    "Energy class": "A",
    "Input power": "808 W",
    "Standby consumption": "0.5 W",
    "Air flow": "180–280 m³/h",
    "Sound pressure": "47–52 dB(A)",
    "Fan speeds": "2",
    Refrigerant: "R290",
    Dimensions: "296 × 361 × 688 mm",
    Weight: "22.7 kg",
    "Venting hose": "1.2 m",
  },
};

const localizations = [
  {
    locale: "en",
    short_description: "Rent a compact De’Longhi Pinguino PAC ES72 air conditioner for a hot apartment or longer Valencia stay.",
    detail_description: "The De’Longhi Pinguino Compact PAC ES72 CLASSIC is a portable monobloc air conditioner with 8,300 BTU/h (2.1 kW) cooling capacity. Its compact footprint, castors and handles make placement easier, while the unit also offers dehumidification, two fan speeds, LCD touch controls, remote control and a 24-hour timer. Warm air must be vented outdoors through the supplied hose, so cooling performance depends on a suitable window setup, insulation, direct sun, occupancy and room layout.",
    includes_text: "De’Longhi Pinguino Compact PAC ES72 CLASSIC, remote control and 1.2 m warm-air exhaust hose. Window sealing accessories are included only when stated in the booking confirmation.",
    constraints_text: "Requires a suitable 220–240 V supply and a window or opening for the exhaust hose. Keep the unit upright and unobstructed. Portable air conditioners contain the compressor in the room and are therefore audible during operation.",
    delivery_setup_note: "We confirm delivery access, placement, the window opening, hose route and power socket before handover in Valencia.",
    care_note: "Keep the air inlet, outlet and hose clear. Do not move the appliance while operating or open the refrigerant circuit. Report warning lights, unusual noise or condensate issues promptly.",
    seo_title: "Rent a De’Longhi Pinguino Air Conditioner Valencia",
    seo_description: "Rent a De’Longhi Pinguino PAC ES72 portable air conditioner in Valencia, with local delivery and window setup confirmation.",
  },
  {
    locale: "es",
    short_description: "Alquila un De’Longhi Pinguino PAC ES72 compacto para refrescar un apartamento durante tu estancia en Valencia.",
    detail_description: "El De’Longhi Pinguino Compact PAC ES72 CLASSIC es un aire acondicionado portátil monobloque con 8.300 BTU/h (2,1 kW) de capacidad de refrigeración. Su formato compacto, ruedas y asas facilitan la colocación, y también ofrece deshumidificación, dos velocidades, controles LCD, mando a distancia y temporizador de 24 horas. El aire caliente debe evacuarse al exterior mediante el tubo, por lo que el rendimiento depende de una ventana adecuada, el aislamiento, el sol directo, la ocupación y la distribución de la habitación.",
    includes_text: "De’Longhi Pinguino Compact PAC ES72 CLASSIC, mando a distancia y tubo de evacuación de 1,2 m. Los accesorios de sellado solo se incluyen cuando figuran en la confirmación.",
    constraints_text: "Requiere una toma adecuada de 220–240 V y una ventana o abertura para el tubo. Mantén la unidad vertical y sin obstrucciones. Los equipos portátiles incorporan el compresor dentro de la habitación y se oyen durante el funcionamiento.",
    delivery_setup_note: "Confirmamos el acceso, la colocación, la ventana, el recorrido del tubo y la toma eléctrica antes de la entrega en Valencia.",
    care_note: "Mantén libres la entrada, la salida y el tubo. No muevas el equipo mientras funciona ni abras el circuito refrigerante. Avisa de alarmas, ruidos inusuales o problemas de condensación.",
    seo_title: "Alquiler De’Longhi Pinguino en Valencia",
    seo_description: "Alquila un De’Longhi Pinguino PAC ES72 portátil en Valencia, con entrega local y confirmación de la instalación en ventana.",
  },
];

const faqs = {
  en: [
    ["Does the PAC ES72 need a window?", "Yes. The warm-air exhaust hose must vent outdoors through a suitable window or opening whenever the unit is cooling."],
    ["Is the unit silent?", "No portable compressor air conditioner is silent. De’Longhi lists a sound-pressure range of 47–52 dB(A), depending on operating conditions and speed."],
    ["Does it also dehumidify?", "Yes. The manufacturer lists dehumidification of up to 21 litres per day under test conditions."],
    ["Are window-sealing accessories included?", "Only when they are explicitly listed in your booking confirmation. We first check the window type and hose route."],
  ],
  es: [
    ["¿El PAC ES72 necesita una ventana?", "Sí. El tubo de aire caliente debe evacuar al exterior por una ventana o abertura adecuada cuando el equipo está refrigerando."],
    ["¿Es silencioso?", "Ningún aire portátil con compresor es silencioso. De’Longhi indica una presión sonora de 47–52 dB(A), según el modo y las condiciones."],
    ["¿También deshumidifica?", "Sí. El fabricante indica hasta 21 litros al día en condiciones de ensayo."],
    ["¿Incluye accesorios para sellar la ventana?", "Solo cuando aparecen expresamente en la confirmación. Primero revisamos el tipo de ventana y el recorrido del tubo."],
  ],
};

async function snapshot(supabase, productId) {
  const [productResult, dateBlocksResult, inventoryBlocksResult] = await Promise.all([
    supabase.from("products").select("id,slug,name,brand,image_url,subcategory,subcategory_slug,stock_total,stock_available,is_active,content_status,pricing_tiers(min_days,per_day_cents),product_localizations(locale),product_faqs(locale),product_images(image_url,alt_text,source_url,rights_status,is_primary)").eq("id", productId).single(),
    supabase.from("blocked_dates").select("id,blocked_date,reason,booking_id").eq("product_id", productId).order("blocked_date"),
    supabase.from("booking_inventory_blocks").select("id,starts_at,ends_at,reason,booking_id,booking_draft_id").eq("product_id", productId).order("starts_at"),
  ]);
  if (productResult.error || dateBlocksResult.error || inventoryBlocksResult.error) throw productResult.error || dateBlocksResult.error || inventoryBlocksResult.error;
  return { product: productResult.data, dateBlocks: dateBlocksResult.data, inventoryBlocks: inventoryBlocksResult.data };
}

function summarize(snapshotValue) {
  const now = Date.now();
  return {
    product: snapshotValue.product,
    dateBlockCount: snapshotValue.dateBlocks.length,
    removableDateBlockCount: snapshotValue.dateBlocks.filter((block) => !block.booking_id).length,
    bookingLinkedDateBlockCount: snapshotValue.dateBlocks.filter((block) => block.booking_id).length,
    inventoryBlockCount: snapshotValue.inventoryBlocks.length,
    activeInventoryBlockCount: snapshotValue.inventoryBlocks.filter((block) => new Date(block.ends_at).getTime() > now).length,
  };
}

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: existing, error } = await supabase.from("products").select("id,stock_total").eq("slug", slug).single();
  if (error) throw error;
  const before = await snapshot(supabase, existing.id);

  if (!applyChanges) {
    console.log(JSON.stringify({ mode: "inspect", before: summarize(before) }, null, 2));
    return;
  }

  const { error: updateError } = await supabase.from("products").update(update).eq("id", existing.id);
  if (updateError) throw updateError;

  for (const localization of localizations) {
    const { error: localizationError } = await supabase.from("product_localizations").upsert({ product_id: existing.id, ...localization, updated_at: new Date().toISOString() }, { onConflict: "product_id,locale" });
    if (localizationError) throw localizationError;
  }

  const { error: faqDeleteError } = await supabase.from("product_faqs").delete().eq("product_id", existing.id);
  if (faqDeleteError) throw faqDeleteError;
  const faqRows = Object.entries(faqs).flatMap(([locale, entries]) => entries.map(([question, answer], sort_order) => ({ product_id: existing.id, locale, question, answer, sort_order })));
  const { error: faqError } = await supabase.from("product_faqs").insert(faqRows);
  if (faqError) throw faqError;

  const { error: imageDeleteError } = await supabase.from("product_images").delete().eq("product_id", existing.id).eq("is_primary", true);
  if (imageDeleteError) throw imageDeleteError;
  const { error: imageError } = await supabase.from("product_images").insert({
    product_id: existing.id,
    image_url: imageUrl,
    alt_text: "White De’Longhi Pinguino Compact PAC ES72 CLASSIC portable air conditioner",
    source_url: imageSourceUrl,
    rights_status: "unknown",
    is_primary: true,
    sort_order: 0,
  });
  if (imageError) throw imageError;

  const removableDateBlocks = before.dateBlocks.filter((block) => !block.booking_id);
  const { error: unblockError } = await supabase.from("blocked_dates").delete().eq("product_id", existing.id).is("booking_id", null);
  if (unblockError) throw unblockError;

  const activeInventoryBlocks = before.inventoryBlocks.filter((block) => new Date(block.ends_at).getTime() > Date.now());
  if (activeInventoryBlocks.length === 0) {
    const { error: stockError } = await supabase.from("products").update({ stock_available: existing.stock_total }).eq("id", existing.id);
    if (stockError) throw stockError;
  }

  const after = await snapshot(supabase, existing.id);
  const checks = {
    exactModel: after.product.name === update.name && after.product.brand === update.brand,
    exactImage: after.product.image_url === imageUrl && after.product.product_images.some((image) => image.is_primary && image.image_url === imageUrl),
    airCons: after.product.subcategory === "AirCons" && after.product.subcategory_slug === "aircons",
    localizations: after.product.product_localizations.filter((entry) => ["en", "es"].includes(entry.locale)).length === 2,
    faqs: after.product.product_faqs.filter((entry) => entry.locale === "en").length === 4 && after.product.product_faqs.filter((entry) => entry.locale === "es").length === 4,
    unlinkedDateBlocksRemoved: after.dateBlocks.every((block) => Boolean(block.booking_id)),
    stockSafelyRestored: activeInventoryBlocks.length > 0 || after.product.stock_available === after.product.stock_total,
  };
  if (Object.values(checks).some((value) => !value)) throw new Error(`Post-update verification failed: ${JSON.stringify(checks)}`);

  console.log(JSON.stringify({ mode: "applied", removedDateBlocks: removableDateBlocks.length, preservedBookingDateBlocks: after.dateBlocks.length, activeInventoryBlocks: activeInventoryBlocks.length, before: summarize(before), after: summarize(after), checks }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
