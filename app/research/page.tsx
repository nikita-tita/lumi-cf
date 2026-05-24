import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { Quote } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Research",
  description:
    "Sixty real estate agents. Three recurring pains. Why we built Lumi.",
  alternates: { canonical: "https://lumi.estate/research" },
};

const pains = [
  {
    n: "01",
    title: "Showings captured only in memory",
    desc: "Every agent we interviewed walked out of a viewing, got in the car, drove to the next one, and lost half of what the client said. By Friday, they couldn't remember which lead liked the penthouse.",
  },
  {
    n: "02",
    title: "Leads go cold because follow-up lives in a notepad",
    desc: "The hot lead from Tuesday's open house gets buried under Wednesday's paperwork. No one ever checks the notepad. Three weeks later, that lead buys with another agent.",
  },
  {
    n: "03",
    title: "Double-booked weekends",
    desc: "Saturday morning: six showings across town, two of them 10 minutes apart in opposite directions. The agent booked them on different apps and never saw the conflict until it was too late.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Research", url: "/research" }]} />
      <PageHeader
        eyebrow="Research"
        title="Sixty agents. Three pains. One app."
        subtitle="Before we wrote a line of code, we interviewed 60 working agents in 12 cities. This page shows our work — the pains they described, in their words."
      />

      <section className="pb-20">
        <div className="container-lumi max-w-3xl">
          <div className="bg-surface border border-accent/30 rounded-card p-8 md:p-10 shadow-soft">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
              In progress
            </p>
            <p className="text-lg text-text leading-relaxed">
              Interviews continue through beta. The full breakdown &mdash; city
              segments, verbatim quotes, the three recurring pains broken down by
              years of experience &mdash; ships when we hit 100 interviews. No
              fabrication.
            </p>
          </div>

          <h2 className="font-display text-2xl md:text-3xl text-text mt-16 mb-8">
            The three pains we kept hearing
          </h2>

          <div className="space-y-6">
            {pains.map((p) => (
              <div key={p.n} className="bg-surface border border-border rounded-card p-6 flex gap-6 shadow-soft">
                <div className="font-display text-3xl text-gradient-accent flex-shrink-0">
                  {p.n}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">{p.title}</h3>
                  <p className="mt-2 text-sm text-text-dim leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-surface rounded-card p-8 border-l-2 border-accent shadow-soft">
            <Quote size={20} className="text-accent mb-4" aria-hidden />
            <p className="text-lg text-text italic leading-relaxed">
              &ldquo;I show twelve properties on a Saturday. By Monday morning I
              can tell you what every client drank, but I can't tell you which one
              asked for the mortgage contact. That lead is gone.&rdquo;
            </p>
            <p className="text-xs text-text-mute mt-4">
              &mdash; solo agent, 8 years, Helsinki
            </p>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
