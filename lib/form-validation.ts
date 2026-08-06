/**
 * Field rules for the three public forms, mirroring the server DTOs
 * (`CreateLeadDto`, `CreateApplicationDto`).
 *
 * The server remains the authority — nothing here is a security boundary, and
 * every rule below is enforced again in `class-validator`. These exist so a
 * visitor is told what is wrong *beside the field they typed it in*, before a
 * round trip that would otherwise come back as one flattened 400 message with
 * no indication of which input caused it.
 *
 * Each validator returns null when the value is acceptable, or the sentence to
 * show under the field. They all take the raw (untrimmed) value, because the
 * caller holds it as typed and the trim is part of the rule.
 */

/**
 * Maximum lengths, one-for-one with the `@MaxLength` decorators on the DTOs.
 * Also fed to the inputs' `maxLength` so the cap is enforced while typing
 * rather than only on submit.
 */
export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  message: 5000,
  totalExperience: 60,
  position: 160,
} as const;

/**
 * Deliberately not an RFC 5322 regex: that accepts addresses no provider
 * issues, and every extra character class is another way to reject a real
 * lead. This is the shape `@IsEmail` accepts for ordinary addresses — one @,
 * a dot in the domain, and a two-letter-or-longer TLD.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/** Characters `@Matches(/^[0-9+\-() .]+$/)` allows on the application phone. */
const PHONE_CHARS_RE = /^[0-9+\-() .]+$/;

/** A link in a name or company field is a bot fill, never a person. */
const URL_RE = /https?:\/\/|www\./i;

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please enter your name.";
  if (v.length < 2) return "Please enter your full name.";
  if (v.length > LIMITS.name)
    return `Please keep your name under ${LIMITS.name} characters.`;
  if (/^\d+$/.test(v)) return "Please enter your name, not a number.";
  if (URL_RE.test(v)) return "Please enter your name.";
  return null;
}

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please enter your email address.";
  if (v.length > LIMITS.email)
    return `Please keep your email under ${LIMITS.email} characters.`;
  if (!EMAIL_RE.test(v))
    return "Please enter a valid email address, like name@company.com.";
  return null;
}

/**
 * Phone for the two lead forms, where the number is optional and the dialling
 * code is picked separately in PhoneField — so only the subscriber digits are
 * counted here. Lower bound 6 because the shortest national numbers in use are
 * around that; upper bound 15 is the E.164 ceiling *including* the country
 * code, which makes it a safe cap for the digits alone.
 *
 * A half-typed number is worse than a blank one: it reads as a reachable lead
 * and is not.
 */
export function validateOptionalPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length < 6) return "That number looks too short — please check it.";
  if (digits.length > 15) return "That number looks too long — please check it.";
  return null;
}

/**
 * Phone for the application form, where it is required and typed as free text
 * (no country picker). Mirrors `@MinLength(7)` + `@Matches` on the DTO.
 */
export function validateRequiredPhone(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please enter your mobile number.";
  if (!PHONE_CHARS_RE.test(v))
    return "Use only digits, spaces and + - ( ) in the number.";
  if (v.length > LIMITS.phone) return "Please shorten the number.";
  const digits = v.replace(/\D/g, "");
  if (digits.length < 7) return "That number looks too short — please check it.";
  if (digits.length > 15) return "That number looks too long — please check it.";
  return null;
}

/** Optional on both lead forms. */
export function validateCompany(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (v.length > LIMITS.company)
    return `Please keep the company name under ${LIMITS.company} characters.`;
  if (URL_RE.test(v)) return "Please enter the company name, not a link.";
  return null;
}

/** Mirrors `@MinLength(10)` on the lead message. */
export function validateMessage(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please tell us about your project.";
  if (v.length < 10)
    return "Please add a little more detail — at least a sentence.";
  if (v.length > LIMITS.message)
    return `Please keep this under ${LIMITS.message} characters.`;
  return null;
}

export function validateExperience(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please tell us your total experience.";
  if (v.length > LIMITS.totalExperience)
    return `Please keep this under ${LIMITS.totalExperience} characters.`;
  return null;
}

export function validatePosition(value: string): string | null {
  const v = value.trim();
  if (!v) return "Please tell us which position you are applying for.";
  if (v.length > LIMITS.position)
    return `Please keep this under ${LIMITS.position} characters.`;
  return null;
}

/**
 * Shared file check. Both forms mirror a server-side MIME allowlist, so a file
 * that was always going to be refused is named here instead of after the whole
 * upload has gone over a phone connection.
 *
 * Falls back to the extension when the browser reports an empty `type`, which
 * it does for some formats on Windows.
 */
export function validateFile(
  file: File,
  opts: { accept: Set<string>; extensions: string[]; maxBytes: number; label: string }
): string | null {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const typeOk = file.type
    ? opts.accept.has(file.type)
    : opts.extensions.includes(ext);
  if (!typeOk) return `${opts.label} must be ${formatList(opts.extensions)}.`;
  if (file.size > opts.maxBytes)
    return `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(opts.maxBytes)}.`;
  if (file.size === 0) return "That file is empty — please attach another.";
  return null;
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** ".pdf", ".doc", ".docx" -> "a PDF, DOC or DOCX file" */
function formatList(extensions: string[]): string {
  const names = extensions.map((e) => e.replace(".", "").toUpperCase());
  const last = names.pop();
  return names.length
    ? `a ${names.join(", ")} or ${last} file`
    : `a ${last} file`;
}

/**
 * Runs a set of validators and returns only the fields that failed.
 *
 * Keyed by field name so the caller can drop the result straight into its
 * `errors` state and index it by input id.
 */
export function collectErrors(
  checks: Record<string, string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return errors;
}
