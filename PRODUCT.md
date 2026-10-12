# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: hiring teams for a full-time role.** Engineering leads, CTOs and recruiters deciding whether Malik Fouzan Khan is worth an interview. Recruiters skim for role fit, stack and availability in seconds; engineers read the case studies and architecture to judge whether the depth is real.

**Secondary: freelance clients.** Small businesses and founders looking for someone to build and ship for them. The engagements Malik wants:
- full product builds (web apps, CRMs, dashboards)
- backend and deployment work (APIs, queues, VPS/Docker setup, fixing production systems)
- business websites with admin panels (like YBA Consulting)

Full-time is the main goal. Freelance is a welcome second path and should never crowd it out.

## Product Purpose

A personal portfolio at fouzan.dev. It shows real, shipped work so a visitor can decide to get in touch. Success means an interview request or a qualified freelance inquiry through the contact form, email, LinkedIn, or a résumé download.

## Positioning

A full-stack engineer with real backend strength. He takes products end to end, from schema and queues to UI to the VPS they run on, and the proof is systems in daily production use: a multi-branch diagnostics CRM with doctor approval chains, a school platform with queue-backed PDF rendering, and a multi-tenant WhatsApp Business Platform. The claim a neighbouring portfolio can't copy is specific, verifiable production ownership, including deploying and operating what he builds. Generic stack breadth isn't the claim.

## Operating Context

- Visitors come from job applications, LinkedIn, GitHub, direct outreach, and shared links (OG image in place). Many first see the site on a phone.
- Engineers use the case studies (problem → constraint → decision → outcome) and the inline architecture diagrams to judge depth.
- Conversion paths: contact form (Resend, server-side), copy-to-clipboard email, résumé PDF, social links.
- ⌘K / Ctrl K opens a command palette. Typing `>` in it opens a terminal (`help` lists the commands). This is a deliberate signature feature for technical visitors.
- Location and timezone: Hyderabad, India, IST (UTC+5:30).

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4. Mostly static, with one GitHub fetch that revalidates every 15 minutes. Deployed at `https://fouzan.dev`.
- Content lives in `src/data/` (profile, projects, experience, stack), never hardcoded in JSX.
- Pages are server components by default. Only a few interactive pieces ship client JS.
- Responsiveness is pure CSS. Reveal-on-scroll content starts visible, and scroll-driven CSS is progressive enhancement that carries decoration only.
- Routes: `/` (Hero, About, Experience, Work, Stack, Contact), `/archive`, `/privacy`.
- **Career-history truth:** Checklife Diagnostics and ISMS are clients of Zenoids Technologies, not separate employers. Never present them as separate roles.
- **Counts must agree with the data:** figures like "in production" come from `projects.ts`, so a hardcoded number has to match it.
- **Availability (decided 2026-10-01):** hiring leads and freelance comes second. The hero reads "Full-time roles · selective freelance builds"; Contact says "Open to full-time roles, and freelance when it fits." Freelance never gets equal billing.

## Brand Commitments

- Name: Malik Fouzan Khan, monogram "MFK" (`public/mfk-logo-copy-crop-svg.svg`, `public/mfk-favicon.png`).
- Voice, as it stands in the repo: terse, concrete and understated. Short declarative sentences about what was built and why. No hype and no aspirational claims ("Kept concrete — these describe work that exists").
- The ⌘K command palette and terminal easter egg must be kept.

## Evidence on Hand

- Case studies with architecture data for Checklife CRM, ISMS Hifz and Zenoids CRM (`src/data/projects.ts`).
- Live public projects: BookMyFarmhouse, plus archived work with live URLs and GitHub repos.
- Employment history (`src/data/experience.ts`), résumé (`public/malik-fouzan-khan-resume.pdf`), GitHub contribution data (live fetch).
- **Screenshots:** sanitized screenshots of private client work are allowed. None are in the repo yet, and Malik has to supply them.
- **Testimonials:** none exist yet. Malik may be able to get real quotes from a client or employer later. Until he provides them, never add or invent any, including quotes, client logos used as endorsement, or metrics beyond `src/data`.

## Product Principles

1. **Proof over claims.** Every statement is backed by a shipped system, a diagram, a link, or a verifiable fact.
2. **Hiring first, freelance welcome.** The full-time path is the main one. Freelance visitors should find their way in without diluting it.
3. **Serve the skim and the deep read.** A recruiter gets the answer in seconds, and an engineer can go deep enough to trust it.
4. **Honest to the record.** Career history, project status (live, private, in review) and counts stay exactly true.
5. **Craft is the credential.** The site itself shows that its author ships robust, fast, accessible software.

## Accessibility & Inclusion

Target WCAG 2.2 AA: sufficient contrast in both themes, full keyboard operability (including the command palette), visible focus, and respect for `prefers-reduced-motion`. Content must stay readable without JavaScript.
