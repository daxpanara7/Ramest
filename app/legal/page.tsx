import LegalDocument from "@/components/legal/LegalDocument";
import { legalDescription } from "@/lib/legal";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Terms & Conditions",
  description: legalDescription("terms"),
  path: "/legal",
});

export default function TermsPage() {
  return <LegalDocument doc="terms" />;
}
