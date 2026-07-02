"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "./faq-data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-lumi max-w-3xl">
        <div>
          <p className="eyebrow mb-4">Questions</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Things worth knowing.
          </h2>
        </div>

        <div className="mt-14 rule">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-border">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left py-5 flex items-baseline justify-between gap-6 group"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-text-mute w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-base md:text-lg font-display transition-colors ${
                        isOpen ? "text-accent" : "text-text group-hover:text-accent"
                      }`}
                    >
                      {item.q}
                    </span>
                  </span>
                  <span className="flex-shrink-0 self-center">
                    {isOpen ? (
                      <Minus size={16} className="text-accent" />
                    ) : (
                      <Plus size={16} className="text-text-mute" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pl-11 text-sm md:text-base text-text-dim leading-relaxed max-w-2xl">
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
