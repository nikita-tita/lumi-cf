import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  MessageCircle,
  Kanban,
  Mic,
  FileSearch,
  Users,
  WifiOff,
  Globe,
  Bell,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Features",
  description:
    "Chat-first AI, deal pipeline that moves itself, Documents RAG with cited answers, voice capture, offline-first, multi-currency and eight languages. The full Lumi feature set.",
  alternates: { canonical: "https://lumi.estate/features" },
};

const features = [
  {
    icon: MessageCircle,
    title: "Chat that acts",
    desc: "The home screen is a conversation. Speak or type — Lumi proposes events, updates pipeline, drafts follow-ups, all as inline cards you confirm with a swipe. Forms are the fallback, not the default.",
  },
  {
    icon: Kanban,
    title: "Deal Pipeline",
    desc: "New → Contacted → Showing → Offer → Closed. After each voice note or chat, Lumi moves the right card to the right stage. You never fill out a stage form again.",
  },
  {
    icon: Mic,
    title: "Voice capture",
    desc: "Walk out of a property, hold the orb, say what happened. Lumi transcribes, tags the lead, schedules the follow-up, and moves the pipeline card — all from one sentence.",
  },
  {
    icon: FileSearch,
    title: "Documents that answer",
    desc: "Upload listings, contracts, HOA docs. Ask questions in chat — \u201cmaintenance fee for Apt 4?\u201d — and Lumi returns cited answers pulled straight from the PDF. Powered by pgvector + Claude.",
  },
  {
    icon: Bell,
    title: "Smart follow-ups",
    desc: "\u201cSend comparables tomorrow\u201d, \u201ccheck in after inspection\u201d, \u201ccall about financing Friday\u201d. Lumi drafts, you approve and send. Max 3 suggestions/day — no fatigue.",
  },
  {
    icon: WifiOff,
    title: "Offline-first at open houses",
    desc: "Basements, new builds, rural showings — Lumi works without signal. Capture everything, sync when you\u2019re back in range. SQLite-first architecture, never loses a note.",
  },
  {
    icon: Globe,
    title: "Multi-currency, eight languages",
    desc: "EUR, USD, AED. English, Russian, Spanish, Portuguese, German, French, Italian, Arabic (with full RTL). Regional feeds: Idealista, ImmoScout24, SeLoger, Property Finder, Bayut.",
  },
  {
    icon: Users,
    title: "Team handoffs",
    desc: "Listing agent → showing agent → team lead. Everyone sees the same lead history, the same notes, the same next action. Shared pipeline with role-based views.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Features", url: "/features" }]} />
      <PageHeader
        eyebrow="Features"
        title="Chat is the interface. Everything else follows."
        subtitle="Eight things, done well. Built from conversations with 60 agents across EU, LatAm, and MENA. No dashboards to fill, no settings graveyard."
      />
      <section className="pb-20">
        <div className="container-lumi grid md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-surface border border-border rounded-card p-8 shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/12 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-text">{f.title}</h3>
                <p className="mt-3 text-sm text-text-dim leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
