import { JsonLd } from "./JsonLd";

/**
 * Renders a BreadcrumbList JSON-LD for the current page.
 *
 * Usage: <Breadcrumbs items={[{name:"Prompts", url:"/prompt"}, {name:"Cold WA", url:"/prompt-cold-30"}]} />
 *
 * Home (lumi.estate) is auto-prepended. Each item must have absolute path (starts with /) or full URL.
 * Visible breadcrumbs UI is NOT rendered — this is structured-data only (for Google SERP).
 */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const base = "https://lumi.estate";
  const all = [{ name: "Home", url: "/" }, ...items];

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${base}${it.url}`,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Renders an Article JSON-LD — for /prompt-* pages which are essentially blog posts.
 */
export function ArticleSchema({
  title,
  description,
  slug,
  image,
  datePublished = "2026-05-01T00:00:00.000Z",
  dateModified = "2026-05-24T00:00:00.000Z",
}: {
  title: string;
  description: string;
  slug: string; // e.g. "/prompt-cold-30"
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const base = "https://lumi.estate";
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image
      ? image.startsWith("http")
        ? image
        : `${base}${image}`
      : `${base}/icon.svg`,
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: "Lumi", url: base },
    publisher: {
      "@type": "Organization",
      name: "Lumi",
      logo: { "@type": "ImageObject", url: `${base}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}${slug}` },
  };
  return <JsonLd data={data} />;
}
