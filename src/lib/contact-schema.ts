/** Shared between the server action and the client form so both enforce the
 *  same rules. The client copy is UX only — the server always re-validates. */

export const INTENTS = [
  { id: "hiring", label: "Hiring", subject: "Role opportunity" },
  { id: "freelance", label: "Freelance", subject: "Freelance project" },
  { id: "hello", label: "Just saying hi", subject: "Hello" },
] as const;

export type IntentId = (typeof INTENTS)[number]["id"];

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 200 },
  company: { max: 120 },
  message: { min: 20, max: 4000 },
} as const;

export type FieldName = "name" | "email" | "company" | "message" | "intent" | "form";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Which pipeline node the request reached. Drives the diagram. */
  stage?: "validate" | "verify" | "send" | "done";
  message?: string;
  /** Real Resend id on success — not a fabricated receipt. */
  messageId?: string;
  errors?: Partial<Record<FieldName, string>>;
  /** Echoed back so a no-JS re-render doesn't wipe what they typed. */
  values?: Record<string, string>;
};

export const initialContactState: ContactState = { status: "idle" };

// Deliberately permissive: overly clever email regexes reject valid addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(fields: {
  name: string;
  email: string;
  company: string;
  message: string;
  intent: string;
}) {
  const errors: Partial<Record<FieldName, string>> = {};

  const name = fields.name.trim();
  if (name.length < LIMITS.name.min) errors.name = "Tell me who you are.";
  else if (name.length > LIMITS.name.max) errors.name = "That's a very long name.";

  const email = fields.email.trim();
  if (!email) errors.email = "I need somewhere to reply.";
  else if (!EMAIL.test(email)) errors.email = "That doesn't look like an email address.";
  else if (email.length > LIMITS.email.max) errors.email = "That address is too long.";

  if (fields.company.trim().length > LIMITS.company.max)
    errors.company = "Keep it under 120 characters.";

  const message = fields.message.trim();
  if (message.length < LIMITS.message.min)
    errors.message = `A little more detail — ${LIMITS.message.min - message.length} more characters.`;
  else if (message.length > LIMITS.message.max)
    errors.message = "That's longer than I can take by email. Trim it down?";

  if (!INTENTS.some((i) => i.id === fields.intent)) errors.intent = "Pick one.";

  return { errors, ok: Object.keys(errors).length === 0 };
}

export function byteLength(s: string) {
  return new TextEncoder().encode(s).length;
}
