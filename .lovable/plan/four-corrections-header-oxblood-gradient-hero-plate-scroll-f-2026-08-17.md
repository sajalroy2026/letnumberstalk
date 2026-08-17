# Four Corrections: Header, Oxblood Gradient, Hero Plate, Scroll Freeze

## 1. Header attribution punctuation

Header currently reads "by Mr Sajal Roy". Change it to "By Mr. Sajal Roy" — capital B, period after Mr. Same treatment applied wherever this exact header line appears.

## 2. Slight gradient in the dark red chapters

The oxblood ground is presently flat. Add a subtle mid-way lift: a single soft vertical/radial pass that brightens the middle of the band by a small amount and returns to the deep base at top and bottom. The band still reads as one dark red field — no colour shift, no visible banding, no change to text tokens or contrast.

## 3. Hero figure without the navy plate

Remove the navy backing plate from the hero dial: no dark rectangle, no plate border, no grid or depth wash behind it. The seven pillar segments, ticks, labels and centre mark stay exactly as they are in shape, size, order and motion, now sitting directly on the hero ground. Label and segment colours are re-checked against the lighter hero ground so every label keeps strong contrast; the pointer-driven tilt and the sequential sweep-in remain.

## 4. Natural scrolling during the assessment

While entering metric values, the pillar identity strip currently pins to the top and behaves as a freeze pane. Make it scroll away with the page like ordinary content, so the metric list scrolls naturally on both desktop and mobile. The step/progress chrome above it is reviewed at the same time so nothing else remains stuck.

## Technical notes

- `src/components/lnt/SiteChrome.tsx`: wordmark line to "By Mr. Sajal Roy".
- `src/styles.css`: `.plum-band` gets a gentle `background-image` gradient (kept out of print styles, which already force it off); everything else in the band is unchanged.
- `src/components/lnt/Figures.tsx`: strip the plate wrapper's background, border and grid in `PillarEmblems`, keep the perspective/tilt wrapper and the SVG dial; adjust label fill for the lighter ground.
- `src/components/lnt/Stages.tsx`: drop `sticky-under-rail` / `sticky-under-header` positioning from `PillarIdentityRail` and the sibling strip so they flow with the page.
- Verify with rendered screenshots at desktop and mobile widths: hero without a plate, band gradient, and a scroll pass through a pillar's metric entry.
