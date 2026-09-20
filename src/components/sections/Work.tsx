import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activeProjects, archivedProjects } from "@/data/projects";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectRow from "@/components/ui/ProjectRow";
import Reveal from "@/components/ui/Reveal";

export default function Work() {
  return (
    <section id="work" className="relative border-t border-line px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-(--container-page)">
        <SectionHeader eyebrow="SELECTED WORK" title="PROJECTS" titleOutline="THAT SHIP." />

        {/* One accordion, nothing open by default. Every project gets the same
            row; what's inside differs — diagram and case study for the deep
            ones, description and links for the rest. */}
        <Reveal as="div" className="space-y-3">
          {activeProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </Reveal>

        <Reveal className="mt-10">
          <Link
            href="/archive"
            className="group inline-flex items-center gap-2 border border-line px-6 py-3.5 font-mono text-[0.72rem] tracking-[0.1em] text-text-dim uppercase transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink"
          >
            View the archive
            <span className="text-text-muted">({archivedProjects.length})</span>
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
