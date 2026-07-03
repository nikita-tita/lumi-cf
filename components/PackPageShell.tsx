import type { ReactNode } from "react";
import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { ClientsScreen } from "@/components/screens/ClientsScreen";

/* ============ Promo hero — full-screen, app pitch ============ */
type PackHeroProps = {
  guideAnchor?: string; // "#workflow" by default — page-specific anchor
  readMinutes: number;
};

export function PackHero({
  guideAnchor = "#guide",
  readMinutes,
}: PackHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden min-h-[85vh] flex items-center"
      style={{
        background:
          "#2563EB",
      }}
    >
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-12 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center py-16 sm:py-20 lg:py-24">
        <div>
          <div className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-indigo-300/80 font-mono mb-5">
            Lumi · private beta · EU · LatAm · MENA
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white">
            Your second brain
            <br />
            <span
              style={{
                background:
                  "#FAFAFA",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              for closing deals.
            </span>
          </h1>
          <p className="mt-6 sm:mt-7 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
            Speak after a showing. Forward an email. Pull up a client.
            Lumi captures the soft signals, fills the brief, and feeds Claude — automatically.
          </p>
          <ul className="mt-7 space-y-3 text-slate-300">
            {[
              "Voice → CRM, auto. No forms.",
              "Works offline. Syncs when you're back.",
              "Free during beta · then €9/month, everything included.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] flex-shrink-0" />
                <span className="text-sm sm:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px]"
              style={{
                background:
                  "#D97706",
              }}
            >
              Join the waitlist →
            </Link>
            <Link
              href={guideAnchor}
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold border border-slate-700 text-slate-200 hover:bg-slate-800/40 transition"
            >
              Read the field guide
            </Link>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-slate-500 font-mono">
            {readMinutes}-min read · Updated April 2026
          </p>
        </div>

        {/* Live phone mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <PhoneFrame>
            <ChatScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

/* ============ Bottom ad — full conversion block ============ */
type PackBottomAdProps = {
  workflowName: string; // e.g. "this exact workflow", "the silent-buyer protocol"
  headlinePrimary?: string;
  headlineAccent?: string;
};

export function PackBottomAd({
  workflowName,
  headlinePrimary = "Reading this guide is step one.",
  headlineAccent = "Living inside it is step two.",
}: PackBottomAdProps) {
  return (
    <section className="relative isolate my-16 sm:my-20 min-h-[70vh] flex items-center">
      <div
        className="absolute inset-0 -z-10 rounded-[28px] sm:rounded-[36px]"
        style={{
          background:
            "#2563EB",
        }}
      />
      <div className="w-full px-6 sm:px-10 lg:px-14 py-14 sm:py-20 lg:py-24 rounded-[28px] sm:rounded-[36px] text-slate-100 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-indigo-300/80 font-mono mb-5">
            built around {workflowName}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.1] tracking-tight">
            {headlinePrimary}
            <br />
            <span
              style={{
                background:
                  "#FAFAFA",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {headlineAccent}
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Lumi is the app that <em className="font-display not-italic text-slate-100">runs</em> this workflow for you. You speak after a showing — Lumi captures the soft signals. You forward an email — Lumi updates the constraints. You open the app at 8am — the brief is already there, ready to feed Claude.
          </p>
          <ul className="mt-7 space-y-3 text-slate-300">
            {[
              "Voice → structured CRM, automatically",
              "No forms. No data entry. No copy-paste.",
              "Free during beta · then €9/month, everything included",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] flex-shrink-0" />
                <span className="text-sm sm:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px]"
              style={{
                background:
                  "#D97706",
              }}
            >
              Join the waitlist
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold border border-slate-700 text-slate-200 hover:bg-slate-800/40 transition"
            >
              See how it works
            </Link>
          </div>
        </div>
        <div className="relative flex flex-wrap justify-center items-start gap-6 lg:gap-8">
          <div className="lg:-mt-6">
            <PhoneFrame>
              <ChatScreen />
            </PhoneFrame>
          </div>
          <div className="hidden md:block lg:mt-10">
            <PhoneFrame>
              <ClientsScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Closing footnote — origin + IG follow ============ */
type PackFootnoteProps = {
  keyword?: string; // kept for back-compat; no longer rendered
  origin?: ReactNode;
};

export function PackFootnote({ origin }: PackFootnoteProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
      <div className="border-t border-slate-200 pt-10 text-sm text-slate-500 leading-relaxed">
        {origin && <p>{origin}</p>}
        <p className={origin ? "mt-3" : undefined}>
          More guides like this on{" "}
          <a
            href="https://www.instagram.com/lumi.estate"
            className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
          >
            @lumi.estate
          </a>
          . Follow if any of this was useful — it&apos;s how we know to keep
          writing.
        </p>
      </div>
    </section>
  );
}

/* ============ Section header used inside each pack page ============ */
type PackSectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
};

export function PackSectionHeader({
  eyebrow,
  title,
  description,
}: PackSectionHeaderProps) {
  return (
    <div className="border-t border-slate-200 pt-12 sm:pt-16">
      <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
        {eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
