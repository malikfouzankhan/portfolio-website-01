import { Lock, Clock, Radio, Archive } from "lucide-react";
import type { ProjectStatus } from "@/data/projects";

/* Tones are tokens, so both themes re-colour in one place. `private` and
   `archived` share a neutral: both mean "not active", and a separate dimmer
   grey fell below 4.5:1 on the burgundy ground. */
const CONFIG: Record<
  ProjectStatus,
  { icon: typeof Lock; label: string; tone: string }
> = {
  live: { icon: Radio, label: "Live", tone: "var(--color-status-live)" },
  private: { icon: Lock, label: "Private", tone: "var(--color-status-neutral)" },
  "in-review": { icon: Clock, label: "In review", tone: "var(--color-status-review)" },
  archived: { icon: Archive, label: "Archived", tone: "var(--color-status-neutral)" },
};

export default function StatusChip({
  status,
  note,
}: {
  status: ProjectStatus;
  note?: string;
}) {
  const { icon: Icon, label, tone } = CONFIG[status];

  /* `shrink-0` and `whitespace-nowrap` so the chip can never be the thing that
     breaks a layout: it keeps its size and forces the container to deal with
     it, rather than collapsing into two ragged lines. */
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.1em] whitespace-nowrap uppercase"
      style={{
        color: tone,
        borderColor: `color-mix(in srgb, ${tone} 30%, transparent)`,
        background: `color-mix(in srgb, ${tone} 8%, transparent)`,
      }}
    >
      <Icon size={11} strokeWidth={2} aria-hidden />
      {/* The long form of `note` ("Private — client system") is ~215px wide,
          which is most of a phone's usable row. Swap in the one-word label
          below md and let the note return when there is room. Done in CSS
          rather than JS so the server renders one tree. */}
      {note ? (
        <>
          <span className="md:hidden">{label}</span>
          <span className="hidden md:inline">{note}</span>
        </>
      ) : (
        label
      )}
    </span>
  );
}
