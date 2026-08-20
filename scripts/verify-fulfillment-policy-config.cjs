/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = [
  path.join(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "..", "..", ".env.local"),
].find((candidate) => fs.existsSync(candidate));

if (!envPath) throw new Error(".env.local was not found in the project or parent workspace");

for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const expectedDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing from .env.local");
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  try {
    const { rows } = await client.query(`
      select
        zone.slug,
        zone.lead_time_hours,
        zone.express_min_lead_hours,
        zone.automatic_express_enabled,
        zone.express_surcharge_cents,
        zone.delivery_operating_hours
      from public.service_zones as zone
      join public.markets as market on market.id = zone.market_id
      where market.slug = 'valencia'
        and zone.slug in ('valencia-central', 'valencia-beach')
      order by zone.slug
    `);

    if (rows.length !== 2) throw new Error("Expected both Valencia service zones");
    for (const zone of rows) {
      if (zone.lead_time_hours !== 12) throw new Error(`${zone.slug} later-date lead time is not 12 hours`);
      if (zone.express_min_lead_hours !== 6) throw new Error(`${zone.slug} Express lead time is not 6 hours`);
      if (zone.express_surcharge_cents <= 0) throw new Error(`${zone.slug} Express surcharge is not positive`);
      if (!expectedDays.every((day) => zone.delivery_operating_hours?.[day])) {
        throw new Error(`${zone.slug} operating hours are incomplete`);
      }
    }

    console.log(JSON.stringify({
      verified: true,
      zones: rows.map((zone) => ({
        slug: zone.slug,
        laterDateLeadHours: zone.lead_time_hours,
        expressMinLeadHours: zone.express_min_lead_hours,
        automaticExpressEnabled: zone.automatic_express_enabled,
        expressSurchargeCents: zone.express_surcharge_cents,
        operatingHours: zone.delivery_operating_hours,
      })),
    }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Fulfillment policy verification failed: ${error.message}`);
  process.exit(1);
});
