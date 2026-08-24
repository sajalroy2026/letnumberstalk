# Portrait swap and About card workspace-link removal

Two targeted changes only. All other elements, layouts, palette, motion, scoring, and footer behaviour remain unchanged.

## 1. New portrait in the About architect circle

Replace the current close-cropped face-only portrait with the newly uploaded photograph (`20260817_122435.jpg`), cropped more proportionately for the circular container.

- Crop a square from the new upload, framed from just above the head down to mid-chest, keeping the shoulders and blazer in the frame so the head does not dominate the entire 80px circle. This gives a more balanced, executive-portrait feel than the previous tight face crop.
- Keep the same circular container: 80px × 80px, rounded-full, accent ring, plate shadow, position inside the sand-plate architect card.
- Apply a subtle transparency/opacity treatment (e.g., ~92–95% opacity) or a soft edge so the portrait photographs blends cleanly with the `sand-plate` card background and the circle border, rather than sitting as a hard rectangular cut-out.
- Cover-fit the image inside the circle with `object-cover` and an object-position that centers the face.
- Alt text remains: "Mr Sajal Roy".
- Upload the processed crop through the asset CDN and reference it via a new `.asset.json` pointer in `AboutSections.tsx`. Delete the previous `sajal-roy.jpg.asset.json` pointer.

## 2. Remove workspace link from the About architect card only

In `src/components/lnt/AboutSections.tsx`, remove the "Spotify Podcast | LinkedIn Newsletter | Socials" line that appears under the mail line inside the architect card.

- The mail line and its styling remain exactly as-is.
- The footer in `src/components/lnt/SiteChrome.tsx` keeps the same workspace link below the mail line unchanged.
- The architect card height will naturally reflow; the card borders, hairlines, credentials, and name spacing stay intact.

## Verification

- Render screenshots of the About architect card at desktop and mobile widths to confirm the new portrait framing inside the circle, no card overflow, and the workspace link removed.
- Confirm the footer still shows the workspace link.
- Run the build to ensure no broken asset references.
