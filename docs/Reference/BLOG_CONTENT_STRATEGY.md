# Blog Content Strategy & Creation Guide

> **Last updated**: 2026-06-04
> **Applies to**: All blog posts at `/blog/[slug]` — powered by `src/content/blog.ts`

This document defines quality standards, structural patterns, and guardrails for blog content on voicechanger.live. Every post that ships must meet these standards.

---

## 1. How Publishing Works

Blog posts auto-publish based on their `date` field — no manual flag needed.

```typescript
// src/content/blog.ts — the publishing gate
function isPublished(post: BlogPost): boolean {
  return new Date(post.date) <= new Date(); // live if date is today or past
}
```

**Setting a date = committing to publish.** If a post isn't ready, push its date forward. Posts with future dates are built but return 404 to visitors and are excluded from the sitemap.

**Publishing cadence**: ~2 posts per week, staggered across the calendar. Check the existing date schedule before assigning new dates to avoid clustering.

---

## 2. Post Objective (Define Before Writing)

Every blog post must have a documented objective before any content is written. The objective drives every downstream decision — title, archetype, H1, internal linking, and keyword targeting.

### Required objective fields

Before writing a post, define:

| Field | Question it answers | Example |
|-------|-------------------|---------|
| **Primary keyword** | What search query are we trying to rank for? | "best free voice changers 2026" |
| **Keyword cluster** | Which site cluster does this support? | Comparison/listicle cluster → `/hub/best-voice-changers` |
| **Search intent** | Is the searcher comparing, learning, or doing? | Comparison intent (evaluating options) |
| **Strategic aim** | Why does this post exist for our business? | Capture top-funnel comparison traffic, position Echo as #1 |
| **Content archetype** | Which template fits? (§4) | Ranking/Listicle with credibility-first pattern |

### How the objective cascades

```
Primary keyword → informs title, H1, meta description
Search intent   → determines archetype (tutorial vs listicle vs explainer)
Keyword cluster → determines internal linking targets
Strategic aim   → determines CTA placement and self-promotion level
```

### Cannibalization check (MANDATORY)

Before creating a new post, verify that no existing page already targets the same primary keyword:

1. Search `src/content/blog.ts` for the keyword in existing `keywords[]` arrays
2. Search `src/content/hub.ts`, `tools.ts`, `voices.ts`, `platforms/*.ts` for overlap
3. If overlap exists: either merge content into the existing page, or differentiate the keyword target

**Example of bad overlap**: Hub article `what-is-rvc` + blog post `what-is-rvc-voice-conversion` — if both target "what is RVC," they cannibalize each other. The blog must target a distinct angle (e.g., "RVC vs pitch shifting explained" or "RVC voice conversion for beginners").

---

## 3. Pre-Writing Research (Before Any Content)

Never write a blog post based on assumptions. Every post must be informed by actual SERP research.

### Research checklist

Before writing, complete all of these:

- [ ] **SERP analysis** — Web search the primary keyword. Document:
  - What type of content ranks on page 1? (listicle, tutorial, video, product page?)
  - What word count do top results have?
  - What H2 structure do they use?
  - Which domains rank? (Reddit, competitor blogs, media outlets?)
  
- [ ] **Competitor content audit** — Check how Voicemod, Voice.ai, and other competitors cover this topic:
  - Do they have a page for this keyword?
  - What angle do they take?
  - What claims do they make that we can counter or verify?
  - What do they miss that we can cover?

- [ ] **People Also Ask** — Capture the PAA questions from Google for this keyword. These directly inform FAQ content and section headings.

- [ ] **Content gap identification** — What do the top results NOT cover that we can? This is where we add unique value.

- [ ] **Framing decision** — Based on the SERP, decide:
  - Are we entering a crowded SERP (need a differentiated angle)?
  - Is this a low-competition keyword (standard coverage works)?
  - Should we match the dominant format (listicle) or break it (deep tutorial)?

### Persist the research

> [!CAUTION]
> All pre-writing research must be saved — either as comments in the blog post entry in `blog.ts` or in a scratch doc. Do NOT discard SERP findings after writing. They're needed for content refreshes.

---

## 4. Content Archetypes

Every blog post fits one of four archetypes. Each has a distinct structure and purpose.

### 4.1 Ranking / Listicle (`category: 'guide'`)

**Purpose**: Capture high-volume comparison keywords ("best voice changer 2026", "best free voice changers").

**Structure — The Credibility-First Pattern**:

1. **Open with evaluation criteria** — Before ranking anything, explain what makes a tool good or bad. This establishes you as a knowledgeable evaluator, not a shill. Example: "What makes a voice changer actually good?" section in `best-free-voice-changers-2026`.
2. **Rank honestly** — Echo can be #1, but the reasoning must be specific and defensible. Never claim features Echo doesn't have.
3. **Give competitors genuine credit** — Each competitor entry should explain what they're genuinely good at, not just set up Echo as the alternative.
4. **Close with a recommendation matrix** — "If you want X, use Y. If you want Z, use W." This respects that different users have different needs.

**Example (gold standard)**: `best-free-voice-changers-2026` — opens with criteria, ranks 5 products with honest pros/cons, closes with use-case-based recommendations.

**Anti-pattern**: "Here are 5 voice changers. The first 4 suck. Use Echo." This is transparent and damages trust.

### 4.2 Tutorial (`category: 'tutorial'`)

**Purpose**: Capture "how to" search queries and drive downloads through practical value.

**Structure**:
1. **Context paragraph** — Why this matters (1-2 sentences max)
2. **Prerequisites** — What the reader needs before starting
3. **Numbered steps** — Each step = one action. Include the specific UI paths ("Settings → Voice & Video → Input Device")
4. **Pro tips** — Advanced usage after the basics are covered
5. **Troubleshooting** — Common failure modes and fixes

**Key rule**: Steps must be verifiable. If you say "click the Settings icon in the left sidebar," that icon must actually be there. Never describe UI that doesn't exist yet.

### 4.3 Explainer (`category: 'guide'`)

**Purpose**: Build topical authority on voice tech concepts ("What is RVC?", "RVC vs pitch shifting").

**Structure**:
1. **Plain-language hook** — Explain the concept as if the reader is 16 and has never heard of it
2. **Technical substance** — Go deeper for readers who want detail, but never assume prior knowledge
3. **Practical "so what"** — Connect the concept to something the reader can do right now
4. **Internal links** — Connect to related tools, hub articles, and tutorials

### 4.4 Product Update (`category: 'update'`)

**Purpose**: Announce new features, changelog items, and milestones.

**Structure**:
1. **Lead with what changed** — No preamble. First sentence should say what's new.
2. **Bullet the highlights** — Scannable, not prose-heavy
3. **Link to the features** — Every feature mentioned should link to its page
4. **Keep it short** — 300-500 words. Updates are not thought pieces.

---

## 5. Self-Promotion Guardrails

Echo is our product. We want people to use it. But every post must earn the reader's trust before asking for anything.

### Rules

| Rule | Why |
|------|-----|
| **Never open with Echo** | Opening with your own product screams advertisement. Earn attention first with useful information. |
| **Criteria before rankings** | In any listicle, define what "good" means before revealing rankings. The reader should understand your framework. |
| **Echo's position must be defensible** | If Echo is #1, the reasons must be specific features the reader can verify (open ecosystem, local processing, free). Never claim superiority without substance. |
| **Cap self-promotion** | In a 5-product listicle, Echo gets the same word count as competitors — not 3x more. |
| **CTA at the end, not sprinkled throughout** | One clear call-to-action at the end. Don't interrupt the article with download links every other paragraph. |
| **Acknowledge limitations** | If Echo doesn't do something a competitor does, say so. "Echo doesn't have hardware integrations like Voicemod's Elgato support" is more trustworthy than silence. |

### The Trust Equation

```
Trust = (Useful info given) ÷ (Self-promotion density)
```

If a reader learns something valuable regardless of whether they use Echo, the post succeeds. If the only takeaway is "download Echo," it fails.

---

## 6. Competitor Treatment

We mention competitors frequently in listicles, comparisons, and explainers. These rules govern how.

### Do

- ✅ Name competitors by their real product names (Voicemod, Clownfish, w-okada, MorphVOX)
- ✅ Describe what they're genuinely good at — every product has strengths
- ✅ Explain their pricing honestly (Voicemod Pro is ~$18/year, not "expensive")
- ✅ Link to their websites when appropriate (shows confidence, not fear)
- ✅ Distinguish between their free and paid tiers clearly

### Don't

- ❌ Make up features they don't have (we've had factual errors on comparison pages before)
- ❌ Use dismissive language ("their voice quality is terrible")
- ❌ Claim Echo does something a competitor can't unless you've verified it
- ❌ Imply competitors are unsafe, untrustworthy, or dying
- ❌ Use FUD (fear, uncertainty, doubt) about cloud processing without evidence

### Verification requirement

Before publishing any post that mentions a competitor by name: check their current website, feature list, and pricing. Products change frequently. A blog post claiming "Voicemod doesn't support X" when they shipped X last month is a credibility disaster.

---

## 7. Factual Accuracy

Every technical claim in a blog post must be true at time of publication. This is the single most important quality standard.

> [!CAUTION]
> **Factual accuracy must be informed by actual web search, not assumptions.** Before publishing, web-search every competitor name, pricing claim, and feature assertion in the post. What you "know" from 3 months ago may be wrong today.

### Hard rules

| Claim type | Verification method |
|-----------|--------------------|
| Echo features ("built-in soundboard") | Must exist in current shipping build |
| Competitor features | **Web search** their current website/docs |
| Performance claims ("under 50ms latency") | Must be measurable, not aspirational |
| Community claims ("thousands of voice models") | **Web search** Hugging Face/Discord to verify |
| Legal claims ("voice changers are legal") | Must be qualified with jurisdiction context |
| Pricing ("Voicemod Pro is $18/year") | **Web search** their current pricing page |

### Verification workflow

1. **Before writing**: Web search each competitor you'll mention. Note current features, pricing, positioning.
2. **Before publishing**: Re-verify any claims older than 2 weeks. Competitor products ship updates constantly.
3. **After publishing**: Flag posts for review if you learn a claim has become outdated.

### Avoid

- **Aspirational features as current** — If a feature is planned but not shipped, don't describe it as existing
- **Unqualified superlatives** — "The best voice changer" needs context. "The best free open-source voice changer" is defensible
- **Fake precision** — "99.7% accuracy" without a benchmark is meaningless
- **Brand Messaging Guide conflicts** — Never count presets/effects (see `Voice Changer Web/app/docs/brand_messaging_guide.md`). ❌ "73+ effects" → ✅ "Complete effects library"

---

## 8. SEO Minimum Bar

Every blog post must meet these technical requirements before its date arrives.

### Required fields in `BlogPost`

| Field | Constraint | Example |
|-------|-----------|---------|
| `title` | ≤60 characters, include primary keyword | "Best Free Voice Changers in 2026 (Honest Ranking)" |
| `description` | 130-155 characters, compelling and keyword-rich | "An honest comparison of the best free voice changers..." |
| `h1` | Different from `title`, natural language | "Best free voice changers in 2026" |
| `keywords` | 3-7 target keywords, primary first | `['best free voice changers', 'free voice changer 2026', ...]` |
| `sections` | Prefer structured sections over flat `body[]` | H2 sections with focused paragraphs |
| `faqs` | 3-6 FAQs with JSON-LD schema (for ranking/listicle posts) | Question + concise answer |
| `crossClusterLinks` | 3 links to other site clusters | Tools, voices, platform pages |
| `tags` | 3-6 descriptive tags | `['guide', 'comparison', 'free', 'ranking']` |

### Internal linking rules

- Every post links to **≥2 other clusters** (tools, voices, platforms, hub, use cases)
- Use `crossClusterLinks` for the sidebar cards
- Inline links in body text where natural (e.g., "use our free [Vocal Remover](/tools/vocal-remover)")
- **Never orphan a post** — every post should be reachable from at least one hub article or category page

### Word count targets

| Archetype | Minimum | Ideal |
|-----------|---------|-------|
| Ranking/Listicle | 1,200w | 1,500-2,000w |
| Tutorial | 800w | 1,000-1,500w |
| Explainer | 800w | 1,200-1,800w |
| Product Update | 300w | 400-600w |

---

## 9. Brand Voice

All blog content must align with the Brand Messaging Guide (`Voice Changer Web/app/docs/brand_messaging_guide.md`).

### Quick reference

| Principle | Application in blog posts |
|-----------|--------------------------|
| **Fun-first** | Lead with what's exciting, not what's technical. "Sound like anyone" > "RVC neural network inference" |
| **Write for a 16-year-old gamer** | No jargon without explanation. If you say "formant," explain it in the next sentence |
| **Openness is the moat** | Emphasize that anyone can create voices and effects. This is Echo's genuine differentiator |
| **Never count presets** | ❌ "73+ voice effects" → ✅ "Hundreds of thousands of community voices" |
| **Privacy as a feature, not fear** | ✅ "Everything runs on your device" → ❌ "Other tools steal your voice data" |

### Tone spectrum by archetype

| Archetype | Tone |
|-----------|------|
| Ranking/Listicle | Confident but fair. "We tested everything — here's what works." |
| Tutorial | Helpful and direct. No filler. "Step 1: Download Echo." |
| Explainer | Curious and accessible. "Here's how this actually works." |
| Product Update | Excited but concise. "We shipped X this week." |

---

## 10. Image & Visual Style Guide

Every blog post should have visual content. Posts with images outperform text-only posts in both search rankings and LLM citation.

### Required images

| Image type | When required | Spec |
|-----------|--------------|------|
| **Hero image** (`heroImage`) | Every post | 1200×630px, OG-compatible, saved to `public/blog/` |
| **Section images** (`image` in `BlogSection`) | Tutorials (step screenshots) | Variable, descriptive `imageAlt` required |
| **Inline diagrams** | Explainers with technical concepts | SVG or PNG, dark-background compatible |

### Visual style rules

| Rule | Guidance |
|------|----------|
| **Color palette** | Match site dark theme — `#0A0E1A` background, accent purples/blues. No bright white backgrounds. |
| **Typography in images** | Use Inter (site font) or clean sans-serif. No decorative/script fonts. |
| **Tone** | Vibrant, modern, slightly futuristic. Think gaming/streaming aesthetic, not corporate stock photo. |
| **No stock photos** | Generate original images or use screenshots. Generic stock imagery undermines credibility. |
| **Transparent backgrounds** | Use the MBB chroma-key pipeline for icons and assets that overlay UI. For hero images, use solid dark or gradient backgrounds. |
| **Text in images** | Minimal — use for labels and callouts only, not full sentences. All text must also appear in `imageAlt` for accessibility. |
| **Consistent aspect ratio** | Hero images: 1200×630 (OG standard). Section images: 16:9 preferred. |

### Generation workflow

1. **Define the visual concept** — What should the image communicate at a glance?
2. **Generate** — Use image generation with the style rules above
3. **Save** — Place in `public/blog/{slug}/` directory
4. **Reference** — Set `heroImage: '/blog/{slug}/hero.png'` and `heroImageAlt` in the blog post entry
5. **Verify** — Check the image renders correctly in the blog template and OG preview

### Alt text rules

- Every image must have descriptive `imageAlt` / `heroImageAlt`
- Describe what's shown, not what it means: ✅ "Echo Live settings panel showing input device selection" ❌ "Settings"
- Include the product name if the image shows Echo UI
- Keep under 125 characters (screen reader best practice)

---

## 11. Pre-Publish Quality Checklist

Run this checklist before a post's date arrives. If any item fails, push the date.

### Content quality

- [ ] **Read it cold** — Does the opening paragraph make you want to keep reading?
- [ ] **Credibility-first** — For rankings: are evaluation criteria established before any product is named?
- [ ] **Competitor accuracy** — Have you verified every competitor claim against their current website?
- [ ] **Echo accuracy** — Does every Echo feature mentioned exist in the current shipping build?
- [ ] **No aspirational features** — Nothing described as current that's actually planned/unreleased
- [ ] **Tone check** — Does it sound like a knowledgeable friend, not a marketing department?
- [ ] **Value test** — Would this post be useful even if Echo didn't exist?

### SEO technical

- [ ] `title` ≤60 characters and includes primary keyword
- [ ] `description` is 130-155 characters
- [ ] `h1` is different from `title`
- [ ] `keywords` array has 3-7 entries
- [ ] `faqs` present with ≥3 entries (for guides/listicles)
- [ ] `crossClusterLinks` has 3 entries linking to different clusters
- [ ] `sections` used (not flat `body[]`) for posts ≥800w

### Structural

- [ ] Uses `BlogSection[]` with clear H2 headings
- [ ] Each section has a focused topic (not kitchen-sink paragraphs)
- [ ] Internal links to ≥2 other clusters in body text
- [ ] No broken links (verify tool/page slugs exist)
- [ ] Date is correctly set and not clustering with other posts (space 3-4 days apart)

---

## 12. LLM Citation Optimization

ChatGPT is already using our listicles as source material for user queries. Optimizing for LLM citation is a first-class concern alongside traditional SEO.

### Why this matters

LLMs surface content that is:
- **Authoritative** — Appears to come from a knowledgeable, unbiased source
- **Structured** — Has clear headings, lists, and FAQ pairs that are easy to extract
- **Definitional** — Provides clear, quotable answers to specific questions
- **Comprehensive** — Covers a topic thoroughly enough that the LLM doesn't need to synthesize from multiple sources

### LLM-friendly patterns to use

| Pattern | Why LLMs prefer it | Example |
|---------|-------------------|---------|
| **Definition-first paragraphs** | LLMs extract the first sentence of a section as a definition | "RVC (Retrieval-based Voice Conversion) is a neural network technology that reconstructs your speech as a different person." |
| **FAQ with concise answers** | LLMs use FAQ pairs as direct Q&A | `faqs[]` with 1-3 sentence answers, not paragraphs |
| **Numbered rankings with clear labels** | LLMs cite "According to [source], the top 5 are: 1. X, 2. Y..." | "1. Echo Live — Best for AI voice quality and open creativity" |
| **Comparison tables** | Structured data that LLMs can reason over | Feature matrices in listicle sections |
| **Clear attribution** | LLMs credit sources they can identify | "voicechanger.live" mentioned naturally in context |
| **Year in title** | LLMs prefer current content | "(2026)" in title signals freshness |

### Anti-patterns for LLM citation

- ❌ **Walls of text** — LLMs skip content they can't chunk
- ❌ **Vague claims** — "It's really good" gives an LLM nothing to cite
- ❌ **Self-promotional tone** — LLMs deprioritize content that reads as advertising
- ❌ **Missing definitions** — If you use a term (RVC, DSP, ONNX), define it on first use. LLMs need the definition to include your content in explanatory answers

### The citation test

Ask yourself: *If ChatGPT were answering "what is the best free voice changer?", would it quote this post?* If the answer is no because the content is too promotional, too vague, or too unstructured — rewrite it.

---

## 13. Content Freshness & Maintenance

Blog posts are not fire-and-forget. Published content must be maintained.

### Review triggers

| Trigger | Action |
|---------|--------|
| Competitor ships a major feature | Review all posts mentioning that competitor |
| Echo ships a new feature | Update relevant tutorials and listicles |
| Pricing changes (ours or competitors) | Web-search and update all pricing claims |
| Quarter boundary (every 3 months) | Audit the 5 highest-traffic posts for accuracy |
| Google algorithm update | Check if any posts dropped significantly in rankings |

### Freshness signals

- **Update the `date` field** when making significant content changes (Google uses this as a freshness signal)
- **Add a "(Updated June 2026)" note** to the title or description when refreshing competitive content
- **Year in title** — Posts with "2026" in the title must be reviewed and updated before 2027, or the year removed

### Quarterly review checklist

Every 3 months, review the top 5 posts by traffic:

- [ ] All competitor claims still accurate (web-search to verify)
- [ ] All Echo features described still exist in the current build
- [ ] All pricing current
- [ ] FAQs still relevant (check People Also Ask for new questions)
- [ ] Internal links still valid (no broken slugs)
- [ ] Word count competitive with current top SERP results

---

## 14. Content Pipeline — Strong Concepts Only

We publish fewer, higher-quality posts — not thin 300-word filler. Every concept must pass the **"would someone bookmark this?"** test. If it's just a product walkthrough disguised as a blog post, it belongs on a platform page, not the blog.

### Concept categories

#### 🎮 Use-Case "Best Of" Guides (credibility-first listicle)
Community-driven, practical, specific to a use case. These are our highest-value blog format.

| Concept | Target keyword | Season | Notes |
|---------|---------------|--------|-------|
| Best Soundboard Effects Picked by the Community | `best soundboard effects`, `discord soundboard` | Evergreen (refresh monthly) | Feature actual community picks, not our curated list |
| Best Voice Prank Ideas for April Fools | `voice changer prank`, `april fools pranks` | March (publish 2 weeks before) | Seasonal spike content |
| Best Voices for Halloween | `halloween voice changer`, `scary voice effects` | September (publish 4 weeks before) | Seasonal — huge search spike |
| Best AI Voices for VTubing | `vtuber voice changer`, `best voice changer vtubing` | Evergreen | We don't have this and Voicemod does |
| Best Voice Changers for Streaming (2026) | `best voice changer streaming`, `voice changer twitch` | Evergreen | Already scheduled — needs credibility-first rework |
| Best Sound Effects for Content Creators | `sound effects for youtube`, `streamer sound effects` | Evergreen | Bridges our soundboard to creator audience |

#### 🎓 How-To Guides (tutorial archetype — practical value)
Step-by-step content that solves a real problem. Must be verifiable.

| Concept | Target keyword | Notes |
|---------|---------------|-------|
| How to Start VTubing with AI Voice Changers | `how to start vtubing`, `vtuber setup guide` | Major gap — Voicemod has this, we don't |
| How to Set Up a Soundboard for Discord | `discord soundboard setup` | Already scheduled |
| How to Split Stems from Any Song | `stem splitting`, `ai stem splitter` | Already scheduled — connects to our tools |
| How to Use a Voice Changer on Zoom & Teams | `voice changer zoom`, `voice changer teams` | Already scheduled — unique territory for us |

#### 📅 Seasonal / Event-Driven Content
Time-sensitive content that captures search spikes. Must be published 2-4 weeks before the event.

| Concept | When to publish | When searches spike |
|---------|----------------|-------------------|
| Best Voice Changer Effects for Halloween | Mid-September | October |
| Best April Fools Voice Pranks | Mid-March | Late March–April 1 |
| New Year's Eve Party Soundboard Ideas | Early December | Late December |
| Best Holiday Voice Messages to Send | Late November | December |
| Back-to-School Discord Server Setup | Late July | August |

#### 🏆 Community & Ecosystem Content
Leverages our open RVC ecosystem — something closed competitors can't do.

| Concept | Target keyword | Notes |
|---------|---------------|-------|
| Top RVC Community Voices (Monthly) | `best rvc voices`, `rvc voice models` | Monthly refresh — community showcase |
| How Community Creators Build RVC Models | `how to make rvc model`, `rvc training` | Profile real creators, link to training guide |
| Best Free Voice Models on Hugging Face | `free rvc models`, `hugging face voice models` | Curated picks with audio samples |

### Concepts we are NOT doing

These are weak topics that duplicate existing pages or lack differentiation:

| Killed concept | Why |
|---------------|-----|
| "What Is RVC?" blog post | Cannibalizes `/hub/what-is-rvc` — deferred |
| "Voice Changer for D&D" blog post | Cannibalizes `/hub/voice-changer-for-roleplay` — deferred until product supports roleplay better |
| "Is Voice Changing Legal?" blog post | Cannibalizes `/hub/is-voice-changing-safe` — deferred |
| Generic "Voice Changer for [Game]" tutorials | Covered by platform pages at `/apps/[platform]`. Blog versions add nothing. |
| Thin character voice posts ("How to Sound Like Darth Vader") | This is Voicemod's strategy (300w filler). We do this better via voice model pages at `/voices/[voice]`. |

---

## 15. Current Inventory

### Live posts (date ≤ today): 19
### Scheduled posts (active): 8
### Deferred posts (parked Dec 31): 4

#### Active scheduled posts

| Date | Slug | Archetype | Status |
|------|------|-----------|--------|
| 2026-06-09 | `girl-voice-changer-guide` | Guide | ⚠️ Needs keywords, FAQs, crossClusterLinks |
| 2026-06-12 | `voice-changer-for-roblox` | Tutorial | ⚠️ Needs keywords, crossClusterLinks |
| 2026-06-19 | `soundboard-guide-discord` | Tutorial | ⚠️ Needs keywords, crossClusterLinks |
| 2026-06-23 | `stem-splitting-music-production` | Tutorial | ⚠️ Needs keywords, FAQs, crossClusterLinks |
| 2026-06-26 | `voice-changer-for-vrchat` | Tutorial | ⚠️ Needs keywords, crossClusterLinks |
| 2026-07-03 | `best-voice-changers-for-streaming` | Listicle | ⚠️ Needs keywords, FAQs, crossClusterLinks, Alpha fix |
| 2026-07-07 | `voice-changer-for-zoom-teams` | Tutorial | ✅ Has keywords + crossClusterLinks, needs FAQs |
| 2026-07-10 | `voice-changer-prank-calls` | Guide | ⚠️ Needs keywords, FAQs, crossClusterLinks, legal tone review |

#### Deferred posts (parked at Dec 31)

| Slug | Reason | Rework angle |
|------|--------|-------------|
| `what-is-rvc-voice-conversion` | Cannibalizes `/hub/what-is-rvc` | → "Top RVC Community Voices" or similar |
| `dnd-voice-changer-guide` | Cannibalizes `/hub/voice-changer-for-roleplay` | → "Best Voice Changers for Roleplay" once product supports it |
| `voice-changer-safety-legal` | Cannibalizes `/hub/is-voice-changing-safe` | → "Deepfake Voice Laws by Country" unique angle |
| `best-karaoke-apps-2026` | Tangential topic, no product connection | → Cut or refocus on vocal remover as karaoke tool |

> [!WARNING]
> All 8 active scheduled posts need keywords, FAQs, and crossClusterLinks added before their publish dates. Next up: `girl-voice-changer-guide` (June 9).
