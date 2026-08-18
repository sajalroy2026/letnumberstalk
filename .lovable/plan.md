# Four targeted corrections

## 1. Hero radar marker faces outward
The orbiting triangle currently rotates 180 degrees so it points at the centre. Remove that offset so the marker points away from the centre while it travels its randomized orbit. Nothing else in the hero diagram changes.

## 2. Industry tiles: same treatment as the pillar tiles, with readable text
The 5 industry flip tiles keep their current layout but get the readability pass:
- Back face: shorter copy — a one-line brief plus 3-4 short calibration points instead of dense paragraphs, centred.
- Text colour moves to full-strength foreground (drop the faded `/70`, `/60` opacities), with the accent used only for the small eyebrow label.
- Slightly larger body size and tighter line length so the text reads at a glance.
- The lucid back panel is made more opaque so type sits on a solid enough ground for contrast; the same opacity lift applies to the pillar tile backs.

## 3. About page: real colour variation, less blue
Today three of the four card tints resolve toward steel/blue because they mix in `--steel` and heavy navy card colour. Rework so each card is visibly distinct and warm:
- Instrument narrative card: light sage/green tint.
- Figure column: light citrine/yellow tint.
- Architect card: warm sand/gold (kept as-is, deepened slightly for contrast).
- Practice narrative card: soft honey-to-pale-green tint — the steel component is removed entirely.
- Disclosure block: pale gold with a crimson edge, no blue.
All text stays on high-contrast foreground.

## 4. Footer note typography
The "No login required…" line moves to the display serif (Fraunces) at a larger, looser setting for a more premium feel, keeping full-strength foreground colour.

## Technical notes
- `src/components/lnt/Figures.tsx` — drop the `+ 180` in the marker rotation transform.
- `src/routes/index.tsx` — industry tile back-face copy and classes; pillar/industry back contrast.
- `src/styles.css` — retune `sage-plate`, `citrine-plate`, `mist-plate`, `disclosure-plate`, `lucid-back`.
- `src/components/lnt/SiteChrome.tsx` — footer note font.
