"use client";

import { useState, useEffect, FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; position: number; refCode: string }
  | { kind: "error"; message: string };

export function WaitlistForm({
  variant = "hero",
  showNote = false,
}: {
  variant?: "hero" | "final" | "page";
  showNote?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      document.cookie = `lumi_ref=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || state.kind === "loading") return;

    setState({ kind: "loading" });

    const refMatch = document.cookie.match(/lumi_ref=([^;]+)/);
    const referredBy = refMatch ? decodeURIComponent(refMatch[1]) : null;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          note: note || null,
          source: pathname || "/",
          referredBy,
          hp: "", // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState({ kind: "success", position: data.position, refCode: data.refCode });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  if (state.kind === "success") {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${state.refCode}`
        : `https://lumi.estate/?ref=${state.refCode}`;
    return (
      <div className="glass rounded-card p-6 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            <Check size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-text font-semibold">You&apos;re in.</p>
            <p className="text-sm text-text-dim">
              Position #{state.position}. Move up by sharing your link.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <code className="flex-1 text-xs text-text-dim bg-surface-2 border border-border rounded-btn px-3 py-2 truncate">
            {shareUrl}
          </code>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="btn-ghost rounded-btn px-4 py-2 text-sm"
          >
            Copy
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={variant === "page" ? "space-y-4 max-w-xl" : "max-w-xl"}>
      <div
        className={`glass rounded-card p-2 flex flex-col sm:flex-row gap-2 ${
          variant === "page" ? "" : ""
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input-dark flex-1 rounded-btn px-4 py-3 text-sm"
          autoComplete="email"
          aria-label="Email"
        />
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="btn-primary rounded-btn px-5 py-3 text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
        >
          {state.kind === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Joining...
            </>
          ) : (
            <>
              Join the waitlist <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {showNote && (
        <div className="space-y-3 mt-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="input-dark w-full rounded-btn px-4 py-3 text-sm"
            autoComplete="name"
            maxLength={80}
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 160))}
            placeholder="What do you want Lumi to fix for you? (optional)"
            rows={3}
            maxLength={160}
            className="input-dark w-full rounded-btn px-4 py-3 text-sm resize-none"
          />
          <p className="text-xs text-text-mute text-right">{note.length}/160</p>
        </div>
      )}

      {/* honeypot */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <p className="text-xs text-text-mute mt-3">
        No spam. We&apos;ll email you twice: once when beta opens, once when we launch.
      </p>

      {state.kind === "error" && (
        <p className="text-xs text-red-400 mt-2" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
