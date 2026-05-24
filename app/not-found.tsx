import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="This page wandered off."
        subtitle="The link is broken, the page moved, or it never existed. Try one of these:"
      />
      <section className="pb-32">
        <div className="container-lumi max-w-2xl">
          <ul className="space-y-3 text-lg">
            <li>
              <Link
                href="/"
                className="text-accent hover:underline underline-offset-4"
              >
                → Home
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="text-accent hover:underline underline-offset-4"
              >
                → What Lumi does
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="text-accent hover:underline underline-offset-4"
              >
                → How it works
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className="text-accent hover:underline underline-offset-4"
              >
                → Join the waitlist
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-accent hover:underline underline-offset-4"
              >
                → FAQ
              </Link>
            </li>
          </ul>
          <p className="mt-12 text-sm text-text-dim">
            Found a broken link?{" "}
            <a
              href="mailto:hello@lumi.estate?subject=Broken%20link%20on%20lumi.estate"
              className="underline underline-offset-4"
            >
              hello@lumi.estate
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
