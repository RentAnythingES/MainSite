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
        (select count(*)::int from public.booking_status_events) as booking_status_events,
        (select count(*)::int from public.inventory_stock_events) as inventory_stock_events,
        (select count(*)::int from public.booking_reviews) as booking_reviews,
        (select count(*)::int from public.booking_fulfillment_amendments) as fulfillment_amendments,
        (select count(*)::int from public.bundle_requests) as bundle_requests,
        (select count(*)::int from public.pickup_locations where is_active) as active_pickup_locations,
        (select count(*)::int from public.service_zones where is_active) as active_service_zones
    `);
    checks.reads = counts.rows[0];

    const invoiceSettings = await client.query("select count(*)::int as count from public.invoice_settings");
    checks.invoiceSettingsPresent = invoiceSettings.rows[0].count > 0;

    const customZone = await client.query(`
      select automatic_checkout_enabled
      from public.service_zones
      where slug = 'valencia-region-custom'
      limit 1
    `);
    checks.customZoneExcludedFromAutomaticCheckout =
      customZone.rows[0]?.automatic_checkout_enabled === false;

    const deliveryTypeColumn = await client.query(`
      select count(*)::int as count
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'booking_drafts'
        and column_name = 'delivery_type'
    `);
    checks.bookingDraftDeliveryTypePresent = deliveryTypeColumn.rows[0].count === 1;

    const lifecycleCoverage = await client.query(`
      select
        count(*) filter (where task_count <> 5)::int as bookings_without_five_tasks,
        count(*) filter (where event_count < 1)::int as bookings_without_status_event
      from (
        select
          booking.id,
          (select count(*) from public.booking_ops_tasks task where task.booking_id = booking.id) as task_count,
          (select count(*) from public.booking_status_events event where event.booking_id = booking.id) as event_count
        from public.bookings booking
      ) coverage
    `);
    checks.bookingLifecycleCoverage =
      lifecycleCoverage.rows[0].bookings_without_five_tasks === 0 &&
      lifecycleCoverage.rows[0].bookings_without_status_event === 0;

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

      const eligibleBooking = await client.query(`
        select id, fulfillment_mode
        from public.bookings
        where status in ('confirmed', 'paid')
          and fulfillment_mode = 'customer_pickup'
        order by created_at desc
        limit 1
      `);
      if (eligibleBooking.rows.length > 0) {
        const amendment = await client.query(`
          insert into public.booking_fulfillment_amendments (
            booking_id,
            fulfillment_mode,
            delivery_address,
            delivery_fee_cents,
            is_custom_quote,
            quote_notes
          ) values ($1, 'delivery_only', 'Rollback-only verification address', 1, true, 'Automated rollback-only verification')
          returning id
        `, [eligibleBooking.rows[0].id]);
        checks.fulfillmentAmendmentTransactionalWrite = amendment.rows.length === 1;
      } else {
        checks.fulfillmentAmendmentTransactionalWrite = "skipped_no_eligible_booking";
      }

      const bundleRequest = await client.query(`
        insert into public.bundle_requests (
          request_ref,
          bundle_slug,
          bundle_name,
          customer_name,
          customer_email,
          start_date,
          end_date,
          accommodation_area,
          selected_items,
          selected_addons,
          consent_version,
          consent_text
        ) values (
          'KIT-VERIFY-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
          'family-beach-kit',
          'Family Beach Kit Valencia',
          'Rollback Verification',
          'schema-check@example.invalid',
          current_date,
          current_date + 1,
          'Rollback-only verification area',
          '["Beach umbrella or shade tent"]'::jsonb,
          '[]'::jsonb,
          'schema-verification',
          'Automated rollback-only schema verification consent record'
        ) returning id
      `);
      checks.bundleRequestTransactionalWrite = bundleRequest.rows.length === 1;

      const rateLimitAttempts = [];
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const rateLimit = await client.query(
          "select * from public.consume_api_rate_limit($1, $2, $3, $4)",
          ["schema-verification", "a".repeat(64), 2, 60],
        );
        rateLimitAttempts.push(rateLimit.rows[0]);
      }
      checks.rateLimitTransactionalWrite =
        rateLimitAttempts[0]?.allowed === true &&
        rateLimitAttempts[1]?.allowed === true &&
        rateLimitAttempts[2]?.allowed === false;

      const inventoryBooking = await client.query(`
        select booking.id, booking.product_id, booking.status
        from public.bookings booking
        where booking.status in ('paid', 'delivering')
          and booking.quantity = 1
        order by case when booking.status = 'delivering' then 0 else 1 end, booking.created_at desc
        limit 1
      `);
      if (inventoryBooking.rows.length > 0) {
        const booking = inventoryBooking.rows[0];
        const productState = await client.query(`
          select
            product.stock_total,
            product.stock_available,
            (
              select count(*)::int
              from public.inventory_units unit
              where unit.product_id = product.id and unit.status <> 'retired'
            ) as physical_count
          from public.products product
          where product.id = $1
        `, [booking.product_id]);
        const targetTotal = Math.max(
          productState.rows[0].stock_total,
          productState.rows[0].physical_count,
        ) + 1;
        const expectedCreated = targetTotal - productState.rows[0].physical_count;
        const capacity = await client.query(
          "select id, stock_total, stock_available from public.update_product_inventory_capacity($1, $2, $3, null)",
          [booking.product_id, targetTotal, 0],
        );
        const capacityReservation = await client.query(
          "select public.reserve_booking_inventory($1, gen_random_uuid(), now() + interval '30 days', now() + interval '31 days', 1) as reserved",
          [booking.product_id],
        );
        const registered = await client.query(
          "select public.register_missing_inventory_units($1, null, 'Rollback verification') as result",
          [booking.product_id],
        );
        const unit = await client.query(
          "select id from public.inventory_units where product_id = $1 and status = 'available' order by created_at desc limit 1",
          [booking.product_id],
        );
        const assignment = await client.query(
          "select public.assign_booking_inventory_unit($1, $2, null, 'Rollback verification') as id",
          [booking.id, unit.rows[0].id],
        );
        const extraUnit = await client.query(`
          insert into public.inventory_units (product_id, asset_code)
          values ($1, 'RA-VERIFY-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)))
          returning id
        `, [booking.product_id]);
        await client.query("savepoint inventory_assignment_limit");
        let assignmentLimitRejected = false;
        try {
          await client.query(
            "select public.assign_booking_inventory_unit($1, $2, null, null)",
            [booking.id, extraUnit.rows[0].id],
          );
        } catch {
          assignmentLimitRejected = true;
          await client.query("rollback to savepoint inventory_assignment_limit");
        }
        await client.query(
          "select public.transition_booking_inventory_unit($1, $2, 'hand_over', null)",
          [booking.id, assignment.rows[0].id],
        );
        await client.query(
          "select public.transition_booking_inventory_unit($1, $2, 'return', null)",
          [booking.id, assignment.rows[0].id],
        );
        const reconciled = await client.query(`
          select
            booking.status as booking_status,
            assignment.status as assignment_status,
            unit.status as unit_status,
            (select count(*)::int from public.inventory_stock_events where product_id = booking.product_id) as stock_events
          from public.bookings booking
          join public.booking_inventory_unit_assignments assignment on assignment.booking_id = booking.id
          join public.inventory_units unit on unit.id = assignment.inventory_unit_id
          where assignment.id = $1
        `, [assignment.rows[0].id]);
        checks.inventoryReconciliationTransactionalWrite =
          capacity.rows[0]?.stock_total === targetTotal &&
          capacity.rows[0]?.stock_available === 0 &&
          capacityReservation.rows[0]?.reserved === false &&
          registered.rows[0].result?.created_count === expectedCreated &&
          assignmentLimitRejected &&
          reconciled.rows[0]?.booking_status === "completed" &&
          reconciled.rows[0]?.assignment_status === "returned" &&
          reconciled.rows[0]?.unit_status === "available" &&
          reconciled.rows[0]?.stock_events > 0;
      } else {
        checks.inventoryReconciliationTransactionalWrite = "skipped_no_open_single_unit_booking";
      }

      const lifecycleBooking = await client.query(`
        select id
        from public.bookings
        where status = 'paid'
        order by created_at desc
        limit 1
      `);
      if (lifecycleBooking.rows.length > 0) {
        const bookingId = lifecycleBooking.rows[0].id;
        const futureGuard = await client.query(
          "select public.update_booking_ops_task($1, 'return_inspected', true, null, null) as result",
          [bookingId],
        );
        checks.futureLifecycleGuard =
          futureGuard.rows[0].result?.booking_status === "paid";
        await client.query(
          "select public.update_booking_ops_task($1, 'return_inspected', false, null, null)",
          [bookingId],
        );
        await client.query(
          "update public.bookings set rental_start_at = now() - interval '2 days', rental_end_at = now() - interval '1 day' where id = $1",
          [bookingId],
        );
        const lifecycleResults = [];
        for (const taskKey of [
          "equipment_prepared",
          "handoff_confirmed",
          "return_scheduled",
          "return_inspected",
        ]) {
          const lifecycle = await client.query(
            "select public.update_booking_ops_task($1, $2, true, null, null) as result",
            [bookingId, taskKey],
          );
          lifecycleResults.push(lifecycle.rows[0].result);
        }
        const audit = await client.query(
          "select source, to_status from public.booking_status_events where booking_id = $1 order by created_at desc limit 4",
          [bookingId],
        );
        const remainingBlocks = await client.query(
          "select count(*)::int as count from public.booking_inventory_blocks where booking_id = $1",
          [bookingId],
        );
        checks.bookingLifecycleTransactionalWrite =
          lifecycleResults[0]?.booking_status === "delivering" &&
          lifecycleResults[1]?.booking_status === "active" &&
          lifecycleResults[2]?.booking_status === "returning" &&
          lifecycleResults[3]?.booking_status === "completed" &&
          audit.rows.length === 4 &&
          audit.rows.every((event) => event.source.startsWith("ops_checklist:")) &&
          remainingBlocks.rows[0].count === 0;
      } else {
        checks.bookingLifecycleTransactionalWrite = "skipped_no_paid_booking";
      }

      const ledgerBooking = await client.query(
        "select id from public.bookings order by created_at limit 1",
      );
      if (ledgerBooking.rows.length > 0) {
        const providerEventId = `schema-check-${Date.now()}`;
        const ledgerRows = [];
        for (const amountCents of [1, 2]) {
          const ledgerEvent = await client.query(
            `
              insert into public.booking_payment_events (
                booking_id,
                event_type,
                status,
                provider,
                currency,
                amount_cents,
                provider_event_id,
                description
              )
              values ($1, 'manual_adjustment', 'succeeded', 'schema_verification', 'eur', $2, $3, 'Rollback-only verification')
              on conflict (provider, provider_event_id)
              do update set amount_cents = excluded.amount_cents
              returning id, amount_cents
            `,
            [ledgerBooking.rows[0].id, amountCents, providerEventId],
          );
          ledgerRows.push(ledgerEvent.rows[0]);
        }
        checks.paymentLedgerIdempotentWrite =
          ledgerRows[0]?.id === ledgerRows[1]?.id &&
          ledgerRows[1]?.amount_cents === 2;
      } else {
        checks.paymentLedgerIdempotentWrite = "skipped_no_booking";
      }

      const terminalBooking = await client.query(`
        select
          booking.id,
          booking.status,
          (
            select count(*)::int
            from public.booking_inventory_blocks block
            where block.booking_id = booking.id
          ) as inventory_blocks_before
        from public.bookings booking
        where booking.status = 'paid'
        order by inventory_blocks_before desc, booking.created_at desc
        limit 1
      `);
      if (terminalBooking.rows.length > 0) {
        const booking = terminalBooking.rows[0];
        const transitioned = await client.query(
          "select id, status from public.transition_booking_terminal_status($1, $2, $3)",
          [booking.id, booking.status, "refunded"],
        );
        const remainingBlocks = await client.query(
          `
            select
              (select count(*)::int from public.booking_inventory_blocks where booking_id = $1) as inventory_blocks,
              (select count(*)::int from public.blocked_dates where booking_id = $1) as blocked_dates
          `,
          [booking.id],
        );
        checks.terminalBookingTransitionTransactionalWrite =
          transitioned.rows[0]?.status === "refunded" &&
          remainingBlocks.rows[0]?.inventory_blocks === 0 &&
          remainingBlocks.rows[0]?.blocked_dates === 0;
      } else {
        checks.terminalBookingTransitionTransactionalWrite = "skipped_no_paid_booking";
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
