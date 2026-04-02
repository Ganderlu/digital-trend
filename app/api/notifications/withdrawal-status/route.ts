import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
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
    await requireAdminFromRequest(request);
    const body = (await request.json().catch(() => ({}))) as {
      withdrawalId?: string;
      status?: "approved" | "rejected";
    };

    if (!body.withdrawalId || !body.status) {
      return NextResponse.json({ ok: false, error: "Missing withdrawalId/status" }, { status: 400 });
    }

    const snap = await getAdminDb().collection("withdrawals").doc(body.withdrawalId).get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "Withdrawal not found" }, { status: 404 });
    }

    const data = snap.data() || {};
    const email = String(data.userEmail || "");
    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing userEmail on withdrawal" }, { status: 400 });
    }

    const appName = process.env.APP_NAME || "Digital-trend";
    const amount = Number(data.amount || 0);
    const method = String(data.method || "");
    const statusLabel = body.status === "approved" ? "approved" : "rejected";

    const subject = `Your withdrawal has been ${statusLabel}`;
    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
        <h2 style="margin:0 0 12px;">Withdrawal ${escapeHtml(statusLabel)}</h2>
        <p style="margin:0 0 12px;">Hello,</p>
        <p style="margin:0 0 12px;">Your withdrawal request has been <strong>${escapeHtml(statusLabel)}</strong>.</p>
        <div style="margin:16px 0;padding:12px;border:1px solid #e2e8f0;border-radius:12px;">
          <div><strong>Amount:</strong> ${escapeHtml(amount.toFixed(2))}</div>
          <div><strong>Method:</strong> ${escapeHtml(method)}</div>
          <div><strong>Reference:</strong> ${escapeHtml(body.withdrawalId)}</div>
        </div>
        <p style="margin:0 0 12px;">Thank you for choosing ${escapeHtml(appName)}.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject,
      html,
      text: `Your withdrawal has been ${statusLabel}. Amount: ${amount.toFixed(2)}. Method: ${method}. Reference: ${body.withdrawalId}.`,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
