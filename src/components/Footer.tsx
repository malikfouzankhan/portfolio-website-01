"use client";

import { useRef, useEffect, useState } from "react";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      id="contact"
      style={{
        position: "relative",
        padding: isMobile ? "5rem 1.25rem 3rem" : "8rem 2.5rem 4rem",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Big ghost text */}
      <div
        className="font-display"
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "-1rem",
          fontSize: "clamp(3rem, 14vw, 14rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px #1a1a1a",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        LET'S GO
      </div>

      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.2em", display: "block", marginBottom: "1rem" }}
        >
          GET IN TOUCH
        </span>

        <h2
          className="font-display"
          style={{
            fontSize: isMobile ? "clamp(2rem, 10vw, 3rem)" : "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 1,
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          HAVE A <span style={{ color: "var(--accent)" }}>PROJECT</span>
          <br />
          IN MIND?
        </h2>

        <p
          style={{
            fontSize: isMobile ? "0.875rem" : "0.95rem",
            color: "var(--text-dim)",
            lineHeight: 1.75,
            fontWeight: 300,
            marginBottom: "2.5rem",
            maxWidth: 480,
          }}
        >
          I'm always open to discussing new opportunities, freelance work, or interesting
          collaborations. Drop me a message and let's build something great together.
        </p>

        <a
          href="mailto:malikfouzan05@gmail.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "var(--accent)",
            color: "#000",
            padding: isMobile ? "0.85rem 1.75rem" : "1rem 2.5rem",
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            fontSize: isMobile ? "0.72rem" : "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "transform 0.2s, background 0.2s",
            wordBreak: "break-all",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.background = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "var(--accent)";
          }}
        >
          <span>↗</span>
          Mail me
        </a>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: isMobile ? "4rem" : "6rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "flex-start" : "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? "1.25rem" : "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: "1.2rem", color: "var(--accent)", letterSpacing: "0.1em" }}
        >
          MFK.
        </span>

        <span
          className="font-mono"
          style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}
        >
          © {new Date().getFullYear()} Malik Fouzan Khan — BUILT WITH NEXT.JS
        </span>

        <div style={{ display: "flex", gap: "1.5rem" }}>
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
              className="font-mono"
              style={{
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                letterSpacing: "0.1em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}