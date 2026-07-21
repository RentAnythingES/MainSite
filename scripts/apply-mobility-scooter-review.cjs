const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const batch = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data/product-content/mobility-scooter-review.json"), "utf8")
);

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const reviewed = [];

  for (const product of batch.products) {
    const { data: existing, error: findError } = await supabase
      .from("products")
      .select("id,slug,is_active,stock_total,stock_available,image_url")
      .eq("slug", product.slug)
      .single();
    if (findError) throw findError;
    if (!existing.is_active) throw new Error(`${product.slug} is not live`);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: product.name,
        brand: product.brand,
        description: product.description,
        features: product.features,
        specs: product.specs,
        content_status: product.contentStatus,
      })
      .eq("id", existing.id);
    if (updateError) throw updateError;

    const { data: primaryImage, error: imageFindError } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", existing.id)
      .eq("is_primary", true)
      .maybeSingle();
    if (imageFindError) throw imageFindError;

    const imageRecord = {
      product_id: existing.id,
      image_url: existing.image_url,
      alt_text: product.imageReview.altText,
      source_url: product.imageReview.sourceUrl,
      rights_status: product.imageReview.rightsStatus,
      is_primary: true,
      sort_order: 0,
    };
    const imageMutation = primaryImage
      ? supabase.from("product_images").update(imageRecord).eq("id", primaryImage.id)
      : supabase.from("product_images").insert(imageRecord);
    const { error: imageError } = await imageMutation;
    if (imageError) throw imageError;

    for (const [locale, localization] of Object.entries(product.localizations)) {
      const { error: localizationError } = await supabase
        .from("product_localizations")
        .upsert(
          {
            product_id: existing.id,
            locale,
            ...localization,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id,locale" }
        );
      if (localizationError) throw localizationError;

      const { error: deleteFaqError } = await supabase
        .from("product_faqs")
        .delete()
        .eq("product_id", existing.id)
        .eq("locale", locale);
      if (deleteFaqError) throw deleteFaqError;

      const { error: faqError } = await supabase.from("product_faqs").insert(
        product.faqs[locale].map((faq, sortOrder) => ({
          product_id: existing.id,
          locale,
          question: faq.question,
          answer: faq.answer,
          sort_order: sortOrder,
        }))
      );
      if (faqError) throw faqError;
    }

    reviewed.push({
      slug: product.slug,
      active: existing.is_active,
      stockTotal: existing.stock_total,
      stockAvailable: existing.stock_available,
      imageUrl: existing.image_url,
      contentStatus: product.contentStatus,
    });
  }

  const { data: verification, error: verifyError } = await supabase
    .from("products")
    .select("slug,name,brand,content_status,product_localizations(locale,seo_title),product_faqs(locale)")
    .in("slug", batch.products.map((product) => product.slug));
  if (verifyError) throw verifyError;

  console.log(JSON.stringify({ review: batch.review, reviewed, verification }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
