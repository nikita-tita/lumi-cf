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
          background: "#09090B",
          color: "#FAFAFA",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 5,
            color: "rgba(246,242,234,0.65)",
            textTransform: "uppercase",
            marginBottom: 28,
            fontFamily: "monospace",
          }}
        >
          Join the waitlist
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Get your</div>
          <div>day back.</div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(246,242,234,0.75)",
            marginTop: 40,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Invites in waves · Beta is free · Two emails, total
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 80,
            fontSize: 22,
            color: "rgba(246,242,234,0.55)",
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
