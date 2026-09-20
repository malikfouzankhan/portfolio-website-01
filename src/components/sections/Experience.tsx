import { experience } from "@/data/experience";
import Reveal from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative border-t border-line bg-section px-5 py-20 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-(--container-page)">
        {/* Sticky heading on the left, timeline scrolling past it on the right —
            a different rhythm from the stacked sections above and below. */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-4 flex items-center gap-6">
              <span aria-hidden className="h-px w-15 shrink-0 bg-accent-ink" />
              <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-ink">
                TRACK RECORD
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,10vw,5rem)] leading-[0.95] text-text">
              WHERE
              <br />
              <span className="text-outline">I&apos;VE BUILT.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed font-light text-text-dim">
              Client work and product work, mostly backend, always through to
              deployment.
            </p>
          </div>

          <ol className="relative space-y-12 border-l border-line pl-8 md:pl-12">
            {experience.map((job, i) => (
              <Reveal as="li" key={`${job.org}-${job.role}`} index={i} className="relative">
                <span
                  aria-hidden
                  className="absolute top-2 -left-[calc(2rem+4.5px)] size-2 rounded-full md:-left-[calc(3rem+4.5px)]"
                  style={{
                    background: job.current ? "var(--color-accent)" : "var(--color-line)",
                    boxShadow: job.current ? "0 0 10px var(--color-accent)" : undefined,
                  }}
                />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-2xl tracking-[0.02em] text-text">
                    {job.role}
                  </h3>
                  <span className="font-mono text-[0.75rem] text-accent-ink">@ {job.org}</span>
                </div>

                <p className="mt-1.5 font-mono text-[0.65rem] tracking-[0.12em] text-text-muted uppercase">
                  {job.period}
                  {job.location && ` · ${job.location}`}
                </p>

                <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed font-light text-text-dim">
                  {job.summary}
                </p>

                <ul className="mt-4 space-y-2">
                  {job.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex max-w-2xl gap-3 text-[0.88rem] leading-relaxed font-light text-text-dim"
                    >
                      <span aria-hidden className="mt-2 size-1 shrink-0 bg-accent-ink" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-line-soft bg-chip px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.05em] text-text-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
