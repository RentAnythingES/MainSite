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
  const applied = [];
  for (const product of batch.products) {
    const { data: existing, error: findError } = await supabase.from("products").select("id,is_active,content_status").eq("slug", product.currentSlug).single();
    if (findError) throw findError;
    if (existing.is_active || existing.content_status !== "draft") throw new Error(`${product.currentSlug} is not an inactive draft`);
    const { error: updateError } = await supabase.from("products").update({ name: product.name, slug: product.slug, brand: product.brand, description: product.description, features: product.features, specs: product.specs, content_status: "facts_verified" }).eq("id", existing.id);
    if (updateError) throw updateError;
    const { error: localizationError } = await supabase.from("product_localizations").upsert({ product_id: existing.id, locale: "en", ...product.localization, updated_at: new Date().toISOString() }, { onConflict: "product_id,locale" });
    if (localizationError) throw localizationError;
    const { error: deleteFaqError } = await supabase.from("product_faqs").delete().eq("product_id", existing.id).eq("locale", "en");
    if (deleteFaqError) throw deleteFaqError;
    const { error: faqError } = await supabase.from("product_faqs").insert(product.faqs.map((faq, sort_order) => ({ product_id: existing.id, locale: "en", question: faq.question, answer: faq.answer, sort_order })));
    if (faqError) throw faqError;
    applied.push({ id: existing.id, slug: product.slug });
  }
  console.log(JSON.stringify({ batch: batch.batch, applied }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
