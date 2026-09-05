import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { sendEmail } from "@/lib/email";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email address is required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const auth = getAdminAuth();
    const appName = process.env.APP_NAME || "TeveXtra";
    const appUrl = process.env.APP_URL || "";

    let resetLink: string;
    try {
      const actionCodeSettings = appUrl
        ? {
            url: `${appUrl.replace(/\/$/, "")}/login`,
            handleCodeInApp: false,
          }
        : undefined;

      resetLink = await auth.generatePasswordResetLink(email, actionCodeSettings as any);
    } catch (firebaseError: unknown) {
      const errCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String((firebaseError as { code: unknown }).code)
          : "";

      if (errCode === "auth/user-not-found") {
        return NextResponse.json({
          ok: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      }
      throw firebaseError;
    }

    const safeName = email.includes("@") ? email.split("@")[0] : "there";
    const subject = `Reset your ${appName} password`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;max-width:560px;margin:0 auto;">
        <div style="padding:32px 24px;border-radius:20px;background:linear-gradient(135deg,#f0fdf4,#ecfeff);border:1px solid #dcfce7;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">
            Reset your password
          </h1>
          <p style="margin:0 0 4px;font-size:14px;color:#475569;">
            Hi ${escapeHtml(String(safeName))},
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
            We received a request to reset the password for your ${escapeHtml(appName)} account.
            Click the button below to set a new password.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a
              href="${resetLink}"
              target="_blank"
              rel="noreferrer"
              style="display:inline-block;padding:14px 32px;border-radius:9999px;background:#059669;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 10px 25px -10px rgba(5,150,105,0.5);"
            >
              Reset My Password
            </a>
          </div>
          <p style="margin:0 0 12px;font-size:13px;color:#64748b;line-height:1.6;">
            This link will expire in 1 hour and can only be used once.
          </p>
          <div style="padding:12px 16px;border-radius:12px;background:#ffffff;border:1px solid #e2e8f0;margin:20px 0;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#475569;">
              Link not working? Copy and paste this URL:
            </p>
            <p style="margin:0;font-size:12px;color:#0ea5e9;word-break:break-all;">
              ${escapeHtml(resetLink)}
            </p>
          </div>
          <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
            If you did not request this password reset, you can safely ignore this email.
            Your password will not be changed unless you click the link above.
          </p>
        </div>
        <p style="margin:24px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
          © ${new Date().getFullYear()} ${escapeHtml(appName)}. All rights reserved.
          ${appUrl ? `<br/><a href="${escapeHtml(appUrl)}" style="color:#94a3b8;">${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}</a>` : ""}
        </p>
      </div>
    `;

    const text = `
Reset your ${appName} password

Hi ${safeName},

We received a request to reset the password for your ${appName} account.
Use the link below to set a new password. This link expires in 1 hour.

${resetLink}

If you did not request this password reset, you can safely ignore this email.
Your password will not be changed unless you use the link above.

© ${new Date().getFullYear()} ${appName}
`.trim();

    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists with this email, a password reset link has been sent. Please check your inbox (and spam folder).",
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
