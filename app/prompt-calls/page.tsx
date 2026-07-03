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
    "I haven't written call notes in 6 months — my CRM is more accurate than ever",
  description:
    "How real-estate agents auto-extract structured CRM updates from every phone call. The 5-field call schema, the Whisper + Claude stack, and the prompt that catches objections in tone the agent missed.",
  openGraph: {
    title: "I haven't written call notes in 6 months",
    description:
      "Phone call → 4-line CRM update with outcome, objections, and soft signals. The 5-field schema + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "I haven't written call notes in 6 months",
    description:
      "Auto-call-log to CRM. Whisper + Claude extract structure that hand-notes miss.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-calls" },
};

const CALLS_PROMPT = `You are a senior real-estate agent's
call-log analyst.

INPUT
You receive: the full Whisper transcript of
a phone call (8-30 minutes typically), the
client's existing CRM brief, and metadata
(call duration, time of day, who initiated).

OUTPUT
A structured object with EXACTLY 5 fields:

  outcome:        <one sentence — what
                   actually happened in this
                   call. Not what was
                   discussed; what changed.>
  next_step:      <one sentence — the
                   specific next action with
                   a date or trigger. Empty
                   if none was committed.>
  objections:     <array of 0-3 strings —
                   each a specific objection
                   raised, with the agent's
                   response if any.>
  decision_group_update:
                  <one sentence — anything
                   new about who's involved
                   in the decision (spouse,
                   parents, partner, lawyer)
                   and their stance.>
  soft_signals:   <array of 0-5 strings —
                   tone shifts, unprompted
                   asides, things mentioned
                   twice, anything that
                   reveals a constraint or
                   preference not in the
                   brief.>

RULES (non-negotiable)
1. Outcome is past tense, factual. Not
   "discussed pricing" — "agreed to revisit
   €820k floor after spouse's reaction".
2. Next step has a date or a trigger.
   "Send the floor plan by Thursday" — not
   "follow up soon".
3. Objections are verbatim themes, not
   inferred. If the client never explicitly
   raised an objection, the array is empty.
4. Soft signals are gold — capture every
   one. The same word said twice is a
   signal. A pause before a number is a
   signal. An unprompted aside about a
   parent or a school is a signal.
5. NEVER include the agent's own commentary
   ("I think this means…"). Only what was
   said and what changed.

ANTI-PATTERNS (never produce these)
- Outcome: "had a great call" / "good
  conversation" — vague, useless.
- Next step: "stay in touch" / "follow up"
- Objections inferred from tone alone
- Multi-paragraph fields — each field is
  one sentence or a short array.

The agent should read the 5 fields in 12
seconds and know exactly where the deal
stands and what to do next.`;

const EXAMPLE_INPUT = `# ── call log input (truncated transcript) ──────
client:           "Marina Costa"
call_duration:    "14m 22s"
initiated_by:     "agent"
time_of_day:      "Tuesday 18:45"

transcript_excerpt:
  AGENT: "Hi Marina, just confirming
   Saturday 11am for the Foz visit?"
  MARINA: "Yes — but I wanted to ask, the
   garden in the listing photos looks
   quite small. Is that representative?"
  AGENT: "It's about 90 square metres —
   the angle in the photos compresses it.
   I'll send a fresh shot."
  MARINA: "Okay. And one more thing — my
   husband couldn't make Saturday, do you
   have anything Sunday?"
  AGENT: "Sunday morning works. 10am?"
  MARINA: "Hmm, can we do 11? He has a
   work call."
  AGENT: "11 Sunday works. I'll move it."
  MARINA: "Actually, before you do — can
   we look at the Cascais one as well
   that day? My mother saw it in the
   feed and she wants me to consider it.
   I think it's beyond budget but…"
  AGENT: "Both Sunday — I'll batch it.
   Cascais at 12:30?"
  MARINA: "Perfect. And about the
   schools — is the kindergarten in Foz
   walking distance? My sister mentioned
   it's a bit further than it looks."
   ... [continues another 11 minutes]
`;

const EXAMPLE_OUTPUT = `outcome:
  Marina rescheduled Saturday viewing to Sunday
  11am to include husband, added a Cascais
  property at her mother's suggestion.

next_step:
  Send fresh garden photo of Foz property
  before Wednesday EOD; confirm both Sunday
  viewings (Foz 11am, Cascais 12:30) by
  Thursday.

objections:
  - "Garden looks small in photos" → reassured
    with 90m² figure, fresh photo committed.
  - "Cascais property likely beyond budget"
    raised by client herself — not yet
    addressed; needs price-position before
    Sunday.

decision_group_update:
  Husband is on the viewing path — must be
  present for major decisions (Sunday 11
  needed because of his work call). Mother
  is influencing list (suggested Cascais).
  Sister mentioned as a local-market voice
  (kindergarten walking distance).

soft_signals:
  - Mentioned schools/kindergarten unprompted
    twice (Foz). Family-stage planning more
    advanced than form indicated.
  - "Beyond budget but…" — suggests price
    flexibility if right property; don't
    discount Cascais on price alone.
  - Voice softer/slower on garden question —
    likely a hard constraint, not a casual
    ask.
  - Husband framed as decision co-equal, not
    courtesy invite — viewings without him
    will not produce decisions.`;

const SCHEMA_FIELDS: { field: string; what: string; matters: string }[] = [
  {
    field: "outcome",
    what: "What changed in the deal during this call.",
    matters: "Most agents leave this vague (\"good call\"). Specificity here is what makes the brief actionable a week later when memory has faded.",
  },
  {
    field: "next_step",
    what: "Concrete action + date or trigger.",
    matters: "If you can't write the next step in one sentence with a date, the call didn't actually advance the deal. The discipline of capturing this exposes calls that felt productive but weren't.",
  },
  {
    field: "objections",
    what: "Specific concerns raised by the client.",
    matters: "Every unhandled objection is a friction point that will resurface. Logging them puts a debt on the books — the next call has to address them or the deal stalls.",
  },
  {
    field: "decision_group_update",
    what: "Who else is involved + their stance.",
    matters: "Real-estate decisions involve 2-4 people on average (spouse, parents, lawyer, advisor). Tracking each is the difference between selling to one buyer and selling to a household.",
  },
  {
    field: "soft_signals",
    what: "Tone shifts, repeated mentions, unprompted asides.",
    matters: "The hardest field to capture manually — and the highest-value. A word said twice unprompted is a signal. A pause before a number is a signal. AI catches these reliably; humans miss most.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Recording is consented and routed within the legal stack.",
    body: "Two-party-consent jurisdictions (most of EU, parts of LatAm) require an audible disclosure at call start — \"this call is recorded for our notes\" — and an opt-out path. The protocol's first action is enforcing this disclosure: a 4-second pre-roll the agent's softphone or call-recording stack must include. Skip this step and the whole pipeline is illegal in the agent's jurisdiction.",
  },
  {
    n: "02",
    title: "Whisper transcribes — locally or via API — within 30 seconds of hangup.",
    body: "A 14-minute call transcribes in ~25 seconds via Whisper API ($0.0025/call). For privacy-strict practices, local Whisper.cpp on a Mac mini does it in ~90 seconds. Either way: by the time the agent has walked back to their desk, the transcript exists. Do not let the queue back up — async transcripts that surface 4 hours later get ignored.",
  },
  {
    n: "03",
    title: "Claude extracts the 5 fields in one structured-output call.",
    body: "Single Claude call: transcript + existing CRM brief + metadata in. JSON object with the 5 fields out. Use Sonnet — Haiku misses subtler soft signals, and the cost difference ($0.012 vs $0.003 per call) is irrelevant against the value of the soft signals captured. Strict JSON-mode for tooling.",
  },
  {
    n: "04",
    title: "Updates merge into the CRM. Soft signals append, never overwrite.",
    body: "The brief is mutable for outcome and next_step (newest call wins). Objections, decision_group_update, and especially soft_signals append rather than replace — the goal is a growing, layered understanding of the client across all calls, not a snapshot of the latest one. Old soft signals fade in the UI after 6 months, but they're never deleted.",
  },
  {
    n: "05",
    title: "The agent reviews the 5 fields, never the transcript.",
    body: "The whole point: the transcript is for the AI; the 5 fields are for the agent. Storing the full transcript is fine for compliance, but the agent's UI shows only the structured update. Auditing the transcript word-by-word defeats the time saving — and after 4 weeks of accuracy verification, agents stop bothering. Trust the schema.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the vague",
    body: "outcome: Had a productive call about the Foz property, discussed scheduling and family considerations.",
    why: "\"Productive\" and \"discussed\" tell you nothing. A week later this is useless. The whole point of the schema is to force specificity that survives memory decay.",
  },
  {
    label: "the agent's commentary",
    body: "soft_signals: I think Marina is more interested in Cascais than she's letting on. She's probably going to push back on price.",
    why: "Inferred conclusions, not signals. Schema requires factual capture: \"raised Cascais unprompted, framed by mother's suggestion\" — let the agent draw the conclusion when reading. Pre-baked conclusions get trusted too easily and skew judgement.",
  },
  {
    label: "the missed schema",
    body: "summary: Marina wants to see Foz on Sunday now, also Cascais. Husband and mother involved. Concerned about garden size.",
    why: "Collapses everything into one paragraph — exactly the manual note-taking the schema replaces. Without the 5 separate fields, the agent has to re-read and reparse on every glance. The schema is not aesthetic; it's load-reducing.",
  },
];

export default function PromptCallsPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

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
            I haven&apos;t written call notes
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
              in six months. CRM is sharper than ever.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Hand-written call notes are a lossy compression algorithm — agents
            capture maybe 30% of what mattered in a 14-minute call, and the
            soft signals (tone shifts, repeated unprompted mentions) get
            dropped first because they&apos;re hardest to write down. The
            agents who&apos;ve handed this to AI aren&apos;t losing accuracy.
            They&apos;re gaining the 70% of signal hand-notes never captured.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 06 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>marina_call_2026-04-23.log</span>
              <span className="hidden sm:inline">14m 22s · 4 soft signals</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`outcome:    Sunday batched — Foz 11 + Cascais 12:30
            (was Saturday solo Foz; husband added)
next_step:  Send fresh garden photo by Wed EOD
objections: 2 unhandled (Cascais price, garden size)
group:      husband co-equal · mother + sister
            influencing
soft signals (4):
  · schools/kindergarten unprompted ×2
  · price flexibility hinted ("but…")
  · garden = hard constraint (slower voice)
  · husband decision-co-equal, not invitee`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Five fields. Twelve seconds to read. Four soft signals that
              would have died with the call if a human were taking notes.
            </p>
          </div>
        </div>
      </section>

      {/* The 5-field schema */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the schema"
          title="Five fields. No prose. No paragraphs."
          description="The schema is the contract between Claude and the agent. Each field is constrained to one sentence or a short array — that constraint is what makes the brief readable in 12 seconds, not 12 minutes."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>field</div>
            <div className="hidden sm:block">what it captures</div>
            <div className="hidden sm:block">why it matters</div>
          </div>
          {SCHEMA_FIELDS.map((s) => (
            <div
              key={s.field}
              className="grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {s.field}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {s.what}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium leading-snug">
                {s.what}
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {s.matters}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five steps. Hangup to CRM in 90 seconds."
          description="The end-to-end pipeline from the moment the call ends to the moment the structured brief lives in the CRM. Each step has a fixed latency budget; the agent is never on the critical path."
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
          title="Three failure modes the schema rejects."
          description="Without strict prompt rules, Claude regresses toward conversational prose. Each of these would pass a casual review — and each one breaks the 12-second readability that justifies the schema."
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
              <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
{ex.body}
              </pre>
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
          title="The transcript input."
          description="A real (anonymised) excerpt of a 14-minute call transcript. The full transcript is ~3,000 words; this excerpt shows the dense first 90 seconds where most of the deal-moving action happens."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">call_transcript.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy transcript" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that extracts the 5 fields"
          title="What to feed Claude."
          description="The system prompt that turns a Whisper transcript into the structured CRM update. Use Sonnet for soft-signal nuance — Haiku misses tone-shifts and repeated unprompted mentions."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">calls_system_prompt.md</span>
            <CopyButton text={CALLS_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{CALLS_PROMPT}
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
            Pipe Whisper transcripts in immediately after each call. Use
            structured-output JSON-mode for downstream tooling.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="transcript in · 5 fields out"
          title="What Claude returns."
          description="The structured object that lands in the CRM. Notice the soft_signals array — four signals captured from a single 14-minute call, three of which a human note-taker would have lost."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · structured call brief
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the recording"
          title="Two-party-consent matters more than the AI."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The legal exposure of this protocol is not the AI extraction. It&apos;s
            the recording. Most of the EU (Germany, France, Italy, Spain,
            Portugal, plus all GDPR-covered jurisdictions) requires explicit
            two-party consent before recording. The disclosure must be audible,
            comprehensible, and given before substantive content. The
            opt-out — &ldquo;please don&apos;t record this call&rdquo; — must
            actually disable the recording.
          </p>
          <p>
            LatAm and MENA are mixed. UAE, Saudi Arabia, and several LatAm
            jurisdictions are one-party (the agent recording their own call
            is sufficient consent), but the safer default everywhere is
            two-party. Configure your softphone or call-recording stack to
            insert a disclosure pre-roll automatically; don&apos;t rely on the
            agent to remember.
          </p>
          <p>
            On data residency: keep transcripts and structured briefs in the
            same jurisdiction as the client&apos;s residence where possible.
            EU clients → EU-region S3 / Vertex / Anthropic EU endpoints. The
            $0.0025/call cost saving from cheaper US-region inference is not
            worth the GDPR headache.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 5-field call-log schema"
          headlinePrimary="Recording the call is step one."
          headlineAccent="Trusting the schema is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="CALLS"
        origin={
          <>
            A real-estate adaptation of the structured-output extraction
            pattern (Whisper for transcription + an LLM with a strict schema)
            that has reshaped sales CRM. Our slice: the 5-field call brief
            that captures soft signals manual notes drop first.
          </>
        }
      />
    </div>
  );
}
