function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(input: string) {
  return escapeHtml(input).replaceAll("\n", "<br/>");
}

export function buildNewsletterHtml(params: {
  subject: string;
  preheader?: string;
  greeting?: string;
  intro?: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  outro?: string;
  appName: string;
  appUrl: string;
  subscriberEmail: string;
  year: number;
}) {
  const {
    subject,
    preheader,
    greeting = "Hi there,",
    intro,
    body,
    ctaLabel,
    ctaUrl,
    outro,
    appName,
    appUrl,
    subscriberEmail,
    year,
  } = params;

  const appDomain = appUrl
    ? appUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(subject)}</title>
  ${preheader ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>` : ""}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .fluid { width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .stack-column td { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
      .padding-x { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-title { font-size: 28px !important; line-height: 1.2 !important; }
      .button a { display: block !important; width: auto !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="background-color: #f8fafc; margin: 0; padding: 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" class="container" style="width: 640px; max-width: 640px;">
            <tr>
              <td style="padding: 0 24px 16px 24px;" class="padding-x mobile-center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="mobile-center" style="padding: 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" class="mobile-center" style="float: none; margin: 0 auto;">
                        <tr>
                          <td style="padding: 0; text-align: left;">
                            <div style="display: inline-flex; align-items: center; gap: 10px;">
                              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #059669, #10b981); display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px -8px rgba(5,150,105,0.5);">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                              </div>
                              <div style="display: inline-block;">
                                <div style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">${escapeHtml(appName)}</div>
                                <div style="font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;">Official Newsletter</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="mobile-center mobile-hide" style="padding: 0; text-align: right;">
                      <div style="font-size: 12px; color: #94a3b8; font-weight: 500;">
                        ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;" class="padding-x">
                <div style="height: 1px; background-color: #e2e8f0; border-radius: 999px;"></div>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 24px 0 24px;" class="padding-x">
                <div style="overflow: hidden; border-radius: 24px 24px 0 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%); padding: 44px 40px; position: relative;">
                  <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%);"></div>
                  <div style="position: absolute; bottom: -30px; left: -30px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);"></div>
                  <div style="position: relative;">
                    <div style="display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6ee7b7;">Monthly Update</span>
                    </div>
                    <h1 style="margin: 18px 0 0 0; font-size: 36px; font-weight: 800; color: #ffffff; line-height: 1.15; letter-spacing: -0.02em;" class="hero-title">
                      ${escapeHtml(subject)}
                    </h1>
                    ${preheader ? `<p style="margin: 12px 0 0 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; max-width: 480px;">${escapeHtml(preheader)}</p>` : ""}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;" class="padding-x">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                  <tr>
                    <td style="padding: 40px 40px 32px 40px;" class="padding-x">
                      <p style="margin: 0 0 18px 0; font-size: 16px; font-weight: 600; color: #0f172a;">${escapeHtml(greeting)}</p>
                      ${intro ? `<p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.75; color: #475569;">${nl2br(intro)}</p>` : ""}

                      <div style="padding: 28px 28px; border-radius: 18px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%); border: 1px solid #dcfce7;">
                        <div style="font-size: 15px; line-height: 1.8; color: #1e293b;">
                          ${nl2br(body)}
                        </div>
                      </div>

                      ${ctaLabel && ctaUrl ? `
                      <div style="margin-top: 32px; text-align: center;" class="button">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 14px 28px -10px rgba(5,150,105,0.55);">
                              <a href="${escapeHtml(ctaUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 16px 36px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.01em;">
                                ${escapeHtml(ctaLabel)}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                      ` : ""}

                      ${outro ? `<p style="margin: 32px 0 0 0; font-size: 15px; line-height: 1.75; color: #475569;">${nl2br(outro)}</p>` : ""}

                      <div style="margin-top: 40px; padding-top: 28px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Warm regards,</p>
                        <p style="margin: 0; font-size: 15px; color: #334155;">
                          The <strong style="color: #059669;">${escapeHtml(appName)}</strong> Team
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;" class="padding-x">
                <div style="overflow: hidden; border-radius: 0 0 24px 24px; background-color: #f1f5f9; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 28px 40px;" class="padding-x">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td class="stack-column mobile-center" style="padding: 0; vertical-align: top;">
                              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Quick Links</div>
                              <div style="margin-top: 10px; font-size: 13px; line-height: 1.7;">
                                ${appUrl ? `<a href="${escapeHtml(appUrl)}" style="color: #059669; text-decoration: none; font-weight: 600;">Visit Dashboard</a>  ·  ` : ""}
                                <a href="${escapeHtml(appUrl ? appUrl + "/investment-plans" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">Plans</a>  ·  <a href="${escapeHtml(appUrl ? appUrl + "/faqs" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">FAQs</a>  ·  <a href="${escapeHtml(appUrl ? appUrl + "/contact" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">Contact</a>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 24px 0 24px;" class="padding-x mobile-center">
                <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #94a3b8;">
                  This email was sent to <a href="mailto:${escapeHtml(subscriberEmail)}" style="color: #64748b; text-decoration: underline; font-weight: 500;">${escapeHtml(subscriberEmail)}</a>.
                  ${appUrl ? ` © ${year} <a href="${escapeHtml(appUrl)}" style="color: #64748b; text-decoration: none; font-weight: 500;">${escapeHtml(appDomain || appName)}</a>.` : ` © ${year} ${escapeHtml(appName)}.`}
                  All rights reserved.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 1.6; color: #cbd5e1;">
                  ${escapeHtml(appName)} · ${appDomain || "New York, NY"}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export function buildNewsletterText(params: {
  subject: string;
  greeting?: string;
  intro?: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  outro?: string;
  appName: string;
  subscriberEmail: string;
  year: number;
}) {
  const {
    subject,
    greeting = "Hi there,",
    intro,
    body,
    ctaLabel,
    ctaUrl,
    outro,
    appName,
    subscriberEmail,
    year,
  } = params;

  return `
${subject}
${"=".repeat(subject.length)}
${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${greeting}

${intro ? intro + "\n\n" : ""}${body}

${ctaLabel && ctaUrl ? `---
${ctaLabel}: ${ctaUrl}
---

` : ""}${outro ? outro + "\n\n" : ""}Warm regards,
The ${appName} Team

---
You are receiving this email because you are a registered member of ${appName}.
Email: ${subscriberEmail}
© ${year} ${appName}. All rights reserved.
`.trim();
}
