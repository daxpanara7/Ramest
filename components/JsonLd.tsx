import { organizationJsonLd, websiteJsonLd } from "@/lib/site";

/**
 * Renders structured data as a plain <script> in the server HTML.
 *
 * Deliberately NOT next/script: that defers injection to the client, so the
 * JSON-LD never appears in the static HTML and crawlers (and the Rich Results
 * Test) can miss it entirely.
 */
export function JsonLdScript({ id, data }: { id: string; data: unknown }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Structured data is built from our own trusted constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide structured data emitted as a single @graph so the Organization and
 * WebSite nodes cross-reference by @id instead of being duplicated per page.
 */
export default function JsonLd() {
  // Strip the per-node @context — the graph declares it once at the top.
  const { "@context": _org, ...organization } = organizationJsonLd();
  const { "@context": _site, ...website } = websiteJsonLd();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return <JsonLdScript id="site-jsonld" data={graph} />;
}
