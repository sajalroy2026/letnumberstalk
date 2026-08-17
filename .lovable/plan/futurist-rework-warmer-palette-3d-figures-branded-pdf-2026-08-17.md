# Futurist Rework — Warmer Palette, 3D Figures, Branded PDF

Engine, formulas, benchmarks, bands and Areas to Look Into text stay untouched. Design, copy labels, motion and print styling only.

## 1. Header wording

"Practice" and "Commence" replaced with plain labels: "About" and "Start Assessment". Applied in the header, and any repeat of that language in hero CTAs and footer kept consistent.

## 2. Palette: warmer, brighter, blended

Keep the mid-century warmth but raise brightness, saturation and range so the system reads luminous rather than muted.

- Base warms up: brighter bone/ivory ground, softer putty, and a deep indigo-espresso ink (cooler, richer) for dark chapters.
- Accent family widened and brightened: amber, coral-rust, electric teal, chartreuse-ochre, magenta-plum, sky-cyan.
- Add gradient/blend tokens for luxurious transitions: aurora blends, dual-tone meshes, glass tints. Each band uses a different blend so no two sections feel alike.
- Each pillar keeps a dedicated accent, refreshed to the new brighter set, carried through metric accents, report bars and ring segments.
- All values as oklch tokens in `src/styles.css`; AA contrast rechecked on every band.

## 3. 3D figures and illustration layer — everything distinct

No two figures repeat a composition.

- Hero: layered depth composition with translucent glass planes, orbiting pillar bodies, refracted light and pointer/scroll parallax.
- Sector profiles: the current tiles get replaced with high-tech, modern compositions per sector — Services (network mesh of nodes), Manufacturing (extruded isometric line-flow), Retail/D2C (stacked translucent shelves with flow arcs), SaaS (recurring-wave lattice), Startup (ascending trajectory with fragile scaffolding). Each in its own colourway.
- Chapter plates, value chain, benchmark corridor, tier ladder and About spread each get their own bespoke figure — different geometry, different technique (wireframe, isometric, glass, particle field, contour lines).
- Built from SVG/CSS 3D transforms with transparency, blur and glow so they stay crisp and animatable.

## 4. Immersive futurist experience

- Scroll-driven depth: perspective containers, z-plane travel so sections feel like moving forward through space rather than sliding up.
- Translucency throughout: frosted panels, layered glass cards, transparent data overlays sitting over moving backdrops.
- Charts become cinematic events: dial sweeps, bars growing from a shared baseline, benchmark corridors drawing in, counters resolving.
- Section transitions vary deliberately — one section wipes, another dissolves through depth, another slides horizontally, another assembles from fragments.
- Long weighted easing, no bounce. Full `prefers-reduced-motion` fallback. Mobile keeps the same choreography at reduced depth.

## 5. Anti-uniformity pass

Every major section gets its own combination of ground colour, blend, figure technique and entry motion, audited end to end so the page never repeats itself while staying one system.

## 6. PDF / print fidelity

Print currently forces everything to white and strips gradients. Rework so the downloadable report carries the brand palette:

- Coloured report cover plate (ink ground, oversized score, pillar spectrum) printed with `print-color-adjust: exact`.
- Pillar accents, tier colours, bars, rings and the Caution block print in colour instead of flattening to greyscale/white.
- Body pages stay light-ground for readability, but with accent rules, coloured pillar headers and tinted Areas to Look Into blocks.
- Heavy grain/blur effects still suppressed so pages stay crisp; no content added or omitted.

## Technical notes

- Files touched: `src/styles.css` (palette, blends, band system, print block), `src/components/lnt/Figures.tsx` (new figure library), `MetricCard.tsx`, `Stages.tsx`, `SiteChrome.tsx`, `AboutSections.tsx`, `src/routes/index.tsx`, `about.tsx`, `assess.tsx`.
- Untouched: `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, all metric and Areas to Look Into text, numerals-only policy, Mail line, attribution copy.

## Sequence

1. Palette, blend and band tokens.
2. Figure library rebuild (hero, sectors, chapter plates, diagrams).
3. Scroll/depth choreography and per-section variation.
4. Report cover and data reveals.
5. Print stylesheet rework and PDF verification.
6. Mobile and reduced-motion pass.
