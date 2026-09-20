import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

/* Supplementary detail lives here rather than in the Contact section: this is
   the `contentinfo` landmark, which is the correct home for it. The form
   stays a primary action in its own section. */
export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 md:px-10 md:py-8">
      <div className="mx-auto max-w-(--container-page)">
        <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-12">
          <a
            href="#top"
            className="font-display text-xl tracking-[0.1em] text-accent-ink transition-opacity hover:opacity-80 focus-visible:opacity-80"
          >
            {profile.initials}
            <span className="text-text-muted">.</span>
          </a>

          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["Email", profile.email],
              ["Based in", profile.location],
              ["Timezone", profile.timezone],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.58rem] tracking-[0.14em] text-text-muted uppercase">
                  {k}
                </dt>
                <dd className="mt-1 font-mono text-[0.72rem] text-text-dim">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-5">
            {profile.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[0.68rem] tracking-[0.1em] text-text-muted uppercase transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
              >
                {label}
                <ArrowUpRight size={11} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.62rem] tracking-[0.08em] text-text-muted">
            © {new Date().getFullYear()} {profile.name} — BUILT WITH NEXT.JS
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* Next's Link, not a bare anchor: this is a route change, and
                AnchorScroll only intercepts same-page fragments. */}
            <Link
              href="/privacy"
              className="font-mono text-[0.62rem] tracking-[0.08em] text-text-muted underline-offset-2 transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
            >
              Privacy
            </Link>
            <p className="font-mono text-[0.62rem] tracking-[0.08em] text-text-muted">
              Press <kbd className="border border-line-soft px-1.5 py-0.5 text-text-dim">⌘K</kbd>{" "}
              to navigate
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
