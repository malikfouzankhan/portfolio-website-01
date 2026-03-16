"use client";

import { useRef, useEffect, useState } from "react";

const skillCategories = [
  {
    label: "Frontend",
    icon: "◈",
    color: "#E8FF47",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux"],
  },
  {
    label: "Backend",
    icon: "⬡",
    color: "#47FFD4",
    skills: ["Node.js", "Express", "Python", "FastAPI", "REST APIs", "WebSockets", "Microservices"],
  },
  {
    label: "Database",
    icon: "◉",
    color: "#FF6B6B",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase", "MySQL"],
  },
  {
    label: "DevOps & Cloud",
    icon: "⬢",
    color: "#B47FFF",
    skills: ["Docker", "Vercel", "CI/CD", "GitHub Actions", "Nginx", "Linux"],
  },
];

const tools = [
  "VS Code", "Git", "Figma", "Postman", "Notion", "Slack", "Linear",
  "Cursor", "Insomnia", "Warp",
];

function CategoryCard({ cat, index }: { cat: (typeof skillCategories)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        border: "1px solid var(--border)",
        padding: "2rem",
        position: "relative",
        background: "var(--bg-card)",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: cat.color,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "1.2rem", color: cat.color }}>{cat.icon}</span>
        <span
          className="font-display"
          style={{ fontSize: "1.1rem", letterSpacing: "0.08em", color: "var(--text)" }}
        >
          {cat.label}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {cat.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono"
            style={{
              fontSize: "0.7rem",
              color: "var(--text-dim)",
              border: "1px solid #1e1e1e",
              padding: "0.3rem 0.7rem",
              letterSpacing: "0.05em",
              background: "#0f0f0f",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = cat.color;
              e.currentTarget.style.borderColor = cat.color + "44";
              e.currentTarget.style.background = cat.color + "0A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-dim)";
              e.currentTarget.style.borderColor = "#1e1e1e";
              e.currentTarget.style.background = "#0f0f0f";
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const obs1 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.1 }
    );
    const obs2 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setToolsVisible(true); },
      { threshold: 0.1 }
    );
    if (headingRef.current) obs1.observe(headingRef.current);
    if (toolsRef.current) obs2.observe(toolsRef.current);
    return () => { obs1.disconnect(); obs2.disconnect(); };
  }, []);

  return (
    <section id="skills" style={{ padding: isMobile ? "5rem 1.25rem" : "8rem 2.5rem", background: "#080808", position: "relative" }}>
      {/* Horizontal rule */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--border)" }} />

      {/* Header */}
      <div
        ref={headingRef}
        style={{
          marginBottom: isMobile ? "2.5rem" : "4rem",
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ height: 1, width: 60, background: "var(--accent)", flexShrink: 0 }} />
          <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.2em" }}>
            CAPABILITIES
          </span>
        </div>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)", lineHeight: 0.95, color: "var(--text)" }}
        >
          SKILLS &amp;
          <br />
          <span style={{ color: "var(--text-muted)", WebkitTextFillColor: "transparent", WebkitTextStroke: "1px #333" }}>
            TOOLS.
          </span>
        </h2>
      </div>

      {/* Skill categories grid — 1 col mobile, 2 col desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: isMobile ? "1rem" : "1.5rem",
          marginBottom: isMobile ? "2.5rem" : "4rem",
        }}
      >
        {skillCategories.map((cat, i) => (
          <CategoryCard key={cat.label} cat={cat} index={i} />
        ))}
      </div>

      {/* Tools / Other */}
      <div
        ref={toolsRef}
        style={{
          opacity: toolsVisible ? 1 : 0,
          transform: toolsVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
            DAILY TOOLS
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {tools.map((tool) => (
            <span
              key={tool}
              className="font-mono"
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                padding: "0.35rem 0.8rem",
                border: "1px solid #1a1a1a",
                letterSpacing: "0.05em",
                background: "transparent",
                transition: "color 0.2s, border-color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.borderColor = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "#1a1a1a";
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}