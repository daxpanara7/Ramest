"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
// Dwell before a dropdown opens (short, so it still feels instant) and grace
// after leaving before it closes (long enough to cross the capsule→panel gap).
const DROPDOWN_ENTER_DELAY = 80;
const DROPDOWN_LEAVE_DELAY = 180;

type MobilePanel = "services" | "company" | null;
type DesktopDropdown = "services" | "company" | null;

export default function Header() {
  const pathname = usePathname();
  const activePage = getNavPageFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
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

  /* ---------------------------------------------------------------------
     DESKTOP DROPDOWN CONTROLLER — single source of truth.

     Rewritten from scratch: the old design used two independent hover
     hooks (services + company) that cross-closed each other through
     effects. That is racy by construction — the pointer, the capsule
     expansion, and React batching could all land in an order that opened
     Company for a frame before Services, producing the flash.

     Here exactly ONE value describes the desktop dropdown state:
       openDropdown ∈ {"services", "company", null}
     So "both open" is impossible, and switching between menus is a single
     atomic state change (no close-then-open gap). Timers live in refs so
     they never trigger re-renders or stale-closure races.
     --------------------------------------------------------------------- */
  const [openDropdown, setOpenDropdown] = useState<DesktopDropdown>(null);
  const openDropdownRef = useRef<DesktopDropdown>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDropdownTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const applyDropdown = useCallback((next: DesktopDropdown) => {
    openDropdownRef.current = next;
    setOpenDropdown(next);
  }, []);

  // Pointer entered a dropdown trigger (or its panel — same <li> subtree).
  const enterDropdown = useCallback(
    (key: Exclude<DesktopDropdown, null>) => {
      if (!isDesktop) return;
      clearDropdownTimers();
      // Already showing this one → nothing to do.
      if (openDropdownRef.current === key) return;
      // Another menu is already open → switch instantly (atomic, no flash).
      if (openDropdownRef.current !== null) {
        applyDropdown(key);
        return;
      }
      // Nothing open yet → open after a short dwell. If the pointer is only
      // passing over on its way elsewhere, the leave/enter of the next
      // trigger clears this timer before it ever fires.
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        applyDropdown(key);
      }, DROPDOWN_ENTER_DELAY);
    },
    [isDesktop, clearDropdownTimers, applyDropdown],
  );

  // Pointer left a dropdown's <li> subtree (trigger + panel + hover bridge).
  const leaveDropdown = useCallback(() => {
    if (!isDesktop) return;
    // Cancel any pending open — we left before it committed.
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      applyDropdown(null);
    }, DROPDOWN_LEAVE_DELAY);
  }, [isDesktop, applyDropdown]);

  const closeDropdownNow = useCallback(() => {
    clearDropdownTimers();
    applyDropdown(null);
  }, [clearDropdownTimers, applyDropdown]);

  // Leaving the capsule (or going mobile) always closes the dropdown.
  useEffect(() => {
    if (!capsuleHover.isHovered || !isDesktop) closeDropdownNow();
  }, [capsuleHover.isHovered, isDesktop, closeDropdownNow]);

  // Clean up timers on unmount.
  useEffect(() => () => clearDropdownTimers(), [clearDropdownTimers]);

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
    placeNavMenu();
    window.addEventListener("resize", placeNavMenu);
    return () => window.removeEventListener("resize", placeNavMenu);
  }, [placeNavMenu]);

  const collapseNav = useCallback(() => {
    setMenuOpen(false);
    setMobilePanel(null);
    capsuleHover.setHovered(false);
    closeDropdownNow();
    document.body.classList.remove("menu-open");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [capsuleHover.setHovered, closeDropdownNow]);

  useEffect(() => {
    collapseNav();
  }, [pathname, collapseNav]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) setMobilePanel(null);
  }, [menuOpen]);

  /* Point each dropdown's diamond caret at its own trigger. The panels are
     capsule-centred, so a static left:50% caret lands on whatever sits mid
     capsule. Tracked every frame while the capsule is hovered/open, so the
     caret stays glued to Services/Company even DURING the expansion
     transition (a one-shot measurement briefly parked it under "Home"). */
  /* Position the caret SYNCHRONOUSLY the moment a dropdown opens.
     The rAF loop below keeps it glued during the capsule's expand
     transition, but rAF first fires AFTER the opening paint — so the very
     first frame rendered the caret at its `50%` fallback, which sits under
     whichever trigger happens to be mid-capsule. That one-frame jump is the
     flash of the wrong menu. useLayoutEffect runs before paint, so the
     caret is already correct on frame one. */
  useLayoutEffect(() => {
    if (!isDesktop || openDropdown === null) return;
    document
      .querySelectorAll<HTMLElement>(".nav-item.has-dropdown")
      .forEach((li) => {
        const trigger = li.querySelector<HTMLElement>(".dropdown-toggle");
        const panel = li.querySelector<HTMLElement>(".mega-menu, .dropdown-panel");
        if (!trigger || !panel) return;
        const t = trigger.getBoundingClientRect();
        const p = panel.getBoundingClientRect();
        if (!t.width || !p.width) return;
        panel.style.setProperty("--caret-x", `${t.left + t.width / 2 - p.left}px`);
      });
  }, [isDesktop, openDropdown]);

  useEffect(() => {
    if (!isDesktop) return;
    const active = capsuleHover.isHovered || openDropdown !== null;
    if (!active) return;
    let raf = 0;
    const position = () => {
      document
        .querySelectorAll<HTMLElement>(".nav-item.has-dropdown")
        .forEach((li) => {
          const trigger = li.querySelector<HTMLElement>(".dropdown-toggle");
          const panel = li.querySelector<HTMLElement>(
            ".mega-menu, .dropdown-panel",
          );
          if (!trigger || !panel) return;
          const t = trigger.getBoundingClientRect();
          const p = panel.getBoundingClientRect();
          if (!t.width || !p.width) return;
          panel.style.setProperty(
            "--caret-x",
            `${t.left + t.width / 2 - p.left}px`,
          );
        });
      raf = requestAnimationFrame(position);
    };
    raf = requestAnimationFrame(position);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, capsuleHover.isHovered, openDropdown]);

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
  const servicesOpen = openDropdown === "services";
  const companyOpen = openDropdown === "company" || mobilePanel === "company";

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
          {/* Transparent white lettering on the permanent navy capsule.
              unoptimized: the optimizer's AVIF pass smears thin serif
              strokes — served byte-exact. */}
          <Image
            src="/assets/logo_mark_light.webp"
            alt="Ramest Technolabs — IT consulting and software development"
            className="logo-img"
            width={528}
            height={206}
            priority
            unoptimized
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
              onMouseEnter={() => enterDropdown("services")}
              onMouseLeave={leaveDropdown}
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
              onMouseEnter={() => enterDropdown("company")}
              onMouseLeave={leaveDropdown}
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
