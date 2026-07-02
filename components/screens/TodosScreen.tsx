"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { AppShell } from "./AppShell";

type Priority = "high" | "med" | "low";

type Todo = {
  title: string;
  meta: string;
  priority: Priority;
  done?: boolean;
  source?: string;
};

const TODOS: Todo[] = [
  {
    title: "Prepare comps for Ruiz — Passeig de Gràcia 84",
    meta: "Due today · 18:00",
    priority: "high",
    source: "From voice note · 11:32",
  },
  {
    title: "Request mortgage approval docs",
    meta: "Due today",
    priority: "high",
  },
  {
    title: "Update Idealista listing · 3BR Gràcia",
    meta: "Due today",
    priority: "med",
    source: "AI suggested",
  },
  {
    title: "Call back lead from Bayut — Dubai Marina",
    meta: "Due tomorrow",
    priority: "med",
  },
  { title: "Review contract draft — Schneider", meta: "Done · 9:12", priority: "low", done: true },
  { title: "Send photos to Mitchell", meta: "Done · 8:40", priority: "low", done: true },
];

const PRIORITY_COLOR: Record<Priority, string> = {
  high: "bg-[#EF4444]",
  med: "bg-accent",
  low: "bg-[#A1A1AA]",
};

export function TodosScreen() {
  return (
    <AppShell
      active="todos"
      title="Today"
      headerAction={
        <button
          type="button"
          className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(37,99,235,0.55)]"
          style={{
            background: "#2563EB",
          }}
        >
          <Plus size={16} strokeWidth={2.4} />
        </button>
      }
    >
      <div className="px-5 pt-1 pb-2 flex items-center gap-2">
        <Pill active>All · 6</Pill>
        <Pill>High · 2</Pill>
        <Pill>From voice · 2</Pill>
      </div>

      <div className="px-4 pt-1 pb-2 space-y-1.5 overflow-hidden">
        {TODOS.map((t, i) => (
          <TodoRow key={t.title} todo={t} index={i} />
        ))}
      </div>
    </AppShell>
  );
}

function Pill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`text-[10.5px] font-semibold ${
          active ? "text-[#09090B]" : "text-[#A1A1AA]"
        }`}
      >
        {children}
      </span>
      <div
        className="h-[2px] w-[18px] rounded-full"
        style={{
          background: active
            ? "#2563EB"
            : "transparent",
        }}
      />
    </div>
  );
}

function TodoRow({ todo, index }: { todo: Todo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.35 }}
      className={`flex items-start gap-3 bg-white rounded-2xl px-3 py-2.5 border border-[#E2E8F0] ${
        todo.done ? "opacity-50" : ""
      }`}
    >
      <Checkbox done={todo.done} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLOR[todo.priority]}`}
          />
          <h3
            className={`text-[12.5px] font-semibold text-[#09090B] leading-tight truncate ${
              todo.done ? "line-through" : ""
            }`}
          >
            {todo.title}
          </h3>
        </div>
        <p className="mt-1 text-[10.5px] text-[#A1A1AA]">{todo.meta}</p>
        {todo.source && (
          <p className="mt-0.5 text-[9.5px] text-accent-2 font-medium">
            {todo.source}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Checkbox({ done }: { done?: boolean }) {
  if (done) {
    return (
      <div
        className="shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center"
        style={{
          background: "#2563EB",
        }}
      >
        <Check size={12} className="text-white" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-md border-[1.5px] border-[#CBD5E1]" />
  );
}
