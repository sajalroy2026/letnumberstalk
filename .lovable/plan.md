# LetNumbersTalk — Build Plan

I re-read the regenerated Logic Specification V3.0 against my earlier findings. Every blocking gap is closed. This plan is now buildable as written.

## Verification of the regenerated spec

- **Scope restated as 54 metrics** (was "57"). Distribution confirmed: Financial Health 17, Operational Efficiency 9, Market Position 10, Organizational Capability 5, Strategic Positioning 5, Risk Management 5, Technology & Systems 3.
- **All 54 metrics now carry an explicit `Scoring Band` line** (was 26 of 54).
- **All seven pillar point allocations sum to exactly 100** — I summed the per-metric maximum points in each pillar and each totals 100.
- **Every scoring-engine sub-component now names real metrics.** The previously unmapped components (Decision speed, Model leverage, Network advantage, Digital and AI maturity, Integration and Data Flow, Contribution per customer, Share trajectory, Pricing power, Cost-structure flexibility) are gone; sub-components are now groupings of the actual 54 metrics.
- **Caution thresholds are now explicit** in Section 9: cash runway below 3 months, top-three customer concentration above 60%, with the non-blocking rule restated.
- **New Section 11.2a** fixes the confidence vocabulary: per-input `Stated` / `Estimated`; per-pillar `High` / `Moderate` / `Indicative` derived from coverage against the Section 11.1 tiers.
- **New Section 11.2b** confirms qualitative metrics render as labelled selectable band cards — not dropdowns, not bare numeric fields — resolving the FR-06 / FR-08 tension.
- **Content completeness:** all 54 metrics have Definition, Formula, sourcing guidance, What This Reading Shows, and Areas to Look Into. 49 of 54 carry sector benchmark tables; the 5 without (Process Cycle Time, Differentiation Strength, Switching Cost Assessment, Key-Person Dependency, Automation Level) are sector-neutral by nature — four are 1–4 self-assessments and cycle time is business-specific. No action needed.

Only one open item remains, and it does not block the start of the build (item 1 at the end).

## Architecture — one engine, not seven implementations

The 54 metrics do not need 54 scoring functions. Everything in the spec reduces to four declarative scorer shapes, plus a generic evaluator.


```text
metric definition (data)          engine (code, written once)
──────────────────────────        ────────────────────────────
id, pillar, label                 parseInput()   free text -> {value, mode, confidence}
inputs: [B-01, B-02]              compute()      runs the formula from base inputs
formula (fn + notation string)    band()         value -> points, using the metric's band
bands: threshold -> points        classify()     value -> healthy/acceptable/concern/critical
benchmarks: per-sector ranges     areas()        emits Areas to Look Into when not healthy
maxPoints                         reweight()     partial data -> renormalise over entered metrics
scoreEssential: bool
guidance / reading / areas text
```

Scorer shapes cover every metric in the spec:
1. **Descending banded** (higher is better) — growth, margins, retention, uptime.
2. **Ascending banded** (lower is better) — DSO, rework rate, concentration, turnover.
3. **In-band optimal** (a healthy corridor) — utilization, current ratio, tech spend, span of control.
4. **Self-assessment ordinal** (1–4 guided descriptive band) — differentiation, switching cost, key-person, automation.

Sector calibration is a lookup keyed `[metricId][sectorProfile]`, not branching logic. Five benchmark sets live as data rows on each metric; no metric contains an `if (sector === ...)`.

Shared base inputs (B-01…B-32) are collected once into `BaseInputSet`. Metrics declare their input dependencies, so Revenue Concentration and Customer Concentration Risk both read B-11/B-01 and are asked once, scored twice with their own bands — exactly as the spec states.

### Data model

- `BaseInputSet` — `{ [inputId]: { raw, value, mode: 'point'|'range', confidence: 'stated'|'midpoint' } }`
- `PillarAssessment` — `{ pillarId, rawPoints, availablePoints, score0to100, coverage, confidence, metricResults[], meetsCriticalMinimum }`
- `IntegratedReport` — `{ integratedScore, pillarScores[], cautionBlock|null, consolidatedAreas[] }`

All three in React context / memory only. No persistence, no network, no analytics on user figures.

### Partial-data re-weighting

`pillarScore = (sum of earned points across entered metrics ÷ sum of max points across entered metrics) × 100`. Missing metrics are excluded from both numerator and denominator — never zeroed. Coverage drives the stated confidence level. Below the Section 11.1 critical minimum the pillar renders a helpful "what's still needed" panel, not an error, and still permits navigation and integrated-report generation.

### Caution mechanism

Evaluated once at integrated-report assembly, from cash runway and customer concentration only. Renders below the score as a separate block with its own Areas content. It is computed after the score and cannot influence it — enforced by making the score function pure and unaware of caution state, and locked by a test.

### Language safety (liability constraint)

All Areas to Look Into text is authored verbatim from the spec into a content module, never generated at runtime. A test asserts no prohibited pattern from Section 11.3 ("you should", "we recommend", "fix this by", "take the following steps") appears anywhere in the content bundle, and that no categorical posture label is attached to the integrated score.

## Sequencing

1. **Content extraction pass** — convert all 54 metric entries into typed data modules (definition, formula notation, sourcing guidance, reading, areas, benchmarks, bands, essential flag). Highest-volume, highest-fidelity-risk step; done before any UI.
2. **Engine + test suite** — parser, four scorers, re-weighting, pillar engines, integrated composite, caution. Worked-case tests per pillar (R-01 mitigation).
3. **Design system** — mid-century modern tokens: deep navy, warm teal, warm copper, warm cream; Libre Baskerville display / DM Sans body; motion primitives for the cinematic progression.
4. **Flow shell** — industry selection, pillar selection, pillar assessment screens, per-metric guidance/reading/Areas, results.
5. **Integrated report + Caution block + About sections + disclosure.**
6. **Client-side PDF** — direct compilation of on-screen content.
7. **Accessibility and responsive parity pass**, then performance budget check.

## Where the risk actually is

- **Content fidelity, not code.** 54 entries × six text fields is the bulk of the work and the easiest place to drift. Mitigated by extracting from the document programmatically rather than retyping, then diffing the built content bundle against the source text.
- **Band-boundary correctness.** With all 54 bands now specified, the residual risk is off-by-one at tier edges (is exactly 40% "moderate" or "high"?). Every band gets boundary tests at each threshold value.
- **Client-side PDF at this content volume** — a full seven-pillar report with all Areas content is long; layout fidelity and mobile generation need early validation.
- **Cinematic motion vs. the 3-second paint budget and WCAG AA** — motion must be prefers-reduced-motion aware and must not gate content.

## Craft latitude I'll exercise

The spec is binding on every number, formula, threshold, and word of diagnostic content. Everywhere else I'll take the experience beyond a literal reading. The audience is founders and boardroom leaders arriving for a serious diagnostic — the surface has to earn that in the first three seconds.

- **Palette** — McKinsey restraint, BCG analytical warmth, Bain decisiveness, resolved through mid-century modern: deep navy authority, warm cream paper, warm teal for healthy readings, copper as the single decisive accent. Defined once as semantic tokens in `src/styles.css`, never hardcoded.
- **Cinematic, dimensional motion** — a full-bleed entry with subtle depth and parallax; industry selection as tilting, layered cards rather than a form; pillar-to-pillar chaptering with a persistent progress spine; score reveals that count up and settle. Depth is achieved with CSS 3D transforms, layered shadows, and spring motion — no heavy WebGL library, which keeps the 3-second paint budget and mobile parity intact.
- **Editorial typography** — Libre Baskerville set large and confident for scores and pillar titles; DM Sans at a generous measure for guidance.
- **The guidance layer as the product's signature** — definition, sourcing, formula, and reading as an unfolding panel beside each field, not a tooltip; formulas in real mathematical notation.
- **Areas to Look Into as a designed artefact** — a distinct, warmer surface fused beneath the finding, reading as commentary rather than an error state.
- **The integrated report as a document** — score plate, seven-pillar breakdown, caution block where triggered, About sections, disclosure. The downloadable PDF is the same artefact, not a lesser copy.
- **Zero backend** — no accounts, no database, no network calls with user figures. Everything computes in memory and is discarded on exit, exactly as NFR-01 and NFR-07 require.

Nothing here alters a computed value or a line of specified content. Motion respects `prefers-reduced-motion` and never gates content.

## Remaining open item

1. **Report format.** The PRD specifies a downloadable PDF. I'll build a print-optimised, browser-native PDF (client-side, zero server, exact on-screen parity) unless you'd rather have a generated document file. This does not block phases 1–5.

Everything else previously flagged is resolved by the regenerated specification, and I'll build strictly to it.



