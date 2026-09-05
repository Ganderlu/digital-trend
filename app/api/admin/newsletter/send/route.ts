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

const EMAIL_BATCH_SIZE = 40;

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
    const appUrl = (
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      ""
    )
      .replace(/\/$/, "")
      .toString();
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
      const promises = batch.map(async (r) => {
        try {
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
            subscriberEmail: r.email,
            year,
          });

          await sendEmail({
            to: r.email,
            subject,
            html,
            text,
          });

          return { ok: true as const, email: r.email };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown send error";
          return { ok: false as const, email: r.email, error: msg };
        }
      });

      const results = await Promise.all(promises);
      for (const res of results) {
        if (res.ok) sent.push(res.email);
        else failed.push({ email: res.email, error: res.error });
      }

      if (i + EMAIL_BATCH_SIZE < recipients.length) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    try {
      const db = getAdminDb();
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
          sentBy: admin.email || admin.uid,
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
