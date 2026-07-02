"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-border">
      {/* Subtle dot grid, fading toward content. */}
      <div
        className="absolute inset-0 -z-10 dot-grid"
        style={{
          maskImage: "radial-gradient(800px 500px at 70% 20%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(800px 500px at 70% 20%, black, transparent 75%)",
        }}
        aria-hidden
      />
      <div className="container-lumi">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-pill border border-border bg-white px-3 py-1 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-medium text-text-dim">
                Private beta for real estate agents
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-[68px] tracking-tight leading-[1.05] text-text"
            >
              Just tell Lumi.
              <br />
              It handles the rest.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg md:text-xl text-text-dim max-w-xl leading-relaxed"
            >
              Lumi is a chat-first AI assistant for real estate agents. Speak or type —
              showings get scheduled, your pipeline moves, documents answer themselves.
              Works offline, syncs when you&apos;re back.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10"
            >
              <WaitlistForm variant="hero" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex items-center gap-6"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-sm font-medium text-text-dim hover:text-text transition-colors"
              >
                <span className="w-8 h-8 rounded-pill border border-border bg-white flex items-center justify-center">
                  <Play size={11} className="text-text ml-0.5" />
                </span>
                Watch 60 seconds
              </Link>
              <div className="h-5 w-px bg-border" aria-hidden />
              <div className="text-sm text-text-dim">
                <span className="text-text font-semibold">1,200+</span> agents on the waitlist
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
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
