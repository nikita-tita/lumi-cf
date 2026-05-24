/// <reference types="@cloudflare/workers-types" />
import { createClient } from "@supabase/supabase-js";
import {
  renderWelcomeHtml,
  renderWelcomeSubject,
  renderWelcomeText,
} from "../../lib/welcome-email";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
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

const SEED = 1200;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function randomRef() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

type InsertResult =
  | { kind: "ok"; position: number; refCode: string; duplicate?: boolean }
  | { kind: "fail"; reason: string };

async function insertSupabase(
  env: Env,
  params: {
    email: string;
    name: string | null;
    note: string | null;
    source: string;
    referredBy: string | null;
  },
): Promise<InsertResult> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return { kind: "fail", reason: "supabase-not-configured" };
  }
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-client-info": "lumi-bff/cf" } },
  });

  const { data: existing, error: selErr } = await supabase
    .from("waitlist")
    .select("position, ref_code")
    .eq("email", params.email)
    .maybeSingle();

  if (selErr) return { kind: "fail", reason: `select: ${selErr.message}` };
  if (existing) {
    return {
      kind: "ok",
      position: existing.position,
      refCode: existing.ref_code,
      duplicate: true,
    };
  }

  const { count, error: cntErr } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true });

  if (cntErr) return { kind: "fail", reason: `count: ${cntErr.message}` };

  const position = SEED + (count ?? 0) + 1;
  const refCode = randomRef();

  const { error: insErr } = await supabase.from("waitlist").insert({
    email: params.email,
    name: params.name,
    note: params.note,
    source: params.source,
    referred_by: params.referredBy,
    ref_code: refCode,
    position,
  });

  if (insErr) return { kind: "fail", reason: `insert: ${insErr.message}` };
  return { kind: "ok", position, refCode };
}

async function sendWelcomeEmail(
  apiKey: string,
  payload: {
    to: string;
    name: string | null;
    position: number;
    refCode: string;
    duplicate: boolean;
  },
) {
  const params = {
    name: payload.name,
    email: payload.to,
    position: payload.position,
    refCode: payload.refCode,
    duplicate: payload.duplicate,
  };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lumi <hello@lumi.estate>",
      to: [payload.to],
      subject: renderWelcomeSubject(params),
      html: renderWelcomeHtml(params),
      text: renderWelcomeText(params),
      reply_to: "hello@lumi.estate",
    }),
  });
  if (!res.ok) {
    console.warn("[waitlist] resend failed:", res.status, await res.text());
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

  if (hp) {
    return Response.json({ ok: true, position: 1, refCode: "bot" });
  }
  if (!email || !emailRe.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // Turnstile is enforced only if a secret is configured. Without secret —
  // skipped (dev / initial setup). With secret — required and verified.
  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get("CF-Connecting-IP");
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstileToken, ip);
    if (!ok) {
      return Response.json(
        { error: "Captcha verification failed. Please reload the page and try again." },
        { status: 403 },
      );
    }
  }

  const result = await insertSupabase(env, { email, name, note, source, referredBy });

  if (result.kind === "fail") {
    console.error("[waitlist] supabase failed, email only in logs:", {
      email,
      source,
      referredBy,
      reason: result.reason,
    });
    return Response.json({
      ok: true,
      position: SEED + 1,
      refCode: randomRef(),
      degraded: true,
    });
  }

  if (env.RESEND_API_KEY) {
    try {
      await sendWelcomeEmail(env.RESEND_API_KEY, {
        to: email,
        name,
        position: result.position,
        refCode: result.refCode,
        duplicate: !!result.duplicate,
      });
    } catch (e) {
      console.warn(
        "[waitlist] welcome email exception:",
        e instanceof Error ? e.message : String(e),
      );
    }
  }

  return Response.json({
    ok: true,
    position: result.position,
    refCode: result.refCode,
    ...(result.duplicate ? { duplicate: true } : {}),
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ count: 0 });
  }
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { count } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true });
  return Response.json({ count: count ?? 0 });
};
