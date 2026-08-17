import { Link } from "@tanstack/react-router";

import { ABOUT_ARCHITECT, DISCLOSURE, METHODOLOGY_NOTE } from "@/lib/assessment/content";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="truncate font-display text-base tracking-tight text-foreground">
            LetNumbersTalk
          </span>
          <span className="hidden text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            by Mr Sajal Roy
          </span>
          <span className="hidden text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground lg:inline">
            The Business Health Instrument
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-5 text-[0.7rem] uppercase tracking-[0.2em]">
          <Link
            to="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            About
          </Link>
          <Link
            to="/assess"
            className="rule-copper px-5 py-2 text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
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
            {ABOUT_ARCHITECT.linkedin ? (
              <p className="mt-1.5 text-sm text-muted-foreground">
                LinkedIn —{" "}
                <a
                  href={ABOUT_ARCHITECT.linkedin}
                  className="text-foreground underline decoration-accent/60 underline-offset-4"
                >
                  Profile
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="hairline mt-12" aria-hidden />

        <p className="mt-6 measure text-xs leading-relaxed text-muted-foreground">
          No login required. Every figure entered is held in browser memory for the duration of the session and is
          discarded when the tab closes. Open the instrument and begin.
        </p>
      </div>
    </footer>
  );
}

export function Disclosure() {
  return (
    <section
      aria-label={DISCLOSURE.title}
      className="print-plain print-avoid-break border-l-2 border-accent/70 bg-secondary/50 px-6 py-6"
    >
      <h2 className="text-[0.65rem] uppercase tracking-[0.26em] text-accent">{DISCLOSURE.title}</h2>
      <p className="mt-3 measure text-xs leading-relaxed text-muted-foreground">{DISCLOSURE.body}</p>
    </section>
  );
}
