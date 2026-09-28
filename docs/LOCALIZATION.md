# Localization

## Code languages and public languages

`src/i18n/config.ts` owns the language registry. `Locale` includes draft dictionaries; `PublicLocale` includes only languages currently enabled by the registry. A dictionary existing in source does not publish routes or authorize booking in that language. Market language validation is an additional boundary.

English and Spanish remain public. German is a draft using informal du, pending owner review. No `/de` page or German checkout has been released. The registry must not be enabled for German until the remaining route, storage, transaction and content-readiness work is complete.

`getDictionary` requires an explicit supported language and throws for unknown runtime input instead of silently returning English. Every dictionary conforms to the same TypeScript shape. `test:localization` verifies German leaf-key coverage and nonempty strings; this is not linguistic or factual approval.

## Existing route compatibility

`localeFromPathname` recognizes complete prefix segments, so `/es/product/...` is Spanish but `/estate` is not. Header, Footer and proxy use this resolver.

`publicLocaleHref` owns the current EN/ES switch behavior and translated exceptions for partners and host services. It accepts local pathnames only and rejects unpublished target languages. The existing fallback to the Spanish homepage for untranslated English pages is retained. This compatibility list is not yet the publication/readiness registry for future languages or cities.

`productPageMetadata` shares the EN/ES product metadata logic while retaining their current canonical/indexability behavior. Product rendering layouts are still separate; their present styling and editorial differences were intentionally preserved in the first slice.

## Remaining German rollout

- Shared product rendering and the other customer page templates.
- Server-rendered document language without making the whole static site dynamic; the existing document-language script remains for now.
- Locale-reference and market-language/content publication storage, additive database constraints, admin translation editing and revision tracking.
- German localized product copy and the complete draft/payment/confirmation/support journey.
- Reviewed route publication, German metadata/sitemap/alternates and complete rollout checks.

The initial dictionary avoids copying unverified free-delivery or German-support promises. Product and transactional translations need separate review batches. Keep prices, stock, city and the booking timezone independent from display language.

## Verification

Run `npm run test:localization`, the existing market/booking regression tests, touched-file ESLint and `npx next build`. Run the PGlite database tests separately from a large build on machines with limited available memory. No production credentials are required for these tests.
