import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendEmail, type SendEmailResult } from "@/lib/email";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import {
  buildNewsletterHtml,
  buildNewsletterText,
} from "@/lib/newsletterTemplate";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(message: unknown): boolean {
  const s = typeof message === "string" ? message : "";
  return (
    s.includes("HTTP 429") ||
    s.includes("Too many requests") ||
    s.includes("429") ||
    s.includes("rate limit")
  );
}

type NewsletterPayload = {
  subject: string;
  preheader?: string;
  greeting?: string;
  intro?: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  outro?: string;
  audience: "all" | "active_investors" | "test";
  testEmail?: string;
};

type RecipientLog = {
  email: string;
  uid?: string;
  name?: string;
  status: "sent" | "failed";
  resendId?: string | null;
  from?: string;
  error?: string;
  sentAt?: Date;
};

const EMAIL_BATCH_SIZE = 6;
const MS_BETWEEN_SENDS = 260;

async function fetchSubscribers(
  audience: NewsletterPayload["audience"],
): Promise<{ email: string; name?: string; uid: string }[]> {
  const db = getAdminDb();

  const extractUser = (doc: any) => {
    const d = doc.data();
    const email = typeof d?.email === "string" ? d.email.trim() : "";
    if (!email || !isValidEmail(email)) return null;
    const name =
      typeof d?.displayName === "string" && d.displayName.trim()
        ? d.displayName.trim()
        : typeof d?.name === "string" && d.name.trim()
          ? d.name.trim()
          : undefined;
    return { email, name, uid: doc.id };
  };

  if (audience === "active_investors") {
    const activeSnap = await db
      .collection("investments")
      .where("status", "==", "active")
      .get();

    const uidList: string[] = [];
    activeSnap.forEach((doc) => {
      const d = doc.data();
      const uid =
        typeof d.userId === "string"
          ? d.userId
          : typeof d.uid === "string"
            ? d.uid
            : "";
      if (uid && !uidList.includes(uid)) uidList.push(uid);
    });

    const users: { email: string; name?: string; uid: string }[] = [];
    for (let i = 0; i < uidList.length; i += 30) {
      const chunk = uidList.slice(i, i + 30);
      const refs = chunk.map((uid) => db.collection("users").doc(uid));
      const docs = await db.getAll(...refs);
      for (const doc of docs) {
        if (!doc || !doc.exists) continue;
        const record = extractUser(doc);
        if (record) users.push(record);
      }
    }

    return Array.from(
      new Map(users.map((u) => [u.email.toLowerCase(), u])).values(),
    );
  }

  const usersSnap = await db.collection("users").get();
  const users: { email: string; name?: string; uid: string }[] = [];
  usersSnap.forEach((doc) => {
    const record = extractUser(doc);
    if (record) users.push(record);
  });

  return Array.from(
    new Map(users.map((u) => [u.email.toLowerCase(), u])).values(),
  );
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminFromRequest(request);

    const body = (await request.json()) as Partial<NewsletterPayload>;
    const subject =
      typeof body?.subject === "string" ? body.subject.trim() : "";
    const preheader =
      typeof body?.preheader === "string" ? body.preheader.trim() : undefined;
    const greeting =
      typeof body?.greeting === "string" && body.greeting.trim()
        ? body.greeting.trim()
        : undefined;
    const intro =
      typeof body?.intro === "string" && body.intro.trim()
        ? body.intro.trim()
        : undefined;
    const bodyText = typeof body?.body === "string" ? body.body.trim() : "";
    const ctaLabel =
      typeof body?.ctaLabel === "string" && body.ctaLabel.trim()
        ? body.ctaLabel.trim()
        : undefined;
    const ctaUrl =
      typeof body?.ctaUrl === "string" && body.ctaUrl.trim()
        ? body.ctaUrl.trim()
        : undefined;
    const outro =
      typeof body?.outro === "string" && body.outro.trim()
        ? body.outro.trim()
        : undefined;
    const audience: NewsletterPayload["audience"] =
      body?.audience === "active_investors" || body?.audience === "test"
        ? body.audience
        : "all";
    const testEmail =
      typeof body?.testEmail === "string" ? body.testEmail.trim() : "";

    if (!subject) {
      return NextResponse.json(
        { ok: false, error: "Subject line is required." },
        { status: 400 },
      );
    }
    if (!bodyText) {
      return NextResponse.json(
        { ok: false, error: "Newsletter body content is required." },
        { status: 400 },
      );
    }
    if (ctaLabel && !ctaUrl) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "A URL is required when providing a Call-To-Action button label.",
        },
        { status: 400 },
      );
    }
    if (ctaUrl && !/^https?:\/\//i.test(ctaUrl)) {
      return NextResponse.json(
        { ok: false, error: "CTA URL must start with http:// or https://" },
        { status: 400 },
      );
    }
    if (audience === "test" && !isValidEmail(testEmail || "")) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "A valid test email address is required when audience is 'Test Email'.",
        },
        { status: 400 },
      );
    }

    const appName = process.env.APP_NAME || "TeveXtra";
    const PRODUCTION_URL = "https://tevextra.com";
    let appUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "")
      .replace(/\/$/, "")
      .toString();
    if (
      !appUrl ||
      /localhost|127\.0\.0\.1|^http:\/\/[^\/]*:3000/.test(appUrl)
    ) {
      appUrl = PRODUCTION_URL;
    }
    const supportEmail = process.env.SUPPORT_EMAIL || "support@tevextra.com";
    const DEFAULT_NEWSLETTER_FROM = "TeveXtra Updates <updates@tevextra.com>";
    const newsletterFrom =
      process.env.NEWSLETTER_FROM ||
      process.env.RESEND_FROM ||
      process.env.FALLBACK_RESEND_FROM ||
      DEFAULT_NEWSLETTER_FROM;
    const year = new Date().getFullYear();

    let recipients: { email: string; name?: string; uid?: string }[] = [];
    if (audience === "test") {
      recipients = [{ email: testEmail.trim() }];
    } else {
      recipients = await fetchSubscribers(audience);
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No recipients were found for this audience." },
        { status: 400 },
      );
    }

    const newsletterId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    const unsubscribeMailto = `<mailto:support@tevextra.com?subject=Unsubscribe%20-%20Newsletter&body=Please%20unsubscribe%20me%20from%20TeveXtra%20newsletters.>`;
    const listUnsubscribeValues = [unsubscribeMailto];
    const listUnsubscribeOneClick = [
      unsubscribeMailto,
      `<https://www.tevextra.com/contact>`,
    ];

    console.log(
      `[newsletter] === START CAMPAIGN ${newsletterId} === audience=${audience} recipients=${recipients.length} from=${newsletterFrom}`,
    );

    const sent: string[] = [];
    const failed: { email: string; error: string }[] = [];
    const recipientLogs: RecipientLog[] = [];

    for (let i = 0; i < recipients.length; i += EMAIL_BATCH_SIZE) {
      const batch = recipients.slice(i, i + EMAIL_BATCH_SIZE);
      const batchIdx = i / EMAIL_BATCH_SIZE + 1;
      const totalBatches = Math.ceil(recipients.length / EMAIL_BATCH_SIZE);
      console.log(
        `[newsletter] Processing batch ${batchIdx}/${totalBatches} — emails ${i + 1}-${Math.min(i + EMAIL_BATCH_SIZE, recipients.length)}/${recipients.length}`,
      );

      for (let j = 0; j < batch.length; j++) {
        const r = batch[j];
        const firstName =
          r.name?.split(" ")[0]?.trim() ||
          r.email.split("@")[0]?.trim() ||
          "there";
        const personalizedGreeting = greeting || `Hi ${firstName},`;

        const html = buildNewsletterHtml({
          subject,
          preheader,
          greeting: personalizedGreeting,
          intro,
          body: bodyText,
          ctaLabel,
          ctaUrl,
          outro,
          appName,
          appUrl,
          subscriberEmail: r.email,
          year,
        });

        const text = buildNewsletterText({
          subject,
          greeting: personalizedGreeting,
          intro,
          body: bodyText,
          ctaLabel,
          ctaUrl,
          outro,
          appName,
          appUrl,
          subscriberEmail: r.email,
          year,
        });

        let delivered: SendEmailResult | null = null;
        let errorMsg: string = "";
        const localRetries = 2;
        for (let attempt = 0; attempt <= localRetries; attempt++) {
          try {
            delivered = await sendEmail(
              {
                from: newsletterFrom,
                replyTo: supportEmail,
                to: r.email,
                subject,
                html,
                text,
                listUnsubscribe: listUnsubscribeOneClick,
                headers: {
                  "X-Precedence": "bulk",
                  "Feedback-ID": "tevextra:newsletter:admin",
                  "List-Id": `<tevextra-newsletter.${appUrl.replace(/^https?:\/\//, "")}>`,
                },
              },
              { max429Retries: 3 },
            );
            errorMsg = "";
            break;
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "Unknown send error";
            errorMsg = msg;
            const is429 = isRateLimitError(msg);
            if (!is429) break;
            if (attempt < localRetries) {
              const wait =
                2200 * Math.pow(2, attempt) + Math.floor(Math.random() * 600);
              console.warn(
                `[newsletter] 429 rate-limit for ${r.email} — retry ${attempt + 1}/${localRetries} after ${wait}ms.`,
              );
              await sleep(wait);
            }
          }
        }

        if (delivered) {
          sent.push(r.email);
          recipientLogs.push({
            email: r.email,
            uid: r.uid,
            name: r.name,
            status: "sent",
            resendId: delivered.id,
            from: delivered.fromUsed,
            sentAt: new Date(),
          });
          console.log(
            `[newsletter] ✓ SENT ${r.email} (resend=${delivered.id || "n/a"} via ${delivered.fromUsed}) — ${sent.length}/${recipients.length}`,
          );
        } else {
          failed.push({ email: r.email, error: errorMsg });
          recipientLogs.push({
            email: r.email,
            uid: r.uid,
            name: r.name,
            status: "failed",
            error: errorMsg,
            sentAt: new Date(),
          });
          console.error(
            `[newsletter] ✗ FAILED ${r.email}: ${errorMsg || "no error detail"}`,
          );
        }

        if (j < batch.length - 1 && MS_BETWEEN_SENDS > 0) {
          await sleep(MS_BETWEEN_SENDS + Math.floor(Math.random() * 120));
        }
      }

      if (i + EMAIL_BATCH_SIZE < recipients.length) {
        const cooldown = 4200 + Math.floor(Math.random() * 1200);
        console.log(
          `[newsletter] Batch ${batchIdx}/${totalBatches} complete. Sent=${sent.length} Failed=${failed.length}. Cooling ${cooldown}ms before next batch.`,
        );
        await sleep(cooldown);
      }
    }

    console.log(
      `[newsletter] === FINISHED CAMPAIGN ${newsletterId} === total=${recipients.length} sent=${sent.length} failed=${failed.length}`,
    );

    try {
      const db = getAdminDb();
      const rawAdminEmail =
        typeof admin.email === "string" ? admin.email.trim() : "";
      const isGmailAdmin = /@gmail\.com$/i.test(rawAdminEmail);
      const displaySentBy =
        isGmailAdmin || !rawAdminEmail ? "TeveXtra Admin" : rawAdminEmail;

      const logPayload = {
        newsletterId,
        subject,
        preheader: preheader || "",
        greeting: greeting || "",
        intro: intro || "",
        body: bodyText,
        ctaLabel: ctaLabel || "",
        ctaUrl: ctaUrl || "",
        outro: outro || "",
        audience,
        testEmail: testEmail || "",
        totalRecipients: recipients.length,
        sentCount: sent.length,
        failedCount: failed.length,
        sentEmails: sent,
        failedEmails: failed,
        recipientLogs,
        sentFrom: newsletterFrom,
        listUnsubscribe: listUnsubscribeValues,
        sentBy: displaySentBy,
        sentByRaw: isGmailAdmin ? "" : rawAdminEmail,
        sentByUid: admin.uid,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      await db.collection("newsletters").doc(newsletterId).set(logPayload);
      console.log(
        `[newsletter] Campaign log written to Firestore newsletters/${newsletterId} with ${recipientLogs.length} per-recipient logs.`,
      );
    } catch (logErr) {
      console.error(
        "[newsletter] ⚠ Newsletters Firestore log write FAILED (emails were already sent above):",
        logErr,
      );
    }

    return NextResponse.json({
      ok: true,
      newsletterId,
      totals: {
        recipients: recipients.length,
        sent: sent.length,
        failed: failed.length,
      },
      failedSample: failed.slice(0, 10),
      sentSample: sent.slice(0, 5),
      resendIds: recipientLogs
        .filter((r) => r.status === "sent")
        .slice(0, 10)
        .map((r) => ({ email: r.email, resendId: r.resendId, from: r.from })),
    });
  } catch (err) {
    console.error("Newsletter send error:", err);
    const msg =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    const status =
      msg === "Missing Authorization header" || msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
