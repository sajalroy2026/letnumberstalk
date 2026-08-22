# Verify the Download report button across all pillar combinations

You don't have to click through every pillar by hand. The report screen's "Download report" button triggers the browser's print-to-PDF on whatever the report page has rendered, so what needs checking is: (a) the button appears and fires for every pillar selection, and (b) the printed output actually contains each selected pillar's score, metric readings, and Areas to Look Into.

## What I'll do

Run an automated browser sweep against the live preview that, for each case:

1. Picks an industry profile.
2. Selects a pillar set.
3. Fills every metric in the selected pillars with realistic values (including deliberately out-of-band values so Areas to Look Into blocks appear, plus low cash runway / high customer concentration in one run to trigger the Caution block).
4. Advances to the report screen, clicks Download report, and captures the resulting print-rendered PDF.
5. Inspects the PDF text for: pillar name, pillar score, every entered metric, Areas to Look Into headings, disclosure and About sections, and the Integrated Score on the all-7 run.

## Cases covered

- Each of the 7 pillars on its own (7 runs) — confirms no pillar breaks in isolation.
- A mixed 3-pillar selection — confirms partial selections show no integrated score.
- All 7 pillars — confirms the Integrated Score and Caution block appear.
- One run with partial data (below the critical minimum) — confirms the guidance message prints instead of an error.
- One run at mobile viewport — confirms the print layout is identical regardless of screen size.

## What you get

A short table: case, pass/fail, and for any failure the exact missing element plus a screenshot/PDF excerpt. If everything passes, that's your confirmation the button is sound for all pillars.

## Notes

- This is verification only — no product code changes unless something fails, in which case I'll report the defect and propose the fix separately.
- The report is generated entirely in your browser via the print dialog, so nothing is uploaded anywhere during the check.
