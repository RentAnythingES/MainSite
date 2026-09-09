const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = [
  path.join(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "..", "..", ".env.local"),
].find((candidate) => fs.existsSync(candidate));

if (!envPath) throw new Error(".env.local was not found in the project or parent workspace");

for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

function readMigration(name) {
  return fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", name), "utf8");
}

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
    await client.query(readMigration("20260907_mobility_search_ownership.sql"));
    await client.query(readMigration("20260907_mobility_inquiries.sql"));

    const ownership = await client.query(`
      select
        (select count(*)::int
           from public.product_category_memberships membership
           join public.products product on product.id = membership.product_id
           join public.categories category on category.id = membership.category_id
          where product.slug = 'stroller-and-bike-trailer-for-2'
            and category.slug = 'mobility') as trailer_mobility_memberships,
        (select seo_title
           from public.product_localizations localization
           join public.products product on product.id = localization.product_id
          where product.slug = 'mobility-power-wheelchair'
            and localization.locale = 'en') as wheelchair_seo_title
    `);
    const inquiryTable = await client.query("select to_regclass('public.mobility_inquiries') as name");

    if (ownership.rows[0].trailer_mobility_memberships !== 0) throw new Error("Trailer remains in Mobility");
    if (ownership.rows[0].wheelchair_seo_title !== "Electric Wheelchair Rental in Valencia | Rent&Roll") {
      throw new Error(`Unexpected wheelchair title: ${ownership.rows[0].wheelchair_seo_title}`);
    }
    if (!inquiryTable.rows[0].name) throw new Error("Mobility inquiries table was not created");

    console.log(JSON.stringify({
      mode: "preview_rolled_back",
      ownership: ownership.rows[0],
      inquiryTable: inquiryTable.rows[0].name,
    }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Mobility sprint preview failed: ${error.message}`);
  process.exit(1);
});
