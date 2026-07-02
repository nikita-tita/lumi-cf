"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Target,
  ClipboardList,
  Lightbulb,
  Mic,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

type CardType = "conflict" | "focus" | "prep" | "insight";

type Card = {
  type: CardType;
  kicker: string;
  title: string;
  desc: string;
  confidence: number;
  primary?: string;
  secondary?: string;
};

const CARDS: Card[] = [
  {
    type: "conflict",
    kicker: "Schedule conflict",
    title: "Ruiz showing overlaps standup",
    desc: "11:30 showing at Passeig de Gràcia runs into your 12:00 team call. Move standup to 12:30?",
    confidence: 92,
    primary: "Move standup",
    secondary: "Keep both",
  },
  {
    type: "focus",
    kicker: "Next up",
    title: "Showing at Passeig de Gràcia in 42 min",
    desc: "Clara is bringing her partner. Last time she asked about mortgage options.",
    confidence: 98,
    primary: "Open brief",
  },
  {
    type: "prep",
    kicker: "Prep needed",
    title: "Comps for Moreno by 18:00",
    desc: "3 similar 2BRs sold this month in Eixample. Draft ready to review.",
    confidence: 86,
    primary: "Review draft",
  },
  {
    type: "insight",
    kicker: "Pattern spotted",
    title: "You close 82% of afternoon showings",
    desc: "Compared to 41% in the morning. Consider shifting new bookings after 14:00.",
    confidence: 73,
  },
];

const TYPE_META: Record<
  CardType,
  { Icon: typeof AlertTriangle; tint: string; border: string; badge: string }
> = {
  conflict: {
    Icon: AlertTriangle,
    tint: "bg-[#FEE2E2]",
    border: "border-l-[#EF4444]",
    badge: "text-[#B91C1C]",
  },
  focus: {
    Icon: Target,
    tint: "bg-[#EDF3EC]",
    border: "border-l-accent",
    badge: "text-accent-2",
  },
  prep: {
    Icon: ClipboardList,
    tint: "bg-[#FDF4FF]",
    border: "border-l-[#A855F7]",
    badge: "text-[#7E22CE]",
  },
  insight: {
    Icon: Lightbulb,
    tint: "bg-[#ECFDF5]",
    border: "border-l-[#10B981]",
    badge: "text-[#047857]",
  },
};

export function FeedScreen() {
  return (
    <AppShell active="chat">
      <div className="h-full overflow-hidden">
        <div className="px-5 pt-3 pb-2">
          <p className="text-[11px] uppercase tracking-wider text-[#958976] font-semibold">
            Wednesday · Apr 22
          </p>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#201B12] leading-[1.1]">
            Good morning, Niki.
          </h2>
          <p className="mt-1 text-[12px] text-[#5C5343]">
            2 showings · 3 leads need a nudge
          </p>
        </div>

        <div className="px-4 pt-2 pb-6 space-y-2.5">
          {CARDS.map((card, i) => (
            <SmartCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* mic FAB */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute right-4 bottom-3 z-10"
      >
        <div
          className="w-12 h-12 rounded-full shadow-[0_10px_24px_-8px_rgba(31,87,56,0.6)] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(140deg, #818CF8 0%, #1F5738 50%, #1F5738 100%)",
          }}
        >
          <Mic size={20} className="text-white" strokeWidth={2.4} />
          <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
        </div>
      </motion.div>
    </AppShell>
  );
}

function SmartCard({ card, index }: { card: Card; index: number }) {
  const meta = TYPE_META[card.type];
  const Icon = meta.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={`relative rounded-2xl bg-white border border-[#E2E8F0] border-l-[3px] ${meta.border} p-3 shadow-[0_4px_16px_-8px_rgba(32,27,18,0.08)]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div
            className={`shrink-0 w-7 h-7 rounded-lg ${meta.tint} flex items-center justify-center`}
          >
            <Icon size={14} className={meta.badge} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p
              className={`text-[9.5px] font-bold uppercase tracking-wider ${meta.badge}`}
            >
              {card.kicker}
            </p>
            <h3 className="mt-0.5 text-[12.5px] font-semibold text-[#201B12] leading-tight">
              {card.title}
            </h3>
          </div>
        </div>
        <ConfidenceBadge value={card.confidence} />
      </div>
      <p className="mt-2 text-[11px] text-[#5C5343] leading-snug">{card.desc}</p>
      {(card.primary || card.secondary) && (
        <div className="mt-2.5 flex gap-1.5">
          {card.primary && (
            <PrimaryBtn>
              <Sparkles size={10} strokeWidth={2.4} />
              {card.primary}
            </PrimaryBtn>
          )}
          {card.secondary && <SecondaryBtn>{card.secondary}</SecondaryBtn>}
        </div>
      )}
    </motion.div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  return (
    <span className="shrink-0 text-[9px] font-semibold text-[#5C5343] tabular-nums bg-[#EFE9DD] rounded-full px-1.5 py-0.5">
      {value}%
    </span>
  );
}

function PrimaryBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-[11px] font-semibold text-white rounded-lg px-2.5 py-1.5"
      style={{
        background:
          "linear-gradient(135deg, #1F5738 0%, #1F5738 55%, #A855F7 100%)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="text-[11px] font-semibold text-[#5C5343] rounded-lg px-2.5 py-1.5 bg-[#EFE9DD]"
    >
      {children}
    </button>
  );
}
