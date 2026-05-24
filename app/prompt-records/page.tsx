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
    "The 2-minute lookup that tells you how this buyer behaved last time",
  description:
    "How real-estate agents use public-records cross-reference to walk into the first call already knowing how a buyer transacted before. The 4 sources, the AI summary prompt, and the ethics line that protects the relationship.",
  openGraph: {
    title: "The 2-minute lookup that tells you everything",
    description:
      "Public records cross-reference: prior properties, ownership style, decision patterns. AI summarises it into a 4-sentence dossier before the first call.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 2-minute lookup that tells you everything",
    description:
      "Public-records dossier: prior transactions, ownership style, co-buyer patterns. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-records" },
};

const RECORDS_PROMPT = `You are a senior real-estate agent's
public-records analyst.

INPUT
You receive structured data from 4 public
sources: deed registry (prior purchases and
sales), permit office (renovation history),
court filings (any property-related disputes
or liens), and corporate registry (LLC or
trust ownership patterns). Plus the agent's
note on what they're trying to learn.

OUTPUT
A 4-sentence dossier — same shape as the
lead-enrichment dossier — but focused on
prior real-estate behaviour:

  1. PRIOR PATTERNS — how many transactions
     this person has done, their typical
     hold time, whether they tend to buy
     at asking / over / under.
  2. OWNERSHIP STYLE — solo, joint, LLC,
     trust; whether co-buyers have changed
     across transactions; any pattern that
     suggests a financial-planning approach.
  3. NEGOTIATION SIGNAL — based on prior
     transaction prices vs market at the
     time, do they tend to over-pay, under-
     pay, or close at expected price.
  4. WHAT TO ASK — one specific question
     the agent should ask early in the
     first conversation, calibrated to the
     prior patterns above.

RULES (non-negotiable)
1. Public records only. If a field is
   blank or unverifiable, skip it — never
   guess or infer beyond what the records
   show.
2. Never reference the records to the
   client. The dossier informs the
   agent's strategy; it never appears in
   any client-facing message.
3. The fourth sentence is calibrated to
   the patterns. If they hold long, ask
   about timeline. If they tend to under-
   pay, ask about decision-criteria.
4. No private records, no breach data,
   no people-search dossiers. Sources are
   the deed registry, permit office,
   court records, corporate registry.
5. Voice: clinical-detective. Strategic,
   not gossipy.

ANTI-PATTERNS (never produce these)
- "Based on the records, I think they
   will…" (this is for the agent to
   conclude; the dossier reports facts)
- Any reference to the records in the
   "what to ask" sentence
- Speculation about marriage / divorce
   from name changes (often misleading)
- Including data older than 15 years
   unless it shows a clear pattern.

The agent should read the 4 sentences in
8 seconds and walk into the first call
already knowing the patterns.`;

const EXAMPLE_INPUT = `# ── public records cross-reference ──────────────
subject:          "Marina Costa"
agent_note:       "First call tomorrow.
                   Want to know transaction style."

deed_registry (Lisbon + Porto):
  - 2016-03: purchased Lisbon 1-bed,
    €280k (asking €295k, sold under)
  - 2019-08: sold Lisbon 1-bed, €340k
    (held 3.4 years)
  - 2019-09: purchased Lisbon 2-bed,
    €420k (asking €420k, at asking)
  - 2024-11: sold Lisbon 2-bed, €510k
    (held 5.2 years)
  - 2024-12: signed lease Porto, no
    purchase yet

permit_office (last 10 years):
  - 2017: kitchen renovation Lisbon 1-bed
    (€18k declared)
  - 2021: bathroom + balcony Lisbon 2-bed
    (€34k declared)

court_filings:           none in last 10 years
corporate_registry:      no LLC ownership;
                         all purchases solo
co_buyer_pattern:        solo across all
name_change_history:     none

inferred_market_position:
  2016 purchase: undermarket by ~5%
  2019 purchase: at asking (competitive
                  market that year)
  2024 sale:     overmarket by ~7%
                 (Lisbon peak, sold well)
`;

const EXAMPLE_OUTPUT = `1. Marina has done 2 prior purchases and 2 prior sales over 10 years, with hold times of 3.4 and 5.2 years — she's a medium-term buyer, not a flipper or a forever-home holder, suggesting she'll evaluate the Porto purchase against a 4-7 year horizon.

2. All four prior transactions were solo (no co-buyer or LLC), and her permit history shows she invests in renovations during ownership rather than buying turnkey — she'll value renovation potential over move-in-ready, and she'll handle the decision herself rather than deferring to a partner or advisor.

3. She closed her 2016 purchase ~5% under asking and sold her 2024 property ~7% over market — she's a disciplined buyer who walks away from inflated asks, but she's not afraid to negotiate hard when she identifies a property she actually wants.

4. Ask early: "What kind of timeline are you working against — is this a settling-in purchase or an option you'd give yourself two-three years to revisit?" Her answer reveals whether she's locked into Porto long-term or hedging — and that calibrates everything from the listings shortlist to the price-aggressiveness conversation.`;

const SOURCES: { source: string; what: string; per_country: string }[] = [
  {
    source: "Deed registry",
    what: "Every prior purchase and sale by name. Reveals hold time, transaction frequency, price patterns vs market.",
    per_country: "Portugal: Conservatória do Registo Predial. Spain: Registro de la Propiedad. UAE: DLD. Brazil: Cartório de Registro de Imóveis. Most accessible online with a small fee per query.",
  },
  {
    source: "Permit office",
    what: "Renovation history, building permits, declared works value. Reveals whether they buy turnkey or invest post-purchase.",
    per_country: "Portugal: Câmara Municipal. Spain: Ayuntamiento. UAE: Dubai Municipality. Brazil: Prefeitura. Often online, varies by city.",
  },
  {
    source: "Court filings",
    what: "Any litigation involving property — disputes, liens, foreclosures, contested sales. Major red flag if any.",
    per_country: "Portugal: Citius (free). Spain: Boletín Oficial del Estado. UAE: Court records (DIFC, ADGM). Most LatAm jurisdictions: regional court portals.",
  },
  {
    source: "Corporate registry",
    what: "LLC, trust, or company ownership patterns. Tells you whether they hold for tax/estate reasons or personal use.",
    per_country: "Portugal: Registo Comercial. Spain: Registro Mercantil. UAE: free zones (DIFC, ADGM, JAFZA). Brazil: Junta Comercial.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Run the cross-reference before the first call. Not after.",
    body: "The whole value of this protocol is in the strategy it informs in the first conversation. After the first call, you've already calibrated wrong on price talk, timeline questions, and decision-group probes. Pull records the day the lead lands; review the dossier the morning of the first call. Ten extra minutes; the rest of the relationship runs differently because of it.",
  },
  {
    n: "02",
    title: "Four sources or it's not a cross-reference.",
    body: "Pulling deed registry alone gives you transactions but not the why. Permits without deeds gives you renovation activity without context. The four-source pull (deeds + permits + courts + corporate registry) is what produces a dossier that holds together — each source corroborates or contradicts the others. One source is data; four sources are intelligence.",
  },
  {
    n: "03",
    title: "Claude compresses 4 sources into 4 sentences.",
    body: "The records output is messy — different formats per registry, prices in different currencies, dates in different conventions. Use Sonnet to normalise and synthesise; the 4-sentence schema enforces compression. The agent reads the 4 sentences in 8 seconds and has the calibration. The full source data is filed for compliance and never re-read.",
  },
  {
    n: "04",
    title: "The dossier is for the agent's strategy. Never the client's eyes.",
    body: "Crucial discipline: the public-records dossier informs how the agent runs the relationship — what questions to ask early, what price-calibration to test, what timeline to assume — but never appears in any client-facing artefact. Mentioning the records explicitly to the client (\"I see you bought your last property under asking\") feels like a hostile move and breaks the warmth. The records work invisibly.",
  },
  {
    n: "05",
    title: "If you find litigation or liens, treat as a red flag for due diligence.",
    body: "Court filings is the only one of the four sources that can produce material risk findings — a lis pendens, a tax lien, a contested estate. If found, the protocol switches from \"calibrate the relationship\" to \"surface it through the agent's normal due-diligence disclosure to lender / lawyer / counterparty\". Don't bury it; don't lead with it; route it through the legitimate channel.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the leak",
    body: "Marina, I noticed in the deed registry that you bought your Lisbon flat under asking in 2016 — clearly you know how to negotiate. We can use that experience for your Porto purchase!",
    why: "Mentions the records to the client. Even though everything is public, this feels like surveillance — and erodes the warmth the agent needs to do the rest of the relationship. The dossier is for the agent's eyes only.",
  },
  {
    label: "the speculation",
    body: "Based on the name change in 2018 from Costa to Costa-Almeida and back to Costa in 2022, Marina likely went through a divorce — she may be price-sensitive and emotionally fragile around the new purchase.",
    why: "Inferring marriage / divorce from name changes is wildly unreliable (could be professional alias, surname order convention, marriage-then-reverted-by-choice, half a dozen other reasons). The dossier should report records facts, never psychological inferences.",
  },
  {
    label: "the open conclusion",
    body: "Based on Marina's transaction patterns, I think she will: 1) want to negotiate hard on price, 2) prefer a renovation project, 3) make the decision alone. Plan accordingly.",
    why: "Pre-baking conclusions denies the agent the chance to test them. The dossier surfaces patterns; the agent draws the conclusions in real time on the first call. AI conclusions get over-trusted; AI patterns get verified.",
  },
];

export default function PromptRecordsPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      <PackHero readMinutes={9} guideAnchor="#protocol" />

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
            The 2-minute lookup
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
              that tells you everything.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            A first call with a buyer is where most agents calibrate badly — too
            aggressive on price, too soft on timeline, too generic on the
            shortlist. The agents who calibrate right walk into the call already
            knowing how this person transacted last time. Public records told
            them. They just had to look.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated April 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 07 of 30 · @lumi.estate</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5 text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase text-slate-500">
              <span>marina_costa_records.txt</span>
              <span className="hidden sm:inline">4 sources · 8s read</span>
            </div>
            <pre className="text-[12px] sm:text-[14px] leading-relaxed font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
{`PRIOR PATTERNS
  · 2 purchases, 2 sales over 10y
  · medium hold (3.4y, 5.2y)
  · 2016 -5% asking, 2019 at asking,
    2024 sold +7% market

OWNERSHIP STYLE
  · solo all 4 transactions
  · permits show post-purchase
    renovation pattern

ASK EARLY:
  "Settling-in purchase, or option you'd
   revisit in 2-3 years?"`}
            </pre>
            <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70" />
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Two minutes of records pull. Eight seconds of reading. The
              first call runs differently because the agent walks in
              calibrated.
            </p>
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-slate-900">
          What 30 minutes on the phone won&apos;t tell you.
        </h2>
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            On a first call, the questions agents ask reveal what they
            don&apos;t know. &ldquo;Have you bought before?&rdquo;
            &ldquo;Solo or with a partner?&rdquo; &ldquo;Any timeline pressure?&rdquo;
            Each question is information the agent needs — and each one is
            information already in the public record. Asking signals that the
            agent didn&apos;t prepare. The buyer notices.
          </p>
          <p>
            The records-first protocol inverts this. The agent walks in
            knowing the prior transactions, the typical hold time, whether
            this buyer tends to negotiate hard or pay at asking. They
            don&apos;t lead with that knowledge — they don&apos;t mention it
            at all — but they don&apos;t waste the call discovering it
            either. They use the call for what it&apos;s actually for: feeling
            out fit, testing rapport, surfacing the soft signals the records
            can&apos;t show.
          </p>
          <p>
            The output of the call is a relationship that&apos;s 30 minutes
            ahead of where it would have been otherwise. The patterns are
            already in the agent&apos;s head. The next move is calibrated.
            Three or four calls in, the agent has compounded this advantage
            into a deal that the un-prepared version would have lost.
          </p>
        </div>

        <blockquote className="mt-10 sm:mt-12 border-l-4 border-violet-500 pl-5 sm:pl-6 py-1">
          <p className="font-display not-italic text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
            &ldquo;The questions agents ask reveal what they don&apos;t know.
            And what they don&apos;t know is mostly in the public record.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* The 4 sources */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the four sources"
          title="What to query. By region."
          description="Each source is publicly accessible in every market Lumi serves (EU, LatAm, MENA), with varying levels of programmatic API. The names and access methods differ by jurisdiction; the data shape is consistent."
        />

        <div className="mt-8 space-y-4">
          {SOURCES.map((s) => (
            <div
              key={s.source}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
                {s.source}
              </div>
              <p className="mt-2 text-[15px] sm:text-base text-slate-900 font-medium leading-snug">
                {s.what}
              </p>
              <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                {s.per_country}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Two minutes per buyer."
          description="The discipline of records-first preparation. Skip any one and the protocol either burns hours per lead or produces a creepy first conversation."
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
          title="Three failure modes that burn the relationship."
          description="Each of these has been done by a real agent we worked with. Each one cost them either the deal in front of them or the next 18 months of repeat business."
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
          title="The cross-reference input."
          description="What the prompt receives after pulling all four sources. The agent's note guides the synthesis but doesn't override it — the records are what they are."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">records_input.yaml</span>
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
          eyebrow="the prompt that synthesises it"
          title="What to feed Claude."
          description="The system prompt that turns four messy public-records pulls into the 4-sentence dossier. Sonnet recommended for the synthesis nuance — Haiku tends to over-conclude on thin data."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">records_system_prompt.md</span>
            <CopyButton text={RECORDS_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{RECORDS_PROMPT}
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
            Pull the records the day the lead lands; run the prompt the
            morning of the first call.
          </p>
        </div>
      </section>

      {/* Example output */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="records in · 4 sentences out"
          title="What Claude returns."
          description="The dossier that the agent reads in 8 seconds before the first call. Notice that the fourth sentence is a question — calibrated to what the records reveal about Marina's transaction patterns."
        />

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 ring-1 ring-violet-200 p-6 sm:p-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-mono font-semibold">
            output · 4-sentence records dossier
          </div>
          <pre className="mt-3 text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-mono whitespace-pre-wrap">
{EXAMPLE_OUTPUT}
          </pre>
        </div>
      </section>

      {/* Ethics */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-20">
        <PackSectionHeader
          eyebrow="about the data"
          title="Public records, not private dossiers."
          description={undefined}
        />
        <div className="mt-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Every source in this protocol is genuinely public — anyone can
            walk into the registry office and pull the same records (most can
            be queried online for a small fee). This is structurally different
            from paid people-search services that aggregate breach data,
            re-sell scraped social profiles, or stitch together private
            inferences. We don&apos;t use those, and you shouldn&apos;t either.
          </p>
          <p>
            The discipline that protects the relationship: the records inform
            the agent&apos;s strategy, but never appear in any client-facing
            artefact. No &ldquo;I see you bought your last property under
            asking&rdquo; even though it&apos;s technically a public fact.
            The records are how the agent prepares. The relationship is built
            in the calls and showings, where the records&apos; influence is
            invisible to the client and felt only in the calibration of the
            agent&apos;s questions and pace.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact records cross-reference"
          headlinePrimary="Pulling the records is step one."
          headlineAccent="Letting them inform invisibly is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="RECORDS"
        origin={
          <>
            A residential adaptation of the due-diligence dossier pattern
            from commercial RE — public registries + LLM synthesis to walk
            into the first meeting already knowing the patterns. Our slice:
            the 4-sentence transaction-history brief, read in 8 seconds
            before each first call.
          </>
        }
      />
    </div>
  );
}
