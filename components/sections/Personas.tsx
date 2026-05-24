import { User, Users, Sparkle } from "lucide-react";

const personas = [
  {
    icon: User,
    title: "Solo agent",
    desc: "You are the whole office. Lumi is the assistant you can't afford to hire. Captures showings, chases follow-ups, owns your pipeline while you drive.",
  },
  {
    icon: Users,
    title: "Broker team",
    desc: "10+ agents, one shared pipeline, one shared calendar. No more dropped handoffs between listing agent and showing agent. Everyone sees the same lead history.",
  },
  {
    icon: Sparkle,
    title: "New agent",
    desc: "Your first 90 days on the job. Lumi tells you who to call today, what to say, and why — so you hit quota before your license ink is dry.",
  },
];

export function Personas() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
            Built for
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Agents who close, not agents who type.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-surface border border-border rounded-card p-8 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/12 text-accent flex items-center justify-center mb-6">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-text">{p.title}</h3>
                <p className="mt-3 text-sm text-text-dim leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
