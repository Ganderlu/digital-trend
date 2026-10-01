import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { sendEmail } from "@/lib/email";
import {
  buildForgotPasswordEmailHtml,
  buildForgotPasswordEmailText,
} from "@/lib/forgotPasswordEmailTemplate";

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
    const rawAppUrl = process.env.APP_URL || "";
    const PRODUCTION_URL = "https://tevextra.com";
    let appUrl = rawAppUrl.trim().replace(/\/$/, "");
    if (!appUrl || /localhost|127\.0\.0\.1|^http:\/\/[^\/]*:3000/.test(appUrl)) {
      appUrl = PRODUCTION_URL;
    }
    const supportEmail = process.env.SUPPORT_EMAIL || "support@tevextra.com";
    const year = new Date().getFullYear();

    let resetLink: string;
    try {
      const actionCodeSettings = appUrl
        ? {
            url: `${appUrl}/login`,
            handleCodeInApp: false,
          }
        : undefined;

      resetLink = await auth.generatePasswordResetLink(
        email,
        actionCodeSettings as any,
      );
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
            "If an account exists with this email, a password reset link has been sent. Please check your inbox (and spam folder if needed).",
        });
      }
      throw firebaseError;
    }

    const safeName = email.includes("@") ? email.split("@")[0] : "there";
    const subject = `Reset your ${appName} password`;

    const html = buildForgotPasswordEmailHtml({
      userName: String(safeName),
      userEmail: email,
      appName,
      appUrl,
      supportEmail,
      resetLink,
      year,
    });

    const text = buildForgotPasswordEmailText({
      userName: String(safeName),
      userEmail: email,
      appName,
      appUrl,
      supportEmail,
      resetLink,
      year,
    });

    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists with this email, a password reset link has been sent. Please check your inbox (and spam folder if needed).",
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
