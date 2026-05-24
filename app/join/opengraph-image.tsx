import { ImageResponse } from "next/og";

export const alt = "Join the Lumi private beta — waitlist for real estate agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function JoinOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(99,102,241,0.6), transparent 60%), radial-gradient(120% 80% at 0% 100%, rgba(236,72,153,0.5), transparent 60%), linear-gradient(180deg, #0f0f14 0%, #1c1c28 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            color: "#f472b6",
            textTransform: "uppercase",
            marginBottom: 24,
            fontFamily: "monospace",
          }}
        >
          Join the waitlist
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Free for the</div>
          <div
            style={{
              background:
                "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            first thousand.
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            marginTop: 40,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Private beta opens Q2 2026 · Helsinki · EU · LatAm · MENA
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
          }}
        >
          lumi.estate/join
        </div>
      </div>
    ),
    { ...size },
  );
}
