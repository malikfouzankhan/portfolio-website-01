"use client";

import { useEffect } from "react";
import { announceAnchorScroll } from "@/lib/anchor-scroll";

/* Same-page links scroll without ever writing a fragment to the URL.

   The markup keeps its real `<a href="#work">` anchors — that is the only
   thing a plain anchor can express on a one-page document, and it is what
   keeps the nav working with JS off, crawlable, and openable in a new tab.
   What is not wanted is the fragment SURVIVING the scroll: on a site whose
   canonical URL is "/", a leftover `#work` is state nobody asked for. It
   re-jumps on reload, it makes clicking the same nav item twice a no-op
   (no hashchange fires when the hash is already set), and it trips the
   `!location.hash` gate in layout.tsx — so a refresh silently skips the
   preloader, which is the bug that prompted this.

   One delegated listener rather than per-link handlers, so the anchors in
   server components (Hero's CTAs, Footer's back-to-top, the skip link) are
   covered without turning any of them into client components.
   CommandPalette already navigates this way; this brings the rest in line. */

export default function AnchorScroll() {
  useEffect(() => {
    /* An inbound deep link (`/#work` from elsewhere) still lands where it
       should — the browser jumped before this ever ran, and layout.tsx
       deliberately skips the preloader for it. Clearing the fragment
       afterwards means every RELOAD from then on is an ordinary visit to
       "/". replaceState, not pushState: the landing is not a second entry. */
    if (location.hash) {
      const url = location.pathname + location.search;
      requestAnimationFrame(() => history.replaceState(null, "", url));
    }

    const onClick = (e: MouseEvent) => {
      // Anything but an unmodified primary click belongs to the browser —
      // cmd-click and middle-click must still open a real URL in a new tab.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      // Bare "#" and fragments with no match fall through to the browser
      // rather than being swallowed.
      const target = document.getElementById(anchor.getAttribute("href")!.slice(1));
      if (!target) return;

      e.preventDefault();
      // `scroll-padding-top` from globals.css applies to scrollIntoView the
      // same way it applies to a fragment jump, so the fixed nav still
      // clears the heading without a per-section offset.
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Announced after the scroll is under way, so a listener that waits for
      // `scrollend` cannot be armed before the scroll it is waiting on.
      announceAnchorScroll(target.id);

      /* Fragment navigation moves the FOCUS target as well as the viewport.
         Dropping that half would leave a keyboard or screen-reader user at
         the top of the document while the page scrolled away beneath them,
         and would break the skip link outright. `preventScroll` stops
         focus() from cancelling the smooth scroll it was just handed; the
         outline only ever renders for :focus-visible, so a mouse click on a
         section draws nothing. */
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
