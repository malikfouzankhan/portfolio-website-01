import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { activeProjects } from "@/data/projects";
import { getGithubData, relativeTime } from "@/lib/github";
import ContributionGraph from "@/components/ui/ContributionGraph";
import Typewriter from "@/components/ui/Typewriter";

const ICONS = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter } as const;

/** Split into per-character spans so the wordmark staggers in. */
function Chars({ text, offset = 0, className = "" }: { text: string; offset?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} className="char" style={{ "--i": i + offset } as React.CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default async function Hero() {
  const { lastPushed, contributions } = await getGithubData();
  const liveCount = activeProjects.filter(
    (p) => p.status === "live" || p.status === "private",
  ).length;

  const statusRows = [
    // Not "Status": the panel header already says that, and what this row
    // actually reports is availability.
    { k: "Availability", v: profile.availabilityNote },
    { k: "Focus", v: "Backend · WhatsApp Platform" },
    { k: "Based", v: `${profile.location} · ${profile.timezone}` },
    ...(lastPushed ? [{ k: "Last push", v: relativeTime(lastPushed) }] : []),
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-20 pb-10 md:px-10 md:pt-24 md:pb-16"
    >
      <div aria-hidden className="bg-grid parallax-slow pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[15%] right-[-30%] h-70 w-70 rounded-full md:right-[-10%] md:h-125 md:w-125"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-(--container-page) gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16">
        {/* Left — identity */}
        <div>
          <h1 className="mb-4 font-display text-[clamp(3rem,13vw,9.5rem)] leading-[0.88] text-text md:mb-5">
            <Chars text="Malik" />
            <br />
            <Chars text="Fouzan" offset={5} className="text-accent-ink" />
            <span className="char text-text-muted" style={{ "--i": 11 } as React.CSSProperties}>
              .
            </span>
          </h1>

          <div className="mb-4 min-h-6 md:mb-6">
            <Typewriter words={profile.roles} />
          </div>

          <p className="mb-6 max-w-[34rem] text-[0.92rem] leading-[1.65] font-light text-text-dim md:mb-8 md:text-[1.05rem] md:leading-[1.75]">
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex flex-1 items-center justify-center gap-2 bg-accent px-3 py-3.5 text-center font-mono text-[0.68rem] font-medium tracking-[0.06em] text-black uppercase whitespace-nowrap transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:flex-none sm:px-8 sm:text-[0.8rem] sm:tracking-[0.1em]"
            >
              View my work
              <ArrowDown size={14} aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex flex-1 items-center justify-center gap-2 border border-line px-3 py-3.5 text-center font-mono text-[0.68rem] tracking-[0.06em] text-text-dim uppercase whitespace-nowrap transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink sm:flex-none sm:px-8 sm:text-[0.8rem] sm:tracking-[0.1em]"
            >
              Get in touch
              <ArrowUpRight size={14} aria-hidden />
            </a>

            <div className="flex gap-3 sm:ml-2">
              {profile.socials.map(({ label, href }) => {
                const Icon = ICONS[label as keyof typeof ICONS];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-10.5 shrink-0 items-center justify-center border border-line text-text-muted transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Compact stand-in for the status panel, which is too tall to fit a
              phone viewport alongside everything above. */}
          <dl className="mt-6 flex divide-x divide-line border border-line lg:hidden">
            <div className="flex-1 px-4 py-3">
              <dt className="font-mono text-[0.55rem] tracking-[0.12em] text-text-muted uppercase">
                In production
              </dt>
              <dd className="font-display text-xl text-accent-ink">{liveCount} systems</dd>
            </div>
            <div className="flex-1 px-4 py-3">
              <dt className="font-mono text-[0.55rem] tracking-[0.12em] text-text-muted uppercase">
                {lastPushed ? "Last push" : "Based"}
              </dt>
              <dd className="font-mono text-[0.78rem] text-text-dim">
                {lastPushed ? relativeTime(lastPushed) : profile.location}
              </dd>
            </div>
          </dl>

          {/* Half the year, because 53 columns across a phone reduces each day
              to a ~5px smudge. Tooltips off: there is no hover to trigger them
              on touch, and they are most of the markup's weight. */}
          {contributions && (
            <div className="mt-3 border border-line px-4 py-3.5 lg:hidden">
              <div className="mb-2.5 font-mono text-[0.55rem] tracking-[0.12em] text-text-muted uppercase">
                Contributions — last 6 months
              </div>
              <ContributionGraph data={contributions} weeks={26} showTooltips={false} />
            </div>
          )}
        </div>

        {/* Right — live system status, filling what used to be empty space */}
        <aside className="animate-fade hidden border border-line bg-surface/60 backdrop-blur-sm lg:block">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            {/* Traffic lights. Two grey dots and one green read as a panel
                someone forgot to finish; all three lit reads as deliberate
                window chrome. Every tone is a token, so the light theme gets
                its own burgundy/amber/forest set for free. */}
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-status-review/70" />
              <span className="size-2 rounded-full bg-accent/70" />
              <span className="size-2 rounded-full bg-status-live/70" />
            </span>
            <span className="ml-1 font-mono text-[0.62rem] tracking-[0.14em] text-text-muted uppercase">
              status
            </span>
          </div>

          <dl className="divide-y divide-line">
            {statusRows.map(({ k, v }) => (
              <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3.5">
                <dt className="font-mono text-[0.62rem] tracking-[0.14em] text-text-muted uppercase">
                  {k}
                </dt>
                <dd className="text-right font-mono text-[0.72rem] text-text-dim">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-2 divide-x divide-line border-t border-line">
            <div className="px-5 py-4">
              <div className="font-display text-3xl text-accent-ink">{liveCount}</div>
              <div className="font-mono text-[0.58rem] tracking-[0.12em] text-text-muted uppercase">
                systems in production
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="font-display text-3xl text-accent-ink">80+</div>
              <div className="font-mono text-[0.58rem] tracking-[0.12em] text-text-muted uppercase">
                endpoints shipped
              </div>
            </div>
          </div>

          {/* Absent rather than empty when there is no token — see
              getGithubData. Nested here so it inherits the aside's
              `hidden lg:block` and its `animate-fade`, which globals.css
              already pauses behind the preloader. */}
          {contributions && (
            <div className="border-t border-line px-5 py-4">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <span className="font-mono text-[0.58rem] tracking-[0.12em] text-text-muted uppercase">
                  contributions
                </span>
                <span className="font-mono text-[0.62rem] text-text-dim">
                  {contributions.total} in the last year
                </span>
              </div>
              <ContributionGraph data={contributions} />
            </div>
          )}
        </aside>
      </div>

      <div
        aria-hidden
        className="absolute bottom-10 left-10 hidden items-center gap-3 lg:flex"
      >
        <span
          className="h-10 w-px"
          style={{ background: "linear-gradient(to bottom, var(--color-accent), transparent)" }}
        />
        <span className="font-mono text-[0.65rem] tracking-[0.15em] text-text-muted [writing-mode:vertical-lr]">
          SCROLL
        </span>
      </div>
    </section>
  );
}
