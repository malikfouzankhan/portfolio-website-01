import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { Project } from "@/data/projects";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";
import StatusChip from "@/components/ui/StatusChip";

const CASE_LABELS = [
  ["problem", "The problem"],
  ["constraint", "The constraint"],
  ["decision", "What I did"],
  ["outcome", "Where it landed"],
] as const;

/* Built on native <details name="work">. The shared `name` gives exclusive
   accordion behaviour — opening one closes the rest — with no JavaScript,
   correct keyboard handling and a real disclosure role for free. Where
   details[name] isn't supported the rows just toggle independently, which is
   a clean degradation rather than a broken one. */
export default function ProjectRow({ project }: { project: Project }) {
  const hasLinks = Boolean(project.live || project.github);

  return (
    <details
      name="work"
      className="group border border-line bg-surface transition-colors open:bg-surface-hi"
    >
      <summary className="flex flex-wrap items-center gap-x-5 gap-y-3 p-5 md:p-6">
        <span
          aria-hidden
          className="font-display text-3xl leading-none text-accent-ink/40 transition-colors group-open:text-accent-ink/80"
        >
          {project.number}
        </span>

        <span className="min-w-0 flex-1">
          <h3 className="font-display text-[1.45rem] leading-tight tracking-[0.02em] text-text transition-colors group-open:text-accent-ink md:text-[1.7rem]">
            {project.title}
          </h3>
          <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.12em] text-text-muted uppercase">
            {project.role}
            {project.teamSize && ` · ${project.teamSize}`}
            {project.org && ` · ${project.org}`}
            {project.period && ` · ${project.period}`}
          </span>
        </span>

        <StatusChip status={project.status} note={project.statusNote} />

        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.12em] text-text-muted uppercase">
          <span className="group-open:hidden">Click to see more</span>
          <span className="hidden group-open:inline">Collapse</span>
          <ChevronDown
            size={13}
            aria-hidden
            className="transition-transform duration-300 group-open:rotate-180"
          />
        </span>
      </summary>

      <div className="border-t border-line px-5 pt-5 pb-6 md:px-6 md:pt-6 md:pb-8">
        <p className="max-w-3xl text-[0.92rem] leading-[1.75] font-light text-text-dim">
          {project.description}
        </p>

        {project.client && (
          <p className="mt-2 font-mono text-[0.62rem] tracking-[0.1em] text-text-muted uppercase">
            Client · {project.client}
          </p>
        )}

        {project.architecture && (
          <ArchitectureDiagram
            arch={project.architecture}
            idPrefix={project.slug.replace(/[^a-z0-9]/gi, "")}
          />
        )}

        {project.caseStudy && (
          <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {CASE_LABELS.map(([key, label]) => (
              <div key={key} className="bg-surface p-5">
                <h4 className="font-mono text-[0.6rem] tracking-[0.14em] text-accent-ink uppercase">
                  {label}
                </h4>
                <p className="mt-2 text-[0.86rem] leading-[1.7] font-light text-text-dim">
                  {project.caseStudy![key]}
                </p>
              </div>
            ))}
          </div>
        )}

        {project.outcome && !project.caseStudy && (
          <p
            className="mt-4 border-l-2 border-accent-ink/40 pl-3 text-[0.85rem] leading-relaxed font-light text-text-muted"
          >
            {project.outcome}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border border-accent-ink/25 bg-accent-ink/6 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.08em] text-accent-ink"
            >
              {tag}
            </span>
          ))}
        </div>

        {hasLinks && (
          <div className="mt-6 flex flex-wrap gap-6 border-t border-line pt-5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.1em] text-accent-ink uppercase transition-opacity hover:opacity-70 focus-visible:opacity-70"
              >
                <ArrowUpRight size={13} aria-hidden />
                Live demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.1em] text-text-muted uppercase transition-colors hover:text-text focus-visible:text-text"
              >
                <Github size={13} aria-hidden />
                Source
              </a>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
