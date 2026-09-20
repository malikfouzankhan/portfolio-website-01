# Portfolio — Malik Fouzan Khan

Personal site. Next.js 16 (App Router) + React 19 + Tailwind CSS v4, deployed as
a static build with one hourly-revalidated fetch.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint
```

## How it's put together

```
src/
  app/          routes, metadata, OG image, sitemap, robots
  components/
    sections/   Hero · About · Experience · Work · Stack · Contact · Footer
    ui/         shared primitives (Reveal, SectionHeader, diagrams, icons)
    nav/        Nav + mobile menu
  data/         all content — projects, experience, stack, profile
  lib/          GitHub fetch, site constants
```

**Content lives in `src/data/`, not in components.** To add a project, edit
[`src/data/projects.ts`](src/data/projects.ts); to change the bio or links, edit
[`src/data/profile.ts`](src/data/profile.ts). Nothing is hardcoded in JSX.

A few decisions worth knowing about:

- **`page.tsx` is a server component.** Only `Nav`, `CommandPalette`,
  `Typewriter`, `CopyEmail` and `Reveal` ship as client JS. Sections, project
  cards and the architecture diagrams are server-rendered.
- **Responsiveness is pure CSS.** No `isMobile` state, no resize listeners —
  breakpoints are Tailwind `md:` variants, so the first paint is correct on
  mobile.
- **Reveal-on-scroll starts visible.** `Reveal` hides elements from an effect
  and reveals them via one shared `IntersectionObserver`. If JS fails, content
  is still readable.
- **Scroll-driven CSS is progressive enhancement only.** `animation-timeline`
  sits behind `@supports` and carries decoration (progress bar, parallax) —
  never content — because Firefox stable still ships it behind a flag.
- **Architecture diagrams are inline SVG** generated from the `architecture`
  field on a project. No images, no diagram library.

Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> for the command palette. Type `>` in it
for a terminal; `help` lists the commands.

## Before deploying

- [ ] Set the real domain in [`src/lib/site.ts`](src/lib/site.ts)
- [ ] Add `public/resume.pdf`
- [ ] Fill in the `TODO` date ranges in [`src/data/experience.ts`](src/data/experience.ts)
- [ ] Review `unverified` in [`src/data/stack.ts`](src/data/stack.ts) — fold each
      entry into a group or delete it
