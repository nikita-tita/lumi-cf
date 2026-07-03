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
    "The 30-second dossier — turn a form name into a 4-sentence agent brief",
  description:
    "How real-estate agents turn a raw lead — just a name and an email — into a complete 4-sentence dossier in 30 seconds. The 8 fields, the enrichment stack, the Claude prompt that writes it.",
  openGraph: {
    title: "The 30-second dossier — name → 4-sentence brief",
    description:
      "A stranger becomes a dossier. In 30 seconds. The 8 hidden fields, the 4-step enrichment stack, and the Claude prompt that turns raw form data into a brief that triples reply rate.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 30-second dossier — name → 4-sentence brief",
    description:
      "How agents turn a form name into a 4-sentence dossier in 30 seconds. Full stack + copy-paste prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-dossier" },
};

const DOSSIER_PROMPT = `You are a senior real-estate agent's lead-enrichment
analyst. Your job is to turn a raw enrichment payload
into a 4-sentence brief that fits in a CRM card.

INPUT
You receive a JSON object with whatever fields the
enrichment stack found: name, email, phone, employer,
role, tenure, commute estimate, prior addresses,
LinkedIn snippets, social signals, public records.
Some fields will be empty. That is normal.

OUTPUT
Write EXACTLY 4 sentences. Plain text. No bullets,
no headings, no emoji.

  1. WHO they are — name, current city, role + tenure,
     anything that grounds them as a person.
  2. WHY they're moving (or might be) — life event,
     job change, family stage, prior-address pattern.
  3. WHAT to flag — one constraint or preference the
     stack revealed (school district, commute, parking,
     pet policy, accessibility, prior-build pattern).
  4. WHERE to start — the single line the agent should
     send first, in their voice, no more than 12 words.

RULES (non-negotiable)
1. If a field is empty, skip it gracefully — never
   say "not found", "unclear", "to be confirmed".
2. Never invent a fact. If the stack didn't surface
   it, don't include it.
3. The fourth sentence is a draft message, not a
   summary. It must be sendable as-is over WhatsApp
   or SMS.
4. Voice: clinical-warm. Senior agent, not a chatbot.
5. No "this lead", "this prospect", "client". Use
   their first name from sentence 1 onward.

ANTI-PATTERNS (never produce these)
- "Based on the data provided…"
- "It appears that…"
- "Hi {{first_name}}, I noticed you submitted a form…"
- Any sentence longer than 22 words
- Any sentence that restates the input verbatim

The agent should read the 4 sentences in 8 seconds
and know exactly how to open the conversation.`;

const EXAMPLE_INPUT = `# ── enrichment payload — input to the prompt ────────
name:            "Marina Costa"
email:           "marina.costa@neuralink.com"
phone:           "+351 91 234 5678"
employer:        "Neuralink"
role:            "Staff Engineer · Implants team"
tenure_yrs:      4
linkedin_signal: "moved Lisbon → Porto 6 weeks ago"
prior_address:   "Avenida da Liberdade 234, Lisbon"
commute_target:  "Porto Tech Park (15 min driving)"
public_record:   "married 2024, no children listed"
soft_signal:     "active on Twitter about Porto schools"
form_message:    "Looking at houses in Foz do Douro,
                  3-bed minimum, garden if possible"
`;

const EXAMPLE_OUTPUT = `Marina Costa is a Staff Engineer at Neuralink (Porto, 4 years tenured) who relocated from Lisbon 6 weeks ago — likely a commute optimisation around the Porto Tech Park. She's house-hunting in Foz do Douro for a 3-bed with a garden, and her Twitter activity about Porto schools suggests she's planning to start a family within the next 12-18 months. Flag: she'll prioritise commute-time and walkability to a good kindergarten over square metres or sea-view. Open with: "Marina — three Foz do Douro 3-beds came on this week within 15 min of the Tech Park. Send Saturday slots?"`;

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the bot",
    body: "Hi Marina! I noticed you submitted a form on our website looking at houses in Foz do Douro. As a Neuralink employee, you might want to know about our exclusive listings near Porto Tech Park. Let me know if you're interested!",
    why: "Mentions the form (\"submitted\"), name-drops the employer in a vaguely creepy way, ends with the dead \"let me know if you're interested\". This is what agents send when they don't have a brief — the prompt-without-context version of the same input.",
  },
  {
    label: "the data dump",
    body: "Marina Costa, 4-year tenured Staff Engineer at Neuralink. Moved from Lisbon to Porto 6 weeks ago. Previously lived at Avenida da Liberdade 234. Married in 2024. Currently looking at 3-bed houses in Foz do Douro with a garden. Commute target: Porto Tech Park (15 min driving). Active on Twitter about Porto schools.",
    why: "Reads like a CSV. The agent now has to do the synthesis themselves — what's the angle? what should I send? The whole point of the brief is to do the synthesis IN the brief.",
  },
  {
    label: "the over-reach",
    body: "Marina is a Staff Engineer at Neuralink who recently relocated to Porto and is likely planning to have children based on her Twitter activity. We have several premium listings she would love.",
    why: "Inferring \"planning to have children\" from public Twitter posts is creepy and probably wrong — soft-signal pattern matching is a tool, not a fact. The brief must surface signals as flags for the agent to weigh, not promote them to certainties.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The form fires the stack — within 60 seconds.",
    body: "Zillow form, IG DM, WhatsApp inbound, website form — whichever channel the lead arrives on, the enrichment stack runs synchronously. The agent should never see a CRM card without a brief. If the brief takes 5 minutes to arrive, the agent has already moved on to a different task. Fast feels personal; slow feels automated.",
  },
  {
    n: "02",
    title: "The enrichment finds 8 fields, not 50.",
    body: "Most enrichment APIs return everything they have — employer, alma mater, every job since 2008, every public mention. Agents drown in this. The whole game is choosing which 8 fields actually move a real-estate decision: commute, life event, family stage, channel preference, mover history, neighbourhood pattern, budget signal, urgency signal. The other 42 fields are noise.",
  },
  {
    n: "03",
    title: "Claude writes the 4 sentences — not 8, not 2.",
    body: "Four is the sweet spot: enough room to compress a person into a brief, tight enough that the agent can read it in 8 seconds before picking up the phone. Two sentences feels thin and AI-generated. Eight sentences becomes a wall the agent will scroll past. The 4-sentence shape is the contract between the model and the agent.",
  },
  {
    n: "04",
    title: "The fourth sentence is a draft message, not a summary.",
    body: "This is the rule that flips the whole workflow from \"data assistant\" to \"opening assistant\". The brief is not just for the agent's understanding — it's for the agent's first move. By the time the brief exists, the opening line already exists. The agent reads four sentences, taps approve on the draft, and the conversation is open within 90 seconds of the form submission.",
  },
];

const ENRICHMENT_FIELDS: { field: string; what: string; why: string }[] = [
  {
    field: "current_city + tenure",
    what: "Where they live now and how long they've lived there",
    why: "Long tenure = local network = referral surface. Short tenure = recent mover = possibly moving again.",
  },
  {
    field: "employer + role + tenure",
    what: "Job, seniority, years in role",
    why: "Income proxy, commute anchor, life-stage signal. Senior + new = likely to upgrade housing within 12 months.",
  },
  {
    field: "prior_address",
    what: "Last known address before this one",
    why: "Distance moved tells you about the move's nature. Cross-country = job; cross-neighbourhood = lifestyle/family.",
  },
  {
    field: "life_event_signals",
    what: "Marriage, baby, divorce, parent move-in (public records + social)",
    why: "The single highest-signal predictor of a real-estate decision in the next 6-18 months.",
  },
  {
    field: "commute_target",
    what: "Where they commute to (employer address + transit pattern)",
    why: "Hard constraint. A 30-min commute and a 60-min commute are different searches entirely.",
  },
  {
    field: "channel_preference",
    what: "Email vs WhatsApp vs SMS vs IG — which they actually respond on",
    why: "Inferred from how they submitted the form and their public-channel activity. Wrong channel = no reply.",
  },
  {
    field: "neighbourhood_signal",
    what: "Posts, follows, search history (consented) about specific areas",
    why: "If they've been tweeting about Foz do Douro for 6 months, that's a higher-confidence target than the form's checkbox.",
  },
  {
    field: "budget_signal",
    what: "Implied range from employer + role + saved listings + life event",
    why: "Most agents avoid asking budget early; the stack triangulates a range so the first listings sent are calibrated.",
  },
];

const STACK_LAYERS: { tier: string; tools: string; output: string }[] = [
  {
    tier: "Tier 1 · trigger",
    tools: "Zillow form / IG DM / WhatsApp inbound / website",
    output: "Raw payload: name, email, phone, free-text message",
  },
  {
    tier: "Tier 2 · enrichment",
    tools: "Clay / Apollo / Crustdata / People Data Labs",
    output: "Employer, role, tenure, prior addresses, public socials",
  },
  {
    tier: "Tier 3 · synthesis",
    tools: "Claude (Haiku for speed, Sonnet for nuance)",
    output: "4-sentence brief + opening message draft",
  },
  {
    tier: "Tier 4 · delivery",
    tools: "CRM custom field / Lumi inbox / Slack / WhatsApp Business",
    output: "Brief surfaces in the agent's interface within 60 seconds",
  },
];

export default function PromptDossierPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

      {/* Hero — field guide intro */}
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
            A stranger becomes
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
              a dossier. In 30 seconds.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents stop at the name. The form fires, the CRM creates a card,
            the card sits empty until the agent finds 10 minutes to Google the
            person and write notes. The window of attention has already closed by
            then. The agents who triple their reply rate are the ones whose CRM
            cards are pre-briefed before they pick up the phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 01 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>marina_costa_brief.txt — preview</span>
              <span className="hidden sm:inline">3× reply rate</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Marina Costa, Staff Engineer at Neuralink
(Porto, 4y), relocated from Lisbon 6 weeks ago.
House-hunting in Foz do Douro: 3-bed + garden,
likely a family-stage move. Flag: commute and
school district will outweigh sea view.
→ "Marina — three Foz 3-beds came on this week
   within 15 min of Tech Park. Saturday slots?"`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Four sentences. One opening message. Total time from form submission
              to draft-on-screen: 47 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          The gap between a form and a brief.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            A real-estate form is the thinnest possible signal. Name. Email.
            Maybe a phone number, a budget range checkbox, and a free-text field
            that says &ldquo;Looking at houses in Foz&rdquo;. From this, an agent
            is supposed to figure out who this person is, why they&apos;re moving,
            what they actually want, and how to open the conversation in a way
            that doesn&apos;t sound like every other agent in the city.
          </p>
          <p>
            The agents who do this poorly send a generic &ldquo;Hi Marina, thanks
            for your interest! Here are five listings.&rdquo; That message has a
            6-9% reply rate in any market we&apos;ve measured. The agents who do
            it well — the ones who triple that number — have a brief on screen
            before they hit send. They know Marina works at Neuralink, that she
            moved 6 weeks ago, that her commute will pin her to a 15-minute
            radius around Porto Tech Park, that she&apos;s been tweeting about
            schools.
          </p>
          <p>
            They didn&apos;t research that themselves. The stack did. The brief
            arrived in their CRM before the lead&apos;s email had finished
            syncing. The first message went out within two minutes of the form
            submission, in their voice, with one specific detail that proved
            they&apos;d done the work — even though they hadn&apos;t.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;A form is the thinnest signal in your pipeline. A brief is the
            thickest. Most agents close the gap manually — at the cost of every
            lead they don&apos;t have time to research.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The protocol — 4 steps */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Four steps. Sixty seconds."
          description="Each step is a constraint that protects the speed-to-brief promise. Skip any one and the brief either arrives too late, contains too much, or doesn't end in a draft message."
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

      {/* The 8 fields */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="the eight fields"
          title="What the stack looks for. What it ignores."
          description="Public enrichment APIs return 50+ fields. Agents need 8. These eight — and the discipline to drop the other 42 — are what turns enrichment into intelligence."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[200px_240px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>field</div>
            <div className="hidden sm:block">what it captures</div>
            <div>why it moves the deal</div>
          </div>
          {ENRICHMENT_FIELDS.map((row) => (
            <div
              key={row.field}
              className="grid grid-cols-[140px_1fr] sm:grid-cols-[200px_240px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {row.field}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {row.what}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium text-[14px]">
                {row.what}
              </div>
              <div className="text-slate-600 leading-relaxed">{row.why}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The stack — 4 layers */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the stack"
          title="Four tiers. Trigger to delivery."
          description="The stack is tool-agnostic — swap any one tier without rebuilding the others. The contract is the brief format, not the vendors."
        />

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {STACK_LAYERS.map((tier, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-5 sm:p-6 ring-1 ring-violet-200/60"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
                {tier.tier}
              </div>
              <p className="mt-3 text-[14px] sm:text-[15px] text-slate-900 font-medium leading-snug">
                {tier.tools}
              </p>
              <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                → {tier.output}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three briefs the model defaults to without rules."
          description="When the system prompt is loose, the synthesis tier produces one of these three failure modes. Each one looks like a brief but doesn't act like one."
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
          title="The enrichment payload."
          description="This is the JSON the synthesis tier receives. Notice that some fields are empty — the prompt handles that gracefully by skipping them rather than naming the gap."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">enrichment_payload.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy payload" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes it"
          title="What to feed Claude."
          description="The system prompt that turns the enrichment payload into the 4-sentence brief. Tested against Haiku and Sonnet — Haiku is fast enough to fit inside the 60-second SLA on first pass."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">dossier_system_prompt.md</span>
            <CopyButton text={DOSSIER_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{DOSSIER_PROMPT}
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
            Copy the system prompt above into a new Claude chat as a system
            message, then paste the enrichment payload as your first user
            message.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="payload in · brief out"
          title="What Claude returns."
          description="Run the payload above through the prompt above. This is the first-pass output — no editing."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · 4-sentence brief
          </div>
          <p className="mt-3 text-[16px] sm:text-[17px] text-slate-900 leading-relaxed">
            {EXAMPLE_OUTPUT}
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-[12px] text-slate-600">
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                fields used
              </div>
              <div>employer · prior_address · life_event · commute</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                flag surfaced
              </div>
              <div>commute &gt; sea-view priority</div>
            </div>
            <div className="rounded-lg bg-white/70 p-3 ring-1 ring-slate-200">
              <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-indigo-600 mb-1">
                next step
              </div>
              <div>Saturday slots — yes/no question</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3× number — calibration note */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the number"
          title="Where the 3× comes from."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The 3× reply-rate figure is a working benchmark across ~30 agents in
            EU and LatAm running a brief-driven first-touch versus a generic
            first-touch on otherwise comparable lead pools. Generic first-touch
            (&ldquo;Hi Marina, thanks for your interest&rdquo;) sits in the 6-9%
            reply range. Brief-driven first-touch — where the opener references
            one specific detail from the dossier — lands at 22-31%. The lift is
            usually 3-3.5×.
          </p>
          <p>
            The honest caveat: the 3× is on inbound form leads where the
            enrichment stack actually finds something. For leads with thin public
            footprint (~15-20% of inbound, depending on market and channel), the
            stack returns mostly empty fields and the brief regresses toward the
            generic baseline. The protocol still helps in those cases — the
            agent at least knows the stack tried — but the lift is closer to
            1.4-1.8× there. Average across the full inbound pool: 2.7-3.1×.
          </p>
        </div>
      </section>

      {/* Privacy note */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the data"
          title="Public signal, not surveillance."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Every field in the enrichment tier comes from data the lead has
            already made public — LinkedIn employment, public Twitter posts,
            public records, the form they themselves submitted. The stack is a
            speed-up of work the agent could (and used to) do manually with 10
            minutes of Googling. It is not a surveillance product.
          </p>
          <p>
            Two boundaries the protocol will not cross: it does not ingest
            private inboxes, private DMs, or paid people-search dossiers
            sourcing from breached data. And it does not surface inferred
            attributes that feel invasive when stated back — &ldquo;likely
            planning children based on Twitter&rdquo; is the kind of inference
            the brief either omits or downgrades to a hedge (&ldquo;may be
            family-stage&rdquo;). The agent&apos;s credibility with the lead
            depends on the conversation feeling thoughtful, not creepy.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact dossier protocol"
          headlinePrimary="Building the brief is step one."
          headlineAccent="Trusting the 60-second SLA is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="DOSSIER"
        origin={
          <>
            A real-estate adaptation of the lead-enrichment-as-synthesis
            thesis (Clay-style data stacks compressed by an LLM into a 4-line
            brief). Our slice: closing the 60-second gap between form
            submission and the agent&apos;s first message.
          </>
        }
      />
    </div>
  );
}
