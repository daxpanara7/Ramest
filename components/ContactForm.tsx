"use client";

import { FormEvent, useState } from "react";
import { SITE } from "@/lib/site";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    setStatus("sending");

    const subject = encodeURIComponent(
      `Project inquiry from ${trimmedName} — ${SITE.name}`
    );
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`
    );

    // Opens the user's mail client with a pre-filled message (no backend required).
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
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
          Opening your email app… If nothing opens, write us at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      ) : null}
      <button
        type="submit"
        className="button button-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Opening…" : "Send Message"}
      </button>
    </form>
  );
}
