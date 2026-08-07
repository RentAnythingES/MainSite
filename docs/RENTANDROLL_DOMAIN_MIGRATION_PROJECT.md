# Rent&Roll Brand and Domain Migration Project

> **Status:** Infrastructure and release candidate prepared; production deployment, Stripe, Supabase, and controlled booking validation pending
> **Prepared:** 24 July 2026
> **Brand update:** 7 August 2026
> **Current brand/domain:** RentAnything.es / `rentanything.es`
> **Target brand/domain:** Rent&Roll / `rentandroll.com`
> **Legal entity:** Escalera Labs S.L. remains unchanged

## 1. Executive recommendation

The website-side preparation described below has been implemented on an isolated
release branch, including production brand assets, centralized identity/origin
configuration, metadata and schema updates, and redirect-ready host behavior.
Cloudflare is authoritative, both new hosts are valid in Vercel, the apex is the
production host, Resend has verified `rentandroll.com`, inbound Cloudflare Email
Routing works, and the Vercel production environment values have been updated.
The code deployment, Stripe webhook switch, Supabase Auth Site URL switch, and
controlled booking test remain.

Move the existing site to the new domain as a one-to-one domain and entity
migration:

- Keep every public path unchanged.
- Change the public brand, canonical origin, email identity, and visual shell.
- Do not combine the cutover with a navigation rewrite, URL restructure, CMS
  replacement, new locale, or large content expansion.
- Redirect every old URL directly to its exact new-domain equivalent with a
  server-side permanent `301` or `308`.
- Keep `rentanything.es`, its TLS certificate, DNS, and redirects for at least
  one year and preferably indefinitely.
- Use Google Search Console's Change of Address tool only after the new site and
  redirects have passed production validation.

This follows Google's recommendation to change one major thing at a time and
preserve site architecture during a domain move. The public brand must change
with the domain, but the deeper visual redesign should be limited to the approved
logo, palette, icons, name, and tagline during migration. Layout experiments can
resume after search visibility stabilizes.

The move is inconvenient but appropriately timed. The site has 212 sitemap URLs
and is beginning to earn impressions and conversions, but it has not accumulated
years of links or branded search demand. Migrating now is lower-risk than
migrating after that authority compounds.

## 2. Launch gates

Do not schedule cutover until every gate below is satisfied.

| Gate | Required evidence | Owner |
|---|---|---|
| Domain history | Search Console target property shows no manual actions, security issues, or inherited removals; current parked content is removed | SEO owner |
| Brand convention | Display name, ASCII fallback, tagline, legal attribution, and email identities approved | Business owner |
| Production assets | Full SVG/PNG lockup, transparent icon, favicon/app-icon set, monochrome mark, and social/OG asset approved | Brand/design |
| Platform access | Owner/admin access confirmed for Vercel, DNS, GSC, GA4, Supabase, Stripe, Resend, Google Business Profile, GitHub, and registrar | Business owner |
| URL mapping | All current sitemap URLs, known legacy URLs, high-traffic URLs, and backlink targets map to final destinations | Engineering/SEO |
| Operational rehearsal | Preview build, booking, payment, webhook, email, documents, admin login, and redirects pass | Engineering/operations |
| Rollback readiness | Last known-good deployment, domain settings, environment values, DNS records, and webhook configuration captured | Engineering |

### Confirmed project inputs

- RentAndRoll.com is owned and available to this project.
- The move to Rent&Roll is approved and will happen.
- `Rent&Roll` is the approved display and schema name. `Rent and Roll` remains
  the spoken/descriptive alternate, and the tagline remains unchanged.
- The updated `docs/Rent&Roll.png` composite is the approved source for the
  release-candidate logo reconstruction.
- The current parked page will be replaced by the Vercel deployment during
  infrastructure preparation.
- Trademark and naming administration, if required, is a parallel business task
  and does not form part of the technical go/no-go decision in this project.

## 3. Canonical naming standard

Use one primary form consistently. Rotating between three brand spellings would
weaken entity consistency and create avoidable copy and schema drift.

| Context | Approved form |
|---|---|
| Display brand | `Rent&Roll` |
| Plain-text/ASCII form | `Rent&Roll` |
| Spoken/descriptive fallback | `Rent and Roll` |
| Domain and email | `rentandroll.com` in lowercase |
| Schema `name` | `Rent&Roll` |
| Schema `legalName` | `Escalera Labs S.L.` |
| Transitional schema/name | `alternateName: ["RentAnything.es", "Rent and Roll"]` |
| Avoid as general display variants | `Rent’n’Roll`, `Rent'n'Roll`, and `RentAndRoll` |
| Approved tagline | `Travel light. Rent what you need.` |

Recommended temporary entity statement for About, footer, emails, and support:

> Rent&Roll is the new name of RentAnything.es. The same Valencia team and
> Escalera Labs S.L. continue to operate the service.

Keep that transition language for approximately 90 days on the site and longer
in support documentation if customers still use old links or emails.

## 4. Primary-host decision

Recommended canonical origin:

`https://rentandroll.com`

Recommended host behavior:

| Requested host | Response |
|---|---|
| `https://rentandroll.com/path` | `200`, self-canonical |
| `https://www.rentandroll.com/path` | Permanent redirect to `https://rentandroll.com/path` |
| `https://rentanything.es/path` | Permanent redirect to `https://rentandroll.com/path` |
| `https://www.rentanything.es/path` | Permanent redirect directly to `https://rentandroll.com/path` |
| HTTP variants | HTTPS final destination, with the fewest platform-supported hops |

Vercel recommends `www` as the primary host for DNS resiliency, but the supplied
brand sheet displays the apex domain and the current site already uses an apex
canonical. Either host can work. The final decision must be made before coding;
all metadata, redirects, emails, and third-party settings must use one answer.

## 5. Migration principles

1. **Paths do not change.** English remains unprefixed and Spanish remains under
   `/es/`.
2. **No redirect chains.** Old URLs go directly to the final new URL, including
   retired product slugs that already have internal redirects.
3. **No blanket homepage redirects.** Removed content returns `404` or `410`
   unless a genuinely equivalent destination exists.
4. **Query strings and tokens survive.** Checkout session IDs, newsletter
   unsubscribe tokens, review tokens, document tokens, and fulfillment tokens
   must reach the same path and query on the new domain.
5. **Canonical signals agree.** Canonical, hreflang, sitemap, Open Graph,
   JSON-LD, internal links, and robots sitemap references all use the new origin.
6. **The old domain remains crawlable as redirects.** Do not block it in
   `robots.txt` or add `noindex` before Google processes the redirects.
7. **Historical records remain historical.** Old audit JSON, issued invoices,
   booking references, migration comments, and dated research are not rewritten
   to pretend the old brand never existed.
8. **Legal identity and document immutability remain intact.** Escalera Labs S.L.
   stays the issuer/controller unless the business separately changes it.
9. **Fix forward after GSC submission.** Once Change of Address is active, avoid
   bouncing between domains because of ordinary ranking fluctuations.

## 6. Workstreams and implementation scope

### A. Brand system and public interface

- Convert the supplied composite `docs/Rent&Roll.png` into a production asset
  pack: horizontal and compact SVG marks, transparent PNG fallbacks, monochrome
  versions, favicon, Apple icon, application icon, and social-sharing image.
- Replace current header, footer, mobile navigation, admin login, checkout,
  booking confirmation, account-facing, and error-state branding.
- Apply the approved palette without doing a simultaneous layout redesign.
  Existing component structure, accessibility, and conversion paths remain
  stable during the move.
- Replace user-visible `RentAnything`, `RentAnything.es`, and old tagline copy in
  English and Spanish dictionaries.
- Add the temporary “new name, same Valencia team” statement to the About page,
  footer, transactional emails, and support surfaces.
- Update image alt text and accessible names. Do not put the ampersand in URL
  slugs, environment-variable names, filenames that need broad tooling support,
  or email addresses; use `rentandroll` for those identifiers.

### B. Application configuration and code

- Create one typed site-identity configuration for canonical origin, public
  brand, legal entity, contact addresses, social handles, and schema IDs.
- Remove duplicated production-origin fallbacks from page metadata, booking
  links, document links, reviews, fulfillment amendments, newsletter links,
  checkout return URLs, sitemap, robots, and JSON-LD.
- Continue to read `NEXT_PUBLIC_SITE_URL` at runtime/build time, but fail a
  production build when it is missing or points at the old origin.
- Replace user-facing identifiers such as download filenames and admin
  placeholders where safe.
- Preserve immutable or operational identifiers:
  existing `RA-*` booking references, `RA`/`RAS`/`RAR` document sequences,
  physical-unit codes, issued documents, database migrations, and historical
  audit evidence. Both brands share the initials, so no new sequence is needed.
- Leave Supabase storage object URLs unchanged unless storage is separately
  moved; they are infrastructure URLs, not public canonical pages.

### C. Search, metadata, and content signals

- Update `metadataBase`, canonical URLs, English/Spanish hreflang alternates,
  Open Graph URLs, structured-data IDs, organization/website names, sitemap
  URLs, and the robots sitemap reference.
- Keep all current route paths, page purposes, headings, and keyword targets.
  Do not rewrite SEO pages merely to insert the new name.
- Retain Valencia, Spain, Spanish/English, EUR, service-area, address, phone,
  and local landmark signals to compensate for moving from a Spain ccTLD to a
  generic `.com`.
- Use `RentAnything.es` as a temporary `alternateName` in organization schema
  and explanatory copy, not as the primary page title.
- Generate and retain a machine-readable inventory of every current indexable
  URL. The current sitemap contains 212 URLs; the implementation must recalculate
  and lock the actual launch count.

### D. Hosting, DNS, TLS, and redirects

- Add both `rentandroll.com` and `www.rentandroll.com` to the existing Vercel
  project while the old domain still serves production.
- Replace the parked-domain DNS records with Vercel's verified records and wait
  for TLS to become valid before exposing the new host.
- Set one new primary domain and redirect the alternate new host to it.
- Keep both old-domain variants attached to the project and configure permanent
  path-preserving redirects directly to the selected new primary host.
- Use `308` where Vercel's domain redirect supports it; `301` is also acceptable.
- Preserve path, query string, and URL encoding. Test POST/API exceptions
  explicitly; third-party webhooks must be reconfigured and must not depend on
  an HTTP redirect.
- Keep old-domain DNS, TLS, and registration active for at least one year and
  preferably indefinitely.

### E. Booking, payments, fulfillment, and Supabase

- Verify quote, booking draft, availability, inventory assignment, checkout,
  payment confirmation, fulfillment amendment, review, document download, and
  cancellation/refund paths on the new host.
- Update Stripe success and cancel URLs and the live webhook endpoint.
- Send a signed Stripe test event and complete one controlled live low-value
  booking/refund test before declaring cutover complete.
- Update Supabase Auth Site URL and production redirect allowlist. Keep exact
  old-host callbacks temporarily during the transition, then remove them after
  active links/sessions have aged out.
- Confirm Row Level Security, service-role API routes, admin authentication, and
  tokenized customer pages behave identically under the new origin.
- Preserve existing database records, booking URLs stored in audit logs, and
  paid-document history.

### F. Email and customer communications

- Verify a sending domain or subdomain for `rentandroll.com` in Resend with SPF
  and DKIM; publish DMARC and monitor it.
- Select and provision new `from`, `reply-to`, support, privacy, and operations
  addresses. Keep old addresses as aliases/forwarders for at least 12–24 months.
- Update transactional templates, plaintext fallbacks, logos, footer identity,
  links, unsubscribe URLs, review URLs, invoices, and operational alerts.
- Test delivery, reply routing, unsubscribe, document attachments, and link
  expiry with Gmail, Outlook, and a mobile mail client.
- Do not switch the application sender until the new domain is verified. A
  verified old sender is safer than silently failing production mail.

### G. Legal, finance, and operational records

- Update Terms, Privacy, Cookies, Refunds, Contact, About, and company-disclosure
  pages with the new trading name and domain while retaining
  `Escalera Labs S.L.` and existing company identifiers.
- Update cookie-consent text and the local storage key only if a deliberate
  compatibility migration copies the current consent choice; otherwise keep the
  old key to avoid needlessly asking every customer again.
- Update new invoices, refund receipts, exports, and document styling without
  modifying issued records.
- Update support macros, booking handoff instructions, QR codes, printed cards,
  inventory labels that contain a URL, and staff/admin bookmarks.

### H. Analytics, search consoles, local listings, and external references

- Keep the existing GA4 property and measurement ID for continuous reporting.
  Rename its web stream and update its Website URL, then verify real-time events,
  consent mode, conversions, cross-domain/referral behavior, and payment events.
- Verify domain properties for both domains in the same Google Search Console
  account. Check manual actions, security issues, removals, and ownership before
  cutover.
- Submit the new sitemap and Google Change of Address only after redirect and
  canonical validation passes.
- Update the Google Business Profile to the real-world new brand and URL. If
  Google requests reverification for the material rename, complete that process
  or contact Business Profile support; this is an execution dependency, not a
  reconsideration of the rebrand.
- Update Bing Webmaster Tools, social profiles, directory listings, partner
  profiles, advertising destinations, payment descriptors where applicable,
  and the most valuable known backlinks.

### I. Documentation, scripts, and repository hygiene

- Update architecture, frontend, design, product-sense, SEO strategy, SEO
  roadmap, deployment documentation, `.env.example`, seed guidance, and
  operational runbooks.
- Update active scripts and tests that assert the old origin or public brand.
- Do not rewrite historical SEO exports, audits, migrations, or evidence files;
  label them historical when ambiguity is possible.
- Add an automated repository check that fails when a newly introduced live-code
  reference uses `rentanything.es`, excluding documented historical paths.

## 7. Delivery phases

### Phase 0 — Launch inputs and access

**Outcome:** implementation can proceed without mid-cutover decisions.

- [ ] Confirm the canonical host (`rentandroll.com` is recommended).
- [x] Confirm `Rent&Roll` as the display form and retain the supplied tagline.
- [ ] Choose production contact and sender addresses.
- [ ] Obtain DNS, Vercel, Resend, Stripe, Supabase, GA4, GSC, and Business Profile
  access for the people performing the cutover.
- [x] Approve production logo reconstruction from the updated
  `docs/Rent&Roll.png` composite.
- [ ] Select a low-traffic cutover window and name the launch commander.

### Phase 1 — Baseline and migration manifest

**Outcome:** the old and new states are measurable and reversible.

- Export the current sitemap URL list, GSC page/query baselines, GA4 conversions,
  top landing pages, backlink targets, DNS zone, Vercel domains/environment
  values, Supabase Auth settings, Stripe webhook settings, and Resend settings.
- Capture the last known-good Vercel deployment and current application commit.
- Crawl production and record status, canonical, hreflang, title, robots,
  structured data, and redirect behavior for all indexable URLs.
- Build the authoritative old-to-new redirect manifest and exceptions list.

### Phase 2 — Application and brand implementation

**Outcome:** a preview deployment is fully Rent&Roll and internally consistent.

- Add central site identity/configuration, new assets, copy, metadata, schema,
  sitemap, robots, email, documents, analytics label, and tests.
- Keep every public route path stable.
- Update active documentation and environment templates.
- Run repository scans, unit/integration tests, `npx next build`, and a preview
  crawl. No old public origin may remain in generated pages or customer links.

### Phase 3 — Platform preparation and rehearsal

**Outcome:** the new domain is secure and all external services are ready.

- Add/verify new Vercel domains, DNS, and TLS without yet redirecting the old
  public domain.
- Verify new mail DNS and sender identities.
- Preconfigure Supabase redirect URLs, GA4 stream details, GSC ownership, and
  Stripe test endpoint settings.
- Rehearse the full booking/payment/email/document/admin flow against the new
  host using the release candidate.
- Run the 212-URL (or final manifest count) validation suite on both hosts.

### Current preflight evidence — 7 August 2026

- [x] `Rent&Roll` asset, live-code, schema-name, and active-documentation scan
  contains no deprecated display-name references.
- [x] `npm run build` passes, including TypeScript and 223 generated static pages.
- [x] `npm run audit:launch` passes against the configured live backend with no
  warnings or critical issues; 114 active products pass its readiness checks.
- [ ] Resolve the live SEO indexability mismatch before cutover:
  `/product/convertible-car-seat` and `/product/travel-cot` are linked from
  category pages and emit `index, follow`, but are absent from the sitemap.
- [ ] Run the full SEO and redirect suite against the Rent&Roll preview host after
  Vercel domain/TLS setup; the old-host SEO regression suite currently stops at
  the product indexability mismatch above.

### Phase 4 — Production cutover

**Outcome:** new-domain traffic is live; all old URLs redirect directly.

- Freeze unrelated deployments and content changes.
- Deploy the tested release with production new-origin environment values.
- Validate critical new-host routes and transactions before enabling old-domain
  redirects.
- Switch Stripe live webhook/configuration and verify signed delivery.
- Enable old-domain permanent redirects and retest the full manifest.
- Keep an operator watching payments, email, server errors, and support reports.

### Phase 5 — Search and external migration

**Outcome:** Google and external references receive one coherent move signal.

- Recheck new self-canonicals, hreflang, schema, robots, sitemap, and old
  redirects from outside the deployment environment.
- Submit the new sitemap and Google Search Console Change of Address.
- Update GA4, Business Profile, Bing, social, directories, ads, partners, and
  priority backlinks.
- Publish the temporary rebrand explanation on owned channels.

### Phase 6 — Stabilization

**Outcome:** ranking transfer and business operations are monitored to closure.

- Monitor crawl/indexation, impressions, conversions, bookings, payment events,
  email delivery, 404s, and redirect health on the schedule in section 13.
- Fix forward unless a defined catastrophic rollback condition occurs.
- Remove transitional copy and temporary callback exceptions only after the
  agreed ageing periods.

## 8. Cutover runbook

### T-7 days to T-48 hours

1. Finish the redirect manifest and production crawl baseline.
2. Lower DNS TTL where the current provider permits it.
3. Verify new-domain ownership in GSC and attach apex plus `www` to Vercel.
4. Publish mail DNS; wait for Resend verification.
5. Verify new TLS and test the release candidate on the new host.
6. Confirm the old domain remains renewed, attached, and capable of TLS
   redirects.
7. Announce the internal freeze window and support escalation path.

### T-24 hours

1. Re-run production build, preview crawl, booking, payment, webhook, email,
   document, admin, analytics, and mobile checks.
2. Export current DNS, Vercel, Supabase, Stripe, Resend, GA4, and GSC settings.
3. Record the release commit and last known-good deployment.
4. Confirm one operator owns each console and the rollback decision.
5. Pause unrelated releases; do not pause customer bookings.

### Cutover

1. Deploy the approved commit with `NEXT_PUBLIC_SITE_URL` and other public-origin
   values set to the new primary origin.
2. Verify new apex/`www` host behavior, TLS, homepage, representative English and
   Spanish pages, sitemap, robots, canonicals, hreflang, and structured data.
3. Complete a new-host quote through payment, signed webhook processing,
   confirmation email, booking document, admin display, and controlled refund.
4. Change the Stripe live webhook URL directly to the new HTTPS endpoint; update
   the application signing secret only if Stripe creates a new endpoint.
5. Confirm Supabase Site URL/allowlist and new sender configuration.
6. Enable direct permanent redirects from both old-domain hosts.
7. Run the full redirect suite and verify one hop, final `200`, correct canonical,
   preserved query/token, and no redirect loops.
8. Check GA4 real-time events, Stripe deliveries, Resend logs, Vercel errors,
   Supabase logs, and customer support channels.
9. Once stable, submit the new sitemap and GSC Change of Address.

### First four hours

- Repeat critical booking and webhook tests at hour 1 and hour 4.
- Sample top SEO landing pages and every special token route.
- Investigate any booking, payment, email, authentication, `5xx`, redirect-loop,
  or widespread `404` signal immediately.
- Record timestamps and evidence for every cutover action.

## 9. Redirect specification

### General mapping

For every valid path:

```text
https://rentanything.es/{path}?{query}
https://www.rentanything.es/{path}?{query}
    -> https://rentandroll.com/{path}?{query}
```

This assumes the recommended apex primary host. Substitute the chosen primary
host everywhere if `www` is selected.

Requirements:

- Use one permanent hop from each old HTTPS host to the final new HTTPS URL.
- Preserve trailing-slash behavior, percent encoding, query parameters, and
  case behavior already supported by the application.
- HTTP may require a platform TLS/host normalization hop, but it must still land
  on the exact new path and query.
- New-domain alternate-host requests redirect once to the primary new host.
- Excluded or removed URLs return the same meaningful `404`/`410`; do not send
  them to the homepage.

### Existing legacy-path rules

The current application already redirects old product slugs. Old-domain rules
must collapse those chains:

| Requested URL | Direct final destination |
|---|---|
| `rentanything.es/product/portable-ac` | `rentandroll.com/product/koenic-kac-9022-w-portable-air-conditioner` |
| `rentanything.es/es/product/portable-ac` | `rentandroll.com/es/product/koenic-kac-9022-w-portable-air-conditioner` |
| `rentanything.es/product/mobility-scooter-lightweight` | Current final new-domain product slug |
| `rentanything.es/es/product/mobility-scooter-lightweight` | Current final Spanish new-domain product slug |

The implementation must discover every redirect in `next.config`, middleware,
route handlers, and hosting settings and add it to this collapse list.

### Routes requiring explicit preservation tests

| Route type | Example | Required test |
|---|---|---|
| Checkout return | `/booking/success?session_id=...` | Query remains present and booking resolves |
| Newsletter unsubscribe | `/newsletter/unsubscribe?token=...` | One use produces the expected unsubscribe |
| Review request | `/review/[token]` | Valid token opens; expiry behavior is unchanged |
| Customer document | `/api/documents/[token]/pdf` | Authorized PDF downloads; invalid token fails safely |
| Fulfillment amendment | `/booking/fulfillment/[token]?payment=...` | Amendment and payment state survive |
| Language routes | `/es/...` | Spanish path, canonical, and hreflang remain Spanish |
| API webhook | `/api/webhooks/stripe` | Stripe calls the new URL directly; no redirect dependency |

### Automated redirect audit

For every URL in the launch manifest, record:

- old URL and expected final URL;
- first response status and `Location`;
- total redirect count;
- final status;
- final canonical;
- robots indexability;
- language alternates;
- preservation of expected query parameters;
- title/structured-data origin; and
- pass/fail timestamp.

Retain the report under `docs/seo/audits/` as migration evidence.

## 10. Test and acceptance plan

### Build and static quality gates

- `npx next build` passes with zero errors.
- Active source and generated HTML contain no unintended `rentanything.es`
  public-origin references.
- New production builds fail if their configured canonical origin is invalid.
- Sitemap route count equals the approved manifest count and contains only the
  selected new primary host.
- Every indexable page has one self-canonical.
- Every localized pair has reciprocal, absolute new-domain hreflang values.
- JSON-LD validates and all public entity IDs use the new origin.
- Robots allows crawling and names the new sitemap.
- Titles remain within the established SEO limits and do not become repetitive
  brand-only titles.

### URL migration gates

- 100% of current indexable new-domain URLs return the expected `200`.
- 100% of corresponding old-domain URLs return a permanent redirect directly to
  the expected final new URL.
- No loops, host oscillation, redirect chains, soft `404`s, accidental homepage
  redirects, or old-domain canonicals.
- All current internal navigation and content links point directly to the new
  origin or use correct internal relative links.
- Both domains have valid certificates and the old domain is not blocked from
  Googlebot.

### Revenue and operations gates

- Customer can choose dates, receive availability, create a booking, pay, and
  land on the confirmation page.
- Stripe signature validates, payment is recorded once, duplicate delivery is
  idempotent, and a controlled refund produces the expected state/document.
- Inventory allocation, physical-unit assignment, operational checklist, booking
  stages, delivery/collection changes, and admin views retain current behavior.
- Confirmation, operational alert, review, amendment, cancellation, refund, and
  unsubscribe mail links use the new domain and complete successfully.
- Invoice/receipt/PDF generation uses the new brand for new documents and does
  not mutate historical records.
- Admin login and Supabase Auth redirects work on the new domain without an open
  redirect.

### Browser, device, and observability gates

- Chrome, Safari, Firefox, iOS Safari, and Android Chrome pass the critical
  customer journey.
- Consent state and GA4 events work, with no self-referral caused by host changes.
- Vercel, Supabase, Stripe, and Resend logs show expected success and no new
  sustained error class.
- Lighthouse/accessibility spot checks show no material regression from the
  baseline.

## 11. Old-domain policy

`rentanything.es` remains a migration asset and customer-safety mechanism.

- Renew the registration for at least one year after cutover; indefinite
  retention is strongly preferred.
- Keep apex and `www` DNS and TLS healthy so permanent redirects continue to
  function.
- Keep every equivalent URL redirected directly, including low-traffic pages.
- Do not publish a second copy of the site, park the domain, block it in robots,
  or add `noindex` before redirects are processed.
- Keep old-domain support addresses receiving mail via alias/forwarding for at
  least 12–24 months.
- Monitor old-host traffic and `404`s to identify missing mappings and stale
  customer links.
- Retain old GSC properties, analytics annotations, crawl baselines, and redirect
  tests for historical comparison.

## 12. SEO transfer and local-signal plan

The move can transfer existing signals, but temporary volatility is expected.
Google notes that a small or medium site may take several weeks to process a
move. Normal fluctuation alone is not a rollback trigger.

Moving from `.es` to `.com` removes a ccTLD-level Spain signal. Reinforce the
unchanged Valencia market through:

- reciprocal English/Spanish hreflang;
- Valencia and Spain in organization/local-business schema where accurate;
- unchanged local address, phone, EUR prices, delivery area, and Spanish content;
- consistent Google Business Profile name, URL, categories, service area, and
  contact details;
- Valencia-specific landing-page value rather than generic global copy;
- local citations and links from relevant Valencia partners/directories; and
- continued content clusters around local rental intent.

Search Console procedure:

1. Before launch, verify domain properties for both old and new domains under the
   same Google account.
2. Check manual actions, security issues, ownership, and active removals.
3. After launch validation, submit `https://rentandroll.com/sitemap.xml`.
4. Use Change of Address from the old property to the new property.
5. Keep old and new sitemap/URL manifests for comparative monitoring.
6. Inspect priority URLs and request indexing selectively; do not mass-submit
   every URL manually.

Analytics procedure:

- Keep the same GA4 property, stream, measurement ID, events, key events, and
  historical reports.
- Rename the stream and change its Website URL to the new primary host.
- Add a launch annotation in the operating dashboard/export.
- Compare old and new hostnames, organic landing pages, checkout conversion, and
  completed booking revenue throughout stabilization.

External updates should prioritize, in order: Google Business Profile, paid-ad
destinations, social profiles, high-value backlinks/referrals, directories and
partners, support documentation, and lower-value citations.

## 13. Monitoring schedule and thresholds

| Time | Required checks |
|---|---|
| Hour 0, 1, 4 | Critical URLs, checkout, Stripe webhook, email, auth, errors, analytics |
| Day 1 | Full redirect sample, sitemap fetch, GSC coverage signals, conversions, support issues |
| Day 3 | Old-host `404`s, new-host crawl errors, email reputation, webhook failures |
| Day 7 | Full manifest rerun, indexed/canonical samples, query/page trends, backlink updates |
| Day 14 | Index transfer, impressions/clicks, conversion rate, local listings consistency |
| Day 28 | Coverage and ranking trend review; unresolved old URLs; transitional-copy need |
| Day 60 | Long-tail migration review, remaining citations, old-host traffic, callback cleanup readiness |
| Day 90 | Consider removing temporary “formerly RentAnything.es” site copy |
| Day 180 | Revalidate all redirects, mail aliases, ownership, and old-domain renewal |
| Day 365 | Annual redirect/domain retention audit; do not remove redirects by default |

Track at minimum:

- old/new GSC impressions, clicks, average position, indexed pages, duplicate
  canonical reports, crawl errors, and sitemap status;
- organic sessions, landing pages, conversion rate, completed bookings, and
  revenue by hostname;
- redirect pass rate, old-host `404`s, new-host `4xx`/`5xx`, and latency;
- Stripe success/failure, webhook delivery/retry, duplicate events, and refunds;
- Resend send/delivery/bounce/complaint rates and link failures;
- Supabase auth/API errors and Vercel application errors; and
- customer contacts mentioning broken, unavailable, payment, email, or trust
  issues.

Escalation thresholds for launch:

- **Immediate incident:** any inability to quote/book/pay, webhook signature
  failure, duplicate charging/booking, broad auth failure, or customer-data risk.
- **Urgent fix:** more than 1% of manifest URLs fail, sitemap/robots is wrong,
  transactional mail is not delivered, or a major landing page is non-indexable.
- **Investigate:** material conversion decline against comparable traffic, rising
  old-host `404`s, or persistent canonical mismatch.
- **Expected observation:** early ranking/index-count variation without technical
  errors.

## 14. Rollback policy

### Before Change of Address submission

For a critical operational failure, disable old-domain redirects if necessary,
restore the recorded Vercel deployment and environment values, restore the prior
Stripe webhook and Supabase Auth settings, and point customer traffic back to the
old production host. Record every reversal.

### After Change of Address submission

Prefer fix-forward. Reversing the site move sends conflicting signals and can
extend search disruption. A true reversal is reserved for:

- payments or booking cannot be made safe in the incident window;
- an authentication, privacy, or security defect exposes customers; or
- the new domain cannot remain reliably served because of an infrastructure or
  ownership failure.

If a real post-submission reversal is required, restore old-host canonicals and
content, reverse redirects, restore connected-service URLs, cancel/reverse the
Search Console move where supported, and communicate the incident. Ordinary SEO
volatility is explicitly not grounds for rollback.

## 15. Ownership and governance

| Role | Responsibilities |
|---|---|
| Business owner | Fixed brand inputs, domain/registrar access, sender/contact choices, launch authorization, external-account access |
| Launch commander | Cutover checklist, freeze, timestamped decision log, go/no-go on technical gates, incident coordination |
| Engineering | Identity config, application changes, redirects, automated tests, build/deploy, Vercel, Supabase, Stripe, rollback |
| SEO owner | Baseline crawl, URL manifest, metadata validation, GSC ownership/Change of Address, index monitoring, priority backlink updates |
| Operations/finance | Controlled booking/refund, admin/fulfillment validation, invoice/receipt review, support monitoring |
| Brand/design | Production asset pack, visual QA, usage rules |
| Legal/privacy | Trading-name disclosures, policies, data-controller wording, email/legal stationery review |

One person may fill multiple roles, but each launch action needs one named owner.
The launch commander is the only person who enables old-domain redirects or
orders rollback during the window.

## 16. Workstream split

The migration stays on the existing platform:

| System | Decision | Reason |
|---|---|---|
| GitHub | Keep `RentAnythingES/MainSite` | Preserves repository history, branch protection, and the existing deployment integration |
| Vercel | Keep the existing production project | Preserves deployment history, environment variables, build settings, and rollback capability |
| Supabase | Keep the existing project and database | Avoids a risky data/auth/storage migration and preserves all bookings, inventory, RLS, and audit history |
| Stripe | Keep the existing account | Preserves products, payments, refunds, event history, and reconciliation |
| Resend | Keep the existing account | Add and verify a new sending subdomain while retaining old-domain mail during transition |
| GA4 | Keep the existing property and stream | Preserves the performance and conversion history |
| GSC | Keep the old property and add a new domain property | Both properties are required for Change of Address and transfer monitoring |

### Codex/engineering workstream

This work happens locally and in the repository before production account
settings are switched:

1. Create the central site-identity/origin configuration.
2. Rebuild the supplied brand sheet into production web assets.
3. Replace public branding, navigation/footer identity, icons, metadata, schema,
   email templates, documents, and English/Spanish copy.
4. Keep all page paths and application/database identifiers stable.
5. Replace hardcoded old-origin fallbacks and add production-origin validation.
6. Implement old-host and alternate-new-host redirects without chains.
7. Update sitemap, robots, canonicals, hreflang, Open Graph, and JSON-LD.
8. Update active documentation and `.env.example`.
9. Build the URL manifest and automated crawl/redirect checks.
10. Run the production build and locally test booking, admin, inventory,
    fulfillment, email-link, and document flows.
11. Prepare a single reviewable commit/release candidate for preview deployment.
12. Provide the owner with exact values and a timed console checklist for
    Vercel, Supabase, Stripe, Resend, GA4, and GSC.

Engineering must not change live DNS, production environment values, Stripe's
live webhook, Supabase's primary Site URL, or submit GSC Change of Address before
the release candidate passes.

### Business-owner workstream — do now

These tasks prepare external systems without moving public traffic:

#### 1. Confirm the existing Vercel project

- Open the Vercel project currently serving `rentanything.es`.
- Confirm its Git repository is `RentAnythingES/MainSite`.
- Record the Vercel team name, project name, production branch, and current
  production domains.
- Add `rentandroll.com` and `www.rentandroll.com` to **that same project**.
- If Vercel requests ownership verification, add only the supplied TXT record.
- Do not remove either old domain, enable old-domain redirects, or overwrite the
  parked apex/`www` records yet.
- Do not create a new Vercel project.

#### 2. Prepare Resend

- In the existing Resend account, add `rentandroll.com` as the sending domain.
- Publish the exact SPF and DKIM records supplied by Resend.
- Publish a DMARC record for the organizational domain, starting with a
  monitoring policy if needed.
- Wait until Resend reports the sending domain as `verified`.
- Decide the visible identities. Recommended starting set:
  - `Rent&Roll <bookings@rentandroll.com>` for transactional mail;
  - `hello@rentandroll.com` as reply-to/customer support;
  - `privacy@rentandroll.com` for privacy requests.
- Keep existing `rentanything.es` addresses and forwarding active.
- Do not replace the production sender until engineering has updated and tested
  the email templates.

Resend recommends a sending subdomain to isolate reputation, while the visible
reply-to can remain a clean root-domain mailbox.

#### 3. Prepare Search Console

- Add and verify a domain property for `rentandroll.com`, normally using the DNS
  TXT method.
- Ensure the same Google account is an owner of both `rentanything.es` and
  `rentandroll.com` properties.
- Record whether either property shows a manual action, security issue, or URL
  removal.
- Do not submit Change of Address or the new sitemap yet.

#### 4. Collect account and DNS information

- Record the domain registrar and active DNS provider.
- Export or screenshot all current DNS records before editing them.
- Confirm access to Vercel, Supabase, Stripe, Resend, GA4, GSC, Google Business
  Profile, the registrar, and both old/new email administration.
- Identify whether `rentandroll.com` uses nameservers at the registrar, a DNS
  provider, or Vercel. Do not change nameservers merely for this migration.

#### 5. Confirm implementation inputs

- Confirm the default primary origin `https://rentandroll.com`.
- Use the confirmed `Rent&Roll` display name and
  `Travel light. Rent what you need.` tagline.
- Choose the sender/reply-to/support/privacy addresses.
- Use the approved `docs/Rent&Roll.png` composite for the SVG/PNG production
  assets.
- Identify the current Google Business Profile owner.

### Business-owner workstream — wait for the release candidate

Do not perform these actions until engineering supplies the cutover checklist:

- change `rentandroll.com` apex or `www` website DNS to Vercel;
- redirect `rentanything.es`;
- change Vercel production `NEXT_PUBLIC_SITE_URL`;
- change Supabase's primary Site URL;
- remove old Supabase redirect URLs;
- replace Stripe's live webhook URL or signing secret;
- change the live Resend sender;
- change GA4's Website URL;
- rename/update the Google Business Profile;
- submit the new sitemap or GSC Change of Address; or
- cancel, transfer, park, or remove `rentanything.es`.

### Joint rehearsal and cutover

Once the local work is ready:

1. Engineering supplies a preview/release candidate and exact expected URLs.
2. The owner connects the new domain to the existing Vercel project and applies
   the provided environment/account settings.
3. Both sides test one complete controlled booking/payment/email/document flow.
4. Engineering runs the URL, metadata, redirect, and application suites.
5. The owner authorizes cutover after the evidence passes.
6. The owner changes live console/DNS settings while engineering validates each
   step and watches logs.
7. GSC Change of Address is submitted only after the production redirect suite
   passes.

## 17. Estimated delivery

These are focused-working-time estimates, not elapsed calendar guarantees.

| Work package | Estimate | Dependency |
|---|---:|---|
| Baseline, manifest, and configuration design | 1–2 days | Console access |
| Brand assets and UI application | 1–2 days | Vector/source approval |
| Metadata, schema, copy, email, and document updates | 1–2 days | Naming/contact inputs |
| Redirect implementation and automated crawl tests | 1 day | Primary host decision |
| Platform configuration and rehearsal | 0.5–1 day | DNS and all console access |
| Cutover and same-day verification | 0.5–1 day | All launch gates |
| Monitoring and external-link cleanup | Ongoing for 12 months | Successful cutover |

Expected engineering/SEO preparation is approximately **4–7 focused days**,
followed by DNS/mail propagation and the monitoring period. Work should be
delivered in reviewable batches and merged as one coordinated release to avoid
multiple partial production identities.

## 18. Project deliverables

1. Approved brand-name and host convention.
2. Production logo/icon/OG asset pack and usage notes.
3. Central site-identity configuration and fully rebranded application.
4. New-domain email identities and tested transactional templates.
5. Updated legal, finance, operations, analytics, and support surfaces.
6. Versioned old-to-new URL manifest.
7. Automated new-host crawl and old-host redirect audit.
8. Platform configuration record for Vercel, DNS, Supabase, Stripe, Resend,
   GA4, GSC, and Business Profile.
9. Signed launch checklist, evidence log, and rollback snapshot.
10. Updated repository documentation.
11. Day 1, 7, 14, 28, 60, 90, 180, and 365 monitoring records.

## 19. Remaining implementation inputs

The move itself is approved. These are configuration inputs required to execute
it, not strategic approval questions:

1. **Primary host:** approve `https://rentandroll.com` (recommended) or select
   `https://www.rentandroll.com`.
2. **Email identities:** choose the exact sender, reply-to, support, privacy, and
   operations addresses.
3. **Business Profile state:** identify the existing profile owner/access path,
   if a profile already exists.
4. **Cutover window and ownership:** choose a low-traffic operating window and
   name the launch commander and console owners.
5. **External-system readiness:** record access and current settings for Vercel,
   DNS/registrar, Resend, Stripe, Supabase, GA4, GSC, and Google Business Profile.

The display convention, descriptive alternate, tagline, and updated asset source
were confirmed on 7 August 2026. Items 1–5 above must be recorded before
production cutover.

## 20. Source guidance

- [Google: Site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google Search Console: Change of Address](https://support.google.com/webmasters/answer/9370220?hl=en)
- [Google: Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites?hl=en)
- [Vercel: Deploying and redirecting domains](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)
- [Vercel: Set up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain)
- [Supabase Auth: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Stripe: Webhooks](https://docs.stripe.com/webhooks)
- [Resend: Domains](https://resend.com/docs/dashboard/domains/introduction)
- [Google Analytics: Edit a web data stream](https://support.google.com/analytics/answer/9304776)
- [Google Business Profile: Edit your profile](https://support.google.com/business/answer/3039617?hl=en-en)
- [Google Business Profile naming guidelines](https://support.google.com/business/answer/3038177?hl=en-en)

## 21. Definition of done

The migration is complete when:

- customers can discover, book, pay, receive documents/email, and complete
  fulfillment on Rent&Roll without relying on the old host;
- every equivalent old URL permanently redirects in one hop to the correct new
  URL and remains monitored;
- all new pages emit aligned canonical, hreflang, sitemap, robots, Open Graph,
  and JSON-LD signals;
- GSC Change of Address is active and the new sitemap is processing;
- GA4 and operational systems show healthy events with no material conversion
  regression caused by migration defects;
- external priority profiles and links use the new brand/domain;
- rollback snapshots and launch evidence are retained; and
- the first 28-day review has no unresolved critical migration issue, while the
  redirect and monitoring obligations continue through at least day 365.
