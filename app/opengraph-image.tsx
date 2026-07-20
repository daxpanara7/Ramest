import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — Innovative IT Solutions`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Site-wide 1200x630 share card, rendered at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #191716 0%, #2b2724 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: "0.18em", color: "#c9a227" }}>
          {SITE.name.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
            We build digital products that scale
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#b8b2ac" }}>
            Software · AI &amp; LLMs · Cloud · Data Engineering
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#8f8880" }}>
          {SITE.address.city}, {SITE.address.region}, India · ramesttechnolabs.com
        </div>
      </div>
    ),
    size
  );
}
