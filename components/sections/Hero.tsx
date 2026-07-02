"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Planner columns — faint vertical rules behind the hero. */}
      <div
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent calc(25% - 1px), #E0D7C6 calc(25% - 1px), #E0D7C6 25%)",
          opacity: 0.35,
        }}
        aria-hidden
      />
      <div className="container-lumi">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-8"
            >
              For real estate agents · Private beta
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.04] text-text"
            >
              Just tell Lumi.
              <br />
              <em className="text-accent not-italic md:italic">It handles the rest.</em>
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
                className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-accent transition-colors"
              >
                <span className="w-9 h-9 rounded-btn border border-border bg-surface flex items-center justify-center">
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <PhoneFrame priority>
              <ChatScreen />
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
