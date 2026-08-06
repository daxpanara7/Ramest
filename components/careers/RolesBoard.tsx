"use client";

import { useMemo, useState } from "react";
import { roleCategories, type Role } from "@/lib/careers";

const ALL = "All Positions";

/**
 * Roles board: a category rail on the left, one card per role on the right.
 *
 * The rail is a real tablist rather than pills above the list because the
 * category set grows over time — a vertical rail absorbs a new category
 * without reflowing the cards, and it keeps the counts readable at a glance.
 */
export default function RolesBoard({
  roles,
  onApply,
}: {
  roles: Role[];
  /** Fills the apply form's position field and scrolls to it. */
  onApply: (title: string) => void;
}) {
  const [active, setActive] = useState(ALL);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const categories = useMemo(() => roleCategories(roles), [roles]);
  const shown =
    active === ALL ? roles : roles.filter((r) => r.category === active);

  return (
    <div className="jobs-layout">
      <div
        className="jobs-rail"
        role="tablist"
        aria-orientation="vertical"
        aria-label="Filter roles by area"
      >
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            role="tab"
            aria-selected={active === cat.name}
            className={`jobs-rail-item${active === cat.name ? " is-active" : ""}`}
            onClick={() => setActive(cat.name)}
          >
            <span className="jobs-rail-label">{cat.name}</span>
            <span className="jobs-rail-count">({cat.count})</span>
          </button>
        ))}
      </div>

      <div className="jobs-list">
        {shown.map((role) => {
          const open = openSlug === role.slug;
          const detailsId = `job-details-${role.slug}`;

          return (
            <article className="job-card" key={role.slug}>
              <div className="job-card-body">
                <div className="job-card-head">
                  <h3 className="job-card-title">{role.title}</h3>
                  <span className="job-card-divider" aria-hidden="true" />
                  <span className="job-card-openings">
                    {role.openings} {role.openings === 1 ? "Opening" : "Openings"}
                  </span>
                </div>

                <div className="job-card-pills">
                  <span className="job-pill">{role.experience} Experience</span>
                  <span className="job-pill">{role.type}</span>
                  <span className="job-pill">{role.location}</span>
                </div>

                <button
                  type="button"
                  className="job-card-toggle"
                  aria-expanded={open}
                  aria-controls={detailsId}
                  onClick={() => setOpenSlug(open ? null : role.slug)}
                >
                  <i
                    className={`fa-solid ${open ? "fa-arrow-down" : "fa-arrow-up-right-from-square"}`}
                    aria-hidden="true"
                  />
                  {open ? "Hide details" : "View details"}
                </button>

                {open ? (
                  <div className="job-card-details" id={detailsId}>
                    <p className="job-card-summary">{role.summary}</p>
                    <div className="job-card-cols">
                      <div>
                        <h4 className="job-card-subhead">What you will do</h4>
                        <ul className="job-card-ul">
                          {role.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="job-card-subhead">What we look for</h4>
                        <ul className="job-card-ul">
                          {role.requirements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className="button button-primary job-card-apply"
                onClick={() => onApply(role.title)}
              >
                Apply Now!
              </button>
            </article>
          );
        })}

        {shown.length === 0 ? (
          <p className="jobs-empty">
            No roles open in this area right now — send a speculative
            application and we will keep it on file.
          </p>
        ) : null}
      </div>
    </div>
  );
}
