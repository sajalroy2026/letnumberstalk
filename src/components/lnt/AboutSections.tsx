import { motion } from "motion/react";

import { ABOUT_ARCHITECT, ABOUT_PLATFORM, METHODOLOGY_NOTE } from "@/lib/assessment/content";
import { BenchmarkBand, InstrumentStack } from "@/components/lnt/Figures";

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
        <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.6rem]">
          {ABOUT_PLATFORM.title}
        </h2>
        <div className="hairline mt-6" aria-hidden />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            {ABOUT_PLATFORM.paragraphs.map((p, i) => (
              <p key={i} className="measure text-[1.02rem] leading-[1.8] tracking-[0.002em] text-foreground">
                {p}
              </p>
            ))}
          </div>
          <div className="no-print space-y-6">
            <InstrumentStack />
            <BenchmarkBand />
            <p className="mt-5 border-l-2 border-accent/70 pl-5 font-display text-xl leading-[1.5] tracking-[-0.01em] text-foreground">
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
        <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.6rem]">
          {ABOUT_ARCHITECT.title}
        </h2>
        <div className="hairline mt-6" aria-hidden />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)]">
          <aside className="sand-plate print-avoid-break p-8">
            <div
              className="rule-ink grid h-20 w-20 place-items-center rounded-full font-display text-2xl text-primary-foreground"
              aria-hidden
            >
              SR
            </div>
            <p className="mt-5 font-display text-2xl tracking-[-0.01em] text-foreground">{ABOUT_ARCHITECT.name}</p>
            <p className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-accent">
              {ABOUT_ARCHITECT.role}
            </p>
            <div className="hairline my-6" aria-hidden />
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-foreground/70">
              Credentials
            </p>
            <ul className="mt-3 space-y-2">
              {ABOUT_ARCHITECT.credentials.map((c) => (
                <li
                  key={c}
                  className="flex gap-2.5 text-[0.92rem] leading-[1.65] text-foreground/85"
                >
                  <span className="figure mt-0.5 text-[0.7rem] text-accent" aria-hidden>
                    ▪
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="hairline my-6" aria-hidden />
            <p className="text-[0.92rem] text-foreground/85">
              Mail —{" "}
              <a
                href={`mailto:${ABOUT_ARCHITECT.contact}`}
                className="text-foreground underline decoration-accent/60 underline-offset-4"
              >
                {ABOUT_ARCHITECT.contact}
              </a>
            </p>
          </aside>

          <div className="glass space-y-5 p-7">
            {ABOUT_ARCHITECT.paragraphs.map((p, i) => (
              <p key={i} className="measure text-[1.02rem] leading-[1.8] tracking-[0.002em] text-foreground">
                {p}
              </p>
            ))}
            <p className="measure border-t border-border pt-5 text-[0.95rem] leading-[1.75] text-foreground/90">
              {METHODOLOGY_NOTE}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
