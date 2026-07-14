import Link from "next/link";
import { companyOverviewItems } from "@/lib/nav";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Company",
  description:
    "Learn about Ramest Technolabs — our team, infrastructure, certifications, alliances, and development methodology.",
  path: "/company",
});

export default function Page() {
  return (
    <section className="section" id="company" style={{ paddingTop: "8rem" }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Company Overview</h2>
          <p className="section-subtitle">Everything about Ramest Technolabs</p>
        </div>

        <div className="company-overview-grid">
          {companyOverviewItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="company-overview-item"
            >
              <div className="company-overview-item-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.sub}</p>
              <i className="fa-solid fa-arrow-right item-arrow"></i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
