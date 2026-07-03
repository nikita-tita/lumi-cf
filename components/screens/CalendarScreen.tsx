"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Repeat } from "lucide-react";
import { AppShell } from "./AppShell";

type Event = {
  start: string;
  end: string;
  title: string;
  place?: string;
  tone: "neutral" | "showing" | "soft" | "call" | "contract";
  governor?: boolean;
  recurring?: boolean;
  /** Row span in 30-min slots. 2 = 1h. */
  span: number;
  /** Slot index (0 = 9:00). */
  slot: number;
};

const HOURS = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

const EVENTS: Event[] = [
  {
    start: "9:00",
    end: "9:30",
    title: "Morning standup",
    tone: "soft",
    recurring: true,
    span: 1,
    slot: 0,
  },
  {
    start: "11:30",
    end: "12:15",
    title: "Showing · Passeig de Gràcia",
    place: "Ruiz",
    tone: "showing",
    span: 2,
    slot: 5,
  },
  { start: "13:00", end: "13:45", title: "Lunch · Vera", tone: "neutral", span: 2, slot: 8 },
  {
    start: "15:30",
    end: "16:15",
    title: "Call · Ruiz follow-up",
    place: "Reschedule from 16:00",
    tone: "call",
    governor: true,
    span: 2,
    slot: 13,
  },
  {
    start: "18:00",
    end: "18:45",
    title: "Sign contract · Schneider",
    tone: "contract",
    span: 2,
    slot: 18,
  },
];

const TONE: Record<
  Event["tone"],
  { bg: string; accent: string; text: string }
> = {
  showing: {
    bg: "bg-[#EFF6FF]",
    accent: "bg-accent",
    text: "text-accent-2",
  },
  soft: {
    bg: "bg-[#F5F3FF]",
    accent: "bg-[#A855F7]",
    text: "text-[#7E22CE]",
  },
  neutral: {
    bg: "bg-[#F4F4F5]",
    accent: "bg-[#64748B]",
    text: "text-[#52525B]",
  },
  call: {
    bg: "bg-[#ECFDF5]",
    accent: "bg-[#10B981]",
    text: "text-[#047857]",
  },
  contract: {
    bg: "bg-[#FDF4FF]",
    accent: "bg-[#D97706]",
    text: "text-[#BE185D]",
  },
};

const SLOT_H = 28; // px per 30-min slot

export function CalendarScreen() {
  return (
    <AppShell active="calendar">
      <div className="px-5 pt-2 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold">
            April
          </p>
          <h1 className="mt-0.5 text-[22px] font-bold tracking-tight text-[#09090B] leading-none">
            Wed 22
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <RoundBtn>
            <ChevronLeft size={14} strokeWidth={2.4} />
          </RoundBtn>
          <RoundBtn>
            <ChevronRight size={14} strokeWidth={2.4} />
          </RoundBtn>
        </div>
      </div>

      {/* week strip */}
      <div className="px-4 pb-2">
        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
            const date = 20 + i;
            const active = i === 2;
            return (
              <div
                key={`${d}-${i}`}
                className={`flex flex-col items-center rounded-xl py-1.5 ${
                  active ? "text-white" : "text-[#A1A1AA]"
                }`}
                style={
                  active
                    ? {
                        background:
                          "#2563EB",
                      }
                    : undefined
                }
              >
                <span className="text-[9px] font-semibold uppercase">{d}</span>
                <span
                  className={`text-[13px] font-bold ${
                    active ? "text-white" : "text-[#09090B]"
                  }`}
                >
                  {date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* day grid */}
      <div className="flex-1 overflow-hidden px-4 pt-1">
        <div className="relative">
          {/* hour rail */}
          <div className="absolute top-0 left-0 bottom-0 w-8">
            {HOURS.map((h) => (
              <div
                key={h}
                className="text-[9px] font-semibold text-[#A1A1AA] tabular-nums"
                style={{ height: SLOT_H * 2, paddingTop: 0 }}
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* grid lines */}
          <div className="ml-8 relative">
            {HOURS.map((_, i) => (
              <div
                key={i}
                className="border-t border-[#E2E8F0]"
                style={{ height: SLOT_H * 2 }}
              />
            ))}

            {/* now line */}
            <div
              className="absolute left-0 right-0 flex items-center gap-1 z-10 pointer-events-none"
              style={{ top: SLOT_H * 4.8 }}
            >
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="flex-1 h-[1.5px] bg-accent" />
            </div>

            {/* events */}
            {EVENTS.map((e, i) => (
              <EventBlock key={e.title} event={e} index={i} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function EventBlock({ event, index }: { event: Event; index: number }) {
  const tone = TONE[event.tone];
  const top = event.slot * SLOT_H;
  const height = event.span * SLOT_H - 4;

  return (
    <motion.div
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.07, duration: 0.35 }}
      className="absolute left-1 right-1"
      style={{ top, height }}
    >
      {event.governor ? (
        <GovernorCard event={event} />
      ) : (
        <div
          className={`h-full rounded-xl ${tone.bg} border border-[#E2E8F0] px-2.5 py-1.5 flex gap-2 relative overflow-hidden`}
        >
          <span className={`w-[3px] rounded-full ${tone.accent} shrink-0`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p
                className={`text-[9.5px] font-bold ${tone.text} tabular-nums`}
              >
                {event.start}
              </p>
              {event.recurring && (
                <Repeat size={9} className={tone.text} strokeWidth={2.4} />
              )}
            </div>
            <h3 className="text-[11.5px] font-semibold text-[#09090B] leading-tight truncate">
              {event.title}
            </h3>
            {event.place && (
              <p className="text-[9.5px] text-[#52525B] truncate">
                {event.place}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function GovernorCard({ event }: { event: Event }) {
  const tone = TONE[event.tone];
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(37,99,235,0.45)",
          "0 0 0 6px rgba(37,99,235,0)",
          "0 0 0 0 rgba(37,99,235,0)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      className={`h-full rounded-xl ${tone.bg} border border-dashed border-accent/60 px-2.5 py-1.5 flex gap-2 relative overflow-hidden`}
    >
      <span className={`w-[3px] rounded-full ${tone.accent} shrink-0`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Sparkles size={10} className="text-accent" strokeWidth={2.4} />
          <p className="text-[9.5px] font-bold text-accent-2 tabular-nums">
            {event.start} · suggested
          </p>
        </div>
        <h3 className="text-[11.5px] font-semibold text-[#09090B] leading-tight truncate">
          {event.title}
        </h3>
        {event.place && (
          <p className="text-[9.5px] text-[#52525B] truncate">{event.place}</p>
        )}
      </div>
    </motion.div>
  );
}

function RoundBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="w-7 h-7 rounded-full bg-[#F4F4F5] text-[#52525B] flex items-center justify-center"
    >
      {children}
    </button>
  );
}
