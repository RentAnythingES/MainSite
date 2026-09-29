# Telegram Driver Dispatch

The driver group is **Rent'n Roll Deliveries**. It is used only for claimable
delivery and return-collection broadcasts; customer names, phones, addresses, booking
references, and rental items are never posted there.

## One-time Telegram setup

1. Create the private group named `Rent'n Roll Deliveries` in Telegram.
2. Add the Rent'n Roll bot to the group and promote it to an administrator with
   permission to invite users and remove members.
3. Send `/chatid` in the group. The bot replies with the negative group chat ID.
4. Set that ID as `TELEGRAM_DELIVERY_GROUP_ID` in Vercel Production and Preview.
5. Confirm the bot webhook is `https://rentandroll.com/api/webhooks/telegram`
   and uses the Production `TELEGRAM_WEBHOOK_SECRET`. Subscribe it to
   `callback_query`, `message`, and `chat_member` updates.

## Driver workflow

1. Each driver opens a private chat with the bot, presses Start, and sends
   `/chatid` to obtain their personal Telegram user ID.
2. An admin adds that ID at `/admin/drivers`, then creates a one-time group invite.
3. The driver joins the group. Telegram sends a `chat_member` webhook and marks
   the driver active for claims. If that webhook was missed, the first claim checks
   the driver's current group membership with Telegram and activates the driver.
4. Payment completion posts eligible requests containing only date, delivery window,
   and postcode. An active driver taps **I'll take it**.
5. The webhook atomically assigns the request and sends the full customer and
   address details only to that driver's private bot chat.

Removing a driver from `/admin/drivers` removes them from the Telegram group and
immediately prevents any future claim. Drivers must have started the bot privately
before they can receive assigned-job details.

## Advance dispatch and reminders (29 September 2026)

Delivery and return collection are scheduled independently against their saved due
timestamps. Jobs due within seven days of booking creation are offered immediately.
Jobs originally more than seven days away are held until six days before they are
due (the seven-day decision is based on booking creation, not each scheduler run).
Only paid/active fulfillment statuses are eligible; unpaid quotes and customer
pickup/return handovers never create driver requests.

Unclaimed requests are repeated after at least four elapsed hours, only between
08:00 inclusive and 20:00 exclusive every day in Europe/Madrid. An overnight reminder
waits until working hours resume. Initial offers are immediate even outside those
hours. Each repeat uses the same claim ID, so older buttons cannot assign the job
twice. Claiming stops reminders. An unclaimed delivery or collection receives one
urgent alert in the configured admin Telegram chat(s) at the two-hour threshold,
including outside working hours; a delayed check also catches an overdue alert.
Unclaimed overdue requests continue working-hour reminders until claimed or closed.

The payment webhook invokes the shared dispatcher, and authenticated
`/api/cron/driver-dispatch` reconciles eligible jobs every five minutes. Durable send
timestamps and expiring database leases prevent overlapping workers from repeating
a send. Failed Telegram sends retain retry eligibility. Cancellation, completion,
refund, changed fulfillment, or changed event date invalidates stale requests; a
database claim guard also rejects stale Telegram buttons. Existing broadcasts are
backfilled to avoid treating them as new. Historic past jobs never broadcast are
not recreated during rollout.

Apply `20260929_advance_driver_dispatch.sql` and
`20260929_driver_dispatch_scheduler.sql` and
`20260929_driver_dispatch_scheduler_auth.sql`, deploy the application, then run
`node scripts/configure-driver-dispatch-cron.cjs`. The second migration installs
Supabase `pg_cron`/`pg_net` and leaves the named job disabled until configuration.
The setup script generates a dedicated random credential in Vault and enables
`rentandroll-driver-dispatch` on `*/5 * * * *`. No secret is embedded in the cron SQL
or committed files. The API verifies its SHA-256 fingerprint through a service-role-only
function; the plaintext credential never passes through the application database API.
Existing credentials are preserved on reruns. Disable with `cron.alter_job(jobid, active := false)` for
that named job. Inspect `cron.job_run_details` and `net._http_response` to verify
both scheduler execution and HTTP results; HTTP 500 errors also create system incidents.

This uses [Supabase's documented Cron and Vault pattern](https://supabase.com/docs/guides/functions/schedule-functions)
because [Vercel cron frequency and timing depend on plan](https://vercel.com/docs/cron-jobs/usage-and-pricing).
The daily manifest remains on its existing schedule; it no longer creates courier
requests. Dispatch checks run every five minutes, so scheduled thresholds can be
up to five minutes late plus request processing time.

Run `npm run test:driver-dispatch` for offline timing, Telegram payload and isolated
Postgres migration/claim tests. These tests never send real Telegram messages.

## Testing

A test delivery request is clearly marked and contains no customer or booking data.
When an eligible driver claims it, the group post is marked as a test claim and the
bot sends only test details privately. It never creates or changes a booking.
