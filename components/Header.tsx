"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  companyDropdown,
  isCompanyActive,
  type NavPage,
} from "@/lib/nav";

const MOBILE_BREAKPOINT = 768;

type HeaderProps = {
  activePage: NavPage;
};

export default function Header({ activePage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const navMenuRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navBtnsRef = useRef<HTMLDivElement>(null);

  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

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
    setMenuOpen(false);
    setDropdownOpen(false);
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

  return (
    <header className="header" id="header" ref={headerRef}>
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
            <li className={`nav-item has-dropdown${dropdownOpen ? " open" : ""}`}>
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
