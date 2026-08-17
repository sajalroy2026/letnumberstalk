import { METRIC_CONTENT, PILLAR_META, type MetricContent } from "./spec.generated";
import { COVERAGE_TIERS, SCORING } from "./scoring";
import type {
  Band,
  BaseInputSet,
  CautionItem,
  IntegratedReport,
  MetricInput,
  MetricResult,
  PillarAssessment,
  PillarId,
  SectorId,
  Tier,
  TierBand,
} from "./types";

export const METRICS_BY_ID: Record<string, MetricContent> = Object.fromEntries(
  METRIC_CONTENT.map((m) => [m.id, m]),
);

export const PILLAR_ORDER = PILLAR_META.map((p) => p.id) as PillarId[];

export function metricsForPillar(pillar: PillarId, sector: SectorId): MetricContent[] {
  return METRIC_CONTENT.filter(
    (m) => m.pillar === pillar && !(SCORING[m.id]?.notApplicable ?? []).includes(sector),
  );
}

/** Free-text parser: accepts a point figure or a range, resolved at its midpoint. */
export function parseInput(raw: string): MetricInput | null {
  const text = raw.trim();
  if (!text) return null;
  const cleaned = text.replace(/[,$₹€£%]/g, "").replace(/\s+/g, " ");
  const rangeMatch = cleaned.match(
    /^(-?\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(-?\d+(?:\.\d+)?)$/i,
  );
  if (rangeMatch) {
    const lo = Number(rangeMatch[1]);
    const hi = Number(rangeMatch[2]);
    if (Number.isNaN(lo) || Number.isNaN(hi)) return null;
    return { raw: text, value: (lo + hi) / 2, mode: "range", confidence: "Estimated" };
  }
  const single = cleaned.match(/^-?\d+(?:\.\d+)?$/);
  if (!single) return null;
  return { raw: text, value: Number(cleaned), mode: "point", confidence: "Stated" };
}

const inBand = (value: number, b: { min?: number; max?: number }) =>
  (b.min === undefined || value >= b.min) && (b.max === undefined || value < b.max);

function resolveBands(metricId: string, sector: SectorId): Band[] {
  const s = SCORING[metricId];
  if (!s) return [];
  return s.sectorBands?.[sector] ?? s.pointBands;
}

export function sectorNoteFor(metricId: string, sector: SectorId): string | undefined {
  return SCORING[metricId]?.sectorNote?.[sector];
}

export function scoreMetric(
  metricId: string,
  input: MetricInput,
  sector: SectorId,
): MetricResult | null {
  const content = METRICS_BY_ID[metricId];
  const scoring = SCORING[metricId];
  if (!content || !scoring) return null;
  const bands = resolveBands(metricId, sector);
  const band: Band | undefined = bands.find((b) => inBand(input.value, b)) ?? bands[bands.length - 1];
  if (!band) return null;

  const tiers: TierBand[] | undefined = scoring.tierBands?.[sector];
  const tierBand = tiers?.find((t) => inBand(input.value, t));
  const tier: Tier = tierBand?.tier ?? band.tier;

  return {
    metricId,
    name: content.name,
    value: input.value,
    input,
    points: band.points,
    maxPoints: content.maxPoints,
    tier,
    bandLabel: tierBand?.label ?? band.label,
    showAreas: tier !== "healthy",
  };
}

export function assessPillar(
  pillar: PillarId,
  inputs: BaseInputSet,
  sector: SectorId,
): PillarAssessment {
  const meta = PILLAR_META.find((p) => p.id === pillar)!;
  const applicable = metricsForPillar(pillar, sector);
  const results: MetricResult[] = [];

  for (const m of applicable) {
    const input = inputs[m.id];
    if (!input) continue;
    const r = scoreMetric(m.id, input, sector);
    if (r) results.push(r);
  }

  const earnedPoints = results.reduce((sum, r) => sum + r.points, 0);
  const availablePoints = results.reduce((sum, r) => sum + r.maxPoints, 0);
  // Re-weighting: missing metrics leave both numerator and denominator — never scored as zero.
  const score = availablePoints > 0 ? Math.round((earnedPoints / availablePoints) * 100) : 0;

  const tier = COVERAGE_TIERS[pillar];
  const entered = results.length;
  const meetsCriticalMinimum = entered >= tier.floor;
  const confidence =
    entered >= tier.standard ? "High" : entered > tier.floor ? "Moderate" : "Indicative";

  return {
    pillarId: pillar,
    name: meta.name,
    weight: meta.weight,
    earnedPoints,
    availablePoints,
    score,
    entered,
    applicable: applicable.length,
    coverage: applicable.length ? entered / applicable.length : 0,
    meetsCriticalMinimum,
    confidence,
    metricResults: results,
  };
}

/**
 * Caution mechanism — scoped to exactly two terminal-risk indicators.
 * Evaluated after scoring; it can never influence, delay or gate a score.
 */
export function evaluateCaution(inputs: BaseInputSet): CautionItem[] {
  const out: CautionItem[] = [];
  const runway = inputs["cash-runway-risk"] ?? inputs["cash-runway"];
  if (runway && runway.value < 3) {
    const src = METRICS_BY_ID["cash-runway-risk"];
    out.push({
      metricId: src.id,
      name: "Cash Runway",
      headline: `Cash runway is recorded at ${formatNumber(runway.value)} months, below the 3-month critical threshold.`,
      areas: src.areas,
    });
  }
  const conc = inputs["customer-concentration-risk"] ?? inputs["revenue-concentration"];
  if (conc && conc.value > 60) {
    const src = METRICS_BY_ID["customer-concentration-risk"];
    out.push({
      metricId: src.id,
      name: "Customer Concentration",
      headline: `Top-three customer concentration is recorded at ${formatNumber(conc.value)} percent, above the 60 percent critical threshold.`,
      areas: src.areas,
    });
  }
  return out;
}

export function buildIntegratedReport(
  pillars: PillarAssessment[],
  inputs: BaseInputSet,
): IntegratedReport {
  const weighted = pillars.reduce((sum, p) => sum + p.score * p.weight, 0);
  const totalWeight = pillars.reduce((sum, p) => sum + p.weight, 0);
  return {
    integratedScore: totalWeight > 0 ? Math.round(weighted / totalWeight) : 0,
    pillars,
    caution: evaluateCaution(inputs),
  };
}

export function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(n < 10 ? 1 : 0);
}

export function formatValue(n: number, unit: string): string {
  switch (unit) {
    case "percent":
      return `${formatNumber(n)}%`;
    case "months":
      return `${formatNumber(n)} months`;
    case "days":
      return `${formatNumber(n)} days`;
    case "multiple":
      return `${formatNumber(n)}x`;
    case "ratio":
      return formatNumber(n);
    case "currency":
      return n.toLocaleString();
    default:
      return formatNumber(n);
  }
}
