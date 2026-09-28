import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import {
  blankTranslation,
  validateTranslationContent,
  translationMissingFields,
  translationReadiness,
  isPublishedTranslation,
} from "../src/lib/translation-workflow.ts";

const read = (name) =>
  readFileSync(
    new URL(`../supabase/migrations/${name}`, import.meta.url),
    "utf8",
  );
const actor = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const complete = {
  ...blankTranslation(),
  name: "Reisebuggy",
  short_description: "Kompakter Reisebuggy",
  detail_description: "Beschreibung des Reisebuggys.",
  includes_text: "Buggy",
  constraints_text: "Hinweise des Herstellers beachten.",
  delivery_setup_note: "Lieferung nach Vereinbarung.",
  care_note: "Nach Anleitung verwenden.",
  seo_title: "Reisebuggy mieten in Valencia",
  seo_description:
    "Miete einen kompakten Reisebuggy für deinen Aufenthalt in Valencia. Prüfe die Maße, Hinweise zur Nutzung und Verfügbarkeit für deine Daten.",
  image_alt_text: "Kompakter Reisebuggy",
  features: ["Einfach zusammenklappbar"],
  specs: { Gewicht: "6.6 kg" },
  faqs: [
    { question: "Frage 1?", answer: "Antwort 1." },
    { question: "Frage 2?", answer: "Antwort 2." },
    { question: "Frage 3?", answer: "Antwort 3." },
  ],
};

test("typed translation validation rejects operational fields and malformed lists", () => {
  assert.deepEqual(translationMissingFields(complete), []);
  assert.throws(
    () => validateTranslationContent({ ...complete, stock_total: 2 }),
    /Unknown/,
  );
  assert.throws(
    () => validateTranslationContent({ ...complete, features: [{}] }),
    /features/,
  );
  assert.throws(
    () => validateTranslationContent({ ...complete, specs: { Weight: 3 } }),
    /Specifications/,
  );
  assert.throws(
    () =>
      validateTranslationContent({
        ...complete,
        faqs: [{ question: "Q", answer: 2 }],
      }),
    /FAQ/,
  );
  assert.ok(translationMissingFields(blankTranslation()).length > 0);
  assert.equal(isPublishedTranslation({ publication_status: "draft" }), false);
  assert.equal(
    isPublishedTranslation(
      {
        publication_status: "published",
        source_revision: 2,
        translation_revision: 3,
        reviewed_revision: 3,
        reviewed_by: actor,
      },
      1,
    ),
    false,
  );
  assert.equal(translationReadiness(null, 1).publishable, false);
});

test("database authoring lifecycle is atomic, attributed, isolated, conflict-safe and private", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
   create function uuid_generate_v4() returns uuid language sql as 'select gen_random_uuid()';
   create table products(id uuid primary key default gen_random_uuid(),name text,description text,features jsonb default '[]',specs jsonb default '{}',stock_total int default 2,is_active boolean default true);
   create table markets(id uuid primary key default gen_random_uuid(),supported_locales text[],is_public boolean,is_active boolean,is_booking_enabled boolean,is_indexable boolean);
   insert into markets(supported_locales,is_public,is_active,is_booking_enabled,is_indexable) values(array['en','es'],true,true,true,true);
   insert into products(name,description) values('Stroller','English source');`);
    await db.exec(read("20260711_product_content_readiness.sql"));
    await db.exec(read("20260928_private_translation_storage.sql"));
    await db.exec(`insert into product_localizations(product_id,locale,short_description) select id,'en','Original English' from products;
   insert into product_localizations(product_id,locale,short_description) select id,'es','Original Spanish' from products;
   insert into product_faqs(product_id,locale,question,answer) select id,'es','Pregunta','Respuesta' from products;`);
    const before = (
      await db.query("select * from product_localizations order by locale")
    ).rows;
    await db.exec("begin");
    await db.exec(read("20260929_translation_workflow.sql"));
    await db.exec("rollback");
    assert.deepEqual(
      (await db.query("select * from product_localizations order by locale"))
        .rows,
      before,
    );
    await db.exec(read("20260929_translation_workflow.sql"));
    const product = (await db.query("select * from products")).rows[0];
    const id = product.id;
    const call = async (
      action,
      revision,
      source = 1,
      content = complete,
      locale = "de",
    ) =>
      (
        await db.query(
          "select * from manage_product_translation($1,$2,$3,$4,$5,$6::jsonb,$7)",
          [
            id,
            locale,
            action,
            revision,
            source,
            JSON.stringify(content),
            actor,
          ],
        )
      ).rows[0];
    let entry = await call("save", 0);
    assert.equal(entry.publication_status, "draft");
    assert.equal(entry.translation_revision, 1);
    await assert.rejects(call("save", 0), { code: "40001" });
    await assert.rejects(call("publish", 1), { code: "22023" });
    entry = await call("review", 1);
    assert.equal(entry.reviewed_by, actor);
    assert.equal(entry.reviewed_revision, 1);
    await assert.rejects(call("publish", 1), /private/);
    assert.equal(
      (
        await db.query(
          "select short_description from product_localizations where locale='es'",
        )
      ).rows[0].short_description,
      "Original Spanish",
    );
    assert.equal(
      (await db.query("select * from product_faqs where locale='es'")).rows
        .length,
      1,
    );
    await db.exec(
      "grant usage on schema public to anon,authenticated,service_role;grant select on products,product_localizations to anon,authenticated;",
    );
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select * from product_localizations where locale='de'"))
        .rows.length,
      0,
    );
    await assert.rejects(call("save", 1), { code: "42501" });
    await db.exec("reset role");
    await db.exec("update locales set is_public=true where code='de'");
    entry = await call("publish", 1);
    assert.equal(entry.publication_status, "published");
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select * from product_localizations where locale='de'"))
        .rows.length,
      1,
    );
    await db.exec("reset role");
    await db.exec("update products set stock_total=9");
    assert.equal(
      (await db.query("select translation_source_revision from products"))
        .rows[0].translation_source_revision,
      1,
    );
    await db.exec("update products set description='Changed source'");
    entry = (
      await db.query("select * from product_localizations where locale='de'")
    ).rows[0];
    assert.equal(entry.publication_status, "stale");
    assert.equal(entry.reviewed_by, null);
    await assert.rejects(call("review", 1, 2), { code: "40001" });
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select * from product_localizations where locale='de'"))
        .rows.length,
      0,
    );
    await db.exec("reset role");
    await call("save", 1, 2);
    await call("review", 2, 2);
    await call("publish", 2, 2);
    await db.exec(
      "update product_localizations set translation_content=jsonb_set(translation_content,'{name}','\"Changed draft\"') where locale='de'",
    );
    entry = (
      await db.query("select * from product_localizations where locale='de'")
    ).rows[0];
    assert.equal(entry.publication_status, "draft");
    assert.equal(entry.reviewed_revision, null);
    assert.equal(entry.translation_revision, 3);
    await db.exec(
      "update product_localizations set short_description='Changed English' where locale='en'",
    );
    assert.equal(
      (await db.query("select translation_source_revision from products"))
        .rows[0].translation_source_revision,
      3,
    );
    await db.exec(
      "insert into product_faqs(product_id,locale,question,answer) select id,'en','Question','Answer' from products",
    );
    assert.equal(
      (await db.query("select translation_source_revision from products"))
        .rows[0].translation_source_revision,
      4,
    );
    const events = (await db.query("select * from translation_events")).rows;
    assert.ok(events.some((event) => event.action === "source_changed"));
    assert.ok(
      events
        .filter((event) => event.action === "review")
        .every((event) => event.actor_id === actor),
    );
    await db.exec("insert into locales(code,name) values('fr','Français')");
    const fourth = await call("save", 0, 4, blankTranslation(), "fr");
    assert.equal(fourth.publication_status, "draft");
    await assert.rejects(
      call("review", 1, 4, complete, "fr"),
      /Missing translation/,
    );
  } finally {
    await db.close();
  }
});
