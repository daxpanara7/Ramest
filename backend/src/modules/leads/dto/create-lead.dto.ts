import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim strings so " " does not pass @IsNotEmpty and stored data is clean. */
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * The two public forms. They collect different things — the homepage form is
 * deliberately short (name, email, phone, company, message) while the contact
 * page also asks for service, budget and an optional brief — so the admin
 * needs to know which one a lead came from to read the blanks correctly.
 */
export const LEAD_SOURCES = ['home', 'contact'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

/**
 * Public contact-form payload (Task 11). Every field is validated and length-
 * capped server-side — the client is never trusted. Unknown fields are stripped
 * by the global whitelist ValidationPipe.
 */
export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Transform(trim)
  @IsEmail({}, { message: 'A valid email is required' })
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(160)
  company?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  service?: string;

  /**
   * Indicative budget band, picked from the contact form's dropdown. Stored as
   * the label the visitor actually saw ("$25K - $75K") rather than a code, so
   * the admin never has to decode it and changing the bands later cannot
   * silently reinterpret historical leads.
   */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  budget?: string;

  /**
   * Which form produced this lead. Constrained rather than free text because
   * the admin filters and badges on it — an unexpected value would render as
   * an unlabelled row.
   */
  @IsOptional()
  @Transform(trim)
  @IsIn(LEAD_SOURCES, { message: 'Unknown form source' })
  source?: LeadSource;

  @Transform(trim)
  @IsString()
  @MinLength(10, { message: 'Please add a little more detail' })
  @MaxLength(5000)
  message!: string;

  /** reCAPTCHA v3 token from the browser widget. */
  @IsOptional()
  @IsString()
  recaptchaToken?: string;

  /**
   * Honeypot. Rendered as a real input that is hidden from people and marked
   * tabindex=-1/aria-hidden/autocomplete=off, so no human ever fills it —
   * but the naive form-filling bots that reCAPTCHA scores generously will,
   * because they populate every field they can find. A non-empty value here
   * is the single highest-confidence spam signal available: it has no
   * plausible false positive.
   *
   * Named `website` rather than `honeypot` on purpose — the name has to look
   * worth filling in.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  /**
   * Milliseconds between the form rendering and the submit. Humans cannot
   * read this form, type a name, an email and a sentence in under a couple
   * of seconds; scripted posts routinely submit in double digits.
   *
   * Spoofable by a determined attacker, which is fine — this is a cheap
   * filter for volume spam, not the security boundary. reCAPTCHA and the
   * per-IP throttle are.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  elapsedMs?: number;
}
