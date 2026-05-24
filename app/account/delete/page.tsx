import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Delete your Lumi account",
  description:
    "How to permanently delete your Lumi account and the data associated with it.",
  alternates: { canonical: "https://lumi.estate/account/delete" },
};

export default function AccountDeletePage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Delete your Lumi account"
        subtitle="You can request permanent deletion of your account and all data associated with it at any time."
      />
      <section className="pb-32">
        <div className="container-lumi max-w-2xl space-y-8 text-text-dim leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-text mb-3">
              How to request deletion
            </h2>
            <p>
              Send an email from the address associated with your Lumi account to{" "}
              <a
                href="mailto:hello@lumi.estate?subject=Account%20deletion%20request"
                className="text-accent underline underline-offset-4"
              >
                hello@lumi.estate
              </a>{" "}
              with the subject line <strong>&ldquo;Account deletion request&rdquo;</strong>.
            </p>
            <p className="mt-3">
              We&apos;ll confirm receipt within 24 hours and complete deletion within
              7 days.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-text mb-3">
              What gets deleted
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your profile and account credentials</li>
              <li>All contacts, deals, calls, notes, and tasks you created</li>
              <li>Voice recordings, transcripts, and AI-generated summaries</li>
              <li>Uploaded documents and their embeddings</li>
              <li>Calendar entries and showing logs</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-text mb-3">
              What we may retain
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Anonymised, aggregated usage statistics (no personal identifiers).
              </li>
              <li>
                Records we&apos;re legally required to keep (e.g. financial /
                tax records of paid subscriptions, up to the limitation period
                in the relevant jurisdiction).
              </li>
              <li>
                Backups for up to 30 days after deletion, after which they are
                purged on the standard backup-rotation cycle.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-text mb-3">
              In-app deletion
            </h2>
            <p>
              In the Lumi mobile app: Settings → Account → Delete account.
              The app will prompt you to confirm and then send the same email
              request to our team.
            </p>
          </div>

          <div className="text-sm border-t border-border pt-6">
            <p>
              Questions? Read the{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 text-text"
              >
                Privacy Policy
              </a>{" "}
              or write to{" "}
              <a
                href="mailto:hello@lumi.estate"
                className="underline underline-offset-4 text-text"
              >
                hello@lumi.estate
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
