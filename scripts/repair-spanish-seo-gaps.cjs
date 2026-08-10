/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const applyChanges = process.argv.includes("--apply");
const repairs = [
  {
    slug: "bed-rail-for-kids",
    short_description: "Barrera de cama infantil para una estancia temporal en Valencia, con opciones de entrega o recogida según la disponibilidad.",
    seo_title: "Alquiler de barrera de cama infantil en Valencia",
    seo_description: "Alquila una barrera de cama infantil en Valencia para una estancia temporal, con entrega o recogida según la disponibilidad de tus fechas.",
  },
  {
    slug: "convertible-car-seat",
    short_description: "Silla de coche infantil convertible para desplazamientos durante tu estancia en Valencia, sujeta a disponibilidad para las fechas elegidas.",
    seo_title: "Alquiler de silla de coche infantil en Valencia",
    seo_description: "Alquila una silla de coche infantil convertible en Valencia para tus desplazamientos, con entrega o recogida según fechas y disponibilidad.",
  },
  {
    slug: "seat-booster",
    short_description: "Elevador infantil ligero para desplazamientos en coche durante tu estancia en Valencia, disponible con entrega o recogida según tus fechas.",
    seo_title: "Alquiler de elevador de coche infantil en Valencia",
    seo_description: "Alquila un elevador de coche infantil en Valencia para tus desplazamientos, con entrega o recogida y disponibilidad según las fechas elegidas.",
  },
  {
    slug: "transportation-trailer",
    short_description: "Remolque cerrado para transportar equipaje o material voluminoso durante una estancia o traslado en Valencia, sujeto a disponibilidad.",
    seo_title: "Alquiler de remolque de transporte en Valencia",
    seo_description: "Alquila un remolque de transporte en Valencia para mover equipaje o material voluminoso, con entrega o recogida según fechas y disponibilidad.",
  },
  {
    slug: "travel-cot",
    short_description: "Cuna de viaje plegable para preparar un espacio de descanso temporal durante una estancia familiar en Valencia.",
    seo_title: "Alquiler de cuna de viaje en Valencia",
    seo_description: "Alquila una cuna de viaje plegable en Valencia para la estancia de tu bebé, con entrega o recogida y disponibilidad según las fechas elegidas.",
  },
  {
    slug: "video-baby-monitor",
    short_description: "Vigilabebés con cámara para supervisar el espacio de descanso durante una estancia familiar temporal en Valencia.",
    seo_title: "Alquiler de vigilabebés con cámara en Valencia",
    seo_description: "Alquila un vigilabebés con cámara en Valencia para tu alojamiento, con entrega o recogida y disponibilidad confirmada para las fechas elegidas.",
  },
];

function validateRepair(repair) {
  if (!repair.short_description.trim()) throw new Error(`${repair.slug}: missing short description`);
  if (repair.seo_title.length > 60) throw new Error(`${repair.slug}: SEO title exceeds 60 characters`);
  if (repair.seo_description.length < 130 || repair.seo_description.length > 155) {
    throw new Error(`${repair.slug}: SEO description must contain 130-155 characters`);
  }
}

async function main() {
  repairs.forEach(validateRepair);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are missing");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  const slugs = repairs.map((repair) => repair.slug);
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id,slug,is_active,content_status")
    .in("slug", slugs);
  if (productError) throw productError;

  const productsBySlug = new Map((products || []).map((product) => [product.slug, product]));
  for (const repair of repairs) {
    const product = productsBySlug.get(repair.slug);
    if (!product) throw new Error(`${repair.slug}: product not found`);
    if (!product.is_active || product.content_status !== "content_ready") {
      throw new Error(`${repair.slug}: product is not active and content-ready`);
    }

    const { data: rows, error: rowError } = await supabase
      .from("product_localizations")
      .select("product_id,locale")
      .eq("product_id", product.id)
      .eq("locale", "es");
    if (rowError) throw rowError;
    if ((rows || []).length !== 1) throw new Error(`${repair.slug}: expected one Spanish localization row`);

    if (applyChanges) {
      const { error: updateError } = await supabase
        .from("product_localizations")
        .update({
          short_description: repair.short_description,
          seo_title: repair.seo_title,
          seo_description: repair.seo_description,
          updated_at: new Date().toISOString(),
        })
        .eq("product_id", product.id)
        .eq("locale", "es");
      if (updateError) throw updateError;
    }

    console.log(`${repair.slug}: ${applyChanges ? "updated" : "ready"}`);
  }

  console.log(applyChanges ? "Spanish SEO repairs applied." : "Dry run complete; use --apply to write changes.");
}

main().catch((error) => {
  console.error(`[repair-spanish-seo-gaps] ${error.message}`);
  process.exit(1);
});
