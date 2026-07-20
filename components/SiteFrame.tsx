"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Renders the marketing chrome (header/footer/skip-link) for the public site,
 * but nothing for /admin routes — the admin panel supplies its own full-screen
 * layout. Keeps the two surfaces visually separate without moving every page
 * into a route group.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main className="main" id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
