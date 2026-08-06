/* Route-scoped styles. Both legal documents share this sheet, and nothing
   else on the site uses it, so it is imported here rather than in globals.css
   — see the note at the top of app/globals.css. */
import "../../styles/legal.css";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
