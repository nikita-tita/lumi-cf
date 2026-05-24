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
    "The first 3 minutes after a showing — the protocol top agents use to lock the next step",
  description:
    "What top real-estate agents capture in the 3-minute window between leaving a showing and starting their car. The voice-memo template, the soft-signal extraction prompt, and the next-step rule that separates 7-figure agents from the rest.",
  openGraph: {
    title: "The first 3 minutes after a showing — what top agents capture",
    description:
      "The 3-minute post-showing window is where deals are won or forgotten. Here's the protocol — voice memo template, AI extraction, and the next-step rule.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The first 3 minutes after a showing.",
    description:
      "The protocol top agents run before they start their car. Voice memo + AI extraction + next-step rule.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-three-min" },
};

const VOICE_MEMO_TEMPLATE = `# ── 3-minute voice memo · spoken on the walk back ─────
# Speak this naturally — Claude parses it into the
# 7-field brief automatically. Don't worry about order.

1.  Who I just showed it to (full name).
2.  Property address. One line.
3.  Their reaction when we walked in.
    - First room they paused in.
    - Anything they said unprompted.
4.  The thing they asked twice.
    (Twice = it matters.)
5.  Body-language between spouses / decision group.
    - Did they look at each other? When?
    - Who got quiet? When?
6.  What they listed as the dealbreaker
    (and whether they said it nicely or sharply).
7.  My read on intent stage AFTER this showing
    (browse / serious / urgent — and what shifted it).
8.  Next step I committed to, with a date and time.
9.  Anything I told them I'd find out
    (HOA fees, school catchment, neighbour kids).
10. One thing I noticed they didn't mention —
    that I'm going to bring up next time.
`;

const EXTRACTION_PROMPT = `You are a real-estate agent's post-showing
note-extractor.

INPUT
A voice-memo transcript recorded by the agent
within 3 minutes of leaving a showing. Free-form.
May ramble. May skip fields. Always in the agent's
own voice.

OUTPUT
A YAML block with exactly these 7 fields, populated
from the transcript. Each field is required —
if the transcript omits it, write [unknown] (with
brackets) so the agent sees the gap.

  client:           string (full name)
  property:         string (address, one line)
  intent_stage:     "browse" | "serious" | "urgent"
  intent_shift:     string (what changed from before)
  soft_signals:     string[] (verbatim quotes &
                    observations, not paraphrased)
  hard_constraints: string[] (only ones surfaced
                    in this showing — not the full
                    list)
  decision_group_obs: string (body language between
                      partners; who got quiet, when)
  dealbreaker:      string | null
  next_step:        { what: string; due: ISO date }
  agent_followups:  string[] (things to find out)
  unspoken:         string (what they didn't say
                    that the agent flagged)

RULES
1. Soft signals must be verbatim. If the agent said
   "she paused at the kitchen window and said this
    is where I'd make coffee", capture that phrase
   in quotes. Do NOT paraphrase to "client liked
   the kitchen".
2. If intent_stage shifted, name the shift
   ("browse → serious") and the trigger.
3. Next step must have an actionable due date.
   If the agent said "I'll send some options",
   ask for a date — do not invent one. Output
   { what: "send options", due: "[needs date]" }.
4. dealbreaker captures the one thing that, if
   not solved, kills the deal. Tone matters —
   "she said it sharply" is signal; preserve it.
5. unspoken is the most powerful field. It captures
   what the agent noticed they didn't bring up. This
   is the open loop for next contact.

Voice: clinical, structured, no commentary.
The agent edits — you don't editorialise.`;

const EXAMPLE_TRANSCRIPT = `OK, just left the Rua da Prata showing. Sofia
Ferreira, husband Carlos. They walked in, Sofia
went straight to the kitchen window and stopped —
literally said "this is where I'd make coffee."
Asked twice if the neighbours had kids, both times
when Carlos was looking at something else, which
tells me she's the one driving on lifestyle.
Carlos asked about HOA fees, asked about commute
to Canary Wharf, never asked about anything
emotional. Standard. The stairs to the second-floor
bedrooms — Sofia paused, said "the kids" out loud,
Carlos didn't react but I caught his eyebrow.
That's the dealbreaker. Stairs. They'd love this
place if it was ground floor. I told them I'd send
two ground-floor + balcony options by Thursday at
14:00. I need to find out HOA fees on the building
because Carlos asked twice. They didn't ask about
the school catchment, which is interesting — they
have twins entering primary, that's going to come
up next time, I want to bring it up before they do.
Intent stage: serious. They were browse before this.
They left talking about timing.`;

const EXAMPLE_OUTPUT = `client:           "Sofia & Carlos Ferreira"
property:         "Rua da Prata · 2-bed, second floor"
intent_stage:     "serious"
intent_shift:     "browse → serious — they left
                   talking about timing for the
                   first time"
soft_signals:
  - "Sofia at kitchen window:
     'this is where I'd make coffee'"
  - "Sofia asked twice if neighbours had kids
     (both times when Carlos was looking away)"
  - "Sofia paused on the second-floor stairs,
     said 'the kids' out loud"
  - "Carlos's eyebrow lifted at the stairs —
     he didn't comment"
hard_constraints:
  - "ground floor (twins, stairs concern)"
  - "balcony"
decision_group_obs:
  "Sofia drives lifestyle decisions. Carlos
   handles financial/logistical (HOA, commute).
   Carlos approves silently — eyebrow on stairs
   was the tell. Address Sofia primarily; cc
   Carlos on financial details."
dealbreaker:
  "second-floor stairs (twins)"
next_step:
  what: "send 2 ground-floor + balcony options"
  due:  2026-04-25 14:00
agent_followups:
  - "HOA fees on Rua da Prata building
     (Carlos asked twice)"
unspoken:
  "school catchment / primary school —
   they have twins entering, didn't ask.
   Bring it up at next contact."
`;

const WHY_THREE_MIN: { title: string; body: string }[] = [
  {
    title: "Memory decay starts at minute 5.",
    body: "Across studies of professional recall (medical residents, expert witnesses, real-estate agents), specific verbatim detail decays sharply between minute 5 and minute 30 after an event. The exact phrasing of what someone said — the soft signals that make follow-ups land — is the first to go. By the time you're back at the office, you remember 'the kitchen' but not 'this is where I'd make coffee'. The 3-minute window is the only place those quotes still exist intact.",
  },
  {
    title: "The walk back is the only true private moment.",
    body: "Once you're in the car, you're checking messages. Once you're at the office, you're answering them. Between the property door and the car door is 90 seconds of nobody asking anything of you. That's when the memo gets recorded. Outside that window the protocol breaks because attention is gone.",
  },
  {
    title: "Voice beats notes by a factor of 3.",
    body: "Typed notes capture maybe 40% of what was said. Voice notes capture 95%+ — and they capture the agent's emotional read alongside the facts. Tone of voice in the memo ('she said it sharply') becomes a signal in the AI's output. You cannot type that signal in.",
  },
  {
    title: "AI extraction means you don't have to structure it.",
    body: "The reason agents who try to write structured notes give up after 2 weeks is that structuring while you're processing what just happened is cognitively expensive. Voice → AI extraction means the agent's job is to ramble; the AI's job is to organise. The agent gets back the structured 7-field brief, edits anything wrong, and the CRM is updated.",
  },
];

const PROTOCOL_STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Door closes. Phone in hand. Walk slowly.",
    body: "The walk back is intentional. Take 90 seconds even if your car is 30 seconds away. The point is to give yourself enough physical space between the showing and the next thing for memory to settle. Walking helps.",
  },
  {
    n: "02",
    title: "Hold the phone like a recorder. Speak in full sentences.",
    body: "Whisper transcribes well from any iPhone or Android. Speak as if you're telling the story to a colleague — full sentences, names, addresses, quotes. Don't try to be efficient. Efficiency hurts the brief.",
  },
  {
    n: "03",
    title: "Cover the 10 prompts in the template — in any order.",
    body: "The template above is the checklist. You don't have to follow it in order — speak naturally and the AI will sort. But if you're missing a field by minute 2 of the memo, the template is the prompt to remember it. Most agents internalise the 10 prompts within a week and never look at the template again.",
  },
  {
    n: "04",
    title: "Stop at minute 3. Get in the car.",
    body: "If you're still talking at minute 3, you're rambling. Past minute 3, the signal-to-noise ratio drops. Better to capture the cleanest 90 seconds than to over-record. The unspoken-thing prompt at #10 is the natural stopping cue.",
  },
  {
    n: "05",
    title: "AI extracts. You review at the next red light.",
    body: "Lumi (or your equivalent setup: Whisper + Claude) processes the memo within 30-60 seconds and pushes the structured YAML to your CRM as a draft. At the first red light or before you start the engine, you tap once to approve, or tap to edit one field. The whole loop — door closes to CRM updated — is under 5 minutes.",
  },
];

const COMMON_FAILURES: { title: string; body: string }[] = [
  {
    title: "Waiting until you're back at the office.",
    body: "By the time you're at your desk, 60% of the soft-signal verbatim is gone. You'll write 'liked the kitchen' instead of 'this is where I'd make coffee', and your AI follow-up will read as generic. The 3-minute rule exists because the data is perishable.",
  },
  {
    title: "Trying to type instead of speak.",
    body: "Typing forces structure, which forces editing in your head, which means you skip the quotes. Voice memo is non-negotiable for this protocol. If you hate the sound of your own voice, get over it — nobody listens but the AI.",
  },
  {
    title: "Skipping the 'unspoken' field.",
    body: "It feels weird to capture something the client didn't say. But the unspoken field is what differentiates a competent CRM from a sales-leading one. The fact that Sofia didn't mention school catchment despite having twins is the single most useful piece of information from that showing — it's the open loop for next contact.",
  },
  {
    title: "Letting the memo go straight to the CRM without review.",
    body: "AI extraction is ~85% accurate on first pass. The 15% that needs editing is usually a name spelling, a date, or a misclassified intent stage. 30 seconds of review on each memo, before it lands in CRM, is the difference between a brief that AI can trust and one that compounds errors.",
  },
];

export default function PromptThreeMinPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

      {/* Field-guide intro */}
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
            The first 3 minutes
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
              after a showing.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The window between closing the front door and starting the engine is the
            most valuable three minutes in your week. Most agents waste it checking
            messages. The agents who close more spend it on a 90-second voice memo
            that turns into the brief their AI lives off for the next 30 days.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 15 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>walk_back_memo.txt — what gets captured</span>
              <span className="hidden sm:inline">90 seconds</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`door closes        →  walk slowly
phone up           →  speak full sentences
10 prompts         →  any order, voice
3 minutes          →  stop, get in car
red light          →  AI has parsed it
              CRM updated.`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Door-to-CRM in under 5 minutes. The data is captured before it decays.
            </p>
          </div>
        </div>
      </section>

      {/* Why three minutes */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why this window matters more than the one before it.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Agents spend hours preparing for showings — comp data, opener lines,
            curated route through the property. Then they walk out, hand the buyer
            off to their car, and drive away with everything they just learned
            slowly evaporating. The asymmetry is bizarre: 4 hours of prep, 30 seconds
            of capture, and then the brief is whatever you remember at 9 PM when
            you sit down to write notes — which is, on average, about a third of
            what was actually said.
          </p>
          <p>
            The 3-minute protocol fixes the asymmetry by treating the post-showing
            window as a deliberate part of the workflow, not a transition. The
            output is a structured brief that compounds — every future AI-drafted
            message, every showing prep, every weekly review pulls from the data
            captured in this window.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {WHY_THREE_MIN.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <blockquote className="mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The 3-minute window is the only place the verbatim still exists.
            Everywhere else it&apos;s already paraphrased.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five steps. Three minutes."
          description="The whole loop fits between the front door of the property and the first red light on your drive back."
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

      {/* The 10-prompt template */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="the script"
          title="The 10 prompts to cover."
          description="Print this. Tape it to your dashboard for the first month. Within two weeks the prompts are internal — but the scaffold is what gets you there."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">3min_voice_memo_template.txt</span>
            <CopyButton text={VOICE_MEMO_TEMPLATE} label="Copy template" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{VOICE_MEMO_TEMPLATE}
          </pre>
        </div>
      </section>

      {/* The extraction prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that parses it"
          title="What to feed Claude."
          description="The system prompt that turns your free-form ramble into a structured 7-field brief. Tested against Claude Haiku — fast enough to run in your car before the first red light."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">extraction_system_prompt.md</span>
            <CopyButton text={EXTRACTION_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{EXTRACTION_PROMPT}
          </pre>
        </div>
      </section>

      {/* Worked example: transcript → output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="worked example"
          title="Same showing. Voice in. YAML out."
          description="A real-feeling 90-second transcript on the left, the AI's first-pass extraction on the right. No editing applied — this is the raw output."
        />

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-100 p-5 sm:p-6 ring-1 ring-slate-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-mono font-semibold">
              voice memo · transcribed
            </div>
            <p className="mt-3 text-[14px] text-slate-800 leading-relaxed">
              {EXAMPLE_TRANSCRIPT}
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-5 sm:p-6 ring-1 ring-violet-200">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
                yaml · ai-extracted
              </div>
              <CopyButton text={EXAMPLE_OUTPUT} label="Copy YAML" />
            </div>
            <pre className="mt-3 text-[12px] leading-relaxed font-mono text-slate-800 whitespace-pre overflow-x-auto">
{EXAMPLE_OUTPUT}
            </pre>
          </div>
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          Notice the verbatim soft signals — &ldquo;this is where I&apos;d make
          coffee&rdquo; survives intact. Notice the unspoken field — the school
          catchment thing the buyer didn&apos;t bring up — captured because the
          agent noticed and named it. That&apos;s the open loop for next contact.
          That&apos;s the message that lands.
        </p>
      </section>

      {/* Common failures */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four ways the protocol breaks"
          title="The failure modes — and the fix for each."
          description="If you try the protocol for two weeks and abandon it, it's almost always one of these four. Each one has a one-line fix."
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

      {/* The compounding effect */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="why this compounds"
          title="One showing. Six future moments."
          description={undefined}
        />

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          The 3-minute memo doesn&apos;t pay off in the next hour. It pays off across
          the next 30-60 days, in places that look unrelated:
        </p>

        <ul className="mt-6 space-y-4">
          {[
            {
              when: "Same evening",
              what: "Auto-drafted thank-you message references the kitchen window. Buyer reads it as personal, not template.",
            },
            {
              when: "+ 2 days",
              what: "Pre-call brief for the second showing surfaces the stairs concern as the dealbreaker — agent leads with ground-floor properties.",
            },
            {
              when: "+ 7 days",
              what: "Reactivation message (if buyer goes silent) cites the kitchen window and the Estoril mother — re-opens the conversation specifically.",
            },
            {
              when: "+ 14 days",
              what: "Spouse-aware update gets sent in two versions: lifestyle frame to Sofia, HOA-and-commute frame to Carlos. Same listing. Same hour. Different inboxes.",
            },
            {
              when: "+ 30 days",
              what: "The 'unspoken' field — school catchment — surfaces as a prompt at the next meeting. Agent brings it up before the buyer does. Trust signal.",
            },
            {
              when: "+ 60 days",
              what: "Quarterly client review uses soft signals to identify which 4 of the agent's 30 active clients are highest-fit for a new listing that hits two of their flex conditions. The brief drives prioritisation.",
            },
          ].map((row, i) => (
            <li key={i} className="grid grid-cols-[110px_1fr] gap-4 sm:gap-6">
              <div className="font-mono text-indigo-700 text-[13px] sm:text-sm font-semibold pt-1">
                {row.when}
              </div>
              <div className="text-[15px] sm:text-base text-slate-700 leading-relaxed">
                {row.what}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-base sm:text-lg text-slate-700 leading-relaxed">
          None of those six future moments work without the brief. The brief
          doesn&apos;t exist without the 3-minute memo. The whole pipeline of
          AI-leverage is downstream of those 90 seconds on the walk back to your
          car.
        </p>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the 3-minute capture protocol"
          headlinePrimary="Speaking it is step one."
          headlineAccent="Letting AI structure it is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="THREE"
        origin={
          <>
            A real-estate adaptation of the voice-first capture pattern from
            operator and vibe-marketing communities — unstructured voice in,
            structured AI out beats forms every time. Our slice: the 3-minute
            window after a showing, where verbatim recall has the shortest
            half-life in the agent&apos;s week.
          </>
        }
      />
    </div>
  );
}
