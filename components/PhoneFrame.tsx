/* using plain <img> instead of next/image to avoid dev-mode sharp optimizer stalls */

import type { ReactNode } from "react";

type Props = {
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
};

/* eslint-disable @next/next/no-img-element */

/**
 * Phone frame wrapper. Either pass `children` (live React UI) or a `src` (image fallback).
 * Inner viewport is 314x640; frame adds chrome + warm glow.
 */
export function PhoneFrame({ src, alt, className = "", children }: Props) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 320 }}>
      {/* aurora glow */}
      <div
        className="absolute -inset-10 rounded-[60px] blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(9,9,11,0.10), transparent 70%)",
        }}
        aria-hidden
      />

      {/* phone body */}
      <div
        className="relative rounded-[44px] p-[3px] shadow-glow"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #F4F4F5 40%, #cbd5e1 100%)",
        }}
      >
        <div
          className="relative rounded-[42px] overflow-hidden border border-black/5"
          style={{ background: "#FFFFFF" }}
        >
          {/* notch */}
          <div className="relative h-7 flex items-center justify-center z-20">
            <div className="absolute top-2 w-24 h-5 bg-[#09090B] rounded-full" />
          </div>

          {/* screen content */}
          <div
            className="relative overflow-hidden"
            style={{ width: 314, height: 640 }}
          >
            {children ?? (
              <img
                src={src}
                alt={alt ?? ""}
                width={390}
                height={844}
                className="w-full h-full object-cover object-top"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
