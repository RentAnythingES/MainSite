const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvironment() {
  const environmentPath = path.join(process.cwd(), ".env.local");
  for (const line of fs.readFileSync(environmentPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

async function main() {
  loadEnvironment();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const queuePath = path.join(process.cwd(), "docs", "catalogue-review.json");
  const deferralsPath = path.join(process.cwd(), "docs", "catalogue-source-deferrals.json");
  const previousQueue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  const sourceDeferrals = fs.existsSync(deferralsPath) ? JSON.parse(fs.readFileSync(deferralsPath, "utf8")) : {};
  const previousBySlug = new Map(previousQueue.items.map((item) => [item.slug, item]));
  const { data: products, error } = await supabase
    .from("products")
    .select("id,name,slug,brand,stock_total,content_status,is_active,description,image_url")
    .eq("is_active", false)
    .eq("content_status", "draft")
    .order("name");

  if (error) throw error;

  const now = new Date().toISOString();
  const items = products.map((product) => {
    const previous = previousBySlug.get(product.slug);
    const sourceUrl = previous?.sourceUrl ?? null;
    const sourceDeferral = sourceDeferrals[product.slug] ?? null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      sourceUrl,
      status: sourceDeferral ? "deferred" : sourceUrl ? "needs_source_research" : "deferred",
      action: sourceDeferral ? "needs_replacement_source" : sourceUrl ? "research_source_then_enrich" : "needs_business_input",
      riskClass: previous?.riskClass ?? "unclassified",
      deferReason: sourceDeferral || (sourceUrl ? null : "No exact product model or usable source URL is recorded."),
      hasDescription: Boolean(product.description),
      hasImage: Boolean(product.image_url),
      reviewedAt: now,
    };
  });

  const queue = {
    generatedAt: now,
    source: "Supabase inactive draft products reconciled with Product_Database_WIP source links",
    totals: {
      drafts: items.length,
      sourceBacked: items.filter((item) => item.sourceUrl && item.action === "research_source_then_enrich").length,
      needsReplacementSource: items.filter((item) => item.action === "needs_replacement_source").length,
      needsBusinessInput: items.filter((item) => !item.sourceUrl).length,
    },
    items,
  };

  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  console.log(JSON.stringify(queue.totals));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
