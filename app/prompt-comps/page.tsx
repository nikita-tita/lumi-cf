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
    "60 seconds vs 4 hours — the comp deck Claude builds before you've made coffee",
  description:
    "How real-estate agents generate a 3-comp deck (3 listings + analysis + recommended price band) in 60 seconds. The 3-comp formula, the trust rules, and the use cases that make it worth running for every listing.",
  openGraph: {
    title: "60-second comp deck. Used to take 4 hours.",
    description:
      "Address + radius → 3 comps + price band + 3-page PDF. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "60-second comp deck",
    description:
      "Comp deck in 60s. Same one used to take 4 hours of MLS pulling.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-comps" },
};

const COMPS_PROMPT = `You are a senior real-estate agent's
comparable-property analyst.

INPUT
You receive: the subject property
(address, beds, baths, sqm, year built,
key features, asking price), 5-15 nearby
recent sales + active listings within
500m and ±15% sqm, the agent's
target use case (CMA / listing pitch /
buyer education).

OUTPUT
A 3-comp deck — three pages of
structured analysis:

  PAGE 1 — RECOMMENDED PRICE BAND
    The trio of comps chosen, why these
    three (closest match on geometry,
    age, sqm, recency). The
    recommended-asking band ±5%, with
    the reasoning chain visible.

  PAGE 2 — COMP COMPARISON TABLE
    Side-by-side: subject vs comp 1
    vs comp 2 vs comp 3. Rows: address,
    beds, baths, sqm, sold/asking price,
    €/sqm, days on market, key
    differentiators.

  PAGE 3 — MARKET CONTEXT
    Trend: are similar properties in
    this segment moving up, down, or
    flat over the last 90 days?
    Inventory: how many comparable
    listings are active right now?
    Velocity: median days-on-market
    for the segment.

RULES (non-negotiable)
1. Always cite the source for every
   number. MLS listing ID, cadastre
   reference, or portal URL.
2. Comps must be within 500m AND ±15%
   sqm AND sold/listed within 90 days.
   Stretching any of these dimensions
   weakens the analysis.
3. The recommended price band is a
   range, never a single number.
   ±5% on the comp median is the
   default unless explicit reasoning
   for a wider band.
4. Include the AGENT-FACING analysis
   on page 1 (why these three) and
   the SELLER-FACING summary on page 2
   (the comparison table that makes
   the conversation easy).
5. Date-stamp every comp. Comp data
   ages — a 90-day-old comp is
   borderline; 6-month-old is invalid.

ANTI-PATTERNS (never produce these)
- Stretched comps (different sqm
  segment, different neighbourhood,
  different feature class)
- Single-number recommended price
- Missing source citations
- Inferring trends from <5 data
  points
- Padding to multiple pages with
  generic market commentary`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Three comps. Not five, not seven, not whatever the MLS dumps.",
    body: "The CMA discipline that separates good agents from data-dumpers: the analysis is on three carefully chosen comps, not on the random 12 the MLS returns. Three is the sweet spot — enough for a defensible band, few enough that each one can be specifically discussed in the conversation. The protocol's first job is choosing the three; everything downstream depends on that choice.",
  },
  {
    n: "02",
    title: "Within 500m, within ±15% sqm, within 90 days.",
    body: "These three constraints are the hard limits. Stretch any one and the comp's relevance falls off a cliff. A 3-bed 200m² in the same neighbourhood is not comparable to a 3-bed 130m². A property 700m away is not comparable to one 300m away — even in the same neighbourhood. A sale from 18 months ago is not comparable in 2026 markets. The protocol enforces all three.",
  },
  {
    n: "03",
    title: "Cite every source. No exceptions.",
    body: "Every number on the deck has a citation: MLS listing ID, cadastre reference, portal URL with a date-stamp screenshot. This is what separates the protocol from 'an agent's hunch presented as data'. The citation makes the deck defensible in any subsequent conversation — with the seller, with a mortgage lender, with a buyer's lawyer. Without citations, the deck is just an opinion in a fancier wrapper.",
  },
  {
    n: "04",
    title: "Recommended price is a band, never a single number.",
    body: "The deck's recommendation is always a range — 'List between €820k and €865k'. A single number is false precision and forces the seller to either accept or reject. A band gives the seller (and the agent) decision space: where in the band to start, when to consider the lower end, what would justify pushing toward the higher. The default band is ±5% on the comp median; widen it only with explicit reasoning.",
  },
  {
    n: "05",
    title: "Three use cases. Same deck. Different conversation.",
    body: "The same 3-page deck supports three different conversations: CMA (with a seller deciding listing price), listing pitch (with a seller deciding which agent to hire), and buyer education (with a buyer evaluating an offer). The deck doesn't change; the conversation around it does. The protocol generates one deck and the agent runs three different meetings with it.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the stretched comps",
    body: "[Subject: 3-bed 145m² Cascais. Comps cited: 3-bed 200m² Cascais sold 12 months ago at €1.3M, 4-bed 165m² Estoril sold last month at €1.1M, 2-bed 110m² Cascais listed at €820k.]",
    why: "All three comps fail the protocol's hard limits — wrong sqm segment, wrong neighbourhood, wrong recency. Conclusions drawn from these will be wrong. The protocol exists to enforce the discipline; bypassing it produces decks that look authoritative and aren't.",
  },
  {
    label: "the single-number price",
    body: "Recommended listing price: €847,500 (matches comp median).",
    why: "False precision. The seller now thinks the price is exact and will not consider €830k or €860k. A range gives the seller (and the agent) decision space, calibrated to comparables but not pinned to a false certainty. The protocol's default is ±5% on the median.",
  },
  {
    label: "the no-citations",
    body: "Three comps in the area sold for €820, €855, and €870 per sqm in the last 90 days. Recommended price band: €820-865k.",
    why: "No MLS IDs, no portal URLs, no date stamps. The seller (or any subsequent reviewer) cannot verify these numbers. The protocol's whole credibility — and the seller's trust — is in the citations. Without them, the deck is unsupported.",
  },
];

export default function PromptCompsPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

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
            60 seconds.
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
              Used to take four hours.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            A defensible 3-comp deck used to be the agent&apos;s
            Sunday-afternoon project — pulling MLS records, calculating
            price-per-sqm, formatting in PowerPoint. The protocol that
            replaces this isn&apos;t a generic CMA tool. It&apos;s a
            tightly-constrained Claude prompt with strict comp-selection
            rules and mandatory source citations.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 24 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Three comps."
          description="The discipline that produces a defensible deck — defensible meaning every number has a source, every comp meets the hard limits, every recommendation is a band rather than a number."
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
          title="Three deck failures that lose credibility."
          description="Each one looks competent on first glance and collapses under scrutiny. The protocol's strictness — hard comp limits, mandatory citations, banded prices — is what prevents these failure modes."
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
          eyebrow="the prompt that builds the deck"
          title="What to feed Claude."
          description="Sonnet recommended — the comp-selection logic and the price-band reasoning need careful inference, and Haiku tends to over-include marginal comps. PDF rendering happens downstream of Claude's structured output."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">comps_system_prompt.md</span>
            <CopyButton text={COMPS_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{COMPS_PROMPT}
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
            Pull comp candidates from MLS API, feed to Claude with the
            subject property. Pipe Claude&apos;s structured output into a
            PDF template (3 pages) for delivery.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 60-second comp deck"
          headlinePrimary="Generating the deck is step one."
          headlineAccent="Citing every number is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="COMPS"
        origin={
          <>
            A real-estate adaptation of the data-grounded advisory pattern
            from financial services — strict citations, banded
            recommendations, comparability rules. Our slice: a 3-comp deck
            in 60 seconds vs the 4-hour CMA tradition.
          </>
        }
      />
    </div>
  );
}
