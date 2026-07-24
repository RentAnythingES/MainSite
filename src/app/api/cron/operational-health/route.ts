import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { cleanupExpiredBookingDrafts } from "@/lib/booking-v2";
import { isStripeConfigured } from "@/lib/stripe";
import { sendOperationalAlert } from "@/lib/email";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const issues: string[] = [];
  const cleanup = await cleanupExpiredBookingDrafts(supabase);
  const [incidents, stock, settings, lifecycleBookings, checklistCoverage, statusEvents, inventoryUnits] = await Promise.all([
    supabase.from("system_incidents").select("id", { count: "exact", head: true }).is("resolved_at", null),
    supabase.from("products").select("id,stock_total,stock_available").eq("is_active", true),
    supabase.from("invoice_settings").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("id,status,rental_start_at,rental_end_at")
      .in("status", ["paid", "delivering", "active", "returning"]),
    supabase
      .from("bookings")
      .select("id,booking_ops_tasks(id)")
      .in("status", ["paid", "delivering", "active", "returning"]),
    supabase.from("booking_status_events").select("id", { count: "exact", head: true }),
    supabase.from("inventory_units").select("product_id,status"),
  ]);
  if (incidents.error) issues.push("System incident monitoring query failed");
  else if (incidents.count) issues.push(`${incidents.count} unresolved operational incident${incidents.count === 1 ? "" : "s"}`);
  const invalidStockRows = (stock.data || []).filter((product) => product.stock_total < 1 || product.stock_available < 0 || product.stock_available > product.stock_total).length;
  if (stock.error) issues.push("Active product stock query failed"); else if (invalidStockRows) issues.push(`${invalidStockRows} active products have invalid stock values`);
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) issues.push("Stripe or webhook configuration is incomplete");
  if (!process.env.RESEND_API_KEY) issues.push("Resend configuration is missing");
  if (settings.error || !settings.count) issues.push("Invoice settings are unavailable");
  const now = Date.now();
  const overdueGraceMs = 12 * 60 * 60 * 1000;
  const awaitingHandoff = (lifecycleBookings.data || []).filter(
    (booking) =>
      ["paid", "delivering"].includes(booking.status) &&
      booking.rental_start_at &&
      new Date(booking.rental_start_at).getTime() + overdueGraceMs < now,
  ).length;
  const awaitingReturn = (lifecycleBookings.data || []).filter(
    (booking) =>
      ["active", "returning"].includes(booking.status) &&
      booking.rental_end_at &&
      new Date(booking.rental_end_at).getTime() + overdueGraceMs < now,
  ).length;
  const missingChecklists = (checklistCoverage.data || []).filter(
    (booking) => !Array.isArray(booking.booking_ops_tasks) || booking.booking_ops_tasks.length < 5,
  ).length;
  if (lifecycleBookings.error) issues.push("Booking lifecycle monitoring query failed");
  else {
    if (awaitingHandoff) issues.push(`${awaitingHandoff} booking${awaitingHandoff === 1 ? "" : "s"} passed the start time without a confirmed handoff`);
    if (awaitingReturn) issues.push(`${awaitingReturn} booking${awaitingReturn === 1 ? "" : "s"} passed the return time without a completed inspection`);
  }
  if (checklistCoverage.error) issues.push("Booking checklist coverage query failed");
  else if (missingChecklists) issues.push(`${missingChecklists} active booking${missingChecklists === 1 ? "" : "s"} lack a complete operations checklist`);
  if (statusEvents.error || !statusEvents.count) issues.push("Booking status audit events are unavailable");
  const physicalByProduct = new Map<string, { physical: number; operational: number }>();
  for (const unit of inventoryUnits.data || []) {
    if (unit.status === "retired") continue;
    const current = physicalByProduct.get(unit.product_id) || { physical: 0, operational: 0 };
    current.physical += 1;
    if (["available", "reserved", "rented"].includes(unit.status)) current.operational += 1;
    physicalByProduct.set(unit.product_id, current);
  }
  const inventoryCountMismatches = (stock.data || []).filter(
    (product) => (physicalByProduct.get(product.id)?.physical || 0) !== product.stock_total,
  ).length;
  const onlineCapacityRisks = (stock.data || []).filter((product) => {
    const physical = physicalByProduct.get(product.id);
    return Boolean(physical && product.stock_available > physical.operational);
  }).length;
  if (inventoryUnits.error) issues.push("Physical inventory monitoring query failed");
  else if (!inventoryUnits.data?.length) issues.push("No physical inventory units are registered");
  else {
    if (inventoryCountMismatches) issues.push(`${inventoryCountMismatches} active products have declared/physical stock mismatches`);
    if (onlineCapacityRisks) issues.push(`${onlineCapacityRisks} active products expose more online capacity than operational physical units`);
  }
  const metrics = {
    unresolvedIncidents: incidents.count || 0,
    expiredDraftsCleaned: cleanup.expiredDraftCount,
    expiredHoldsDeleted: cleanup.deletedHoldCount,
    invalidStockRows,
    awaitingHandoff,
    awaitingReturn,
    missingChecklists,
    bookingStatusEvents: statusEvents.count || 0,
    physicalInventoryUnits: (inventoryUnits.data || []).filter((unit) => unit.status !== "retired").length,
    inventoryCountMismatches,
    onlineCapacityRisks,
  };
  const fingerprint = createHash("sha256").update(JSON.stringify([...issues].sort())).digest("hex");
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const previous = issues.length ? await supabase.from("monitoring_runs").select("id").eq("fingerprint", fingerprint).eq("alert_sent", true).gte("created_at", since).limit(1) : { data: [] };
  const shouldAlert = issues.length > 0 && !previous.data?.length;
  const alertSent = shouldAlert ? await sendOperationalAlert(issues, metrics) : false;
  const { error: runError } = await supabase.from("monitoring_runs").insert({ status: issues.length ? "warning" : "healthy", fingerprint, issues, metrics, alert_sent: alertSent });
  if (runError) return NextResponse.json({ error: "Monitoring result could not be persisted" }, { status: 500 });
  return NextResponse.json({ healthy: issues.length === 0, issues, metrics, alertSent, deduplicated: issues.length > 0 && !shouldAlert });
}
