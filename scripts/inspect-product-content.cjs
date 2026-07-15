const { Client } = require("pg");

process.loadEnvFile(".env.local");

const productLookup = process.argv[2];
if (!productLookup) {
  console.error("Usage: node scripts/inspect-product-content.cjs <product-id|slug|exact-name>");
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  let productMatch = await client.query(
    "select id from products where id::text = $1 or slug = $1 or lower(name) = lower($1) limit 1",
    [productLookup],
  );
  if (productMatch.rowCount !== 1) {
    productMatch = await client.query(
      "select id, name, slug from products where name ilike $1 or slug ilike $1 order by name limit 10",
      [`%${productLookup}%`],
    );
  }
  if (productMatch.rowCount !== 1) {
    throw new Error(`Product lookup returned ${productMatch.rowCount} matches: ${JSON.stringify(productMatch.rows)}`);
  }
  const productId = productMatch.rows[0].id;
  const query = async (text) => (await client.query(text, [productId])).rows;
  const result = {
    product: await query("select id, name, slug, brand, description, features, specs, image_url, stock_total, is_active, content_status, meta_title, meta_description from products where id = $1"),
    pricing: await query("select min_days, per_day_cents from pricing_tiers where product_id = $1 order by min_days"),
    localizations: await query("select locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description from product_localizations where product_id = $1 order by locale"),
    faqs: await query("select locale, question, answer, sort_order from product_faqs where product_id = $1 order by locale, sort_order"),
    images: await query("select image_url, alt_text, source_url, rights_status, is_primary from product_images where product_id = $1 order by sort_order"),
  };

  console.log(JSON.stringify(result, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
