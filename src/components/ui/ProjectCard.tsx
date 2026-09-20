import { ArrowUpRight } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { Project } from "@/data/projects";
import StatusChip from "@/components/ui/StatusChip";
import Reveal from "@/components/ui/Reveal";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const hasLinks = Boolean(project.live || project.github);

  return (
    <Reveal
      as="article"
      index={index}
      className="group relative flex flex-col gap-4 border border-line bg-surface p-6 transition-colors hover:bg-surface-hi md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-5 right-6 font-display text-5xl leading-none text-accent-ink/25 select-none"
      >
        {project.number}
      </span>

      <div>
        <p className="font-mono text-[0.62rem] tracking-[0.15em] text-text-muted uppercase">
          {project.role}
          {project.teamSize && ` · ${project.teamSize}`}
          {project.org && ` · ${project.org}`}
          {project.period && ` · ${project.period}`}
        </p>
        <h3 className="mt-1.5 font-display text-[1.7rem] tracking-[0.02em] text-text">
          {project.title}
        </h3>
      </div>

      <p className="text-[0.88rem] leading-[1.7] font-light text-text-dim">
        {project.description}
      </p>

      {project.outcome && (
        <p className="border-l-2 border-accent-ink/40 pl-3 text-[0.82rem] leading-relaxed font-light text-text-muted">
          {project.outcome}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="border border-accent-ink/25 bg-accent-ink/6 px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.08em] text-accent-ink"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
        {hasLinks ? (
          <>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.1em] text-accent-ink uppercase transition-opacity hover:opacity-70 focus-visible:opacity-70"
              >
                <ArrowUpRight size={12} aria-hidden />
                Live
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.1em] text-text-muted uppercase transition-colors hover:text-text focus-visible:text-text"
              >
                <Github size={12} aria-hidden />
                Source
              </a>
            )}
          </>
        ) : (
          <StatusChip status={project.status} note={project.statusNote} />
        )}
      </div>
    </Reveal>
  );
}
