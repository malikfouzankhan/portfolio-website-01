"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** One shared observer for every reveal on the page, instead of one per
 *  component. Elements register on mount and unregister on unmount. */
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(el: Element, onShow: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        observer?.unobserve(entry.target);
        callbacks.delete(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  callbacks.set(el, onShow);
  observer.observe(el);

  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

type RevealProps = {
  children: ReactNode;
  /** Stagger index — multiplied into the CSS transition delay. */
  index?: number;
  as?: ElementType;
  className?: string;
  id?: string;
};

export default function Reveal({
  children,
  index = 0,
  as: Tag = "div",
  className,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  /* The element renders with NO `data-reveal` attribute, i.e. fully visible.
     This effect is what hides it and hands it to the observer — so if JS never
     runs, or throws, the content is still readable rather than stranded at
     opacity 0. State lives on the DOM node rather than in React because
     nothing else needs to re-render when an element reveals. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    el.dataset.reveal = "pending";

    // Already on screen at mount — reveal on the next frame so the transition
    // still plays instead of snapping.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => {
        el.dataset.reveal = "shown";
      });
      return () => cancelAnimationFrame(raf);
    }

    return observe(el, () => {
      el.dataset.reveal = "shown";
    });
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={index ? ({ "--reveal-delay": `${index * 0.09}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
