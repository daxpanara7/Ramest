"use client";

import { useRef, useState, type ReactNode } from "react";
import RolesBoard from "@/components/careers/RolesBoard";
import ApplyForm from "@/components/careers/ApplyForm";
import { ROLES } from "@/lib/careers";

/**
 * Owns the one piece of state the roles board and the apply form share: which
 * position the candidate is applying for.
 *
 * Both sections live here rather than in the page because "Apply Now!" on a
 * card has to reach into the form — lifting that state to the page would make
 * the whole page a client component for the sake of one string.
 *
 * The apply form sits at the very bottom of the page, so everything that goes
 * between it and the roles board comes through as `children`. Passing those
 * sections in keeps them server-rendered: only this wrapper is a client
 * component, not the markup it wraps.
 */
export default function HiringSection({ children }: { children?: ReactNode }) {
  const [position, setPosition] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const applyTo = (title: string) => {
    setPosition(title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus after the smooth scroll settles, so the browser does not jump the
    // page to the field and cancel the animation. The form sits at the bottom
    // of the page, so how long that takes depends on which card was clicked —
    // wait for `scrollend` rather than a fixed delay, and keep a timer for
    // browsers without it and for the case where nothing had to scroll.
    const focusField = () => {
      window.removeEventListener("scrollend", focusField);
      clearTimeout(timer);
      document.getElementById("apply-name")?.focus({ preventScroll: true });
    };
    const timer = setTimeout(focusField, 1200);
    window.addEventListener("scrollend", focusField);
  };

  return (
    <>
      <section className="section" aria-labelledby="open-roles">
        <div className="container">
          <div className="careers-head">
            <span className="careers-eyebrow">Open positions</span>
            <h2 className="section-title" id="open-roles">
              Open roles right now
            </h2>
            <p className="careers-head-lead">
              We hire selectively, so the list below is short on purpose. Pick
              the area that fits you, read the detail, and apply — every
              application is read by an engineer, not filtered by a keyword
              scanner. Not seeing your role? Apply speculatively and we will
              keep you on file.
            </p>
          </div>

          <RolesBoard roles={ROLES} onApply={applyTo} />
        </div>
      </section>

      {children}

      <section className="section apply-section" aria-labelledby="apply-now" id="apply">
        <div className="container">
          <div className="apply-layout" ref={formRef}>
            <div className="apply-intro">
              <span className="careers-eyebrow">Apply</span>
              <h2 className="section-title" id="apply-now">
                Talent + Opportunity = Growth
              </h2>
              <p className="apply-intro-lead">
                Send us your resume and we will take it from there. You will get
                a confirmation by email straight away, and a real reply from
                someone on the team — not an automated rejection three weeks
                later.
              </p>
              <ul className="apply-points">
                <li>
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  Every application is reviewed by an engineer
                </li>
                <li>
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  First conversation is technical, not HR screening
                </li>
                <li>
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  Usually a decision within two to three weeks
                </li>
              </ul>
            </div>

            <ApplyForm
              roles={ROLES}
              position={position}
              onPositionChange={setPosition}
            />
          </div>
        </div>
      </section>
    </>
  );
}
