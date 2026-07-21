import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import AdminChrome from "@/components/admin/admin-chrome";
import "./theme.css";

// Display serif the ported design system uses (marketing keeps DM Serif).
const fraunces = Fraunces({
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
    <div className={`admin-scope ${fraunces.variable}`}>
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}
