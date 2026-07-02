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
    "The 60-second prep brief — what top agents read before every meeting",
  description:
    "The auto-generated 60-second prep brief that fires 30 minutes before each calendar event. Four bullets that turn an unstructured CRM into a meeting you walk into informed. Full guide + Claude prompt + scheduling rules.",
  openGraph: {
    title: "The 60-second prep brief that fires before every meeting",
    description:
      "Stop reading CRM records. The 4-bullet brief that auto-generates 30 minutes before each meeting — and the prompt that writes it.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 60-second prep brief.",
    description:
      "30 minutes before each meeting, AI surfaces the 4 bullets that matter. Here's how the protocol works.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-prep-brief" },
};

const PREP_BRIEF_PROMPT = `You are a real-estate agent's pre-meeting briefer.

INPUT
You will receive a structured snapshot of one
upcoming meeting:
  - calendar_event: { title, start, location,
                      attendees, type }
  - client_brief:   the 7-field YAML brief
  - last_5_msgs:    most recent agent ↔ client
                    messages (any channel)
  - listings_shown: properties shared in last
                    14 days
  - open_objections: items the agent flagged
                     as unresolved
  - market_context: relevant comp activity in
                    the agent's farm zip in the
                    last 7 days (optional)

OUTPUT
A 4-bullet brief, plain text, ready to read in
60 seconds. Audio-friendly (no markdown, no
parentheticals, no asterisks).

STRUCTURE — exactly 4 bullets, in this order:

  Bullet 1 · Where they are.
    One sentence on intent_stage + window
    + the soft signal they're sitting on.
    Example: "Serious. Lease ends Sept 30.
    Still thinking about the kitchen window
    at Rua da Prata."

  Bullet 2 · What changed since you last spoke.
    One sentence on what's new — a market move,
    a listing they saw, a message they sent.
    If nothing changed, say so honestly.
    Example: "Carlos asked about HOA fees on
    Friday. You haven't sent the answer yet."

  Bullet 3 · The one open loop.
    The single most important unresolved item.
    Not a list — pick one. The agent will
    handle the rest in the meeting.
    Example: "School catchment for the twins —
    they didn't ask, but it'll come up today."

  Bullet 4 · The next step you should leave with.
    The concrete commitment to make BEFORE
    the meeting ends. With a date.
    Example: "Lock the Saturday 11am viewing
    at the ground-floor Lapa option."

RULES (non-negotiable)
1. Each bullet is ONE sentence. Maximum 18
   words. Audio-readable in 4 seconds.
2. Use the client's name once, in bullet 1.
   Don't repeat it.
3. Reference soft_signals verbatim where they
   exist. Don't paraphrase.
4. If a bullet's data is missing, say so —
   don't invent. "No new messages since
   Monday" is signal.
5. Sign off with: "Read at <X>. Meeting at <Y>."
   so the agent knows exactly when this was
   generated.

Voice: clinical, brief, calm. The agent is
walking into a room — they need oxygen, not
a lecture.`;

const EXAMPLE_BRIEF_OUTPUT = `Sofia & Carlos — 14:30, Café A Brasileira

  - Serious. Lease ends Sept 30. Still
    sitting on the kitchen window at
    Rua da Prata.

  - Carlos asked about HOA fees on Friday.
    You haven't sent the answer yet.

  - School catchment for the twins — they
    didn't ask last time but it'll come up.

  - Lock the Saturday 11am viewing at
    the ground-floor Lapa option.

Read at 14:00. Meeting at 14:30.`;

const TRIGGER_TIMING: { time: string; what: string }[] = [
  {
    time: "T-30 min",
    what: "Brief auto-generates. Push notification sent. Audio version queued in your Lumi inbox.",
  },
  {
    time: "T-25 min",
    what: "Optimal listening window. Drive time, walk to coffee shop, between meetings.",
  },
  {
    time: "T-10 min",
    what: "Backup glance. If you missed the audio, the 4 bullets fit on one screen.",
  },
  {
    time: "T-0",
    what: "Walk in informed. Open loop is on top of mind. Next-step is pre-decided.",
  },
  {
    time: "T+5 min after",
    what: "Voice memo on the walk back updates the brief for next meeting (3-min protocol).",
  },
];

const FOUR_BULLET_RATIONALE: { bullet: string; why: string }[] = [
  {
    bullet: "Bullet 1 · Where they are",
    why: "Anchors your tone. Browse vs. serious vs. urgent dictates whether you push for pre-approval today, soft-pitch a viewing, or hold space for thinking. Without this anchor every meeting starts with a tone-recalibration that wastes the first 90 seconds.",
  },
  {
    bullet: "Bullet 2 · What changed",
    why: "Most meetings stall in the first 2 minutes because the agent walks in unaware of what the client did since their last touch — looked at competitor listings, talked to their lender, told their spouse. The 'what changed' bullet preempts the awkward 'so where are we' opener.",
  },
  {
    bullet: "Bullet 3 · The one open loop",
    why: "The single field that turns a transactional meeting into a relational one. The agent who brings up the school catchment before the buyer does signals two things at once: I was paying attention, and I'm thinking ahead of you. That's the close-rate move.",
  },
  {
    bullet: "Bullet 4 · The next step you should leave with",
    why: "Pre-decided in the brief, not invented in the room. The biggest mistake agents make in meetings is leaving with a vague 'I'll be in touch' — because they didn't decide ahead of time what concrete commitment they wanted from this meeting. The brief makes the commitment explicit before you walk in.",
  },
];

const SCHEDULING_RULES: { rule: string; body: string }[] = [
  {
    rule: "30 minutes before — not less.",
    body: "Less than 30 min and you don't have a clean listening window before the meeting. The brief that fires at T-5 lands when you're already walking in — too late to internalise.",
  },
  {
    rule: "Audio first. Text second.",
    body: "The brief is designed to be heard, not read. Audio means you can absorb it during the drive, walk, or coffee — without a screen between you and the meeting. The text version is the fallback if you missed the audio.",
  },
  {
    rule: "Skip events shorter than 15 minutes.",
    body: "Quick check-ins, drop-bys, signature meetings — no brief. The protocol applies to meetings where agent leverage matters: showings, listing appointments, decision conversations. Filtering matters or the noise dilutes the signal.",
  },
  {
    rule: "Quiet hours apply.",
    body: "If you have a meeting at 8am Monday, the T-30 push at 7:30 is fine. If your first event is at 6am, the T-30 push at 5:30 is not fine. Quiet-hour respect is configurable; don't skip it. Brief gets read silently when you wake up.",
  },
];

export default function PromptPrepBriefPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#brief" />

      {/* Field-guide intro */}
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
            The 60-second
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
              prep brief.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The most expensive minute in an agent&apos;s week is the one before each
            meeting where they realise they don&apos;t remember what was said last
            time. The 60-second brief makes that minute disappear. Four bullets,
            audio-readable, fired 30 minutes before each calendar event. Walk in
            informed. Every time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 16 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>brief_14_30.txt — example output</span>
              <span className="hidden sm:inline">read in 60 seconds</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{EXAMPLE_BRIEF_OUTPUT}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Four bullets. 18-word sentences. Audio version arrives 30 minutes
              before each meeting.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          Why CRM-reading is the bottleneck.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Most agents have a moment, somewhere between leaving the previous
            meeting and walking into the next, where they pull out their phone,
            open the CRM, and try to absorb 6 weeks of history in 90 seconds. They
            scan a notes field. They look at the last activity log. They guess at
            what to bring up first. Then they walk in and start the meeting in
            recovery mode.
          </p>
          <p>
            The reason this happens is not laziness — it&apos;s that CRM records
            are formatted for archival, not for retrieval. They&apos;re databases
            optimised for storing everything; they&apos;re not optimised for
            answering the one question that matters in the 60 seconds before a
            meeting: <em className="font-display not-italic">what do I need to
            walk in knowing?</em>
          </p>
          <p>
            The 60-second brief is the answer-in-form. Four bullets. Pre-computed.
            Pushed to your inbox 30 minutes before the meeting starts. The CRM is
            still the source of truth — but you stop reading it. The brief reads it
            for you and surfaces the four things that actually matter for this
            specific meeting with this specific person.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;CRMs are optimised for storage. Briefs are optimised for the 60
            seconds before a meeting. Different formats. Different jobs.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The four bullets */}
      <section id="brief" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the structure"
          title="Four bullets. Each one earns its place."
          description="The brief is a discipline, not a template. Each bullet exists because it answers a question the agent would otherwise spend the first 2 minutes of the meeting answering for themselves."
        />

        <div className="mt-10 space-y-5">
          {FOUR_BULLET_RATIONALE.map((b, i) => (
            <div
              key={b.bullet}
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
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                  {b.bullet}
                </h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-600 leading-relaxed">
                  {b.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timing */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <PackSectionHeader
          eyebrow="when it fires"
          title="The 30-minute clock."
          description="The trigger timing is part of the protocol. Earlier than 30 min and the brief is stale by meeting time; later and you don't have a quiet listening window."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {TRIGGER_TIMING.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold pt-0.5">
                {row.time}
              </div>
              <div className="text-slate-700 leading-relaxed">{row.what}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scheduling rules */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="four rules that make it work"
          title="The protocol's small-print."
          description="Each rule is a discovered constraint — break it for two weeks and the protocol degrades to noise."
        />

        <div className="mt-8 space-y-4">
          {SCHEDULING_RULES.map((s) => (
            <div
              key={s.rule}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                {s.rule}
              </h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that writes it"
          title="What to feed Claude."
          description="The system prompt that turns calendar + CRM + last-touch into the 4-bullet brief. Tested against Claude Haiku — generates in under 4 seconds end-to-end, low enough latency to fire reliably 30 min before any meeting."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">prep_brief_system_prompt.md</span>
            <CopyButton text={PREP_BRIEF_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{PREP_BRIEF_PROMPT}
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
            Copy the system prompt above into a new Claude chat as a system message,
            then paste the meeting snapshot as your first user message.
          </p>
        </div>
      </section>

      {/* Before / after */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="same meeting · same client"
          title="Before vs. after the brief."
          description="What the agent walks in carrying — the difference between starting in recovery mode and starting in command mode."
        />

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-100 p-6 ring-1 ring-slate-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-mono font-semibold">
              before · CRM glance at the door
            </div>
            <p className="mt-3 text-[15px] text-slate-700 leading-relaxed italic">
              Sofia and Carlos. There&apos;s a note from last week — saw a
              second-floor place, didn&apos;t love it. There&apos;s a follow-up
              flagged. I think Carlos asked something about fees. I&apos;ll figure
              it out in the meeting.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              The first 3 minutes of the meeting are spent re-orienting. Open loops
              get missed. Next steps get vague.
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 p-6 ring-1 ring-violet-200">
            <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
              after · 60-sec brief at T-25
            </div>
            <p className="mt-3 text-[15px] text-slate-800 leading-relaxed italic whitespace-pre-line">
{`Sofia & Carlos.
Serious. Lease ends Sept 30.
Carlos asked HOA on Friday — answer: 280€/mo, send before meeting.
Open loop: school catchment for twins.
Leave with: Saturday 11am viewing locked.`}
            </p>
            <div className="mt-4 text-xs text-violet-700">
              Walks in with the HOA answer ready, the school question pre-loaded,
              the next-step pre-decided. Whole meeting moves forward.
            </div>
          </div>
        </div>
      </section>

      {/* The audio version */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="why audio matters"
          title="The 60 seconds you don't read."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The text version of the brief is the backup. The default delivery is
            audio — a TTS-rendered version of the four bullets, pushed to your
            phone at T-30, designed to be heard during the drive or walk to the
            meeting. The reason audio wins for this format is that the agent&apos;s
            attention pre-meeting is already split: they&apos;re commuting, they&apos;re
            checking the route, they&apos;re re-reading the previous meeting&apos;s
            messages. Adding a screen-read brief to that load fails.
          </p>
          <p>
            Audio at T-25 lands during a window when the agent has nothing else to
            do but listen. 60 seconds of structured signal arrives, gets absorbed,
            sits in working memory through the rest of the commute, and is fully
            internalised by the time the front door opens.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="the 60-second prep brief"
          headlinePrimary="The brief is step one."
          headlineAccent="Trusting it is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="PREP"
        origin={
          <>
            The pre-meeting briefing that executive assistants did manually
            for senior principals for decades, now generated automatically
            from CRM + calendar + recent activity. Our slice: the 60-second
            brief that fires 30 minutes before each agent meeting.
          </>
        }
      />
    </div>
  );
}
