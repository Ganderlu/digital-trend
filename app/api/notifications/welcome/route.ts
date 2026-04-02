import { NextResponse } from "next/server";
import { requireUserFromRequest } from "@/lib/requestAuth";
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
    const decoded = await requireUserFromRequest(request);

    const appName = process.env.APP_NAME || "Digital-trend";
    const appUrl = process.env.APP_URL || "";
    const email = decoded.email || "";

    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing user email" }, { status: 400 });
    }

    const safeName =
      decoded.name ||
      (email.includes("@") ? email.split("@")[0] : "there");

    const subject = `Welcome to ${appName}`;
    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
        <h2 style="margin:0 0 12px;">Welcome, ${escapeHtml(String(safeName))}.</h2>
        <p style="margin:0 0 12px;">Thank you for joining ${escapeHtml(appName)}. Your account has been created successfully.</p>
        <p style="margin:0 0 12px;">You can sign in anytime to view your dashboard, deposits, withdrawals, and investment plans.</p>
        ${appUrl ? `<p style="margin:0 0 12px;"><a href="${escapeHtml(appUrl)}" target="_blank" rel="noreferrer">Open ${escapeHtml(appName)}</a></p>` : ""}
        <p style="margin:24px 0 0;color:#64748b;font-size:12px;">If you did not create this account, please contact support immediately.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject,
      html,
      text: `Welcome to ${appName}. Thank you for joining. If you did not create this account, contact support.`,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
