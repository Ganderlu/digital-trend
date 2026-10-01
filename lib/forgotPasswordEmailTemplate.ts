function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const LOGO_URL_PRIMARY = "https://www.tevextra.com/images/tx.png";
const LOGO_URL_FALLBACK =
  "https://res.cloudinary.com/demo/image/upload/tevextra-tx.png";

export function buildForgotPasswordEmailHtml(params: {
  userName: string;
  userEmail: string;
  appName: string;
  appUrl: string;
  supportEmail: string;
  resetLink: string;
  year: number;
}) {
  const { userName, userEmail, appUrl, supportEmail, resetLink, year } = params;

  const displayName = "TeveXtra";
  const PRODUCTION_URL = "https://tevextra.com";
  let safeAppUrl = (appUrl || "").trim().replace(/\/$/, "");
  if (
    !safeAppUrl ||
    /localhost|127\.0\.0\.1|^http:\/\/[^\/]*:3000/.test(safeAppUrl)
  ) {
    safeAppUrl = PRODUCTION_URL;
  }
  const appDomain = safeAppUrl.replace(/^https?:\/\//, "");
  const loginUrl = safeAppUrl + "/login";
  const contactUrl = safeAppUrl + "/contact";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Reset your ${escapeHtml(displayName)} password</title>
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">Secure password reset link for your account. Valid for 1 hour only.</div>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .stack-column td { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
      .padding-x { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-title { font-size: 26px !important; line-height: 1.2 !important; }
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
                              <a href="${escapeHtml(safeAppUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
                                <img
                                  src="${escapeHtml(LOGO_URL_PRIMARY)}"
                                  alt="${escapeHtml(displayName)}"
                                  title="${escapeHtml(displayName)}"
                                  width="44"
                                  height="44"
                                  style="display: block; width: 44px; height: 44px; max-width: 44px; max-height: 44px; min-width: 44px; min-height: 44px; border: 0; outline: none; text-decoration: none; border-radius: 14px; box-shadow: 0 10px 20px -8px rgba(5,150,105,0.5);"
                                  onerror="this.onerror=null;this.src='${escapeHtml(LOGO_URL_FALLBACK)}';"
                                />
                                <div style="display: inline-block;">
                                  <div style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">${escapeHtml(displayName)}</div>
                                  <div style="font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;">tevextra.com</div>
                                </div>
                              </a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="mobile-center mobile-hide" style="padding: 0; text-align: right;">
                      <div style="display: inline-block; padding: 7px 16px; border-radius: 999px; background-color: #eff6ff; border: 1px solid #bfdbfe;">
                        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #1d4ed8;">SECURITY REQUEST</span>
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
                <div style="overflow: hidden; border-radius: 24px 24px 0 0; background-color: #0f172a; padding: 48px 40px;">
                  <div style="position: relative;">
                    <div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background-color: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.35);">
                      <span style="color: #93c5fd; font-size: 13px; font-weight: 700; line-height: 1;">&#128274;</span>
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #93c5fd;">PASSWORD RESET</span>
                    </div>
                    <h1 style="margin: 20px 0 0 0; font-size: 36px; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -0.02em;" class="hero-title">
                      Reset your account password
                    </h1>
                    <p style="margin: 14px 0 0 0; font-size: 16px; line-height: 1.7; color: #cbd5e1; max-width: 500px;">
                      Hi <strong style="color: #f1f5f9;">${escapeHtml(userName)}</strong>, we received a request to reset the password for your account. Use the button below to create a new password.
                    </p>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;" class="padding-x">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                  <tr>
                    <td style="padding: 40px 40px 8px 40px;" class="padding-x">
                      <p style="margin: 0 0 18px 0; font-size: 16px; font-weight: 600; color: #0f172a;">Hello ${escapeHtml(userName)},</p>
                      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.75; color: #475569;">
                        We received a password reset request for the <strong style="color: #0f172a;">${escapeHtml(displayName)}</strong> account associated with <strong style="color: #0f172a;">${escapeHtml(userEmail)}</strong>. For your security, this reset link is time-limited and can only be used once.
                      </p>
                      <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #475569;">
                        Click the button below to set a new secure password and regain access to your account.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 0 40px;" class="padding-x">
                      <div style="text-align: center;" class="button">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 999px; background-color: #2563eb; box-shadow: 0 16px 32px -10px rgba(37,99,235,0.55);">
                              <a href="${escapeHtml(resetLink)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 17px 40px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.01em;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: 700; line-height: 1;">&#128274;</span>
                                Reset My Password
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 16px 40px 0 40px;" class="padding-x mobile-center">
                      <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                        Link not working? Copy and paste the URL below into your browser:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 12px 40px 0 40px;" class="padding-x">
                      <div style="padding: 16px 18px; border-radius: 14px; background-color: #f1f5f9; border: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #2563eb; word-break: break-all; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;">
                          ${escapeHtml(resetLink)}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 28px 40px 8px 40px;" class="padding-x">
                      <div style="padding: 6px 0 0 0; border-top: 1px dashed #e2e8f0;"></div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 28px 40px 0 40px;" class="padding-x">
                      <div style="padding: 22px 22px; border-radius: 18px; background-color: #fef2f2; border: 1px solid #fecaca;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 0 14px 0 0; vertical-align: top; width: 44px;">
                              <div style="width: 40px; height: 40px; border-radius: 12px; background-color: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(220,38,38,0.08);">
                                <span style="color: #dc2626; font-size: 17px; font-weight: 700; line-height: 1;">&#9888;</span>
                              </div>
                            </td>
                            <td style="padding: 0; vertical-align: top;">
                              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #991b1b;">Security Reminders</p>
                              <ul style="margin: 0; padding: 0 0 0 18px; font-size: 13px; line-height: 1.75; color: #b91c1c;">
                                <li style="margin: 0 0 4px 0;">This reset link will expire in <strong>1 hour</strong>.</li>
                                <li style="margin: 0 0 4px 0;">The link can only be used <strong>once</strong>.</li>
                                <li style="margin: 0;">If you did not request this reset, <strong>ignore this email</strong>. Your current password remains valid.</li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 0 40px;" class="padding-x">
                      <div style="padding: 24px 24px; border-radius: 18px; background-color: #f0f9ff; border: 1px solid #bae6fd;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 0 14px 0 0; vertical-align: top; width: 44px;">
                              <div style="width: 40px; height: 40px; border-radius: 12px; background-color: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(14,165,233,0.1);">
                                <span style="color: #0ea5e9; font-size: 17px; font-weight: 700; line-height: 1;">&#9993;</span>
                              </div>
                            </td>
                            <td style="padding: 0; vertical-align: top;">
                              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0c4a6e;">Need Help?</p>
                              <p style="margin: 0; font-size: 13px; line-height: 1.65; color: #0369a1;">
                                If you have any trouble accessing your account or did not initiate this request, please contact our support team immediately at
                                <a href="mailto:${escapeHtml(supportEmail)}" style="color: #0369a1; font-weight: 700; text-decoration: underline;">${escapeHtml(supportEmail)}</a>.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 36px 40px 40px 40px;" class="padding-x">
                      <div style="padding-top: 28px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Stay secure,</p>
                        <p style="margin: 0; font-size: 15px; color: #334155;">
                          The <strong style="color: #2563eb;">${escapeHtml(displayName)}</strong> Security Team
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                          tevextra.com &middot; Securing your financial future
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
                              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">QUICK LINKS</div>
                              <div style="margin-top: 10px; font-size: 13px; line-height: 1.9;">
                                <a href="${escapeHtml(loginUrl)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Sign In</a>  &middot;
                                <a href="${escapeHtml(contactUrl)}" style="color: #334155; text-decoration: none; font-weight: 500;">Contact</a>  &middot; <a href="mailto:${escapeHtml(supportEmail)}" style="color: #334155; text-decoration: none; font-weight: 500;">Support</a>
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
                <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #94a3b8; text-align: center;">
                  This email was sent to <a href="mailto:${escapeHtml(userEmail)}" style="color: #64748b; text-decoration: underline; font-weight: 500;">${escapeHtml(userEmail)}</a>.
                   &copy; ${year} <a href="${escapeHtml(safeAppUrl)}" style="color: #64748b; text-decoration: none; font-weight: 500;">${escapeHtml(appDomain)}</a>.
                  All rights reserved.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 1.65; color: #cbd5e1; text-align: center;">
                  If you did not request a password reset for your ${escapeHtml(displayName)} account, you can safely ignore this email. Your password will not change unless you click the link above.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 1.65; color: #cbd5e1; text-align: center;">
                  ${escapeHtml(displayName)} &middot; tevextra.com &middot; Global Investment Platform
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

export function buildForgotPasswordEmailText(params: {
  userName: string;
  userEmail: string;
  appName: string;
  appUrl: string;
  supportEmail: string;
  resetLink: string;
  year: number;
}) {
  const { userName, userEmail, appUrl, supportEmail, resetLink, year } = params;
  const displayName = "TeveXtra";
  const PRODUCTION_URL = "https://tevextra.com";
  let safeAppUrl = (appUrl || "").trim().replace(/\/$/, "");
  if (
    !safeAppUrl ||
    /localhost|127\.0\.0\.1|^http:\/\/[^\/]*:3000/.test(safeAppUrl)
  ) {
    safeAppUrl = PRODUCTION_URL;
  }
  const loginUrl = safeAppUrl + "/login";

  return `
Reset your ${displayName} password
${"=".repeat(("Reset your " + displayName + " password").length)}
${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

Hello ${userName},

We received a password reset request for the ${displayName} account associated
with ${userEmail}. For your security, this reset link is time-limited and can
only be used once.

Use the link below to set a new password.

---
PASSWORD RESET LINK
---

${resetLink}

IMPORTANT SECURITY REMINDERS:
- This reset link will expire in 1 HOUR.
- The link can only be used ONCE.
- If you did not request this reset, IGNORE THIS EMAIL. Your current password
  remains valid and will not be changed.

---
TROUBLE ACCESSING THE LINK?
---

Copy and paste this entire URL into your browser's address bar:
${resetLink}

---
NEED HELP?
---

If you have any trouble accessing your account or did not initiate this request,
please contact our support team immediately at: ${supportEmail}

---
Stay secure,
The ${displayName} Security Team
tevextra.com · Securing your financial future

---
Sign in to your account: ${loginUrl}

You are receiving this email because a password reset was requested for the
account associated with this email address: ${userEmail}

© ${year} ${displayName} (tevextra.com). All rights reserved.
`.trim();
}
