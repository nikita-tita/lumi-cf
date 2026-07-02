import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Mail, Download } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Press",
  description:
    "Lumi press kit: logo, screenshots, founder bio, and boilerplate.",
  alternates: { canonical: "https://lumi.estate/press" },
};

const boilerplate = `Lumi is the AI calendar and CRM built for real estate agents. Capture showings by voice, keep your pipeline alive, never drop a follow-up. Currently in private beta.`;

export default function PressPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Press", url: "/press" }]} />
      <PageHeader
        eyebrow="Press"
        title="Press kit."
        subtitle="Everything you need to write about Lumi. If you need anything that isn't here, email hello@lumi.estate and we'll send it over."
      />
      <section className="pb-20">
        <div className="container-lumi grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="glass rounded-card p-8">
            <h3 className="text-lg font-bold text-text">Boilerplate</h3>
            <p className="mt-4 text-sm text-text-dim leading-relaxed">{boilerplate}</p>
          </div>

          <div className="glass rounded-card p-8">
            <h3 className="text-lg font-bold text-text">Assets</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-sm text-text-dim hover:text-text transition-colors"
                >
                  <Download size={14} /> Logo (SVG) &mdash; coming soon
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-sm text-text-dim hover:text-text transition-colors"
                >
                  <Download size={14} /> App screenshots (ZIP) &mdash; coming soon
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-sm text-text-dim hover:text-text transition-colors"
                >
                  <Download size={14} /> Founder headshot &mdash; coming soon
                </a>
              </li>
            </ul>
          </div>

          <div className="glass rounded-card p-8 md:col-span-2">
            <h3 className="text-lg font-bold text-text">Press contact</h3>
            <p className="mt-4 text-sm text-text-dim">
              For interviews, product demos, or anything else, write to:
            </p>
            <a
              href="mailto:hello@lumi.estate"
              className="mt-4 inline-flex items-center gap-2 text-accent hover:underline"
            >
              <Mail size={16} /> hello@lumi.estate
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
