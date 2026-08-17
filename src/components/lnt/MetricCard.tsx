import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";

import { formatValue, parseInput, scoreMetric, sectorNoteFor } from "@/lib/assessment/engine";
import { SCORING } from "@/lib/assessment/scoring";
import type { MetricContent } from "@/lib/assessment/spec.generated";
import type { MetricInput, SectorId, Tier } from "@/lib/assessment/types";
import { ValueChain, stageForPillar, tierTextClass } from "@/components/lnt/Figures";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const tierBorder: Record<Tier, string> = {
  healthy: "border-healthy",
  acceptable: "border-acceptable",
  concern: "border-concern",
  critical: "border-critical",
};

const tierLabel: Record<Tier, string> = {
  healthy: "Within the healthy corridor",
  acceptable: "Acceptable against sector norms",
  concern: "Outside the healthy corridor",
  critical: "Critical against sector norms",
};

const TIER_LADDER: Tier[] = ["critical", "concern", "acceptable", "healthy"];

type PanelKey = "definition" | "formula" | "sourcing" | "benchmarks";

export function MetricCard({
  metric,
  sector,
  input,
  onChange,
  index,
}: {
  metric: MetricContent;
  sector: SectorId;
  input: MetricInput | undefined;
  onChange: (metricId: string, input: MetricInput | null) => void;
  index: number;
}) {
  const scoring = SCORING[metric.id]!;
  const [raw, setRaw] = useState(input?.raw ?? "");
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

  const result = useMemo(
    () => (input ? scoreMetric(metric.id, input, sector) : null),
    [input, metric.id, sector],
  );
  const note = sectorNoteFor(metric.id, sector);
  const commit = (text: string) => {
    setRaw(text);
    onChange(metric.id, parseInput(text));
  };
  const invalid = raw.trim().length > 0 && !input;
  const toggle = (k: PanelKey) => setOpenPanel(openPanel === k ? null : k);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: Math.min(index * 0.04, 0.24), ease }}
      className="print-avoid-break print-plain border border-border bg-card shadow-[var(--shadow-plate)]"
    >
      <div className="border-b border-border px-6 py-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
          <h3 className="min-w-0 font-display text-lg leading-snug text-foreground sm:text-xl">
            {metric.name}
          </h3>
          <span className="figure shrink-0 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            {metric.maxPoints} pts{metric.essential ? " · essential" : ""}
          </span>
        </div>
        <p className="mt-2.5 measure text-sm leading-relaxed text-muted-foreground">
          {metric.definition}
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {scoring.cards ? (
          <div className="grid gap-2" role="group" aria-label={`${metric.name} band selection`}>
            {scoring.cards.map((c) => {
              const active = input?.value === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() =>
                    onChange(
                      metric.id,
                      active
                        ? null
                        : { raw: c.label, value: c.value, mode: "point", confidence: "Stated" },
                    )
                  }
                  aria-pressed={active}
                  className={cn(
                    "border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-accent bg-accent/8"
                      : "border-border hover:border-accent/60 hover:bg-secondary/60",
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="figure text-[0.7rem] text-accent">0{c.value}</span>
                    <span className="text-sm font-medium text-foreground">{c.label}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {c.description}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0">
              <label
                htmlFor={`input-${metric.id}`}
                className="block text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Entered figure or range
              </label>
              <input
                id={`input-${metric.id}`}
                value={raw}
                inputMode="text"
                onChange={(e) => commit(e.target.value)}
                placeholder={scoring.placeholder}
                aria-invalid={invalid}
                className={cn(
                  "figure mt-2 w-full border-0 border-b bg-transparent pb-2 text-2xl text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-muted-foreground/70",
                  invalid ? "border-concern" : "border-input focus:border-accent",
                )}
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-[22ch] sm:text-right">
              {invalid
                ? "A figure or a range such as 12-16 is read here."
                : input?.mode === "range"
                  ? `Range resolved at midpoint — ${formatValue(input.value, scoring.unit)}. Confidence: Estimated.`
                  : "Ranges resolve at midpoint and carry an Estimated confidence flag."}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 no-print">
          <Chip active={openPanel === "formula"} onClick={() => toggle("formula")}>
            Formula
          </Chip>
          <Chip active={openPanel === "sourcing"} onClick={() => toggle("sourcing")}>
            Where to source
          </Chip>
          {metric.benchmarks ? (
            <Chip active={openPanel === "benchmarks"} onClick={() => toggle("benchmarks")}>
              Sector benchmarks
            </Chip>
          ) : null}
        </div>

        <AnimatePresence initial={false} mode="wait">


          {openPanel === "formula" ? (
            <Panel key="formula" label="Formula">
              <p className="figure text-[0.95rem] leading-relaxed text-foreground">
                {metric.formula}
              </p>
              {result ? (
                <p className="mt-4 figure text-sm text-accent">
                  Reading = {formatValue(result.value, scoring.unit)}
                </p>
              ) : null}
            </Panel>
          ) : null}

          {openPanel === "sourcing" ? (
            <Panel key="sourcing" label="Where to source">
              <p className="measure text-sm leading-relaxed text-foreground/85">
                {metric.guidance}
              </p>
              {note ? (
                <p className="mt-3 measure text-xs italic leading-relaxed text-muted-foreground">
                  {note}
                </p>
              ) : null}
            </Panel>
          ) : null}

          {openPanel === "benchmarks" && metric.benchmarks ? (
            <Panel key="benchmarks" label="Sector benchmarks">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-foreground/25">
                      {metric.benchmarks.header.map((h) => (
                        <th
                          key={h}
                          className="px-3 pb-2 text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metric.benchmarks.rows.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={cn(
                              "px-3 py-2.5",
                              j === 0
                                ? "text-foreground"
                                : "figure text-xs text-muted-foreground",
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className={cn("border-t-2 bg-secondary/50 px-6 py-6 sm:px-8", tierBorder[result.tier])}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
              <div className="min-w-0">
                <span className="figure text-3xl leading-none text-foreground">
                  {formatValue(result.value, scoring.unit)}
                </span>
                <span
                  className={cn("ml-3 text-sm font-medium", tierTextClass[result.tier])}
                >
                  {tierLabel[result.tier]}
                </span>
              </div>
              <span className="figure shrink-0 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                {result.points}/{result.maxPoints} pts · {result.input.confidence}
              </span>
            </div>

            <div className="mt-4 flex gap-1" aria-hidden>
              {TIER_LADDER.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "h-1 flex-1",
                    t === result.tier ? "opacity-100" : "opacity-25",
                  )}
                  style={{
                    background:
                      t === "healthy"
                        ? "var(--healthy)"
                        : t === "acceptable"
                          ? "var(--acceptable)"
                          : t === "concern"
                            ? "var(--concern)"
                            : "var(--critical)",
                  }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[0.55rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Critical</span>
              <span>Concern</span>
              <span>Acceptable</span>
              <span>Healthy</span>
            </div>

            <p className="mt-5 measure text-sm leading-relaxed text-foreground/85">
              {metric.reading}
            </p>

            {result.showAreas ? (
              <div className="mt-6 border-l-2 border-accent bg-card px-5 py-5">
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-accent">
                  Areas to look into
                </p>
                <div className="mt-3">
                  <ValueChain highlight={stageForPillar(metric.pillar)} />
                </div>
                <p className="mt-4 measure text-sm leading-relaxed text-foreground/85">
                  {metric.areas}
                </p>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "border px-3.5 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease }}
      className="overflow-hidden"
    >
      <div className="mt-5 border border-border bg-secondary/40 px-5 py-5">
        <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">{label}</p>
        <div className="mt-3">{children}</div>
      </div>
    </motion.div>
  );
}
