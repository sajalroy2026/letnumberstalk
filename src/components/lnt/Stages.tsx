import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics/track";

import { MetricCard } from "./MetricCard";
import { Disclosure } from "./SiteChrome";
import { AboutSections } from "./AboutSections";
import { COVERAGE_TIERS, SECTORS } from "@/lib/assessment/scoring";
import { metricsForPillar, METRICS_BY_ID, PILLAR_ORDER } from "@/lib/assessment/engine";
import { PILLAR_META } from "@/lib/assessment/spec.generated";
import { useSession } from "@/lib/assessment/session";
import {
  ChapterPlate,
  PillarSpectrum,
  PillarWeightRing,
  ScoreDial,
  SectorPlate,
  ValueChain,
  pillarColor,
  stageForPillar,
} from "./Figures";

import type { MetricResult, PillarAssessment, PillarId, Tier } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";

const PILLAR_NOTE: Record<PillarId, string> = {
  financial: "Cash, margin, growth and the runway beneath them.",
  risk: "Concentration, dependency and the exposures that end businesses.",
  market: "Retention, acquisition economics and standing against competitors.",
  operational: "Throughput, quality and the cost of doing the work.",
  strategic: "Scalability, differentiation and the durability of position.",
  organizational: "People productivity, retention and leadership depth.",
  technology: "Automation, data integrity and systems fitness.",
};

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------- Sector */

export function SectorStage() {
  const { sector, setSector } = useSession();
  return (
    <StageShell
      eyebrow="Step 1"
      title="Which profile does the business run on?"
      lede="Every benchmark in this assessment is sector-specific. The profile selected here recalibrates all 54 comparisons for the session — there is no general fallback."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTORS.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => setSector(s.id)}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease }}
            aria-pressed={sector === s.id}
            className={cn(
              "tilt-card group relative overflow-hidden border bg-card text-left shadow-[var(--shadow-plate)]",
              sector === s.id ? "border-accent" : "border-border hover:border-accent/60",
            )}
          >
            <SectorPlate id={s.id} active={sector === s.id} />
            <span className="block border-t border-border p-6">
              <span className="block font-display text-lg text-foreground">{s.name}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </span>
              <span className="mt-5 block text-xs uppercase tracking-[0.2em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Calibrate to this profile →
              </span>
            </span>

          </motion.button>
        ))}
      </div>
    </StageShell>
  );
}

/* ---------------------------------------------------------- Pillar select */

export function PillarSelectStage() {
  const { selectedPillars, togglePillar, selectAllPillars, startAssessment, sector } = useSession();
  const sectorName = SECTORS.find((s) => s.id === sector)?.name;
  const all = selectedPillars.length === 7;

  return (
    <StageShell
      eyebrow={`Step 2 · calibrated to ${sectorName}`}
      title="Which pillars are under examination?"
      lede="One pillar returns one score. All 7 return the Integrated Business Health Score — a weighted composite across the full instrument."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {PILLAR_META.map((p, i) => {
          const active = selectedPillars.includes(p.id);
          const count = sector ? metricsForPillar(p.id, sector).length : 0;
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => togglePillar(p.id)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease }}
              aria-pressed={active}
              className={cn(
                "flex items-start gap-4 border bg-card p-5 text-left shadow-[var(--shadow-plate)] transition-colors",
                active ? "border-accent bg-accent/8" : "border-border hover:border-accent/60",
              )}
            >
              <span
                className={cn(
                  "mt-1 grid size-5 shrink-0 place-items-center rounded-full border text-[0.6rem]",
                  active ? "border-accent bg-accent text-accent-foreground" : "border-border",
                )}
                aria-hidden
              >
                {active ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-base text-foreground">{p.name}</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {Math.round(p.weight * 100)}% weight · {count} metrics
                  </span>
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                  {PILLAR_NOTE[p.id]}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={selectAllPillars}
          className="border border-border px-5 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent/70 hover:text-foreground"
        >
          Select all 7
        </button>
        <button
          type="button"
          disabled={selectedPillars.length === 0}
          onClick={startAssessment}
          className="rule-copper px-7 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Begin assessment
        </button>
        <span className="text-xs text-muted-foreground">
          {selectedPillars.length === 0
            ? "Select at least one pillar."
            : all
              ? "All 7 selected — the Integrated Business Health Score will be computed."
              : `${selectedPillars.length} selected — independent pillar scores only, no blended figure.`}
        </span>
      </div>
    </StageShell>
  );
}

/* ----------------------------------------------------------- Pillar stage */

export function PillarStage() {
  const {
    sector,
    selectedPillars,
    activeIndex,
    inputs,
    setInput,
    next,
    back,
    assessments,
    isFullAssessment,
  } = useSession();
  const pillarId = selectedPillars[activeIndex]!;
  const meta = PILLAR_META.find((p) => p.id === pillarId)!;
  const metrics = useMemo(() => (sector ? metricsForPillar(pillarId, sector) : []), [sector, pillarId]);
  const assessment = assessments[activeIndex]!;
  const tier = COVERAGE_TIERS[pillarId]!;
  const topRef = useRef<HTMLDivElement>(null);
  const accent = pillarColor(pillarId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    topRef.current?.scrollIntoView({ block: "start" });
  }, [activeIndex]);

  const isLast = activeIndex === selectedPillars.length - 1;

  return (
    <div ref={topRef}>
      <ProgressSpine />
      <ChapterPlate
        index={activeIndex + 1}
        total={selectedPillars.length}
        name={meta.name}
        weight={meta.weight}
        note={`${PILLAR_NOTE[pillarId]} Enter what is known — the calculation re-weights across exactly the metrics you supply.`}
      />
      <PillarIdentityRail
        name={meta.name}
        weight={meta.weight}
        accent={accent}
        entered={assessment.entered}
        total={metrics.length}
        score={assessment.meetsCriticalMinimum ? assessment.score : null}
      />
      <motion.div
        key={pillarId}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-8"
      >



        <div className="border border-border bg-card p-5 shadow-[var(--shadow-plate)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {assessment.entered} of {metrics.length} metrics entered · minimum for a meaningful
              score: {tier.floor}
            </span>
            <span
              className={cn(
                "text-xs uppercase tracking-[0.18em]",
                assessment.meetsCriticalMinimum ? "text-healthy" : "text-muted-foreground",
              )}
            >
              {assessment.meetsCriticalMinimum
                ? `Scoring · ${assessment.confidence} confidence`
                : "Below critical minimum"}
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="rule-copper h-full"
              animate={{ width: `${Math.round(assessment.coverage * 100)}%` }}
              transition={{ duration: 0.6, ease }}
            />
          </div>
          {!assessment.meetsCriticalMinimum ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A meaningful reading for this pillar needs at least {tier.floor} metrics — {tier.floorText}.
              Figures entered so far are held for the session and score once that floor is reached.
            </p>
          ) : null}
        </div>

        <div className="mt-10 space-y-6">
          {metrics.map((m, i) => (
            <MetricCard
              key={m.id}
              index={i}
              metric={m}
              sector={sector!}
              input={inputs[m.id]}
              onChange={setInput}
            />
          ))}
        </div>

        {assessment.meetsCriticalMinimum ? (
          <PillarScorePlate assessment={assessment} className="mt-12" />
        ) : null}

        <div className="no-print mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={back}
            className="border border-border px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent/70 hover:text-foreground"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="rule-copper px-8 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
          >
            {isLast ? (isFullAssessment ? "Compute integrated score" : "View results") : "Next pillar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Pinned identity of the pillar under examination — stays at the top of the
 * viewport for the whole of the metric run so orientation is never lost.
 */
function PillarIdentityRail({
  name,
  weight,
  accent,
  entered,
  total,
  score,
}: {
  name: string;
  weight: number;
  accent: string;
  entered: number;
  total: number;
  score: number | null;
}) {
  return (
    <div className="no-print sticky-under-rail border-b border-border/70 bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-2.5 sm:px-8">
        <span className="h-8 w-1.5 shrink-0" style={{ background: accent }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm text-foreground sm:text-base">{name}</p>
          <p className="figure text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            {Math.round(weight * 100)}% of composite · {entered}/{total} entered
          </p>
        </div>
        <span className="figure text-2xl" style={{ color: score === null ? "var(--muted-foreground)" : accent }}>
          {score === null ? "—" : score}
        </span>
      </div>
      <div className="h-[3px] w-full bg-secondary" aria-hidden>
        <motion.div
          className="h-full"
          style={{ background: accent }}
          animate={{ width: `${total ? Math.round((entered / total) * 100) : 0}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>
    </div>
  );
}

function ProgressSpine() {
  const { selectedPillars, activeIndex, goToPillar, assessments } = useSession();
  return (
    <div className="no-print sticky-under-header border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 py-3 sm:px-8">
        {selectedPillars.map((p, i) => {
          const meta = PILLAR_META.find((m) => m.id === p)!;
          const done = assessments[i]?.meetsCriticalMinimum;
          return (
            <button
              key={p}
              type="button"
              onClick={() => goToPillar(i)}
              style={i === activeIndex ? { borderColor: pillarColor(p) } : undefined}
              className={cn(
                "shrink-0 border-b-2 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
                i === activeIndex
                  ? "border-accent text-foreground"
                  : done
                    ? "border-healthy/60 text-muted-foreground hover:text-foreground"
                    : "border-transparent text-muted-foreground/70 hover:text-foreground",
              )}
            >

              {meta.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Score plate */

const tierOf = (score: number): Tier =>
  score >= 75 ? "healthy" : score >= 55 ? "acceptable" : score >= 35 ? "concern" : "critical";

const tierColor: Record<Tier, string> = {
  healthy: "text-healthy",
  acceptable: "text-acceptable",
  concern: "text-concern",
  critical: "text-critical",
};

export function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function PillarScorePlate({
  assessment,
  className,
}: {
  assessment: PillarAssessment;
  className?: string;
}) {
  const shown = useCountUp(assessment.score);
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 8, y: 24 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className={cn("plate print-plain p-8", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {assessment.name} score
          </p>
          <p className={cn("mt-2 font-display text-6xl leading-none", tierColor[tierOf(assessment.score)])}>
            {shown}
            <span className="ml-1 text-2xl text-muted-foreground">/100</span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          <Stat label="Points" value={`${assessment.earnedPoints} / ${assessment.availablePoints}`} />
          <Stat label="Metrics read" value={`${assessment.entered} / ${assessment.applicable}`} />
          <Stat label="Confidence" value={assessment.confidence} />
        </dl>
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Scored across the {assessment.entered} metrics entered, re-weighted so unentered metrics
        neither add nor subtract. Weight of this pillar in the integrated composite:{" "}
        {Math.round(assessment.weight * 100)}%.
      </p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-base text-foreground">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ Report */

export function ReportStage() {
  const { assessments, report, sector, goToPillar, reset, isFullAssessment } = useSession();
  const sectorName = SECTORS.find((s) => s.id === sector)?.name;
  const integrated = report?.integratedScore ?? 0;
  const shown = useCountUp(integrated, 1600);

  return (
    <div>
      {/* ------------------------------------------------- Ink cover plate */}
      <section className="ink aurora-wash scanlines print-cover relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <motion.header
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="figure text-[0.68rem] uppercase tracking-[0.28em] text-accent">
              Diagnostic report · {sectorName} profile
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              {isFullAssessment ? "Integrated Business Health" : "Pillar readings"}
            </h1>
            <span className="band-rule mt-6 block" aria-hidden />
          </motion.header>

          {report ? (
            <motion.section
              initial={{ opacity: 0, scale: 0.97, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.95, delay: 0.15, ease }}
              className="glass print-avoid-break mt-10 grid items-center gap-10 p-8 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)]"
            >
              <div className="justify-self-center">
                <ScoreDial
                  score={report.integratedScore}
                  tier={tierOf(report.integratedScore)}
                  label="Integrated"
                />
              </div>
              <div className="min-w-0">
                <p className="figure text-[0.66rem] uppercase tracking-[0.26em] text-muted-foreground">
                  Integrated Business Health Score · {shown} of 100
                </p>
                <p className="mt-3 measure text-sm leading-relaxed text-muted-foreground">
                  Weighted composite across 7 pillars, each pillar contributing at its defined
                  weight. Sector profile: {sectorName}.
                </p>
                <div className="mt-6">
                  <PillarWeightRing />
                </div>
              </div>
            </motion.section>
          ) : (
            <p className="mt-8 measure text-base leading-relaxed text-muted-foreground">
              {assessments.length} of 7 pillars were assessed, so this report presents independent
              pillar scores. Assessing all 7 produces the Integrated Business Health Score.
            </p>
          )}

          {assessments.some((a) => a.meetsCriticalMinimum) ? (
            <div className="mt-10">
              <PillarSpectrum
                rows={assessments
                  .filter((a) => a.meetsCriticalMinimum)
                  .map((a) => ({
                    name: a.name,
                    score: a.score,
                    weight: a.weight,
                    tier: tierOf(a.score),
                  }))}
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-14 sm:px-8">


      {report?.caution.length ? (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="print-plain mt-10 border-l-4 border-critical bg-critical/10 p-8"
          aria-label="Caution"
        >
          <h2 className="text-xs uppercase tracking-[0.28em] text-critical">Caution</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            2 indicators carry terminal risk for a business. The readings below crossed their
            critical thresholds. This is supplementary context to the pillar breakdown above.
          </p>
          <div className="mt-6 space-y-6">
            {report.caution.map((c) => (
              <div key={c.metricId}>
                <h3 className="font-display text-lg text-foreground">{c.name}</h3>
                <p className="mt-1.5 text-sm text-foreground/90">{c.headline}</p>
                <div className="mt-3 border border-border bg-background/40 p-5">
                  <span className="text-xs uppercase tracking-[0.2em] text-primary">
                    Areas to look into
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.areas}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      ) : null}

      <section className="mt-14 space-y-10">
        <h2 className="font-display text-2xl text-foreground">Pillar breakdown</h2>
        {assessments.map((a, i) => (
          <div key={a.pillarId}>
            {a.meetsCriticalMinimum ? (
              <PillarScorePlate assessment={a} />
            ) : (
              <div className="print-plain border border-border bg-card p-8">
                <p className="font-display text-xl text-foreground">{a.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.entered} metrics were entered, below the {COVERAGE_TIERS[a.pillarId]!.floor}{" "}
                  needed for a meaningful reading — {COVERAGE_TIERS[a.pillarId]!.floorText}. The
                  figures entered are held for the session and score once that floor is reached.
                </p>
              </div>
            )}
            <div className="mt-4 space-y-4">
              {a.metricResults.map((r) => (
                <MetricResultRow key={r.metricId} result={r} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goToPillar(i)}
              className="no-print mt-4 text-xs uppercase tracking-[0.18em] text-primary hover:underline"
            >
              Revisit {a.name}
            </button>
          </div>
        ))}
      </section>

      <div className="no-print mt-14 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            track("report_generated");
            window.print();
          }}
          className="rule-copper px-8 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Download report
        </button>
        <button
          type="button"
          onClick={reset}
          className="border border-border px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent/70 hover:text-foreground"
        >
          Start a new session
        </button>
      </div>

      <div className="mt-16 space-y-10">
        <AboutSections />
        <Disclosure />
      </div>
      </div>
    </div>
  );

}

function MetricResultRow({ result }: { result: MetricResult }) {
  const metric = METRICS_BY_ID[result.metricId];
  return (
    <div className="print-avoid-break print-plain border border-border/70 bg-card/40">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 px-5 py-3">
        <span className="min-w-0 text-sm text-foreground">{result.name}</span>
        <span className="figure shrink-0 text-xs text-muted-foreground">
          {result.points} / {result.maxPoints} pts
        </span>
        <span className={cn("text-xs uppercase tracking-[0.14em]", tierColor[result.tier])}>
          {result.bandLabel}
        </span>
      </div>
      {result.showAreas && metric ? (
        <div className="border-t border-border/70 bg-secondary/40 px-5 py-5">
          <p className="text-[0.62rem] uppercase tracking-[0.26em] text-accent">
            Areas to look into
          </p>
          <div className="mt-3">
            <ValueChain highlight={stageForPillar(metric.pillar)} />
          </div>
          <p className="mt-4 measure text-sm leading-relaxed text-foreground/85">{metric.areas}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Shell */

function StageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-5xl px-5 pb-24 pt-16 sm:px-8"
    >
      <p className="text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{lede}</p>
      <div className="mt-12">{children}</div>
    </motion.div>
  );
}

export function AssessmentFlow() {
  const { stage, sector } = useSession();

  // Every stage transition returns the reader to the top of the new chapter.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stage]);

  // Anonymous usage readings — event name and industry profile only.
  useEffect(() => {
    if (stage === "assess") track("assessment_started", sector ?? undefined);
    if (stage === "report") track("assessment_completed", sector ?? undefined);
  }, [stage, sector]);

  return (

    <AnimatePresence mode="wait">
      {stage === "sector" ? <SectorStage key="sector" /> : null}
      {stage === "pillars" ? <PillarSelectStage key="pillars" /> : null}
      {stage === "assess" ? <PillarStage key="assess" /> : null}
      {stage === "report" ? <ReportStage key="report" /> : null}
    </AnimatePresence>
  );
}

export { PILLAR_ORDER };
