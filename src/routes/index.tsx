import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { METRIC_CONTENT, PILLAR_META } from "@/lib/assessment/spec.generated";
import { SECTORS } from "@/lib/assessment/scoring";
import {
  DisplayNumeral,
  HeroComposition,
  ParallaxLayer,
  SectorPlate,
  pillarColor,
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
          "7 weighted pillars, 54 metrics, 5 industry profiles. Decision intelligence for founders and boardroom leaders, with no account and no data leaving the browser.",
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
    n: "01",
    t: "A weighted diagnosis, not a survey result",
    d: "7 independent scoring engines convert your operating figures into pillar scores, then into a single Integrated Business Health Score under a fixed weighting — Financial Health 22%, Risk 20%, Market 18%, Operations 15%, Strategy 13%, Organisation 7%, Technology 5%.",
    tone: "var(--teal)",
  },
  {
    n: "02",
    t: "Sector-calibrated benchmarking",
    d: "Every threshold is re-based against 1 of 5 industry profiles. A services practice is never judged against SaaS retention economics, and a manufacturer is never judged against D2C contribution margin.",
    tone: "var(--rust)",
  },
  {
    n: "03",
    t: "Value-chain attribution",
    d: "Where a reading breaches its healthy band, the instrument names the location in the value chain, the factors that commonly contribute, and how the pattern presents in practice — diagnostic language only.",
    tone: "var(--ochre)",
  },
  {
    n: "04",
    t: "Terminal-risk surveillance",
    d: "Cash runway and customer concentration are monitored as terminal indicators. A breach raises a distinct Caution disclosure in the integrated report. It never gates or delays score generation.",
    tone: "var(--oxblood)",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="ink">
        <SiteHeader />
      </div>

      <main>
        {/* ---------------------------------------------------- Espresso hero */}
        <section className="ink warm-wash halftone relative overflow-hidden">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="figure text-[0.68rem] uppercase tracking-[0.32em] text-accent"
              >
                01 — The Business Health Instrument
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.1, ease }}
                className="mt-6 font-display text-4xl leading-[1.08] text-foreground sm:text-6xl"
              >
                Let the numbers say what the narrative won't.
              </motion.h1>
              <span className="band-rule mt-8 block" aria-hidden />
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease }}
                className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
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
                className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
              >
                Decision intelligence at the standard a board expects — produced in a single
                sitting, with no account, no advisory engagement, and no figure leaving your
                browser.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <Link
                  to="/assess"
                  className="rule-copper px-9 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
                >
                  Begin the assessment
                </Link>
                <Link
                  to="/about"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
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
                <Stat value="7" label="Weighted pillars" tone="var(--rust)" />
                <Stat value={String(SECTORS.length)} label="Industry profiles" tone="var(--ochre)" />
                <Stat value="0" label="Figures stored" tone="var(--slate-blue)" />
              </motion.dl>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease }}
              className="mx-auto w-full max-w-[26rem]"
            >
              <HeroComposition />
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------ What it delivers */}
        <section className="putty-band halftone relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              02 — Mandate
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              What the instrument delivers
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
              {DELIVERS.map((c, i) => (
                <motion.article
                  key={c.t}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.65, delay: i * 0.06, ease }}
                  className="relative bg-card p-8"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ background: c.tone }}
                    aria-hidden
                  />
                  <span className="figure text-[0.7rem] tracking-[0.22em]" style={{ color: c.tone }}>
                    {c.n}
                  </span>
                  <h3 className="mt-3 font-display text-xl leading-snug text-foreground">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ The pillars */}
        <section className="relative overflow-hidden">
          <ParallaxLayer
            depth={0.5}
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div
              className="mx-auto h-[38rem] w-[38rem] rounded-full opacity-[0.09]"
              style={{ background: "var(--gradient-warm)" }}
              aria-hidden
            />
          </ParallaxLayer>
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              03 — Structure
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">The 7 pillars</h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Each pillar carries an independent scoring engine and a fixed share of the composite.
              Assess 1, several, or all 7 — partial coverage re-weights across the metrics you
              supply rather than penalising the gaps.
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
        <section className="teal-band halftone relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              04 — Calibration
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              5 industry profiles, 1 benchmark set each
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease }}
                  className="border border-border bg-card shadow-[var(--shadow-plate)]"
                >
                  <SectorPlate id={s.id} />
                  <div className="border-t border-border p-5">
                    <h3 className="font-display text-lg text-foreground">{s.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Espresso: method */}
        <section className="ink warm-wash halftone relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
              05 — Method
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Read like a discovery call, not a questionnaire.
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              <DisplayNumeral value="54" caption="Metrics resolved per full assessment" tone="var(--ochre)" />
              <DisplayNumeral value="7" caption="Independent scoring engines" tone="var(--rust)" />
              <DisplayNumeral value="0" caption="Figures transmitted or retained" tone="var(--teal)" />
            </div>
            <div className="mt-14 grid gap-px bg-border md:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Evidence before opinion",
                  d: "Every input is sourced from a named artefact — Profit and Loss statement, Stripe or QuickBooks ledger, CRM pipeline, operations log — so the diagnosis rests on instrumented figures, not recollection.",
                },
                {
                  n: "02",
                  t: "Diagnostic, not prescriptive",
                  d: "Where a reading falls outside its healthy range, you get where in the value chain it originates, what commonly contributes, and how it presents in practice. No directives, no advice.",
                },
                {
                  n: "03",
                  t: "Nothing leaves the browser",
                  d: "No account, no sign-up, no transmission. Every figure is held in session memory and discarded the moment the tab closes.",
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
                  <span className="figure text-[0.7rem] tracking-[0.2em] text-accent">{c.n}</span>
                  <h3 className="mt-3 font-display text-lg text-foreground">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
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
  return (
    <div>
      <dt className="figure text-4xl" style={{ color: tone }}>
        {value}
      </dt>
      <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dd>
    </div>
  );
}
