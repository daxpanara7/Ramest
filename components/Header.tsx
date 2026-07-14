"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  companyDropdown,
  getNavPageFromPath,
  isCompanyActive,
  type NavPage,
} from "@/lib/nav";
import {
  DEFAULT_ENTER_DELAY,
  DEFAULT_LEAVE_DELAY,
  useDelayedHover,
} from "@/hooks/useDelayedHover";

const MOBILE_BREAKPOINT = 768;

/** Capsule expand/collapse hover timings */
const CAPSULE_ENTER_DELAY = DEFAULT_ENTER_DELAY; // 120ms
const CAPSULE_LEAVE_DELAY = DEFAULT_LEAVE_DELAY; // 180ms

/** Company dropdown hover timings (slightly snappier than capsule) */
const DROPDOWN_ENTER_DELAY = 100;
const DROPDOWN_LEAVE_DELAY = 160;

export default function Header() {
  const pathname = usePathname();
  const activePage = getNavPageFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const companyHover = useDelayedHover({
    enterDelay: DROPDOWN_ENTER_DELAY,
    leaveDelay: DROPDOWN_LEAVE_DELAY,
    enabled: isDesktop && capsuleHover.isHovered && !menuOpen,
  });

  // Collapse company dropdown when the capsule closes
  useEffect(() => {
    if (!capsuleHover.isHovered) {
      companyHover.setHovered(false);
    }
  }, [capsuleHover.isHovered, companyHover.setHovered]);

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
    setDropdownOpen(false);
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
    setDropdownOpen(false);
    capsuleHover.setHovered(false);
    companyHover.setHovered(false);
    document.body.classList.remove("menu-open");
    // Drop focus so a clicked dropdown link cannot keep menus visually open
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [capsuleHover.setHovered, companyHover.setHovered]);

  // Close menus on route change
  useEffect(() => {
    collapseNav();
  }, [pathname, collapseNav]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) setDropdownOpen(false);
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
      return;
    }

    if (target.closest(".dropdown-toggle")) {
      e.preventDefault();
      setDropdownOpen((open) => !open);
    }
  };

  const navLinkClass = (page: NavPage) =>
    `nav-link${activePage === page ? " active" : ""}`;

  const companyActive = isCompanyActive(activePage);
  const companyDropdownVisible = dropdownOpen || companyHover.isHovered;

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
            src="/assets/logo_final.png"
            alt="Ramest Technolabs Logo"
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
          onClick={handleMenuClick}
        >
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/" className={navLinkClass("home")} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/services"
                className={navLinkClass("services")}
                onClick={closeMenu}
              >
                Services
              </Link>
            </li>
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
              className={`nav-item has-dropdown${companyDropdownVisible ? " open is-hovered" : ""}`}
              onMouseEnter={companyHover.onMouseEnter}
              onMouseLeave={companyHover.onMouseLeave}
            >
              <Link
                href="/company"
                className={`nav-link dropdown-toggle${companyActive ? " active" : ""}`}
                onClick={(e) => {
                  if (isMobile() && menuOpen) {
                    e.preventDefault();
                    setDropdownOpen((open) => !open);
                  }
                }}
              >
                Company <i className="fa-solid fa-chevron-down nav-link-arrow" />
              </Link>
              <div className="dropdown-panel">
                <p className="dropdown-header">Overview</p>
                <div className="dropdown-grid">
                  {companyDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      <i className={`fa-solid ${item.icon} dropdown-item-icon`} />
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
          <div className="nav-close" id="nav-close" role="button" aria-label="Close menu">
            <i className="fa-solid fa-xmark" />
          </div>
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
            />
          </button>
          <div className="nav-toggle" id="nav-toggle" role="button" aria-label="Open menu" onClick={openMenu}>
            <i className="fa-solid fa-bars" />
          </div>
        </div>
      </div>
    </header>
  );
}
