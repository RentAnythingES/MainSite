const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const batchPath = path.resolve(process.argv[2] || "");
if (!batchPath || !fs.existsSync(batchPath)) throw new Error("Pass a valid batch JSON path.");
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const slugs = batch.products.map((product) => product.slug);
  const { data, error } = await supabase.from("products").select("slug,is_active,content_status,product_localizations(locale,seo_title,seo_description),product_faqs(locale)").in("slug", slugs).order("slug");
  if (error) throw error;
  const report = data.map((product) => {
    const localization = product.product_localizations.find((item) => item.locale === "en");
    return { slug: product.slug, inactive: !product.is_active, status: product.content_status, enLocalizations: product.product_localizations.filter((item) => item.locale === "en").length, enFaqs: product.product_faqs.filter((item) => item.locale === "en").length, seoTitleLength: localization?.seo_title?.length || 0, seoDescriptionLength: localization?.seo_description?.length || 0 };
  });
  const invalid = report.length !== slugs.length || report.some((item) => !item.inactive || item.status !== "facts_verified" || item.enLocalizations !== 1 || item.enFaqs !== 3 || item.seoTitleLength > 60 || item.seoDescriptionLength > 155);
  console.log(JSON.stringify(report, null, 2));
  if (invalid) throw new Error(`Batch ${batch.batch} verification failed`);
}

main().catch((error) => { console.error(error); process.exit(1); });
