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
          background: "#1F5738",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sunrise over a sill — light on the working day. */}
          <path d="M118 330a138 138 0 0 1 276 0Z" fill="#F6F2EA" />
          <rect x="118" y="368" width="276" height="30" rx="15" fill="#F6F2EA" />
        </svg>
      </div>
    ),
    size,
  );
}
