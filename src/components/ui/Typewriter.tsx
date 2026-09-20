"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 60;
const DELETE_MS = 35;
const HOLD_MS = 1800;
const PAUSE_MS = 220;

export default function Typewriter({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [typing, setTyping] = useState(true);
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
    if (!animate) return;
    const target = words[index];

    if (typing) {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS);
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
      setIndex((prev) => (prev + 1) % words.length);
      setTyping(true);
    }, PAUSE_MS);
    return () => clearTimeout(t);
  }, [animate, text, typing, index, words]);

  return (
    <p
      className="font-mono text-[0.95rem] tracking-[0.05em] text-accent-ink md:text-[clamp(1rem,2.5vw,1.35rem)]"
      // Screen readers get the full list once rather than every keystroke.
      aria-label={words.join(", ")}
    >
      <span aria-hidden>
        <span className="text-text-muted">&gt;</span> {text}
        {animate && <span className="animate-blink ml-0.5">|</span>}
      </span>
    </p>
  );
}
