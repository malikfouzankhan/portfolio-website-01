"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#work", label: "work" },
  { href: "#stack", label: "stack" },
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            {LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[0.75rem] tracking-[0.12em] text-text-dim uppercase transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden bg-accent px-4 py-2 font-mono text-[0.75rem] font-medium tracking-[0.1em] text-black uppercase transition-[background-color,transform] hover:-translate-y-px hover:brightness-110 focus-visible:-translate-y-px focus-visible:brightness-110 md:inline-block"
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
          {LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-1 font-display text-[clamp(2.4rem,12vw,4rem)] leading-tight tracking-[0.04em] text-text uppercase transition-[color,opacity,transform] hover:text-accent-ink focus-visible:text-accent-ink"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transitionDelay: menuOpen ? `${0.1 + i * 0.07}s` : "0s",
              }}
            >
              {label}
            </a>
          ))}

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
            onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
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
