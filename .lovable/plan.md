# Light-Spectrum Rework, Fluid Motion and Visitor Analytics

Engine, formulas, benchmarks, bands and all Areas to Look Into text stay untouched. Design, copy framing, motion and one new analytics layer.

## 1. Palette — retire the dark chapters

- Remove the espresso/ink bands from the home page, About and the assessment flow. Light grounds throughout: ivory, pale sky, mist green, warm sand, blush.
- Accent family rebuilt on light, saturated-but-soft shades that keep rotating chapter to chapter: light blue, burnt orange, forest green, clay, dusty teal, muted plum.
- Text stays dark ink on light ground everywhere, so contrast improves rather than drops. Figures and charts pick up the local chapter accent.
- Report cover and PDF follow the same light system.

## 2. Typography

- Headings move to Sora, body to Manrope, loaded via the root head link.
- Retuned scale: larger body, generous leading, tightened measure. Numerals keep the tabular treatment.

## 3. Home page layout

- Remove every "01 —", "02 — Mandate", "05 — Method" style chapter numbering and the numbered "01/02/03" pointers inside cards. Section headings stand on their own.
- The donut/54-metric figure is replaced by a full-bleed hero-scale composition that occupies the viewport: a wide animated field of drifting benchmark corridors, pillar arcs and resolving numerals, sitting behind and around the hero copy rather than inside a small tile.
- "By Mr Sajal Roy" appears quietly near the LetNumbersTalk wordmark in the top area — small, understated, no title word used there.
- The Method section headline drops the discovery-call line and instead leads on how the instrument reads: evidence sourced from named artefacts, resolved through weighted engines, stated as observation. No invitation framing anywhere.
- Additional futurist illustrations placed per section and matched to their subject: benchmark corridor bands for calibration, a sector spectrum for industry profiles, a flow field for value-chain attribution, a signal trace for terminal-risk surveillance.

## 4. Motion

- Transitions become fluid rather than tile-based: opacity plus soft scale and blur settle, drifting ambient layers, morphing gradient washes, staggered pop-in for cards.
- Charts resolve continuously — corridors draw, bars ease from a shared baseline, numerals count and settle.
- Colour versatility preserved: each chapter enters with its own accent. Long weighted easing, no bounce, full reduced-motion fallback.

## 5. Copy and attribution

- Footer: "Conceptualized by" then "Mr Sajal Roy" and "Enterprise Systems Architect" as his stated role line — the standalone "Architect" label is removed.
- Footer session line becomes: "No login required. Every figure entered is held in browser memory for the duration of the session and is discarded when the tab closes."

## 6. Visitor analytics (both layers)

- Built-in Lovable analytics covers visits and traffic automatically once published — nothing to build, read from the dashboard.
- In addition, Lovable Cloud is enabled to record anonymous events: page visit, assessment started, assessment completed, integrated report generated. No user figures, no personal data, no identifiers — counts and timestamps only, so the zero-retention promise on entered figures still holds.
- A private `/analytics` page in the app shows totals and a simple trend: visits, starts, completions, completion rate, sector mix. Access is gated by a passphrase you set, since the app has no logins.

## Technical notes

- Files touched: `src/styles.css` (light palette, accent rotation, type scale), `src/routes/__root.tsx` (Sora + Manrope link), `src/components/lnt/Figures.tsx` (full-bleed hero composition, new section figures, fluid motion), `MetricCard.tsx`, `Stages.tsx`, `SiteChrome.tsx`, `AboutSections.tsx`, `src/routes/index.tsx`, `about.tsx`, `assess.tsx`, plus a new `src/routes/analytics.tsx` and a server function for event logging.
- Untouched: `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, all metric and Areas to Look Into text, numerals-only policy, Mail line.

## Sequence

1. Fonts and light palette tokens.
2. Home page layout, hero composition and de-numbering.
3. Section figures and fluid motion pass.
4. Copy and attribution corrections.
5. Analytics events, dashboard page and PDF colour check.
