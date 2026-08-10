"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  Mail,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  Send,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type NewsletterHistoryItem = {
  newsletterId: string;
  subject: string;
  audience: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  sentBy?: string;
  createdAt: any;
  preview: {
    intro?: string;
    body?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    outro?: string;
    preheader?: string;
  };
};

const TEMPLATES: {
  id: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  intro: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  outro: string;
}[] = [
  {
    id: "monthly-update",
    name: "Monthly Performance Update",
    description: "Share portfolio highlights, returns, and market commentary.",
    subject: "Your Monthly Portfolio Update is Here",
    preheader:
      "See how your Digital-trend investments performed this month.",
    intro:
      "We hope this message finds you well. Each month, our team puts together a snapshot of what's happening in the markets and how it impacts your portfolio. Thank you for the continued trust you place in Digital-trend.",
    body:
      "· Portfolio performance for the month exceeded benchmark by +1.4%\n· Tech and sustainable equities sectors led the rally\n· The Digital-trend Wealth team has been rebalancing portfolios to lock in gains\n· Our 2026 outlook report will be published next week — stay tuned\n\nIf you'd like to discuss your strategy, reply to this email or schedule a call directly from your dashboard.",
    ctaLabel: "Review My Portfolio",
    ctaUrl: "https://digital-trend.example.com/dashboard",
    outro:
      "As a reminder, your dedicated advisor is always available. There's no question too big or too small — we're here to help.",
  },
  {
    id: "new-plan",
    name: "New Investment Plan Launch",
    description: "Announce a new plan or feature to your members.",
    subject: "Introducing the Digital-trend Global Income Plan",
    preheader:
      "A new way to generate steady, diversified monthly income.",
    intro:
      "Great news — after months of research and portfolio construction, we're officially launching the new Digital-trend Global Income Plan.",
    body:
      "Built for investors who want a steady stream of income alongside long-term growth, the Global Income Plan targets 48 diversified holdings across equities, bonds, REITs, and covered calls.\n\nKey features:\n· Estimated 5.2% annual yield with monthly distributions\n· Global sector diversification\n· Historically lower volatility vs. pure growth portfolios\n· Minimum investment: $2,500\n\nMembers can upgrade or open a new position directly from the dashboard.",
    ctaLabel: "Learn About the New Plan",
    ctaUrl: "https://digital-trend.example.com/investment-plans",
    outro:
      "If you'd like to know whether the Global Income Plan fits your goals, simply reply and we'll schedule a complimentary review.",
  },
  {
    id: "market-insight",
    name: "Market Insight & Guidance",
    description: "Quick-read market commentary during volatility.",
    subject: "Market Volatility: What it Means for Your Portfolio",
    preheader:
      "A quick perspective from the Digital-trend investment team.",
    intro:
      "You've probably seen the headlines — markets have been moving quickly this week. Here's our perspective in plain language.",
    body:
      "The recent pullback is primarily driven by inflation data and sector rotation. Importantly, the diversified portfolios we build for Digital-trend members are designed to weather exactly these kinds of storms.\n\nWhat we're watching:\n· Inflation trends and central bank commentary\n· Earnings quality across the holdings in your portfolio\n· Rebalancing opportunities where overweights have emerged\n\nThis is not a time for emotional decisions. Stick to the plan we built together — that's how long-term wealth is created.",
    ctaLabel: "Book an Advisor Call",
    ctaUrl: "https://digital-trend.example.com/contact",
    outro:
      "If you're feeling uneasy, you're not alone. We're here. A quick 15-minute call with your advisor can often provide the clarity you need.",
  },
  {
    id: "referral",
    name: "Referral Program Reminder",
    description: "Encourage members to share Digital-trend with friends.",
    subject: "Know someone who'd love Digital-trend?",
    preheader:
      "Invite a friend, and you both earn a bonus — it's that simple.",
    intro:
      "The best compliment we can receive is a referral from a member like you. Thank you to everyone who has already shared Digital-trend with friends and family.",
    body:
      "Here's how the referral program works:\n1. Share your unique referral link (available on the Referrals page)\n2. Your friend signs up and makes their first qualifying deposit\n3. You both receive a $100 bonus added to your account balance\n\nThere's no limit on referrals — refer as many people as you'd like.",
    ctaLabel: "Get My Referral Link",
    ctaUrl: "https://digital-trend.example.com/referrals",
    outro:
      "If you know someone who's been looking for a smarter way to invest, this could be the perfect nudge. Thank you, sincerely, for being part of the Digital-trend community.",
  },
  {
    id: "blank",
    name: "Blank / Custom Newsletter",
    description: "Start from scratch and write your own message.",
    subject: "",
    preheader: "",
    intro: "",
    body: "",
    ctaLabel: "",
    ctaUrl: "",
    outro: "",
  },
];

const AUDIENCE_OPTIONS: {
  value: "all" | "active_investors" | "test";
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "All Registered Users",
    description: "Every user account in the system.",
  },
  {
    value: "active_investors",
    label: "Active Investors Only",
    description: "Only users with currently active investments.",
  },
  {
    value: "test",
    label: "Send Test Email",
    description: "Send to a single test email address first.",
  },
];

export default function AdminNewsletterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [intro, setIntro] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [outro, setOutro] = useState("");

  const [audience, setAudience] = useState<"all" | "active_investors" | "test">(
    "all",
  );
  const [testEmail, setTestEmail] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [showTemplates, setShowTemplates] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    recipients: number;
    sent: number;
    failed: number;
    failedSample: { email: string; error: string }[];
    newsletterId: string;
  } | null>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeInvestors: 0,
    newslettersSent: 0,
    lastSentAt: null as Date | null,
  });
  const [history, setHistory] = useState<NewsletterHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      try {
        const token = await getIdToken(currentUser, true);
        setIdToken(token);

        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        let activeInvestors = 0;
        try {
          const invSnap = await getDocs(
            query(
              collection(db, "investments"),
              where("status", "==", "active"),
            ),
          );
          const uids = new Set<string>();
          invSnap.forEach((d) => {
            const uid =
              (d.data().userId as string) || (d.data().uid as string);
            if (uid) uids.add(uid);
          });
          activeInvestors = uids.size;
        } catch {
          activeInvestors = 0;
        }

        let newslettersSent = 0;
        let lastSentAt: Date | null = null;
        const historyItems: NewsletterHistoryItem[] = [];
        try {
          const nlSnap = await getDocs(
            query(
              collection(db, "newsletters"),
              orderBy("createdAt", "desc"),
              limit(10),
            ),
          );
          newslettersSent = nlSnap.size;
          nlSnap.forEach((doc) => {
            const d = doc.data();
            const created = d.createdAt?.toDate
              ? d.createdAt.toDate()
              : d.createdAt instanceof Date
                ? d.createdAt
                : new Date(d.createdAt);
            if (!lastSentAt) lastSentAt = created;
            historyItems.push({
              newsletterId: d.newsletterId || doc.id,
              subject: d.subject || "(No subject)",
              audience: d.audience || "all",
              totalRecipients: Number(d.totalRecipients || 0),
              sentCount: Number(d.sentCount || 0),
              failedCount: Number(d.failedCount || 0),
              sentBy: d.sentBy,
              createdAt: created,
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
        } catch {
          newslettersSent = 0;
        }

        setStats({
          totalUsers,
          activeInvestors,
          newslettersSent,
          lastSentAt,
        });
        setHistory(historyItems);
      } catch (err) {
        console.error("Newsletter page init error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setSubject(t.subject);
    setPreheader(t.preheader);
    setIntro(t.intro);
    setBody(t.body);
    setCtaLabel(t.ctaLabel);
    setCtaUrl(t.ctaUrl);
    setOutro(t.outro);
    setSelectedTemplateId(t.id);
    setShowTemplates(false);
    setResult(null);
    setError("");
  };

  const charCount = useMemo(() => body.length, [body]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!subject.trim()) {
      setError("Please enter a subject line.");
      return;
    }
    if (!body.trim()) {
      setError("Please write the newsletter body content.");
      return;
    }
    if (ctaLabel.trim() && !ctaUrl.trim()) {
      setError("Please provide a URL for the CTA button.");
      return;
    }
    if (ctaUrl.trim() && !/^https?:\/\//i.test(ctaUrl.trim())) {
      setError("CTA URL must start with http:// or https://");
      return;
    }
    if (audience === "test" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      setError("Please enter a valid test email address.");
      return;
    }
    if (!idToken) {
      setError("Authentication unavailable. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          subject: subject.trim(),
          preheader: preheader.trim() || undefined,
          intro: intro.trim() || undefined,
          body: body.trim(),
          ctaLabel: ctaLabel.trim() || undefined,
          ctaUrl: ctaUrl.trim() || undefined,
          outro: outro.trim() || undefined,
          audience,
          testEmail: testEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || "Failed to send newsletter. Please try again.",
        );
      }

      setResult({
        recipients: data.totals.recipients,
        sent: data.totals.sent,
        failed: data.totals.failed,
        failedSample: data.failedSample || [],
        newsletterId: data.newsletterId,
      });

      setStats((prev) => ({
        ...prev,
        newslettersSent: prev.newslettersSent + 1,
        lastSentAt: new Date(),
      }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handlePreviewClick() {
    const win = window.open("", "_blank");
    if (!win) return;

    const subjectEsc = subject || "Newsletter Preview";
    const preheaderEsc = preheader || "";
    const previewIntro =
      intro ||
      "The introduction text you write will appear here in the delivered email.";
    const previewBody =
      body ||
      "The main newsletter body content will appear here. Use line breaks to separate paragraphs and bullet points.";
    const previewCtaLabel = ctaLabel || "Visit Dashboard";
    const previewCtaUrl = ctaUrl || "#";
    const previewOutro =
      outro ||
      "The optional closing/reminder text (if any) will display here before the signature.";

    const appName = "Digital-trend";
    const year = new Date().getFullYear();
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const preheaderInvisible = preheaderEsc
      ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheaderEsc}</div>`
      : "";

    win.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Newsletter Preview</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  body { margin: 0; padding: 40px 20px; background: #e2e8f0; font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; }
  .wrapper { max-width: 640px; margin: 0 auto; }
  .label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; text-align: center; }
  ${preheaderInvisible ? "" : ""}
</style>
</head>
<body>
  <div class="wrapper">
    <p class="label">PREVIEW · HOW IT WILL LOOK IN INBOX</p>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 30px -15px rgba(15,23,42,0.15);overflow:hidden;">
      <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:10px 16px;display:flex;gap:12px;align-items:center;">
        <div style="display:flex;gap:6px;">
          <span style="width:12px;height:12px;border-radius:50%;background:#ef4444;"></span>
          <span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;"></span>
          <span style="width:12px;height:12px;border-radius:50%;background:#10b981;"></span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;">
          <span style="font-size:12px;color:#64748b;">Inbox Preview</span>
        </div>
      </div>
      <div style="padding:20px 24px;border-bottom:1px solid #f1f5f9;">
        <div style="font-size:13px;color:#334155;">
          <div><strong style="color:#0f172a;">From:</strong> ${appName} &lt;newsletter@${appName.toLowerCase()}.com&gt;</div>
          <div style="margin-top:4px;"><strong style="color:#0f172a;">Subject:</strong> <span style="color:#0f172a;">${subjectEsc}</span></div>
          ${preheaderEsc ? `<div style="margin-top:4px;color:#64748b;font-size:12px;">${preheaderEsc}</div>` : ""}
        </div>
      </div>
      <div style="padding:0;">
      <div style="overflow: hidden; border-radius: 0 0 0 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%); padding: 44px 40px; position: relative;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%);"></div>
        <div style="position: relative;">
          <div style="display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);">
            <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6ee7b7;">Monthly Update</span>
          </div>
          <h1 style="margin: 18px 0 0 0; font-size: 32px; font-weight: 800; color: #ffffff; line-height: 1.15;">
            ${subjectEsc}
          </h1>
          ${preheaderEsc ? `<p style="margin: 12px 0 0 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">${preheaderEsc}</p>` : ""}
        </div>
      </div>
      <div style="background-color: #ffffff; padding: 40px 40px 32px 40px;">
        <p style="margin: 0 0 18px 0; font-size: 16px; font-weight: 600; color: #0f172a;">Hi there,</p>
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.75; color: #475569;">${previewIntro.replace(/\n/g, "<br/>")}</p>

        <div style="padding: 28px 28px; border-radius: 18px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%); border: 1px solid #dcfce7;">
          <div style="font-size: 15px; line-height: 1.8; color: #1e293b;">
            ${previewBody.replace(/\n/g, "<br/>")}
          </div>
        </div>

        <div style="margin-top: 32px; text-align: center;">
          <a href="${previewCtaUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; border-radius: 999px; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 14px 28px -10px rgba(5,150,105,0.55);">
            ${previewCtaLabel} →
          </a>
        </div>

        <p style="margin: 32px 0 0 0; font-size: 15px; line-height: 1.75; color: #475569;">${previewOutro.replace(/\n/g, "<br/>")}</p>

        <div style="margin-top: 40px; padding-top: 28px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Warm regards,</p>
          <p style="margin: 0; font-size: 15px; color: #334155;">The <strong style="color: #059669;">${appName}</strong> Team</p>
        </div>
      </div>
      <div style="overflow: hidden; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 28px 40px;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;">Quick Links</div>
        <div style="margin-top: 10px; font-size: 13px;">
          <a href="#" style="color: #059669; text-decoration: none; font-weight: 600;">Visit Dashboard</a>  ·  Plans  ·  FAQs  ·  Contact
        </div>
      </div>
      <div style="padding: 20px 40px 40px 40px; background:#ffffff;">
        <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #94a3b8;">Sent on ${dateStr} · This email was sent to member@example.com · © ${year} ${appName}. All rights reserved.</p>
      </div>
      </div>
    </div>
  </div>
</body>
</html>
    `);
    win.document.close();
  }

  function audienceLabel(aud: string) {
    const opt = AUDIENCE_OPTIONS.find((o) => o.value === aud);
    return opt?.label || aud;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="mx-auto max-w-7xl p-6 lg:p-8"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Admin Tools
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-50 sm:text-3xl">
              Newsletter Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Compose and send professional branded newsletters to your members
              — instantly or test first. All sends are automatically logged.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total Users
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-50">
                  {stats.totalUsers.toLocaleString()}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Eligible for &quot;All Users&quot; audience
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Active Investors
                </p>
                <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                  {stats.activeInvestors.toLocaleString()}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Members with active investments
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Newsletters Sent
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-50">
                  {stats.newslettersSent.toLocaleString()}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Lifetime logged campaigns
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Last Sent
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-50">
                  {stats.lastSentAt
                    ? stats.lastSentAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/40 text-slate-300">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {stats.lastSentAt
                ? stats.lastSentAt.toLocaleString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "No sends yet — let's change that"}
            </p>
          </div>
        </div>

        {/* Templates Bar */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Start with a professional template
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-written copy for the most common newsletter types.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTemplates((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              {showTemplates ? (
                <>
                  Hide Templates
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Browse Templates
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          {showTemplates && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    selectedTemplateId === t.id
                      ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-100">
                      {t.name}
                    </p>
                    {selectedTemplateId === t.id && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Compose */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-50">
                  Compose Newsletter
                </h2>
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Eye className="h-4 w-4" />
                  Live Preview
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="nl-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Subject Line <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nl-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Your Monthly Portfolio Update is Here"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nl-preheader"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Preheader Text
                    <span className="ml-1 font-normal normal-case tracking-normal text-slate-500">
                      (shown next to subject in inbox)
                    </span>
                  </label>
                  <input
                    id="nl-preheader"
                    type="text"
                    value={preheader}
                    onChange={(e) => setPreheader(e.target.value)}
                    placeholder="Short summary shown in Gmail / Outlook list view"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nl-intro"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Opening Introduction
                    <span className="ml-1 font-normal normal-case tracking-normal text-slate-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="nl-intro"
                    rows={3}
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Warm opening paragraph. Example: We hope this message finds you well. Each month our team puts together a snapshot..."
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="nl-body"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      Main Content / Body{" "}
                      <span className="text-red-400">*</span>
                      <span className="ml-2 font-normal normal-case tracking-normal text-slate-500">
                        (use line breaks for paragraphs, · for bullets)
                      </span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-500">
                      {charCount} characters
                    </span>
                  </div>
                  <textarea
                    id="nl-body"
                    rows={10}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={`Write the main newsletter content here.\n\nTip: Use blank lines between paragraphs and start lines with · for bullets.`}
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nl-cta-label"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      CTA Button Label
                      <span className="ml-1 font-normal normal-case tracking-normal text-slate-500">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="nl-cta-label"
                      type="text"
                      value={ctaLabel}
                      onChange={(e) => setCtaLabel(e.target.value)}
                      placeholder="e.g. Review My Portfolio"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nl-cta-url"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      CTA Button URL
                      <span className="ml-1 font-normal normal-case tracking-normal text-slate-500">
                        (if label is set)
                      </span>
                    </label>
                    <input
                      id="nl-cta-url"
                      type="url"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="https://example.com/dashboard"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nl-outro"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Closing / Reminder
                    <span className="ml-1 font-normal normal-case tracking-normal text-slate-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="nl-outro"
                    rows={3}
                    value={outro}
                    onChange={(e) => setOutro(e.target.value)}
                    placeholder="Final sentence or reminder before the team signature."
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {result && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-emerald-200">
                      Newsletter dispatched successfully
                    </h3>
                    <p className="mt-1 text-xs text-emerald-200/70">
                      Campaign ID: {result.newsletterId}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Recipients
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-100">
                          {result.recipients.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                          Sent OK
                        </p>
                        <p className="mt-1 text-xl font-bold text-emerald-300">
                          {result.sent.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-red-300">
                          Failed
                        </p>
                        <p className="mt-1 text-xl font-bold text-red-200">
                          {result.failed.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {result.failedSample && result.failedSample.length > 0 && (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-300">
                          Sample of failed addresses
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-red-200/80">
                          {result.failedSample.slice(0, 5).map((f) => (
                            <li key={f.email}>
                              <span className="font-semibold">{f.email}</span>
                              <span className="text-red-300/60">
                                {" "}
                                — {f.error}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Audience & Send */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
                <h3 className="text-sm font-bold text-slate-50 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  Target Audience
                </h3>
                <div className="mt-4 space-y-3">
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`block cursor-pointer rounded-xl border p-4 transition-all ${
                        audience === opt.value
                          ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                          : "border-white/10 bg-slate-950 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="audience"
                          value={opt.value}
                          checked={audience === opt.value}
                          onChange={() => setAudience(opt.value)}
                          className="mt-1 h-4 w-4 accent-emerald-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-100">
                            {opt.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {audience === "test" && (
                  <div className="mt-4">
                    <label
                      htmlFor="nl-test-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      Test Email Address
                    </label>
                    <input
                      id="nl-test-email"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-500/20 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-2"
                    />
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Tip: Send a test to yourself first to see how the
                      template renders in your inbox.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
                <h3 className="text-sm font-bold text-slate-50 flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-400" />
                  Summary & Send
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Subject ready</dt>
                    <dd className="font-semibold">
                      {subject.trim() ? (
                        <span className="text-emerald-400">✓ Set</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Body written</dt>
                    <dd className="font-semibold">
                      {body.trim() ? (
                        <span className="text-emerald-400">✓ Set</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">CTA button</dt>
                    <dd className="font-semibold">
                      {ctaLabel.trim() ? (
                        ctaUrl.trim() ? (
                          <span className="text-emerald-400">✓ Set</span>
                        ) : (
                          <span className="text-amber-300">⚠ Missing URL</span>
                        )
                      ) : (
                        <span className="text-slate-500">— Skipped</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Audience</dt>
                    <dd className="font-semibold text-slate-200">
                      {audienceLabel(audience)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <dt className="text-slate-400 font-semibold">
                      Estimated Recipients
                    </dt>
                    <dd className="text-xl font-bold text-slate-50">
                      {audience === "test"
                        ? 1
                        : audience === "active_investors"
                          ? stats.activeInvestors.toLocaleString()
                          : stats.totalUsers.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Newsletter...
                    </>
                  ) : audience === "test" ? (
                    <>
                      <Send className="h-4 w-4" />
                      Send Test Email Now
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Newsletter Now
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500 text-center">
                  <Clock className="h-3 w-3 inline mr-1 align-[-2px]" />
                  Delivery is batched for reliability. Large sends may take a
                  few minutes. All sends are logged to History.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* History */}
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Activity
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-50">
                Recent Newsletter History
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Showing last {history.length} campaigns
            </p>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                No newsletters yet
              </h3>
              <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
                Send your first campaign above — start with a test to yourself
                to verify how everything looks.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-900 overflow-hidden">
              <div className="divide-y divide-white/5">
                {history.map((h) => {
                  const expanded = expandedId === h.newsletterId;
                  return (
                    <div key={h.newsletterId}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : h.newsletterId)
                        }
                        className="w-full text-left p-5 transition hover:bg-white/5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-4 min-w-0">
                            <div
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                h.audience === "test"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}
                            >
                              <Mail className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-100">
                                {h.subject}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {h.createdAt instanceof Date
                                    ? h.createdAt.toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })
                                    : "—"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                                  {audienceLabel(h.audience)}
                                </span>
                                <span>Sent by {h.sentBy || "Admin"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <div className="flex items-center gap-4 text-right">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Sent
                                </p>
                                <p className="text-sm font-bold text-emerald-300">
                                  {h.sentCount.toLocaleString()}/
                                  {h.totalRecipients.toLocaleString()}
                                </p>
                              </div>
                              {h.failedCount > 0 && (
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Failed
                                  </p>
                                  <p className="text-sm font-bold text-red-300">
                                    {h.failedCount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            {expanded ? (
                              <ChevronUp className="h-5 w-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </button>
                      {expanded && (
                        <div className="border-t border-white/5 bg-slate-950/60 p-5 sm:pl-[calc(1.25rem+4rem)]">
                          {h.preview.preheader && (
                            <div className="mb-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Preheader
                              </p>
                              <p className="mt-1 text-xs text-slate-400 italic">
                                {h.preview.preheader}
                              </p>
                            </div>
                          )}
                          {h.preview.intro && (
                            <div className="mb-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Introduction
                              </p>
                              <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {h.preview.intro}
                              </p>
                            </div>
                          )}
                          <div className="mb-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              Body
                            </p>
                            <div className="mt-2 rounded-xl border border-white/5 bg-slate-900/80 p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {h.preview.body || "(empty)"}
                            </div>
                          </div>
                          {h.preview.ctaLabel && (
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                CTA:
                              </span>
                              <a
                                href={h.preview.ctaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300 hover:bg-emerald-500/25"
                              >
                                {h.preview.ctaLabel}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                              {h.preview.ctaUrl && (
                                <span className="text-slate-500 truncate max-w-xs">
                                  {h.preview.ctaUrl}
                                </span>
                              )}
                            </div>
                          )}
                          {h.preview.outro && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Closing
                              </p>
                              <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {h.preview.outro}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
