# LetNumbersTalk — Cinematic Editorial Rebuild

Engine, formulas, benchmarks, bands and Areas to Look Into text stay untouched. This is a design, copy and interaction rebuild.

## 1. Colour: from duotone to a warm mid-century system

Replace the single navy/sand identity with a warm, multi-tone palette used as an atmosphere system, not a corporate swatch set.

- Base warm neutrals: bone `#F4EEE4`, warm putty `#E4D9C7`, deep espresso ink `#241C16`.
- Expressive accents, each owning a chapter of the experience: burnt orange `#C2572B`, deep teal `#1E6F66`, mustard ochre `#D9A227`, oxblood `#7A2E2A`, sky slate `#7FA6B8`.
- Each of the 7 pillars gets its own assigned accent, carried consistently through its chapter plate, its metric accents, its bar in the report spectrum and its ring segment — so colour becomes information, not decoration.
- Section bands alternate temperature (bone → espresso → putty → teal-tinted) so scrolling changes environment rather than repeating one surface.
- All values added to `src/styles.css` as oklch tokens; no hardcoded colour in components. AA contrast checked on every band.

## 2. Illustration and figure layer

Art-directed, geometric mid-century illustration — flat planes, halftone grain, limited palette, long shadows — never generic SaaS spot art.

- Hero: a layered spatial composition (boardroom-table abstraction with orbiting pillar planes) built as parallax layers reacting to scroll and pointer.
- Human presence: 3-4 stylised figure illustrations (operator at a ledger, boardroom pair reviewing a spectrum, an assessor tracing a value chain) used at chapter openings and in the About spread.
- Each of the 5 sector profiles gets a full illustrated tile, not a glyph.
- Value chain, benchmark scale and tier ladder redrawn as editorial diagrams with type set into the artwork.
- Illustrations generated as assets and composed with SVG/CSS layers so they stay crisp and animatable.

## 3. Data as the design language

- Oversized numerals as visual anchors: pillar weights, metric counts and scores set at display scale in mono, bleeding into the composition.
- Score reveal becomes a spatial event — dial sweeps, weight ring assembles segment by segment, pillar spectrum bars grow from a shared baseline with staggered timing.
- Report cover: full-bleed espresso plate with the integrated score at extreme scale, the 7 pillar bars fanned beneath, Caution block in oxblood when triggered.

## 4. Cinematic scroll and motion

- Scroll-driven transforms throughout: layered parallax depth, z-plane chapter plates that push back with depth blur as content enters, counters and charts that animate on entry.
- Sticky-scroll sequences: the pillar chapter plate holds while its intro text advances; the report cover holds while the score resolves.
- Long, weighted easing; no bounce. Full `prefers-reduced-motion` fallback to plain fades.
- Mobile parity: same choreography at reduced depth, tuned for 375px.

## 5. Copy rework (boardroom register)

- **Hero line replaced.** New lede states what LetNumbersTalk delivers: a structured diagnostic that converts figures already held in the accounting system, CRM, payroll register and operations log into a sector-calibrated read of enterprise health across 7 weighted pillars — naming where the business is durable, where it is quietly fragile, and the sequence in which those findings warrant attention. Framed as decision intelligence, not a scoring tool.
- Every mention of the platform reframed to business impact and conceptualisation — diagnostic instrumentation, value-chain attribution, calibrated benchmark corridors, weighted composite health — drawn from the PRD's stated intent.
- **Architect section:** "designed by" → "conceptualised by". Removes "working with founders…"; replaced with: Mr Sajal Roy builds and runs systems that help founders and boardroom leaders with decision intelligence — then continues with the existing practice paragraph unchanged.
- Numerals-only policy and the Mail line retained.

## 6. Behaviour fixes

- **Scroll restoration:** every stage advance — sector → pillars, pillar → pillar, final pillar → report, and the score/results reveal — resets the window to the top. Currently only an in-container `scrollIntoView` runs on pillar index change, so generating a score leaves the viewport at the bottom. Replaced with an explicit window scroll-to-top on every stage and index transition, respecting reduced motion.
- **Pillar rail pinning:** the active pillar identity block (name, weight, coverage) currently scrolls away. It becomes part of the sticky header stack beneath the site header, condensing to a compact bar on scroll and staying visible for the whole pillar.

## Technical notes

- Files touched: `src/styles.css` (palette + band system), `src/components/lnt/Figures.tsx` (illustrated compositions, scroll-driven charts), `MetricCard.tsx`, `Stages.tsx` (sticky pillar rail, scroll reset, report cover), `SiteChrome.tsx`, `AboutSections.tsx`, `src/lib/assessment/content.ts` (About copy only), `src/routes/index.tsx`, `about.tsx`, `assess.tsx`, plus new illustration assets under `src/assets`.
- Untouched: `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, and all metric/Areas text.
- Print stylesheet updated so coloured bands flatten cleanly for the PDF with all content intact.

## Sequence

1. Palette and band/token system.
2. Illustration assets and figure library rebuild.
3. Home rebuild with new hero copy and scroll choreography.
4. Assessment flow: sticky pillar rail, scroll reset, chapter plates, metric card treatment.
5. Report cover and data reveals.
6. About/footer copy rework, print fidelity, mobile and reduced-motion pass.
