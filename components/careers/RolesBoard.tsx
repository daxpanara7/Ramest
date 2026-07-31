"use client";

import { useState } from "react";

export type Role = {
  category: string;
  title: string;
  location: string;
  type: string;
};

/**
 * Roles board: filter pills above one bordered container whose rows are
 * separated by hairline dividers — the whole row highlights on hover.
 */
export default function RolesBoard({
  roles,
  applyHref,
}: {
  roles: Role[];
  applyHref: string;
}) {
  const categories = ["All", ...Array.from(new Set(roles.map((r) => r.category)))];
  const [active, setActive] = useState("All");

  const shown = active === "All" ? roles : roles.filter((r) => r.category === active);

  return (
    <>
      <div className="roles-filters" role="tablist" aria-label="Filter roles by area">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={`roles-filter${active === cat ? " is-active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="roles-board">
        {shown.map((role) => (
          <a href={applyHref} className="role-row" key={role.title}>
            <div className="role-main">
              <p className="role-cat">{role.category}</p>
              <h3 className="role-title">{role.title}</h3>
              <div className="role-meta">
                <span>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  {role.location}
                </span>
                <span>
                  <i className="fa-solid fa-briefcase" aria-hidden="true" />
                  {role.type}
                </span>
              </div>
            </div>
            <span className="role-apply">
              Apply now
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
