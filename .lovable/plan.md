# Remove Lovable Heart Icon / Replace Favicon

## Current state
- `public/favicon.ico` is the default Lovable heart icon.
- `src/routes/__root.tsx` links to `/favicon.ico`.
- No custom Open Graph image is set, so shared links may fall back to a Lovable-generated preview containing the heart mark.

## Plan

1. **Generate a custom favicon**
   - Design a square 64x64 PNG favicon that matches the site's Navy/Gold/Burnt Orange/Forest Green/Oxblood palette and boardroom gravitas.
   - Use a simple, bold mark (e.g., a stylised "L" / monogram or a 7-pillar armature glyph) that reads cleanly at 16x16 and 32x32.

2. **Install the favicon**
   - Save the generated image as `public/favicon.png`.
   - Remove the existing `public/favicon.ico` default Lovable file.
   - Update `src/routes/__root.tsx` to reference the new PNG favicon:
     ```tsx
     { rel: "icon", type: "image/png", href: "/favicon.png" }
     ```

3. **Replace the share preview image**
   - Generate a 1200x630 Open Graph image using the same visual language, with the attribution "LetNumbersTalk — By Mr. Sajal Roy".
   - Add `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, and `twitter:image` meta tags to `src/routes/__root.tsx`.

4. **Verify**
   - Confirm the new favicon loads at `/favicon.png`.
   - Confirm no `/favicon.ico` reference remains in the source.

## Outcome
The Lovable heart icon will no longer appear in the browser tab or when sharing the link; it will be replaced by a custom, on-brand favicon and share card.
