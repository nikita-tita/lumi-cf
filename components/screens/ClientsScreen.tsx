"use client";

import { motion } from "framer-motion";
import { Phone, Search, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { AppShell } from "./AppShell";

type Stage = "active" | "warm" | "cold";

type Client = {
  name: string;
  initials: string;
  budget: string;
  lastContact: string;
  nextAction: string;
  stage: Stage;
  silenceDays?: number;
};

const CLIENTS: Client[] = [
  {
    name: "Clara Ruiz",
    initials: "CR",
    budget: "€1.8M · 3BR",
    lastContact: "Today",
    nextAction: "Passeig de Gràcia showing · 11:30",
    stage: "active",
  },
  {
    name: "Andreas Moreno",
    initials: "AM",
    budget: "€2.4M · 4BR",
    lastContact: "Yesterday",
    nextAction: "Send comps by 18:00",
    stage: "active",
  },
  {
    name: "Dimitri Schneider",
    initials: "DS",
    budget: "€900K · 2BR",
    lastContact: "3 days ago",
    nextAction: "Contract review today",
    stage: "warm",
    silenceDays: 3,
  },
  {
    name: "Sarah Mitchell",
    initials: "SM",
    budget: "€1.2M · 3BR",
    lastContact: "9 days ago",
    nextAction: "Draft re-engagement",
    stage: "cold",
    silenceDays: 9,
  },
];

const STAGE_META: Record<
  Stage,
  { label: string; tint: string; text: string; dot: string; Icon: typeof TrendingUp }
> = {
  active: {
    label: "Active",
    tint: "bg-[#ECFDF5]",
    text: "text-[#047857]",
    dot: "bg-[#10B981]",
    Icon: TrendingUp,
  },
  warm: {
    label: "Warm",
    tint: "bg-[#EEF2FF]",
    text: "text-accent-2",
    dot: "bg-accent",
    Icon: Clock,
  },
  cold: {
    label: "Cold",
    tint: "bg-[#FEE2E2]",
    text: "text-[#B91C1C]",
    dot: "bg-[#EF4444]",
    Icon: AlertCircle,
  },
};

export function ClientsScreen() {
  return (
    <AppShell
      active="clients"
      title="Pipeline"
      headerAction={
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#475569]">
            €12.4M
          </span>
        </div>
      }
    >
      {/* search */}
      <div className="px-5 pt-1 pb-2">
        <div className="flex items-center gap-2 bg-[#F1F5F9] rounded-xl px-3 py-1.5">
          <Search size={12} className="text-[#94A3B8]" strokeWidth={2.4} />
          <span className="text-[11px] text-[#94A3B8]">
            Search clients, properties…
          </span>
        </div>
      </div>

      {/* pipeline summary */}
      <div className="px-5 pb-2 flex gap-2">
        <StageChip stage="active" count={8} />
        <StageChip stage="warm" count={4} />
        <StageChip stage="cold" count={2} />
      </div>

      {/* list */}
      <div className="px-4 pt-1 pb-6 space-y-1.5">
        {CLIENTS.map((c, i) => (
          <ClientCard key={c.name} client={c} index={i} />
        ))}
      </div>
    </AppShell>
  );
}

function StageChip({ stage, count }: { stage: Stage; count: number }) {
  const meta = STAGE_META[stage];
  return (
    <div className={`flex-1 rounded-xl ${meta.tint} px-2.5 py-1.5`}>
      <div className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
        <p className={`text-[9px] font-bold uppercase ${meta.text}`}>
          {meta.label}
        </p>
      </div>
      <p className="text-[15px] font-bold text-[#0F172A] leading-tight tabular-nums">
        {count}
      </p>
    </div>
  );
}

function ClientCard({ client, index }: { client: Client; index: number }) {
  const meta = STAGE_META[client.stage];
  const Icon = meta.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.07, duration: 0.4 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] px-3 py-2.5 flex items-start gap-2.5"
    >
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
        style={{
          background:
            client.stage === "active"
              ? "linear-gradient(140deg, #34D399 0%, #10B981 100%)"
              : client.stage === "warm"
                ? "linear-gradient(140deg, #818CF8 0%, #8B5CF6 100%)"
                : "linear-gradient(140deg, #F87171 0%, #EF4444 100%)",
        }}
      >
        {client.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[12.5px] font-semibold text-[#0F172A] truncate">
            {client.name}
          </h3>
          <span
            className={`shrink-0 text-[8.5px] font-bold uppercase ${meta.text} ${meta.tint} rounded-full px-1.5 py-0.5`}
          >
            {meta.label}
          </span>
        </div>
        <p className="mt-0.5 text-[10.5px] text-[#475569]">{client.budget}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Icon size={10} className={meta.text} strokeWidth={2.4} />
          <p className="text-[10.5px] text-[#0F172A] font-medium">
            {client.nextAction}
          </p>
        </div>
        {client.silenceDays !== undefined && (
          <p className="mt-0.5 text-[9.5px] text-[#94A3B8]">
            Silent {client.silenceDays}d · last {client.lastContact}
          </p>
        )}
      </div>
      <button
        type="button"
        className="shrink-0 w-7 h-7 rounded-full bg-[#F1F5F9] flex items-center justify-center"
      >
        <Phone size={12} className="text-[#475569]" strokeWidth={2.4} />
      </button>
    </motion.div>
  );
}
