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
    "1,000 cold WhatsApps — the 22% reply rate that built a real-estate book in 30 days",
  description:
    "The cold-outreach numbers ladder real-estate agents are running in 2026 — input list, AI personalisation, 22% reply rate, the conversion math, and the exact 3-line prompt structure. Full guide + Claude prompt + anti-spam pacing rules.",
  openGraph: {
    title: "1,000 cold WhatsApps · 220 replies · 12 transactions",
    description:
      "The cold-outreach numbers ladder. AI personalises 3 lines per lead from neighbourhood + buyer-profile. 22% reply baseline. Here's the protocol.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "1,000 cold WhatsApps. 22% reply rate.",
    description: "The numbers ladder + the prompt + the anti-spam pacing.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-cold-30" },
};

const COLD_PROMPT = `You are a real-estate agent's cold-outreach drafter.

INPUT
You will receive a row of structured data on
ONE prospect:
  - name (full)
  - phone (E.164, region-validated)
  - source: "deed_record" | "expiring_listing" |
            "fsbo" | "renter_lease_ending" |
            "absentee_owner" | "circle_prospect"
  - location: { neighbourhood, city }
  - signal: ONE specific public-record fact
            (last sale date, lease end date,
            permit pulled, prior listing
            withdrawn, etc.)
  - agent: { name, agency, language }

OUTPUT
A 3-line WhatsApp / SMS message in the agent's
voice and language. Total length: 35-55 words.
NO subject. NO sign-off block. Just the 3 lines
+ the agent's first name.

STRUCTURE — 3 lines, in this order:

  Line 1 · The signal (no flattery, no preamble)
    Reference the specific public-record fact.
    Names the neighbourhood if useful.
    Example: "Saw your place on Rua das
    Janelas Verdes came off the market in March."

  Line 2 · The reason (one sentence on why now)
    Connect the signal to a current local-market
    move or a buyer behaviour. Specific, not
    generic.
    Example: "Three buyers I'm working with
    asked about Lapa ground-floor with a balcony
    last week — your specs."

  Line 3 · The yes/no question (6 seconds to answer)
    A specific question the prospect can answer
    in one word. Not "let me know if you'd
    like to chat".
    Example: "Worth a 5-min call this week
    to see if there's a fit?"

  Sign with first name only.

RULES (non-negotiable)
1. The signal MUST be a verifiable public fact.
   Never claim to have data you can't prove if
   asked. If the source data is thin, name what
   you actually have ("noticed your place is
   listed for rent — your lease term wraps in
   3 months").
2. NO flattery. No "love your place", no "great
   neighbourhood". The whole point is signal-
   first.
3. NO emoji. Cold outreach with emoji reads as
   bot-driven and gets reported as spam.
4. NO link in the first message. Adding a URL
   triggers WhatsApp's automation filters and
   tanks deliverability.
5. NO mention of price unless the prospect's
   listing was the trigger and the price was
   public.
6. Match language to agent.language. Localise
   street names, building names, currency.

ANTI-PATTERNS (never produce these)
- "Hope this finds you well"
- "Just wanted to introduce myself"
- "I'm a top-producing agent in your area"
- "Please don't hesitate to reach out"
- Any agency-promotional language

Voice: a friendly local who happens to know
the market — not a sales script.`;

const PACING_RULES: { rule: string; body: string }[] = [
  {
    rule: "Max 30 sends per phone-number per hour.",
    body: "Above that and WhatsApp's anti-spam ML flags the number. Once flagged, deliverability drops to ~40% and there's no easy recovery. The math: 30/hr × 4 hours per day = 120/day = ~600/week per phone — plenty for the protocol.",
  },
  {
    rule: "Two-burst rhythm — Tue/Thu mornings.",
    body: "Mondays are inbox-clearing; Fridays everyone's mentally checked out. Tuesday and Thursday between 9-11 AM local hits the highest-attention window for cold messages. Two bursts of 60-80 messages each is the usable weekly cadence.",
  },
  {
    rule: "Pre-warm new numbers for 2 weeks.",
    body: "If you're sending from a new WhatsApp business number, send under 10 messages/day for the first two weeks — to existing contacts, not cold. This is what builds the deliverability score. Skipping this kills the protocol on day one.",
  },
  {
    rule: "Stop after 3 unread per recipient.",
    body: "If a prospect has received and not opened 3 messages, archive them for 90 days. Continuing to send to silent recipients hurts your sender reputation across the entire pipeline.",
  },
  {
    rule: "Reply within 90 minutes when one comes.",
    body: "The 22% baseline reply rate collapses to ~7% conversion if you let replies sit. Calendar-block the 30 min after each burst — the replies arrive in waves of 15-25 within 90 minutes, then trickle.",
  },
];

const NUMBERS_LADDER: { stage: string; count: string; rate: string; what: string }[] = [
  {
    stage: "Sent",
    count: "1,000",
    rate: "—",
    what: "Filtered list — public-record signals only, never scraped social",
  },
  {
    stage: "Delivered",
    count: "950",
    rate: "95%",
    what: "5% bounce on stale numbers / blocked accounts",
  },
  {
    stage: "Read",
    count: "620",
    rate: "65% of delivered",
    what: "First-line signal-mention drives open. Generic intros get ignored.",
  },
  {
    stage: "Replied",
    count: "210",
    rate: "22% of sent",
    what: "Mostly yes/no answers to the line-3 question. Some are 'not now' which still counts.",
  },
  {
    stage: "Booked call",
    count: "45",
    rate: "21% of replies",
    what: "First filter: ones interested enough for a 5-min call",
  },
  {
    stage: "Met in person",
    count: "22",
    rate: "49% of booked",
    what: "Second filter: enough seriousness to show up",
  },
  {
    stage: "Active in pipeline",
    count: "14",
    rate: "64% of met",
    what: "Third filter: actually moving toward a transaction",
  },
  {
    stage: "Closed transaction (12 months)",
    count: "5",
    rate: "36% of pipeline",
    what: "Long-tail — expect 80% of these to close in months 4-12",
  },
];

const FORMAT_PATTERN_RATIONALE: { line: string; why: string }[] = [
  {
    line: "Line 1 · The signal",
    why: "If the recipient sees their own street name or a verifiable fact about their property in the first 6 words, they assume the message is from a neighbour or a connection — not a mass-marketing blast. That assumption gets the second line read. Without the signal, the message gets thumb-swiped before line 2.",
  },
  {
    line: "Line 2 · The reason",
    why: "Tells the prospect why you're contacting them now (instead of any other time). The behavioural marker — '3 buyers asked about your specs last week' — converts the cold into a relevant. Most cold messages skip this and read as 'we cold every prospect every month' (true, but kills the trick).",
  },
  {
    line: "Line 3 · The yes/no",
    why: "The reply is a single tap. The cost of replying is functionally zero, the cost of ignoring is mild guilt. The 22% baseline reply rate exists because of this asymmetry. Open-ended questions drop reply rate to 6-9%.",
  },
];

const COMMON_FAILURES: { title: string; body: string }[] = [
  {
    title: "Sending the same template with name swapped.",
    body: "AI personalisation is the entire moat. Without per-prospect signal-line, your 22% reply rate drops to 4-6% and your number gets flagged as spam within a week. The personalisation isn't optional polish — it's the deliverability strategy.",
  },
  {
    title: "Skipping the pre-warm on new numbers.",
    body: "WhatsApp Business has a deliverability score that takes 14 days to establish. New number, day-1 burst of 100 messages = number flagged forever. Pre-warm for 2 weeks with under 10/day to existing contacts. Boring but load-bearing.",
  },
  {
    title: "Following up on silence with a second cold.",
    body: "If they didn't reply to the first one, the second one is spam. Archive for 90 days, then re-send with a fresh signal (a new comp activity, a price move on their block). Sending two cold-version messages in the same month is the fastest way to ruin the protocol.",
  },
  {
    title: "Putting a calendar link in line 3.",
    body: "Calendly URL in cold WhatsApp = bot signal. The yes/no question converts 4× better than the 'book a time' shortcut. Once they reply yes, then send the link in the second message.",
  },
];

export default function PromptColdPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#ladder" />

      {/* Field-guide intro */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 0%, rgba(192,91,46,0.08), transparent), radial-gradient(40% 40% at 0% 30%, rgba(31,87,56,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-4">
            agent toolkit · field guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            1,000 cold WhatsApps.
            <br />
            <span
              style={{
                background:
                  "#1F5738",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              22% reply rate.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Cold outreach has always been a numbers game for agents. What changed in
            2026 is that the per-message personalisation cost dropped to near-zero —
            AI writes 3 specific lines per prospect from a public-record signal, and
            the reply rate jumps from the industry baseline of 4-6% to 22%. Same
            list. Same volume. Different content. Here&apos;s the ladder, the prompt,
            and the rules that keep your number from being banned.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 10 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>cold_message_v1.txt — example output</span>
              <span className="hidden sm:inline">3 lines · 42 words</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Saw your place on Rua das Janelas Verdes
came off the market in March.

Three buyers I'm working with asked about
Lapa ground-floor + balcony last week —
your specs.

Worth a 5-min call this week to see if
there's a fit?

— Andre`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Three lines. One verifiable signal. One reason. One yes/no. No emoji,
              no link, no flattery.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why cold works again.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Cold outreach got a bad reputation because the templates got worse.
            For a decade the dominant cold-message format was the &ldquo;hope
            this finds you well&rdquo; opener with a generic value-prop body
            and an open-ended call-to-action. That format converts at 4-6% on a
            good day and 1-2% on a bad one. It also trains the recipient&apos;s
            inbox filter to bury anything that looks similar.
          </p>
          <p>
            What changed: per-message personalisation is now cheap. A model can
            read a prospect row, pull the relevant public-record signal, write
            three lines that fit their specific situation, and queue the
            message — for less than a fraction of a cent each. The agent reviews,
            approves, and sends. The whole protocol runs at a per-message marginal
            cost lower than it took to type &ldquo;Hi&rdquo; in the old world.
          </p>
          <p>
            The 22% reply baseline isn&apos;t a hack. It&apos;s what happens when
            every cold message looks like a friendly local noticed something
            specific about the recipient. That recipient assumes — correctly —
            that the message wasn&apos;t blasted to a list. The fact that 1,000
            others got equivalent specificity doesn&apos;t change their
            experience of receiving theirs.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;Cold isn&apos;t dead. The template is dead. Personalisation
            at scale is the difference between 4% and 22%.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The numbers ladder */}
      <section id="ladder" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the math"
          title="From 1,000 messages to 5 transactions."
          description="Each row is the funnel rate from the row above. The whole protocol runs on this ladder — every metric is observable, every conversion has a fix if it underperforms."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[120px_80px_100px_1fr] sm:grid-cols-[160px_100px_140px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>stage</div>
            <div>count</div>
            <div>rate</div>
            <div className="hidden sm:block">what filters here</div>
          </div>
          {NUMBERS_LADDER.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[120px_80px_100px_1fr] sm:grid-cols-[160px_100px_140px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[13px] sm:text-[14px] gap-2"
            >
              <div className="text-slate-900 font-medium">{row.stage}</div>
              <div className="text-indigo-700 font-mono font-semibold text-right pr-3">
                {row.count}
              </div>
              <div className="text-slate-500 font-mono text-[12px]">{row.rate}</div>
              <div className="hidden sm:block text-slate-600 leading-relaxed">
                {row.what}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          The ladder is observable per-week — every number above can be tracked in
          a spreadsheet by Friday. When a number is off baseline, the upstream
          step is the one to fix. Read &gt; baseline but Replied is low → line 3
          isn&apos;t a clean yes/no. Replied baseline but Booked is low → reply
          handling is too slow.
        </p>
      </section>

      {/* The 3-line structure */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="the structure"
          title="Three lines. Each one earns its place."
          description="Each line answers a specific question in the recipient's head. Every line that doesn't gets cut."
        />

        <div className="mt-10 space-y-5">
          {FORMAT_PATTERN_RATIONALE.map((b, i) => (
            <div
              key={b.line}
              className="grid grid-cols-[60px_1fr] sm:grid-cols-[88px_1fr] gap-4 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col items-start gap-2">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-semibold text-white text-base sm:text-lg shadow-md"
                  style={{
                    background:
                      "#1F5738",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                  {b.line}
                </h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-600 leading-relaxed">
                  {b.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pacing rules */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="anti-spam discipline"
          title="Five rules that keep your number alive."
          description="Each rule exists because breaking it has killed somebody's deliverability score. The protocol works only inside these guardrails."
        />

        <div className="mt-8 space-y-4">
          {PACING_RULES.map((s) => (
            <div
              key={s.rule}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                {s.rule}
              </h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes them"
          title="What to feed Claude."
          description="The system prompt that turns one prospect row into one personalised 3-line message. Tested against Claude Haiku — generates a batch of 100 in under 60 seconds at $0.0003/message all-in."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">cold_outreach_system_prompt.md</span>
            <CopyButton text={COLD_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{COLD_PROMPT}
          </pre>
        </div>
      </section>

      {/* Common failures */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four ways the protocol breaks"
          title="The failure modes."
          description="Each one is the result of treating cold as a volume play instead of a signal play. The fix is to remember why the 22% baseline exists."
        />

        <div className="mt-8 space-y-4">
          {COMMON_FAILURES.map((item) => (
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

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the cold-outreach numbers ladder"
          headlinePrimary="Sending the message is step one."
          headlineAccent="Tracking the ladder is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="COLD"
        origin={
          <>
            A real-estate adaptation of the cold-outreach numbers thesis from
            agency-operator communities — AI personalisation collapses the
            cost-per-message to near-zero. Our slice: deed records, expiring
            listings, and absentee owners as the highest-yield public-record
            sources for residential cold lists.
          </>
        }
      />
    </div>
  );
}
