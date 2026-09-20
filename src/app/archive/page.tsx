import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { archivedProjects } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Earlier projects — open-source contributions, client sites, and side projects.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
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
                EARLIER WORK
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,10vw,6rem)] leading-[0.95] text-text">
              THE
              <br />
              <span className="text-outline">ARCHIVE.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed font-light text-text-dim">
              Open-source contributions, client sites, and things I built to
              learn something. Older, but still standing.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {archivedProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
