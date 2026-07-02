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
          background: "#F6F2EA",
          color: "#201B12",
          borderBottom: "16px solid #1F5738",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 5,
            color: "#1F5738",
            textTransform: "uppercase",
            marginBottom: 28,
            fontFamily: "monospace",
          }}
        >
          Lumi · private beta
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Chat-first AI</div>
          <div style={{ color: "#1F5738" }}>for real estate agents</div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#5C5343",
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
            bottom: 52,
            right: 80,
            fontSize: 22,
            color: "#958976",
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
