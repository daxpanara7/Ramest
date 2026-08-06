import LegalDocument from "@/components/legal/LegalDocument";
import { legalDescription } from "@/lib/legal";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: legalDescription("privacy"),
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return <LegalDocument doc="privacy" />;
}
