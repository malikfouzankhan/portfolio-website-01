"use client";

import { useEffect, useState } from "react";

const roles = ["Full Stack Developer", "React Craftsman", "API Architect", "Problem Solver"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const target = roles[roleIndex];
    let i = displayed.length;
    if (typing) {
      if (i < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i - 1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIndex]);

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "0 1.25rem" : "0 2.5rem",
        paddingTop: isMobile ? "6rem" : "7rem",
        paddingBottom: isMobile ? "4rem" : "7rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Accent blob */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: isMobile ? "-30%" : "-10%",
          width: isMobile ? "280px" : "500px",
          height: isMobile ? "280px" : "500px",
          background: "radial-gradient(circle, rgba(232,255,71,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />

      {/* Status badge */}
      <div
        className="animate-fade-in font-mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          opacity: 0,
          animationDelay: "0.1s",
          animationFillMode: "forwards",
        }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#4ade80", boxShadow: "0 0 8px #4ade80",
            display: "inline-block", flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>
          AVAILABLE FOR WORK
        </span>
      </div>

      {/* Main heading */}
      <div
        className="animate-fade-up"
        style={{ opacity: 0, animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3.8rem, 14vw, 11rem)",
            lineHeight: 0.9,
            marginBottom: "1rem",
            color: "var(--text)",
          }}
        >
          Malik
          <br />
          <span style={{ color: "var(--accent)" }}>Fouzan</span>
          <span style={{ color: "var(--text-muted)" }}>.</span>
        </h1>
      </div>

      {/* Typing role */}
      <div
        className="animate-fade-up font-mono"
        style={{
          opacity: 0,
          animationDelay: "0.4s",
          animationFillMode: "forwards",
          fontSize: isMobile ? "0.9rem" : "clamp(1rem, 2.5vw, 1.4rem)",
          color: "var(--accent)",
          marginBottom: "1.5rem",
          minHeight: "1.6rem",
          letterSpacing: "0.05em",
        }}
      >
        &gt; {displayed}
        <span className="cursor-blink" style={{ marginLeft: 2 }}>|</span>
      </div>

      {/* Bio */}
      <div
        className="animate-fade-up"
        style={{
          opacity: 0,
          animationDelay: "0.6s",
          animationFillMode: "forwards",
          maxWidth: "520px",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontSize: isMobile ? "0.9rem" : "1.05rem", color: "var(--text-dim)", lineHeight: 1.75, fontWeight: 300 }}>
          I build fast, scalable web applications from pixel-perfect frontends to robust backend
          systems. Passionate about clean code, great UX, and shipping things that matter.
        </p>
      </div>

      {/* CTAs */}
      <div
        className="animate-fade-up"
        style={{
          opacity: 0,
          animationDelay: "0.8s",
          animationFillMode: "forwards",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "0.75rem",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: "2.5rem",
        }}
      >
        <a
          href="#projects"
          style={{
            background: "var(--accent)",
            color: "#000",
            padding: "0.85rem 2rem",
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "transform 0.2s, background 0.2s",
            display: "inline-block",
            textAlign: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          View My Work
        </a>
        <a
          href="#contact"
          style={{
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
            padding: "0.85rem 2rem",
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "border-color 0.2s, color 0.2s, transform 0.2s",
            display: "inline-block",
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-dim)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get In Touch
        </a>

        {/* Socials — row always */}
        <div style={{ display: "flex", gap: "0.75rem", marginLeft: isMobile ? 0 : "0.5rem" }}>
          {[
            { label: "GH", href: "https://github.com/malikfouzankhan" },
            { label: "LI", href: "https://www.linkedin.com/in/malik-fouzan-khan-a76183268/" },
            { label: "TW", href: "https://x.com/_malik_fouzan_" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-mono"
              style={{
                width: 42, height: 42,
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", color: "var(--text-muted)",
                textDecoration: "none", letterSpacing: "0.05em",
                transition: "border-color 0.2s, color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Stats — inline on mobile, absolute on desktop */}
      <div
        className="animate-fade-up"
        style={{
          opacity: 0,
          animationDelay: "1s",
          animationFillMode: "forwards",
          ...(isMobile
            ? {
                display: "flex",
                gap: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--border)",
              }
            : {
                position: "absolute",
                right: "2.5rem",
                bottom: "2.5rem",
                display: "flex",
                gap: "3rem",
              }),
        }}
      >
        {[
          { num: "3+", label: "Years Exp." },
          { num: "8+", label: "Projects" },
          // { num: "10+", label: "Clients" },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: isMobile ? "left" : "right" }}>
            <div className="font-display" style={{ fontSize: isMobile ? "1.6rem" : "2rem", color: "var(--accent)" }}>
              {num}
            </div>
            <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator — desktop only */}
      {!isMobile && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "2.5rem",
            opacity: 0,
            animationDelay: "1.2s",
            animationFillMode: "forwards",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
          <span
            className="font-mono"
            style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.15em", writingMode: "vertical-lr" }}
          >
            SCROLL
          </span>
        </div>
      )}
    </section>
  );
}