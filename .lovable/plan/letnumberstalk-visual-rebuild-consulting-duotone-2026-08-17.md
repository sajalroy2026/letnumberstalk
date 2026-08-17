# LetNumbersTalk — Visual Rebuild: Consulting Duotone

The engine, scoring and content stay untouched. This is a design and experience rebuild.

## Locked direction

- **Palette (duotone)**: deep ink navy `#16233A` as the dominant section colour, warm sand `#E8DFCF` as the counter-panel, copper `#B8592C` as the decision accent, deep teal `#1F6F63` and ochre `#D8A93F` as analytical signal tones. All added to `src/styles.css` as oklch tokens — no hardcoded colours in components.
- **Mode**: dark navy hero, dark navy report; lighter sand working screens for the assessment so entering 54 figures stays comfortable. Alternating navy/sand bands give the whole site a duotone rhythm instead of the current flat white.
- **Type**: Libre Baskerville headings, IBM Plex Sans body, IBM Plex Mono for every figure (kept — it reads as an instrument).
- **Graphics load**: maximal.

## What changes

### 1. Colour and surface system
Replace the near-white token set with the duotone system: navy sections (`--section-ink`) with ivory type, sand sections (`--section-sand`) with ink type, copper rules and section markers, tier colours re-tuned to the teal/ochre/copper/oxblood signal set. Every band gets a hard copper hairline and a mono section index (`01 / 07`), Bain-style.

### 2. Metric card
- Header shows **metric name + definition only** — the standing definition stays.
- The `Definition` chip is removed. Remaining chips: `Formula` · `Where to source` · `Sector benchmarks`.
- Chips restyled as copper-underlined tabs on a sand card; open panel animates with a weighted reveal.
- Result panel gets a colour-coded tier bar, benchmark position marker and the fused Areas to Look Into block.

### 3. Illustration and experience layer
- **Hero**: navy stage with a layered parallax composite — a 7-pillar constellation that rotates slowly on scroll, weight arcs sized to each pillar's weighting, mono coordinate labels.
- **Pillar chapter transitions**: full-bleed navy chapter plates with the pillar number set large in mono, sliding in on a z-plane with depth blur before each pillar's metrics.
- **Assessment screens**: sand canvas, sticky pillar progress rail with filled weight segments, per-metric benchmark scales, animated value-chain diagram in Areas blocks.
- **Report**: navy cover plate, count-up score dial with copper sweep, pillar weight ring, per-pillar bar spectrum, caution block in oxblood, Areas fused per metric.
- Motion register stays heavy and engineered — long easing, no bounce; all of it respects reduced-motion.

### 4. Sector selection and landing
Sector cards become illustrated tiles (distinct duotone glyph per profile) rather than plain text buttons.

## Technical notes

- Files touched: `src/styles.css` (token rebuild + duotone section utilities), `Figures.tsx` (new pillar constellation, chapter plate, sector glyphs, spectrum bars), `MetricCard.tsx` (chip set, sand card treatment), `Stages.tsx` (chapter plates, progress rail, report cover), `SiteChrome.tsx`, `AboutSections.tsx`, and the 3 routes.
- `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, `content.ts` untouched — no formula, band, benchmark or Areas text changes.
- Print stylesheet updated so the navy surfaces flatten to white for the PDF while keeping rules, tiers and Areas content intact.
- AA contrast checked on both navy and sand bands; 375px pass at the end.

## Sequence

1. Token and duotone surface system.
2. Figures library additions (constellation, chapter plate, sector glyphs, spectrum).
3. Home rebuild — navy hero, alternating bands.
4. Assessment rebuild — sand canvas, chapter plates, progress rail, metric card chip change.
5. Report rebuild — navy cover, dial, rings, fused Areas.
6. Chrome, About, print fidelity, mobile and reduced-motion pass.
