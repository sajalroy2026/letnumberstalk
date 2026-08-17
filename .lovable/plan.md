# Header, hero figure, and colour rework

## 1. Header line
Remove "The Business Health Instrument" from the header entirely. The top-left reads only:
`LetNumbersTalk — by Mr Sajal Roy`.

## 2. Replace the hero figure
Retire the circular pillar armature (and any donut/orbit/ring figure). In its place, a prominent seven-panel emblem set — each pillar represented by its own custom symbol, no charts, no percentages:

```text
  ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐
  │  ▙▟    │   ⛨    │   ⬗⬖   │   ⚙    │   ➤    │  ⬢⬢    │   ⬒    │
  │ VAULT  │ SHIELD │ COMPASS│  GEAR  │ ARROW  │  CELLS │  GRID  │
  │ Finan. │  Risk  │ Market │  Ops   │ Strat. │  Org.  │  Tech  │
  └────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

- Seven upright panels side by side, each in its own pillar colour with 3D extrusion and depth shadow.
- Each panel carries a bespoke geometric symbol for its pillar — vault/ledger block (Financial), shield (Risk), compass facet (Market), interlocking gear form (Operations), directional chevron (Strategy), linked cells (Organisation), circuit grid (Technology) — drawn as angular mid-century marks, not icon-font clipart.
- The set is scaled as the hero's dominant element: full column height, large symbols that read at a glance, pillar names as small caps beneath.
- Symbols draw in with a stroke reveal, panels rise staggered, a slow light sweep crosses the set, and the group drifts gently on scroll.
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
