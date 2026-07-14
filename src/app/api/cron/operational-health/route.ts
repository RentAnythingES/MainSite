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
  const [incidents, stock, settings] = await Promise.all([
    supabase.from("system_incidents").select("id", { count: "exact", head: true }).is("resolved_at", null),
    supabase.from("products").select("id,stock_total,stock_available").eq("is_active", true),
    supabase.from("invoice_settings").select("id", { count: "exact", head: true }),
  ]);
  if (incidents.error) issues.push("System incident monitoring query failed");
  else if (incidents.count) issues.push(`${incidents.count} unresolved operational incident${incidents.count === 1 ? "" : "s"}`);
  const invalidStockRows = (stock.data || []).filter((product) => product.stock_total < 1 || product.stock_available < 0 || product.stock_available > product.stock_total).length;
  if (stock.error) issues.push("Active product stock query failed"); else if (invalidStockRows) issues.push(`${invalidStockRows} active products have invalid stock values`);
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) issues.push("Stripe or webhook configuration is incomplete");
  if (!process.env.RESEND_API_KEY) issues.push("Resend configuration is missing");
  if (settings.error || !settings.count) issues.push("Invoice settings are unavailable");
  const metrics = { unresolvedIncidents: incidents.count || 0, expiredDraftsCleaned: cleanup.expiredDraftCount, expiredHoldsDeleted: cleanup.deletedHoldCount, invalidStockRows };
  const fingerprint = createHash("sha256").update(JSON.stringify([...issues].sort())).digest("hex");
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const previous = issues.length ? await supabase.from("monitoring_runs").select("id").eq("fingerprint", fingerprint).eq("alert_sent", true).gte("created_at", since).limit(1) : { data: [] };
  const shouldAlert = issues.length > 0 && !previous.data?.length;
  const alertSent = shouldAlert ? await sendOperationalAlert(issues, metrics) : false;
  const { error: runError } = await supabase.from("monitoring_runs").insert({ status: issues.length ? "warning" : "healthy", fingerprint, issues, metrics, alert_sent: alertSent });
  if (runError) return NextResponse.json({ error: "Monitoring result could not be persisted" }, { status: 500 });
  return NextResponse.json({ healthy: issues.length === 0, issues, metrics, alertSent, deduplicated: issues.length > 0 && !shouldAlert });
}
