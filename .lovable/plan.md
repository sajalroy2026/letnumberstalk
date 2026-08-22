# Download report in Instagram's in-app browser — technical assessment

## Finding

There is nothing broken in the code. The automated sweep across all 7 pillars, on a phone-sized touch viewport, showed the Download report button receiving the tap and firing the print call every single time, with no errors. Your own test confirms it: the same link works in mobile Chrome and fails only when opened from an Instagram story.

The cause sits outside the app. Instagram (and Facebook, LinkedIn, TikTok) render links in an embedded webview, not a real browser. Those webviews do not implement the browser print pipeline, so the call to open the print/Save-as-PDF dialog is discarded silently — no error is raised, nothing is thrown, and the page has no reliable way to know it was ignored. No backend, server, hosting, or configuration change can turn that dialog on; it does not exist in that webview.

## What can actually be done

Given you want no appearance or structural change, the honest answer is: one small, invisible code change is possible, and everything beyond it would alter the UI.

**Option A — leave the code exactly as is.**
The button is correct. Anyone who opens the link in Safari or Chrome gets the report. Instagram users can already use the webview's own "Open in browser" menu item. Zero risk, zero change.

**Option B — silent in-app-browser fallback (no visual change).**
Inside the existing click handler only, detect an in-app webview from the user agent (Instagram, Facebook, LinkedIn, TikTok, Snapchat markers) and, when detected, attempt to hand the current URL to the system browser before printing. On Android this uses an `intent://` handoff that opens Chrome; on iOS the webview usually falls back to its own "Open in Safari" affordance. If no in-app browser is detected, behaviour stays byte-for-byte identical to today.

Trade-off to be clear about: the Android handoff is reliable, the iOS one is not — Apple gives webviews no programmatic escape hatch. So Option B fixes roughly the Android half of the problem and leaves iOS unchanged.

## Rejected

- Generating the PDF in JavaScript instead of via the print dialog: this would add a dependency and, more importantly, in-app webviews also block file downloads, so it would not fix the Instagram case while degrading the report's typography and pagination.
- Rendering the PDF on the server: contradicts the zero-infrastructure, nothing-leaves-the-browser guarantee the product is built on, since the user's figures would have to be transmitted.
- Any on-screen notice, hint line, button resize, or progress state: excluded per your instruction.

## Non-technical mitigation

The most effective fix costs no code: when sharing on Instagram, add "open in browser to download the report" to the story text, or share the link in a bio/link-in-bio destination that opens externally.

## Recommendation

Option A unless you want the Android handoff, in which case Option B — it is roughly 15 lines inside one existing handler and changes nothing a user sees.
