import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";
import {
  PackHero,
  PackBottomAd,
  PackFootnote,
  PackSectionHeader,
} from "@/components/PackPageShell";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "Listing appointments are won in the prep — most agents wing it",
  description:
    "How real-estate agents walk into listing appointments with 3 talking points, 2 risk areas, and an opener line that earns trust in the first 90 seconds. The prompt, the comp-data input, and the close-rate lift.",
  openGraph: {
    title: "Listing appointments are won in the prep",
    description:
      "3 talking points + 2 risk areas + opener line, drafted from comp data and seller's emotional notes. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Listing appointments are won in the prep",
    description:
      "3 talking points + 2 risk areas + opener line. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-meeting" },
};

const MEETING_PROMPT = `You are a senior real-estate agent's
listing-appointment prep drafter.

INPUT
You receive: the seller's prior conversations
from CRM (any soft signals captured), comp
data for the property (3-5 recent comparable
sales + active listings + price-per-sqm
trends), and the agent's prior listing-
appointment prep notes (for voice).

OUTPUT
A 1-page prep document with EXACTLY:

  3 TALKING POINTS — each one combines a
  comp-data fact with a soft-signal anchor.
  E.g. "The Foz comps closed within 4-6%
  of asking, but your concern about the
  facade is real — here's the calibration."

  2 RISK AREAS — what could go wrong in
  this appointment. Specific. ("If they
  push the €950k floor, the comps don't
  support it; here's how to walk back.")

  OPENER LINE — a single sentence the
  agent can say in the first 90 seconds
  that surfaces the agent's preparation
  without naming it. ("Three Foz 4-beds
  closed in March within 4% of asking
  — let me show you what your place
  fits into.")

RULES (non-negotiable)
1. Talking points are NOT a pitch. Each
   is a frame for a conversation —
   something to surface and let the
   seller respond to.
2. Risk areas are calibrated to the
   seller's actual concerns from the
   CRM, not generic risks.
3. The opener line is for the first 90
   seconds. Anything later in the
   appointment, the agent improvises.
4. Voice matches the agent's prior
   listing-appointment style — clinical-
   warm, not pitchy.
5. Never script the entire meeting.
   The prep document gives the agent
   confidence; the meeting itself
   needs to feel responsive.

ANTI-PATTERNS (never produce these)
- Generic talking points ("Cascais market
  is strong this year")
- Risk areas the agent can't actually
  influence ("interest rates")
- Openers that name the comp data
  before establishing rapport
- Multi-page documents (1 page or it
  doesn't get read on the way to the
  appointment)`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The prep is for the first 90 seconds — and the last 10 minutes.",
    body: "Listing appointments have two high-stakes windows: the opener (where the seller decides whether they trust you) and the close (where you propose the listing terms). The middle is conversation. The prep document calibrates exactly those two windows — what to say in 90 seconds, what risks to be ready for in the close. The middle is left to the agent's judgement.",
  },
  {
    n: "02",
    title: "Comp data + soft signals must merge in every talking point.",
    body: "Comp data alone is a market report, not a conversation. Soft signals alone are flattery, not credibility. Each talking point fuses both: the comp fact gives the agent authority; the soft-signal reference makes the seller feel heard. 'Foz comps closed at 4-6% under, but your concern about the facade is real — let me show you the calibration.'",
  },
  {
    n: "03",
    title: "Risk areas are practiced, not surprises.",
    body: "Most listing appointments fail not on the talking points but on the risks. Seller pushes a price floor the comps don't support; seller wants exclusivity terms the agent can't honour; seller has been pitched by 3 other agents who promised numbers no one can hit. The prep document names these risks specifically — and gives the agent a calibrated retreat for each.",
  },
  {
    n: "04",
    title: "Opener surfaces preparation without naming it.",
    body: "The opener line is the moment the seller decides whether the agent did their homework. Bad openers ('I'm so excited to talk about your property!') announce nothing. Good openers reference a specific data point that the agent could only know with prep — a comp count, a price-per-sqm range, a recent neighbourhood transaction. The seller registers competence in the first 30 seconds.",
  },
  {
    n: "05",
    title: "One page. No bullet hell. Read on the way over.",
    body: "The prep document fits on one phone screen. The agent reads it in the elevator or the Uber. Multi-page documents don't get read at all — they sit in the agent's bag until after the appointment. The protocol enforces brevity: 3 talking points, 2 risks, 1 opener. Anything more is over-prep, which produces stiffness in the actual meeting.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the generic",
    body: "Talking point 1: The Cascais market has been strong this year, with prices up 4% YoY. Talking point 2: Your property is in a great location with good amenities. Talking point 3: We have a strong marketing strategy for properties like yours.",
    why: "Three vague generalities. None of them require the agent to have done any prep — could be said about any property in Cascais. The seller registers nothing specific and the appointment regresses to the agent talking about themselves.",
  },
  {
    label: "the over-script",
    body: "[15-page prep doc with detailed scripts for every possible objection, including bullet-by-bullet rebuttals]",
    why: "Doesn't get read. Doesn't get used. The agent enters the meeting with a thick PDF in their bag and tries to remember what was on page 7 while the seller is talking. The protocol's discipline (1 page max) is what makes the prep usable.",
  },
  {
    label: "the cold open",
    body: "Opener: 'Hi! Great to meet you. So tell me, what are you looking to achieve with this listing?'",
    why: "Generic enough to come from any agent who walked in cold. No reference to anything the seller mentioned in prior conversations. No data point that signals preparation. The seller's first impression is 'this is the same pitch I got from the last three agents'.",
  },
];

export default function PromptMeetingPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 0%, rgba(236,72,153,0.08), transparent), radial-gradient(40% 40% at 0% 30%, rgba(99,102,241,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-4">
            agent toolkit · field guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            Listing appointments
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              are won in the prep.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The agents who close 60-70% of their listing appointments
            aren&apos;t out-pitching the agents who close 30-40%.
            They&apos;re out-preparing them. They walk in with three
            specific talking points, two anticipated risks, and a single
            opener line that earns the seller&apos;s attention in the
            first 90 seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 18 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>foz_listing_prep_2026-04-26.pdf</span>
              <span className="hidden sm:inline">close rate +28%</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`OPENER (first 90s):
  "Three Foz 4-beds closed in March within
   4% of asking — let me show you what
   yours fits into."

3 TALKING POINTS:
  1. Comp band: €1.05M-1.18M (yours sits
     mid-range; facade renovation closes
     the upper gap your sister mentioned)
  2. Buyer pool: tech families relocating
     from Lisbon (matches your
     near-school priority)
  3. Timing: pre-summer window opens
     in 3 weeks (you mentioned end-of-
     June timeline twice)

2 RISKS:
  · Seller may push €1.25M floor — comps
    don't support; offer to revisit at
    week-3 if no offers materialise
  · Spouse not at meeting — confirm joint
    decision before any exclusivity ask`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              One page. Read in 90 seconds in the Uber. The meeting itself
              feels conversational; the prep is what makes the conversation
              calibrated.
            </p>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One-page prep."
          description="The whole leverage of the protocol is brevity — 1 page that gets read, not 15 pages that don't. Each rule protects against over-engineering the document."
        />

        <ol className="mt-10 space-y-5">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[60px_1fr] sm:grid-cols-[88px_1fr] gap-4 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col items-start gap-2">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-semibold text-white text-base sm:text-lg shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #ec4899 100%)",
                  }}
                >
                  {s.n}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-600 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three preps that lose the appointment."
          description="The shapes the document defaults to without prompt discipline. Each one is unhelpful in a different way."
        />

        <div className="mt-8 space-y-4">
          {ANTI_EXAMPLES.map((ex, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 sm:p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-amber-700 font-mono font-semibold">
                {ex.label}
              </div>
              <p className="mt-3 text-[15px] text-slate-800 leading-relaxed italic">
                &ldquo;{ex.body}&rdquo;
              </p>
              <p className="mt-3 text-[14px] text-amber-900 leading-relaxed">
                {ex.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that drafts the prep"
          title="What to feed Claude."
          description="Sonnet recommended — the synthesis of comp data with soft signals is where the value lives, and Haiku tends to default to generic talking points without nuance."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">meeting_system_prompt.md</span>
            <CopyButton text={MEETING_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{MEETING_PROMPT}
          </pre>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <a
            href="https://claude.ai/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:translate-y-[-1px] whitespace-nowrap flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            }}
          >
            Open Claude →
          </a>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Run the prompt 30-60 minutes before each listing appointment.
            Output goes to the agent&apos;s phone screen, not a printed PDF.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 1-page listing prep"
          headlinePrimary="Drafting the prep is step one."
          headlineAccent="Honouring the 1-page limit is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="MEETING"
        origin={
          <>
            A real-estate adaptation of the sales-call prep thesis from B2B
            — the close-rate delta is mostly preparation, not in-room skill.
            Our slice: the 1-page listing-appointment prep — 3 talking
            points + 2 risks + opener line — read in 90 seconds in the Uber.
          </>
        }
      />
    </div>
  );
}
