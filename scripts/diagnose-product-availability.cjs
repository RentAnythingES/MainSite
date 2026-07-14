/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error("Product slug is required");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const productResult = await supabase.from("products").select("id,slug,name,is_active,stock_total,stock_available").eq("slug", slug).single();
  if (productResult.error) throw productResult.error;
  const product = productResult.data;
  const [dates, blocks, drafts] = await Promise.all([
    supabase.from("blocked_dates").select("id,blocked_date,reason").eq("product_id", product.id).order("blocked_date"),
    supabase.from("booking_inventory_blocks").select("id,starts_at,ends_at,quantity,reason,booking_id,booking_draft_id").eq("product_id", product.id).order("starts_at"),
    supabase.from("booking_drafts").select("id,status,rental_start_at,rental_end_at,expires_at").eq("product_id", product.id).order("created_at", { ascending: false }).limit(20),
  ]);
  console.log(JSON.stringify({ product, blockedDates: dates.data || [], inventoryBlocks: blocks.data || [], drafts: drafts.data || [], errors: [dates.error?.message, blocks.error?.message, drafts.error?.message].filter(Boolean) }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
