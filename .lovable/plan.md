# New portrait in the architect card

A single targeted change: replace the existing portrait in the About page architect card with the newly uploaded seated photograph, keeping every other element, layout, styling, and motion intact.

## The change

In `src/components/lnt/AboutSections.tsx`, the current 80px × 80px circular image (`sajal-roy-v2.png`) becomes the new upload (`20260819_181936-2.jpg`), processed as a head-to-torso crop.

- Crop: centered square from just above the head down to mid-chest, keeping the half-light/mysterious composition and the shoulders in frame. The face remains centered, but the head does not dominate the entire circle.
- Fit: cover-fitted inside the existing 80px × 80px rounded container with `object-cover` and an object-position that centers the torso.
- Transparency: apply an opacity treatment (e.g., ~92–95%) and/or a soft edge mask so the photograph blends cleanly with the `sand-plate` card background and the accent ring, rather than reading as a hard rectangular cut-out.
- Alt text remains `ABOUT_ARCHITECT.name` ("Mr Sajal Roy").
- The circular container, ring, shadow, size, and position inside the architect card remain unchanged. The mail line, credentials, name, role, hairlines, and card padding all stay exactly as they are.

## Implementation steps

1. Process `20260819_181936-2.jpg` to a centered square head-to-torso crop, then convert to a Web-friendly PNG.
2. Upload the processed image via `lovable-assets` and write the resulting `.asset.json` pointer.
3. Delete the previous `sajal-roy-v2.png.asset.json` pointer.
4. In `src/components/lnt/AboutSections.tsx`, update the import to the new pointer and add an opacity/soft-edge class to the image.
5. Verify with rendered screenshots of the About architect card at desktop and mobile widths, confirming the new portrait is centered, not overly cropped, and blends with the card. Run the build to ensure no broken asset references.

## Technical notes

- Keep the existing `sand-plate` container, `h-20 w-20`, `rounded-full`, `border-accent/50`, and `shadow-[var(--shadow-plate)]`.
- Preserve `loading="lazy"` and `alt={ABOUT_ARCHITECT.name}`.
- No changes to `src/lib/assessment/content.ts`, `SiteChrome.tsx`, or any other component.
