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

const expected = new Map([
  ["d9ec347e-8c22-4394-b58e-c8cbd02d1b34", "moni-serengeti-i-size-car-seat"],
  ["54928c5f-3e30-4d00-90e5-44daa9acc8bc", "maxi-cosi-pebble-360-pro2-infant-car-seat"],
  ["67ce7859-a850-4ff4-b8ef-26256727687b", "peg-perego-viaggio1-duo-fix-car-seat"],
  ["1cdb7ecb-4a5c-4c05-9d26-a125b8185e30", "kinderkraft-i-spark-2-plus-i-size-car-seat"],
  ["9d978c2d-4e71-463a-9878-a2ba17cf6e2c", "seat-booster"],
]);
const legacySlugs = [
  "car-seat-britax-i-size",
  "car-seat-infant",
  "convertible-car-seat",
  "kinderkraft-i-boost-2-booster-seat",
];
const correctedSlugs = [...expected.values()];
const auditOnly = process.argv.includes("--audit-only");

async function snapshot(client, slugs) {
  const result = await client.query(`
    select product.id,
           product.slug,
           product.name,
           product.brand,
           product.stock_total,
           product.stock_available,
           product.image_url,
           product.features,
           product.specs,
           product.is_active,
           product.content_status,
           count(distinct localization.locale)::integer as locale_count,
           count(distinct faq.id)::integer as faq_count,
           max(case when market.slug = 'valencia' then offer.stock_total end)::integer as offer_stock_total,
           max(case when market.slug = 'valencia' then offer.online_capacity end)::integer as online_capacity
      from public.products product
      left join public.product_localizations localization on localization.product_id = product.id
      left join public.product_faqs faq on faq.product_id = product.id
      left join public.product_offers offer on offer.product_id = product.id
      left join public.markets market on market.id = offer.market_id
     where product.slug = any($1::text[])
     group by product.id
     order by product.slug
  `, [slugs]);
  return result.rows;
}

function assertPreview(rows) {
  if (rows.length !== expected.size) {
    throw new Error(`Expected ${expected.size} corrected products, received ${rows.length}`);
  }
  for (const row of rows) {
    if (expected.get(row.id) !== row.slug) {
      throw new Error(`Product identity mismatch for ${row.id}: ${row.slug}`);
    }
    if (row.locale_count !== 2 || row.faq_count !== 6) {
      throw new Error(`${row.slug} must have two locales and three FAQs per locale`);
    }
  }
  const booster = rows.find((row) => row.slug === "seat-booster");
  if (!booster || booster.stock_total !== 3 || booster.stock_available !== 3
      || booster.offer_stock_total !== 3 || booster.online_capacity !== 3) {
    throw new Error("Generic booster stock and Valencia online capacity must all equal three");
  }
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
    const before = await snapshot(
      client,
      auditOnly ? [...correctedSlugs, ...legacySlugs] : [...legacySlugs, "seat-booster"],
    );
    let after = before;
    if (auditOnly) {
      assertPreview(before);
      const staleLegacy = before.filter((row) => legacySlugs.includes(row.slug));
      if (staleLegacy.length) throw new Error(`Legacy slugs remain: ${staleLegacy.map((row) => row.slug).join(", ")}`);
    }
    if (!auditOnly) {
      const migrationPath = path.join(
        projectRoot,
        "supabase",
        "migrations",
        "20260811_correct_car_seat_catalogue.sql",
      );
      if (!fs.existsSync(migrationPath)) throw new Error("Car-seat correction migration is missing");
      await client.query(fs.readFileSync(migrationPath, "utf8"));
      after = await snapshot(client, [...correctedSlugs, ...legacySlugs]);
      assertPreview(after);
      const staleLegacy = after.filter((row) => legacySlugs.includes(row.slug));
      if (staleLegacy.length) throw new Error(`Legacy slugs remain: ${staleLegacy.map((row) => row.slug).join(", ")}`);
    }

    console.log(JSON.stringify({
      mode: auditOnly ? "audit_only_rolled_back" : "preview_rolled_back",
      before,
      after,
    }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error("Car-seat catalogue preview failed:", error);
  process.exit(1);
});
