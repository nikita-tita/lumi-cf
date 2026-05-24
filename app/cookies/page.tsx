import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Lumi uses cookies and similar technologies. Complies with EU ePrivacy Directive, GDPR, UK PECR, Brazil LGPD and Mexico LFPDPPP.",
  alternates: { canonical: "https://lumi.estate/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Cookies", url: "/cookies" }]} />
      <PageHeader
        eyebrow="Legal"
        title="Cookie policy."
        subtitle="Last updated: 17 April 2026"
      />
      <section className="pb-32">
        <div className="container-lumi max-w-3xl space-y-8 text-text-dim leading-relaxed">
          <p>
            This Cookie Policy explains how the Lumi website (<a className="text-accent hover:underline" href="https://lumi.estate">lumi.estate</a>) uses cookies and similar
            technologies (local storage, pixels, server logs) on your device.
            It should be read together with our{" "}
            <a className="text-accent hover:underline" href="/privacy">Privacy Policy</a>.
          </p>

          <Section title="1. What are cookies?">
            <p>
              Cookies are small text files stored by your browser when you
              visit a website. Some cookies are strictly necessary for the
              site to work; others help us understand usage or remember your
              preferences. Similar technologies include <em>localStorage</em>,
              <em> sessionStorage</em>, single-pixel images and server-side
              logs &mdash; they work the same way from a legal standpoint.
            </p>
          </Section>

          <Section title="2. Who we are (controller)">
            <p>
              The controller responsible for cookies on this site is{" "}
              <strong>Nikita Titov</strong>, acting in an individual capacity
              as the sole operator of the Lumi service. Contact:{" "}
              <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a>.
            </p>
          </Section>

          <Section title="3. What we use on this website">
            <p>
              We keep cookie usage to the minimum. The current website does
              not set marketing, advertising or third-party tracking cookies.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-3 font-semibold text-text">Category</th>
                    <th className="py-2 pr-3 font-semibold text-text">What it does</th>
                    <th className="py-2 pr-3 font-semibold text-text">Duration</th>
                    <th className="py-2 font-semibold text-text">Consent</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  <tr className="border-b border-border/60">
                    <td className="py-2 pr-3"><strong>Strictly necessary</strong></td>
                    <td className="py-2 pr-3">
                      Keep the waitlist form secure (CSRF, rate-limit). Remember
                      your cookie-banner choice.
                    </td>
                    <td className="py-2 pr-3">Session &ndash; 12 months</td>
                    <td className="py-2">Not required (exempt under ePrivacy Directive art.&nbsp;5(3))</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-2 pr-3"><strong>Analytics</strong> (planned)</td>
                    <td className="py-2 pr-3">
                      Count unique page views in aggregate. We intend to use a
                      cookie-less, privacy-first analytics provider (e.g.
                      Plausible, EU-hosted) that does not identify individuals.
                    </td>
                    <td className="py-2 pr-3">Not set &mdash; none today</td>
                    <td className="py-2">Will be activated only if required by law; banner shown in advance</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3"><strong>Marketing / ads</strong></td>
                    <td className="py-2 pr-3">We do not use these cookies.</td>
                    <td className="py-2 pr-3">&mdash;</td>
                    <td className="py-2">&mdash;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Legal basis by jurisdiction">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>European Economic Area / UK:</strong> ePrivacy Directive
                2002/58/EC (as amended) and GDPR. Strictly-necessary cookies
                are exempt from consent; all others require your prior,
                informed, freely-given and specific <em>opt-in</em> consent.
                You can withdraw consent at any time with the same ease.
              </li>
              <li>
                <strong>Brazil:</strong> LGPD (Law No. 13.709/2018) &mdash; we
                rely on your consent (art.&nbsp;7-I) for non-essential cookies
                and on legitimate interest (art.&nbsp;7-IX) for strictly
                necessary ones; Resolutions CD/ANPD No.&nbsp;2/2022 apply.
              </li>
              <li>
                <strong>Mexico:</strong> LFPDPPP and its Regulations &mdash;
                we provide this notice as part of the <em>aviso de privacidad
                simplificado</em> and rely on the legitimate interest
                principle for essential cookies.
              </li>
              <li>
                <strong>Argentina:</strong> Ley 25.326 and Resolution
                AAIP&nbsp;4/2019 &mdash; your prior, free and informed consent
                is required for non-essential cookies.
              </li>
              <li>
                <strong>Chile:</strong> Law 19.628 (and the forthcoming
                Personal Data Protection Law) &mdash; consent required for
                non-essential processing.
              </li>
              <li>
                <strong>Colombia:</strong> Law 1581/2012 &amp; Decree
                1377/2013 &mdash; prior, express and informed consent.
              </li>
            </ul>
          </Section>

          <Section title="5. How to control cookies">
            <ul className="list-disc pl-6 space-y-1">
              <li>You can accept or reject non-essential cookies using the banner displayed on your first visit (where shown).</li>
              <li>You can clear cookies in your browser settings (Chrome, Safari, Firefox, Edge &mdash; Settings → Privacy).</li>
              <li>You can use browser &ldquo;Do Not Track&rdquo; or Global Privacy Control (GPC) signals; we honour GPC as an opt-out of any non-essential analytics.</li>
              <li>You can revoke consent at any time by writing to <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a>.</li>
            </ul>
            <p className="mt-3">
              Blocking strictly-necessary cookies may prevent parts of the
              site from working (for instance, submitting the waitlist form).
            </p>
          </Section>

          <Section title="6. Third-party processors we rely on">
            <p>
              Hosting and delivery of the site are provided by <strong>Vercel Inc.</strong>
              (USA, EU edge). Vercel may set short-lived security cookies
              (e.g. <code>__vercel*</code>) as part of its anti-abuse
              infrastructure; these qualify as strictly necessary. No
              third-party advertising or social-media cookies are used on
              this site.
            </p>
          </Section>

          <Section title="7. Changes to this policy">
            <p>
              If the set of cookies used on this site changes, we will update
              this page and, where required, ask for fresh consent. Material
              changes will be communicated to waitlist subscribers by e-mail
              at least 15 days in advance.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              Questions or requests regarding cookies can be sent to{" "}
              <a className="text-accent hover:underline" href="mailto:hello@lumi.estate">hello@lumi.estate</a>.
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
