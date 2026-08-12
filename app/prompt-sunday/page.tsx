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
    "The Sunday brief — ten minutes on your phone instead of an evening in the CRM",
  description:
    "Forty names open, three of them matter on Monday. Scrolling the pipeline doesn't tell you which three. The prompt that turns your week's activity into one readable brief: what moved, what went quiet, and the eight calls Monday is actually made of.",
  openGraph: {
    title: "The Sunday brief — the prompt that ends pipeline scrolling",
    description:
      "One brief, ten minutes, eight calls. Keep, nudge, or drop — every yes lands on Monday's calendar. Free prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sunday brief — prompt for real-estate agents",
    description:
      "What moved, what went quiet, what needs a decision. Ten minutes on your phone, then close the laptop.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-sunday" },
};

const SUNDAY_PROMPT = `You are a real-estate agent's Sunday briefer.
You turn a week of pipeline activity into ONE
short brief the agent reads on a phone in ten
minutes and acts on Monday.

INPUT
A list of active clients. Per client, whatever
the agent has:
  name, stage, last_contact_date,
  last_contact_summary, next_promised (if any),
  deadline_or_window, notes.
Plus: today_date, monday_capacity (how many
calls the agent will realistically make).

OUTPUT — four blocks, in this order. No preamble.

BLOCK 1 — "Moved this week" (max 5 lines)
One line per client where something actually
changed: viewed, made an offer, got approval,
introduced a decision-maker, changed their
requirements. Format:
  <name> — <what changed> — <what it means>

BLOCK 2 — "Went quiet" (max 5 lines)
Clients with no contact in 7+ days who were
previously active. Format:
  <name> — silent <N> days — last thing that
  happened — <the specific reason they might
  have stalled, from the notes>
If the notes do not support a reason, write
"no signal in the notes" — never speculate.

BLOCK 3 — "Monday's calls" (exactly
monday_capacity lines, ranked)
The calls, in the order to make them. Per line:
  <rank>. <name> — <one-sentence purpose> —
  <KEEP / NUDGE / DROP>
Ranking rule: a dated deadline outranks a large
number, and a large number outranks a long
silence. Say the deadline out loud in the
purpose when one exists.
DROP is mandatory: if nothing qualifies, say
"nothing to drop this week" — but look first.

BLOCK 4 — "One decision" (2 sentences)
The single judgement call only the agent can
make this week. Not a task. A decision: which
client to stop working, which price
conversation to have, which listing to hand
back.

RULES (non-negotiable)
1. Use only what is in the input. Never invent
   activity, dates, or amounts. Missing data is
   stated as missing.
2. Total output under 300 words. It is read on
   a phone, standing up.
3. No coaching, no motivation, no "great work
   this week". No emoji.
4. Never recommend a bulk action ("follow up
   with everyone who went quiet"). Every line
   names one person.
5. If two clients compete for the same Monday
   slot, pick one and say why in four words.

TONE
A sharp colleague who read your pipeline so you
did not have to. Flat, specific, finishable.`;

const EXAMPLE_INPUT = `# ── Sunday input ───────────────────────────────
today_date:        2026-08-16
monday_capacity:   8

clients:
  - name: "Omar A."
    stage: "offer"
    last_contact: 2026-08-14
    summary: "offered 2.9M on Marina Gate 2;
              seller countered 3.05M"
    deadline: "counter expires Tue 18 Aug"
  - name: "Aisha K."
    stage: "viewing"
    last_contact: 2026-08-05
    summary: "viewed 2 units, asked twice about
              school run timing"
    next_promised: "send 3 options near GEMS"
  - name: "Daniel R."
    stage: "qualified"
    last_contact: 2026-07-29
    summary: "cash buyer, wanted off-plan
              handover before Q3 2027"
    notes: "went quiet after payment plan sent"
  # …the rest of the active list
`;

const EXAMPLE_OUTPUT = `Moved this week
Omar A. — seller countered at 3.05M — live
negotiation, expires Tuesday
Aisha K. — asked twice about school timing —
her real constraint is the catchment, not the
budget

Went quiet
Daniel R. — silent 18 days — last thing that
happened: you sent the payment plan — no signal
in the notes as to why

Monday's calls
1. Omar A. — counter expires Tuesday, get a
   yes/no on 3.05M today — KEEP
2. Aisha K. — you owe her 3 options near GEMS —
   KEEP
3. Daniel R. — one call: still buying before
   Q3 2027? — NUDGE
…
8. M. Haddad — three months, no viewing booked
   — DROP

One decision
Daniel R. has had the payment plan for 18 days
without a question. Decide Monday whether he is
a slow buyer or a closed one — and if it is the
second, say so and free the slot.`;

const RULES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Scrolling is not reviewing.",
    body: "Opening the pipeline and reading forty names top to bottom feels like work and produces nothing you can act on. By name twenty you are re-reading, by name thirty you are judging yourself, and Monday still starts with whoever texted you first. The brief exists to convert that hour into ten minutes with an output.",
  },
  {
    n: "02",
    title: "The output is calls, not insights.",
    body: "A review that ends in observations ends nowhere. This one ends in a ranked call list sized to what you will genuinely do on Monday — eight, not twenty-five. Ranking by deadline first means the day starts with the thing that expires, not the thing that is loudest.",
  },
  {
    n: "03",
    title: "DROP is mandatory.",
    body: "The block that agents skip and the one that pays for the whole routine. Every pipeline carries names that have not moved in months and quietly consume attention every Sunday. Forcing one explicit drop per week is what keeps the list finite — and the prompt makes you look before letting you off.",
  },
  {
    n: "04",
    title: "Silence gets a reason or an admission.",
    body: "A client who went quiet after receiving a payment plan is a different problem from one who went quiet after a viewing. If the notes support a reason, the brief names it. If they do not, it says so plainly instead of inventing a story that sends you into Monday with a false theory.",
  },
  {
    n: "05",
    title: "One decision, and then you close it.",
    body: "The last block is the only part that requires you specifically. Everything else is execution. Naming a single judgement call — stop working this client, have this price conversation, hand this listing back — is what makes it possible to shut the laptop rather than keep scrolling for something you might have missed.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the dashboard",
    body: "You had 12 active leads this week, 3 viewings, 1 offer, and a 28% response rate. Great momentum — keep it up!",
    why: "Metrics with no next action. Nothing here tells you who to call at 9am on Monday, and the encouragement at the end is filler that makes the brief longer without making it more useful.",
  },
  {
    label: "the bulk instruction",
    body: "Follow up with everyone who hasn't responded in the last two weeks.",
    why: "This is a task list disguised as a plan, and it will not happen. Eleven people, no order, no purpose per call. The prompt bans bulk actions for this reason — every line has to name one person and one reason.",
  },
  {
    label: "the invented reason",
    body: "Daniel R. has likely lost interest due to rising rates and may be waiting for prices to soften.",
    why: "Nothing in the notes says that. The model built a plausible story from market knowledge, and now you call Daniel on Monday holding a theory nobody gave you. Missing signal has to read as missing signal.",
  },
];

export default function PromptSundayPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={6} guideAnchor="#routine" />

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
            Sunday, 9 PM.
            <br />
            <span
              style={{
                background: "#2563EB",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Still scrolling your pipeline?
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Forty names open, and three of them actually matter tomorrow.
            Scrolling does not tell you which three — it just costs you the
            evening and hands Monday to whoever texts you first. Sunday dread
            is a missing routine, not a missing CRM.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>6-min read</span>
            <span aria-hidden>·</span>
            <span>Updated August 2026</span>
            <span aria-hidden>·</span>
            <span>keyword SUNDAY · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>sunday_brief.txt — preview</span>
              <span className="hidden sm:inline">10 min · 8 calls</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Monday's calls
1. Omar A. — counter expires Tuesday, get a
   yes/no on 3.05M today — KEEP
2. Aisha K. — you owe her 3 options near
   GEMS — KEEP
3. Daniel R. — still buying before Q3 2027?
   — NUDGE
8. M. Haddad — three months, no viewing
   booked — DROP`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ranked by what expires, not by what is loudest. One drop, every
              week, on purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          What the scroll is actually for.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The Sunday pipeline scroll is an anxiety ritual wearing the costume
            of preparation. You are not looking for information — you already
            know most of what is in there. You are looking for permission to
            stop thinking about work, and a list of forty open names will never
            give it to you, because there is always one more you could have
            checked.
          </p>
          <p>
            A brief gives permission, because it terminates. Three blocks of
            fact, one ranked call list, one decision — and then there is
            genuinely nothing left to look at. The pipeline did not get
            smaller. Sunday did.
          </p>
          <p>
            The routine matters more than the tool. Agents who run this with a
            paper notebook get most of the benefit; the prompt below just makes
            it fast enough that you keep doing it in week six, which is where
            almost every review habit dies.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The pipeline didn&apos;t get smaller. Sunday did.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Rules */}
      <section id="routine" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the routine"
          title="Five rules that keep it under ten minutes."
          description="A weekly review fails in one of two ways: it produces observations instead of calls, or it takes long enough that you skip it by week three. Each rule below blocks one of those."
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

      {/* Input */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="What you feed it."
          description="Your active list with whatever you have — export it, paste it, or dictate it. The one field worth being honest about is monday_capacity: put the number of calls you will actually make, not the number you wish you would."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">sunday_input.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy input" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* Prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt"
          title="What to feed Claude."
          description="System prompt in a new chat, your list as the first message. Ten minutes, standing in the kitchen — laptop optional."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">sunday_brief_system_prompt.md</span>
            <CopyButton text={SUNDAY_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SUNDAY_PROMPT}
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
            Yours to keep — Lumi or your own tab. For the longer end-of-week
            version, see the{" "}
            <a
              href="/prompt-weekly-review"
              className="text-indigo-600 underline underline-offset-2"
            >
              weekly review pack
            </a>
            .
          </p>
        </div>
      </section>

      {/* Output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="list in · brief out"
          title="What comes back."
          description="Under 300 words, four blocks, finishable. Every yes from the call list goes straight onto Monday's calendar — that step is manual and it is the point."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · sunday brief
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Anti-patterns */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="anti-patterns"
          title="Three briefs that waste the ten minutes."
          description="What the model produces when the constraints come off — and what most CRM 'weekly summary' features already send you."
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

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the Sunday brief"
          headlinePrimary="Reading the brief takes ten minutes."
          headlineAccent="Having one to read is the hard part."
        />
      </div>

      {/* Footnote */}
      <PackFootnote
        keyword="SUNDAY"
        origin={
          <>
            A real-estate adaptation of the weekly-review habit from personal
            productivity — with the two changes that make it survive contact
            with a pipeline: a fixed call count, and a mandatory drop.
          </>
        }
      />
    </div>
  );
}
