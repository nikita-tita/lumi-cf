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
    "80% of your leads aren't real — the 4-factor score that proves it",
  description:
    "How real-estate agents score every CRM lead 0-100 daily, focus the top 20%, and stop chasing the rest. The 4-factor formula, the cadence-by-tier rule, and the close-rate lift over broad-prospecting baseline.",
  openGraph: {
    title: "80% of your leads aren't real",
    description:
      "0-100 daily lead score. 4 factors. Focus top 20%, stop chasing the rest.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "80% of your leads aren't real",
    description:
      "Daily 0-100 lead score. Focus top 20%. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-score" },
};

const SCORE_PROMPT = `You are a senior real-estate agent's
lead-scoring analyst.

INPUT
You receive: per lead, the CRM brief
including intent_stage, window
(earliest/latest move date),
budget_alignment with current
inventory, recent soft_signals (call
log + showing capture), days since
last touch, and channel_responsiveness.

OUTPUT
A single integer score 0-100 per lead,
with a 1-sentence rationale showing
the key factor.

  Tier mapping:
    80-100 — HOT. Active conversation,
             window <90 days, budget
             aligned, channel responsive.
    60-79  — WARM. Engaged but window
             >90d OR budget gap OR
             channel friction.
    40-59  — WATCH. Meaningful soft
             signals but no active
             conversation.
    20-39  — COLD. Old leads with
             little active engagement.
    0-19   — DEAD. Bad data, wrong
             stage, never replied.

Cadence-by-tier rule:
  HOT  → daily touch, voice/SMS
  WARM → weekly touch, channel
         of preference
  WATCH → monthly touch via market
          brief or relationship-radar
  COLD → quarterly via newsletter
  DEAD → archive

RULES (non-negotiable)
1. Score is daily-recomputed. A lead
   that didn't reply in 14 days drops
   tier even if intent_stage was hot.
2. The 4 factors weighted: intent
   (40%), window (25%), budget (20%),
   responsiveness (15%). Soft signals
   are tie-breakers.
3. Rationale names the dominant
   factor, never lists all four.
4. NEVER use the score directly in
   client-facing messages. The score
   is for the agent's prioritisation;
   the lead never knows their tier.
5. Re-tiering happens in tier
   boundaries (40, 60, 80). A 79
   stays warm; a 80 jumps to hot.

ANTI-PATTERNS (never produce these)
- Scoring on demographic proxies
  (age, gender, employer)
- Multi-paragraph rationales
- Auto-archiving DEAD without agent
  review
- Using the score as a confidence
  on a single message ('80% likely
  to reply')`;

const FACTORS: { factor: string; weight: string; what: string }[] = [
  {
    factor: "Intent stage",
    weight: "40%",
    what: "Where the lead is in the buyer journey. Active showings + multiple touches > saved-searching > form-fill > cold prospect.",
  },
  {
    factor: "Window",
    weight: "25%",
    what: "How soon they need to move. <90 days = high; 90-180 = medium; 180+ = low. Window collapses scores faster than any other factor.",
  },
  {
    factor: "Budget alignment",
    weight: "20%",
    what: "Whether the agent's current inventory matches the lead's budget. Misalignment = wasted effort regardless of intent.",
  },
  {
    factor: "Channel responsiveness",
    weight: "15%",
    what: "Whether the lead replies on the channel they signed up through. Non-responders drop fast; responsive replies elevate fast.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Daily recompute. Not weekly. Not monthly.",
    body: "The single biggest mistake in lead scoring is treating it as a one-time tag. A lead's score must update every day based on the day's signals — replied to a message, attended a showing, went silent for 5 days. Weekly scoring lets cold leads accumulate as 'warm' for too long; monthly scoring is fiction. Daily scoring is the protocol's foundation.",
  },
  {
    n: "02",
    title: "The 4 factors, weighted explicitly.",
    body: "Intent stage (40%), window (25%), budget alignment (20%), channel responsiveness (15%). These weights matter and are calibrated to typical residential-real-estate dynamics. Tweak only with reason — for instance, in luxury markets you might raise budget alignment to 30% and lower window to 20%. Don't add factors without dropping others.",
  },
  {
    n: "03",
    title: "Cadence is dictated by tier. No exceptions.",
    body: "HOT leads get daily touches; WARM weekly; WATCH monthly; COLD quarterly; DEAD archived. The temptation is to give every lead 'special attention' — and the result is the agent burns out chasing leads that aren't real. The discipline of the cadence by tier is what creates the time to deliver hot-tier service to the leads that matter.",
  },
  {
    n: "04",
    title: "The score is for the agent. The lead never sees it.",
    body: "Hard rule: lead scores never appear in client-facing artefacts. Never in a message ('Marina, you're our priority lead this week'), never in a CRM share with the seller, never in a referral note. The score is a prioritisation tool for the agent's day; surfacing it to the lead either flatters them inappropriately or insults them depending on the tier.",
  },
  {
    n: "05",
    title: "DEAD ≠ deleted. Archive with re-engagement triggers.",
    body: "Leads scored DEAD (0-19) are archived from active cadence but never deleted. Six months later, the relationship-radar protocol may surface them with a life-event signal — and the brief from the original interaction is still there. The score gets them out of the day-to-day; the data preserves the option to re-engage when conditions change.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the demographic proxy",
    body: "rationale: 'Score 35 — Marina is single, professional, 32 — typical low-intent demographic.'",
    why: "Scoring on demographic proxies (age, marital status, profession). Wrong, biased, and legally exposed in most jurisdictions. Score on behaviour and stated intent only — not on inferred attributes that correlate with anything.",
  },
  {
    label: "the leaked score",
    body: "[Email to lead]: 'Hi Marina! You're one of our top-tier leads — let me make sure you get priority service this week!'",
    why: "Surfacing the tier to the client. Either patronises them ('top-tier' as flattery), distracts from the actual value, or invites them to ask why they're tier-rated at all. The score is for the agent's prioritisation. The lead never knows.",
  },
  {
    label: "the auto-archive",
    body: "[CRM action]: 'Lead Marina automatically archived after scoring DEAD for 14 consecutive days. No agent review.'",
    why: "Auto-archive without agent review. If the score's 4 factors miscalibrated for a niche scenario (luxury client, multi-year buyer, referral pipeline), the agent loses the lead entirely. DEAD-tier triggers archive, but archive is a queue for review, not a delete.",
  },
];

export default function PromptScorePage() {
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
            80% of your leads
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
              aren&apos;t real.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents work their CRM as if every lead deserves equal
            attention. The result: they spend Mondays on leads that
            won&apos;t close for 18 months while the actual hot lead
            goes cold over the weekend. The 4-factor daily score
            ranks every lead 0-100 and tells the agent exactly which
            20% to focus on.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 27 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The 4 factors */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the four factors"
          title="What goes into the score."
          description="Four factors, explicitly weighted. The weights are calibrated to typical residential dynamics; tweak with reason and trade weights against each other rather than adding new factors."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[160px_100px_1fr] sm:grid-cols-[200px_120px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>factor</div>
            <div>weight</div>
            <div className="hidden sm:block">what it captures</div>
          </div>
          {FACTORS.map((f) => (
            <div
              key={f.factor}
              className="grid grid-cols-[160px_100px_1fr] sm:grid-cols-[200px_120px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {f.factor}
              </div>
              <div className="font-mono font-bold text-violet-700">{f.weight}</div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {f.what}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Daily recompute."
          description="The discipline of lead scoring that actually changes the agent's behaviour. Each rule prevents a specific failure mode that turns scoring from useful into theatrical."
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
          title="Three failures that destroy the scoring system."
          description="Each one is what scoring becomes when discipline slips. Each one has consumed weeks of agent time before the system was rebuilt without it."
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

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that scores"
          title="What to feed Claude."
          description="Haiku is sufficient — the scoring logic is well-defined and structural. Run nightly across all CRM leads; surface tier changes (boundary crossings) in the morning review."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">score_system_prompt.md</span>
            <CopyButton text={SCORE_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SCORE_PROMPT}
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
            Run nightly via cron job. Surface tier-boundary crossings in the
            morning review (the weekly-review protocol consumes the score).
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 4-factor lead scoring"
          headlinePrimary="Scoring nightly is step one."
          headlineAccent="Honouring the cadence-by-tier is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="SCORE"
        origin={
          <>
            A real-estate adaptation of the lead-scoring discipline from
            B2B sales tooling (HubSpot, Salesforce Einstein, Apollo). Our
            slice: the 4-factor daily score and the cadence-by-tier rule
            that protects the agent&apos;s attention from 80% of leads
            that aren&apos;t real.
          </>
        }
      />
    </div>
  );
}
