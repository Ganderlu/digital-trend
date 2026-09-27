import { NextResponse } from "next/server";
import { requireUserFromRequest } from "@/lib/requestAuth";
import { sendEmail } from "@/lib/email";
import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
} from "@/lib/welcomeEmailTemplate";

export async function POST(request: Request) {
  try {
    const decoded = await requireUserFromRequest(request);

    const appName = process.env.APP_NAME || "TeveXtra";
    const appUrl = process.env.APP_URL || "";
    const supportEmail = process.env.SUPPORT_EMAIL || "support@tevextra.com";
    const email = decoded.email || "";

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Missing user email" },
        { status: 400 },
      );
    }

    const safeName =
      decoded.name ||
      decoded.displayName ||
      (email.includes("@") ? email.split("@")[0] : "there");

    const subject = `Welcome to TeveXtra — Your account is ready`;

    const year = new Date().getFullYear();

    const html = buildWelcomeEmailHtml({
      userName: String(safeName),
      userEmail: email,
      appName,
      appUrl,
      supportEmail,
      year,
    });

    const text = buildWelcomeEmailText({
      userName: String(safeName),
      userEmail: email,
      appName,
      appUrl,
      supportEmail,
      year,
    });

    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
