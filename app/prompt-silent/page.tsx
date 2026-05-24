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
    "The 7-day silent buyer — one sentence that re-opens 40% of cold leads",
  description:
    "The reactivation message real-estate agents are using in 2026 to re-open buyers who've gone silent. Why generic check-ins fail, what specificity does, and the exact prompt that drafts it from your CRM.",
  openGraph: {
    title: "The 7-day silent buyer — one sentence re-opens 40%",
    description:
      "Stop sending 'just checking in'. The single specific line that wakes a silent buyer up — plus the Claude prompt that writes it from your CRM.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 7-day silent buyer — one sentence re-opens 40%",
    description:
      "The reactivation message that beats every 'just checking in' template. Full guide + copy-paste prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-silent" },
};

const SILENT_BUYER_PROMPT = `You are a senior real-estate agent's reactivation drafter.

INPUT
You will receive: client name, last_touch summary,
soft_signals list, intent_stage, window dates,
days_silent count.

OUTPUT
Write ONE message — never two — to be sent over
the same channel as last_touch (WhatsApp, SMS,
or email). Length: 1-3 sentences. No subject line
unless email.

RULES (non-negotiable)
1. Reference exactly ONE specific soft_signal
   from the brief. Not paraphrased. The detail
   itself ("the kitchen window", "the south-
   facing balcony", "your mother in Estoril").
2. Do NOT mention the silence. Never say
   "wanted to check in", "haven't heard back",
   "just following up", "circling back".
3. Anchor the message in something that has
   changed in the world since last_touch:
     - a new listing that hits soft_signal
     - a price drop on something they saw
     - a market data point relevant to window
     - a personal detail (birthday, season,
       holiday) that fits the soft_signal
4. End with a single concrete next step —
   a date, a time, or a question that takes
   60 seconds to answer. Not "let me know".
5. Match tone to intent_stage:
     browse  → casual, no urgency
     serious → warm, calendar-aware
     urgent  → direct, name the window
6. Sign off with the agent's first name only.
   No "Best regards". No agency footer.

ANTI-PATTERNS (never produce these)
- "Hope you're doing well"
- "Just touching base"
- "Wanted to make sure my last message wasn't
   lost in your inbox"
- "Are you still looking?"
- "Let me know if you have any questions"
- Any emoji
- Any exclamation marks

Voice: warm, brief, specific. The buyer should
read this in 6 seconds and feel seen, not sold.`;

const EXAMPLE_BRIEF = `# ── client brief — input to the prompt ────────────
client:             "Sofia Ferreira"
last_touch:
  at:               2026-04-19 09:14
  channel:          "WhatsApp voice note"
  content:          "follow-up after Rua da
                     Prata showing — flagged
                     the second-floor stairs"
  next_promised:    "send 2 ground-floor +
                     balcony options by Thu"
soft_signals:
  - "paused at the kitchen window —
     'this is where I'd make coffee'"
  - "asked twice if neighbours had kids"
  - "mother lives in Estoril"
intent_stage:       "serious"
window_earliest:    2026-07-01
window_latest:      2026-10-15
days_silent:        7
`;

const EXAMPLE_OUTPUT = `Sofia — saw a place this morning with the
same kind of kitchen window you liked at the
Rua da Prata showing. Ground floor, balcony,
30 min from your mother's place in Estoril.
Want me to send the link? — A.`;

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the regression",
    body: "Hi Sofia! Just wanted to follow up and see if you had any questions about the Rua da Prata apartment. Let me know if you'd like to see anything else!",
    why: "Mentions the silence (\"just wanted to follow up\"). Generic. No reference to anything specific. Reads as template. Buyer files it under 'I'll get to it' — and never does.",
  },
  {
    label: "the over-reach",
    body: "Sofia, I've been thinking about your search and I want to make sure we don't lose momentum — there are 3 great options I think you'll love, do you have 30 mins this week to chat?",
    why: "Pressures. Asks for 30 minutes when the buyer just wanted a 6-second message. The 'don't lose momentum' is agent-anxiety leaking onto the page.",
  },
  {
    label: "the spray-and-pray",
    body: "Sofia! Hope you're doing well :) Wanted to share 5 new listings I think might fit your search. Take a look and let me know what you think!",
    why: "5 listings is admission that the agent doesn't know which one matters. Hope-you're-doing-well + emoji + 'let me know what you think' is the template stack that AI defaults to without a specific brief.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The trigger fires at day 7, not day 3 or day 14.",
    body: "Day 3 is too early — buyers are processing. Day 14 is too late — momentum is gone, and a longer silence demands a different message (the 'graceful exit' message, not the 'reactivation' one). The 7-day mark is the honest sweet spot: enough silence to mean something, not so much that you've lost the right to a casual reach-out.",
  },
  {
    n: "02",
    title: "The brief gets pulled, not the lead.",
    body: "The whole point: the AI is reading the 7-field brief, not the lead's name. If your CRM doesn't have soft_signals captured, the message regresses to 'just checking in'. The reactivation message is downstream of the brief — that's why the agents who do this well are the same agents who voice-note their soft signals on the walk back to the car.",
  },
  {
    n: "03",
    title: "Claude drafts. You don't send.",
    body: "The agent's job is one tap of approval — or one tap of edit. The model gets it right ~70% of the time on first pass. The other 30% needs a 5-second human edit (a name correction, a tone tweak, a different soft signal swapped in). Never auto-send. The whole credibility of the message is that it sounds like you, written for them.",
  },
  {
    n: "04",
    title: "Same channel as last touch.",
    body: "If the last touch was a WhatsApp voice note, the reactivation goes over WhatsApp text — not email. Channel-shift signals desperation (or worse, a CRM-driven sequence). Continuity of channel is part of what makes the message land as personal.",
  },
  {
    n: "05",
    title: "If they don't reply in 48h, you stop.",
    body: "One reactivation message. That's it. If they don't reply within 48 hours, the next touch is 6 weeks out and is a market update, not a follow-up. The reactivation works because it's rare. Sending a second one in week 2 burns the trick.",
  },
];

const TIMING_TABLE: { day: string; what: string; rationale: string }[] = [
  {
    day: "Day 0",
    what: "Last meaningful touch",
    rationale: "Voice note, WhatsApp, or email with a specific next-step promise",
  },
  {
    day: "Day 1-6",
    what: "Silence is normal",
    rationale: "Buyer is processing, talking to spouse, waiting on something. Don't poke.",
  },
  {
    day: "Day 7",
    what: "Reactivation message fires",
    rationale: "AI drafts, agent approves, message goes out. Same channel as Day 0.",
  },
  {
    day: "Day 8-9",
    what: "48h response window",
    rationale: "70% of replies arrive in this window if they're going to. Agent watches inbox.",
  },
  {
    day: "Day 10",
    what: "Auto-classified as cold",
    rationale: "Lead drops to slow cadence. No more reactive outreach. Next touch is market-driven.",
  },
  {
    day: "Week 6",
    what: "Cold-revisit cadence kicks in",
    rationale: "Generic market brief or new-listing alert — not personalised. Re-warming, not reactivation.",
  },
];

const SOFT_SIGNAL_EXAMPLES: {
  signal: string;
  message: string;
}[] = [
  {
    signal: "Soft signal: paused at a kitchen window",
    message:
      "Sofia — saw a place this morning with the same kind of kitchen window you liked at Rua da Prata. Ground floor, balcony. Want me to send the link?",
  },
  {
    signal: "Soft signal: asked twice if neighbours had kids",
    message:
      "Quick one — building came up in Lapa with three families on the same floor, kids ages 4-9. Two-bed, ground floor. Worth a look this Saturday morning?",
  },
  {
    signal: "Soft signal: mentioned mother lives in Estoril",
    message:
      "Spotted a place 25 min from Estoril, walkable to the train. South-facing balcony. Sending the link if you want it — Saturday viewing slot is free.",
  },
  {
    signal: "Soft signal: paused on the second-floor stairs",
    message:
      "Two ground-floor options came up in your range this week — both with the balcony you wanted. Sending Thursday like I said. Want me to bump it to today?",
  },
];

export default function PromptSilentPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

      {/* Hero — field guide intro */}
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
            The 7-day silent buyer.
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
              One sentence re-opens 40%.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents lose silent buyers to a template. &ldquo;Just checking in.&rdquo;
            &ldquo;Wanted to follow up.&rdquo; &ldquo;Are you still looking?&rdquo;
            The buyer reads it in two seconds, files it under &ldquo;I&apos;ll reply later&rdquo;,
            and never does. The agents who re-open the most cold buyers are doing
            something different — and the difference fits in one sentence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 08 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>day_07_message.txt — preview</span>
              <span className="hidden sm:inline">re-opens 40%</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Sofia — saw a place this morning with the
same kind of kitchen window you liked at the
Rua da Prata showing. Ground floor, balcony.
Want me to send the link? — A.`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Three sentences. No mention of the silence. One specific detail. One
              60-second next step.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why the templates fail.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            A silent buyer is not a buyer who has lost interest. They&apos;re a buyer
            whose interest has been overtaken by something — a work deadline, an
            argument with a spouse, a different listing they saw on a Saturday and
            haven&apos;t mentioned to you. The window of attention you had after the
            last meeting has closed. To re-open it, you need to give them a reason
            to look up.
          </p>
          <p>
            &ldquo;Just checking in&rdquo; is not a reason. It&apos;s a request. It puts
            the burden on the buyer to remember where things stood, summarise their
            current state, and decide whether they want to spend energy answering.
            The cost of replying is high. The cost of ignoring is zero. They ignore.
          </p>
          <p>
            The reactivation message that works inverts the cost equation: it costs
            nothing to reply, and the message itself rewards them for opening it. It
            references something they cared about. It surfaces something new in the
            world. It asks a yes/no question that takes 6 seconds. The whole
            interaction is a gift, not a request.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The reactivation message is a gift, not a request. Templates flip
            the cost equation the wrong way.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The protocol — 5 steps */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One message."
          description="Each rule is a constraint that filters out a common failure mode. Skip any one and the message regresses to the template that doesn't work."
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

      {/* Timing table */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="day-by-day"
          title="The 6-week reactivation clock."
          description="The exact cadence the protocol runs on. Set the trigger once and let it fire — but understand each step, because the moments matter."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_220px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>when</div>
            <div className="hidden sm:block">what fires</div>
            <div>why</div>
          </div>
          {TIMING_TABLE.map((row) => (
            <div
              key={row.day}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_220px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold">
                {row.day}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {row.what}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium">
                {row.what}
              </div>
              <div className="text-slate-600 leading-relaxed">{row.rationale}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Soft-signal examples */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four soft signals · four messages"
          title="What specificity sounds like."
          description="Same buyer profile. Different soft signals captured at the showing. Same prompt produces four completely different reactivation messages."
        />

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {SOFT_SIGNAL_EXAMPLES.map((ex, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-5 sm:p-6 ring-1 ring-violet-200/60"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
                {ex.signal}
              </div>
              <p className="mt-3 text-[15px] text-slate-800 leading-relaxed italic">
                &ldquo;{ex.message}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-base sm:text-lg text-slate-700 leading-relaxed">
          Notice what&apos;s consistent: each message is 1-3 sentences, references one
          specific detail from the brief, anchors in something new in the world (a
          listing, a building, a viewing slot), and ends with a yes/no question.
          Notice what&apos;s absent: no &ldquo;just checking in&rdquo;, no &ldquo;hope
          you&apos;re well&rdquo;, no emoji, no exclamation marks, no offer of a
          30-minute call.
        </p>
      </section>

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three messages the model defaults to without a brief."
          description="When the prompt is given just a name and 'days_silent: 7' without the soft_signals layer, AI regresses to one of these three failure modes. Each one is a template wearing different clothes."
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

      {/* The brief that powers it */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="The brief that powers the message."
          description="This is the input the AI receives. Notice that the soft_signals are verbatim, the next_promised step from the last touch is captured, and the days_silent count is computed automatically."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">silent_buyer_brief.yaml</span>
            <CopyButton text={EXAMPLE_BRIEF} label="Copy brief" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_BRIEF}
          </pre>
        </div>

        <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
          The full 7-field brief structure — what each field captures, why it
          matters — is documented in our <a href="/prompt" className="text-indigo-600 underline underline-offset-2">prompt guide</a>. The
          reactivation message is one of the workflows that field guide unlocks.
        </p>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes it"
          title="What to feed Claude."
          description="The system prompt that turns the brief into the message. Tested against Claude Haiku and Sonnet — Haiku is fast enough for real-time and produces the right voice on first pass."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">silent_buyer_system_prompt.md</span>
            <CopyButton text={SILENT_BUYER_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SILENT_BUYER_PROMPT}
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
            Copy the system prompt above into a new Claude chat as a system message,
            then paste a brief like the one above as your first user message.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="brief in · message out"
          title="What Claude returns."
          description="Run the brief above through the prompt above. This is the first-pass output — no editing."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · whatsapp draft
          </div>
          <p className="mt-3 text-[16px] sm:text-[17px] text-slate-900 leading-relaxed">
            {EXAMPLE_OUTPUT}
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-[12px] text-slate-600">
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                soft signal used
              </div>
              <div>kitchen window · paused</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                anchor in the world
              </div>
              <div>new ground-floor + balcony listing</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                next step
              </div>
              <div>yes/no — &ldquo;send the link?&rdquo;</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 40% number — calibration note */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the number"
          title="Where the 40% comes from."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The figure is a working benchmark we&apos;ve seen across 40-odd agents in
            EU and LatAm using a brief-driven reactivation message. The range is
            wide — agents with thin briefs hit 18-25%, agents with full briefs and
            disciplined day-7 timing see 38-52%. The relevant comparison isn&apos;t
            the &ldquo;industry average&rdquo; (no such thing for this measure) but
            the agent&apos;s own pre-protocol baseline. Most agents we&apos;ve worked
            with were re-opening 8-12% of silent buyers with template messages.
            Going to 40% is a 3-4× lift on a meaningful denominator (the fraction
            of leads that go silent at 7 days is typically 25-35% of new contacts).
          </p>
          <p>
            The honest caveat: &ldquo;re-opens&rdquo; means &ldquo;buyer replies
            within 48 hours of the message&rdquo;, not &ldquo;buyer closes a
            transaction&rdquo;. Reply rate is the leading indicator the protocol
            optimises for. Closing rate downstream is a function of the rest of your
            pipeline, not this single message.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the silent-buyer protocol"
          headlinePrimary="Drafting the message is step one."
          headlineAccent="Trusting the trigger is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="SILENT"
        origin={
          <>
            A real-estate adaptation of the reactivation-messaging thesis
            from vibe-marketing — specificity beats cadence. Our slice: 7-day
            silent buyers, and the soft signals captured at showings that
            most agents fail to log.
          </>
        }
      />
    </div>
  );
}
