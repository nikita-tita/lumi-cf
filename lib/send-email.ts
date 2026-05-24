/**
 * Thin wrapper around Resend's HTTP API — no SDK dependency.
 * Free tier: 3,000 emails/month, 100/day. Docs: https://resend.com/docs/api-reference/emails/send-email
 *
 * Env: RESEND_API_KEY (required to actually send). When absent, calls return
 * { ok: false, reason: "not-configured" } so the waitlist route can skip mail
 * gracefully in dev or when keys rotate.
 */

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Defaults to `Lumi <hello@lumi.estate>`. Override for ops/test flows. */
  from?: string;
  replyTo?: string;
};

type SendResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

const DEFAULT_FROM = "Lumi <hello@lumi.estate>";

export async function sendTransactional(args: SendArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: args.from ?? DEFAULT_FROM,
        to: [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
        reply_to: args.replyTo ?? "hello@lumi.estate",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        reason: `resend-${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id ?? "unknown" };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "unknown",
    };
  }
}
