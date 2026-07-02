"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/research", label: "Research" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
      <div className="container-lumi flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Lumi home">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-dim hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/join"
            className="btn-primary rounded-btn px-5 py-2 text-sm"
          >
            Join the waitlist
          </Link>
        </div>

        <button
          className="md:hidden text-text p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-border">
          <div className="container-lumi py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.14em] text-text-dim hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="btn-primary rounded-btn px-5 py-3 text-sm text-center mt-2"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
