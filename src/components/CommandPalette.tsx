"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Braces,
  Copy,
  FileText,
  Layers,
  Mail,
  Terminal as TerminalIcon,
  User,
  Wrench,
} from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/BrandIcons";
import { announceAnchorScroll } from "@/lib/anchor-scroll";
import { profile } from "@/data/profile";
import { activeProjects, projects } from "@/data/projects";
import { stack } from "@/data/stack";

/** Loose enough to cover both lucide icons and the inline brand marks. */
type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Contact" | "Links" | "More";
  icon: IconComponent;
  run: () => void;
};

const PROMPT = ">";

export default function CommandPalette({ hasResume = false }: { hasResume?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // `open` is the source of truth; an effect below drives the native dialog to
  // match. Closing via state rather than `dialogRef.current.close()` keeps the
  // ref out of anything computed during render.
  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (hash: string) => {
      close();
      // Let the dialog finish closing before scrolling, or the scroll gets
      // swallowed by the top-layer teardown.
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Same announcement AnchorScroll makes, for the same reason: without
        // it, jumping across the page from here strobes the nav highlight
        // through every section in between.
        announceAnchorScroll(target.id);
      });
    },
    [close],
  );

  const openUrl = useCallback(
    (url: string) => {
      close();
      window.open(url, "_blank", "noreferrer");
    },
    [close],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — the mailto action below still works.
    }
  }, []);

  const actions = useMemo<Action[]>(
    () => [
      { id: "about", label: "About", group: "Navigate", icon: User, run: () => go("#about") },
      { id: "experience", label: "Experience", group: "Navigate", icon: Layers, run: () => go("#experience") },
      { id: "work", label: "Work", hint: `${activeProjects.length} projects`, group: "Navigate", icon: Braces, run: () => go("#work") },
      { id: "stack", label: "Stack", group: "Navigate", icon: Wrench, run: () => go("#stack") },
      { id: "contact", label: "Contact", group: "Navigate", icon: Mail, run: () => go("#contact") },

      { id: "mail", label: "Send an email", hint: profile.email, group: "Contact", icon: Mail, run: () => { close(); window.location.href = `mailto:${profile.email}`; } },
      { id: "copy", label: copied ? "Copied to clipboard" : "Copy email address", group: "Contact", icon: Copy, run: copyEmail },
      // Only offered once the PDF actually exists in public/.
      ...(hasResume
        ? [{ id: "resume", label: "Download résumé", group: "Contact" as const, icon: FileText, run: () => openUrl(profile.resumeHref) }]
        : []),

      { id: "github", label: "GitHub", group: "Links", icon: Github, run: () => openUrl(profile.socials[0].href) },
      { id: "linkedin", label: "LinkedIn", group: "Links", icon: Linkedin, run: () => openUrl(profile.socials[1].href) },
      { id: "twitter", label: "Twitter", group: "Links", icon: Twitter, run: () => openUrl(profile.socials[2].href) },

      { id: "archive", label: "Project archive", hint: "/archive", group: "More", icon: ArrowUpRight, run: () => { close(); window.location.href = "/archive"; } },
      { id: "terminal", label: "Terminal mode", hint: "type >", group: "More", icon: TerminalIcon, run: () => setQuery(PROMPT + " ") },
    ],
    [go, openUrl, close, copyEmail, copied, hasResume],
  );

  const isTerminal = query.trimStart().startsWith(PROMPT);

  const filtered = useMemo(() => {
    if (isTerminal) return [];
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    // Subsequence match, so "cnt" finds "Contact".
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ""} ${a.group}`.toLowerCase();
      let i = 0;
      for (const ch of q) {
        i = hay.indexOf(ch, i);
        if (i === -1) return false;
        i += 1;
      }
      return true;
    });
  }, [actions, query, isTerminal]);

  const grouped = useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const a of filtered) {
      const list = map.get(a.group) ?? [];
      list.push(a);
      map.set(a.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  /* ---- terminal ---- */

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.replace(/^>\s*/, "").trim();
      const [verb, ...args] = cmd.split(/\s+/);
      const out: string[] = [`${PROMPT} ${cmd}`];

      switch (verb) {
        case "":
          break;
        case "help":
          out.push(
            "available commands:",
            "  whoami          who you're talking to",
            "  ls projects     list shipped work",
            "  cat <slug>      read one project",
            "  stack           what I build with",
            "  contact         how to reach me",
            "  clear           wipe the buffer",
            "  exit            leave terminal mode",
          );
          break;
        case "whoami":
          out.push(`${profile.name} — ${profile.roles[0]}`, profile.tagline, `${profile.location} · ${profile.timezone}`);
          break;
        case "ls":
          if (args[0] === "projects" || !args[0]) {
            for (const p of projects) {
              out.push(`  ${p.number}  ${p.slug.padEnd(24)} ${p.status}`);
            }
          } else {
            out.push(`ls: cannot access '${args[0]}': no such directory`);
          }
          break;
        case "cat": {
          const p = projects.find((x) => x.slug === args[0]);
          if (!p) {
            out.push(`cat: ${args[0] ?? ""}: no such project`, "try: ls projects");
          } else {
            out.push(`# ${p.title}`, `role: ${p.role}${p.teamSize ? ` · ${p.teamSize}` : ""}`, `status: ${p.status}`, "", p.description);
            if (p.outcome) out.push("", p.outcome);
            out.push("", `stack: ${p.tags.join(", ")}`);
            if (p.live) out.push(`live: ${p.live}`);
            if (p.github) out.push(`source: ${p.github}`);
          }
          break;
        }
        case "stack":
          for (const g of stack) out.push(`${g.label}:`, `  ${g.items.join(", ")}`);
          break;
        case "contact":
          out.push(`email:    ${profile.email}`, ...profile.socials.map((s) => `${s.label.toLowerCase().padEnd(9)} ${s.href}`));
          break;
        case "clear":
          setLines([]);
          setQuery(PROMPT + " ");
          return;
        case "exit":
          setLines([]);
          setQuery("");
          return;
        default:
          out.push(`command not found: ${verb}`, "try: help");
      }

      setLines((prev) => [...prev, ...out]);
      setQuery(PROMPT + " ");
    },
    [],
  );

  /* ---- open / close plumbing ---- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sync the native dialog to `open`, and reset the palette on the way out.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  // Every close funnels through the dialog's native `close` event — Esc,
  // backdrop click, and our own state-driven close alike — so the reset lives
  // here, in one place, as an external-event callback.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setOpen(false);
      setQuery("");
      setActive(0);
      setLines([]);
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Entering terminal mode from a clicked row moves focus to that button —
  // put it back on the input so you can start typing commands.
  useEffect(() => {
    if (isTerminal) inputRef.current?.focus();
  }, [isTerminal]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isTerminal) {
      if (e.key === "Enter") {
        e.preventDefault();
        runCommand(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  }

  let cursor = -1;

  return (
    <dialog
      ref={dialogRef}
      // Clicking the backdrop (the dialog element itself) dismisses.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-label="Command palette"
      className="m-0 w-full max-w-xl border border-line bg-surface p-0 text-text backdrop:bg-black/70 backdrop:backdrop-blur-sm open:top-1/2 open:left-1/2 open:-translate-x-1/2 open:-translate-y-1/2 sm:max-w-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <TerminalIcon size={15} aria-hidden className="shrink-0 text-accent-ink" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Selection is derived from the query — reset it here rather than
            // in an effect that would re-render a second time.
            setActive(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search, or type > for a terminal"
          aria-label="Search commands"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent font-mono text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
        <kbd className="hidden shrink-0 border border-line-soft px-1.5 py-0.5 font-mono text-[0.6rem] text-text-muted sm:block">
          ESC
        </kbd>
      </div>

      {isTerminal ? (
        <div className="max-h-[60vh] overflow-y-auto p-4 font-mono text-[0.78rem] leading-relaxed">
          {lines.length === 0 ? (
            <p className="text-text-muted">
              terminal ready — type <span className="text-accent-ink">help</span> and hit enter
            </p>
          ) : (
            <pre className="whitespace-pre-wrap text-text-dim">
              {lines.map((l, i) => (
                <span key={i} className={l.startsWith(PROMPT) ? "block text-accent-ink" : "block"}>
                  {l}
                </span>
              ))}
            </pre>
          )}
        </div>
      ) : (
        <ul ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {grouped.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-[0.75rem] text-text-muted">
              No matches.
            </li>
          )}
          {grouped.map(([group, items]) => (
            <li key={group}>
              <p className="px-4 pt-3 pb-1.5 font-mono text-[0.58rem] tracking-[0.15em] text-text-muted uppercase">
                {group}
              </p>
              <ul>
                {items.map((a) => {
                  cursor += 1;
                  const index = cursor;
                  const Icon = a.icon;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        data-index={index}
                        onMouseMove={() => setActive(index)}
                        onClick={a.run}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-mono text-[0.8rem] transition-colors ${
                          index === active ? "bg-surface-hi text-accent-ink" : "text-text-dim"
                        }`}
                      >
                        <Icon size={14} className="shrink-0" />
                        <span className="flex-1">{a.label}</span>
                        {a.hint && (
                          <span className="shrink-0 text-[0.68rem] text-text-muted">{a.hint}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </dialog>
  );
}
