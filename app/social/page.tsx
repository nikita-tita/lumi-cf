import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Lumi — all the links",
  description:
    "Download Lumi, follow on social, or support Lumi Pro. All in one place.",
  // Link-in-bio is a standalone brand moment — hide from sitemap/indexing
  robots: { index: false, follow: true },
  alternates: { canonical: "https://lumi.estate/social" },
};

type LinkItem = {
  label: string;
  sub?: string;
  href: string;
  icon: React.ReactNode;
  accent?: boolean;
  external?: boolean;
};

// Minimalist inline icons (stroke-based, match aurora palette via currentColor)
const IconApple = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.05 12.54c-.02-2.4 1.96-3.56 2.05-3.62-1.12-1.64-2.87-1.86-3.49-1.89-1.48-.15-2.9.87-3.65.87-.77 0-1.92-.85-3.16-.83-1.62.02-3.13.95-3.96 2.4-1.69 2.93-.43 7.25 1.21 9.63.8 1.16 1.75 2.46 3 2.41 1.21-.05 1.67-.78 3.13-.78 1.45 0 1.87.78 3.15.75 1.3-.02 2.12-1.18 2.92-2.35.91-1.34 1.29-2.65 1.31-2.72-.03-.01-2.51-.96-2.53-3.87zM14.69 5.19C15.35 4.4 15.8 3.32 15.68 2.25c-.93.04-2.05.62-2.74 1.4-.62.69-1.16 1.79-1.02 2.84 1.03.08 2.08-.53 2.77-1.3z"/>
  </svg>
);

const IconAndroid = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6.01 10.51c-.56 0-1.01.45-1.01 1v5.97c0 .56.45 1.01 1.01 1.01s1.01-.45 1.01-1.01v-5.97c0-.55-.45-1-1.01-1zm11.98 0c-.56 0-1.01.45-1.01 1v5.97c0 .56.45 1.01 1.01 1.01s1.01-.45 1.01-1.01v-5.97c0-.55-.45-1-1.01-1zM7.5 11v7.5c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h2v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V11h-9zm8.53-6.54l.97-1.68a.25.25 0 0 0-.43-.25l-.98 1.7A5.96 5.96 0 0 0 12 3.5c-1.28 0-2.48.39-3.48 1l-.98-1.7a.25.25 0 0 0-.43.25l.97 1.68A5.97 5.97 0 0 0 6.1 10h11.8a5.97 5.97 0 0 0-1.87-5.54zM10 7.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm4 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>
  </svg>
);

const IconAt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>
  </svg>
);

const IconCamera = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="6" width="18" height="14" rx="3"/>
    <circle cx="12" cy="13" r="4"/>
    <circle cx="17.5" cy="9.5" r="0.8" fill="currentColor"/>
  </svg>
);

const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21s-7.5-4.5-10-9.5C.5 8 3 4 7 4c2 0 3.5 1 5 2.5C13.5 5 15 4 17 4c4 0 6.5 4 5 7.5-2.5 5-10 9.5-10 9.5z"/>
  </svg>
);

const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M4 12a8 8 0 1 1 3.2 6.4L3 20l1.3-4.1A8 8 0 0 1 4 12z"/>
    <circle cx="9" cy="12" r="0.9" fill="currentColor"/>
    <circle cx="12" cy="12" r="0.9" fill="currentColor"/>
    <circle cx="15" cy="12" r="0.9" fill="currentColor"/>
  </svg>
);

// S11/D1 — real TestFlight / Play Store URLs land in S12+ (device
// rollout sprint). Until then we surface honest "coming soon" labels
// and anchor hrefs that stay on-page.
const LINKS: LinkItem[] = [
  {
    label: "iOS (TestFlight)",
    sub: "Coming soon — join the waitlist",
    href: "#waitlist-ios",
    icon: <IconApple />,
    accent: true,
    external: false,
  },
  {
    label: "Android (Play Store)",
    sub: "Coming soon — join the waitlist",
    href: "#waitlist-android",
    icon: <IconAndroid />,
    external: false,
  },
  {
    label: "Visit lumi.estate",
    sub: "Features · FAQ · manifesto",
    href: "https://lumi.estate",
    icon: <IconGlobe />,
    external: true,
  },
  {
    label: "Follow @lumi.estate on Threads",
    sub: "Builder updates + real-estate talk",
    href: "https://www.threads.net/@lumi.estate",
    icon: <IconAt />,
    external: true,
  },
  {
    label: "Follow @lumi.estate on Instagram",
    sub: "Reels, highlights, behind the scenes",
    href: "https://www.instagram.com/lumi.estate",
    icon: <IconCamera />,
    external: true,
  },
  {
    label: "Join the waitlist",
    sub: "Private beta · invites go out in waves",
    href: "/join",
    icon: <IconHeart />,
  },
  {
    label: "Say hi — hello@lumi.estate",
    sub: "Feedback, partnerships, questions",
    href: "mailto:hello@lumi.estate",
    icon: <IconChat />,
  },
];

export default function SocialLinksPage() {
  return (
    <div
      className="min-h-screen w-full flex justify-center px-5 py-14 sm:py-20"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #1C1C28 0%, #0F0F14 45%, #08080C 100%)",
      }}
    >
      {/* Override Nav/Footer leftover from layout */}
      <style>{`
        header, footer { display: none !important; }
        html, body { background: #08080C !important; }
        ::selection { background: rgba(37,99,235,0.35); color: #fff; }
      `}</style>

      <main className="w-full max-w-md text-white flex flex-col items-center">
        {/* Avatar */}
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden mb-6"
          style={{
            boxShadow:
              "0 0 0 2px rgba(37,99,235,0.4), 0 20px 60px -15px rgba(37,99,235,0.5)",
          }}
        >
          <Image
            src="/icon.png"
            alt="Lumi logo"
            width={112}
            height={112}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + handle */}
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Lumi — AI for Real Estate
        </h1>
        <p className="text-sm text-white/50 mb-8">@lumi.estate</p>

        {/* Bio */}
        <p className="text-center text-[15px] leading-relaxed text-white/80 mb-10 max-w-[340px]">
          Your AI calendar, CRM, and assistant for real estate.
          <br />
          Never miss a showing. Never drop a lead.
          <br />
          <span className="text-white/50">
            Built for agents in EU · LatAm · MENA.
          </span>
        </p>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={[
                "group relative flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200",
                "hover:-translate-y-[1px] active:translate-y-0",
                link.accent
                  ? "border-transparent text-white"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20",
              ].join(" ")}
              style={
                link.accent
                  ? {
                      background:
                        "#2563EB",
                      boxShadow: "0 12px 30px -10px rgba(37,99,235,0.55)",
                    }
                  : undefined
              }
            >
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  link.accent
                    ? "bg-white/15 text-white"
                    : "bg-white/[0.04] text-white/80 group-hover:text-white",
                ].join(" ")}
              >
                {link.icon}
              </span>
              <span className="flex flex-col text-left">
                <span className="text-[15px] font-medium leading-tight">
                  {link.label}
                </span>
                {link.sub && (
                  <span
                    className={[
                      "text-xs mt-0.5",
                      link.accent ? "text-white/75" : "text-white/45",
                    ].join(" ")}
                  >
                    {link.sub}
                  </span>
                )}
              </span>
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={[
                  "ml-auto shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
                  link.accent ? "text-white/80" : "text-white/40",
                ].join(" ")}
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-white/35 text-center max-w-[300px]">
          One plan, everything included — €9/month
          <br />
          after a 7-day free trial. Beta is free.
        </p>
      </main>
    </div>
  );
}
