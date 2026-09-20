"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { profile } from "@/data/profile";
import { INTENTS, validate, type ContactState } from "@/lib/contact-schema";
import { autoReplyEmail, notificationEmail } from "@/lib/email";

const TURNSTILE_VERIFY =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // No secret configured — treat verification as unavailable rather than
  // silently accepting everything.
  if (!secret) return { ok: false, reason: "not-configured" as const };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success
      ? { ok: true as const }
      : { ok: false, reason: "rejected" as const };
  } catch {
    return { ok: false, reason: "unreachable" as const };
  }
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "");

  const fields = {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    message: get("message"),
    intent: get("intent"),
  };
  // Echo input back so a no-JS re-render doesn't wipe the form.
  const values = { ...fields };

  // Honeypot: a real person never fills a field they cannot see. Report
  // success so the bot doesn't learn anything, but send nothing.
  if (get("website").trim() !== "") {
    return { status: "success", stage: "done", message: "Thanks — message sent." };
  }

  const { errors, ok } = validate(fields);
  if (!ok) {
    return {
      status: "error",
      stage: "validate",
      errors,
      values,
      message: "Some fields need attention.",
    };
  }

  const token = get("cf-turnstile-response");
  if (!token) {
    // An empty token has two very different causes and they must not share a
    // message. The `js` marker is rendered by an effect, so its presence proves
    // JavaScript ran — in which case the challenge simply didn't complete
    // (not ticked, expired, or blocked by an extension).
    const jsRan = get("js") === "1";
    return {
      status: "error",
      stage: "verify",
      values,
      errors: {
        form: jsRan
          ? `The human-verification step didn't complete. Tick the verification box and try again, or email me at ${profile.email}.`
          : `This form needs JavaScript to verify you're human. Email me directly at ${profile.email} instead.`,
      },
      message: jsRan ? "Verification incomplete." : "Verification unavailable.",
    };
  }

  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? null;

  const check = await verifyTurnstile(token, ip);
  if (!check.ok) {
    return {
      status: "error",
      stage: "verify",
      values,
      errors: {
        form:
          check.reason === "rejected"
            ? "Verification failed. Refresh the page and try again."
            : `Couldn't reach the verification service. Email me directly at ${profile.email}.`,
      },
      message: "Verification failed.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.RESEND_FROM_VERIFIED;

  if (!apiKey || !to || !from) {
    return {
      status: "error",
      stage: "send",
      values,
      errors: { form: `Mail isn't configured right now. Reach me at ${profile.email}.` },
      message: "Not configured.",
    };
  }

  const resend = new Resend(apiKey);
  const intent = INTENTS.find((i) => i.id === fields.intent)!;
  const name = fields.name.trim();
  const email = fields.email.trim();
  const company = fields.company.trim();
  const message = fields.message.trim();

  const mail = notificationEmail({
    name,
    email,
    company,
    message,
    intentLabel: intent.label,
    intentSubject: intent.subject,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: `Portfolio <${from}>`,
      to: [to],
      // So replying in the mail client goes straight back to the sender.
      replyTo: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });

    if (error) {
      return {
        status: "error",
        stage: "send",
        values,
        errors: { form: `Couldn't send that. Try ${profile.email} directly.` },
        message: error.message ?? "Send failed.",
      };
    }

    // Auto-reply is best-effort. If it fails the visitor's message still
    // arrived, so it must never turn a success into a failure.
    try {
      const reply = autoReplyEmail({ name });
      await resend.emails.send({
        from: `${profile.name} <${from}>`,
        to: [email],
        replyTo: to,
        subject: reply.subject,
        text: reply.text,
        html: reply.html,
      });
    } catch {
      // Swallowed deliberately; see comment above.
    }

    return {
      status: "success",
      stage: "done",
      message: "Message delivered.",
      messageId: data?.id,
    };
  } catch (err) {
    return {
      status: "error",
      stage: "send",
      values,
      errors: { form: `Something broke on my end. Try ${profile.email} directly.` },
      message: err instanceof Error ? err.message : "Unknown error.",
    };
  }
}
