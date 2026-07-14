/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  const slug = process.argv[2];
  if (!slug || process.argv[3] !== "--confirm") throw new Error("Usage: node scripts/restore-product-availability.cjs <slug> --confirm");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: product, error } = await supabase.from("products").select("id,slug,stock_total").eq("slug", slug).single();
  if (error) throw error;
  const [drafts, blocks, bookings] = await Promise.all([
    supabase.from("booking_drafts").select("id", { count: "exact", head: true }).eq("product_id", product.id).in("status", ["draft", "checkout_created"]),
    supabase.from("booking_inventory_blocks").select("id", { count: "exact", head: true }).eq("product_id", product.id),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("product_id", product.id).not("status", "in", "(cancelled,refunded,completed)"),
  ]);
  if (drafts.error || blocks.error || bookings.error) throw drafts.error || blocks.error || bookings.error;
  if (drafts.count || blocks.count || bookings.count) throw new Error("Refusing to restore availability while active booking records exist");
  const { error: dateError, count } = await supabase.from("blocked_dates").delete({ count: "exact" }).eq("product_id", product.id).eq("reason", "booking");
  if (dateError) throw dateError;
  const { error: stockError } = await supabase.from("products").update({ stock_available: product.stock_total }).eq("id", product.id);
  if (stockError) throw stockError;
  console.log(JSON.stringify({ slug, deletedOrphanedBookingDates: count || 0, stockAvailable: product.stock_total }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
