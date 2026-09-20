"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyEmail({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The mailto
      // link next to this button still works, so fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`group inline-flex items-center gap-2 border border-line px-4 py-3 font-mono text-[0.72rem] tracking-[0.1em] text-text-dim uppercase transition-colors hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink ${className}`}
    >
      {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      <span>{copied ? "Copied" : "Copy email"}</span>
      <span className="sr-only">{email}</span>
    </button>
  );
}
