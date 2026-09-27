function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildWelcomeEmailHtml(params: {
  userName: string;
  userEmail: string;
  appName: string;
  appUrl: string;
  supportEmail: string;
  year: number;
}) {
  const { userName, userEmail, appName, appUrl, supportEmail, year } = params;

  const appDomain = appUrl
    ? appUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "tevextra.com";

  const displayName = "TeveXtra";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Welcome to ${escapeHtml(displayName)}</title>
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">Your account is ready. Start investing, earn referral rewards, and explore your dashboard today.</div>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
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
      .feature-icon { margin: 0 auto; }
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
                              <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #059669, #10b981); display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px -8px rgba(5,150,105,0.5);">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                              </div>
                              <div style="display: inline-block;">
                                <div style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em;">${escapeHtml(displayName)}</div>
                                <div style="font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;">tevextra.com</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="mobile-center mobile-hide" style="padding: 0; text-align: right;">
                      <div style="display: inline-block; padding: 7px 16px; border-radius: 999px; background: #ecfdf5; border: 1px solid #a7f3d0;">
                        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #059669;">Account Created</span>
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
                <div style="overflow: hidden; border-radius: 24px 24px 0 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%); padding: 48px 40px; position: relative;">
                  <div style="position: absolute; top: -50px; right: -50px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%);"></div>
                  <div style="position: absolute; bottom: -40px; left: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);"></div>
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%);"></div>
                  <div style="position: relative;">
                    <div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6ee7b7;">Registration Successful</span>
                    </div>
                    <h1 style="margin: 20px 0 0 0; font-size: 40px; font-weight: 800; color: #ffffff; line-height: 1.1; letter-spacing: -0.02em;" class="hero-title">
                      Welcome to <span style="background: linear-gradient(135deg, #6ee7b7, #34d399); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${escapeHtml(displayName)}</span>
                    </h1>
                    <p style="margin: 14px 0 0 0; font-size: 16px; line-height: 1.7; color: #cbd5e1; max-width: 500px;">
                      Hi <strong style="color: #f1f5f9;">${escapeHtml(userName)}</strong>, thank you for joining our growing community of smart investors. Your journey to financial growth starts right here.
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
                        On behalf of the entire team at <strong style="color: #0f172a;">${escapeHtml(displayName)}</strong>, we are thrilled to welcome you aboard! Your account has been successfully created, and you now have full access to our comprehensive investment platform designed to help you grow and manage your wealth strategically.
                      </p>
                      <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #475569;">
                        Whether you are a seasoned investor or just starting out, ${escapeHtml(displayName)} provides you with industry-leading tools, transparent investment plans, and a rewarding referral program to accelerate your financial goals.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 8px 40px 0 40px;" class="padding-x">
                      <div style="padding: 6px 0 0 0; border-top: 1px dashed #e2e8f0;"></div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 8px 40px;" class="padding-x">
                      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                        <div style="width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); display: inline-flex; align-items: center; justify-content: center;">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z"></path>
                          </svg>
                        </div>
                        <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">Why Choose ${escapeHtml(displayName)}?</h2>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 8px 40px 0 40px;" class="padding-x">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td class="stack-column" style="padding: 0 12px 12px 0; vertical-align: top; width: 50%;">
                            <div style="padding: 22px 20px; border-radius: 18px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%); border: 1px solid #dcfce7; height: 100%; box-sizing: border-box;">
                              <div class="feature-icon" style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(5,150,105,0.08); margin-bottom: 14px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                  <line x1="12" y1="1" x2="12" y2="23"></line>
                                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                              </div>
                              <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #065f46;">Flexible Investment Plans</h3>
                              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #047857;">
                                Choose from multiple curated plans tailored to different risk profiles and investment horizons.
                              </p>
                            </div>
                          </td>
                          <td class="stack-column" style="padding: 0 0 12px 12px; vertical-align: top; width: 50%;">
                            <div style="padding: 22px 20px; border-radius: 18px; background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border: 1px solid #dbeafe; height: 100%; box-sizing: border-box;">
                              <div class="feature-icon" style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(29,78,216,0.08); margin-bottom: 14px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                              </div>
                              <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #1e40af;">Lucrative Referral Program</h3>
                              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #1d4ed8;">
                                Earn commissions up to 4 referral levels. Invite friends and build a passive income stream.
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="stack-column" style="padding: 0 12px 12px 0; vertical-align: top; width: 50%;">
                            <div style="padding: 22px 20px; border-radius: 18px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; height: 100%; box-sizing: border-box;">
                              <div class="feature-icon" style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(202,138,4,0.08); margin-bottom: 14px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                              </div>
                              <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #854d0e;">Secure & Transparent</h3>
                              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #a16207;">
                                Bank-grade security, real-time dashboard tracking, and complete visibility over all your funds.
                              </p>
                            </div>
                          </td>
                          <td class="stack-column" style="padding: 0 0 12px 12px; vertical-align: top; width: 50%;">
                            <div style="padding: 22px 20px; border-radius: 18px; background: linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 100%); border: 1px solid #e9d5ff; height: 100%; box-sizing: border-box;">
                              <div class="feature-icon" style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(124,58,237,0.08); margin-bottom: 14px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                              </div>
                              <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #6d28d9;">Fast Withdrawals</h3>
                              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #7c3aed;">
                                Request withdrawals anytime. Our team processes requests promptly so you access your profits without delays.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 28px 40px 8px 40px;" class="padding-x">
                      <div style="padding: 6px 0 0 0; border-top: 1px dashed #e2e8f0;"></div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 0 40px;" class="padding-x">
                      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                        <div style="width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); display: inline-flex; align-items: center; justify-content: center;">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                        </div>
                        <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">Getting Started: Next Steps</h2>
                      </div>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 4px;">
                        <tr>
                          <td style="padding: 0 0 16px 0; vertical-align: top; width: 36px;">
                            <div style="width: 30px; height: 30px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(5,150,105,0.4);">1</div>
                          </td>
                          <td style="padding: 4px 0 16px 12px; vertical-align: top;">
                            <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Sign In to Your Dashboard</p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">Log in using the email and password you registered with to access your personalized dashboard.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 16px 0; vertical-align: top; width: 36px;">
                            <div style="width: 30px; height: 30px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(5,150,105,0.4);">2</div>
                          </td>
                          <td style="padding: 4px 0 16px 12px; vertical-align: top;">
                            <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Complete Profile Verification</p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">Navigate to your profile section and submit the required verification documents for full access to withdrawal features.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 16px 0; vertical-align: top; width: 36px;">
                            <div style="width: 30px; height: 30px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(5,150,105,0.4);">3</div>
                          </td>
                          <td style="padding: 4px 0 16px 12px; vertical-align: top;">
                            <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Explore Investment Plans</p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">Browse our selection of investment plans and pick the one that best aligns with your financial goals and risk appetite.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 16px 0; vertical-align: top; width: 36px;">
                            <div style="width: 30px; height: 30px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(5,150,105,0.4);">4</div>
                          </td>
                          <td style="padding: 4px 0 16px 12px; vertical-align: top;">
                            <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Make Your First Deposit</p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">Fund your account using any of our supported payment methods and activate your chosen investment plan.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 0 0; vertical-align: top; width: 36px;">
                            <div style="width: 30px; height: 30px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -2px rgba(5,150,105,0.4);">5</div>
                          </td>
                          <td style="padding: 4px 0 0 12px; vertical-align: top;">
                            <p style="margin: 0 0 3px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Share Your Referral Link</p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">Copy your unique referral link from the dashboard and invite friends to earn multi-level referral bonuses.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 0 40px;" class="padding-x">
                      <div style="text-align: center;" class="button">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 16px 32px -10px rgba(5,150,105,0.55);">
                              <a href="${escapeHtml(appUrl ? appUrl + "/login" : "#")}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 17px 40px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.01em;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Access My Dashboard
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
                        ${appUrl ? `Link not working? Copy and paste: <span style="word-break: break-all; color: #0ea5e9;">${escapeHtml(appUrl + "/login")}</span>` : ""}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 40px 0 40px;" class="padding-x">
                      <div style="padding: 24px 24px; border-radius: 18px; background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%); border: 1px solid #bae6fd;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 0 14px 0 0; vertical-align: top; width: 44px;">
                              <div style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(14,165,233,0.1);">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                              </div>
                            </td>
                            <td style="padding: 0; vertical-align: top;">
                              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0c4a6e;">Need Assistance? We're Here to Help.</p>
                              <p style="margin: 0; font-size: 13px; line-height: 1.65; color: #0369a1;">
                                Our dedicated support team is available around the clock. If you have any questions about your account, investments, withdrawals, or referrals, do not hesitate to reach out to us at
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
                        <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Here's to your success,</p>
                        <p style="margin: 0; font-size: 15px; color: #334155;">
                          The <strong style="color: #059669;">${escapeHtml(displayName)}</strong> Team
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                          tevextra.com · Empowering investors worldwide
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
                              <div style="margin-top: 10px; font-size: 13px; line-height: 1.9;">
                                ${appUrl ? `<a href="${escapeHtml(appUrl + "/login")}" style="color: #059669; text-decoration: none; font-weight: 600;">Sign In</a>  ·  ` : ""}
                                <a href="${escapeHtml(appUrl ? appUrl + "/investment-plans" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">Plans</a>  ·  <a href="${escapeHtml(appUrl ? appUrl + "/faqs" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">FAQs</a>  ·  <a href="${escapeHtml(appUrl ? appUrl + "/contact" : "#")}" style="color: #334155; text-decoration: none; font-weight: 500;">Contact</a>  ·  <a href="mailto:${escapeHtml(supportEmail)}" style="color: #334155; text-decoration: none; font-weight: 500;">Support</a>
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
                  ${appUrl ? ` © ${year} <a href="${escapeHtml(appUrl)}" style="color: #64748b; text-decoration: none; font-weight: 500;">${escapeHtml(appDomain)}</a>.` : ` © ${year} ${escapeHtml(displayName)}.`}
                  All rights reserved.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 1.65; color: #cbd5e1; text-align: center;">
                  If you did not create an account with ${escapeHtml(displayName)}, please forward this email to ${escapeHtml(supportEmail)} and we will resolve the matter immediately.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 1.65; color: #cbd5e1; text-align: center;">
                  ${escapeHtml(displayName)} · tevextra.com · Global Investment Platform
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

export function buildWelcomeEmailText(params: {
  userName: string;
  userEmail: string;
  appName: string;
  appUrl: string;
  supportEmail: string;
  year: number;
}) {
  const { userName, userEmail, appName, appUrl, supportEmail, year } = params;
  const displayName = "TeveXtra";
  const loginUrl = appUrl ? appUrl + "/login" : "";

  return `
Welcome to ${displayName}
${"=".repeat(("Welcome to " + displayName).length)}
${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

Hello ${userName},

On behalf of the entire team at ${displayName}, we are thrilled to welcome you aboard!
Your account has been successfully created, and you now have full access to our
comprehensive investment platform designed to help you grow and manage your wealth strategically.

Whether you are a seasoned investor or just starting out, ${displayName} provides you with
industry-leading tools, transparent investment plans, and a rewarding referral program
to accelerate your financial goals.

---
WHY CHOOSE ${displayName.toUpperCase()}?
---

1. Flexible Investment Plans
   Choose from multiple curated plans tailored to different risk profiles and investment horizons.

2. Lucrative Referral Program
   Earn commissions up to 4 referral levels. Invite friends and build a passive income stream.

3. Secure & Transparent
   Bank-grade security, real-time dashboard tracking, and complete visibility over all your funds.

4. Fast Withdrawals
   Request withdrawals anytime. Our team processes requests promptly.

---
GETTING STARTED: NEXT STEPS
---

1. Sign In to Your Dashboard
   Log in using your email and password to access your personalized dashboard.

2. Complete Profile Verification
   Navigate to your profile section and submit required verification documents.

3. Explore Investment Plans
   Browse our selection of investment plans and pick one that aligns with your goals.

4. Make Your First Deposit
   Fund your account using any of our supported payment methods.

5. Share Your Referral Link
   Invite friends to earn multi-level referral bonuses.

${loginUrl ? `---
ACCESS YOUR DASHBOARD
---

Sign in here: ${loginUrl}

` : ""}---
NEED ASSISTANCE?
---

Our dedicated support team is available around the clock.
If you have any questions, reach out to us at: ${supportEmail}

---
Warm regards,
The ${displayName} Team
tevextra.com · Empowering investors worldwide

---
You are receiving this email because you recently registered an account at ${displayName}.
Email: ${userEmail}
© ${year} ${displayName} (tevextra.com). All rights reserved.

If you did not create this account, please forward this email to ${supportEmail}
and we will resolve the matter immediately.
`.trim();
}
