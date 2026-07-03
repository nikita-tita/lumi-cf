"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    n: "01",
    title: "Chat that acts",
    desc: "Speak or type. Lumi does.",
    long: "Say or write what happened — “showed Clara the Gràcia apartment, she wants a second viewing Friday” — and Lumi schedules the viewing, updates her card, and drafts the follow-up. Inline confirm cards let you approve with a swipe.",
  },
  {
    n: "02",
    title: "A pipeline that moves itself",
    desc: "New → Contacted → Showing → Offer → Closed.",
    long: "After each conversation or showing, Lumi moves the right card to the right stage — from what you said, not a form you filled. Multi-currency (EUR, USD, AED), eight languages, offline-first.",
  },
  {
    n: "03",
    title: "Documents that answer",
    desc: "Ask a PDF anything. Get cited answers.",
    long: "Upload listings, contracts, HOA docs. Ask “what’s the maintenance fee for Apt 4?” in chat and Lumi pulls the number from the PDF with a source citation. No grep, no tabs, no guesswork.",
  },
];

export function Pillars() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Meet Lumi</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Three things, chat-first.
          </h2>
          <p className="mt-5 text-lg text-text-dim leading-relaxed">
            Lumi doesn&apos;t bolt AI onto a CRM. It replaces the forms. Every path —
            scheduling, pipeline updates, document lookups — starts as a message.
            Forms are the fallback, not the default.
          </p>
        </div>

        <div className="rule mt-16">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid md:grid-cols-[80px_1fr_1.4fr] gap-4 md:gap-10 py-10 border-b border-border group"
            >
              <span className="font-mono text-sm text-text-mute pt-1.5">{p.n}</span>
              <div>
                <h3 className="font-display text-2xl md:text-[28px] text-text leading-snug group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent mt-3">
                  {p.desc}
                </p>
              </div>
              <p className="text-[15px] text-text-dim leading-relaxed">{p.long}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
