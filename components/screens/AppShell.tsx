"use client";

import type { ReactNode } from "react";
import {
  Sparkles,
  CalendarDays,
  Users,
  CheckSquare,
  Settings,
} from "lucide-react";

export type TabKey = "chat" | "calendar" | "clients" | "todos" | "settings";

type Props = {
  active: TabKey;
  children: ReactNode;
  /** Optional screen title shown in the soft header. */
  title?: string;
  /** Optional right-side header action (e.g. plus button). */
  headerAction?: ReactNode;
};

/**
 * iOS-style app chrome used inside PhoneFrame.
 * Rendered at 314x640 viewport. Mirrors FloatingTabBar from the real app —
 * glassmorphic pill, Chat is center tab with aurora gradient circle
 * (Sparkles icon + "Lumi" label).
 */
export function AppShell({ active, children, title, headerAction }: Props) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#FFFFFF" }}
    >
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-1 pb-1.5 text-[11px] font-semibold text-[#201B12]/80 tracking-tight">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <SignalDots />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* header */}
      {(title || headerAction) && (
        <div className="flex items-end justify-between px-5 pt-2 pb-1">
          <h1 className="text-[22px] font-bold tracking-tight text-[#201B12] leading-none">
            {title}
          </h1>
          <div>{headerAction}</div>
        </div>
      )}

      {/* scrollable content */}
      <div className="flex-1 overflow-hidden relative">{children}</div>

      {/* floating tab bar (pill) */}
      <div className="shrink-0 px-3 pt-2 pb-2">
        <div
          className="rounded-[24px] border border-[#201B12]/5 bg-white/90 backdrop-blur-xl px-1.5 py-1 flex items-center justify-around"
          style={{
            boxShadow:
              "0 14px 30px -12px rgba(32,27,18,0.2), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          <TabItem
            label="Calendar"
            active={active === "calendar"}
            icon={<CalendarDays size={17} strokeWidth={2} />}
          />
          <TabItem
            label="Todos"
            active={active === "todos"}
            icon={<CheckSquare size={17} strokeWidth={2} />}
          />
          <ChatTab active={active === "chat"} />
          <TabItem
            label="Clients"
            active={active === "clients"}
            icon={<Users size={17} strokeWidth={2} />}
          />
          <TabItem
            label="Settings"
            active={active === "settings"}
            icon={<Settings size={17} strokeWidth={2} />}
          />
        </div>
      </div>

      {/* home indicator */}
      <div className="shrink-0 flex justify-center pb-1">
        <div className="w-[120px] h-[4px] rounded-full bg-[#201B12]/25" />
      </div>
    </div>
  );
}

function TabItem({
  label,
  active,
  icon,
}: {
  label: string;
  active: boolean;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-0 px-1 pt-1 pb-0.5 w-[46px]">
      <div className={active ? "text-accent" : "text-[#958976]"}>{icon}</div>
      <span
        className={`mt-0.5 text-[8.5px] font-medium ${
          active ? "text-accent" : "text-[#958976]"
        }`}
      >
        {label}
      </span>
      <div
        className="mt-0.5 h-[2px] w-[14px] rounded-full"
        style={{
          background: active
            ? "#1F5738"
            : "transparent",
        }}
      />
    </div>
  );
}

function ChatTab({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0 -mt-4">
      <div
        className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1F5738 0%, #1F5738 55%, #C05B2E 100%)",
          boxShadow: "0 10px 20px -6px rgba(31,87,56,0.55)",
        }}
      >
        <Sparkles size={17} className="text-white" strokeWidth={2.4} />
      </div>
      <span
        className={`mt-0.5 text-[8.5px] font-semibold ${
          active ? "text-[#201B12]" : "text-[#5C5343]"
        }`}
      >
        Lumi
      </span>
      <div className="h-[2px] w-[14px] mt-0.5" />
    </div>
  );
}

function SignalDots() {
  return (
    <div className="flex items-end gap-0.5">
      <span className="w-0.5 h-1.5 bg-[#201B12]/80 rounded-sm" />
      <span className="w-0.5 h-2 bg-[#201B12]/80 rounded-sm" />
      <span className="w-0.5 h-2.5 bg-[#201B12]/80 rounded-sm" />
      <span className="w-0.5 h-3 bg-[#201B12]/80 rounded-sm" />
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
      <path
        d="M6 7.5L6.707 8.207C6.317 8.598 5.683 8.598 5.293 8.207L6 7.5zM1 3.5l.758.65C3.106 2.63 4.466 2 6 2c1.534 0 2.894.63 4.242 2.15L11 3.5C9.421 1.683 7.711 1 6 1s-3.421.683-5 2.5zM3 5.5l.79.614C4.528 5.176 5.207 4.75 6 4.75s1.472.426 2.21 1.364L9 5.5c-.933-1.186-1.862-1.75-3-1.75S3.933 4.314 3 5.5z"
        fill="#201B12"
        fillOpacity="0.8"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <div className="relative flex items-center">
      <div className="w-5 h-2.5 rounded-[3px] border border-[#201B12]/80 flex items-center p-[1px]">
        <div className="h-full w-3/4 bg-[#201B12]/80 rounded-sm" />
      </div>
      <div className="w-0.5 h-1 bg-[#201B12]/50 rounded-r-sm ml-[1px]" />
    </div>
  );
}
