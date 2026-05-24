export function SocialProof() {
  const items = [
    { label: "Built in", value: "Helsinki" },
    { label: "Powered by", value: "Claude" },
    { label: "On the waitlist", value: "1,200+" },
    { label: "Private beta", value: "Q2 2026" },
    { label: "Public launch", value: "Q3 2026" },
  ];

  return (
    <section className="py-16 border-y border-border">
      <div className="container-lumi">
        <p className="text-center text-xs uppercase tracking-widest text-text-mute mb-10">
          From Helsinki, for real estate agents everywhere
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl text-text">
                {it.value}
              </p>
              <p className="text-xs text-text-mute mt-2 uppercase tracking-wider">
                {it.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
