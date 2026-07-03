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
    "I haven't written a listing description in 7 months",
  description:
    "How real-estate agents generate three different listing descriptions — factual MLS, emotional luxury, first-time-buyer — from the same photos and address. The 3-tone problem, the prompt, and the SEO note for portals.",
  openGraph: {
    title: "I haven't written a listing description in 7 months",
    description:
      "Three tones from the same property: factual / luxury / accessible. Setup + Claude prompt with vision.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "I haven't written a listing description in 7 months",
    description:
      "3 listing copies, 3 tones, 90 seconds. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-copy" },
};

const COPY_PROMPT = `You are a senior real-estate agent's
listing-copy generator.

INPUT
You receive: 5-15 photos of the property
(uploaded directly, vision-mode), the
property facts (address, beds/baths,
sqm, price, year built, key features),
and the agent's preferred portal
destinations (which constrain length).

OUTPUT
THREE listing descriptions, same property,
different tones:

  TONE 1 — FACTUAL (for MLS / cadastre):
    180-220 words. Plain, declarative.
    Lists features in order of importance
    for the search. No adjectives that
    can't be objectively verified.

  TONE 2 — EMOTIONAL LUXURY (for high-end
                              portal listings):
    220-280 words. Sensory language.
    The buyer&apos;s imagined experience
    in the property — afternoon light,
    walking distance to a specific
    restaurant, the feel of the rooms.
    No sales-y closer.

  TONE 3 — FIRST-TIME-BUYER FRIENDLY
                              (for entry-level
                               portals, mobile-first):
    140-180 words. Warm, accessible.
    Explains features that experienced
    buyers take for granted (south-facing,
    HOA, pre-approval, walk score). Ends
    with a soft invitation to view.

RULES (non-negotiable)
1. Same facts in all three. No
   tone changes the truth.
2. Each tone has its own structure —
   not just a tone-swap on the same
   sentences.
3. Use the photos for sensory anchors
   (afternoon light visible, garden
   in bloom, kitchen islands). Don't
   describe what isn't visible.
4. SEO terms in factual version
   (price-per-sqm, neighbourhood,
   bed count) are placed in the
   first 80 characters — that's
   what most portals snippet.
5. No emoji, no exclamation marks,
   no superlatives the property
   doesn't earn.

ANTI-PATTERNS (never produce these)
- "Stunning"; "spectacular"; "breath-
   taking"; "must-see"; "won't last"
- Identical sentences across tones
- Inventing features not in photos
- Mentioning the price in the
  emotional version (kills the
  reverie)
- Speculation about the buyer
  ("Perfect for a young family")`;

const TONES: { tone: string; portal: string; signal: string }[] = [
  {
    tone: "Factual MLS",
    portal: "MLS, cadastre, official feeds, broker-to-broker",
    signal: "What surfaces on the search-results page. Length-constrained, fact-dense, scannable.",
  },
  {
    tone: "Emotional luxury",
    portal: "Premium portals (high-end Idealista, Sotheby's, agency vanity sites)",
    signal: "What lands when the buyer is already inside the listing. Imagined-experience prose; no closer.",
  },
  {
    tone: "First-time-buyer",
    portal: "Mass-market portals, mobile sign-ins, IG link-in-bio funnels",
    signal: "Accessible language for buyers who don't speak agent-jargon. Explains the things experienced buyers don't notice they know.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Three tones, three portals — never one description repurposed.",
    body: "The same listing copy on a luxury portal and a mass-market portal will under-perform on both. The factual MLS description is for search; the emotional version is for the imagined experience inside the listing; the first-time-buyer version is for accessibility. Generating all three from one prompt is faster than rewriting one description for each context.",
  },
  {
    n: "02",
    title: "Photos are the sensory anchor. Vision is non-negotiable.",
    body: "Without vision, the prompt produces listing copy from facts alone — which reads like every other agent's listing. The afternoon light through the kitchen, the way the garden frames the doorway, the texture of the original floors — these come from the photos. Use Claude Sonnet with vision; the cost difference vs Haiku is rounding error against the listing-conversion delta.",
  },
  {
    n: "03",
    title: "SEO terms in the first 80 characters, factual tone only.",
    body: "Most portal search-results pages snippet the first 80-120 characters of the description. The factual MLS version must front-load the SEO terms — neighbourhood, bed count, price-per-sqm, key feature — within that window. The other tones don't need this; they're read after the buyer has clicked through.",
  },
  {
    n: "04",
    title: "Forbidden words: 'stunning', 'spectacular', 'must-see'.",
    body: "These words are the agent-speak that buyers have learned to discount. They appear in 60-70% of generic listings and signal 'this description was written without thought'. The protocol's prompt actively forbids them — partly because they're meaningless, partly because their absence is what makes the descriptions feel written rather than templated.",
  },
  {
    n: "05",
    title: "Disclosure: AI-generated descriptions need to be flagged in some markets.",
    body: "EU regulations are tightening on AI-generated content disclosure. Some MLS systems and portals (especially in Germany) require a small note when descriptions are LLM-drafted. The agent's name on the listing is theirs — but the disclosure is required. Check your local portal's TOS; the protocol doesn't bypass disclosure requirements.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the superlatives",
    body: "Stunning 3-bed apartment in the heart of Cascais! This breathtaking property features spectacular sea views, an absolutely gorgeous kitchen, and an incredible garden. A must-see — won't last long!",
    why: "Six superlatives in three sentences. Every one is meaningless to the buyer (they've learned to discount them). The description signals 'generic agent without time to look at the property'. Buyers scroll past in 0.6 seconds.",
  },
  {
    label: "the tone-swap on identical structure",
    body: "[Factual]: 'South-facing kitchen, sea-glimpse, 8min walk to train.' [Emotional]: 'A south-facing kitchen with a sea-glimpse, just 8 minutes' walk from the train.' [First-time-buyer]: 'You'll love this south-facing kitchen with sea-glimpse, only 8 minutes from the train!'",
    why: "Same sentence, three coats of paint. Each tone needs its own structure — factual is bulleted, emotional is sensory-prose, first-time-buyer is conversational. Tone-swap on identical structure is what AI defaults to without prompt discipline.",
  },
  {
    label: "the invented feature",
    body: "[Photos show no fireplace; description says]: 'Cozy up by the elegant marble fireplace on winter evenings.'",
    why: "Inventing what isn't in the photos. Buyers who book a viewing after reading this will arrive expecting a fireplace, not find one, and feel deceived. The disclosure standard in most jurisdictions makes this a regulatory risk too — keep the prompt vision-grounded.",
  },
];

export default function PromptCopyPage() {
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
            Three tones.
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
              Same property. Ninety seconds.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            One listing description on three different portals
            under-performs everywhere. The agents who max conversion
            run three: factual MLS for search, emotional-luxury for
            premium portals, accessible for first-time-buyer
            channels. Generated from the same photos and facts in
            one Claude call.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 21 of 33 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* Tones */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the three tones"
          title="One property. Three listing copies."
          description="Each tone has its own portal, its own length, its own structure. The protocol generates all three in a single prompt run — the agent picks per portal."
        />

        <div className="mt-8 space-y-4">
          {TONES.map((t) => (
            <div
              key={t.tone}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
                {t.tone}
              </div>
              <p className="mt-2 text-[14px] sm:text-[15px] text-slate-900 font-medium leading-snug">
                {t.portal}
              </p>
              <p className="mt-3 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                {t.signal}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One vision call."
          description="The discipline of three-tone listing copy. Skip any one and the descriptions either feel templated, get downranked by portals, or invent details the buyer can't verify."
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
          title="Three failures that downrank the listing."
          description="Each one has been produced by a loose prompt. Each one signals 'generic agent who didn't look at the property' to buyers and to portal ranking algorithms."
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
          eyebrow="the prompt that drafts all three"
          title="What to feed Claude."
          description="One prompt run with vision-mode photos produces all three tones. Sonnet with vision required — Haiku without vision regresses to fact-listing without sensory texture."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">copy_system_prompt.md</span>
            <CopyButton text={COPY_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{COPY_PROMPT}
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
            Upload 5-15 photos directly to the prompt. Claude with vision
            produces all three tones in a single ~$0.05 call.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 3-tone listing copy generator"
          headlinePrimary="Generating the three tones is step one."
          headlineAccent="Picking the right tone per portal is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="COPY"
        origin={
          <>
            A real-estate adaptation of the multi-tone content pattern
            from marketing — same content under-performs when published
            once instead of channel-tuned. Our slice: 3 listing copies
            (factual MLS / emotional luxury / first-time-buyer) generated
            from one Claude call with vision.
          </>
        }
      />
    </div>
  );
}
