/**
 * Display helpers for admin tables.
 *
 * All timestamps come from the API as UTC ISO strings; these render them in
 * the viewer's local timezone. Relative time is used in cells (compact, and
 * "2 hours ago" is what you actually want when triaging), with the absolute
 * value kept in a title attribute so the exact moment is still one hover away.
 */

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

export function relativeTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  if (abs < 60_000) return "just now";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of UNITS) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

/** Human file size. Binary units — what an OS file manager reports. */
export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const n = bytes / Math.pow(1024, i);
  return `${n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}
