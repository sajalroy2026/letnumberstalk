# Portrait in the architect circle, plus a Workspace link

Two additions only. No layout, palette, motion, scoring, or PDF behaviour changes elsewhere.

## 1. Portrait replaces the "SR" monogram

The circular monogram in the About page architect deck becomes a photograph.

- Use the first upload (the closer, straight-on desk portrait) — the face is centred and evenly lit, so a square crop around the head fills the circle cleanly. The second photo is a full seated shot; the head occupies too little of the frame for an 80px circle.
- Crop tight to the head: top of head to just under the chin, nothing below the neck, face centred.
- Keep the exact same circle: same 80px size, same accent-coloured ring, same plate shadow, same position in the card. Only the fill changes from the "SR" letters to the image.
- Image is cover-fitted inside the circle so no stretching, with the crop biased to the face.
- Alt text: "Mr Sajal Roy". Print styles unaffected — the deck is already `no-print`-neutral and stays as-is.

## 2. Workspace link under the Mail line

Everywhere the "Mail — roysajal5@gmail.com" line appears (About page architect card, and the site footer), a second line is added directly beneath it, in the same type size, colour and underline treatment as the mail link:

Spotify Podcast | LinkedIn Newsletter | Socials — hyperlinked to https://linktr.ee/sajalroy

The link opens in a new tab with `rel="noopener noreferrer"`. On narrow mobile widths the label wraps naturally rather than overflowing the card.

The footer currently has a conditional "LinkedIn — Profile" line driven by an empty value, so it renders nothing today; the new line takes that slot, keeping the footer column height essentially unchanged. Card borders and the hairline rules sit below the block and reflow cleanly with the extra line.

## Technical notes

- Upload the chosen photo through the asset CDN and store the crop-ready image; reference it via its pointer in the About component. The original is not committed as a repo binary.
- `src/lib/assessment/content.ts`: add `workspaceUrl` and `workspaceLabel` fields to `ABOUT_ARCHITECT` so both surfaces read one source.
- `src/components/lnt/AboutSections.tsx`: swap the monogram div for an `img` inside the same circular container; add the workspace line under the mail paragraph.
- `src/components/lnt/SiteChrome.tsx`: replace the empty-valued LinkedIn conditional with the workspace line.
- Verify with rendered screenshots of the About card and footer at desktop and 411px mobile widths: face framing inside the circle, no card overflow, link colour and underline matching the mail link.
