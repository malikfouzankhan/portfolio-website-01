import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — Full-Stack Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1A0A0E",
          padding: "72px 80px",
          // Static social card: always the dark theme, regardless of the viewer's
          // preference. next/og has no access to next/font vars either.
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#5FD08A" }} />
          <div style={{ color: "#94868A", fontSize: 22, letterSpacing: 4 }}>
            AVAILABLE FOR WORK
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#DBD0D2",
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Malik&nbsp;<span style={{ color: "#F7B538" }}>Fouzan</span>
            <span style={{ color: "#94868A" }}>.</span>
          </div>
          <div style={{ marginTop: 28, color: "#B0A2A5", fontSize: 32, letterSpacing: 1 }}>
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #40232B",
            paddingTop: 28,
            color: "#94868A",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", letterSpacing: 3 }}>
            NODE · NESTJS · POSTGRES · DOCKER
          </div>
          <div style={{ display: "flex", color: "#F7B538", letterSpacing: 3 }}>MFK.</div>
        </div>
      </div>
    ),
    size,
  );
}
