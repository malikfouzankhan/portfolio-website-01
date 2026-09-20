"use client";

import { useEffect } from "react";
import { profile } from "@/data/profile";

/* Whether this visit preloads at all is decided by a pre-paint script in
   layout.tsx, not here — it has to be settled before the first frame, and it
   depends on sessionStorage, which the server cannot see. This component only
   runs the sequence when that script left `data-preloading="hold"` behind.

   The shape of the thing: the mark fades in centred, then flies to the real
   nav logo while the ground fades out from under it, so the hero is already
   revealed by the time the mark lands. */

/** Only the display face is worth waiting for — the mark is the one thing on
    screen. `document.fonts.ready` waits on all nine loaded faces and measured
    ~950ms in production, which is 950ms of empty cover. Capped regardless: a
    slow font must never strand anyone behind an opaque veil. */
/* The four knobs worth touching. Warm-load total is roughly
   FLOOR_MS + FLIGHT_MS — currently ~3.2s. */
const FONT_CAP_MS = 700;
const FADE_MS = 520;
/** Time the mark sits fully opaque before it moves. Without this the flight
    begins the instant the fade ends and the mark is never actually *seen* —
    the floor below can't do this job, because on a slow load it is already
    spent by the time the fade finishes. */
const DWELL_MS = 900;
/** Floor for the whole cover, measured from NAVIGATION START — not from when
    this effect happens to run. Adding a fixed hold on top of hydration would
    punish slow devices twice, when they have already done their waiting. */
const FLOOR_MS = 2000;
const VEIL_MS = 700;
const VEIL_DELAY_MS = 200;
const FLIGHT_MS = 1250;

/* Fallbacks only; the real values are read from the stylesheet.
   The flight uses --ease-nav (a symmetric ease-in-out) rather than
   --ease-out-expo. Expo front-loads hard: over a long flight it would cover
   most of the distance almost immediately and then crawl, which reads as
   *faster*, not slower, however long the duration. An ease-in-out spends its
   time in the middle of the journey, which is what actually looks unhurried.
   The fades use the theme sweep's curve — expo on an opacity ramp hits ~90%
   in the first quarter and reads as a cut. */
const EASE_FLIGHT = "cubic-bezier(0.4, 0, 0.2, 1)";
const EASE_FADE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

declare global {
  interface Window {
    __mfkPreloadGuard?: ReturnType<typeof setTimeout>;
  }
}

/* Module scope, deliberately. React StrictMode remounts the tree in dev, and
   a second mount would otherwise start a second sequence against freshly
   created DOM nodes while the first animates detached ones. */
let ran = false;

export default function Preloader() {
  useEffect(() => {
    const root = document.documentElement;
    // Any other value (or none) means this visit isn't preloading.
    if (ran || root.dataset.preloading !== "hold") return;
    ran = true;

    // The pre-paint script armed a watchdog against this bundle never
    // executing. It did execute, so take ownership of clearing the cover.
    clearTimeout(window.__mfkPreloadGuard);

    const clear = () => root.removeAttribute("data-preloading");

    // Queried rather than held in refs, so a remount cannot leave this
    // sequence animating nodes that are no longer in the document.
    const mark = document.querySelector<HTMLElement>(".preloader-mark");
    const veil = document.querySelector<HTMLElement>(".preloader-veil");

    // Defensive: the pre-paint script already excludes reduced motion, but
    // WAAPI durations are JS values and would ignore the stylesheet's
    // reduced-motion clamp, so a stale attribute must not animate anything.
    if (!mark || !veil || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clear();
      return;
    }

    (async () => {
      try {
        const css = getComputedStyle(root);
        const easeFlight = css.getPropertyValue("--ease-nav").trim() || EASE_FLIGHT;
        const easeFade = css.getPropertyValue("--ease-sweep").trim() || EASE_FADE;

        // Guarded: losing the font gate is survivable, but an unhandled
        // rejection here would drop straight through to `finally` and blink
        // the cover away. (`document.fonts.load()` with next/font's computed
        // family list rejects outright — measured — so this uses `ready`.)
        const fontReady = (async () => {
          try {
            await document.fonts?.ready;
          } catch {
            /* fall through to the cap */
          }
        })();
        await Promise.race([fontReady, wait(FONT_CAP_MS)]);

        await mark
          .animate({ opacity: [0, 1] }, { duration: FADE_MS, easing: easeFade, fill: "forwards" })
          .finished.catch(() => {});

        // performance.now() is already ms since navigation start, so the
        // floor shortens itself on slow loads instead of stacking onto them.
        await wait(Math.max(DWELL_MS, FLOOR_MS - performance.now()));

        const target = document.querySelector<HTMLElement>("[data-nav-logo]");

        // Everything measured up front. Reading layout or computed style
        // between the measurement and `animate()` forces a recalc in the frame
        // the flight has to start on — the same hitch ThemeToggle avoids.
        const from = mark.getBoundingClientRect();
        const to = target?.getBoundingClientRect();

        // Releasing the hero here rather than at the end is the whole point:
        // its wordmark rises in while the ground clears, so the two read as
        // one gesture instead of two stacked ones.
        root.dataset.preloading = "exit";

        const veilFade = veil.animate(
          { opacity: [1, 0] },
          { duration: VEIL_MS, delay: VEIL_DELAY_MS, easing: easeFade, fill: "forwards" },
        );

        if (!to) {
          // No destination on this route. Shouldn't happen — the pre-paint
          // script only arms on "/" — so just uncover rather than hard-cut.
          await veilFade.finished.catch(() => {});
          return;
        }

        // Transform only, so it stays on the compositor. `top left` origin is
        // what makes the corner deltas exact — any other origin would need a
        // scale-correction term on the translate.
        const flight = mark.animate(
          {
            transform: [
              "none",
              `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`,
            ],
          },
          { duration: FLIGHT_MS, easing: easeFlight, fill: "forwards" },
        );

        // A resize mid-flight invalidates the measurement; snapping to the end
        // state is cheaper and steadier than re-deriving it.
        const onResize = () => flight.finish();
        window.addEventListener("resize", onResize, { once: true });
        await flight.finished.catch(() => {});
        window.removeEventListener("resize", onResize);
      } finally {
        // One attribute change, one style recalc: the overlay goes
        // `display: none` and the real logo drops its `visibility: hidden` in
        // the same frame, so the handoff has no gap to flicker through.
        clear();
      }
    })();

    // Deliberately no cleanup that clears the attribute: `finally` is the
    // single owner, and clearing here would cancel the sequence on StrictMode's
    // first unmount, so the preloader would never play in dev.
  }, []);

  return (
    <div id="preloader" aria-hidden="true">
      <div className="preloader-veil">
        {/* Reuses the hero's own `bg-grid` utility at the same 60px pitch and
            the same viewport origin, so when the veil clears the graticule
            appears to persist rather than swap. */}
        <div className="bg-grid preloader-grid" />
      </div>
      {/* Same glyphs, tracking and line-height as the nav mark, so the
          measured width ratio is an exact similarity transform and the
          landing is pixel-for-pixel. */}
      <span className="preloader-mark">
        {profile.initials}
        <span className="text-text-muted">.</span>
      </span>
    </div>
  );
}
