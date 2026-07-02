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
    "Claude on the call — the live sidekick that catches objections in tone",
  description:
    "How real-estate agents use a live AI co-pilot during phone calls to detect objection patterns 8-12 seconds before the agent does. The 5 patterns, the privacy stack, and the prompt that whispers a rebuttal.",
  openGraph: {
    title: "Claude on the call — live objection detection",
    description:
      "Live transcript → pattern detection → 2-3 phrasings whispered to the agent. The 5 objection patterns AI catches faster than humans.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude on the call — live sidekick",
    description:
      "Live AI catches objections 8-12s before you do. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-objection" },
};

const OBJECTION_PROMPT = `You are a senior real-estate agent's
live call co-pilot.

INPUT
Streaming Whisper transcript of an active
phone call (chunks of 8-12 seconds), the
agent's existing brief on this client, and
the agent's own prior objection-handling
samples (2-3 examples of how this agent
typically responds to common objections).

OUTPUT
Per chunk, decide: SILENT, ALERT, or SUGGEST.

SILENT — no objection pattern detected.
         Return nothing. Most chunks land
         here.

ALERT — an objection pattern is forming
        but the client hasn't fully voiced
        it yet. Return a 4-word tag:
        e.g. "price · spouse · timing".
        The agent sees the tag in their
        peripheral vision and adjusts.

SUGGEST — the objection has crystallised.
          Return 2 short rebuttals (each
          ≤14 words) in the agent's voice,
          tagged by tone:
          - softer (acknowledge + reframe)
          - direct (data + close)
          The agent picks tone in the next
          breath.

RULES (non-negotiable)
1. Latency budget: under 1.5 seconds from
   chunk arrival to suggestion display.
   This means Haiku, structured output,
   no chain-of-thought tokens in response.
2. Suggestions match the agent's voice
   samples — sentence rhythm, vocabulary,
   typical sentence length.
3. Never escalate. If the client is
   getting heated, suggestions soften.
   No tactical pressure tactics.
4. Detect 5 patterns specifically: price,
   timing, spouse, market-fear, agent-trust.
   Other objections fall to SILENT.
5. The agent always picks. AI suggests;
   the agent speaks the words.

ANTI-PATTERNS (never produce these)
- Multi-sentence rebuttals (the agent has
  no time to read them mid-call)
- Generic scripts ("I understand how you
  feel, others have felt the same way…")
- Suggestions that contradict the agent's
  prior phrasings
- Anything that sounds like a sales-script
  (the client can hear scripts in tone)

The agent should glance at the suggestion
in 0.4 seconds, choose tone, speak.`;

const EXAMPLE_INPUT = `# ── live transcript chunk (12.3s) ──────────────
chunk_id:        "c_0048"
audio_offset:    "00:14:22 → 00:14:34"
speaker:         "client (Hugo Almeida)"
transcript:      "Look, I just don't think
                  €825 is realistic for this
                  area right now. We've seen
                  three similar listings drop
                  by 5-7% in the last month."

context_brief:
  client:        "Hugo · Cascais buyer"
  budget_range:  "€700-820k"
  showing_count: 4
  prior_signals: "anchor on data, decision-
                 group includes wife"

agent_voice_samples:
  - "Fair point — but the comp pulls I'd
     pull would tell a different story.
     Want me to send the deck?"
  - "It's tight, agreed. But the fixed
     price gives you certainty no comp
     can. Move now or wait for the dip?"
  - "Three drops in a month is real. Two
     of those were on dated stock. Show
     me the third and we'll talk."
`;

const EXAMPLE_OUTPUT = `decision: SUGGEST
tags:     [price, market-fear]

suggestions:
  softer:
    "Three drops is real — show me the
     third and we'll calibrate. Send the
     listings?"

  direct:
    "Two of those drops were dated stock.
     This isn't the same market. Want the
     comp pull?"

agent_picks_tone_in_next_breath`;

const PATTERNS: { pattern: string; what: string; signal: string }[] = [
  {
    pattern: "price",
    what: "Direct or oblique pushback on the asking — a reference to comparables, a budget framing, or 'realistic' as a hedge word.",
    signal: "Words: realistic, fair, comp, market, drop, overpriced. Or numbers cited from external sources.",
  },
  {
    pattern: "timing",
    what: "Hesitation about decision speed — wanting to see more, wait for the right moment, or compress the timeline.",
    signal: "Phrases: not yet, want to see, give it some time, in a rush, before [event]. Often a stalling signal in disguise.",
  },
  {
    pattern: "spouse",
    what: "Decision deferred to a partner — implicit ('I need to talk to her') or explicit ('she hasn't seen it yet').",
    signal: "Pronouns: she, he, my wife, my husband. Or pause-then-deferral pattern. Highest-conversion-impact pattern.",
  },
  {
    pattern: "market-fear",
    what: "Concern about the broader market — not the property itself, but the timing of buying anything.",
    signal: "Phrases: bubble, correction, going down, news article, my friend said. AI catches these from tone-shift, not just words.",
  },
  {
    pattern: "agent-trust",
    what: "Soft signal that the client is questioning the agent's recommendations — usually after seeing a comparable elsewhere.",
    signal: "Phrases: another agent, friend who, on the internet. Tone shift to skeptical. Most missed pattern by humans.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Two-party-consent disclosure is the only legal foundation.",
    body: "Same as the call-log protocol — every jurisdiction requires the client to know the call is being recorded. The disclosure is a 4-second pre-roll: 'this call is recorded and I'm using AI to help with notes — let me know if you'd rather not'. Most clients say 'sure, fine'. The 1-2% who decline get the agent's full attention without the AI; their conversion doesn't suffer measurably.",
  },
  {
    n: "02",
    title: "Streaming Whisper, not file-batch Whisper.",
    body: "The whole point is real-time, so the transcription must stream. OpenAI's Realtime API or AssemblyAI's streaming endpoint produce 8-12 second chunks with ~1.2-second latency. File-batch Whisper at end-of-call defeats the protocol — you'd be reading suggestions for an objection that's already passed.",
  },
  {
    n: "03",
    title: "Haiku for latency. Sonnet only for end-of-call summary.",
    body: "Each chunk → Haiku call with structured output. Total latency budget: 1.5s from chunk arrival to suggestion display. Sonnet adds 0.6-0.9s and the agent doesn't have that budget mid-call. Use Sonnet only for the post-call summary (the call-log protocol). For live, Haiku's worse classification is still better than no classification — the agent fills in the gap.",
  },
  {
    n: "04",
    title: "Display in peripheral vision. Never in the agent's reading focus.",
    body: "The suggestion shows on a side-monitor or a small phone-screen overlay — somewhere the agent can glance at in 0.4 seconds and return to the client's eyes. Center-of-screen displays make the agent break eye contact, which the client hears in the silence. Peripheral display is the only display that doesn't leak the AI's presence.",
  },
  {
    n: "05",
    title: "The agent picks tone. Always. No auto-fire.",
    body: "Two suggestions per SUGGEST event, tagged softer/direct. The agent reads both in 0.4s and speaks one in their voice — never reading verbatim, always paraphrasing. This is the line that protects the relationship: the AI is a sidekick, not a teleprompter. The moment a client hears a script, the trust collapses.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the script-leak",
    body: "softer: 'I understand how you feel, Hugo. Other clients have felt the same way, but they found that...'",
    why: "Three things wrong: 1) the 'feel-felt-found' formula is recognisable as a sales script and breaks rapport. 2) Multi-sentence — agent has no time mid-call. 3) Doesn't address the actual objection (market drops). Generic scripts fail every test the protocol enforces.",
  },
  {
    label: "the over-helpful",
    body: "softer: 'Let me share three data points: comp listing X went under contract for €820 last month, the area's median price-per-sqm is up 4% YoY, and the building has had two recent renovations that justify the premium. Would you like me to walk through any of these?'",
    why: "Useful information; impossible to deliver mid-call. The agent can't read this in 0.4s. By the time they finish reading it, the client has spoken twice more. Suggestions must be ≤14 words for the protocol to work at all.",
  },
  {
    label: "the contradiction",
    body: "softer: 'You're right, the price is high — let's see if we can negotiate.'",
    why: "Contradicts the agent's actual position (they're representing the seller or have committed to the listing price with the buyer). Worse: gives the client an unintended concession the agent didn't authorise. The protocol must respect the agent's prior calibration, not undo it.",
  },
];

export default function PromptObjectionPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

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
            Claude on the call.
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
              He saved the deal at minute 14.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Some objections form 8-12 seconds before they crystallise. The
            client&apos;s tone shifts; their phrasing slows; they hedge before
            the actual pushback lands. Humans are bad at catching this in real
            time — too busy listening to the words. AI watching the streaming
            transcript catches the formation, suggests two phrasings, and
            lets the agent walk into the objection with an answer ready.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 11 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>live · 14:22 · price + market-fear detected</span>
              <span className="hidden sm:inline">latency: 1.2s</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`client (just said):
  "I just don't think €825 is realistic for
   this area right now. We've seen three
   similar listings drop 5-7% last month."

claude suggests (peripheral display):
  softer:
    "Three drops is real — show me the third
     and we'll calibrate."
  direct:
    "Two of those were dated stock. Want
     the comp pull?"`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Two suggestions. Each ≤14 words. The agent picks tone in their
              next breath, speaks in their voice — the client never hears the
              AI.
            </p>
          </div>
        </div>
      </section>

      {/* The 5 patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the five patterns"
          title="What the co-pilot watches for."
          description="Five objection patterns that have measurable behavioural fingerprints in voice and tone — and that humans miss faster than AI does. Other objections fall to SILENT and the agent handles them as normal."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>pattern</div>
            <div className="hidden sm:block">what it captures</div>
            <div className="hidden sm:block">tone signal</div>
          </div>
          {PATTERNS.map((p) => (
            <div
              key={p.pattern}
              className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {p.pattern}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {p.what}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium leading-snug">
                {p.what}
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {p.signal}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Sub-1.5-second latency."
          description="The discipline of the live co-pilot. Skip any one and the protocol either breaks the call's rhythm, leaks the AI's presence, or becomes legally exposed."
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

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three suggestion failures that break the call."
          description="Each of these has been produced by a loose prompt and used by a real agent in a live call. Each one was the moment the client felt the AI's presence — and once felt, it can't be un-felt."
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
          title="The chunk input."
          description="What the prompt receives every 8-12 seconds during a call. Voice samples are the prompt's anchor — without them the suggestions land in a generic-AI register that the agent can't speak."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">objection_chunk_input.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy input" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that whispers in your ear"
          title="What to feed Claude."
          description="The system prompt that runs once per chunk. Use Haiku — the latency budget rules out Sonnet. Structured-output mode required for downstream UI."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">objection_system_prompt.md</span>
            <CopyButton text={OBJECTION_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{OBJECTION_PROMPT}
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
                "#1F5738",
            }}
          >
            Open Claude →
          </a>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            For testing offline: paste a 10-minute recorded call transcript
            chunked manually. For live: stream from Realtime API + Haiku.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="chunk in · suggestion out"
          title="What Claude returns."
          description="The peripheral-display format. Two suggestions, tagged by tone, ready for the agent to pick in their next breath."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · live suggestion
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact live-call co-pilot"
          headlinePrimary="Streaming the call is step one."
          headlineAccent="Trusting the peripheral display is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="OBJECTION"
        origin={
          <>
            A real-estate adaptation of the real-time AI co-pilot pattern
            from SaaS sales (Gong, Chorus, Outreach Kaia). Our slice: the 5
            objection patterns that move RE deals — caught 8-12 seconds
            before the human notices.
          </>
        }
      />
    </div>
  );
}
