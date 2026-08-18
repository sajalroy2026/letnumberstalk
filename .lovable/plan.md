# Flip-tile legibility, scroll fluidity, About colour correction

## 1. Flip tiles stop blurring (7 pillars and 5 industries)

The back face currently sits on a translucent, backdrop-blurred surface while the card is still animating in 3D, so the text reads crisply for a moment and then goes soft.

- Give both faces an opaque surface: drop `backdrop-filter` from the lucid tile and back-face styles, and raise the back plate to a solid card tint with a clear accent edge.
- Remove the persistent `will-change: transform` on the flipping card and clear the 3D transform once the turn settles, so the browser re-renders text at full sharpness instead of leaving a rasterised bitmap.
- Bump back-face type: full foreground ink, slightly larger size, comfortable line height, centred.
- Industry tiles get the same treatment as the pillar tiles — short, high-contrast briefs on an opaque plate.

## 2. Fluid scroll motion everywhere

- Single shared easing and a slightly longer, softer entrance for every scroll-revealed block on the home page (mandate cards, pillar grid, sector grid, closing sections) so elements glide rather than pop.
- Stagger children within each grid consistently instead of per-section ad-hoc delays.
- Section figures fade and drift in with the copy rather than appearing instantly.
- Reduced-motion preference still collapses everything to a plain fade.

## 3. About page colour correction

- "About LetNumbersTalk" narrative: no deck/plate, no blue tint. Plain text over the white page ground with a hairline rule for structure.
- Sector-calibration figure column: light, near-white surface so the animated diagram and its labels sit at strong contrast; tint only the thin rule and labels.
- "Conceptualized by" section: keep the architect card as the single demarcated deck (sand/gold). The narrative text beside it loses its plate entirely and loses the matching tint — plain text on white with a hairline separator above the methodology note.
- Disclosure block keeps a light accent edge but drops any heavy tint.

## Technical notes

- `src/styles.css`: opaque `lucid-tile` / `lucid-back`, remove backdrop blur, lighten `citrine-plate`, retire `sage-plate` / `mist-plate` usage, shared reveal easing tokens.
- `src/components/lnt/FlipTile.tsx`: clear `will-change`/transform after the spring settles.
- `src/routes/index.tsx`: unified reveal transitions and stagger; back-face typography.
- `src/components/lnt/AboutSections.tsx`: strip plates from narrative columns, keep architect deck.
- `src/components/lnt/SiteChrome.tsx`: soften disclosure tint.
