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
    "I send 50 handwritten cards a month — I write zero of them",
  description:
    "How real-estate agents send personalised handwritten thank-you cards at scale via Bond/Handwrytten APIs. The prompt that doesn't sound like AI, the cadence that triggers referrals, and the cost-per-card math.",
  openGraph: {
    title: "50 handwritten cards a month. I write zero.",
    description:
      "AI-drafted, robot-handwritten thank-yous that read like the agent wrote them by candlelight. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "50 handwritten cards a month",
    description:
      "AI-drafted, robot-handwritten thank-yous that read like the agent wrote them.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-written" },
};

const WRITTEN_PROMPT = `You are a senior real-estate agent's
handwritten-card drafter.

INPUT
You receive: the trigger event (closed deal,
listing anniversary, life event learned in
conversation, holiday season touch),
the client's CRM brief with soft signals
captured during the relationship, and 2-3
samples of how the agent typically signs
off (sentence rhythm, sign-off line, voice).

OUTPUT
A 3-5 sentence card body and a sign-off line.

Total length: 35-65 words. Cards longer than
this stop reading like cards and start
reading like letters — which the recipient
files and forgets.

Structure:

  Sentence 1: a specific personal reference
              from the soft signals — never
              the deal itself, always
              something around the deal.

  Sentence 2-3: a brief, warm observation
              that connects the personal
              reference to the moment of
              the card.

  Sentence 4-5 (optional): a generous
              sentiment that doesn't ask
              for anything — no "any
              referrals welcome", no "let
              me know if I can help".

  Sign-off: matches agent voice samples.

RULES (non-negotiable)
1. Never reference the property purchased.
   The card is about the relationship, not
   the transaction.
2. Never ask for referrals, reviews, or
   future business. The whole leverage of
   the card is its no-ask quality.
3. Reference one specific soft signal — the
   detail in the brief that made the
   relationship feel like a relationship
   ("the kitchen window you loved", "the
   way you and Hugo finish each other's
   sentences").
4. No emoji. No exclamation marks. Period.
5. Voice must match samples. If the agent
   ends with "Warmly, A." then the card
   ends with "Warmly, A.".

ANTI-PATTERNS (never produce these)
- "Congratulations on your new home!"
- "It was a pleasure working with you"
- Any reference to the deal price, address,
  or transaction details
- "If you know anyone looking…"
- "Please consider leaving a review"
- "Hope to work with you again"

The recipient should read the card in 12
seconds, smile, and pin it on their fridge.
The card&apos;s job is to live on the fridge,
not to be read once and binned.`;

const EXAMPLE_INPUT = `# ── card draft trigger ───────────────────────────
trigger:         "1-year listing anniversary"
client:          "Marina & Hugo Costa"
deal_closed:     "2025-04-22"
relationship_brief:
  soft_signals:
    - "the way the kitchen window caught
       afternoon light when they viewed it"
    - "Hugo brought his guitar to the
       walkthrough — played a song while
       Marina paced the living room"
    - "Marina mentioned wanting to plant
       lavender on the balcony"
  family_stage:   "newly married, no kids"
  hobbies:        "Hugo: music; Marina: garden"

agent_voice_samples:
  - "Warmly, A."
  - "Always glad to be in your corner."
  - "If you ever want to chat, my coffee's
     open."
`;

const EXAMPLE_OUTPUT = `Marina, Hugo —

A year already. I still think about Hugo's
guitar at the walkthrough — and I bet that
afternoon light still hits the kitchen
window the same way.

Hope the lavender on the balcony is taking.

Warmly,
A.`;

const TRIGGERS: { trigger: string; cadence: string; why: string }[] = [
  {
    trigger: "Closing day + 1 week",
    cadence: "every closed deal",
    why: "First card. Land in the new home before they've finished unpacking. Sets the relationship's standard.",
  },
  {
    trigger: "1-year listing anniversary",
    cadence: "every closed deal",
    why: "The single highest referral-trigger moment. The client is still in love with the home and remembers the agent's role.",
  },
  {
    trigger: "Life-event signal (marriage, baby, etc.)",
    cadence: "as detected via /prompt-watch",
    why: "Tied to the relationship-radar protocol. Card lands in the same week as the life event — feels like the agent saw it personally.",
  },
  {
    trigger: "Local event / shared connection",
    cadence: "ad hoc",
    why: "Restaurant they mentioned opens a new location, neighbour they liked moves in down the street — agent sends a 'thought of you' note.",
  },
  {
    trigger: "End-of-year holiday",
    cadence: "December, all closed clients",
    why: "Less leverage than personal triggers, but expected by past clients — skipping it is more conspicuous than including it.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The card never references the deal.",
    body: "First-instinct cards say 'congratulations on your new home' or 'it was a pleasure helping you find this place'. Both are death — they remind the client of the transaction (which is over) instead of the relationship (which continues). The card succeeds by referencing something around the deal: a moment from the walkthrough, a soft signal from the early conversations, a hobby the agent learned about. The deal itself never shows up.",
  },
  {
    n: "02",
    title: "Soft signals from the CRM are the only material.",
    body: "Without the soft signals, the prompt produces generic warmth that any agent could send. With them, the card has the one detail that proves the agent paid attention. This is why the dossier and call-log protocols feed this one — the soft signals captured during the relationship become the fuel for the cards a year later.",
  },
  {
    n: "03",
    title: "Robot-handwriting at the API layer, never digital print.",
    body: "Bond and Handwrytten use mechanical-arm pens that produce genuinely handwritten cards (real ink, real paper, real variations). Digital-print 'handwritten font' is recognisable on touch — the recipient knows. The cost is $4-7/card vs $0.30/card; the conversion-on-referrals delta justifies the spend. Use the real handwriting service or skip the protocol.",
  },
  {
    n: "04",
    title: "Never ask for anything in the card.",
    body: "The single rule that makes the card work. No 'any referrals welcome'. No 'please leave a review on Google'. No 'hope we can work together again'. The card is a gift, full stop. The conversion happens because the no-ask is unusual — and the unusual is what makes the recipient mention the agent to a friend three months later when the friend mentions house-hunting.",
  },
  {
    n: "05",
    title: "Cadence is per-trigger, not on a calendar.",
    body: "Calendar-driven cards (every 6 months, regardless of context) feel like a marketing program — because they are one. Trigger-driven cards (closing + 1 week, 1-year anniversary, life event detected) feel like the agent thought of the client. The whole leverage is in the timing matching the moment. The relationship-radar protocol surfaces life-event triggers automatically.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the transaction reminder",
    body: "Hi Marina and Hugo! Hope you're loving the new place. It was such a pleasure helping you close on Rua da Prata last spring — what a journey we had with the negotiations! Please don't hesitate to reach out if you ever know anyone looking. Best wishes!",
    why: "Names the property. References the negotiation. Asks for referrals. Three failures in three sentences — and the card now reads as a marketing reminder, not a personal note.",
  },
  {
    label: "the AI-detected card",
    body: "Dear Marina, congratulations on the one-year milestone of your homeownership journey! It has been an absolute pleasure to be part of your story. May the year ahead bring you even more joy and prosperity in your beautiful new abode! 🏡✨",
    why: "Multiple exclamation marks. Two emojis the agent doesn't use. 'Homeownership journey' and 'beautiful new abode' are AI-default phrases. The recipient reads the first line and knows it wasn't written by hand.",
  },
  {
    label: "the missing soft signal",
    body: "Hi Marina, just thinking of you on this one-year anniversary. Hope you're doing well! Warmly, A.",
    why: "Generic warmth without the specific detail. Could have been sent to any client — and the recipient feels exactly that. The whole point of the protocol is that the card couldn't have been sent to anyone else; this one could have been sent to all 50 past clients verbatim.",
  },
];

export default function PromptWrittenPage() {
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
            50 handwritten cards a month.
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
              I write zero of them.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Past clients refer agents who feel like friends. Friends send
            handwritten cards on specific occasions, with specific details.
            Email doesn&apos;t do this. Generic merch doesn&apos;t do this.
            The agents who&apos;ve cracked this aren&apos;t writing the
            cards themselves — they&apos;re generating them, mailing them,
            and getting referrals because each card lives on a fridge for
            two years.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 12 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>card_marina_costa.txt — 1y anniversary</span>
              <span className="hidden sm:inline">$5.40 · ships in 2 days</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Marina, Hugo —

A year already. I still think about Hugo's
guitar at the walkthrough — and I bet that
afternoon light still hits the kitchen
window the same way.

Hope the lavender on the balcony is taking.

Warmly,
A.`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              42 words. Three soft signals from the CRM (guitar, kitchen
              window, lavender). Zero ask. Zero reference to the deal. Lives
              on the fridge for two years.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why handwritten beats every other channel.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Email is read in 4 seconds and archived. Text messages are read in
            2 seconds and forgotten. A printed marketing card is recognised as
            marketing in 0.5 seconds and binned. The handwritten card is the
            only artefact that survives the 30-second triage at the front
            door — because it&apos;s tactile, it&apos;s rare, and the
            recipient assumes someone took the time to write it.
          </p>
          <p>
            The recipient&apos;s first action is usually to put the card on
            the fridge or the entry table. The card now occupies physical
            real estate in the client&apos;s home for weeks or months. Every
            time the client opens the fridge — every time someone visits and
            sees the card — the agent&apos;s name is in front of them. The
            card&apos;s real conversion happens 4 months later when a friend
            mentions house-hunting and the client glances at the fridge.
          </p>
          <p>
            The fact that the card was AI-drafted and machine-handwritten
            doesn&apos;t reduce its impact — provided the soft signals are
            real, the voice matches, and the no-ask discipline holds. The
            recipient feels seen because the card&apos;s content is specific
            to them. Specificity is what their brain is checking for. The
            origin of the words behind the specificity matters less.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The card&apos;s job is to live on the fridge — not to be
            read once and binned.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Triggers */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="when to send"
          title="Five triggers. No calendar."
          description="Cards driven by the calendar feel like a program. Cards driven by triggers feel like the agent thought of the client. The triggers are precise; the cadence flows from them."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr] sm:grid-cols-[220px_180px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 hidden sm:grid">
            <div>trigger</div>
            <div>cadence</div>
            <div>why</div>
          </div>
          {TRIGGERS.map((t) => (
            <div
              key={t.trigger}
              className="flex flex-col sm:grid sm:grid-cols-[220px_180px_1fr] gap-2 sm:gap-6 px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {t.trigger}
              </div>
              <div className="text-slate-900 font-medium text-[13px] sm:text-[14px]">
                {t.cadence}
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {t.why}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One card at a time."
          description="The discipline that protects what makes the card work. Skip any one — especially the no-ask rule — and the card collapses into recognisable marketing."
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
          title="Three cards that get binned in 8 seconds."
          description="Each one is a real card we've seen sent. Each one breaks one of the protocol's rules — and each one was thrown out (we asked the recipient) before it ever made it to the fridge."
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
          title="The trigger input."
          description="What the prompt receives per card. Soft signals from the CRM are the fuel; voice samples are the calibration; trigger gives the moment."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">card_trigger.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy trigger" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that drafts the card"
          title="What to feed Claude."
          description="The system prompt that turns soft signals into a 35-65 word card body in the agent's voice. Sonnet recommended — voice-matching nuance matters more than latency here."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">written_system_prompt.md</span>
            <CopyButton text={WRITTEN_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{WRITTEN_PROMPT}
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
            Pipe Claude output into Bond or Handwrytten API with the
            recipient&apos;s mailing address. Cost: ~$4-7 per card all-in.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="trigger in · card out"
          title="What Claude returns."
          description="Body + sign-off, ready for the handwriting API. 42 words. Three soft signals woven in. Zero asks."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · card body
          </div>
          <pre className="mt-3 text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-serif whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact handwritten-card protocol"
          headlinePrimary="Drafting the card is step one."
          headlineAccent="Trusting the no-ask discipline is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="WRITTEN"
        origin={
          <>
            A real-estate adaptation of the robot-handwritten outreach
            pattern from SaaS gifting (Bond, Handwrytten, Postable). Our
            slice: trigger-driven cards that live on the past client&apos;s
            fridge for two years — and produce referrals four months later.
          </>
        }
      />
    </div>
  );
}
