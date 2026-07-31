const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const migrationFiles = [
  "20260725_custom_booking_quotes.sql",
  "20260731_multi_market_foundation.sql",
];

function readMigration(filename) {
  const migrationPath = path.join(process.cwd(), "supabase", "migrations", filename);
  if (!fs.existsSync(migrationPath)) throw new Error(`Migration not found: ${filename}`);
  const sql = fs.readFileSync(migrationPath, "utf8");
  if (/\b(?:begin|commit|rollback)\s*;/i.test(sql)) {
    throw new Error(`${filename} contains transaction control and cannot be safely previewed`);
  }
  return { filename, sql };
}

async function expectRejected(client, sql, params, expectedMessage) {
  await client.query("savepoint expected_rejection");
  let rejection = null;

  try {
    await client.query(sql, params);
  } catch (error) {
    rejection = error;
    await client.query("rollback to savepoint expected_rejection");
  }

  await client.query("release savepoint expected_rejection");

  if (!rejection) {
    throw new Error(`Expected database rejection containing: ${expectedMessage}`);
  }
  if (!String(rejection.message || rejection).includes(expectedMessage)) throw rejection;
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing from .env.local");
  const migrations = migrationFiles.map(readMigration);
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  let transactionOpen = false;
  try {
    await client.query("begin");
    transactionOpen = true;
    await client.query("set local statement_timeout = '60s'");

    for (const migration of migrations) {
      await client.query(migration.sql);
    }

    const parity = await client.query(`
      select
        (select count(*)::int from public.products) as products,
        (
          select count(*)::int
          from public.product_offers offer
          join public.markets market on market.id = offer.market_id
          where market.is_default
        ) as default_offers,
        (select count(*)::int from public.pricing_tiers) as pricing_tiers,
        (
          select count(*)::int
          from public.offer_pricing_tiers
          where source_pricing_tier_id is not null
        ) as mirrored_pricing_tiers,
        (select count(*)::int from public.product_quantity_discounts) as quantity_discounts,
        (
          select count(*)::int
          from public.offer_quantity_discounts
          where source_quantity_discount_id is not null
        ) as mirrored_quantity_discounts
    `);
    const parityRow = parity.rows[0];
    if (
      parityRow.products !== parityRow.default_offers
      || parityRow.pricing_tiers !== parityRow.mirrored_pricing_tiers
      || parityRow.quantity_discounts !== parityRow.mirrored_quantity_discounts
    ) {
      throw new Error(`Valencia parity check failed: ${JSON.stringify(parityRow)}`);
    }

    const coverage = await client.query(`
      select
        (select count(*)::int from public.booking_drafts where market_id is null or product_offer_id is null) as drafts_missing_context,
        (select count(*)::int from public.bookings where market_id is null or product_offer_id is null) as bookings_missing_context,
        (select count(*)::int from public.booking_custom_quotes where market_id is null or product_offer_id is null) as quotes_missing_context,
        (select count(*)::int from public.booking_inventory_blocks where market_id is null or product_offer_id is null) as blocks_missing_context,
        (select count(*)::int from public.blocked_dates where market_id is null or product_offer_id is null) as dates_missing_context,
        (select count(*)::int from public.inventory_units where market_id is null or product_offer_id is null or inventory_location_id is null) as units_missing_context,
        (select count(*)::int from public.pickup_locations where market_id is null) as pickups_missing_context,
        (select count(*)::int from public.service_zones where market_id is null) as zones_missing_context
    `);
    if (Object.values(coverage.rows[0]).some((count) => count !== 0)) {
      throw new Error(`Market coverage check failed: ${JSON.stringify(coverage.rows[0])}`);
    }

    const sample = await client.query(`
      select
        product.id as product_id,
        product.stock_total,
        product.stock_available,
        offer.id as offer_id,
        offer.market_id
      from public.products product
      join public.product_offers offer on offer.product_id = product.id
      join public.markets market on market.id = offer.market_id and market.is_default
      order by product.created_at
      limit 1
    `);
    if (sample.rows.length === 0) throw new Error("No product is available for trigger verification");
    const product = sample.rows[0];

    await client.query(
      "update public.products set stock_total = stock_total, stock_available = stock_available where id = $1",
      [product.product_id],
    );
    const syncedOffer = await client.query(
      "select stock_total, online_capacity from public.product_offers where id = $1",
      [product.offer_id],
    );
    if (
      syncedOffer.rows[0]?.stock_total !== product.stock_total
      || syncedOffer.rows[0]?.online_capacity !== product.stock_available
    ) {
      throw new Error("Legacy product inventory did not synchronize to the default offer");
    }

    const reservableDraft = await client.query(`
      select draft.id as draft_id, draft.product_id, draft.product_offer_id
      from public.booking_drafts draft
      join public.product_offers offer on offer.id = draft.product_offer_id
      join public.markets market on market.id = offer.market_id
      where offer.is_active
        and offer.stock_total > 0
        and offer.online_capacity > 0
        and market.is_active
        and market.is_booking_enabled
      order by draft.created_at
      limit 1
    `);
    let offerScopedReservation = "skipped_no_eligible_draft";
    if (reservableDraft.rows.length > 0) {
      const candidate = reservableDraft.rows[0];
      const reserved = await client.query(
        `select public.reserve_product_offer_inventory(
          $1,
          $2,
          '2099-01-01T09:00:00Z'::timestamptz,
          '2099-01-02T09:00:00Z'::timestamptz,
          1
        ) as reserved`,
        [candidate.product_offer_id, candidate.draft_id],
      );
      if (reserved.rows[0]?.reserved !== true) {
        throw new Error("Offer-scoped reservation path did not reserve available capacity");
      }
      offerScopedReservation = true;
    }

    const testMarket = await client.query(`
      insert into public.markets (
        slug,
        name,
        market_type,
        country_code,
        timezone,
        currency,
        default_locale,
        supported_locales
      )
      values (
        'migration-preview',
        'Migration preview',
        'city',
        'DE',
        'Europe/Berlin',
        'eur',
        'en',
        array['en']::text[]
      )
      returning id
    `);
    const testMarketId = testMarket.rows[0].id;
    const testOffer = await client.query(`
      insert into public.product_offers (
        product_id,
        market_id,
        is_active,
        stock_total,
        online_capacity
      )
      values ($1, $2, false, 1, 0)
      returning id
    `, [product.product_id, testMarketId]);
    const testOfferId = testOffer.rows[0].id;
    const testLocation = await client.query(`
      insert into public.inventory_locations (
        market_id,
        slug,
        name,
        country_code
      )
      values ($1, 'preview-storage', 'Preview storage', 'DE')
      returning id
    `, [testMarketId]);

    const testUnit = await client.query(`
      insert into public.inventory_units (
        product_id,
        product_offer_id,
        market_id,
        inventory_location_id,
        asset_code
      )
      values (
        $1,
        $2,
        $3,
        $4,
        'RA-PREVIEW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
      )
      returning id
    `, [product.product_id, testOfferId, testMarketId, testLocation.rows[0].id]);

    const booking = await client.query("select id from public.bookings order by created_at limit 1");
    if (booking.rows.length > 0) {
      await expectRejected(
        client,
        `insert into public.booking_inventory_unit_assignments (booking_id, inventory_unit_id)
         values ($1, $2)`,
        [booking.rows[0].id, testUnit.rows[0].id],
        "Inventory unit does not belong to the booking market offer",
      );
    }

    const result = {
      migrations: migrationFiles,
      parity: parityRow,
      coverage: coverage.rows[0],
      legacyInventorySync: true,
      offerScopedReservation,
      crossMarketAssignmentRejected: booking.rows.length > 0 ? true : "skipped_no_booking",
      writesPersisted: false,
    };

    await client.query("rollback");
    transactionOpen = false;
    console.log(JSON.stringify(result, null, 2));
  } finally {
    if (transactionOpen) await client.query("rollback").catch(() => undefined);
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Multi-market migration preview failed: ${error.message}`);
  process.exit(1);
});
