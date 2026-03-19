"use client";

import { useRef, useEffect, useState } from "react";

const projects = [
  {
    number: "01",
    title: "Farmhouse Booking Platform",
    description:
      "A full-stack web application that allows users to browse, view details, and book farmhouses online. Built with React, Node.js, and MongoDB.",
    tags: ["Node.js", "React", "MongoDB", "Mongoose", "Tailwind", "Cloudinary"],
    live: "https://bookmyfarmhouse.app",
    github: "https://github.com/malikfouzankhan/BookMyFarmhouse",
    accent: "#E8FF47",
  },
  {
    number: "02",
    title: "Business Management Platform – Adfai Tech",
    description:
      "Contributed to the development of a web-based platform for Adfai Tech, implementing frontend components and integrating backend APIs to support business operations.",
    tags: ["React", "Node.js", "Cloudinary", "MongoDB"],
    live: "https://adfaitech.com",
    github: "https://github.com/adfai-tech/adfai-tech-website",
    accent: "#47FFD4",
  },
  {
    number: "03",
    title: "Contact Workspace Integration for LibreChat",
    description:
      "Extended LibreChat with a full-stack Contacts workspace — users can store, search, and import contacts in bulk via CSV, then query them through natural language chat. The AI assistant automatically retrieves relevant contacts and injects them into the prompt context before each message.",
      tags: ["Nginx", "Open-Source", "Express", "MongoDB", "React"],
      live: "https://librechat.fouzan.dev",
      github: "https://github.com/malikfouzankhan/LibreChat-contact-integration",
      accent:"#FF6B6B",
  },
  {
    number: "04",
    title: "Pokémon Data Explorer (PokeAPI)",
    description:
      "A frontend web app that fetches Pokémon data from PokeAPI, allowing users to view, edit Pokémon stats, and upload or download CSV files to manage the data.",
    tags: ["PokeAPI", "TypeScript", "Next.js"],
    live: "https://pokelab.fouzan.dev",
    github: "https://github.com/malikfouzankhan/pokelab-nextjs",
    accent: "#B47FFF",
  },
  {
    number: "05",
    title: "Subscription Maintainer",
    description:
      "A single platform to maintain all your subscriptions and get reminders. No more searching around, one click to access all your subscriptions.",
    tags: ["BullMQ", "Node.js", "Express", "TypeScript", "MongoDB"],
    live: "#",
    github: "https://github.com/malikfouzankhan/subscription-maintainer",
    accent: "#FF3CAC",
  },
  {
    number: "06",
    title: "Upvote your Idea",
    description:
      "List your idea and let people validate it through upvoting and feedback. Community driven and startup friendly.",
    tags: ["Express", "MongoDB", "React"],
    live: "#",
    github: "https://github.com/malikfouzankhan/upvote-your-idea",
    accent: "#A8FF78",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
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
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = project.accent + "44";
        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)";
      }}
    >
      {/* Top line accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${project.accent}, transparent)`,
        }}
      />

      {/* Number */}
      <span
        className="font-display"
        style={{
          fontSize: "4rem",
          lineHeight: 1,
          color: project.accent + "18",
          position: "absolute",
          top: "1.2rem",
          right: "1.8rem",
          userSelect: "none",
        }}
      >
        {project.number}
      </span>

      <div>
        <span
          className="font-mono"
          style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.15em", display: "block", marginBottom: "0.5rem" }}
        >
          PROJECT {project.number}
        </span>
        <h3
          className="font-display"
          style={{ fontSize: "1.8rem", color: "var(--text)", letterSpacing: "0.02em" }}
        >
          {project.title}
        </h3>
      </div>

      <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: 1.7, fontWeight: 300 }}>
        {project.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: "0.65rem",
              color: project.accent,
              border: `1px solid ${project.accent}33`,
              padding: "0.25rem 0.6rem",
              letterSpacing: "0.08em",
              background: project.accent + "0A",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "auto", paddingTop: "0.5rem" }}>
        <a
          href={project.live}
          className="font-mono"
          target="_blank"
          style={{
            fontSize: "0.72rem",
            color: project.accent,
            textDecoration: "none",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ↗ LIVE DEMO
        </a>
        <a
          href={project.github}
          className="font-mono"
          target="_blank"
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "0.1em",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ⌥ SOURCE
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.1 }
    );
    if (headingRef.current) obs.observe(headingRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" style={{ padding: isMobile ? "5rem 1.25rem" : "8rem 2.5rem", position: "relative" }}>
      {/* Section header */}
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
            SELECTED WORK
          </span>
        </div>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)", lineHeight: 0.95, color: "var(--text)" }}
        >
          PROJECTS
          <br />
          <span style={{ color: "var(--text-muted)", WebkitTextFillColor: "transparent", WebkitTextStroke: "1px #333" }}>
            THAT SHIP.
          </span>
        </h2>
      </div>

      {/* Grid — 1 col mobile, 2 col desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
          gap: isMobile ? "1rem" : "1.5rem",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.number} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}