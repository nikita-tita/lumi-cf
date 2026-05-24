import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions people ask before joining the Lumi waitlist.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Things worth knowing."
        subtitle="The answers we give most often. If something's missing, write to hello@lumi.estate and we'll add it."
      />
      <Faq />
      <FinalCta />
    </>
  );
}
