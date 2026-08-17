import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PILLAR_META } from "@/lib/assessment/spec.generated";
import type { PillarId, Tier } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Colour as information: every pillar owns an accent across the whole system. */
export const pillarColor = (id: PillarId) => `var(--pillar-${id})`;

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

/* ------------------------------------------------------------ Parallax bed */

/**
 * Scroll-driven depth layer. `depth` is a multiplier: 0 sits flat with the page,
 * 1 drifts a full band. Honours reduced motion by collapsing to a static layer.
 */
export function ParallaxLayer({
  depth = 0.3,
  className,
  children,
}: {
  depth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [depth * 90, depth * -90]);
  const y = useSpring(raw, { stiffness: 60, damping: 26, mass: 0.6 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}


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
          {PILLAR_META.map((p) => {
            const len = p.weight * c;
            const el = (
              <circle
                key={p.id}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={pillarColor(p.id)}
                strokeOpacity={active && !active.includes(p.id) ? 0.18 : 1}
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
            <li key={p.id} className="flex items-baseline gap-2.5 text-xs">
              <span
                className="mt-1 size-2 shrink-0"
                style={{ background: pillarColor(p.id) }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{p.name}</span>
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

/* ------------------------------------------------- Pillar constellation */

/**
 * Hero instrument: 7 pillar nodes on an orbit, each arc sized to its weighting.
 * Slow, engineered rotation — no bounce, honours reduced motion via CSS.
 */
export function PillarConstellation({ className }: { className?: string }) {
  const R = 118;
  const cx = 160;
  const cy = 160;
  let acc = -Math.PI / 2;

  const segments = PILLAR_META.map((p, i) => {
    const sweep = p.weight * Math.PI * 2;
    const start = acc;
    const end = acc + sweep - 0.05;
    acc += sweep;
    const mid = (start + end) / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const path = `M ${cx + R * Math.cos(start)} ${cy + R * Math.sin(start)} A ${R} ${R} 0 ${large} 1 ${cx + R * Math.cos(end)} ${cy + R * Math.sin(end)}`;
    return {
      id: p.id,
      name: p.name,
      weight: p.weight,
      path,
      nx: cx + R * Math.cos(mid),
      ny: cy + R * Math.sin(mid),
      lx: cx + (R + 26) * Math.cos(mid),
      ly: cy + (R + 26) * Math.sin(mid),
      i,
    };
  });

  return (
    <div className={cn("relative", className)}>
      <motion.svg
        viewBox="0 0 320 320"
        className="h-full w-full"
        role="img"
        aria-label="7 weighted pillars of the diagnostic"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease }}
      >
        <motion.g
          style={{ originX: "160px", originY: "160px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 220, ease: "linear", repeat: Infinity }}
        >
          <circle cx={cx} cy={cy} r={R + 34} fill="none" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 7" />
          <circle cx={cx} cy={cy} r={R - 40} fill="none" stroke="var(--border)" strokeWidth="0.75" />
          {segments.map((s) => (
            <g key={`tick-${s.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={s.nx}
                y2={s.ny}
                stroke="var(--border)"
                strokeWidth="0.75"
              />
              <circle cx={s.nx} cy={s.ny} r={3.6} fill={pillarColor(s.id)} />
            </g>
          ))}
        </motion.g>

        {segments.map((s, i) => (
          <motion.path
            key={s.id}
            d={s.path}
            fill="none"
            stroke={pillarColor(s.id)}

            strokeWidth={6 + s.weight * 26}
            strokeLinecap="butt"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.92 }}
            transition={{ duration: 1.5, delay: 0.25 + i * 0.12, ease }}
          />
        ))}

        <circle cx={cx} cy={cy} r={54} fill="var(--card)" stroke="var(--border)" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="figure"
          fontSize="30"
          fill="var(--foreground)"
        >
          54
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="2.4"
          fill="var(--muted-foreground)"
        >
          METRICS
        </text>

        {segments.map((s) => (
          <text
            key={`l-${s.id}`}
            x={s.lx}
            y={s.ly}
            textAnchor={s.lx > cx + 6 ? "start" : s.lx < cx - 6 ? "end" : "middle"}
            className="figure"
            fontSize="8.5"
            fill="var(--muted-foreground)"
          >
            {Math.round(s.weight * 100)}%
          </text>
        ))}
      </motion.svg>
    </div>
  );
}

/* -------------------------------------------------------- Chapter plate */

export function ChapterPlate({
  index,
  total,
  name,
  weight,
  note,
}: {
  index: number;
  total: number;
  name: string;
  weight: number;
  note: string;
}) {
  return (
    <motion.section
      key={name}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease }}
      className="ink warm-wash halftone print-plain relative overflow-hidden"
    >
      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-[auto_minmax(0,1fr)] items-center gap-6 px-5 py-12 sm:gap-10 sm:px-8 sm:py-16">
        <motion.span
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="figure text-5xl leading-none text-accent sm:text-7xl"
          aria-hidden
        >
          0{index}
        </motion.span>
        <div className="min-w-0">
          <p className="figure text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">
            Pillar {index} of {total} · {Math.round(weight * 100)}% weight
          </p>
          <h1 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-4xl">
            {name}
          </h1>
          <span className="band-rule mt-4 block" aria-hidden />
          <p className="mt-4 measure text-sm leading-relaxed text-muted-foreground sm:text-base">
            {note}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------------------------------------------------- Sector glyph */

export function SectorGlyph({ id }: { id: string }) {
  const stroke = "var(--accent)";
  const soft = "var(--primary)";
  const common = { fill: "none", stroke, strokeWidth: 1.6 } as const;
  return (
    <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
      <rect x="0.5" y="0.5" width="63" height="47" fill="none" stroke="var(--border)" />
      {id === "services" && (
        <>
          <circle cx="20" cy="18" r="7" {...common} />
          <circle cx="40" cy="30" r="10" fill="none" stroke={soft} strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M8 40 L26 26 L38 34 L56 14" {...common} />
        </>
      )}
      {id === "manufacturing" && (
        <>
          <path d="M8 38 V22 l10 6 V22 l10 6 V18 l12 8 V38 Z" {...common} />
          <circle cx="48" cy="14" r="6" fill="none" stroke={soft} strokeWidth="1.2" />
          <path d="M48 8 v-4 M48 20 v4 M42 14 h-4 M54 14 h4" stroke={soft} strokeWidth="1.2" />
        </>
      )}
      {id === "retail" && (
        <>
          <path d="M10 18 h44 l-4 22 H14 Z" {...common} />
          <path d="M24 18 v-4 a8 8 0 0 1 16 0 v4" fill="none" stroke={soft} strokeWidth="1.2" />
          <path d="M18 30 h28" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 3" />
        </>
      )}
      {id === "saas" && (
        <>
          <path d="M14 34 a10 10 0 0 1 2-19 a13 13 0 0 1 24 2 a9 9 0 0 1 10 17 Z" {...common} />
          <path d="M22 40 h20" stroke={soft} strokeWidth="1.2" />
          <path d="M32 26 v10 M28 32 l4 4 4-4" stroke={stroke} strokeWidth="1.4" fill="none" />
        </>
      )}
      {id === "startup" && (
        <>
          <path d="M32 6 c8 8 12 16 12 24 l-12 8 -12-8 c0-8 4-16 12-24 Z" {...common} />
          <circle cx="32" cy="22" r="4" fill="none" stroke={soft} strokeWidth="1.2" />
          <path d="M24 40 l-6 6 M40 40 l6 6" stroke={stroke} strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------- Pillar spectrum */

export function PillarSpectrum({
  rows,
}: {
  rows: { name: string; score: number; weight: number; tier: Tier }[];
}) {
  return (
    <figure className="print-avoid-break print-plain border border-border bg-card p-6">
      <figcaption className="figure text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
        Pillar spectrum · score against weight
      </figcaption>
      <div className="mt-5 space-y-3.5">
        {rows.map((r, i) => (
          <div key={r.name} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-3">
            <span className="truncate text-xs text-muted-foreground">{r.name}</span>
            <span className="relative block h-3 bg-secondary">
              <motion.span
                className="absolute inset-y-0 left-0"
                style={{ background: tierStroke[r.tier] }}
                initial={{ width: 0 }}
                animate={{ width: `${r.score}%` }}
                transition={{ duration: 1, delay: 0.1 + i * 0.07, ease }}
              />
              <span
                className="absolute inset-y-[-3px] w-px bg-foreground/70"
                style={{ left: `${Math.round(r.weight * 100 * 3)}%` }}
                aria-hidden
              />
            </span>
            <span className="figure text-xs text-foreground">{r.score}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------- Hero composition (3D) */

/**
 * The opening instrument: layered geometric planes reacting to pointer and
 * scroll, with the weighted pillar orbit suspended in the middle plane.
 * Purely abstract — no figurative or human imagery anywhere in the system.
 */
export function HeroComposition({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), {
    stiffness: 70,
    damping: 22,
  });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 70,
    damping: 22,
  });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={cn("relative isolate [perspective:1600px]", className)}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* far plane — benchmark corridor, a soft warm haze behind the orbit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
          style={{ transform: "translateZ(-120px)", background: "var(--gradient-warm)" }}
          aria-hidden
        />

        {/* mid plane — ledger bars */}
        <motion.svg
          viewBox="0 0 320 120"
          className="absolute inset-x-0 bottom-2 h-28 w-full"
          style={{ transform: "translateZ(-40px)" }}
          aria-hidden
        >
          {PILLAR_META.map((p, i) => (
            <motion.rect
              key={p.id}
              x={18 + i * 42}
              width="20"
              rx="0"
              fill={pillarColor(p.id)}
              opacity={0.85}
              initial={{ height: 0, y: 110 }}
              animate={{ height: 20 + p.weight * 260, y: 110 - (20 + p.weight * 260) }}
              transition={{ duration: 1.1, delay: 0.35 + i * 0.08, ease }}
            />
          ))}
          <line x1="0" y1="110" x2="320" y2="110" stroke="var(--border)" strokeWidth="1" />
        </motion.svg>

        {/* near plane — the orbit */}
        <div style={{ transform: "translateZ(60px)" }}>
          <PillarConstellation />
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------- Sector plate */

/**
 * Full high-tech composition per industry profile. Each sector gets its own
 * geometry, technique and colourway — network mesh, isometric line-flow,
 * translucent shelving, recurring-wave lattice, ascending trajectory.
 */
export function SectorPlate({ id, active }: { id: string; active?: boolean }) {
  const tone: Record<string, [string, string]> = {
    services: ["var(--cyan)", "var(--teal)"],
    manufacturing: ["var(--amber)", "var(--rust)"],
    retail: ["var(--plum)", "var(--rust)"],
    saas: ["var(--teal)", "var(--pillar-technology)"],
    startup: ["var(--lime)", "var(--pillar-organizational)"],
  };
  const [a, b] = tone[id] ?? ["var(--accent)", "var(--primary)"];
  const gid = `sg-${id}`;
  const fid = `sf-${id}`;

  return (
    <svg
      viewBox="0 0 200 110"
      preserveAspectRatio="xMidYMid slice"
      className="h-28 w-full"
      aria-hidden
      style={{ opacity: active ? 1 : 0.9 }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
        <filter id={fid} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="200" height="110" fill="var(--secondary)" />
      <rect x="0" y="0" width="200" height="110" fill={`url(#${gid})`} opacity="0.14" />

      {id === "services" && (
        /* Network mesh — a routed capability graph */
        <g>
          {[
            [26, 78],
            [58, 40],
            [92, 72],
            [128, 34],
            [162, 62],
            [116, 96],
          ].map(([x, y], i, arr) => (
            <g key={i}>
              {arr.slice(i + 1).map(([x2, y2], j) => (
                <line
                  key={j}
                  x1={x}
                  y1={y}
                  x2={x2}
                  y2={y2}
                  stroke={`url(#${gid})`}
                  strokeWidth="0.7"
                  opacity="0.4"
                />
              ))}
            </g>
          ))}
          {[
            [26, 78, 4],
            [58, 40, 7],
            [92, 72, 5],
            [128, 34, 9],
            [162, 62, 5],
            [116, 96, 3.5],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={`url(#${gid})`} filter={`url(#${fid})`} opacity="0.9" />
          ))}
        </g>
      )}

      {id === "manufacturing" && (
        /* Isometric extruded line-flow */
        <g>
          {[0, 1, 2, 3].map((i) => {
            const x = 24 + i * 40;
            const h = 26 + i * 12;
            return (
              <g key={i} opacity={0.92 - i * 0.1}>
                <path d={`M${x} ${92 - h} l16 -9 l16 9 l-16 9 Z`} fill={a} opacity="0.85" />
                <path d={`M${x} ${92 - h} v${h} l16 9 v-${h} Z`} fill={b} opacity="0.65" />
                <path d={`M${x + 16} ${92 - h + 9} v${h} l16 -9 v-${h} Z`} fill={b} opacity="0.4" />
              </g>
            );
          })}
          <path d="M6 100 H194" stroke={`url(#${gid})`} strokeWidth="1.4" opacity="0.7" />
        </g>
      )}

      {id === "retail" && (
        /* Translucent stacked shelves with demand arcs */
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={22 + i * 8}
              y={26 + i * 24}
              width={156 - i * 16}
              height="16"
              rx="1"
              fill={`url(#${gid})`}
              opacity={0.28 + i * 0.22}
            />
          ))}
          <path
            d="M18 84 C60 26 140 26 182 84"
            fill="none"
            stroke={a}
            strokeWidth="1.6"
            strokeDasharray="4 4"
            opacity="0.9"
          />
          <circle cx="100" cy="44" r="5" fill={a} filter={`url(#${fid})`} />
        </g>
      )}

      {id === "saas" && (
        /* Recurring-wave lattice — retention cohorts */
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M0 ${34 + i * 14} C40 ${14 + i * 14} 70 ${58 + i * 12} 110 ${34 + i * 13} S180 ${16 + i * 14} 200 ${36 + i * 13}`}
              fill="none"
              stroke={`url(#${gid})`}
              strokeWidth="1.2"
              opacity={0.85 - i * 0.13}
            />
          ))}
          {[36, 78, 120, 162].map((x, i) => (
            <rect key={i} x={x} y="18" width="1" height="78" fill={b} opacity="0.28" />
          ))}
          <circle cx="120" cy="40" r="6" fill={a} filter={`url(#${fid})`} />
        </g>
      )}

      {id === "startup" && (
        /* Ascending trajectory over provisional scaffolding */
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={18 + i * 30}
              y={92 - i * 4}
              width="18"
              height={6 + i * 4}
              fill={b}
              opacity="0.28"
            />
          ))}
          <path
            d="M14 96 C64 92 96 58 118 40 S168 16 190 12"
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="3"
            filter={`url(#${fid})`}
          />
          <circle cx="190" cy="12" r="5" fill={a} filter={`url(#${fid})`} />
          <path d="M14 96 h176" stroke={b} strokeWidth="0.8" opacity="0.5" strokeDasharray="3 5" />
        </g>
      )}
    </svg>
  );
}


/* -------------------------------------------------------- Display numeral */

/**
 * Oversized numeral used as a compositional anchor. Numeric values resolve
 * on entry — the figure counts and settles rather than simply appearing.
 */
export function DisplayNumeral({
  value,
  caption,
  tone = "var(--accent)",
  className,
}: {
  value: string;
  caption: string;
  tone?: string;
  className?: string;
}) {
  const numeric = Number(value);
  const isNumeric = value.trim() !== "" && Number.isFinite(numeric);
  const [entered, setEntered] = useState(false);
  const shown = useCountUp(entered && isNumeric ? numeric : 0, 1500);

  return (
    <div className={cn("min-w-0", className)}>
      <motion.p
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        onViewportEnter={() => setEntered(true)}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease }}
        className="figure text-6xl leading-none sm:text-7xl"
        style={{ color: tone }}
      >
        {isNumeric ? shown : value}
      </motion.p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{caption}</p>
    </div>
  );
}


/* ---------------------------------------------------- Cinematic depth wrap */

/**
 * Z-plane travel: content approaches the viewer as it enters, with the
 * far plane held back in depth. Collapses to a fade under reduced motion.
 */
export function DepthReveal({
  className,
  children,
  intensity = 1,
}: {
  className?: string;
  children: React.ReactNode;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14 * intensity, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.7, 1]);

  return (
    <div ref={ref} className={cn("depth-stage", className)}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------ Data lattice */

/** Wireframe terrain of measurement — a field of readings held in depth. */
export function DataLattice({ className }: { className?: string }) {
  const rows = 9;
  const cols = 14;
  return (
    <svg viewBox="0 0 400 220" className={cn("w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="lat-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="55%" stopColor="var(--plum)" />
          <stop offset="100%" stopColor="var(--amber)" />
        </linearGradient>
      </defs>
      {Array.from({ length: rows }).map((_, r) => {
        const t = r / (rows - 1);
        const y = 60 + t * t * 150;
        const inset = (1 - t) * 120;
        return (
          <path
            key={`r${r}`}
            d={`M${inset} ${y} H${400 - inset}`}
            stroke="url(#lat-g)"
            strokeWidth="0.8"
            opacity={0.18 + t * 0.5}
            fill="none"
          />
        );
      })}
      {Array.from({ length: cols + 1 }).map((_, c) => {
        const t = c / cols;
        return (
          <path
            key={`c${c}`}
            d={`M${120 + t * 160} 60 L${t * 400} 210`}
            stroke="url(#lat-g)"
            strokeWidth="0.7"
            opacity="0.32"
            fill="none"
          />
        );
      })}
      {[
        [150, 96, 3],
        [232, 118, 4.5],
        [96, 158, 5],
        [304, 150, 3.5],
        [200, 190, 6],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="url(#lat-g)" opacity="0.9" />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------- Prism stack */

/** Translucent stacked planes — the layered composite, seen edge-on. */
export function PrismStack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={cn("w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="ps-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ps-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--plum)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--rust)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="ps-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--ochre)" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      {[
        { y: 172, fill: "url(#ps-c)" },
        { y: 128, fill: "url(#ps-b)" },
        { y: 84, fill: "url(#ps-a)" },
      ].map((p, i) => (
        <g key={i}>
          <path
            d={`M160 ${p.y - 44} l108 44 l-108 44 l-108 -44 Z`}
            fill={p.fill}
            stroke="var(--foreground)"
            strokeOpacity="0.14"
            strokeWidth="0.8"
          />
        </g>
      ))}
      <path d="M160 40 V196" stroke="var(--foreground)" strokeOpacity="0.22" strokeDasharray="3 6" />
      <circle cx="160" cy="40" r="5" fill="var(--accent)" />
    </svg>
  );
}

/* -------------------------------------------------------------- Orbit field */

/** Concentric measurement orbits with travelling markers. */
export function OrbitField({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={cn("w-full", className)} aria-hidden>
      <defs>
        <radialGradient id="of-core">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--rust)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="70" fill="url(#of-core)" />
      {[54, 84, 112, 138].map((r, i) => (
        <g key={r}>
          <ellipse
            cx="150"
            cy="150"
            rx={r}
            ry={r * (0.34 + i * 0.12)}
            fill="none"
            stroke={i % 2 ? "var(--cyan)" : "var(--ochre)"}
            strokeOpacity="0.45"
            strokeWidth="0.9"
            transform={`rotate(${-18 - i * 12} 150 150)`}
          />
          <motion.circle
            r="3.4"
            fill={i % 2 ? "var(--cyan)" : "var(--ochre)"}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            cx={150 + r}
            cy={150}
            transform={`rotate(${-18 - i * 12} 150 150)`}
          />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------- Cinematic chart figures */

/**
 * A live analytical trace: the series draws itself in, the corridor breathes,
 * and a marker travels the curve. Purely figurative — carries no session data.
 */
export function FlowGraph({
  className,
  tone = "var(--accent)",
  glow = "var(--accent-glow)",
  seed = 0,
}: {
  className?: string;
  tone?: string;
  glow?: string;
  seed?: number;
}) {
  const pts = Array.from({ length: 13 }, (_, i) => {
    const x = 20 + i * 30;
    const wave = Math.sin(i * 0.72 + seed) * 22 + Math.sin(i * 1.9 + seed * 2) * 9;
    return [x, 110 - wave - i * 2.2] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ");
  const gid = `flow-${Math.round(seed * 1000)}`;

  return (
    <svg viewBox="0 0 400 190" className={cn("w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`${gid}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glow} stopOpacity="0.42" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((r) => (
        <line
          key={r}
          x1="16"
          x2="384"
          y1={38 + r * 38}
          y2={38 + r * 38}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.8"
        />
      ))}

      {/* benchmark corridor drawing in */}
      <motion.rect
        x="16"
        width="368"
        y="52"
        rx="3"
        fill={tone}
        fillOpacity="0.09"
        initial={{ height: 0 }}
        whileInView={{ height: 54 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
      />

      <motion.path
        d={`${line} L 380 178 L 20 178 Z`}
        fill={`url(#${gid}-f)`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.5, ease }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={tone}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
      />

      {pts.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={y}
          r="3.6"
          fill={glow}
          stroke={tone}
          strokeWidth="1.2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 + i * 0.12, ease }}
        />
      ))}
    </svg>
  );
}

/** Bars growing from a shared baseline, then breathing at low amplitude. */
export function BarSwarm({
  className,
  tones = ["var(--teal)", "var(--amber)", "var(--plum)", "var(--cyan)", "var(--lime)", "var(--rust)"],
}: {
  className?: string;
  tones?: string[];
}) {
  const heights = [46, 78, 34, 96, 62, 110, 52, 84, 40];
  return (
    <svg viewBox="0 0 300 140" className={cn("w-full", className)} aria-hidden>
      <line x1="8" x2="292" y1="128" y2="128" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      {heights.map((h, i) => (
        <motion.rect
          key={i}
          x={14 + i * 32}
          width="18"
          rx="2"
          fill={tones[i % tones.length]}
          fillOpacity="0.85"
          initial={{ height: 0, y: 128 }}
          whileInView={{ height: [0, h, h * 0.92, h], y: [128, 128 - h, 128 - h * 0.92, 128 - h] }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.5, delay: i * 0.07, ease }}
        />
      ))}
    </svg>
  );
}

/** Drifting constellation of measurement points — ambient optical texture. */
export function SignalField({ className }: { className?: string }) {
  const nodes = Array.from({ length: 26 }, (_, i) => ({
    x: 12 + ((i * 61) % 376),
    y: 14 + ((i * 97) % 196),
    r: 1.4 + ((i * 7) % 5) * 0.5,
    tone: ["var(--cyan)", "var(--lime)", "var(--amber)", "var(--plum)"][i % 4],
  }));
  return (
    <svg viewBox="0 0 400 220" className={cn("w-full ambient-drift-slow", className)} aria-hidden>
      {nodes.map((n, i) => (
        <g key={i}>
          {i > 0 && i % 3 === 0 ? (
            <line
              x1={n.x}
              y1={n.y}
              x2={nodes[i - 1]!.x}
              y2={nodes[i - 1]!.y}
              stroke={n.tone}
              strokeOpacity="0.28"
              strokeWidth="0.7"
            />
          ) : null}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.tone}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.28, 0.9, 0.28] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------ Full-bleed horizon field */

/**
 * Screen-scale hero composition: drifting benchmark corridors, pillar arcs and
 * a resolving lattice. Designed to sit behind and around the hero copy rather
 * than inside a tile, so the opening occupies the whole viewport.
 */
export function HorizonField({ className }: { className?: string }) {
  const tones = [
    "var(--teal)",
    "var(--rust)",
    "var(--lime)",
    "var(--plum)",
    "var(--cyan)",
    "var(--ochre)",
  ];

  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="hf-corridor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--accent-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="hf-bloom" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--accent-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.rect
        x="0"
        y="0"
        width="1600"
        height="900"
        fill="url(#hf-bloom)"
        animate={{ opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Benchmark corridors drifting across the field */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 150 + i * 96;
        return (
          <motion.path
            key={`corridor-${i}`}
            d={`M -200 ${y} C 260 ${y - 70 - i * 6}, 700 ${y + 80}, 1100 ${y - 30} S 1700 ${y + 46}, 1900 ${y}`}
            fill="none"
            stroke="url(#hf-corridor)"
            strokeWidth={i % 3 === 0 ? 2.4 : 1.1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, x: [0, -60, 0] }}
            transition={{
              pathLength: { duration: 2.4, delay: i * 0.12, ease },
              opacity: { duration: 1.2, delay: i * 0.12 },
              x: { duration: 22 + i * 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        );
      })}

      {/* Pillar arcs — one sweep per pillar, colour as information */}
      <g transform="translate(1180 450)">
        {tones.map((tone, i) => {
          const r = 120 + i * 42;
          return (
            <motion.circle
              key={tone + i}
              r={r}
              fill="none"
              stroke={tone}
              strokeOpacity={0.42}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray={`${r * 1.2} ${r * 5}`}
              initial={{ rotate: -120, opacity: 0 }}
              animate={{ rotate: 240, opacity: 1 }}
              transition={{
                rotate: { duration: 40 + i * 9, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.4, delay: 0.3 + i * 0.1 },
              }}
            />
          );
        })}
        <motion.circle
          r="46"
          fill="var(--accent)"
          fillOpacity={0.12}
          stroke="var(--accent)"
          strokeOpacity={0.5}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Resolving lattice nodes */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 60 + ((i * 137) % 1480);
        const y = 90 + ((i * 271) % 760);
        return (
          <motion.circle
            key={`node-${i}`}
            cx={x}
            cy={y}
            r={i % 5 === 0 ? 4 : 2}
            fill={tones[i % tones.length]}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0.15, 0.7, 0.15], scale: 1 }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.16,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------- Seven-pillar armature (hero) */

const ARMATURE_TONES = [
  "var(--navy-glow)",
  "var(--gold)",
  "var(--rust)",
  "var(--forest)",
  "var(--oxblood)",
  "var(--cyan)",
  "var(--plum)",
];

/**
 * Full-bleed hero composition: a slowly rotating armature of seven weighted
 * arcs — one per pillar — carrying metric nodes, set against a depth-blurred
 * benchmark corridor field.
 */
export function PillarArmature({
  className,
  fit = "slice",
}: {
  className?: string;
  fit?: "slice" | "meet";
}) {
  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox={fit === "meet" ? "360 10 880 840" : "0 0 1600 900"}
      preserveAspectRatio={`xMidYMid ${fit}`}
      aria-hidden
    >


      <defs>
        <radialGradient id="pa-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--accent-glow)" stopOpacity="0" />
        </radialGradient>
        <filter id="pa-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <linearGradient id="pa-floor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--navy)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--navy)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--navy)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Depth-blurred corridor floor */}
      <g filter="url(#pa-soft)" opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.path
            key={`floor-${i}`}
            d={`M -160 ${640 + i * 34} C 380 ${600 + i * 30}, 1120 ${700 + i * 26}, 1780 ${632 + i * 34}`}
            fill="none"
            stroke="url(#pa-floor)"
            strokeWidth={1.4}
            animate={{ x: [0, -70, 0] }}
            transition={{ duration: 26 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </g>

      <g transform="translate(800 430)">
        <motion.circle
          r="330"
          fill="url(#pa-core)"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* One arc per pillar, radius and weight carried from the model */}
        {PILLAR_META.map((p, i) => {
          const r = 118 + i * 44;
          const tone = ARMATURE_TONES[i % ARMATURE_TONES.length];
          const circ = 2 * Math.PI * r;
          const arc = circ * (0.22 + p.weight * 1.6);
          return (
            <g key={p.id} transform={`rotate(${i * 14 - 20})`}>
              <circle r={r} fill="none" stroke={tone} strokeOpacity={0.3} strokeWidth={1.1} />
              <motion.circle
                r={r}
                fill="none"
                stroke={tone}
                strokeOpacity={0.85}
                strokeWidth={3 + p.weight * 16}
                strokeLinecap="round"
                strokeDasharray={`${arc} ${circ}`}
                initial={{ rotate: -140, opacity: 0 }}
                animate={{ rotate: 220, opacity: 1 }}
                transition={{
                  rotate: { duration: 52 + i * 11, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 1.1, delay: 0.2 + i * 0.09 },
                }}
              />
              <motion.circle
                cx={r}
                cy={0}
                r={4.5}
                fill={tone}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* Metric nodes distributed around the armature */}
        {Array.from({ length: 54 }).map((_, i) => {
          const ring = i % 7;
          const r = 118 + ring * 44;
          const a = (i * 137.508 * Math.PI) / 180;
          return (
            <motion.circle
              key={`m-${i}`}
              cx={Math.round(Math.cos(a) * r * 100) / 100}
              cy={Math.round(Math.sin(a) * r * 58) / 100}
              r={1.9}
              fill={ARMATURE_TONES[ring]}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0.2, 0.85, 0.2], scale: 1 }}
              transition={{ duration: 6 + (i % 6), repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
            />
          );
        })}

        <motion.circle
          r="52"
          fill="var(--accent)"
          fillOpacity={0.14}
          stroke="var(--accent)"
          strokeOpacity={0.55}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>
    </svg>
  );
}

/* --------------------------------------------------- Benchmark terrain */

/** Layered sector corridors — depth-stacked ridges reading as a benchmark field. */
export function BenchmarkTerrain({ className }: { className?: string }) {
  const tones = ["var(--navy-glow)", "var(--forest)", "var(--gold)", "var(--rust)", "var(--oxblood)"];
  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 900 500"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {tones.map((tone, i) => {
        const base = 430 - i * 62;
        const d = `M 0 ${base} C 150 ${base - 60 - i * 12}, 300 ${base + 30}, 460 ${base - 44}
                   S 760 ${base + 22}, 900 ${base - 30} L 900 500 L 0 500 Z`;
        return (
          <motion.path
            key={tone + i}
            d={d}
            fill={tone}
            fillOpacity={0.1 + i * 0.03}
            stroke={tone}
            strokeOpacity={0.5}
            strokeWidth={1.4}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: i * 0.12, ease }}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------ Extruded columns */

/** Extruded score columns — weighted pillar mass rendered in false perspective. */
export function ScoreColumns({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 900 420"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {PILLAR_META.map((p, i) => {
        const w = 74;
        const x = 48 + i * 116;
        const h = 90 + p.weight * 900;
        const tone = ARMATURE_TONES[i % ARMATURE_TONES.length];
        return (
          <motion.g
            key={p.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease }}
          >
            <polygon
              points={`${x + w},${340 - h} ${x + w + 22},${328 - h} ${x + w + 22},${328} ${x + w},${340}`}
              fill={tone}
              fillOpacity={0.32}
            />
            <polygon
              points={`${x},${340 - h} ${x + 22},${328 - h} ${x + w + 22},${328 - h} ${x + w},${340 - h}`}
              fill={tone}
              fillOpacity={0.62}
            />
            <rect x={x} y={340 - h} width={w} height={h} fill={tone} fillOpacity={0.2} stroke={tone} strokeOpacity={0.6} />
            <text
              x={x + w / 2}
              y={368}
              textAnchor="middle"
              fill="currentColor"
              fontSize="13"
              className="figure"
              opacity={0.7}
            >
              {Math.round(p.weight * 100)}%
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------- Hero: seven pillar cards */

/**
 * Hero composition. Seven cards — one per pillar — each carrying the pillar
 * name and its own bespoke mark, arranged as a single staggered formation on a
 * shared perspective plane. Cards enter with a depth push, marks draw in, and
 * the whole group tilts gently toward the pointer.
 */
const PILLAR_MARKS: Record<PillarId, React.ReactNode> = {
  financial: (
    <>
      <path d="M8 40 L20 40 L20 20 L8 20 Z" />
      <path d="M24 40 L36 40 L36 12 L24 12 Z" />
      <path d="M40 40 L52 40 L52 26 L40 26 Z" />
      <path d="M4 46 L56 46" />
      <path d="M8 14 L20 6 L32 12" />
    </>
  ),
  risk: (
    <>
      <path d="M30 4 L52 13 L52 28 C52 40 42 47 30 52 C18 47 8 40 8 28 L8 13 Z" />
      <path d="M30 16 L30 34" />
      <path d="M20 25 L40 25" />
    </>
  ),
  market: (
    <>
      <path d="M30 4 L54 30 L30 56 L6 30 Z" />
      <path d="M30 4 L30 56" />
      <path d="M18 17 L42 43" />
      <path d="M6 30 L54 30" />
    </>
  ),
  operational: (
    <>
      <path d="M30 8 L44 16 L44 32 L30 40 L16 32 L16 16 Z" />
      <path d="M30 20 L38 25 L38 34" />
      <path d="M8 48 L52 48" />
      <path d="M18 44 L18 52" />
      <path d="M42 44 L42 52" />
    </>
  ),
  strategic: (
    <>
      <path d="M8 46 L30 8 L52 46" />
      <path d="M18 46 L30 26 L42 46" />
      <path d="M30 8 L30 2" />
      <path d="M4 52 L56 52" />
    </>
  ),
  organizational: (
    <>
      <path d="M30 6 L40 12 L40 24 L30 30 L20 24 L20 12 Z" />
      <path d="M12 30 L22 36 L22 48 L12 54 L2 48 L2 36 Z" />
      <path d="M48 30 L58 36 L58 48 L48 54 L38 48 L38 36 Z" />
      <path d="M25 28 L17 33" />
      <path d="M35 28 L43 33" />
    </>
  ),
  technology: (
    <>
      <path d="M14 14 L46 14 L46 46 L14 46 Z" />
      <path d="M24 24 L36 24 L36 36 L24 36 Z" />
      <path d="M30 14 L30 4" />
      <path d="M30 46 L30 56" />
      <path d="M14 30 L4 30" />
      <path d="M46 30 L56 30" />
    </>
  ),
};

/**
 * Panel grounds: each pillar owns a deep, saturated field with a lifted mark
 * colour, so the label sits in ivory at full legibility.
 */
const PANEL: Record<PillarId, { bg: string; edge: string; mark: string; z: number }> = {
  financial: { bg: "oklch(0.278 0.076 262)", edge: "oklch(0.42 0.09 258)", mark: "oklch(0.82 0.088 250)", z: 48 },
  risk: { bg: "oklch(0.322 0.152 21)", edge: "oklch(0.47 0.17 22)", mark: "oklch(0.82 0.118 26)", z: 16 },
  market: { bg: "oklch(0.352 0.062 236)", edge: "oklch(0.5 0.07 234)", mark: "oklch(0.85 0.078 224)", z: 40 },
  operational: { bg: "oklch(0.356 0.116 48)", edge: "oklch(0.5 0.13 50)", mark: "oklch(0.86 0.104 62)", z: 8 },
  strategic: { bg: "oklch(0.352 0.088 82)", edge: "oklch(0.5 0.1 84)", mark: "oklch(0.88 0.114 90)", z: 30 },
  organizational: { bg: "oklch(0.322 0.078 160)", edge: "oklch(0.46 0.09 158)", mark: "oklch(0.84 0.104 156)", z: 20 },
  technology: { bg: "oklch(0.236 0.05 268)", edge: "oklch(0.38 0.06 262)", mark: "oklch(0.82 0.07 258)", z: 44 },
};

const PANEL_LABEL = "oklch(0.972 0.008 90)";

/* Short instrument labels — the ring stays legible at every width. */
const DIAL_LABEL: Record<PillarId, string> = {
  financial: "Financial",
  risk: "Risk",
  market: "Market",
  operational: "Operations",
  strategic: "Strategy",
  organizational: "Organisation",
  technology: "Technology",
};

const TAU = Math.PI * 2;
const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * TAU) / 360;
  return [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))] as const;
};
const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

/**
 * The hero instrument: one navy plate carrying a single seven-segment dial.
 * Segment arc length follows the pillar weighting; every segment is drawn in
 * its lifted pillar colour so it separates cleanly from the deep ground.
 */
export function PillarEmblems({ className }: { className?: string }) {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sx = useSpring(rotX, { stiffness: 70, damping: 18 });
  const sy = useSpring(rotY, { stiffness: 70, damping: 18 });
  const [hover, setHover] = useState<PillarId | null>(null);

  const C = 300;
  const R = 196;
  const GAP = 3;

  let cursor = -90;
  const segments = PILLAR_META.map((p) => {
    const span = p.weight * 360;
    const a0 = cursor + GAP / 2;
    const a1 = cursor + span - GAP / 2;
    cursor += span;
    return { ...p, a0, a1, mid: (a0 + a1) / 2 };
  });

  return (
    <div
      className={cn("pointer-events-auto relative w-full", className)}
      style={{ perspective: "1600px" }}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        rotY.set(((e.clientX - b.left) / b.width - 0.5) * 12);
        rotX.set(-((e.clientY - b.top) / b.height - 0.5) * 9);
      }}
      onPointerLeave={() => {
        rotX.set(0);
        rotY.set(0);
        setHover(null);
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease }}
        style={{
          rotateX: sx,
          rotateY: sy,
          transformStyle: "preserve-3d",
          backgroundColor: "oklch(0.196 0.056 268)",
          boxShadow:
            "0 40px 90px -46px oklch(0.1 0.03 268 / 0.95), inset 0 1px 0 0 oklch(0.98 0 0 / 0.14)",
          border: "1px solid oklch(0.98 0 0 / 0.16)",
        }}
        className="relative w-full overflow-hidden"
      >
        <svg viewBox="0 0 600 600" className="block h-auto w-full" role="img" aria-label="Seven weighted pillars of the diagnostic">
          <defs>
            <pattern id="dial-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M30 0 L0 0 0 30" fill="none" stroke="oklch(0.98 0 0 / 0.06)" strokeWidth="1" />
            </pattern>
            <radialGradient id="dial-depth" cx="50%" cy="34%" r="72%">
              <stop offset="0%" stopColor="oklch(0.33 0.074 262)" />
              <stop offset="100%" stopColor="oklch(0.176 0.05 268)" />
            </radialGradient>
          </defs>

          <rect width="600" height="600" fill="url(#dial-depth)" />
          <rect width="600" height="600" fill="url(#dial-grid)" />

          {/* instrument rings */}
          <circle cx={C} cy={C} r={244} fill="none" stroke="oklch(0.98 0 0 / 0.1)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R + 40} fill="none" stroke="oklch(0.98 0 0 / 0.14)" strokeWidth="1" />
          <circle cx={C} cy={C} r={R - 40} fill="none" stroke="oklch(0.98 0 0 / 0.14)" strokeWidth="1" />

          {/* tick ring */}
          {Array.from({ length: 72 }).map((_, i) => {
            const [x0, y0] = polar(C, C, R - 48, i * 5);
            const [x1, y1] = polar(C, C, R - 54, i * 5);
            return (
              <line
                key={i}
                x1={x0}
                y1={y0}
                x2={x1}
                y2={y1}
                stroke="oklch(0.98 0 0 / 0.16)"
                strokeWidth={i % 6 === 0 ? 1.6 : 0.8}
              />
            );
          })}

          {segments.map((s, i) => {
            const tone = PANEL[s.id].mark;
            const on = hover === s.id;
            const [lx, ly] = polar(C, C, R + 62, s.mid);
            const [gx, gy] = polar(C, C, R, s.mid);
            const anchor = Math.abs(s.mid % 360) < 8 || Math.abs((s.mid % 360) - 180) < 8
              ? "middle"
              : (s.mid % 360 + 360) % 360 < 180
                ? "start"
                : "end";
            return (
              <g
                key={s.id}
                onPointerEnter={() => setHover(s.id)}
                style={{ cursor: "default" }}
              >
                <title>{s.name}</title>
                <motion.path
                  d={arcPath(C, C, R, s.a0, s.a1)}
                  fill="none"
                  stroke={tone}
                  strokeLinecap="butt"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: on ? 1 : 0.86 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                  style={{ strokeWidth: on ? 72 : 60 }}
                />
                {/* invisible wide hit area */}
                <path d={arcPath(C, C, R, s.a0, s.a1)} fill="none" stroke="transparent" strokeWidth={86} />
                <motion.svg
                  x={gx - 15}
                  y={gy - 15}
                  width={30}
                  height={30}
                  viewBox="0 0 60 60"
                  fill="none"
                  stroke="oklch(0.16 0.04 268)"
                  strokeWidth="3.4"
                  strokeLinecap="square"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                >
                  {PILLAR_MARKS[s.id]}
                </motion.svg>
                <motion.text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill={on ? tone : "oklch(0.972 0.008 90)"}
                  className="figure"
                  fontSize="17"
                  fontWeight="600"
                  letterSpacing="1.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.12 }}
                >
                  {DIAL_LABEL[s.id].toUpperCase()}
                </motion.text>
              </g>
            );
          })}

          {/* centre mark */}
          <circle cx={C} cy={C} r={112} fill="oklch(0.166 0.048 268)" stroke="oklch(0.98 0 0 / 0.16)" />
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.05, ease }}
            style={{ transformOrigin: `${C}px ${C}px` }}
          >
            <text x={C} y={C - 26} textAnchor="middle" fill="oklch(0.972 0.008 90)" className="font-display" fontSize="54" fontWeight="600">
              54
            </text>
            <text x={C} y={C + 2} textAnchor="middle" fill="oklch(0.84 0.02 250)" className="figure" fontSize="13" letterSpacing="3">
              METRICS
            </text>
            <line x1={C - 46} y1={C + 22} x2={C + 46} y2={C + 22} stroke="oklch(0.98 0 0 / 0.2)" />
            <text x={C} y={C + 52} textAnchor="middle" fill="oklch(0.972 0.008 90)" className="font-display" fontSize="30" fontWeight="600">
              7
            </text>
            <text x={C} y={C + 74} textAnchor="middle" fill="oklch(0.84 0.02 250)" className="figure" fontSize="11" letterSpacing="3">
              PILLARS
            </text>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}


