import { WaitlistForm } from "@/components/WaitlistForm";

export function FinalCta() {
  return (
    <section className="section relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 50% 50%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(600px 400px at 80% 80%, rgba(139,92,246,0.14), transparent 60%), radial-gradient(500px 400px at 15% 85%, rgba(236,72,153,0.10), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="container-lumi text-center max-w-3xl">
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-text">
          Stop losing leads to your calendar.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-text-dim max-w-xl mx-auto leading-relaxed">
          Join 1,200+ agents on the waitlist. We&apos;ll email you twice: once when
          beta opens, once when we launch. That&apos;s it.
        </p>
        <div className="mt-10 flex justify-center">
          <WaitlistForm variant="final" />
        </div>
      </div>
    </section>
  );
}
