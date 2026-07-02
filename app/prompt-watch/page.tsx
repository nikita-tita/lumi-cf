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
    "The signal radar — past clients leave clues on Idealista. Most agents never look",
  description:
    "How real-estate agents catch life-stage shifts in past clients before the client thinks to call them. The 5 silent signals to watch for, the legal way to set it up, and the message to send when one fires.",
  openGraph: {
    title: "The signal radar — past clients leave clues. Most agents never look",
    description:
      "Past clients save listings, share posts, refresh saved searches. Each shift is a signal — pregnant, divorcing, upgrading, downsizing. The five signals to watch and the message that re-engages a $1.2M repeat buyer.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The signal radar — past clients leave clues",
    description:
      "5 silent signals from past clients that beat any cold list. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-watch" },
};

const WATCH_PROMPT = `You are a senior real-estate agent's
relationship-radar analyst.

INPUT
You receive a snapshot of one past client's
public activity over a 14-day window: which
portal saved-searches changed shape, which
listings they saved, which posts they liked
or shared, and any public life-event signal
(LinkedIn, Twitter, Instagram public posts).

OUTPUT
Decide ONE of three things:

  SIGNAL — a meaningful behaviour shift, with
  a specific message draft to send.

  WATCH — interesting but not yet decisive;
  log and keep watching.

  NOISE — normal browsing, no action needed.

If SIGNAL, output exactly this structure:
  signal_type: <one of: upgrading, downsizing,
               relocating, family_growth,
               family_split, retirement, none>
  evidence:    <2 short bullets, factual only>
  draft_message: <1-3 sentences, in agent's
                  voice, references the signal
                  obliquely — never names it>

RULES (non-negotiable)
1. Never name the inferred life event
   directly in the message ("noticed you might
   be expecting" is forbidden).
2. The message anchors in a NEW listing or
   market data point, not the client's
   browsing history.
3. The signal must come from at least TWO
   independent sources to count. One data
   point is noise.
4. If signal_type is family_growth or
   family_split, downgrade confidence by one
   tier and produce a softer ask.
5. Voice: warm, casual, observational. Not
   sales-y. Not surveilling.

ANTI-PATTERNS (never produce these)
- Mentioning their saved search behaviour
- Quoting their public posts
- Asking "are you thinking of moving again?"
- Any sentence implying you've been watching

A past client should read the message and
think "huh, good timing" — never "wait, did
you know I'm…?"`;

const EXAMPLE_INPUT = `# ── 14-day signal snapshot ────────────────────────
client:           "Sofia Ferreira"
last_transaction: "purchased 2-bed Lapa, 2024-06"
window:           2026-04-12 → 2026-04-26
portal_signals:
  - saved_search_shift:
      from: "Lapa, 2-bed, €600-750k"
      to:   "Estoril, 3-bed, €850k-1.2M"
      detected_at: 2026-04-19
  - new_saves: 4 listings (all 3-bed, garden)
public_signals:
  - "shared a post about Estoril schools
     (LinkedIn, 2026-04-21)"
  - "liked 3 photos tagged #babymoon
     (Instagram, 2026-04-15)"
inferred_life_event_candidates:
  - family_growth (confidence: medium)
  - relocation (confidence: low)
days_since_last_touch: 312
`;

const EXAMPLE_OUTPUT = `signal_type: family_growth
evidence:
  - saved_search shifted from 2-bed Lapa to 3-bed Estoril with garden
  - public post sharing Estoril schools

draft_message:
  Sofia — couple of new builds came on in Estoril
  this week with the kind of layouts you liked at
  Rua da Prata, but bigger. Sending two if you
  want a Saturday look. — A.`;

const SIGNAL_TYPES: { signal: string; what: string; weight: string }[] = [
  {
    signal: "saved_search_shift",
    what: "The shape of what they're searching has changed — bedroom count, neighbourhood, or budget band moved decisively (not just a curious browse).",
    weight: "high",
  },
  {
    signal: "listing_pattern_match",
    what: "Multiple saves in 14 days that share a feature absent from their current home (garden, ground-floor, sea-view, second bathroom).",
    weight: "high",
  },
  {
    signal: "life_event_public",
    what: "Public post or photo signal about a life event likely to drive a move — engagement, marriage, baby, parent move-in, retirement, divorce, job change.",
    weight: "medium",
  },
  {
    signal: "neighbourhood_drift",
    what: "Their public engagement pattern (likes, follows, shared posts) has shifted toward a new area — they've been thinking about it for weeks.",
    weight: "medium",
  },
  {
    signal: "agent_research",
    what: "They've engaged with another agent's content (likes, follows, replies) — they're at least open to talking to someone, possibly already are.",
    weight: "high — defensive",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The radar runs nightly, not in real-time.",
    body: "A real-time alert on every saved-search refresh is noise — clients browse listings the way they browse Instagram. The signal is in the shape of a 14-day window, not in any single click. Run the analysis nightly at 2am, surface signals at 8am, the agent reviews over coffee. Latency-of-a-day costs nothing in this game; the events you're catching unfold over weeks.",
  },
  {
    n: "02",
    title: "Two sources or it's not a signal.",
    body: "Every false positive trains the agent to ignore the radar. The protocol requires at least two independent data points (a saved-search shift PLUS a public post signal) before promoting a behaviour to SIGNAL status. One data point — even a strong one — gets logged as WATCH and revisited next cycle. This single rule cuts false positives by ~70% in our internal testing.",
  },
  {
    n: "03",
    title: "Never name the inference in the message.",
    body: "If the signal is family_growth, the message does not mention babies, kids, or schools. The message references a new listing that happens to match the new constraints (3-bed, garden, walkable to a kindergarten you can name without naming kindergartens). The whole credibility of the radar — and the agent's relationship — depends on this discipline.",
  },
  {
    n: "04",
    title: "The legal stack is portal RSS + public-only social.",
    body: "Two boundaries: (1) portal data comes from official RSS, partner APIs, or aggregators with TOS-compliant access — never scraped session cookies, never paid breach data. (2) Social signals come only from posts the client has chosen to make public. The radar never touches DMs, friends-only posts, or private profiles. If a client looks up the protocol, they should be comfortable with what they find.",
  },
  {
    n: "05",
    title: "One message per signal. Then back to nightly cadence.",
    body: "When a SIGNAL fires and the agent sends the draft, the radar mutes that client for 30 days. If the message lands, it'll lead to a conversation — and the conversation is the right channel from there, not the radar. If the message doesn't land, a second one within the month reads as creepy. Trust the cycle.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the namer",
    body: "Sofia! Saw on Instagram that you might be expecting — congratulations! Want me to send some 3-bed options in Estoril, walkable to schools?",
    why: "Names the inference. The whole credibility of the protocol vapourises. Sofia closes the message and texts a friend that her old agent is creepy.",
  },
  {
    label: "the surveillance leak",
    body: "Sofia, I noticed your saved searches shifted to 3-bed listings in Estoril this month. Is something changing? Happy to help with a new search!",
    why: "Tells the client you've been watching their search behaviour. Even if this is technically public data, the message reveals the surveillance posture. Don't.",
  },
  {
    label: "the generic check-in",
    body: "Sofia, hope you're doing well! Just wanted to check in and see if you're still happy with the apartment. Any thoughts of looking at something new?",
    why: "Wastes the signal entirely. A radar that produces a generic check-in is just an expensive way to say 'just touching base'. The whole point is that the message is calibrated to the signal — without that, the radar adds nothing.",
  },
];

export default function PromptWatchPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

      {/* Hero */}
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
            Past clients leave signals.
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
              Most agents never look.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The single biggest source of new transactions for any senior agent
            is repeat business — past clients moving again. The catch is that
            past clients almost never call to announce it. They start saving
            different listings on Idealista. They share a post about a school
            district two cities over. They like a babymoon photo. The signal is
            there for weeks before the conversation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 03 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>signal_2026-04-21.txt</span>
              <span className="hidden sm:inline">re-engaged €1.2M</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`SIGNAL · family_growth · medium confidence
Sofia Ferreira (Lapa, purchased 2024-06)

evidence:
  · saved-search shifted 2-bed Lapa
    → 3-bed Estoril, garden, €850k-1.2M
  · shared post: Estoril schools (LinkedIn)

draft:
  "Sofia — couple of new builds came on in
   Estoril this week with the kind of layouts
   you liked at Rua da Prata, but bigger.
   Sending two if you want a Saturday look."`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Three sentences. No mention of the saved search. No mention of the
              schools. Just a calibrated nudge that lands at the exact week she
              was about to call someone.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          The honest reframe: this is not surveillance.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            The thing this protocol does — watching public signals from past
            clients — has a creepy version and a non-creepy version, and the
            difference is entirely in how the agent uses what they find. A good
            relationship-radar uses public data the way a thoughtful friend
            would: noticing that life is shifting, offering to help if it&apos;s
            useful, never naming the thing they noticed.
          </p>
          <p>
            The data is mundane. Saved searches on listing portals are public by
            design — that&apos;s how portals show comparable activity to
            sellers. Public Instagram posts are public posts. Shared LinkedIn
            content is broadcast. None of this is hacking; all of it is what a
            past client&apos;s agent could (and used to) notice manually if they
            had the time. The protocol just keeps eyes on it without asking the
            agent to spend two hours a week on social media.
          </p>
          <p>
            The line, again: never name the inference, never quote the post,
            never reveal the watching. The message anchors in something new in
            the world — a listing, a market shift — and the calibration of that
            message to the signal is the value. The client should never know
            the radar exists. They should just notice that their old agent has
            uncannily good timing.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The client should never know the radar exists. They should
            just notice that their old agent has uncannily good timing.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The 5 signals */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the five signals"
          title="What the radar actually watches."
          description="Five public-data patterns that, in our experience, predict repeat-transaction activity 8-14 weeks out. Each has a confidence weight; SIGNAL fires only when at least two of them stack."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_1fr_140px] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>signal type</div>
            <div className="hidden sm:block">what it captures</div>
            <div className="hidden sm:block">weight</div>
          </div>
          {SIGNAL_TYPES.map((s) => (
            <div
              key={s.signal}
              className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_1fr_140px] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {s.signal}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {s.what}
                </div>
                <div className="sm:hidden mt-2 inline-block text-[11px] font-sans font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                  {s.weight}
                </div>
              </div>
              <div className="hidden sm:block text-slate-600 leading-relaxed">
                {s.what}
              </div>
              <div className="hidden sm:block">
                <span className="inline-block text-[11px] font-mono uppercase tracking-[0.14em] text-violet-700 bg-violet-50 px-2 py-1 rounded">
                  {s.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One signal at a time."
          description="The discipline of the radar. Skip any one and you produce a creepy message, a false positive, or both."
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
          title="Three messages that burn the relationship."
          description="When the protocol's discipline slips, the radar produces messages that feel like surveillance. Each of these has been sent by a real agent we worked with — and each cost them the past client."
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
          title="The signal snapshot."
          description="What the radar produces nightly for each past client. The Claude prompt below consumes this snapshot and decides SIGNAL / WATCH / NOISE."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">signal_snapshot.yaml</span>
            <CopyButton text={EXAMPLE_INPUT} label="Copy snapshot" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre text-slate-100">
{EXAMPLE_INPUT}
          </pre>
        </div>
      </section>

      {/* The Claude prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="the prompt that classifies it"
          title="What to feed Claude."
          description="The system prompt that turns a 14-day signal snapshot into either a draft message or a 'keep watching' log entry."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">watch_system_prompt.md</span>
            <CopyButton text={WATCH_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{WATCH_PROMPT}
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
            Paste the system prompt as a Claude system message, then feed each
            past client&apos;s nightly snapshot as a user message.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="snapshot in · signal out"
          title="What Claude returns."
          description="Run the snapshot above through the prompt above. This is the structured output the agent reviews over coffee at 8am."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · signal classification
          </div>
          <pre className="mt-3 text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* The legal stack */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the data"
          title="What the radar uses. What it never touches."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            <strong className="font-semibold text-slate-900">Allowed.</strong>{" "}
            Listing-portal RSS feeds. Partner portal APIs (Idealista,
            ImmoScout24, SeLoger, Property Finder, Bayut have varying levels of
            programmatic access — most permit aggregator queries within their
            TOS for licensed agents). Public social posts on LinkedIn,
            Instagram, Twitter/X, Facebook. Public records (deeds, permits,
            court filings).
          </p>
          <p>
            <strong className="font-semibold text-slate-900">Forbidden.</strong>{" "}
            Scraped session cookies. Paid people-search dossiers sourcing from
            breached data. Private DMs, friends-only posts, private profiles.
            Anything requiring impersonation of the client to obtain. If the
            client looks up your protocol and reads this list, they should
            recognise the line — and trust that you&apos;re on the right side
            of it.
          </p>
          <p>
            <strong className="font-semibold text-slate-900">Per-region notes.</strong>{" "}
            EU agents must comply with GDPR Art. 6(1)(f) legitimate-interest
            balancing — document the public source of every signal, retain only
            what&apos;s necessary, give clients an opt-out (most agents add a
            line at closing: &ldquo;I keep an eye out for new listings that
            match — let me know if you&apos;d rather I didn&apos;t&rdquo;).
            LatAm and MENA jurisdictions vary; the safe default is the same.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact relationship-radar protocol"
          headlinePrimary="Watching is step one."
          headlineAccent="Sending only when it matters is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="WATCH"
        origin={
          <>
            A real-estate adaptation of the public-signal-listening thesis
            from CRM and growth-tooling — public data + LLM classification
            produces actionable intent before the prospect reaches out. Our
            slice: past-client repeat-transaction signals on listing portals
            and social.
          </>
        }
      />
    </div>
  );
}
