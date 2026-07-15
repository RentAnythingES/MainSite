const { Client } = require("pg");

process.loadEnvFile(".env.local");

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error("Usage: node scripts/verify-product-content-set.cjs <slug> [...slugs]");
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const { rows } = await client.query(
    `select p.slug, p.name, p.is_active, p.content_status, p.stock_total,
       count(distinct pt.id)::int as pricing_tiers,
       count(distinct pl.locale)::int as locales,
       count(distinct pf.id)::int as faqs,
       count(distinct pi.id)::int as images,
       bool_and(pl.short_description is not null and pl.detail_description is not null
         and pl.seo_title is not null and pl.seo_description is not null) as content_complete
     from products p
     left join pricing_tiers pt on pt.product_id = p.id
     left join product_localizations pl on pl.product_id = p.id
     left join product_faqs pf on pf.product_id = p.id
     left join product_images pi on pi.product_id = p.id
     where p.slug = any($1::text[])
     group by p.id
     order by p.slug`,
    [slugs],
  );

  if (rows.length !== slugs.length) {
    throw new Error(`Expected ${slugs.length} products, found ${rows.length}`);
  }
  console.log(JSON.stringify(rows, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
