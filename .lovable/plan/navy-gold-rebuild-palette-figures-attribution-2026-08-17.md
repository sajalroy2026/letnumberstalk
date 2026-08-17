# Navy & Gold Rebuild — Palette, Figures, Attribution

A single coherent colour system, a proper hero figure, more 3D work throughout, and analytics reduced to a plain counter.

## 1. Colour system — Navy, Gold, Burnt Orange, Forest, Oxblood

One premium five-colour system, applied everywhere so contrast is consistent instead of accidental.

- Grounds: crisp cool white and pale steel (#e8edf3 family) as the default reading surface; deep navy (#0f1b3d) reserved for the hero band, report cover and footer.
- Structure: mid navy (#1e3a5f) for rules, plates, chart axes and headings on light ground.
- Accent family, rotating section by section in a fixed cadence so no two neighbouring chapters match: **navy → gold (#c9a84c) → burnt orange (#b4531f) → forest green (#1f5c3d) → oxblood (#6e1f24)**. Each has a light-ground value and a lifted value for use on navy, so type sitting on any accent stays legible.
- Pillar identity colours stay distinct (colour as information), drawn from the same five-colour family plus controlled tints, so they read as one system rather than a rainbow.
- Diagnostic tiers map onto the family: healthy forest green, acceptable gold, concern burnt orange, critical oxblood — each checked to AA on both white and navy grounds.
- Numerals, chart strokes, benchmark corridors and score dials all read from the active section accent, so figures and text never drift apart in colour.
- Every foreground/background pairing audited: body copy AAA on light grounds, AA minimum everywhere, including text over figures (figures get a solid scrim or move out of the text column).

Typography stays Sora (display) and Manrope (body), with weight and size tuned for the new contrast.

## 2. Hero figure — replacing the donut

The donut is gone already but nothing strong replaced it. The hero gets a purpose-built, full-width composition: a slowly rotating **seven-pillar armature** — seven weighted arcs orbiting a common core, each arc's length set by its real pillar weight, with metric nodes distributed along it, benchmark corridors drawn as translucent bands, and a soft depth blur on the rear plane. It occupies the full hero width, sits behind the headline with a legibility scrim, and drifts continuously.

## 3. More figures and 3D work

New context-matched compositions, each distinct, placed through the home page, About and the assessment flow:

- Weighted-pillar armature (hero).
- Layered benchmark terrain — five sector planes stacked in z, the active one lifting forward.
- Value-chain conduit — a dimensional pipeline highlighting the stage a finding sits in.
- Score column — an extruded bar block that resolves as the number counts up.
- Concentration ring and runway bar for the terminal-risk section.
- Ambient depth layers behind every band: parallax lattices, drifting corridors, prism edges at low amplitude.

Motion register: long weighted easing, depth travel and focus-pull rather than slides; charts animate as events (bars grow from a shared baseline, corridors draw in, rings sweep). Full reduced-motion fallback; mobile keeps choreography at lower amplitude.

## 4. Attribution fix

- Header keeps **LetNumbersTalk — by Mr Sajal Roy** alongside the "The Business Health Instrument" line.
- Hero eyebrow drops the "· by Mr Sajal Roy" suffix and reads as "The Business Health Instrument" only, since the name already appears once at the top.
- Footer attribution stays as "Conceptualized by Mr Sajal Roy, Enterprise Systems Architect".

## 5. Analytics reduced to a counter

- The standalone `/analytics` dashboard page is removed.
- The server function that read the log is removed.
- What remains: the anonymous event write from the browser into the existing backend table (visit, assessment started, assessment completed, report downloaded). Nothing is read back or displayed in the app.

## Technical notes

- Touched: `src/styles.css` (full token rebuild: grounds, accents, tiers, pillar colours, gradients, shadows, alternating `.tone-gold` / `.tone-steel` section classes), `src/components/lnt/Figures.tsx` (new compositions, retired unused ones), `MetricCard.tsx`, `Stages.tsx`, `SiteChrome.tsx`, `AboutSections.tsx`, `src/routes/index.tsx`, `about.tsx`.
- Removed: `src/routes/analytics.tsx`, `src/lib/analytics/analytics.functions.ts`. Kept: `src/lib/analytics/track.ts` and the backend table.
- Untouched: `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, all metric text, formulas, benchmarks, bands and Areas to Look Into content.

## Sequence

1. Rebuild colour tokens and the two-accent section rotation.
2. Contrast audit across every band, plate, chart and print sheet.
3. Hero armature figure and the new figure set.
4. Motion and ambient depth pass.
5. Header/hero attribution fix.
6. Remove the analytics page and server function.
7. Mobile, print and reduced-motion verification.
