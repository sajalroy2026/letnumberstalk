# Assessment Text Contrast and Editorial-Grade Report PDF

Everything else stays as-is. Two areas only: on-screen reading contrast during the assessment, and the printed/downloaded report.

## 1. High-contrast assessment text

Across every pillar in the assessment flow, all supporting prose currently sits in a light grey. It gets darkened and slightly strengthened so it reads cleanly on ivory and on tinted plates:

- Metric definition, formula, "Where to find it" sourcing guidance, band labels and helper text move from the muted grey to a near-ink tone.
- "Areas to Look Into" body copy — the longest passages in the product — gets the darkest treatment plus a marginally larger line height, so a full paragraph is comfortable to read.
- Stage ledes, pillar notes, tier and weight captions, and input hints all lift to the same stronger tone; small uppercase labels keep their accent colour but gain weight rather than staying faint.
- Contrast is checked at AA or better on every ground the text sits on (card, sand plate, tinted band, caution block).

No copy changes, no layout changes — colour, weight and line-height only.

## 2. Report PDF reworked as an editorial magazine

The sample PDF shows the core problems: each page breaks early to keep whole blocks together, so a heading or a short metric leaves a third of the page blank; everything runs as one wide single column; and the rhythm is uniform from page 1 to page 16.

The print layout gets rebuilt around continuous flow:

- **Cover page.** A single full-bleed opening plate: report title, sector profile, date, the score (or pillar set), and the pillar spectrum — then a hard break. Nothing else shares that page.
- **Continuous flow, no dead space.** Blocks are no longer forced to stay whole. Metrics, readings and Areas to Look Into flow across page boundaries naturally, with orphan/widow control (minimum 3 lines either side) and "avoid break after heading" so a title never sits alone at the foot of a page. Only small units — a score row, a value-chain strip, a caution item — stay unbroken.
- **Two-column body.** Long-form prose (Areas to Look Into, methodology, disclaimer) sets in two justified columns with proper hyphenation, the way a printed report reads. Headings, score bars and diagrams span the full measure.
- **Magazine typographic scale.** Display serif chapter openers with a rule, a lead-in paragraph at larger size, drop-cap-style opening on each pillar chapter, small-caps metric labels, and tight consistent leading — instead of the current even, web-like spacing.
- **Running furniture.** Repeating page header (report name · sector profile) and footer (page number) via the page margin boxes, so it reads as a paginated document.
- **Pillar chapters.** Each pillar opens with a compact chapter head — pillar name, score, tier, weight — then flows straight into its metric table and guidance without a page of its own unless the content warrants it.
- **Colour discipline.** Cover keeps the full ink plate; body pages stay light with accent rules, coloured pillar heads and tinted Areas to Look Into blocks, all with exact colour printing. Grain, blur and glow stay suppressed.

## Technical notes

- `src/styles.css`: strengthen the muted/reading tokens used in assessment context; rewrite the `@media print` block (page margin boxes, columns, break rules, print typographic scale, print-only utility classes).
- `src/components/lnt/MetricCard.tsx`, `Stages.tsx`: text colour classes, and swap blanket `print-avoid-break` on tall blocks for the finer-grained break utilities; add print-only chapter-head and column wrappers.
- Untouched: scoring engine, metric content, benchmarks, Areas to Look Into text, all on-screen layout, motion, and the home/About pages.

## Verification

Generate the report from a full 7-pillar run, render every page to images, and check for blank half-pages, orphaned headings, clipped columns and colour fidelity before finishing.
