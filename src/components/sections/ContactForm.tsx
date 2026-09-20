"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ArrowUpRight, Check, CornerDownLeft, Loader2, X } from "lucide-react";
import { sendMessage } from "@/app/actions/contact";
import {
  INTENTS,
  LIMITS,
  byteLength,
  initialContactState,
  type IntentId,
} from "@/lib/contact-schema";
import { profile } from "@/data/profile";
import PipelineDiagram from "@/components/ui/PipelineDiagram";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
      getResponse: (id?: string) => string | undefined;
    };
  }
}

const field =
  "w-full border border-line bg-chip px-3 py-2 font-mono text-[0.82rem] text-text placeholder:text-text-muted transition-colors focus:border-accent-ink focus:outline-none";
const labelCls =
  "mb-1 block font-mono text-[0.6rem] tracking-[0.15em] text-text-muted uppercase";

export default function ContactForm({ siteKey }: { siteKey?: string }) {
  const [state, formAction, pending] = useActionState(sendMessage, initialContactState);

  const [intent, setIntent] = useState<IntentId>("hiring");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  /* pending  — widget is still working (or hasn't been interacted with)
     ready    — we hold a token, submission can succeed
     error    — the challenge could not load or run at all (blocked, offline,
                DNS, ad-blocker). The form cannot be submitted in this state,
                so it must be said plainly instead of failing at submit. */
  const [verify, setVerify] = useState<"pending" | "ready" | "error">("pending");
  // Written by an effect rather than rendered from state: the server sees an
  // empty value unless JavaScript actually ran, which is exactly the signal
  // the action needs to tell "no JS" apart from "challenge not completed".
  const jsRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (jsRef.current) jsRef.current.value = "1";
  }, []);

  /* The submit button's `disabled` is driven through a ref and never passed as
     a prop. Server-rendered markup therefore has no `disabled` attribute, so a
     visitor without JavaScript gets a working button and the server's
     explanation — rather than a permanently dead control. React doesn't manage
     the property, so it won't fight this write. */
  const submitRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = submitRef.current;
    if (el) el.disabled = pending || (!!siteKey && verify !== "ready");
  }, [pending, verify, siteKey]);
  // Turnstile can't restyle after render, so the widget is torn down and
  // rebuilt when the site theme changes — otherwise a light-mode visitor gets
  // a dark widget sitting on parchment.
  const [uiTheme, setUiTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setUiTheme(root.dataset.theme === "light" ? "light" : "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Explicit render gives us a handle for reset(). Turnstile tokens are
  // single-use, so a failed submit must re-arm the widget or the next
  // attempt fails with a stale token.
  useEffect(() => {
    if (!scriptReady || !siteKey || !widgetRef.current) return;
    const el = widgetRef.current;
    widgetId.current = window.turnstile!.render(el, {
      sitekey: siteKey,
      // Follows the site toggle, not the OS — "auto" would read the OS
      // preference and mismatch the page.
      theme: uiTheme,
      size: "flexible",
      callback: () => setVerify("ready"),
      "expired-callback": () => setVerify("pending"),
      "timeout-callback": () => setVerify("pending"),
      "error-callback": () => {
        setVerify("error");
        // Returning true would ask Turnstile to retry; we surface the state
        // to the visitor instead of silently spinning.
        return true;
      },
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady, siteKey, uiTheme]);

  useEffect(() => {
    if (state.status !== "error" || !widgetId.current) return;
    // A submitted token is spent, so the widget must be re-armed. Turnstile
    // fires no callback on reset, so the flag has to be flipped here too —
    // otherwise the button stays enabled holding a token the server will
    // reject. One boolean in response to an external system changing state.
    window.turnstile?.reset(widgetId.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVerify("pending");
  }, [state]);

  // ⌘↵ / Ctrl↵ submits from any field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") formRef.current?.requestSubmit();
    };
    const el = formRef.current;
    el?.addEventListener("keydown", onKey);
    return () => el?.removeEventListener("keydown", onKey);
  }, []);

  const err = state.errors ?? {};
  const bytes = byteLength(message);
  const remaining = LIMITS.message.min - message.trim().length;

  const checks = [
    { k: "name", ok: name.trim().length >= LIMITS.name.min, note: name.trim() ? "ok" : "required" },
    { k: "email", ok: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()), note: email.trim() ? "valid" : "required" },
    {
      k: "message",
      ok: remaining <= 0,
      note: remaining > 0 ? `${remaining} more chars` : `${bytes} B`,
    },
  ];

  if (state.status === "success") {
    return (
      <div className="border border-line bg-surface p-6 md:p-8">
        <PipelineDiagram state={state} pending={false} />
        <div className="mt-6 flex items-start gap-3">
          <Check size={18} className="mt-0.5 shrink-0 text-status-live" />
          <div>
            <p className="font-display text-2xl text-text">Message delivered.</p>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed font-light text-text-dim">
              It&apos;s in my inbox and a confirmation is on its way to you. I usually
              reply within a day.
            </p>
            {state.messageId && (
              <p className="mt-3 font-mono text-[0.62rem] tracking-[0.08em] text-text-muted">
                250 OK · queued as {state.messageId}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      )}

      <form
        ref={formRef}
        action={formAction}
        className="border border-line bg-surface p-4 md:p-6"
      >
        {/* Honeypot — hidden from people, irresistible to bots. Positioned
            off-screen rather than display:none, because many bots skip
            non-rendered fields but will happily fill this one. The offset sits
            on the input itself; a zero-size wrapper still leaves the input
            with a bounding box. */}
        <div aria-hidden>
          <label htmlFor="website" className="absolute left-[-9999px] size-0 overflow-hidden">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] size-0 overflow-hidden border-0 p-0 opacity-0"
          />
        </div>

        <input type="hidden" name="js" ref={jsRef} defaultValue="" />

        <fieldset className="mb-4">
          <legend className={labelCls}>What&apos;s this about?</legend>
          <input type="hidden" name="intent" value={intent} />
          <div className="flex flex-wrap gap-2">
            {INTENTS.map((opt) => {
              const on = intent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setIntent(opt.id)}
                  className={`border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.06em] uppercase transition-colors ${
                    on
                      ? "border-accent-ink bg-accent text-black"
                      : "border-line text-text-dim hover:border-accent-ink hover:text-accent-ink focus-visible:border-accent-ink focus-visible:text-accent-ink"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>Name</label>
            <input
              id="name" name="name" required defaultValue={state.values?.name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!err.name} aria-describedby={err.name ? "name-err" : undefined}
              className={field} placeholder="Your name"
            />
            {err.name && <p id="name-err" className="mt-1 font-mono text-[0.65rem] text-status-review">{err.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>Email</label>
            <input
              id="email" name="email" type="email" required defaultValue={state.values?.email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!err.email} aria-describedby={err.email ? "email-err" : undefined}
              className={field} placeholder="you@company.com"
            />
            {err.email && <p id="email-err" className="mt-1 font-mono text-[0.65rem] text-status-review">{err.email}</p>}
          </div>
        </div>

        {intent === "hiring" && (
          <div className="mt-3">
            <label htmlFor="company" className={labelCls}>
              Company / role <span className="normal-case">(optional)</span>
            </label>
            <input id="company" name="company" defaultValue={state.values?.company} className={field} placeholder="Acme — Backend Engineer" />
          </div>
        )}

        <div className="mt-3">
          <label htmlFor="message" className={labelCls}>Message</label>
          <textarea
            id="message" name="message" required rows={4} defaultValue={state.values?.message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!err.message} aria-describedby={err.message ? "message-err" : undefined}
            className={`${field} resize-y`} placeholder="What are you building?"
          />
          {err.message && <p id="message-err" className="mt-1 font-mono text-[0.65rem] text-status-review">{err.message}</p>}
        </div>

        {/* Live validation readout. One wrapping row rather than three stacked
            lines — same information, a third of the height. */}
        <ul className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-[0.6rem] tracking-[0.06em]">
          {checks.map((c) => (
            <li key={c.k} className="flex items-center gap-1.5">
              <span className={c.ok ? "text-status-live" : "text-text-muted"}>
                {c.ok ? "✓" : "·"}
              </span>
              <span className="text-text-muted uppercase">{c.k}</span>
              <span className={c.ok ? "text-text-dim" : "text-text-muted"}>{c.note}</span>
            </li>
          ))}
        </ul>

        {siteKey && <div ref={widgetRef} className="mt-3 min-h-[65px]" />}

        {err.form && (
          <p className="mt-3 flex items-start gap-2 border border-status-review/40 bg-status-review/8 p-3 font-mono text-[0.68rem] leading-relaxed text-status-review">
            <X size={13} className="mt-0.5 shrink-0" />
            {err.form}
          </p>
        )}

        {pending && (
          <div className="mt-4">
            <PipelineDiagram state={state} pending />
          </div>
        )}

        {siteKey && verify !== "ready" && scriptReady && (
          <p
            className={`mt-3 font-mono text-[0.66rem] leading-relaxed ${
              verify === "error" ? "text-status-review" : "text-text-muted"
            }`}
          >
            {verify === "error" ? (
              <>
                The verification challenge couldn&apos;t load — an ad blocker or
                network filter may be blocking it. Email me at{" "}
                <a href={`mailto:${profile.email}`} className="text-accent-ink underline">
                  {profile.email}
                </a>{" "}
                instead.
              </>
            ) : (
              "Complete the verification above to enable sending."
            )}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            ref={submitRef}
            type="submit"
            className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-[0.75rem] font-medium tracking-[0.1em] text-black uppercase transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
            {pending ? "Sending" : "Send message"}
          </button>
          <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] text-text-muted">
            <CornerDownLeft size={11} /> ⌘↵ to send · payload {bytes} B
          </span>
        </div>

        {/* Status for assistive tech — the diagram is decorative. */}
        <p aria-live="polite" className="sr-only">
          {pending ? "Sending your message" : state.message ?? ""}
        </p>

        <noscript>
          <p className="mt-4 font-mono text-[0.68rem] leading-relaxed text-text-dim">
            This form needs JavaScript to verify you&apos;re human. Email me directly at{" "}
            <a href={`mailto:${profile.email}`} className="text-accent-ink underline">{profile.email}</a>.
          </p>
        </noscript>
      </form>
    </>
  );
}
