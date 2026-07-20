/**
 * Admin API client. Talks to the NestJS backend over HTTP only (never imports
 * backend code). Base URL comes from NEXT_PUBLIC_API_URL so the same build
 * points at localhost in dev and the Render URL in production.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000/api";

/** In-memory access token. Never in localStorage (XSS-safe); the refresh token
 * lives in an httpOnly cookie the browser sends automatically. */
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean };

/**
 * fetch wrapper: attaches the Bearer token, sends cookies (for refresh), and
 * on a 401 tries a single silent refresh before giving up.
 */
export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const res = await rawFetch(path, opts);
  if (res.status === 401 && opts.auth !== false && path !== "/auth/refresh") {
    const refreshed = await tryRefresh();
    if (refreshed) return rawFetch(path, opts).then(parse<T>);
  }
  return parse<T>(res);
}

async function rawFetch(path: string, opts: Options): Promise<Response> {
  const headers = new Headers(opts.headers);
  if (opts.body !== undefined) headers.set("Content-Type", "application/json");
  if (accessToken && opts.auth !== false) headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    credentials: "include", // send/receive the refresh cookie
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new ApiError(res.status, msg || `Request failed (${res.status})`);
  }
  return data as T;
}

/**
 * Exchange the refresh cookie for a fresh access token.
 *
 * Refresh tokens rotate on every use (the backend revokes the old one), so two
 * concurrent refreshes would race — the second would present an already-revoked
 * token and fail, dropping the session. We collapse concurrent callers onto a
 * single in-flight request so only one rotation happens at a time. This also
 * neutralizes React StrictMode's double-invoked effects in development.
 */
let refreshInFlight: Promise<boolean> | null = null;

export function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = doRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { accessToken: string };
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}
