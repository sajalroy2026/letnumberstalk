import { Link } from "@tanstack/react-router";

import { ABOUT_ARCHITECT, DISCLOSURE, METHODOLOGY_NOTE } from "@/lib/assessment/content";

export function SiteHeader() {
  return (
    <header className="ink tone-amber no-print relative z-40 border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-8 sm:py-4">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="shrink-0 font-display text-sm tracking-tight text-foreground sm:text-base">
            LetNumbersTalk
          </span>
          <span className="hidden text-[0.82rem] font-semibold tracking-normal text-accent sm:inline">
            By Mr. Sajal Roy
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] sm:gap-4 sm:text-[0.7rem] sm:tracking-[0.2em]">
          <Link
            to="/about"
            className="btn-ghost-accent px-3 py-2 text-foreground sm:px-4"
            activeProps={{ className: "bg-secondary" }}
          >
            About
          </Link>
          <Link to="/assess" className="btn-accent px-3 py-2 font-medium sm:px-5">
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start Assessment</span>
          </Link>
        </nav>
      </div>

    </header>

  );
}

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-foreground">LetNumbersTalk</p>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              A 7-pillar, 54-metric instrument for reading the condition of a business against
              sector-calibrated evidence.
            </p>
          </div>

          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-accent">Methodology</p>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              {METHODOLOGY_NOTE}
            </p>
          </div>

          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.26em] text-accent">Conceptualized by</p>
            <p className="mt-3 font-display text-base text-foreground">{ABOUT_ARCHITECT.name}</p>
            <p className="text-sm text-muted-foreground">{ABOUT_ARCHITECT.role}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Mail —{" "}
              <a
                href={`mailto:${ABOUT_ARCHITECT.contact}`}
                className="text-foreground underline decoration-accent/60 underline-offset-4"
              >
                {ABOUT_ARCHITECT.contact}
              </a>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              <a
                href={ABOUT_ARCHITECT.workspaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-accent/60 underline-offset-4"
              >
                {ABOUT_ARCHITECT.workspaceLabel}
              </a>
            </p>
          </div>
        </div>

        <div className="hairline mt-12" aria-hidden />

        <p className="mt-6 max-w-[80ch] font-hero text-[1.22rem] leading-[1.75] tracking-[-0.005em] text-foreground">
          No login required. Every figure entered is held in browser memory for the duration of the session and is
          discarded when the tab closes. Open the instrument and begin.
        </p>

      </div>
    </footer>
  );
}

export function ReportAttribution() {
  return (
    <section
      aria-label="Attribution"
      className="print-plain print-avoid-break border-t border-border pt-7"
    >
      <p className="text-[0.65rem] uppercase tracking-[0.26em] text-accent">Conceptualized by</p>
      <p className="mt-2 font-display text-lg tracking-[-0.01em] text-foreground">
        {ABOUT_ARCHITECT.name}
      </p>
      <p className="text-[0.9rem] text-foreground/90">{ABOUT_ARCHITECT.role}</p>
      <p className="mt-3 text-[0.9rem] text-foreground/90">
        Mail —{" "}
        <a
          href={`mailto:${ABOUT_ARCHITECT.contact}`}
          className="font-medium text-foreground underline decoration-accent/60 underline-offset-4"
        >
          {ABOUT_ARCHITECT.contact}
        </a>
      </p>
      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-foreground/90">
        <a
          href={ABOUT_ARCHITECT.workspaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline decoration-accent/60 underline-offset-4"
        >
          {ABOUT_ARCHITECT.workspaceLabel}
        </a>
      </p>
    </section>
  );
}

export function Disclosure() {
  return (
    <section
      aria-label={DISCLOSURE.title}
      className="print-plain print-avoid-break disclosure-plate plate-lift border-l-4 border-l-accent px-7 py-7"
    >
      <h2 className="font-display text-xl tracking-[-0.01em] text-foreground">{DISCLOSURE.title}</h2>
      <p className="mt-4 measure text-[0.95rem] leading-[1.8] text-foreground/90">{DISCLOSURE.body}</p>
    </section>
  );
}
