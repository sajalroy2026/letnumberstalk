# Hero radar lift, true orbit, and fast centred tiles

Three targeted corrections on the home page. Everything else stays as it is.

## 1. Lift the radar diagram

The figure column currently stretches to the full hero height, which pushes the rings and
concentric circles low and leaves a bare crimson gap at the top where only the falling
numbers show.

- Align the figure column to the top of the hero grid instead of stretching it, and pull it
  up with a small negative top offset on desktop so the outer ring sits close under the
  header line.
- Keep the ticker-number layer aligned with the lifted figure so the two stay in register,
  and leave mobile/tablet spacing unchanged.

## 2. Make the marker truly orbit

The pointer group is rotated as a whole, which reads as spinning in place rather than
travelling around the rings.

- Drive the marker from a single continuously animating angle value, then position it on the
  orbit path by translating along that angle (radius held just inside the outer ring), with
  the triangle counter-oriented so it always points outward along the tangent.
- Speed: one full revolution in roughly 14 seconds — visibly fluid, neither crawling nor
  frantic.
- Randomised pattern: the orbit radius and angular pace vary gently over the cycle (a slow
  secondary oscillation), so successive passes never trace the identical sweep, while motion
  stays smooth and continuous with no jumps at the loop seam.
- Reduced-motion users keep a single static marker position.

## 3. Faster, centred, higher-contrast tiles

Applies to both the 7 pillar tiles and the 5 industry tiles.

- Flip speed: replace the slow soft spring with a brisk turn of about 0.4 seconds, keeping
  the depth lift so it still feels dimensional rather than flat.
- Vertical centring: back faces become centred flex columns so the metric lists and
  calibration briefs sit in the middle of the tile rather than crowding the top. Front faces
  are also balanced so the pillar name and figures read as one centred block.
- Contrast: back-face body text moves to full foreground ink (no reduced-opacity text), the
  back plate becomes more opaque so text never competes with the band behind it, and the
  eyebrow label keeps its accent colour at a readable weight.
- Text is centre-aligned on both faces for the pillar and industry tiles.

## Technical notes

- `src/components/lnt/Figures.tsx` — `OpticField`: marker rebuilt on a motion-value orbit
  (angle → x/y via `useTransform`) instead of a rotated group.
- `src/routes/index.tsx` — hero figure column alignment/offset; tile front and back face
  layout classes (centred flex, alignment, text colour).
- `src/components/lnt/FlipTile.tsx` — faster tween transition in place of the slow spring.
- `src/styles.css` — `lucid-back` opacity raised for readability; no palette changes.
