export type PillarId =
  | "financial"
  | "operational"
  | "market"
  | "organizational"
  | "strategic"
  | "risk"
  | "technology";

export type SectorId = "services" | "manufacturing" | "retail" | "saas" | "startup";

export type Tier = "healthy" | "acceptable" | "concern" | "critical";

export type Unit =
  | "percent"
  | "months"
  | "days"
  | "ratio"
  | "multiple"
  | "currency"
  | "count"
  | "score"
  | "ordinal";

export interface Band {
  /** inclusive lower bound */
  min?: number;
  /** exclusive upper bound */
  max?: number;
  points: number;
  tier: Tier;
  label: string;
}

export interface TierBand {
  min?: number;
  max?: number;
  tier: Tier;
  label: string;
}

export interface BandCard {
  value: number;
  label: string;
  description: string;
}

export interface MetricScoring {
  id: string;
  unit: Unit;
  placeholder: string;
  /** Sector-neutral point bands, taken verbatim from the metric's Scoring Band line. */
  pointBands: Band[];
  /** Where the Scoring Band line is itself expressed in sector-relative terms. */
  sectorBands?: Partial<Record<SectorId, Band[]>>;
  /** Sector benchmark classification, used for the healthy/outside-healthy reading. */
  tierBands?: Partial<Record<SectorId, TierBand[]>>;
  /** Note shown where the sector table does not carry a row for the selected profile. */
  sectorNote?: Partial<Record<SectorId, string>>;
  /** Guided descriptive band cards for self-assessment metrics. */
  cards?: BandCard[];
  /** Metrics that do not apply to every sector (e.g. inventory in a services firm). */
  notApplicable?: SectorId[];
}

export type EntryMode = "point" | "range";
export type InputConfidence = "Stated" | "Estimated";
export type PillarConfidence = "High" | "Moderate" | "Indicative";

export interface MetricInput {
  raw: string;
  value: number;
  mode: EntryMode;
  confidence: InputConfidence;
}

/** BaseInputSet — canonical figures entered by the user, held in memory only. */
export type BaseInputSet = Record<string, MetricInput>;

export interface MetricResult {
  metricId: string;
  name: string;
  value: number;
  input: MetricInput;
  points: number;
  maxPoints: number;
  tier: Tier;
  bandLabel: string;
  showAreas: boolean;
}

/** PillarAssessment — computed score, breakdown and Areas content for one pillar. */
export interface PillarAssessment {
  pillarId: PillarId;
  name: string;
  weight: number;
  earnedPoints: number;
  availablePoints: number;
  score: number;
  entered: number;
  applicable: number;
  coverage: number;
  meetsCriticalMinimum: boolean;
  confidence: PillarConfidence;
  metricResults: MetricResult[];
}

export interface CautionItem {
  metricId: string;
  name: string;
  headline: string;
  areas: string;
}

/** IntegratedReport — instantiated once all seven PillarAssessment objects exist. */
export interface IntegratedReport {
  integratedScore: number;
  pillars: PillarAssessment[];
  caution: CautionItem[];
}
