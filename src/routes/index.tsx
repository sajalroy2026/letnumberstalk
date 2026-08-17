import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { METRIC_CONTENT, PILLAR_META } from "@/lib/assessment/spec.generated";
import { SECTORS } from "@/lib/assessment/scoring";
import {
  DepthReveal,
  DisplayNumeral,
  FlowGraph,
  BenchmarkTerrain,
  PillarArmature,
  ScoreColumns,
  OrbitField,
  ParallaxLayer,
  PrismStack,
  SectorPlate,
  SignalField,
  pillarColor,
  useCountUp,
} from "@/components/lnt/Figures";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LetNumbersTalk — 7-Pillar Business Health Diagnostic" },
      {
        name: "description",
        content:
          "A boardroom-grade diagnostic across 54 sector-benchmarked metrics and 7 weighted pillars. Scores, readings and Areas to Look Into — computed entirely in your browser.",
      },
      { property: "og:title", content: "LetNumbersTalk — Business Health Diagnostic" },
      {
        property: "og:description",
        content:
          "7 weighted pillars, 54 metrics, 5 industry profiles. Decision intelligence for founders and boardroom leaders, computed entirely in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ease = [0.16, 1, 0.3, 1] as const;

const DELIVERS = [
  {
    t: "A weighted diagnosis built from your operating figures",
    d: "7 independent scoring engines convert your operating figures into pillar scores, then into a single Integrated Business Health Score under a fixed weighting — Financial Health 22%, Risk 20%, Market 18%, Operations 15%, Strategy 13%, Organisation 7%, Technology 5%.",
    tone: "var(--teal)",
  },
  {
    t: "Sector-calibrated benchmarking",
    d: "Every threshold is re-based against 1 of 5 industry profiles. A services practice is read against services economics, and a manufacturer against manufacturing economics, so each comparison holds.",
    tone: "var(--plum)",
  },
  {
    t: "Value-chain attribution",
    d: "Where a reading breaches its healthy band, the instrument names the location in the value chain, the factors that commonly contribute, and how the pattern presents in practice — diagnostic language throughout.",
    tone: "var(--ochre)",
  },
  {
    t: "Terminal-risk surveillance",
    d: "Cash runway and customer concentration are monitored as terminal indicators. A breach raises a distinct Caution disclosure in the integrated report, while scores generate in full alongside it.",
    tone: "var(--cyan)",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="ink no-print sticky top-0 z-40">
        <SiteHeader />
      </div>

      <main>
        {/* ------------------------------------------------- Full-bleed hero */}
        <section className="ink tone-cyan aurora-wash relative min-h-[92vh] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease }}
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <PillarArmature />
          </motion.div>
          <ParallaxLayer
            depth={0.25}
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 opacity-25"
          >
            <SignalField />
          </ParallaxLayer>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
            <div className="scrim max-w-3xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="figure text-[0.68rem] uppercase tracking-[0.32em] text-accent"
              >
                The Business Health Instrument
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.1, delay: 0.1, ease }}
                className="mt-6 font-display text-4xl leading-[1.08] text-foreground sm:text-6xl"
              >
                Let the numbers state the condition of the business.
              </motion.h1>
              <span className="band-rule mt-8 block" aria-hidden />
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease }}
                className="mt-7 max-w-xl text-lg leading-[1.7] text-foreground/90"
              >
                LetNumbersTalk converts the operating figures you already hold into an
                institutional read of enterprise health: 54 sector-benchmarked metrics resolved
                through 7 weighted scoring engines into pillar scores, an Integrated Business
                Health Score, value-chain attribution for every underperforming reading, and
                terminal-risk disclosure on runway and revenue concentration.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.32, ease }}
                className="mt-4 max-w-xl text-sm leading-[1.75] text-muted-foreground"
              >
                Decision intelligence at the standard a board expects — produced in a single
                sitting, open to anyone, and computed entirely inside your own browser.
              </motion.p>


              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <Link
                  to="/assess"
                  className="sheen rule-copper px-9 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
                >
                  Begin the assessment
                </Link>
                <Link
                  to="/about"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:text-foreground"
                >
                  How it works
                </Link>
              </motion.div>

              <motion.dl
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
              >
                <Stat value={String(METRIC_CONTENT.length)} label="Metrics" tone="var(--teal)" />
                <Stat value="7" label="Weighted pillars" tone="var(--amber)" />
                <Stat value={String(SECTORS.length)} label="Industry profiles" tone="var(--plum)" />
                <Stat value="0" label="Figures stored" tone="var(--lime)" />
              </motion.dl>
            </div>

          </div>
        </section>

        {/* ------------------------------------------------ What it delivers */}
        <section className="sun-band tone-teal relative overflow-hidden">
          <ParallaxLayer depth={0.35} className="pointer-events-none absolute -right-24 top-10 -z-10 w-[34rem] opacity-40">
            <PrismStack />
          </ParallaxLayer>
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              Mandate
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              What the instrument delivers
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.9, ease }}
                className="text-teal"
              >
                <FlowGraph tone="var(--teal)" glow="var(--teal-glow)" seed={0.4} />
                <p className="figure mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Reading against a sector-calibrated corridor
                </p>
              </motion.div>

              <DepthReveal>
                <div className="grid gap-px bg-border sm:grid-cols-2">
                  {DELIVERS.map((c, i) => (
                    <motion.article
                      key={c.t}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-70px" }}
                      transition={{ duration: 0.65, delay: i * 0.06, ease }}
                      className="glass relative p-7"
                    >
                      <span
                        className="absolute inset-y-0 left-0 w-[3px]"
                        style={{ background: c.tone }}
                        aria-hidden
                      />
                      <span
                        className="block h-[3px] w-10"
                        style={{ background: c.tone }}
                        aria-hidden
                      />
                      <h3 className="mt-4 font-display text-lg leading-snug text-foreground">{c.t}</h3>
                      <p className="mt-3 text-sm leading-[1.7] text-foreground/80">{c.d}</p>
                    </motion.article>
                  ))}
                </div>
              </DepthReveal>
            </div>
          </div>
        </section>



        {/* ------------------------------------------------------ The pillars */}
        <section className="mint-band tone-plum prism-wash relative overflow-hidden">
          <ParallaxLayer
            depth={0.45}
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-45"
          >
            <BenchmarkTerrain />
          </ParallaxLayer>

          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              Structure
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">The 7 pillars</h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <p className="mt-5 max-w-2xl text-sm leading-[1.75] text-foreground/80">
              Each pillar carries an independent scoring engine and a fixed share of the composite.
              Assess 1, several, or all 7 — partial coverage re-weights across exactly the metrics
              you supply, so every figure you enter carries its full influence.
            </p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PILLAR_META.map((p, i) => {
                const count = METRIC_CONTENT.filter((m) => m.pillar === p.id).length;
                const tone = pillarColor(p.id);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease }}
                    className="tilt-card relative overflow-hidden border border-border bg-card p-6 shadow-[var(--shadow-plate)]"
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-[4px]"
                      style={{ background: tone }}
                      aria-hidden
                    />
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg leading-snug text-foreground">{p.name}</h3>
                      <span className="figure text-3xl" style={{ color: tone }}>
                        {Math.round(p.weight * 100)}%
                      </span>
                    </div>
                    <div className="mt-5 h-1.5 w-full bg-secondary" aria-hidden>
                      <motion.div
                        className="h-full"
                        style={{ background: tone }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.round(p.weight * 100 * 4)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 + i * 0.05, ease }}
                      />
                    </div>
                    <p className="figure mt-3 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {count} metrics
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Sector calibration */}
        <section className="blush-band tone-amber relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              Calibration
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              5 industry profiles, 1 benchmark set each
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 26, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease }}
                  className="glass overflow-hidden"
                >
                  <SectorPlate id={s.id} />

                  <div className="border-t border-border p-5">
                    <h3 className="font-display text-lg text-foreground">{s.name}</h3>
                    <p className="mt-2 text-xs leading-[1.7] text-foreground/75">{s.description}</p>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.7, delay: 0.35, ease }}
                className="glass flex flex-col justify-between p-6 text-amber"
              >
                <ScoreColumns />
                <p className="mt-4 text-xs leading-[1.7] text-foreground/75">
                  Each profile carries its own thresholds, so a reading is measured against the
                  economics of the business you actually operate.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Espresso: method */}
        <section className="ink tone-lime aurora-wash scanlines relative overflow-hidden">
          <ParallaxLayer depth={0.4} className="pointer-events-none absolute -left-32 top-0 -z-10 w-[36rem] opacity-50">
            <OrbitField />
          </ParallaxLayer>
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">

            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              Method
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Evidence in, weighted judgement out.
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              <DisplayNumeral value="54" caption="Metrics resolved per full assessment" tone="var(--ochre-glow)" />
              <DisplayNumeral value="7" caption="Independent scoring engines" tone="var(--cyan-glow)" />
              <DisplayNumeral value="0" caption="Figures transmitted or retained" tone="var(--lime-glow)" />
            </div>
            <div className="mt-14 grid gap-px bg-border md:grid-cols-3">
              {[
                {
                  t: "Evidence before opinion",
                  d: "Every input is sourced from a named artefact — Profit and Loss statement, Stripe or QuickBooks ledger, CRM pipeline, operations log — so the diagnosis rests on instrumented figures.",
                  tone: "var(--cyan)",
                },
                {
                  t: "Diagnostic language throughout",
                  d: "Where a reading falls outside its healthy range, you get where in the value chain it originates, what commonly contributes, and how it presents in practice — observation stated plainly.",
                  tone: "var(--amber)",
                },
                {
                  t: "Everything stays in the browser",
                  d: "Open the instrument and begin. Every figure is held in session memory and discarded the moment the tab closes.",
                  tone: "var(--lime)",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.t}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="bg-background p-7"
                >
                  <span className="block h-[3px] w-10" style={{ background: c.tone }} aria-hidden />
                  <h3 className="mt-4 font-display text-lg text-foreground">{c.t}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-foreground/85">{c.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="ink">
        <SiteFooter />
      </div>
    </div>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: string }) {
  const numeric = Number(value);
  const [entered, setEntered] = useState(false);
  const shown = useCountUp(entered ? numeric : 0, 1400);
  return (
    <motion.div
      onViewportEnter={() => setEntered(true)}
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <dt className="figure text-4xl" style={{ color: tone }}>
        {Number.isFinite(numeric) ? shown : value}
      </dt>
      <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dd>
    </motion.div>
  );
}

