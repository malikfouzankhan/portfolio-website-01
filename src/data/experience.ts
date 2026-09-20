export type Experience = {
  role: string;
  org: string;
  period: string;
  location?: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

/* One employer, three products. Checklife Diagnostics and the Quran academy
   are Zenoids *clients* — they are not separate roles, and listing them as
   such would misstate the career history. */
export const experience: Experience[] = [
  {
    role: "Backend Engineer",
    org: "Zenoids Technologies",
    period: "Jun 2026 — Present",
    location: "Hyderabad, India",
    current: true,
    summary:
      "Backend across three products — a diagnostics CRM for a client, a school platform for a Quran academy, and an in-house multi-tenant WhatsApp Business Platform.",
    highlights: [
      "Checklife CRM — modelled a per-branch doctor approval chain as configuration, and gated WhatsApp delivery on approval state so unsigned reports can't send.",
      "ISMS Hifz — moved PDF reporting onto a BullMQ queue with Puppeteer workers, off the request path.",
      "Zenoids CRM — Meta Embedded Signup for self-serve onboarding, tokens encrypted at rest, tenant isolation enforced at the query layer.",
    ],
    stack: [
      "NestJS",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Drizzle",
      "BullMQ",
      "Docker",
    ],
  },
  {
    role: "Backend Lead",
    org: "BookMyFarmhouse",
    period: "Apr 2026",
    location: "Hyderabad, India",
    summary: "Backend lead in a team of three on a farmhouse booking platform.",
    highlights: [
      "30+ API endpoints with role-based auth across admin and vendor surfaces.",
      "Automated transactional email and Cloudinary media upload.",
      "Owned the VPS deployment — Nginx, PM2.",
    ],
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "Cloudinary", "Nginx", "PM2"],
  },
];
