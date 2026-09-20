"use client";

import { useEffect, useState } from "react";
import { ANCHOR_SCROLL, type AnchorScrollDetail } from "@/lib/anchor-scroll";
import { profile } from "@/data/profile";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#work", label: "work" },
  { href: "#stack", label: "stack" },
] as const;

/** Taking hold of the page mid-flight cancels the smooth scroll, so the
 *  destination we pinned is no longer where the visitor is heading. */
const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Which section is being read. An observer rather than a scroll handler:
     the browser does the geometry off the main thread and only calls back
     when a boundary is actually crossed, where a scroll listener would
     measure every section on every frame.

     The rootMargin collapses the viewport to a band a third of the way down
     — a "reading line" — so a section counts as current when it passes under
     that line, not when it merely appears at the bottom edge. Nothing is
     highlighted over the hero or the footer, which is correct: neither is a
     nav destination.

     Jumping between distant sections is the hard part. A smooth scroll from
     #about to #contact really does travel through experience, work and
     stack, so the observer reports each of them — correctly, and uselessly —
     and the highlight strobes down the nav before landing. The fix is to
     stop publishing while a scroll we started is in flight: pin the
     destination, keep recording what crosses the band, and publish again
     once the page stops moving.

     Progressive enhancement, like everything else here: without JS the links
     still work, they just do not light up. */
  useEffect(() => {
    const ids = new Set(LINKS.map(({ href }) => href.slice(1)));
    const sections = LINKS.map(({ href }) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)
      // Sorted by where they actually are, not by the order LINKS happens to
      // list them — the "last one wins" rule below is only correct against
      // true document order, and nothing stops the two from diverging.
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
    if (!sections.length) return;

    const onScreen = new Set<string>();
    let locked = false;

    // Document order, last wins: while two sections straddle the band the
    // lower one is the one being scrolled into.
    const publish = () =>
      setActive(sections.filter((s) => onScreen.has(s.id)).at(-1)?.id ?? null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id);
          else onScreen.delete(entry.target.id);
        }
        // `onScreen` is kept current either way — only publishing pauses, so
        // releasing the lock resolves to the truth with no extra callback.
        if (!locked) publish();
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    let raf = 0;
    let guard = 0;

    const release = () => {
      if (!locked) return;
      locked = false;
      cancelAnimationFrame(raf);
      clearTimeout(guard);
      window.removeEventListener("scrollend", release);
      for (const ev of INTERRUPTS) window.removeEventListener(ev, release);
      publish();
    };

    const onAnchorScroll = (e: Event) => {
      const id = (e as CustomEvent<AnchorScrollDetail>).detail?.id;
      if (!id) return;

      locked = true;
      // #top and #contact are real destinations but not nav items, so the
      // honest pinned state for them is "nothing highlighted".
      setActive(ids.has(id) ? id : null);

      /* Released by whichever comes first:
         - `scrollend`, the exact signal, where the browser has it;
         - the page going still, polled per frame, where it does not;
         - the visitor grabbing the page mid-flight, which makes the
           destination no longer where they are going;
         - a 2s backstop, so a missed signal can never strand the highlight. */
      cancelAnimationFrame(raf);
      clearTimeout(guard);
      guard = window.setTimeout(release, 2000);
      for (const ev of INTERRUPTS) {
        window.addEventListener(ev, release, { passive: true, once: true });
      }

      if ("onscrollend" in window) {
        window.addEventListener("scrollend", release, { once: true });
      } else {
        const started = performance.now();
        let last = NaN;
        let still = 0;
        const settle = () => {
          const y = window.scrollY;
          still = y === last ? still + 1 : 0;
          last = y;
          // The elapsed floor matters: without it three frames before the
          // scroll has visibly begun would read as "already arrived".
          if (still >= 3 && performance.now() - started > 120) release();
          else raf = requestAnimationFrame(settle);
        };
        raf = requestAnimationFrame(settle);
      }
    };

    window.addEventListener(ANCHOR_SCROLL, onAnchorScroll);

    return () => {
      io.disconnect();
      window.removeEventListener(ANCHOR_SCROLL, onAnchorScroll);
      window.removeEventListener("scrollend", release);
      for (const ev of INTERRUPTS) window.removeEventListener(ev, release);
      cancelAnimationFrame(raf);
      clearTimeout(guard);
    };
  }, []);

  // Close the menu if the viewport grows past the breakpoint while it's open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Releasing the scroll lock here as well as in the effect above is not
     redundant. A section link inside the menu is scrolled by AnchorScroll's
     delegated listener, which runs in the same tick as this handler — while
     the effect that clears `overflow` does not run until after the next
     paint. The viewport inherits `overflow: hidden` from <body>, so without
     this the scroll would be clamped to nowhere and the menu would close
     onto an unmoved page. */
  const closeMenu = () => {
    document.body.style.overflow = "";
    setMenuOpen(false);
  };

  const solid = scrolled || menuOpen;

  return (
    <>
      {/* Two layers: the fixed shell animates its own padding, which is what
          squeezes the bar down to the content width and detaches it from the
          top edge. The inner element is the bar itself and animates into a
          pill. Padding is used rather than max-width because two lengths
          interpolate smoothly, whereas 100% -> 84rem would jump. */}
      <nav
        className="fixed inset-x-0 top-0 z-200 transition-[padding] duration-(--nav-morph) ease-(--ease-nav)"
        style={{
          paddingTop: solid ? "0.75rem" : "0px",
          paddingInline: solid
            ? "max(0.75rem, calc((100vw - var(--container-page)) / 2))"
            : "0px",
        }}
      >
        <div
          className={`relative flex items-center justify-between overflow-hidden border transition-[background-color,border-color,border-radius,padding,box-shadow,backdrop-filter,-webkit-backdrop-filter] duration-(--nav-morph) ease-(--ease-nav) ${
            solid
              ? "rounded-[2rem] border-line-soft bg-bg/45 px-5 py-2.5 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150 md:px-6 md:py-3"
              : "rounded-[0rem] border-transparent bg-bg/15 px-5 py-4 backdrop-blur-lg backdrop-saturate-150 md:px-10 md:py-5"
          }`}
        >
        <a
          href="#top"
          // The preloader measures this element as the destination its own
          // centred mark flies to, so it needs a stable hook — a class the
          // styling might later change is not one.
          data-nav-logo
          className="font-display text-[1.4rem] tracking-[0.1em] text-accent-ink"
          aria-label={`${profile.name} — back to top`}
        >
          {profile.initials}
          <span className="text-text-muted">.</span>
        </a>

        {/* One right-hand group. A SINGLE ThemeToggle serves both layouts —
            two instances would fight over the `view-transition-name` that
            makes the icon morph visible, and could drift out of sync. */}
        <div className="flex items-center gap-4 md:gap-8">
          <ThemeToggle />

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map(({ href, label }) => {
              const current = active === href.slice(1);
              return (
                <a
                  key={href}
                  href={href}
                  // "location" rather than "page": this marks a position
                  // within the current document, not a different one.
                  aria-current={current ? "location" : undefined}
                  // -bottom-1, not -1.5: the bar around this is
                  // `overflow-hidden` (it has to be, for the scroll-progress
                  // hairline), and in the collapsed pill state there is only
                  // ~8px between this link's box and the bar's edge.
                  className={`relative font-mono text-[0.75rem] tracking-[0.12em] uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent-ink after:transition-transform after:duration-300 after:ease-out-expo hover:text-accent-ink focus-visible:text-accent-ink ${
                    current
                      ? "text-accent-ink after:scale-x-100"
                      : "text-text-dim after:scale-x-0"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Corners driven by the same `solid` flag as the bar around it, at
              the same duration and curve, so the two radii open together
              rather than one chasing the other.

              The radius is inline rather than a Tailwind pair because it needs
              a different duration from the hover: 600ms is right for a shape
              settling, and badly wrong for a button reacting to a pointer.
              One `transition` shorthand can carry both — the class-based
              `transition-[…]` utility cannot, since it sets a single duration
              for every property it lists.

              2rem matches the bar. Both are larger than half their element's
              height, so both clamp to a true pill and stay visually in step
              despite the button being the shorter of the two. Note the old
              class list transitioned `background-color`, which never changes,
              and not `filter`, which is what `brightness` moves — so the
              hover was snapping rather than easing. */}
          <a
            href="#contact"
            style={{
              borderRadius: solid ? "2rem" : "0rem",
              transition:
                "border-radius var(--nav-morph) var(--ease-nav), transform 150ms ease, filter 150ms ease",
            }}
            className="hidden bg-accent px-4 py-2 font-mono text-[0.75rem] font-medium tracking-[0.1em] text-black uppercase hover:-translate-y-px hover:brightness-110 focus-visible:-translate-y-px focus-visible:brightness-110 md:inline-block"
          >
            Hire me
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex size-8 cursor-pointer flex-col justify-center gap-[5px] border-none bg-transparent p-1 md:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="block h-[1.5px] rounded-sm bg-accent-ink transition-[transform,opacity,width] duration-300"
                style={{
                  width: i === 1 ? (menuOpen ? "100%" : "65%") : "100%",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                  transform: menuOpen
                    ? i === 0
                      ? "translateY(6.5px) rotate(45deg)"
                      : i === 2
                        ? "translateY(-6.5px) rotate(-45deg)"
                        : "scaleX(0)"
                    : undefined,
                }}
              />
            ))}
          </button>
        </div>

        {/* Scroll progress — pure CSS where supported, absent elsewhere. */}
        <span
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-0 h-px scale-x-0 bg-accent-ink"
          />
        </div>
      </nav>

      {/* Mobile menu. Always in the DOM (so it's in the SSR HTML) but `inert`
          while closed, which removes it from the tab order and a11y tree. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-150 flex flex-col items-center justify-center bg-bg px-8 pt-24 pb-16 transition-transform duration-400 ease-[var(--ease-out-expo)] md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [background-size:40px_40px]"
        />

        <div className="relative z-1 w-full text-center">
          {LINKS.map(({ href, label }, i) => {
            const current = active === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={current ? "location" : undefined}
                // No underline here — at clamp(2.4rem, 12vw, 4rem) the colour
                // shift is already unmissable, and a rule under a 4rem word
                // would read as a divider.
                className={`block py-1 font-display text-[clamp(2.4rem,12vw,4rem)] leading-tight tracking-[0.04em] uppercase transition-[color,opacity,transform] hover:text-accent-ink focus-visible:text-accent-ink ${
                  current ? "text-accent-ink" : "text-text"
                }`}
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: menuOpen ? `${0.1 + i * 0.07}s` : "0s",
                }}
              >
                {label}
              </a>
            );
          })}

          <div
            aria-hidden
            className="mx-auto my-8 h-px w-3/5 bg-line transition-opacity duration-300"
            style={{
              opacity: menuOpen ? 1 : 0,
              transitionDelay: menuOpen ? "0.38s" : "0s",
            }}
          />

          <a
            href="#contact"
            onClick={closeMenu}
            className="inline-block bg-accent px-12 py-4 font-mono text-[0.8rem] font-medium tracking-[0.12em] text-black uppercase transition-[opacity,transform] duration-300"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              transitionDelay: menuOpen ? "0.45s" : "0s",
            }}
          >
            Hire me
          </a>

          <div
            className="mt-10 flex justify-center gap-6 transition-opacity duration-300"
            style={{
              opacity: menuOpen ? 1 : 0,
              transitionDelay: menuOpen ? "0.5s" : "0s",
            }}
          >
            {profile.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="font-mono text-[0.65rem] tracking-[0.12em] text-text-muted uppercase transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
