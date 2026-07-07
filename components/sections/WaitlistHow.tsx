import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Sign up in 20 seconds",
    desc: "Email is enough. Tell us about the mess you're in if you like — we read every note and it shapes what we build first.",
  },
  {
    n: "02",
    title: "Get a confirmation, not a dashboard",
    desc: "The moment you sign up we email you to confirm you're on the list. Nothing to check, nothing to share — we come to you.",
  },
  {
    n: "03",
    title: "Invites go out in waves",
    desc: "We onboard small groups so every agent gets real support. Two emails total: when your invite is ready, and when we launch publicly.",
  },
];

const included = [
  "Full app access during beta — chat, calendar, pipeline, Documents Q&A",
  "Founding-member price locked in when we launch",
  "A direct line to the team — your feature requests get built",
  "No card required. Cancel by ignoring one email",
];

export function WaitlistHow() {
  return (
    <section className="section bg-surface border-y border-border">
      <div className="container-lumi">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-14 lg:gap-20">
          <div>
            <p className="eyebrow mb-4">How the waitlist works</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
              No spam. No “book a demo”. Just a queue.
            </h2>
            <p className="mt-5 text-lg text-text-dim leading-relaxed">
              Lumi is in private beta with a real queue and real people onboarding
              every wave. Here&apos;s exactly what happens after you sign up.
            </p>
            <Link
              href="/join"
              className="mt-8 inline-flex items-center gap-2 btn-primary rounded-btn px-6 py-3 text-sm"
            >
              Join the waitlist
              <ArrowRight size={15} />
            </Link>
          </div>

          <div>
            <div className="rule">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="grid grid-cols-[56px_1fr] gap-4 py-6 border-b border-border"
                >
                  <span className="font-mono text-sm text-accent pt-0.5">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl text-text">{s.title}</h3>
                    <p className="mt-2 text-sm text-text-dim leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-card border border-border bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-mute mb-4">
                What beta members get
              </p>
              <ul className="space-y-2.5">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-text-dim leading-relaxed">
                    <span className="text-accent font-mono flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
