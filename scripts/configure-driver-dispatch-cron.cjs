/* eslint-disable @typescript-eslint/no-require-imports */
// Run after deploying /api/cron/driver-dispatch. Secrets remain in Supabase Vault.
const fs = require("node:fs");
const { randomBytes } = require("node:crypto");
const { Client } = require("pg");
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}
async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("Database URL is required");
  const db = new Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await db.connect();
  try {
    await db.query("begin");
    const name = "rentandroll_driver_dispatch_cron_secret";
    const existing = await db.query("select id from vault.secrets where name=$1", [name]);
    if (!existing.rows[0]) await db.query("select vault.create_secret($1, $2)", [randomBytes(32).toString("hex"), name]);
    const enabled = await db.query("select cron.alter_job(jobid, active := true) from cron.job where jobname=$1", ["rentandroll-driver-dispatch"]);
    if (enabled.rowCount !== 1) throw new Error("Driver dispatch cron job is missing");
    await db.query("commit");
    console.log("Driver dispatch scheduler enabled: every 5 minutes; secret stored in Vault.");
  } catch (error) {
    await db.query("rollback"); throw error;
  } finally { await db.end(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
