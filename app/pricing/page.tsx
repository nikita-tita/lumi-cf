import type { Metadata } from "next";
import { Heart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Lumi is free, forever. Lumi Pro is an optional donation from €5/month — patronage, not paywall. No feature-gating, no tricks.",
};

const tiers = [
  { amount: "€5", label: "Tip jar" },
  { amount: "€10", label: "Break-even-ish" },
  { amount: "€15", label: "Covers one account", recommended: true },
  { amount: "€25", label: "Funds the next feature" },
  { amount: "€50", label: "Angel tier" },
];

const faq = [
  {
    q: "Why donation and not a subscription?",
    a: "Paywalls push us to lock features behind tiers and ship urgency copy. Donation keeps the product honest: we build what agents need, you pay what it\u2019s worth to you. Nothing changes in the app based on your tier.",
  },
  {
    q: "What does Lumi Pro unlock today?",
    a: "Nothing. Lumi Pro is a patron badge, not a feature flag. Every agent — donating or not — gets the same chat, the same pipeline, the same Documents Q&A. We\u2019ll never ship a Pro-only feature without making it available in the free tier.",
  },
  {
    q: "What does the money actually cover?",
    a: "Running one active account costs us about €10–15/month in AI inference (Claude, Whisper, embeddings) and infrastructure (Supabase, Vercel). Donations above that fund the next features and keep the app free for agents who can\u2019t pay.",
  },
  {
    q: "Can I change my tier or cancel?",
    a: "Yes, anytime. Lumi Pro is a non-consumable Apple IAP — change tiers or cancel in App Store settings. Past support stays; nothing gets revoked.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Lumi is free. Forever."
        subtitle="All features, no paywall. Lumi Pro is an optional donation — patronage, not a subscription. Nothing unlocks, nothing gets gated. You chip in because the app saves you time, not because a feature is locked."
      />

      <section className="pb-12">
        <div className="container-lumi max-w-4xl">
          <div
            className="rounded-card p-10 border border-border shadow-soft"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.05) 50%, rgba(236,72,153,0.04) 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                }}
              >
                <Heart size={16} className="text-white" strokeWidth={2.4} />
              </div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">
                Lumi Pro · patron model
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight text-text">
              Pick a tier. Help keep the lights on.
            </h2>
            <p className="mt-4 text-base md:text-lg text-text-dim leading-relaxed max-w-2xl">
              Running one account costs us about €10–15/month in AI and
              infrastructure. If Lumi saves you time, consider a monthly
              donation — it directly funds the next features and keeps the app
              free for agents who can&apos;t pay.
            </p>

            <div className="mt-10 grid sm:grid-cols-5 gap-3">
              {tiers.map((t) => (
                <div
                  key={t.amount}
                  className={`relative rounded-2xl p-4 text-center transition-all ${
                    t.recommended
                      ? "bg-white border-2 border-accent shadow-glow"
                      : "bg-white/70 border border-border shadow-soft"
                  }`}
                >
                  {t.recommended && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold text-white px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
                      Default
                    </span>
                  )}
                  <div className="font-display text-3xl text-text">
                    {t.amount}
                  </div>
                  <p className="mt-1 text-[10.5px] text-text-dim leading-tight">
                    {t.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-text-mute">
              Per month · Non-consumable Apple IAP · Cancel or change tier anytime in
              App Store settings. Donations do not grant different features.
            </p>
          </div>

          <p className="mt-6 text-sm text-text-dim italic">
            <Sparkles
              size={12}
              className="inline-block text-accent mr-1"
              strokeWidth={2.4}
            />
            If €5 is too much, use Lumi free and pass the word to a colleague.
            That&apos;s a donation too.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-lumi max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-text mb-8">
            Questions about donating.
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
