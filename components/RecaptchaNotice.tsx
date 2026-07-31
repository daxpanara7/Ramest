import { recaptchaEnabled } from "@/lib/recaptcha";

/**
 * Google's terms permit hiding the floating reCAPTCHA badge only if this
 * attribution is shown wherever reCAPTCHA runs. The badge is hidden in CSS
 * (`.grecaptcha-badge`), so every form that calls executeRecaptcha must
 * render this.
 *
 * Renders nothing when no site key is configured — there is nothing to
 * attribute in local dev.
 */
export default function RecaptchaNotice({ className }: { className?: string }) {
  if (!recaptchaEnabled) return null;

  return (
    <p className={className ?? "recaptcha-notice"}>
      This site is protected by reCAPTCHA and the Google{" "}
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
