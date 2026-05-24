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
    "Five deals from one 14-day sequence — the multi-channel ladder that doesn't burn",
  description:
    "How real-estate agents run a coordinated 14-day email + DM + LinkedIn + voice sequence that closes 5 deals per quarter. The day-by-day map, the ask-or-archive rule, and the prompt that drafts each touch in the right tone for the right channel.",
  openGraph: {
    title: "5 deals from one 14-day sequence",
    description:
      "Email day 1 + IG DM day 4 + LinkedIn day 9 + voice note day 14. Coordinated, channel-tuned, no burning. Setup + Claude prompts.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "5 deals from one 14-day sequence",
    description:
      "Multi-channel sequence that closes 5 deals/quarter. The 14-day map + Claude drafts.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-multi" },
};

const MULTI_PROMPT = `You are a senior real-estate agent's
multi-channel sequence drafter.

INPUT
You receive: the lead's CRM brief (with
soft signals), their preferred channel
(inferred from their actual replies),
the day of the sequence (1, 4, 9, or 14),
and the agent's voice samples for that
specific channel.

OUTPUT
A single message for the day's channel,
in the voice of that channel.

  Day 1 (email): subject + body. Subject
                 ≤45 chars. Body 4-7
                 sentences.
  Day 4 (IG DM): single short message,
                 1-3 sentences, references
                 something specific from
                 the brief.
  Day 9 (LinkedIn): connection-request
                    note (200 char limit)
                    OR DM if already
                    connected.
  Day 14 (voice): a 30-45 second voice
                  note script for the
                  agent to read aloud.
                  Mark pauses with [pause]
                  and emphasis with *italic*.

RULES (non-negotiable)
1. Each touch references a DIFFERENT soft
   signal from the brief. The lead never
   feels the agent is repeating the same
   pitch.
2. Each touch advances the relationship —
   answers a question, surfaces a new
   listing, shares a market data point.
   No "just checking in" energy.
3. Day 14 ends with a clear ask-or-archive:
   "if I don't hear by Friday, I'll
   archive this and stop pinging — say
   the word and I will."
4. Voice and tone match the CHANNEL, not
   the agent's email voice. IG DMs are
   shorter. LinkedIn notes are warmer-
   formal. Voice notes have natural
   pauses.
5. Never reference the previous touches.
   Each message stands alone. The lead
   shouldn't feel a sequence.

ANTI-PATTERNS (never produce these)
- "Following up on my previous email"
- "I tried reaching out a few times"
- Cross-channel name-drops ("did you see
   my LinkedIn?")
- The same opening line across channels
- Day 14 voice note that reads like text
  (no contractions, formal grammar)

The lead should feel four different
moments of useful contact across 14 days
— not a sequence designed to wear them
down.`;

const SEQUENCE_MAP: { day: string; channel: string; job: string }[] = [
  {
    day: "Day 1",
    channel: "Email",
    job: "Establish context. Reference the original signal (form submission, IG comment, referral). Surface one specific listing or market datum that addresses what the brief shows they care about.",
  },
  {
    day: "Day 4",
    channel: "Instagram DM",
    job: "Bridge to social-native channel. Short. Ideally references something they liked or saved on IG. Light-touch — not a sales push, just a 'here's something you might find interesting'.",
  },
  {
    day: "Day 9",
    channel: "LinkedIn",
    job: "Professional credibility layer. Connection request with personal note OR DM if already connected. References what they do for work + a relevant market angle (commute, neighbourhood, employer-pattern).",
  },
  {
    day: "Day 14",
    channel: "Voice note",
    job: "Final humanity layer. 30-45 second voice note. Direct, warm, names the ask-or-archive. Highest-conversion touch in the sequence — agent voice carries information channel text doesn't.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "The sequence is for cold leads, not warm relationships.",
    body: "Multi-channel ladders work because cold leads need 4-7 touches before responding. Warm leads (referrals, past clients, IG-DM hot tier) don't need this — they need single specific messages. Running the 14-day ladder against warm leads is over-engineering and reads as desperate. Discipline: ladder is for cold; warm gets the targeted protocols.",
  },
  {
    n: "02",
    title: "Channels are sequenced by intimacy, not random.",
    body: "Email → IG DM → LinkedIn → voice note is a deliberate ascent. Email is the lowest-intimacy channel (everyone gets agent emails); IG DM is mid (you've found their public account); LinkedIn is professional credibility (you've done your homework); voice note is human (you're talking to them, not at them). The progression conditions the recipient — by day 14, the voice note feels earned because of the lower-intimacy touches before it.",
  },
  {
    n: "03",
    title: "Each touch references a different soft signal.",
    body: "If day 1 mentions the south-facing kitchen, day 4 doesn't. The brief usually has 4-6 soft signals captured during enrichment + early calls; the sequence allocates one per touch. This prevents the messages from sounding like variations on the same pitch — the lead experiences four distinct moments of context, not a four-part repetition.",
  },
  {
    n: "04",
    title: "Voice and tone match the channel, not the agent.",
    body: "Email reads like email. IG DM reads like IG DM (shorter, casual, contractions). LinkedIn reads like LinkedIn (warmer-formal, professional context). Voice notes read like spoken language (pauses, emphasis, run-on sentences are fine). Forcing the agent's email voice across all four channels is the most common failure — and the recipient feels the inauthenticity instantly.",
  },
  {
    n: "05",
    title: "Day 14 is ask-or-archive. Honoured exactly.",
    body: "The voice note ends with: 'if I don't hear by Friday, I'll archive this — let me know if you want me to keep going'. And then the agent honours it. No 'one more email' on day 16. No 'just one more thing' on day 21. The whole sequence depends on the credibility of the archive promise — burn it once and the protocol stops working with that lead and any they tell.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the cross-channel leak",
    body: "Day 9 LinkedIn DM: 'Hi Marina, sent you an IG DM last week and an email the week before — wanted to also reach out here in case those landed in spam!'",
    why: "Names the previous touches. Reveals the sequence. The lead now feels harassed by a coordinated campaign, not contacted by an agent who happens to be reaching out across channels. The protocol's whole leverage is that each touch stands alone.",
  },
  {
    label: "the wrong-voice voice note",
    body: "[Day 14, voice note transcript]: 'Hello Marina, this is André from Lumi Real Estate. I am following up regarding your interest in the Estoril property. Please contact me at your earliest convenience to discuss next steps. Thank you and have a great day.'",
    why: "Reads like a formal email translated to audio. No pauses, no contractions, no warmth. The recipient hears the script. A real voice note has 'um's, restarts, smiles in the voice — and the prompt should mark these to give the agent a natural script to follow.",
  },
  {
    label: "the same-signal repetition",
    body: "Day 4 IG DM: 'Saw you saved that south-facing kitchen apartment.' Day 9 LinkedIn: 'Quick note — I have another south-facing 3-bed coming on this week.' Day 14 voice note: 'Wanted to check if the south-facing options are still your priority.'",
    why: "Three touches, one signal. By day 14 the lead feels they've been pigeonholed by a single feature they mentioned once. Each touch should reference a different soft signal — kitchen on day 4, commute on day 9, school district on day 14.",
  },
];

export default function PromptMultiPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={10} guideAnchor="#protocol" />

      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 0%, rgba(236,72,153,0.08), transparent), radial-gradient(40% 40% at 0% 30%, rgba(99,102,241,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-4">
            agent toolkit · field guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            Five deals from
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              one 14-day sequence.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Single-channel cold outreach is dead — every cold email goes to
            spam, every cold DM gets archived, every cold call goes to
            voicemail. The agents who close cold leads now run coordinated
            multi-channel sequences: four touches across email, IG, LinkedIn,
            and voice over 14 days. Each touch references a different soft
            signal. The lead feels seen, not stalked.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>10-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 13 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>14-day sequence · marina costa · cascais</span>
              <span className="hidden sm:inline">5 deals/q from this</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`Day 1 · email
  subject: "Cascais Tech Park 3-beds, this week"
  signal: commute (4 listings within 15min)

Day 4 · IG DM
  "Saw your beach photo — there's a 3-bed
   in Tamariz with similar light. 60s clip?"
  signal: lifestyle

Day 9 · LinkedIn DM
  "Saw the Neuralink → Porto move. Curious if
   the Cascais commute would even work…"
  signal: career / employer

Day 14 · voice note
  [warm, 32 sec] mentions schools (sister
  signal); ends ask-or-archive`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Four touches, four channels, four soft signals. Each one stands
              alone. Day 14 closes with a clean ask-or-archive — and the
              archive is honoured.
            </p>
          </div>
        </div>
      </section>

      {/* Sequence map */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the sequence"
          title="Day-by-day. Channel-by-channel."
          description="The four touches, each calibrated to its channel and to a different soft signal from the brief. The progression is deliberate: low-intimacy email → mid IG → professional LinkedIn → human voice."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_180px_1fr] text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-500 bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200">
            <div>day</div>
            <div className="hidden sm:block">channel</div>
            <div>job</div>
          </div>
          {SEQUENCE_MAP.map((s) => (
            <div
              key={s.day}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_180px_1fr] px-4 sm:px-6 py-4 border-b border-slate-100 last:border-b-0 text-[14px] sm:text-[15px]"
            >
              <div className="font-mono text-indigo-700 font-semibold">
                {s.day}
                <div className="sm:hidden mt-1 text-slate-700 font-sans font-medium text-[13px]">
                  {s.channel}
                </div>
              </div>
              <div className="hidden sm:block text-slate-900 font-medium">
                {s.channel}
              </div>
              <div className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px]">
                {s.job}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Fourteen days."
          description="Each rule protects against the sequence becoming a campaign. The whole leverage is in feeling like four distinct contacts, not a coordinated push."
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
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #ec4899 100%)",
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
          title="Three failures that turn the sequence into a campaign."
          description="When the prompt loses discipline — usually under pressure to fill out the days — the sequence regresses to formulaic outreach. Each of these has been generated by a real prompt and sent by a real agent."
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
          eyebrow="the prompt that drafts each touch"
          title="What to feed Claude."
          description="One prompt, four channels — the channel parameter routes which voice and length to use. Voice samples per channel are what produce channel-authentic drafts."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">multi_system_prompt.md</span>
            <CopyButton text={MULTI_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{MULTI_PROMPT}
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
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            }}
          >
            Open Claude →
          </a>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Run the prompt 4 times per lead (one per channel). Schedule
            actual sends via Mailgun (email), ManyChat (IG DM), Phantombuster
            (LinkedIn), and your phone&apos;s voice memo (day 14).
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 14-day multi-channel ladder"
          headlinePrimary="Drafting the four touches is step one."
          headlineAccent="Honouring the day-14 archive is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="MULTI"
        origin={
          <>
            A real-estate adaptation of the multi-channel sequence playbook
            from B2B sales (Outreach, Apollo, lemlist). Our slice: the 14-day
            ladder for cold residential leads — channel-tuned voice,
            ask-or-archive honoured exactly.
          </>
        }
      />
    </div>
  );
}
