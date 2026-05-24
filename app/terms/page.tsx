import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Lumi website and waitlist.",
  alternates: { canonical: "https://lumi.estate/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Terms", url: "/terms" }]} />
      <PageHeader
        eyebrow="Legal"
        title="Terms of use."
        subtitle="Last updated: 17 April 2026"
      />
      <section className="pb-32">
        <div className="container-lumi max-w-3xl space-y-8 text-text-dim leading-relaxed">
          <p>
            These Terms of Use (the &ldquo;Terms&rdquo;) govern your access to
            and use of the Lumi marketing website located at{" "}
            <a className="text-accent hover:underline" href="https://lumi.estate">lumi.estate</a> and of the associated waitlist (together, the
            &ldquo;Site&rdquo;). By using the Site or submitting the waitlist
            form, you agree to these Terms. If you do not agree, please do not
            use the Site.
          </p>

          <Callout>
            <strong>Template.</strong> These Terms have been drafted to be fair
            and simple. They are not a substitute for advice from a qualified
            lawyer in your jurisdiction.
          </Callout>

          <Section title="1. The provider">
            <p>
              The Site is operated by <strong>Nikita Titov</strong>, acting as
              a private individual and sole operator of the Lumi service
              (the &ldquo;Provider&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
              Contact: <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a>.
            </p>
          </Section>

          <Section title="2. What the Site is">
            <p>
              A marketing website and waitlist for <strong>Lumi</strong>, an
              AI calendar and CRM mobile application for real-estate agents.
              The mobile application itself is currently in development and
              not available. Nothing on the Site constitutes a binding offer
              to supply a product or service, a financial instrument, or
              professional (legal, tax, real-estate) advice.
            </p>
          </Section>

          <Section title="3. The waitlist">
            <ul className="list-disc pl-6 space-y-1">
              <li>Joining the waitlist does not guarantee access to the closed beta or to the final product.</li>
              <li>We will do our best to invite subscribers in chronological order but may invite users out of order to balance feedback across market segments, countries and roles.</li>
              <li>You can leave the waitlist at any time by sending an e-mail to <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a> with the subject &ldquo;unsubscribe&rdquo;.</li>
              <li>We may close or pause the waitlist at any time. If we do, we will notify subscribers in advance.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable use">
            <p>When using the Site you agree not to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>submit data you do not own or have no right to submit (including someone else&rsquo;s e-mail address);</li>
              <li>abuse the waitlist endpoint (high-rate automated submissions, credential stuffing, fuzzing);</li>
              <li>scrape, mirror or frame the Site or attempt to reverse-engineer it;</li>
              <li>upload malware, attempt SQL-injection, XSS, or otherwise try to compromise the Site;</li>
              <li>use the Site for anything illegal under your local law or the law of the jurisdictions we operate in (Finland / EU).</li>
            </ul>
            <p className="mt-3">
              We may rate-limit, restrict or terminate access for any user who
              appears to violate these rules.
            </p>
          </Section>

          <Section title="5. Intellectual property">
            <p>
              The &ldquo;Lumi&rdquo; name, logo, design system, copy and
              illustrations on the Site are protected by copyright and
              trademark law and remain the property of the Provider. You are
              granted a personal, non-exclusive, non-transferable licence to
              view the Site in your browser. Any other use (reproduction,
              publication, commercial use) requires our written permission.
            </p>
            <p className="mt-3">
              If you send us feedback, ideas or suggestions (&ldquo;Feedback&rdquo;),
              you grant the Provider a non-exclusive, worldwide, royalty-free
              licence to use that Feedback without obligation to you.
            </p>
          </Section>

          <Section title="6. Disclaimers">
            <p>
              The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;,
              without warranties of any kind, whether express or implied,
              including warranties of merchantability, fitness for a
              particular purpose, accuracy or non-infringement. We do not
              warrant that the Site will be uninterrupted, secure or error-free.
            </p>
            <p className="mt-3">
              Some jurisdictions do not allow the exclusion of certain
              warranties (e.g. Brazil&rsquo;s CDC, Mexico&rsquo;s LFPC,
              consumer-protection laws in the EU). Where such rules apply,
              the statutory warranties remain in force and the disclaimers
              above are limited accordingly.
            </p>
          </Section>

          <Section title="7. Limitation of liability">
            <p>
              To the maximum extent permitted by applicable law, the
              Provider&rsquo;s aggregate liability arising from or related to
              your use of the Site is limited to EUR&nbsp;50 or the amount you
              paid us in the 12&nbsp;months preceding the event (whichever is
              greater). The Site is currently free of charge, so in practice
              this cap is EUR&nbsp;50.
            </p>
            <p className="mt-3">
              The Provider is not liable for indirect, incidental, special,
              consequential or punitive damages, nor for any loss of profits,
              revenues, data, business opportunity or goodwill, except where
              such limitation is prohibited by law (e.g. gross negligence,
              wilful misconduct, death or personal injury, consumer rights
              that cannot be waived).
            </p>
          </Section>

          <Section title="8. Indemnity">
            <p>
              You agree to indemnify and hold the Provider harmless from any
              claim, loss or expense arising out of your breach of these
              Terms or your unlawful use of the Site.
            </p>
          </Section>

          <Section title="9. Privacy and cookies">
            <p>
              Your personal data is processed as described in our{" "}
              <a className="text-accent hover:underline" href="/privacy">Privacy Policy</a> and our{" "}
              <a className="text-accent hover:underline" href="/cookies">Cookie Policy</a>, which are incorporated into these Terms by reference.
            </p>
          </Section>

          <Section title="10. Changes to the Site and these Terms">
            <p>
              We may modify the Site or these Terms from time to time. The
              updated version will be posted on this page with a new
              &ldquo;Last updated&rdquo; date. Material changes will be
              announced to waitlist subscribers by e-mail at least 15 days
              before taking effect. Continued use of the Site after the
              effective date constitutes acceptance of the new Terms.
            </p>
          </Section>

          <Section title="11. Governing law &amp; dispute resolution">
            <p>
              These Terms are governed by the laws of <strong>Finland</strong>,
              excluding its conflict-of-laws rules and the UN Convention on
              Contracts for the International Sale of Goods. Any dispute
              arising out of or in connection with these Terms shall be
              submitted to the ordinary courts of Helsinki, Finland, without
              prejudice to any mandatory consumer-protection rules of your
              country of habitual residence.
            </p>
            <p className="mt-3">
              If you are a consumer resident in the European Union, you also
              have the right to use the EU online dispute resolution
              platform at{" "}
              <a className="text-accent hover:underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
            </p>
            <p className="mt-3">
              If you are a consumer resident in Brazil, Mexico, Argentina,
              Chile or Colombia, the mandatory consumer-protection rules of
              your country apply in addition to these Terms, and you may
              bring proceedings before the competent courts of your place of
              residence.
            </p>
          </Section>

          <Section title="12. Miscellaneous">
            <ul className="list-disc pl-6 space-y-1">
              <li>If any provision of these Terms is found unenforceable, the remaining provisions remain in force.</li>
              <li>Failure to enforce a provision does not waive the right to enforce it later.</li>
              <li>You may not assign these Terms without our written consent. We may assign them in connection with a restructuring or incorporation of the Lumi service, with notice to you.</li>
            </ul>
          </Section>

          <Section title="13. Contact">
            <p>
              Nikita Titov &mdash; <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a>.
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
