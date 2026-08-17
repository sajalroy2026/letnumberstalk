# Hero Panels, True Crimson, and High-Contrast Controls

Three corrections: rebuild the hero pillar figures as architectural panels rather than pale sticky cards, make oxblood read as a true deep crimson, and restore the high-contrast gold-led control system across the page.

## 1. Hero figures — architectural panels

The seven pillar cards currently read as tinted paper notes: near-white grounds, tinted labels at low contrast, and a random rotation on each card.

Rework them into deep instrument panels:

- Each panel gets a saturated ground in its own pillar colour (deep navy, crimson, steel, burnt orange, gold-bronze, forest, ink) instead of a near-white tint.
- Labels sit in ivory/near-white on that deep ground — the pillar name becomes clearly legible at small size, with a weight increase and tighter tracking.
- The pillar mark is drawn in the panel's lifted counterpart colour (the glow value) so it separates from the deep ground.
- Drop the per-card tilt rotation. Panels align to a strict grid on a single perspective plane; depth and stagger come from z-offset and entry timing, keeping the formation deliberate rather than scattered.
- Each panel carries only the pillar name and its bespoke figure — no weighting percentages anywhere in the hero.


## 2. Oxblood becomes true crimson

The oxblood family is currently a muted brick. It moves to a deep crimson red:

- Deepen and saturate the oxblood tokens so the accent reads unmistakably crimson on light grounds, and its lifted counterpart reads crimson (rather than salmon) on navy.
- The hero band's ground moves off the washed pink toward a warmer, denser crimson-tinted ground with a stronger radial depth wash, keeping body text at AA or better.
- Rules, numerals, badges and figure strokes inside the hero chapter pick this up automatically through the existing tone system.

## 3. Contrast across controls and figures

- Accent buttons return to the solid, high-contrast gold-led treatment with a dark type colour on gold and a crimson/forest counterpart on secondary controls — reinstating the previous legibility level while keeping the multi-accent rotation.
- Secondary/outline controls gain a heavier border and a filled hover state instead of a faint tint.
- Statistic numerals, section eyebrows and card headings across the home page chapters are checked against their new grounds and shifted to the text-safe family variants where any fall short.

## Technical notes

- `src/styles.css`: retune `--oxblood-core` / `--oxblood-glow`, deepen `.plum-band` ground and depth gradient, strengthen `btn-accent` and `btn-ghost-accent`.
- `src/components/lnt/Figures.tsx`: rework `PillarEmblems` panel styling (deep ground, ivory type, weight numeral, no per-card rotation).
- `src/routes/index.tsx`: verify eyebrow, stat and heading tones against the deepened hero ground.
- Verify with a rendered screenshot pass at desktop and mobile widths before finishing.
