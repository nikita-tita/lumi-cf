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
    "The first reply — the prompt that answers a 9pm enquiry before you wake up",
  description:
    "The showing goes to the first agent who replies, not the best one. The exact prompt that drafts a first reply from a raw portal enquiry — one question, one next step, nothing invented — so you approve and send instead of composing at 7am.",
  openGraph: {
    title: "The first reply — speed-to-lead prompt for agents",
    description:
      "A buyer messages at 9pm. You reply at 9am. They booked someone else. The prompt that closes that gap — free.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The first reply — the speed-to-lead prompt",
    description:
      "Drafts the reply to a portal enquiry in your voice. You approve and send. Free prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-fast" },
};

const FIRST_REPLY_PROMPT = `You are a real-estate agent's first-reply
drafter. You write the very first message back
to an inbound enquiry. You draft only — the
agent sends.

INPUT
enquiry_text        (verbatim, as received)
channel             (portal / WhatsApp / SMS /
                     email / IG DM)
listing_facts       (only what the agent gives
                     you: address, price,
                     beds, availability)
agent_first_name
agent_earliest_slots (2 concrete options)
received_at         (timestamp)

OUTPUT
ONE message, ready to send on the same channel
the enquiry arrived on. Length by channel:
  portal / WhatsApp / SMS / IG  → 2-4 sentences
  email                          → 4-6 sentences
                                   + subject line

STRUCTURE (in this order, no headings)
1. Answer the question they actually asked —
   in the first sentence. If they asked whether
   it is still available, the first word decides
   it: "Yes" or "It's under offer, but".
2. Add exactly ONE fact from listing_facts they
   did not ask for but will want — the one that
   most affects whether they book.
3. Ask exactly ONE qualifying question. Pick the
   single highest-value unknown: timeline, or
   whether they are buying to live in or to let,
   or whether they are already viewing in the
   area. Never ask two.
4. Offer the two concrete slots from
   agent_earliest_slots. Real days and times —
   never "let me know what suits you".

RULES (non-negotiable)
1. Never state a fact that is not in
   listing_facts. If they asked something you
   were not given, say plainly that you will
   confirm it and give a time by which you will
   ("I'll confirm the service charge tonight").
2. No price negotiation, no yield or return
   figures, no market commentary, no mortgage
   or financing advice.
3. Match the language of enquiry_text. If it is
   ambiguous, use English.
4. If received_at is outside working hours, do
   NOT apologise for the hour and do NOT mention
   the time at all. Write the message as if it
   is being read now.
5. No greetings longer than the person's first
   name. No "Thank you for your enquiry". No
   "I hope this message finds you well".
6. Sign with agent_first_name only.

ANTI-PATTERNS (never produce)
- "Thank you for your interest in this
   property!"
- "I would be delighted to assist you"
- Any sentence that could be sent about any
  listing
- More than one question mark in the message
- Emoji, exclamation marks, ALL CAPS

TONE
A competent person replying quickly, not a
brochure. The reader should be able to answer
in one line from their phone.`;

const EXAMPLE_INPUT = `# ── what you paste at 7:02am ───────────────────
enquiry_text: |
  "Hi, is the 2-bed in Marina Gate 2 still
   available? What floor is it on?"
channel:              portal
received_at:          2026-07-26 21:14
listing_facts:
  address:            "Marina Gate 2, 2-bed"
  price:              "AED 2,450,000"
  floor:              "31st, marina view"
  availability:       "available"
  extra:              "vacant — can be viewed
                       any day this week"
agent_first_name:     "Nikita"
agent_earliest_slots:
  - "today 18:30"
  - "Saturday 11:00"
`;

const EXAMPLE_OUTPUT = `Yes, still available — 31st floor, marina
view. It's vacant, so we can get in any day
this week rather than working around a tenant.

Are you looking to move in yourself or to let
it out? I've got today 18:30 or Saturday 11:00
free — either work?

— Nikita`;

const WHY: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "The first sentence answers the question.",
    body: "Most first replies open with gratitude and reach the answer in sentence three. The enquiry asked one thing. Answering it in the first four words is the entire difference between a reply that gets a response and one that gets scrolled past — the reader decides whether you are worth answering before the message is fully on screen.",
  },
  {
    n: "02",
    title: "One unasked fact, chosen for booking impact.",
    body: "Vacant versus tenanted. Floor and view. Whether the payment plan has post-handover instalments. Pick the single fact that most changes whether they want to see it — and stop. Three facts read as a listing description, and a listing description is what they already scrolled past on the portal.",
  },
  {
    n: "03",
    title: "One question. Never two.",
    body: "Two questions halve your reply rate, because the reader now has to compose rather than answer. Pick the highest-value unknown for this specific enquiry and leave the rest for the call. The prompt enforces a single question mark in the whole message for exactly this reason.",
  },
  {
    n: "04",
    title: "Two real slots beat 'let me know what suits'.",
    body: "An open-ended availability question is work you have handed back to the buyer. Two concrete times turn the reply into a yes/no. This is also the sentence that gets you the viewing before the other three agents reply — they are all still asking what suits.",
  },
  {
    n: "05",
    title: "Never apologise for the hour.",
    body: "A message that opens with sorry for the late reply reminds them how long they waited. If it is 7am and the enquiry landed at 9pm, write as though it is being read now — because it is. The clock only matters to you.",
  },
];

const SPEED_TABLE: { window: string; what: string; note: string }[] = [
  {
    window: "0-5 min",
    what: "Qualification odds peak",
    note: "Replying within five minutes rather than thirty makes an agent 21× more likely to qualify the lead (Lead Response Management / Oldroyd et al.)",
  },
  {
    window: "< 1 hour",
    what: "Still a real conversation",
    note: "Contact within the hour yields ~7× more meaningful conversations than the hour after (Harvard Business Review, 2011)",
  },
  {
    window: "Overnight",
    what: "The realistic case",
    note: "You were asleep. The draft was written at 21:15 and is waiting in your approvals when you wake — you send at 06:50, not compose at 07:20.",
  },
  {
    window: "> 24 hours",
    what: "You are the second call",
    note: "The showing has usually been booked with whoever replied first. The reply still goes out — it is just no longer competing on speed.",
  },
];

export default function PromptFastPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={5} guideAnchor="#why" />

      {/* Hero */}
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
            A buyer messages at 9pm.
            <br />
            <span
              style={{
                background: "#2563EB",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              You reply at 9am.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            By then they have booked someone else. Not a better agent — a
            faster one. You cannot watch your inbox at midnight, and you should
            not try. What you can do is have the reply already written when you
            open your phone, so the twelve hours you were asleep cost you one
            tap instead of the lead.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>5-min read</span>
            <span aria-hidden>·</span>
            <span>Updated August 2026</span>
            <span aria-hidden>·</span>
            <span>keyword FAST · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>first_reply.txt — preview</span>
              <span className="hidden sm:inline">sent 06:50</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Yes, still available — 31st floor, marina
view. It's vacant, so we can get in any day
this week rather than working around a tenant.

Are you looking to move in yourself or to let
it out? Today 18:30 or Saturday 11:00 — either
work?`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Answer first. One fact they did not ask for. One question. Two
              real slots. No apology for the hour.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Speed-to-lead is not a discipline problem.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Every agent already knows that replying fast wins. Nobody is losing
            leads because they underestimated the value of a quick reply — they
            are losing them because the enquiry landed at 21:14, during dinner,
            while driving, or mid-showing with a different client. The gap is
            not motivation. It is that composing a good first reply takes four
            minutes of attention you did not have at that moment.
          </p>
          <p>
            So the fix is not to answer faster in the moment. It is to make the
            reply exist without you. A draft written the second the enquiry
            arrives, waiting for one tap of approval, turns a twelve-hour delay
            into a ten-second one — and turns your 7am from composing into
            sending.
          </p>
          <p>
            The manual version of this works too. It is just slower than your
            competition, which is the only benchmark that matters here.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The showing goes to the first agent who replies, not the best
            one.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The rules */}
      <section id="why" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the anatomy"
          title="Five rules inside a four-sentence message."
          description="Each one removes a habit that costs replies. Together they produce something the reader can answer from a lift, in one line."
        />

        <ol className="mt-10 space-y-5">
          {WHY.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[60px_1fr] sm:grid-cols-[88px_1fr] gap-4 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col items-start gap-2">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-semibold text-white text-base sm:text-lg shadow-md"
                  style={{ background: "#2563EB" }}
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

      {/* Speed table */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="the clock"
          title="What each delay actually costs."
          description="The numbers below come from lead-response research outside real estate. Treat them as direction, not as a promise about your market — the ranking of the windows is the durable part."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_220px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>window</div>
            <div className="hidden sm:block">what happens</div>
            <div>evidence</div>
          </div>
          {SPEED_TABLE.map((row) => (
            <div
              key={row.window}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_220px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold">
                {row.window}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {row.what}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium">
                {row.what}
              </div>
              <div className="text-slate-600 leading-relaxed">{row.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Input */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="What you feed it."
          description="The enquiry verbatim, the facts you can actually stand behind, and two slots you would genuinely honour. The model is only allowed to state what appears here."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">first_reply_input.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy input" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt"
          title="What to feed Claude."
          description="System prompt in a new chat, enquiry block as the first message. Keep it open in a pinned tab — the whole workflow is paste, read, send."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">first_reply_system_prompt.md</span>
            <CopyButton text={FIRST_REPLY_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{FIRST_REPLY_PROMPT}
          </pre>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <a
            href="https://claude.ai/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:translate-y-[-1px] whitespace-nowrap flex-shrink-0"
            style={{ background: "#2563EB" }}
          >
            Open Claude →
          </a>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Yours to keep — run it in Lumi or in your own tab. No signup for the
            prompt.
          </p>
        </div>
      </section>

      {/* Output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="enquiry in · reply out"
          title="What comes back."
          description="First-pass output from the input above. Read it once, check the two slots are still free, send."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · portal reply
          </div>
          <pre className="mt-3 text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
{EXAMPLE_OUTPUT}
          </pre>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-[12px] text-slate-600">
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                answered first
              </div>
              <div>&ldquo;Yes, still available&rdquo;</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                unasked fact
              </div>
              <div>vacant — viewable any day</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                one question
              </div>
              <div>live in it, or let it out?</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guardrail */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the one rule that matters"
          title="Draft automatically. Send manually."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Everything above is safe because a person reads the message before
            it goes out. Auto-sending a first reply is a different product with
            a different risk profile: the one enquiry in fifty that is a
            complaint, a solicitor, or a client you already know gets answered
            by a template, and you find out afterwards.
          </p>
          <p>
            Approval takes about four seconds and removes that entire class of
            failure. Keep the drafting automatic and the send manual, and the
            worst case stays &ldquo;I edited a sentence before sending&rdquo;
            rather than something you have to apologise for.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the first-reply draft"
          headlinePrimary="Writing the reply is four minutes."
          headlineAccent="Having it already written is one tap."
        />
      </div>

      {/* Footnote */}
      <PackFootnote
        keyword="FAST"
        origin={
          <>
            Speed-to-lead research comes from outside real estate — the
            Lead Response Management study (Oldroyd et al.) and HBR&apos;s
            2011 follow-up on response windows. Our slice: what the first
            message should actually say once you have won the race.
          </>
        }
      />
    </div>
  );
}
