export type StackGroup = {
  label: string;
  /** lucide-react icon name, resolved in the Stack section. */
  icon: "server" | "database" | "plug" | "layout" | "ship";
  note: string;
  items: string[];
};

/* Ordered backend-first, because that's where the work is.

   Everything listed here appears in at least one shipped project. The old
   Skills section also claimed Python, FastAPI, Microservices, Redux, Framer
   Motion and MySQL; none are evidenced by a project, so they were reviewed and
   dropped. Supabase was kept — it backs the YBA Consulting build. */
export const stack: StackGroup[] = [
  {
    label: "Backend & APIs",
    icon: "server",
    note: "Where most of my time goes.",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "TypeScript",
      "REST",
      "BullMQ",
      "Puppeteer",
      "WebSockets",
    ],
  },
  {
    label: "Data",
    icon: "database",
    note: "Relational by default.",
    items: ["PostgreSQL", "MongoDB", "Prisma", "Drizzle ORM", "Mongoose", "Supabase", "Redis"],
  },
  {
    label: "Platform APIs",
    icon: "plug",
    note: "Integrations carrying real traffic.",
    items: [
      "WhatsApp Cloud API",
      "Meta Embedded Signup",
      "Cloudflare R2",
      "Cloudinary",
      "Resend",
    ],
  },
  {
    label: "Frontend",
    icon: "layout",
    note: "Enough to ship end to end.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Infra & Deploy",
    icon: "ship",
    note: "I deploy what I build.",
    items: ["Docker", "Nginx", "PM2", "Linux", "VPS", "CI/CD", "GitHub Actions", "Vercel"],
  },
];

