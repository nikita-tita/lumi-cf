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
    "Every IG comment is a lead — you're losing 90% of them",
  description:
    "How real-estate agents turn Instagram comments into briefed CRM leads — automatically. The 4 buyer-intent signals to tag, the auto-reply that doesn't sound like a bot, and the Claude prompt that classifies intent in under 2 seconds.",
  openGraph: {
    title: "Every IG comment is a lead. 90% are lost.",
    description:
      "The IG-to-CRM funnel that converts a comment on your listing into a briefed lead before the commenter has closed Instagram. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Every IG comment is a lead",
    description:
      "Comment-to-CRM in 90 seconds. The 4 intent signals + Claude classifier prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-dm" },
};

const DM_PROMPT = `You are a senior real-estate agent's
IG-comment intent classifier and auto-replier.

INPUT
You receive: the comment text, commenter
username, public profile snippet (bio,
location, recent posts), the listing the
comment is on (price, neighbourhood, beds),
and the agent's voice samples (3-5 prior
DM replies the agent has actually sent).

OUTPUT
A JSON object with three keys:

  intent_tier: <one of:
                hot   — explicit interest in
                        seeing/buying the
                        property
                warm  — clarifying or info-
                        gathering question
                cold  — vague compliment, no
                        purchase signal
                spam  — bot, foreign-language
                        spam, irrelevant
               >
  intent_signals: <array of 1-3 specific
                   signals from the comment
                   or profile that drove the
                   tier classification>
  draft_reply:    <a 1-2 sentence DM reply,
                   in agent's voice, that
                   moves the conversation
                   forward IF tier is hot
                   or warm. Empty string for
                   cold/spam.>

RULES (non-negotiable)
1. Match the agent's voice samples — sentence
   length, punctuation rhythm, emoji policy
   (if the agent uses zero emoji, use zero).
2. NEVER mention the listing's price unless
   the commenter asked. Listing prices in
   first-touch DMs feel pushy.
3. Hot tier: end the reply with a 60-second
   yes/no question (a date, a viewing slot,
   "sending the floor plan?"). Never an
   open-ended "let me know".
4. Warm tier: answer the question, then drop
   ONE specific detail about the listing
   that wasn't in the comment (a feature
   the commenter would care about based on
   what they asked).
5. Cold/spam: return empty draft. The agent
   reviews and either ignores or sends a
   brief like-acknowledgement themselves.

ANTI-PATTERNS (never produce these)
- "Thanks for your interest in this property!"
- "I'd love to chat — DM me?"
- "Yes, this property is still available"
- Any sentence longer than 18 words
- Any emoji unless the agent uses them
- Generic "feel free to" / "let me know"

The commenter should read the reply in 4
seconds and feel like they got a useful
answer from a person — not a CRM autoresponder.`;

const EXAMPLE_INPUT = `# ── ig comment intent classification input ──────
comment_text:    "Is the kitchen south-facing?
                  And how far to the train?"
commenter:
  username:      "@isabella_lx"
  bio:           "Mum of two · Lisbon → Cascais soon"
  recent_posts:  ["beach photo", "kid's birthday",
                  "moving boxes"]
  followers:     412
  following:     387
listing_context:
  price:         "€825,000"
  neighbourhood: "Cascais — Praia do Tamariz"
  beds:          3
  bath:          2
  surface:       "168 m²"
  features:      ["sea-glimpse", "south-facing
                  kitchen", "8 min walk to
                  Cascais train", "garden
                  90m²", "garage 2 cars"]
agent_voice_samples:
  - "Yes, both bedrooms south-facing — best
     light in winter. Want a Saturday slot?"
  - "Garage fits two — one's a charging port.
     11am Saturday work for you?"
  - "Sea view from balcony, not from kitchen
     — sending the photo set. Still want it?"
`;

const EXAMPLE_OUTPUT = `{
  "intent_tier": "hot",
  "intent_signals": [
    "explicit feature questions (south-facing, transit)",
    "bio signals 'moving' — life-event match",
    "recent posts include moving boxes"
  ],
  "draft_reply":
    "South-facing — best light in winter. Train
     is 8 min walk, runs to Lisbon every 20.
     Saturday at 11 work for a viewing?"
}`;

const INTENT_SIGNALS: { signal: string; tier: string; example: string }[] = [
  {
    signal: "Explicit feature question",
    tier: "hot",
    example: "\"Is the kitchen south-facing?\" — they have a feature checklist already.",
  },
  {
    signal: "Logistics question",
    tier: "hot",
    example: "\"How far to the train?\" \"What's the HOA?\" — they're modelling the daily reality.",
  },
  {
    signal: "Life-event in bio",
    tier: "hot — defensive",
    example: "Bio says \"moving to Cascais\", recent posts have moving boxes — high-confidence buyer.",
  },
  {
    signal: "Comparative question",
    tier: "warm",
    example: "\"How does this compare to the one in Estoril?\" — they're shopping multiple properties.",
  },
  {
    signal: "Pricing without context",
    tier: "warm",
    example: "\"How much?\" — they haven't seen the price; they want it. Reply with price + one specific feature.",
  },
  {
    signal: "Vague compliment",
    tier: "cold",
    example: "\"Beautiful!\" \"Love this!\" — almost certainly not a buyer signal. Skip the auto-reply.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "ManyChat catches the comment within 30 seconds.",
    body: "ManyChat (or any IG comment-to-DM tool) fires when a comment hits the listing post. The webhook ships the comment text, commenter username, and post context to your stack within 30 seconds — well before the commenter has closed Instagram. Speed-of-reply is the single biggest factor in conversion at this stage; a reply within the same session feels like a person, a reply 2 hours later feels like an autoresponder.",
  },
  {
    n: "02",
    title: "Public profile enrichment runs synchronously.",
    body: "Pull the commenter's public bio, follower count, recent post types, and (where allowed) public LinkedIn match. This adds 1-3 seconds to the latency budget but is what lets the classifier hit hot-tier confidence. Don't skip this step — without it, the classifier is reading a single comment in a vacuum and will misclassify ~30% of the time.",
  },
  {
    n: "03",
    title: "Claude classifies + drafts in one call.",
    body: "Single LLM call: comment + profile + listing + agent voice samples in. JSON-shaped object with tier, signals, and draft reply out. Use Haiku for cost (~$0.0003/comment) and speed (~1.2s p50). The classifier and the drafter are the same prompt — splitting them adds latency without adding accuracy.",
  },
  {
    n: "04",
    title: "Hot replies go out automatically. Warm queue for review.",
    body: "Hot-tier replies auto-send within the original session (target: <90s from comment to DM). Warm-tier drafts queue for the agent's review — these are the comments where the auto-reply could sound off, so the agent eyeballs and approves before sending. Cold and spam are silently logged and never replied to. The agent reviews the day's classifications in a 5-minute end-of-day pass.",
  },
  {
    n: "05",
    title: "CRM card created on every hot/warm — even before reply.",
    body: "The moment the classifier returns hot or warm tier, a CRM lead is created with the commenter's profile, the listing context, the intent signals, and a 4-sentence brief (using the dossier protocol, see /prompt-dossier). By the time the agent sees the auto-reply went out, the lead is already in the pipeline with full context — no manual entry, ever.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the bot",
    body: "Hi! Thanks for your interest in this beautiful property. Please send me a DM and I'd love to chat about scheduling a viewing!",
    why: "Doesn't answer the question. Doesn't reference the south-facing or the train. Reads like every IG-marketing autoresponder. The commenter sees this and assumes it's a bot — accurately.",
  },
  {
    label: "the price-pusher",
    body: "Yes! €825,000, fully renovated, 168m². The kitchen has been redone last year. When can you visit?",
    why: "Leads with the price (the commenter didn't ask). Skips the question they did ask. Pushes a viewing before answering. Three failures in three sentences.",
  },
  {
    label: "the over-eager",
    body: "Great question! Yes, the kitchen is south-facing — perfect for plant lovers and morning coffee ☀️ The train is just 8 minutes walking distance, super convenient! Would you like to schedule a viewing this weekend? Saturday or Sunday work for you? I can also send more photos! Just let me know! 😊",
    why: "Three exclamation marks and two emojis the agent doesn't use. Asks two questions in a row instead of one. Offers more photos before the commenter asks. Voice mismatch — the agent's actual replies are 1-2 sentences, no emoji.",
  },
];

export default function PromptDMPage() {
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
            Every IG comment
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
              is a lead. You&apos;re losing 90%.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents post listings on Instagram and treat the comments as
            engagement metrics. But every &ldquo;is the kitchen south-facing?&rdquo;
            and every &ldquo;how far to the train?&rdquo; is a high-intent
            signal — usually higher than the cold leads agents pay for. The
            problem is reply speed: comment buyers go cold within an hour.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 04 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>auto_reply.dm — 47s after comment</span>
              <span className="hidden sm:inline">tier: hot</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`@isabella_lx (commented 47s ago):
  "Is the kitchen south-facing? And how far
   to the train?"

draft (auto-sent):
  "South-facing — best light in winter. Train
   is 8 min walk, runs to Lisbon every 20.
   Saturday at 11 work for a viewing?"`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Two sentences. Both her questions answered. One yes/no question.
              CRM lead created in parallel with full context.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          The 90% you&apos;re losing.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Look at any agent&apos;s last 10 IG listing posts. Count the
            comments. Of those comments, how many got a DM reply within an
            hour? Across the agents we&apos;ve audited, the answer is roughly
            10-15%. The remaining 85-90% either got a reply hours later
            (effectively never) or got no reply at all.
          </p>
          <p>
            The problem is not lack of will. The agent saw the comment, meant
            to reply, got pulled into a showing, came back, the comment was
            buried under three new posts. By the time they got around to it,
            the commenter had moved on, scrolled, forgotten. The comment-buyer
            window is roughly 60 minutes — measurable across thousands of cases
            — and almost no agent operates inside it.
          </p>
          <p>
            The fix is not &ldquo;reply faster&rdquo;. The fix is removing the
            agent from the critical path on hot-tier comments entirely. The
            agent reviews and audits at the end of the day. The agent does not
            have to be in the loop for every &ldquo;south-facing kitchen?&rdquo;
            question — that&apos;s a question their classifier should answer
            in 90 seconds, in their voice, while they&apos;re showing a
            different property.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The fix is not &lsquo;reply faster&rsquo;. The fix is
            removing the agent from the critical path on hot-tier comments
            entirely.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Intent signals table */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the intent signals"
          title="What the classifier looks for."
          description="Six patterns that separate a hot-tier buyer comment from a cold compliment from a spam bot. Each one gets weighted by the prompt; tier is decided on the strongest single signal."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_120px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>signal</div>
            <div className="hidden sm:block">tier</div>
            <div>example</div>
          </div>
          {INTENT_SIGNALS.map((s) => (
            <div
              key={s.signal}
              className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_120px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold text-[12px] sm:text-[13px]">
                {s.signal}
                <div className="sm:hidden mt-1 inline-block text-[11px] font-sans font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                  {s.tier}
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="inline-block text-[11px] font-mono uppercase tracking-[0.14em] text-violet-700 bg-violet-50 px-2 py-1 rounded">
                  {s.tier}
                </span>
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {s.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five steps. Ninety seconds."
          description="The end-to-end flow: comment posted → CRM lead created with full brief → DM auto-sent in agent's voice. The agent never touches the critical path."
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
          title="Three replies that kill the conversion."
          description="The classifier produces these without enough voice samples or without the rules above. Each one is a real reply we've seen agents auto-send before tightening the prompt."
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

      {/* The classifier input */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="copy · paste"
          title="The classifier input."
          description="What the prompt receives on every comment. The voice samples are the single most important field — without them the reply will sound like a generic IG bot."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">comment_input.yaml</span>
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
          eyebrow="the prompt that classifies + drafts"
          title="What to feed Claude."
          description="One prompt does both jobs — tier classification and voice-matched reply drafting. Splitting them adds latency without accuracy gain."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">dm_classifier_prompt.md</span>
            <CopyButton text={DM_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{DM_PROMPT}
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
            Use Haiku for the latency budget. Pipe ManyChat webhook into the
            classifier; auto-send hot tier, queue warm for review.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="comment in · reply out"
          title="What Claude returns."
          description="JSON for tooling, plain prose for the agent's review queue. Tier hot → auto-send. Tier warm → queue. Tier cold/spam → silent log."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · classifier json
          </div>
          <pre className="mt-3 text-[13px] sm:text-[14px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact comment-to-CRM funnel"
          headlinePrimary="Replying in 90 seconds is step one."
          headlineAccent="Trusting the classifier is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="DM"
        origin={
          <>
            A real-estate adaptation of the keyword-DM funnel pattern from
            ManyChat power-users in e-commerce. Our slice: IG listing-comment
            intent and the sub-90-second reply window where the conversion
            lift compounds.
          </>
        }
      />
    </div>
  );
}
