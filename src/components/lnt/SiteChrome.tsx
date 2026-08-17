import { Link } from "@tanstack/react-router";

import { ABOUT_ARCHITECT, DISCLOSURE } from "@/lib/assessment/content";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-base tracking-tight text-foreground">
            LetNumbersTalk
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            Business Diagnostics
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-[0.18em]">
          <Link
            to="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            About
          </Link>
          <Link
            to="/assess"
            className="rounded-full border border-primary/60 px-4 py-1.5 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Begin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-background/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <Disclosure />
        <p className="mt-8 text-xs text-muted-foreground">
          LetNumbersTalk — a diagnostic instrument by Mr Sajal Roy, Architect of Enterprise
          Systems. {ABOUT_ARCHITECT.contact}. Every figure entered stays in this browser.
        </p>
      </div>
    </footer>
  );
}

export function Disclosure() {
  return (
    <section
      aria-label={DISCLOSURE.title}
      className="print-plain rounded-md border border-border bg-card/60 p-6"
    >
      <h2 className="text-xs uppercase tracking-[0.24em] text-primary">{DISCLOSURE.title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
        {DISCLOSURE.body}
      </p>
    </section>
  );
}
