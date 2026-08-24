# Carry the latest About/attribution details into the downloaded report

Goal: everything recently finalised on screen — the portrait, the credential list (including "Enterprise Operations Excellence and Program Governance"), the contact mail, and the Workspace Canvas link — appears correctly in the PDF produced by "Download report".

## Current state

- The report page already renders the About block and the disclosure below the pillar breakdown, so the architect card and credentials are inside the printed flow.
- The site footer holds the mail address and the Workspace Canvas link, but the footer is not part of the report's printed flow, so the link does not reach the PDF.
- Print styling has never been checked against the portrait image, so background/colour handling for the photo in print is unverified.

## Changes

1. Add a compact closing attribution block at the end of the report (after the disclosure, print-visible): name, role, mail address, and the Workspace Canvas link shown as full text (`linktr.ee/sajalroy`) so it is readable on paper as well as clickable in the PDF.
2. Ensure the architect portrait prints: force colour-exact rendering for the image, keep it inside an unbreakable block with the credential list, and avoid a page break splitting the card.
3. Confirm the credential bullets (all of them, in order) render in the print layout with the high-contrast text rules already in use.
4. Keep the on-screen layout unchanged; the new closing block is styled to match the existing editorial print treatment and stays visually quiet on screen.

## Verification

Render the report in a headless browser, emit the print PDF for a single-pillar run and for the full 7-pillar integrated run, convert the pages to images, and inspect each page for the portrait, the credential list, the mail address, and the Workspace Canvas link — with no clipped or split blocks.
