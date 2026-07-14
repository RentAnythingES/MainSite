/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) { const match=line.match(/^([^#=]+)=(.*)$/); if(match) process.env[match[1].trim()]=match[2].trim().replace(/^['"]|['"]$/g,""); }

async function main(){
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
 const {data:products,error}=await supabase.from("products").select("id,slug,name,stock_total,stock_available,is_active").eq("is_active",true).order("slug");if(error)throw error;
 const report=[];
 for(const product of products){
  const [legacy,holds,drafts,bookings]=await Promise.all([
   supabase.from("blocked_dates").select("id",{count:"exact",head:true}).eq("product_id",product.id).eq("reason","booking").gte("blocked_date",new Date().toISOString().slice(0,10)),
   supabase.from("booking_inventory_blocks").select("id",{count:"exact",head:true}).eq("product_id",product.id).gt("ends_at",new Date().toISOString()),
   supabase.from("booking_drafts").select("id",{count:"exact",head:true}).eq("product_id",product.id).in("status",["draft","checkout_created"]).gt("expires_at",new Date().toISOString()),
   supabase.from("bookings").select("id",{count:"exact",head:true}).eq("product_id",product.id).in("status",["pending","confirmed","paid","delivering","active","returning"]),
  ]);
  const issues=[];if(product.stock_available<0||product.stock_available>product.stock_total)issues.push("invalid_stock");if(product.stock_available===0&&!holds.count&&!drafts.count&&!bookings.count)issues.push("zero_stock_without_active_commitment");if(legacy.count&&!holds.count&&!drafts.count&&!bookings.count)issues.push("orphaned_legacy_booking_dates");
  if(issues.length)report.push({slug:product.slug,stock:`${product.stock_available}/${product.stock_total}`,futureLegacyBookingDates:legacy.count||0,activeInventoryBlocks:holds.count||0,activeDrafts:drafts.count||0,activeBookings:bookings.count||0,issues});
 }
 console.log(JSON.stringify({activeProducts:products.length,productsWithIssues:report.length,issues:report},null,2));
}
main().catch(error=>{console.error(error);process.exit(1)});
