import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";

import { formatValue, parseInput, scoreMetric, sectorNoteFor } from "@/lib/assessment/engine";
import { SCORING } from "@/lib/assessment/scoring";
import type { MetricContent } from "@/lib/assessment/spec.generated";
import type { MetricInput, SectorId, Tier } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";

const tierText: Record<Tier, string> = {
  healthy: "text-healthy",
  acceptable: "text-acceptable",
  concern: "text-concern",
  critical: "text-critical",
};

const tierBorder: Record<Tier, string> = {
  healthy: "border-healthy/40",
  acceptable: "border-acceptable/40",
  concern: "border-concern/50",
  critical: "border-critical/50",
};

const tierLabel: Record<Tier, string> = {
  healthy: "Within the healthy range",
  acceptable: "Acceptable",
  concern: "Outside the healthy range",
  critical: "Critical",
};

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
  const [openPanel, setOpenPanel] = useState<"sourcing" | "benchmarks" | null>(null);

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="plate print-plain rounded-md p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-xl leading-snug text-foreground">{metric.name}</h3>
        <span className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {metric.maxPoints} pts{metric.essential ? " · score essential" : ""}
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {metric.definition}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
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
                      "rounded-md border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/12 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    <span className="block text-sm font-medium text-foreground">{c.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed">{c.description}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <label
                htmlFor={`input-${metric.id}`}
                className="block text-xs uppercase tracking-[0.18em] text-muted-foreground"
              >
                Enter a figure or a range
              </label>
              <input
                id={`input-${metric.id}`}
                value={raw}
                inputMode="text"
                onChange={(e) => commit(e.target.value)}
                placeholder={scoring.placeholder}
                aria-invalid={invalid}
                aria-describedby={`formula-${metric.id}`}
                className={cn(
                  "mt-2 w-full rounded-md border bg-background/60 px-4 py-3 font-display text-lg text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/70",
                  invalid ? "border-concern" : "border-border focus:border-primary",
                )}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {invalid
                  ? "A figure or a range such as 12-16 can be read here."
                  : input?.mode === "range"
                    ? `Range resolved at its midpoint — ${formatValue(input.value, scoring.unit)}. Confidence: Estimated.`
                    : "A range such as 12-16 is resolved at its midpoint and flagged as Estimated."}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 no-print">
            <PanelToggle
              active={openPanel === "sourcing"}
              onClick={() => setOpenPanel(openPanel === "sourcing" ? null : "sourcing")}
            >
              Where to find this
            </PanelToggle>
            {metric.benchmarks ? (
              <PanelToggle
                active={openPanel === "benchmarks"}
                onClick={() => setOpenPanel(openPanel === "benchmarks" ? null : "benchmarks")}
              >
                Sector benchmarks
              </PanelToggle>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div
            id={`formula-${metric.id}`}
            className="rounded-md border border-border bg-background/50 px-4 py-3"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Formula</span>
            <p className="mt-1.5 font-display text-[0.95rem] leading-relaxed text-foreground">
              {metric.formula}
            </p>
          </div>
          <div className="rounded-md border border-border bg-background/50 px-4 py-3">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Scoring band
            </span>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{metric.bandText}</p>
          </div>
          {note ? <p className="text-xs italic leading-relaxed text-muted-foreground">{note}</p> : null}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {openPanel === "sourcing" ? (
          <Panel key="sourcing" title="Where to find this">
            {metric.guidance}
          </Panel>
        ) : null}
        {openPanel === "benchmarks" && metric.benchmarks ? (
          <motion.div
            key="benchmarks"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 overflow-x-auto rounded-md border border-border bg-background/50">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {metric.benchmarks.header.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metric.benchmarks.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={cn("px-4 py-2.5", j === 0 ? "text-foreground" : "text-muted-foreground")}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn("mt-6 rounded-md border-l-2 bg-background/40 p-5", tierBorder[result.tier])}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-2xl text-foreground">
                {formatValue(result.value, scoring.unit)}
              </span>
              <span className={cn("text-sm font-medium", tierText[result.tier])}>
                {tierLabel[result.tier]} — {result.bandLabel}
              </span>
              <span className="ml-auto text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {result.points} / {result.maxPoints} pts · {result.input.confidence}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{metric.reading}</p>

            {result.showAreas ? (
              <div className="mt-5 rounded-md border border-primary/25 bg-primary/8 p-5">
                <span className="text-xs uppercase tracking-[0.2em] text-primary">
                  Areas to look into
                </span>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">{metric.areas}</p>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

function PanelToggle({
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
        "rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
        active
          ? "border-primary text-primary"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-5 rounded-md border border-border bg-background/50 p-5">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </motion.div>
  );
}
