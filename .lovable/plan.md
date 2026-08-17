# Hero Instrument Dial and a True Oxblood Ground

Two corrections: replace the seven asymmetric panels with a single unified hero figure, and make the oxblood chapter a flat, deep dark red instead of a light crimson wash.

## 1. Hero figure — one instrument, not seven boxes

The current hero renders seven separate rectangles in a 2/3-column grid, so the last card spans oddly and the small ivory labels on mid-tone grounds read weakly.

Replace it with a single cohesive figure: a deep navy instrument plate holding a radial seven-segment dial.

- One dark navy plate with a fine grid and a soft depth wash — a single object, so nothing looks asymmetric.
- Seven segments arranged around a common centre, each sized by its pillar weighting and drawn in that pillar's lifted (glow) colour on the dark ground — full separation, no pale-on-pale.
- Segment labels sit outside the ring in ivory at a readable size with clear tracking; the pillar name is the only text, no percentages.
- The centre carries a quiet mark — metric count and pillar count as figures only.
- Motion: segments sweep in sequentially on load; the whole plate keeps the pointer-driven 3D tilt; hovering a segment lifts and brightens it and raises its label.
- Mobile: the dial scales down as one unit and keeps the same proportions, so mobile matches desktop.

## 2. Oxblood becomes a flat, dark red ground

- Replace the light pink-tinted `.plum-band` with a genuinely deep oxblood ground: dark red base, ivory/near-white body type, and no gradient on the ground itself (flat colour).
- Cards, rules and borders inside that chapter shift to the dark-ground variants so contrast stays AA or better.
- Gradients remain available elsewhere on the page (buttons, figures, other chapters) so the flat red band reads as a deliberate, sophisticated pause rather than a style break.
- Deepen `--oxblood-core` itself so the accent reads as dark red wherever it appears on light grounds.

## Technical notes

- `src/components/lnt/Figures.tsx`: retire `PillarEmblems`' grid of panels; build a single SVG `PillarDial` (arc segments generated from `PILLAR_META` weights, glow colours per pillar) inside the existing perspective/tilt wrapper.
- `src/styles.css`: flatten `.plum-band` (remove `--gradient-depth`, dark background, light `--foreground`, `--card`, `--border`, `--muted-foreground`); retune `--oxblood-core` / `--oxblood-glow` to a darker red.
- `src/routes/index.tsx`: swap the hero figure import and verify eyebrow/stat/heading tones against the darkened band.
- Verify with rendered screenshots at desktop and mobile widths before finishing.
