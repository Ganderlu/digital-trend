import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function toIso(val: any): string | null {
  if (val == null) return null;
  try {
    let d: Date;
    if (typeof val.toDate === "function") {
      d = val.toDate();
    } else if (val instanceof Date) {
      d = val;
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const [usersSnap, invSnap, nlSnap] = await Promise.all([
      db.collection("users").get(),
      db.collection("investments").where("status", "==", "active").get(),
      db.collection("newsletters").orderBy("createdAt", "desc").limit(10).get(),
    ]);

    const totalUsers = usersSnap.size;

    const investorUids = new Set<string>();
    invSnap.forEach((d) => {
      const uid = (d.data().userId as string) || (d.data().uid as string);
      if (uid) investorUids.add(uid);
    });
    const activeInvestors = investorUids.size;

    let newslettersSent = 0;
    let lastSentAt: string | null = null;
    const history: any[] = [];

    newslettersSent = nlSnap.size;
    nlSnap.forEach((doc) => {
      const d = doc.data();
      const createdIso = toIso(d.createdAt);
      if (createdIso && !lastSentAt) lastSentAt = createdIso;
      history.push({
        newsletterId: d.newsletterId || doc.id,
        subject: d.subject || "(No subject)",
        audience: d.audience || "all",
        totalRecipients: Number(d.totalRecipients || 0),
        sentCount: Number(d.sentCount || 0),
        failedCount: Number(d.failedCount || 0),
        sentBy: d.sentBy,
        createdAt: createdIso,
        preview: {
          intro: typeof d.intro === "string" ? d.intro : "",
          body: typeof d.body === "string" ? d.body : "",
          ctaLabel: typeof d.ctaLabel === "string" ? d.ctaLabel : "",
          ctaUrl: typeof d.ctaUrl === "string" ? d.ctaUrl : "",
          outro: typeof d.outro === "string" ? d.outro : "",
          preheader: typeof d.preheader === "string" ? d.preheader : "",
        },
      });
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeInvestors,
        newslettersSent,
        lastSentAt,
      },
      history,
    });
  } catch (error: any) {
    console.error("[admin/newsletter/stats] ERROR:", error);
    const status =
      error?.message === "Forbidden" ||
      error?.message?.startsWith("Missing Authorization")
        ? 403
        : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}
