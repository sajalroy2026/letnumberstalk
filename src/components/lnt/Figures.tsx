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
      className="ink grid-field print-plain relative overflow-hidden"
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
        {/* far plane — benchmark corridor */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-x-4 top-6 h-40 border border-border/70"
          style={{ transform: "translateZ(-90px)", background: "var(--gradient-warm)", opacity: 0.16 }}
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

/** Full illustrated tile per industry profile — abstract geometry, own accent. */
export function SectorPlate({ id, active }: { id: string; active?: boolean }) {
  const tone: Record<string, string> = {
    services: "var(--teal)",
    manufacturing: "var(--rust)",
    retail: "var(--ochre)",
    saas: "var(--slate-blue)",
    startup: "var(--oxblood)",
  };
  const c = tone[id] ?? "var(--accent)";
  return (
    <svg
      viewBox="0 0 200 110"
      className="h-24 w-full"
      aria-hidden
      style={{ opacity: active ? 1 : 0.92 }}
    >
      <rect x="0" y="0" width="200" height="110" fill="var(--secondary)" />
      {id === "services" && (
        <>
          <circle cx="52" cy="55" r="30" fill={c} opacity="0.9" />
          <path d="M52 25 A30 30 0 0 1 82 55 L52 55 Z" fill="var(--background)" opacity="0.85" />
          <rect x="100" y="30" width="70" height="8" fill={c} opacity="0.55" />
          <rect x="100" y="50" width="48" height="8" fill={c} opacity="0.8" />
          <rect x="100" y="70" width="60" height="8" fill="var(--foreground)" opacity="0.25" />
        </>
      )}
      {id === "manufacturing" && (
        <>
          <rect x="22" y="58" width="26" height="34" fill={c} />
          <rect x="54" y="42" width="26" height="50" fill={c} opacity="0.75" />
          <rect x="86" y="26" width="26" height="66" fill={c} opacity="0.55" />
          <circle cx="152" cy="42" r="22" fill="none" stroke={c} strokeWidth="6" />
          <circle cx="152" cy="42" r="6" fill={c} />
          <path d="M14 92 H186" stroke="var(--foreground)" strokeOpacity="0.3" strokeWidth="2" />
        </>
      )}
      {id === "retail" && (
        <>
          <path d="M28 40 H172 L160 92 H40 Z" fill={c} opacity="0.85" />
          <path d="M78 40 V28 a22 22 0 0 1 44 0 v12" fill="none" stroke="var(--foreground)" strokeOpacity="0.4" strokeWidth="4" />
          <rect x="60" y="58" width="80" height="4" fill="var(--background)" opacity="0.8" />
          <rect x="72" y="70" width="56" height="4" fill="var(--background)" opacity="0.6" />
        </>
      )}
      {id === "saas" && (
        <>
          <rect x="24" y="24" width="152" height="62" fill="none" stroke={c} strokeWidth="4" />
          <path d="M32 78 L70 52 L98 66 L136 32 L168 46" fill="none" stroke={c} strokeWidth="5" />
          <circle cx="136" cy="32" r="7" fill={c} />
          <rect x="24" y="24" width="152" height="10" fill={c} opacity="0.35" />
        </>
      )}
      {id === "startup" && (
        <>
          <path d="M100 14 C124 42 132 62 128 88 L100 74 L72 88 C68 62 76 42 100 14 Z" fill={c} />
          <circle cx="100" cy="50" r="11" fill="var(--background)" />
          <path d="M64 96 L48 108 M136 96 L152 108" stroke={c} strokeWidth="5" />
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------- Display numeral */

/** Oversized numeral used as a compositional anchor. */
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
  return (
    <div className={cn("min-w-0", className)}>
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease }}
        className="figure text-6xl leading-none sm:text-7xl"
        style={{ color: tone }}
      >
        {value}
      </motion.p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{caption}</p>
    </div>
  );
}
