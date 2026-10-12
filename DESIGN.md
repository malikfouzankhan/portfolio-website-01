---
name: Malik Fouzan Khan — Portfolio
description: Sodium-amber signal on an oxblood console; poster-scale condensed type over hairline, square-cornered hardware.
colors:
  sodium-amber: "#f7b538"
  black: "#000000"
  oxblood-night: "#1a0a0e"
  oxblood-surface: "#241016"
  oxblood-surface-hi: "#2d161d"
  oxblood-section: "#150709"
  oxblood-chip: "#200e13"
  oxblood-line: "#40232b"
  oxblood-line-soft: "#4a2b34"
  oxblood-line-control: "#5a3540"
  oxblood-ghost: "#3a2229"
  ash-text: "#dbd0d2"
  ash-dim: "#b0a2a5"
  ash-muted: "#94868a"
  ash-outline: "#8f8286"
  signal-green: "#5fd08a"
  signal-rose: "#e0899e"
  ledger-parchment: "#fbf4e6"
  parchment-surface: "#fffcf6"
  parchment-surface-hi: "#f6eedc"
  parchment-section: "#f4ebd8"
  parchment-chip: "#fffdf8"
  parchment-line: "#eadfc9"
  parchment-line-soft: "#f0e7d5"
  parchment-line-control: "#c9ae93"
  parchment-ghost: "#ebdfcb"
  ink-text: "#3b1b20"
  ink-dim: "#6b3540"
  ink-muted: "#854854"
  ink-outline: "#8a6b72"
  burgundy-ink: "#90111f"
  forest-green: "#0f7a42"
  wine-rose: "#9a3350"
typography:
  display:
    fontFamily: "Bebas Neue, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 13vw, 9.5rem)"
    fontWeight: 400
    lineHeight: 0.88
  headline:
    fontFamily: "Bebas Neue, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 10vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
  title:
    fontFamily: "Bebas Neue, Arial Narrow, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.02em"
  body-lead:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 300
    lineHeight: 1.75
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 300
    lineHeight: 1.75
  eyebrow:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    letterSpacing: "0.2em"
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    letterSpacing: "0.14em"
  button:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.8rem"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  pill: "2rem"
  dot: "9999px"
spacing:
  gutter-sm: "20px"
  gutter: "40px"
  card: "24px"
  card-lg: "32px"
  section-sm: "80px"
  section: "128px"
  container: "84rem"
components:
  button-primary:
    backgroundColor: "{colors.sodium-amber}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-outline:
    textColor: "{colors.ash-dim}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  button-outline-hover:
    textColor: "{colors.sodium-amber}"
  nav-cta:
    backgroundColor: "{colors.sodium-amber}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.oxblood-surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.card}"
  card-hover:
    backgroundColor: "{colors.oxblood-surface-hi}"
  input:
    backgroundColor: "{colors.oxblood-chip}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  tag:
    textColor: "{colors.sodium-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  stack-chip:
    backgroundColor: "{colors.oxblood-chip}"
    textColor: "{colors.ash-dim}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  intent-toggle-on:
    backgroundColor: "{colors.sodium-amber}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
---

# Design System: Malik Fouzan Khan — Portfolio

## Overview

**Creative North Star: "The Night-Shift Console"**

This is an operations console after hours. The room is dark oxblood and the only light comes from sodium-amber indicators. Everything on the panel reports something real: a status readout with lit traffic lights, a count of the systems in production, a live contribution graph, and schematics with data packets moving between nodes. The console is the frame, but the voice is a poster. The name is set in condensed display type up to 9.5rem tall and fills the viewport, and each section title is a solid line stacked over an outlined one. Everything under that scale is small, tracked-out mono labelling. The contrast between the huge and the tiny is the style.

The mood is bold, editorial and poster-like. Scale and weight come only from the display face, and color comes from one amber. Everything else is quiet on purpose: light-weight body copy, hairline borders, flat tonal surfaces, and a faint 60px blueprint grid behind the hero. Components are tactile and confident. The primary action is a solid block of amber with black text that lifts slightly under the pointer, and chips glow on hover. The hardware is square: corners are hard and borders are one pixel.

There are two themes, and light is not an inversion of dark. Dark (Oxblood Night) is the default. Light (Ledger Parchment) keeps the amber fill and moves amber-colored text to a deep burgundy ink. Motion follows the same principles: every reveal starts visible, scroll-driven effects carry only decoration, and reduced motion turns all of it off.

**Key Characteristics:**
- Poster-scale Bebas Neue display against tiny tracked DM Mono labels, with almost nothing in between.
- One accent, Sodium Amber, used as a fill. Amber-colored text uses a separate per-theme ink.
- Square corners everywhere. The only curves are the floating nav pill and status dots.
- Flat tonal surfaces separated by one-pixel hairlines, with a blueprint grid behind the hero.
- Console instrumentation (status panels, schematics, pipeline diagrams, a ⌘K terminal) serves as honest decoration.
- Dark by default, with a parchment light theme that is not an inversion of the dark one.

## Colors

The palette is a warm duotone: deep oxblood and burgundy grounds lit by a single sodium-amber signal, with rose-tinted ash neutrals that never reach pure white.

### Primary
- **Sodium Amber** (#f7b538): the console's indicator lamp. It is used only as a fill: primary buttons, the nav "Hire me" CTA, the selected intent toggle, text selection, the skip link and the hero glow. Text on it is always pure black (#000000, 11.6:1), which works in both themes. In the dark theme the same hex doubles as the accent ink for text, rules and hairlines (10.6:1 on Oxblood Night).
- **Burgundy Ink** (#90111f): the light theme's accent ink and focus color. On parchment it replaces amber wherever amber would be text, a hairline, an eyebrow or a focus ring (8.4:1).

### Neutral (dark theme, default)
- **Oxblood Night** (#1a0a0e): the page ground.
- **Oxblood Section** (#150709): a deeper band for alternating full-width sections (Experience, Stack).
- **Oxblood Surface** (#241016) / **Surface Hi** (#2d161d): card and panel fill, and the hover or open state of that fill.
- **Oxblood Chip** (#200e13): input and stack-chip wells, slightly recessed below the surface.
- **Oxblood Line** (#40232b) / **Line Soft** (#4a2b34): every hairline border and divider. The soft variant is used on the frosted nav and on chips.
- **Oxblood Line Control** (#5a3540): the edge of an outlined control (secondary buttons, icon buttons, the résumé link), as opposed to a line that divides space.
- **Oxblood Ghost** (#3a2229): the stroke of oversized watermark type. Decorative only.
- **Ash Text** (#dbd0d2, 12.8:1), **Ash Dim** (#b0a2a5, 7.8:1), **Ash Muted** (#94868a, 5.5:1): primary text, then body copy and secondary text, then labels and metadata.
- **Ash Outline** (#8f8286): the one-pixel stroke on outlined display type.

### Neutral (light theme)
- **Ledger Parchment** (#fbf4e6) ground, **Parchment Section** (#f4ebd8), **Parchment Surface** (#fffcf6) / **Surface Hi** (#f6eedc), **Parchment Chip** (#fffdf8), **Parchment Line** (#eadfc9) / **Line Soft** (#f0e7d5), **Parchment Line Control** (#c9ae93), **Parchment Ghost** (#ebdfcb).
- **Ink Text** (#3b1b20, 14.1:1), **Ink Dim** (#6b3540, 8.7:1), **Ink Muted** (#854854, 6.3:1), **Ink Outline** (#8a6b72).

### Status
- **Signal Green** (#5fd08a) / **Forest Green** (#0f7a42, light): live systems, passed validation checks, delivered messages.
- **Signal Rose** (#e0899e) / **Wine Rose** (#9a3350, light): the "in review" status and every form error.
- Private and archived items share the muted neutral. Both mean "not active".

### Named Rules
**The Two Ambers Rule.** The accent comes in two tokens: `accent` is a fill and `accent-ink` is text and hairlines. Amber measures 1.7:1 on parchment, so amber text is forbidden in the light theme. Any new accent-colored text must use `accent-ink`, never `accent`.

**The Contrast Ceiling Rule.** In the dark theme, primary text stops at 12.8:1 on purpose. Light text on a dark ground halates above about 13.5:1, so never use pure white for text on oxblood.

**The Tokens-Only Rule.** Every themeable color is a CSS custom property in plain `@theme`, never `@theme inline`, and is overridden under `:root[data-theme="light"]`. A literal hex in a component breaks the light theme without any warning. The one exception is pure black text on amber, which is correct in both themes.

## Typography

**Display Font:** Bebas Neue (fallback Arial Narrow, sans-serif)
**Body Font:** DM Sans, weights 300/400/500 (fallback system-ui)
**Label/Mono Font:** DM Mono, weights 400/500 (fallback ui-monospace)

**Character:** Bebas Neue is an all-caps condensed poster face, so it shouts. DM Mono whispers in small tracked capitals, like the labels on a hardware panel. DM Sans at weight 300 sits between them and stays out of the way. The pairing is a poster pinned to an instrument rack.

### Hierarchy
- **Display** (400, clamp(3rem, 13vw, 9.5rem), line-height 0.88): only the hero wordmark. Each character rises in turn, and the second line is set in the accent ink.
- **Headline** (400, clamp(2.5rem, 10vw, 6rem), line-height 0.95): section titles, always two lines, solid above and outlined below.
- **Title** (400, 1.45 to 1.7rem, line-height 1.25, tracking 0.02em): project and role names, and the "Message delivered" confirmation.
- **Body Lead** (300, 0.92rem on mobile to 1.05rem, line-height 1.65 to 1.75): the hero bio, max 34rem wide.
- **Body** (300, 0.86 to 0.95rem, line-height 1.7 to 1.75): descriptions and case-study copy, capped at max-w-3xl (48rem) and usually far narrower.
- **Eyebrow** (DM Mono 400, 0.7rem, tracking 0.2em, accent ink, uppercase words such as SELECTED WORK or CAPABILITIES): a section marker after a 60px accent rule.
- **Label** (DM Mono 400, 0.7rem, tracking 0.08 to 0.15em, UPPERCASE): metadata, `dt` keys, field labels, status chips, captions and tags. 0.7rem is a floor, not a default to shrink from.
- **Button** (DM Mono 500, 0.75 to 0.8rem, tracking 0.1em, UPPERCASE): every button and CTA.

### Named Rules
**The Poster Voice Rule.** Size comes only from Bebas Neue. There are no bold, mid-sized sans headings. If something needs emphasis, it becomes display type or a tracked mono label, never 1.5rem DM Sans at weight 600.

**The Solid-Over-Outline Rule.** Section headlines pair a solid first line with an outlined second line (a one-pixel stroke with a transparent fill). The outline is the system's signature beat, so it belongs to headlines only and never to body or labels.

**The Legibility Floor Rule.** No UI text below 0.7rem (11.2px), including labels, captions, chart axes and legends. The "tiny console label" look comes from tracking and uppercase, never from size. Text inside an SVG viewBox scales with the drawing, so chart labels are HTML at a fixed size.

**The Two-Edges Rule.** A line that divides space uses `line`. A line that outlines a control uses `line-control`, which holds about 1.9:1 in both themes. The plain hairline drops to 1.2:1 on parchment, where an outlined button loses its edge.

**The Mono-Means-Machine Rule.** DM Mono marks anything the machine would print: labels, statuses, counts, tags, timestamps, byte counts and buttons. Prose is never set in mono.

## Layout

A single long page sits on an 84rem container (`--container-page`). Gutters are 20px on mobile and 40px from `md` (48rem) up. Sections are generous vertical bands of 80px on mobile and 128px on desktop. Two sections (Hero and Contact) fill a full `min-h-svh` viewport. Section bands alternate between the page ground and the deeper section tone, divided by one-pixel top hairlines.

Grids are asymmetric: the hero splits 1.35fr / 1fr, Experience pins a sticky 22rem header next to its timeline, and Work stacks accordion rows. Cards and case-study grids are divided by one-pixel lines. The container fill shows through as the rule, which gives a ledger look.

Responsiveness is pure CSS, with Tailwind breakpoints at sm 40rem, md 48rem, lg 64rem and xl 80rem. There is no JS measuring. Below `lg`, the hero status panel collapses into a two-cell stat strip and a six-month contribution graph. Below `md`, the nav becomes a full-screen menu that slides down.

## Elevation & Depth

Depth comes from tone, not light. Surfaces step up from ground to surface to surface-hi, and hairlines do the separating. Three elevated moments exist today, and each one answers a situation:

### Shadow Vocabulary
- **Floating nav** (`box-shadow: 0 8px 30px -14px rgba(0,0,0,0.55)` plus `backdrop-filter: blur(40px) saturate(1.5)`): only when the nav has detached into its scrolled pill.
- **Chip glow** (`box-shadow: 0 0 14px -2px var(--color-accent-ink)`): a hover response on stack chips, together with a one-pixel lift.
- **Card lift** (`box-shadow: 0 8px 30px -14px rgba(0,0,0,0.55)`): permitted as a soft lift on card and project-row hover, paired with the existing surface-hi tonal step. It reuses the nav's shadow value, so there is still only one shadow in the system.
- **Glass panel** (surface at 60% opacity with `backdrop-filter: blur(8px)`): the hero status panel over the blueprint grid.

### Named Rules
**The Flat-at-Rest Rule.** Nothing casts a shadow at rest. Shadows and glows appear only as a response to state (hover, focus, scrolled) and never decorate a static surface.

## Shapes

The form language is machined panel hardware: hard 90° corners and one-pixel borders. Buttons, cards, inputs, chips, tags, dialogs and diagram nodes all have 0 radius. There are three sanctioned curves:
- the scrolled nav, which morphs from a full-bleed bar into a pill (2rem), with its "Hire me" CTA rounding in sync over the same 600ms;
- status and indicator dots (full circle): the traffic lights, the timeline nodes and the architecture packets;
- contribution-graph cells (2px).

Architecture diagram nodes are square rects with a 2px accent bar on their leading edge. Diagram edges are 3/3 dashed hairlines.

## Components

### Buttons
Tactile and confident. The primary is a solid amber slab you want to press.
- **Shape:** square (0).
- **Primary:** Sodium Amber fill, black DM Mono 500 uppercase label, tracking 0.1em, padding 14px × 32px (tighter on phones, where the two hero CTAs split the row equally). A trailing 14px Lucide arrow.
- **Hover / Focus:** lifts 2px with a plain transform transition. Focus gets the same lift plus the global 2px focus outline offset by 3px.
- **Outline:** transparent with a one-pixel `line-control` border and Ash Dim text. The primary carries a one-pixel amber border too, so the two always match in height. On hover or focus, the border and text both switch to the accent ink.
- **Disabled:** 45% opacity, the lift is suppressed, and the cursor is not-allowed.
- **Nav CTA ("Hire me"):** the primary at a smaller size (8px × 16px), which rounds into a pill with the nav. On hover it lifts 1px and brightens by 110%.

### Chips & Tags
- **Status chip:** a one-pixel border in the status tone at 30%, fill at 8%, text in the full tone, with an 11px icon (Radio, Lock, Clock or Archive) and an uppercase mono label. It never wraps and never shrinks, and it shows a short label below `md`.
- **Tech tag (project):** accent-ink text, a one-pixel accent-ink border at 25%, and a 6% accent-ink fill.
- **Stack chip:** a recessed chip-well fill with a soft hairline and Ash Dim text. On hover it lifts 1px, the border and text switch to accent ink, and it takes the chip glow.
- **Intent toggle (contact form):** outline by default. When selected (`aria-pressed`) it becomes a solid amber fill with black text.

### Cards / Containers
- **Corner Style:** square.
- **Background:** Surface, moving to Surface Hi on hover or when open.
- **Shadow Strategy:** flat at rest. A soft lift is permitted on hover (see Elevation).
- **Border:** a one-pixel line on every side.
- **Internal Padding:** 24px, or 32px from `md`, with 20px to 24px in accordion rows.
- A watermark project number (display type, accent ink at 25%) may sit in the top-right corner.

### Inputs / Fields
- **Style:** a one-pixel line border on the chip-well fill, DM Mono 0.82rem text, square, padding 8px × 12px. Labels are tracked uppercase mono and sit above the field.
- **Focus:** the border shifts to accent ink. The default outline is suppressed on fields only, because the border shift replaces it.
- **Error:** a rose mono message under the field, with `aria-invalid` set. Form-level errors appear in a rose-bordered strip with an 8% rose fill.
- **Live validation readout:** a row of mono checks (✓ or ·) that includes a byte count, in keeping with the console.

### Navigation
- At the top of the page it is a full-bleed transparent bar with a light blur. After 40px of scroll it detaches over 600ms into a centred frosted pill that is 12px from the top and constrained to the container width, with a one-pixel scroll-progress hairline along its bottom edge.
- On the left is the display-type monogram "MFK" with a muted full stop. Links are uppercase DM Mono 0.75rem with tracking 0.12em. The current section is marked in accent ink with an underline that scales in from the left.
- Mobile: a three-bar button that morphs into an X opens a full-screen menu on the page ground with the blueprint grid. Links are display type at up to 4rem and stagger in, followed by a full-width amber CTA.

### Section Header (signature)
Each section opens with a 60px accent-ink rule, then an uppercase mono eyebrow, then a two-line headline set solid over outlined. It reveals on scroll.

### Status Panel (signature)
Hero-right window chrome: three lit dots (rose, amber and green at 70%), then a "status" mono label, a `dl` of availability, focus, location and last push (dropped once it is more than 30 days old), and a two-cell stat row set in display type in accent ink. It rests on a glass surface over the grid. Keep it to this shape: a list of named systems was tried here and read as cluttered.

### Architecture Diagram (signature)
An inline SVG schematic of each featured project. Nodes are square surface rects with an accent-ink stroke at 35% and a 2px accent bar on the leading edge. Labels are mono. Dashed hairline edges carry animated amber packets, which pause whenever their row is closed. There is a mono uppercase caption.

### Command Palette (signature)
Opened with ⌘K or Ctrl K. It is a native `<dialog>`: square, surface fill, hairline border, over a 70% black backdrop blurred to 8px. Typing `>` switches it into a mono terminal. This is part of the brand and must be preserved.

## Do's and Don'ts

### Do:
- **Do** use Sodium Amber (#f7b538) as a fill with pure black text, and route every accent-colored text or hairline through `accent-ink`.
- **Do** keep every corner square (0), and round only the scrolled nav pill, its CTA, and indicator dots.
- **Do** let Bebas Neue carry all scale. Section titles are two lines, solid over outlined.
- **Do** label machine facts (statuses, counts, tags, metadata) in tracked uppercase DM Mono at 0.7rem or larger.
- **Do** separate with one-pixel hairlines (Oxblood Line #40232b or Parchment Line #eadfc9) and tonal steps, not with boxes and shadows.
- **Do** design both themes at once. A new token needs a light override under `:root[data-theme="light"]`.
- **Do** keep reveals visible by default, keep scroll-driven effects decorative, and honor `prefers-reduced-motion` by removing motion entirely.
- **Do** use `--ease-out-expo` (cubic-bezier(0.16, 1, 0.3, 1)) for entrances and reveals, and `--ease-nav` for shape morphs.

### Don't:
- **Don't** set amber (#f7b538) as text on Ledger Parchment. It measures 1.7:1.
- **Don't** use pure white text on oxblood. Stay at or below Ash Text (#dbd0d2), the 12.8:1 ceiling.
- **Don't** introduce rounded cards, rounded buttons or pill-shaped chips.
- **Don't** add bold mid-sized sans headings. DM Sans stays at weight 300 or 400 for prose.
- **Don't** cast shadows on surfaces at rest. Shadows and glows answer hover, focus or scroll only.
- **Don't** add a second accent hue. Green and rose are status signals only, never decoration.
- **Don't** hardcode hex values in components. The only exception is black text on amber.
- **Don't** put the outline treatment on anything but headlines and ghost watermarks.
- **Don't** set UI text below 0.7rem (11.2px), and don't let chart text scale down inside an SVG viewBox.
