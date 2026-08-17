# Hero Optics, About Imagery, Attribution and Crimson Gradient

## 1. New hero element — continuous cinematic optics

Retire the seven-segment pillar dial from the hero. In its place, a continuously moving optical instrument field that fills the figure column edge to edge with no empty margins and no overlap with the copy column:

- A slow, always-running composition: concentric measurement rings drifting at different speeds, a scanning sweep line, a live data ribbon (a smooth curve that keeps redrawing), and small drifting numeric readouts and tick marks.
- Motion never stops and never resets abruptly — continuous loops, gentle parallax on pointer, reduced-motion users get a still frame.
- Contextual to the product: the readouts are diagnostic in character (score-like figures, benchmark bands, a rising health curve), not decorative noise.
- Sized to the full height of the hero copy so the two columns balance; on mobile it sits below the copy at full width with the same fill behaviour.

## 2. About page contrast and gravitas

- Raise body text from the faded `foreground/85` and `muted-foreground` treatments to full-strength foreground tokens on the About page: the platform paragraphs, the practice paragraphs, the credentials list, the methodology note and the disclosure block all read at strong contrast.
- The disclosure panel gets a solid surface with a defined border and a heading that sits at readable weight rather than a low-contrast micro-caption.
- Rewrite the disclosure and the architect/practice copy in heavier boardroom register: affirmative, institutional, precise — the standard of a partner-issued note. No "not this, not that" constructions.

## 3. Attribution typography

"By Mr. Sajal Roy" currently renders in tracked all-caps, which reads as "BY MR. SAJAL ROY". Set it in normal sentence case with medium/semibold weight and normal letter-spacing wherever it appears, so the punctuation and capitalisation read exactly as written. Applies to the header and any other occurrence.

## 4. Visible crimson gradient

The dark red chapters currently carry a lift so slight it is invisible. Strengthen it into a clearly perceptible mid-band gradient: deep crimson at the top edge, a distinctly brighter crimson through the middle, returning to deep crimson at the bottom — still one dark red field, no hue shift, no banding. The gradient applies to the dark red ground itself, not only when a wash class is present, so every crimson chapter shows it. Print styles keep it off.

## 5. About page imagery replacement

Remove the horizontal pillar-weight bar figure. Replace it with a contextually apt illustration set:

- A layered "instrument stack" figure — sector calibration plane, metric intake plane, scoring plane, report plane — rendered in perspective with slow continuous motion, expressing how a figure travels from ledger to diagnosis.
- A second smaller figure beside the practice section: a benchmark band diagram showing a reading resolved against a healthy range.
- No pillar percentages restated in either figure; the text already carries them.

## Technical notes

- `src/components/lnt/Figures.tsx`: replace `PillarEmblems` with a new continuous `OpticField` hero composition (SVG + motion loops, `useReducedMotion` guard, rounded coordinates to avoid hydration mismatch); remove `PillarWeightRing` usage and add `InstrumentStack` and `BenchmarkBand` figures.
- `src/routes/index.tsx`: swap the hero figure, ensure the figure column stretches to the copy height.
- `src/components/lnt/AboutSections.tsx`: contrast token pass, figure swap.
- `src/lib/assessment/content.ts`: rewrite `DISCLOSURE.body`, `ABOUT_ARCHITECT.paragraphs` and `METHODOLOGY_NOTE` at higher gravitas.
- `src/components/lnt/SiteChrome.tsx`: attribution set to sentence case, semibold; disclosure block contrast.
- `src/styles.css`: strengthen the crimson band gradient on `.plum-band` itself.
- Verify with rendered screenshots at desktop and mobile widths: hero fill and no overlap, About contrast, crimson gradient visible.
