import type { NavPage } from "@/lib/nav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

type SiteLayoutProps = {
  children: React.ReactNode;
  activePage: NavPage;
  includeHireInFooter?: boolean;
};

export default function SiteLayout({
  children,
  activePage,
  includeHireInFooter = true,
}: SiteLayoutProps) {
  return (
    <>
      <Header activePage={activePage} />
      <main className="main">{children}</main>
      <Footer includeHireDevelopers={includeHireInFooter} />
    </>
  );
}
