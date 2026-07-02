import { Check, X, Minus } from "lucide-react";

type Cell = "yes" | "no" | "partial" | string;

const columns = ["Lumi", "Follow Up Boss", "kvCORE", "Google Calendar", "Apple Reminders"] as const;

const rows: { label: string; values: Cell[] }[] = [
  {
    label: "Chat-first AI (not a form wrapper)",
    values: ["yes", "no", "no", "no", "no"],
  },
  {
    label: "Voice capture of showings",
    values: ["yes", "no", "no", "no", "partial"],
  },
  {
    label: "Document Q&A (cited answers from your PDFs)",
    values: ["yes", "no", "no", "no", "no"],
  },
  {
    label: "AI-sorted deal pipeline",
    values: ["yes", "partial", "partial", "no", "no"],
  },
  {
    label: "Calendar + CRM in one app",
    values: ["yes", "no", "no", "no", "no"],
  },
  {
    label: "Offline-first (works at open houses)",
    values: ["yes", "no", "no", "yes", "yes"],
  },
  {
    label: "Google & Apple Calendar sync",
    values: ["yes", "yes", "yes", "yes", "partial"],
  },
  {
    label: "Price",
    values: ["€9/mo · 7-day trial", "$69/mo", "$499/mo", "Free", "Free"],
  },
];

function Cell({ v }: { v: Cell }) {
  if (v === "yes")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-btn bg-accent-soft">
        <Check size={14} className="text-accent" />
      </div>
    );
  if (v === "no")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-btn bg-surface-2">
        <X size={14} className="text-text-mute" />
      </div>
    );
  if (v === "partial")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-btn bg-surface-2">
        <Minus size={14} className="text-text-dim" />
      </div>
    );
  return <span className="font-mono text-[11px] text-text-dim">{v}</span>;
}

export function Comparison() {
  return (
    <section className="section bg-surface border-y border-border">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Why not the existing tools</p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Your CRM is a tab. Your calendar is another tab. Lumi is one app.
          </h2>
          <p className="mt-5 text-lg text-text-dim leading-relaxed">
            We built Lumi because every agent we talked to was running a calendar, a
            CRM, a notes app, and a voice memo — and still losing leads between them.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b-2 border-text">
                <th className="text-left py-4 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-text-mute font-medium">
                  Capability
                </th>
                {columns.map((c, i) => (
                  <th
                    key={c}
                    className={`py-4 px-3 text-center font-display text-base ${
                      i === 0 ? "text-accent" : "text-text-dim"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border">
                  <td className="py-4 pr-4 text-sm text-text">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`py-4 px-3 text-center ${i === 0 ? "bg-accent-soft" : ""}`}
                    >
                      <Cell v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
