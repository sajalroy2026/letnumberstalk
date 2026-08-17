import { ABOUT_ARCHITECT, ABOUT_PLATFORM } from "@/lib/assessment/content";

export function AboutSections() {
  return (
    <div className="space-y-10">
      <section className="print-plain rounded-md border border-border bg-card/60 p-8">
        <h2 className="font-display text-2xl text-foreground">{ABOUT_PLATFORM.title}</h2>
        <div className="mt-4 space-y-4">
          {ABOUT_PLATFORM.paragraphs.map((p, i) => (
            <p key={i} className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="print-plain rounded-md border border-border bg-card/60 p-8">
        <h2 className="font-display text-2xl text-foreground">{ABOUT_ARCHITECT.title}</h2>
        <div className="mt-4 space-y-4">
          {ABOUT_ARCHITECT.paragraphs.map((p, i) => (
            <p key={i} className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-[0.24em] text-primary">Industry credentials</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ABOUT_ARCHITECT.credentials.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Contact{" "}
          <a
            href={`mailto:${ABOUT_ARCHITECT.contact}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            {ABOUT_ARCHITECT.contact}
          </a>
        </p>
      </section>
    </div>
  );
}
