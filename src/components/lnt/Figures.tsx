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
