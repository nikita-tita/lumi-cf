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
    "Empty room → 4 staged versions in 90 seconds — buyer calls before you list",
  description:
    "How real-estate agents virtually stage empty rooms in four styles (modern, classic, scandi, family) before the listing goes live. The vision pipeline, the disclosure rule, and the conversion lift over un-staged photos.",
  openGraph: {
    title: "Empty room → 4 staged versions. 90 seconds.",
    description:
      "AI virtual staging in 4 styles for $0 vs $800/photographer. Setup + disclosure rules.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Empty room → 4 staged versions",
    description:
      "AI virtual staging at $0/room. Setup + disclosure rules.",
  },
  alternates: { canonical: "https://lumi.estate/prompt-staging" },
};

const STAGING_PROMPT = `You are a senior real-estate agent's
virtual staging style controller.

INPUT
You receive: an empty-room photograph
(uploaded directly), the room type
(living room / bedroom / kitchen / etc),
and the target style.

OUTPUT
A precise text prompt for Claude/SDXL
vision pipeline that:

  1. Preserves the room's geometry
     exactly — windows, doors, ceiling
     lines, structural pillars must
     not move.
  2. Specifies furniture appropriate to
     the style:
        modern: clean lines, neutral
                palette, statement art
        classic: hardwood, layered
                 textiles, antique
                 accents
        scandi: light woods, soft
                cushions, plants,
                minimalist
        family: durable surfaces,
                warm rugs, kid-friendly
                cues
  3. Maintains realistic lighting that
     matches the original photo's time
     of day and direction.
  4. Includes the mandatory virtual-
     staging disclosure flag.

RULES (non-negotiable)
1. NEVER alter the room's bones —
   walls, ceiling, floor, fixtures
   must remain identical.
2. Furniture must be physically
   plausible (no floating sofas,
   impossible scale, art on
   non-wall surfaces).
3. Lighting must match original.
   Don't render afternoon light into
   a north-facing room.
4. Disclosure overlay is required
   on every staged image — small
   corner watermark "VIRTUAL
   STAGING" or jurisdictional
   equivalent.
5. Keep one un-staged photo in
   the listing alongside staged
   versions. Buyers must see both.

ANTI-PATTERNS (never produce these)
- Removing or adding architectural
  features
- Painting walls a different colour
- Changing flooring
- Adding views from windows that
  weren't there in the original
- Hiding the disclosure watermark`;

const STYLES: { style: string; for_buyer: string; example: string }[] = [
  {
    style: "Modern",
    for_buyer: "Tech professionals, urban first-time buyers, downsize-from-suburb",
    example: "Clean-line sofa in graphite, statement abstract on the long wall, walnut coffee table, single bookshelf in the corner.",
  },
  {
    style: "Classic",
    for_buyer: "Move-up buyers, established families, second-home buyers",
    example: "Hardwood furniture, layered textiles, brass fixtures, traditional artwork, oriental rug.",
  },
  {
    style: "Scandi",
    for_buyer: "Young couples, design-conscious buyers, smaller-space optimisers",
    example: "Light oak, white walls, soft wool throws, plants, minimalist art, plenty of negative space.",
  },
  {
    style: "Family",
    for_buyer: "Buyers with children, multi-generational households, return-to-school relocators",
    example: "Durable washable surfaces, warm rugs, child-height shelving, family photos in frames, soft lighting.",
  },
];

const STEPS: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "Pick the styles based on buyer pool, not aesthetic taste.",
    body: "The four styles aren't equally weighted. A property in a young-tech-professional area lists with modern + scandi as the lead images and classic + family as fallbacks. A family-suburb listing reverses this. The buyer pool dictates the style mix; the agent's personal taste is irrelevant. Get this wrong and the staging works against the listing's primary audience.",
  },
  {
    n: "02",
    title: "Geometry is sacred. Furniture is the only variable.",
    body: "The single most important rule: the room's bones — walls, ceiling lines, doors, windows, floor — must remain identical across all four versions. Only the furniture and decor change. Buyers who book a viewing after seeing the staged photos will arrive expecting the room they saw; if the geometry was altered, they'll feel deceived and the relationship is broken before the agent says hello.",
  },
  {
    n: "03",
    title: "Disclosure is non-negotiable in every market.",
    body: "EU regulations, US MLS rules, and most LatAm and MENA portals now require disclosure on virtually-staged photos — typically a small corner watermark or a clear caption. The disclosure protects the agent (consumer-protection lawsuits over staged-vs-actual mismatches are growing) and the buyer (they know what they're seeing). Hide the disclosure and the agent is exposed — both legally and reputationally.",
  },
  {
    n: "04",
    title: "Always keep one un-staged photo alongside.",
    body: "The listing should include at least one photo of the actual empty room as it stands. Buyers want to see what they're buying — the bones, the actual flooring, the natural light. The staged photos show the potential; the un-staged photo shows the reality. Both are needed; one without the other tilts the listing into either bare-bones or fantasy.",
  },
  {
    n: "05",
    title: "Cost calculus: $0 staging budget vs $800 photographer.",
    body: "Traditional virtual staging via a photographer or staging service runs $40-80 per room, $200-800 per listing. AI staging via Claude vision or SDXL pipeline runs $0.04-0.10 per image. The cost differential isn't the headline — the speed is. AI staging completes in 90 seconds; photographer staging takes 4-7 days. For a hot listing, those days cost more than the dollars.",
  },
];

const ANTI_EXAMPLES: { label: string; body: string; why: string }[] = [
  {
    label: "the geometry-changer",
    body: "[Original photo: north-facing room with one small window. Staged result: same room with three large floor-to-ceiling windows showing a sea view that wasn't there.]",
    why: "Inventing windows. Inventing views. The buyer arrives expecting the staged version and finds a different property entirely. Beyond reputational damage, this triggers consumer-protection violations in most jurisdictions. The geometry is the contract; AI must respect it.",
  },
  {
    label: "the missing disclosure",
    body: "[Staged photo published without watermark, no caption flagging virtual staging]",
    why: "Mandatory disclosure missed. Most modern MLS systems and portals will flag or remove the listing on detection — and consumer-protection regulators have started fining agents for this. The disclosure is small, unobtrusive, and required.",
  },
  {
    label: "the aesthetic over fit",
    body: "[Family-suburb 4-bed listing staged exclusively in modern minimalist with single statement art pieces and zero kid-friendly cues]",
    why: "Style mismatch with buyer pool. The family looking at this listing sees a sterile space with no room for their children's reality. The staging works against the listing's primary audience. Pick styles by buyer pool, not by what looks best in the photo.",
  },
];

export default function PromptStagingPage() {
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
            Empty room → 4 styles.
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
              Ninety seconds. $0.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Empty rooms photograph badly. Buyers struggle to see
            themselves living in them. Traditional virtual staging
            costs $200-800 per listing and takes a week. AI staging in
            four styles — modern, classic, scandi, family — runs in
            90 seconds at near-zero cost. The geometry stays sacred;
            only the furniture changes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
            <span>9-min read</span>
            <span aria-hidden>·</span>
            <span>Updated July 2026</span>
            <span aria-hidden>·</span>
            <span>Pack 23 of 30 · @lumi.estate</span>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PackSectionHeader
          eyebrow="the four styles"
          title="Pick by buyer pool, not by taste."
          description="Each style is calibrated to a specific buyer cohort. The mix is what matters — running all four blindly is wasteful, running the wrong two is worse than running none."
        />

        <div className="mt-8 space-y-4">
          {STYLES.map((s) => (
            <div
              key={s.style}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-600 font-mono font-semibold">
                {s.style}
              </div>
              <p className="mt-2 text-[14px] sm:text-[15px] text-slate-900 font-medium leading-snug">
                For: {s.for_buyer}
              </p>
              <p className="mt-3 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed italic">
                {s.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The protocol */}
      <section id="protocol" className="mx-auto max-w-3xl px-4 sm:px-6 scroll-mt-20">
        <PackSectionHeader
          eyebrow="the protocol"
          title="Five rules. One vision pipeline."
          description="The discipline of virtual staging that doesn't get the agent in legal trouble or work against the listing. Each rule protects against a specific failure mode."
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
          title="Three failures the protocol prevents."
          description="Each one is a concrete failure mode that has burned a real agent — sometimes via portal removal, sometimes via consumer-protection complaint, sometimes via lost listing."
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
          eyebrow="the prompt that controls the staging"
          title="What to feed the vision pipeline."
          description="The prompt orchestrates which style is rendered while preserving the room's geometry. Run once per (room × style) — typically 4-8 calls per listing."
        />

        <div className="mt-8 rounded-2xl bg-slate-900 text-slate-100 overflow-hidden ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-xs font-mono tracking-[0.18em] uppercase text-slate-400 gap-3">
            <span className="truncate">staging_system_prompt.md</span>
            <CopyButton text={STAGING_PROMPT} label="Copy prompt" />
          </div>
          <pre className="px-5 py-5 sm:px-6 sm:py-6 text-[12px] sm:text-[13px] leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap text-slate-100">
{STAGING_PROMPT}
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
            Pipe Claude prompt + original photo into SDXL or similar
            image-to-image pipeline. Auto-watermark on every output.
          </p>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PackBottomAd
          workflowName="this exact 4-style virtual staging pipeline"
          headlinePrimary="Generating the styles is step one."
          headlineAccent="Honouring the disclosure is step two."
        />
      </div>

      {/* Closing footnote */}
      <PackFootnote
        keyword="STAGING"
        origin={
          <>
            A real-estate adaptation of the AI image-to-image wave that&apos;s
            democratised visual production. Our slice: 4 style-tuned virtual
            stagings per empty room (modern / classic / scandi / family) with
            mandatory disclosure and geometry-preserved bones.
          </>
        }
      />
    </div>
  );
}
