import type { Band, BandCard, MetricScoring, SectorId, Tier, TierBand } from "./types";

/** min inclusive, max exclusive. null means open-ended. */
const B = (
  min: number | null,
  max: number | null,
  points: number,
  tier: Tier,
  label: string,
): Band => ({
  ...(min === null ? {} : { min }),
  ...(max === null ? {} : { max }),
  points,
  tier,
  label,
});

const T = (min: number | null, max: number | null, tier: Tier, label: string): TierBand => ({
  ...(min === null ? {} : { min }),
  ...(max === null ? {} : { max }),
  tier,
  label,
});

const card = (value: number, label: string, description: string): BandCard => ({
  value,
  label,
  description,
});

/** Median-relative bands, used where the spec expresses scoring against a sector median. */
const medianBands = (median: number, top: number, mid: number, below: number): Band[] => [
  B(median * 1.1, null, top, "healthy", `Above the sector median of ${median}%`),
  B(median * 0.9, median * 1.1, mid, "acceptable", `At the sector median of ${median}%`),
  B(0, median * 0.9, below, "concern", `Below the sector median of ${median}%`),
  B(null, 0, 0, "critical", "Negative"),
];

/** Sector range bands for R&D intensity: at or above the range top, within it, below it, or none. */
const intensityBands = (lo: number, hi: number): Band[] => [
  B(hi, null, 25, "healthy", `At or above the top of the sector range (${lo}–${hi}%)`),
  B(lo, hi, 17, "healthy", `Within the sector range (${lo}–${hi}%)`),
  B(0.0001, lo, 8, "concern", `Below the sector range (${lo}–${hi}%)`),
  B(null, 0.0001, 3, "critical", "No innovation investment recorded"),
];

/** Technology spend: within the sector range, outside it, or materially outside it. */
const spendBands = (lo: number, hi: number): Band[] => [
  B(lo, hi, 30, "healthy", `Within the sector range (${lo}–${hi}%)`),
  B(lo / 2, lo, 18, "acceptable", `Moderately below the sector range (${lo}–${hi}%)`),
  B(hi, hi * 2, 18, "acceptable", `Moderately above the sector range (${lo}–${hi}%)`),
  B(null, lo / 2, 8, "concern", `Materially below the sector range (${lo}–${hi}%)`),
  B(hi * 2, null, 8, "concern", `Materially above the sector range (${lo}–${hi}%)`),
];

const uptimeBands = (target: number, concern: number): Band[] => [
  B(target, null, 40, "healthy", `Meets or exceeds the sector target of ${target}%`),
  B(concern, target, 25, "acceptable", `Marginally below the sector target of ${target}%`),
  B(null, concern, 0, "critical", `Below the sector concern threshold of ${concern}%`),
];

const revPerFte = (strong: number, median: number, concern: number): Band[] => [
  B(strong, null, 25, "healthy", `Strong for sector (above ${strong.toLocaleString()})`),
  B(median, strong, 17, "acceptable", `At or above the sector median (${median.toLocaleString()})`),
  B(concern, median, 8, "concern", "Below the sector median"),
  B(null, concern, 0, "critical", `Below the sector concern threshold (${concern.toLocaleString()})`),
];

/** Gross margin, scored against the sector median, healthy floor and concern threshold. */
const grossMargin = (median: number, floor: number, concern: number): Band[] => [
  B(median, null, 16, "healthy", `At or above the sector median (${median}%)`),
  B(floor, median, 12, "healthy", `Above the sector healthy floor (${floor}%)`),
  B(concern, floor, 8, "acceptable", `Between the concern threshold and the healthy floor`),
  B(0, concern, 4, "concern", `Below the sector concern threshold (${concern}%)`),
  B(null, 0, 0, "critical", "Negative gross margin"),
];

const SCORING_LIST: MetricScoring[] = [
  // ---------------------------------------------------------------- Financial Health
  {
    id: "revenue-growth-rate",
    unit: "percent",
    placeholder: "e.g. 14  or  12-16",
    pointBands: [
      B(20, null, 12, "healthy", "20% or above"),
      B(10, 20, 9, "acceptable", "10–20%"),
      B(5, 10, 6, "acceptable", "5–10%"),
      B(0, 5, 3, "concern", "0–5%"),
      B(null, 0, 0, "critical", "Declining"),
    ],
    tierBands: {
      saas: [T(25, null, "healthy", ">25%"), T(15, 25, "acceptable", "15–25%"), T(5, 15, "concern", "5–15%"), T(null, 5, "critical", "<5% or declining")],
      startup: [T(40, null, "healthy", ">40%"), T(20, 40, "acceptable", "20–40%"), T(10, 20, "concern", "10–20%"), T(null, 10, "critical", "<10%")],
      services: [T(12, null, "healthy", ">12%"), T(8, 12, "acceptable", "8–12%"), T(3, 8, "concern", "3–8%"), T(null, 3, "critical", "<3% or declining")],
      manufacturing: [T(8, null, "healthy", ">8%"), T(5, 8, "acceptable", "5–8%"), T(2, 5, "concern", "2–5%"), T(null, 2, "critical", "<2% or declining")],
      retail: [T(15, null, "healthy", ">15%"), T(8, 15, "acceptable", "8–15%"), T(3, 8, "concern", "3–8%"), T(null, 3, "critical", "<3% or declining")],
    },
  },
  {
    id: "revenue-concentration",
    unit: "percent",
    placeholder: "e.g. 38  or  35-40",
    pointBands: [
      B(null, 25, 10, "healthy", "Under 25% — diversified"),
      B(25, 40, 7, "acceptable", "25–40% — moderate concentration"),
      B(40, 60, 3, "concern", "40–60% — significant dependency"),
      B(60, null, 0, "critical", "Above 60% — existential single-customer risk"),
    ],
  },
  {
    id: "recurring-revenue-share",
    unit: "percent",
    placeholder: "e.g. 65  or  60-70",
    pointBands: [
      B(80, null, 4, "healthy", "80% or above"),
      B(60, 80, 3, "acceptable", "60–80%"),
      B(40, 60, 2, "concern", "40–60%"),
      B(20, 40, 1, "concern", "20–40%"),
      B(null, 20, 0, "critical", "Largely project-based"),
    ],
    tierBands: {
      saas: [T(90, null, "healthy", ">90%"), T(75, 90, "acceptable", "75–90%"), T(50, 75, "concern", "50–75%"), T(null, 50, "critical", "<50%")],
      services: [T(60, null, "healthy", ">60%"), T(40, 60, "acceptable", "40–60%"), T(20, 40, "concern", "20–40%"), T(null, 20, "critical", "<20%")],
      retail: [T(70, null, "healthy", ">70%"), T(50, 70, "acceptable", "50–70%"), T(30, 50, "concern", "30–50%"), T(null, 30, "critical", "<30%")],
      manufacturing: [T(40, null, "healthy", ">40%"), T(25, 40, "acceptable", "25–40%"), T(10, 25, "concern", "10–25%"), T(null, 10, "critical", "<10%")],
    },
    sectorNote: { startup: "The specification records recurring-revenue share as stage-dependent for startups; the reading is scored on the sector-neutral band." },
  },
  {
    id: "gross-margin",
    unit: "percent",
    placeholder: "e.g. 42  or  40-45",
    pointBands: grossMargin(33.4, 28, 20),
    sectorBands: {
      saas: grossMargin(71.7, 65, 55),
      services: grossMargin(33.4, 28, 20),
      manufacturing: grossMargin(37.5, 25, 15),
      retail: grossMargin(33.2, 25, 18),
      startup: grossMargin(71.7, 65, 55),
    },
    sectorNote: { startup: "Read against the SaaS (Software) row, the closest profile carried in the specification's gross-margin table." },
  },
  {
    id: "operating-margin",
    unit: "percent",
    placeholder: "e.g. 11  or  9-13",
    pointBands: [
      B(25, null, 12, "healthy", "25% or above"),
      B(15, 25, 9, "healthy", "15–25%"),
      B(5, 15, 6, "acceptable", "5–15%"),
      B(0, 5, 3, "concern", "0–5%"),
      B(null, 0, 0, "critical", "Operating loss"),
    ],
    tierBands: {
      saas: [T(20, null, "healthy", ">20%"), T(10, 20, "acceptable", "10–20%"), T(0, 10, "concern", "<10% — fragile"), T(null, 0, "critical", "Operating loss")],
      services: [T(8, null, "healthy", ">8%"), T(5, 8, "acceptable", "5–8%"), T(0, 5, "concern", "<5% — fragile"), T(null, 0, "critical", "Operating loss")],
      manufacturing: [T(10, null, "healthy", ">10%"), T(5, 10, "acceptable", "5–10%"), T(0, 5, "concern", "<5% — fragile"), T(null, 0, "critical", "Operating loss")],
      retail: [T(5, null, "healthy", ">5%"), T(3, 5, "acceptable", "3–5%"), T(0, 3, "concern", "<3% — fragile"), T(null, 0, "critical", "Operating loss")],
    },
    sectorNote: { startup: "The specification's operating-margin table carries no startup row; the reading is scored on the sector-neutral band." },
  },
  {
    id: "net-margin",
    unit: "percent",
    placeholder: "e.g. 8  or  6-9",
    pointBands: medianBands(7.0, 3, 2, 1),
    sectorBands: {
      saas: medianBands(25.5, 3, 2, 1),
      services: medianBands(7.0, 3, 2, 1),
      manufacturing: medianBands(10.6, 3, 2, 1),
      retail: medianBands(5.6, 3, 2, 1),
      startup: medianBands(25.5, 3, 2, 1),
    },
    sectorNote: { startup: "Read against the SaaS (Software) median, the closest profile carried in the specification's net-margin table." },
  },
  {
    id: "ebitda-margin",
    unit: "percent",
    placeholder: "e.g. 17  or  15-19",
    pointBands: medianBands(15.7, 3, 2, 1),
    sectorBands: {
      saas: medianBands(35.9, 3, 2, 1),
      services: medianBands(15.7, 3, 2, 1),
      manufacturing: medianBands(19.6, 3, 2, 1),
      retail: medianBands(10.1, 3, 2, 1),
      startup: medianBands(35.9, 3, 2, 1),
    },
    sectorNote: { startup: "Read against the SaaS (Software) median, the closest profile carried in the specification's EBITDA table." },
  },
  {
    id: "days-sales-outstanding",
    unit: "days",
    placeholder: "e.g. 47  or  45-52",
    pointBands: [
      B(null, 40, 3, "healthy", "Within the healthy band"),
      B(40, 55, 2, "acceptable", "Acceptable"),
      B(55, 75, 1, "concern", "Concern"),
      B(75, null, 0, "critical", "Critical"),
    ],
    sectorBands: {
      saas: [B(null, 35, 3, "healthy", "<35 days"), B(35, 50, 2, "acceptable", "35–50"), B(50, 70, 1, "concern", "50–70"), B(70, null, 0, "critical", ">70")],
      services: [B(null, 40, 3, "healthy", "<40 days"), B(40, 55, 2, "acceptable", "40–55"), B(55, 75, 1, "concern", "55–75"), B(75, null, 0, "critical", ">75")],
      manufacturing: [B(null, 45, 3, "healthy", "<45 days"), B(45, 60, 2, "acceptable", "45–60"), B(60, 80, 1, "concern", "60–80"), B(80, null, 0, "critical", ">80")],
      retail: [B(null, 10, 3, "healthy", "<10 days"), B(10, 25, 2, "acceptable", "10–25"), B(25, 40, 1, "concern", "25–40"), B(40, null, 0, "critical", ">40")],
      startup: [B(null, 35, 3, "healthy", "<35 days"), B(35, 50, 2, "acceptable", "35–50"), B(50, 65, 1, "concern", "50–65"), B(65, null, 0, "critical", ">65")],
    },
  },
  {
    id: "cash-runway",
    unit: "months",
    placeholder: "e.g. 9  or  8-11",
    pointBands: [
      B(18, null, 15, "healthy", "Above 18 months — strong position"),
      B(12, 18, 12, "healthy", "12–18 months — adequate"),
      B(6, 12, 7, "acceptable", "6–12 months — active monitoring"),
      B(3, 6, 3, "concern", "3–6 months — serious concern"),
      B(null, 3, 0, "critical", "Under 3 months — critical"),
    ],
  },
  {
    id: "operating-cash-flow-to-revenue",
    unit: "percent",
    placeholder: "e.g. 12  or  10-14",
    pointBands: [
      B(15, null, 4, "healthy", "Above 15% — strong cash conversion"),
      B(10, 15, 3, "acceptable", "10–15% — adequate"),
      B(5, 10, 2, "concern", "5–10% — low"),
      B(null, 5, 0, "critical", "Under 5% — significant profit-to-cash gap"),
    ],
  },
  {
    id: "current-ratio",
    unit: "ratio",
    placeholder: "e.g. 1.4  or  1.3-1.6",
    pointBands: [
      B(1.2, null, 3, "healthy", "Healthy range"),
      B(1.0, 1.2, 2, "acceptable", "Acceptable"),
      B(0.8, 1.0, 1, "concern", "Concern"),
      B(null, 0.8, 0, "critical", "Critical (<0.8)"),
    ],
    sectorBands: {
      saas: [B(1.5, null, 3, "healthy", "1.5–3.0 healthy"), B(1.0, 1.5, 2, "acceptable", "1.0–1.5"), B(0.8, 1.0, 1, "concern", "<1.0"), B(null, 0.8, 0, "critical", "Critical (<0.8)")],
      services: [B(1.2, null, 3, "healthy", "1.2–2.0 healthy"), B(1.0, 1.2, 2, "acceptable", "1.0–1.2"), B(0.8, 1.0, 1, "concern", "<1.0"), B(null, 0.8, 0, "critical", "Critical (<0.8)")],
      manufacturing: [B(1.5, null, 3, "healthy", "1.5–2.5 healthy"), B(1.2, 1.5, 2, "acceptable", "1.2–1.5"), B(0.8, 1.2, 1, "concern", "<1.2"), B(null, 0.8, 0, "critical", "Critical (<0.8)")],
      retail: [B(1.0, null, 3, "healthy", "1.0–1.5 healthy"), B(0.8, 1.0, 2, "acceptable", "0.8–1.0"), B(null, 0.8, 0, "critical", "Critical (<0.8)")],
      startup: [B(1.5, null, 3, "healthy", "1.5–3.0 healthy"), B(1.0, 1.5, 2, "acceptable", "1.0–1.5"), B(0.8, 1.0, 1, "concern", "<1.0"), B(null, 0.8, 0, "critical", "Critical (<0.8)")],
    },
    sectorNote: { startup: "Read against the SaaS / Technology row, the closest profile carried in the specification's liquidity table." },
  },
  {
    id: "quick-ratio",
    unit: "ratio",
    placeholder: "e.g. 1.1  or  1.0-1.2",
    pointBands: [B(1.0, null, 2, "healthy", "Healthy range"), B(0.8, 1.0, 1, "acceptable", "Adequate"), B(null, 0.8, 0, "critical", "Concern")],
    sectorBands: {
      saas: [B(1.5, null, 2, "healthy", ">1.5"), B(1.0, 1.5, 1, "acceptable", "1.0–1.5"), B(null, 1.0, 0, "critical", "<1.0")],
      services: [B(1.0, null, 2, "healthy", ">1.0"), B(0.8, 1.0, 1, "acceptable", "0.8–1.0"), B(null, 0.8, 0, "critical", "<0.8")],
      manufacturing: [B(0.8, null, 2, "healthy", "0.8–1.2"), B(0.6, 0.8, 1, "acceptable", "0.6–0.8"), B(null, 0.6, 0, "critical", "<0.6")],
      retail: [B(0.5, null, 2, "healthy", "0.5–1.0"), B(0.3, 0.5, 1, "acceptable", "0.3–0.5"), B(null, 0.3, 0, "critical", "<0.3")],
      startup: [B(1.5, null, 2, "healthy", ">1.5"), B(1.0, 1.5, 1, "acceptable", "1.0–1.5"), B(null, 1.0, 0, "critical", "<1.0")],
    },
    sectorNote: { startup: "Read against the SaaS / Technology row, the closest profile carried in the specification's liquidity table." },
  },
  {
    id: "debt-to-equity-ratio",
    unit: "ratio",
    placeholder: "e.g. 0.8  or  0.7-0.9",
    pointBands: [B(null, 0.8, 2, "healthy", "Typical / conservative"), B(0.8, 2.0, 1, "acceptable", "Elevated"), B(2.0, null, 0, "critical", "High risk")],
    sectorBands: {
      saas: [B(null, 0.5, 2, "healthy", "0.1–0.5 typical"), B(0.5, 1.5, 1, "acceptable", "Elevated"), B(1.5, null, 0, "critical", "High risk (>1.5)")],
      services: [B(null, 0.8, 2, "healthy", "0.3–0.8 typical"), B(0.8, 2.0, 1, "acceptable", "Elevated"), B(2.0, null, 0, "critical", "High risk (>2.0)")],
      manufacturing: [B(null, 1.2, 2, "healthy", "0.5–1.2 typical"), B(1.2, 2.5, 1, "acceptable", "Elevated"), B(2.5, null, 0, "critical", "High risk (>2.5)")],
      retail: [B(null, 1.5, 2, "healthy", "0.5–1.5 typical"), B(1.5, 3.0, 1, "acceptable", "Elevated"), B(3.0, null, 0, "critical", "High risk (>3.0)")],
      startup: [B(null, 0.5, 2, "healthy", "0.1–0.5 typical"), B(0.5, 1.5, 1, "acceptable", "Elevated"), B(1.5, null, 0, "critical", "High risk (>1.5)")],
    },
    sectorNote: { startup: "Read against the SaaS / Technology row, the closest profile carried in the specification's solvency table." },
  },
  {
    id: "working-capital",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(4, "Positive and growing", "Healthy — the business can fund operations and invest in growth."),
      card(3, "Positive but declining", "Concern — liquidity is being consumed."),
      card(2, "Near zero", "Tight — operating with minimal buffer."),
      card(1, "Negative", "Critical — near-term obligations exceed resources."),
    ],
    pointBands: [
      B(4, null, 3, "healthy", "Positive and growing"),
      B(3, 4, 2, "acceptable", "Positive but declining"),
      B(2, 3, 1, "concern", "Near zero"),
      B(null, 2, 0, "critical", "Negative"),
    ],
  },
  {
    id: "inventory-turnover",
    unit: "multiple",
    placeholder: "e.g. 5.2  or  5-6",
    notApplicable: ["saas", "services", "startup"],
    pointBands: [B(5, null, 2, "healthy", "Healthy range"), B(4, 5, 1, "concern", "Below range"), B(null, 4, 0, "critical", "Critical")],
    sectorBands: {
      retail: [B(5, null, 2, "healthy", "5–10x healthy"), B(4, 5, 1, "concern", "Below the healthy range"), B(null, 4, 0, "critical", "<4x")],
      manufacturing: [B(4.5, null, 2, "healthy", "4.5–6x healthy"), B(3, 4.5, 1, "concern", "Below the healthy range"), B(null, 3, 0, "critical", "<3x")],
    },
  },
  {
    id: "labor-cost-ratio",
    unit: "percent",
    placeholder: "e.g. 46  or  44-48",
    pointBands: [B(null, 45, 3, "healthy", "Healthy for sector"), B(45, 55, 2, "acceptable", "Elevated"), B(55, null, 1, "concern", "Concern")],
    sectorBands: {
      services: [B(null, 45, 3, "healthy", "<45%"), B(45, 55, 2, "acceptable", "45–55%"), B(55, null, 1, "concern", ">55%")],
      manufacturing: [B(null, 25, 3, "healthy", "<25%"), B(25, 35, 2, "acceptable", "25–35%"), B(35, null, 1, "concern", ">35%")],
      retail: [B(null, 20, 3, "healthy", "<20%"), B(20, 30, 2, "acceptable", "20–30%"), B(30, null, 1, "concern", ">30%")],
      saas: [B(null, 40, 3, "healthy", "<40%"), B(40, 50, 2, "acceptable", "40–50%"), B(50, null, 1, "concern", ">50%")],
    },
    sectorNote: { startup: "The specification records the labor-cost ratio as stage-dependent for startups; the reading is scored on the sector-neutral band." },
  },
  {
    id: "operating-leverage",
    unit: "multiple",
    placeholder: "e.g. 1.6  or  1.4-1.8",
    pointBands: [
      B(2.0, null, 3, "healthy", "Above 2.0x — genuine scale economics"),
      B(1.5, 2.0, 2, "acceptable", "1.5–2.0x — moderate leverage"),
      B(1.0, 1.5, 1, "concern", "1.0–1.5x — limited scale economics"),
      B(null, 1.0, 0, "critical", "Below 1.0x — the scale illusion"),
    ],
  },

  // ---------------------------------------------------------- Operational Efficiency
  {
    id: "process-cycle-time",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(4, "Fast", "Cycle time sits within the fast threshold for this sector and process type."),
      card(3, "Acceptable", "Cycle time is workable but not fast for this sector and process type."),
      card(2, "Extended", "Cycle time runs materially longer than the sector norm."),
      card(1, "Critical", "Cycle time is far beyond the sector norm and is visible to customers."),
    ],
    pointBands: [
      B(4, null, 15, "healthy", "Fast"),
      B(3, 4, 10, "acceptable", "Acceptable"),
      B(2, 3, 5, "concern", "Extended"),
      B(null, 2, 0, "critical", "Critical"),
    ],
  },
  {
    id: "touch-time-ratio",
    unit: "percent",
    placeholder: "e.g. 35  or  30-40",
    pointBands: [
      B(60, null, 10, "healthy", "Above 60% — minimal wait time"),
      B(40, 60, 7, "acceptable", "40–60% — some flow friction"),
      B(20, 40, 3, "concern", "20–40% — mostly waiting"),
      B(null, 20, 0, "critical", "Under 20% — the process is a queue"),
    ],
  },
  {
    id: "handoff-count",
    unit: "count",
    placeholder: "e.g. 5",
    pointBands: [
      B(null, 4, 10, "healthy", "1–3 — lean"),
      B(4, 6, 7, "acceptable", "4–5 — typical structured process"),
      B(6, 9, 3, "concern", "6–8 — elevated"),
      B(9, null, 0, "critical", "More than 8 — fragmented"),
    ],
  },
  {
    id: "output-variance",
    unit: "percent",
    placeholder: "e.g. 22  or  20-25",
    pointBands: [
      B(null, 15, 10, "healthy", "Under 15% — standardized"),
      B(15, 30, 6, "acceptable", "15–30% — moderate variance"),
      B(30, 50, 3, "concern", "30–50% — output depends on who is working"),
      B(50, null, 0, "critical", "Above 50% — unpredictable"),
    ],
  },
  {
    id: "utilization",
    unit: "percent",
    placeholder: "e.g. 72  or  70-78",
    pointBands: [
      B(65, 85, 15, "healthy", "65–85% — target band"),
      B(55, 65, 10, "acceptable", "55–65%"),
      B(85, null, 8, "concern", "Above 85%"),
      B(null, 55, 3, "concern", "Under 55%"),
    ],
    tierBands: {
      services: [T(65, 80, "healthy", "65–80% target"), T(80, 90, "acceptable", "Above target band"), T(55, 65, "acceptable", "Below target band"), T(90, null, "concern", ">90%"), T(null, 55, "concern", "<55%")],
      manufacturing: [T(75, 85, "healthy", "75–85% target"), T(60, 75, "acceptable", "Below target band"), T(85, null, "acceptable", "Above target band"), T(null, 60, "concern", "<60%")],
      saas: [T(60, 75, "healthy", "60–75% target"), T(75, null, "acceptable", "Above target band"), T(50, 60, "acceptable", "Below target band"), T(null, 50, "concern", "<50%")],
      startup: [T(60, 75, "healthy", "60–75% target"), T(75, null, "acceptable", "Above target band"), T(50, 60, "acceptable", "Below target band"), T(null, 50, "concern", "<50%")],
      retail: [T(65, 80, "healthy", "65–80% target"), T(80, 90, "acceptable", "Above target band"), T(55, 65, "acceptable", "Below target band"), T(90, null, "concern", ">90%"), T(null, 55, "concern", "<55%")],
    },
    sectorNote: { retail: "Read against the Services (billable) row, the closest profile carried in the specification's utilization table." },
  },
  {
    id: "rework-rate",
    unit: "percent",
    placeholder: "e.g. 8  or  6-10",
    pointBands: [
      B(null, 5, 15, "healthy", "Under 5% — excellent quality discipline"),
      B(5, 10, 10, "acceptable", "5–10% — acceptable"),
      B(10, 15, 5, "concern", "10–15% — quality cost is material"),
      B(15, 25, 2, "critical", "15–25% — consuming significant capacity"),
      B(25, null, 0, "critical", "Above 25% — systemic quality-system failure"),
    ],
  },
  {
    id: "first-pass-yield",
    unit: "percent",
    placeholder: "e.g. 92  or  90-94",
    pointBands: [
      B(95, null, 10, "healthy", "Above 95% — world-class"),
      B(90, 95, 8, "healthy", "90–95% — strong"),
      B(80, 90, 5, "acceptable", "80–90%"),
      B(70, 80, 2, "concern", "70–80% — elevated defect rate"),
      B(null, 70, 0, "critical", "Under 70% — excessive first-attempt failures"),
    ],
  },
  {
    id: "on-time-delivery-rate",
    unit: "percent",
    placeholder: "e.g. 93  or  91-95",
    pointBands: [
      B(95, null, 10, "healthy", "Above 95%"),
      B(90, 95, 7, "acceptable", "90–95%"),
      B(80, 90, 4, "concern", "80–90%"),
      B(null, 80, 0, "critical", "Under 80%"),
    ],
    tierBands: {
      manufacturing: [T(95, null, "healthy", ">95%"), T(90, 95, "acceptable", "90–95%"), T(null, 90, "concern", "<90%")],
      retail: [T(95, null, "healthy", ">95%"), T(90, 95, "acceptable", "90–95%"), T(null, 90, "concern", "<90%")],
      services: [T(90, null, "healthy", ">90%"), T(80, 90, "acceptable", "80–90%"), T(null, 80, "concern", "<80%")],
      saas: [T(99.9, null, "healthy", ">99.9%"), T(99.5, 99.9, "acceptable", "99.5–99.9%"), T(null, 99.5, "concern", "<99.5%")],
      startup: [T(90, null, "healthy", ">90%"), T(80, 90, "acceptable", "80–90%"), T(null, 80, "concern", "<80%")],
    },
    sectorNote: { startup: "Read against the Services (project) row, the closest profile carried in the specification's delivery table." },
  },
  {
    id: "inventory-turnover-operational",
    unit: "multiple",
    placeholder: "e.g. 5.5  or  5-6",
    notApplicable: ["saas", "services"],
    pointBands: [
      B(6, null, 5, "healthy", "6x or above"),
      B(4, 6, 3, "acceptable", "4–6x"),
      B(null, 4, 0, "critical", "Under 4x"),
    ],
  },

  // -------------------------------------------------------------- Market Position
  {
    id: "customer-acquisition-cost",
    unit: "currency",
    placeholder: "e.g. 1200  or  1000-1400",
    pointBands: [B(null, null, 15, "healthy", "Entered — read in context of the LTV:CAC ratio")],
  },
  {
    id: "ltv-to-cac-ratio",
    unit: "ratio",
    placeholder: "e.g. 3.4  or  3-4",
    pointBands: [
      B(5, null, 20, "healthy", "Above 5:1"),
      B(4, 5, 16, "healthy", "4–5:1"),
      B(3, 4, 12, "acceptable", "3–4:1"),
      B(2, 3, 6, "concern", "2–3:1"),
      B(null, 2, 0, "critical", "Under 2:1"),
    ],
  },
  {
    id: "cac-payback-period",
    unit: "months",
    placeholder: "e.g. 11  or  10-13",
    pointBands: [
      B(null, 6, 10, "healthy", "Under 6 months"),
      B(6, 12, 7, "acceptable", "6–12 months"),
      B(12, 18, 4, "concern", "12–18 months"),
      B(18, null, 0, "critical", "Above 18 months"),
    ],
  },
  {
    id: "customer-retention-rate",
    unit: "percent",
    placeholder: "e.g. 86  or  84-89",
    pointBands: [
      B(90, null, 15, "healthy", "Above 90%"),
      B(80, 90, 10, "acceptable", "80–90%"),
      B(70, 80, 5, "concern", "70–80%"),
      B(null, 70, 0, "critical", "Under 70%"),
    ],
  },
  {
    id: "net-revenue-retention",
    unit: "percent",
    placeholder: "e.g. 108  or  105-112",
    pointBands: [
      B(120, null, 20, "healthy", "Above 120%"),
      B(110, 120, 16, "healthy", "110–120%"),
      B(100, 110, 12, "acceptable", "100–110%"),
      B(90, 100, 6, "concern", "90–100%"),
      B(null, 90, 0, "critical", "Under 90%"),
    ],
  },
  {
    id: "price-realization",
    unit: "percent",
    placeholder: "e.g. 91  or  88-93",
    pointBands: [
      B(95, null, 5, "healthy", "Above 95%"),
      B(85, 95, 4, "acceptable", "85–95%"),
      B(75, 85, 2, "concern", "75–85%"),
      B(null, 75, 0, "critical", "Under 75%"),
    ],
  },
  {
    id: "net-promoter-score",
    unit: "score",
    placeholder: "e.g. 42  or  38-46",
    pointBands: [B(50, null, 5, "healthy", "Excellent"), B(40, 50, 4, "healthy", "Strong"), B(30, 40, 2, "acceptable", "Good"), B(null, 30, 0, "concern", "Below good")],
    sectorBands: {
      saas: [B(50, null, 5, "healthy", "Excellent (>50)"), B(40, 50, 4, "healthy", "Strong (>40)"), B(30, 40, 2, "acceptable", "Good (>30)"), B(null, 30, 0, "concern", "Below good")],
      retail: [B(60, null, 5, "healthy", "Excellent (>60)"), B(50, 60, 4, "healthy", "Strong (>50)"), B(40, 50, 2, "acceptable", "Good (>40)"), B(null, 40, 0, "concern", "Below good")],
      services: [B(68, null, 5, "healthy", "Excellent (>68)"), B(60, 68, 4, "healthy", "Strong (>60)"), B(50, 60, 2, "acceptable", "Good (>50)"), B(null, 50, 0, "concern", "Below good")],
      manufacturing: [B(50, null, 5, "healthy", "Excellent (>50)"), B(40, 50, 4, "healthy", "Strong (>40)"), B(30, 40, 2, "acceptable", "Good (>30)"), B(null, 30, 0, "concern", "Below good")],
      startup: [B(50, null, 5, "healthy", "Excellent (>50)"), B(40, 50, 4, "healthy", "Strong (>40)"), B(30, 40, 2, "acceptable", "Good (>30)"), B(null, 30, 0, "concern", "Below good")],
    },
    sectorNote: {
      manufacturing: "Read against the SaaS (B2B) row; the specification's NPS table carries no manufacturing row and reports a 32–44 cross-industry average.",
      startup: "Read against the SaaS (B2B) row; the specification's NPS table carries no startup row and reports a 32–44 cross-industry average.",
    },
  },
  {
    id: "customer-satisfaction-score",
    unit: "percent",
    placeholder: "e.g. 84  or  82-87",
    pointBands: [B(88, null, 4, "healthy", "Excellent"), B(85, 88, 3, "healthy", "Strong"), B(78, 85, 2, "acceptable", "Good"), B(null, 78, 0, "concern", "Below good")],
    sectorBands: {
      saas: [B(88, null, 4, "healthy", "Excellent (>88%)"), B(85, 88, 3, "healthy", "Strong (>85%)"), B(78, 85, 2, "acceptable", "Good (>78%)"), B(null, 78, 0, "concern", "Below good")],
      retail: [B(88, null, 4, "healthy", "Excellent (>88%)"), B(82, 88, 3, "healthy", "Strong (>82%)"), B(78, 82, 2, "acceptable", "Good (>78%)"), B(null, 78, 0, "concern", "Below good")],
      services: [B(90, null, 4, "healthy", "Excellent (>90%)"), B(84, 90, 3, "healthy", "Strong (>84%)"), B(80, 84, 2, "acceptable", "Good (>80%)"), B(null, 80, 0, "concern", "Below good")],
      manufacturing: [B(88, null, 4, "healthy", "Excellent (>88%)"), B(85, 88, 3, "healthy", "Strong (>85%)"), B(78, 85, 2, "acceptable", "Good (>78%)"), B(null, 78, 0, "concern", "Below good")],
      startup: [B(88, null, 4, "healthy", "Excellent (>88%)"), B(85, 88, 3, "healthy", "Strong (>85%)"), B(78, 85, 2, "acceptable", "Good (>78%)"), B(null, 78, 0, "concern", "Below good")],
    },
    sectorNote: {
      manufacturing: "Read against the SaaS / Software row, the closest profile carried in the specification's CSAT table.",
      startup: "Read against the SaaS / Software row, the closest profile carried in the specification's CSAT table.",
    },
  },
  {
    id: "customer-effort-score",
    unit: "score",
    placeholder: "e.g. 2.4  or  2.2-2.7",
    pointBands: [
      B(null, 2.0, 3, "healthy", "1.0–2.0 — effortless"),
      B(2.0, 3.0, 2, "acceptable", "2.0–3.0 — low friction"),
      B(3.0, 4.0, 1, "concern", "3.0–4.0 — acceptable"),
      B(4.0, null, 0, "critical", "Above 4.0 — elevated effort"),
    ],
  },
  {
    id: "pipeline-coverage",
    unit: "multiple",
    placeholder: "e.g. 3.2  or  3-4",
    pointBands: [
      B(4, null, 3, "healthy", "Above 4x"),
      B(3, 4, 2, "acceptable", "3–4x"),
      B(2, 3, 1, "concern", "2–3x"),
      B(null, 2, 0, "critical", "Under 2x"),
    ],
  },

  // ------------------------------------------------------ Organizational Capability
  {
    id: "voluntary-turnover-segmented",
    unit: "percent",
    placeholder: "e.g. 15  or  13-17",
    pointBands: [
      B(null, 13, 20, "healthy", "12% or below"),
      B(13, 19, 14, "acceptable", "13–18%"),
      B(19, 26, 7, "concern", "19–25%"),
      B(26, null, 0, "critical", "Above 25%"),
    ],
    tierBands: {
      saas: [T(null, 15, "healthy", "At or below the 13–15% sector median"), T(15, 20, "acceptable", "Above the sector median"), T(20, null, "concern", ">20%")],
      services: [T(null, 16, "healthy", "At or below the 12–16% sector median"), T(16, 22, "acceptable", "Above the sector median"), T(22, null, "concern", ">22%")],
      manufacturing: [T(null, 15, "healthy", "At or below the 10–15% sector median"), T(15, 20, "acceptable", "Above the sector median"), T(20, null, "concern", ">20%")],
      retail: [T(null, 35, "healthy", "At or below the 25–35% sector median"), T(35, 45, "acceptable", "Above the sector median"), T(45, null, "concern", ">45%")],
      startup: [T(null, 13, "healthy", "At or below the 13% all-industry median"), T(13, 20, "acceptable", "Above the all-industry median"), T(20, null, "concern", ">20%")],
    },
  },
  {
    id: "span-of-control",
    unit: "count",
    placeholder: "e.g. 6",
    pointBands: [
      B(5, 9, 20, "healthy", "5–8 — optimal for knowledge work"),
      B(3, 5, 12, "acceptable", "3–4 — potentially over-layered"),
      B(9, 13, 12, "acceptable", "9–12 — manageable for routine work"),
      B(13, null, 5, "concern", "Above 12 — attention diluted"),
      B(null, 3, 12, "acceptable", "Under 3 — potentially over-layered"),
    ],
  },
  {
    id: "revenue-per-fte",
    unit: "currency",
    placeholder: "e.g. 165000  or  150000-180000",
    pointBands: revPerFte(250000, 150000, 120000),
    sectorBands: {
      saas: revPerFte(180000, 141125, 100000),
      services: revPerFte(250000, 150000, 120000),
      manufacturing: revPerFte(220000, 150000, 120000),
      retail: revPerFte(130000, 80000, 70000),
      startup: revPerFte(180000, 141125, 100000),
    },
    sectorNote: {
      saas: "Read against the SaaS (Private, <$20M ARR) row of the specification's revenue-per-FTE table.",
      startup: "Read against the SaaS (Private, <$20M ARR) row, the closest profile carried in the specification's revenue-per-FTE table.",
    },
  },
  {
    id: "employee-net-promoter-score",
    unit: "score",
    placeholder: "e.g. 28  or  25-32",
    pointBands: [
      B(50, null, 20, "healthy", "Above 50 — strong internal advocacy"),
      B(30, 50, 14, "acceptable", "30–50 — good"),
      B(10, 30, 7, "concern", "10–30 — acceptable"),
      B(null, 10, 0, "critical", "Under 10"),
    ],
  },
  {
    id: "absenteeism-rate",
    unit: "percent",
    placeholder: "e.g. 3.4  or  3-4",
    pointBands: [
      B(null, 2, 15, "healthy", "Under 2% — excellent"),
      B(2, 4, 10, "acceptable", "2–4% — normal range"),
      B(4, 6, 5, "concern", "4–6% — elevated"),
      B(6, null, 0, "critical", "Above 6%"),
    ],
  },

  // -------------------------------------------------------- Strategic Positioning
  {
    id: "scalability-factor",
    unit: "multiple",
    placeholder: "e.g. 1.3  or  1.2-1.5",
    pointBands: [
      B(1.5, null, 20, "healthy", "Above 1.5x — genuine scale leverage"),
      B(1.0, 1.5, 12, "acceptable", "1.0–1.5x — moderate"),
      B(0.8, 1.0, 5, "concern", "0.8–1.0x — linear, no leverage"),
      B(null, 0.8, 0, "critical", "Under 0.8x — dilutive growth"),
    ],
  },
  {
    id: "differentiation-strength",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(4, "4 — Strong", "Three or more defensible advantages competitors cannot replicate within 12 months."),
      card(3, "3 — Moderate", "One to two unique, defensible propositions."),
      card(2, "2 — Weak", "Some distinction, but little that competitors could not replicate quickly."),
      card(1, "1 — None", "Price competition only."),
    ],
    pointBands: [
      B(4, null, 20, "healthy", "Strong"),
      B(3, 4, 13, "acceptable", "Moderate"),
      B(2, 3, 5, "concern", "Weak"),
      B(null, 2, 0, "critical", "None"),
    ],
  },
  {
    id: "switching-cost-assessment",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(4, "4 — High", "Switching would cost a customer significant money, time, disruption and retraining."),
      card(3, "3 — Moderate", "Switching carries real but surmountable cost and disruption."),
      card(2, "2 — Low", "Switching is inconvenient but inexpensive."),
      card(1, "1 — Negligible", "A customer could switch with almost no cost or disruption."),
    ],
    pointBands: [
      B(4, null, 10, "healthy", "High"),
      B(3, 4, 6, "acceptable", "Moderate"),
      B(2, 3, 2, "concern", "Low"),
      B(null, 2, 0, "critical", "Negligible"),
    ],
  },
  {
    id: "r-d-investment-intensity",
    unit: "percent",
    placeholder: "e.g. 6  or  5-8",
    pointBands: intensityBands(3, 8),
    sectorBands: {
      saas: intensityBands(15, 25),
      manufacturing: intensityBands(2, 5),
      retail: intensityBands(1, 3),
      services: intensityBands(3, 8),
      startup: intensityBands(15, 40),
    },
  },
  {
    id: "new-product-revenue-share",
    unit: "percent",
    placeholder: "e.g. 18  or  15-20",
    pointBands: [
      B(25, null, 25, "healthy", "Above 25% — strong innovation commercialization"),
      B(15, 25, 17, "healthy", "15–25% — innovation contributing"),
      B(5, 15, 8, "concern", "5–15% — core revenue dominates"),
      B(null, 5, 3, "critical", "Under 5% — legacy reliance"),
    ],
  },

  // ------------------------------------------------------------- Risk Management
  {
    id: "customer-concentration-risk",
    unit: "percent",
    placeholder: "e.g. 38  or  35-42",
    pointBands: [
      B(null, 25, 25, "healthy", "Under 25% — diversified"),
      B(25, 40, 18, "acceptable", "25–40% — moderate concentration"),
      B(40, 60, 8, "concern", "40–60% — significant dependency"),
      B(60, null, 0, "critical", "Above 60% — existential exposure"),
    ],
  },
  {
    id: "cash-runway-risk",
    unit: "months",
    placeholder: "e.g. 9  or  8-11",
    pointBands: [
      B(18, null, 25, "healthy", "Above 18 months — no near-term cash risk"),
      B(12, 18, 20, "healthy", "12–18 months — adequate"),
      B(6, 12, 12, "acceptable", "6–12 months — elevated"),
      B(3, 6, 5, "concern", "3–6 months — serious risk"),
      B(null, 3, 0, "critical", "Under 3 months — critical"),
    ],
  },
  {
    id: "supplier-concentration",
    unit: "percent",
    placeholder: "e.g. 30  or  28-35",
    pointBands: [
      B(null, 20, 20, "healthy", "Under 20% — diversified supply base"),
      B(20, 35, 14, "acceptable", "20–35% — moderate concentration"),
      B(35, 50, 6, "concern", "35–50% — disruption risk"),
      B(50, null, 0, "critical", "Above 50% — existential supply dependency"),
    ],
  },
  {
    id: "key-person-dependency",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(1, "1 — Low", "No significant impact if any single individual were unavailable."),
      card(2, "2 — Moderate", "Some revenue or capability would be disrupted."),
      card(3, "3 — High", "Material revenue, relationships or capability sit with one or two people."),
      card(4, "4 — Critical", "The business cannot function without a specific individual."),
    ],
    pointBands: [
      B(null, 2, 15, "healthy", "Low"),
      B(2, 3, 10, "acceptable", "Moderate"),
      B(3, 4, 4, "concern", "High"),
      B(4, null, 0, "critical", "Critical"),
    ],
  },
  {
    id: "geographic-revenue-concentration",
    unit: "percent",
    placeholder: "e.g. 70  or  65-75",
    pointBands: [
      B(null, 50, 15, "healthy", "Under 50% — diversified across geographies"),
      B(50, 75, 10, "acceptable", "50–75% — manageable if stable"),
      B(75, 90, 4, "concern", "75–90% — single-market exposure"),
      B(90, null, 0, "critical", "Above 90% — single-market operation"),
    ],
  },

  // ---------------------------------------------------------- Technology & Systems
  {
    id: "automation-level",
    unit: "ordinal",
    placeholder: "",
    cards: [
      card(4, "4 — Highly Automated", "Under 20 percent of core data flows require manual entry or re-keying."),
      card(3, "3 — Partially Automated", "20 to 40 percent of core data flows are manual."),
      card(2, "2 — Mostly Manual", "40 to 60 percent of core data flows are manual."),
      card(1, "1 — Fully Manual", "Over 60 percent of core data flows are manual."),
    ],
    pointBands: [
      B(4, null, 30, "healthy", "Highly automated"),
      B(3, 4, 20, "acceptable", "Partially automated"),
      B(2, 3, 10, "concern", "Mostly manual"),
      B(null, 2, 0, "critical", "Fully manual"),
    ],
  },
  {
    id: "system-uptime",
    unit: "percent",
    placeholder: "e.g. 99.7  or  99.5-99.9",
    pointBands: uptimeBands(99.5, 99.0),
    sectorBands: {
      saas: uptimeBands(99.9, 99.5),
      manufacturing: uptimeBands(99.0, 98.0),
      services: uptimeBands(99.5, 99.0),
      retail: uptimeBands(99.5, 99.0),
      startup: uptimeBands(99.5, 99.0),
    },
    sectorNote: {
      services: "Read against the internal-systems row of the specification's uptime table.",
      retail: "Read against the internal-systems row of the specification's uptime table.",
      startup: "Read against the internal-systems row of the specification's uptime table.",
    },
  },
  {
    id: "technology-spend-as-percentage-of-revenue",
    unit: "percent",
    placeholder: "e.g. 5  or  4-6",
    pointBands: spendBands(3, 8),
    sectorBands: {
      saas: spendBands(20, 35),
      manufacturing: spendBands(2, 5),
      retail: spendBands(2, 4),
      services: spendBands(3, 8),
      startup: spendBands(20, 35),
    },
    sectorNote: { startup: "Read against the SaaS / Technology row, the closest profile carried in the specification's technology-spend table." },
  },
];

export const SCORING: Record<string, MetricScoring> = Object.fromEntries(
  SCORING_LIST.map((s) => [s.id, s]),
);

export const SECTORS: { id: SectorId; name: string; description: string }[] = [
  { id: "services", name: "Services", description: "Professional services, consulting, agencies, staffing, B2B service businesses" },
  { id: "manufacturing", name: "Manufacturing", description: "Discrete and process manufacturing, industrial, production" },
  { id: "retail", name: "Retail / D2C", description: "Direct-to-consumer, ecommerce, physical retail, omnichannel" },
  { id: "saas", name: "SaaS / Subscription", description: "Software-as-a-service, subscription-based digital products" },
  { id: "startup", name: "Startup", description: "Pre-seed through Series A, pre-profitability, growth-stage" },
];

/** Section 11.1 — critical-minimum and standard input tiers. */
export const COVERAGE_TIERS: Record<string, { floor: number; standard: number; floorText: string }> = {
  financial: { floor: 4, standard: 8, floorText: "Revenue growth, one margin, cash runway and one further financial reading" },
  operational: { floor: 2, standard: 5, floorText: "Any two of cycle time, rework rate or utilization" },
  market: { floor: 3, standard: 6, floorText: "Retention, one of CAC or LTV:CAC, and one further market reading" },
  organizational: { floor: 2, standard: 4, floorText: "Revenue per FTE and voluntary turnover" },
  strategic: { floor: 2, standard: 5, floorText: "Scalability factor and differentiation strength" },
  risk: { floor: 2, standard: 4, floorText: "Customer concentration and cash runway" },
  technology: { floor: 1, standard: 3, floorText: "Automation level" },
};
