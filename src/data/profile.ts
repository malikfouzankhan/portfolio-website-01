export const profile = {
  name: "Malik Fouzan Khan",
  initials: "MFK",
  email: "malikfouzan05@gmail.com",
  location: "Hyderabad, India",
  timezone: "IST (UTC+5:30)",
  available: true,
  availabilityNote: "Open to full-time roles",

  // Shown in the hero typewriter. Kept concrete — these describe work that
  // exists in the projects below, not aspirations.
  roles: [
    "Full-Stack Engineer",
    "Backend & Systems",
    "WhatsApp Platform Integrations",
    "Production Deployments",
  ],

  tagline: "I build backends that hold up in production.",

  // Keep the count honest — the hero stat derives "in production" from
  // projects.ts, so a hardcoded number here must agree with it.
  bio: "Backend-leaning full-stack engineer. WhatsApp platforms, queue-backed pipelines, multi-tenant CRMs — three live in production, one in Meta review.",

  aboutLead:
    "I build the parts users never see. Approval chains, job queues, token vaults, deploy scripts.",

  aboutPoints: [
    {
      k: "Focus",
      v: "Backend systems and platform APIs. NestJS, Node, Postgres, BullMQ.",
    },
    {
      k: "Reach",
      v: "Full-stack when a project needs it — I'll take it end to end.",
    },
    {
      k: "Ship",
      v: "I deploy what I build. Docker, Nginx, PM2, a VPS I can SSH into.",
    },
  ],

  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/malikfouzankhan" },
    {
      label: "LinkedIn",
      short: "LI",
      href: "https://www.linkedin.com/in/malik-fouzan-khan-a76183268/",
    },
    { label: "Twitter", short: "TW", href: "https://x.com/_malik_fouzan_" },
  ],

  resumeHref: "/malik-fouzan-khan-resume.pdf",

  githubUsername: "malikfouzankhan",
} as const;

export type Social = (typeof profile.socials)[number];
