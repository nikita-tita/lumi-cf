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
    "Open-house leads die in 24 hours — the 14-min protocol that doesn't let them",
  description:
    "How real-estate agents convert open-house attendees into briefed leads with a 4-touch sequence calibrated to a single sign-in question. The question, the touches, and the conversion lift over no-protocol baseline.",
  openGraph: {
    title: "Open-house leads die in 24h. I have a protocol.",
    description:
      "Sign-in question + 4-touch sequence (24h, 7d, 14d) → calibrated to the room they asked about. Setup + Claude prompts.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open-house leads die in 24 hours",
    description:
      "14-min protocol that catches open-house leads before they cool. Setup + Claude prompts.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-open" },
};

const OPEN_PROMPT = `You are a senior real-estate agent's
open-house follow-up drafter.

INPUT
You receive: the attendee's sign-in details
(name, email, phone, channel preference,
their answer to the sign-in question), the
property details (address, beds, layout,
features), and which touch in the sequence
this is (24h, 7d, or 14d).

The sign-in question is fixed: "Which
room did you spend the most time in?"
(or for showings without rooms: "What
caught your attention?")

OUTPUT
A single message for the touch number,
calibrated to:
  - the room/feature the attendee
    referenced
  - the touch's job (24h, 7d, or 14d)
  - the channel (SMS / WhatsApp / email)

  TOUCH 1 (24h thank-you):
    Subject: implicit if email; reference
             the room they spent time in.
    Body: 2-3 sentences. Thank them
          briefly, reference the specific
          room, surface ONE adjacent
          listing (similar layout in
          their range).

  TOUCH 2 (7d market data):
    Body: 3-4 sentences. Anchor in a
          recent neighbourhood data point
          (new listing, price drop, comp
          sale). Connect to the room
          reference if natural.

  TOUCH 3 (14d ask-or-archive):
    Body: 2-3 sentences. Direct,
          warm. Name the choice:
          continue searching together
          or archive. Honour either.

RULES (non-negotiable)
1. Reference the SPECIFIC room every
   touch. The room is the only thread
   that distinguishes this person from
   the other 14 sign-ins.
2. Never bulk-send. Each message is
   personalised; volume is fine, but
   each one must reference the room.
3. Touch 3 honours the archive choice.
   No 'one more email' on day 16.
4. Voice matches the channel (SMS terse,
   email warmer-formal, WhatsApp casual).
5. Each touch advances. No 'just
   checking in' energy.

ANTI-PATTERNS (never produce these)
- Generic 'thanks for stopping by'
- Touch 1 mentions price (too pushy)
- Touch 2 references property they
  didn't visit
- Touch 3 with no archive option
- Cross-channel name-drops`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The sign-in question is the whole protocol.",
    body: "Most open-house sign-ins capture name, email, phone — and a checkbox for 'looking to buy' that everyone clicks. None of that personalises the follow-up. The protocol's leverage is in adding ONE question: 'Which room did you spend the most time in?' This single answer is what every subsequent touch references. Without it, the protocol regresses to generic spray-and-pray.",
  },
  {
    n: "02",
    title: "Touch 1 lands within 24 hours. Voice and channel matter.",
    body: "First touch within 24 hours of the open-house. Channel matches the attendee's stated preference (SMS for most under-40s, email for most over-40s). Subject or first sentence references the specific room — 'Saw you spent time in the kitchen — sending you something similar' beats 'Thanks for stopping by!' by a wide margin. The 24-hour window matters because attention decays sharply after.",
  },
  {
    n: "03",
    title: "Touch 2 lands at 7 days with new market context.",
    body: "Seven days later, second touch. This one anchors in something new in the market — a listing that came on, a price drop on a comparable, a neighbourhood data point. Connect it back to the room they referenced where natural. The discipline: don't pitch the original property again, surface adjacent context. They're already aware of the original; they need to know the market is moving.",
  },
  {
    n: "04",
    title: "Touch 3 at 14 days is ask-or-archive. Honoured exactly.",
    body: "Day 14 is the named-choice moment. 'Want me to keep sending these, or shall we archive for now?' If they say archive, the agent stops — no 'one more email' on day 16. The credibility of the protocol is in the honour. Re-engagement happens months later through the watch protocol if life events trigger, not by the agent forcing a fourth touch.",
  },
  {
    n: "05",
    title: "Conversion math: 8-12% sequence completion → 25% of those convert.",
    body: "Of every 100 sign-ins, ~10-12 will reply somewhere in the sequence (the rest go silent). Of those repliers, ~25-28% become real conversations (showings booked, offers submitted, contracts signed). That gives ~3% open-house-to-transaction conversion — which is roughly 4-7× the no-protocol baseline (most agents convert open-house traffic at 0.4-0.7%). The lift is real and measurable; it requires the protocol's discipline.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the bulk-blast",
    body: "[Touch 1, sent identically to all 18 sign-ins]: 'Hi! Thanks so much for coming to our open house this weekend. We had a great turnout! If you're interested in this property or anything similar, please don't hesitate to reach out!'",
    why: "Doesn't reference the room. Doesn't reference the attendee. Could have been sent to anyone. The whole leverage of the protocol is in personalisation by room — without it, the message has the conversion rate of any other open-house follow-up (0.4%).",
  },
  {
    label: "the price-pusher",
    body: "[Touch 1, 24h]: 'Hi Marina! Saw you spent time in the kitchen. The asking is €825,000 and the seller is motivated. Would you like to schedule a private viewing? Open to offers in the 800s.'",
    why: "Touch 1 mentions price and proposes a viewing in the first sentence. Way too aggressive. The 24h touch is for warming the relationship — surfacing one similar listing without pressuring. Pricing and viewing pitches belong at touch 2 minimum, and only if the attendee replied to touch 1.",
  },
  {
    label: "the silent-fourth-touch",
    body: "[Sequence stated 'ask or archive at 14 days', but agent sends at day 21]: 'Hi Marina, just one more thought — wanted to mention a similar property that just came on. Open this weekend if you'd like to see it!'",
    why: "Said archive at day 14, sent at day 21 anyway. Burns the protocol's credibility entirely — both with this attendee (who now distrusts the agent) and indirectly with anyone they tell. The honour is what makes the protocol work; honouring it means honouring it.",
  },
];

export default function PromptOpenPage() {
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
            Open-house leads
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
              die in 24 hours.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most open-house sign-ins are dead by Tuesday. Generic
            thank-you emails don&apos;t resurrect them; spray-and-pray
            sequences feel like marketing. The protocol that converts
            them at 4-7× the baseline rate isn&apos;t a longer sequence.
            It&apos;s one specific sign-in question that makes the
            sequence personalisable to the actual person who walked
            through the door.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 20 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>open-house · murtais 24 · 18 sign-ins</span>
              <span className="hidden sm:inline">3% → transaction</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`The sign-in question:
  "Which room did you spend the most
   time in?"

3-touch sequence per attendee:
  · 24h: thank-you, references the room,
         surfaces 1 adjacent listing
  · 7d:  market context, calibrated to
         the room
  · 14d: ask-or-archive — honoured

Conversion of 18 sign-ins:
  · 11 reply to touch 1 (61%)
  · 6 carry through touch 2 (33%)
  · 4 ask for archive at touch 3 (22%)
  · 1 books a private viewing → offer`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              One sign-in question. Three calibrated touches. One offer
              from one open-house — versus an agent who would have lost
              all 18 to silence.
            </p>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One sign-in question."
          description="The protocol's leverage is the single sign-in question. The rest is sequence discipline — touch timing, voice, and the honoured archive."
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
          title="Three failures the protocol avoids."
          description="Each one is a real-agent failure mode. Each one breaks one of the protocol's rules — and each one collapses the sequence's conversion."
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
          eyebrow="the prompt that drafts each touch"
          title="What to feed Claude."
          description="One prompt, three touches — the touch parameter routes which calibration to apply. The room reference is the constant thread; the touch number is what changes the message's job."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">open_system_prompt.md</span>
            <CopyButton text={OPEN_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{OPEN_PROMPT}
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
            Run the prompt once per attendee per touch. Schedule sends via
            email/SMS scheduler. Auto-cancel touch 3 if the attendee
            requested archive.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact open-house follow-up sequence"
          headlinePrimary="Adding the sign-in question is step one."
          headlineAccent="Honouring the day-14 archive is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="OPEN"
        origin={
          <>
            A real-estate adaptation of the event-attendee follow-up
            playbook from B2B — one personalising question powers the whole
            sequence. Our slice: &ldquo;which room did you spend the most
            time in?&rdquo; as the open-house sign-in question, then a
            14-day room-anchored sequence.
          </>
        }
      />
    </div>
  );
}
