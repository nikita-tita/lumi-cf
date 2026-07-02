import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "The 3-minute investment report — turn ChatGPT into the prettiest deal brief your buyer has opened",
  description:
    "The upgraded ChatGPT prompt for real-estate agents. Drop a listing in, three minutes later you have a polished one-page client brief — executive verdict, scoring bars, red flags, next-step recommendation, your name on the footer.",
  openGraph: {
    title: "The 3-minute investment report — ChatGPT writes a polished client brief",
    description:
      "Drop a listing, get back a one-page deal report your buyer can open like a printed analyst's brief. Original prompt, free.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 3-minute investment report — ChatGPT prompt for real-estate agents",
    description:
      "Drop a listing, get back a one-page deal report your buyer can open like a printed analyst's brief.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-scorer" },
};

const SYSTEM_PROMPT = `You are an investment-property analyst preparing a one-page client-ready report for a real-estate agent's buyer.

OUTPUT
Output ONLY a complete <!DOCTYPE html> document. No markdown fences, no surrounding prose. The HTML must be self-contained — inline CSS, no external scripts, fonts, or images. It should render as a polished one-page brochure in any modern browser.

DESIGN
- Aesthetic: premium, calm, analyst-grade. Think a printed buyer brief from a top-tier brokerage, not a chat log.
- Layout: 720px max-width card, centered on a soft off-white background (#fafafb). 32px outer padding. Soft drop-shadow on the card.
- Typography: system sans-serif. Headings semibold. Numbers tabular figures.
- Palette: navy #0f172a primary, indigo #1F5738 accent, success #16a34a, amber #f59e0b, alert #dc2626. Text on white surfaces.
- Sections separated by 32px gaps and 1px hairlines (#e2e8f0). Generous breathing room.

REPORT STRUCTURE (in order)

1. HEADER
   - Eyebrow: "INVESTMENT BRIEF" — indigo, all-caps, letter-spaced.
   - H1: full property address.
   - Sub-header: asking price + currency on the left; date + agent name right-aligned.

2. EXECUTIVE VERDICT
   - A large italic blockquote in the buyer's voice. One sentence. Pull-quote treatment.
   - Below it: "Risk-adjusted score: [N]/10" with a colored pill (green ≥7, amber 5-6, red <5).

3. KEY NUMBERS GRID (2x2)
   - Cell 1: Gross yield %
   - Cell 2: Cash-on-cash return %
   - Cell 3: Monthly net cash flow estimate
   - Cell 4: Breakeven occupancy %
   Each cell on #f1f5f9 background, 16px padding, 12px border-radius. Large number, small label below.

4. SCORING PANEL (horizontal bars)
   - Location 1-10 — bar fill proportional to score, colored by tier.
   - Condition 1-10 — same treatment.
   - Number visible to the right of each bar.

5. RED FLAGS (3 max)
   - Bullet list. Each item prefixed with a small red dot.
   - Plain language. Agent's voice.

6. WHAT TO ASK THE SELLER NEXT (3 questions)
   - Numbered list. Specific, listing-grounded questions.

7. NEXT STEP
   - One italic sentence in the agent's voice. The recommended action.

8. FOOTER
   - Agent name + email + ISO date.
   - Tiny disclaimer in #94a3b8: "Estimates only. Confirm before acting."

SCORING METHOD
- Gross yield = (annual market rent ÷ asking price) × 100. Round to 1 decimal.
- Cash-on-cash = first-year net cash flow ÷ initial cash (25% down + 3% closing + 1% maintenance reserve). Round to 1 decimal.
- Location 1-10 = walkability (0-3) + transit (0-2) + school catchment (0-2) + last 24-month appreciation (0-3).
- Condition 1-10 = kitchen (0-2) + bath (0-2) + windows (0-2) + structure/exterior (0-4). From photos.
- Risk-adjusted = weighted average — yield 30%, CoC 30%, location 25%, condition 15%. Round to 1 decimal.

RULES
- Never invent numbers. Ask for missing inputs before generating.
- Keep the listing's currency throughout. Do not convert.
- If photos are unavailable or watermarked, set condition to "unverified" with a gray pill (#94a3b8).
- Always output the complete HTML in one response.

INPUTS THE AGENT WILL PROVIDE
Listing: [URL or pasted description with photos]
Asking price: [amount + currency symbol]
Objective: rent / flip / long-hold
Buyer profile: [first-time / experienced / cash-only]
Market rent benchmark: [monthly rent in same currency, if known]
Comparable sales: [optional — 1-3 nearby comps]
Agent name + email: [for footer]

When all inputs are received, output the complete HTML.`;

export default function PromptScorerPage() {
  return (
    <div className="bg-[#fafafb] min-h-screen text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 0%, rgba(192,91,46,0.08), transparent), radial-gradient(40% 40% at 0% 30%, rgba(31,87,56,0.10), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-12 sm:pt-20 lg:pt-24 pb-8 sm:pb-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-4">
            agent toolkit · the upgrade
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
            The 3-minute investment report.
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
              ChatGPT writes the prettiest deal brief your buyer has opened.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            The basic version returns a numbered list. This upgraded version
            returns a finished one-page client brief — executive verdict at the
            top, key numbers in a 2×2 grid, scoring bars, three red flags, the
            three questions to ask the seller next, and the agent&apos;s
            recommended next step. Three minutes from listing URL to a document
            the buyer keeps.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>4-min read</span>
            <span aria-hidden>·</span>
            <span>Updated May 2026</span>
            <span aria-hidden>·</span>
            <span>From the Reel — keyword SCORER</span>
          </div>
        </div>
      </section>

      {/* What's on the page */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          What ends up on the page.
        </h2>
        <p className="mt-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          The buyer opens the file in any browser and sees a calm, analyst-grade
          one-pager. Not a chat log. Not a screenshot. A document they can keep,
          forward to their accountant, or print.
        </p>

        <ol className="mt-8 grid sm:grid-cols-2 gap-4 list-none">
          {[
            {
              n: "01",
              title: "Executive verdict",
              body: "One italic sentence in the buyer's voice. The risk-adjusted score sits next to it with a colored pill.",
            },
            {
              n: "02",
              title: "Key numbers grid",
              body: "Gross yield, cash-on-cash, monthly cash flow, breakeven occupancy. Large numbers, small labels, no clutter.",
            },
            {
              n: "03",
              title: "Scoring bars",
              body: "Location and condition rated 1-10 with horizontal bars. Color-coded green / amber / red.",
            },
            {
              n: "04",
              title: "Three red flags",
              body: "Plain-language risks the buyer needs to know. In the agent's voice, not generic AI fluff.",
            },
            {
              n: "05",
              title: "What to ask the seller next",
              body: "Three specific listing-grounded questions for the next showing or call.",
            },
            {
              n: "06",
              title: "Next step",
              body: "The agent's recommended move. One italic sentence the buyer can act on.",
            },
          ].map((item) => (
            <li
              key={item.n}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-indigo-700 font-mono font-semibold">
                section {item.n}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] text-slate-700 leading-relaxed">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* The prompt */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-10 sm:pb-12">
        <div className="border-t border-slate-200 pt-10 sm:pt-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            the upgraded prompt
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Copy this into a new ChatGPT chat.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Tested against GPT-4o and Claude Sonnet — both produce a clean
            standalone report on the first try. The agent provides the listing
            inputs after the prompt is set.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">three_min_report_prompt.md</span>
            <CopyButton text={SYSTEM_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{SYSTEM_PROMPT}
          </pre>
        </div>
      </section>

      {/* How to save the report */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="border-t border-slate-200 pt-10 sm:pt-12">
          <div className="text-[11px] tracking-[0.22em] uppercase text-indigo-600 font-mono mb-3">
            three minutes from listing to file
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            How the workflow runs.
          </h2>
        </div>

        <ol className="mt-8 space-y-4">
          {[
            {
              n: "1",
              title: "Paste the prompt + your inputs",
              body: "Open ChatGPT, paste the prompt above, then paste the listing URL, asking price, objective, and your name. ChatGPT will ask for anything else it needs.",
            },
            {
              n: "2",
              title: "ChatGPT outputs the full report",
              body: "Single code block starting with <!DOCTYPE html>. Click the copy icon at the top-right of the block.",
            },
            {
              n: "3",
              title: "Save as a file",
              body: "Open TextEdit (Mac) or Notepad (Windows). Paste. File → Save As → name it report.html (the .html extension is what makes it work).",
            },
            {
              n: "4",
              title: "Send to the buyer",
              body: "Double-click the file to preview. Attach to email, drop into WhatsApp, or open in the browser and save as PDF. The buyer opens a clean one-pager, not a chat log.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-4 sm:gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col items-start">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-mono font-semibold text-white text-lg shadow-md"
                  style={{
                    background:
                      "#1F5738",
                  }}
                >
                  {s.n}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] text-slate-700 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
        <div className="border-t border-slate-200 pt-10 text-sm text-slate-500 leading-relaxed">
          <p>
            More agent-toolkit prompts on{" "}
            <a
              href="https://www.instagram.com/lumi.estate"
              className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              @lumi.estate
            </a>
            . Follow if any of this was useful — it&apos;s how we know to keep
            writing them.
          </p>
        </div>
      </section>
    </div>
  );
}
