# Portfolio — Malik Fouzan Khan

Personal site. Next.js 16 (App Router) + React 19 + Tailwind CSS v4, deployed as
a static build with one 15-minute-revalidated fetch.

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

## Environment

All server-side; none of these are `NEXT_PUBLIC_`, so none reach the browser.

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | contact form | Resend transport |
| `CONTACT_TO` | contact form | where submissions land |
| `RESEND_FROM_VERIFIED` | contact form | verified sender |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | contact form | spam gate |
| `GITHUB_PAT` | no | the hero's live GitHub data — "Last push" and the contributions graph |

`GITHUB_PAT` drives one GraphQL call that returns both values, and private
repos count towards each. The two degrade differently without it:

- **Last push** falls back to the most recent *public* push. Still renders, just
  wrong if you mostly work in private repos.
- **The contributions graph disappears.** GitHub exposes the calendar nowhere
  but GraphQL, and GraphQL always requires auth — there is no public tier to
  fall back to, so the hero drops the section rather than framing an empty box.

The site builds and runs fine either way.

**Minting it:** GitHub → Settings → Developer settings → Personal access tokens
→ **Fine-grained**. Repository access *All repositories*; the only permission
needed is **Metadata: Read-only**, which is the mandatory baseline — do not
grant Contents. That is enough to read `pushedAt`, and it cannot read a single
line of your code. Private repos owned by an org need that org to approve the
token separately.

> **Check this once after minting.** Whether a fine-grained token reports
> *private* contributions through `contributionsCollection` is not documented
> either way. Compare the graph against github.com/&lt;you&gt; — if days you only
> worked privately come back empty, swap to a **classic** token with the
> `read:user` scope, which is the documented path for that field.

Fine-grained tokens expire (366 days max). When one does, "Last push" silently
falls back to the public timestamp and the graph disappears — neither breaks
the build.

## Before deploying

- [ ] Set the real domain in [`src/lib/site.ts`](src/lib/site.ts)
- [ ] Add `GITHUB_PAT` to the host's env for **both** build and runtime — the
      hero is prerendered, so a build without it bakes in the public timestamp
- [ ] Add `public/resume.pdf`
- [ ] Fill in the `TODO` date ranges in [`src/data/experience.ts`](src/data/experience.ts)
- [ ] Review `unverified` in [`src/data/stack.ts`](src/data/stack.ts) — fold each
      entry into a group or delete it
