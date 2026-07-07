import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Sixty seconds on how Lumi turns a showing into a logged lead, an updated pipeline, and a scheduled follow-up.",
  alternates: { canonical: "https://lumi.estate/how-it-works" },
};

const steps = [
  {
    n: "01",
    title: "You walk out of the showing.",
    desc: "Hold the orb, say what happened: “Showed Clara the Passeig de Gràcia apartment. She wants comparables tomorrow and a second viewing Friday.”",
  },
  {
    n: "02",
    title: "Lumi proposes.",
    desc: "A lead update appears as a draft. Pipeline card moves from Showing → Interested. Follow-up todo scheduled for tomorrow. Friday viewing blocked. Nothing locked in yet.",
  },
  {
    n: "03",
    title: "You confirm.",
    desc: "One tap and it's real. Swipe left and it's gone. No forms. No dropdowns. No stopping the car.",
  },
  {
    n: "04",
    title: "Lumi remembers.",
    desc: "Who you showed what to. What they said. Who's waiting on comps. Who's going cold. When you promised to call them back.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "How it works", url: "/how-it-works" }]} />
      <PageHeader
        eyebrow="How it works"
        title="Sixty seconds, four steps."
        subtitle="The whole thing is simpler than the CRM you already paid for."
      />
      <section className="pb-20">
        <div className="container-lumi max-w-3xl">
          <div className="border border-border rounded-card aspect-video mb-16 relative overflow-hidden shadow-soft bg-black">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster="/lumi-explainer-poster.jpg"
            >
              <source src="/lumi-explainer.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="space-y-10">
            {steps.map((s) => (
              <div
                key={s.n}
                className="flex gap-6 md:gap-10 items-start pb-10 border-b border-border last:border-0"
              >
                <div className="font-display text-4xl md:text-5xl text-gradient-accent flex-shrink-0 w-20">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">{s.title}</h3>
                  <p className="mt-3 text-base text-text-dim leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
