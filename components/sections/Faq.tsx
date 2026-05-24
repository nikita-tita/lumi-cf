"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "./faq-data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-lumi max-w-3xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
            Questions
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Things worth knowing.
          </h2>
        </div>

        <div className="mt-14 bg-surface rounded-card border border-border shadow-soft overflow-hidden divide-y divide-border">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-surface-2 transition-colors"
                >
                  <span className="text-base md:text-lg font-semibold text-text">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                    {isOpen ? (
                      <Minus size={14} className="text-accent" />
                    ) : (
                      <Plus size={14} className="text-text-dim" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm md:text-base text-text-dim leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
