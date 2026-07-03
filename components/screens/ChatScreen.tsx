"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Sparkles,
  Check,
  X,
  CalendarClock,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

export function ChatScreen() {
  return (
    <AppShell active="chat">
      <div className="h-full overflow-hidden flex flex-col">
        {/* greeting block — mirrors app GradientText header */}
        <div className="px-5 pt-3 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A1A1AA]">
            Lumi · Wednesday
          </p>
          <h2
            className="mt-1 text-[26px] font-bold leading-[1.05] tracking-tight"
            style={{
              background:
                "#2563EB",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Good morning, Niki.
          </h2>
          <p className="mt-1 text-[11.5px] text-[#52525B] leading-snug">
            Two showings · three leads need a nudge.
          </p>
        </div>

        {/* scope chip + context */}
        <div className="px-5 pt-1 pb-1 flex items-center gap-1.5">
          <ScopeChip />
        </div>

        {/* messages */}
        <div className="flex-1 overflow-hidden px-3 pt-1 pb-14 space-y-2">
          <UserBubble index={0}>
            Tomorrow 11am showing at Passeig de Gràcia 84 with Clara Ruiz. She
            wants to bring her partner.
          </UserBubble>

          <AssistantBubble index={1}>
            Got it — creating the showing.
          </AssistantBubble>

          <EventCardBubble index={2} />

          <UserBubble index={3}>What&rsquo;s the HOA for Apt 4?</UserBubble>

          <DocumentsAnswerBubble index={4} />
        </div>

        {/* composer */}
        <div className="absolute left-0 right-0 bottom-0 px-3 pt-3 pb-1 bg-gradient-to-t from-white via-white/95 to-transparent">
          <div
            className="flex items-center gap-2 rounded-[22px] border border-[#09090B]/6 bg-white/85 backdrop-blur-md px-3 py-2"
            style={{
              boxShadow: "0 8px 20px -10px rgba(9,9,11,0.12)",
            }}
          >
            <span className="text-[11px] text-[#A1A1AA] flex-1 truncate">
              Ask Lumi or speak…
            </span>
            <MicButton />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ScopeChip() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 pl-0.5 pr-2 py-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/avatars/clara.jpg"
        alt="Clara Ruiz"
        className="w-4 h-4 rounded-full object-cover"
      />
      <span className="text-[9.5px] font-semibold text-accent tracking-tight">
        Clara Ruiz
      </span>
      <X size={9} className="text-[#A1A1AA] ml-0.5" strokeWidth={2.6} />
    </div>
  );
}

function UserBubble({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
      className="flex justify-end"
    >
      <div
        className="max-w-[78%] rounded-[20px] rounded-tr-md px-3 py-2 text-[11.5px] leading-snug text-[#09090B] border border-[#2563EB]/15"
        style={{
          background: "rgba(37,99,235,0.10)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function AssistantBubble({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
      className="flex items-start gap-1.5"
    >
      <SparkleAvatar />
      <div className="max-w-[78%] rounded-[20px] rounded-bl-md bg-white border border-[#E2E8F0] px-3 py-2 text-[11.5px] leading-snug text-[#09090B] shadow-[0_2px_8px_-4px_rgba(9,9,11,0.08)]">
        {children}
      </div>
    </motion.div>
  );
}

function EventCardBubble({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="flex items-start gap-1.5"
    >
      <div className="shrink-0 mt-0.5 w-5 h-5" />
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(37,99,235,0.35)",
            "0 0 0 8px rgba(37,99,235,0)",
            "0 0 0 0 rgba(37,99,235,0)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        className="flex-1 rounded-[16px] border border-dashed border-[#2563EB]/55 bg-[#FAFAFA] p-2.5"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={10} className="text-accent" strokeWidth={2.4} />
          <span className="text-[9px] font-bold uppercase tracking-wider text-accent-2">
            Suggested event · 92%
          </span>
        </div>
        <h3 className="mt-1 text-[12.5px] font-semibold text-[#09090B] leading-tight">
          Showing · Passeig de Gràcia 84
        </h3>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#52525B]">
          <span className="inline-flex items-center gap-1">
            <CalendarClock size={10} strokeWidth={2.2} />
            Thu · 11:00–11:45
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={10} strokeWidth={2.2} />
            Gràcia
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] font-semibold text-white rounded-lg px-2.5 py-1"
            style={{
              background: "#2563EB",
            }}
          >
            <Check size={10} strokeWidth={2.6} />
            Confirm
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] font-semibold text-[#52525B] rounded-lg px-2 py-1 bg-[#F4F4F5]"
          >
            Edit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DocumentsAnswerBubble({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
      className="flex items-start gap-1.5"
    >
      <SparkleAvatar />
      <div className="max-w-[85%] rounded-[20px] rounded-bl-md bg-white border border-[#E2E8F0] px-3 py-2 text-[11.5px] leading-snug text-[#09090B] shadow-[0_2px_8px_-4px_rgba(9,9,11,0.08)]">
        €210 per month, covers elevator, concierge, and rooftop.
        <span className="ml-1 inline-flex items-center gap-0.5 rounded-md bg-[#EFF6FF] px-1.5 py-[1px] text-[9px] font-semibold text-accent-2 border border-[#2563EB]/15">
          DOC 12
        </span>
      </div>
    </motion.div>
  );
}

function SparkleAvatar() {
  return (
    <div
      className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
      style={{
        background:
          "#2563EB",
      }}
    >
      <Sparkles size={10} className="text-white" strokeWidth={2.6} />
    </div>
  );
}

function MicButton() {
  return (
    <div className="relative">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{
          background: "#2563EB",
          boxShadow: "0 6px 14px -4px rgba(37,99,235,0.55)",
        }}
      >
        <Mic size={13} className="text-white" strokeWidth={2.4} />
      </div>
      <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
    </div>
  );
}
