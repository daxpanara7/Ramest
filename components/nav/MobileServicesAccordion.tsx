"use client";

import Link from "next/link";
import { useState } from "react";
import {
  serviceCategories,
  type ServiceCategoryId,
} from "@/lib/services";

type MobileServicesAccordionProps = {
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  servicesActive: boolean;
};

export default function MobileServicesAccordion({
  open,
  onToggle,
  onNavigate,
  servicesActive,
}: MobileServicesAccordionProps) {
  const [expandedCategory, setExpandedCategory] =
    useState<ServiceCategoryId | null>("our-services");

  const toggleCategory = (id: ServiceCategoryId) => {
    setExpandedCategory((current) => (current === id ? null : id));
  };

  return (
    <li className={`nav-item mobile-accordion${open ? " is-open" : ""}`}>
      <div className="mobile-accordion-head">
        <Link
          href="/services"
          className={`nav-link${servicesActive ? " active" : ""}`}
          onClick={onNavigate}
        >
          Services
        </Link>
        <button
          type="button"
          className="mobile-accordion-toggle"
          aria-expanded={open}
          aria-controls="mobile-services-panel"
          aria-label={open ? "Collapse Services menu" : "Expand Services menu"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
        >
          <i className={`fa-solid fa-chevron-down${open ? " is-rotated" : ""}`} aria-hidden="true" />
        </button>
      </div>

      <div
        id="mobile-services-panel"
        className={`mobile-accordion-panel${open ? " is-open" : ""}`}
        hidden={!open}
      >
        {serviceCategories.map((category) => {
          const catOpen = expandedCategory === category.id;
          return (
            <div
              key={category.id}
              className={`mobile-accordion-group${catOpen ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="mobile-accordion-category"
                aria-expanded={catOpen}
                onClick={() => toggleCategory(category.id)}
              >
                <span className="mobile-accordion-category-icon" aria-hidden="true">
                  <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
                </span>
                <span>{category.title}</span>
                <i
                  className={`fa-solid fa-chevron-down mobile-accordion-chevron${catOpen ? " is-rotated" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <ul
                className={`mobile-accordion-links${catOpen ? " is-open" : ""}`}
                hidden={!catOpen}
              >
                {category.items.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={service.href}
                      className="mobile-accordion-link"
                      onClick={onNavigate}
                    >
                      <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
                      <span>{service.title}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={category.href}
                    className="mobile-accordion-link mobile-accordion-link--all"
                    onClick={onNavigate}
                  >
                    View all in {category.shortTitle}
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </li>
  );
}
