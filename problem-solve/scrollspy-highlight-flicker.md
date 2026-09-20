# Scrollspy highlight strobes through intermediate sections

**Symptom.** A one-page site with a nav that highlights the section you are
reading. Click a nav link for a section that is not adjacent — About →
Contact — and the highlight flickers down every section in between
(experience → work → stack) before settling on the destination. Clicking an
adjacent section looks fine, which is why this often ships unnoticed.

**Applies to** any scrollspy built on `IntersectionObserver` or a scroll
listener, combined with `scroll-behavior: smooth` or
`scrollIntoView({ behavior: "smooth" })`. Framework-independent; the React
specifics at the end are incidental.

---

## 1. Why it happens

Nothing is broken, which is what makes it confusing to debug. The observer is
reporting the truth.

A smooth scroll is not a jump. The viewport genuinely travels through every
section between origin and destination, so each one genuinely enters and
leaves the observer's band. The observer fires for each, the highlight
follows, and you see a strobe.

The observer cannot distinguish **transit** from **arrival**, because from
the DOM's point of view there is no difference. The information that
separates them does not exist in the scroll position at all — it exists only
in the fact that *you started this scroll and you know where it is going*.

That is the whole insight. The fix is to carry that knowledge from the click
to the highlight.

## 2. Fixes that do not work

Try these first only if you want to understand why the real fix is shaped the
way it is.

| Attempt | Why it fails |
| --- | --- |
| Shrink the observer band (`rootMargin`) | Changes *when* each crossing fires, not *whether*. Still strobes, just faster. |
| Debounce the highlight | A debounce trailing-edge still lands on the final value — but a long scroll outlives the debounce window, so intermediates leak through. Tuning the delay trades one broken case for another. |
| Only accept transitions to adjacent sections | Breaks legitimate fast scrolling, and defines "adjacent" against a list that can reorder. |
| Disable smooth scrolling | Fixes the symptom by removing the feature. |
| Compute the active section from `scrollY` yourself | Identical problem. The cause is the scroll animation, not the detection mechanism. |

## 3. The fix

While a scroll **you initiated** is in flight:

1. **Pin** the highlight to the destination immediately, on click.
2. **Keep recording** what the observer reports, but do not publish it.
3. **Publish again** when the page stops moving.

Step 2 matters more than it looks. Keep the observer's bookkeeping live and
only gate the *publish*, so that when the lock releases you already hold the
correct answer and need no extra callback to discover it. If you instead
disconnect the observer during the scroll, you land with stale state and have
to re-measure.

### Architecture

The click handler and the highlight are usually not the same component. Do
not reach across them with shared mutable state or a store — announce it:

```
click handler  ──dispatch CustomEvent──▶  window  ──listener──▶  nav highlight
```

A DOM event keeps the two sides ignorant of each other, which matters because
there is usually **more than one thing that scrolls**: nav links, a hero CTA,
a footer "back to top", a command palette, a keyboard shortcut. Each of them
announces; the highlight listens once.

```ts
// lib/anchor-scroll.ts
export const ANCHOR_SCROLL = "app:anchor-scroll";
export type AnchorScrollDetail = { id: string };

export function announceAnchorScroll(id: string) {
  window.dispatchEvent(
    new CustomEvent<AnchorScrollDetail>(ANCHOR_SCROLL, { detail: { id } }),
  );
}
```

Every emitter announces **after** starting the scroll, never before — a
listener that waits on `scrollend` must not be armed before the scroll it is
waiting for exists:

```ts
target.scrollIntoView({ behavior: "smooth", block: "start" });
announceAnchorScroll(target.id);
```

### Release conditions — the actual work

Locking is easy. A lock that can never get stuck is the engineering. If the
lock leaks, the highlight freezes on a stale section for the rest of the
session, which is a worse bug than the one you set out to fix.

Use **four independent releases, first one wins**:

| Release | Why it is needed |
| --- | --- |
| `scrollend` | The exact signal. Chrome/Edge 114+, Firefox 109+, Safari 18.2+. Feature-detect with `"onscrollend" in window`. |
| Per-frame settle detection | Fallback for browsers without it. Poll `scrollY` per `requestAnimationFrame`; settled after ~3 identical frames. |
| User interrupt (`wheel`, `touchstart`, `keydown`) | A wheel or touch **cancels the smooth scroll**. The destination is no longer where the user is going, so holding the pin shows a lie. Release immediately and hand control back. |
| Timeout backstop (~2s) | Belt and braces. A missed `scrollend` — background tab, cancelled animation, an edge case nobody predicted — must not strand the highlight permanently. |

**The settle-detection floor is not optional.** A naive frame poll reads three
identical `scrollY` values *before the scroll has visibly begun* and concludes
it has already arrived. Require a minimum elapsed time (~120ms) as well as the
still-frame count.

### Reference implementation

```ts
const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const;

const onScreen = new Set<string>();
let locked = false;

// Document order, last wins: while two sections straddle the band, the lower
// one is the one being scrolled into.
const publish = () =>
  setActive(sections.filter((s) => onScreen.has(s.id)).at(-1)?.id ?? null);

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target.id);
      else onScreen.delete(entry.target.id);
    }
    if (!locked) publish();   // bookkeeping always; publishing only when free
  },
  { rootMargin: "-30% 0px -60% 0px" },
);
sections.forEach((s) => io.observe(s));

let raf = 0;
let guard = 0;

const release = () => {
  if (!locked) return;
  locked = false;
  cancelAnimationFrame(raf);
  clearTimeout(guard);
  window.removeEventListener("scrollend", release);
  for (const ev of INTERRUPTS) window.removeEventListener(ev, release);
  publish();
};

const onAnchorScroll = (e: Event) => {
  const id = (e as CustomEvent<AnchorScrollDetail>).detail?.id;
  if (!id) return;

  locked = true;
  setActive(navIds.has(id) ? id : null);  // see "destinations that aren't nav items"

  cancelAnimationFrame(raf);
  clearTimeout(guard);
  guard = window.setTimeout(release, 2000);
  for (const ev of INTERRUPTS) {
    window.addEventListener(ev, release, { passive: true, once: true });
  }

  if ("onscrollend" in window) {
    window.addEventListener("scrollend", release, { once: true });
  } else {
    const started = performance.now();
    let last = NaN;
    let still = 0;
    const settle = () => {
      const y = window.scrollY;
      still = y === last ? still + 1 : 0;
      last = y;
      if (still >= 3 && performance.now() - started > 120) release();
      else raf = requestAnimationFrame(settle);
    };
    raf = requestAnimationFrame(settle);
  }
};

window.addEventListener(ANCHOR_SCROLL, onAnchorScroll);
```

Tear down all of it together — observer, event listener, `scrollend`,
interrupts, `raf`, `guard`. A leaked `scrollend` listener holding a closure
over a dead `release` is a silent memory leak.

---

## 4. Checklist of things that are easy to miss

- **Find every scroller.** Grep for `scrollIntoView`, `scrollTo`, `scrollBy`,
  `location.hash =`, and any router-level scroll. In one real codebase the nav
  links were fixed while a command palette kept calling `scrollIntoView`
  directly and kept strobing. *Every* path must announce.
- **Destinations that are not nav items.** `#top` and `#contact` are real
  scroll targets but have no nav entry. The honest pinned state for them is
  "nothing highlighted", not "leave the previous one lit".
- **Sort sections by document order**, via `compareDocumentPosition` — not by
  the order your links array happens to list them. "Last one wins" is only
  correct against true document order, and nothing stops the two diverging
  when someone reorders the nav.
- **Reduced motion.** If `prefers-reduced-motion` forces `scroll-behavior:
  auto`, the scroll is instant and `scrollend` fires almost immediately. The
  lock still works; it just releases at once. Verify rather than assume.
- **Progressive enhancement.** With JS off the links must still navigate. The
  highlight is decoration; never make it load-bearing.
- **Do not write the fragment to the URL if you also strip it.** If your site
  scrolls without setting `location.hash`, there is no `hashchange` to hang
  anything on — which is another reason the custom event is the right
  carrier.

## 5. How to verify

The decision logic is testable without a browser. Simulate a journey and
assert on the **sequence** of published values, which is what the bug is
about:

```
about -> contact
  without lock:  ["about", "experience", "work", "stack", null]   <- the strobe
  with lock:     ["about", null]                                   <- fixed
```

Then check in a real browser, because the timing cannot be simulated:

1. Distant jump down (About → Contact) — one transition, no intermediates.
2. Distant jump up (Stack → About) — same.
3. Adjacent jump — still lands correctly, no regression.
4. **Interrupt:** click a distant link, then immediately scroll with the wheel.
   The highlight must follow your wheel, not stay pinned to the abandoned
   destination.
5. **Stuck-lock check:** click a link, switch browser tabs mid-scroll, come
   back. `requestAnimationFrame` is paused while hidden, so this is the case
   the 2s backstop exists for.
6. Free scrolling with no clicks — the observer behaves exactly as before.

Failure-mode triage: highlight lags after arriving → suspect the `scrollend`
path. Highlight releases early on long jumps → suspect the settle floor.
Highlight freezes permanently → a release path is not firing and the backstop
is your only net; find out which.

---

## Reference implementation in this repo

- `src/lib/anchor-scroll.ts` — the event contract
- `src/components/nav/Nav.tsx` — the listener, lock and observer
- `src/components/AnchorScroll.tsx` — delegated link handler, emitter
- `src/components/CommandPalette.tsx` — second emitter
