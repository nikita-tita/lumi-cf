"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChatScreen } from "@/components/screens/ChatScreen";
import { TodosScreen } from "@/components/screens/TodosScreen";
import { ClientsScreen } from "@/components/screens/ClientsScreen";

type Scene = {
  time: string;
  tag: string;
  title: string;
  desc: string;
  Screen: () => ReactNode;
};

const scenes: Scene[] = [
  {
    time: "07:15",
    tag: "Morning brief",
    title: "\u201cWhat\u2019s today look like?\u201d",
    desc: "Ask Lumi in chat. Two showings, three leads going cold, one contract ready for signature. Your \u20ac12.4M pipeline summarised in one message — before your first coffee.",
    Screen: () => <ChatScreen variant="brief" />,
  },
  {
    time: "11:30",
    tag: "After the showing",
    title: "Log the visit in 6 seconds.",
    desc: "Hold the mic: \u201cClara liked Passeig de Gr\u00e0cia 84, send comparable listings tomorrow.\u201d Lumi logs the visit, creates the todo, drafts the message — all as inline cards you swipe to confirm.",
    Screen: TodosScreen,
  },
  {
    time: "15:45",
    tag: "Ask the document",
    title: "\u201cWhat\u2019s the HOA on Apt 4?\u201d",
    desc: "Upload once, ask forever. Lumi reads the PDF, cites the line, and gives you the number in chat — \u20ac210/month, covers elevator and concierge. No more \u201clet me get back to you\u201d.",
    Screen: () => <ChatScreen variant="docs" />,
  },
  {
    time: "21:00",
    tag: "Evening digest",
    title: "14 active leads. 3 need attention tomorrow.",
    desc: "Lumi shows you who\u2019s ready to move and who\u2019s going silent. Drafts the morning messages right inside the chat. Tap approve, close the app.",
    Screen: ClientsScreen,
  },
];

export function DayWithLumi() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl mb-20 lg:mb-28">
          <p className="eyebrow mb-4">A day with Lumi</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            From the first showing to the last follow-up.
          </h2>
        </div>
      </div>

      <div ref={containerRef} className="container-lumi relative">
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start lg:h-[720px] lg:flex lg:items-center lg:justify-center">
            <StickyPhone scrollYProgress={scrollYProgress} />
          </div>

          <div className="space-y-40 lg:space-y-64 py-8 lg:py-0">
            {scenes.map((s) => (
              <motion.div
                key={s.time}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40%" }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-baseline gap-4 mb-3 border-b border-border pb-3">
                  <span className="font-mono text-4xl md:text-5xl text-accent tracking-tight">
                    {s.time}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-mute">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-text leading-tight mt-4">
                  {s.title}
                </h3>
                <p className="mt-4 text-base md:text-lg text-text-dim leading-relaxed max-w-lg">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyPhone({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const idx = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 3]);
  return (
    <motion.div className="w-full flex justify-center">
      <SceneSwitcher idx={idx} />
    </motion.div>
  );
}

function SceneSwitcher({ idx }: { idx: MotionValue<number> }) {
  const o0 = useTransform(idx, (v) => Math.max(0, 1 - Math.abs(v - 0) * 1.5));
  const o1 = useTransform(idx, (v) => Math.max(0, 1 - Math.abs(v - 1) * 1.5));
  const o2 = useTransform(idx, (v) => Math.max(0, 1 - Math.abs(v - 2) * 1.5));
  const o3 = useTransform(idx, (v) => Math.max(0, 1 - Math.abs(v - 3) * 1.5));

  const opacities = [o0, o1, o2, o3];

  return (
    <div className="relative w-[320px] h-[720px]">
      {scenes.map((scene, i) => {
        const Screen = scene.Screen;
        return (
          <motion.div
            key={scene.time}
            style={{ opacity: opacities[i] }}
            className="absolute inset-0"
          >
            <PhoneFrame>
              <Screen />
            </PhoneFrame>
          </motion.div>
        );
      })}
    </div>
  );
}
