import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { DayWithLumi } from "@/components/sections/DayWithLumi";
import { Comparison } from "@/components/sections/Comparison";
import { Personas } from "@/components/sections/Personas";
import { WaitlistHow } from "@/components/sections/WaitlistHow";
import { Faq } from "@/components/sections/Faq";
import { faqItems } from "@/components/sections/faq-data";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = 'force-static';

// Title/description/OG come from the root layout; only the canonical has to be
// stated per page — a default in the layout would point every page at the same
// URL.
export const metadata: Metadata = {
  alternates: { canonical: "https://lumi.estate" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Lumi",
        url: "https://lumi.estate",
        logo: "https://lumi.estate/brand-icon.png",
        description:
          "Lumi is the AI calendar and CRM built for real estate agents. Voice-first capture, offline pipeline, built-in deal tracking.",
      },
      {
        "@type": "SoftwareApplication",
        name: "Lumi",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Real Estate CRM",
        operatingSystem: "iOS, Android",
        // PreOrder, not the default InStock: both stores read "Coming soon" on
        // /social, so advertising a buyable app would be a false claim to
        // Google — the price is announced, the app is still private beta.
        offers: {
          "@type": "Offer",
          price: "9.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/PreOrder",
        },
        description:
          "AI calendar and CRM for real estate agents. Capture showings by voice, keep your pipeline alive, never drop a follow-up.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <Pillars />
      <DayWithLumi />
      <Comparison />
      <Personas />
      <WaitlistHow />
      <Faq />
      <FinalCta />
    </>
  );
}
