import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/join", label: "Join the waitlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/manifesto", label: "Manifesto" },
      { href: "/research", label: "Research" },
      { href: "/press", label: "Press kit" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="container-lumi py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Logo />
            <p className="text-text-dim text-sm mt-4 max-w-xs leading-relaxed">
              The AI calendar and CRM built for real estate agents. From Helsinki, for agents everywhere.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-text text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-text-dim hover:text-text transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-text-mute">
            &copy; 2026 Lumi service app &mdash; operated by Nikita Titov, private individual.
          </p>
          <p className="text-xs text-text-mute">
            Private beta opens June 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
