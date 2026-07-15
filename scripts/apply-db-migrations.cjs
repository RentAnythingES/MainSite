const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

const requestedFiles = process.argv.slice(2);

function resolveMigration(filename) {
  if (!/^[0-9]{8}_[a-z0-9_]+\.sql$/.test(filename)) {
    throw new Error(`Invalid migration filename: ${filename}`);
  }
  const migrationPath = path.join(process.cwd(), "supabase", "migrations", filename);
  if (!fs.existsSync(migrationPath)) throw new Error(`Migration not found: ${filename}`);
  const sql = fs.readFileSync(migrationPath, "utf8");
  return {
    filename,
    sql,
    checksum: crypto.createHash("sha256").update(sql).digest("hex"),
  };
}

async function main() {
  if (!process.env.SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL is missing from .env.local");
  if (requestedFiles.length === 0) throw new Error("Pass one or more migration filenames to apply");

  const migrations = requestedFiles.map(resolveMigration);
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  const results = [];
  try {
    await client.query("select pg_advisory_lock(hashtext('rentanything-schema-migrations'))");
    await client.query(`
      create table if not exists public.app_schema_migrations (
        filename text primary key,
        checksum_sha256 text not null,
        applied_at timestamptz not null default now()
      );
      alter table public.app_schema_migrations enable row level security;
    `);

    for (const migration of migrations) {
      const existing = await client.query(
        "select checksum_sha256, applied_at from public.app_schema_migrations where filename = $1",
        [migration.filename]
      );
      if (existing.rows.length > 0) {
        if (existing.rows[0].checksum_sha256 !== migration.checksum) {
          throw new Error(`Checksum mismatch for previously applied migration ${migration.filename}`);
        }
        results.push({ filename: migration.filename, status: "already_applied", appliedAt: existing.rows[0].applied_at });
        continue;
      }

      await client.query("begin");
      try {
        await client.query(migration.sql);
        await client.query(
          "insert into public.app_schema_migrations (filename, checksum_sha256) values ($1, $2)",
          [migration.filename, migration.checksum]
        );
        await client.query("commit");
        results.push({ filename: migration.filename, status: "applied" });
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
    }
  } finally {
    await client.query("select pg_advisory_unlock(hashtext('rentanything-schema-migrations'))").catch(() => undefined);
    await client.end();
  }

  console.log(JSON.stringify({ migrations: results }, null, 2));
}

main().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exit(1);
});
