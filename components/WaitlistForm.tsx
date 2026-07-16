"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { track } from "@/components/Analytics";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; theme?: string },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      document.cookie = `lumi_ref=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }, []);

  // Render Turnstile widget when script is ready and key is configured
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    const tryRender = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY!,
          theme: "dark",
          callback: (token: string) => setTurnstileToken(token),
        });
        return true;
      }
      return false;
    };
    if (!tryRender()) {
      const interval = setInterval(() => {
        if (tryRender()) clearInterval(interval);
      }, 200);
      return () => clearInterval(interval);
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
          turnstileToken,
          hp: "", // honeypot
        }),
      });
      const data = await res.json();
      // res.ok alone is not enough: the endpoint has answered 200 for a lead it
      // delivered nowhere. Treat an explicit failure flag as failure too, so a
      // regression on the server can't make us claim success again.
      if (!res.ok || data?.ok === false || data?.degraded) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setState({ kind: "success" });
      track("waitlist_submitted", { source: pathname || "/" });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
      track("waitlist_error", {
        source: pathname || "/",
        message: err instanceof Error ? err.message : String(err),
      });
      // Reset Turnstile after error so user can retry
      if (TURNSTILE_SITE_KEY && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    }
  }

  if (state.kind === "success") {
    return (
      <div className="glass rounded-card p-6 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
            <Check size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-text font-semibold">You&apos;re in.</p>
            <p className="text-sm text-text-dim">
              We&apos;ll email you when your beta invite is ready — and once more when we
              launch. No spam.
            </p>
          </div>
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
          onFocus={() => track("waitlist_form_focused", { source: pathname || "/" })}
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

      {/* Cloudflare Turnstile (loads script + container only when site key is configured) */}
      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
          <div ref={turnstileRef} className="mt-3" />
        </>
      )}

      <p
        className={`text-xs mt-3 ${
          variant === "final" ? "text-[#FAFAFA]/60" : "text-text-mute"
        }`}
      >
        No spam. We&apos;ll email you twice: once when beta opens, once when we launch.
      </p>

      {state.kind === "error" && (
        <p className="text-xs text-[#D97706] mt-2" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
