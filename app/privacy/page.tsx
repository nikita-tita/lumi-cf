import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lumi collects, uses and protects your personal data. GDPR (EU/UK), LGPD (Brazil), LFPDPPP (Mexico), Argentine Law 25.326, and UAE PDPL compliant.",
  alternates: { canonical: "https://lumi.estate/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy" }]} />
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy."
        subtitle="Last updated: 24 April 2026"
      />
      <section className="pb-32">
        <div className="container-lumi max-w-3xl space-y-8 text-text-dim leading-relaxed">
          <p>
            This Privacy Policy (the &ldquo;Policy&rdquo;) explains what personal
            data the Lumi service (the &ldquo;Service&rdquo;) collects on the
            website{" "}
            <a className="text-accent hover:underline" href="https://lumi.estate">
              lumi.estate
            </a>{" "}
            and in the Lumi mobile application (&ldquo;the App&rdquo;), how we
            use it, on what legal basis, and what rights you have. It is written
            to comply with applicable data protection laws in the European
            Economic Area (GDPR), the United Kingdom (UK GDPR), Brazil (LGPD),
            Mexico (LFPDPPP), Argentina (Ley 25.326), and the UAE (Federal
            Decree-Law No. 45/2021 — PDPL).
          </p>

          <Callout>
            <strong>Not legal advice.</strong> This Policy is a plain-language
            document. It is binding on us, but it is not a legal opinion for
            you. If you need legal advice, consult a qualified lawyer in your
            jurisdiction.
          </Callout>

          <Section title="1. Who we are (controller)">
            <p>The data controller of your personal data is:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                <strong>Nikita Titov</strong>, acting as a private individual
                (sole operator of the Service);
              </li>
              <li>
                Contact e-mail:{" "}
                <a
                  className="text-accent hover:underline"
                  href="mailto:hello@lumi.estate"
                >
                  hello@lumi.estate
                </a>
                ;
              </li>
              <li>
                Trading name: <strong>Lumi</strong> — an AI-powered calendar
                &amp; CRM assistant for real-estate agents.
              </li>
            </ul>
            <p className="mt-3">
              The Service is currently operated by the controller in an
              individual capacity. Should a company be incorporated, this Policy
              will be updated and app users will be notified.
            </p>
          </Section>

          <Section title="2. What personal data we collect">
            <p className="font-semibold mb-2">Website (lumi.estate)</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>
                <strong>Waitlist data</strong> you submit: e-mail address, and
                optionally a name, role, country and a short free-text note.
              </li>
              <li>
                <strong>Technical data</strong>: IP address (temporarily, for
                rate-limiting), HTTP user-agent, referrer, timestamp.
              </li>
              <li>
                <strong>Cookie &amp; analytics data</strong> as described in
                our{" "}
                <a className="text-accent hover:underline" href="/cookies">
                  Cookie Policy
                </a>
                .
              </li>
            </ul>

            <p className="font-semibold mb-2 mt-5">Mobile App (iOS / Android)</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>
                <strong>Account data</strong>: e-mail address, name, password
                hash (stored only on our server, never in plaintext), optional
                Google / Apple Sign-In identifiers.
              </li>
              <li>
                <strong>Calendar events</strong> you create or import: title,
                start/end time, location, description, attendees.
              </li>
              <li>
                <strong>CRM / client records</strong> you enter: client names,
                phone numbers, e-mail addresses, stage in your sales pipeline,
                notes, deal history.
              </li>
              <li>
                <strong>To-do items</strong>: task title, due date, priority,
                completion status.
              </li>
              <li>
                <strong>Voice input</strong>: when you use the voice command
                feature, the audio is sent to OpenAI Whisper for transcription.
                Audio is not retained after transcription.
              </li>
              <li>
                <strong>Document content</strong> (optional): if you upload
                client documents (PDFs, images), their text is extracted and
                embedded for semantic search. Originals are stored in your
                private storage bucket.
              </li>
              <li>
                <strong>Location</strong> (optional, when you enable the
                check-in feature): approximate GPS coordinates when you arrive
                at an event location. Used only for check-in detection; not
                shared with third parties.
              </li>
              <li>
                <strong>Chat messages</strong> you send to the AI assistant:
                your messages and context (events, tasks) are sent to
                Anthropic&rsquo;s Claude API to generate responses.
              </li>
              <li>
                <strong>Analytics &amp; crash data</strong>: anonymised usage
                events (e.g., &ldquo;event created&rdquo;, &ldquo;chat
                message sent&rdquo;) and crash reports.
              </li>
              <li>
                <strong>Device data</strong>: Expo push token (for
                notifications), platform (iOS/Android), app version.
              </li>
            </ul>
          </Section>

          <Section title="3. Why we process it (purposes &amp; legal basis)">
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Provide the core App features</strong> (calendar, CRM,
                AI assistant, voice, documents). Legal basis:{" "}
                <em>performance of a contract</em> (GDPR art. 6(1)(b); LGPD
                art. 7(V)).
              </li>
              <li>
                <strong>Send push notifications and reminders</strong> you
                configure. Legal basis: <em>consent</em> (GDPR art. 6(1)(a),
                obtained on first notification permission prompt).
              </li>
              <li>
                <strong>
                  Process AI requests (chat, voice, document search)
                </strong>
                . We disclose to you before you first use each AI feature that
                your content is sent to Anthropic (Claude) and/or OpenAI
                (Whisper, embeddings). Legal basis:{" "}
                <em>consent</em> (AI consent gate in onboarding) and{" "}
                <em>performance of a contract</em>.
              </li>
              <li>
                <strong>Analytics and product improvement</strong>. Legal basis:{" "}
                <em>legitimate interest</em> (we use aggregated, anonymised
                events; no behavioural profiling for advertising).
              </li>
              <li>
                <strong>Security, fraud prevention, legal compliance</strong>.
                Legal basis: <em>legitimate interest</em> and{" "}
                <em>legal obligation</em>.
              </li>
              <li>
                <strong>Waitlist and product launch communications</strong>.
                Legal basis: <em>consent</em>.
              </li>
            </ul>
            <p className="mt-3">
              We will not use your data for automated decision-making with legal
              or similarly significant effects, and we will never sell your data.
            </p>
          </Section>

          <Section title="4. AI features — what leaves your device">
            <Callout>
              When you use AI features, certain content is sent to third-party
              AI providers. Here is what goes where:
            </Callout>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Chat assistant</strong>: your message text and relevant
                context (event titles, times, client names) → Anthropic Claude
                API (via our BFF proxy at lumi-bff.vercel.app). Anthropic does
                not use API data to train models by default.
              </li>
              <li>
                <strong>Voice commands</strong>: audio recording → OpenAI
                Whisper API (transcription only; audio deleted after).
              </li>
              <li>
                <strong>Document search</strong>: queries and document excerpts
                → OpenAI embeddings API (text-embedding-3-small) to generate
                vector representations stored in our Supabase database.
              </li>
              <li>
                <strong>Call log summaries</strong>: free-text call notes →
                Anthropic Claude API (structured JSON extraction).
              </li>
            </ul>
            <p className="mt-3 text-sm">
              You can disable AI features at any time in Settings. Voice
              recording permission is requested only when you tap the microphone
              button.
            </p>
          </Section>

          <Section title="5. How long we keep it">
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                Account and app data: for as long as your account is active, or
                until you request deletion.
              </li>
              <li>
                After account deletion: data is deleted within 30 days from all
                databases and storage buckets (see Section 10 for how to delete
                your account).
              </li>
              <li>
                Voice audio: deleted immediately after transcription (not
                stored).
              </li>
              <li>Security/rate-limit logs: up to 30 days.</li>
              <li>
                Anonymised analytics: indefinitely, in a form that cannot
                identify you.
              </li>
              <li>
                Waitlist entries: until you ask us to delete them, or for a
                maximum of 24 months from your last interaction.
              </li>
            </ul>
          </Section>

          <Section title="6. Who we share it with (processors)">
            <p>We use the following carefully selected service providers:</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 font-semibold">Processor</th>
                    <th className="text-left py-2 pr-4 font-semibold">Country</th>
                    <th className="text-left py-2 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 pr-4">Vercel Inc.</td>
                    <td className="py-2 pr-4">USA (EU edge)</td>
                    <td className="py-2">Hosting, BFF AI proxy</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Supabase</td>
                    <td className="py-2 pr-4">EU (Frankfurt)</td>
                    <td className="py-2">Database, document storage</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Anthropic PBC</td>
                    <td className="py-2 pr-4">USA</td>
                    <td className="py-2">AI assistant (Claude)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">OpenAI</td>
                    <td className="py-2 pr-4">USA</td>
                    <td className="py-2">Voice transcription, embeddings</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Expo / Expo Push</td>
                    <td className="py-2 pr-4">USA</td>
                    <td className="py-2">Push notification delivery</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Sentry</td>
                    <td className="py-2 pr-4">EU</td>
                    <td className="py-2">Crash reporting</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">PostHog</td>
                    <td className="py-2 pr-4">EU</td>
                    <td className="py-2">Product analytics (anonymised)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Resend</td>
                    <td className="py-2 pr-4">USA/EU</td>
                    <td className="py-2">Transactional e-mail</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Each processor is bound by a Data Processing Agreement (where
              required) and by Standard Contractual Clauses for international
              transfers. We do not sell or rent personal data to third parties
              and we do not disclose it to public authorities unless legally
              compelled to do so.
            </p>
          </Section>

          <Section title="7. International transfers">
            <p>
              Your data may be processed in the EU, the United States and other
              countries where our processors operate. When data leaves the EEA /
              UK we rely on: (a) adequacy decisions of the European Commission
              where available, or (b) Standard Contractual Clauses (2021)
              combined with encryption in transit and at rest, access controls,
              and audit logs.
            </p>
            <p className="mt-3">
              For transfers out of Brazil we rely on LGPD arts. 33–36; out of
              Mexico — arts. 36–37 LFPDPPP; out of Argentina — Disposition
              60-E/2016 of the AAIP; out of the UAE — PDPL Chapter 6
              conditions on cross-border transfers.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>Subject to applicable law, you have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                <strong>Access</strong> the personal data we hold about you.
              </li>
              <li>
                <strong>Rectify</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erase</strong> your data (&ldquo;right to be
                forgotten&rdquo;).
              </li>
              <li>
                <strong>Restrict</strong> or <strong>object</strong> to
                processing based on legitimate interest.
              </li>
              <li>
                <strong>Portability</strong> — receive your data in a
                structured, machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time.
              </li>
              <li>
                <strong>Lodge a complaint</strong> with your supervisory
                authority (see Section 9).
              </li>
              <li>
                Under LGPD: right to information about entities we shared your
                data with and to review automated decisions.
              </li>
              <li>
                Under LFPDPPP: <em>ARCO rights</em> (Access, Rectification,
                Cancellation, Opposition) and revocation of consent.
              </li>
              <li>
                Under Ley 25.326: right to update, rectify and suppress data.
              </li>
              <li>
                Under UAE PDPL: rights of access, correction, deletion and
                objection.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any right, e-mail{" "}
              <a
                className="text-accent hover:underline"
                href="mailto:hello@lumi.estate"
              >
                hello@lumi.estate
              </a>
              . We will respond within 30 calendar days (15 business days under
              LGPD for access/confirmation requests).
            </p>
          </Section>

          <Section title="9. Supervisory authorities">
            <p>
              If you believe we are processing your data unlawfully, you may
              contact:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                EU / EEA: the data protection authority of your country (list:{" "}
                <a
                  className="text-accent hover:underline"
                  href="https://edpb.europa.eu/about-edpb/board/members_en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  edpb.europa.eu
                </a>
                ).
              </li>
              <li>
                United Kingdom: Information Commissioner&rsquo;s Office
                (ico.org.uk).
              </li>
              <li>Brazil: ANPD (Autoridade Nacional de Proteção de Dados).</li>
              <li>Mexico: INAI.</li>
              <li>Argentina: AAIP.</li>
              <li>UAE: UAE Data Office (uaedataoffice.ae).</li>
              <li>Colombia: Superintendencia de Industria y Comercio (SIC).</li>
            </ul>
          </Section>

          <Section title="10. Account deletion">
            <p>
              You can delete your Lumi account at any time:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                <strong>In the App</strong>: Settings → Account → Delete
                account.
              </li>
              <li>
                <strong>On the web</strong>:{" "}
                <a
                  className="text-accent hover:underline"
                  href="/account/delete"
                >
                  lumi.estate/account/delete
                </a>
                .
              </li>
              <li>
                <strong>By e-mail</strong>: request to{" "}
                <a
                  className="text-accent hover:underline"
                  href="mailto:hello@lumi.estate"
                >
                  hello@lumi.estate
                </a>
                .
              </li>
            </ul>
            <p className="mt-3">
              On deletion: your account, calendar events, CRM entries, todos,
              documents and chat history are permanently removed within 30 days.
              Anonymised analytics events are retained (they cannot be linked
              back to you).
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              The Service is directed at professional real-estate agents and is
              not intended for use by children. We do not knowingly collect
              personal data from children under 16 (EU), under 13 (UK/US), or
              under 18 where the local definition of a child is broader. If you
              believe a child has submitted data, contact us and we will delete
              it promptly.
            </p>
          </Section>

          <Section title="12. Security">
            <p>
              We apply reasonable technical and organisational measures:
              encryption in transit (TLS 1.2+) and at rest, principle of least
              privilege, regular dependency patching, and incident logging. No
              system is perfectly secure. If we become aware of a personal data
              breach likely to result in risk to your rights, we will notify the
              competent supervisory authority within 72 hours and, if the risk is
              high, notify you directly.
            </p>
          </Section>

          <Section title="13. Changes to this Policy">
            <p>
              If we change this Policy in a way that materially affects you, we
              will notify you via in-app notification and e-mail at least 15 days
              before the change takes effect, and update the &ldquo;last
              updated&rdquo; date at the top of this page.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Nikita Titov &mdash;{" "}
              <a
                className="text-accent hover:underline"
                href="mailto:hello@lumi.estate"
              >
                hello@lumi.estate
              </a>
              .
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-3">{title}</h2>
      <div className="text-base">{children}</div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm">
      {children}
    </div>
  );
}
