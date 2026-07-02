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
    "I close my inbox at 9am — the decision board tells me everything",
  description:
    "How real-estate agents work from a single 5-action board ranked by deal-impact, with the inbox closed all day. The 5-item structure, the 'nothing on the board, nothing happens' rule, and the productivity lift over inbox-driven days.",
  openGraph: {
    title: "I close my inbox at 9am.",
    description:
      "Top 5 actions ranked by deal-impact. The board runs the day. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "I close my inbox at 9am",
    description:
      "Decision board: top 5 actions, ranked by deal-impact. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-board" },
};

const BOARD_PROMPT = `You are a senior real-estate agent's
daily decision-board curator.

INPUT
You receive: all open todos, the lead-
score tier per affected lead, window-
urgency (days-to-window for each
affected client), recent
soft-signals from yesterday, and
the agent's calendar for the day.

OUTPUT
The top 5 actions for today, ranked
by deal-impact:

  Each item:
    rank: 1-5
    action: a single specific verb-
            phrase ("Send Marina the
            HOA history", "Call José
            re: Murtais offer")
    why: 1 sentence — the deal-impact
         reasoning (which lead, what
         tier, what window pressure)
    estimated_time: minutes

  Daily total: under 4 hours of
  actionable work. The remaining
  hours are showings, calls, and
  meeting prep.

RULES (non-negotiable)
1. Five items. Not seven, not three.
   Five is the cognitive sweet spot
   for daily focus.
2. Each action must be a specific
   verb-phrase. "Follow up with
   Marina" is not actionable; "Send
   Marina the HOA history with
   tomorrow's listing" is.
3. The board ranks by deal-impact,
   not by deadline urgency. A
   €20k commission tomorrow beats
   a €4k commission today.
4. Inbox-driven items go LAST or
   not at all. If an email needs
   a reply but there's no deal-
   impact reason, it's not on the
   board.
5. The board is the day's contract.
   Anything not on the board doesn't
   get done. Anything on the board
   that doesn't get done is reviewed
   tomorrow.

ANTI-PATTERNS (never produce these)
- Vague actions ("touch base with
  buyers")
- Too many items (>5 = analysis
  paralysis)
- Items without deal-impact reasoning
- Including the inbox as a top-5
  item ("clear inbox")
- Items requiring more than 90
  minutes (those are projects;
  break them down)`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The inbox is the enemy. Close it at 9am, open it at 5pm.",
    body: "The inbox is reactive — every email pulls the agent into someone else's priority. The decision board is proactive — every item is on it because the agent (with AI's help) decided it matters. Closing the inbox is the most counter-intuitive habit; agents fear missing something urgent. In practice, anything truly urgent reaches you another way (phone, SMS, the broker calling you) and the rest can wait.",
  },
  {
    n: "02",
    title: "Five items. Not seven, not three. Five.",
    body: "Behavioural research is consistent: lists of 5 items are remembered, prioritised, and acted on at higher rates than lists of 7+. Three items leaves the agent with too much spare time and they default to inbox-grazing. Seven items distributes attention thinly. The protocol's strictness (always 5) is calibrated to how human focus works.",
  },
  {
    n: "03",
    title: "Rank by deal-impact, not deadline urgency.",
    body: "Most to-do lists rank by deadline ('this is due today, this is due tomorrow'). The deal-impact ranking asks 'which of these will move the most commission this quarter if I do it well?'. A €20k commission deal that's flexible beats a €4k commission deal with a tomorrow deadline. The protocol's ranking discipline is what shifts the agent's day toward high-leverage work.",
  },
  {
    n: "04",
    title: "Verb-phrases only. Vague actions don't ship.",
    body: "'Follow up with Marina' is not on the board. 'Send Marina the HOA history with tomorrow's listing' is. The difference is whether the action can be started immediately without first deciding what to do. Vague actions become procrastination; specific verb-phrases become 12-minute blocks of execution.",
  },
  {
    n: "05",
    title: "The board is the day's contract. Honour it.",
    body: "The hardest discipline: nothing on the board, nothing happens. If a client emails at 11am asking for a CMA refresh, the agent's instinct is to drop everything and do it. The protocol's discipline says: add it to tomorrow's board. The exception list is small (legal deadline, contract action, immediate fire) and explicit. Honouring the contract is what produces the productivity lift.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the kitchen-sink",
    body: "Today's board: 1) Clear inbox (60 min). 2) Touch base with all warm leads. 3) Update CRM. 4) Plan next week. 5) Review market data. 6) Schedule social posts. 7) Check messages. 8) Lunch.",
    why: "Eight items, mostly vague, half are inbox-grazing in disguise. 'Clear inbox' is anti-protocol. 'Touch base with all warm leads' is not a single action. The board's job is to be 5 specific verb-phrases ranked by deal-impact. This is a to-do list pretending to be a decision board.",
  },
  {
    label: "the deadline-blind",
    body: "Today's board: 1) Reply to José's text about Murtais offer (€18k commission, decision today). 2) File the title paperwork due today. 3) Send Marina HOA history (€15k commission). 4) Call back the warm lead from the open house. 5) Check email.",
    why: "Item 5 is anti-protocol. Items 1-2 are urgent but not necessarily highest-impact. The board should rank by deal-impact: if Marina's deal is closer to closing than José's, she goes first regardless of who's louder. Deadline urgency is a factor in the ranking, not the rule.",
  },
  {
    label: "the abandoned contract",
    body: "[At 11am, agent abandons board to handle a CMA refresh that came in via email. By 3pm, only 1 of 5 board items done.]",
    why: "The agent broke the contract. The CMA refresh wasn't on the board, but the agent let an inbox-driven request override the day's plan. By the end of the day, the high-impact deal-moving items haven't moved. The discipline of honouring the board is what produces the productivity lift; abandoning it once trains the agent to abandon it always.",
  },
];

export default function PromptBoardPage() {
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
            I close my inbox at 9am.
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
              The board tells me everything.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents start the day in their inbox and end the day
            wondering where the day went. The decision board inverts
            this: top 5 actions ranked by deal-impact, drafted before
            the agent opens email, honoured as the day&apos;s contract.
            The inbox stays closed until 5pm. The board runs the day.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 29 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Five items. Inbox closed."
          description="The discipline that turns the day from reactive to proactive. Each rule prevents one of the failure modes that turns the board from a contract into a to-do list."
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
          title="Three failure modes that destroy the protocol."
          description="The shapes the board defaults to without strict discipline. Each one collapses the productivity lift the protocol exists to deliver."
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
          eyebrow="the prompt that curates the board"
          title="What to feed Claude."
          description="Run at 8am every weekday. Inputs come from the lead-score protocol (see /prompt-score), the calendar, and yesterday's call-log captures. Output is the day's 5-item contract."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">board_system_prompt.md</span>
            <CopyButton text={BOARD_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{BOARD_PROMPT}
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
            Run at 8am via cron. Surface the board on a single phone screen
            (the agent shouldn&apos;t open a CRM to see it).
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 5-item decision board"
          headlinePrimary="Generating the board is step one."
          headlineAccent="Honouring it as the day's contract is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="BOARD"
        origin={
          <>
            A real-estate adaptation of the deep-work discipline (Cal
            Newport, David Allen). Our slice: 5 daily actions ranked by
            deal-impact, the inbox closed until 5pm, the board as the
            day&apos;s contract.
          </>
        }
      />
    </div>
  );
}
