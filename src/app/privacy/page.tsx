import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/sections/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the contact form collects, who processes it, how long it is kept, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

/* ── Two values to keep true ──────────────────────────────────────────────
   A privacy notice is a statement of fact, so anything here that drifts from
   reality is worse than having said nothing. These are the two lines most
   likely to go stale.

   HOST: whoever serves the site. Its access logs see visitor IP addresses,
   which makes it a processor whether or not you ever look at them.
   ⚠ CONFIRM THIS BEFORE PUBLISHING — there is no deploy config in the repo
   to read it from, so it is a guess.

   UPDATED: bump whenever the substance below changes. */
const HOST = "Vercel";
const UPDATED = "20 September 2026";

/** Retention for enquiries that don't turn into work. Honoured by a Gmail
 *  filter that labels everything from the form's sender on arrival, plus an
 *  annual `older_than:2y` sweep of that label — the mechanism is the point,
 *  a period nobody enforces is just a false statement. */
const RETENTION = "24 months";

const SECTIONS = [
  {
    h: "Who is responsible",
    body: (
      <>
        This site is mine personally — not a company&apos;s. I decide what
        happens to anything you send through it, which makes me the data
        controller for it. No employer or client has access to it.
        <br />
        <br />
        For anything in this notice, including a deletion request, email{" "}
        <a href={`mailto:${profile.email}`} className="text-accent-ink underline">
          {profile.email}
        </a>
        .
      </>
    ),
  },
  {
    h: "What the contact form collects",
    body: (
      <>
        Only what you type into it: your <strong>name</strong>, your{" "}
        <strong>email address</strong>, an optional{" "}
        <strong>company or role</strong>, your <strong>message</strong>, and
        which of the three <strong>enquiry types</strong> you picked.
        <br />
        <br />
        There is no account, no newsletter, and no profile built from any of
        it. Nothing is sold or shared for advertising, ever.
      </>
    ),
  },
  {
    h: "Why, and on what basis",
    body: (
      <>
        To read your message and reply to it. That is the only purpose.
        <br />
        <br />
        Under the GDPR the basis is legitimate interest — you contacted me
        expecting an answer, and answering requires keeping your message long
        enough to do so. Where the enquiry is about possible work, it is also a
        step taken at your request before any agreement.
      </>
    ),
  },
  {
    h: "Where it goes",
    body: (
      <>
        Your message becomes an email in my personal inbox. Four services
        touch it on the way, none of which sees it for their own purposes:
        <br />
        <br />
        <strong>Resend</strong> delivers the email.
        <br />
        <strong>Google</strong> hosts the inbox it lands in.
        <br />
        <strong>Cloudflare Turnstile</strong> runs the anti-spam check on the
        form. This is the one thing that happens before you press send: your
        IP address is passed to Cloudflare so it can judge whether the
        submission is automated. It is used for that check and nothing else —
        it is never stored by me and never appears in the email.
        <br />
        <strong>{HOST}</strong> serves the site, and like any web server its
        access logs record IP addresses of visitors.
      </>
    ),
  },
  {
    h: "How long it is kept",
    body: (
      <>
        If our exchange doesn&apos;t lead to work, I delete the enquiry within{" "}
        <strong>{RETENTION}</strong> of our last message.
        <br />
        <br />
        If it does lead to work, the correspondence becomes part of that
        project&apos;s record, and I keep it for as long as I need it for the
        engagement and for any related legal or accounting obligations.
        <br />
        <br />
        You don&apos;t have to wait for either. Ask me to delete your message
        and I will, without needing a reason.
      </>
    ),
  },
  {
    h: "Cookies and local storage",
    body: (
      <>
        <strong>This site sets no cookies of its own, and there is no
        analytics of any kind</strong> — no page-view tracking, no advertising
        pixels, no session recording, no third-party scripts beyond the
        anti-spam check described above.
        <br />
        <br />
        One thing is stored in your browser: your light or dark theme choice,
        kept in <code className="text-text-dim">localStorage</code> so the site
        doesn&apos;t forget it. It is written only when you click the toggle,
        it never leaves your device, and I cannot read it. Clearing your
        browser data removes it.
        <br />
        <br />
        The fonts are served from this site rather than from Google, so
        loading a page sends nothing to a font provider.
      </>
    ),
  },
  {
    h: "Your rights",
    body: (
      <>
        You can ask me for a copy of what I hold about you, to correct it, to
        delete it, or to stop using it. If you are in the UK, EU or India, the
        law gives you those rights explicitly; I will honour them wherever you
        are.
        <br />
        <br />
        One email to{" "}
        <a href={`mailto:${profile.email}`} className="text-accent-ink underline">
          {profile.email}
        </a>{" "}
        is enough — no form, no proof of identity beyond writing from the
        address you contacted me on. I will action it within 30 days, and in
        practice much sooner. If you are in the EU or UK and think I have
        handled it badly, you can complain to your national data protection
        authority.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main id="main" className="px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-32">
        <div className="mx-auto max-w-(--container-page)">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.12em] text-text-muted uppercase transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
          >
            <ArrowLeft
              size={13}
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back
          </Link>

          <header className="mt-10 mb-12 md:mb-16">
            <div className="mb-4 flex items-center gap-6">
              <span aria-hidden className="h-px w-15 shrink-0 bg-accent-ink" />
              <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-ink">
                UPDATED {UPDATED.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,10vw,6rem)] leading-[0.95] text-text">
              PRIVACY
              <br />
              <span className="text-outline">NOTICE.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed font-light text-text-dim">
              Short version: the contact form emails me what you type, nothing
              else is collected, nothing is tracked, and you can have it
              deleted by asking.
            </p>
          </header>

          {/* The hairline-grid pattern used by About and the case-study grid:
              the gap shows the parent's `bg-line` through as 1px rules. */}
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {SECTIONS.map(({ h, body }) => (
              <section key={h} className="bg-surface p-6 md:p-8">
                <h2 className="font-mono text-[0.7rem] tracking-[0.14em] text-accent-ink uppercase">
                  {h}
                </h2>
                <div className="mt-4 text-[0.88rem] leading-[1.75] font-light text-text-dim">
                  {body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
