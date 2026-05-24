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
          background:
            "linear-gradient(180deg, #6366f1 0%, #a855f7 55%, #ec4899 100%)",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="k" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="kg">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M 130 470 L 130 326 A 126 126 0 0 1 382 326 L 382 470 Z"
            fill="#ffffff"
            stroke="#0f0f14"
            strokeWidth="16"
            strokeLinejoin="round"
          />
          <line
            x1="148"
            y1="285"
            x2="364"
            y2="285"
            stroke="#0f0f14"
            strokeOpacity="0.18"
            strokeWidth="2.5"
          />
          <line
            x1="148"
            y1="395"
            x2="364"
            y2="395"
            stroke="#0f0f14"
            strokeOpacity="0.18"
            strokeWidth="2.5"
          />
          <circle cx="350" cy="335" r="26" fill="url(#kg)" />
          <circle cx="350" cy="335" r="11" fill="url(#k)" />
        </svg>
      </div>
    ),
    size,
  );
}
