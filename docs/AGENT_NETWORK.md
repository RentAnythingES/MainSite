# Agent network — operations and implementation

## Scope

1. Public EN/ES recruitment pages and homepage links; validated, rate-limited
   applications stored in the admin inbox with review status and internal notes.
2. Admin Agent Management: create country/city operating markets without publishing
   them, provision restricted Supabase users with random temporary passwords, assign
   territories, suspend accounts, reset passwords, and assign existing orders.
3. Agent portal: secure server sessions, required password replacement and profile
   completion, assigned-order acceptance/decline, order progress, operational notes,
   local driver registry, delivery/collection scheduling and printable manifest.
4. Customer communication: durable outgoing email records and a private customer
   conversation page for replies; internal notes never appear in customer threads.
5. Defense in depth: private tables, explicit role checks, territory + order checks,
   database-checked operational mutations, revocable sessions, no financial/refund
   powers for agents, and an audit trail for admin and partner changes.
6. Validate unauthorized/cross-agent/cross-market access, lifecycle transitions,
   application intake, account provisioning and onboarding. Build and verify before
   applying the additive migration and deploying.

## Operating decisions

An operating territory is an existing `markets` row (country + city + timezone +
currency). Assigning a territory does not publish city pages or enable checkout.
Agents see explicitly assigned orders in their permitted territories, not every
customer in a city. Admins retain assignment, pricing, payment and refund control.
Pending assignment offers can be accepted/declined. Completion uses the existing
booking lifecycle/inventory release functions. No invented earnings, commission
rates, automated payouts, or new-city availability promises are introduced.

Generated passwords are shown once to the admin and are never stored in application
tables or logs. Agents must replace them before seeing customer data. Email delivery
is an explicit action from the UI; implementation/testing does not contact real
customers or provision real partner accounts automatically.

## Reference

Inspected the user's signed-in Cloud of Goods Chrome tab on 28 September 2026.
Observed dashboard, sidebar and delivery manifest controls; details are recorded
in `docs/seo/COMPETITOR_REFERENCE.md`. The implementation uses Rentandroll's own
design and operating rules rather than copying account data or commercial terms.

## Admin workflow

1. Open `/admin/agents`. Review applications and add private notes in Applications.
2. In Cities, prepare country/city records with IANA time zones and currencies.
   These remain unpublished and are not enabled for public checkout.
3. In Agents, create an account directly or from an application, selecting city
   territories. Share the generated password privately after verifying the recipient.
4. The partner signs in at `/agent/login`, replaces the password and completes their
   contact/operational profile. Assigned orders then become accessible.
5. In Orders, assign open paid bookings to an active agent in the booking's city.
   Agents accept/decline offers. Reassignment removes previous access, resets the
   schedule, and rotates the private customer reply link.
6. Activity shows internal notes, status changes and customer messages. Pricing,
   cancellation, refunds and commercial agreements remain admin responsibilities.

## Agent workspace

Orders show rental dates, quantities, fulfillment instructions and, after acceptance,
customer details. Drivers belong to each agent and have no login. Schedule entry
uses the device time zone; the printable manifest displays the city's time zone.
Scheduling does not change the paid rental period. Status updates use the existing
booking lifecycle function for consistent operational history and inventory release.

Outgoing messages are saved before Resend sends them to the booking's stored email.
Private customer links support replies into the workspace. Internal notes never
appear in customer conversations. Failed/queued emails can be retried with the same
provider idempotency key. Conversations close on terminal booking states,
reassignment, suspension or territory loss. The visible workspace refreshes every
minute and when returning to the tab; Refresh checks immediately. This is polling,
not push notifications. Read state persists per customer message when a conversation
is opened or its newly received replies are explicitly marked read.

## Security and verification

Opaque, eight-hour HttpOnly cookies map to hashed server sessions. Active status
and security version are checked on each request. Credential rotation locks
authentication during changes and revokes earlier sessions. Admin reset recovers
a failed/locked password rotation. Mutations require same-origin requests. Login,
applications and messaging are rate-limited. Private tables/RPCs deny access to
Supabase anon/authenticated clients. No agent Supabase token reaches browser code.
Private pages are noindex, use no-referrer and skip analytics.

```text
node scripts/verify-agent-network.cjs --workspace-preview # preview second migration before applying it
node scripts/verify-agent-network.cjs             # applied schema; transaction rolled back
node scripts/smoke-agent-network.cjs              # local port 3100; disposable users cleaned up
node --experimental-strip-types --test scripts/agent-workspace.test.mjs
npm run db:verify
npx next build
```

Database tests cover city/order ownership, onboarding, acceptance, driver isolation,
restricted transitions, suspension and conversation closure. HTTP tests cover
public/admin isolation, application intake, provisioning, password changes, revoked
sessions, suspension, reset and logout. Tests send no customer emails.

Limits: latest 300 agent orders, 500 agent messages/events, 500 admin applications/
open orders, and 200 admin activity/messages. Public pages are bilingual EN/ES;
operational panels currently use English. No agent earnings, commission rates or
automatic settlements are assumed.

## Babonbo-inspired workspace refinement (28 September 2026)

The operational workspace now has a persistent desktop sidebar and a compact
horizontal navigation on small screens. Public shopping header/footer and floating
marketing controls are omitted inside the agent workspace. The Dashboard combines
new assignments, unread replies, today's stops in each city's time zone, and
unscheduled stops. Date-filtered order metrics describe assigned rentals, not agent
earnings. Compact order cards lead to the existing detailed action controls.

Calendar provides a month grid, city filter and selected-day agenda. The manifest
filters by date/city/driver and shows only remaining lifecycle legs (delivered orders
do not continue showing a delivery task). Printing isolates the manifest. Messages
provides an order-scoped conversation list, persisted unread counts, email retries
and direct links back to orders. Activity and Support expose operational history
and concise instructions without adding financial permissions.

Agents can add/remove unavailable periods spanning all assigned cities, inclusive
of both dates. The private `agent_unavailability` table and locked mutation function
reject overlapping active assignments and overlapping unavailable periods. An
assignment trigger locks the same agent row and checks unavailable dates during
dispatch/acceptance, so concurrent operations cannot bypass the rule. Blocking
dates never cancels bookings or alters inventory. Admin Agent Management adds an
Availability tab, disables unavailable agents in the order selector and presents
application/agent/assignment counts.

Reference observations are in `docs/seo/COMPETITOR_REFERENCE.md`. Product ownership,
independent provider pricing, review attribution and payout accounting remain
separate business-model work; no commercial values were copied from the reference.

Verification: browser-tested dashboard, calendar month navigation, unavailable-date
markers, inbox-to-order navigation and manifest driver filtering with fictional
local data. The preview page was removed before production build. Four pure tests
cover time zones/DST, remaining lifecycle legs, date overlap and calendar boundaries.
Database tests cover owner-only availability changes, assignment collision rejection
and read-state isolation. HTTP tests verify unavailable periods appear in admin.
