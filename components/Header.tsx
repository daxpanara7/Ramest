"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MobileServicesAccordion from "@/components/nav/MobileServicesAccordion";
import ServicesMegaMenu from "@/components/nav/ServicesMegaMenu";
import {
  companyDropdown,
  getNavPageFromPath,
  isCompanyActive,
  isServicesActive,
  type NavPage,
} from "@/lib/nav";
import {
  DEFAULT_ENTER_DELAY,
  DEFAULT_LEAVE_DELAY,
  useDelayedHover,
} from "@/hooks/useDelayedHover";

const MOBILE_BREAKPOINT = 768;

const CAPSULE_ENTER_DELAY = DEFAULT_ENTER_DELAY;
const CAPSULE_LEAVE_DELAY = DEFAULT_LEAVE_DELAY;
const DROPDOWN_ENTER_DELAY = 100;
const DROPDOWN_LEAVE_DELAY = 200;

type MobilePanel = "services" | "company" | null;

export default function Header() {
  const pathname = usePathname();
  const activePage = getNavPageFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const [isDark, setIsDark] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const navMenuRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navBtnsRef = useRef<HTMLDivElement>(null);

  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const capsuleHover = useDelayedHover({
    enterDelay: CAPSULE_ENTER_DELAY,
    leaveDelay: CAPSULE_LEAVE_DELAY,
    enabled: isDesktop && !menuOpen,
  });

  const servicesHover = useDelayedHover({
    enterDelay: DROPDOWN_ENTER_DELAY,
    leaveDelay: DROPDOWN_LEAVE_DELAY,
    enabled: isDesktop && capsuleHover.isHovered && !menuOpen,
  });

  const companyHover = useDelayedHover({
    enterDelay: DROPDOWN_ENTER_DELAY,
    leaveDelay: DROPDOWN_LEAVE_DELAY,
    enabled: isDesktop && capsuleHover.isHovered && !menuOpen,
  });

  // Only one desktop dropdown open at a time
  useEffect(() => {
    if (servicesHover.isHovered) companyHover.setHovered(false);
  }, [servicesHover.isHovered, companyHover.setHovered]);

  useEffect(() => {
    if (companyHover.isHovered) servicesHover.setHovered(false);
  }, [companyHover.isHovered, servicesHover.setHovered]);

  useEffect(() => {
    if (!capsuleHover.isHovered) {
      servicesHover.setHovered(false);
      companyHover.setHovered(false);
    }
  }, [
    capsuleHover.isHovered,
    servicesHover.setHovered,
    companyHover.setHovered,
  ]);

  const placeNavMenu = useCallback(() => {
    const navMenu = navMenuRef.current;
    const header = headerRef.current;
    const navContainer = navContainerRef.current;
    const navBtns = navBtnsRef.current;
    if (!navMenu || !header) return;

    if (isMobile()) {
      if (navMenu.parentElement !== document.body) {
        document.body.appendChild(navMenu);
      }
      return;
    }

    if (navContainer && navBtns && navMenu.parentElement !== navContainer) {
      navContainer.insertBefore(navMenu, navBtns);
    }
    setMenuOpen(false);
    setMobilePanel(null);
    document.body.classList.remove("menu-open");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("selected-theme");
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    placeNavMenu();
    window.addEventListener("resize", placeNavMenu);
    return () => window.removeEventListener("resize", placeNavMenu);
  }, [placeNavMenu]);

  const collapseNav = useCallback(() => {
    setMenuOpen(false);
    setMobilePanel(null);
    capsuleHover.setHovered(false);
    servicesHover.setHovered(false);
    companyHover.setHovered(false);
    document.body.classList.remove("menu-open");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [
    capsuleHover.setHovered,
    servicesHover.setHovered,
    companyHover.setHovered,
  ]);

  useEffect(() => {
    collapseNav();
  }, [pathname, collapseNav]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) setMobilePanel(null);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      if (window.scrollY >= 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("selected-theme", next ? "dark" : "light");
  };

  const openMenu = (e: React.MouseEvent) => {
    if (!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    placeNavMenu();
    setMenuOpen(true);
  };

  const closeMenu = () => {
    collapseNav();
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMobile() || !menuOpen) return;

    const target = e.target as HTMLElement;
    if (target.closest(".nav-close, #nav-close")) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    }
  };

  const navLinkClass = (page: NavPage) =>
    `nav-link${activePage === page ? " active" : ""}`;

  const companyActive = isCompanyActive(activePage);
  const servicesActive = isServicesActive(activePage);
  const servicesOpen = servicesHover.isHovered;
  const companyOpen = companyHover.isHovered || mobilePanel === "company";

  return (
    <header
      className={`header${capsuleHover.isHovered ? " is-hovered" : ""}${menuOpen ? " menu-open" : ""}`}
      id="header"
      ref={headerRef}
      onMouseEnter={capsuleHover.onMouseEnter}
      onMouseLeave={capsuleHover.onMouseLeave}
    >
      <div className="container nav-container" ref={navContainerRef}>
        <Link href="/" className="logo">
          <Image
            src="/assets/logo_final.webp"
            alt="Ramest Technolabs — IT consulting and software development"
            className="logo-img"
            width={687}
            height={267}
            priority
          />
        </Link>

        <nav
          ref={navMenuRef}
          className={`nav-menu${menuOpen ? " show-menu" : ""}`}
          id="nav-menu"
          aria-label="Primary"
          onClick={handleMenuClick}
        >
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/" className={navLinkClass("home")} onClick={closeMenu}>
                Home
              </Link>
            </li>

            {/* Desktop Services mega-menu */}
            <li
              className={`nav-item has-dropdown has-mega-menu desktop-only-dropdown${servicesOpen ? " open is-hovered" : ""}`}
              onMouseEnter={servicesHover.onMouseEnter}
              onMouseLeave={servicesHover.onMouseLeave}
            >
              <Link
                href="/services"
                className={`nav-link dropdown-toggle${servicesActive ? " active" : ""}`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services{" "}
                <i className="fa-solid fa-chevron-down nav-link-arrow" aria-hidden="true" />
              </Link>
              <ServicesMegaMenu open={servicesOpen} onNavigate={closeMenu} />
            </li>

            {/* Mobile Services accordion */}
            <MobileServicesAccordion
              open={mobilePanel === "services"}
              onToggle={() =>
                setMobilePanel((panel) => (panel === "services" ? null : "services"))
              }
              onNavigate={closeMenu}
              servicesActive={servicesActive}
            />

            <li className="nav-item">
              <Link
                href="/hire-developers"
                className={navLinkClass("hire-developers")}
                onClick={closeMenu}
              >
                Hire Developers
              </Link>
            </li>

            <li
              className={`nav-item has-dropdown${companyOpen ? " open is-hovered" : ""}`}
              onMouseEnter={companyHover.onMouseEnter}
              onMouseLeave={companyHover.onMouseLeave}
            >
              <div className="mobile-accordion-head company-trigger-row">
                <Link
                  href="/company"
                  className={`nav-link dropdown-toggle${companyActive ? " active" : ""}`}
                  aria-expanded={companyOpen}
                  aria-haspopup="true"
                  onClick={(e) => {
                    // Desktop: allow navigation. Mobile: collapse after navigate.
                    if (!(isMobile() && menuOpen)) return;
                    closeMenu();
                  }}
                >
                  Company{" "}
                  <i className="fa-solid fa-chevron-down nav-link-arrow" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className="mobile-accordion-toggle company-mobile-toggle"
                  aria-expanded={mobilePanel === "company"}
                  aria-label={
                    mobilePanel === "company"
                      ? "Collapse Company menu"
                      : "Expand Company menu"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMobilePanel((panel) =>
                      panel === "company" ? null : "company"
                    );
                  }}
                >
                  <i className={`fa-solid fa-chevron-down${mobilePanel === "company" ? " is-rotated" : ""}`} aria-hidden="true" />
                </button>
              </div>
              <div
                className={`dropdown-panel${mobilePanel === "company" ? " mobile-open" : ""}`}
              >
                <p className="dropdown-header">Overview</p>
                <div className="dropdown-grid">
                  {companyDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className={`fa-solid ${item.icon} dropdown-item-icon`} aria-hidden="true" />
                      <div className="dropdown-item-content">
                        <div className="dropdown-item-title">{item.title}</div>
                        <div className="dropdown-item-sub">{item.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>
          <button
            type="button"
            className="nav-close"
            id="nav-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </nav>

        <div className="nav-btns" ref={navBtnsRef}>
          <button
            className="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle Theme"
            type="button"
            onClick={toggleTheme}
          >
            <i
              className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`}
              id="theme-icon"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="nav-toggle"
            id="nav-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={openMenu}
          >
            <i className="fa-solid fa-bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
