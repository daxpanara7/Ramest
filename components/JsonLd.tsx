import Script from "next/script";
import { organizationJsonLd } from "@/lib/site";

/** Organization structured data for richer search results. */
export default function JsonLd() {
  const data = organizationJsonLd();
  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
