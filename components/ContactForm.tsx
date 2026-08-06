"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api-base";
import { useApiWarmup } from "@/lib/use-api-warmup";
import { executeRecaptcha } from "@/lib/recaptcha";
import RecaptchaNotice from "@/components/RecaptchaNotice";
import PhoneField from "@/components/sections/PhoneField";
import SelectField from "@/components/sections/SelectField";
import FieldError from "@/components/forms/FieldError";
import { fieldAria, useFieldErrors } from "@/lib/useFieldErrors";
import {
  LIMITS,
  formatBytes,
  validateCompany,
  validateEmail,
  validateFile,
  validateMessage,
  validateName,
  validateOptionalPhone,
} from "@/lib/form-validation";
import { BUDGET_OPTIONS, SERVICE_OPTIONS } from "@/lib/lead-options";
import { DEFAULT_COUNTRY, guessCountry, type Country } from "@/lib/country-codes";
import { SITE } from "@/lib/site";

type FormStatus = "idle" | "sending" | "sent" | "error";

/**
 * What a prospect may attach, kept in step with ALLOWED_ATTACHMENT_MIME on the
 * server. The server is the authority — this only spares someone picking a
 * file that was always going to be refused.
 */
const ATTACHMENT_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".png", ".jpg", ".jpeg", ".zip", ".txt",
];
const ACCEPT_ATTACHMENT = ATTACHMENT_EXTENSIONS.join(",");

/** One-for-one with ALLOWED_ATTACHMENT_MIME on the server. */
const ACCEPT_ATTACHMENT_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "application/zip",
  "text/plain",
]);

/** Mirrors MAX_ATTACHMENT_BYTES on the server. */
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

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
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* Per-field rules, mirroring CreateLeadDto. `error` above stays for what the
     server says back (throttled, captcha, network) — anything that is not
     about one specific input. */
  const { errors, validate, revalidate, validateAll, setFieldError } =
    useFieldErrors({
      name: validateName,
      email: validateEmail,
      phone: validateOptionalPhone,
      company: validateCompany,
      message: validateMessage,
    });
  const FIELD_IDS = {
    name: "contact-name",
    email: "contact-email",
    phone: "contact-phone",
    company: "contact-company",
    message: "contact-message",
  };

  /* Checked as the file is picked rather than at submit: someone who attaches
     a 40 MB video should be told immediately, not after filling the rest. */
  const pickAttachment = (file: File | null) => {
    if (!file) {
      setAttachment(null);
      setFieldError("attachment", null);
      return;
    }
    const problem = validateFile(file, {
      accept: ACCEPT_ATTACHMENT_MIME,
      extensions: ATTACHMENT_EXTENSIONS,
      maxBytes: MAX_ATTACHMENT_BYTES,
      label: "Your brief",
    });
    if (problem) {
      setAttachment(null);
      setFieldError("attachment", problem);
      // Clear the control too, or re-picking the same file fires no change
      // event and the visitor cannot retry with it.
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFieldError("attachment", null);
    setAttachment(file);
  };

  /* Same two bot filters as the homepage inquiry form — this posts to the
     same public endpoint, so leaving it unprotected would just move the
     spam here. See CreateLeadDto for why these exist alongside reCAPTCHA. */
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(0);
  if (mountedAt.current === 0 && typeof performance !== "undefined") {
    mountedAt.current = performance.now();
  }

  /**
   * Wake the API on first engagement with the form.
   *
   * Render's free tier sleeps after ~15 minutes idle and takes 50s+ to cold
   * start, which lands entirely on whoever submits first. A visitor spends
   * 30-60s filling this form, so warming it the moment they focus a field
   * still means the container is awake by the time they hit Send.
   *
   * This used to fire on mount, which opened a backend request during page
   * load on every visit — and logged a console error whenever the API was
   * asleep. See lib/use-api-warmup.ts.
   */
  const formRef = useApiWarmup<HTMLFormElement>(() => {
    // Preload the redirect target so the post-submit navigation is instant.
    router.prefetch("/thank-you");
  });

  /* Pre-select the dialling code from the browser locale, so the common case
     needs no interaction. Deliberately in an effect: guessCountry reads
     navigator, which does not exist during the server render. */
  useEffect(() => {
    const guess = guessCountry();
    if (guess) setCountry(guess);
  }, []);

  useEffect(() => () => {
    if (slowTimer.current) clearTimeout(slowTimer.current);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    /* Declared in visual order so validateAll focuses the topmost failure.
       Every rule here is enforced again server-side — this only saves a round
       trip and puts the reason next to the input that caused it. The
       attachment is already judged at pick time, so it is not repeated. */
    if (!validateAll({ name, email, phone, company, message }, FIELD_IDS)) {
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

      /* multipart/form-data rather than JSON, because this form can carry a
         brief. Sent the same way whether or not a file is attached, so there
         is only one code path to reason about.

         Content-Type is deliberately NOT set: the browser has to write it
         itself to include the multipart boundary, and setting it by hand
         produces a body the server cannot parse.

         Only fields CreateLeadDto declares — the backend's global pipe runs
         forbidNonWhitelisted, so any extra key here is a 400. */
      const body = new FormData();
      body.set("name", trimmedName);
      body.set("email", trimmedEmail);
      body.set("message", trimmedMessage);
      body.set("source", "contact");

      const digits = phone.replace(/\D/g, "");
      // Stored with the dialling code so the admin can dial it as-is.
      if (digits) body.set("phone", `+${country.dial} ${digits}`);
      if (company.trim()) body.set("company", company.trim());
      if (service) body.set("service", service);
      if (budget) body.set("budget", budget);
      if (attachment) body.set("attachment", attachment);
      if (recaptchaToken) body.set("recaptchaToken", recaptchaToken);

      const honeypot = honeypotRef.current?.value;
      if (honeypot) body.set("website", honeypot);
      body.set(
        "elapsedMs",
        String(Math.round(performance.now() - mountedAt.current)),
      );

      const res = await fetch(`${API_BASE}/leads`, { method: "POST", body });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;
        // 429 is the per-IP throttle, which reads as a bug unless named.
        throw new Error(
          res.status === 429
            ? "Too many submissions. Please wait a minute and try again."
            : // See InquiryForm — 403 is the bot gate, and the realistic
              // cause for a human is a blocked reCAPTCHA script.
              res.status === 403
              ? `Verification failed — this usually means an ad blocker or privacy extension stopped the security check. Please disable it for this page and retry, or email us at ${SITE.email}.`
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
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
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
          maxLength={LIMITS.name}
          onChange={(e) => {
            setName(e.target.value);
            revalidate("name", e.target.value);
          }}
          onBlur={(e) => validate("name", e.target.value)}
          {...fieldAria("contact-name", errors.name)}
          required
        />
        <FieldError id="contact-name-error" message={errors.name} />
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
          maxLength={LIMITS.email}
          onChange={(e) => {
            setEmail(e.target.value);
            revalidate("email", e.target.value);
          }}
          onBlur={(e) => validate("email", e.target.value)}
          {...fieldAria("contact-email", errors.email)}
          required
        />
        <FieldError id="contact-email-error" message={errors.email} />
      </div>

      {/* Phone and company share a row on desktop and stack on mobile. The
          phone column is wider because a third of it is the country trigger. */}
      <div className="form-row form-row-phone">
        <div className="form-group">
          <label className="sr-only" htmlFor="contact-phone">
            Contact number
          </label>
          <PhoneField
            id="contact-phone"
            value={phone}
            onValueChange={(v) => {
              setPhone(v);
              revalidate("phone", v);
            }}
            onBlur={(v) => validate("phone", v)}
            country={country}
            onCountryChange={setCountry}
            placeholder="Phone number"
            invalid={Boolean(errors.phone)}
            describedBy={errors.phone ? "contact-phone-error" : undefined}
          />
          <FieldError id="contact-phone-error" message={errors.phone} />
        </div>
        <div className="form-group">
          <label className="sr-only" htmlFor="contact-company">
            Company name
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
            className="form-input"
            value={company}
            maxLength={LIMITS.company}
            onChange={(e) => {
              setCompany(e.target.value);
              revalidate("company", e.target.value);
            }}
            onBlur={(e) => validate("company", e.target.value)}
            {...fieldAria("contact-company", errors.company)}
          />
          <FieldError id="contact-company-error" message={errors.company} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="sr-only" htmlFor="contact-service">
            Interested service
          </label>
          <SelectField
            id="contact-service"
            name="service"
            value={service}
            onChange={setService}
            placeholder="Interested Service"
            options={SERVICE_OPTIONS}
          />
        </div>
        <div className="form-group">
          <label className="sr-only" htmlFor="contact-budget">
            Project budget
          </label>
          <SelectField
            id="contact-budget"
            name="budget"
            value={budget}
            onChange={setBudget}
            placeholder="Select Project Budget"
            options={BUDGET_OPTIONS}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="sr-only" htmlFor="contact-message">
          Project Details
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Please describe your project requirements"
          rows={5}
          className="form-input"
          value={message}
          maxLength={LIMITS.message}
          onChange={(e) => {
            setMessage(e.target.value);
            revalidate("message", e.target.value);
          }}
          onBlur={(e) => validate("message", e.target.value)}
          {...fieldAria("contact-message", errors.message)}
          required
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* Attachment. The real <input type="file"> is visually hidden but
          still focusable and still the thing that gets clicked — the label is
          its control, so keyboard and screen-reader behaviour is the native
          one rather than a div pretending to be a button. */}
      <div className="form-group form-attach">
        <input
          ref={fileRef}
          id="contact-attachment"
          name="attachment"
          type="file"
          className="form-attach-input"
          accept={ACCEPT_ATTACHMENT}
          onChange={(e) => pickAttachment(e.target.files?.[0] ?? null)}
          {...fieldAria("contact-attachment", errors.attachment)}
        />
        <label className="form-attach-label" htmlFor="contact-attachment">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
            <path
              d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{attachment ? "Change file" : "Attach a brief (optional)"}</span>
        </label>

        {attachment ? (
          <span className="form-attach-file">
            <span className="form-attach-name" title={attachment.name}>
              {attachment.name}
            </span>
            <span className="form-attach-size">{formatBytes(attachment.size)}</span>
            <button
              type="button"
              className="form-attach-remove"
              onClick={() => {
                setAttachment(null);
                // Clear the input too, or re-picking the same file fires no
                // change event and the attachment silently fails to come back.
                if (fileRef.current) fileRef.current.value = "";
              }}
              aria-label={`Remove ${attachment.name}`}
            >
              ×
            </button>
          </span>
        ) : (
          <span className="form-attach-hint">PDF, Word, Excel, images or ZIP — up to 10 MB</span>
        )}

        <FieldError id="contact-attachment-error" message={errors.attachment} />
      </div>

      {/* Honeypot — see .hp-field in globals.css for why it is positioned
          off-screen rather than display:none. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Website (leave blank)</label>
        <input
          ref={honeypotRef}
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
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

