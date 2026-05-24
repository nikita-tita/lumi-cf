"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Send } from "lucide-react";

/**
 * Client-side share landing reached from the welcome email's "Copy link" CTA.
 *
 * Reads `?ref=<refCode>&action=copy` and:
 *   - Shows the share URL prominently with a 1-tap Copy button
 *   - If `action=copy` is set, attempts an automatic clipboard write on mount
 *     so the email CTA flow really is "tap once → link is on clipboard"
 *   - Falls back to manual Copy button when clipboard API is blocked
 *     (some embedded webviews, Safari < 13.1, etc.)
 *   - Native share intents (WhatsApp / Telegram / Twitter / Email) — channel
 *     of choice for agent-to-agent referrals in EU/LatAm/MENA.
 */
export function ShareCopy() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const autoCopy = params.get("action") === "copy";
  const [copied, setCopied] = useState(false);
  const [hasNavigatorShare, setHasNavigatorShare] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const triedAuto = useRef(false);

  const shareUrl = ref
    ? `https://lumi.estate/?ref=${encodeURIComponent(ref)}`
    : "https://lumi.estate";
  const message = `Join the Lumi waitlist — chat-first AI for real-estate agents. ${shareUrl}`;

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setHasNavigatorShare(true);
    }
  }, []);

  useEffect(() => {
    if (!autoCopy || triedAuto.current) return;
    triedAuto.current = true;
    void copyToClipboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCopy]);

  async function copyToClipboard() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else if (linkRef.current) {
        linkRef.current.select();
        linkRef.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (cross-origin webview, etc.) — leave the input
      // selectable so user can long-press and copy manually.
      if (linkRef.current) {
        linkRef.current.select();
      }
    }
  }

  async function nativeShare() {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: "Lumi",
          text: "Join the Lumi waitlist — chat-first AI for real-estate agents.",
          url: shareUrl,
        });
      }
    } catch {
      // user cancelled — silent
    }
  }

  return (
    <div className="w-full max-w-xl">
      <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3 text-center">
        Your share link
      </p>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight text-text text-center mb-3">
        Move up by sharing.
      </h1>
      <p className="text-base text-text-dim text-center max-w-md mx-auto mb-8 leading-relaxed">
        Every agent who joins from your link moves you up the waitlist. No gimmicks.
      </p>

      <div
        className="rounded-card p-6 border border-border shadow-soft mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.04) 50%, rgba(236,72,153,0.03) 100%)",
        }}
      >
        <label className="block text-xs uppercase tracking-widest text-text-mute font-semibold mb-2">
          Link
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={linkRef}
            readOnly
            value={shareUrl}
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 input-dark rounded-btn px-3 py-3 text-sm font-mono truncate"
            aria-label="Share link"
          />
          <button
            type="button"
            onClick={copyToClipboard}
            className={`btn-primary rounded-btn px-4 py-3 text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
              copied ? "opacity-90" : ""
            }`}
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check size={16} strokeWidth={2.6} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} strokeWidth={2.4} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        <ShareIntent
          label="WhatsApp"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        />
        <ShareIntent
          label="Telegram"
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Lumi — chat-first AI for real-estate agents")}`}
        />
        <ShareIntent
          label="X / Twitter"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
        />
        <ShareIntent
          label="Email"
          href={`mailto:?subject=${encodeURIComponent("Worth checking out: Lumi")}&body=${encodeURIComponent(message)}`}
        />
      </div>

      {hasNavigatorShare && (
        <div className="text-center">
          <button
            type="button"
            onClick={nativeShare}
            className="btn-ghost rounded-btn px-5 py-3 text-sm inline-flex items-center justify-center gap-2"
          >
            <Send size={14} strokeWidth={2.4} />
            Share via…
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-text-mute">
        Tip: long-press the link on mobile to copy if the button doesn&apos;t work.
      </p>
    </div>
  );
}

function ShareIntent({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-ghost rounded-btn px-3 py-2.5 text-xs font-semibold text-center"
    >
      {label}
    </a>
  );
}
