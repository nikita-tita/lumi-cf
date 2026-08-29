/// <reference types="@cloudflare/workers-types" />
import {
  renderWelcomeHtml,
  renderWelcomeSubject,
  renderWelcomeText,
} from "../../lib/welcome-email";

// No datastore. Leads are delivered straight to the owner:
//   1. Telegram  — primary channel (always on if the bot secrets are set).
//   2. Email      — secondary channel via Resend (owner notification + a
//                   courtesy welcome to the applicant).
// The old Supabase waitlist (project lumi-rag) was deprovisioned; writing to
// it silently lost every signup. This path has no single point of failure that
// can swallow a lead without a trace.
interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  OWNER_EMAIL?: string;
}

const OWNER_EMAIL_FALLBACK = "hello@lumi.estate";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Lead = {
  email: string;
  name: string | null;
  note: string | null;
  source: string;
  referredBy: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Primary delivery: Telegram DM to the owner. Best-effort — returns whether
// the lead actually reached Telegram so the caller can detect total failure.
async function notifyTelegram(env: Env, lead: Lead): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  // Маркировка (29.08.2026). В этот чат пишут несколько проектов сразу, и все
  // начинали сообщение словом «заявка» — разобрать, с какого сайта пришёл лид,
  // было нельзя. Первая строка называет проект, последняя несёт хэштеги:
  // в Telegram они кликабельны, это готовый фильтр по чату.
  // Пустую строку-разделитель сюда класть нельзя — .filter(Boolean) съест ""
  // вместе с null, и разделитель молча исчезнет.
  const lines = [
    "🏠 Lumi · waitlist",
    lead.email,
    lead.name ? `Имя: ${lead.name}` : null,
    lead.note ? `Заметка: ${lead.note}` : null,
    `Источник: ${lead.source}${lead.referredBy ? ` · реф: ${lead.referredBy}` : ""}`,
    "#lumi #waitlist",
  ].filter(Boolean);
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join("\n") }),
      },
    );
    if (!res.ok) console.warn("[waitlist] telegram non-ok:", res.status);
    return res.ok;
  } catch (e) {
    console.warn("[waitlist] telegram failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

// Secondary delivery: email the lead to the owner via Resend. reply_to is the
// applicant so the owner can answer them directly from the inbox.
async function notifyOwnerEmail(
  apiKey: string,
  ownerEmail: string,
  lead: Lead,
): Promise<boolean> {
  const text = [
    "Новая заявка в waitlist Lumi.",
    "",
    `Email: ${lead.email}`,
    `Имя: ${lead.name || "—"}`,
    `Заметка: ${lead.note || "—"}`,
    `Источник: ${lead.source}`,
    `Реферал: ${lead.referredBy || "—"}`,
  ].join("\n");
  const row = (k: string, v: string) =>
    `<tr><td style="padding:2px 12px 2px 0;color:#52525B;">${k}</td><td style="color:#09090B;">${v}</td></tr>`;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.6;color:#09090B;">
  <p style="font-weight:700;margin:0 0 12px;">🏠 Новая заявка в waitlist Lumi</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">
    ${row("Email", `<a href="mailto:${escapeHtml(lead.email)}" style="color:#2563EB;">${escapeHtml(lead.email)}</a>`)}
    ${row("Имя", lead.name ? escapeHtml(lead.name) : "—")}
    ${row("Заметка", lead.note ? escapeHtml(lead.note) : "—")}
    ${row("Источник", escapeHtml(lead.source))}
    ${row("Реферал", lead.referredBy ? escapeHtml(lead.referredBy) : "—")}
  </table>
</div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lumi <hello@lumi.estate>",
        to: [ownerEmail],
        subject: `Новая заявка: ${lead.email}`,
        reply_to: lead.email,
        text,
        html,
      }),
    });
    if (!res.ok) console.warn("[waitlist] owner email non-ok:", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.warn("[waitlist] owner email failed:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

// Courtesy welcome to the applicant. Non-blocking, failure is only logged.
async function sendWelcomeEmail(apiKey: string, lead: Lead): Promise<void> {
  const params = { name: lead.name, email: lead.email };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lumi <hello@lumi.estate>",
        to: [lead.email],
        subject: renderWelcomeSubject(params),
        html: renderWelcomeHtml(params),
        text: renderWelcomeText(params),
        reply_to: "hello@lumi.estate",
      }),
    });
    if (!res.ok) console.warn("[waitlist] welcome non-ok:", res.status, await res.text());
  } catch (e) {
    console.warn("[waitlist] welcome failed:", e instanceof Error ? e.message : String(e));
  }
}

async function verifyTurnstile(
  secret: string,
  token: string | null | undefined,
  ip: string | null,
): Promise<boolean> {
  if (!token) return false;
  const form = new URLSearchParams({
    secret,
    response: token,
    ...(ip ? { remoteip: ip } : {}),
  });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").toLowerCase().trim();
  const name = body.name ? String(body.name).trim().slice(0, 80) : null;
  const note = body.note ? String(body.note).trim().slice(0, 160) : null;
  const source = body.source ? String(body.source).slice(0, 120) : "/";
  const referredBy = body.referredBy ? String(body.referredBy).slice(0, 32) : null;
  const turnstileToken = body.turnstileToken ? String(body.turnstileToken) : null;
  const hp = body.hp ? String(body.hp) : "";

  // Honeypot — pretend success, deliver nothing.
  if (hp) {
    return Response.json({ ok: true });
  }
  if (!email || !emailRe.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // Turnstile is enforced only if a secret is configured. Without secret —
  // skipped (dev / initial setup). With secret — required and verified.
  if (env.TURNSTILE_SECRET_KEY) {
    // No token at all is a different failure from a bad one. The widget only
    // renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY was set at build time, and
    // nothing ties that to this secret — so enforcing here while the site key
    // is unset 403s every single signup. Same silence if an extension blocks
    // the Turnstile script. Either way "reload the page" is useless advice, so
    // hand over an address that works instead.
    if (!turnstileToken) {
      console.error(
        "[waitlist] turnstile enforced but the client sent no token — is NEXT_PUBLIC_TURNSTILE_SITE_KEY set for the build?",
      );
      return Response.json(
        {
          ok: false,
          error: `We couldn't run the anti-spam check — it may be blocked by a browser extension. Please email ${OWNER_EMAIL_FALLBACK} and we'll add you by hand.`,
        },
        { status: 403 },
      );
    }
    const ip = request.headers.get("CF-Connecting-IP");
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken, ip);
    if (!ok) {
      return Response.json(
        {
          ok: false,
          error: "Captcha verification failed. Please reload the page and try again.",
        },
        { status: 403 },
      );
    }
  }

  const lead: Lead = { email, name, note, source, referredBy };

  // Deliver to the owner. Telegram is the guaranteed channel; email is added
  // when Resend is configured. A courtesy welcome goes to the applicant too.
  const tg = await notifyTelegram(env, lead);
  let ownerMail = false;
  if (env.RESEND_API_KEY) {
    ownerMail = await notifyOwnerEmail(
      env.RESEND_API_KEY,
      env.OWNER_EMAIL || OWNER_EMAIL_FALLBACK,
      lead,
    );
    await sendWelcomeEmail(env.RESEND_API_KEY, lead);
  }

  if (!tg && !ownerMail) {
    // No channel accepted the lead — surface it loudly so it can be recovered
    // from logs and the misconfiguration gets fixed.
    console.error("[waitlist] lead not delivered via any channel:", JSON.stringify(lead));
    // Must not be 2xx. The client decides success from res.ok, so answering 200
    // here shows "You're in" for a signup that reached nobody — which is how
    // every lead was lost while the old Supabase path was dead.
    return Response.json(
      {
        ok: false,
        error: `Something broke on our side and your signup didn't reach us. Please email ${OWNER_EMAIL_FALLBACK} and we'll add you by hand.`,
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
};

// Liveness for the deploy smoke test. There is no datastore to query, so the
// thing worth asserting is that a delivery channel exists at all — the previous
// handler hardcoded ok:true and stayed green with every channel dead.
// Config presence only, no outbound call: this endpoint is public, and pinging
// Telegram per request would hand out a free way to burn its rate limit.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const telegram = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  const email = Boolean(env.RESEND_API_KEY);
  const ok = telegram || email;
  if (!ok) console.error("[waitlist] no delivery channel is configured");
  return Response.json({ ok }, { status: ok ? 200 : 503 });
};
