const fs = require("fs");
const path = require("path");

const queuePath = path.join(process.cwd(), "docs", "catalogue-review.json");
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const now = new Date().toISOString();

for (const item of queue.items) {
  if (item.status !== "pending") continue;

  if (!item.sourceUrl) {
    item.status = "deferred";
    item.action = "needs_business_input";
    item.deferReason = "No exact product model or usable source URL is recorded.";
    item.reviewedAt = now;
    continue;
  }

  item.status = "needs_source_research";
  item.action = "research_source_then_enrich";
  item.deferReason = null;
  item.reviewedAt = now;
}

queue.generatedAt = now;
queue.totals = {
  pending: queue.items.filter((item) => item.status === "pending").length,
  enriched: queue.items.filter((item) => item.status === "enriched").length,
  deferred: queue.items.filter((item) => item.status === "deferred").length,
  needs_business_input: queue.items.filter((item) => item.action === "needs_business_input").length,
  needs_source_research: queue.items.filter((item) => item.status === "needs_source_research").length,
};

fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
console.log(JSON.stringify(queue.totals, null, 2));
