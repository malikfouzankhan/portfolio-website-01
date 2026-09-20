export type ProjectStatus = "live" | "private" | "in-review" | "archived";

export type ArchNode = {
  id: string;
  label: string;
  sub?: string;
  /** Column in the flow, 0-indexed left to right. */
  col: number;
  /** Row within the column, 0-indexed top to bottom. */
  row?: number;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

export type Architecture = {
  caption: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  status: ProjectStatus;
  /** Short status label rendered when there's no public link. */
  statusNote?: string;
  featured?: boolean;
  role: string;
  org?: string;
  /** End client, when the work was delivered through an employer. */
  client?: string;
  teamSize?: string;
  period?: string;
  description: string;
  outcome?: string;
  /** problem → constraint → decision → outcome, for featured work only. */
  caseStudy?: {
    problem: string;
    constraint: string;
    decision: string;
    outcome: string;
  };
  architecture?: Architecture;
  tags: string[];
  live?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "checklife-crm",
    number: "01",
    title: "Checklife CRM",
    status: "private",
    statusNote: "Private — client system",
    featured: true,
    role: "Technical Lead",
    org: "Zenoids Technologies",
    client: "Checklife Diagnostics",
    period: "Jun 2026 — Present",
    description:
      "Multi-branch diagnostics CRM built at Zenoids for a client. PDF reports move through a per-branch doctor approval chain, then reach patients over WhatsApp.",
    outcome: "Live on the client's VPS, in daily use by staff and patients.",
    caseStudy: {
      problem:
        "Reports were printed, signed, then messaged from personal phones. Nobody could say which doctor approved what.",
      constraint:
        "Approval order differs per branch and test type. Medical records — delivery had to be auditable.",
      decision:
        "Made the approval chain configuration, not code. PDFs to R2; WhatsApp delivery gated on approval state.",
      outcome:
        "Reports reach patients minutes after sign-off. Every step attributable.",
    },
    architecture: {
      caption: "Report lifecycle — upload to patient delivery",
      nodes: [
        { id: "staff", label: "Staff", sub: "branch upload", col: 0 },
        { id: "api", label: "Next.js API", sub: "Prisma", col: 1 },
        { id: "r2", label: "Cloudflare R2", sub: "PDF store", col: 2, row: 0 },
        { id: "chain", label: "Approval chain", sub: "per-branch, dynamic", col: 2, row: 1 },
        { id: "wa", label: "WhatsApp Cloud API", col: 3 },
        { id: "patient", label: "Patient", col: 4 },
      ],
      edges: [
        { from: "staff", to: "api", label: "PDF" },
        { from: "api", to: "r2", label: "store" },
        { from: "api", to: "chain", label: "queue" },
        { from: "chain", to: "wa", label: "on approve" },
        { from: "wa", to: "patient", label: "deliver" },
      ],
    },
    tags: ["Next.js", "Prisma", "PostgreSQL", "WhatsApp Cloud API", "Cloudflare R2", "Docker"],
  },
  {
    slug: "isms-hifz",
    number: "02",
    title: "ISMS Hifz Tracking System",
    status: "private",
    statusNote: "Private — client system",
    featured: true,
    role: "Backend Developer",
    org: "Zenoids Technologies",
    client: "ISMS",
    period: "Aug 2026 — Present",
    description:
      "School platform for a Quran academy — admin, teacher and parent dashboards over attendance, exams, homework and Hifz tracking.",
    outcome: "Queue-backed PDF reporting, off the request path.",
    caseStudy: {
      problem:
        "Term-end report runs blocked the API and timed out the teacher who triggered them.",
      constraint:
        "Reports render from academy-controlled HTML — needed a real browser engine, not a PDF library.",
      decision:
        "Moved rendering to BullMQ with Puppeteer workers in their own container. Requests enqueue and return.",
      outcome:
        "Bulk runs stopped competing with traffic. Failed renders retry themselves.",
    },
    architecture: {
      caption: "Report generation — off the request path",
      nodes: [
        { id: "teacher", label: "Teacher", sub: "requests report", col: 0 },
        { id: "nest", label: "NestJS API", sub: "Drizzle ORM", col: 1 },
        { id: "queue", label: "BullMQ", sub: "Redis-backed", col: 2 },
        { id: "worker", label: "Puppeteer worker", sub: "separate container", col: 3 },
        { id: "store", label: "PDF store", col: 4, row: 0 },
        { id: "parent", label: "Parent dashboard", col: 4, row: 1 },
      ],
      edges: [
        { from: "teacher", to: "nest", label: "enqueue" },
        { from: "nest", to: "queue", label: "job" },
        { from: "queue", to: "worker", label: "render" },
        { from: "worker", to: "store", label: "PDF" },
        { from: "store", to: "parent", label: "download" },
      ],
    },
    tags: ["NestJS", "TypeScript", "PostgreSQL", "Drizzle ORM", "BullMQ", "Puppeteer", "Docker"],
  },
  {
    slug: "zenoids-crm",
    number: "03",
    title: "Zenoids CRM",
    status: "in-review",
    statusNote: "In Meta App Review",
    featured: true,
    role: "Backend Developer",
    org: "Zenoids Technologies",
    period: "Sep 2026 — Present",
    description:
      "Multi-tenant WhatsApp Business Platform. Businesses self-onboard through Meta Embedded Signup and run conversations from one inbox.",
    outcome: "Built and submitted; awaiting Meta App Review.",
    caseStudy: {
      problem:
        "Every tenant was onboarded by hand — someone pasted credentials into a config.",
      constraint:
        "A tenant token grants full control of their WhatsApp account. No plaintext, no cross-tenant reads.",
      decision:
        "Embedded Signup for self-serve auth. Tokens encrypted at rest; tenant scoping enforced at the query layer.",
      outcome:
        "Manual walkthrough became a self-serve flow. Pending Meta App Review.",
    },
    architecture: {
      caption: "Multi-tenant onboarding and message flow",
      nodes: [
        { id: "biz", label: "Business", sub: "self-serve", col: 0 },
        { id: "signup", label: "Embedded Signup", sub: "Meta OAuth popup", col: 1 },
        { id: "vault", label: "Token store", sub: "encrypted at rest", col: 2, row: 0 },
        { id: "inbox", label: "Multi-tenant inbox", sub: "scoped queries", col: 2, row: 1 },
        { id: "wa", label: "WhatsApp Cloud API", col: 3 },
        { id: "customer", label: "Customer", col: 4 },
      ],
      edges: [
        { from: "biz", to: "signup", label: "authorize" },
        { from: "signup", to: "vault", label: "token" },
        { from: "vault", to: "inbox", label: "decrypt" },
        { from: "inbox", to: "wa", label: "send" },
        { from: "wa", to: "customer", label: "message" },
      ],
    },
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "WhatsApp Business API", "Tailwind"],
  },
  {
    slug: "bookmyfarmhouse",
    number: "04",
    title: "BookMyFarmhouse",
    status: "live",
    role: "Backend Lead",
    teamSize: "Team of 3",
    period: "Apr 2026",
    description:
      "Farmhouse browsing and booking platform. I built the API surface, role-based auth, the admin and vendor dashboards, and the deployment.",
    outcome: "30+ endpoints shipped; live on a VPS behind Nginx.",
    tags: ["Node.js", "React", "MongoDB", "Mongoose", "Cloudinary", "Nginx", "PM2"],
    live: "https://bookmyfarmhouse.app",
    github: "https://github.com/malikfouzankhan/BookMyFarmhouse",
  },

  // ---- Archive: surfaced at /archive rather than left in comments ----
  {
    slug: "librechat-contacts",
    number: "05",
    title: "Contact Workspace for LibreChat",
    status: "archived",
    role: "Contributor",
    description:
      "Added a Contacts workspace to LibreChat — CSV bulk import, search, and natural-language queries that inject matching contacts into prompt context.",
    tags: ["Nginx", "Open-Source", "Express", "MongoDB", "React"],
    live: "https://librechat.fouzan.dev",
    github: "https://github.com/malikfouzankhan/LibreChat-contact-integration",
  },
  {
    slug: "yba-consulting",
    number: "06",
    title: "YBA Consulting",
    status: "archived",
    role: "Full-Stack Developer",
    description:
      "Consulting site for a financial firm. Custom admin panel, auth, automated inquiry handling.",
    tags: ["Next.js", "Supabase", "Postgres", "Resend", "Nginx"],
    live: "https://ca-v1.fouzan.dev",
    github: "https://github.com/malikfouzankhan/yba-consulting",
  },
  {
    slug: "adfai-tech",
    number: "07",
    title: "Business Platform — Adfai Tech",
    status: "archived",
    role: "Frontend Contributor",
    description:
      "Frontend components and API integration for a business operations platform.",
    tags: ["React", "Node.js", "Cloudinary", "MongoDB"],
    live: "https://adfaitech.com",
    github: "https://github.com/adfai-tech/adfai-tech-website",
  },
  {
    slug: "pokelab",
    number: "08",
    title: "Pokémon Data Explorer",
    status: "archived",
    role: "Solo",
    description:
      "Frontend over PokeAPI — view and edit stats, with CSV import and export.",
    tags: ["PokeAPI", "TypeScript", "Next.js"],
    live: "https://pokelab.fouzan.dev",
    github: "https://github.com/malikfouzankhan/pokelab-nextjs",
  },
  {
    slug: "subscription-maintainer",
    number: "09",
    title: "Subscription Maintainer",
    status: "archived",
    role: "Solo",
    description:
      "Track every subscription in one place and get reminded before renewal.",
    tags: ["BullMQ", "Node.js", "Express", "TypeScript", "MongoDB"],
    github: "https://github.com/malikfouzankhan/subscription-maintainer",
  },
  {
    slug: "upvote-your-idea",
    number: "10",
    title: "Upvote Your Idea",
    status: "archived",
    role: "Solo",
    description:
      "List an idea, let people validate it through upvotes and feedback.",
    tags: ["Express", "MongoDB", "React"],
    github: "https://github.com/malikfouzankhan/upvote-your-idea",
  },
];

export const activeProjects = projects.filter((p) => p.status !== "archived");
export const archivedProjects = projects.filter((p) => p.status === "archived");
export const featuredProjects = projects.filter((p) => p.featured);
