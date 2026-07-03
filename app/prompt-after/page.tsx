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
    "Same-day showing reports — sellers don't fire me",
  description:
    "How real-estate agents send same-day post-showing summary emails to sellers — drafted from a voice memo. The 4-paragraph format, what NOT to include, and why the cadence is the relationship's safety net.",
  openGraph: {
    title: "Same-day showing reports. Sellers don't fire me.",
    description:
      "The 4-paragraph format that lands the same evening as the showing. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Same-day showing reports",
    description:
      "Voice memo → 4-paragraph seller summary, same evening. Setup + prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-after" },
};

const AFTER_PROMPT = `You are a senior real-estate agent's
post-showing seller-summary drafter.

INPUT
You receive: the agent's voice memo
recorded after the showing (1-3 minutes,
unstructured), the seller's expectations
(captured at listing appointment), the
client (buyer) brief, and the agent's
prior-summary samples (for voice).

OUTPUT
A 4-paragraph email summary for the
seller. Each paragraph has a specific
job:

  ¶1 — Logistics: who came, when, how
       long they stayed.
  ¶2 — What they liked: 2-3 specific
       features the buyer reacted
       positively to. Reference their
       words, not the agent's
       interpretation.
  ¶3 — What gave them pause: 1-2
       concerns or hesitations,
       reported neutrally. Never call
       these "objections" or
       "negatives" — they're
       observations.
  ¶4 — Next step: what the agent is
       doing next (sending followup,
       waiting for spouse review,
       scheduling second visit) with
       a date.

RULES (non-negotiable)
1. The summary is for the seller, not
   the buyer. Tone: warm, professional,
   confident. The seller is paying;
   the agent is reporting.
2. Never include data that would
   embarrass the buyer if the seller
   forwarded it. No "the wife was
   skeptical" — write "they want to
   see it together once more".
3. Length: 4 paragraphs, ~120-180 words
   total. Anything longer reads as
   defensive.
4. End with a clear next-step. Never
   "we'll see how it goes" — always
   "I'll send the floor plan tomorrow"
   or "second viewing is scheduled
   for Saturday".
5. Match agent voice samples for
   sign-off and warmth calibration.

ANTI-PATTERNS (never produce these)
- "Unfortunately, they didn't seem
  interested"
- Quotes from the buyer that feel
  intrusive
- Excuses ("the timing wasn't great")
- Multi-paragraph next-step (signals
  uncertainty)
- Auto-suggesting price drops to
  manage seller expectations
  (that conversation is in person,
  not in the email)`;

const PARAGRAPHS: { paragraph: string; what: string; example: string }[] = [
  {
    paragraph: "¶1 — Logistics",
    what: "Who came, when, how long. Sets the seller's mind that the showing happened as scheduled.",
    example: "Marina and Hugo Costa came by today at 11am for the Murtais 24 viewing. They spent about 25 minutes — both in the kitchen, on the balcony, and walking the garden.",
  },
  {
    paragraph: "¶2 — What they liked",
    what: "2-3 specific features the buyers reacted to positively. Reference their actual words and reactions.",
    example: "They both responded strongly to the south-facing kitchen — Marina particularly noted the afternoon light, and Hugo asked about the garden's sun exposure for vegetable beds. The 8-minute walk to the train was confirmed as a real plus for Hugo's commute.",
  },
  {
    paragraph: "¶3 — What gave them pause",
    what: "1-2 concerns reported neutrally. Never as 'negatives' or 'objections'.",
    example: "Marina wanted to see how the 90m² garden compares to the listing photos — the angle compresses it slightly — and they want one more look together at the building's HOA history before committing to a second visit.",
  },
  {
    paragraph: "¶4 — Next step",
    what: "Concrete agent action with a date or trigger.",
    example: "I'm sending Marina a fresh garden photo tomorrow, plus the 2023-2026 HOA statements you shared. They've asked to consider a second viewing this Saturday — I'll confirm by Wednesday and let you know.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Same-day. Always. The 24-hour silence is what loses listings.",
    body: "Sellers expect a report after every showing. Most agents either don't send one or send a thin 'showing went well' a day or two later. The protocol's discipline is same-day delivery — within 4 hours of the showing ending. The summary lands while the seller is still curious, not after they've had to call you to ask.",
  },
  {
    n: "02",
    title: "Voice memo at the car. Same as the call-log protocol.",
    body: "60 seconds after leaving the showing, the agent records a 90-180 second voice memo describing what happened. The memo is messy by design — Whisper transcribes, Claude extracts. By the time the agent is back in the office, the seller-summary draft is in the queue waiting for review. The agent reviews 4 paragraphs in 90 seconds and approves.",
  },
  {
    n: "03",
    title: "Translate buyer reactions into seller-friendly language.",
    body: "Buyers say things like 'this kitchen would drive me crazy' or 'the wife is skeptical'. The summary translates these into 'they want to see the kitchen layout once more' and 'they want to take another look together'. The translation isn't dishonest — it's professional. The seller doesn't need (and shouldn't see) the unfiltered buyer.",
  },
  {
    n: "04",
    title: "Concerns are observations, never objections.",
    body: "The third paragraph is where most agent-written summaries fail — they either skip the concerns (which sellers smell) or list them as 'negatives' (which sellers panic at). The protocol's discipline: report concerns neutrally, frame them as observations, give the seller information without alarm. 'They want one more look at the HOA history' is fact; 'they're worried about the HOA' is alarm.",
  },
  {
    n: "05",
    title: "Multiple-showing cadence: same template, different moment.",
    body: "After the second viewing, after the buyer's spouse has been involved, after the offer-or-archive moment — each gets a same-day summary with the same 4-paragraph structure. The cadence itself is the relationship's safety net: the seller never wonders what's happening because the report is in their inbox by 8pm.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the panic-inducer",
    body: "¶3: Unfortunately, the buyers had several major concerns about the property — the garden seemed too small, they thought the kitchen was a bit dated, and they were worried about the HOA fees. They didn't seem very enthusiastic.",
    why: "Three concerns, presented as 'major', framed as 'unfortunately'. The seller reads this and panics — calls you that night asking what they should do. The summary's job is to inform, not alarm. Concerns are observations; the seller decides their weight.",
  },
  {
    label: "the embarrassing leak",
    body: "¶2: They liked most of the property, but Marina kept saying 'this kitchen would drive me crazy' when she thought I wasn't listening, and her husband whispered something about 'this place is overpriced' as they walked out.",
    why: "Quotes from the buyer that the seller will use against you in the next conversation. 'Marina said this kitchen would drive her crazy' is the kind of detail that ends up in a counter-offer email weeks later. Don't put it in writing. Translate.",
  },
  {
    label: "the empty next-step",
    body: "¶4: We'll see how it goes! I'll be in touch with any updates as they come in. Hope you have a great evening!",
    why: "No commitment. No date. The seller closes the email knowing nothing about what happens next. The protocol requires a concrete next-step with a trigger — even if the trigger is 'I'm waiting on a buyer reply by Wednesday'. Without it, the seller calls you that night to ask.",
  },
];

export default function PromptAfterPage() {
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
            Same-day showing reports.
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
              Sellers don&apos;t fire me.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The agents who lose listings rarely lose them on price. They
            lose them on the silence after every showing. Sellers want to
            know what happened. The agents who report same-day, every
            time, in a consistent format don&apos;t lose listings — even
            when the showings themselves go badly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 19 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>seller_summary_2026-04-26.eml</span>
              <span className="hidden sm:inline">sent 17:42 · 4h after showing</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Hi José —

Marina and Hugo Costa came by today at 11am
for the Murtais 24 viewing. They spent about
25 minutes walking through.

Both responded strongly to the south-facing
kitchen and the garden's afternoon light.
The 8-minute walk to the train confirmed
Hugo's commute.

Marina wants to see the garden once more
in person — the photo angle compresses it.
They've also asked for HOA statements
2023-2026 before scheduling a second visit.

I'll send the HOA history and a fresh garden
photo by tomorrow EOD. Confirming a second
viewing slot for Saturday by Wednesday — will
let you know either way.

Warmly,
A.`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Four paragraphs. 145 words. Drafted from a 90-second voice
              memo at the car. The seller reads it at dinner and goes to
              bed informed, not anxious.
            </p>
          </div>
        </div>
      </section>

      {/* The 4-paragraph format */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the format"
          title="Four paragraphs. Specific jobs."
          description="The format is rigid for a reason: it gives the seller exactly what they need without space for the agent's anxiety to leak in. Each paragraph has a job; staying in lane keeps the report calm."
        />

        <div className="mt-8 space-y-4">
          {PARAGRAPHS.map((p) => (
            <div
              key={p.paragraph}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
                {p.paragraph}
              </div>
              <p className="mt-2 text-[14px] sm:text-[15px] text-slate-900 font-medium leading-snug">
                {p.what}
              </p>
              <p className="mt-3 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed italic">
                &ldquo;{p.example}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Same-day delivery."
          description="The discipline of same-day reporting. Skip any one and the report either lands too late, leaks the buyer's privacy, or alarms the seller."
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
          title="Three reports that lose the listing."
          description="Each one breaks one of the protocol's rules. Each one has been sent by a real agent — and each one was followed by an awkward call from the seller within 24 hours."
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
          eyebrow="the prompt that drafts the summary"
          title="What to feed Claude."
          description="The prompt that turns a 90-second messy voice memo into the 4-paragraph seller-friendly report. Sonnet recommended for tone-translation nuance — Haiku tends to leak buyer-side language."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">after_system_prompt.md</span>
            <CopyButton text={AFTER_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{AFTER_PROMPT}
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
            Voice memo immediately at the car. Whisper + Claude produce the
            draft within 2 minutes. Agent reviews and sends within 4 hours
            of the showing ending.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 4-paragraph showing report"
          headlinePrimary="Drafting the report is step one."
          headlineAccent="Sending same-day every time is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="AFTER"
        origin={
          <>
            A real-estate adaptation of the same-day listing-side reporting
            discipline that separates top listing agents from the rest. Our
            slice: the 4-paragraph showing summary, drafted from a 90-second
            voice memo at the car — the cadence holds even when the showings
            don&apos;t.
          </>
        }
      />
    </div>
  );
}
