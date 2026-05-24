import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions people ask before joining the Lumi waitlist.",
  alternates: { canonical: "https://lumi.estate/faq" },
};

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "FAQ", url: "/faq" }]} />
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
