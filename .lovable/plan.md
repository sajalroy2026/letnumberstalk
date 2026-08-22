# Make the report download reliable on mobile

## What the test showed

I re-ran the flow on a phone-sized viewport (411x738, touch events, real taps) for all 7 pillars. In every case the Download report button was on top of the stack, received the tap, and fired the print call — no overlay intercepting it, no JavaScript errors. So the button itself is wired correctly for every pillar.

That means what you saw is not a per-pillar bug. It is the known weak spot of the current mechanism: the button calls the browser's native print dialog, and on phones that behaves inconsistently.

- In-app browsers (LinkedIn, Instagram, Facebook, some email apps) silently ignore the print call — nothing happens at all.
- iOS Safari routes it through the share sheet, which can take several seconds on a long report and looks like nothing happened.
- Android Chrome renders a print preview of a long, image-heavy document, which can stall briefly on slower devices.
- The button is 38px tall, just under the 44px minimum comfortable tap target, so a near-miss tap is possible.

## Changes to make

1. **Bigger, unmistakable tap target.** Raise the Download report button (and the Start a new session button beside it) to a minimum 48px height on small screens, with full-width layout on phones.

2. **Immediate visual feedback on tap.** On press, the button enters a short "Preparing report…" state so a slow print dialog never reads as a dead button.

3. **Detect when print is unavailable and say so.** If the browser blocks or ignores the print call (typical of in-app browsers), show a short inline notice under the button explaining that the report needs to be opened in Safari or Chrome, with a one-tap "Copy link" so the user can move it out of the in-app browser.

4. **Mobile hint line.** Under the button on small screens, a quiet line of copy: "Choose Save as PDF in the print dialog." This removes the ambiguity about what should happen next.

5. **Keep desktop behaviour identical.** No change to how the report prints or paginates — only the button's affordance and feedback change.

## Technical notes

- All work sits in the report stage of `src/components/lnt/Stages.tsx` plus small print/utility styles in `src/styles.css`. Scoring, content, and the print stylesheet stay untouched.
- Unavailability detection: call `window.print()` inside a try/catch and set a short timer that checks whether `beforeprint`/`afterprint` fired; if neither fires and no error surfaces within a couple of seconds, show the fallback notice rather than assuming failure outright.
- No new dependencies; still entirely client-side with nothing transmitted anywhere.

## Verification

After the change I'll re-run the mobile sweep across all 7 pillars, confirm the print call still fires on tap in each, and capture a screenshot of the button at phone width plus the fallback notice state.
