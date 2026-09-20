"use client";

import { Check, X } from "lucide-react";
import type { ContactState } from "@/lib/contact-schema";

const NODES = [
  { id: "validate", label: "Validate", sub: "fields" },
  { id: "verify", label: "Verify", sub: "turnstile" },
  { id: "send", label: "Resend", sub: "api" },
  { id: "done", label: "Inbox", sub: "delivered" },
] as const;

type NodeState = "done" | "active" | "failed" | "pending";

/** Maps the action's reported stage onto per-node state. On failure the
 *  reported stage is the node that broke — everything before it succeeded. */
function nodeStates(state: ContactState, pending: boolean): NodeState[] {
  if (pending) return ["active", "pending", "pending", "pending"];

  const idx = NODES.findIndex((n) => n.id === state.stage);
  if (state.status === "success") return NODES.map(() => "done");
  if (state.status === "error" && idx >= 0)
    return NODES.map((_, i) => (i < idx ? "done" : i === idx ? "failed" : "pending"));
  return NODES.map(() => "pending");
}

export default function PipelineDiagram({
  state,
  pending,
}: {
  state: ContactState;
  pending: boolean;
}) {
  const states = nodeStates(state, pending);

  return (
    // Decorative: every stage is also reported as text in the live region.
    <div aria-hidden className="w-full">
      <div className="-mx-1 overflow-x-auto px-1">
        <ol className="flex min-w-[30rem] items-stretch gap-0">
          {NODES.map((node, i) => {
            const s = states[i];
            const tone =
              s === "failed"
                ? "var(--color-status-review)"
                : s === "pending"
                  ? "var(--color-text-muted)"
                  : "var(--color-accent-ink)";

            return (
              <li key={node.id} className="flex flex-1 items-center">
                <div
                  className="flex-1 border px-3 py-2.5 transition-colors duration-500"
                  style={{
                    borderColor: s === "pending" ? "var(--color-line)" : `${tone}66`,
                    background:
                      s === "pending" ? "transparent" : `color-mix(in srgb, ${tone} 7%, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {s === "done" && <Check size={11} style={{ color: tone }} />}
                    {s === "failed" && <X size={11} style={{ color: tone }} />}
                    {s === "active" && (
                      <span
                        className="size-1.5 shrink-0 rounded-full motion-safe:animate-ping"
                        style={{ background: tone }}
                      />
                    )}
                    <span
                      className="font-mono text-[0.62rem] tracking-[0.1em] uppercase transition-colors duration-500"
                      style={{ color: tone }}
                    >
                      {node.label}
                    </span>
                  </div>
                  <span className="mt-0.5 block font-mono text-[0.55rem] tracking-[0.1em] text-text-muted uppercase">
                    {node.sub}
                  </span>
                </div>

                {i < NODES.length - 1 && (
                  <span
                    className="relative h-px w-4 shrink-0 sm:w-6"
                    style={{ background: "var(--color-line)" }}
                  >
                    {/* Packet in flight on the leg currently being traversed */}
                    {states[i] === "done" && states[i + 1] === "active" && (
                      <span
                        className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full motion-safe:animate-[packet_1s_linear_infinite]"
                        style={{ background: "var(--color-accent-ink)" }}
                      />
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        @keyframes packet {
          from { transform: translate(0, -50%); opacity: 0; }
          20%, 80% { opacity: 1; }
          to { transform: translate(1.5rem, -50%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
