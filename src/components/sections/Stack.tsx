import { Database, Layout, Plug, Server, Ship } from "lucide-react";
import { stack } from "@/data/stack";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const ICONS = {
  server: Server,
  database: Database,
  plug: Plug,
  layout: Layout,
  ship: Ship,
} as const;

export default function Stack() {
  return (
    <section
      id="stack"
      className="relative border-t border-line bg-section px-5 py-20 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-(--container-page)">
        <SectionHeader eyebrow="CAPABILITIES" title="THE" titleOutline="STACK." />

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {stack.map((group, i) => {
            const Icon = ICONS[group.icon];
            return (
              <Reveal
                key={group.label}
                index={i}
                className="relative border border-line bg-surface p-6 md:p-7"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.75 bg-accent-ink"
                />

                <div className="mb-1.5 flex items-center gap-2.5">
                  <Icon size={16} aria-hidden className="text-accent-ink" />
                  <h3 className="font-display text-lg tracking-[0.08em] text-text">
                    {group.label}
                  </h3>
                </div>

                <p className="mb-5 font-mono text-[0.65rem] leading-relaxed text-text-muted">
                  {group.note}
                </p>

                {/* Each chip carries its group's colour as --g, so the tint and
                    glow are pure CSS — no per-item JS handlers.

                    Deliberately hover-only and NOT focusable: these chips do
                    nothing when activated, so making all 32 tab stops would
                    clutter the keyboard path for zero functional gain. The
                    hover/focus-visible pairing rule applies to controls. */}
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="cursor-default border border-line-soft bg-chip px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.05em] text-text-dim transition-[color,border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-accent-ink/45 hover:bg-accent-ink/10 hover:text-accent-ink hover:shadow-[0_0_14px_-2px_var(--color-accent-ink)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
