const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing");
  const client = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const result = await client.query(`
      select category.slug,
             count(distinct membership.product_id)::int as total_products,
             count(distinct membership.product_id) filter (where product.is_active)::int as active_products
        from public.categories category
        left join public.product_category_memberships membership on membership.category_id = category.id
        left join public.products product on product.id = membership.product_id
       where category.slug = any(array['kids-family', 'mobility', 'travel-outdoors', 'fitness-wellness']::text[])
       group by category.slug order by category.slug
    `);
    const kidsRow = result.rows.find((row) => row.slug === "kids-family");
    if (!kidsRow || kidsRow.active_products < 20) {
      throw new Error(`Expected at least 20 active Kids & Family memberships, found ${kidsRow?.active_products ?? 0}`);
    }
    const kidsPrimary = await client.query(`
      select count(*)::int as count
        from public.product_category_memberships membership
        join public.categories category on category.id = membership.category_id
       where category.slug = 'kids-family'
         and membership.is_primary
    `);
    if (kidsPrimary.rows[0].count !== 0) {
      throw new Error(`Kids & Family unexpectedly owns ${kidsPrimary.rows[0].count} primary products`);
    }
    console.log(JSON.stringify({ categoryCounts: result.rows }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Category verification failed: ${error.message}`);
  process.exit(1);
});
