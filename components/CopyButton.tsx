"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Variant = "dark" | "light" | "icon";

export function CopyButton({
  text,
  label = "Copy",
  variant = "dark",
}: {
  text: string;
  label?: string;
  variant?: Variant;
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select-all hint
      setCopied(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={copied ? "Copied" : label}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 transition"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    );
  }

  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide uppercase transition";
  const skin =
    variant === "light"
      ? "border border-slate-200 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900"
      : "border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white";

  return (
    <button type="button" onClick={onClick} className={`${base} ${skin}`}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}
