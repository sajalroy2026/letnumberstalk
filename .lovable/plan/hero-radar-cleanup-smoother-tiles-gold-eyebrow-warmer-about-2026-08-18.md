# Hero radar cleanup, smoother tiles, gold eyebrow, warmer About

Four targeted changes. Everything else stays exactly as it is.

## 1. Hero instrument (home)

- Remove the stray sweeping line/curve that spreads across the field — the loose diagnostic
  trace and its sweep wedge come out entirely, leaving the rings, tick lattice, readouts and
  the travelling marker.
- The triangle + luminous dot marker currently travels only across the upper-left arc.
  It will orbit the full 360 degrees of the radar, on a continuous loop with a slower,
  gentler cadence (roughly 24–30s per revolution) plus a slight easing variation so the pass
  reads as uneven rather than mechanical.
- Reduced-motion users keep a static marker.

## 2. Tile flip smoothness (home)

- Slow and soften the flip: longer duration with a single continuous spring-like easing, no
  mid-flip snap, and the depth lift/scale eased on the same curve so the card feels like it
  floats through the turn rather than switching faces.
- Back-face content fades in slightly behind the rotation so no text is caught mid-turn.
- Applies to both the pillar tiles and the industry tiles.

## 3. Hero eyebrow line (home)

- Copy becomes "Diagnostic intelligence for Founders and Boardroom Leaders".
- Rendered in gold with tighter letter-spacing, slightly larger type and heavier weight so it
  is prominent and clearly legible on the crimson ground.

## 4. About page colour and contrast

- Add light, premium accent washes: soft sand/light-yellow and a muted sage-green tint applied
  as very subtle gradients across the section cards, alternating so no two adjacent cards share
  the same tint, keeping the blue-and-white base intact.
- The architect card gets a stronger read: body text, credential list and role line move to full
  ink foreground weights instead of the current translucent tones, on the warm sand plate.
- Section eyebrows and hairlines pick up the matching accent so the vibrancy carries through.

## Technical notes

- `src/components/lnt/Figures.tsx` — `OpticField`: delete the curve path and sweep gradient
  usage, rewrite the marker animation to a full-circle rotation with slower duration.
- `src/components/lnt/FlipTile.tsx` — retune the flip transition and back-face fade.
- `src/routes/index.tsx` — eyebrow copy and its typography classes.
- `src/components/lnt/AboutSections.tsx` and `src/styles.css` — new light tint utilities
  (sand / sage) and contrast lifts inside the architect card.
