# Hero sweep, lucid tiles, About refinement

Four targeted changes. Everything else stays as it is.

## 1. Hero radar: replace the revolving stick

The sweep arm is currently a thin line on a single plane. Replace it with a more deliberate travelling marker:

- A small triangular pointer (apex outward) plus a larger luminous circular node riding near the outer ring, carried by the same rotation, with a soft decaying trail behind it.
- The bare straight line goes; the wedge trail stays but softens.
- The marker colour cycles through the pillar accents as it travels.
- Numerals, micro-labels and readouts inside the hero figure step up in size so they read as prominent instrument values.
- Reduced motion: marker parked at a fixed angle, everything static.

## 2. Pillar and industry tiles: lucid, transparent, floating

Front faces:
- Pillar name becomes the dominant element — larger display type, stronger contrast, occupying the tile rather than sitting as a caption. Weight percentage and metric count stay as secondary readings.
- Tiles get a floating treatment: translucent glass ground tinted from the band they sit on, soft elevation, a gentle lift and accent-edge bloom on hover.

Back faces:
- Solid accent fills are removed. The back reads as the same translucent panel, tinted from the local theme with a light scrim so text stays crisp.
- Text colour switches to the theme's foreground with an accent-tinted heading, sized for comfortable reading (no more small dense lists).
- Pillar backs show the leading metric names at readable size and close with "etc." rather than listing all of them.
- Industry backs keep the calibration brief, trimmed where needed to fit without scrolling.
- Flip transition softened: longer weighted turn with a slight depth lift, so it reads as a floating card turning rather than a panel snapping.

Applies identically to the 7 pillar tiles and the 5 industry tiles.

## 3. About page: tighten and refine

- Reduce the gap between the header strip and the "The instrument" opening block, matching the tightened rhythm on the home page.
- Type pass across the whole page: display face for headings and pull quotes, refined body scale and leading, tighter measure, stronger foreground contrast on paragraphs, credentials and the disclosure block.

## 4. Architect card treatment

The left-hand card on the About page carrying the name, role and credentials gets a premium light treatment:

- A very light sand-to-beige gradient ground with a fine accent hairline edge and a soft plate shadow.
- Deep ink text on that ground for high contrast; role line and credential markers in a warm accent.
- The monogram disc restyled to match the warmer ground.
- The surrounding column (paragraphs, methodology note) picks up a light complementary panel so the two sides read as a matched pair without competing.

## Technical notes

- `src/components/lnt/Figures.tsx` — radar marker rework in `OpticField`, readout type sizes.
- `src/routes/index.tsx` — pillar and sector tile front/back markup, translucent tokens instead of inline solid fills.
- `src/components/lnt/FlipTile.tsx` — softened flip timing and depth lift.
- `src/components/lnt/AboutSections.tsx`, `src/routes/about.tsx` — spacing, type scale, architect card treatment.
- `src/styles.css` — floating-tile and translucent back-face utilities, sand gradient token.
- No scoring, content, data-model or backend changes.
