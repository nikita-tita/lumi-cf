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
    "The Sunday-night pipeline review — AI tells you which 8 clients matter Monday",
  description:
    "The Sunday 7 PM AI-generated pipeline review that flags 3 hot leads, 3 cold-needing-action, and 2 deals at risk. Ten minutes over coffee replaces three hours of CRM scrolling. Full guide + Claude prompt + decision rules.",
  openGraph: {
    title: "The Sunday-night pipeline review — 10 min sets your week",
    description:
      "Stop opening your CRM Monday morning. AI sorts your pipeline Sunday at 7 PM into hot / cold / risk. Ten minutes of decisions sets the week.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sunday-night pipeline review.",
    description:
      "AI flags the 8 clients that matter Monday. Ten minutes over coffee. Here's the protocol.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-weekly-review" },
};

const REVIEW_PROMPT = `You are a real-estate agent's weekly pipeline
analyst.

INPUT
You will receive an array of all active clients
in the agent's pipeline. For each:
  - name, intent_stage, window_earliest,
    window_latest, last_touch.at,
    last_touch.next_promised, days_since_touch,
    open_objections, soft_signals (latest 3),
    listings_shown_count, properties_offered_on
  - any open todos linked to this client
  - any conflicts on the agent's calendar
    that block the next promised step

OUTPUT
A 3-bucket review, plain text, designed to be
read at Sunday 7 PM in 10 minutes. Each bucket
holds at most 3 clients (cap matters — see
rules).

STRUCTURE — exactly 3 buckets, in this order:

  Bucket 1 · HOT — move on Monday.
    Up to 3 clients where the next concrete
    action is overdue or due this week, AND
    intent_stage is serious or urgent. For
    each: name, the one action, the deadline.

  Bucket 2 · COLD — needs reactivation.
    Up to 3 clients where days_since_touch ≥ 7
    AND intent_stage is browse or serious AND
    last_touch.next_promised was missed. For
    each: name, the one specific opener
    (referencing a soft_signal), the channel.

  Bucket 3 · AT RISK — could lose this week.
    Up to 2 clients where there's an open
    objection unresolved >14 days, OR a
    competitor agent is showing them properties,
    OR the agent missed a promised next-step
    >7 days ago. For each: name, the risk,
    the rescue move.

RULES (non-negotiable)
1. Cap each bucket strictly. If there are
   more than 3 hot, pick the 3 highest by
   (window_urgency × intent_stage). The
   point is forced prioritisation, not
   completeness.
2. Each entry is ONE concrete action. Not
   "follow up" — "call Sofia at 9:30 Mon
   re: HOA fees".
3. Sort within each bucket by when the
   action must happen (earliest first).
4. If a bucket has zero entries, say so
   explicitly. "No hot moves needed
   Monday" is a valid output and a real
   signal.
5. End with a 1-line week-shape summary:
   "8 clients on the board this week.
    3 hot, 3 cold, 2 at risk."

ANTI-PATTERNS (never produce these)
- A bucket with 5+ clients (lose
  prioritisation; defeats the purpose)
- Generic actions like "check in" or
  "send some listings" — every action must
  be specific
- A separate "FYI" or "watch" bucket — the
  three buckets exist because they each
  prompt different behaviour. Don't add
  more.
- Editorial commentary ("things look great
  this week!"). Just the buckets.

Voice: clinical, brief, decision-prompting.
The agent is reading this with their feet up
on a Sunday — they need clarity, not
analysis.`;

const EXAMPLE_OUTPUT = `Pipeline review · week of April 27

HOT — move on Monday
  - Sofia & Carlos Ferreira — Mon 9:30,
    answer Carlos's HOA question (280€/mo)
    and lock Saturday 11am viewing.
  - Diego Almeida — Mon 14:00, send the
    pre-approval intro to Banco Santander
    (he's window 60 days, lender chosen).
  - Aisha Rahman — Tue 10:00, open-house
    follow-up on Lapa property (asked
    about the kitchen, didn't ask about
    schools — bring it up).

COLD — needs reactivation
  - João Silva — silent 11d. Open with
    "saw a place this morning that fits
    your top-floor + view ask" — WhatsApp.
  - Maria Costa — silent 9d. Open with
    "the Estoril building you liked just
    dropped 4%" — SMS.
  - Henrique Pinto — silent 14d. Open
    with "school catchment update for
    Ajuda Primary — moved by 600m" —
    email (his preferred channel).

AT RISK — could lose this week
  - Ana & Tiago Mendes — competitor agent
    showing them Carcavelos properties.
    Rescue: lock the Sintra walking tour
    you promised 3 weeks ago, this Sat.
  - Miguel Almeida — open objection on
    HOA fees unresolved 18 days. Rescue:
    send the comparison vs his current
    HOA (saves 90€/mo) by Tuesday.

8 clients on the board this week.
3 hot, 3 cold, 2 at risk.`;

const THREE_BUCKET_RATIONALE: { bucket: string; why: string }[] = [
  {
    bucket: "Bucket 1 · HOT — move on Monday",
    why: "These are the clients where one specific action this week determines whether a deal moves or stalls. The 3-cap forces prioritisation: there are always more than 3, but only 3 of them are truly leverage moves. The rest can wait.",
  },
  {
    bucket: "Bucket 2 · COLD — needs reactivation",
    why: "These are clients who went silent on a promised next-step. They're not lost yet — but every additional day of silence makes the recovery harder. The bucket forces you to send the one specific opener that re-opens the conversation, instead of letting them slide into the cold-revisit queue.",
  },
  {
    bucket: "Bucket 3 · AT RISK — could lose this week",
    why: "These are deals you might actually lose by Friday if you don't act. The cap of 2 is on purpose: if more than 2 deals are at risk simultaneously, your real problem is upstream (in capacity or response time) and the buckets are a symptom, not the cure.",
  },
];

const SUNDAY_PROTOCOL: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Sunday 7 PM. Coffee or wine. Phone, no laptop.",
    body: "The protocol works because the trigger is a specific time on a quiet evening. Not Friday afternoon (you're tired), not Monday morning (too late). 7 PM Sunday lands when most agents are doing nothing useful with their week-prep window. Phone is enough — the brief is short.",
  },
  {
    n: "02",
    title: "AI generates at 6:55 PM. Pushed to your inbox.",
    body: "The cron runs 5 minutes before you sit down. You don't generate — you read. The whole protocol depends on the brief being there waiting; if you have to trigger it manually, you'll skip the trigger half the time.",
  },
  {
    n: "03",
    title: "Read top to bottom. Make 8 decisions. Total: 10 minutes.",
    body: "Each entry is one decision: am I doing this Monday, or am I delegating, or am I dropping it? No re-analysis, no second-guessing. The work of analysis already happened upstream — the brief is decision-prompting, not analysis-prompting.",
  },
  {
    n: "04",
    title: "Drag each accepted action onto Monday's calendar.",
    body: "If the action lives only in the brief, it dies in the brief. Each accepted action becomes a calendar event with a time, a person, and the one specific thing to do. The brief is the source; the calendar is the operating system.",
  },
  {
    n: "05",
    title: "Close the brief. Stop thinking about work until tomorrow.",
    body: "This is the hidden benefit. The reason the protocol holds long-term is that it gives the agent permission to stop thinking about pipeline. Once the 8 decisions are made, the rest of Sunday is yours. The 3-bucket structure works partly because it bounds the surface area you have to think about.",
  },
];

const FAILURES: { title: string; body: string }[] = [
  {
    title: "Treating it as a comprehensive review.",
    body: "The brief is intentionally incomplete. It surfaces 8 of your 30 active clients, not all 30. If you find yourself thinking 'but what about Maria?' the answer is: she's not on the board this week. Trust the prioritisation. The review next Sunday will surface her if she belongs.",
  },
  {
    title: "Editing the AI's bucket assignments.",
    body: "The temptation is to move a client from cold to hot because you feel like it. Resist. The AI's classification is based on the data — last touch, days silent, missed promises. Your gut feeling is often the same data, processed less rigorously. Override sparingly, and only when you have specific knowledge the data lacks.",
  },
  {
    title: "Reading it Friday instead of Sunday.",
    body: "Friday review feels productive but reads with a tired week behind it. The actions get diluted by 'I'll think about it over the weekend' deferrals. Sunday is the right trigger because Monday is right after, and you can't defer the actions any further.",
  },
  {
    title: "Skipping the calendar drag step.",
    body: "The single biggest failure mode. The brief identifies the 8 actions; the calendar is what makes them happen. If accepted actions live only in your head or in the brief itself, the protocol degrades to a Sunday-evening worry session. The calendar is the bridge.",
  },
];

const COMPOUND_EXAMPLES: { metric: string; before: string; after: string }[] = [
  {
    metric: "Time spent in CRM Monday morning",
    before: "60-90 minutes scrolling, deciding, switching contexts",
    after: "0 minutes — the decisions were made Sunday",
  },
  {
    metric: "Clients you actively touched this week",
    before: "12-15 (the loud ones, the recent ones, the easy ones)",
    after: "8 (the leverage ones, AI-prioritised)",
  },
  {
    metric: "Deals lost to silence (>14 days untouched)",
    before: "3-5 per quarter — the ones who quietly slipped",
    after: "≤1 per quarter — the AT RISK bucket catches them at week 2",
  },
  {
    metric: "Reply rate to your reactivation messages",
    before: "8-12% (template-driven)",
    after: "30-45% (specific opener per cold-bucket entry)",
  },
];

export default function PromptWeeklyReviewPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

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
            agent toolkit · field guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            Sunday 7 PM:
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
              the 10-minute pipeline review.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents spend Monday morning rebuilding their week from scratch.
            Open the CRM, scroll the pipeline, decide who to call. By 11 AM half
            the day is gone and the wrong calls got made. The agents who close
            consistently do the deciding on Sunday. AI sorts the pipeline; the
            agent makes 8 decisions; Monday starts in motion.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 26 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>sunday_review_19_00.txt — example output</span>
              <span className="hidden sm:inline">3 hot · 3 cold · 2 risk</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Three buckets. Eight clients. Each entry is one specific action.
              Nothing about &ldquo;follow up&rdquo;.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why weekly reviews die.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Every productivity book recommends a weekly review. Almost no agent
            does one consistently. The reason is not discipline — it&apos;s
            architecture. The classic weekly review asks the agent to (1) sit down
            with their CRM, (2) scan every open client, (3) re-evaluate priority,
            (4) decide actions for the coming week. That&apos;s 90 minutes of
            cognitively expensive work, on a Sunday evening, with no clear
            stopping point. Of course it dies.
          </p>
          <p>
            The 10-minute version moves the cognitive expense to AI. The model
            scans every client, sorts by signal, surfaces the 8 that matter, and
            drafts the one specific action for each. The agent&apos;s job collapses
            to: read, decide, drag onto Monday&apos;s calendar. 10 minutes,
            bounded surface area, clear stopping point. The protocol holds because
            the architecture lets it.
          </p>
          <p>
            The 3-bucket structure is doing most of the cognitive lifting. Hot,
            cold, risk are not arbitrary categories — they map to three
            different agent behaviours: <em className="font-display not-italic">execute, reactivate, rescue</em>.
            Each behaviour has its own playbook. The bucket assignment tells the
            agent which playbook to run, before they&apos;ve thought about it.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;Weekly reviews don&apos;t fail because agents are lazy. They
            fail because the format demands an hour of cognitive work in a 10-minute
            slot.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The three buckets */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the structure"
          title="Three buckets. Three behaviours."
          description="Each bucket exists because it prompts a different action. If two buckets prompt the same behaviour, they should be one bucket. If one bucket prompts no clear behaviour, it should be cut."
        />

        <div className="mt-10 space-y-5">
          {THREE_BUCKET_RATIONALE.map((b, i) => (
            <div
              key={b.bucket}
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
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                  {b.bucket}
                </h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-600 leading-relaxed">
                  {b.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Sunday protocol */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="the sunday protocol"
          title="Five steps. Ten minutes."
          description="The whole loop fits between your second pour and the start of dinner. The protocol is designed to be quick because it has to be — anything longer and it competes with the rest of your Sunday and loses."
        />

        <ol className="mt-10 space-y-5">
          {SUNDAY_PROTOCOL.map((s) => (
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

      {/* Common failures */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four ways the protocol breaks"
          title="The failure modes."
          description="If you try this protocol for two weeks and it stops sticking, it's almost always one of these four."
        />

        <div className="mt-8 space-y-4">
          {FAILURES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 sm:p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-amber-700 font-mono font-semibold">
                failure mode
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] text-slate-700 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes it"
          title="What to feed Claude."
          description="The system prompt that turns the full pipeline snapshot into the 3-bucket review. Tested against Claude Sonnet — the prioritisation logic benefits from the larger model on this one (Haiku tends to over-fill the buckets)."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">weekly_review_system_prompt.md</span>
            <CopyButton text={REVIEW_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{REVIEW_PROMPT}
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
            Paste the prompt above as a system message. Feed in your full pipeline
            snapshot as the user message. Set up a Sunday 6:55 PM cron once and
            forget it.
          </p>
        </div>
      </section>

      {/* Before / after metrics */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="what changes after 8 weeks"
          title="The compounding effect."
          description="None of these numbers move in week 1. By week 8 the entire shape of the agent's week is different."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>metric</div>
            <div>before protocol</div>
            <div>after 8 weeks</div>
          </div>
          {COMPOUND_EXAMPLES.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[13px] sm:text-[14px] gap-3"
            >
              <div className="text-slate-900 font-medium">{row.metric}</div>
              <div className="text-slate-600 leading-relaxed">{row.before}</div>
              <div className="text-violet-700 leading-relaxed">{row.after}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          The metric that moves slowest but matters most: deals lost to silence.
          The protocol exists because the AT RISK bucket catches the deals that
          would otherwise quietly slip — and once an agent goes a full quarter
          without losing one of those deals, the protocol becomes load-bearing.
          They don&apos;t skip Sundays anymore.
        </p>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the Sunday-night pipeline review"
          headlinePrimary="The brief is step one."
          headlineAccent="Showing up Sunday at 7 is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="WEEKLY"
        origin={
          <>
            A real-estate adaptation of David Allen&apos;s GTD weekly review
            and the agency-ops playbook. The 2026 shift: AI surfaces and
            prioritises, the agent only decides. Our slice: Sunday-night
            pipeline triage in 10 minutes over coffee.
          </>
        }
      />
    </div>
  );
}
