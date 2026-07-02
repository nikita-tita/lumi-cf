import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090B",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Four-point spark — Lumi, light on the working day. */}
          <path
            d="M256 96 L296 216 L416 256 L296 296 L256 416 L216 296 L96 256 L216 216 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    size,
  );
}
