import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Agents don't need another CRM. They need an assistant that fits in a pocket. A short essay on why we're building Lumi.",
};

export default function ManifestoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Manifesto"
        title="Agents don't need another CRM."
      />
      <section className="pb-20">
        <article className="container-lumi max-w-2xl">
          <p className="text-lg md:text-xl text-text-dim leading-relaxed">
            A real estate agent doesn't have an admin. They have a phone, a car, and
            forty hot leads &mdash; all of which demand to be remembered.
          </p>
          <p className="text-lg md:text-xl text-text-dim leading-relaxed mt-6">
            The industry's answer has been: buy more software. A CRM for your leads. A
            calendar for your showings. A notes app for the things clients say in
            hallways. A voice memo for the stuff you can't type while driving. A
            spreadsheet to glue it all together on Sunday night.
          </p>
          <p className="text-lg md:text-xl text-text-dim leading-relaxed mt-6">
            We watched sixty agents try to do this for a year. Every single one of them
            lost a lead because it fell between two of those tools. Every single one.
          </p>
          <p className="text-lg md:text-xl text-text-dim leading-relaxed mt-6">
            Lumi is one app. Your calendar, your pipeline, your notes, your voice, your
            follow-ups. Built around the one motion you actually do: walk into a
            property, talk to a human, walk out, drive to the next one.
          </p>
          <p className="text-lg md:text-xl text-text-dim leading-relaxed mt-6">
            Generic calendars were built for knowledge workers at desks. Generic CRMs
            were built for SaaS sales reps with headsets. Neither of them ever spent a
            Saturday showing six apartments in the rain.
          </p>
          <p className="font-display text-2xl md:text-3xl text-text leading-relaxed mt-12 text-gradient-accent">
            Lumi is the calendar a real estate agent would design for themselves.
          </p>
          <p className="text-sm text-text-mute mt-16">&mdash; Nikita, Helsinki</p>
        </article>
      </section>
      <FinalCta />
    </>
  );
}
