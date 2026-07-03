import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One plan, everything included. €9/month after a 7-day free trial. No tiers, no feature-gating, no surprises.",
};

const included = [
  "AI chat — capture showings, notes, and follow-ups by voice or text",
  "Full pipeline & CRM — leads, deals, clients, reminders",
  "Documents Q&A — ask questions across listings, contracts, HOA docs",
  "Offline-first — works at open houses with no signal",
  "Calendar sync — Google Calendar and Apple Calendar",
  "Multi-currency & 8 languages, including Arabic RTL",
];

const faq = [
  {
    q: "How does the free trial work?",
    a: "You get 7 days with every feature unlocked — no card tricks, no limited mode. If Lumi isn’t saving you time by day seven, cancel and you pay nothing.",
  },
  {
    q: "Is anything locked behind a higher tier?",
    a: "No. There is one plan and it includes everything. Every agent gets the same chat, the same pipeline, the same Documents Q&A.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. The subscription is a standard Apple subscription — cancel in App Store settings in two taps. You keep access until the end of the paid period.",
  },
  {
    q: "Why €9?",
    a: "It’s a price a working agent doesn’t have to think about — less than one coffee a week — and it keeps the product funded by its users, not by ads or selling data.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="One plan. Everything included."
        subtitle="€9/month after a 7-day free trial. No tiers, no feature-gating, no ‘contact sales’. Try it, and pay only if it earns its keep."
      />

      <section className="pb-12">
        <div className="container-lumi max-w-3xl">
          <div
            className="rounded-card p-10 border border-border shadow-soft"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.05) 50%, rgba(217,119,6,0.04) 100%)",
            }}
          >
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">
              Lumi Pro
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-6xl tracking-tight text-text">
                €9
              </span>
              <span className="text-lg text-text-dim">/ month</span>
            </div>
            <p className="mt-2 text-base md:text-lg text-text-dim">
              7-day free trial. Cancel anytime.
            </p>

            <ul className="mt-8 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "#2563EB",
                    }}
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm md:text-base text-text-dim leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-text-mute">
              Billed monthly via Apple subscription · Cancel anytime in App
              Store settings · Prices may vary slightly by region due to App
              Store currency conversion.
            </p>
          </div>

          <p className="mt-6 text-sm text-text-dim italic">
            <Sparkles
              size={12}
              className="inline-block text-accent mr-1"
              strokeWidth={2.4}
            />
            One missed follow-up costs more than a year of Lumi.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-lumi max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-text mb-8">
            Questions about pricing.
          </h2>
          <div className="bg-surface rounded-card border border-border shadow-soft divide-y divide-border">
            {faq.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <h3 className="text-base md:text-lg font-semibold text-text">
                  {f.q}
                </h3>
                <p className="mt-2 text-sm md:text-base text-text-dim leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
