# LetNumbersTalk — 28-Second Cinematic Promo Film

A code-rendered motion-graphics film (not an AI text-to-video clip), so every number, pillar name, and colour is exactly the product's own. Output: a vertical 9:16 1080x1920, 30fps MP4 you can download and post.

Vertical-specific treatment: layouts re-composed for the tall frame — stacked type blocks, the radar instrument centred with figures entering from top and bottom edges, the 57-metric grid scrolling vertically through the lens, and safe margins kept clear of social-platform UI. No human figures anywhere; purely instrumentation, type, and geometry.

Nolan-grade illusion layer: match-cuts where a shape becomes a different object across the cut, inverted/mirrored frames that fold in on themselves, time-reversal beats (a collapse replayed backwards as a build), nested frames-within-frames pushing infinitely inward, and constant multi-directional superimpositions — ghost layers sliding in from left, right, top, and bottom simultaneously at different speeds, with occasional deliberate slow holds for contrast.

## Why code-rendered, not AI video

AI video invents visuals — it cannot render "57 metrics", "7 pillars", the radar instrument, or the Navy/Gold/Burnt Orange/Forest/Oxblood palette accurately. Building it in Remotion means frame-perfect typography, real data figures pulled from the product's own visual language, and unlimited re-cuts later.

## Creative direction

- Vibe: boardroom war-room meets high-tech instrumentation. Ink-navy ground, gold as the signal colour, burnt orange / forest / oxblood as sector accents.
- Rhythm: rapid-fire — most beats land in 12-18 frames (0.4-0.6s), with two deliberate slow holds (the 57-metric grid bloom, and the final logotype) so the eye can breathe.
- Motion system: z-plane travel (camera pushes *through* layers rather than cutting), superimposed ghost layers with additive blending, scanline/optic sweeps, numeric ticker rain, and mask-wipe transitions that carry a shape from one scene into the next.
- Typography: Fraunces display + Manrope body, matching the site.
- Silent by design (renders muted); reads fully on mute for social feeds.

## Scene sequence (~28s / 840 frames)

1. Cold open (0-2.5s) — black-navy void, ticker rain of financial figures rushing past camera, a single gold vector locks focus. Title flash: "Numbers Talk."
2. The problem beat (2.5-6s) — fragmented data shards drifting apart, superimposed labels flickering (revenue, churn, runway, concentration). Fast strobing cuts.
3. The instrument (6-11s) — shards snap into the 7-pillar radar/armature; camera orbits it in 3D; pillar names and their weights (22 / 20 / 18 / 15 / 13 / 7 / 5) stamp in on staggered frames.
4. Depth of the model (11-16s) — camera dives into one pillar; the 57-metric grid blooms outward (the slow hold); formula, benchmark band, and scoring band cards fan past the lens.
5. Sector calibration (16-20s) — 5 industry plates flip through in rapid succession, each recolouring the whole frame (Services / Manufacturing / Retail-D2C / SaaS / Startup).
6. The verdict (20-24.5s) — score counts up on a ring gauge, benchmark terrain rises underneath, "Areas to Look Into" cards stack in, then a print/report page assembles.
7. Close (24.5-28s) — everything collapses to a single gold point, then the logotype: "LetNumbersTalk", sub-line "By Mr. Sajal Roy", and "Free. No login. Runs entirely in your browser." Slow, held, confident.

## Technical approach

- New `remotion/` directory in the project (version-controlled, re-renderable later).
- `src/Root.tsx` registers one 840-frame composition; each scene is its own file under `src/scenes/`.
- Persistent layers (ticker rain, grain, vignette, optic sweep) run full-length behind the scene stack so cuts feel continuous rather than slide-like.
- Scene joins use `TransitionSeries` with wipe/clock-wipe/slide presentations, plus in-scene `Sequence` staggering for the half-second beats.
- Palette hex values converted from the site's OKLCH tokens so the film matches the live site exactly.
- Rendered headless via a programmatic render script; final file written to `/mnt/documents/letnumberstalk-promo.mp4`.
- Frame spot-checks at key moments before the full render.

## Notes and open items

- No audio track: the sandbox renderer encodes muted. If you want music, add it in any editor afterwards — the cut is beat-friendly at roughly 120bpm.
- The film is a standalone deliverable; nothing on the live site changes unless you later ask to embed it as a hero background.
- A 9:16 vertical re-cut for LinkedIn/Instagram can be rendered from the same source afterwards if you want it.
