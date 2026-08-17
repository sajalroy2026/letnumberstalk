import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PILLAR_META } from "@/lib/assessment/spec.generated";
import type { PillarId, Tier } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export const tierStroke: Record<Tier, string> = {
  healthy: "var(--healthy)",
  acceptable: "var(--acceptable)",
  concern: "var(--concern)",
  critical: "var(--critical)",
};

export const tierTextClass: Record<Tier, string> = {
  healthy: "text-healthy",
  acceptable: "text-acceptable",
  concern: "text-concern",
  critical: "text-critical",
};

/* --------------------------------------------------------- Counting figure */

export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(target * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

/* -------------------------------------------------------------- Score dial */

export function ScoreDial({
  score,
  size = 260,
  label,
  tier = "healthy",
}: {
  score: number;
  size?: number;
  label?: string;
  tier?: Tier;
}) {
  const shown = useCountUp(score, 1800);
  const r = 46;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <circle
          cx="60"
          cy="60"
          r={r + 8}
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.75"
          strokeDasharray="1 5"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={tierStroke[tier]}
          strokeWidth="3"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.8, ease }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="figure text-5xl font-medium leading-none text-foreground">{shown}</span>
        <span className="mt-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
          {label ?? "of 100"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- Pillar weight ring */

export function PillarWeightRing({ active }: { active?: PillarId[] }) {
  let offset = 0;
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <figure className="print-avoid-break border border-border bg-card p-6 shadow-[var(--shadow-plate)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6">
        <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90" role="img" aria-label="Pillar weighting">
          {PILLAR_META.map((p, i) => {
            const len = p.weight * c;
            const el = (
              <circle
                key={p.id}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={i % 2 === 0 ? "var(--primary)" : "var(--accent)"}
                strokeOpacity={active && !active.includes(p.id) ? 0.18 : 1 - i * 0.09}
                strokeWidth="14"
                strokeDasharray={`${len - 2} ${c - len + 2}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <ul className="min-w-0 space-y-1.5">
          {PILLAR_META.map((p) => (
            <li key={p.id} className="flex items-baseline justify-between gap-3 text-xs">
              <span className="truncate text-muted-foreground">{p.name}</span>
              <span className="figure shrink-0 text-foreground">{Math.round(p.weight * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-4 border-t border-border pt-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        Composite weighting · 7 pillars
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------ Tier meter */

export function TierMeter({ tier, points, max }: { tier: Tier; points: number; max: number }) {
  const pct = max > 0 ? Math.max(0.04, points / max) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-full min-w-0 bg-border/70">
        <motion.div
          className="h-full"
          style={{ background: tierStroke[tier], transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{ duration: 0.9, ease }}
        />
      </div>
      <span className="figure shrink-0 text-xs text-muted-foreground">
        {points}/{max}
      </span>
    </div>
  );
}

/* -------------------------------------------------------- Benchmark scale */

export function BenchmarkScale({
  marks,
  position,
  unitSuffix,
}: {
  marks: { label: string; tier: Tier }[];
  position: number;
  unitSuffix?: string;
}) {
  return (
    <div className="print-avoid-break">
      <div className="flex h-2 w-full overflow-hidden rounded-[1px]">
        {marks.map((m, i) => (
          <div
            key={i}
            className="h-full flex-1"
            style={{ background: tierStroke[m.tier], opacity: 0.75 }}
          />
        ))}
      </div>
      <div className="relative mt-1 h-5">
        <motion.div
          className="absolute top-0 -translate-x-1/2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0, left: `${Math.min(98, Math.max(2, position * 100))}%` }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="block h-3 w-px bg-foreground" aria-hidden />
          <span className="figure absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-[0.65rem] text-foreground">
            {unitSuffix}
          </span>
        </motion.div>
      </div>
      <div className="mt-5 flex justify-between gap-2 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
        {marks.map((m, i) => (
          <span key={i} className={cn("flex-1 truncate", i > 0 && "text-right")}>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Value chain figure */

export const VALUE_CHAIN_STAGES = [
  "Demand",
  "Acquisition",
  "Delivery",
  "Operations",
  "Capital",
] as const;

export type ValueChainStage = (typeof VALUE_CHAIN_STAGES)[number];

const PILLAR_STAGE: Record<PillarId, ValueChainStage> = {
  financial: "Capital",
  risk: "Capital",
  market: "Demand",
  operational: "Delivery",
  strategic: "Demand",
  organizational: "Operations",
  technology: "Operations",
};

export function stageForPillar(pillar: PillarId): ValueChainStage {
  return PILLAR_STAGE[pillar];
}

export function ValueChain({ highlight }: { highlight: ValueChainStage }) {
  return (
    <div
      className="print-avoid-break flex flex-wrap items-center gap-x-1.5 gap-y-2"
      role="img"
      aria-label={`Value chain, finding located at ${highlight}`}
    >
      {VALUE_CHAIN_STAGES.map((s, i) => {
        const on = s === highlight;
        return (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className={cn(
                "border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em] transition-colors",
                on
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              {s}
            </span>
            {i < VALUE_CHAIN_STAGES.length - 1 ? (
              <span className="text-muted-foreground/60" aria-hidden>
                ›
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
