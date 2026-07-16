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
