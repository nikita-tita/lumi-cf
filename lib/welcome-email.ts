/**
 * Renders the waitlist welcome email as email-safe HTML + a plain-text
 * fallback. All layout uses tables + inline styles; no external CSS or fonts.
 * Max width 600px, mobile-friendly. Matches the landing theme.
 *
 * No queue position or referral link anymore — the waitlist has no datastore,
 * so there is no position to show and no per-user referral code to hand out.
 */

type Params = {
  name: string | null;
  email: string;
};

const BRAND = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  surface2: "#F4F4F5",
  text: "#09090B",
  textDim: "#52525B",
  textMute: "#A1A1AA",
  border: "#E4E4E7",
  indigo: "#2563EB",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderWelcomeSubject(_p: Params): string {
  return "You're in. Welcome to Lumi";
}

export function renderWelcomeText(p: Params): string {
  const greeting = p.name ? `Hi ${p.name},` : `Hi there,`;

  return [
    greeting,
    "",
    "You're on the Lumi waitlist.",
    "",
    "We'll email you twice: once when your beta invite is ready, once when we launch publicly. That's it. No spam.",
    "",
    "Here's what you signed up for:",
    "",
    "• Chat that acts — speak or type and Lumi schedules showings, updates your pipeline, drafts follow-ups.",
    "• A pipeline that moves itself — after each conversation the right card moves to the right stage.",
    "• Documents that answer — upload listings, contracts, HOA docs, then ask anything. Cited answers.",
    "",
    "Built for real estate agents in EU, LatAm, and MENA.",
    "",
    "— Nikita",
    "Founder, Lumi",
    "https://lumi.estate",
    "",
    "---",
    `You're receiving this because ${p.email} joined the Lumi waitlist at https://lumi.estate.`,
    "Reply to this email to unsubscribe or say hello.",
  ].join("\n");
}

export function renderWelcomeHtml(p: Params): string {
  const greeting = p.name ? `Hi ${escapeHtml(p.name)},` : "Hi there,";

  const preheader =
    "Thanks for joining Lumi. Here's what happens next.";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Lumi</title>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "EmailMessage",
        "description": "Welcome to the Lumi waitlist",
        "potentialAction": {
          "@type": "ViewAction",
          "target": "https://lumi.estate",
          "name": "Open Lumi"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lumi",
          "url": "https://lumi.estate",
          "logo": "https://lumi.estate/bimi-logo.svg"
        }
      }
    </script>
    <style>
      @media (max-width: 620px) {
        .container { width: 100% !important; padding: 0 20px !important; }
        .h1 { font-size: 28px !important; line-height: 1.15 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};color:${BRAND.text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <!-- preheader (hidden, shows as preview in inbox) -->
    <div style="display:none;overflow:hidden;line-height:1px;max-height:0;max-width:0;opacity:0;">${escapeHtml(preheader)}</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND.bg};">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width:600px;width:100%;">

            <!-- logo -->
            <tr>
              <td style="padding:0 8px 24px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right:8px;vertical-align:middle;">
                      <div style="width:28px;height:28px;border-radius:8px;background:${BRAND.indigo};display:inline-block;line-height:28px;text-align:center;font-size:13px;font-weight:800;color:#fff;">L</div>
                    </td>
                    <td style="vertical-align:middle;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${BRAND.text};">Lumi<span style="color:${BRAND.indigo};">.</span></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- hero card -->
            <tr>
              <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:20px;padding:48px 40px 40px 40px;">
                <p style="margin:0 0 14px 0;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.indigo};">Welcome to Lumi</p>
                <h1 class="h1" style="margin:0 0 16px 0;font-size:34px;line-height:1.1;letter-spacing:-0.02em;color:${BRAND.text};font-weight:700;">${greeting}</h1>
                <p style="margin:0 0 12px 0;font-size:16px;line-height:1.55;color:${BRAND.text};font-weight:600;">You're on the list.</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.textDim};">
                  We'll email you twice — once when your <strong style="color:${BRAND.text};">beta invite</strong> is ready, once when we <strong style="color:${BRAND.text};">launch publicly</strong>. That's it. No spam, no filler, no "nurture sequence".
                </p>
              </td>
            </tr>

            <!-- divider spacer -->
            <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>

            <!-- what you signed up for -->
            <tr>
              <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:20px;padding:36px 40px;">
                <h2 style="margin:0 0 20px 0;font-size:20px;line-height:1.25;color:${BRAND.text};font-weight:700;letter-spacing:-0.01em;">Here's what you signed up for.</h2>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding:14px 0;border-bottom:1px solid ${BRAND.border};">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="width:40px;padding-right:14px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:${BRAND.surface2};text-align:center;line-height:36px;font-size:18px;">💬</div>
                          </td>
                          <td valign="top">
                            <p style="margin:2px 0 4px 0;font-size:15px;font-weight:700;color:${BRAND.text};">Chat that acts</p>
                            <p style="margin:0;font-size:14px;line-height:1.55;color:${BRAND.textDim};">Speak or type — Lumi schedules showings, updates your pipeline, drafts follow-ups. Forms are the fallback, not the default.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:14px 0;border-bottom:1px solid ${BRAND.border};">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="width:40px;padding-right:14px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:${BRAND.surface2};text-align:center;line-height:36px;font-size:18px;">📁</div>
                          </td>
                          <td valign="top">
                            <p style="margin:2px 0 4px 0;font-size:15px;font-weight:700;color:${BRAND.text};">A pipeline that moves itself</p>
                            <p style="margin:0;font-size:14px;line-height:1.55;color:${BRAND.textDim};">New → Contacted → Showing → Offer → Closed. After each conversation the right card moves to the right stage — from what you said, not a form you filled.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:14px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="width:40px;padding-right:14px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:${BRAND.surface2};text-align:center;line-height:36px;font-size:18px;">🔎</div>
                          </td>
                          <td valign="top">
                            <p style="margin:2px 0 4px 0;font-size:15px;font-weight:700;color:${BRAND.text};">Documents that answer</p>
                            <p style="margin:0;font-size:14px;line-height:1.55;color:${BRAND.textDim};">Upload listings, contracts, HOA docs. Ask in chat — Lumi pulls the answer with a source citation.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

            <!-- sign-off -->
            <tr>
              <td style="padding:0 8px;">
                <p style="margin:0 0 6px 0;font-size:15px;line-height:1.5;color:${BRAND.textDim};">One app for the showings, the pipeline and the paperwork.</p>
                <p style="margin:0 0 2px 0;font-size:16px;font-weight:700;color:${BRAND.text};">— Nikita</p>
                <p style="margin:0;font-size:13px;color:${BRAND.textMute};">Founder, Lumi</p>
              </td>
            </tr>

            <tr><td style="height:36px;line-height:36px;font-size:0;">&nbsp;</td></tr>

            <!-- legal footer -->
            <tr>
              <td style="padding:20px 8px;border-top:1px solid ${BRAND.border};">
                <p style="margin:0 0 8px 0;font-size:12px;line-height:1.6;color:${BRAND.textMute};">
                  You're receiving this because <span style="color:${BRAND.textDim};">${escapeHtml(p.email)}</span> joined the Lumi waitlist at <a href="https://lumi.estate" style="color:${BRAND.indigo};text-decoration:none;">lumi.estate</a>.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.textMute};">
                  Reply to this email to say hello or ask to be removed. &nbsp;·&nbsp; © 2026 Lumi, operated by Nikita Titov.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
