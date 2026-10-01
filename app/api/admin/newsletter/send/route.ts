import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendEmail } from "@/lib/email";
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

const EMAIL_BATCH_SIZE = 8;
const MS_BETWEEN_SENDS = 140;

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

    const sent: string[] = [];
    const failed: { email: string; error: string }[] = [];

    for (let i = 0; i < recipients.length; i += EMAIL_BATCH_SIZE) {
      const batch = recipients.slice(i, i + EMAIL_BATCH_SIZE);

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

        let ok = false;
        let errorMsg: string = "";
        const local429Retries = 3;
        for (let attempt = 0; attempt <= local429Retries; attempt++) {
          try {
            await sendEmail(
              {
                from: newsletterFrom,
                replyTo: supportEmail,
                to: r.email,
                subject,
                html,
                text,
              },
              { max429Retries: 2 },
            );
            ok = true;
            break;
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "Unknown send error";
            errorMsg = msg;
            const is429 = isRateLimitError(msg);
            if (!is429) break;
            if (attempt < local429Retries) {
              const wait =
                1200 * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
              console.warn(
                `[newsletter] 429 for ${r.email} — local retry ${attempt + 1}/${local429Retries} after ${wait}ms.`,
              );
              await sleep(wait);
            }
          }
        }

        if (ok) {
          sent.push(r.email);
        } else {
          failed.push({ email: r.email, error: errorMsg });
        }

        if (j < batch.length - 1 && MS_BETWEEN_SENDS > 0) {
          await sleep(MS_BETWEEN_SENDS + Math.floor(Math.random() * 40));
        }
      }

      if (i + EMAIL_BATCH_SIZE < recipients.length) {
        await sleep(3500);
      }
    }

    try {
      const db = getAdminDb();
      const rawAdminEmail =
        typeof admin.email === "string" ? admin.email.trim() : "";
      const isGmailAdmin = /@gmail\.com$/i.test(rawAdminEmail);
      const displaySentBy =
        isGmailAdmin || !rawAdminEmail ? "TeveXtra Admin" : rawAdminEmail;

      await db
        .collection("newsletters")
        .doc(newsletterId)
        .set({
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
          sentFrom: newsletterFrom,
          sentBy: displaySentBy,
          sentByRaw: isGmailAdmin ? "" : rawAdminEmail,
          sentByUid: admin.uid,
          createdAt: new Date(),
        });
    } catch (logErr) {
      console.error("Newsletter log write failed:", logErr);
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
