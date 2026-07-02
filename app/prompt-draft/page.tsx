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
    "Voice note → 3 follow-up drafts — the 60-second loop top agents run before they reach the car",
  description:
    "The voice-memo workflow that produces three different message drafts (friendly / professional / urgent) before the agent walks back from a showing. Full guide + Claude prompt + tone-selection rules.",
  openGraph: {
    title: "Voice note → 3 follow-up drafts in 60 seconds",
    description:
      "Speak after a showing. AI returns 3 ready messages in your voice — friendly, professional, urgent. Pick one. Done.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice note → 3 follow-up drafts.",
    description: "60 seconds of speaking. 3 ready messages. Walk to the car informed.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-draft" },
};

const DRAFT_PROMPT = `You are a real-estate agent's follow-up drafter.

INPUT
A voice-memo transcript (10-90 seconds) recorded
by the agent immediately after a showing or
client conversation. Plus the client's brief
(7-field structured data).

OUTPUT
Three message drafts — exactly three, no more,
no fewer — returned in this format:

  --- friendly ---
  [draft text]

  --- professional ---
  [draft text]

  --- urgent ---
  [draft text]

Each draft is for the SAME upcoming send to the
SAME client. The agent picks one. They differ
in tone, not content.

TONE DEFINITIONS

  friendly
    - 2-3 sentences
    - first-name, no honorific
    - one specific reference to the showing
    - casual sign-off ("— A.", "— Andre")
    - default channel: WhatsApp / SMS

  professional
    - 3-4 sentences
    - full name on first reference, first
      name on close
    - one specific reference + one structured
      next-step with date
    - measured sign-off ("Best, Andre")
    - default channel: email

  urgent
    - 2 sentences
    - names a specific deadline or window
    - one yes/no question with a 24h response
      cue
    - same channel as last contact (continuity)

RULES (non-negotiable for ALL three tones)
1. NEVER fabricate a fact not in the brief or
   the voice memo. If the agent didn't say it,
   the message can't reference it.
2. Every draft references at least ONE soft
   signal verbatim from the brief. Not
   paraphrased.
3. Every draft ends with a concrete next step
   that has a date or time, not "let me know".
4. Match agent.language. Localise greetings,
   sign-offs, calendar formats.
5. NO emoji in any tone. NO exclamation
   marks except mid-sentence ("call!" only
   if quoting somebody).
6. Honor channel conventions: SMS no subject
   line; email always has a subject.

ANTI-PATTERNS (never produce these)
- "Hope you're doing well"
- "I wanted to follow up"
- "Just touching base"
- "Looking forward to hearing from you"
- Any agency-promotional sign-off

Voice: warm, brief, specific. Tone differs
between the three drafts; voice is consistent.`;

const EXAMPLE_VOICE_MEMO = `Just finished with Sofia and Carlos at Rua da
Prata. Sofia loved the kitchen window — said
"this is where I'd make coffee." The stairs
killed it though, twins concern. Carlos asked
about HOA. I promised them two ground-floor
options with balconies by Thursday. Need to
send the follow-up tonight.`;

const EXAMPLE_OUTPUT = `--- friendly ---
Sofia — quick one. The kitchen window at Rua
da Prata is going to be the standard now,
fairly. I've got two ground-floor + balcony
options pulling together for Thursday — both
in Lapa, both within 10 min walk of the same
café we ended up at. — A.

--- professional ---
Hi Sofia,

Thanks for taking the time at Rua da Prata
yesterday. Noted Carlos's HOA question — I'll
include the figure (280€/mo) in tomorrow's
note. The stairs concern is fair; I have two
ground-floor + balcony options to send
Thursday by 14:00 as discussed.

Best,
Andre

--- urgent ---
Sofia — Saturday 11am viewing slot just
opened on a ground-floor + balcony in Lapa.
Same Estoril-train walking distance.
Want me to lock it before someone else does?`;

const TONE_RATIONALE: { tone: string; when: string; why: string }[] = [
  {
    tone: "Friendly",
    when: "Default for WhatsApp/SMS to clients you have an existing rapport with. Most post-showing follow-ups, most check-ins after a casual touch.",
    why: "Friendly tone signals continuity of relationship. The recipient reads it as a message from someone they already know, not a formal communication — which means it gets opened and replied to faster.",
  },
  {
    tone: "Professional",
    when: "Default for email, especially when there's a structured next-step or a financial detail (HOA, bank pre-approval, valuation). Also default for new-client first contact.",
    why: "Professional tone signals competence and creates a paper trail. The recipient files it differently from a casual message — they're more likely to forward it to a spouse, a lender, or an attorney for review.",
  },
  {
    tone: "Urgent",
    when: "When a window is closing — viewing slot, offer deadline, lender response window. Use sparingly; the urgent tone burns out if used more than ~once per client per month.",
    why: "Urgent tone forces prioritisation. The recipient understands the message is time-sensitive and replies within hours instead of days. Overuse and they stop trusting it; underuse and you lose deals to slower communication.",
  },
];

const PROTOCOL_STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Voice memo, 60-90 seconds, in the agent's voice.",
    body: "Speak naturally as if telling a colleague what just happened. Don't try to structure — the AI will. Cover: what happened, what they cared about, what you committed to next.",
  },
  {
    n: "02",
    title: "Whisper transcribes; brief is auto-attached.",
    body: "The brief for this client (7-field YAML) is pulled from the CRM and prepended to the prompt automatically. The model sees both the new memo and the existing context.",
  },
  {
    n: "03",
    title: "Three drafts return in 6-8 seconds.",
    body: "Friendly, professional, urgent. Same content, three tones. The agent reads, picks one, taps to send — or taps to edit. Total elapsed time from memo end to message ready: under 30 seconds.",
  },
  {
    n: "04",
    title: "Send. Brief auto-updates with last_touch.",
    body: "Whatever was sent gets logged as last_touch in the CRM with timestamp, channel, and outcome. The next reactivation message — if needed — will know exactly where things were left.",
  },
];

const COMMON_FAILURES: { title: string; body: string }[] = [
  {
    title: "Trying to write the message instead of speaking the memo.",
    body: "The whole protocol depends on voice in. If you're typing the memo, you're already structuring — and the structure leaks soft signals. Speak the memo, even if you feel awkward. The transcription is what powers the tone variations.",
  },
  {
    title: "Always picking the friendly draft.",
    body: "If you're using friendly for every send, you're missing the urgency lever when you actually need it. The protocol works because the three tones are reserved for three contexts. Default-friendly is fine; never-urgent is a leak.",
  },
  {
    title: "Editing all three drafts before deciding.",
    body: "The point of three drafts is fast selection, not editorial review. Read all three, pick one, edit only that one. Spending 5 minutes editing each draft defeats the 30-second loop.",
  },
  {
    title: "Sending without the brief auto-update.",
    body: "If your tooling doesn't write last_touch back to the CRM after send, you've broken the next step in the chain. The 7-day silent buyer reactivation depends on knowing exactly when last_touch happened.",
  },
];

export default function PromptDraftPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

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
            Voice note in.
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
              Three drafts out.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The follow-up message after a showing is the single highest-leverage
            communication an agent sends — and the one most often delayed because
            sitting down to write it from scratch takes 8-12 minutes. The 60-second
            loop fixes that: speak the memo, get three drafts back in different
            tones, pick one, send. The whole thing fits between the front door of
            the property and the first red light on the drive home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 09 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>three_drafts_v1.txt — example output</span>
              <span className="hidden sm:inline">friendly · professional · urgent</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Same client. Same week. Three tones. Pick the one that fits the
              context — send in 30 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why three tones beat one message.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The instinct when AI started writing follow-up messages was to ask for
            one perfect output and send that. The result was an industry-wide drift
            toward a single safe-middle tone — warm but not casual, brief but not
            urgent, ends with a soft &ldquo;let me know&rdquo;. Recipients learned
            to recognise the shape of an AI follow-up within 6 months and reply
            rates dropped accordingly.
          </p>
          <p>
            Asking for three drafts in different tones forces the model to commit
            to actual tonal choices — the friendly draft has to be friendly enough
            that the professional one feels different. The agent reads all three,
            picks the one that fits the moment, and the message lands as
            intentional rather than templated. The same brief, the same memo,
            three messages — and the agent picks based on context the model
            doesn&apos;t have access to (mood of the showing, recent text-thread
            tone, whether the spouse just texted in).
          </p>
          <p>
            The deeper benefit: the three-draft format reveals what the AI is
            actually doing. When the friendly draft and the professional draft
            differ only in punctuation, the model is being lazy and you can
            re-prompt. When they differ in word choice, sentence length, and call
            to action, you know the model has the brief well enough to vary
            output meaningfully.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;One AI draft regresses to the safe middle. Three forces the
            model to commit — and gives you the lever.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the loop"
          title="Four steps. Sixty seconds."
          description="The whole loop fits between the property's front door and the first red light on the drive back. Practiced agents don't think about it — they just speak the memo and the rest happens."
        />

        <ol className="mt-10 space-y-5">
          {PROTOCOL_STEPS.map((s) => (
            <li
              key={s.n}
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

      {/* Tone rationale */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="three tones · three jobs"
          title="When each draft wins."
          description="The three tones aren't synonyms — they map to three different communication contexts. Default-friendly is fine; never-urgent is a leak."
        />

        <div className="mt-8 space-y-4">
          {TONE_RATIONALE.map((t) => (
            <div
              key={t.tone}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                {t.tone}
              </h3>
              <p className="mt-3 text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                <span className="text-[10px] uppercase tracking-[0.18em] font-mono font-semibold text-indigo-600 mr-2">
                  when
                </span>
                {t.when}
              </p>
              <p className="mt-2 text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                <span className="text-[10px] uppercase tracking-[0.18em] font-mono font-semibold text-violet-600 mr-2">
                  why it works
                </span>
                {t.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Worked example */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="worked example"
          title="Voice memo in. Three drafts out."
          description="A real-feeling 60-second memo on the left. AI's three drafts on the right. No editing applied — first-pass output."
        />

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-100 p-5 sm:p-6 ring-1 ring-slate-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-mono font-semibold">
              voice memo · transcribed
            </div>
            <p className="mt-3 text-[14px] text-slate-800 leading-relaxed">
              {EXAMPLE_VOICE_MEMO}
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-5 sm:p-6 ring-1 ring-violet-200">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
                three drafts · ai-generated
              </div>
              <CopyButton text={EXAMPLE_OUTPUT} label="Copy drafts" />
            </div>
            <pre className="mt-3 text-[12px] leading-relaxed font-mono text-slate-800 whitespace-pre overflow-x-auto">
{EXAMPLE_OUTPUT}
            </pre>
          </div>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes them"
          title="What to feed Claude."
          description="The system prompt that turns voice memo + brief into three tonal variants. Tested against Claude Haiku — generates all three in 6-8 seconds at $0.0008/triplet."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">three_drafts_system_prompt.md</span>
            <CopyButton text={DRAFT_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{DRAFT_PROMPT}
          </pre>
        </div>
      </section>

      {/* Common failures */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four ways the loop breaks"
          title="The failure modes."
          description="Each one is the result of treating the loop as a writing tool instead of a decision tool. The fix is to remember why three drafts beat one."
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
          workflowName="the 60-second three-drafts loop"
          headlinePrimary="Speaking the memo is step one."
          headlineAccent="Picking the right tone is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="DRAFT"
        origin={
          <>
            A real-estate adaptation of the voice-first multi-variant
            follow-up pattern from operator communities — returning multiple
            drafts forces the model out of the safe middle. Our slice: 3
            tones (friendly / professional / urgent), drafted before the
            agent walks back to the car.
          </>
        }
      />
    </div>
  );
}
