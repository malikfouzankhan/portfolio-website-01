import { profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-svh flex-col justify-center border-t border-line px-5 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto w-full max-w-(--container-page)">
        <Reveal as="header" className="mb-7 md:mb-14">
          <div className="mb-4 flex items-center gap-6">
            <span aria-hidden className="h-px w-15 shrink-0 bg-accent-ink" />
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-ink">
              WHO&apos;S WRITING
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,10vw,6rem)] leading-[0.95] text-text">
            ABOUT <span className="text-outline">THE WORK.</span>
          </h2>
        </Reveal>

        <Reveal className="mb-8 md:mb-16">
          <p className="max-w-3xl font-display text-[clamp(1.35rem,4vw,2.6rem)] leading-[1.15] text-text-dim">
            {profile.aboutLead}
          </p>
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {profile.aboutPoints.map(({ k, v }, i) => (
            <Reveal key={k} index={i} className="bg-surface p-5 md:p-7">
              <h3 className="font-mono text-[0.62rem] tracking-[0.18em] text-accent-ink uppercase">
                {k}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-[1.55] font-light text-text-dim md:mt-3 md:text-[0.92rem]">
                {v}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
