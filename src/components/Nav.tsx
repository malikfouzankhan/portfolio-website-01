"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = ["about", "projects", "skills"] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    onResize();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: isMobile ? "1rem 1.25rem" : "1.25rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "background 0.3s ease, border-bottom 0.3s ease",
          background:
            scrolled || menuOpen ? "rgba(10,10,10,0.97)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
          borderBottom:
            scrolled || menuOpen ? "1px solid #1a1a1a" : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          className="font-display"
          style={{ fontSize: "1.4rem", color: "var(--accent)", letterSpacing: "0.1em", textDecoration: "none" }}
        >
          MFK<span style={{ color: "var(--text-muted)" }}>.</span>
        </a>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className="font-mono"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
              >
                {link}
              </a>
            ))}
            <a
              href="#contact"
              style={{
                background: "var(--accent)",
                color: "#000",
                padding: "0.45rem 1.1rem",
                fontSize: "0.75rem",
                fontFamily: "'DM Mono', monospace",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
                transition: "background 0.2s, transform 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Hire Me
            </a>
          </div>
        )}

        {/* Hamburger Button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "5px",
              width: 32,
              height: 32,
            }}
          >
            {/* Three bars that animate into X */}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: "1.5px",
                  background: "var(--accent)",
                  borderRadius: 2,
                  transition: "transform 0.3s ease, opacity 0.3s ease, width 0.3s ease",
                  transformOrigin: "center",
                  width: i === 1 ? (menuOpen ? "100%" : "65%") : "100%",
                  transform:
                    menuOpen
                      ? i === 0
                        ? "translateY(6.5px) rotate(45deg)"
                        : i === 2
                        ? "translateY(-6.5px) rotate(-45deg)"
                        : "scaleX(0)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile Fullscreen Menu */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            background: "#0A0A0A",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0",
            transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            padding: "6rem 2rem 4rem",
          }}
        >
          {/* Grid background inside menu */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, width: "100%", textAlign: "center" }}>
            {/* Nav links */}
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href={`#${link}`}
                onClick={closeMenu}
                className="font-display"
                style={{
                  display: "block",
                  fontSize: "clamp(3rem, 15vw, 5rem)",
                  color: "var(--text)",
                  textDecoration: "none",
                  lineHeight: 1.1,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0",
                  transition: "color 0.2s",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: menuOpen ? `${0.1 + i * 0.07}s` : "0s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              >
                {link}
              </a>
            ))}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "2rem auto",
                width: "60%",
                opacity: menuOpen ? 1 : 0,
                transition: `opacity 0.3s ease ${menuOpen ? "0.35s" : "0s"}`,
              }}
            />

            {/* Hire Me CTA */}
            <a
              href="#contact"
              onClick={closeMenu}
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "#000",
                padding: "1rem 3rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.3s ease ${menuOpen ? "0.42s" : "0s"}, transform 0.3s ease ${menuOpen ? "0.42s" : "0s"}`,
              }}
            >
              Hire Me
            </a>

            {/* Social links */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "2.5rem",
                opacity: menuOpen ? 1 : 0,
                transition: `opacity 0.3s ease ${menuOpen ? "0.48s" : "0s"}`,
              }}
            >
              {[
                { label: "GitHub", href: "https://github.com/malikfouzankhan" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/malik-fouzan-khan-a76183268/" },
                { label: "Twitter", href: "https://x.com/_malik_fouzan_" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="font-mono"
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}