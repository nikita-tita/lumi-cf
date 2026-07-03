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
    "My CRM logs showings I forgot to log — because my phone caught me",
  description:
    "How real-estate agents use iOS geofencing to auto-log showing attendance, duration, and post-visit voice memos. The setup, the privacy stack, and the analytics most agents have never seen on their own behaviour.",
  openGraph: {
    title: "My phone knows when I'm at a showing. So does my CRM.",
    description:
      "Geofence + voice prompt at exit = zero manual logging. The setup, what gets captured, and the month-one analytics surprise.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "My CRM logs showings I forgot to log",
    description:
      "Geofence-driven showing capture. Setup + Claude prompt for voice memo extraction.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-arrival" },
};

const ARRIVAL_PROMPT = `You are a senior real-estate agent's
post-showing capture assistant.

INPUT
You receive: the property address, the
client present at the showing (from CRM
calendar event), the showing duration
(from geofence enter/exit timestamps),
and the agent's voice memo recorded
within 60 seconds of leaving the property.

OUTPUT
A structured capture object:

  showing_summary: <one sentence — what
                    happened, factual.>
  client_reaction: <one sentence — the
                    overall posture
                    (interested / lukewarm
                    / not for them).>
  soft_signals:    <array of 0-5 — pauses,
                    questions asked,
                    unprompted observations.>
  next_step:       <one sentence — concrete
                    follow-up with date or
                    trigger.>
  decision_group_update:
                  <one sentence — anything
                   new about who else is
                   involved.>

RULES (non-negotiable)
1. Voice memo is messy by design — the
   agent is walking back to the car. The
   prompt extracts structure; it doesn't
   require structured input.
2. Soft signals are gold — capture every
   one mentioned in the memo, plus any
   the agent referenced obliquely.
3. Showing duration is a signal:
   <8 min — almost certainly not interested
   8-25 min — engaged but not committed
   25+ min — strong interest, decision
             group probably forming
4. If the memo mentions the client by
   name, decision_group_update should
   reflect any other names mentioned.
5. Match the call-log schema (calls
   protocol) — the post-showing capture
   plugs into the same CRM brief
   structure.

ANTI-PATTERNS (never produce these)
- Inferring interest from duration alone
  (10-min showings can be hot; 40-min can
  be cold)
- Marking the showing complete in CRM
  before the agent has reviewed
- Auto-scheduling a follow-up without
  agent approval
- Voice memo errors propagating to CRM
  (always show the agent the extracted
  fields for review)`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "iOS geofence: 'Always' permission, 100m radius.",
    body: "iOS geofencing requires the 'Always' location permission — the agent grants this once at setup. The app registers a 100m radius around each showing's address (taken from the calendar event). When the agent's phone enters the radius during the calendar event window, the app fires a 'showing started' event. When it leaves, 'showing ended' fires with the elapsed duration. Permission is the friction; once granted, the system runs invisibly.",
  },
  {
    n: "02",
    title: "On exit, the app prompts a voice memo.",
    body: "60 seconds after the geofence exit, the phone vibrates with a soft prompt: 'Voice memo on Marina + Hugo at Murtais 24?'. The agent taps record on the lock screen, talks for 60-90 seconds while walking to the car, taps stop. No app to open, no form to fill — the prompt arrives at the right moment and the recording happens before memory has decayed.",
  },
  {
    n: "03",
    title: "Whisper transcribes within 30s. Claude extracts the 5 fields.",
    body: "Same pipeline as the call-log protocol — Whisper transcribes the voice memo, Claude extracts the structured capture. Use Sonnet for the soft-signal nuance; Haiku misses the unprompted observations that matter most. By the time the agent is back in the car, the structured capture is in their CRM with a 'review and approve' nudge.",
  },
  {
    n: "04",
    title: "Agent reviews + approves. Never auto-commit.",
    body: "The structured capture surfaces in a review queue, not directly in the CRM. The agent taps through 5 fields (12 seconds), edits or rejects any that misfire, taps approve. Auto-commit feels like a CRM that's making decisions on the agent's behalf — and any miscapture (which happens ~10% of the time on noisy memos) corrupts the brief permanently. Review-then-approve preserves trust.",
  },
  {
    n: "05",
    title: "Month-one analytics: showings logged vs. showings remembered.",
    body: "The first month of running the protocol produces a surprise: the gap between showings the agent thought they did and showings the geofence actually captured is usually 15-25%. Forgotten showings (especially second-look visits and walk-by drives that turned into impromptu showings) are now in the CRM with full context. The CRM is more accurate than memory — measurably so.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the auto-classifier",
    body: "showing_summary: 'Brief showing of 6 minutes — client clearly not interested.'",
    why: "Inferring interest from duration alone is wrong constantly. A 6-minute showing might mean the client knew within 30 seconds that the layout wasn't right (cold) or that the layout was perfect and they want to see it again with their spouse (hot). The voice memo tells you which; the duration alone doesn't.",
  },
  {
    label: "the silent commit",
    body: "[CRM update fired automatically without agent review]: 'Marina lukewarm on Murtais — auto-scheduled follow-up for Friday with similar listings.'",
    why: "Auto-committed without review. If the voice memo was misheard, the brief is now wrong and the auto-scheduled follow-up will land off-target. Worse: the agent didn't approve the next step, so when Friday's email goes out and embarrasses them, they distrust the whole system.",
  },
  {
    label: "the privacy leak",
    body: "[Default settings export geofence trail to Google Maps timeline visible to family-share members]",
    why: "Real failure mode: an agent's location history exposed to spouse's Google Family Sharing. Not the AI's fault, but the protocol's setup must explicitly disable family-share location export and explain the privacy boundary. Default-permissive settings turn a useful protocol into a domestic-trust accident.",
  },
];

export default function PromptArrivalPage() {
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
            My phone knows when
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
              I&apos;m at a showing.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents do 60-120 showings a quarter. Most agents log maybe
            70% of them — the rest fall through the cracks of busy days, last
            minute reschedules, walk-by drives that turn into impromptu
            tours. The data lost is exactly the data that&apos;s hardest to
            reconstruct later. Geofence-driven capture closes the gap
            without the agent doing anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 17 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>geofence · murtais 24 · 14m 22s</span>
              <span className="hidden sm:inline">auto-captured</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`enter:    11:02 · phone within 100m
exit:     11:16 · phone exits radius
duration: 14m 22s · engaged tier

[60s after exit, prompt fires]
  "Voice memo on Marina + Hugo at
   Murtais 24?"

[agent records 78s while walking to car]

[2m later, structured capture in CRM:]
  · soft signals: 4 captured
  · next_step: send fresh garden photo
  · decision_group: husband co-decider
  · review pending agent approval`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Geofence + voice memo + Whisper + Claude = a CRM update the
              agent didn&apos;t have to write. The agent reviews 5 fields
              and approves; the briefing is captured before memory decays.
            </p>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five steps. Setup once."
          description="The geofence runs invisibly after permission is granted. The voice memo prompt is the only point where the agent touches the system — and they touch it for 60-90 seconds, not 6 minutes of CRM data entry."
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
          title="Three failure modes that break trust."
          description="Each one has been a real failure in early adopter agents. The protocol's discipline is mostly in what NOT to automate."
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
          eyebrow="the prompt that captures it"
          title="What to feed Claude."
          description="The prompt that turns a 60-90s rambling voice memo into the 5-field structured capture. Plugs into the call-log schema for unified CRM updates across calls and showings."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">arrival_system_prompt.md</span>
            <CopyButton text={ARRIVAL_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{ARRIVAL_PROMPT}
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
            iOS Shortcuts or a thin wrapper app handles the geofence + voice
            memo prompt. Claude extracts; the agent reviews.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact geofence-capture protocol"
          headlinePrimary="Letting the phone catch you is step one."
          headlineAccent="Reviewing the 5 fields is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="ARRIVAL"
        origin={
          <>
            A real-estate adaptation of the ambient-capture pattern from
            sales-enablement and field-ops — capture at the moment data is
            freshest, not 4 hours later. Our slice: iOS geofence + voice
            memo at the showing exit, with the structured brief in the CRM
            before the agent reaches the car.
          </>
        }
      />
    </div>
  );
}
