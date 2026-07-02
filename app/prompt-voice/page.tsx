import type { Metadata } from "next";
import Link from "next/link";
import {
  PackHero,
  PackBottomAd,
  PackFootnote,
  PackSectionHeader,
} from "@/components/PackPageShell";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "The Voice Pack — 5 voice-memo prompts that turn every showing into a CRM in 90 seconds",
  description:
    "The 5 voice-memo prompts top real-estate agents speak into their phone instead of typing into a CRM. Each one runs as a complete deep-dive guide. Built for agents in EU, LatAm, and MENA.",
  openGraph: {
    title: "The Voice Pack — 5 voice-memo prompts agents speak instead of type",
    description:
      "Five voice memos. One CRM that fills itself. The complete pack: 60-sec recap, pre-showing brief, seller report, sphere outreach, kill-or-revive.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Voice Pack — 5 prompts that turn showings into a CRM",
    description:
      "Five voice memos. One CRM that fills itself. Read the full pack inside.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-voice" },
};

type PromptCard = {
  num: string;
  title: string;
  oneLine: string;
  voiceMemo: string;
  unlocks: string;
  href: string;
  hrefLabel: string;
};

const PROMPTS: PromptCard[] = [
  {
    num: "01",
    title: "The 60-sec recap",
    oneLine:
      "What you say into your phone the minute you walk out of the showing — before context decays.",
    voiceMemo:
      'Just finished showing 12 Calle Mayor with Maria. Two-bed. She liked the kitchen, hated the parking. Budget stretches to 420k if I find one with parking. Next: send 3 ground-floor options Thursday 14:00.',
    unlocks:
      "CRM card updates itself. Follow-up draft writes itself. Calendar block for the next contact gets filed. Twelve minutes saved per showing.",
    href: "/prompt-three-min",
    hrefLabel: "Read the 3-minute capture protocol →",
  },
  {
    num: "02",
    title: "The pre-showing brief",
    oneLine:
      "Ten minutes before you walk in, ask Lumi what you already know about this client. The brief surfaces everything you would otherwise forget.",
    voiceMemo:
      'Walking into a showing with Anna Silva in 10 minutes. What do I know about her?',
    unlocks:
      "Last conversation thread, kids' names, partner's preferences, the three things she rejected last time. You remember without trying to remember.",
    href: "/prompt-prep-brief",
    hrefLabel: "Read the pre-showing brief guide →",
  },
  {
    num: "03",
    title: "The same-day seller report",
    oneLine:
      "What you say after the listing showing — drafts the seller report in their language, in the agent's voice, ready to send within the hour.",
    voiceMemo:
      'Just left 17 Av Paulista. 6 buyers came. 2 asked about parking. 1 said price was 30k over. One was serious, asked twice if I could arrange a second viewing.',
    unlocks:
      "Seller report drafted in Portuguese, Spanish, German, Italian, French, or Arabic — at 80% pre-edit quality. Sent during the seller's preferred contact window. 24 hours of silence is where sellers start doubting you.",
    href: "/prompt-after",
    hrefLabel: "Read the after-showing follow-up guide →",
  },
  {
    num: "04",
    title: "The sphere outreach",
    oneLine:
      "Once a week, on a slow morning. Past client moved 2 years ago — Lumi finds 3 candidates in their network and drafts the message for each.",
    voiceMemo:
      'Past client Ferreira moved 2 years ago. Who in his sphere is likely to move in the next 6 months — draft 3 outreach messages.',
    unlocks:
      "Cross-references your CRM, the past client's neighbourhood, life-events signals. Three personalised openers. No-pressure, in your voice. Copy, paste, send. A referral pipeline that runs even when you're not selling.",
    href: "/prompt-cold-30",
    hrefLabel: "Read the 30-day cold outreach guide →",
  },
  {
    num: "05",
    title: "Kill or revive",
    oneLine:
      "The buyer who has been silent for 3+ weeks. Lumi reads the last touchpoint and drafts one short message that gives them permission to walk away — which is what brings them back.",
    voiceMemo:
      'Buyer Lopez ghosted me 3 weeks ago. Draft one kill-or-revive message — direct, no salesy filler.',
    unlocks:
      "The agent who removes pressure looks like the agent who already has options. The kill-or-revive message lands on the buyer's screen in their language, in your tone, with the next move pre-decided.",
    href: "/prompt-silent",
    hrefLabel: "Read the silent-buyer revival guide →",
  },
];

function PromptCardBlock({
  prompt,
  index,
}: {
  prompt: PromptCard;
  index: number;
}) {
  return (
    <article
      id={`prompt-${index + 1}`}
      className="scroll-mt-24 grid lg:grid-cols-[88px_1fr] gap-4 lg:gap-8 py-10 sm:py-14 border-t border-slate-200"
    >
      <div className="flex lg:flex-col items-center lg:items-start gap-3">
        <div
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-xl lg:text-2xl font-mono font-semibold text-white shadow-md"
          style={{
            background:
              "#2563EB",
          }}
        >
          {prompt.num}
        </div>
        <div className="text-[11px] tracking-[0.18em] uppercase text-slate-400 font-mono">
          prompt {index + 1} / 5
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
          {prompt.title}
        </h3>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          {prompt.oneLine}
        </p>

        <div className="mt-6 rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6 ring-1 ring-slate-800">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-indigo-300 font-mono font-semibold">
            what you say into Lumi
          </div>
          <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-slate-100 italic">
            &ldquo;{prompt.voiceMemo}&rdquo;
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-5">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-emerald-700 font-mono font-semibold">
            what Lumi unlocks
          </div>
          <p className="mt-2 text-[15px] text-slate-800 leading-relaxed">
            {prompt.unlocks}
          </p>
        </div>

        <div className="mt-5">
          <Link
            href={prompt.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 underline underline-offset-2"
          >
            {prompt.hrefLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PromptVoicePage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={6} guideAnchor="#pack" />

      {/* Field-guide intro */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 0%, rgba(217,119,6,0.08), transparent), radial-gradient(40% 40% at 0% 30%, rgba(37,99,235,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-4">
            agent toolkit · the voice pack
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            The Voice Pack.
            <br />
            <span
              style={{
                background:
                  "#2563EB",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              5 prompts. One voice memo each.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The five voice-memo prompts top real-estate agents speak into their phone
            instead of typing into a CRM. Each one is a complete workflow — pre-showing,
            during the showing, after the showing, sphere outreach, and the kill-or-revive
            for buyers who&apos;ve gone quiet. The pack runs end-to-end inside Lumi.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>6-min read</span>
            <span aria-hidden>·</span>
            <span>Updated May 2026</span>
            <span aria-hidden>·</span>
            <span>From the Reel · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>voice_pack.txt — five workflows</span>
              <span className="hidden sm:inline">90 seconds each</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`01 · 60-sec recap        →  walk back, voice memo, CRM auto-filled
02 · pre-showing brief    →  10 min before, instant client recall
03 · seller report        →  same-day, in seller's language
04 · sphere outreach      →  past client, three next-buyer drafts
05 · kill or revive       →  ghosted lead, one direct line`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Five voice memos. One CRM that fills itself. Tap into any of the five for
              the full deep-dive.
            </p>
          </div>
        </div>
      </section>

      {/* The reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why voice beats typing — every single time.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Typed notes capture maybe 40% of what was said. Voice memos capture 95%+ —
            and they preserve the agent&apos;s emotional read alongside the facts.
            Tone of voice in the memo (&ldquo;she said it sharply&rdquo;) becomes a
            signal in the AI&apos;s output. You cannot type that signal in.
          </p>
          <p>
            The five prompts in this pack are the ones the most disciplined agents in
            EU, LatAm, and MENA use every day. Each one swaps a 10-minute typing task
            for a 60-second voice memo. Each one ends with a structured CRM update,
            a draft message, and a calendar block — all from the same memo.
          </p>
          <p>
            None of the five require Lumi to work — but Lumi is what makes them run
            on autopilot. Read the deep-dive guide for any prompt below to get the
            full template, the Claude prompt that parses it, and the failure modes.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;Top agents don&apos;t remember more. They capture more, faster.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The 5 prompts */}
      <section id="pack" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the pack"
          title="The 5 voice-memo prompts."
          description="Each one is a complete workflow. Tap the deep-dive at the bottom of any card for the full template, examples, and the Claude system prompt that parses the memo."
        />
        {PROMPTS.map((p, i) => (
          <PromptCardBlock key={p.num} prompt={p} index={i} />
        ))}
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the voice-first capture protocol"
          headlinePrimary="Reading the pack is step one."
          headlineAccent="Speaking it is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="VOICE"
        origin={
          <>
            The five workflows in this pack come from interviews with high-output
            real-estate agents in Lisbon, Madrid, Milan, and Dubai who replaced
            typing-into-CRM with voice-memo capture between 2024 and 2026. Lumi
            is the app that makes the loop run on autopilot.
          </>
        }
      />
    </div>
  );
}
