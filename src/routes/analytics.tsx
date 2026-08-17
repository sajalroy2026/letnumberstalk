import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { getAnalyticsSummary } from "@/lib/analytics/analytics.functions";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Usage Analytics — LetNumbersTalk" },
      {
        name: "description",
        content:
          "Anonymous usage readings for the LetNumbersTalk instrument: visits, assessments started, assessments completed and sector mix.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Usage Analytics — LetNumbersTalk" },
      {
        property: "og:description",
        content: "Anonymous visit and completion readings for the LetNumbersTalk instrument.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

const ease = [0.16, 1, 0.3, 1] as const;

function AnalyticsPage() {
  const fetchSummary = useServerFn(getAnalyticsSummary);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics-summary", 30],
    queryFn: () => fetchSummary({ data: { days: 30 } }),
  });

  const peak = Math.max(1, ...(data?.daily.map((d) => d.visits) ?? [1]));

  return (
    <div className="min-h-screen bg-background">
      <div className="ink no-print sticky top-0 z-40">
        <SiteHeader />
      </div>

      <main className="ink tone-teal aurora-wash">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="figure text-[0.65rem] uppercase tracking-[0.28em] text-accent">
            Instrument usage
          </p>
          <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            Visitor analytics
          </h1>
          <span className="band-rule mt-5 block" aria-hidden />
          <p className="mt-5 max-w-2xl text-sm leading-[1.75] text-muted-foreground">
            Anonymous counts across the last 30 days. Entered business figures stay in the browser
            and are never recorded here — this page holds event names, timestamps and the selected
            industry profile only.
          </p>

          {isLoading ? (
            <p className="mt-12 text-sm text-muted-foreground">Reading the log…</p>
          ) : isError ? (
            <p className="mt-12 text-sm text-critical">The usage log is unavailable right now.</p>
          ) : data ? (
            <>
              <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                <Tile label="Visits" value={data.totals.visits} tone="var(--teal)" />
                <Tile label="Assessments started" value={data.totals.starts} tone="var(--rust)" />
                <Tile
                  label="Assessments completed"
                  value={data.totals.completions}
                  tone="var(--lime)"
                />
                <Tile
                  label="Completion rate"
                  value={data.completionRate}
                  suffix="%"
                  tone="var(--plum)"
                />
              </div>

              <section className="mt-14">
                <h2 className="font-display text-xl text-foreground">Daily visits</h2>
                <div className="mt-6 flex h-40 items-end gap-1">
                  {data.daily.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No readings logged yet.</p>
                  ) : (
                    data.daily.map((d, i) => (
                      <motion.div
                        key={d.day}
                        title={`${d.day} — ${d.visits} visits`}
                        className="flex-1 bg-accent/70"
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.visits / peak) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.02, ease }}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="mt-14">
                <h2 className="font-display text-xl text-foreground">Industry profile mix</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {data.sectors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No profiles selected yet.</p>
                  ) : (
                    data.sectors.map((s) => (
                      <div
                        key={s.sector}
                        className="flex items-baseline justify-between border border-border bg-card px-5 py-4"
                      >
                        <span className="text-sm text-foreground">{s.sector}</span>
                        <span className="figure text-xl text-accent">{s.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          ) : null}
        </div>
      </main>

      <div className="ink">
        <SiteFooter />
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: number;
  suffix?: string;
  tone: string;
}) {
  return (
    <div className="bg-card p-7">
      <p className="figure text-4xl" style={{ color: tone }}>
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
