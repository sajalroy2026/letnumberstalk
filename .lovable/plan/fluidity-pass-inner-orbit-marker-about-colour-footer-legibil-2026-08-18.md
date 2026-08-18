# Fluidity pass, inner-orbit marker, About colour, footer legibility

## 1. Global motion polish
Make the whole site feel like one continuous, modern cinematic surface:
- Standardise on a single easing curve and slightly longer, softer entrances for scroll-revealed sections, so nothing snaps.
- Add gentle spring physics to interactive elements (tiles, buttons, cards) instead of linear transitions.
- Smooth scrolling behaviour and consistent hover lift/settle on plates and buttons.
- Keep flip tiles brisk, but give them spring settling rather than a hard stop.
- Reduced-motion preference continues to collapse everything to simple fades.

## 2. Hero radar marker on the inner orbit
Move the travelling triangle-and-dot from the outer ring family to an inner ring, and orient the triangle inward so it points toward the readings and figures at the centre. Motion stays fluid and lightly randomised, with the same speed feel as now.

## 3. About page colour families
Only the architect card currently reads as premium. Give each card its own light, gradient-tinted plate with contrast-checked text:
- Architect card: keep as is (sand/gold).
- "The instrument" narrative card: light sage-green plate, deepened tint so the gradient is visible.
- Figure column: light citrine/sand plate, warmed slightly.
- "The practice" narrative card: a third light family (soft steel/sage blend) so no two adjacent cards match.
- Disclosure block: light tinted plate with an accent edge instead of plain card white.
Text sits at full foreground ink on all of them for readability.

## 4. Footer note size
Increase the "No login required…" line from extra-small to a comfortable small/base size with relaxed line height and wider measure, so it reads clearly and spans the bottom.

## Technical notes
- `src/styles.css`: strengthen `sage-plate` / `citrine-plate` tints, add one new plate utility for the practice card and a tinted disclosure variant, add shared motion tokens/hover utilities.
- `src/components/lnt/Figures.tsx`: reduce `orbitRadius` to the inner ring band and rotate the marker to face inward.
- `src/components/lnt/AboutSections.tsx`, `SiteChrome.tsx`: apply new plate classes; bump footer note typography.
- `src/routes/index.tsx`, `FlipTile.tsx`: spring transitions for reveals and flips.
