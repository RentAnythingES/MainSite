# German content inventory and review conventions

Status: 2026-09-28, private implementation branch. Owner language/factual review pending.

## Voice and glossary

Use lowercase du, dir and dein. Be friendly, clear and reassuring; lead with
convenience and trust. Preserve brand/model names and every factual limit. Do not
invent delivery promises, included accessories, compatibility or safety claims.

| Context | German wording |
| --- | --- |
| Browse the catalogue | Alles zum Mieten |
| Generic catalogue items | Mietartikel or Produkte, according to the sentence |
| Mobility scooter | Elektromobil |
| Included items | Im Mietumfang enthalten |
| Restrictions and suitability heading | Gut zu wissen |
| Delivery and setup heading | Lieferung und Aufbau |
| Care heading | Pflege und Hygiene |

The first three terminology choices reflect owner agreement. The section headings
are draft copy awaiting review. Ausstattung may describe category-specific contents;
do not use it as the umbrella term for every rental product. Keep prices numeric,
format currency/dates by locale, and retain the city's operational timezone.

## Coverage by surface

| Surface | Current implementation | Remaining requirement |
| --- | --- | --- |
| UI dictionary | Typed German draft and private registry | Owner review and public shell integration |
| Selected booking journey | Private CYBEX Coya pilot, widget, checkout, return and cancellation | Owner review; broader product/city acceptance |
| Transaction output | Stored locale in confirmation/lifecycle/document emails, invoice/refund PDFs, review invitation/form | Owner review; free-form instructions and custom terms |
| Product authoring | Language registry editor, atomic copy/FAQ save, revisions, attributed review, stale detection, preview | Authorized real catalogue inventory and draft preparation |
| Product editorial cards | Shared EN/ES renderer, German labels in private preview | Review labels and finish full product template consolidation |
| Product/category/family/bundle pages | Existing public EN/ES routes; reader accepts managed published copy | Shared locale templates, strict complete German content, route metadata |
| Navigation, cookie/legal/help pages | German dictionary foundation | Full rendering and owner/legal copy review where applicable |
| Contact/signup, custom quotes, paid amendments | Outside completed pilot | Localized entry and messages, saved-language acceptance checks |
| Explore/editorial clusters | Existing public content | City/language content ownership, reviewed copy and internal links |
| Public German SEO | Private by design | Server document language, canonicals, alternates, sitemap and publication checks |

## Product review packet

For each active product, collect English display name, source description, editorial
sections, feature list, specifications, FAQs, primary image description, search title
and description, and source revision. Keep a clear missing-source list. Translate
only supported facts and retain units, model variants, size/weight limits and warnings.
Review every source feature/specification against the German draft. The editor's
structural checks cannot establish factual completeness.

Save drafts, have the owner review language and facts, then record that review on
the exact saved revision. Any later copy/source change requires another review.
Publication remains a separate gated action. Review does not enable German globally.

## Catalogue evidence boundary

No full production catalogue snapshot was created in this phase. Automatic approval
review rejected the proposed read/export because it includes unpublished content
and internal editorial state. The intended destination is the local workspace file
`agent-work/expansion-readiness-2026-09-27/goalpro/german-catalogue-source-snapshot.json`.
Approval is required before retrying that export. No customer records are needed.
Until it is authorized, active-product translation coverage remains unmeasured.

The fixture audit tests report logic only. Do not substitute its counts for live
coverage, or interpret completed engineering tests as owner copy approval.
