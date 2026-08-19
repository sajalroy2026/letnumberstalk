# Set Up Google Search Console for letnumberstalk.com

## Current state
- The Google Search Console connector is now linked to the project.
- A META verification token has been requested from Google.
- The verification tag needs to be added to the homepage `<head>`, then Google must be told to verify it.

## Plan

1. **Add the verification meta tag**
   - Insert the Google-provided verification tag into `src/routes/__root.tsx` so it appears in the server-rendered `<head>` of every page.

2. **Publish the site**
   - The verification tag must be live on `https://letnumberstalk.com/` before Google can confirm it.

3. **Verify ownership with Google**
   - Call the Search Console verification endpoint using the linked connector.

4. **Add the site to Search Console**
   - Register `https://letnumberstalk.com/` as a verified property.

5. **Submit the sitemap**
   - Submit `https://letnumberstalk.com/sitemap.xml` to Search Console.

6. **Update the SEO finding**
   - Mark the GSC finding as fixed once verification and sitemap submission succeed.

## Outcome
Google Search Console will be fully connected, the domain verified, and the sitemap submitted. The remaining failing SEO finding will be resolved.
