const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing from .env.local");
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  const checks = {};
  try {
    const counts = await client.query(`
      select
        (select count(*)::int from public.products where is_active) as active_products,
        (select count(*)::int from public.bookings) as bookings,
        (select count(*)::int from public.booking_ops_tasks) as ops_tasks,
        (select count(*)::int from public.booking_reviews) as booking_reviews,
        (select count(*)::int from public.pickup_locations where is_active) as active_pickup_locations,
        (select count(*)::int from public.service_zones where is_active) as active_service_zones
    `);
    checks.reads = counts.rows[0];

    const invoiceSettings = await client.query("select count(*)::int as count from public.invoice_settings");
    checks.invoiceSettingsPresent = invoiceSettings.rows[0].count > 0;

    await client.query("begin");
    await client.query("set local statement_timeout = '10s'");
    try {
      const task = await client.query("select id, is_done from public.booking_ops_tasks order by created_at limit 1");
      if (task.rows.length > 0) {
        const nextValue = !task.rows[0].is_done;
        const updated = await client.query(
          "update public.booking_ops_tasks set is_done = $1, completed_at = case when $1 then now() else null end where id = $2 returning is_done",
          [nextValue, task.rows[0].id]
        );
        checks.opsChecklistTransactionalWrite = updated.rows[0].is_done === nextValue;
      } else {
        checks.opsChecklistTransactionalWrite = false;
      }

      const newsletter = await client.query(`
        insert into public.newsletter_subscribers (email, consent_text)
        values ('schema-check-' || gen_random_uuid()::text || '@example.invalid', 'Automated rollback-only schema verification consent record')
        returning id
      `);
      checks.newsletterTransactionalWrite = newsletter.rows.length === 1;

      const monitoring = await client.query(`
        insert into public.monitoring_runs (status, fingerprint, issues, metrics)
        values ('healthy', 'schema-check-' || gen_random_uuid()::text, '[]'::jsonb, '{"rollback_only":true}'::jsonb)
        returning id
      `);
      checks.monitoringTransactionalWrite = monitoring.rows.length === 1;

      const existingReview = await client.query("select id, updated_at from public.booking_reviews order by created_at limit 1");
      if (existingReview.rows.length > 0) {
        const review = await client.query(
          "update public.booking_reviews set updated_at = now() where id = $1 returning id",
          [existingReview.rows[0].id]
        );
        checks.bookingReviewTransactionalWrite = review.rows.length === 1;
      } else {
        const review = await client.query(`
          insert into public.booking_reviews (booking_id, product_id)
          select booking.id, booking.product_id
          from public.bookings booking
          limit 1
          returning id
        `);
        checks.bookingReviewTransactionalWrite = review.rows.length === 1;
      }
    } finally {
      await client.query("rollback");
    }

    const failedChecks = Object.entries(checks)
      .filter(([, value]) => value === false)
      .map(([key]) => key);
    console.log(JSON.stringify({ checks, failedChecks, writesPersisted: false }, null, 2));
    if (failedChecks.length > 0) process.exitCode = 2;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Backend verification failed: ${error.message}`);
  process.exit(1);
});
