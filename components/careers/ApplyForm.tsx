"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { API_BASE } from "@/lib/api-base";
import { useApiWarmup } from "@/lib/use-api-warmup";
import { executeRecaptcha } from "@/lib/recaptcha";
import RecaptchaNotice from "@/components/RecaptchaNotice";
import FieldError from "@/components/forms/FieldError";
import { fieldAria, useFieldErrors } from "@/lib/useFieldErrors";
import {
  LIMITS,
  validateEmail,
  validateExperience,
  validateFile,
  validateName,
  validatePosition,
  validateRequiredPhone,
} from "@/lib/form-validation";
import { SITE } from "@/lib/site";
import type { Role } from "@/lib/careers";

type FormStatus = "idle" | "sending" | "sent" | "error";

/** Mirrors ALLOWED_RESUME_MIME on the server, so a bad file is named here
 *  rather than coming back as a generic 400 after a 5 MB upload. */
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".rtf"];
const ACCEPTED = ACCEPTED_EXTENSIONS.join(",");
const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/rtf",
]);
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Careers application form. Posts multipart/form-data to the backend's public
 * POST /api/applications, which stores the application plus the CV, emails HR,
 * and confirms to the candidate.
 *
 * Multipart rather than JSON because of the resume — that is also why this
 * cannot reuse ContactForm's JSON fetch path.
 */
export default function ApplyForm({
  roles,
  position,
  onPositionChange,
}: {
  roles: Role[];
  /** Controlled from the parent so "Apply Now!" on a card prefills it. */
  position: string;
  onPositionChange: (value: string) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);

  /* Per-field rules, mirroring CreateApplicationDto. `error` above stays for
     what the server says back (throttled, captcha, network) — anything that is
     not about one specific input. */
  const { errors, validate, revalidate, validateAll, setFieldError } =
    useFieldErrors({
      fullName: validateName,
      email: validateEmail,
      phone: validateRequiredPhone,
      totalExperience: validateExperience,
      position: validatePosition,
    });
  const FIELD_IDS = {
    fullName: "apply-name",
    email: "apply-email",
    phone: "apply-phone",
    totalExperience: "apply-experience",
    position: "apply-position",
  };

  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(0);
  if (mountedAt.current === 0 && typeof performance !== "undefined") {
    mountedAt.current = performance.now();
  }

  /* Wake the API while the candidate is still filling the form — Render's
     free tier sleeps after ~15 min idle and a cold start lands entirely on
     whoever submits first. Fires on first engagement rather than on mount so
     page load makes no backend request; see lib/use-api-warmup.ts. */
  const formRef = useApiWarmup<HTMLFormElement>();

  useEffect(
    () => () => {
      if (slowTimer.current) clearTimeout(slowTimer.current);
    },
    [],
  );

  const pickFile = (file: File | null) => {
    setError("");
    if (!file) {
      setResume(null);
      setFieldError("resume", null);
      return;
    }
    const problem = validateFile(file, {
      accept: ACCEPTED_MIME,
      extensions: ACCEPTED_EXTENSIONS,
      maxBytes: MAX_BYTES,
      label: "Your resume",
    });
    if (problem) {
      setResume(null);
      setFieldError("resume", problem);
      // Clear the control too, or re-picking the same file fires no change
      // event and the candidate cannot retry with it.
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setStatus("idle");
    setFieldError("resume", null);
    setResume(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const values = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      totalExperience: experience.trim(),
      position: position.trim(),
    };

    /* Declared in visual order so validateAll focuses the topmost failure.
       Every rule here is enforced again server-side — this only saves a round
       trip and puts the reason next to the input that caused it. */
    const fieldsOk = validateAll(
      {
        fullName,
        email,
        phone,
        totalExperience: experience,
        position,
      },
      FIELD_IDS,
    );
    if (!fieldsOk) {
      setStatus("error");
      return;
    }
    // The resume is judged at pick time, so this only catches "never picked
    // one" — which cannot be a field-level blur error, there is nothing to
    // blur out of.
    if (!resume) {
      setStatus("error");
      setFieldError("resume", "Please attach your resume so we have something to review.");
      document.getElementById("apply-resume")?.focus();
      return;
    }

    setStatus("sending");
    setSlow(false);
    slowTimer.current = setTimeout(() => setSlow(true), 8000);

    try {
      const recaptchaToken = await executeRecaptcha("careers_apply");

      // Only fields CreateApplicationDto declares — the backend's global pipe
      // runs forbidNonWhitelisted, so any extra key here is a 400.
      const body = new FormData();
      Object.entries(values).forEach(([k, v]) => body.append(k, v));
      body.append("resume", resume);
      if (recaptchaToken) body.append("recaptchaToken", recaptchaToken);
      if (honeypotRef.current?.value) body.append("website", honeypotRef.current.value);
      body.append(
        "elapsedMs",
        String(Math.round(performance.now() - mountedAt.current)),
      );

      // No Content-Type header on purpose: the browser must set the multipart
      // boundary itself, and setting it manually breaks the upload.
      const res = await fetch(`${API_BASE}/applications`, { method: "POST", body });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;
        throw new Error(
          res.status === 429
            ? "Too many submissions. Please wait a minute and try again."
            : res.status === 403
              ? `Verification failed — this usually means an ad blocker or privacy extension stopped the security check. Please disable it for this page and retry, or email us at ${SITE.email}.`
              : msg || "Something went wrong. Please try again.",
        );
      }

      setStatus("sent");
      setFullName("");
      setEmail("");
      setPhone("");
      setExperience("");
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSlow(false);
    }
  };

  if (status === "sent") {
    return (
      <div className="apply-card apply-card-done" role="status">
        <span className="apply-done-icon" aria-hidden="true">
          <i className="fa-solid fa-check" />
        </span>
        <h3 className="apply-done-title">Application received</h3>
        <p className="apply-done-text">
          Thanks — it is with our team now, and a confirmation is on its way to
          your inbox. If it looks like a fit we will reach out to arrange a first
          conversation.
        </p>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setStatus("idle")}
        >
          Submit another application
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <div className="apply-card">
      <h3 className="apply-title">Apply Now!</h3>

      <form
        ref={formRef}
        className="apply-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="apply-grid">
          <div className="apply-field">
            <label htmlFor="apply-name">
              Full Name<span aria-hidden="true">*</span>
            </label>
            <input
              id="apply-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              value={fullName}
              maxLength={LIMITS.name}
              onChange={(e) => {
                setFullName(e.target.value);
                revalidate("fullName", e.target.value);
              }}
              onBlur={(e) => validate("fullName", e.target.value)}
              {...fieldAria("apply-name", errors.fullName)}
              required
            />
            <FieldError id="apply-name-error" message={errors.fullName} />
          </div>

          <div className="apply-field">
            <label htmlFor="apply-email">
              Email<span aria-hidden="true">*</span>
            </label>
            <input
              id="apply-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              maxLength={LIMITS.email}
              onChange={(e) => {
                setEmail(e.target.value);
                revalidate("email", e.target.value);
              }}
              onBlur={(e) => validate("email", e.target.value)}
              {...fieldAria("apply-email", errors.email)}
              required
            />
            <FieldError id="apply-email-error" message={errors.email} />
          </div>

          <div className="apply-field">
            <label htmlFor="apply-phone">
              Mobile Number<span aria-hidden="true">*</span>
            </label>
            <input
              id="apply-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 00000 00000"
              value={phone}
              maxLength={LIMITS.phone}
              onChange={(e) => {
                setPhone(e.target.value);
                revalidate("phone", e.target.value);
              }}
              onBlur={(e) => validate("phone", e.target.value)}
              {...fieldAria("apply-phone", errors.phone)}
              required
            />
            <FieldError id="apply-phone-error" message={errors.phone} />
          </div>

          <div className="apply-field">
            <label htmlFor="apply-experience">
              Total Experience<span aria-hidden="true">*</span>
            </label>
            <input
              id="apply-experience"
              name="totalExperience"
              type="text"
              placeholder="e.g. 3 years, or Fresher"
              value={experience}
              maxLength={LIMITS.totalExperience}
              onChange={(e) => {
                setExperience(e.target.value);
                revalidate("totalExperience", e.target.value);
              }}
              onBlur={(e) => validate("totalExperience", e.target.value)}
              {...fieldAria("apply-experience", errors.totalExperience)}
              required
            />
            <FieldError
              id="apply-experience-error"
              message={errors.totalExperience}
            />
          </div>

          <div className="apply-field apply-field-wide">
            <label htmlFor="apply-position">
              Position Applied For<span aria-hidden="true">*</span>
            </label>
            {/* A datalist rather than a select: the roles are suggestions, but
                a strong candidate for something we have not posted should not
                be stopped by the form. */}
            <input
              id="apply-position"
              name="position"
              type="text"
              list="apply-position-options"
              placeholder="Position Applied For"
              value={position}
              maxLength={LIMITS.position}
              onChange={(e) => {
                onPositionChange(e.target.value);
                revalidate("position", e.target.value);
              }}
              onBlur={(e) => validate("position", e.target.value)}
              {...fieldAria("apply-position", errors.position)}
              required
            />
            <datalist id="apply-position-options">
              {roles.map((role) => (
                <option key={role.slug} value={role.title} />
              ))}
              <option value="Speculative — open to any role" />
            </datalist>
            <FieldError id="apply-position-error" message={errors.position} />
          </div>
        </div>

        {/* Honeypot — see .hp-field in globals.css for why it is off-screen
            rather than display:none. */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="apply-website">Website (leave blank)</label>
          <input
            ref={honeypotRef}
            id="apply-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="apply-actions">
          <label className="apply-file" htmlFor="apply-resume">
            <i className="fa-solid fa-paperclip" aria-hidden="true" />
            <span className="apply-file-label">
              {resume ? resume.name : "Resume File"}
            </span>
            <input
              ref={fileInputRef}
              id="apply-resume"
              name="resume"
              type="file"
              accept={ACCEPTED}
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              {...fieldAria("apply-resume", errors.resume)}
            />
          </label>
          <span className="apply-file-hint">PDF, DOC, DOCX or RTF · up to 5 MB</span>

          <button
            type="submit"
            className="button button-primary apply-submit"
            disabled={sending}
            aria-busy={sending}
          >
            {sending ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                {slow ? "Still sending…" : "Sending…"}
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        <FieldError id="apply-resume-error" message={errors.resume} />

        {error ? (
          <p role="alert" className="apply-error">
            {error}
          </p>
        ) : null}

        {/* Cold-start explainer. The API sleeps when idle and can take ~50s to
            wake; an unexplained wait that long reads as a broken form. */}
        {sending && slow ? (
          <p role="status" className="form-status">
            <span className="btn-spinner" aria-hidden="true" />
            <span>
              Still working — our server is waking up. This can take up to a
              minute the first time. Please don&apos;t close this page.
            </span>
          </p>
        ) : null}

        <p className="apply-mandatory">
          <span aria-hidden="true">*</span>Mandatory
        </p>

        <RecaptchaNotice />
      </form>
    </div>
  );
}
