/**
 * The waitlist is the only thing this site has to get right, and its failure
 * mode is silent: the visitor is told "You're in" while the lead reaches
 * nobody. That has already happened once in production — the Supabase backend
 * was deprovisioned and every signup was lost behind an ok:true (2fdad05).
 *
 * These tests pin the contract that prevents the retelling: a signup that no
 * channel accepted must never answer 2xx.
 */
import { onRequestGet, onRequestPost } from "../functions/api/waitlist";

type Env = Record<string, string | undefined>;

/** Importing the handler pulls in @cloudflare/workers-types, whose json()
 * resolves to unknown — so the body gets a shape here rather than at each use. */
type Body = { ok?: boolean; degraded?: boolean; error?: string };

const bodyOf = async (res: Response): Promise<Body> =>
  (await res.json()) as Body;

const TG_ENV = { TELEGRAM_BOT_TOKEN: "bot-token", TELEGRAM_CHAT_ID: "42" };

function post(body: unknown, env: Env = {}) {
  const request = new Request("https://lumi.estate/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  // The handler only touches request/env; the rest of the Pages context is not
  // worth faking.
  return (onRequestPost as unknown as (c: unknown) => Promise<Response>)({
    request,
    env,
  });
}

function get(env: Env = {}) {
  return (onRequestGet as unknown as (c: unknown) => Promise<Response>)({ env });
}

/** Telegram/Resend both answer over fetch; steer them per test. */
function mockFetch(ok: boolean) {
  return jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    text: async () => (ok ? "" : "upstream said no"),
    json: async () => ({}),
  });
}

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
  jest.restoreAllMocks();
});

describe("POST /api/waitlist — delivery contract", () => {
  it("does not report success when no channel accepted the lead", async () => {
    global.fetch = mockFetch(false) as unknown as typeof fetch;
    const res = await post({ email: "agent@example.com" }, { ...TG_ENV });

    // The regression guard. The client decides success from res.ok, so any 2xx
    // here shows "You're in" for a lead that went nowhere.
    expect(res.ok).toBe(false);
    expect(res.status).toBeGreaterThanOrEqual(500);

    const body = await bodyOf(res);
    expect(body.ok).toBe(false);
    // The applicant must be given a way back in, not a dead end.
    expect(body.error).toContain("@");
  });

  it("reports success once a channel accepted the lead", async () => {
    global.fetch = mockFetch(true) as unknown as typeof fetch;
    const res = await post({ email: "agent@example.com" }, { ...TG_ENV });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("fails loudly when no channel is configured at all", async () => {
    global.fetch = mockFetch(true) as unknown as typeof fetch;
    const res = await post({ email: "agent@example.com" }, {});

    expect(res.ok).toBe(false);
  });

  it("rejects an invalid email before attempting delivery", async () => {
    const fetchMock = mockFetch(true);
    global.fetch = fetchMock as unknown as typeof fetch;
    const res = await post({ email: "not-an-email" }, { ...TG_ENV });

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows a honeypot hit: bots get success, nothing is delivered", async () => {
    const fetchMock = mockFetch(true);
    global.fetch = fetchMock as unknown as typeof fetch;
    const res = await post(
      { email: "bot@example.com", hp: "filled-by-a-bot" },
      { ...TG_ENV },
    );

    // Lying to the bot is the point — it must not learn it was caught.
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/waitlist — Turnstile", () => {
  const TURNSTILE_ENV = { ...TG_ENV, TURNSTILE_SECRET_KEY: "secret" };

  it("gives a way through when the client sent no token", async () => {
    // The trap: the secret gates enforcement here, but the widget only renders
    // when the site key was set at build time. Set one without the other and
    // every signup 403s — so the message must not be "reload the page".
    const fetchMock = mockFetch(true);
    global.fetch = fetchMock as unknown as typeof fetch;
    const res = await post({ email: "agent@example.com" }, TURNSTILE_ENV);

    expect(res.status).toBe(403);
    const body = await bodyOf(res);
    expect(body.error).toContain("@");
    expect(body.error).not.toMatch(/reload/i);
    // No point asking Cloudflare to verify a token that does not exist.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a token Cloudflare does not accept", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: false }),
      text: async () => "",
    }) as unknown as typeof fetch;
    const res = await post(
      { email: "agent@example.com", turnstileToken: "forged" },
      TURNSTILE_ENV,
    );
    expect(res.status).toBe(403);
  });

  it("delivers once Cloudflare accepts the token", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      text: async () => "",
    }) as unknown as typeof fetch;
    const res = await post(
      { email: "agent@example.com", turnstileToken: "good" },
      TURNSTILE_ENV,
    );
    expect(res.status).toBe(200);
  });

  it("stays out of the way while no secret is configured", async () => {
    global.fetch = mockFetch(true) as unknown as typeof fetch;
    const res = await post({ email: "agent@example.com" }, { ...TG_ENV });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/waitlist — what the deploy smoke test polls", () => {
  it("goes red when no delivery channel is configured", async () => {
    const res = await get({});
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false });
  });

  it("is green with Telegram configured", async () => {
    expect((await get({ ...TG_ENV })).status).toBe(200);
  });

  it("is green with email alone", async () => {
    expect((await get({ RESEND_API_KEY: "re_x" })).status).toBe(200);
  });

  it("is not fooled by a half-configured Telegram", async () => {
    // A chat id without a token cannot deliver anything.
    expect((await get({ TELEGRAM_CHAT_ID: "42" })).status).toBe(503);
  });
});
