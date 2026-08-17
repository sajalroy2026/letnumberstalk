import { createFileRoute, Link } from "@tanstack/react-router";

import { AboutSections } from "@/components/lnt/AboutSections";
import { Disclosure, SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LetNumbersTalk and the Enterprise Systems Architect" },
      {
        name: "description",
        content:
          "What the LetNumbersTalk diagnostic delivers, the 7-pillar architecture behind it, and the consulting practice of Mr Sajal Roy, Architect of Enterprise Systems.",
      },
      { property: "og:title", content: "About LetNumbersTalk" },
      {
        property: "og:description",
        content:
          "A 7-pillar, 54-metric business diagnostic built on AI-augmented research synthesis, conceptualized by Mr Sajal Roy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="ink">
        <SiteHeader />
      </div>
      <section className="ink warm-wash halftone relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <p className="figure text-[0.66rem] uppercase tracking-[0.28em] text-accent">
            The instrument
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
            A boardroom diagnostic, run from the figures already in the business.
          </h1>
          <span className="band-rule mt-6 block" aria-hidden />
        </div>
      </section>
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-16 sm:px-8">
        <div className="mt-12 space-y-10">
          <AboutSections />
          <Disclosure />
        </div>
        <Link
          to="/assess"
          className="rule-copper mt-12 inline-block px-8 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Begin the assessment
        </Link>
      </main>
      <div className="ink">
        <SiteFooter />
      </div>
    </div>
  );
}
