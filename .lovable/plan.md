# Hero Split, Header Contrast, Copy Lift, Multi-Accent Pass

## 1. Hero: figure beside the text, never behind it

Today the pillar armature is absolutely positioned across the whole hero, so the headline and paragraph sit on top of it and readability suffers.

- Restructure the hero into a two-column composition: copy column on the left, figure column on the right, each in its own space with no overlap.
- The armature moves into the right column, sized to fill that column, with its own continuous rotation and depth drift — its motion becomes an independent element rather than a backdrop.
- The legibility scrim behind the copy is removed, since nothing sits under the text anymore. Ambient layers (signal field, corridor lattice) stay, but at low amplitude and confined to the figure side and the outer margins.
- On mobile the columns stack: copy first, figure below it at reduced height, so text is never overlaid.

## 2. Header buttons contrast

The header sits inside a dark hero wrapper, which drains the "About" and "Start Assessment" controls of contrast.

- Header gets its own explicit surface and foreground tokens instead of inheriting the hero's dark subtree.
- "About" becomes a clearly legible link with an accent underline on hover; "Start Assessment" becomes a solid accent button with a checked foreground pairing so it reads at a glance on both light and dark grounds.
- Focus rings and hover states verified against both grounds.

## 3. Hero copy — higher gravitas

Replace the three hero paragraphs with a more assured, affirmative register: an opening line stating the proposition, a second passage naming the instrument's substance (54 sector-benchmarked metrics, 7 weighted engines, pillar scores, the Integrated Business Health Score, value-chain attribution, terminal-risk disclosure on runway and concentration), and a closing line on standard, immediacy, openness and in-browser computation. Written as declarative statements throughout, no hedging and no negative framing. Section subheads across the page get the same lift where they currently read flat.

## 4. Multiple accents everywhere, in contrast

- Every chapter, plate, card and control draws from the rotating accent cadence — navy, gold, burnt orange, forest green, mocha/oxblood — instead of resolving to navy in most places.
- Extend the rotation to component surfaces, not just rules and numerals: card top-rails, badge fills, button variants, chart strokes, hover states and section grounds each take the active chapter accent.
- Introduce accent-to-accent gradients (navy→forest, gold→burnt, burnt→mocha) for hero plate, chapter dividers, buttons and figure fills so the page reads as a blended system.
- Add a mocha token to the family alongside the existing five, with a text-safe value and a lifted value.
- Contrast audit on every new pairing: body copy AA minimum on all accent grounds, buttons and badges checked for both light and navy backdrops.

## Technical notes

- Touched: `src/routes/index.tsx` (hero layout split, copy, chapter tone assignment), `src/components/lnt/SiteChrome.tsx` (header surface and nav controls), `src/styles.css` (mocha token, accent gradients, per-tone surface/button variables), `src/components/lnt/Figures.tsx` (armature sized for a column rather than full-bleed), and `MetricCard.tsx` / `Stages.tsx` for accent-driven surfaces.
- Untouched: scoring logic, metric content, benchmarks, bands, Areas to Look Into text.
