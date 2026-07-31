/**
 * Google reCAPTCHA v3 (invisible) helper.
 *
 * The script is loaded lazily on first use rather than from the root layout,
 * so pages with no form never pay for a third-party request — which is most
 * of this site.
 *
 * When NEXT_PUBLIC_RECAPTCHA_SITE_KEY is unset (local dev), every call
 * resolves to `undefined`. That matches the backend, where `recaptchaToken`
 * is an optional DTO field and verification is skipped while
 * RECAPTCHA_SECRET_KEY is absent — so forms keep working with no keys at all.
 */

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "recaptcha-v3";

/** Shared across callers so two forms on one page load the script once. */
let scriptPromise: Promise<Grecaptcha | null> | null = null;

function loadScript(): Promise<Grecaptcha | null> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<Grecaptcha | null>((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.grecaptcha) return resolve(window.grecaptcha);

    const existing = document.getElementById(SCRIPT_ID);
    const onReady = () => {
      const g = window.grecaptcha;
      if (!g) return resolve(null);
      // grecaptcha.ready fires once the internal client is actually usable —
      // the script's load event alone is too early to call execute().
      g.ready(() => resolve(g));
    };

    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => resolve(null));
      return;
    }

    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    s.onload = onReady;
    // Blocked by an ad blocker, offline, or a corporate proxy. Resolve null
    // rather than reject so callers handle one shape.
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });

  return scriptPromise;
}

/**
 * Returns a fresh token for `action`, or undefined if captcha is not
 * configured or the script could not load.
 *
 * `action` shows up in the reCAPTCHA admin console per-form, so use a
 * distinct one per form ("contact", "admin_login", …).
 */
export async function executeRecaptcha(
  action: string,
): Promise<string | undefined> {
  if (!RECAPTCHA_SITE_KEY) return undefined;

  try {
    const g = await loadScript();
    if (!g) return undefined;
    return await g.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return undefined;
  }
}

/** True when a site key is configured, so UI can show the legal notice. */
export const recaptchaEnabled = Boolean(RECAPTCHA_SITE_KEY);
