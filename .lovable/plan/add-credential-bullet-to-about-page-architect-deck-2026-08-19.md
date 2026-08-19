# Add credential bullet to About page architect deck

## What to change
Insert one new credential bullet into the architect credentials list on the About page.

## Location
`src/lib/assessment/content.ts` — the `ABOUT_ARCHITECT.credentials` array.

## Exact edit
Current first two bullets:
- Microsoft Certified AI Transformation Leader
- Management and Strategy Consulting Practitioner

New order:
- Microsoft Certified AI Transformation Leader
- Enterprise Operations Excellence and Program Governance
- Management and Strategy Consulting Practitioner

## Why this file
`AboutSections.tsx` renders `ABOUT_ARCHITECT.credentials` directly, so updating the source array is the only change required. No UI, styling, or routing changes are needed.

## Acceptance criteria
- [ ] The new bullet appears as the second item in the credentials list on `/about`.
- [ ] All existing bullets remain in order after it.
- [ ] No other copy, layout, or behavior changes.
