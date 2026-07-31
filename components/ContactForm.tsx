"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api-base";
import { executeRecaptcha } from "@/lib/recaptcha";
import RecaptchaNotice from "@/components/RecaptchaNotice";

type FormStatus = "idle" | "sending" | "sent" | "error";

/**
 * Posts to the backend's public POST /api/leads endpoint, which stores the
 * lead, emails the team, and records a reCAPTCHA v3 score.
 *
 * This replaced a `mailto:` link. That version depended on the visitor having
 * a configured mail client — on a shared or office desktop it silently does
 * nothing — and no enquiry was ever recorded, so anything lost that way was
 * invisible.
 *
 * Note the backend *scores* leads rather than blocking them: a submission
 * with a missing or weak captcha token is still stored, just flagged. Losing
 * a real enquiry is worse than filing a junk one.
 */
export default function ContactForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Wake the API as soon as the form is on screen.
   *
   * Render's free tier sleeps after ~15 minutes idle and takes 50s+ to cold
   * start, which lands entirely on whoever submits first. A visitor spends
   * 30-60s filling this form, so pinging health on mount usually means the
   * container is already awake by the time they hit Send.
   *
   * keepalive + ignored failure: this is best-effort warming, never
   * something the user should see or that can block the real submit.
   */
  useEffect(() => {
    fetch(`${API_BASE}/health`, { method: "GET", keepalive: true }).catch(() => {});
    // Preload the redirect target so the post-submit navigation is instant.
    router.prefetch("/thank-you");
  }, [router]);

  useEffect(() => () => {
    if (slowTimer.current) clearTimeout(slowTimer.current);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError("Please fill in your name, email, and project details.");
      setStatus("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    // Mirrors the server's @MinLength(10) so the rule is explained here
    // rather than coming back as a generic 400.
    if (trimmedMessage.length < 10) {
      setError("Please add a little more detail about your project.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setSlow(false);
    // A warm submit takes ~3s, a cold start ~50s. 8s is past the healthy
    // case but well inside the cold one, so this copy only appears when
    // the wait is genuinely unusual.
    slowTimer.current = setTimeout(() => setSlow(true), 8000);

    try {
      const recaptchaToken = await executeRecaptcha("contact");

      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only fields CreateLeadDto declares — the backend's global pipe runs
        // forbidNonWhitelisted, so any extra key here is a 400.
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;
        // 429 is the per-IP throttle, which reads as a bug unless named.
        throw new Error(
          res.status === 429
            ? "Too many submissions. Please wait a minute and try again."
            : msg || "Something went wrong. Please try again.",
        );
      }

      // Redirect to the conversion page — ad platforms count a visit to
      // /thank-you as a lead, which an inline message can never signal.
      setStatus("sent");
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSlow(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="sr-only" htmlFor="contact-name">
          Your Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your Name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="sr-only" htmlFor="contact-email">
          Your Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your Email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="sr-only" htmlFor="contact-message">
          Project Details
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Project Details"
          rows={5}
          className="form-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p role="alert" style={{ color: "var(--first-color)", marginBottom: "1rem" }}>
          {error}
        </p>
      ) : null}

      {/* Cold-start explainer. The API sleeps when idle and can take ~50s to
          wake; an unexplained wait that long reads as a broken form. */}
      {status === "sending" && slow ? (
        <p role="status" className="form-status">
          <span className="btn-spinner" aria-hidden="true" />
          <span>
            Still working — our server is waking up. This can take up to a
            minute the first time. Please don&apos;t close this page.
          </span>
        </p>
      ) : null}

      {/* Shown only for the instant before the /thank-you navigation lands. */}
      {status === "sent" ? (
        <p role="status" className="form-status">
          <span className="btn-spinner" aria-hidden="true" />
          <span>Thanks — taking you to your confirmation…</span>
        </p>
      ) : null}

      <button
        type="submit"
        className="button button-primary"
        disabled={status === "sending" || status === "sent"}
        aria-busy={status === "sending"}
      >
        {status === "sending" || status === "sent" ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            {status === "sent" ? "Redirecting…" : slow ? "Still sending…" : "Sending…"}
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <RecaptchaNotice />
    </form>
  );
}

