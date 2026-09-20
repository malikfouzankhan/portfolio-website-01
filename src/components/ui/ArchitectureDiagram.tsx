import type { Architecture } from "@/data/projects";

const NODE_W = 152;
const NODE_H = 56;
const COL_GAP = 68;
const ROW_GAP = 34;
const PAD_X = 8;
const PAD_Y = 30;

/** Lay nodes out on a column/row grid and centre each column vertically. */
function layout(arch: Architecture) {
  const cols = Math.max(...arch.nodes.map((n) => n.col)) + 1;
  const rowsPerCol = Array.from({ length: cols }, (_, c) =>
    arch.nodes.filter((n) => n.col === c).length,
  );
  const maxRows = Math.max(...rowsPerCol);

  const bodyH = maxRows * NODE_H + (maxRows - 1) * ROW_GAP;
  const midY = PAD_Y + bodyH / 2;

  const pos = new Map<string, { x: number; y: number }>();
  for (const node of arch.nodes) {
    const rows = rowsPerCol[node.col];
    const colH = rows * NODE_H + (rows - 1) * ROW_GAP;
    const top = midY - colH / 2;
    const row = node.row ?? 0;
    pos.set(node.id, {
      x: PAD_X + node.col * (NODE_W + COL_GAP),
      y: top + row * (NODE_H + ROW_GAP),
    });
  }

  return {
    pos,
    width: PAD_X * 2 + cols * NODE_W + (cols - 1) * COL_GAP,
    height: PAD_Y * 2 + bodyH,
  };
}

export default function ArchitectureDiagram({
  arch,
  idPrefix,
}: {
  arch: Architecture;
  idPrefix: string;
}) {
  // Single brand accent now — the per-project colours were removed with the
  // rebrand, so every diagram reads in the same visual language.
  const accent = "var(--color-accent-ink)";
  const { pos, width, height } = layout(arch);

  const edges = arch.edges.map((edge, i) => {
    const a = pos.get(edge.from);
    const b = pos.get(edge.to);
    if (!a || !b) return null;

    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const d = `M ${x1} ${y1} C ${x1 + COL_GAP * 0.6} ${y1}, ${x2 - COL_GAP * 0.6} ${y2}, ${x2} ${y2}`;

    return { ...edge, d, i, midX: (x1 + x2) / 2, midY: (y1 + y2) / 2 };
  });

  return (
    <figure className="mt-8">
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={arch.caption}
          className="h-auto w-full min-w-[640px] max-w-full"
        >
          {/* Edges */}
          <g>
            {edges.map(
              (e) =>
                e && (
                  <g key={`${e.from}-${e.to}`}>
                    <path
                      d={e.d}
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    {/* Packet travelling the path. CSS-driven, so the global
                        reduced-motion rule stops it. */}
                    <circle
                      r={3}
                      fill={accent}
                      className={`arch-packet arch-packet-${idPrefix}`}
                      style={{
                        offsetPath: `path("${e.d}")`,
                        animationDelay: `${e.i * 0.45}s`,
                      }}
                    />
                    {e.label && (
                      <text
                        x={e.midX}
                        y={e.midY - 8}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={8.5}
                        fill="var(--color-text-muted)"
                        letterSpacing="0.08em"
                      >
                        {e.label.toUpperCase()}
                      </text>
                    )}
                  </g>
                ),
            )}
          </g>

          {/* Nodes */}
          <g>
            {arch.nodes.map((node) => {
              const p = pos.get(node.id)!;
              return (
                <g key={node.id} transform={`translate(${p.x} ${p.y})`}>
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    fill="var(--color-surface)"
                    stroke="color-mix(in srgb, var(--color-accent-ink) 35%, transparent)"
                    strokeWidth={1}
                  />
                  <rect width={2} height={NODE_H} fill={accent} />
                  <text
                    x={14}
                    y={node.sub ? 24 : 32}
                    className="font-mono"
                    fontSize={10.5}
                    fill="var(--color-text)"
                    letterSpacing="0.04em"
                  >
                    {node.label}
                  </text>
                  {node.sub && (
                    <text
                      x={14}
                      y={38}
                      className="font-mono"
                      fontSize={8.5}
                      fill="var(--color-text-muted)"
                      letterSpacing="0.06em"
                    >
                      {node.sub}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 font-mono text-[0.65rem] tracking-[0.12em] text-text-muted uppercase">
        {arch.caption}
      </figcaption>
      {/* Scoped here rather than globals so the keyframe lives with the only
          component that uses it. */}
      <style>{`
        @keyframes arch-travel-${idPrefix} {
          0%   { offset-distance: 0%;   opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .arch-packet-${idPrefix} {
          animation: arch-travel-${idPrefix} 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
      `}</style>
    </figure>
  );
}
