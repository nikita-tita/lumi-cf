import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join the Lumi private beta. Free for the first thousand users. Helsinki, Q2 2026.",
  alternates: { canonical: "https://lumi.estate/join" },
};

export default function JoinPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Join waitlist", url: "/join" }]} />
      <PageHeader
        eyebrow="Waitlist"
        title="Get your day back."
        subtitle="Private beta opens June 2026. Free for the first thousand users. Tell us a little about the mess you're in &mdash; we're reading every note."
      />
      <section className="pb-32">
        <div className="container-lumi">
          <WaitlistForm variant="page" showNote />
        </div>
      </section>
    </>
  );
}
