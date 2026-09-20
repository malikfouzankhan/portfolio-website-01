"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

/** Fall back if the custom properties can't be read (SSR, odd browsers). */
const SWEEP_FALLBACK_MS = 700;
const EASE_FALLBACK = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function sweepDuration() {
  const raw = cssVar("--theme-sweep");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? (raw.endsWith("ms") ? n : n * 1000) : SWEEP_FALLBACK_MS;
}

export default function ThemeToggle() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  // Observed rather than read once, so the icon can't go stale if the
  // attribute changes from anywhere else.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "light" ? "light" : "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode / blocked storage — applies for this page view only.
    }
  }, []);

  const toggle = useCallback(async () => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      setTheme(next);
      apply(next);
      return;
    }

    // Everything the animation needs is measured up front. Reading layout or
    // computed style between `vt.ready` and `animate()` forces a recalc in
    // exactly the frame the sweep has to start on, which shows up as a hitch
    // on the first frame.
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const duration = sweepDuration();
    const easing = cssVar("--ease-sweep") || EASE_FALLBACK;

    const root = document.documentElement;
    root.setAttribute("data-theme-switching", "");

    const vt = document.startViewTransition(() => {
      // Both DOM changes must land inside the callback, synchronously, or
      // React's re-render happens after the "old" snapshot is captured and
      // the outgoing frame already shows the new icon.
      flushSync(() => setTheme(next));
      apply(next);
    });

    try {
      await vt.ready;
      await root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          // Eased on purpose — see --ease-sweep. A linear radius is *not* a
          // constant-looking sweep, because the area inside the circle grows
          // with its square.
          easing,
          pseudoElement: "::view-transition-new(root)",
        },
      ).finished;
    } catch {
      // Transitions can be skipped (another starts, tab hidden). The theme is
      // already applied, so there is nothing to recover.
    } finally {
      root.removeAttribute("data-theme-switching");
    }
  }, [theme, apply]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="-m-1.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent p-1.5 text-text-dim transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
    >
      {/* `theme-icon` carries a view-transition-name, which lifts this out of
          the root snapshot and gives it its own old/new pair. That is what
          makes the morph visible: during a view transition the live DOM is
          replaced by a static snapshot, so a plain CSS transition on the icon
          would run underneath it, unseen. */}
      <span aria-hidden className="theme-icon grid place-items-center">
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
