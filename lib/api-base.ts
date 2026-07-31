/**
 * Base URL of the NestJS backend, shared by the public site and the admin
 * client so the two can never disagree.
 *
 * It lives here rather than in lib/admin/api.ts so the public contact form
 * does not have to import the admin auth client (and drag its in-memory token
 * state into the marketing bundle) just to learn one URL.
 *
 * Must include the backend's global `/api` prefix — e.g.
 * `https://ramest-api.onrender.com/api`.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000/api";
