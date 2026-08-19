# Remove the Lovable Favicon Icon

## Current state
- `public/favicon.ico` is the default Lovable heart icon.
- `src/routes/__root.tsx` links to `/favicon.ico`.

## Plan

1. **Delete the default favicon file**
   - Remove `public/favicon.ico`.

2. **Remove the favicon link**
   - Delete the `{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" }` entry from `src/routes/__root.tsx`.

3. **Do not add a replacement icon**
   - No new favicon, no transparent placeholder, no generated icon.

## Outcome
The browser tab will show no site icon, and the Lovable heart will no longer appear. Note: some platforms may still generate a generic preview image when the link is shared; removing that preview entirely would require a separate Open Graph image decision.
