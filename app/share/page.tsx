import type { Metadata } from "next";
import { Suspense } from "react";
import { ShareCopy } from "@/components/ShareCopy";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Your share link",
  description:
    "Copy and share your Lumi waitlist link. Every agent who joins from your link moves you up.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://lumi.estate/share" },
};

export default function SharePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <Suspense fallback={null}>
        <ShareCopy />
      </Suspense>
    </main>
  );
}
