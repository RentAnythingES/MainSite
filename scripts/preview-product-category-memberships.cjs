const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const readMigration = (name) => fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", name), "utf8");

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing");
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  try {
    await client.query("begin");
    const table = await client.query("select to_regclass('public.product_category_memberships') as name");
    if (!table.rows[0].name) {
      await client.query(readMigration("20260810_product_category_memberships.sql"));
      await client.query(readMigration("20260810_repair_mobility_category_ownership.sql"));
    }

    const integrity = await client.query(`
      select
        (select count(*)::int from public.products) as products,
        (select count(*)::int from public.product_category_memberships where is_primary) as primary_memberships,
        (select count(*)::int from public.products product
          left join public.product_category_memberships membership
            on membership.product_id = product.id
           and membership.category_id = product.category_id
           and membership.is_primary
          where membership.product_id is null) as products_without_matching_primary
    `);
    const repaired = await client.query(`
      select count(*)::int as travel_primary,
             count(*) filter (where exists (
               select 1 from public.product_category_memberships membership
               join public.categories category on category.id = membership.category_id
               where membership.product_id = product.id
                 and not membership.is_primary
                 and category.slug = 'fitness-wellness'
             ))::int as fitness_secondary
      from public.products product
      join public.categories category on category.id = product.category_id
      where product.slug = any(array[
        'bike-towbar-carrier-3bikes', 'bike-towball-carrier-4bikes',
        'thule-proride-598-roof-bike-carrier', 'roof-box', 'transportation-trailer'
      ]::text[]) and category.slug = 'travel-outdoors'
    `);

    if (integrity.rows[0].products !== integrity.rows[0].primary_memberships || integrity.rows[0].products_without_matching_primary !== 0) {
      throw new Error(`Primary membership invariant failed: ${JSON.stringify(integrity.rows[0])}`);
    }
    if (repaired.rows[0].travel_primary !== 5 || repaired.rows[0].fitness_secondary !== 3) {
      throw new Error(`Mobility repair invariant failed: ${JSON.stringify(repaired.rows[0])}`);
    }
    console.log(JSON.stringify({ mode: "preview_rolled_back", integrity: integrity.rows[0], repair: repaired.rows[0] }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Category preview failed: ${error.message}`);
  process.exit(1);
});
