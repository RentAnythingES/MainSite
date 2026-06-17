# Agent Instructions — Voice Cluster

> [!CAUTION]
> **WORK IN SMALL CHUNKS.** Break all work into incremental steps that complete in under 60 seconds. Never attempt large one-shot generations. Report progress after each chunk. This applies to documentation, code changes, and research equally.

## Overview
This workspace contains the Echo voice technology ecosystem: desktop apps (EchoDeck, EchoRVC), web platform (voicechanger.live), and shared infrastructure.

---

## Documentation Map (MANDATORY)

> [!CAUTION]
> **Every document below has a purpose and a trigger.** Read the "When to read" column. If your task matches a trigger, you MUST read the doc BEFORE writing code or copy. Do NOT search for these — they are at fixed paths.

### Brand & Copy

| Document | Path | When to read |
|----------|------|-------------|
| **Brand Messaging Guide** | `Voice Changer Web/app/docs/brand_messaging_guide.md` | Before writing ANY user-facing English copy |

**Key brand rules (always apply):**
- **Never count presets/effects** in copy. ❌ "73+ voice effects" → ✅ "Hundreds of thousands of community voices"
- **Lead with openness**, not feature lists. Our moat = open RVC ecosystem + open effects creation.
- **Fun-first, non-technical** tone. Write for a 16-year-old gamer, not an audio engineer.
- **Core value props (rank order)**: Fun → Free → Open ecosystem → Works everywhere → Real-time → Easy → Privacy → Customizable

---

### SEO Strategy & Tracking

| Document | Path | When to update |
|----------|------|---------------|
| **SEO Strategy** | `docs/seo/SEO_STRATEGY.md` | After any page count change, cluster restructure, or audit |
| **SEO Roadmap** | `docs/seo/SEO_ROADMAP.md` | After completing any roadmap item or discovering new issues |
| **Blog Content Strategy** | `docs/seo/BLOG_CONTENT_STRATEGY.md` | Before writing or reviewing ANY blog post |
| **Competitor Reference** | `docs/seo/COMPETITOR_REFERENCE.md` | When performing fresh competitor crawls — ALL crawl data goes here |
| **Multilingual Keywords** | `docs/seo/MULTILINGUAL_KEYWORD_STRATEGY.md` | When adding/changing keyword targets per language |

---

### Analytics & Telemetry

| Document | Path | When to read/update |
|----------|------|---------------------|
| **Analytics Setup** | `docs/ANALYTICS_SETUP.md` | Before adding/changing any tracking event, dashboard, or analytics infrastructure |

Covers the **unified system** (website + desktop app): PostHog config, GA4, Supabase CRM, all event definitions with status, 5 core dashboard specs, and known bugs.

> [!CAUTION]
> **After any analytics change:**
> - [ ] Event added to the inventory table in `ANALYTICS_SETUP.md`
> - [ ] Dashboard section updated if the event powers a new insight
> - [ ] Verified event appears in PostHog with correct properties
> - [ ] Change logged in the Change Log at the bottom of the doc

### Localization (i18n)

#### Per-Locale Reference Docs

Every locale we actively translate **must** have its own translation reference document. This is the single source of truth for that language's term decisions, grammar rules, cultural adaptations, and review history.

| Locale | Document | Path | Status |
|--------|----------|------|--------|
| **DE** | DE Translation Reference | `docs/seo/DE_TRANSLATION_REFERENCE.md` | ✅ Active — 291 lines, production locale |
| **JA** | JA Translation Reference | `docs/seo/JA_TRANSLATION_REFERENCE.md` | ✅ Active — 585 lines, Voicemod JP crawled, VTuber/Babiniku culture |
| **KO** | KO Translation Reference | `docs/seo/KO_TRANSLATION_REFERENCE.md` | ✅ Active — 426 lines, production locale |
| **ES** | ES Translation Reference | `docs/seo/ES_TRANSLATION_REFERENCE.md` | 🟡 Ready — 366 lines, pending translation |
| **FR** | FR Translation Reference | `docs/seo/FR_TRANSLATION_REFERENCE.md` | 🟡 Ready — 448 lines, pending translation |
| **PT** | PT Translation Reference | `docs/seo/PT_TRANSLATION_REFERENCE.md` | 🟡 Ready — 434 lines, pending translation |
| **IT** | IT Translation Reference | `docs/seo/IT_TRANSLATION_REFERENCE.md` | 🟡 Ready — 389 lines, pending translation |
| **PL** | PL Translation Reference | `docs/seo/PL_TRANSLATION_REFERENCE.md` | 🟡 Ready — 353 lines, pending translation |
| **RU** | RU Translation Reference | `docs/seo/RU_TRANSLATION_REFERENCE.md` | 🟡 Ready — 447 lines, pending translation |
| **TR** | TR Translation Reference | `docs/seo/TR_TRANSLATION_REFERENCE.md` | 🟡 Ready — 387 lines, pending translation |
| **ZH-TW** | ZH Translation Reference (Taiwan) | `docs/seo/ZH_TRANSLATION_REFERENCE.md` | 🟡 Ready — 464 lines, Taiwan-specific |
| **ZH-CN** | ZH-CN Translation Reference (Mainland) | `docs/seo/ZH_CN_TRANSLATION_REFERENCE_MAINLAND.md` | 🟡 Ready — 431 lines, Mainland-specific |

> [!CAUTION]
> **Before writing or reviewing ANY translated copy**, you MUST read the reference doc for that locale. No exceptions.
> **After every translation round**, update the reference doc with new term decisions, reviewer corrections, and anti-patterns discovered.

#### Translation Reference Doc Template

When starting a new locale, create `docs/seo/{LOCALE}_TRANSLATION_REFERENCE.md` with these sections:

1. **Core Slogan Variants** — How "Sound Like Anyone" translates (with usage map)
2. **Product Naming** — Echo vs Echo Live rules for that locale
3. **Term Glossary** — What stays English (loanwords) vs what gets translated
4. **Grammar & Syntax Traps** — Preposition rules, compound noun rules, etc.
5. **Platform UI Strings** — Exact translations from Discord/Steam/game clients in that locale
6. **Word Choice Precision** — Corrections from native reviews (wrong ≠ right pairs)
7. **Tone & Register** — Target audience, formality level, cultural notes
8. **Anti-Patterns** — Things that sound right but are wrong
9. **Factual Platform Knowledge** — Game-specific claims to verify
10. **SEO Constraints** — Title/meta rules, keyword targets from `MULTILINGUAL_KEYWORD_STRATEGY.md`

#### Translation Workflow

##### Phase 1: Build the Reference Doc (before any translation begins)

The reference doc must be built FIRST with real research — not filled in retroactively.

```
1. USE DE_TRANSLATION_REFERENCE.md as the structural model
   (copy its section structure — it represents our most mature locale)

2. RESEARCH competitors and similar products in the target locale:
   - How do Voicemod, Clownfish, MorphVOX localize for this market?
   - What terms do Discord/Steam/Valorant/CS2 use in their localized clients?
   - What gaming slang/loanwords does this market use? (e.g., JP "ボイチェン", KO "보이스체인저")
   - What SEO keywords are people actually searching? (check MULTILINGUAL_KEYWORD_STRATEGY.md)

3. POPULATE all 10 sections with research findings
   - Term glossary based on real market usage, not dictionary translations
   - Platform UI strings verified against actual game/app clients
   - Tone calibrated to the local gaming community culture

4. SAVE to docs/seo/{LOCALE}_TRANSLATION_REFERENCE.md
5. UPDATE the locale status table in AGENTS.md
```

##### Phase 2: Per-Page Translation Cycle

For each page being translated:

```
1. READ the locale's Translation Reference doc (mandatory — no exceptions)
2. READ the Brand Messaging Guide (EN tone/voice baseline)
3. TRANSLATE the page content → save to src/content/locales/{locale}/*.json
4. CREATE a per-page audit doc → save to docs/seo/audits/{locale}/{page-slug}.md
   - Document all translation decisions and rationale
   - Flag any terms where you're unsure of the best choice
5. PASS the audit doc to a 3rd-party native reviewer for feedback
   - Reviewer marks corrections by severity (🚨 Must Fix / ⚠️ Polish / 💡 Suggestion)
6. APPLY reviewer corrections to the translation
7. UPDATE the Translation Reference doc with new term decisions from the review
   - This is how the reference doc improves with every page
8. VERIFY build passes (npx next build — zero MISSING_MESSAGE errors)
9. VERIFY Vercel deploy is green before GSC submission
```

> [!CAUTION]
> **The reference doc is a living document.** Every translation round should make it better. If a 3rd-party reviewer corrects a term, that correction goes into the reference doc immediately — so the same mistake is never repeated on the next page.

#### Per-Page Audit Docs

Every translated page gets a review audit doc at `docs/seo/audits/{locale}/{page-slug}.md`. These track the review lifecycle for each page.

**Audit doc template:**

```markdown
# {Page Name} — {LOCALE} Translation Audit

> **Status**: 🔲 Draft | 🟡 Under Review | ✅ Approved
> **Translator**: [agent/human]
> **Reviewer**: [native speaker name/role]
> **Last reviewed**: YYYY-MM-DD

## Translation Decisions
Key term choices made for this page and rationale.

## Reviewer Feedback
Native speaker corrections, organized by severity:
- 🚨 Must Fix — grammar errors, wrong terms, cultural issues
- ⚠️ Polish — awkward phrasing, register mismatch
- 💡 Suggestion — alternative phrasings, optional improvements

## Applied Fixes
Log of corrections applied (date + what changed).

## Reference Doc Updates
Term decisions from this page that were added to the locale's Translation Reference.
```

**Document dependency chain:**
```
Brand Messaging Guide (EN tone/voice)
  └─► {LOCALE} Translation Reference (glossary, grammar, platform UI, SEO)
        ├─► Multilingual Keywords (SEO keyword targets per language)
        └─► audits/{locale}/{page}.md (per-page review tracking)
```

> [!IMPORTANT]
> **Localization Change Checklist** — after any i18n code or content change:
> - [ ] Content override JSON updated in `src/content/locales/{locale}/`
> - [ ] `index_pages.json` exists with ALL 7 keys: `hub_index`, `apps_index`, `tools_index`, `use_index`, `voices_index`, `compare_index`, `blog_index`
> - [ ] Machine-key fields NOT translated: `slug`, `category`, `tags`, `relatedTools`, `date` (verify with validation script in LOCALIZATION_GUIDE.md)
> - [ ] Translation keys added to ALL locale message files (`src/messages/*.json`)
> - [ ] `hreflang` alternates present in both sitemap AND page `<head>` metadata
> - [ ] Locale's Translation Reference updated if new terms/decisions were made
> - [ ] Per-page audit doc created/updated in `docs/seo/audits/{locale}/`
> - [ ] `npx next build` passes with zero `MISSING_MESSAGE` errors
> - [ ] Spot-check `/de/hub`, `/de/tools`, `/de/use` — verify index headings are NOT English and articles are NOT empty
> - [ ] Vercel deployment confirmed green before any GSC submission

---

### Research Persistence Rule (MANDATORY)

> [!CAUTION]
> **NEVER discard research.** If you crawl a competitor page, analyze content structure, or gather any SEO data, you MUST save it to the appropriate doc in `docs/seo/` BEFORE moving on. Conversation artifacts are ephemeral — project docs are permanent. If you do research and don't persist it, you've wasted everyone's time.

### SEO Change Checklist

After any SEO-related code change, verify:

- [ ] **Sitemap**: `src/app/sitemap.ts` includes all new routes (uses dynamic imports)
- [ ] **Titles**: All title tags ≤60 characters, using `| Echo` suffix
- [ ] **Canonicals**: `alternates.canonical` set in `generateMetadata()`
- [ ] **Hreflang**: `buildHreflangAlternates()` applied in page metadata + sitemap alternates
- [ ] **FAQs**: First 2 FAQs rendered as open prose (not accordions)
- [ ] **Cross-cluster links**: Every page links to ≥2 other clusters
- [ ] **Structured data**: `FAQSchema` on pages with FAQs, `SoftwareSchema` on homepage/download
- [ ] **SEO Strategy doc**: Updated with new page counts and status changes
- [ ] **SEO Roadmap**: Marked completed items, added newly discovered issues

---

## Content Architecture

### Data-Driven Pages
All page content lives in `src/content/*.ts`. Templates in `src/app/*/[slug]/page.tsx` render from this data.

| Content File | Template | Count |
|-------------|----------|-------|
| `tools.ts` | `tools/[tool]/page.tsx` | 13 tools |
| `voices.ts` | `voices/[voice]/page.tsx` | 72 voices |
| `platforms/*.ts` | `apps/[platform]/page.tsx` | 27 platforms |
| `usecases.ts` | `use/[usecase]/page.tsx` | 6 use cases |
| `hub.ts` | `hub/[article]/page.tsx` | 9 articles |
| `comparisons.ts` | `compare/[competitor]/page.tsx` | 5 comparisons |
| `blog.ts` | `blog/[slug]/page.tsx` | 31 posts (19 live, 12 scheduled) |

### Adding New Content
1. Add the data entry to the appropriate `src/content/*.ts` file
2. The template auto-renders it (no new page file needed)
3. The sitemap auto-includes it (dynamic imports from content files)
4. Include required fields: `useCases`, `seoSections`, `relatedTools` (for tools)
5. Update `docs/seo/SEO_STRATEGY.md` with new counts

### Required SEO Fields (ToolPage interface)
Every tool entry **must** have:
- `useCases`: 3-6 cards with icon, title, description
- `seoSections`: 1-3 editorial H2 blocks with heading + body
- `relatedTools`: Array of 4-5 related tool slugs
- `keywords`: Array of target keywords
- `title`: ≤60 characters, ending with `| Echo`

---

## Design System

- Dark theme: `#0A0E1A` background
- Card styling: `card-float` class with `rounded-[var(--theme-radius)]`
- Font: Inter (via Google Fonts)
- Accent: Theme-aware via CSS custom properties

---

## CI/CD — MANDATORY RULES

> [!CAUTION]
> **GitHub Actions costs real money.** Every push to a repo with CI triggers a build that takes ~40 minutes. You MUST follow these rules:

### Release & QA Documentation

| Document | Path | When to read |
|----------|------|-------------|
| **Release Process** | `Okada Fork/rvc-voice-changer/docs/RELEASE_PROCESS.md` | **Before ANY push, tag, or release** to the EchoRVC repo |

> [!CAUTION]
> **Before pushing to EchoRVC**, you MUST read and follow the Release Process doc. It contains the local verification checklist (`tsc`, `npm run build`, `cargo fmt`, `clippy`, `cargo test`), correct push commands, and tag hygiene rules. Skipping this has historically wasted ~60 min of CI time per incident.

1. **NEVER push incremental commits.** Batch ALL related fixes into a SINGLE commit and push ONCE. If you have 3 fixes, they go in ONE push — not 3 separate pushes that trigger 3 separate 40-minute builds.
2. **ASK before pushing** to any repo with CI/CD pipelines. Say exactly what you're about to push and wait for explicit approval.
3. **Cancel stale runs** before pushing new commits. If an old build is still running and you're about to push a fix that supersedes it, cancel the old run first.
4. **Verify locally** everything you can before pushing. Don't use CI as a trial-and-error debugging tool. At minimum: `npx tsc --noEmit`, `npm run build`, `cargo fmt --all -- --check`, `cargo clippy`, `cargo test`.
5. **Never push without a plan.** Know exactly what you're building (APK vs AAB, debug vs release, version numbers) BEFORE writing any code.
6. **Never use `--tags` flag.** Push only the specific tag: `git push origin main v1.0.9`. Using `--tags` pushes stale tags and triggers ghost builds.

---

## Build & Deploy

```bash
cd "Voice Changer Web/app"
npm run dev          # Local development
npx next build       # Production build (verify before commit)
git push origin main # Auto-deploys to Vercel
```

Always run `npx next build` before pushing to verify no build errors.
