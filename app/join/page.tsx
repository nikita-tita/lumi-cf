import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join the Lumi private beta. Invites go out in waves — sign up with your email, we confirm your spot, and reach out when your invite is ready.",
  alternates: { canonical: "https://lumi.estate/join" },
};

const steps = [
  {
    n: "01",
    title: "You sign up",
    desc: "Email is enough. The note is optional — but we read every single one, and what agents write here decides what we build next.",
  },
  {
    n: "02",
    title: "You get a confirmation",
    desc: "We email you the moment you sign up to confirm you're on the list. Nothing to check, nothing to share — we come to you.",
  },
  {
    n: "03",
    title: "Your invite arrives",
    desc: "We onboard in small waves so every agent gets real support — not a login and a help-center link. Watch for one email from us.",
  },
];

const promises = [
  {
    title: "Two emails, total",
    desc: "One when your invite is ready, one when we launch publicly. No drip campaigns, no “quick question” follow-ups.",
  },
  {
    title: "Your email stays here",
    desc: "It's used for the two emails above and nothing else. Never sold, never shared, deleted on request.",
  },
  {
    title: "Beta is free",
    desc: "Full app during beta — chat, calendar, pipeline, Documents Q&A. When we launch, beta members keep a founding-member price.",
  },
];

export default function JoinPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Join waitlist", url: "/join" }]} />
      <PageHeader
        eyebrow="Waitlist"
        title="Get your day back."
        subtitle="Invites go out in waves. Tell us a little about the mess you're in &mdash; we're reading every note."
      />
      <section className="pb-32">
        <div className="container-lumi">
          <WaitlistForm variant="page" showNote />

          <div className="grid md:grid-cols-2 gap-14 lg:gap-20 mt-24 max-w-5xl">
            <div>
              <p className="eyebrow mb-6">What happens next</p>
              <div className="rule">
                {steps.map((s) => (
                  <div
                    key={s.n}
                    className="grid grid-cols-[48px_1fr] gap-4 py-6 border-b border-border"
                  >
                    <span className="font-mono text-sm text-accent pt-0.5">{s.n}</span>
                    <div>
                      <h3 className="font-display text-xl text-text">{s.title}</h3>
                      <p className="mt-2 text-sm text-text-dim leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-6">Our side of the deal</p>
              <div className="space-y-4">
                {promises.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-card border border-border bg-surface p-6"
                  >
                    <h3 className="font-display text-lg text-text">{p.title}</h3>
                    <p className="mt-2 text-sm text-text-dim leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
