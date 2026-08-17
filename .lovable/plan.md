# LetNumbersTalk — Rework to MBB Standard

The engine is sound. What's wrong is the surface: it reads like a form, not like a deliverable from a top-tier strategy house. This rework rebuilds the visual system, the information choreography, and closes the specific gaps you flagged.

## What I verified in the current build

- Every metric card renders definition, formula, scoring band and points **permanently expanded**. "Where to find this" and "Sector benchmarks" are already buttons, but they're buried under the always-on blocks, so the card feels like a wall.
- **Areas to Look Into is missing from the report.** It renders under a metric at input time, but the report stage prints only a one-line row per metric (name / band / points). Confirmed at `Stages.tsx` — the report has no consolidated Areas content. This is a spec violation, not a taste issue.
- The About sections sit at the bottom of the report as plain stacked paragraphs, with no standing of their own.
- The footer disclosure runs the full container width — an unbroken measure far past comfortable reading length.
- No visitor analytics exist anywhere.
- No console or runtime errors — the defects are structural and visual.

## Design direction (locked)

MBB fused with mid-century modern, resolved as an **editorial magazine** system rather than a dark app.

- **Base**: warm paper (near-white, slight cream cast), deep ink for type. Light document, not dark dashboard — this is what a McKinsey/Bain deliverable actually looks like on the page.
- **Structure**: Bain-style decisive rules and hard-edged section markers; BCG's analytical warmth in the data surfaces; McKinsey's restraint in the amount of ink used.
- **Accent discipline**: one authority tone (deep ink-navy) and one decisive accent (warm rust/copper). Diagnostic tiers get their own quiet signal set — muted green, ochre, burnt orange, deep red — never bright.
- **Type**: Libre Baskerville headings, IBM Plex Sans body, IBM Plex Mono for every figure, formula, band edge and points count. Numbers set in mono is what makes it read as an instrument.
- **Layout**: magazine — featured score plate plus a grid of readings, wide editorial margins, measured column widths, no full-bleed text.
- **Motion — the Nolan register**: restrained, heavy, engineered. Depth-parallax entry, weighted score settles, page-turn chaptering between pillars, layered plates that move on separate z-planes. Slow, deliberate easing; nothing bouncy or playful. Reduced-motion honoured throughout.
- **Not text-only**: every screen carries a visual argument — value-chain diagrams, pillar-weight rings, benchmark position markers showing where the entered figure sits on the band scale, tier meters, a seven-pillar composite figure on the report cover. Illustration and diagram carry as much weight as copy.

## Voice and attribution

- **Numerals, never words.** "54 metrics", "7 pillars", "5 sector profiles". Sweeping the whole codebase for spelled-out numbers.
- **High-gravitas register** throughout — the language of a partner-level discovery call, not product marketing. Definitions, sourcing and formula copy get the same register as headline copy; no casual tone anywhere.
- **Footer note** states the diagnostic capability is built on AI-augmented research synthesis and a fusion of product management and management consulting frameworks.
- **Attribution**: Mr Sajal Roy — Enterprise Systems Architect. Contact rendered as `Mail — roysajal5@gmail.com`. A LinkedIn slot is built into the same block, left empty until you supply the URL.

## Naming

"Business Diagnostics" is over-literal. Replacing the descriptor with a positioning line in the register of a practice, not a product — e.g. **LetNumbersTalk · The Business Health Instrument**, with the hero framing it as a diagnostic instrument for founders and boards. Final wording is a small set of options at build time; nothing in the spec depends on it.

## Fixes, concretely

1. **Metric card as an interactive instrument.** Definition stays visible (one line, tightened register). Formula, scoring band, sourcing and sector benchmarks collapse behind four equal chips: `Definition` · `Formula` · `Where to find this` · `Sector benchmarks`. One opens at a time, animated. The formula panel renders in proper mathematical notation with the entered figures substituted live. The benchmark panel keeps its current table (which works) and gains a position marker showing where the reading falls.
2. **Areas to Look Into in the report.** Every metric scoring below its healthy range gets its full Areas block fused directly beneath its row — value-chain location of the finding, commonly contributing factors, illustrative examples, verbatim from the Logic Spec. A small value-chain diagram highlights the stage the finding sits in. Consolidated Areas appear once per pillar chapter and again in the integrated summary.
3. **The downloadable PDF carries all of it.** Cover plate, integrated score, pillar chapters, every metric reading, every Areas to Look Into block for weak scores, the Caution block, disclosure, and both About sections. Print stylesheet tuned so it reads as a bound deliverable — running heads, page rules, no clipped tables.
4. **About sections with standing.** Full-width editorial spread — portrait column, pull quote, credential line for Mr Sajal Roy, Enterprise Systems Architect — on the About route and at the close of the report.
5. **Footer.** Constrained measure (~70ch), three-column structure, methodology note and attribution block, disclosure as a distinct fine-print band under a rule.
6. **Responsive parity.** Metric cards, benchmark tables, diagrams and score plates rebuilt on the grid pattern so nothing clips at 375px. Diagrams scale, never scroll off.


## Visitor analytics

A live visitor count needs a server-side counter — it cannot be done client-side without a backend. Two routes:

- **Recommended**: enable Lovable Cloud and add a single counter table with a public increment. No accounts, no user data, no change to the zero-infrastructure promise for *assessment* figures — the diagnostic inputs still never leave the browser.
- Alternative: drop the counter and rely on the platform's built-in analytics, which reports visitors without any app code.

I'll take the first unless you say otherwise. It's one table and one endpoint; the assessment stays fully client-side.

## Technical notes

- Rework is confined to `src/styles.css` (full token replacement, light base), `MetricCard.tsx`, `Stages.tsx`, `SiteChrome.tsx`, `AboutSections.tsx`, and the three routes. Fonts loaded via `<link>` in `__root.tsx`.
- `scoring.ts`, `engine.ts`, `spec.generated.ts` and `types.ts` are untouched — no formula, benchmark, band or Areas text changes. Report Areas content is read from the existing metric records.
- The report gains a `consolidatedAreas` view derived from existing `metricResults`; no new scoring logic.

## Sequence

1. Token system and typography replacement — light editorial base, mono figures.
2. Site chrome: header, constrained footer, disclosure band.
3. Metric card rebuild — collapsed panels, mono figures, restrained reading block.
4. Assessment flow: chaptered pillar progression, magazine grid.
5. Report rebuild — cover plate, pillar chapters, Areas fused per metric, Caution block, print fidelity.
6. About spread and home page rework with the new positioning line.
7. Visitor counter (pending your call above).
8. Mobile pass at 375px, contrast/AA check, reduced-motion check.
