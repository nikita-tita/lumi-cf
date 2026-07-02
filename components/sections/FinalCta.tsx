import { WaitlistForm } from "@/components/WaitlistForm";

export function FinalCta() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="rounded-card bg-[#1F5738] text-[#F6F2EA] px-6 py-16 md:px-16 md:py-24 relative overflow-hidden">
          {/* Ledger rules on the panel — quiet texture, no gradients. */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 47px, #F6F2EA 47px, #F6F2EA 48px)",
            }}
            aria-hidden
          />
          <div className="relative max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F6F2EA]/60 mb-6">
              The waitlist is open
            </p>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
              Stop losing leads to your calendar.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-[#F6F2EA]/75 max-w-xl leading-relaxed">
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
