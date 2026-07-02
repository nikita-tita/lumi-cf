const personas = [
  {
    tag: "Solo",
    title: "Solo agent",
    desc: "You are the whole office. Lumi is the assistant you can't afford to hire. Captures showings, chases follow-ups, owns your pipeline while you drive.",
  },
  {
    tag: "Team",
    title: "Broker team",
    desc: "10+ agents, one shared pipeline, one shared calendar. No more dropped handoffs between listing agent and showing agent. Everyone sees the same lead history.",
  },
  {
    tag: "Rookie",
    title: "New agent",
    desc: "Your first 90 days on the job. Lumi tells you who to call today, what to say, and why — so you hit quota before your license ink is dry.",
  },
];

export function Personas() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Built for</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Agents who close, not agents who type.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 mt-14 border border-border rounded-card overflow-hidden bg-surface divide-y md:divide-y-0 md:divide-x divide-border">
          {personas.map((p) => (
            <div key={p.title} className="p-8 hover:bg-bg transition-colors">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-mute">
                {p.tag}
              </p>
              <h3 className="font-display text-2xl text-text mt-4">{p.title}</h3>
              <p className="mt-3 text-sm text-text-dim leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
