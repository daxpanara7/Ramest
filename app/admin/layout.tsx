import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import AdminChrome from "@/components/admin/admin-chrome";
import "./theme.css";

// Match the marketing frontend's heading face (Space Grotesk) so the admin
// reads as the same brand rather than a separate serif design.
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// The admin panel must never be indexed or crawled.
export const metadata: Metadata = {
  title: "Ramest Admin",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // admin-scope keeps admin-only styling (e.g. subtle scrollbars) from
    // leaking into the marketing site, which shares the same global CSS layer.
    <div className={`admin-scope ${displayFont.variable}`}>
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}
