import { WaitlistForm } from "@/components/WaitlistForm";

export function FinalCta() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="rounded-card bg-[#09090B] text-white px-6 py-16 md:px-16 md:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 mb-6">
              The waitlist is open
            </p>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
              Stop losing leads to your calendar.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
              Join 1,200+ agents on the waitlist. We&apos;ll email you twice: once when
              beta opens, once when we launch. That&apos;s it.
            </p>
            <div className="mt-10">
              <WaitlistForm variant="final" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
