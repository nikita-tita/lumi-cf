"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container-lumi">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill glass text-xs text-text-dim mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
              Built for real estate agents &middot; Private beta June 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-text"
            >
              Just tell Lumi.
              <br />
              <span className="text-gradient-accent">It handles the rest.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 text-lg md:text-xl text-text-dim max-w-xl leading-relaxed"
            >
              Lumi is a chat-first AI assistant for real estate agents. Speak or type —
              showings get scheduled, your pipeline moves, documents answer themselves.
              Works offline, syncs when you&apos;re back.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-10"
            >
              <WaitlistForm variant="hero" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex items-center gap-6"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-text transition-colors"
              >
                <span className="w-9 h-9 rounded-full border border-border bg-white/60 flex items-center justify-center">
                  <Play size={12} className="text-text ml-0.5" />
                </span>
                Watch 60 seconds
              </Link>
              <div className="h-6 w-px bg-border" aria-hidden />
              <div className="text-sm text-text-dim">
                <span className="text-text font-semibold">1,200+</span> agents on the waitlist
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div className="animate-float">
              <PhoneFrame priority>
                <ChatScreen />
              </PhoneFrame>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
