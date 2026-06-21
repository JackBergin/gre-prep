/**
 * Renders one or more Schema.org objects as a JSON-LD script tag.
 *
 * Safe to use in Server Components. Each object is serialized independently so
 * a malformed entry can't break the rest of the graph.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema content is built from trusted, static site data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
