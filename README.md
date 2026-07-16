# Lumi Landing

Marketing site + waitlist for Lumi, the chat-first AI assistant for real estate
agents. Next.js 14 App Router, exported as static HTML (`output: "export"`) and
served from Cloudflare Pages. Production: <https://lumi.estate>.

## Dev

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm test
```

The waitlist is a Cloudflare Pages Function, so `next dev` does not serve it.
To exercise the real endpoint, build and run it under wrangler:

```bash
npm run build
npx wrangler pages dev out --port 8788
curl -X POST localhost:8788/api/waitlist -H 'content-type: application/json' \
  -d '{"email":"you@example.com"}'
```

With no secrets set, that POST answers **502** — no channel accepted the lead.
That is the intended behaviour, not a broken dev setup (see below).

## Waitlist

`functions/api/waitlist.ts`. There is **no datastore** — leads go straight to
the owner:

1. **Telegram** — primary channel (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`)
2. **Email** — secondary, via Resend (`RESEND_API_KEY`), plus a courtesy
   welcome to the applicant

The one rule this path exists to protect: **a signup no channel accepted must
never answer 2xx.** The client decides success from `res.ok`, so a 200 shows
"You're in" for a lead that reached nobody. That is not hypothetical — a
deprovisioned Supabase backend once swallowed every signup behind an `ok:true`.
`__tests__/waitlist.test.ts` pins the contract; CI runs it before deploying.

`GET /api/waitlist` is the deploy smoke test's target. It asserts that a
delivery channel is configured at all (503 if none) — it does **not** prove
Telegram still accepts messages, so a revoked token still passes.

### Turnstile

Optional and currently **off**. Two independent switches, and nothing ties them
together:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time) makes the client render the widget
- `TURNSTILE_SECRET_KEY` (Pages env) makes the server require a token

Set the secret **without** the site key and every signup 403s. The handler
detects the no-token case and answers with a fallback address rather than
useless "reload the page" advice, but the real fix is to set both or neither.
Note the sync workflow below does not manage the Turnstile secret — it can only
be set by hand in the Cloudflare dashboard.

## Secrets

Runtime secrets live in the Cloudflare Pages project (`lumi`), pushed from
GitHub repo secrets by `.github/workflows/sync-pages-secrets.yml`
(`workflow_dispatch`, run it after adding or rotating one). It covers Telegram,
Resend and `OWNER_EMAIL` only.

Careful: the Telegram step writes whatever it is given, including an empty
string — running it with the repo secrets unset silently disables the primary
channel. Build-time `NEXT_PUBLIC_*` vars are passed separately in `deploy.yml`.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` runs typecheck → test → build →
`wrangler pages deploy` → smoke test. The smoke test runs **after** the deploy,
so it reports rather than prevents; typecheck and test are the gate.

## Structure

```
app/                    46 static routes
├── page.tsx            home
├── features · how-it-works · pricing · manifesto · faq · research · join
├── prompt · prompt-*   40 prompt-pack pages
├── social              link-in-bio (noindex, deliberately out of the sitemap)
├── press · privacy · cookies · terms · account/delete
├── sitemap.ts · robots.ts · opengraph-image.tsx
└── layout.tsx          title/description/OG defaults; canonical is per page

components/
├── Nav · Footer · Logo · PageHeader · Breadcrumbs · JsonLd · Analytics
├── WaitlistForm        the conversion path
├── PhoneFrame          device shell for the screens below
├── screens/            in-app mockups: Chat, Clients, Todos, AppShell
└── sections/           Hero, Pillars, DayWithLumi, Comparison, Personas,
                        WaitlistHow, Faq, FinalCta

functions/api/waitlist.ts   the only server code
lib/welcome-email.ts        its only dependency
```

## Notes

- Design v2 is light — white/zinc/blue, grotesk, no serif. (It was dark in v1;
  anything you find claiming "dark only" is stale.)
- Site copy is English only. The Telegram/email notifications in
  `functions/api/waitlist.ts` are Russian on purpose — they are read by the
  owner, not by visitors.
- Analytics is PostHog (EU host), loaded only when `NEXT_PUBLIC_POSTHOG_KEY` is set.
- Design tokens in `tailwind.config.ts` and `app/globals.css`.
