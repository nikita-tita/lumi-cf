import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// No lastModified: we don't track per-page edit dates, and every way of faking
// one is worse than omitting it. A hardcoded date goes stale the next commit;
// the build date claims all 45 pages changed on every deploy. Google ignores
// lastmod it finds inaccurate, so a wrong value teaches it to distrust ours.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lumi.estate";
  const paths = [
    "",
    "/features",
    "/how-it-works",
    "/pricing",
    "/manifesto",
    "/faq",
    "/research",
    "/join",
    "/prompt",
    "/prompt-dossier",
    "/prompt-watch",
    "/prompt-dm",
    "/prompt-graph",
    "/prompt-calls",
    "/prompt-records",
    "/prompt-silent",
    "/prompt-objection",
    "/prompt-written",
    "/prompt-multi",
    "/prompt-spouse",
    "/prompt-three-min",
    "/prompt-arrival",
    "/prompt-meeting",
    "/prompt-after",
    "/prompt-open",
    "/prompt-prep-brief",
    "/prompt-market-brief",
    "/prompt-copy",
    "/prompt-staging",
    "/prompt-comps",
    "/prompt-reel",
    "/prompt-weekly-review",
    "/prompt-score",
    "/prompt-forecast",
    "/prompt-board",
    "/prompt-quarter",
    "/prompt-cold-30",
    "/prompt-draft",
    "/prompt-scorer",
    "/prompt-voice",
    // /social is deliberately noindex (link-in-bio) — listing it here would
    // invite the crawler to a page that turns it away.
    "/press",
    "/privacy",
    "/cookies",
    "/terms",
    "/account/delete",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
