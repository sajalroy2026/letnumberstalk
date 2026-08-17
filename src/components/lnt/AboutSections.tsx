import { motion } from "motion/react";

import { ABOUT_ARCHITECT, ABOUT_PLATFORM, METHODOLOGY_NOTE } from "@/lib/assessment/content";
import { PillarWeightRing } from "@/components/lnt/Figures";

const ease = [0.16, 1, 0.3, 1] as const;

export function AboutSections() {
  return (
    <div className="space-y-20">
      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="print-avoid-break"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-accent">The instrument</p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          {ABOUT_PLATFORM.title}
        </h2>
        <div className="hairline mt-6" aria-hidden />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            {ABOUT_PLATFORM.paragraphs.map((p, i) => (
              <p key={i} className="measure text-[0.95rem] leading-[1.75] text-foreground/85">
                {p}
              </p>
            ))}
          </div>
          <div className="no-print">
            <PillarWeightRing />
            <p className="mt-5 border-l-2 border-accent/70 pl-5 font-display text-lg leading-relaxed text-foreground">
              “A diagnosis is what the figures already say, read against the right comparison
              set.”
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="print-avoid-break"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-accent">The practice</p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          {ABOUT_ARCHITECT.title}
        </h2>
        <div className="hairline mt-6" aria-hidden />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)]">
          <aside className="print-avoid-break border border-border bg-card p-7 shadow-[var(--shadow-plate)]">
            <div
              className="rule-ink grid h-20 w-20 place-items-center rounded-full font-display text-2xl text-primary-foreground"
              aria-hidden
            >
              SR
            </div>
            <p className="mt-5 font-display text-xl text-foreground">{ABOUT_ARCHITECT.name}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-accent">
              {ABOUT_ARCHITECT.role}
            </p>
            <div className="hairline my-6" aria-hidden />
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Credentials
            </p>
            <ul className="mt-3 space-y-2">
              {ABOUT_ARCHITECT.credentials.map((c) => (
                <li
                  key={c}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="figure mt-0.5 text-[0.7rem] text-accent" aria-hidden>
                    ▪
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="hairline my-6" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Mail —{" "}
              <a
                href={`mailto:${ABOUT_ARCHITECT.contact}`}
                className="text-foreground underline decoration-accent/60 underline-offset-4"
              >
                {ABOUT_ARCHITECT.contact}
              </a>
            </p>
          </aside>

          <div className="space-y-5">
            {ABOUT_ARCHITECT.paragraphs.map((p, i) => (
              <p key={i} className="measure text-[0.95rem] leading-[1.75] text-foreground/85">
                {p}
              </p>
            ))}
            <p className="measure border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
              {METHODOLOGY_NOTE}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
