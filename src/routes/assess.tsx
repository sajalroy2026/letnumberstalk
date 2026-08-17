import { createFileRoute } from "@tanstack/react-router";

import { AssessmentFlow } from "@/components/lnt/Stages";
import { SiteFooter, SiteHeader } from "@/components/lnt/SiteChrome";
import { SessionProvider } from "@/lib/assessment/session";

export const Route = createFileRoute("/assess")({
  head: () => ({
    meta: [
      { title: "Run the Assessment — LetNumbersTalk Business Diagnostic" },
      {
        name: "description",
        content:
          "Assess seven pillars across 54 sector-benchmarked metrics. Scores, readings and Areas to Look Into, computed entirely in your browser.",
      },
      { property: "og:title", content: "Run the LetNumbersTalk Business Diagnostic" },
      {
        property: "og:description",
        content:
          "Seven weighted pillars, 54 metrics, five industry profiles. No account, no data leaves your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessPage,
});

function AssessPage() {
  return (
    <SessionProvider>
      <div className="surface-depth min-h-screen">
        <SiteHeader />
        <main>
          <AssessmentFlow />
        </main>
        <SiteFooter />
      </div>
    </SessionProvider>
  );
}
