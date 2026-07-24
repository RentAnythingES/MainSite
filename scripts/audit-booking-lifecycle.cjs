const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();
  try {
    const result = await client.query(`
      select
        booking_ref,
        status,
        start_date,
        end_date,
        rental_start_at,
        rental_end_at,
        (
          select count(*)::int
          from public.booking_ops_tasks task
          where task.booking_id = booking.id and task.is_done
        ) as done_tasks
      from public.bookings booking
      order by created_at desc
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Lifecycle audit failed: ${error.message}`);
  process.exit(1);
});
