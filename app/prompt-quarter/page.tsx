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
    "30-min quarterly review — AI does the math, I make the call",
  description:
    "How real-estate agents run a quarterly business review in 30 minutes — what worked, what to drop, what to double down on. The 3-question framework, the 2-stop / 1-double-down rule, and the compound effect over 4 quarters.",
  openGraph: {
    title: "30-min quarterly review.",
    description:
      "AI analyses ROI per channel, recommends 2 stops + 1 double-down. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "30-min quarterly review",
    description:
      "AI does the math; I make the call. 2-stop / 1-double-down rule.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-quarter" },
};

const QUARTER_PROMPT = `You are a senior real-estate agent's
quarterly business-review analyst.

INPUT
You receive: every closed transaction
of the quarter with source channel
(referral / IG / open-house / cold
outreach / past client / other), GCI
per deal, agent hours invested in
each channel during the quarter
(self-reported), and the previous
quarter's review notes.

OUTPUT
A 1-page review with three sections:

  WHAT WORKED — the 1 channel with
                the highest ROI
                (GCI/hour). Names it,
                quantifies it, and
                says why this quarter.

  WHAT DIDN'T — the 1-2 channels
                with the lowest ROI
                (or unmeasurable ROI).
                Names them honestly.

  THE CALL — exactly:
    - 2 STOPS: which 2 channels to
      pause or drop next quarter.
      Specific reasoning per stop.
    - 1 DOUBLE-DOWN: which 1 channel
      to invest more in next quarter.
      Specific allocation suggestion.

The review ends with a 1-line
calibration note: how accurate were
last quarter's stops and double-down?

RULES (non-negotiable)
1. Always 2 stops, always 1 double-
   down. Never more, never fewer.
   The discipline is in the constraint.
2. ROI is GCI per hour, not GCI
   total. A channel that produced
   €40k from 200 hours is worse
   than a channel that produced
   €30k from 60 hours.
3. Don't recommend stopping a channel
   the agent is emotionally attached
   to without strong data. Surface
   the data; let the agent decide.
4. The double-down recommendation
   must be specific (hours/budget/
   activities), not vague ('do more
   of this').
5. Calibration: each quarterly
   review reports on the previous
   quarter's recommendations
   (what was stopped, what was
   doubled down, what changed).

ANTI-PATTERNS (never produce these)
- More than 2 stops (paralysis)
- More than 1 double-down (no focus)
- Vague recommendations ('focus on
  what works')
- ROI based on GCI total alone
- Hiding the calibration delta`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "ROI is per hour, not per deal.",
    body: "Most quarterly reviews look at GCI per channel and conclude 'Channel X produced the most money'. But Channel X may have consumed 200 hours; another channel produced 60% of that GCI in 40 hours. Per-hour ROI is the only honest comparison. The protocol's first job is computing this honestly — and the comparison usually flips the agent's intuition about which channels work.",
  },
  {
    n: "02",
    title: "Always 2 stops. Always 1 double-down. Constraints force decisions.",
    body: "The 2-stop / 1-double-down rule is the protocol's core constraint. Without it, agents review and conclude 'this all went pretty well, let's keep doing everything'. With it, the agent is forced to drop something — and to focus on something. The constraint is uncomfortable; the constraint is the value.",
  },
  {
    n: "03",
    title: "The double-down must be specific.",
    body: "Vague recommendations don't ship. 'Double down on past-client referrals' is a sentiment; 'Allocate 20 hours/quarter to past-client check-in calls and 1 quarterly handwritten card per past client' is a plan. The protocol's prompt actively forbids vague double-downs and produces specific allocations the agent can implement on day 1 of the next quarter.",
  },
  {
    n: "04",
    title: "Calibration: last quarter's recommendations get reviewed.",
    body: "Every quarterly review starts by reporting on the previous quarter's stops and double-down. Did the stops actually free up time? Did the double-down produce the expected lift? This honesty creates the only feedback loop that makes the protocol get smarter over time — without it, the recommendations are unmoored from reality.",
  },
  {
    n: "05",
    title: "The compound effect: 4 quarters of disciplined stops + double-downs.",
    body: "One quarter of the protocol shifts the agent's allocation by ~15%. Four consecutive quarters of disciplined application shifts it by 50-70% — toward the channels that actually produce. The compound effect is what separates agents who run quarterly reviews honestly from agents who feel like they should but don't. The lift is in the discipline of the cadence.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the no-stops",
    body: "What worked: open houses + IG outreach. What didn't: nothing major. The call: keep doing what's working, optimise on the margins.",
    why: "No stops named, no double-down specified. The review concludes 'keep doing everything', which is the same allocation as last quarter — and the same as the quarter before. The protocol's discipline forces a stop and a double-down precisely because 'keep doing everything' is the default that produces flat performance.",
  },
  {
    label: "the GCI-total ranking",
    body: "Best channel: open houses (€220k GCI). Worst channel: handwritten cards (€18k GCI). Stop: handwritten cards.",
    why: "Ranked by total GCI without considering hours invested. Open houses may have consumed 300 hours for €220k (€733/hr); handwritten cards 8 hours for €18k (€2,250/hr). The 'worst' channel by total GCI is actually the highest ROI channel by hour. Per-hour ROI flips the call.",
  },
  {
    label: "the vague double-down",
    body: "Double down on referrals — they're our best channel.",
    why: "Sentiment, not plan. The agent reads this and... keeps doing what they were doing. Specific double-downs name hours, activities, allocations: 'Add 4 hours/week to past-client outreach via the radar protocol' is implementable. 'Double down on referrals' is not.",
  },
];

export default function PromptQuarterPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

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
            agent toolkit · field guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            30-min quarterly review.
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
              AI does the math. I make the call.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents skip quarterly reviews — they feel like
            corporate ceremony, they take hours, and the conclusions
            are usually &ldquo;keep doing everything&rdquo;. The
            protocol replaces this with a 30-minute pass: AI computes
            ROI per channel, surfaces the data, and the agent makes
            exactly two stops and one double-down. Compounded over
            four quarters, the allocation shifts dramatically toward
            what works.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 30 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. 30 minutes a quarter."
          description="The discipline that makes quarterly review actually shift the agent's behaviour. Each rule prevents one of the failure modes that turns review from useful into ceremony."
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
                      "#2563EB",
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
          title="Three reviews that change nothing."
          description="The shapes the review defaults to without strict discipline. Each one is what 90% of agent quarterly reviews look like — and why those reviews don't compound into shifted allocations."
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
          eyebrow="the prompt that runs the review"
          title="What to feed Claude."
          description="Run on the last working day of each quarter. Inputs: closed transactions (CRM), self-reported hours per channel (a 5-min Google Form completed across the quarter), previous review&apos;s recommendations."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">quarter_system_prompt.md</span>
            <CopyButton text={QUARTER_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{QUARTER_PROMPT}
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
                "#2563EB",
            }}
          >
            Open Claude →
          </a>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Run on the last working day of each quarter. The agent reads the
            review (5 min), considers (15 min), commits to the call (10 min).
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 30-min quarterly review"
          headlinePrimary="Running the review is step one."
          headlineAccent="Honouring 2 stops + 1 double-down is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="QUARTER"
        origin={
          <>
            A real-estate adaptation of the quarterly-review discipline
            from startup operations — the simplest version that actually
            changes behaviour quarter over quarter. Our slice: the 2-stops
            + 1-double-down rule applied to the agent&apos;s channel
            allocation.
          </>
        }
      />
    </div>
  );
}
