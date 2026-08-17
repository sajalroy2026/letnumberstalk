# LetNumbersTalk — Build Plan

I read both documents end to end. Below is my judgment on architecture, sequencing, risk, and the specific gaps I found between the two documents that need your decision before code starts.

## What I verified in the documents

- Logic Spec Sections 2–8 contain **54 metric entries**, not 57: Financial Health 17, Operational Efficiency 9, Market Position 10, Organizational Capability 5, Strategic Positioning 5, Risk Management 5, Technology & Systems 3. Section 11.1 also says "All 17" for Financial Health, confirming 17 there.
- **26 of the 54 metrics carry an explicit `Scoring Band:` line. 28 do not** — they have sector benchmark tables and threshold readings but no point allocation.
- Each pillar's scoring engine header allocates 100 points across sub-components, and several sub-components have **no matching metric entry** in the spec (details below).
- Section 11.1 defines critical-minimum sets for all seven pillars. Section 11.3 defines permitted and prohibited language patterns. Section 9 defines pillar weights and the two-indicator Caution mechanism.

## Architecture — one engine, not seven implementations

The 57 (54) metrics do not need 57 scoring functions. Everything in the spec reduces to four declarative scorer shapes, plus a generic evaluator.

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

- **Content fidelity, not code.** 54 entries × six text fields is the bulk of the work and the easiest place to drift. Mitigated by extracting from the document programmatically rather than retyping.
- **The 28 metrics without scoring bands** — the single biggest blocker. Without point allocations their pillar engines cannot sum to 100.
- **Sub-component allocations that have no metric.** Pillar 4 allocates points to "Decision speed", "Skills-gap", "Leadership depth"; Pillar 5 to "Model leverage", "Network advantage", "Digital and AI maturity"; Pillar 7 to "Integration and Data Flow", "Adoption"; Pillar 3 to "Contribution per customer" and "Share trajectory"; Pillar 1 to "Pricing power", "Cost-structure flexibility", "Cost-trend management". These likely account for the 57-vs-54 gap.
- **Client-side PDF at this content volume** — a full seven-pillar report with all Areas content is long; layout fidelity and mobile generation need early validation.
- **Cinematic motion vs. the 3-second paint budget and WCAG AA** — motion must be prefers-reduced-motion aware and must not gate content.

## Items I need clarified before building

1. **57 vs 54.** Are three metrics missing from V3.0, or is 57 a count of scored sub-components rather than metric entries?
2. **Missing scoring bands (28 metrics).** Do you supply the point allocations, or should I derive them from each metric's four-tier benchmark table using a consistent mapping (healthy = full points, acceptable ≈ 70%, concern ≈ 35%, critical = 0) scaled to the sub-component allocation? I will not invent thresholds — but the mapping rule needs your sign-off either way.
3. **Unmapped sub-components.** For Pillar 4 "Decision speed", Pillar 5 "Model leverage" / "Network advantage" / "Digital and AI maturity", Pillar 7 "Integration and Data Flow" — add them as self-assessment metrics with your wording, or redistribute their points across the existing metrics in that pillar?
4. **Caution thresholds.** I read them as cash runway < 3 months and top-three customer concentration > 60% (the "Critical" tier in each metric's table). Confirm.
5. **Confidence classification.** The spec names the flag but not the levels. Proposal: `Stated` (point value), `Estimated` (range midpoint), and a pillar-level `High / Moderate / Indicative` derived from coverage. Confirm the vocabulary.
6. **Report format.** PRD says PDF; is a print-optimised, browser-native PDF acceptable, or do you want a generated document file?
7. **Qualitative capture (FR-08) vs. no-dropdowns (FR-06).** Self-assessment metrics are 1–4 guided bands. I plan to render these as labelled band cards (not a dropdown, not a bare number field). Confirm that satisfies the intent.
