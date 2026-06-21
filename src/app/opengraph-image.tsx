import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Static social card; safe to render at build time.
export const alt = `${site.name} — Free GRE Practice`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors the light theme in globals.css).
const INK = "#41485A";
const MUTED = "#6B7280";
const ACCENT = "#5B7CFA";
const RAY_VERBAL = "#6E78F4";
const RAY_QUANT = "#5B7CFA";
const RAY_WRITING = "#C98E6B";

// A prism splitting a white beam into the three section rays — the core brand
// metaphor. Encoded as an SVG data URI so satori renders it as an <img>.
const prismSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340" viewBox="0 0 340 340" fill="none">
  <line x1="20" y1="170" x2="150" y2="170" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M170 70 L250 250 L90 250 Z" fill="rgba(255,255,255,0.10)" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/>
  <line x1="210" y1="170" x2="320" y2="120" stroke="${RAY_VERBAL}" stroke-width="6" stroke-linecap="round"/>
  <line x1="210" y1="178" x2="324" y2="178" stroke="${RAY_QUANT}" stroke-width="6" stroke-linecap="round"/>
  <line x1="210" y1="186" x2="320" y2="236" stroke="${RAY_WRITING}" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const prismDataUri = `data:image/svg+xml,${encodeURIComponent(prismSvg)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 90px",
          background:
            "linear-gradient(135deg, #EEF1F6 0%, #E0E5EC 55%, #DDE3F2 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 34,
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: -0.5,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.05,
              marginTop: 24,
              letterSpacing: -2,
            }}
          >
            Clarity from Complexity.
          </div>
          <div
            style={{ fontSize: 32, color: MUTED, marginTop: 28, lineHeight: 1.35 }}
          >
            Free GRE practice — Verbal, Quantitative &amp; Analytical Writing.
            300 timed questions, instant scoring, no account.
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prismDataUri} width={340} height={340} alt="" />
      </div>
    ),
    { ...size }
  );
}
