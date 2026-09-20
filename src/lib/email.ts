import { profile } from "@/data/profile";

/* Email templates.

   These deliberately do NOT share the site's CSS. Mail clients don't support
   custom properties, flexbox or grid, Outlook renders through Word, and web
   fonts almost never load — so this is table markup with inline styles and a
   system font stack throughout.

   The palette is the site's LIGHT theme rather than the dark one: a parchment
   ground survives the aggressive auto-inversion Gmail and Outlook apply in
   dark mode far better than a near-black card, which tends to come out muddy
   or half-inverted. */

const C = {
  ground: "#FBF4E6",
  card: "#FFFCF6",
  line: "#EADFC9",
  ink: "#3B1B20",
  inkDim: "#6B3540",
  inkMuted: "#854854",
  accent: "#F7B538", // fills — black text on top
  accentInk: "#90111F", // accent-coloured text
} as const;

const FONT_SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const FONT_MONO =
  "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

/** Subject lines are a mail *header*. CR/LF there is a header-injection
 *  vector, so strip control characters and collapse whitespace. */
function safeSubject(s: string) {
  return s.replace(/[\r\n\t\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape, then preserve author line breaks. `white-space: pre-wrap` is not
 *  reliable in Outlook, so newlines become explicit <br>. */
function escapeMultiline(s: string) {
  return escapeHtml(s).replace(/\r?\n/g, "<br />");
}

/** Sits at the top of the inbox preview line, invisible in the body. */
function preheader(text: string) {
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.ground};opacity:0">${escapeHtml(
    text,
  )}</div>`;
}

function label(text: string) {
  return `<span style="font-family:${FONT_MONO};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${C.inkMuted}">${escapeHtml(
    text,
  )}</span>`;
}

/** Outer shell: full-bleed ground, centred 600px card with the amber rule. */
function shell(inner: string, pre: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(profile.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.ground};">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ground}" style="background-color:${C.ground};margin:0;padding:0;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:${C.card};border:1px solid ${C.line};">
        <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${C.accent};">&nbsp;</td></tr>
        ${inner}
      </table>

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
        <tr><td align="center" style="padding:18px 8px 0;font-family:${FONT_MONO};font-size:11px;line-height:17px;color:${C.inkMuted};">
          Sent from the contact form at
          <a href="https://fouzan.dev" style="color:${C.accentInk};text-decoration:none;">fouzan.dev</a>
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Wordmark, matching the site's MFK. lockup as closely as email allows. */
function wordmark() {
  return `<span style="font-family:${FONT_SANS};font-size:20px;font-weight:700;letter-spacing:2px;color:${C.accentInk};">MFK<span style="color:${C.inkMuted};">.</span></span>`;
}

function metaRow(k: string, valueHtml: string) {
  return `<tr>
    <td style="padding:0 0 10px;">
      <div style="margin:0 0 3px;">${label(k)}</div>
      <div style="font-family:${FONT_SANS};font-size:14px;line-height:20px;color:${C.ink};">${valueHtml}</div>
    </td>
  </tr>`;
}

export function notificationEmail(f: {
  name: string;
  email: string;
  company: string;
  message: string;
  intentLabel: string;
  intentSubject: string;
}) {
  const when = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const inner = `
  <tr>
    <td style="padding:26px 30px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left">${wordmark()}</td>
          <td align="right">
            <span style="display:inline-block;font-family:${FONT_MONO};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.accentInk};border:1px solid ${C.line};background-color:${C.ground};padding:5px 10px;">${escapeHtml(
              f.intentLabel,
            )}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:22px 30px 0;">
      <div style="font-family:${FONT_SANS};font-size:22px;line-height:28px;font-weight:700;color:${C.ink};">New message from ${escapeHtml(
        f.name,
      )}</div>
    </td>
  </tr>

  <tr><td style="padding:20px 30px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${metaRow("From", escapeHtml(f.name))}
      ${metaRow(
        "Email",
        `<a href="mailto:${escapeHtml(f.email)}" style="color:${C.accentInk};text-decoration:none;">${escapeHtml(f.email)}</a>`,
      )}
      ${f.company ? metaRow("Company / role", escapeHtml(f.company)) : ""}
      ${metaRow("Received", escapeHtml(`${when} IST`))}
    </table>
  </td></tr>

  <tr><td style="padding:6px 30px 0;">
    <div style="height:1px;line-height:1px;font-size:0;background-color:${C.line};">&nbsp;</div>
  </td></tr>

  <tr>
    <td style="padding:20px 30px 0;">
      <div style="margin:0 0 8px;">${label("Message")}</div>
      <div style="font-family:${FONT_SANS};font-size:15px;line-height:24px;color:${C.ink};background-color:${C.ground};border-left:3px solid ${C.accent};padding:14px 16px;">${escapeMultiline(
        f.message,
      )}</div>
    </td>
  </tr>

  <tr>
    <td style="padding:24px 30px 30px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="${C.accent}" style="background-color:${C.accent};">
            <a href="mailto:${escapeHtml(f.email)}?subject=${encodeURIComponent(
              "Re: " + f.intentSubject,
            )}" style="display:inline-block;padding:12px 22px;font-family:${FONT_MONO};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#000000;text-decoration:none;">Reply to ${escapeHtml(
              f.name.split(" ")[0],
            )}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  const text = [
    `${f.intentLabel} enquiry`,
    "",
    `From:    ${f.name} <${f.email}>`,
    f.company && `Company: ${f.company}`,
    `Received: ${when} IST`,
    "",
    "-".repeat(46),
    "",
    f.message,
    "",
    "-".repeat(46),
    `Reply directly to this email to reach ${f.name}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: safeSubject(`${f.intentSubject} — ${f.name}`),
    html: shell(
      inner,
      preheader(`${f.intentLabel} · ${f.name} · ${f.message.slice(0, 90)}`),
    ),
    text,
  };
}

export function autoReplyEmail(f: { name: string }) {
  const first = f.name.split(" ")[0];

  const inner = `
  <tr><td style="padding:26px 30px 0;">${wordmark()}</td></tr>

  <tr>
    <td style="padding:20px 30px 0;">
      <div style="font-family:${FONT_SANS};font-size:24px;line-height:30px;font-weight:700;color:${C.ink};">Got your message.</div>
    </td>
  </tr>

  <tr>
    <td style="padding:14px 30px 0;">
      <div style="font-family:${FONT_SANS};font-size:15px;line-height:24px;color:${C.inkDim};">
        Hi ${escapeHtml(first)} — thanks for reaching out. Your message landed in my
        inbox and I read everything that comes through. You&rsquo;ll normally hear
        back from me within a day.
      </div>
      <div style="font-family:${FONT_SANS};font-size:15px;line-height:24px;color:${C.inkDim};padding-top:14px;">
        If it&rsquo;s urgent, just reply to this email directly.
      </div>
    </td>
  </tr>

  <tr><td style="padding:24px 30px 0;">
    <div style="height:1px;line-height:1px;font-size:0;background-color:${C.line};">&nbsp;</div>
  </td></tr>

  <tr>
    <td style="padding:20px 30px 0;">
      <div style="font-family:${FONT_SANS};font-size:15px;line-height:22px;font-weight:700;color:${C.ink};">${escapeHtml(
        profile.name,
      )}</div>
      <div style="font-family:${FONT_MONO};font-size:11px;line-height:18px;letter-spacing:0.8px;color:${C.inkMuted};padding-top:3px;">
        ${escapeHtml(profile.roles[0])} &middot; ${escapeHtml(profile.location)}
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding:16px 30px 30px;">
      ${profile.socials
        .map(
          (s) =>
            `<a href="${s.href}" style="font-family:${FONT_MONO};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${C.accentInk};text-decoration:none;padding-right:16px;">${s.label}</a>`,
        )
        .join("")}
      <a href="https://fouzan.dev" style="font-family:${FONT_MONO};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${C.accentInk};text-decoration:none;">Site</a>
    </td>
  </tr>`;

  const text = [
    `Hi ${first},`,
    "",
    "Thanks for reaching out. Your message landed in my inbox and I read",
    "everything that comes through. You'll normally hear back within a day.",
    "",
    "If it's urgent, just reply to this email directly.",
    "",
    `— ${profile.name}`,
    `${profile.roles[0]} · ${profile.location}`,
    "https://fouzan.dev",
  ].join("\n");

  return {
    subject: "Got your message",
    html: shell(
      inner,
      preheader("Thanks for reaching out — I'll get back to you within a day."),
    ),
    text,
  };
}
