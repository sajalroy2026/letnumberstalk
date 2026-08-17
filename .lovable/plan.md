# Header, hero figure, and colour rework

## 1. Header line
Remove "The Business Health Instrument" from the header entirely. The top-left reads only:
`LetNumbersTalk — by Mr Sajal Roy`.

## 2. Replace the hero figure
Retire the circular pillar armature (and any donut/orbit/ring figure). The hero becomes a single composed piece built from the 7 pillars: each pillar is a card carrying its name and its own illustrative figure, and the seven together form the hero composition in 3D motion.

```text
      ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
      │ FINANCIAL│ │   RISK   │ │  MARKET  │ │OPERATIONS│
      │  ▙▟ ▂▂   │ │   ⛨      │ │  ⬗⬖      │ │   ⚙⚙     │
      └──────────┘ └──────────┘ └──────────┘ └──────────┘
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │ STRATEGY │ │ORGANISAT.│ │TECHNOLOGY│
         │   ➤      │ │  ⬢⬢      │ │   ⬒      │
         └──────────┘ └──────────┘ └──────────┘
```

- Seven cards, one per pillar: pillar name in small caps at the top, a bespoke illustrative figure beneath it, each card in its own pillar colour with extruded edge and depth shadow.
- Illustrations, drawn as angular mid-century marks (not icon-font clipart): ledger/vault block (Financial), shield (Risk), compass facet (Market), interlocking gear form (Operations), directional chevron (Strategy), linked cells (Organisation), circuit grid (Technology).
- The seven cards are arranged as one staggered 3D formation on a shared perspective plane — cards sit at slightly different depths and tilts so the set reads as a single hero object rather than a flat row.
- Motion: cards enter staggered with a depth push, each figure draws in with a stroke reveal, the formation tilts subtly toward the pointer, a slow light sweep crosses it, and the whole group drifts on scroll.
- Sized as the hero's dominant element, filling its column at full height; stacks into a compact grid on mobile with the same motion, reduced amplitude.
- No circles, arcs, orbits, rotation, bars, or percentage labels.




## 3. Multi-accent, oxblood-led
The dominant navy is demoted to structural chrome only.

- Header and footer stay navy.
- The page body below the header leads with oxblood as the primary accent.
- Section tones continue to rotate: oxblood, burnt orange, gold, forest, mocha — each section owns its own accent for rails, numerals, buttons, and gradients, so no single colour dominates.
- Text contrast rules stay as they are; each accent keeps a text-safe and a lifted variant.

## 4. Natural page scroll
Remove the sticky positioning from the site header so it scrolls away naturally with the page instead of hovering as a fixed pane. This also removes the overlap that was covering content during scroll.

## 5. "What the instrument delivers" tiles
- Switch the tile motion from slide-up to a scale-and-fade pop (each tile blooms from ~94% with a short stagger).
- Tighten the tile grid spacing so the four tiles read as one compact block.
- With the header no longer fixed, nothing overlays the tile copy during scroll.

## Technical notes
- `src/components/lnt/SiteChrome.tsx`: drop the instrument tagline span; remove `sticky top-0` from `<header>`.
- `src/components/lnt/Figures.tsx`: add a `PillarEmblems` figure (seven extruded panels, each with a bespoke SVG pillar symbol and stroke-reveal animation); remove `PillarArmature` usage from the home page.
- `src/routes/index.tsx`: swap the hero figure, reassign section tone classes to the oxblood-led rotation, change the DELIVERS tile animation to a pop and reduce grid gap.
- `src/styles.css`: make oxblood the default body accent, keep navy scoped to header/footer, verify each `.tone-*` pair retains AA contrast.
