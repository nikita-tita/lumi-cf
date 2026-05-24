/**
 * Renders the waitlist welcome email as email-safe HTML + a plain-text
 * fallback. All layout uses tables + inline styles; no external CSS or fonts.
 * Max width 600px, mobile-friendly. Matches the landing aurora theme.
 */

type Params = {
  name: string | null;
  email: string;
  position: number;
  refCode: string;
  duplicate?: boolean;
};

const BRAND = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surface2: "#F1F5F9",
  text: "#0F172A",
  textDim: "#475569",
  textMute: "#94A3B8",
  border: "#E2E8F0",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  pink: "#EC4899",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderWelcomeSubject(p: Params): string {
  if (p.duplicate) return `You're still on the Lumi list · #${p.position}`;
  return `You're in. Welcome to Lumi · #${p.position}`;
}

export function renderWelcomeText(p: Params): string {
  const greeting = p.name ? `Hi ${p.name},` : `Hi there,`;
  const shareUrl = `https://lumi.estate/?ref=${p.refCode}`;
  const copyUrl = `https://lumi.estate/share?ref=${p.refCode}&action=copy`;
  const dup = p.duplicate
    ? `You were already on the list — nothing new to do. Your position: #${p.position}.`
    : `You're #${p.position} on the waitlist.`;

  return [
    greeting,
    "",
    dup,
    "",
    "We'll email you twice: once when private beta opens (June 2026), once when we launch publicly (Q3 2026). That's it. No spam.",
    "",
    "Here's what you signed up for:",
    "",
    "• Chat that acts — speak or type and Lumi schedules showings, updates your pipeline, drafts follow-ups.",
    "• A pipeline that moves itself — after each conversation the right card moves to the right stage.",
    "• Documents that answer — upload listings, contracts, HOA docs, then ask anything. Cited answers.",
    "",
    "Want to move up? Tap to copy your link:",
    `${copyUrl}`,
    "",
    "Or paste this into a message yourself:",
    shareUrl,
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
  const greeting = p.name
    ? `Hi ${escapeHtml(p.name)},`
    : "Hi there,";
  const shareUrl = `https://lumi.estate/?ref=${p.refCode}`;
  const copyUrl = `https://lumi.estate/share?ref=${p.refCode}&action=copy`;
  const positionText = p.duplicate
    ? "You were already on the list —"
    : "You're on the list —";

  const preheader = p.duplicate
    ? `You were already on the Lumi waitlist. Position #${p.position}.`
    : `Thanks for joining Lumi. You're #${p.position}. Here's what happens next.`;

  const auroraGradient = `linear-gradient(135deg, ${BRAND.indigo} 0%, ${BRAND.violet} 50%, ${BRAND.pink} 100%)`;

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
      /* Email clients strip most selectors — we only use inline styles below.
         This block is for clients that DO support media queries (iOS Mail,
         Apple Mail, Gmail App on some devices). */
      @media (max-width: 620px) {
        .container { width: 100% !important; padding: 0 20px !important; }
        .h1 { font-size: 28px !important; line-height: 1.15 !important; }
        .position-num { font-size: 60px !important; }
        .pill-share { display: block !important; }
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
                      <div style="width:28px;height:28px;border-radius:8px;background:${auroraGradient};display:inline-block;line-height:28px;text-align:center;font-size:13px;font-weight:800;color:#fff;">L</div>
                    </td>
                    <td style="vertical-align:middle;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${BRAND.text};">Lumi<span style="color:${BRAND.indigo};">.</span></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- aurora hero card -->
            <tr>
              <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:20px;padding:48px 40px 36px 40px;">
                <p style="margin:0 0 14px 0;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.indigo};">Welcome to Lumi</p>
                <h1 class="h1" style="margin:0 0 12px 0;font-size:34px;line-height:1.1;letter-spacing:-0.02em;color:${BRAND.text};font-weight:700;">${greeting}</h1>
                <p style="margin:0 0 28px 0;font-size:16px;line-height:1.55;color:${BRAND.textDim};">${positionText}</p>

                <!-- position number — solid violet for guaranteed legibility
                     across all email clients (background-clip:text fails in
                     Gmail and renders the gradient as a rectangle behind
                     transparent text — looks invisible). -->
                <div style="font-size:84px;line-height:1;font-weight:800;letter-spacing:-0.04em;color:${BRAND.violet};" class="position-num">#${p.position}</div>

                <p style="margin:24px 0 0 0;font-size:15px;line-height:1.6;color:${BRAND.textDim};">
                  We'll email you twice — once when private beta opens in <strong style="color:${BRAND.text};">June 2026</strong>, once when we launch publicly in <strong style="color:${BRAND.text};">Q3 2026</strong>. That's it. No spam, no filler, no "nurture sequence".
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

            <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>

            <!-- referral -->
            <tr>
              <td style="background:${auroraGradient};border-radius:20px;padding:36px 40px;color:#ffffff;">
                <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.9);">Move up</p>
                <h2 style="margin:0 0 14px 0;font-size:24px;line-height:1.2;color:#ffffff;font-weight:700;letter-spacing:-0.015em;">Share your link, climb the list.</h2>
                <p style="margin:0 0 22px 0;font-size:14px;line-height:1.55;color:rgba(255,255,255,0.85);">Every agent who joins from your link moves you up. No gimmicks.</p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-radius:12px;background:#ffffff;">
                            <a href="${copyUrl}" style="display:inline-block;padding:14px 22px;font-size:15px;font-weight:700;color:${BRAND.indigo};text-decoration:none;letter-spacing:-0.01em;">
                              📋 &nbsp;Copy my link
                            </a>
                          </td>
                          <td style="width:8px;line-height:8px;font-size:0;">&nbsp;</td>
                          <td style="border-radius:12px;border:1px solid rgba(255,255,255,0.45);">
                            <a href="${shareUrl}" style="display:inline-block;padding:13px 18px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                              Open link &nbsp;→
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0 0;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,0.75);font-family:ui-monospace,Menlo,Consolas,monospace;word-break:break-all;">${shareUrl.replace("https://", "")}</p>
              </td>
            </tr>

            <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

            <!-- sign-off -->
            <tr>
              <td style="padding:0 8px;">
                <p style="margin:0 0 6px 0;font-size:15px;line-height:1.5;color:${BRAND.textDim};">From Helsinki, for agents everywhere.</p>
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
