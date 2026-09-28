import fs from "node:fs";
import path from "node:path";
import {
  translationReadiness,
  blankTranslation,
} from "../src/lib/translation-workflow.ts";
import { isLocale, localeRegistry } from "../src/i18n/config.ts";

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1];
};
const locale = option("--locale") || "de";
let snapshot;
if (args.includes("--fixture")) {
  const content = {
    ...blankTranslation(),
    name: "Test",
    short_description: "Test",
    detail_description: "Test",
    includes_text: "Test",
    constraints_text: "Test",
    delivery_setup_note: "Test",
    care_note: "Test",
    seo_title: "Test",
    seo_description: "x".repeat(140),
    image_alt_text: "Test",
    faqs: Array.from({ length: 3 }, () => ({ question: "Q", answer: "A" })),
  };
  snapshot = {
    source: "fixture",
    products: [
      {
        slug: "fixture-product",
        name: "Fixture",
        translation_source_revision: 1,
        product_localizations: [
          {
            locale,
            translation_content: content,
            source_revision: 1,
            translation_revision: 1,
            reviewed_revision: 1,
            reviewed_by: "fixture-reviewer",
            reviewed_at: "2026-09-28T00:00:00Z",
            publication_status: "reviewed",
          },
        ],
      },
    ],
  };
} else if (option("--input")) {
  snapshot = JSON.parse(fs.readFileSync(option("--input"), "utf8"));
} else if (args.includes("--live")) {
  // Deliberately read-only, bounded catalogue export. No customer or credential fields.
  const envFile = path.resolve(".env.local");
  if (fs.existsSync(envFile))
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
      if (match && !process.env[match[1]])
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
    }
  if (!process.env.SUPABASE_DB_URL)
    throw new Error(
      "SUPABASE_DB_URL is required for the read-only catalogue audit",
    );
  const { default: pg } = await import("pg");
  const db = new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    connectionTimeoutMillis: 8000,
    query_timeout: 20000,
  });
  try {
    await db.connect();
    await db.query("begin read only");
    await db.query("set local statement_timeout='15s'");
    const result =
      await db.query(`select p.id,p.slug,p.name,p.brand,p.description,p.features,p.specs,p.content_status,p.image_url,
   to_jsonb(p)->'translation_source_revision' as translation_source_revision,
   coalesce((select jsonb_agg(to_jsonb(l) order by l.locale) from product_localizations l where l.product_id=p.id),'[]') as product_localizations,
   coalesce((select jsonb_agg(jsonb_build_object('locale',f.locale,'question',f.question,'answer',f.answer) order by f.locale,f.sort_order) from product_faqs f where f.product_id=p.id),'[]') as product_faqs,
   coalesce((select jsonb_agg(jsonb_build_object('alt_text',i.alt_text,'is_primary',i.is_primary)) from product_images i where i.product_id=p.id),'[]') as product_images
   from products p where p.is_active=true order by p.slug limit 5000`);
    if (result.rows.length === 5000)
      throw new Error(
        "Catalogue reached audit cap; use explicit pagination before release",
      );
    snapshot = {
      source: "live-read-only",
      capturedAt: new Date().toISOString(),
      products: result.rows,
    };
    await db.query("rollback");
  } finally {
    await db.end();
  }
  if (option("--snapshot"))
    fs.writeFileSync(option("--snapshot"), JSON.stringify(snapshot, null, 2));
} else throw new Error("Choose --fixture, --input <snapshot.json>, or --live");

if (!Array.isArray(snapshot.products))
  throw new Error("Snapshot must contain products");
const rows = snapshot.products.map((product) => {
  const entry =
    (product.product_localizations || []).find(
      (value) => value.locale === locale,
    ) || null;
  const readiness = translationReadiness(
    entry,
    Number(product.translation_source_revision || 0),
  );
  return {
    slug: product.slug,
    name: product.name,
    state: entry?.publication_status || "missing",
    sourceRevision: product.translation_source_revision || null,
    missing: readiness.missing,
    current: readiness.current,
    reviewed: readiness.reviewed,
    ready: readiness.publishable || readiness.published,
  };
});
const report = {
  locale,
  source: snapshot.source,
  capturedAt: snapshot.capturedAt || null,
  total: rows.length,
  ready: rows.filter((row) => row.ready).length,
  publicationEnabled: isLocale(locale) && localeRegistry[locale].public,
  products: rows,
};
if (option("--output"))
  fs.writeFileSync(option("--output"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, products: undefined }, null, 2));
if (rows.some((row) => !row.ready)) process.exitCode = 2;
