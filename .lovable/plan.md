# Brighter, Higher-Contrast, Multi-Accent Futurism

Engine, formulas, benchmarks, bands and Areas to Look Into text stay untouched. Design, typography, copy framing and motion only.

## 1. Rotating accent system

Today one rust accent carries most of the page. Instead, accents rotate by chapter and by element.

- Each major section binds its own local accent pair (accent + accent-glow) through a scoped class, so headers, rules, numerals, CTA underlines, chart strokes and figure highlights all shift together as the reader moves down the page.
- Rotation order across the home page, About and the assessment flow: teal → amber → magenta-plum → cyan → lime-ochre → coral, never two neighbours alike.
- Pillar accents stay fixed (colour as information); decorative accents rotate around them.
- Buttons, focus rings, badges and progress rails inherit the local accent rather than a global one.

## 2. Readability and typography

- Body text moves off the serif-adjacent stack to a high-legibility geometric-humanist sans with true optical sizing; display stays editorial for headlines only.
- Raise body size and line-height (base 17px equivalent, 1.65 leading), tighten measure to ~68 characters.
- Contrast pass: every foreground/background pairing audited to AA at minimum, AAA for body copy on light bands. Muted foreground darkened, `text-muted-foreground` on dark bands lightened.
- Remove text sitting directly over busy figures — figures go behind a legibility scrim or move out of the text column.
- Scanline/grain opacity reduced further behind any text block.

## 3. Affirmative framing throughout

Every "not this, not that" construction rewritten as a positive statement. Examples:

- "A weighted diagnosis, not a survey result" → "A weighted diagnosis built from your operating figures".
- "Diagnostic, not prescriptive" → "Diagnostic in language, evidence-led throughout".
- "Read like a discovery call, not a questionnaire" → "Reads like a discovery call".
- "figures entered are held, not scored" → "figures entered are held for reference; scoring begins at the critical minimum".
- Sector line, privacy line, caution line and footer all restated affirmatively.

Full sweep across home, About, assessment stages, report and footer.

## 4. Brighter ground

- Dark ink chapters reduced to short punctuation moments (hero band and report cover only); everything else on luminous ivory, sun, mint and blush grounds.
- Glass panels get higher opacity and brighter tints so text on them stays crisp.
- Dark-on-light becomes the default reading mode across the flow.

## 5. Optical, cinematic motion

- Numerals count and re-settle on entry; metric readings resolve digit by digit.
- Charts animate as events: bars grow from a shared baseline, benchmark corridors draw in, ring segments sweep, sparklines trace.
- Ambient figure motion — slow orbit drift, lattice parallax, prism rotation — running behind sections at low amplitude.
- Section entries vary: depth travel, horizontal wipe, fragment assembly, focus-pull blur-to-sharp.
- Long weighted easing, no bounce. Full `prefers-reduced-motion` fallback; mobile keeps choreography at reduced amplitude.

## Technical notes

- Files touched: `src/styles.css` (accent rotation classes, type scale, contrast tokens, brighter bands), `src/routes/__root.tsx` (font link), `src/components/lnt/Figures.tsx` (ambient motion, animated chart primitives), `MetricCard.tsx`, `Stages.tsx`, `SiteChrome.tsx`, `AboutSections.tsx`, `src/routes/index.tsx`, `about.tsx`, `assess.tsx`.
- Untouched: `scoring.ts`, `engine.ts`, `spec.generated.ts`, `types.ts`, all metric and Areas to Look Into text, numerals-only policy, Mail line, attribution copy.

## Sequence

1. Type stack, scale and contrast tokens.
2. Accent rotation system and brighter band assignment.
3. Affirmative copy sweep.
4. Animated chart primitives and ambient figure motion.
5. Section transition variation.
6. Mobile, print and reduced-motion verification.
