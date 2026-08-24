# Workspace link in the PDF: label only, no visible URL

## Issue

In the downloaded report, the attribution block prints the label followed by a dash and the raw Linktree address:

```text
Spotify Podcast | LinkedIn Newsletter | Socials — linktr.ee/sajalroy
```

The site footer already does the right thing: the label itself is the link and no URL is shown. Only the report attribution block differs.

## Change

In the report attribution block, drop the `—` and the visible `linktr.ee/sajalroy` text. The line becomes just:

```text
Spotify Podcast | LinkedIn Newsletter | Socials
```

with the whole label carrying the Linktree hyperlink, styled exactly like the mail link (same size, colour, underline). Clicking it in the PDF still opens https://linktr.ee/sajalroy.

Nothing else changes — portrait, credentials, mail line, disclosure, on-screen layout and footer stay as they are.

## Technical note

`ReportAttribution` in `src/components/lnt/SiteChrome.tsx`: replace the label-plus-separator-plus-anchor paragraph with a single anchor wrapping `ABOUT_ARCHITECT.workspaceLabel`.

## Verification

Render the report in a headless browser, print to PDF, and confirm the attribution line shows only the label, no dash or URL, and that the anchor still points at the Linktree address. Check the same line on desktop width on screen.
