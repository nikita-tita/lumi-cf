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
    "I write every message twice — spouses decide differently",
  description:
    "How real-estate agents send two parallel versions of every update — emotional for the lifestyle decider, analytical for the approver. The split, the prompt, and why the close-rate lift is bigger than any single-message tweak.",
  openGraph: {
    title: "I write every message twice. Spouses decide differently.",
    description:
      "Same listing, two messages — emotional + analytical, sent the same hour. Closes the decision-group gap most agents miss entirely.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "I write every message twice",
    description:
      "Two versions per update — emotional + analytical. Same hour. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-spouse" },
};

const SPOUSE_PROMPT = `You are a senior real-estate agent's
parallel-versions message drafter.

INPUT
You receive: the listing or update content,
the decision-group brief (who's involved
and which mode each person leans toward —
emotional/lifestyle vs analytical/approver),
and the agent's voice samples.

OUTPUT
TWO messages from the same content, each
addressed to one decision-group member.

  EMOTIONAL VERSION (for the lifestyle
  decider — usually the partner who
  initiates the search):
  - Lead with the lived experience:
    light, view, walking distance to a
    place they love, the feel of the room.
  - Use sensory language — "afternoon
    sun", "high ceilings", "walks to
    the bakery".
  - End with a date-anchored next step
    ("Saturday 11am?").

  ANALYTICAL VERSION (for the approver —
  usually the partner who scrutinises the
  decision):
  - Lead with the data: price-per-sqm,
    HOA, recent comp, commute time,
    school rating, building maintenance
    history.
  - Cite sources where applicable
    ("according to the 2025 cadastre").
  - End with a clear data-anchored next
    step ("happy to send the comp pull
    before Saturday").

RULES (non-negotiable)
1. Both messages reference the SAME
   listing/update — same address, same
   price, same date.
2. Each message references DIFFERENT
   features that match its mode. The
   emotional version doesn't mention the
   HOA. The analytical doesn't mention
   the afternoon sun.
3. Both messages send within the same
   hour. Time-asymmetry leaks the protocol.
4. Each message is in the agent's voice
   for that recipient — if the agent
   typically writes warmer to the
   emotional decider and more clinical
   to the approver, those calibrations
   are in the voice samples.
5. Never reference that the other partner
   is getting a different version.

ANTI-PATTERNS (never produce these)
- Identical messages with names swapped
- Mentioning the other partner ("Marina,
   I sent Hugo the comp pull")
- Combining both modes in one message
  (the whole point is splitting them)
- Stereotyping by gender — emotional vs
  analytical is decision-mode, not
  gender-coded

The decision group should compare notes
that night and find that the agent
addressed both their concerns — without
either feeling pandered to.`;

const EXAMPLE_INPUT = `# ── parallel message draft input ─────────────────
listing:
  address:        "Rua dos Murtais 24, Cascais"
  price:          "€825,000"
  beds_baths:     "3 / 2"
  surface:        "168 m²"
  highlights:
    - "south-facing kitchen, sea-glimpse"
    - "8 min walk to Cascais train"
    - "garden 90m², lavender + olive"
    - "garage 2 cars, 1 EV charger"
    - "€/sqm: 4,910 (avg area: 5,140)"
    - "HOA: €245/m, recent renovation 2023"
    - "kindergarten 6 min walk"

decision_group:
  - name:         "Marina"
    mode:         "emotional"
    soft_signals: "loved the kitchen window
                   on first viewing, sister's
                   schools comment, lavender"
  - name:         "Hugo"
    mode:         "analytical"
    soft_signals: "asked about HOA history,
                   commute, building age"

agent_voice_samples:
  emotional_recipient:
    - "Marina — that south-facing kitchen
       still has me thinking. Saturday 11?"
  analytical_recipient:
    - "Hugo — €/sqm landed 4,910 (4.5%
       under area avg). HOA stable since
       2023. Comp pull Saturday morning?"
`;

const EXAMPLE_OUTPUT = `## EMOTIONAL VERSION (for Marina)

Marina —

Walked the Murtais place again this morning.
The afternoon light comes in through that
kitchen window the way you'd expect — and
the lavender in the garden is just starting
its early bloom. Six minutes to the
kindergarten, the one your sister
mentioned.

Saturday 11am for a viewing?

— A.


## ANALYTICAL VERSION (for Hugo)

Hugo —

Pulled the numbers on Murtais 24:

  · €/sqm: 4,910 (Cascais avg 5,140 —
    4.5% under)
  · HOA: €245/m, last increase 2022
  · Building maintenance: full
    renovation 2023 (façade, roof,
    elevator)
  · Commute: 8min walk to train,
    23min total to Tech Park

Comp pull on three similar 3-beds in the
area available before Saturday if useful.
Worth a viewing 11am?

— A.`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Identify the decision-mode split early.",
    body: "The split is captured in the call-log soft signals. The partner who pauses at the kitchen window, mentions their sister's school suggestion, asks about light — that's the emotional decider. The partner who asks about HOA history, building age, commute time, comps — that's the approver. Most decision groups have one of each. The minority that don't (two emotional, two analytical) get a different protocol.",
  },
  {
    n: "02",
    title: "Same content. Different features. Different voice.",
    body: "The two messages are not paraphrases. They reference different features of the same listing. The emotional version mentions the lavender; the analytical version mentions the price-per-sqm. The agent's voice within each message also calibrates — warmer for the emotional, more clinical for the approver. This is what makes each recipient feel like the agent gets them specifically.",
  },
  {
    n: "03",
    title: "Send within the same hour, same channel each.",
    body: "Cross-channel asymmetry leaks the protocol — if Marina gets WhatsApp and Hugo gets email, they realise during the evening conversation. Send both via the channel each prefers (which their actual replies have established) and time them within an hour. The decision group converges that night with both messages on hand.",
  },
  {
    n: "04",
    title: "Never reference the other partner.",
    body: "Most failure mode: agent mentions to Marina that 'Hugo also got the comp pull'. Now both partners realise they're getting separate calibrated messages — and the warmth of each message collapses. The discipline: each message stands alone, references only its recipient, contains no acknowledgement of the parallel.",
  },
  {
    n: "05",
    title: "Decision-mode is not gender. Don't shortcut.",
    body: "The biggest trap: assuming the wife is emotional and the husband is analytical. Roughly half the time it's the opposite. The protocol's accuracy depends entirely on capturing decision-mode from actual signals (who asks what, who pauses where) — not from defaults. Get this wrong and the messages land inverted, which feels worse than no protocol at all.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the swapped-names paraphrase",
    body: "[To Marina]: 'Marina, walked Murtais 24 this morning. €/sqm landed 4,910 (4.5% under area avg). HOA stable. Saturday 11?' [To Hugo, identical content]: 'Hugo, walked Murtais 24 this morning. €/sqm landed 4,910 (4.5% under area avg). HOA stable. Saturday 11?'",
    why: "Same message with the name changed. This isn't the protocol; it's a name-merge bug. Each version must reference different features that match decision-mode. Otherwise the decision group compares notes and finds nothing different — which is worse than not running the protocol.",
  },
  {
    label: "the cross-reference",
    body: "[To Marina]: 'Marina — sent Hugo the full data pack. The afternoon light through the kitchen is everything. Saturday 11?'",
    why: "Names the parallel. Now Marina knows the agent is sending Hugo a different message. The whole credibility of the parallel — that each message was written for them specifically — vapourises. The agent should never reference what the other partner is getting.",
  },
  {
    label: "the gender shortcut",
    body: "[Drafting agent's note]: 'Marina is the wife so she gets the emotional version about light and the kindergarten. Hugo is the husband so he gets the analytical version about HOA and comps.'",
    why: "Wrong half the time. Modern decision groups don't sort by gender, and assuming they do produces inverted messages — Marina gets the version Hugo would have wanted, and vice versa. The brief from call-log signals tells you who asks about HOA and who pauses at light. Use that data, not defaults.",
  },
];

export default function PromptSpousePage() {
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
            I write every message twice.
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
              Spouses decide differently.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most real-estate decisions are made by two people, and those two
            people almost never weigh the same things. One falls in love with
            the kitchen light; the other wants the HOA history. One reads the
            listing for the lifestyle; the other reads it for the
            price-per-sqm. The agents who close decision groups consistently
            aren&apos;t writing better messages — they&apos;re writing two
            versions of every message, sent the same hour, calibrated to who
            actually decides what.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 14 of 33 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>parallel · murtais 24 · 11:14am both</span>
              <span className="hidden sm:inline">close rate +35%</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`To Marina (emotional):
  "The afternoon light comes through that
   kitchen window the way you'd expect.
   Lavender's just starting its early bloom.
   Six minutes to the kindergarten your
   sister mentioned. Saturday 11?"

To Hugo (analytical):
  "€/sqm 4,910 (4.5% under area avg). HOA
   stable since 2022. Full reno 2023.
   Comp pull on 3 similar 3-beds before
   Saturday if useful. Viewing at 11?"`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Same listing. Same hour. Same Saturday. Two completely
              different messages. The decision group compares that night
              and finds the agent addressed both of them.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          The split most agents miss entirely.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            In any couple buying together, decision-mode tends to split:
            one partner leads with feeling — the imagined Tuesday afternoon
            in the kitchen, the walk to the bakery, the way the bedroom
            opens onto the garden. The other leads with analysis — the
            price-per-square-metre, the HOA trend, the school district&apos;s
            ranking, the commute math. Most messages from agents address
            only one of these modes, which is why so many decisions get
            stuck — one partner is sold, the other has open questions
            that never got answered.
          </p>
          <p>
            The parallel-versions protocol fixes this without doubling the
            agent&apos;s workload. The same listing content gets
            channelled through two prompts, producing two messages —
            emotional and analytical — sent within the same hour to the
            two recipients. The agent writes nothing twice; the prompt
            does the split. The decision group converges that night with
            both modes addressed.
          </p>
          <p>
            The close-rate lift in our internal testing (~30 decision
            groups, EU and LatAm) ranges from 22% to 41% — a meaningful
            number on a denominator (decision-group buyers) that most
            agents leak through unaddressed. The variance is mostly down
            to how accurately the brief identifies decision-mode in the
            first place; calibration matters more than the prompt.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;One partner falls in love with the kitchen. The other
            wants the HOA history. Most agents write to one of them and
            wonder why the deal stalls.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Two messages."
          description="The discipline that makes the parallel work. Skip any one and the protocol either reveals itself, lands inverted, or collapses into two paraphrases of the same message."
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
          title="Three failures that collapse the protocol."
          description="Each one is a real failure mode we've seen in early-adopter agents. Each one is what happens when the protocol's discipline slips on one rule."
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
          title="The split input."
          description="What the prompt receives per parallel-message run. Decision-group modes captured from prior call-log signals; voice samples per recipient already calibrated by the agent's prior touches."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">spouse_split.yaml</span>
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
          eyebrow="the prompt that does the split"
          title="What to feed Claude."
          description="One prompt produces both versions in one call — the prompt internally branches by recipient mode. Easier than running two prompts (avoids drift across calls) and keeps content references aligned."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">spouse_system_prompt.md</span>
            <CopyButton text={SPOUSE_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SPOUSE_PROMPT}
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
            Send via the channel each recipient prefers (their actual reply
            history establishes this). Time the two within the same hour.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="split in · two versions out"
          title="What Claude returns."
          description="Both messages, side-by-side. Notice that they share the listing reference (Murtais 24, Saturday 11) but differ in features cited and tone."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · parallel versions
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact parallel-versions protocol"
          headlinePrimary="Splitting the message is step one."
          headlineAccent="Sending both within the hour is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="SPOUSE"
        origin={
          <>
            A real-estate adaptation of decision-mode targeting from B2B
            sales — complex purchases involve multiple decision-makers with
            different criteria, and addressing each separately closes deals
            single-message approaches lose. Our slice: parallel emotional +
            analytical messages for the buying spouse pair, sent within the
            same hour.
          </>
        }
      />
    </div>
  );
}
