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
    "The payment plan in plain English — turn a developer's percentage grid into something a buyer can follow",
  description:
    "Off-plan buyers don't stall because the plan is complicated. They stall because it's unreadable. The exact prompt that turns a pasted developer payment table into dated, plain-English milestones — including the DLD 4% and the fees that never appear on the grid.",
  openGraph: {
    title: "The payment plan in plain English — the prompt",
    description:
      "Paste the developer's grid, get back what the buyer actually pays and when. Milestones, dates, DLD 4%. Structures your numbers — never invents them.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The payment plan in plain English — prompt for off-plan agents",
    description:
      "Paste the developer's percentage grid, get back dated milestones a buyer can follow. Free prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-plan" },
};

const PAYMENT_PLAN_PROMPT = `You are a real-estate agent's payment-plan
translator. You restructure numbers the agent
gives you. You never invent them.

INPUT
The agent pastes a developer payment schedule
(a table, a screenshot transcription, or a list
of percentages and milestones), plus:
  purchase_price, currency, booking_date,
  expected_handover, buyer_language,
  known_fees (optional).

OUTPUT — exactly three blocks, in this order.

BLOCK 1 — "What you pay, and when"
A simple ordered list. One line per milestone:
  <amount in currency> — <plain-English trigger>
  — <date or expected date>
Rules:
- Convert every percentage to a real amount
  using purchase_price. Show the amount FIRST,
  the percentage in brackets after it.
- Translate construction jargon into what the
  buyer can picture: "20% on completion of the
  substructure" → "when the foundation is
  finished (roughly month 8)".
- If a milestone has no date, mark it
  "on construction milestone — no fixed date"
  and say so plainly. Never guess a date.

BLOCK 2 — "On top of the property price"
A short list of costs that are NOT in the
developer's grid. Include only what the agent
supplied in known_fees, plus the statutory ones
they named. If the agent gave none, output the
line: "Confirm the registration and admin fees
with the developer before sending this."
Never fill this block from memory.

BLOCK 3 — "The three things to know"
Three sentences, maximum. The parts of this
specific plan a buyer usually misunderstands
— the size of the handover payment, whether
anything is due after handover, and what
happens to the schedule if construction moves.

RULES (non-negotiable)
1. Every number in your output must trace back
   to a number in the input. If you cannot
   derive it, write "not stated in the plan
   provided" — never estimate.
2. Amounts and percentages must reconcile: the
   milestone amounts sum to 100% of
   purchase_price. State the total at the end
   and flag any mismatch instead of silently
   rounding it away.
3. Write in buyer_language. Short sentences.
   No financial jargon, no bank terminology.
4. This is a restatement of a developer's
   schedule, not advice. Never recommend the
   plan, compare it to other plans, comment on
   whether it is a good deal, or mention
   mortgages, returns, or resale.
5. End with one line the agent can keep or
   delete: "Figures follow the developer's
   schedule dated <date>. Confirm before
   signing anything."

TONE
Calm, factual, warm. The buyer should finish
the message knowing exactly what leaves their
account and when — and should not feel sold to.`;

const EXAMPLE_INPUT = `# ── what the agent pastes ──────────────────────
purchase_price:     AED 1,850,000
currency:           AED
booking_date:       2026-08-14
expected_handover:  Q4 2028
buyer_language:     English

developer_schedule: |
  10%   On booking
  10%   Within 30 days of SPA
  10%   On completion of substructure
  10%   On completion of 30% of construction
  10%   On completion of 60% of construction
  10%   On completion of 90% of construction
  40%   On handover

known_fees:
  - "DLD registration 4% + AED 580 admin"
  - "Oqood registration AED 3,000"
`;

const EXAMPLE_OUTPUT = `What you pay, and when

1. AED 185,000 (10%) — to reserve the unit —
   14 August 2026
2. AED 185,000 (10%) — within 30 days of
   signing the sale agreement — by 13 Sep 2026
3. AED 185,000 (10%) — when the foundation is
   finished — on construction milestone,
   no fixed date
4. AED 185,000 (10%) — at one third built
5. AED 185,000 (10%) — at two thirds built
6. AED 185,000 (10%) — when the building is
   almost finished
7. AED 740,000 (40%) — when you get the keys —
   expected Q4 2028

Total: AED 1,850,000 (100%) ✓

On top of the property price
• DLD registration — 4% of the price
  (AED 74,000) + AED 580 admin
• Oqood registration — AED 3,000

The three things to know
The largest single payment is the last one:
AED 740,000 on handover — nearly half the
price in one instalment. Nothing is due after
you receive the keys. Milestones 3 to 6 follow
construction, not the calendar — if the build
runs late, those dates move with it.

Figures follow the developer's schedule dated
14 August 2026. Confirm before signing
anything.`;

const RULES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Amounts before percentages, always.",
    body: "A buyer cannot feel 10%. They can feel AED 185,000. The single highest-leverage change in the whole output is putting the money first and the percentage in brackets behind it. Agents who make only this one change report fewer follow-up calls asking the same question twice.",
  },
  {
    n: "02",
    title: "Translate the construction milestone, don't copy it.",
    body: "“On completion of substructure” means nothing outside the industry. “When the foundation is finished” means something to everyone. This is where the developer's grid loses people — it is written for the escrow account, not for the person paying into it.",
  },
  {
    n: "03",
    title: "Name what has no date.",
    body: "Milestone payments tied to construction progress genuinely have no fixed date, and pretending otherwise is how agents end up apologising in month 14. Saying “no fixed date — it follows the build” up front converts an unpleasant surprise into an expectation set on day one.",
  },
  {
    n: "04",
    title: "The fees block is filled by you, not by the model.",
    body: "Registration and admin fees change, differ by developer, and differ by project. The prompt is written to refuse to fill this block from memory — if you supply nothing, it tells you to confirm the numbers instead of inventing them. That refusal is a feature. It is the difference between a tool you can send to a client and one you can't.",
  },
  {
    n: "05",
    title: "It restates. It does not advise.",
    body: "The prompt is explicitly barred from saying whether the plan is good, comparing it to other plans, or mentioning mortgages and returns. You are a licensed professional restating a developer's schedule in readable form. Keep the output on that side of the line, and it is safe to forward as-is.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the paste",
    body: "10% booking / 10% SPA / 10% substructure / 10% 30% / 10% 60% / 10% 90% / 40% handover",
    why: "This is the developer's grid, forwarded. It is accurate and unreadable. The buyer cannot tell what leaves their account this month, and the biggest number in their life for the next two years — the 40% at handover — is the least visible thing on the line.",
  },
  {
    label: "the invented date",
    body: "Payment 3: AED 185,000 due 14 March 2027 (foundation complete)",
    why: "Nobody said March 2027. The model derived it from a plausible construction curve, and now a date the developer never committed to is sitting in a client's inbox with your name on it. This is the failure mode the “never estimate” rule exists to block — check every date in the output against the input before you send.",
  },
  {
    label: "the helpful extra",
    body: "This is a strong plan — a 60/40 split is buyer-friendly compared to most launches this year, and with rental yields around 7% you'd be well positioned.",
    why: "Two sentences, three problems: an opinion on the deal, a market claim from training data, and an implied return. None of it came from the input. Ask the model to be helpful and it will reach for exactly this — which is why the prompt bans comparison, recommendation, and any mention of returns.",
  },
];

const READS: { grid: string; plain: string }[] = [
  {
    grid: "10% on completion of substructure",
    plain: "when the foundation is finished",
  },
  {
    grid: "10% on completion of 30% of construction",
    plain: "at one third built",
  },
  {
    grid: "10% within 30 days of SPA",
    plain: "within a month of signing the sale agreement",
  },
  {
    grid: "40% on handover",
    plain: "when you get the keys",
  },
];

export default function PromptPlanPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={6} guideAnchor="#rules" />

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
            The payment plan,
            <br />
            <span
              style={{
                background: "#2563EB",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              in plain English.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Off-plan payment plans are not complicated. Reading them off a grid
            of percentages is. So the buyer says &ldquo;let me think about
            it&rdquo; — not because the numbers frightened them, but because
            they never resolved into numbers at all. This is the prompt that
            takes the developer&apos;s table you paste and hands it back as
            amounts, triggers, and dates.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>6-min read</span>
            <span aria-hidden>·</span>
            <span>Updated August 2026</span>
            <span aria-hidden>·</span>
            <span>keyword PLAN · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>same plan — two ways to read it</span>
              <span className="hidden sm:inline">grid vs plain</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-2">
                  what you forwarded
                </div>
                <pre className="text-[12px] leading-relaxed font-mono text-slate-700 whitespace-pre-wrap">
{`40% on handover`}
                </pre>
              </div>
              <div className="rounded-2xl bg-white/70 ring-1 ring-violet-200 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-indigo-600 mb-2">
                  what they can answer
                </div>
                <pre className="text-[12px] leading-relaxed font-mono text-slate-800 whitespace-pre-wrap">
{`AED 740,000 — when you get
the keys — expected Q4 2028`}
                </pre>
              </div>
            </div>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Identical information. One of them ends the conversation, the
              other one starts it.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why buyers go quiet after the table.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            A developer&apos;s payment schedule is a construction document. It
            is organised around the escrow account and the build programme —
            which is exactly right for the parties who signed it, and exactly
            wrong for the person deciding whether they can afford it. The buyer
            is trying to answer one question: what leaves my account, and when?
            The grid answers a different one.
          </p>
          <p>
            So they do the arithmetic in their head, get halfway, lose
            confidence, and say the sentence every off-plan agent knows:
            &ldquo;let me think about it.&rdquo; That is not hesitation about
            the property. It is an unfinished calculation. You can finish it
            for them in ninety seconds.
          </p>
          <p>
            The prompt below does one narrow thing — it restructures numbers you
            supply. It converts percentages into amounts, milestones into events
            a person can picture, and it flags every place where the plan
            genuinely has no date instead of inventing one. It does not advise,
            compare, or estimate, because the moment it does, you cannot forward
            the output.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;Let me think about it&rdquo; is usually an unfinished
            calculation, not an objection.
          </p>
        </blockquote>
      </section>

      {/* The rules */}
      <section id="rules" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the rules"
          title="Five constraints. One readable plan."
          description="Each one blocks a specific way this goes wrong — usually the model being helpful in a way that puts a number you cannot defend into a client's inbox."
        />

        <ol className="mt-10 space-y-5">
          {RULES.map((s) => (
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

      {/* Translation table */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="line by line"
          title="What the grid says. What the buyer hears."
          description="The translation layer is most of the value. Nothing about the plan changes — only whether a person outside the industry can picture the moment the money moves."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>developer&apos;s wording</div>
            <div className="hidden sm:block">what you send instead</div>
          </div>
          {READS.map((row) => (
            <div
              key={row.grid}
              className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-slate-500">{row.grid}</div>
              <div className="text-slate-900 font-medium">{row.plain}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The input */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="What you feed it."
          description="Paste the developer's schedule as it came to you — a table, a transcribed screenshot, a list. Add the price, the dates you actually know, and the fees you have confirmed. Everything the model is allowed to state comes from this block."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">payment_plan_input.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy input" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>

        <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
          Leave <span className="font-mono text-[13px]">known_fees</span> empty
          and the output will tell you to confirm them rather than filling the
          gap. That is the intended behaviour — registration and admin charges
          vary by developer and project, and a plausible-looking wrong number is
          worse than a blank.
        </p>
      </section>

      {/* The prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt"
          title="What to feed Claude."
          description="Paste this as the system prompt in a new chat, then send the input block above as your first message. Works on any current model — the constraints are doing the work, not the model size."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">payment_plan_system_prompt.md</span>
            <CopyButton text={PAYMENT_PLAN_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{PAYMENT_PLAN_PROMPT}
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
            No signup for the prompt itself — it is yours to keep, whether you
            run it in Lumi or your own tab.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="plan in · message out"
          title="What comes back."
          description="First-pass output from the input above. Read the total line before you send anything — it is there so a rounding error cannot leave the chat."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · whatsapp draft
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
{EXAMPLE_OUTPUT}
          </pre>
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          Three things to check every single time before this leaves your phone:
          the total reconciles to the price, no date appears that the developer
          never committed to, and the fees block contains only figures you
          supplied. Thirty seconds. The output is a draft in your voice, not a
          document from an authority.
        </p>
      </section>

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three outputs you should not send."
          description="Two of them are what the model produces when the constraints are removed. The first is what most agents send today."
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

      {/* Scope note */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="scope"
          title="What this is not."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            This is a formatting tool. It restates a schedule you were given, in
            language your buyer reads. It is not financial advice, not a
            mortgage calculation, not an affordability assessment, and not a
            comparison between developers — the prompt refuses all four on
            purpose, because each one moves the output out of what an agent can
            safely forward and into territory that belongs to a licensed
            adviser.
          </p>
          <p>
            The numbers remain the developer&apos;s. The responsibility for
            checking them remains yours. What changes is that the buyer can now
            answer the question they were actually stuck on — and the answer
            arrives in the same conversation, not three days later.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the payment-plan explainer"
          headlinePrimary="Explaining the plan is the easy half."
          headlineAccent="Remembering who you explained it to is the other one."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="PLAN"
        origin={
          <>
            Written for off-plan markets where percentage grids are the norm —
            Dubai first, but the failure mode is identical anywhere a buyer is
            handed a construction schedule and asked to make a decision from it.
          </>
        }
      />
    </div>
  );
}
