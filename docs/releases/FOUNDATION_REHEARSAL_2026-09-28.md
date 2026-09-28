# Foundation release rehearsal — 28 September 2026

## Result

The private-city migration passed against a disposable local Supabase environment containing the production public schema and synthetic records. A hosted staging project was not needed for this rehearsal. Production remains unchanged pending verification of the Vercel catalogue setting and the release itself.

## Environment and isolation

- Docker Desktop 27.4.0 engine; Supabase CLI 2.118.0.
- Local Supabase PostgreSQL image `17.6.1.171`; production reports PostgreSQL 17.6.
- Local database, Auth, PostgREST, gateway and mail catcher. Database/API ports 54322/54321 on localhost.
- Exported only the production public schema, with read-only transactions, connection/statement/lock timeouts and a bounded export process. No customer records or production credentials were copied into local Supabase.
- Public schema SHA-256: `7b165a229f572c09723271a139dc6cafb7ffbf0abaf20252487872168ab2bb6e`.
- Restored table definitions, functions, constraints, triggers, grants, default privileges and policies. Local managed schemas come from the Supabase distribution; this is not a byte-for-byte clone of hosted infrastructure.
- Initial restore rolled back because the local postgres role could not change supabase_admin default privileges. Retried once using local supabase_admin for those statements, retaining postgres as the object-creation role. Restore succeeded atomically.

## Passed checks

- Exact new migration executes on the full public schema; outer rollback removes its schema changes.
- City creation leaves all publication, booking and default flags false.
- Duplicate/invalid configuration and unauthorized admin actors are rejected.
- Audit failure rolls back the city write. Stale revisions are rejected.
- Both anon and authenticated roles see only eligible public fulfillment rows; internal notes/contact fields and audit records are inaccessible.
- Real anonymous PostgREST reads return the same Valencia public projections as service-role reads.
- Current and deployed-baseline fulfillment readers return identical Valencia options.
- Pickup, delivery-only and delivery-plus-collection quotes with synthetic fees produce the expected totals: EUR 45, 52 and 56 for a three-day EUR 15/day rental.
- Two simultaneous city edits on separate database connections produce exactly one successful save and one revision conflict (`40001`). Valencia's row remains unchanged.
- All 54 targeted application tests and the production build passed earlier on the unchanged application code.
- Live read-only parity: 70 installed migrations match source; 169 products have no missing default offers or stock/price differences; anonymous catalogue readers return the same 128 active products.

Evidence and local scripts are saved in the workspace's `agent-work/expansion-readiness-2026-09-27/goalpro/`, including `local-rehearsal-receipt.json`. Production schema export and local credentials are not release source files.

## Limits and remaining release steps

The rehearsal covers the private-city schema and existing Valencia fulfillment/quote behavior. It does not certify the future offer-inventory writer, reservation concurrency, payment webhook lifecycle, German pages or another city's checkout. Those remain separate implementation gates.

The available Vercel browser session only has access to Snappit, not the Rentandroll team. Verify `MARKET_CATALOGUE_READ_MODE` is unset or `legacy` in the correct project before release. Then apply only `20260927_private_market_setup.sql` with an atomic migration-ledger insert, publish the prepared branch using Johannes-Schiefer's GitHub identity, and verify the resulting deployment. Restored historical migrations must not be replayed.
