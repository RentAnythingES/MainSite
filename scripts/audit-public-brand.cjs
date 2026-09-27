/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const base = (process.env.BRAND_AUDIT_BASE_URL || "https://rentandroll.com").replace(/\/$/, "");
const oldBrand = /rent[\s_-]?anything(?:\.es)?/gi;

async function main() {
  const sitemap = await fetch(`${base}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`Sitemap returned ${sitemap.status}`);
  const urls = [...new Set([...((await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g))].map((match) => `${base}${new URL(match[1]).pathname}`))];
  urls.push(`${base}/admin/login`);
  const failures = [];
  let completed = 0;
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        const html = await response.text();
        const matches = [...new Set(html.match(oldBrand) || [])];
        if (!response.ok || matches.length) failures.push({ path: new URL(url).pathname, status: response.status, matches });
      } catch (error) { failures.push({ path: new URL(url).pathname, error: error.message }); }
      completed++;
      if (completed % 100 === 0) console.log(`Checked ${completed}/${urls.length} pages`);
    }
  }));
  const report = { checkedAt: new Date().toISOString(), base, pagesChecked: completed, failures };
  fs.writeFileSync("docs/seo/public-brand-audit.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
