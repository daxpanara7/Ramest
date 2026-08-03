"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api-base";
import { executeRecaptcha } from "@/lib/recaptcha";
import RecaptchaNotice from "@/components/RecaptchaNotice";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/** Same number as the phone line — wa.me wants it bare, no + or spaces. */
const WHATSAPP_NUMBER = SITE.phone.replace(/\D/g, "");

/**
 * Inline SVG, not `fa-brands fa-whatsapp`. One brand glyph pulls the 106 KB
 * fa-brands-400.woff2 onto the critical path of every page — the same trap
 * the footer icons were moved off. This path costs about 0.6 KB.
 */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 448 512" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 110.9L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-71.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-65.9-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z"
      />
    </svg>
  );
}

/**
 * Homepage inquiry form. Posts to the same public POST /api/leads the
 * contact page uses, so every enquiry lands in one place in the admin panel
 * regardless of which form captured it.
 *
 * `service` distinguishes the two in the leads table — the contact page
 * leaves it empty, this one records what the visitor said they want built.
 */
export default function InquiryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Bot filters that work even when reCAPTCHA cannot run (ad blocker, script
     blocked, keys not yet configured). See CreateLeadDto for the rationale —
     the server decides, these just supply the evidence. */
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(0);
  if (mountedAt.current === 0 && typeof performance !== "undefined") {
    mountedAt.current = performance.now();
  }

  // Same cold-start warm-up as the contact page: the API sleeps when idle.
  useEffect(() => {
    fetch(`${API_BASE}/health`, { method: "GET", keepalive: true }).catch(() => {});
    router.prefetch("/thank-you");
  }, [router]);

  useEffect(() => () => {
    if (slowTimer.current) clearTimeout(slowTimer.current);
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const n = name.trim(), em = email.trim(), msg = message.trim();

    if (!n || !em) {
      setError("Please add your name and email.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    // Server enforces @MinLength(10) on message; explain it here rather than
    // letting it come back as a generic 400.
    if (msg.length < 10) {
      setError("Please tell us a little more — at least a sentence.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setSlow(false);
    slowTimer.current = setTimeout(() => setSlow(true), 8000);

    try {
      const recaptchaToken = await executeRecaptcha("home_inquiry");
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only fields CreateLeadDto declares — the API runs
        // forbidNonWhitelisted, so an extra key is a 400.
        body: JSON.stringify({
          name: n,
          email: em,
          phone: phone.trim() || undefined,
          service: service.trim() || undefined,
          message: msg,
          recaptchaToken,
          website: honeypotRef.current?.value || undefined,
          elapsedMs: Math.round(performance.now() - mountedAt.current),
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => null);
        const m = Array.isArray(d?.message) ? d.message.join(", ") : d?.message;
        throw new Error(
          res.status === 429
            ? "Too many submissions. Please wait a minute and try again."
            : // 403 is the bot gate. A real person hitting this is almost
              // always someone whose browser blocked the reCAPTCHA script, so
              // say what to do about it and offer the channels that bypass
              // the form entirely.
              res.status === 403
              ? `Verification failed — this usually means an ad blocker or privacy extension stopped the security check. Please disable it for this page and retry, or email us at ${SITE.email}.`
              : m || "Something went wrong. Please try again.",
        );
      }

      setStatus("sent");
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSlow(false);
    }
  };

  const busy = status === "sending" || status === "sent";

  return (
    <section className="hx-section inquiry-section reveal" aria-labelledby="home-inquiry-heading">
      <div className="container">
        <div className="inquiry-card">
          <div className="inquiry-grid">
            <div className="inquiry-aside">
              <h2 className="inquiry-offer" id="home-inquiry-heading">
                Got an Idea?
                <span>Get FREE Consultation</span>
              </h2>

              {/* Sets expectations before the form rather than after it — the
                  visitor knows what happens to the message they are about to
                  send, which is what stops most people short of submitting. */}
              <div className="inquiry-next">
                <p className="inquiry-next-label">What&rsquo;s Next?</p>
                <ol className="inquiry-steps">
                  <li>
                    <span className="inquiry-step-num" aria-hidden="true">1</span>
                    <p>Drop your requirement and our expert will analyze further</p>
                  </li>
                  <li>
                    <span className="inquiry-step-num" aria-hidden="true">2</span>
                    <p>Outlining it, we will build roadmap and connect with you</p>
                  </li>
                  <li>
                    <span className="inquiry-step-num" aria-hidden="true">3</span>
                    <p>Further, finalize the approach and begin implementation</p>
                  </li>
                </ol>
              </div>

              {/* The founder answers these himself, so the card says so and
                  shows who it is rather than a generic "our team" line. His
                  direct line sits inside the same card as the face. */}
              <div className="inquiry-founder">
                <span className="inquiry-founder-avatar">
                  <img
                    src="/assets/dax-panara.webp"
                    alt="Dax Panara, Founder and CEO of Ramest Technolabs"
                    width={112}
                    height={112}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <div className="inquiry-founder-text">
                  <span className="inquiry-founder-label">Talk directly to our CEO</span>
                  <strong>Dax Panara</strong>
                  <span className="inquiry-founder-role">Founder &amp; CEO</span>
                  <a className="inquiry-founder-phone" href={`tel:${SITE.phone}`}>
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    <span>{SITE.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              {/* Direct channels for people who would rather not fill a form.
                  Real mailto:/wa.me links — they open the native app on mobile
                  and cost nothing to render. */}
              <ul className="inquiry-contacts">
                <li>
                  <a className="inquiry-chip" href={`mailto:${SITE.email}`}>
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                    <span>{SITE.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="inquiry-chip is-whatsapp"
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                    <span>Chat with Us</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="inquiry-main">
              <div className="inquiry-head">
                <span className="inquiry-eyebrow">Start a conversation</span>
                <p className="inquiry-title">Your Vision. Our Strategy. Your Success.</p>
              </div>

              <form className="inquiry-form" onSubmit={submit} noValidate>
            <div className="inquiry-row">
              <div className="inquiry-field">
                <label className="sr-only" htmlFor="inq-name">Your name</label>
                <input id="inq-name" name="name" type="text" autoComplete="name"
                  placeholder="Enter your name*" value={name}
                  onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="inquiry-field">
                <label className="sr-only" htmlFor="inq-email">Email address</label>
                <input id="inq-email" name="email" type="email" autoComplete="email"
                  placeholder="Enter email address*" value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="inquiry-row">
              <div className="inquiry-field">
                <label className="sr-only" htmlFor="inq-phone">Contact number</label>
                <input id="inq-phone" name="phone" type="tel" autoComplete="tel"
                  placeholder="Enter contact number" value={phone}
                  onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="inquiry-field">
                <label className="sr-only" htmlFor="inq-service">What you want to build</label>
                <input id="inq-service" name="service" type="text"
                  placeholder="What you want to build" value={service}
                  onChange={(e) => setService(e.target.value)} maxLength={120} />
              </div>
            </div>

            <div className="inquiry-field inquiry-field-grow">
              <label className="sr-only" htmlFor="inq-message">Message</label>
              <textarea id="inq-message" name="message" rows={5}
                placeholder="Write any message here…" value={message}
                onChange={(e) => setMessage(e.target.value)} required />
            </div>

            {/* Honeypot. Hidden from people every way that matters — off-screen
                via CSS, removed from the tab order, hidden from assistive
                tech, and opted out of autofill so a password manager cannot
                fill it either. Bots that scrape and populate every input will
                fill it; nobody else can. Not `display:none`, which some bots
                specifically skip. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="inq-website">Website (leave blank)</label>
              <input
                ref={honeypotRef}
                id="inq-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {error && <p role="alert" className="inquiry-error">{error}</p>}

            {status === "sending" && slow && (
              <p role="status" className="inquiry-status">
                <span className="btn-spinner" aria-hidden="true" />
                <span>Still working — our server is waking up. This can take up to a minute.</span>
              </p>
            )}

            {/* Button plus the reassurance line it used to sit alone beside —
                keeps the row weighted across the column instead of a small
                pill floating against empty space. */}
            <div className="inquiry-actions">
              <button type="submit" className="button button-primary" disabled={busy} aria-busy={status === "sending"}>
                {busy ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    {status === "sent" ? "Redirecting…" : slow ? "Still sending…" : "Sending…"}
                  </>
                ) : "Submit Details"}
              </button>
              <p className="inquiry-assure">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                No obligation. Reply within one business day.
              </p>
            </div>

            <RecaptchaNotice className="inquiry-recaptcha" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
