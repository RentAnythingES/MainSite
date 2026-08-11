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
  "car-seat-britax-i-size",
  "convertible-car-seat",
  "kinderkraft-i-boost-2-booster-seat",
];
const excludedSlugs = [
  "car-seat-infant",
  "seat-booster",
  "maxi-cosi-emerald-360-s-i-size-car-seat",
];
const auditOnly = process.argv.includes("--audit-only");
const requestedSlug = process.argv.find((argument) => argument.startsWith("--slug="))?.slice(7);

async function snapshot(client, slugs) {
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
           product.is_active,
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
           localization.detail_description,
           localization.includes_text,
           localization.constraints_text,
           localization.delivery_setup_note,
           localization.care_note,
           localization.seo_title,
           localization.seo_description,
           (
             select json_agg(
               json_build_object('question', faq.question, 'answer', faq.answer)
               order by faq.sort_order
             )
               from public.product_faqs faq
              where faq.product_id = product.id
                and faq.locale = localization.locale
           ) as faqs
      from public.products product
      join public.product_localizations localization
        on localization.product_id = product.id
     where product.slug = any($1::text[])
     order by product.slug, localization.locale
  `, [slugs]);
  return result.rows;
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
    const snapshotSlugs = requestedSlug ? [requestedSlug] : [...familySlugs, ...excludedSlugs];
    const before = await snapshot(client, snapshotSlugs);
    let after = before;
    if (!auditOnly) {
      const migrationPath = path.join(
        projectRoot,
        "supabase",
        "migrations",
        "20260811_car_seat_family_owner.sql",
      );
      if (!fs.existsSync(migrationPath)) throw new Error("Car-seat owner migration is missing");
      await client.query(fs.readFileSync(migrationPath, "utf8"));
      after = await snapshot(client, snapshotSlugs);
    }

    if (!requestedSlug) {
      const represented = new Set(after.map((row) => row.slug));
      for (const slug of familySlugs) {
        if (!represented.has(slug)) throw new Error(`Family product is missing: ${slug}`);
      }
      for (const slug of excludedSlugs) {
        if (!represented.has(slug)) throw new Error(`Excluded car-seat record is missing: ${slug}`);
      }
    }

    console.log(JSON.stringify({
      mode: auditOnly ? "audit_only_rolled_back" : "preview_rolled_back",
      familySlugs,
      excludedSlugs,
      before,
      after,
    }, null, 2));
  } finally {
    await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error("Car-seat owner preview failed:", error);
  process.exit(1);
});
