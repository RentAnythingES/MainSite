/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const projectRoot = path.resolve(__dirname, "..");
const envPath = [
  path.join(projectRoot, ".env.local"),
  path.resolve(projectRoot, "..", "..", ".env.local"),
].find((candidate) => fs.existsSync(candidate));

if (envPath) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const familySlugs = [
  "stroller-travel-compact",
  "stroller-all-terrain",
  "stroller-double",
];
const excludedSlug = "stroller-and-bike-trailer-for-2";

async function snapshot(client) {
  const result = await client.query(`
    select product.slug,
           product.name,
           product.brand,
           product.description,
           product.subcategory,
           product.subcategory_slug,
           product.image_url,
           product.features,
           product.specs,
           product.content_status,
           (
             select json_agg(
               json_build_object('days', pricing.min_days, 'per_day', pricing.per_day_cents / 100.0)
               order by pricing.min_days
             )
               from public.pricing_tiers pricing
              where pricing.product_id = product.id
           ) as pricing,
           localization.locale,
           localization.short_description,
           localization.constraints_text,
           localization.seo_title,
           localization.seo_description
      from public.products product
      join public.product_localizations localization
        on localization.product_id = product.id
     where product.slug = any($1::text[])
     order by product.slug, localization.locale
  `, [[...familySlugs, excludedSlug]]);
  return result.rows;
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing");
  const migration = fs.readFileSync(
    path.join(projectRoot, "supabase", "migrations", "20260811_stroller_family_owner.sql"),
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
    const before = await snapshot(client);
    await client.query(migration);
    const after = await snapshot(client);
    const represented = new Set(after.map((row) => row.slug));

    for (const slug of familySlugs) {
      if (!represented.has(slug)) throw new Error(`Family product is missing: ${slug}`);
    }
    if (!represented.has(excludedSlug)) throw new Error("Excluded trailer record is missing from the audit snapshot");

    console.log(JSON.stringify({
      mode: "preview_rolled_back",
      familySlugs,
      excludedSlug,
      before,
      after,
    }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error("Stroller-owner preview failed:", error);
  process.exit(1);
});
