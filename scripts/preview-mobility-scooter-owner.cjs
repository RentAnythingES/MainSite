/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const projectRoot = path.resolve(__dirname, "..");
const envCandidates = [
  path.join(projectRoot, ".env.local"),
  path.resolve(projectRoot, "..", "..", ".env.local"),
];
const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing");
  const migration = fs.readFileSync(
    path.join(projectRoot, "supabase", "migrations", "20260811_mobility_scooter_owner.sql"),
    "utf8",
  );
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  try {
    await client.query("begin");
    await client.query(migration);
    const result = await client.query(`
      select product.slug,
             product.subcategory,
             product.subcategory_slug,
             localization.seo_title,
             localization.seo_description
        from public.products product
        join public.product_localizations localization
          on localization.product_id = product.id
         and localization.locale = 'en'
       where product.slug = any(array[
         'mobility-scooter-lightweight-foldable',
         'mobility-scooter-standard',
         'heavy-duty-mobility-scooter'
       ]::text[])
       order by product.slug
    `);

    if (result.rows.length !== 3) throw new Error(`Expected three scooter records, found ${result.rows.length}`);
    console.log(JSON.stringify({ mode: "preview_rolled_back", products: result.rows }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Scooter-owner preview failed: ${error.message}`);
  process.exit(1);
});
