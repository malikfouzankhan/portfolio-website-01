---
target: the hero section
total_score: 22
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/fouzan/portfolio-website-01/src/components/sections/Hero.tsx"
target_fingerprint: "sha256:852a59d638bac5e869dcd1554aed8181dc072eb52a7fbbd6c1afe05e47c81a31"
target_path: /home/fouzan/portfolio-website-01/src/components/sections/Hero.tsx
timestamp: 2026-09-30T10-37-20Z
slug: src-components-sections-hero-tsx
closed: true
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Status panel genuinely live; production count derived from data |
| 2 | Match System / Real World | 3 | Recruiter-facing jargon: "queue-backed pipelines", "Last push", "endpoints shipped", `>` glyph |
| 3 | User Control and Freedom | 2 | ~3.2s unskippable preloader, scroll-locked, every reload of `/` |
| 4 | Consistency and Standards | 3 | "Hire me" and "Get in touch" → same #contact; desktop panel vs mobile strip report different facts |
| 5 | Error Prevention | 3 | No inputs; new-tab socials unannounced |
| 6 | Recognition Rather Than Recall | 2 | 1 of 4 roles visible at a time; no ⌘K hint; no résumé in hero |
| 7 | Flexibility and Efficiency | 3 | ⌘K + terminal exist, never signposted from hero |
| 8 | Aesthetic and Minimalist Design | 3 | Confident; count stated twice; mobile heatmap ~40% of hero height |
| 9 | Error Recovery | n/a | No error states; GitHub failure omits graph cleanly |
| 10 | Help and Documentation | n/a | Not applicable to a portfolio hero |
| **Total** | | **22/32 (69%)** | **Acceptable** |

## Design Specificity Verdict
Skin authored, skeleton generic: stock dev-portfolio hero (giant name, `>` typewriter, bio, 2 CTAs + socials, traffic-light card with GitHub heatmap, SCROLL cue). The uncopyable claim — named production systems — is reduced to "3 systems"; the tagline "I build backends that hold up in production." lives only in the OG image.
Detector: CLI 7 advisory design-system-font-size (Hero.tsx 113/119/133 @0.55rem, 172/178/191 @0.58rem; ContributionGraph.tsx:158 @0.55rem) — partial doc false positive (DESIGN.md frontmatter label 0.62rem vs prose 0.55–0.7rem). Browser (hero only): blinking-cursor ×1; undersized-ui-text on panel labels 8.8–9.9px and mobile CTAs 10.9px. All contrast ≥5.3:1 both themes; no overflow; fits fold at 1440×900 and 390×844. display:none elements are detector false positives. Injected headlessly — no user-visible overlay.

## Priority Issues
- [P1] "80+ endpoints shipped" untraceable (Hero.tsx:177; data only supports 30+ at projects.ts:196, experience.ts:47). Fix: derive from per-project `endpoints` field or replace with a data-backed stat. → /impeccable clarify
- [P1] Screen readers: h1 name "M a l i k F o u z a n ." (per-char inline-block spans, drops "Khan"); typewriter aria-label on <p> not exposed, roles never announced (Typewriter.tsx:60). Fix: sr-only full name + aria-hidden chars; sr-only static roles + aria-hidden animation. → /impeccable harden
- [P1] Recruiter 5-second read fails: rotating role (caught showing only `>`), availability absent on mobile strip, no résumé link, blinking caret competes. Fix: static role line from tagline; mobile strip cell → Availability; tertiary "Résumé (PDF)" link. → /impeccable clarify
- [P2] No freelance signal; contradicts Contact.tsx:43 "and freelance when it fits". Fix: "Full-time roles · selective freelance builds". → /impeccable clarify
- [P2] Micro-type 8.8–9.9px labels, ~6px heatmap months, 10.9px mobile CTAs. Fix: 0.7rem floor for UI labels, 0.8rem mobile CTAs; align DESIGN.md label token. → /impeccable typeset

## Persona Red Flags
- Jordan (recruiter): jargon; typewriter mid-deletion; no résumé; two CTAs to one place; h1 omits "Khan".
- Casey (mobile): no availability; "Hire me" behind hamburger; 8.8px labels; graph dominates.
- Sam (a11y): h1 spelled out; typewriter silent; new-tab unannounced; light-theme outline borders near-invisible.
- Priya (EM): unnamed systems; unverifiable 80+; ⌘K undiscoverable.
- Omar (business owner): "full-time roles" reads as not-for-me; no mention of websites/admin panels.

## Minor Observations
- Preloader ~3.2s every reload (documented as intentional).
- Bio hardcodes "three" while stat derives it.
- Two amber fills compete (nav Hire me vs View my work).
- "Last push" will read stale; hide past threshold.
- SCROLL cue is a trope; ~180px dead band on desktop.
- Focus row "Backend · WhatsApp Platform" narrower than full-stack positioning.
- Primary CTA 2px shorter than bordered secondary.

## Questions to Consider
- Why "3 systems" instead of naming Checklife CRM · ISMS Hifz · Zenoids CRM?
- Should the largest thing be the name, or the tagline?
- Does a 3.2s cover on every reload prove or contradict "ships robust software"?
