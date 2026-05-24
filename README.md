# Lumi Landing

Next.js 14 marketing site + waitlist for Lumi (AI calendar).

## Dev

```bash
cd landing
npm install
npm run dev
```

Open http://localhost:3000

## Waitlist (dev stub)

The `/api/waitlist` route writes submissions to `.data/waitlist.json` so you
can iterate without any external services. When Supabase + Resend creds are
added to `.env.local`, swap the stub for real writes + confirmation email.

## Structure

```
app/
├── page.tsx           home (long-scroll)
├── features           /features
├── how-it-works
├── pricing
├── manifesto
├── faq
├── research
├── join
├── press
├── privacy
├── terms
├── api/waitlist       POST stub
├── sitemap.ts
├── robots.ts
└── layout.tsx

components/
├── Nav.tsx
├── Footer.tsx
├── Logo.tsx
├── WaitlistForm.tsx
├── DeviceMockup.tsx
├── JsonLd.tsx
├── PageHeader.tsx
└── sections/          Hero, Pillars, DayWithLumi, Comparison, Personas, Faq, FinalCta, SocialProof
```

## Notes

- Dark only for v1 (per TZ).
- English only. No Cyrillic in source, assets, or metadata.
- Design tokens in `tailwind.config.ts` and `app/globals.css`.
- Tokens sourced from `~/Desktop/lumi-screens/` (existing brand mockups).

## Todo before prod

- Wire Supabase (EU Frankfurt) + Resend confirmation email
- Plausible + Clarity analytics + cookie banner
- Real 60-second explainer video
- Lighthouse ≥ 95 audit
- DNS cutover to lumi.estate (done)
