import { FileText, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { hasResume } from "@/lib/assets";
import Reveal from "@/components/ui/Reveal";
import CopyEmail from "@/components/ui/CopyEmail";
import ContactForm from "./ContactForm";

export default function Contact() {
  const resumeReady = hasResume();
  // Read on the server so the key never needs a NEXT_PUBLIC_ alias.
  const siteKey = process.env.TURNSTILE_SITE_KEY;

  return (
    <section
      id="contact"
      className="relative flex flex-1 flex-col justify-center overflow-hidden border-t border-line px-5 py-12 md:px-10 md:py-12"
    >
      <span
        aria-hidden
        className="text-ghost pointer-events-none absolute right-[-1rem] bottom-4 font-display text-[clamp(3rem,14vw,13rem)] leading-none tracking-[-0.02em] whitespace-nowrap select-none"
      >
        LET&apos;S GO
      </span>

      <div className="relative mx-auto w-full max-w-(--container-page)">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Left — the closing statement */}
          <Reveal>
            <div className="mb-4 flex items-center gap-6">
              <span aria-hidden className="h-px w-15 shrink-0 bg-accent-ink" />
              <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-ink">
                GET IN TOUCH
              </span>
            </div>

            <h2 className="font-display text-[clamp(2rem,8vw,4.5rem)] leading-[0.95] text-text">
              HAVE A <span className="text-accent-ink">PROJECT</span>
              <br />
              IN MIND?
            </h2>

            <p className="mt-5 max-w-md text-[0.95rem] leading-[1.7] font-light text-text-dim">
              Open to full-time roles, and freelance when it fits. I usually reply
              within a day.
            </p>

            {/* Kept alongside the form on purpose: these are the routes that
                still work when the form can't (no JS, Turnstile unreachable). */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center gap-2 border border-line px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-text-dim uppercase transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink"
              >
                <Mail size={13} aria-hidden />
                Mail directly
              </a>

              <CopyEmail email={profile.email} />

              {resumeReady && (
                <a
                  href={profile.resumeHref}
                  className="inline-flex items-center justify-center gap-2 border border-line px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-text-dim uppercase transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink"
                >
                  <FileText size={13} aria-hidden />
                  Résumé
                </a>
              )}
            </div>
          </Reveal>

          {/* Right — the form */}
          <Reveal index={1}>
            <ContactForm siteKey={siteKey} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
