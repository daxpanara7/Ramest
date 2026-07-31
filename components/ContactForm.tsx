"use client";

import { FormEvent, useState } from "react";
import { SITE } from "@/lib/site";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

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

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
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

      {status === "sent" ? (
        <p role="status" style={{ marginBottom: "1rem", opacity: 0.85 }}>
          Thanks — we&apos;ve got your message and will reply shortly. Prefer
          email? Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      ) : null}

      <button
        type="submit"
        className="button button-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      <RecaptchaNotice />
    </form>
  );
}

