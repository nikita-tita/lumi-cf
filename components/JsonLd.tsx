// JSON-LD script injection. React 18+ renders children of a <script> tag as
// a text node, which is the safe way to embed structured data. The content is
// a hard-coded object literal with no user input.
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {json}
    </script>
  );
}
