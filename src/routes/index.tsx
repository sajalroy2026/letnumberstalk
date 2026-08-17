import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { METRIC_CONTENT, PILLAR_META } from "@/lib/assessment/spec.generated";
import { SECTORS } from "@/lib/assessment/scoring";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LetNumbersTalk — Seven-Pillar Business Health Diagnostic" },
      {
        name: "description",
        content:
          "A boardroom-grade diagnostic across 54 sector-benchmarked metrics and seven weighted pillars. Scores, readings and Areas to Look Into — computed entirely in your browser.",
      },
      { property: "og:title", content: "LetNumbersTalk — Business Health Diagnostic" },
      {
        property: "og:description",
        content:
          "Seven weighted pillars, 54 metrics, five industry profiles. Founder-grade diagnosis with no account and no data leaving your browser.",
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
    <div className="surface-depth min-h-screen">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(80% 60% at 50% 20%, black, transparent)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-xs uppercase tracking-[0.34em] text-primary"
            >
              Business Health Diagnostic
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="mt-6 max-w-4xl font-display text-4xl leading-[1.1] text-foreground sm:text-6xl"
            >
              Let the numbers say what the narrative won't.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease }}
              className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Fifty-four figures already sitting in your accounting system, CRM and operations log,
              read against sector benchmarks across seven weighted pillars — and returned as a
              diagnosis a board would recognise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <Link
                to="/assess"
                className="rule-copper rounded-full px-9 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground shadow-[var(--shadow-lift)]"
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
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-16 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4"
            >
              <Figure value={String(METRIC_CONTENT.length)} label="Metrics" />
              <Figure value="7" label="Weighted pillars" />
              <Figure value={String(SECTORS.length)} label="Industry profiles" />
              <Figure value="0" label="Figures stored" />
            </motion.dl>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
          <h2 className="font-display text-2xl text-foreground">The seven pillars</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each pillar carries its own scoring engine and its own weight in the integrated
            composite. Assess one, several, or all seven.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLAR_META.map((p, i) => {
              const count = METRIC_CONTENT.filter((m) => m.pillar === p.id).length;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease }}
                  className="tilt-card rounded-md border border-border bg-card/70 p-6"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                    <span className="font-display text-2xl text-primary">
                      {Math.round(p.weight * 100)}%
                    </span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {count} metrics
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Sector-calibrated",
                d: "Five industry profiles recalibrate every benchmark. A services firm is never measured against SaaS expectations.",
              },
              {
                t: "Diagnostic, not prescriptive",
                d: "Where a reading falls outside its healthy range, you get where in the value chain it originates, what commonly contributes, and how it presents in practice.",
              },
              {
                t: "Nothing leaves the browser",
                d: "No account, no sign-up, no transmission. Every figure is held in memory and discarded when the session ends.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                className="rounded-md border-l-2 border-primary/60 bg-card/40 p-6"
              >
                <h3 className="font-display text-lg text-foreground">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-4xl text-foreground">{value}</dt>
      <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dd>
    </div>
  );
}
