import type { Contributions } from "@/lib/github";

/* Inline SVG, no library and no client JS — same approach as
   ArchitectureDiagram: coordinates computed here, a viewBox doing the
   responsive work, and colours handed over as CSS custom properties so both
   themes recolour without this file knowing either palette.

   The viewBox is what makes one component serve a ~500px desktop panel and a
   ~350px phone strip: cells land near 7px in the panel and near 13px on the
   phone (which asks for half as many weeks), with no breakpoint here. */

const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
/** Room above the grid for the month row. */
const LABEL_H = 14;
const ROWS = 7;

/* `--color-accent-ink`, not `--color-accent`.

   The palette calls accent a fills-only token that works in both themes, and
   a heatmap cell is a fill, so accent looked like the right choice. On
   parchment it is not: amber is a light warm colour on a light warm ground,
   so the whole ramp compressed into 1.13–1.72:1 against the panel and the
   low end read as blank. Worse, level 1 came out LIGHTER than level 0 —
   `--color-line` is darker than a 22% amber wash — so a day with work looked
   emptier than a day without.

   accent-ink is the token that exists precisely because some accent-coloured
   things have to change per theme. It stays amber in dark (so that ramp is
   unchanged) and becomes burgundy on parchment, which is a dark ink on a
   light ground and separates cleanly.

   Stops are 30/52/75/100 rather than 22/45/70/100: the extra weight at the
   bottom is what pulls level 1 clear of level 0. Measured against the panel,
   both themes now step monotonically with near-identical ratios —
   light 1.26 → 1.79 → 2.94 → 5.16 → 8.74, dark 1.32 → 1.99 → 3.59 → 6.20 →
   10.27 — and the ordering holds on the bare page background too, where the
   phone strip sits.

   Level 0 stays `--color-line` rather than a 0% mix so an empty day still
   reads as a cell rather than a hole. */
const FILLS = [
  "var(--color-line)",
  "color-mix(in srgb, var(--color-accent-ink) 30%, transparent)",
  "color-mix(in srgb, var(--color-accent-ink) 52%, transparent)",
  "color-mix(in srgb, var(--color-accent-ink) 75%, transparent)",
  "var(--color-accent-ink)",
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Parsed as UTC midnight (the "YYYY-MM-DD" form guarantees it), so neither the
   weekday a cell lands on nor the date in its tooltip can shift with the
   server's timezone. */
const utc = (date: string) => new Date(`${date}T00:00:00Z`);

/** Deliberately not `toLocaleDateString` — that would render differently
 *  depending on the locale of whichever machine built the page. */
function longDate(date: string): string {
  const d = utc(date);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export default function ContributionGraph({
  data,
  weeks,
  showTooltips = true,
  className,
}: {
  data: Contributions;
  /** Render only the last N columns. Omit for the full year. */
  weeks?: number;
  /** Off for the phone strip: there is no hover on touch, and the `<title>`
   *  elements are most of the markup's weight. */
  showTooltips?: boolean;
  className?: string;
}) {
  const cols = weeks ? data.weeks.slice(-weeks) : data.weeks;
  if (!cols.length) return null;

  const width = cols.length * PITCH - GAP;
  const height = LABEL_H + ROWS * PITCH - GAP;

  const days = cols.flat();
  // Summed from what is actually drawn, so the label stays honest when the
  // phone strip shows six months of a twelve-month payload.
  const total = days.reduce((n, d) => n + d.count, 0);
  const label = `${total} contribution${total === 1 ? "" : "s"} from ${longDate(days[0].date)} to ${longDate(days[days.length - 1].date)}`;

  /* One label per month, anchored to the column the month starts in. Column 0
     is skipped because it is nearly always a partial week whose label would
     sit half off the left edge, and a label within two columns of the last one
     is dropped rather than overlapping it. */
  const months: { x: number; text: string }[] = [];
  let lastMonth = -1;
  let lastLabelCol = -Infinity;
  cols.forEach((week, i) => {
    const month = utc(week[0].date).getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      if (i > 0 && i - lastLabelCol >= 3) {
        months.push({ x: i * PITCH, text: MONTHS[month] });
        lastLabelCol = i;
      }
    }
  });

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="h-auto w-full"
      >
        {months.map(({ x, text }) => (
          <text
            key={text + x}
            x={x}
            y={9}
            className="font-mono"
            fill="var(--color-text-muted)"
            fontSize={8.5}
            letterSpacing="0.08em"
          >
            {text.toUpperCase()}
          </text>
        ))}

        {cols.map((week, col) =>
          week.map((day) => (
            <rect
              key={day.date}
              x={col * PITCH}
              // Placed by real weekday rather than by array index, so the
              // partial first and last weeks line up with the rest.
              y={LABEL_H + utc(day.date).getUTCDay() * PITCH}
              width={CELL}
              height={CELL}
              rx={2}
              fill={FILLS[day.level]}
            >
              {/* Empty days are skipped: "No contributions on …" is not worth
                  the ~50 bytes it costs, times a third of the grid. */}
              {showTooltips && day.count > 0 && (
                <title>{`${day.count} contribution${day.count === 1 ? "" : "s"} on ${longDate(day.date)}`}</title>
              )}
            </rect>
          )),
        )}
      </svg>

      {/* HTML rather than more SVG: inside the viewBox this would scale with
          the grid and end up either unreadable or oversized. */}
      <div
        aria-hidden
        className="mt-2.5 flex items-center justify-end gap-1.5 font-mono text-[0.55rem] tracking-[0.1em] text-text-muted uppercase"
      >
        Less
        {FILLS.map((fill, i) => (
          <span key={i} className="size-2 rounded-[2px]" style={{ background: fill }} />
        ))}
        More
      </div>
    </div>
  );
}
