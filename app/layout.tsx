import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumi.estate"),
  title: {
    default: "Lumi — the chat-first AI assistant for real estate agents",
    template: "%s · Lumi",
  },
  description:
    "Lumi is a chat-first AI assistant for real estate agents. Speak or type — showings get scheduled, your pipeline moves, documents answer themselves. Works offline, syncs when you’re back.",
  keywords: [
    "chat-first AI for real estate",
    "real estate AI assistant",
    "AI calendar for agents",
    "real estate CRM",
    "voice capture for agents",
    "documents RAG real estate",
    "offline real estate CRM",
    "EU real estate tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumi.estate",
    title: "Lumi — the chat-first AI assistant for real estate agents",
    description:
      "Speak or type — showings get scheduled, your pipeline moves, documents answer themselves. Built for agents in EU, LatAm and MENA.",
    siteName: "Lumi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — the chat-first AI assistant for real estate agents",
    description:
      "Speak or type — showings get scheduled, your pipeline moves, documents answer themselves.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F2EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
