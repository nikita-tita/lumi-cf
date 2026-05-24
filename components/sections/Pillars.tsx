"use client";

import { motion } from "framer-motion";
import { MessageCircle, Kanban, FileSearch } from "lucide-react";

const pillars = [
  {
    icon: MessageCircle,
    title: "Chat that acts",
    desc: "Speak or type. Lumi does.",
    long: "Say or write what happened — \u201cshowed Clara the Gràcia apartment, she wants a second viewing Friday\u201d — and Lumi schedules the viewing, updates her card, and drafts the follow-up. Inline confirm cards let you approve with a swipe.",
  },
  {
    icon: Kanban,
    title: "A pipeline that moves itself",
    desc: "New → Contacted → Showing → Offer → Closed.",
    long: "After each conversation or showing, Lumi moves the right card to the right stage — from what you said, not a form you filled. Multi-currency (EUR, USD, AED), eight languages, offline-first.",
  },
  {
    icon: FileSearch,
    title: "Documents that answer",
    desc: "Ask a PDF anything. Get cited answers.",
    long: "Upload listings, contracts, HOA docs. Ask \u201cwhat\u2019s the maintenance fee for Apt 4?\u201d in chat and Lumi pulls the number from the PDF with a source citation. No grep, no tabs, no guesswork.",
  },
];

export function Pillars() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
            Meet Lumi
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Three things, chat-first.
          </h2>
          <p className="mt-5 text-lg text-text-dim leading-relaxed">
            Lumi doesn&apos;t bolt AI onto a CRM. It replaces the forms. Every path —
            scheduling, pipeline updates, document lookups — starts as a message.
            Forms are the fallback, not the default.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group rounded-card p-8 bg-surface border border-border shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-accent/12 flex items-center justify-center mb-6">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text">{p.title}</h3>
                  <p className="text-sm text-accent mt-2 font-medium">{p.desc}</p>
                  <p className="text-sm text-text-dim mt-4 leading-relaxed">{p.long}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
