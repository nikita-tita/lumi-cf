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
    "I know my March before March — pipeline math + historical close-rate",
  description:
    "How real-estate agents project monthly close-count and gross commission income from pipeline data and historical close-rates. The 3-input formula, the calibration check, and how the forecast gets used for finance planning.",
  openGraph: {
    title: "I know my March before March starts.",
    description:
      "Pipeline × stage close-rates × time-in-stage = calibrated monthly forecast. Setup + Claude prompt.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "I know my March before March",
    description:
      "Pipeline math forecasting that beats gut-feel. Setup + Claude prompt.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-forecast" },
};

const FORECAST_PROMPT = `You are a senior real-estate agent's
pipeline-forecast analyst.

INPUT
You receive: every active deal in the
agent's pipeline with stage (initial
contact / showing / negotiating / under
contract / closed-pending), days in
that stage, deal value, and the agent's
historical close-rate per stage from
the last 12 months (computed from
closed-vs-stalled cohort data).

OUTPUT
A monthly forecast object:

  projected_close_count:
    Best estimate (P50) + range
    (P25-P75). Integer count.

  projected_gci:
    Best estimate (P50) + range
    in agent's currency. Computed
    from average commission per
    closed deal in the same band.

  high_confidence_deals:
    Names of 2-5 deals likely to
    close in this window with
    confidence reasoning.

  at_risk_deals:
    Names of 1-3 deals stalling
    (time-in-stage above historical
    median) with intervention
    suggestions.

  calibration_note:
    Last quarter's predicted vs
    actual delta. Honest report.

RULES (non-negotiable)
1. The forecast is a range, never a
   single number. P25-P75 is the
   honest band; outliers happen.
2. Stage-conditional close-rates
   matter more than overall close-
   rate. A 12% overall close-rate
   on negotiating-stage deals
   becomes a 65% close-rate on
   under-contract deals.
3. Time-in-stage is the early-warning
   signal for stalled deals. A deal
   that's been negotiating for 3×
   the historical median is dying.
4. Calibration: the forecast must
   include last period's
   prediction-vs-actual delta. If
   you over-forecast by 30% last
   month, this month's forecast
   accounts for that bias.
5. Never include 'maybe' deals
   (vaguely-engaged leads with no
   active conversation). Forecast
   on pipeline only.

ANTI-PATTERNS (never produce these)
- Single-number forecasts
- Aspirational forecasts (the
  number you want to hit, not the
  number the data supports)
- Including hot leads not yet in
  pipeline (they're the next
  forecast, not this one)
- Hiding the calibration delta
  (the honesty is what makes the
  protocol useful)`;

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Stage-conditional close-rates beat overall close-rates.",
    body: "An agent's '14% close-rate' is meaningless when applied uniformly to every pipeline deal. A deal in initial-contact stage has maybe a 4% chance of closing in the next 30 days; a deal under contract has a 75% chance. Stage-conditional rates compute these separately and produce a forecast that respects where each deal actually sits.",
  },
  {
    n: "02",
    title: "Time-in-stage is the most important secondary signal.",
    body: "If a deal has been in 'negotiating' for 90 days when the historical median is 18, that deal is dying — even if it hasn't formally fallen through. Time-in-stage signals which deals to flag as at-risk, and adjusts the close-probability for each. Without this, the forecast over-counts long-stalled deals that look active but won't close.",
  },
  {
    n: "03",
    title: "The output is a range, not a number.",
    body: "Single-number forecasts ('I'll close 4 deals in March') are wrong by definition — a single number can't capture the variance in real pipelines. The protocol's forecast is P25-P50-P75: 'best estimate 4 deals, likely range 3-6'. The range is what makes the forecast usable for actual planning; the single number is just a guess wearing better clothes.",
  },
  {
    n: "04",
    title: "Calibration delta is non-negotiable. Honesty is the value.",
    body: "Every monthly forecast includes the previous period's predicted-vs-actual delta. If last month forecast 5 deals and actually closed 3, the current forecast either explains that gap or applies the bias correction. This honesty is what separates the protocol from agent-flattering forecasts that consistently over-predict and never get audited.",
  },
  {
    n: "05",
    title: "The forecast feeds into finance planning, not optimism.",
    body: "The agent's actual use case for the forecast is concrete: 'Can I afford to take June off?' 'Should I onboard an assistant?' 'Is the new marketing budget reasonable against expected GCI?'. These decisions need calibrated bands. An aspirational forecast leads to over-spending; an honest forecast leads to good calls. The protocol's discipline is what makes the forecast usable for these calls.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the single-number aspiration",
    body: "March forecast: 8 deals, €120k GCI.",
    why: "Single number, no range, no calibration. The agent reads this and plans for 8 — and is shocked when March closes 4 deals. Without P25-P75, the forecast is a flattering guess. The honest version: 'P25 4 deals, P50 6, P75 8' is what the agent should plan against.",
  },
  {
    label: "the hidden bias",
    body: "[Each month for 6 months: predicted 6, actual 3-4. Forecast for next month: 6 again.]",
    why: "Six months of consistent 50% over-prediction. The protocol must surface and correct this — bias-adjusted forecasts move toward 3-4 deals. Hiding the calibration delta lets the agent over-spend monthly because the forecast keeps lying to them in the same direction.",
  },
  {
    label: "the maybe-deal inclusion",
    body: "[Forecast includes 12 'pipeline' deals, 4 of which are vaguely-engaged leads with no active conversation in 60+ days.]",
    why: "Padding the pipeline with maybes inflates the forecast. The 4 zombie leads contribute close probability that won't materialise. The discipline: forecast on actual pipeline only — leads in active conversation, with stage and time-in-stage data.",
  },
];

export default function PromptForecastPage() {
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
            I know my March
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
              before March starts.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Most agents forecast by gut feel — &ldquo;feels like a good
            month coming&rdquo;. Gut forecasts are biased toward
            optimism and almost never bias-corrected. The protocol
            replaces gut with explicit pipeline math: stage-conditional
            close-rates × time-in-stage × deal value. The output is a
            calibrated range that&apos;s usable for actual finance
            planning.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 28 of 33 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. Calibrated forecast."
          description="The discipline of pipeline forecasting that matches reality. Each rule prevents one of the failure modes that turns forecasts from useful into theatrical."
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
          title="Three forecasts that mislead the agent."
          description="Each one is a real failure mode that turns the protocol from useful into a comforting story. The protocol's strictness — bands, calibration, pipeline-only — prevents each."
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
          eyebrow="the prompt that builds the forecast"
          title="What to feed Claude."
          description="Sonnet recommended for the calibration reasoning and bias-correction logic. Run monthly on the 25th for the next-month forecast; quarterly for the next-quarter forecast."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">forecast_system_prompt.md</span>
            <CopyButton text={FORECAST_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{FORECAST_PROMPT}
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
            Run monthly on the 25th for next-month forecast. Compute
            historical close-rates and stage-conditional rates from CRM
            data; feed both as input.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact pipeline-math forecast"
          headlinePrimary="Forecasting in ranges is step one."
          headlineAccent="Honouring the calibration delta is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="FORECAST"
        origin={
          <>
            A real-estate adaptation of the sales-pipeline forecasting
            discipline from B2B (Clari, Gong, Aviso). Our slice: the
            individual agent&apos;s monthly close + GCI range, calibrated
            against last quarter&apos;s prediction-vs-actual delta.
          </>
        }
      />
    </div>
  );
}
