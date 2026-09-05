"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Wallet,
  TrendingUp,
  Layers,
  RefreshCw,
  Users,
  Play,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gift,
  UserPlus,
  User,
  Rocket,
  Headphones,
  Circle,
  ArrowRight,
  Copy,
  CheckCircle,
  Share2,
  Info,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  balance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  activeDeposits?: number;
  referralCode?: string;
  referralEarnings?: number;
  matrixBalance?: number;
  matrixCycles?: number;
  matrixLevel?: number;
};

type ReferredUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: Timestamp;
  status: "active" | "inactive";
  totalInvested?: number;
  activeDeposits?: number;
  referredBy?: string;
};

type MatrixCycle = {
  id: string;
  matrixId: string;
  position: string;
  status: "Active" | "Completed" | "Pending";
  progress: number;
  joined?: Date;
  planName?: string;
  amount?: number;
};

type MatrixPayout = {
  id: string;
  type: string;
  amount: number;
  date: Date;
  source?: string;
};

function formatCurrency(n?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n ?? 0);
}

function formatDate(d?: Date | Timestamp | any) {
  if (!d) return "N/A";
  const date = d?.toDate ? d.toDate() : d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

type MatrixLevelFilled = {
  total: number;
  filled: number;
};

function computeLevelStats(referrals: ReferredUser[]): {
  level1: MatrixLevelFilled;
  level2: MatrixLevelFilled;
  level3: MatrixLevelFilled;
} {
  const l1Count = Math.min(referrals.length, 3);
  const l2Count = Math.min(Math.max(referrals.length - 3, 0), 9);
  const l3Count = Math.min(Math.max(referrals.length - 12, 0), 27);
  return {
    level1: { total: 3, filled: l1Count },
    level2: { total: 9, filled: l2Count },
    level3: { total: 27, filled: l3Count },
  };
}

function MatrixNode({
  name,
  status,
  isYou = false,
  isDirect = false,
}: {
  name?: string;
  status: "active" | "empty" | "you" | "inactive";
  isYou?: boolean;
  isDirect?: boolean;
}) {
  const getStyles = () => {
    if (isYou || status === "you")
      return {
        ring: "ring-4 ring-violet-500/50",
        bg: "bg-violet-600",
        text: "text-white",
        border: "border-violet-400/30",
      };
    if (status === "active")
      return {
        ring: "ring-2 ring-emerald-500/30",
        bg: "bg-emerald-600",
        text: "text-white",
        border: "border-emerald-400/20",
      };
    if (status === "inactive")
      return {
        ring: "ring-2 ring-amber-500/30",
        bg: "bg-amber-700",
        text: "text-white",
        border: "border-amber-400/20",
      };
    if (isDirect)
      return {
        ring: "ring-2 ring-sky-500/30",
        bg: "bg-sky-600",
        text: "text-white",
        border: "border-sky-400/20",
      };
    return {
      ring: "ring-2 ring-white/5",
      bg: "bg-slate-800/40 border-dashed border border-white/10",
      text: "text-slate-500",
      border: "",
    };
  };

  const styles = getStyles();
  const shortName = name
    ? name
        .split(" ")
        .map((p) => p[0]?.toUpperCase() ?? "")
        .filter(Boolean)
        .slice(0, 2)
        .join("") || name[0]?.toUpperCase() || "?"
    : "";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative flex h-11 w-11 items-center justify-center rounded-full ${styles.ring} ${styles.bg} ${styles.border} transition-all`}
      >
        {isYou || status === "you" ? (
          <User className={`h-5 w-5 ${styles.text}`} />
        ) : status !== "empty" ? (
          <span
            className={`text-xs font-bold tracking-tight ${styles.text}`}
          >
            {shortName}
          </span>
        ) : (
          <User className={`h-4 w-4 opacity-40 ${styles.text}`} />
        )}
      </div>
      {status !== "empty" ? (
        <div className="text-center">
          <p
            className={`text-xs font-semibold truncate max-w-[80px] ${
              isYou ? "text-violet-300" : "text-slate-200"
            }`}
          >
            {isYou ? "You" : name}
          </p>
          <p
            className={`text-[10px] font-medium ${
              status === "active"
                ? "text-emerald-400"
                : status === "inactive"
                  ? "text-amber-400"
                  : "text-slate-500"
            }`}
          >
            {isYou ? "" : status === "active" ? "Active" : "Inactive"}
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-600">Empty</p>
      )}
    </div>
  );
}

function LevelBadge({
  level,
  filled,
  total,
}: {
  level: number;
  filled: number;
  total: number;
}) {
  const pct = Math.round((filled / total) * 100);
  return (
    <div className="w-20 rounded-xl border border-white/5 bg-slate-900/60 p-2.5 text-center">
      <p className="text-xs font-bold text-indigo-300">Level {level}</p>
      <p className="text-sm font-bold text-slate-200 tabular-nums">
        {filled} / {total}
      </p>
      <p className="text-[10px] text-slate-500 mt-0.5">{pct}%</p>
    </div>
  );
}

export default function MatrixPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [cycles, setCycles] = useState<MatrixCycle[]>([]);
  const [payouts, setPayouts] = useState<MatrixPayout[]>([]);

  const [activeNav, setActiveNav] = useState("overview");
  const [ongoingPage, setOngoingPage] = useState(1);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      try {
        const profilePromise = getDoc(doc(db, "users", currentUser.uid)).then(
          (d) => (d.exists() ? (d.data() as UserProfile) : null),
        );

        const referralsPromise = getDocs(
          query(collection(db, "users"), where("referredBy", "==", currentUser.uid)),
        ).then((snap) =>
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              status:
                ((data.activeDeposits || 0) > 0 ||
                  (data.totalDeposits || 0) > 0)
                  ? "active"
                  : "inactive",
            } as ReferredUser;
          }),
        );

        const cyclesPromise = getDocs(
          query(
            collection(db, "investments"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(50),
          ),
        )
          .then((snap) =>
            snap.docs.map((d) => {
              const data = d.data();
              const startTs =
                (data.startDate || data.createdAt) as Timestamp | undefined;
              const amount = (data.amount ?? 0) as number;
              const totalReturn = (data.totalReturn ?? amount * 2) as number;
              const earned = (data.earningsPaid ?? 0) as number;
              const progress =
                totalReturn > 0
                  ? Math.min(100, Math.round((earned / totalReturn) * 100))
                  : 0;
              const statusVal = (data.status as string)?.toLowerCase?.() ?? "active";
              let status: MatrixCycle["status"] = "Active";
              if (statusVal === "mature" || statusVal === "completed")
                status = "Completed";
              else if (statusVal === "pending") status = "Pending";
              return {
                id: d.id,
                matrixId:
                  data.matrixId ||
                  `M-${(data.planId || "MAT").toString().toUpperCase()}-${d.id.slice(-5).toUpperCase()}`,
                position:
                  data.matrixPosition ||
                  `${data.planName || "Matrix Plan"} · ${data.durationDays || 30}d`,
                status,
                progress,
                joined: startTs?.toDate?.() ?? new Date(),
                planName: data.planName,
                amount,
              } satisfies MatrixCycle;
            }),
          )
          .catch((err) => {
            console.error("investments read failed:", err);
            return [] as MatrixCycle[];
          });

        const payoutsPromise = getDocs(
          query(
            collection(db, "earnings"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(50),
          ),
        )
          .then((snap) =>
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                type: data.type || data.source || "Matrix Payout",
                amount: (data.amount ?? 0) as number,
                date:
                  (data.createdAt as Timestamp)?.toDate?.() ??
                  (data.earnedAt as Timestamp)?.toDate?.() ??
                  new Date(),
                source: data.source,
              } satisfies MatrixPayout;
            }),
          )
          .catch((err) => {
            console.error("earnings read failed:", err);
            return [] as MatrixPayout[];
          });

        const [p, r, c, pa] = await Promise.all([
          profilePromise,
          referralsPromise,
          cyclesPromise,
          payoutsPromise,
        ]);

        if (p) setProfile(p);
        setReferrals(r);
        setCycles(c);
        setPayouts(pa);
      } catch (err) {
        console.error("Matrix Plan data load error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const stats = useMemo(() => {
    const totalReferrals = referrals.length;
    const matrixBalance = profile?.matrixBalance ?? profile?.balance ?? 0;
    const totalEarned =
      payouts.reduce((s, p) => s + (p.amount || 0), 0) ||
      profile?.totalEarnings ||
      0;
    const activeMatrices = cycles.filter(
      (c) => c.status === "Active" || c.status === "Pending",
    ).length;
    const completedCycles =
      profile?.matrixCycles ||
      cycles.filter((c) => c.status === "Completed").length;
    return {
      matrixBalance,
      totalEarned,
      activeMatrices,
      completedCycles,
      totalReferrals,
    };
  }, [referrals, profile, payouts, cycles]);

  const matrixNavItems = [
    { key: "overview", label: "Overview", icon: Layers },
    { key: "my-matrix", label: "My Matrix", icon: Users },
    { key: "my-earnings", label: "My Earnings", icon: TrendingUp },
    { key: "payout-history", label: "Payout History", icon: Wallet },
    { key: "upgrade-plan", label: "Upgrade Plan", icon: Rocket },
    { key: "leaderboard", label: "Leaderboard", icon: Gift },
  ];

  const levelStats = useMemo(() => computeLevelStats(referrals), [referrals]);

  const level2Data = useMemo(() => {
    const arr: ReferredUser[] = [];
    for (let i = 0; i < 3; i++) arr.push(referrals[i] || (null as any));
    return arr;
  }, [referrals]);

  const level3Data = useMemo(() => {
    const arr: (ReferredUser | null)[] = [];
    for (let i = 3; i < 12; i++) arr.push(referrals[i] || null);
    return arr;
  }, [referrals]);

  const level4Data = useMemo(() => {
    const arr: (ReferredUser | null)[] = [];
    for (let i = 12; i < 23; i++) arr.push(referrals[i] || null);
    return arr;
  }, [referrals]);

  const referralLink =
    typeof window !== "undefined" && user
      ? `${window.location.origin}/register?ref=${user.uid}`
      : "";

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Matrix Plan",
          text: "Join my investment matrix and start earning with me.",
          url: referralLink,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const paginatedCycles = useMemo(() => {
    const start = (ongoingPage - 1) * PAGE_SIZE;
    return cycles.slice(start, start + PAGE_SIZE);
  }, [cycles, ongoingPage]);
  const totalCyclePages = Math.max(1, Math.ceil(cycles.length / PAGE_SIZE));

  const paginatedPayouts = useMemo(() => {
    const start = (payoutsPage - 1) * PAGE_SIZE;
    return payouts.slice(start, start + PAGE_SIZE);
  }, [payouts, payoutsPage]);
  const totalPayoutPages = Math.max(1, Math.ceil(payouts.length / PAGE_SIZE));

  const nextPayout = useMemo(() => {
    const activeCycle = cycles.find((c) => c.status === "Active");
    if (activeCycle?.amount) return Math.round(activeCycle.amount * 0.84 * 100) / 100;
    const lastPayout = payouts[0]?.amount;
    return lastPayout && lastPayout > 0 ? lastPayout : 50;
  }, [cycles, payouts]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading Matrix Plan...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const greetingName =
    profile?.firstName || user?.displayName?.split(" ")[0] || "Trader";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-50">
              Matrix Plan
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, {greetingName}. Participate in our multi-level
              matrix scheme to earn automated rewards.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/investment-plans")}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 hover:text-violet-200"
            >
              <Play className="h-4 w-4 fill-violet-400" />
              How It Works
            </button>
            <button
              onClick={() => router.push("/plans")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 transition"
            >
              <Rocket className="h-4 w-4" />
              Join Matrix
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label: "Matrix Balance",
              value: formatCurrency(stats.matrixBalance),
              sub: "Available to reinvest",
              icon: Wallet,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              border: "border-blue-500/20",
              onClick: () => router.push("/deposit"),
            },
            {
              label: "Total Earned",
              value: formatCurrency(stats.totalEarned),
              sub: "Lifetime earnings",
              icon: TrendingUp,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/20",
              onClick: () => setActiveNav("my-earnings"),
            },
            {
              label: "Active Matrix",
              value: String(stats.activeMatrices),
              sub: "Currently active",
              icon: Layers,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
              border: "border-violet-500/20",
              onClick: () => setActiveNav("my-matrix"),
            },
            {
              label: "Total Cycles",
              value: String(stats.completedCycles),
              sub: "Completed cycles",
              icon: RefreshCw,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
              onClick: () => setActiveNav("payout-history"),
            },
            {
              label: "Total Referrals",
              value: String(stats.totalReferrals),
              sub: "In your matrix",
              icon: Users,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10",
              border: "border-indigo-500/20",
              onClick: () => router.push("/referrals"),
            },
          ].map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              className={`text-left w-full rounded-2xl border ${s.border} bg-slate-900/60 p-4 hover:bg-slate-900 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400 truncate">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold text-slate-50 mt-0.5 tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left: Sub Nav + Promos + Info + Support */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2 space-y-4">
            {/* Matrix Sub Navigation */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Matrix Plan
              </p>
              <nav className="space-y-0.5">
                {matrixNavItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveNav(item.key);
                      if (item.key === "upgrade-plan") router.push("/plans");
                      if (item.key === "leaderboard") router.push("/referrals");
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      activeNav === item.key
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Increase Your Earnings */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
              <h3 className="text-sm font-bold text-slate-200">
                Increase Your Earnings
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Upgrade to a higher matrix level and earn bigger rewards.
              </p>
              <div className="mt-3 flex items-end justify-between">
                <button
                  onClick={() => router.push("/plans")}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
                >
                  Upgrade Now
                </button>
                <Rocket className="h-16 w-16 -mb-1 -mr-1 text-violet-500/70" />
              </div>
            </div>

            {/* Plan Information */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                Plan Information
              </p>
              <div className="space-y-2.5 text-xs">
                {[
                  { k: "Plan Type", v: "3x Matrix" },
                  { k: "Total Levels", v: "3 Levels" },
                  { k: "Max Positions", v: `${levelStats.level1.total + levelStats.level2.total + levelStats.level3.total}` },
                  { k: "Entry Amount", v: "$50" },
                  {
                    k: "Your Level",
                    v: `Level ${profile?.matrixLevel || 1}`,
                    color: "text-violet-300",
                  },
                  { k: "Auto-Pool", v: "Enabled", color: "text-emerald-400" },
                  { k: "Re-entry", v: "Enabled", color: "text-emerald-400" },
                  { k: "Payout Type", v: "Instant", color: "text-sky-400" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-500">{row.k}</span>
                    <span
                      className={`font-semibold ${row.color || "text-slate-200"}`}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Need Help?
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Our support team is here to help you.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/contact")}
                className="mt-4 w-full rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/10"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Center + Right */}
          <div className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-5">
            {/* Referral Link quick card */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90 p-4 lg:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 border border-violet-500/20">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Your Matrix Referral Link
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400 max-w-lg">
                      Share this link. Anyone who signs up will be placed
                      directly into your matrix tree.
                    </p>
                  </div>
                </div>
                <div className="flex w-full lg:w-auto items-center gap-2 rounded-xl border border-white/10 bg-slate-950 p-2 max-w-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-400">
                    <Info className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-transparent text-xs font-medium text-slate-300 outline-none min-w-0 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    title="Copy link"
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    title="Share link"
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Position + Details Row */}
            <div className="grid grid-cols-12 gap-5">
              {/* Your Matrix Position */}
              <div className="col-span-12 xl:col-span-8 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-slate-100">
                      Your Matrix Position
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                      <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" />
                      Active
                    </span>
                    <button
                      onClick={() => setActiveNav("my-matrix")}
                      className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View full matrix
                    </button>
                  </div>
                </div>

                {/* Matrix Tree */}
                <div className="relative rounded-xl border border-white/5 bg-slate-950/40 p-4 lg:p-6 overflow-x-auto">
                  <div className="flex min-w-[700px] gap-6">
                    {/* Level Labels */}
                    <div className="flex flex-col items-center justify-between pt-12 pb-8 gap-6">
                      <LevelBadge
                        level={1}
                        filled={levelStats.level1.filled}
                        total={levelStats.level1.total}
                      />
                      <LevelBadge
                        level={2}
                        filled={levelStats.level2.filled}
                        total={levelStats.level2.total}
                      />
                      <LevelBadge
                        level={3}
                        filled={levelStats.level3.filled}
                        total={levelStats.level3.total}
                      />
                    </div>

                    {/* Matrix Visual */}
                    <div className="flex-1 flex flex-col items-center gap-10 relative">
                      {/* Level 1 - You */}
                      <div className="relative z-10">
                        <MatrixNode status="you" isYou />
                      </div>

                      {/* Level 2 */}
                      <div className="flex items-center gap-6 lg:gap-12">
                        {Array.from({ length: 3 }).map((_, i) => {
                          const u = level2Data[i];
                          if (!u)
                            return (
                              <MatrixNode
                                key={`l2-${i}`}
                                name={`L1-${i + 1}`}
                                status="empty"
                                isDirect
                              />
                            );
                          return (
                            <MatrixNode
                              key={`l2-${u.id}`}
                              name={`${u.firstName || "User"} ${u.lastName || ""}`.trim()}
                              status={u.status}
                              isDirect
                            />
                          );
                        })}
                      </div>

                      {/* Level 3 */}
                      <div className="flex items-center gap-3 lg:gap-6 flex-wrap justify-center max-w-[620px]">
                        {Array.from({ length: 9 }).map((_, i) => {
                          const u = level3Data[i];
                          if (!u)
                            return (
                              <MatrixNode
                                key={`l3-${i}`}
                                name={`L2-${i + 1}`}
                                status="empty"
                              />
                            );
                          return (
                            <MatrixNode
                              key={`l3-${u.id}`}
                              name={`${u.firstName || "User"} ${u.lastName || ""}`.trim()}
                              status={u.status}
                            />
                          );
                        })}
                      </div>

                      {/* Level 4 (extension preview) */}
                      <div className="flex items-center gap-1.5 lg:gap-2.5 flex-wrap justify-center max-w-[760px]">
                        {Array.from({ length: 11 }).map((_, i) => {
                          const u = level4Data[i];
                          if (!u)
                            return (
                              <MatrixNode
                                key={`l4-${i}`}
                                name={`L3-${i + 1}`}
                                status="empty"
                              />
                            );
                          return (
                            <MatrixNode
                              key={`l4-${u.id}`}
                              name={`${u.firstName || "User"} ${u.lastName || ""}`.trim()}
                              status={u.status}
                            />
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-white/5 mt-2 w-full">
                        {[
                          { c: "bg-emerald-500", l: "Active" },
                          { c: "bg-violet-500", l: "You" },
                          { c: "bg-sky-500", l: "Direct Referral" },
                          { c: "bg-amber-600", l: "Inactive" },
                          {
                            c: "bg-transparent ring-1 ring-white/10",
                            l: "Empty Position",
                            ring: true,
                          },
                        ].map((lg) => (
                          <div key={lg.l} className="flex items-center gap-2">
                            {lg.ring ? (
                              <span
                                className={`h-3 w-3 rounded-full ${lg.c}`}
                              />
                            ) : (
                              <span
                                className={`h-3 w-3 rounded-full ${lg.c}`}
                              />
                            )}
                            <span className="text-xs text-slate-400">
                              {lg.l}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matrix Details + Next Payout */}
              <div className="col-span-12 xl:col-span-4 space-y-4">
                {/* Matrix Details */}
                <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                  <h2 className="text-base font-bold text-slate-100 mb-4">
                    Matrix Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    {[
                      { k: "Plan Name", v: "3x Matrix Plan" },
                      { k: "Total Levels", v: "3" },
                      {
                        k: "Positions Filled",
                        v: `${levelStats.level1.filled + levelStats.level2.filled + levelStats.level3.filled} / ${levelStats.level1.total + levelStats.level2.total + levelStats.level3.total}`,
                      },
                      { k: "Entry Amount", v: "$50" },
                      {
                        k: "Re-entry",
                        v: "Enabled",
                        color: "text-emerald-400",
                      },
                      {
                        k: "Auto-Pool",
                        v: "Enabled",
                        color: "text-emerald-400",
                      },
                      { k: "Payout Type", v: "Instant", color: "text-sky-400" },
                      { k: "Commission", v: "100%", color: "text-violet-400" },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-slate-400 text-xs">{row.k}</span>
                        <span
                          className={`font-bold text-sm tabular-nums ${row.color || "text-slate-100"}`}
                        >
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => router.push("/plans")}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 inline-flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Join New Matrix
                  </button>
                  <p className="mt-2.5 text-[11px] text-slate-500 text-center leading-relaxed">
                    Start a new matrix cycle and unlock more earning
                    opportunities.
                  </p>
                </div>

                {/* Next Payout */}
                <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400">
                        Next Payout
                      </p>
                      <p className="text-2xl font-bold text-slate-50 mt-0.5 tabular-nums">
                        {formatCurrency(nextPayout)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        When your matrix fills completely
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/withdraw")}
                      className="rounded-xl bg-sky-500/15 border border-sky-500/20 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ongoing Matrix + Recent Payouts */}
            <div className="grid grid-cols-12 gap-5">
              {/* Ongoing Matrix */}
              <div className="col-span-12 xl:col-span-8 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-100">
                      Ongoing Matrix
                    </h2>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300 tabular-nums">
                      {cycles.length} total
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setOngoingPage((p) => Math.max(1, p - 1))
                      }
                      disabled={ongoingPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-800 text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] text-slate-400 tabular-nums w-12 text-center">
                      {ongoingPage}/{totalCyclePages}
                    </span>
                    <button
                      onClick={() =>
                        setOngoingPage((p) =>
                          p < totalCyclePages ? p + 1 : p,
                        )
                      }
                      disabled={ongoingPage >= totalCyclePages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-800 text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/5 text-xs">
                        <th className="py-3 px-2 font-medium">#</th>
                        <th className="py-3 px-2 font-medium">Matrix ID</th>
                        <th className="py-3 px-2 font-medium">Position</th>
                        <th className="py-3 px-2 font-medium">Amount</th>
                        <th className="py-3 px-2 font-medium">Status</th>
                        <th className="py-3 px-2 font-medium">Progress</th>
                        <th className="py-3 px-2 font-medium">Joined Date</th>
                        <th className="py-3 px-2 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCycles.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-12 text-center text-slate-500"
                          >
                            <div className="inline-flex flex-col items-center gap-2">
                              <Layers className="h-10 w-10 text-slate-700" />
                              <p>
                                No ongoing matrix cycles. Join a plan to get
                                started!
                              </p>
                              <button
                                onClick={() => router.push("/plans")}
                                className="mt-1 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
                              >
                                Browse Plans
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedCycles.map((m, i) => {
                          const absoluteIndex =
                            (ongoingPage - 1) * PAGE_SIZE + i + 1;
                          const statusColor =
                            m.status === "Completed"
                              ? {
                                  text: "text-emerald-400",
                                  bg: "bg-emerald-500/10",
                                  border: "border-emerald-500/20",
                                  dot: "text-emerald-400",
                                }
                              : m.status === "Pending"
                                ? {
                                    text: "text-amber-400",
                                    bg: "bg-amber-500/10",
                                    border: "border-amber-500/20",
                                    dot: "text-amber-400",
                                  }
                                : {
                                    text: "text-emerald-400",
                                    bg: "bg-emerald-500/10",
                                    border: "border-emerald-500/20",
                                    dot: "text-emerald-400",
                                  };
                          const barColor =
                            m.status === "Completed"
                              ? "from-emerald-500 to-teal-400"
                              : m.status === "Pending"
                                ? "from-amber-500 to-amber-400"
                                : "from-violet-500 to-indigo-400";
                          return (
                            <tr
                              key={m.id}
                              className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                            >
                              <td className="py-4 px-2 text-slate-500 font-medium tabular-nums">
                                {absoluteIndex}
                              </td>
                              <td className="py-4 px-2 font-semibold text-slate-200">
                                {m.matrixId}
                              </td>
                              <td className="py-4 px-2 text-slate-300">
                                {m.position}
                              </td>
                              <td className="py-4 px-2 text-slate-200 font-bold tabular-nums">
                                {formatCurrency(m.amount)}
                              </td>
                              <td className="py-4 px-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full ${statusColor.bg} px-2.5 py-0.5 text-[11px] font-bold ${statusColor.text} border ${statusColor.border}`}
                                >
                                  <Circle
                                    className={`h-1.5 w-1.5 fill-current ${statusColor.dot}`}
                                  />
                                  {m.status}
                                </span>
                              </td>
                              <td className="py-4 px-2 w-44">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                                      style={{ width: `${m.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-300 w-10 text-right tabular-nums">
                                    {m.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-2 text-slate-400 text-xs">
                                {formatDate(m.joined)}
                              </td>
                              <td className="py-4 px-2">
                                <button
                                  onClick={() => setActiveNav("my-matrix")}
                                  className="inline-flex items-center gap-1 rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Payouts */}
              <div className="col-span-12 xl:col-span-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-100">
                      Recent Payouts
                    </h2>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300 tabular-nums">
                      {payouts.length} total
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveNav("payout-history")}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                  >
                    View All
                  </button>
                </div>
                {paginatedPayouts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 py-8 text-center">
                    <Gift className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="text-sm text-slate-400">
                      No payouts yet. Earnings will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {paginatedPayouts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => router.push("/account-history")}
                          className="w-full flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/40 p-3 transition hover:bg-white/[0.03] text-left"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Circle className="h-3 w-3 fill-emerald-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                              {p.type}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDate(p.date)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-emerald-400 tabular-nums">
                              {formatCurrency(p.amount)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {totalPayoutPages > 1 && (
                      <div className="flex items-center justify-end gap-1 mt-3">
                        <button
                          onClick={() =>
                            setPayoutsPage((p) => Math.max(1, p - 1))
                          }
                          disabled={payoutsPage === 1}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/5 hover:text-slate-200 disabled:opacity-30"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-[11px] text-slate-400 tabular-nums px-1">
                          {payoutsPage}/{totalPayoutPages}
                        </span>
                        <button
                          onClick={() =>
                            setPayoutsPage((p) =>
                              p < totalPayoutPages ? p + 1 : p,
                            )
                          }
                          disabled={payoutsPage >= totalPayoutPages}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/5 hover:text-slate-200 disabled:opacity-30"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Referral Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-violet-900/40 p-5 lg:p-7">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-slate-50">
                      Refer More, Earn More!
                    </h2>
                    <p className="text-sm text-slate-300/80 mt-1 max-w-xl">
                      Invite your friends and earn unlimited rewards from your
                      matrix. You currently have{" "}
                      <span className="font-bold text-violet-300">
                        {stats.totalReferrals} referral
                        {stats.totalReferrals === 1 ? "" : "s"}
                      </span>{" "}
                      in your tree.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => router.push("/referrals")}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-slate-950/40 backdrop-blur px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-slate-900/60 hover:text-violet-100"
                  >
                    <Users className="h-4 w-4" />
                    View Referrals
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 transition"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
