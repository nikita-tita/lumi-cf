import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { ClientsScreen } from "@/components/screens/ClientsScreen";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "Your CRM is an unfinished prompt — the 7-field brief for real-estate agents",
  description:
    "The 7-field client brief that turns your CRM from a database into a context layer for AI. Deep guide with examples, copy-paste templates, and a Claude prompt agents are using in 2026.",
  openGraph: {
    title: "The 7-field brief: turn your CRM into an AI context layer",
    description:
      "Most agents treat their CRM like storage. The ones who close more treat it like an unfinished prompt. Here's the exact 7-field template + the Claude prompt that uses it.",
    images: ["/prompt/hero.png"],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 7-field brief: turn your CRM into an AI context layer",
    description:
      "The CRM template real-estate agents are using to turn Claude into a second brain — full guide + copy-paste.",
    images: ["/prompt/hero.png"],
  },
  alternates: { canonical: "https://lumi.estate/prompt" },
};

const CLIENT_BRIEF_YAML = `# ── client brief · the 7 fields ───────────────────────
client:           "Sofia & Carlos Ferreira"
ig_or_referral:   "ref from Anna G., Q1 2026"

# 1 — INTENT STAGE
intent_stage:     "serious"
intent_marker:    "lease ends 2026-09-30,
                   has saved 4 listings"

# 2 — TIME-TO-MOVE WINDOW
window_earliest:  2026-07-01
window_latest:    2026-10-15
window_forcing:   "school start + lease end"

# 3 — HARD CONSTRAINTS
hard_constraints:
  - "3+ bedrooms (twins + nursery)"
  - "<40 min commute to Canary Wharf"
  - "ground floor (wheelchair parent)"
  - "no listed building"

# 4 — SOFT SIGNALS
soft_signals:
  - "paused at kitchen window —
     'this is where I'd make coffee'"
  - "asked twice if neighbours had kids"
  - "Sofia's mother lives in Estoril"

# 5 — BUDGET BAND
budget_comfortable: 450000  # EUR
budget_stretch:     520000
flex_conditions:
  - "south-facing garden"
  - "more than 60m² interior"
  - "no major renovation needed"

# 6 — DECISION GROUP
decision_group:
  shape:    "couple-one-decides"
  primary:  "Sofia"
  approver: "Carlos (financial sign-off)"
  tell:     "Carlos asks about commute &
             HOA fees last — when he
             stops asking, it's done"

# 7 — LAST MEANINGFUL TOUCH
last_touch:
  at:       2026-04-20 14:30
  channel:  "WhatsApp voice note"
  content:  "post-Rua-da-Prata follow-up"
  response: "loved balcony, worried about
             stairs for the kids"
  next:     "send 2 ground-floor + balcony
             options by Thu 14:00"
`;

const SYSTEM_PROMPT = `You are a senior real-estate agent's second brain.
Your inputs: a 7-field client brief.
Your outputs: short, specific, in the agent's voice.

RULES (non-negotiable)
1. Never invent facts not in the brief.
   Mark uncertain inferences as [unverified].
2. Match tone to intent_stage:
   browse  → informative, low-pressure
   serious → decisive, calendar-aware
   urgent  → calendar-first, short
3. Hard constraints are filters, not preferences.
   If a recommendation breaks one, name it explicitly
   ("this fails on commute by 12 min — flagging").
4. Reference at least one soft_signal in any
   client-facing message. Specific > generic.
5. Budget framing:
   - within comfortable: no caveat needed
   - between comfortable and stretch: name the
     stretch and which flex_condition it hits
   - above stretch: don't recommend unless the
     agent override-flagged it
6. Address messages to the decision_group.primary.
   When the answer requires the approver, say so.
7. Every output ends with the next concrete step,
   with a date or time. No "let me know".

Default response shape:
  - 1 line: framing
  - 2-4 lines: substance
  - 1 line: next step with date/time

Voice: warm, brief, no hype, no emoji.
`;

/* ============ Promo hero — full-screen, app pitch ============ */
function PromoHero() {
  return (
    <section
      className="relative isolate overflow-hidden min-h-[85vh] flex items-center"
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, rgba(37,99,235,0.22), transparent 60%), radial-gradient(120% 80% at 100% 100%, rgba(217,119,6,0.20), transparent 60%), linear-gradient(180deg, #0f0f14 0%, #1c1c28 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-12 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center py-16 sm:py-20 lg:py-24">
        <div>
          <div className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-indigo-300/80 font-mono mb-5">
            Lumi · private beta · EU · LatAm · MENA
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white">
            Your second brain
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60A5FA 0%, #60A5FA 50%, #FBBF24 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              for closing deals.
            </span>
          </h1>
          <p className="mt-6 sm:mt-7 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
            Speak after a showing. Forward an email. Pull up a client.
            Lumi captures the soft signals, fills the 7-field brief, and feeds Claude — automatically.
          </p>
          <ul className="mt-7 space-y-3 text-slate-300">
            {[
              "Voice → 7 fields, auto. No forms.",
              "Works offline. Syncs when you're back.",
              "Free for agents in EU · LatAm · MENA.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px]"
              style={{
                background:
                  "#2563EB",
              }}
            >
              Join the waitlist →
            </Link>
            <Link
              href="#fields"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold border border-slate-700 text-slate-200 hover:bg-slate-800/40 transition"
            >
              Read the field guide
            </Link>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-slate-500 font-mono">
            11-min read · Updated July 2026
          </p>
        </div>

        {/* Live phone mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <PhoneFrame>
            <ChatScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

/* ============ Bottom ad — full conversion block ============ */
function BottomAd() {
  return (
    <section className="relative isolate my-16 sm:my-20 min-h-[70vh] flex items-center">
      <div
        className="absolute inset-0 -z-10 rounded-[28px] sm:rounded-[36px]"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, rgba(37,99,235,0.22), transparent 60%), radial-gradient(120% 80% at 100% 100%, rgba(217,119,6,0.22), transparent 60%), linear-gradient(180deg, #0f0f14 0%, #1c1c28 100%)",
        }}
      />
      <div className="w-full px-6 sm:px-10 lg:px-14 py-14 sm:py-20 lg:py-24 rounded-[28px] sm:rounded-[36px] text-slate-100 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-indigo-300/80 font-mono mb-5">
            built around this exact workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.1] tracking-tight">
            Reading this template is step one.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60A5FA 0%, #60A5FA 50%, #FBBF24 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Living inside it is step two.
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Lumi is the app that <em className="font-display not-italic text-slate-100">is</em> this template. You speak after a showing — Lumi captures the soft signals. You forward an email — Lumi updates the constraints. You pull up a client — the brief is already there, ready to feed Claude.
          </p>
          <ul className="mt-7 space-y-3 text-slate-300">
            {[
              "Voice → 7 fields, automatically",
              "No forms. No CRM data entry.",
              "Free for agents in EU · LatAm · MENA",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px]"
              style={{
                background:
                  "#2563EB",
              }}
            >
              Join the waitlist
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base sm:text-lg font-semibold border border-slate-700 text-slate-200 hover:bg-slate-800/40 transition"
            >
              See how it works
            </Link>
          </div>
        </div>
        <div className="relative flex flex-wrap justify-center items-start gap-6 lg:gap-8">
          <div className="lg:-mt-6">
            <PhoneFrame>
              <ChatScreen />
            </PhoneFrame>
          </div>
          <div className="hidden md:block lg:mt-10">
            <PhoneFrame>
              <ClientsScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Field block (reused for each of the 7) ============ */
type FieldProps = {
  index: number;
  title: string;
  oneLine: string;
  capture: string;
  format: string;
  why: string;
  mistake: string;
  unlock: string;
};

function FieldBlock({
  index,
  title,
  oneLine,
  capture,
  format,
  why,
  mistake,
  unlock,
}: FieldProps) {
  return (
    <article
      id={`field-${index}`}
      className="scroll-mt-24 grid lg:grid-cols-[88px_1fr] gap-4 lg:gap-8 py-10 sm:py-14 border-t border-slate-200"
    >
      <div className="flex lg:flex-col items-center lg:items-start gap-3">
        <div
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-xl lg:text-2xl font-mono font-semibold text-white shadow-md"
          style={{
            background:
              "#2563EB",
          }}
        >
          {String(index).padStart(2, "0")}
        </div>
        <div className="text-[11px] tracking-[0.18em] uppercase text-slate-400 font-mono">
          field {index} / 7
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
          {oneLine}
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
              what to capture
            </div>
            <p className="mt-2 text-[15px] text-slate-800 leading-relaxed">
              {capture}
            </p>
          </div>
          <div className="relative rounded-2xl border border-slate-200 bg-white p-5">
            <div className="absolute top-3 right-3">
              <CopyButton text={format} variant="icon" label="Copy snippet" />
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-violet-600 font-mono font-semibold pr-10">
              format & example
            </div>
            <pre className="mt-2 text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">
              {format}
            </pre>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-pink-300 font-mono font-semibold">
            why it matters
          </div>
          <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-slate-200">
            {why}
          </p>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-amber-700 font-mono font-semibold">
              common mistake
            </div>
            <p className="mt-2 text-[15px] text-slate-800 leading-relaxed">
              {mistake}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-5">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-emerald-700 font-mono font-semibold">
              what this unlocks for AI
            </div>
            <p className="mt-2 text-[15px] text-slate-800 leading-relaxed">
              {unlock}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============ Page ============ */
export default function PromptPage() {
  const FIELDS: FieldProps[] = [
    {
      index: 1,
      title: "Intent stage",
      oneLine:
        "Where this person actually sits on the ladder from window-shopping to must-move. Not a vibe — a discrete level with behavioural markers.",
      capture:
        "One of three levels — Browse, Serious, Urgent — plus the marker that put them there. Re-evaluate after every meaningful contact (it changes).",
      format:
        '// 3 levels\nbrowse   → no timeline, vague reqs,\n           Saturday-habit replies\nserious  → has a checklist, replies\n           within 24h, asks process Qs\nurgent   → forcing function exists\n           (lease end, job, divorce)\n\n// example\nintent_stage: "serious"\nintent_marker: "lease ends 2026-09-30,\n              has saved 4 listings already"',
      why: "Intent drives every other decision: tone, cadence, channel, how many listings to send, whether to push for pre-approval today. Treating a Browse client like a Serious one burns out your follow-up cadence; treating an Urgent client like a Serious one loses them to whoever called back first.",
      mistake:
        "Marking everyone as 'serious' because it's the flattering assumption. In reality ~60% of new leads are Browse-mode. Be honest. Browse-mode clients are valuable — they convert in 6-18 months — but only if you don't burn them out with weekly nudges.",
      unlock:
        "Claude can write three completely different message tones (informative for Browse, decisive for Serious, calendar-first for Urgent) — but only if it knows which one you're talking to. Without this field, every AI draft regresses to the safe middle and reads as generic.",
    },
    {
      index: 2,
      title: "Time-to-move window",
      oneLine:
        "Two dates and a forcing function. Not 'soon', not '6 months' — actual edges of the window and the reason it exists.",
      capture:
        "Earliest possible move date, latest possible move date, and what's forcing the window (school start, lease end, baby due, transfer). All three.",
      format:
        'window_earliest: 2026-07-01\nwindow_latest:   2026-10-15\nwindow_forcing:  "school start + lease ends 09-30"',
      why: "Determines urgency of showings, when to push for pre-approval, when to stop sending new inventory, and when to start a follow-up cadence around 'we know your window is closing'. Without dates, AI defaults to vague urgency that reads as pressure.",
      mistake:
        "Capturing only the latest date. The forcing function predicts behaviour — clients with a job-start trigger move 2x faster than clients with a 'we'd like to' trigger, even with the same end date.",
      unlock:
        "Claude can write 'we have 8 weeks before your lease ends — here's what we should hit by week 4' messages. Specific, calendar-aware, low-pressure. The window field is what makes the math possible.",
    },
    {
      index: 3,
      title: "Hard constraints",
      oneLine:
        "Non-negotiables only. The list of things that, if missing, will kill the deal — not a wish-list of 'nice to haves'.",
      capture:
        "3-7 items max. Each one with the reason. The reason is what tells Claude (and you) when a near-miss listing is worth pushing.",
      format:
        'hard_constraints:\n  - "3+ bedrooms (twins + nursery)"\n  - "<40 min commute to Canary Wharf"\n  - "ground floor (wheelchair parent)"\n  - "no listed building (renovation needed)"',
      why: "An AI draft that recommends a 2-bed duplex to a family of four is an instant trust-killer. The hard-constraint list is what filters the listing universe before AI even drafts the message. Get this wrong and every recommendation feels off.",
      mistake:
        "Mixing hard constraints with preferences. 'Would prefer south-facing' is not a hard constraint. The test: would they walk away from an otherwise perfect place because of this? If no, it's a preference. Move it elsewhere.",
      unlock:
        "Claude can rank inbound listings against the constraint list before you see them, surface only the matches, and explain near-misses with honest framing ('this one fails on commute by 12 min — worth it because of the garden?'). Saves ~2h/week on listing triage.",
    },
    {
      index: 4,
      title: "Soft signals",
      oneLine:
        "What they said or did that revealed underlying motivation. The thing you'd tell your partner about at dinner. This is the highest-signal field on the brief.",
      capture:
        "Verbatim quotes when possible. Body-language observations. Reactions to specific rooms or features. Things they asked twice. Things they paused on. Things they told you about themselves that they didn't have to.",
      format:
        'soft_signals:\n  - "paused at the kitchen window —\n     said \\"this is where I\'d make coffee\\""\n  - "both spouses looked at each other\n     when we saw the spare bedroom"\n  - "asked twice if neighbours had kids"\n  - "told me her mother lives in Estoril"',
      why: "This is the field that separates 'competent assistant' from 'that agent gets me'. When your follow-up references the kitchen window, the buyer feels seen — not sold to. Most agents don't write this down because it feels too vague or too personal. That's exactly why it works when you do.",
      mistake:
        "Skipping it because 'I'll remember'. You won't. Three showings later, the soft signals from showing 1 are gone. Voice-note them on the walk back to your car — 30 seconds, before context decays.",
      unlock:
        "Claude turns soft signals into specific reactivation lines: 'Saw a place this morning with the same kind of kitchen window you liked at the Gaspar showing — want me to pull it?' Specific. Personal. Not about the house. The 7-day silent buyer plays this card best.",
    },
    {
      index: 5,
      title: "Budget — comfortable + stretch",
      oneLine:
        "Two numbers, not one. The realistic ceiling and the absolute ceiling. Plus the conditions under which they'd stretch.",
      capture:
        "What they said when you first asked, what they actually approved with the bank, and what they'd pay if a place hit specific notes (garden, top floor, original details). The middle number alone is misleading.",
      format:
        'budget_comfortable: 450000\nbudget_stretch:     520000\nflex_conditions:\n  - "south-facing garden"\n  - "more than 60m² interior"\n  - "no major renovation needed"\ncurrency: EUR\nfinanced: true (mortgage pre-approved)',
      why: "Most clients quote ~20% below their stretch on the first call. If you only capture that number, you ghost them out of properties they would have bought. Two numbers + conditions lets you send 500-530k listings with honest framing: 'slightly above the comfortable line, but I think it's worth a look because it hits two of your stretch conditions.'",
      mistake:
        "Capturing only the first number they said. Or treating the stretch number as a secret. Or losing the conditions — you remember the price ceiling but forget that it only stretches if there's a garden.",
      unlock:
        "Claude can write 'slightly above your comfortable line but here's why' messages that are persuasive without pushy. Without the conditions, every above-budget listing recommendation lands as 'agent doesn't respect my budget'.",
    },
    {
      index: 6,
      title: "Decision group",
      oneLine:
        "Who actually decides — not who you talk to. The shape of the decision, the people involved, and how they weigh in.",
      capture:
        "One of: solo · couple-joint · couple-one-decides · family · guided (parents helping first-time buyer) · committee. Plus the names and roles. Plus the tell — what's the signal that the real decider has approved?",
      format:
        'decision_group:\n  shape: "couple-one-decides"\n  primary: "Sofia"\n  approver: "Carlos (financial sign-off)"\n  tell: "Carlos always asks about\n        commute and HOA fees last —\n        when he stops asking, it\'s done"',
      why: "Decides whom to cc on the first email, whose schedule you optimise for showings, whose questions you preempt, and which spouse's hesitation kills the deal. Most agents assume husband = decider in hetero couples. Wrong 60%+ of the time. Default to 'unknown' and watch.",
      mistake:
        "Tailoring everything to whoever is the loudest in the conversation. The loud one is often not the decider — they're the buffer. Watch for who the loud one looks at when a question lands.",
      unlock:
        "Claude can write parallel versions of the same update — one optimised for the primary's emotional language, one optimised for the approver's analytical language. Sent at the right time, to the right inbox.",
    },
    {
      index: 7,
      title: "Last meaningful touch",
      oneLine:
        "The one field that gets the least attention and matters the most for AI. Timestamp + medium + content + outcome + the next promised step.",
      capture:
        "When you last actually moved the relationship forward (not 'sent listings' — those don't count). What you said. What they said back. What you committed to do next, with a date.",
      format:
        'last_touch:\n  at:       2026-04-20 14:30\n  channel:  "WhatsApp voice note"\n  content:  "follow-up after Rua da Prata\n             showing — flagged the stairs"\n  response: "loved balcony, worried about\n             second-floor stairs for kids"\n  next:     "send 2 ground-floor + balcony\n             options by Thursday 14:00"',
      why: "This is the context for every future message. AI without it writes generic. AI with it writes 'wanted to follow up on the balcony question — here are two ground-floor options I think you'll like'. The whole follow-up game runs on this field.",
      mistake:
        "Logging 'sent follow-up' without the content. Or logging the content without the outcome. Or — most common — logging the exchange but not the next step you committed to. That's the breach of trust agents don't realise they're committing.",
      unlock:
        "Claude can write the next message in the thread, in your voice, that picks up exactly where you left off. The 'I'll send you 2 thoughts tomorrow at 10' commitment becomes a calendar reminder, a draft message at 9:55, and a sent follow-up at 10:00 sharp.",
    },
  ];

  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PromoHero />

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
            Your CRM is not a database.
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
              It's an unfinished prompt.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most real-estate agents treat their CRM like storage. Names, phone
            numbers, a checkbox or two. The agents who close more in 2026 treat it
            differently — as the <em className="font-display not-italic">context layer</em>{" "}
            their AI draws from every time it writes a message, books a showing, or
            preps a meeting. This is the 7-field brief they're using.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>11-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>From the carousel · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>client_brief.yaml — preview</span>
              <span className="hidden sm:inline">7 fields</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre">
{`intent_stage:     "serious"
window_forcing:   "school start + lease end"
hard_constraints:
  - "3+ bedrooms (twins + nursery)"
  - "<40 min commute, ground floor"
soft_signals:
  - "paused at the kitchen window"
budget:           450k → 520k EUR
last_touch:       2026-04-20  ·  WhatsApp voice`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              The 7 fields below — what to write, why, and the Claude prompt that reads them.
            </p>
          </div>
        </div>
      </section>

      {/* The reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          The reframe.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Every empty field in your CRM is a missing ingredient in the prompt your
            AI runs every time you ask it to draft a message, summarise a deal, or
            decide what's next. AI doesn't fail because the model is weak. It fails
            because the brief is incomplete.
          </p>
          <p>
            The shift happening in 2026 is quiet but consequential: top agents have
            stopped treating the CRM as <em className="font-display not-italic">where data goes to die</em>{" "}
            and started treating it as <em className="font-display not-italic">the prompt that runs the day</em>.
            They fill it in obsessively, with specific language, because they know
            every line they write becomes a line their AI quotes back to them in 48
            hours.
          </p>
          <p>
            The 7 fields below are the minimum viable context layer. None of them
            require a new tool — every modern CRM has a notes field. What changes is
            what goes inside.
          </p>
        </div>

        {/* Pull quote */}
        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The agents who win in 2026 don&apos;t have better CRMs. They have
            briefs that AI can actually read.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The 7 fields */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            the brief
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
            The 7 fields.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Each one with what to capture, the format that works, why it matters,
            the most common mistake, and what it unlocks for your AI. Read in
            order — they build on each other.
          </p>
        </div>
        {FIELDS.map((f) => (
          <FieldBlock key={f.index} {...f} />
        ))}
      </section>

      {/* Copy-paste template */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            copy · paste
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            The template.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Drop this into a Notion page, a Follow Up Boss custom-fields block, a
            kvCORE note, or a Google Doc per client. Field order matters — Claude
            reads top to bottom.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">client_brief.yaml</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">v1 · 2026-04</span>
              <CopyButton text={CLIENT_BRIEF_YAML} label="Copy template" />
            </div>
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{CLIENT_BRIEF_YAML}
          </pre>
        </div>
      </section>

      {/* Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            the prompt that uses it
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            What to feed Claude.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            This is the system prompt that turns the brief into useful output. Tested
            against Claude Haiku and Sonnet — works on either. Feed the brief as the
            user message; ask the question at the end.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">system_prompt.md</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">tested · April 2026</span>
              <CopyButton text={SYSTEM_PROMPT} label="Copy prompt" />
            </div>
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SYSTEM_PROMPT}
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
            Copy the prompt above, open Claude, paste into a new chat as a system message,
            then send the brief as your first user message.
          </p>
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            same client · same week
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            Before vs. after the brief.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Same buyer. Same week. Same prompt: <em className="font-display not-italic">&ldquo;draft a follow-up after the showing&rdquo;</em>. The only thing that changes is what AI has to work with.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-100 p-6 ring-1 ring-slate-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-mono font-semibold">
              before · empty CRM
            </div>
            <p className="mt-3 text-[15px] text-slate-700 leading-relaxed italic">
              &ldquo;Hi Sofia! Thanks again for taking the time to see the apartment yesterday. It was a beautiful property, wasn't it? Let me know if you have any questions and we can definitely look at more options. Looking forward to hearing from you!&rdquo;
            </p>
            <div className="mt-4 text-xs text-slate-500">
              Generic. Not bad — just unmemorable. The buyer reads it as a template and doesn't reply for 9 days.
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-6 ring-1 ring-violet-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
              after · brief filled
            </div>
            <p className="mt-3 text-[15px] text-slate-800 leading-relaxed italic">
              &ldquo;Sofia — quick one. The Rua da Prata stairs were on your mind, fairly. I've pulled two ground-floor options with balconies (one of them in the same area as your mother's place in Estoril, by the way). Slightly above the comfortable line on the second one, but it has the south-facing garden you mentioned. Sending both Thursday by 14:00 like I said. — A.&rdquo;
            </p>
            <div className="mt-4 text-xs text-violet-700">
              Specific. References two soft signals. Honest about budget. Names the next step. Buyer replies in 90 minutes.
            </div>
          </div>
        </div>
      </section>

      {/* Minimum viable brief */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            if you only have 5 min
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            The minimum viable brief.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            You don't have time to fill all seven for every client today. Fine. The 80/20 is three:
          </p>
        </div>

        <ol className="mt-8 space-y-4">
          {[
            {
              n: "1",
              title: "Intent stage",
              body: "Without it, every AI message tone is wrong. Spend 30 seconds on this one alone.",
            },
            {
              n: "2",
              title: "Window + forcing function",
              body: "The math your AI uses to write urgency-aware copy. Two dates and a sentence.",
            },
            {
              n: "3",
              title: "Last meaningful touch (with next step)",
              body: "Without this, you're starting every conversation from scratch. Even if the field has nothing else, this one carries the relationship.",
            },
          ].map((item) => (
            <li
              key={item.n}
              className="flex gap-4 sm:gap-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6"
            >
              <div
                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono font-semibold text-white"
                style={{
                  background:
                    "#2563EB",
                }}
              >
                {item.n}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">
                  {item.title}
                </h4>
                <p className="mt-1 text-slate-600 leading-relaxed text-[15px]">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-base text-slate-700 leading-relaxed">
          Add fields 3-6 over the next two weeks. By the end of the month every active client has a complete brief, and you've stopped writing follow-ups from a blank page.
        </p>
      </section>

      {/* Weekend retrofit */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="border-t border-slate-200 pt-12 sm:pt-16">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            the weekend exercise
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
            Retrofit your top 20.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            One sitting. ~90 minutes. Open your top 20 active clients and fill the brief — what you remember, marked <code className="text-[13px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">[from memory]</code> where you're inferring.
          </p>
        </div>

        <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          Two things will happen:
        </p>
        <ul className="mt-4 space-y-3 text-[15px] sm:text-base text-slate-700">
          <li className="flex items-start gap-3">
            <span className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span>
              About a third of the clients you thought were &ldquo;waiting&rdquo; will reveal themselves as Browse-mode. <strong className="text-slate-900">Stop nudging them weekly.</strong> Move them to a slow cadence (one quality touch every 6-8 weeks). You'll get hours back.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
            <span>
              About a quarter of them are <strong className="text-slate-900">more urgent than you remembered</strong> — there's a forcing function in their window you didn't capture. Call them today. Some are 6 weeks from a deal you didn't know was happening.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
            <span>
              The rest will surface as &ldquo;I have no idea what's actually going on with this person&rdquo;. <strong className="text-slate-900">Reach out with one specific question</strong> — not a generic check-in. The brief will tell you which question to ask.
            </span>
          </li>
        </ul>

        <p className="mt-8 text-base sm:text-lg text-slate-700 leading-relaxed">
          That single weekend tends to shift more deals than three months of new-lead sourcing.
        </p>
      </section>

      {/* Bottom ad — full conversion block */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <BottomAd />
      </div>

      {/* Closing footnote */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
        <div className="border-t border-slate-200 pt-10 text-sm text-slate-500 leading-relaxed">
          <p>
            A real-estate adaptation of Greg Isenberg&apos;s &ldquo;CRM is an
            unfinished prompt&rdquo; thesis. Our slice: turning the 7-field
            client brief into the context layer Claude reads on every message.
          </p>
          <p className="mt-3">
            More guides like this on{" "}
            <a
              href="https://www.instagram.com/lumi.estate"
              className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              @lumi.estate
            </a>
            . Follow if any of this was useful — it&apos;s how we know to keep
            writing.
          </p>
        </div>
      </section>
    </div>
  );
}
