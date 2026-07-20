"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import {
  serviceCategories,
  type ServiceCategoryId,
} from "@/lib/services";

type ServicesMegaMenuProps = {
  open: boolean;
  onNavigate: () => void;
  /** Prefer keyboard focus management when panel opens */
  activeCategoryId?: ServiceCategoryId;
};

export default function ServicesMegaMenu({
  open,
  onNavigate,
  activeCategoryId = "our-services",
}: ServicesMegaMenuProps) {
  const labelId = useId();
  const [activeId, setActiveId] = useState<ServiceCategoryId>(activeCategoryId);

  useEffect(() => {
    if (open) setActiveId(activeCategoryId);
  }, [open, activeCategoryId]);

  const activeCategory =
    serviceCategories.find((c) => c.id === activeId) ?? serviceCategories[0];

  const selectCategory = useCallback((id: ServiceCategoryId) => {
    setActiveId(id);
  }, []);

  return (
    <div
      className={`mega-menu${open ? " is-open" : ""}`}
      role="region"
      aria-labelledby={labelId}
      aria-hidden={!open}
    >
      <div className="mega-menu-inner">
        <aside className="mega-menu-aside" aria-label="Service categories">
          <p className="mega-menu-kicker" id={labelId}>
            Explore
          </p>
          <ul className="mega-menu-cats" role="tablist">
            {serviceCategories.map((category) => {
              const isActive = category.id === activeCategory.id;
              return (
                <li key={category.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`mega-menu-cat${isActive ? " is-active" : ""}`}
                    onMouseEnter={() => selectCategory(category.id)}
                    onFocus={() => selectCategory(category.id)}
                    onClick={() => selectCategory(category.id)}
                  >
                    <span className="mega-menu-cat-icon" aria-hidden="true">
                      <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
                    </span>
                    <span className="mega-menu-cat-copy">
                      <span className="mega-menu-cat-title">{category.title}</span>
                    </span>
                    <i
                      className="fa-solid fa-chevron-right mega-menu-cat-arrow"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/services"
            className="mega-menu-aside-cta"
            onClick={onNavigate}
          >
            View all services
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </aside>

        <div className="mega-menu-main" role="tabpanel">
          <div className="mega-menu-main-head">
            <div className="mega-menu-main-copy">
              <h3 className="mega-menu-main-title">{activeCategory.title}</h3>
              <p className="mega-menu-main-desc">{activeCategory.description}</p>
            </div>
            <Link
              href={activeCategory.href}
              className="mega-menu-section-link"
              onClick={onNavigate}
            >
              Browse section
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mega-menu-grid">
            {activeCategory.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className="mega-menu-item"
                  onClick={onNavigate}
                >
                  <span className="mega-menu-item-icon" aria-hidden="true">
                    <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
                  </span>
                  <span className="mega-menu-item-copy">
                    <span className="mega-menu-item-title">{service.title}</span>
                    <span className="mega-menu-item-sub">
                      {service.shortDescription}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mega-menu-footer">
            <p className="mega-menu-footer-text">
              Need a tailored engagement model?
            </p>
            <Link
              href="/contact"
              className="mega-menu-footer-cta"
              onClick={onNavigate}
            >
              Talk to an expert
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
