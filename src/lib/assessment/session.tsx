import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { assessPillar, buildIntegratedReport, PILLAR_ORDER } from "./engine";
import type {
  BaseInputSet,
  IntegratedReport,
  MetricInput,
  PillarAssessment,
  PillarId,
  SectorId,
} from "./types";

export type Stage = "sector" | "pillars" | "assess" | "report";

interface SessionState {
  stage: Stage;
  sector: SectorId | null;
  selectedPillars: PillarId[];
  activeIndex: number;
  inputs: BaseInputSet;
  setSector: (s: SectorId) => void;
  togglePillar: (p: PillarId) => void;
  selectAllPillars: () => void;
  startAssessment: () => void;
  setInput: (metricId: string, input: MetricInput | null) => void;
  goToPillar: (i: number) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  assessments: PillarAssessment[];
  report: IntegratedReport | null;
  isFullAssessment: boolean;
}

const Ctx = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("sector");
  const [sector, setSectorState] = useState<SectorId | null>(null);
  const [selectedPillars, setSelectedPillars] = useState<PillarId[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputs, setInputs] = useState<BaseInputSet>({});

  const setSector = useCallback((s: SectorId) => {
    setSectorState(s);
    setStage("pillars");
  }, []);

  const togglePillar = useCallback((p: PillarId) => {
    setSelectedPillars((prev) =>
      prev.includes(p)
        ? prev.filter((x) => x !== p)
        : [...prev, p].sort((a, b) => PILLAR_ORDER.indexOf(a) - PILLAR_ORDER.indexOf(b)),
    );
  }, []);

  const selectAllPillars = useCallback(() => setSelectedPillars([...PILLAR_ORDER]), []);

  const startAssessment = useCallback(() => {
    setActiveIndex(0);
    setStage("assess");
  }, []);

  const setInput = useCallback((metricId: string, input: MetricInput | null) => {
    setInputs((prev) => {
      const next = { ...prev };
      if (input) next[metricId] = input;
      else delete next[metricId];
      return next;
    });
  }, []);

  const goToPillar = useCallback((i: number) => {
    setActiveIndex(i);
    setStage("assess");
  }, []);

  const next = useCallback(() => {
    setActiveIndex((i) => {
      if (i + 1 >= selectedPillars.length) {
        setStage("report");
        return i;
      }
      return i + 1;
    });
  }, [selectedPillars.length]);

  const back = useCallback(() => {
    setActiveIndex((i) => {
      if (i === 0) {
        setStage("pillars");
        return 0;
      }
      return i - 1;
    });
  }, []);

  const reset = useCallback(() => {
    setStage("sector");
    setSectorState(null);
    setSelectedPillars([]);
    setActiveIndex(0);
    setInputs({});
  }, []);

  const assessments = useMemo(
    () => (sector ? selectedPillars.map((p) => assessPillar(p, inputs, sector)) : []),
    [sector, selectedPillars, inputs],
  );

  const isFullAssessment = selectedPillars.length === PILLAR_ORDER.length;

  const report = useMemo(
    () => (isFullAssessment && assessments.length === PILLAR_ORDER.length
      ? buildIntegratedReport(assessments, inputs)
      : null),
    [isFullAssessment, assessments, inputs],
  );

  const value: SessionState = {
    stage,
    sector,
    selectedPillars,
    activeIndex,
    inputs,
    setSector,
    togglePillar,
    selectAllPillars,
    startAssessment,
    setInput,
    goToPillar,
    next,
    back,
    reset,
    assessments,
    report,
    isFullAssessment,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
