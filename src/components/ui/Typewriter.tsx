"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 60;
const DELETE_MS = 35;
const HOLD_MS = 1800;
const PAUSE_MS = 220;

/** Purely visual: renders `aria-hidden`, so the caller owns the accessible
 *  text. A `<p aria-label>` was tried and does nothing — paragraphs cannot be
 *  named, so screen readers heard an empty line.
 *
 *  Cycles the words ONCE and settles back on the first. An endless loop beside
 *  the bio kept pulling the eye off the one sentence that matters, and a
 *  visitor could land mid-deletion on a half-typed word. */
export default function Typewriter({
  words,
  className = "",
}: {
  words: readonly string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [typing, setTyping] = useState(true);
  const [wrapped, setWrapped] = useState(false);
  const [done, setDone] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Renders the first word statically until we've confirmed motion is wanted,
  // so SSR output is meaningful and reduced-motion users get a stable string.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setAnimate(!mq.matches);
      if (mq.matches) setText(words[0]);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [words]);

  useEffect(() => {
    if (!animate || done) return;
    const target = words[index];

    if (typing) {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS);
        return () => clearTimeout(t);
      }
      // Back on the first word after a full pass: stop here for good.
      if (wrapped && index === 0) {
        const t = setTimeout(() => setDone(true), PAUSE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (text.length > 0) {
      const t = setTimeout(() => setText(target.slice(0, text.length - 1)), DELETE_MS);
      return () => clearTimeout(t);
    }

    // Deletion finished — advance on a short beat rather than synchronously,
    // which would cascade renders inside this effect.
    const t = setTimeout(() => {
      const next = (index + 1) % words.length;
      if (next === 0) setWrapped(true);
      setIndex(next);
      setTyping(true);
    }, PAUSE_MS);
    return () => clearTimeout(t);
  }, [animate, done, text, typing, index, wrapped, words]);

  return (
    <span aria-hidden className={className}>
      {text}
      {animate && !done && <span className="animate-blink ml-0.5">|</span>}
    </span>
  );
}
