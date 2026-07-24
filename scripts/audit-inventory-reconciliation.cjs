const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  try {
    const result = await client.query(`
      select
        product.id,
        product.slug,
        product.name,
        product.is_active,
        product.stock_total,
        product.stock_available,
        count(unit.id) filter (where unit.status <> 'retired')::int as physical_units,
        count(unit.id) filter (where unit.status = 'available')::int as physically_available,
        count(unit.id) filter (where unit.status in ('maintenance', 'damaged'))::int as unavailable_units
      from public.products product
      left join public.inventory_units unit on unit.product_id = product.id
      group by product.id
      having
        product.stock_total > 0
        or product.stock_available > 0
        or count(unit.id) > 0
      order by product.is_active desc, product.name
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Inventory reconciliation audit failed: ${error.message}`);
  process.exit(1);
});
