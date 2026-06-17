# VoiceChanger.Live — SEO Roadmap
> **Last updated**: 2026-06-16 · Prioritized by estimated traffic impact × effort

This roadmap tracks all remaining SEO improvements, prioritized by ROI. Items are organized into tiers by impact.

---

## ✅ Completed (Phases 1-3)

These items have been fully implemented and deployed:

- [x] Dynamic sitemap via content file imports
- [x] Title tags ≤60 chars on all 13 tools
- [x] Canonical tags on all pages
- [x] Favicon: branded red recording dot
- [x] SoftwareApplication JSON-LD on homepage + download
- [x] FAQ Schema on all FAQ pages
- [x] Open FAQ prose (first 2-3 visible) on ALL page templates (tools, voices, use cases, apps, comparisons)
- [x] Cross-cluster links on ALL page templates
- [x] SEO content (useCases, seoSections, relatedTools) on all 13 tool pages
- [x] Voice page expansion (open FAQs, cross-cluster links)
- [x] `/voices/girl` landing page (12K+ vol keyword)
- [x] `/use/pc` landing page (25K+ vol keyword)
- [x] Blog: 2 high-priority posts published
- [x] Blog content calendar created
- [x] Google Search Console: domain verified, sitemap submitted (early May 2026)
- [x] RVC Model Converter: `/tools/model-converter` — live, functional browser-based PTH→ONNX conversion (2026-05-20)
- [x] Tool icons: 14 generated PNGs via MBB chroma-key pipeline, replacing emoji fallbacks (2026-05-20)

### Phase 4: Authority Hardening (Done — 2026-05-30/31)
- [x] **Cannibalization kill**: 301 redirects `/free-voice-changer` + `/real-time-voice-changer` → `/ai-voice-changer`
- [x] **Authority page**: `/ai-voice-changer` rewritten to ~1,200w with editorial prose, FAQs, platform grid
- [x] **Killed pages removed from sitemap**: `sitemap.ts` updated
- [x] **"Free during beta" purged**: 40+ files sitewide (platforms, voices, use cases, comparisons, feature pages)
- [x] **"73+" legacy branding purged**: layout.tsx, comparisons.ts, content files
- [x] **DSP/RVC jargon removed**: user-facing platform pages, feature pages, en.json
- [x] **Homepage enrichment**: Copy expanded to ~360w, hero updated ("Alpha is Live" → "Free Voice Changer")
- [x] **Dead link sweep**: FeatureSection (`/real-time-voice-changer`), Footer (`/free-voice-changer`), SeoText auto-linker (3 rules), roblox.ts, gta-online.ts
- [x] **Footer navigation**: Replaced duplicate link with `/voice-cloning`
- [x] **Competitor crawl**: Fresh analysis of Voicemod + Voice.ai homepage vs product page strategy
- [x] **AGENTS.md**: Fixed SEO doc paths to point to correct workspace-root location
- [x] **SEO docs updated**: SEO_STRATEGY.md + SEO_ROADMAP.md reflect all changes
- [x] **Build fix**: TypeScript errors in ModelConverter.tsx (type mismatch + BlobPart)
- [x] **Merge conflict**: Resolved iOS voice CTA + beta purge conflict in voices/[voice]/page.tsx

---

## 🔴 Tier 1 — High Impact, Low-Medium Effort

These items have the highest ROI and should be tackled first.

### 1.1 Add more platform internal links to `/ai-voice-changer`
**Impact**: 🔴 High · **Effort**: 15 min · **Status**: Open

Voice.ai's product page has 20+ platform internal links. Ours has ~8. Adding more platform links to the product page grid directly boosts link equity across our biggest cluster.

---

### 1.2 Audit platform page content depth
**Impact**: 🔴 High · **Effort**: 1-2 hours · **Status**: Open

Voice.ai's Discord page is ~1,800w. Our platform pages are template-driven — actual word count unknown. Audit the top 5 (Discord, Roblox, Fortnite, Valorant, CS2) and enrich if thin.

---

### 1.5 🟡 Target "okada voice changer" keyword — PARTIALLY DONE
**Impact**: 🔴 High · **Effort**: 2-3 hours · **Keyword**: "okada voice changer" — branded competitor term

**Status**: `/compare/vs-okada` page exists and has been corrected (May 28):
- Removed false "built-in virtual mic" claims
- Added "Model Architectures" row (RVC-only vs RVC+Beatrice+so-vits)
- Updated positioning to "scope vs polish" framing
- Rewrote hero subtitle and FAQ answers
- **Still noindex** — needs full comparison cluster audit before enabling

**Remaining**: Review the other 4 comparison pages for similar factual issues, then enable indexing on all 5.

**File**: `src/content/comparisons.ts`

---

### 1.2 Add more hub articles (3 new)
**Impact**: 🔴 High · **Effort**: 2-3 hours · **Keyword volume**: 10K+ combined

Hub articles are cross-linked from every tool and voice page, making them the highest-authority pages on the site. Adding 3 more articles directly strengthens the link equity of the entire site.

**Proposed articles**: ✅ ALL 3 ADDED (2026-05-19), **ALL UPGRADED TO AAA+ (2026-05-28)**
| Slug | Target Keyword | Est. Volume | Status |
|------|---------------|-------------|--------|
| `how-to-train-rvc-model` | how to train rvc model | 3K+ | ✅ AAA+ (UVR5 pipeline, f0 methods, VRAM scaling, troubleshooting) |
| `dsp-effects-explained` | voice changer effects guide | 2K+ | ✅ Done (A- quality, adequate) |
| `voice-changer-for-roleplay` | voice changer for roleplay | 5K+ | ✅ Done (B+ quality, niche) |

**Also upgraded (May 28)**:
| Slug | Change | New Grade |
|------|--------|-----------|
| `what-is-rvc` | Rewritten with 4-stage pipeline, model formats, community tools | AAA+ |
| `voice-model-guide` | Rewritten with file types, sourcing, evaluation, troubleshooting | AAA+ |
| `best-voice-changers` | Added Voice.ai, Vonovox, corrected w-okada, expanded FAQs | A+ |
| `how-voice-changers-work` | Added audio routing, pipeline, latency, GPU sections | A |

---

### 1.3 ✅ Publish 3 more blog posts — DONE
**Impact**: 🟠 High · **Effort**: 2 hours · **Completed**: 2026-05-19

Blog expanded 7→10:
- `voice-changer-for-vtubers` (VTuber setup guide)
- `how-to-train-rvc-model` (RVC training tutorial)
- `best-karaoke-apps-2026` (karaoke apps + vocal remover)

---

### 1.4 ✅ Boost internal link density on voice pages — DONE
**Impact**: 🟠 High · **Effort**: 1 hour · **Completed**: 2026-05-19

Voice pages (72 pages) expanded from 3→6 cross-cluster links. Added:
- `/use/gaming` (Voice Changer for Gaming)
- `/hub/voice-model-guide` (Voice Model Guide)
- `/tools/pitch-detector` (Pitch Detector)

**File**: `src/app/voices/[voice]/page.tsx` — expand cross-cluster links section

---

## 🟠 Tier 2 — Medium Impact, Medium Effort

### 2.1 ✅ Product feature pages — DONE
**Impact**: 🟠 Medium-High · **Completed**: 2026-05-19

| Page | Target Keyword | Status |
|------|---------------|--------|
| `/voicelab` | voice lab, voice creator | ✅ Live |
| `/soundboard` | soundboard app | ✅ Live |
| `/voice-cloning` | voice cloning | ✅ Live |

All pages include: canonical, FAQ schema, open FAQ prose (first 2), cross-cluster links, sitemap entry.

---

### 2.2 ⚠️ Audio demo section on vocal-remover — BLOCKED on assets
**Impact**: 🟡 Medium · **Effort**: 2 hours · **Status**: BLOCKED — needs raw audio files

Embed before/after audio samples on `/tools/vocal-remover` and `/tools/stem-splitter`. Requires demo audio files (original song + isolated vocals) to be recorded/sourced and placed in `public/demos/`.

**Next step**: Record or source 2-3 short demo clips (10-15 seconds each), then add `<audio>` embeds to the tool template.

---

### 2.3 ✅ Expand category hub pages with editorial prose — DONE
**Impact**: 🟡 Medium · **Effort**: 2 hours · **Completed**: 2026-05-20

All 6 voice category pages (`/voices/anime`, `/voices/scary`, `/voices/celebrity`, `/voices/gaming`, `/voices/girl`, `/voices/rvc-community`) now have:
- 2 editorial H2 prose sections with keyword-rich content
- First 2 FAQs rendered as open prose (not hidden in accordions)
- Cross-cluster links section (3 cards linking to related clusters)

---

### 2.4 ✅ Google Search Console verification — DONE
**Impact**: 🟡 Medium · **Effort**: 15 min · **Completed**: early May 2026

Domain verified in GSC, sitemap.xml submitted. Monitor crawl errors and indexing status periodically.

---

## 🟡 Tier 3 — Medium Impact, Higher Effort

### 3.1 Sound library cluster (NEW cluster)
**Impact**: 🟡 Medium · **Effort**: 1-2 weeks

DubbingAI generates massive page counts with sound effect pages (Minecraft sounds, Vine boom, Bruh sound, etc.). Each meme sound = an indexed page targeting a long-tail keyword.

**Architecture**:
```
/sounds/                    Hub
/sounds/memes               Category
/sounds/anime               Category
/sounds/games               Category
/sounds/[sound-slug]        Individual (50-200 pages)
```

This is a significant content investment but has very high long-tail potential.

---

### 3.2 ✅ i18n — Full-Site Localization Framework — DONE
**Impact**: 🔴 Critical · **Status**: ✅ Complete — 12 locales live

**Architecture**: next-intl + Locale Override Layer — base English in `.ts` + per-locale JSON overrides deep-merged at runtime. Untranslated locale URLs redirect to English canonical.

**Live locales** (12): DE, JA, KO, ES, FR, PT, PL, RU, IT, TR, ZH (Taiwan), ZH-CN (Mainland)

#### Completed Infrastructure
- [x] `src/content/localize.ts` — deep-merge utility with English fallback
- [x] All 7 content clusters use locale-aware `getLocalizedContent()`
- [x] `generateStaticParams()` generates locale × slug for all translated pages (all 7 clusters)
- [x] `generateMetadata()` emits hreflang `languages` alternates on all 7 clusters
- [x] Self-canonical per locale page (DE canonical → DE URL)
- [x] `x-default` pointing to English canonical on all pages
- [x] Redirect guard: untranslated locale URLs redirect to English canonical (all 7 clusters)
- [x] `sitemap.ts` uses `translatedAlternates()` — only emits hreflang for pages with actual translations
- [x] Sitemap emits standalone `<url>` entries for every translated page
- [x] IndexNow API submits all localized URLs alongside English
- [x] `next-intl` message files for all 12 locales (`src/messages/*.json`)
- [x] Per-locale translation reference docs (`docs/seo/*_TRANSLATION_REFERENCE.md`)

#### Content Coverage
| Locale | Content files | Status |
|--------|:------------:|--------|
| DE | 13 | Production |
| KO | 25 | Production |
| JA | 12 | Production |
| ES, FR, PT, PL, RU, IT, TR | 10 each | Production |
| ZH, ZH-CN | 2 each | Partial (index pages) |

### 3.3 Add 5 more blog posts (ongoing cadence)
**Impact**: 🟡 Medium · **Effort**: Ongoing (2/month)

Maintain blog cadence of 2 posts per month. Remaining from calendar:
- AI voice changer vs Voicemod
- Voice changer safety/legal guide
- Additional tutorials and comparison content

---

## 🟢 Tier 4 — Lower Priority / Future

### 4.1 Comparison pages — keep noindex for now
**Impact**: 🟢 Low · **Effort**: 2-3 hours · **Status**: PARKED

We're not an established product. Nobody is searching "Echo alternative". The listicle approach (`/hub/best-voice-changers`) is more effective for now. Exception: `/compare/vs-okada` has niche value for the RVC community. Leave all 5 pages at noindex until we have real brand search volume.

### 4.2 Ethics page
**Impact**: 🟢 Low · **Effort**: 30 min

Voice.ai has an `/ethics` page. Good for trust signals and E-E-A-T.

### 4.3 Affiliate program page
**Impact**: 🟢 Low · **Effort**: 30 min

Both Voice.ai and DubbingAI have affiliate pages. Creates backlink opportunities.

### 4.4 TTS language subpages
**Impact**: 🟢 Low · **Effort**: 2-3 hours

Voice.ai has 15+ language-specific TTS pages. Only relevant if our TTS tool supports multiple languages.

### 4.5 Developer API / SDK page
**Impact**: 🟢 Low · **Effort**: N/A until API exists

Voice.ai has `/api` and `/docs`. Only relevant when we have a developer offering.

---

## Priority Execution Order

For the next work session, tackle items in this order:

1. **1.1** — Add more platform internal links to `/ai-voice-changer` (15 min)
2. **1.2** — Audit platform page content depth vs Voice.ai's 1,800w Discord page
3. **NEW** — Fix "Echo" vs "Echo Live" naming inconsistency across all blog posts
4. **2.2** — Audio demos (blocked on assets)
5. **3.3** — Blog cadence (ongoing)
6. **3.1** — Sound library cluster (large effort)

---

## Metrics to Track

| Metric | Current (June 2026) | Target (90 days) |
|--------|---------|------------------|
| Total indexed pages | ~2,500+ (13 locales) | Maintain + grow |
| Blog posts | 31 (19 live, 12 scheduled) | 35+ |
| Hub articles | 9 | 12+ |
| Product feature pages | 3 | ✅ 3 (target met) |
| Tools | 14 | 14 |
| Voices | 84 | 84 |
| Platforms | 31 | 31 |
| Use cases | 6 | 6 |
| Comparisons | 5 (1 indexed) | 5 (all indexed) |
| Languages with real content | 12 | ✅ 12 (target far exceeded) |
| Avg internal links/page | 8-12 | 12+ |
| Homepage word count | ~360w | ~400w |
| Product page word count | ~1,200w | ~1,500w |

---

## i18n Maintenance Checklist

> [!CAUTION]
> **Run this checklist after EVERY content change that touches translatable fields.**

### When Adding a New English Page
- [ ] Page works at `/new-page` (English, no locale prefix)
- [ ] `/de/new-page` 302 redirects to `/new-page` (no German translation yet)
- [ ] Sitemap does NOT include `/de/new-page` alternate
- [ ] No hreflang tags emitted for untranslated locales

### When Adding a Translation
- [ ] Override JSON created at `src/content/locales/{lang}/{cluster}.json`
- [ ] `generateStaticParams()` now generates this locale × slug combo
- [ ] Sitemap includes hreflang alternate for this page
- [ ] HTML `<head>` has self-referencing hreflang for the new locale
- [ ] HTML `<head>` has bidirectional hreflang (EN→new + new→EN)
- [ ] `x-default` points to English canonical
- [ ] New locale page has self-canonical (not pointing to EN)
- [ ] Title ≤60 chars, description 130-155 chars
- [ ] Keywords are locale-specific (from `MULTILINGUAL_KEYWORD_STRATEGY.md`), not translated EN keywords
- [ ] Internal links on the page use locale prefix where target page is translated
- [ ] `npx next build` passes

### When Updating English Content
- [ ] Check if the changed page has translations in `src/content/locales/*/`
- [ ] If yes: update the translations to match (or flag for re-translation)
- [ ] If structural fields changed (new FAQ added, section removed): verify override JSON still merges correctly

### Quarterly Audit
- [ ] Google Search Console: check International Targeting report for hreflang errors
- [ ] Verify no "No return tags" warnings in GSC
- [ ] Spot-check 3 translated pages render correctly
- [ ] Verify untranslated locale URLs still redirect (not serving English under locale prefix)
- [ ] Review `MULTILINGUAL_KEYWORD_STRATEGY.md` for new keyword opportunities
