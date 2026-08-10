import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getAdminDb } from "@/lib/firebaseAdmin";

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
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const goal = typeof body?.goal === "string" ? body.goal.trim() : "Not specified";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields." },
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

    const appName = process.env.APP_NAME || "Digital-trend";
    const supportEmail =
      process.env.SUPPORT_EMAIL || "helpdigitaltrend@gmail.com";

    const db = getAdminDb();
    await db.collection("contacts").add({
      name,
      email,
      goal,
      message,
      createdAt: new Date(),
      status: "new",
    });

    const subject = `New Contact Request from ${escapeHtml(name)} — ${escapeHtml(appName)}`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;max-width:600px;margin:0 auto;">
        <div style="padding:32px 28px;border-radius:20px;background:linear-gradient(135deg,#f0fdf4,#ecfeff);border:1px solid #dcfce7;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
            <div style="width:44px;height:44px;border-radius:14px;background:#059669;display:flex;align-items:center;justify-content:center;">
              <svg style="width:22px;height:22px;color:white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#0f172a;">
                New Contact Request
              </h1>
              <p style="margin:2px 0 0;font-size:12px;color:#64748b;">
                ${escapeHtml(appName)} Website Inquiry
              </p>
            </div>
          </div>

          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <div style="padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">
                Submission Details
              </p>
            </div>
            <div style="padding:20px;">
              <div style="margin-bottom:16px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;">
                  Full Name
                </p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">
                  ${escapeHtml(name)}
                </p>
              </div>
              <div style="margin-bottom:16px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;">
                  Email Address
                </p>
                <a href="mailto:${escapeHtml(email)}" style="margin:0;font-size:15px;color:#059669;text-decoration:none;font-weight:600;">
                  ${escapeHtml(email)}
                </a>
              </div>
              <div style="margin-bottom:16px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;">
                  Primary Goal
                </p>
                <p style="margin:0;font-size:14px;color:#334155;font-weight:500;">
                  ${escapeHtml(
                    goal === "build-wealth"
                      ? "Build long-term wealth"
                      : goal === "retirement"
                        ? "Plan for retirement"
                        : goal === "preserve-capital"
                          ? "Preserve capital with lower risk"
                          : goal === "other"
                            ? "Other"
                            : goal,
                  )}
                </p>
              </div>
              <div>
                <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;">
                  Message
                </p>
                <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <p style="margin:0;font-size:14px;line-height:1.65;color:#334155;white-space:pre-wrap;">
                    ${escapeHtml(message)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top:18px;padding:12px 16px;background:#ffffff;border:1px solid #bbf7d0;border-radius:12px;">
            <p style="margin:0;font-size:12px;color:#065f46;">
              <strong style="font-weight:700;">Reply directly to this email</strong> to respond to the customer.
              The customer's email (${escapeHtml(email)}) has been set as the Reply-To address where supported.
            </p>
          </div>
        </div>
        <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
          Sent on ${new Date().toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })} · ${escapeHtml(appName)}
        </p>
      </div>
    `;

    const text = `
NEW CONTACT REQUEST — ${appName}
==============================

Full Name: ${name}
Email: ${email}
Primary Goal: ${
      goal === "build-wealth"
        ? "Build long-term wealth"
        : goal === "retirement"
          ? "Plan for retirement"
          : goal === "preserve-capital"
            ? "Preserve capital with lower risk"
            : goal === "other"
              ? "Other"
              : goal
    }

Message:
--------
${message}
--------

Reply to this email to respond to the customer, or contact them directly at: ${email}

— ${appName}
`.trim();

    await sendEmail({
      to: supportEmail,
      subject,
      html,
      text,
    });

    return NextResponse.json({
      ok: true,
      message:
        "Your message has been sent! Our team will review your request and get back to you shortly.",
    });
  } catch (error: unknown) {
    console.error("Contact form error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
