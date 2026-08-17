import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { METRIC_CONTENT, PILLAR_META } from "@/lib/assessment/spec.generated";
import { SECTORS } from "@/lib/assessment/scoring";
import { PillarConstellation } from "@/components/lnt/Figures";

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
          "7 weighted pillars, 54 metrics, 5 industry profiles. Founder-grade diagnosis with no account and no data leaving your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="ink">
        <SiteHeader />
      </div>

      <main>
        {/* ---------------------------------------------------- Ink hero */}
        <section className="ink grid-field surface-depth relative overflow-hidden">
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
                54 figures already sitting in your accounting system, CRM and operations log,
                read against sector benchmarks across 7 weighted pillars — and returned as a
                diagnosis a board would recognise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.36, ease }}
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
                <Figure value={String(METRIC_CONTENT.length)} label="Metrics" />
                <Figure value="7" label="Weighted pillars" />
                <Figure value={String(SECTORS.length)} label="Industry profiles" />
                <Figure value="0" label="Figures stored" />
              </motion.dl>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease }}
              className="mx-auto w-full max-w-[26rem]"
            >
              <PillarConstellation />
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------- Sand: pillars */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">02 — Structure</p>
          <h2 className="mt-3 font-display text-3xl text-foreground">The 7 pillars</h2>
          <span className="band-rule mt-5 block" aria-hidden />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each pillar carries its own scoring engine and its own weight in the integrated
            composite. Assess one, several, or all 7.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLAR_META.map((p, i) => {
              const count = METRIC_CONTENT.filter((m) => m.pillar === p.id).length;
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
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{
                      background: i % 2 === 0 ? "var(--gradient-rust)" : "var(--gradient-ink)",
                    }}
                    aria-hidden
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg leading-snug text-foreground">{p.name}</h3>
                    <span className="figure text-2xl text-accent">
                      {Math.round(p.weight * 100)}%
                    </span>
                  </div>
                  <div className="mt-5 h-1.5 w-full bg-secondary" aria-hidden>
                    <motion.div
                      className="rule-copper h-full"
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
        </section>

        {/* -------------------------------------------------- Ink: promises */}
        <section className="ink grid-field relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">03 — Method</p>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              Read like a discovery call, not a questionnaire.
            </h2>
            <span className="band-rule mt-5 block" aria-hidden />
            <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Sector-calibrated",
                  d: "5 industry profiles recalibrate every benchmark. A services firm is never measured against SaaS expectations.",
                },
                {
                  n: "02",
                  t: "Diagnostic, not prescriptive",
                  d: "Where a reading falls outside its healthy range, you get where in the value chain it originates, what commonly contributes, and how it presents in practice.",
                },
                {
                  n: "03",
                  t: "Nothing leaves the browser",
                  d: "No account, no sign-up, no transmission. Every figure is held in memory and discarded when the session ends.",
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

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="figure text-4xl text-foreground">{value}</dt>
      <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dd>
    </div>
  );
}
