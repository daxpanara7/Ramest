import { API_BASE, getAccessToken } from "@/lib/admin/api";

/**
 * Shows a protected attachment (lead brief, candidate resume) in a new tab.
 *
 * These endpoints sit behind `lead:read` / `application:read`, so they cannot
 * be a plain <a href> — a bare link arrives without the Bearer header and
 * 401s. We fetch to a blob and point a new tab at the blob URL instead. That
 * URL carries only the MIME type, not the server's `Content-Disposition:
 * attachment`, so anything the browser can render (PDF, PNG, JPEG) opens
 * inline. Word and zip files have no viewer and still land in the downloads
 * tray, which is the only thing a browser can do with them.
 *
 * MUST be called directly from a click handler: the `window.open` below has to
 * run inside the user-gesture window, which ends at the first await.
 *
 * @returns false if the file could not be fetched, so callers can surface it.
 */
export async function openAttachment(
  path: string,
  filename: string
): Promise<boolean> {
  // Claim the tab before the first await — after it, this is a blocked popup.
  const tab = window.open("", "_blank");
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Request failed");

    const url = URL.createObjectURL(await res.blob());
    if (tab) {
      tab.location.href = url;
    } else {
      // Popup blocker won: fall back to a download so the file is still
      // reachable rather than the click silently doing nothing.
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    }
    // Revoking immediately leaves the new tab pointing at a dead URL.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return true;
  } catch {
    tab?.close();
    return false;
  }
}
