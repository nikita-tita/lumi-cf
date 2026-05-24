import { ImageResponse } from "next/og";

export const alt = "Lumi — chat-first AI assistant for real estate agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
            "radial-gradient(120% 80% at 0% 0%, rgba(99,102,241,0.55), transparent 60%), radial-gradient(120% 80% at 100% 100%, rgba(236,72,153,0.45), transparent 60%), linear-gradient(180deg, #0f0f14 0%, #1c1c28 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            color: "#818cf8",
            textTransform: "uppercase",
            marginBottom: 24,
            fontFamily: "monospace",
          }}
        >
          Lumi · private beta
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Chat-first AI</div>
          <div
            style={{
              background:
                "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            for real estate agents
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Speak or type. Showings get scheduled, pipeline moves, documents
          answer themselves.
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
          lumi.estate
        </div>
      </div>
    ),
    { ...size },
  );
}
