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
- **Motion**: restrained and heavy. Slow reveals, weighted score settles, page-turn chaptering between pillars. Nothing bouncy. Reduced-motion honoured throughout.

## Naming

"Business Diagnostics" is over-literal. Replacing the descriptor with a positioning line in the register of a practice, not a product — e.g. **LetNumbersTalk · The Business Health Instrument**, with the hero framing it as a diagnostic instrument for founders and boards. Final wording is a small set of options at build time; nothing in the spec depends on it.

## Fixes, concretely

1. **Metric card restraint.** Definition stays visible (one line). Formula, scoring band, sourcing and sector benchmarks all collapse behind four equal chips: `Formula` · `Scoring band` · `Where to find this` · `Sector benchmarks`. Only one opens at a time. The card becomes an input and a reading — everything else is on demand.
2. **Areas to Look Into in the report.** Every metric outside its healthy range gets its full Areas block fused directly beneath its row in the report — value-chain location, contributing factors, illustrative examples, verbatim from the Logic Spec. The consolidated Areas set also appears in the download.
3. **Report as a document.** Cover plate with the Integrated Score, a pillar breakdown where each pillar is a chapter with its own score plate and its readings beneath, Caution as a distinct bordered block, then disclosure. Print stylesheet tuned so the download is a real document, not a screenshot of a webpage.
4. **About sections with standing.** Promoted to their own full-width editorial spread — portrait-column layout, pull quote, credential line — on the About route and at the close of the report.
5. **Footer.** Constrained measure (~70ch), three-column structure, disclosure as a distinct fine-print band under a rule.
6. **Responsive parity.** Metric cards, benchmark tables and score plates rebuilt on the grid pattern so nothing clips at 375px. Benchmark tables scroll within their own frame.

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
