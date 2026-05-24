import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lumi.estate";
  const lastModified = new Date("2026-05-24T00:00:00.000Z");
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
    "/press",
    "/privacy",
    "/cookies",
    "/terms",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
