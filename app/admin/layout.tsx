import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import "@/styles/admin.css";

// The admin panel must never be indexed or crawled.
export const metadata: Metadata = {
  title: "Ramest Admin",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
