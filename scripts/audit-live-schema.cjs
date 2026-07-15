const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const expectedTables = [
  "blocked_dates",
  "booking_document_counters",
  "booking_documents",
  "booking_drafts",
  "booking_inventory_blocks",
  "booking_inventory_unit_assignments",
  "booking_ops_tasks",
  "booking_payment_events",
  "bookings",
  "categories",
  "inventory_unit_events",
  "inventory_units",
  "invoice_settings",
  "monitoring_runs",
  "newsletter_subscribers",
  "pickup_locations",
  "pricing_tiers",
  "product_faqs",
  "product_images",
  "product_localizations",
  "products",
  "service_zones",
  "system_incidents",
];

const expectedFunctions = [
  "assign_booking_inventory_unit",
  "next_booking_document_number",
  "reserve_booking_inventory",
  "set_booking_document_number",
  "sync_booking_inventory_units_on_status",
  "transition_booking_inventory_unit",
];

const expectedColumns = {
  bookings: ["booking_draft_id", "rental_start_at", "rental_end_at", "timezone", "fulfillment_mode", "pickup_location_id", "delivery_zone_id", "collection_zone_id", "collection_address", "collection_notes", "collection_fee_cents", "pricing_snapshot", "stripe_checkout_session_id", "billing_name", "billing_company_name", "billing_tax_id", "billing_address", "invoice_requested"],
  pickup_locations: ["customer_instructions", "internal_notes", "lead_time_hours", "handoff_contact", "confirmation_template"],
  service_zones: ["customer_instructions", "internal_notes", "lead_time_hours", "same_day_cutoff", "delivery_window", "collection_window", "confirmation_template"],
  booking_documents: ["customer_access_token", "customer_access_expires_at", "customer_access_last_sent_at", "invoice_format", "tax_rate_bps", "tax_inclusive", "tax_base_cents", "customer_tax_id", "customer_billing_address", "rectifies_document_id", "immutable_at"],
  booking_document_counters: ["series_prefix"],
  products: ["content_status"],
};

const expectedRlsTables = [
  "app_schema_migrations",
  "booking_document_counters",
  "booking_documents",
  "booking_drafts",
  "booking_inventory_blocks",
  "booking_inventory_unit_assignments",
  "booking_ops_tasks",
  "booking_payment_events",
  "inventory_unit_events",
  "inventory_units",
  "invoice_settings",
  "monitoring_runs",
  "newsletter_subscribers",
  "pickup_locations",
  "product_faqs",
  "product_images",
  "product_localizations",
  "service_zones",
  "system_incidents",
];

const expectedTriggers = [
  "booking_documents_set_number",
  "booking_documents_updated_at",
  "booking_drafts_updated_at",
  "booking_ops_tasks_updated_at",
  "invoice_settings_updated_at",
  "newsletter_subscribers_updated_at",
  "pickup_locations_updated_at",
  "service_zones_updated_at",
  "sync_booking_inventory_units_on_status",
];

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing from .env.local");

  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  try {
    const identity = await client.query("select current_database() as database, current_user as role, now() as checked_at");
    const tables = await client.query("select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name");
    const functions = await client.query("select distinct routine_name from information_schema.routines where routine_schema = 'public' order by routine_name");
    const historyTable = await client.query("select to_regclass('supabase_migrations.schema_migrations') is not null as exists");
    const columns = await client.query("select table_name, column_name from information_schema.columns where table_schema = 'public'");
    const rls = await client.query("select relname as table_name, relrowsecurity as enabled from pg_class join pg_namespace on pg_namespace.oid = pg_class.relnamespace where pg_namespace.nspname = 'public' and pg_class.relkind = 'r'");
    const triggers = await client.query("select trigger_name from information_schema.triggers where trigger_schema = 'public'");
    const storageBucket = await client.query("select exists(select 1 from storage.buckets where id = 'product-images') as exists");

    let migrationHistory = [];
    if (historyTable.rows[0].exists) {
      const history = await client.query("select version, name from supabase_migrations.schema_migrations order by version");
      migrationHistory = history.rows;
    }

    let appMigrationHistory = [];
    if (tables.rows.some((row) => row.table_name === "app_schema_migrations")) {
      const history = await client.query("select filename, checksum_sha256, applied_at from public.app_schema_migrations order by applied_at, filename");
      appMigrationHistory = history.rows;
    }

    const bookingOpsCoverage = await client.query(`
      select
        (select count(*)::int from public.bookings) as booking_count,
        (select count(*)::int from public.booking_ops_tasks) as task_count,
        (
          select count(*)::int
          from public.bookings booking
          where (
            select count(*)
            from public.booking_ops_tasks task
            where task.booking_id = booking.id
          ) <> 5
        ) as bookings_without_complete_checklist
    `);

    const liveTables = tables.rows.map((row) => row.table_name);
    const liveFunctions = functions.rows.map((row) => row.routine_name);
    const liveColumns = new Map();
    for (const row of columns.rows) {
      const tableColumns = liveColumns.get(row.table_name) || [];
      tableColumns.push(row.column_name);
      liveColumns.set(row.table_name, tableColumns);
    }
    const missingColumns = Object.entries(expectedColumns).flatMap(([table, tableColumns]) =>
      tableColumns.filter((column) => !liveColumns.get(table)?.includes(column)).map((column) => `${table}.${column}`)
    );
    const rlsStatus = new Map(rls.rows.map((row) => [row.table_name, row.enabled]));
    const liveTriggers = triggers.rows.map((row) => row.trigger_name);
    const result = {
      connection: identity.rows[0],
      tableCount: liveTables.length,
      missingTables: expectedTables.filter((table) => !liveTables.includes(table)),
      expectedTablesPresent: expectedTables.filter((table) => liveTables.includes(table)),
      missingFunctions: expectedFunctions.filter((fn) => !liveFunctions.includes(fn)),
      missingColumns,
      rlsDisabled: expectedRlsTables.filter((table) => rlsStatus.get(table) !== true),
      missingTriggers: expectedTriggers.filter((trigger) => !liveTriggers.includes(trigger)),
      productImagesBucketPresent: storageBucket.rows[0].exists,
      migrationHistory,
      appMigrationHistory,
      bookingOpsCoverage: bookingOpsCoverage.rows[0],
    };

    console.log(JSON.stringify(result, null, 2));
    if (
      result.missingTables.length ||
      result.missingFunctions.length ||
      result.missingColumns.length ||
      result.rlsDisabled.length ||
      result.missingTriggers.length ||
      !result.productImagesBucketPresent ||
      result.bookingOpsCoverage.bookings_without_complete_checklist > 0
    ) process.exitCode = 2;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Schema audit failed: ${error.message}`);
  process.exit(1);
});
