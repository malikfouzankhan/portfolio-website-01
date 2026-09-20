/** Announced whenever something starts a scroll to an in-page section —
 *  AnchorScroll's delegated link handler, or the command palette.
 *
 *  It exists for the nav highlight. A smooth scroll from #about to #contact
 *  physically passes through experience, work and stack, so an
 *  IntersectionObserver watching the viewport correctly — and uselessly —
 *  reports each of them in turn, and the highlight strobes down the nav
 *  before settling. The listener uses this to pin the highlight to the
 *  destination and ignore everything the journey crosses.
 *
 *  A DOM event rather than shared state: the emitters and the listener are
 *  unrelated components in different subtrees, and neither should have to
 *  know the other exists. */
export const ANCHOR_SCROLL = "mfk:anchor-scroll";

export type AnchorScrollDetail = { id: string };

export function announceAnchorScroll(id: string) {
  window.dispatchEvent(
    new CustomEvent<AnchorScrollDetail>(ANCHOR_SCROLL, { detail: { id } }),
  );
}
