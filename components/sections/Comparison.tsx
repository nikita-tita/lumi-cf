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
    values: ["Free · optional donation", "$69/mo", "$499/mo", "Free", "Free"],
  },
];

function Cell({ v }: { v: Cell }) {
  if (v === "yes")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/15">
        <Check size={14} className="text-accent" />
      </div>
    );
  if (v === "no")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5">
        <X size={14} className="text-text-mute" />
      </div>
    );
  if (v === "partial")
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5">
        <Minus size={14} className="text-text-dim" />
      </div>
    );
  return <span className="text-xs text-text-dim">{v}</span>;
}

export function Comparison() {
  return (
    <section className="section">
      <div className="container-lumi">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">
            Why not the existing tools
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text">
            Your CRM is a tab. Your calendar is another tab. Lumi is one app.
          </h2>
          <p className="mt-5 text-lg text-text-dim leading-relaxed">
            We built Lumi because every agent we talked to was running a calendar, a
            CRM, a notes app, and a voice memo — and still losing leads between them.
          </p>
        </div>

        <div className="mt-14 bg-surface rounded-card border border-border shadow-soft overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs uppercase tracking-wider text-text-mute font-medium px-6 py-5">
                  Feature
                </th>
                {columns.map((c, i) => (
                  <th
                    key={c}
                    className={`text-center text-xs uppercase tracking-wider font-medium px-4 py-5 ${
                      i === 0 ? "text-accent" : "text-text-mute"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr
                  key={r.label}
                  className={ri < rows.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="text-sm text-text px-6 py-5">{r.label}</td>
                  {r.values.map((v, ci) => (
                    <td
                      key={ci}
                      className={`text-center px-4 py-5 ${
                        ci === 0 ? "bg-accent/[0.06]" : ""
                      }`}
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
