# Home page: tighter hero, terminal number rain, flip tiles

Five targeted changes. Everything else on the site stays exactly as it is.

## 1. Tighten the gap under the header

Reduce the hero section's top padding so the "Diagnostic intelligence for boardroom leaders" line sits close beneath the header strip — a subtle breathing gap rather than a wide void. Bottom spacing and the rest of the section rhythm stay unchanged.

## 2. Better display font for the hero headline

"Let the numbers state the condition of the business." gets a more premium display treatment: a distinct display face with tighter tracking, refined optical sizing and slightly heavier weight, applied to the H1 (and matched on section headings only where needed for consistency). Colour and contrast stay as-is.

## 3. Hero figure: Bloomberg/Matrix number rain + larger readouts + radar

- Add a new ambient layer behind and around the hero figure: vertical columns of financial tickers that fade in, hold, and fade out at randomised intervals and speeds — values like `3B`, `5M`, `200K`, `70%`, `1.4x`, `18d`.
- The layer is masked so it only occupies the empty space around the central instrument: no overlap with the headline column, and it dims to near-nothing behind the instrument itself.
- Column timing is synchronised to the same easing/cadence as the existing hero motion so it reads as one composition, not noise.
- Enlarge the numerals and micro-labels already inside the hero figure so they read as prominent, deliberate instrument readouts.
- Replace the circular sweep motion with a radar-style element: a polar grid with concentric range rings, radial spokes, a rotating sweep arm with a decaying trail, and contact blips that pulse as the sweep passes them — colour-cycled across the pillar accents.
- Respects reduced-motion: static composition with the tickers held at fixed values.

## 4. Pillar tiles flip to reveal metric names

The 7 pillar tiles in "The 7 pillars" become clickable cards that flip in place (3D Y-axis flip) to a back face listing that pillar's metric names, sourced from existing metric content. Tile size, grid and spacing stay identical; back-face text scales down and wraps to fit, on a solid tinted ground with AA contrast. Click or keyboard (Enter/Space) toggles; a small hint marker indicates the tile is interactive.

## 5. Sector tiles flip to reveal an industry brief

The 5 industry profile tiles get the same flip interaction. Each back face carries a short, high-register brief on that sector: its economic shape, what the benchmark set is calibrated to, and one or two illustrative business types. Written in boardroom/technical register consistent with the rest of the site. The sixth (non-sector) card in that grid stays as it is.

## Technical notes

- `src/routes/index.tsx` — hero padding, headline class, pillar and sector grids swapped to new flip-card components.
- `src/components/lnt/Figures.tsx` — new `TickerRain` layer, radar rework of `OpticField`, larger readout type.
- New `src/components/lnt/FlipTile.tsx` — reusable flip card (front/back, click + keyboard, reduced-motion fallback to crossfade).
- Sector brief copy added as a small constant map keyed by sector id; pillar metric names read from `METRIC_CONTENT`.
- `src/styles.css` — display font stack refinement and the `preserve-3d` / backface utilities for the flip.
- No scoring, data-model or backend changes.
