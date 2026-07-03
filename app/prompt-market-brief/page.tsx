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
    "The Monday market brief — 5 lines a week that 60% of your clients reply to",
  description:
    "The auto-generated 5-bullet market brief that real-estate agents are sending every Monday morning to keep past clients warm. Why most market updates die unread, and the structure that doesn't.",
  openGraph: {
    title: "The Monday market brief — 5 lines, 60% reply rate",
    description:
      "A 5-bullet local market update goes to your past clients every Monday morning. Auto-generated, personalised by farm zip. Here's the protocol.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Monday market brief.",
    description:
      "Five lines. Every Monday. 60% reply rate. The structure that beats every newsletter.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-market-brief" },
};

const MARKET_BRIEF_PROMPT = `You are a real-estate agent's local market briefer.

INPUT
You will receive:
  - farm_zip:     the agent's primary territory
                  (zip code, neighbourhood name)
  - past_week_data:
      - new_listings:    count + 2 standout
      - price_changes:   notable up/down moves
      - closed_sales:    count + median price
                         vs trailing 4-week avg
      - days_on_market:  current median + delta
      - inventory:       active count + delta
  - client_segment: "all_past_clients" or
                    "active_buyers" or "owners"
  - language:     "en" | "pt-BR" | "es" | etc.

OUTPUT
A 5-bullet market brief, plain text, formatted
for SMS or short email. Length: 5 bullets,
each 12-22 words. Total reading time under
30 seconds.

STRUCTURE — exactly 5 bullets, in this order:

  Bullet 1 · Headline number.
    The single most quotable stat from the week.
    Median sale price, days on market, or
    inventory delta — whichever moved most.
    Format: "<stat> <direction> vs <baseline>".

  Bullet 2 · The story behind the number.
    One sentence on what's driving the move.
    Demand-side, supply-side, or seasonal.
    No speculation — only what the data shows.

  Bullet 3 · Who this matters to.
    The segment-specific implication. Owners
    hear "your home is worth X% more this month".
    Buyers hear "competition shifted X%".
    Both honest, framed for the reader.

  Bullet 4 · One specific watch.
    A single property, street, or block where
    something interesting happened. Specific
    address or building. Names are okay.

  Bullet 5 · The reply hook.
    One question that takes 6 seconds to
    answer. Not "let me know if you have
    questions". A specific yes/no or
    multiple-choice prompt.

RULES (non-negotiable)
1. Numbers must be verifiable. Do NOT invent
   percentages or counts. If the data is missing,
   skip that bullet — never fabricate.
2. The reply hook must be answerable in one tap.
   Examples that work:
     "Worth pulling current value on your place?"
     "Should I send the comp list?"
     "Want me to flag this for your search?"
   Examples that don't:
     "Let me know what you think"
     "Happy to chat anytime"
3. No agency promotion. The brief is signal,
   not marketing. The agent's name appears
   only in the sign-off.
4. Localise: street names, building names,
   neighbourhood slang. The brief should
   read as if it could only have been
   written by someone who works the zip.
5. Tone: factual, brief, useful. Not
   excited. Not alarmist. Calm calibration.

Voice: like a knowledgeable neighbour texting
you a heads-up — not a newsletter, not a sales
pitch.`;

const EXAMPLE_BRIEFS: { segment: string; body: string }[] = [
  {
    segment: "Sent to past buyer-clients · Lapa zip 1200",
    body: `Lapa, week of April 20

  - Median sale 4,820€/m² — up 2.1% vs the
    trailing 4-week average.

  - Two ground-floor units cleared in 6 days
    each. Inventory under 40 active listings.

  - For owners: your place is likely 1.5-3%
    more bid-up than 30 days ago.

  - Watch: Rua das Janelas Verdes 18 — listed
    Friday at 1.1M, three offers by Monday.

  - Want me to pull a current value estimate
    on your place? — A.`,
  },
  {
    segment: "Sent to active buyers · same zip",
    body: `Lapa, week of April 20

  - 9 new listings this week (vs 6-week avg
    of 5). Inventory finally moving up.

  - Median price flat. Days on market rising.
    Negotiation room is back.

  - For buyers in your range (450-550k):
    three new options matching your filters,
    one in the school catchment.

  - Watch: Rua de São Bento 122 — second
    drop in two weeks, now 8% under listing.

  - Send the three options now or wait for
    Saturday? — A.`,
  },
];

const FIVE_BULLET_RATIONALE: { bullet: string; why: string }[] = [
  {
    bullet: "Bullet 1 · Headline number",
    why: "The first bullet is a hook — but a data hook, not a marketing one. A specific number with direction and baseline is what gets the reader to read the second bullet. 'The market is hot!' doesn't open. '4,820€/m² up 2.1% vs trailing 4-week' opens.",
  },
  {
    bullet: "Bullet 2 · The story",
    why: "The number alone is data. The story is meaning. One sentence on why — without speculation — is what makes the reader trust the source. Most newsletters skip this and lose credibility immediately.",
  },
  {
    bullet: "Bullet 3 · Who this matters to",
    why: "Same brief, different segment, different implication. Owners want to know about value. Buyers want to know about competition. The personalisation is the whole reason this isn't a newsletter.",
  },
  {
    bullet: "Bullet 4 · One specific watch",
    why: "Generic stats fade in a week. A specific address sticks. The reader thinks 'I drove past Rua das Janelas Verdes last weekend' — and the brief becomes part of their mental geography of the neighbourhood. That's how you become the agent for that zip.",
  },
  {
    bullet: "Bullet 5 · The reply hook",
    why: "Without a one-tap question, the brief is a broadcast. With one, it's a conversation starter. The 60% reply rate isn't because the brief is brilliant — it's because the question is easy enough to answer that ignoring it feels rude.",
  },
];

const TIMING_RULES: { rule: string; body: string }[] = [
  {
    rule: "Monday 8:00 AM local — not Friday, not weekend.",
    body: "Mondays are the highest-attention day for this format. Friday is too late (decisions are made for the week). Weekend is private time. 8 AM lands in inbox during the morning routine — the highest open-rate window of the week for non-urgent content.",
  },
  {
    rule: "SMS for active buyers. Email for past clients.",
    body: "Channel matters. Active buyers (people you've spoken to in the last 60 days) get SMS — short, immediate, in their face. Past clients (60+ days) get email — they're not in your active pipeline, the SMS would feel intrusive. Email lets the brief sit until they have time.",
  },
  {
    rule: "Per-zip, never per-region.",
    body: "A brief that covers 'the market this week' across 4 neighbourhoods is generic to all of them. A brief covering one zip — Lapa, Chiado, Notting Hill, the agent's actual farm — is specific enough to feel personal. If you work multiple zips, send multiple briefs. They are not the same email.",
  },
  {
    rule: "Skip a week if the data is flat.",
    body: "A boring week deserves no brief. The 60% reply rate depends on signal — sending '7 listings this week' when there were 7 last week and 7 the week before burns trust. Better to skip and resume the next Monday with a real headline.",
  },
];

const COMMON_FAILURES: { title: string; body: string }[] = [
  {
    title: "Newsletter format with photos and headers.",
    body: "The market brief is plain text on purpose. Newsletters trigger marketing-mode in the reader; plain text reads as personal. Five bullets in a Times-New-Roman email body get more replies than a beautifully designed newsletter every single time.",
  },
  {
    title: "Over-explaining the 'what this means'.",
    body: "Three sentences of analysis on bullet 3 turns the brief into a column. Keep it to one sentence. The reader doesn't want analysis — they want signal + a useful frame. The agent's value-add is the curation, not the commentary.",
  },
  {
    title: "Too many specific watches.",
    body: "Bullet 4 is one watch. Adding a second turns it into a listing dump and dilutes the signal. The whole point is that you've picked the one street the reader will remember.",
  },
  {
    title: "Reply hook that asks for the reader's time.",
    body: "'Want to chat sometime?' asks for an open commitment. 'Worth pulling a value on your place?' asks for a yes/no that takes 2 seconds. The hook has to fit between checking the brief and putting the phone down.",
  },
];

export default function PromptMarketBriefPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#structure" />

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
            Five lines.
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
              Every Monday. 60% reply.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents send a market newsletter. Most market newsletters die in the
            promotions tab. The agents who stay top-of-mind for the families they
            sold to three years ago are sending something different: five bullets,
            plain text, every Monday morning, hand-curated for one zip code. Reply
            rates north of 60% — because the format is signal, not marketing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 22 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>monday_brief.txt — past-client version</span>
              <span className="hidden sm:inline">5 bullets · 30 seconds</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{EXAMPLE_BRIEFS[0].body}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Plain text. One zip. One reply hook. Sent at 8 AM Monday.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why most market updates die.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The standard real-estate market newsletter is a structurally doomed
            artefact. It tries to cover too much geography, too many segments, too
            many topics — every reader gets the same email and almost none of it
            applies to them. The reader scans the subject line, files it under
            &ldquo;maybe later&rdquo;, and never opens it. Open rates of 12-18%
            are normal. Reply rates are functionally zero.
          </p>
          <p>
            The format that works inverts every one of those choices. One zip,
            not many. One segment, not all. Five bullets, not five paragraphs.
            One specific watch, not a feed of new listings. One reply hook
            answerable in 6 seconds, not an open invitation to chat. Each
            constraint is what makes the brief feel personal — and the reply rate
            tracks that perception almost linearly.
          </p>
          <p>
            The other quiet shift in 2026 is that the brief gets generated
            automatically. The agent doesn&apos;t pull the data manually any more;
            an AI agent runs the comp activity for the zip every Sunday night,
            drafts the 5 bullets, and queues them for the agent&apos;s 7 AM Monday
            review. The agent edits one bullet, approves, sends. 4 minutes of
            human input per brief. 60% reply rate. The math compounds.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;A market newsletter is a broadcast. A market brief is a
            conversation starter. The difference is the reply hook.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The structure */}
      <section id="structure" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the structure"
          title="Five bullets. Each one earns its place."
          description="Each bullet exists because it answers a question the reader is actually asking. Every bullet that doesn't gets cut."
        />

        <div className="mt-10 space-y-5">
          {FIVE_BULLET_RATIONALE.map((b, i) => (
            <div
              key={b.bullet}
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
                  {b.bullet}
                </h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-600 leading-relaxed">
                  {b.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two segments, two briefs */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="same data · two audiences"
          title="The brief is segment-specific."
          description="Past clients hear one frame. Active buyers hear another. Same week of comp data, different sentences. This is the personalisation that makes the brief feel hand-written."
        />

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          {EXAMPLE_BRIEFS.map((ex, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 sm:p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
                {ex.segment}
              </div>
              <pre className="mt-3 text-[13px] leading-relaxed font-mono text-slate-800 whitespace-pre overflow-x-auto">
{ex.body}
              </pre>
            </div>
          ))}
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          Notice that bullets 1 and 4 are largely shared (they&apos;re the
          underlying market data) — but bullets 2, 3, and 5 are completely
          different. Same Monday. Same zip. Two messages. The owner version frames
          for value; the buyer version frames for opportunity.
        </p>
      </section>

      {/* Timing rules */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="when, how, what channel"
          title="Four rules of the cadence."
          description="The brief works because of the cadence as much as the content. Get the timing wrong and even a perfect brief degrades to noise."
        />

        <div className="mt-8 space-y-4">
          {TIMING_RULES.map((s) => (
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

      {/* Common failures */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four ways the brief breaks"
          title="The failure modes."
          description="Each one is the result of an agent reflexively reaching for the newsletter format. The fix is to remember why you switched."
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

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes it"
          title="What to feed Claude."
          description="The system prompt that turns weekly comp data into the 5-bullet brief. Tested against Claude Haiku — generates two segment-versions per zip in under 6 seconds."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">market_brief_system_prompt.md</span>
            <CopyButton text={MARKET_BRIEF_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{MARKET_BRIEF_PROMPT}
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
            Paste the prompt above as a system message. Feed in your week&apos;s comp
            data as the user message. Claude returns the 5-bullet brief.
          </p>
        </div>
      </section>

      {/* The compounding effect */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="why this compounds"
          title="One brief. Twelve months of staying-in-mind."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            A single Monday brief is a small thing. Fifty Monday briefs in a row
            is the most reliable lead source most agents could build. The math is
            slow but compounding: 60% reply rate × 50 weeks × 200 past clients
            means roughly 6,000 light-touch interactions a year per agent, a
            background hum of staying-in-mind that no other channel produces.
          </p>
          <p>
            The reply hook is the multiplier. A &ldquo;worth pulling a current
            value?&rdquo; question that 60% of past clients answer once a year is
            ~120 conversations per agent — a meaningful fraction of which become
            actual transactions, because the brief is the only reason that
            past client thought to think about value this month.
          </p>
          <p>
            The newsletter version of this protocol — the one most agents
            currently send — produces almost none of those 6,000 interactions.
            The format is the difference. Not the brand, not the agent, not the
            market. The format.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the Monday market brief"
          headlinePrimary="Drafting the brief is step one."
          headlineAccent="Sending it every Monday is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="MARKET"
        origin={
          <>
            A real-estate adaptation of the curator-as-channel thesis from
            vibe-marketing — small list with high reply rate beats mass with
            low engagement. Our slice: the 5-line Monday market update,
            personalised by farm zip.
          </>
        }
      />
    </div>
  );
}
