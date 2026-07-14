/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const requiredEnvironment = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "RESEND_API_KEY", "NEXT_PUBLIC_SITE_URL"];

async function count(supabase, table, configure = (query) => query) {
  const result = await configure(supabase.from(table).select("id", { count: "exact", head: true }));
  return result.error ? { available: false, error: result.error.message } : { available: true, count: result.count || 0 };
}

async function main() {
  const report = { checkedAt: new Date().toISOString(), environment: {}, database: {}, warnings: [], critical: [] };
  for (const key of requiredEnvironment) {
    report.environment[key] = Boolean(process.env[key]);
    if (!process.env[key]) report.warnings.push(`${key} is missing from the audit environment`);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase service configuration is required");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const tables = ["products", "booking_drafts", "booking_inventory_blocks", "bookings", "booking_payment_events", "booking_documents", "invoice_settings", "newsletter_subscribers", "system_incidents", "inventory_units", "inventory_unit_events", "booking_inventory_unit_assignments", "monitoring_runs"];
  for (const table of tables) report.database[table] = await count(supabase, table);
  for (const [table, status] of Object.entries(report.database)) if (!status.available) report.critical.push(`${table} is unavailable: ${status.error}`);

  const { data: activeProducts, error: productError } = await supabase.from("products").select("id,slug,name,stock_total,stock_available,content_status,image_url,pricing_tiers(id)").eq("is_active", true);
  if (productError) report.critical.push(`Could not audit active products: ${productError.message}`);
  else {
    report.activeProducts = activeProducts.length;
    report.activeProductIssues = activeProducts.flatMap((product) => {
      const issues = [];
      if (product.content_status !== "content_ready") issues.push("content is not ready");
      if (!product.image_url) issues.push("image is missing");
      if (!product.stock_total || product.stock_available < 0 || product.stock_available > product.stock_total) issues.push("stock is invalid");
      if (!product.pricing_tiers?.length) issues.push("pricing is missing");
      return issues.length ? [{ slug: product.slug, issues }] : [];
    });
    if (report.activeProductIssues.length) report.warnings.push(`${report.activeProductIssues.length} active products have launch-readiness issues`);
  }

  const now = new Date().toISOString();
  const { count: expiredHolds, error: holdError } = await supabase.from("booking_drafts").select("id", { count: "exact", head: true }).in("status", ["draft", "checkout_created"]).lt("expires_at", now);
  if (holdError) report.warnings.push(`Could not check expired holds: ${holdError.message}`);
  else if (expiredHolds) report.warnings.push(`${expiredHolds} expired unpaid inventory holds require cleanup`);
  report.expiredUnpaidHolds = expiredHolds || 0;

  console.log(JSON.stringify(report, null, 2));
  if (report.critical.length) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exit(1); });
