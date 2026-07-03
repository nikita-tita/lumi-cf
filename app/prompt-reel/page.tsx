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
    "One reel a day — 4 minutes to script",
  description:
    "How real-estate agents script 15-second IG reels from a single property fact. The hook + 3 beats + CTA structure, the b-roll storyboard, and the cadence math that turns 4-minute scripts into 30 reels a month.",
  openGraph: {
    title: "One reel a day. 4 minutes to script.",
    description:
      "Voice memo of one fact → 15-sec reel script + b-roll storyboard. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "One reel a day. 4 minutes to script.",
    description:
      "Property fact → 15-sec reel script + storyboard. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-reel" },
};

const REEL_PROMPT = `You are a senior real-estate agent's
short-form-video script generator.

INPUT
You receive: a single property fact
(usually voice-noted by the agent —
"3-bed in Foz sold in 4 days for €25k
over asking", "open house had 18
sign-ins this weekend", "comp pull
shows €/sqm up 6% in 3 months"), the
agent's IG audience size + general
demographic, and which audio category
the agent is leaning toward (trending
instrumental / lifestyle / talking-head
voice-only).

OUTPUT
A 15-second reel script with:

  HOOK (0-2 seconds):
    A single sentence that stops scroll.
    Specific number, contrarian
    framing, or unexpected detail.

  3 BEATS (2-12 seconds):
    Three short statements that pay
    off the hook. Each lasts ~3-4
    seconds. Together they tell the
    story.

  CTA (12-15 seconds):
    A single call to action — comment
    a keyword, save the post, send to
    a friend. Never "DM me for more"
    (vague, low-conversion).

  B-ROLL STORYBOARD:
    For each beat, a brief description
    of what footage should play.
    Agent can use phone footage, MLS
    photos, or stock if needed.

RULES (non-negotiable)
1. Hook is 1 sentence. Not 2. Not a
   question that's not really a hook.
   "Want to know how I closed a deal
   in 4 days?" is a question, not a
   hook. "I closed a deal in 4 days
   on a $1.2M listing" is a hook.
2. Each beat advances. No filler.
   No "and what's interesting is..."
   bridges.
3. CTA is keyword-based, not
   relationship-based. Drives DM
   funnel via ManyChat.
4. Total script length: 35-45 words.
   This is the sweet spot for 15
   seconds at conversational pace.
5. Voice-style matches the agent's
   actual voice — if they don't say
   "y'all" in real life, they don't
   say it in the reel.

ANTI-PATTERNS (never produce these)
- Hooks that are questions ending in
  "...you won't believe what
  happened next"
- Beats that contradict the hook
- CTAs like "DM me for the full
  story"
- Scripts longer than 50 words
- Generic b-roll prompts ("show
  the property")`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "One fact. One reel. Don't compress multiple facts.",
    body: "Each reel is built from one specific fact — a single number, a single transaction, a single observation. Trying to fit two facts into 15 seconds dilutes both. The agent voice-notes one fact ('Cascais 3-bed sold in 4 days for €25k over'), the prompt builds a reel around that. If there are five facts to share, that's five reels — one a day for a week.",
  },
  {
    n: "02",
    title: "The hook is a stop-scroll, not a tease.",
    body: "The most common failure mode in agent-generated reels: the hook is a question pretending to be a hook. 'Want to know how I closed a deal in 4 days?' makes the viewer scroll past — they don't want to watch a 15-second video to find out something the hook wouldn't tell them. The hook itself is the surprising fact: 'I closed a $1.2M deal in 4 days. Here's what happened.'",
  },
  {
    n: "03",
    title: "Beats pay off the hook. No bridges, no filler.",
    body: "Each beat lasts 3-4 seconds. Each one advances the story. The temptation to use 'and what's interesting is...' or 'so I had to...' as a bridge fills time without adding information — and the viewer's attention falls. Cut hard between beats. The viewer's brain does the connecting; the script doesn't have to spell it.",
  },
  {
    n: "04",
    title: "The CTA drives the keyword DM funnel.",
    body: "Every reel ends with a single keyword CTA: 'Comment FAST for the prompt I used'. The keyword fires the ManyChat flow (see /prompt-dm) and creates a CRM lead. 'DM me for more' is a 5-10× lower-conversion CTA — most viewers don't want to start a conversation. The keyword is a low-effort action that the funnel converts downstream.",
  },
  {
    n: "05",
    title: "Cadence math: 1 reel/day × 30 days = 30 reels/month.",
    body: "The agent records one 30-second voice memo per day with one fact. The prompt produces a 15-second reel script in 90 seconds. The agent shoots b-roll while showing properties or walking neighbourhoods (5 minutes of phone video covers a week of beats). Total time per reel: 4 minutes start-to-publish. 30 reels in a month is what compounds the agent's IG presence into real lead flow.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the question-hook",
    body: "[Hook]: 'Want to know how I sold a property in 4 days for $25k over asking?' [Beats]: 'I had this listing in Cascais...'",
    why: "Question hook. The viewer thinks 'no, I'll scroll past'. The hook should BE the answer: 'I sold a property in 4 days for $25k over asking. Here's what worked.' The hook earns the next 13 seconds; the question pushes viewers away.",
  },
  {
    label: "the bridge-filler",
    body: "[Beat 1]: 'I priced it at €825k.' [Beat 2]: 'And what's interesting is, I had multiple offers within 48 hours.' [Beat 3]: 'So I had to think about what to do next.'",
    why: "Two beats are bridges, not advances. 'And what's interesting' and 'so I had to' fill time without adding information. The 15-second window has no room for filler — every beat must advance the story. Cut hard.",
  },
  {
    label: "the vague CTA",
    body: "[CTA]: 'DM me for more details on this listing or any others I have available!'",
    why: "Vague, generic, requires effort. The viewer thinks 'I'd have to start a conversation, decide what to say, wait for a reply...' and skips. The keyword CTA ('Comment CASCAIS for the comp pull') is one tap, no conversation, drives a CRM lead automatically.",
  },
];

export default function PromptReelPage() {
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
            One reel a day.
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
              Four minutes to script.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents look at IG and see a content treadmill they
            can&apos;t maintain. The agents producing 30 reels a month
            aren&apos;t writing more — they&apos;re running a tight loop:
            voice-note one fact, generate a 15-second script in 90
            seconds, shoot 30 seconds of b-roll, post. Total time per
            reel: 4 minutes. The cadence is what compounds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 25 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Fifteen seconds."
          description="The discipline of short-form video that converts. Each rule cuts a specific failure mode that turns 15 seconds into a scroll-past."
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
          title="Three reels that lose the scroll."
          description="Each one breaks one of the protocol's rules. Each one is a real script we've seen agents post — and each one had completion rates under 30% when the average successful reel is 60-80%."
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
          eyebrow="the prompt that drafts the script"
          title="What to feed Claude."
          description="Haiku is fine — speed matters more than nuance for short-form. Run the prompt once per voice-noted fact; the output is a script + storyboard the agent shoots in one walk-around."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">reel_system_prompt.md</span>
            <CopyButton text={REEL_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{REEL_PROMPT}
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
            Voice memo a fact. Run the prompt. Shoot 30s of b-roll. Post.
            Repeat daily.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact reel-a-day cadence"
          headlinePrimary="Drafting the script is step one."
          headlineAccent="Trusting the daily cadence is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="REEL"
        origin={
          <>
            A real-estate adaptation of the short-form-video creator
            playbook (hook → 3 beats → CTA, with audio and pacing tuned for
            completion). Our slice: 30 reels a month from voice-noted facts,
            scripted in 4 minutes each.
          </>
        }
      />
    </div>
  );
}
