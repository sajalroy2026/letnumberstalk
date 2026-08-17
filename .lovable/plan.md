# Header, hero figure, and colour rework

## 1. Header line
Remove "The Business Health Instrument" from the header entirely. The top-left reads only:
`LetNumbersTalk — by Mr Sajal Roy`.

## 2. Replace the hero figure
Retire the circular pillar armature (and any donut/orbit/ring figure on the home page). In its place, a seven-panel pillar composition — no percentages, no weighting bars:

```text
  ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐
  │ FINAN. │  RISK  │ MARKET │  OPS   │ STRAT. │  ORG.  │  TECH  │
  │  ▁▃▅█  │  █▅▃▁  │  ▃█▅▂  │  ▂▅█▃  │  ▅▃█▂  │  ▃▂▅█  │  █▃▂▅  │
  └────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

- Seven upright panels standing side by side, one per pillar, each in its own pillar colour with a subtle 3D extrusion and depth shadow.
- Each panel carries the pillar name and a small abstract signal motif (stepped bars / a short trace line) — indicative texture, no figures or ratios.
- Panels rise in staggered on load, with a slow scan-line sweep crossing the set and a light drift on scroll.
- No circles, arcs, orbits, rotation, or percentage labels anywhere in the hero.


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
- `src/components/lnt/Figures.tsx`: add a `PillarPanels` figure (seven extruded upright panels with pillar names and abstract signal motifs); remove `PillarArmature` usage from the home page.
- `src/routes/index.tsx`: swap the hero figure, reassign section tone classes to the oxblood-led rotation, change the DELIVERS tile animation to a pop and reduce grid gap.
- `src/styles.css`: make oxblood the default body accent, keep navy scoped to header/footer, verify each `.tone-*` pair retains AA contrast.
