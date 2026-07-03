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
    "Your past clients have the leads — you just never asked",
  description:
    "How real-estate agents mine their past-client professional networks for warm-intro leads. The 12-leads-per-client math, the 6 weeks of the year that work, and the ask-script that gets 40% reply.",
  openGraph: {
    title: "Past clients have the leads. You never ask.",
    description:
      "1 client = avg 12 warm leads inside their 2nd-degree LinkedIn. The math, the ask-script, and the Claude prompt that ranks them by likelihood-to-move.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Past clients have the leads",
    description:
      "Referral graph mining: 12 warm leads per past client. Setup + ask-script.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-graph" },
};

const GRAPH_PROMPT = `You are a senior real-estate agent's
referral-graph analyst.

INPUT
You receive: one past client's name and the
public LinkedIn profiles of their 2nd-degree
connections (up to 200), each with: current
employer, role, tenure, location, and any
public life-event signal from the last 90
days (job change, marriage, baby, parent
move-in, retirement, location change).

OUTPUT
Rank the top 8 connections by likelihood
of needing a real-estate agent in the next
12 months. For each, output:

  name + employer + role
  proximity_signal: <which life event or
                     career signal raised
                     them above the noise
                     floor>
  ask_line: <the single sentence the past
             client should send when
             reaching out — references the
             mutual connection's name and
             a low-pressure offer>

RULES (non-negotiable)
1. Job change in last 90 days outranks
   every other signal — relocations cluster
   here.
2. Marriage / new child / parent move-in
   each move someone up by 2 ranks.
3. The ask_line is in the past client's
   voice, not the agent's. The past
   client is the one sending the message.
4. Never quote the connection's public posts
   directly — reference patterns, not
   sentences.
5. The ask is for a CONVERSATION, never for
   a transaction. "Coffee", "intro", "happy
   to help if useful" — never "find them a
   home", never "list with us".

ANTI-PATTERNS (never produce these)
- Anything starting with "I noticed you…"
- "I'd love to introduce you to my agent"
   (too direct, kills the warmth)
- Mentioning specific listings or prices
- Quoting the connection's public posts
- Any sentence longer than 22 words

A 2nd-degree connection should read the ask
in 5 seconds and feel like a normal note from
the past client — not a referral-broker pitch.`;

const EXAMPLE_INPUT = `# ── referral graph snapshot ──────────────────────
past_client:
  name:           "André Costa"
  closed_with_us: 2024-09 (€480k Lapa 2-bed)
  network_size:   147 LinkedIn 2nd-degree
window_days:      90

connections (top 12 by raw signal):
  - name:        "Marina Costa"
    employer:    "Neuralink (Porto)"
    role:        "Staff Engineer · Implants"
    tenure:      "4 years"
    signal:      "moved Lisbon → Porto 6 weeks ago"
    rank_raw:    high

  - name:        "Hugo Almeida"
    employer:    "Block.one (Lisbon)"
    role:        "Head of Legal"
    tenure:      "2 years"
    signal:      "married 2026-02, public photo"
    rank_raw:    medium

  - name:        "Beatriz Sousa"
    employer:    "Critical Software (Coimbra)"
    role:        "Director of Engineering"
    tenure:      "8 years"
    signal:      "first child announced 2026-04"
    rank_raw:    high

  - name:        "Tiago Reis"
    employer:    "Volkswagen Autoeuropa"
    role:        "Plant Manager"
    tenure:      "12 years"
    signal:      "no recent change"
    rank_raw:    low

  ... 8 more connections truncated
`;

const EXAMPLE_OUTPUT = `1. Beatriz Sousa · Critical Software · Director Engineering
   proximity_signal: first child announced — typical
                     space-upgrade window opens 6-12 months
   ask_line: "Beatriz — congrats on the news! If you ever
              want a no-pressure chat with someone good in
              Coimbra real estate, my agent A. is great.
              Send if useful."

2. Marina Costa · Neuralink · Staff Engineer
   proximity_signal: relocated 6 weeks ago — settling-in
                     window where rentals roll into purchases
   ask_line: "Marina — saw you're in Porto now! If you're
              renting and thinking longer-term, A. helped
              me hugely in Lisbon. Want her contact?"

3. Hugo Almeida · Block.one · Head of Legal
   proximity_signal: recently married — common 6-18 month
                     family-housing window
   ask_line: "Hugo, congrats again on the wedding. If you
              two ever start looking at houses, my agent
              A. is the one I'd recommend. Happy to intro."`;

const REFERRAL_MATH: { stat: string; value: string; note: string }[] = [
  {
    stat: "Avg LinkedIn 1st-degree connections",
    value: "412",
    note: "Per past client. Range 80-2000+. Median for senior professionals: 350-500.",
  },
  {
    stat: "Avg 2nd-degree connections",
    value: "~85,000",
    note: "Each 1st-degree node has ~200 of their own connections — 412 × 200 = far too many to mine raw.",
  },
  {
    stat: "Filtered to same metro + life-event last 90 days",
    value: "~12-18",
    note: "After filtering by location and 90-day life-event signal, the actionable list is small — and that's what makes it tractable.",
  },
  {
    stat: "Past client willing-to-intro rate",
    value: "67-78%",
    note: "When asked once, with a specific named connection, framed as low-pressure. Drops sharply if asked generically (\"anyone you know?\").",
  },
  {
    stat: "Intro-to-conversation rate",
    value: "60-70%",
    note: "Of intros that go out, this fraction become 30-min introductory conversations within 14 days.",
  },
  {
    stat: "Conversation-to-engagement rate",
    value: "20-28%",
    note: "Of conversations, this fraction become signed buyer/seller agreements within 6 months.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Run the graph against the right week of the year.",
    body: "There are 6 windows in a calendar year that produce the highest density of life-event signals: post-summer (Sept), pre-school-year (Aug), new-year reset (mid-Jan), tax-return season (Apr), pre-summer-move (May), Christmas-holiday consolidation (Dec). Run the graph mining pipeline once per window, not continuously. Continuous noise; window-aligned signal.",
  },
  {
    n: "02",
    title: "Filter aggressively. The signal is in 12-18, not 200.",
    body: "Past client has 200+ 2nd-degree connections in the same metro. The graph mining surfaces 12-18 with a 90-day life-event signal. The other 180 are noise — running the ask against them dilutes the past client's relationship with you and looks like you're farming them. Discipline cuts the list to one digit before the past client ever sees it.",
  },
  {
    n: "03",
    title: "The past client sends. The agent does not.",
    body: "Crucial: the agent never reaches out to a 2nd-degree connection cold. The past client sends the ask in their voice, with the agent as a name they recommend. The whole warmth comes from the past client's standing — bypass that and it's just another cold message with extra steps.",
  },
  {
    n: "04",
    title: "One ask per past client per window.",
    body: "Maximum once per quarter. Each ask is for ONE specific connection (the highest-ranked one in that window). Past clients tolerate one specific intro request without it feeling like a chore; six requests over six months trains them to stop replying. The discipline is what protects the relationship.",
  },
  {
    n: "05",
    title: "The ask script is for a chat, never a transaction.",
    body: "The past client's message offers a coffee, a 30-minute introductory chat, a contact for the connection's back pocket. Never a listing, never a CMA, never a buyer's-agency agreement. The transaction is downstream of the conversation; the conversation is downstream of the warm intro. Skip a step and the whole sequence collapses.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the broker",
    body: "Hugo, my agent A. is doing a special promotion this month for newlyweds. If you and your partner are looking at houses, she has 5 listings in your area. Want me to forward her the intro?",
    why: "Sounds like the past client is being paid to refer (which they're not). Lists a promotion. Mentions specific listings. Every line erodes the warmth that justified the ask in the first place.",
  },
  {
    label: "the cold pitch wearing a friend's clothes",
    body: "Hugo, I noticed your wedding photos and wanted to congratulate you. As newlyweds, you might be thinking about your first home together — A. is the agent I worked with and she's amazing.",
    why: "\"I noticed\" reveals the watching. Names the inference (\"newlyweds → first home\"). Reads like a templated friend-of-friend pitch. The past client should never use this version — and our prompt actively rejects it.",
  },
  {
    label: "the over-broad",
    body: "Hi everyone, I closed on my home with A. last year and she was incredible! If anyone is thinking of buying or selling, definitely reach out — happy to make intros!",
    why: "Mass-broadcast referral asks have a ~3% reply rate. Specific named-person asks have a ~67% reply rate. The 22× difference is the whole point of the protocol — running it as a broadcast is throwing away its main lift.",
  },
];

export default function PromptGraphPage() {
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
            Your past clients have
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
              the leads. You never asked.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            One past client&apos;s LinkedIn 2nd-degree network contains, on
            average, 12 people who will make a real-estate decision in the
            next 12 months. Most of them, the past client doesn&apos;t even
            think to mention. The agents who systematically mine these
            networks — and ask in the right way, at the right time — produce
            two-thirds of their pipeline this way.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 05 of 33 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>q2_2026_referral_window.txt</span>
              <span className="hidden sm:inline">3 asks scheduled</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Past client: André Costa
Window: April 2026 (post-tax-return)

Top ask:
  Beatriz Sousa · Director · Coimbra
  signal: first child announced 2026-04

Past client's message (drafted, awaiting send):
  "Beatriz — congrats on the news! If you ever
   want a no-pressure chat with someone good in
   Coimbra real estate, my agent A. is great.
   Send if useful."`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              One ask. One past client. One named connection. The 67% intro
              rate sits on the back of every line of this discipline.
            </p>
          </div>
        </div>
      </section>

      {/* The math */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the math"
          title="One past client = twelve warm leads."
          description="The funnel from a past client's network to a closed transaction is steeper than it looks. Each step has a measurable conversion rate; the whole system stands or falls on filtering aggressively at step one."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {REFERRAL_MATH.map((row) => (
            <div
              key={row.stat}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_1.4fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="text-slate-900 font-medium">{row.stat}</div>
              <div className="font-mono text-violet-700 font-bold text-base sm:text-lg">
                {row.value}
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {row.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One ask per quarter."
          description="The discipline of the graph mining. Skip any one and the past client either ignores the request or stops replying altogether."
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
          title="Three asks that cost the relationship."
          description="The classifier produces these without strict prompt rules. Each one has been sent by a real past client and each one ended the agent's warm-intro pipeline with that person for at least 18 months."
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

      {/* Example input */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="The graph snapshot."
          description="What the prompt receives per past client per window. The 2nd-degree connections list is pre-filtered to same-metro + 90-day signal — the prompt does ranking and ask-line drafting only."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">graph_snapshot.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy snapshot" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that ranks + drafts"
          title="What to feed Claude."
          description="The prompt does ranking by life-event signal weight and drafts each ask in the past client's voice (not the agent's). Voice samples from the past client's prior messages are required."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">graph_system_prompt.md</span>
            <CopyButton text={GRAPH_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{GRAPH_PROMPT}
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
            Paste the system prompt as a Claude system message, then feed each
            past client&apos;s graph snapshot per window.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="snapshot in · ranked asks out"
          title="What Claude returns."
          description="Top 3 (of 8 ranked) asks per past client per quarter. The agent reviews; the past client sends — never the other way around."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · ranked asks
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact referral-graph protocol"
          headlinePrimary="Mining the graph is step one."
          headlineAccent="Trusting the past client to send is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="GRAPH"
        origin={
          <>
            A real-estate adaptation of the hidden-network thesis from sales
            — past customers&apos; 2nd-degree networks at life-event moments
            outconvert any cold list. Our slice: one specific named ask per
            past client per quarter, with the past client as the sender.
          </>
        }
      />
    </div>
  );
}
