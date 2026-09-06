"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import WelcomeBackModal from "@/components/welcome-back-modal";
import {
  Wallet,
  TrendingUp,
  Upload,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Shield,
  Sparkles,
  BarChart3,
  Activity,
  Globe2,
  RefreshCw,
  TrendingDown,
  Hash,
  CircleDot,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

type UserProfile = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  username?: string;
  usernameDisplay?: string;
  joinedDate?: Timestamp | Date;
  createdAt?: Timestamp | Date;
  lastAccess?: Timestamp | Date;
  lastActivityAt?: Timestamp | Date;
  balance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  activeDeposits?: number;
  lastDeposit?: number;
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
  lastWithdrawal?: number;
  referralEarnings?: number;
  photoURL?: string;
  photoPublicId?: string;
  profileImageUploaded?: boolean;
};

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "earning";
  amount: number;
  currency?: string;
  planName?: string;
  status: string;
  createdAt: Timestamp;
  method?: string;
  description?: string;
};

const LIVE_CHART_CURRENCIES: Array<{
  code: string;
  name: string;
  flag: string;
}> = [
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
];

const INITIAL_LIVE_CHART: number[][] = [
  [0, -0.16, -0.09, 0.2, 0.39, -0.25, 0.12, 0.49, -0.18],
  [0.19, 0, 0.06, 0.36, 0.55, -0.12, 0.27, 0.62, 0.03],
  [0.11, -0.05, 0, 0.3, 0.42, -0.19, 0.21, 0.54, -0.07],
  [-0.21, -0.35, -0.26, 0, 0.2, -0.41, -0.08, 0.27, -0.37],
  [-0.32, -0.52, -0.34, -0.11, 0, -0.61, -0.27, 0.14, -0.52],
  [0.29, 0.13, 0.22, 0.5, 0.7, 0, 0.41, 0.77, 0.13],
  [-0.1, -0.25, -0.15, 0.11, 0.33, -0.4, 0, 0.34, -0.26],
  [-0.45, -0.5, -0.46, -0.23, -0.06, -0.72, -0.28, 0, -0.62],
  [0.19, -0.01, 0.06, 0.38, 0.59, 0, 0.24, 0.41, 0],
];

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveChart, setLiveChart] = useState<number[][]>(INITIAL_LIVE_CHART);
  const [chartTick, setChartTick] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeModalUser, setWelcomeModalUser] = useState<UserProfile | null>(
    null,
  );

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        setProfile({
          email: currentUser.email ?? "",
          joinedDate: new Date(),
        });
      }

      try {
        const depositsQuery = query(
          collection(db, "deposits"),
          where("userId", "==", currentUser.uid),
        );
        const withdrawalsQuery = query(
          collection(db, "withdrawals"),
          where("userId", "==", currentUser.uid),
        );
        const investmentsQuery = query(
          collection(db, "investments"),
          where("userId", "==", currentUser.uid),
        );
        const earningsQuery = query(
          collection(db, "earnings"),
          where("userId", "==", currentUser.uid),
        );

        const [depositsSnap, withdrawalsSnap, investmentsSnap, earningsSnap] =
          await Promise.all([
            getDocs(depositsQuery),
            getDocs(withdrawalsQuery),
            getDocs(investmentsQuery),
            getDocs(earningsQuery),
          ]);

        const deposits = depositsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "deposit" as const,
          ...doc.data(),
        })) as Transaction[];

        const withdrawals = withdrawalsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "withdrawal" as const,
          ...doc.data(),
        })) as Transaction[];

        const investments = investmentsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "investment" as const,
          ...doc.data(),
        })) as Transaction[];

        const earnings = earningsSnap.docs.map((doc) => ({
          id: doc.id,
          type: "earning" as const,
          ...doc.data(),
        })) as Transaction[];

        const totalWithdrawalsAmount = withdrawals
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const pendingWithdrawalsAmount = withdrawals
          .filter((tx) => tx.status === "pending")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const lastWithdrawalAmount =
          withdrawals.filter(
            (tx) => tx.status === "approved" || tx.status === "completed",
          ).length > 0
            ? withdrawals
                .filter(
                  (tx) => tx.status === "approved" || tx.status === "completed",
                )
                .sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
                )[0].amount
            : 0;

        const totalDepositsAmount = deposits
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const activeDepositsAmount = investments
          .filter((tx) => tx.status === "active" || tx.status === "approved")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const lastDepositAmount =
          deposits.filter(
            (tx) => tx.status === "approved" || tx.status === "completed",
          ).length > 0
            ? deposits
                .filter(
                  (tx) => tx.status === "approved" || tx.status === "completed",
                )
                .sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
                )[0].amount
            : 0;

        const totalEarningsAmount = earnings
          .filter((tx) => tx.status === "approved" || tx.status === "completed")
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        setProfile((prev) => {
          if (!prev) return null;
          const referralComm = prev.referralEarnings || 0;
          return {
            ...prev,
            totalWithdrawals: totalWithdrawalsAmount,
            pendingWithdrawals: pendingWithdrawalsAmount,
            lastWithdrawal: lastWithdrawalAmount,
            totalDeposits: totalDepositsAmount,
            activeDeposits: activeDepositsAmount,
            lastDeposit: lastDepositAmount,
            totalEarnings: totalEarningsAmount + referralComm,
          };
        });

        const all = [...deposits, ...withdrawals, ...investments, ...earnings];

        if (userDoc.exists() && (userDoc.data().referralEarnings || 0) > 0) {
          all.push({
            id: "referral-earnings-total",
            type: "earning",
            amount: userDoc.data().referralEarnings,
            status: "approved",
            createdAt: userDoc.data().joinedDate || Timestamp.now(),
            description: "Total Referral Commission",
          });
        }

        all.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        setAllTransactions(all);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }

      setCheckingAuth(false);

      try {
        const justLoggedIn =
          typeof window !== "undefined" &&
          window.sessionStorage &&
          window.sessionStorage.getItem("welcome_back:just_logged_in") === "1";
        if (justLoggedIn) {
          window.sessionStorage.removeItem("welcome_back:just_logged_in");
          if (
            currentUser &&
            userDoc.exists() &&
            typeof window !== "undefined"
          ) {
            const profileData = userDoc.data() as UserProfile;
            setWelcomeModalUser({
              ...profileData,
              email: profileData.email || currentUser.email || "",
            });
            setShowWelcomeModal(true);
          } else if (currentUser) {
            setWelcomeModalUser({
              email: currentUser.email ?? "",
            });
            setShowWelcomeModal(true);
          }
        }
      } catch {}
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveChart((prev) =>
        prev.map((row, r) =>
          row.map((cell, c) => {
            if (r === c) return cell;
            const delta = (Math.random() - 0.5) * 0.08;
            let next = cell + delta;
            next = Math.max(-0.9, Math.min(0.9, next));
            return Number(next.toFixed(2));
          }),
        ),
      );
      setChartTick((t) => t + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const chartStats = useMemo(() => {
    const all: number[] = [];
    for (let r = 0; r < liveChart.length; r++) {
      for (let c = 0; c < liveChart[r].length; c++) {
        if (r !== c) all.push(liveChart[r][c]);
      }
    }
    const bulls = all.filter((v) => v > 0).length;
    const bears = all.filter((v) => v < 0).length;
    const avgPos =
      bulls > 0
        ? all.filter((v) => v > 0).reduce((s, v) => s + v, 0) / bulls
        : 0;
    const avgNeg =
      bears > 0
        ? all.filter((v) => v < 0).reduce((s, v) => s + v, 0) / bears
        : 0;
    const topGainerIdx = all.indexOf(Math.max(...all));
    const topLoserIdx = all.indexOf(Math.min(...all));
    const pairs: string[] = [];
    for (let r = 0; r < LIVE_CHART_CURRENCIES.length; r++) {
      for (let c = 0; c < LIVE_CHART_CURRENCIES.length; c++) {
        if (r !== c)
          pairs.push(
            `${LIVE_CHART_CURRENCIES[r].code}/${LIVE_CHART_CURRENCIES[c].code}`,
          );
      }
    }
    return {
      bulls,
      bears,
      totalPairs: all.length,
      bullishPct: Math.round((bulls / all.length) * 100),
      bearishPct: Math.round((bears / all.length) * 100),
      avgPos: Number(avgPos.toFixed(2)),
      avgNeg: Number(avgNeg.toFixed(2)),
      topPair: pairs[topGainerIdx],
      topGainer: Math.max(...all),
      bottomPair: pairs[topLoserIdx],
      topLoser: Math.min(...all),
    };
  }, [liveChart]);

  if (checkingAuth) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName =
    profile?.fullName && profile.fullName.trim().length > 0
      ? profile.fullName.trim()
      : profile && (profile.firstName || profile.lastName)
        ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
        : profile?.usernameDisplay || profile?.username || "User";

  const displayUsername =
    profile?.usernameDisplay ||
    profile?.username ||
    profile?.email?.split("@")[0] ||
    "User";

  const formatDate = (timestamp: Timestamp | Date | undefined | null) => {
    if (!timestamp) return "N/A";
    const date =
      timestamp instanceof Timestamp
        ? timestamp.toDate()
        : new Date(timestamp as Date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = allTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const quickStats = [
    {
      label: "Total Balance",
      value: formatCurrency(profile?.balance),
      icon: Wallet,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      border: "border-blue-500/20",
      delta: "+2.4%",
      deltaPositive: true,
    },
    {
      label: "Total Earnings",
      value: formatCurrency(profile?.totalEarnings),
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      delta: "+8.1%",
      deltaPositive: true,
    },
    {
      label: "Total Deposits",
      value: formatCurrency(profile?.totalDeposits),
      icon: Upload,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      delta: "+5.3%",
      deltaPositive: true,
    },
    {
      label: "Total Withdrawals",
      value: formatCurrency(profile?.totalWithdrawals),
      icon: Download,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      border: "border-amber-500/20",
      delta: "-1.2%",
      deltaPositive: false,
    },
  ];

  const txColor = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return {
          bg: "bg-emerald-500/10",
          fg: "text-emerald-400",
          border: "border-emerald-500/20",
        };
      case "withdrawal":
        return {
          bg: "bg-amber-500/10",
          fg: "text-amber-400",
          border: "border-amber-500/20",
        };
      case "earning":
        return {
          bg: "bg-emerald-500/10",
          fg: "text-emerald-400",
          border: "border-emerald-500/20",
        };
      default:
        return {
          bg: "bg-blue-500/10",
          fg: "text-blue-400",
          border: "border-blue-500/20",
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-50">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, {fullName}. Here&apos;s an overview of your account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/deposit")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
            >
              <Upload className="h-4 w-4" />
              Deposit
            </button>
            <button
              onClick={() => router.push("/withdraw")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Welcome Banner + Profile Card */}
        <div className="grid grid-cols-12 gap-5">
          {/* Welcome Gradient Banner */}
          <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-violet-900/40 p-6 lg:p-7">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900/60 border border-white/10 text-slate-200">
                  {profile?.email ? (
                    <User className="h-7 w-7" />
                  ) : (
                    <User className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                      Good to see you
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Verified
                    </span>
                  </div>
                  <h2 className="mt-1 text-2xl lg:text-3xl font-bold text-slate-50">
                    Hi, {fullName}!
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-300/80 max-w-lg leading-relaxed">
                    Your portfolio is looking great. Keep investing and watch
                    your wealth grow.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 text-right">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-semibold text-sky-300">
                    Account Secured
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Joined {formatDate(profile?.createdAt || profile?.joinedDate)}
                </p>
                <p className="text-[11px] text-slate-500">
                  Username:{" "}
                  <span className="text-slate-300 font-semibold">
                    {displayUsername}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Stats in banner */}
            <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Active Investments",
                  value: formatCurrency(profile?.activeDeposits),
                  icon: BarChart3,
                  color: "text-violet-300",
                },
                {
                  label: "Pending Withdrawals",
                  value: formatCurrency(profile?.pendingWithdrawals),
                  icon: Clock,
                  color: "text-amber-300",
                },
                {
                  label: "Last Deposit",
                  value: profile?.lastDeposit
                    ? formatCurrency(profile.lastDeposit)
                    : "—",
                  icon: ArrowDownLeft,
                  color: "text-emerald-300",
                },
                {
                  label: "Last Withdrawal",
                  value: profile?.lastWithdrawal
                    ? formatCurrency(profile.lastWithdrawal)
                    : "—",
                  icon: ArrowUpRight,
                  color: "text-sky-300",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-slate-950/40 backdrop-blur p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                    <p className="text-[11px] font-medium text-slate-400 truncate">
                      {s.label}
                    </p>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-slate-100 truncate">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Card */}
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Performance
                  </h3>
                  <p className="text-[11px] text-slate-500">This cycle</p>
                </div>
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                {
                  label: "Investment ROI",
                  pct: 68,
                  color: "from-emerald-500 to-teal-400",
                  value: "68%",
                },
                {
                  label: "Referral Progress",
                  pct: 45,
                  color: "from-violet-500 to-indigo-400",
                  value: "45%",
                },
                {
                  label: "Matrix Fill",
                  pct: 33,
                  color: "from-blue-500 to-sky-400",
                  value: "33%",
                },
                {
                  label: "Account Level",
                  pct: 82,
                  color: "from-amber-500 to-orange-400",
                  value: "Level 2",
                },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-400">
                      {r.label}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {r.value}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickStats.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.border} bg-slate-900/60 p-4 transition hover:border-white/10`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-50">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor} border border-white/5`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    s.deltaPositive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {s.deltaPositive ? (
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  ) : (
                    <ArrowDownLeft className="h-2.5 w-2.5" />
                  )}
                  {s.delta}
                </span>
                <span className="text-[10px] text-slate-500">
                  vs last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Columns: History Tables */}
        <div className="grid grid-cols-12 gap-5">
          {/* Deposits & Withdrawals Summary */}
          <div className="col-span-12 lg:col-span-6 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Deposit Summary
                </h3>
              </div>
              <button
                onClick={() => router.push("/account-history")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                View All
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Total Deposits",
                  value: formatCurrency(profile?.totalDeposits),
                  icon: ArrowDownLeft,
                  color: "emerald",
                  sub: "Lifetime",
                },
                {
                  label: "Active Investment",
                  value: formatCurrency(profile?.activeDeposits),
                  icon: BarChart3,
                  color: "violet",
                  sub: "In Plans",
                },
                {
                  label: "Last Deposit",
                  value: profile?.lastDeposit
                    ? formatCurrency(profile.lastDeposit)
                    : "—",
                  icon: Clock,
                  color: "sky",
                  sub: "Recent",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className={`rounded-xl border border-${c.color}-500/15 bg-${c.color}-500/[0.04] p-3.5`}
                  style={{
                    borderColor:
                      c.color === "emerald"
                        ? "rgba(16,185,129,0.15)"
                        : c.color === "violet"
                          ? "rgba(139,92,246,0.15)"
                          : "rgba(56,189,248,0.15)",
                    backgroundColor:
                      c.color === "emerald"
                        ? "rgba(16,185,129,0.04)"
                        : c.color === "violet"
                          ? "rgba(139,92,246,0.04)"
                          : "rgba(56,189,248,0.04)",
                  }}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" : c.color === "violet" ? "bg-violet-500/10 text-violet-400" : "bg-sky-500/10 text-sky-400"}`}
                  >
                    <c.icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-400">
                    {c.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-100 truncate">
                    {c.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{c.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-amber-500 to-orange-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Withdrawal Summary
                </h3>
              </div>
              <button
                onClick={() => router.push("/account-history")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
              >
                View All
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Total Withdrawn",
                  value: formatCurrency(profile?.totalWithdrawals),
                  icon: ArrowUpRight,
                  color: "amber",
                  sub: "Lifetime",
                },
                {
                  label: "Pending Requests",
                  value: formatCurrency(profile?.pendingWithdrawals),
                  icon: Clock,
                  color: "red",
                  sub: "Awaiting",
                },
                {
                  label: "Last Withdrawal",
                  value: profile?.lastWithdrawal
                    ? formatCurrency(profile.lastWithdrawal)
                    : "—",
                  icon: Sparkles,
                  color: "indigo",
                  sub: "Recent",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl p-3.5"
                  style={{
                    border: `1px solid ${c.color === "amber" ? "rgba(245,158,11,0.15)" : c.color === "red" ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)"}`,
                    backgroundColor:
                      c.color === "amber"
                        ? "rgba(245,158,11,0.04)"
                        : c.color === "red"
                          ? "rgba(239,68,68,0.04)"
                          : "rgba(99,102,241,0.04)",
                  }}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.color === "amber" ? "bg-amber-500/10 text-amber-400" : c.color === "red" ? "bg-red-500/10 text-red-400" : "bg-indigo-500/10 text-indigo-400"}`}
                  >
                    <c.icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-400">
                    {c.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-100 truncate">
                    {c.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account History Table */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-400" />
              <h3 className="text-base font-bold text-slate-100">
                Recent Activity
              </h3>
              <span className="rounded-full border border-white/5 bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                {allTransactions.length} total
              </span>
            </div>
            <button
              onClick={() => router.push("/account-history")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Full History
            </button>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left text-sm min-w-[680px]">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-white/5">
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                          <Clock className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                          No activity yet
                        </p>
                        <p className="text-xs text-slate-500">
                          Your transactions will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((tx) => {
                    const c = txColor(tx.type);
                    const isPositive =
                      tx.type === "deposit" || tx.type === "earning";
                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition"
                      >
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.fg} border ${c.border}`}
                            >
                              {tx.type === "deposit" ? (
                                <ArrowDownLeft className="h-4.5 w-4.5" />
                              ) : tx.type === "withdrawal" ? (
                                <ArrowUpRight className="h-4.5 w-4.5" />
                              ) : tx.type === "earning" ? (
                                <TrendingUp className="h-4.5 w-4.5" />
                              ) : (
                                <BarChart3 className="h-4.5 w-4.5" />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-slate-200 capitalize">
                              {tx.type === "earning"
                                ? "Profit / Earning"
                                : tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-400 max-w-xs truncate">
                          {tx.type === "investment"
                            ? tx.planName || "Investment Plan"
                            : tx.type === "earning"
                              ? tx.description || "Profit Distribution"
                              : tx.type === "deposit"
                                ? tx.currency
                                  ? `Funded via ${tx.currency}`
                                  : "Account Funding"
                                : tx.method
                                  ? `Withdrawal via ${tx.method}`
                                  : "Account Withdrawal"}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-400 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-slate-600" />
                            {formatDate(tx.createdAt)}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${
                              tx.status === "approved" ||
                              tx.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : tx.status === "pending"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                tx.status === "approved" ||
                                tx.status === "completed"
                                  ? "bg-emerald-400"
                                  : tx.status === "pending"
                                    ? "bg-amber-400"
                                    : "bg-red-400"
                              }`}
                            />
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <p
                            className={`text-base font-bold ${
                              isPositive
                                ? "text-emerald-400"
                                : tx.type === "withdrawal"
                                  ? "text-red-400"
                                  : "text-blue-400"
                            }`}
                          >
                            {isPositive ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-5">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {currentTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-300">
                  {allTransactions.length}
                </span>{" "}
                transactions
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-800 text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      totalPages <= 5 ||
                      Math.abs(p - currentPage) <= 2 ||
                      p === 1 ||
                      p === totalPages,
                  )
                  .flatMap((page, idx, arr) => {
                    const items: React.ReactNode[] = [];
                    if (idx > 0 && arr[idx - 1] !== page - 1) {
                      items.push(
                        <span
                          key={`dots-${page}`}
                          className="px-1 text-xs text-slate-600"
                        >
                          ...
                        </span>,
                      );
                    }
                    items.push(
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-bold transition ${
                          currentPage === page
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-slate-800 text-slate-500 hover:bg-white/5 hover:text-slate-300"
                        }`}
                      >
                        {page}
                      </button>,
                    );
                    return items;
                  })}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-800 text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Chart Heatmap */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden">
          <style jsx>{`
            .cell-flash {
              animation: cellPulse 1.1s ease-out;
            }
            @keyframes cellPulse {
              0% {
                filter: brightness(1.8) saturate(1.5);
                transform: scale(1.02);
              }
              100% {
                filter: brightness(1);
                transform: scale(1);
              }
            }
            .live-dot::after {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: 9999px;
              animation: liveRing 1.8s ease-out infinite;
              box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55);
            }
            @keyframes liveRing {
              0% {
                box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55);
              }
              100% {
                box-shadow: 0 0 0 10px rgba(52, 211, 153, 0);
              }
            }
          `}</style>

          {/* Chart Header Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-sky-500 to-blue-600 px-5 py-4 sm:px-7 sm:py-5">
            <div className="pointer-events-none absolute -top-16 left-1/4 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-1/4 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.22em] text-white drop-shadow">
                      LIVE CHART
                    </h2>
                    <span className="relative inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-2.5 py-1 backdrop-blur">
                      <span className="live-dot relative h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        Streaming
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-white/80 font-medium">
                    Global FX correlation matrix · 72 major pairs · tick #
                    {chartTick.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/20 border border-emerald-300/30">
                      <Hash className="h-4 w-4 text-emerald-200" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">
                        Pairs Tracked
                      </p>
                      <p className="text-sm font-black text-white tabular-nums">
                        {chartStats.totalPairs}
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/15" />
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/20 border border-sky-300/30">
                      <RefreshCw
                        className={`h-4 w-4 text-sky-200 ${chartTick % 2 === 0 ? "" : ""}`}
                      />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">
                        Refresh
                      </p>
                      <p className="text-sm font-black text-white tabular-nums">
                        2.2s
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/trade")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:scale-[1.02]"
                >
                  Trade Now
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            <div className="bg-slate-950/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Bullish Pairs
                  </p>
                  <p className="text-base font-black text-slate-100 tabular-nums truncate">
                    {chartStats.bulls}{" "}
                    <span className="text-xs font-semibold text-emerald-400 ml-1">
                      {chartStats.bullishPct}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Bearish Pairs
                  </p>
                  <p className="text-base font-black text-slate-100 tabular-nums truncate">
                    {chartStats.bears}{" "}
                    <span className="text-xs font-semibold text-red-400 ml-1">
                      {chartStats.bearishPct}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CircleDot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Top Gainer
                  </p>
                  <p className="text-[13px] font-black text-slate-100 truncate">
                    {chartStats.topPair}{" "}
                    <span className="text-emerald-400 ml-1 tabular-nums">
                      +{chartStats.topGainer.toFixed(2)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <CircleDot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Top Loser
                  </p>
                  <p className="text-[13px] font-black text-slate-100 truncate">
                    {chartStats.bottomPair}{" "}
                    <span className="text-red-400 ml-1 tabular-nums">
                      {chartStats.topLoser.toFixed(2)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-slate-950/40 p-2 sm:p-4">
            <div className="overflow-x-auto -mx-1 rounded-xl border border-white/5 bg-slate-950/70">
              <table className="w-full text-sm border-collapse min-w-[760px]">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-950/95 backdrop-blur border-b border-r border-white/5 px-2.5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 w-[88px]">
                      vs →
                    </th>
                    {LIVE_CHART_CURRENCIES.map((col) => (
                      <th
                        key={`h-${col.code}`}
                        className="border-b border-r border-white/5 last:border-r-0 px-2 py-3 text-slate-100 min-w-[84px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center justify-center rounded-full bg-slate-800/60 px-2.5 py-1 border border-white/5">
                            <span className="text-base leading-none">
                              {col.flag}
                            </span>
                          </div>
                          <span className="text-[13px] font-black tracking-wider">
                            {col.code}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIVE_CHART_CURRENCIES.map((row, r) => (
                    <tr key={`r-${row.code}`} className="group">
                      <td className="sticky left-0 z-10 bg-slate-950/95 backdrop-blur group-hover:bg-slate-900/95 border-b border-r border-white/5 last:border-b-0 px-2.5 py-0.5 min-w-[88px]">
                        <div className="flex items-center justify-end gap-2 py-2">
                          <div className="text-right leading-tight">
                            <p className="text-[13px] font-black tracking-wider text-slate-100">
                              {row.code}
                            </p>
                            <p className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
                              {row.name}
                            </p>
                          </div>
                          <span className="text-lg leading-none">
                            {row.flag}
                          </span>
                        </div>
                      </td>
                      {LIVE_CHART_CURRENCIES.map((_, c) => {
                        const val = liveChart[r][c];
                        const isDiagonal = r === c;
                        const abs = Math.abs(val);
                        const intensity = isDiagonal
                          ? 0
                          : Math.min(1, abs / 0.8);
                        const positive = val > 0;
                        let bg = "bg-slate-900/70";
                        let fg = "text-slate-500";
                        if (!isDiagonal) {
                          if (positive) {
                            if (intensity > 0.6) {
                              bg = "bg-emerald-600/25";
                              fg = "text-emerald-300";
                            } else if (intensity > 0.35) {
                              bg = "bg-emerald-700/18";
                              fg = "text-emerald-400";
                            } else {
                              bg = "bg-emerald-800/12";
                              fg = "text-emerald-400/90";
                            }
                          } else {
                            if (intensity > 0.6) {
                              bg = "bg-red-600/25";
                              fg = "text-red-300";
                            } else if (intensity > 0.35) {
                              bg = "bg-red-700/18";
                              fg = "text-red-400";
                            } else {
                              bg = "bg-red-800/12";
                              fg = "text-red-400/90";
                            }
                          }
                        }
                        return (
                          <td
                            key={`${r}-${c}`}
                            className={`border-b border-r border-white/5 last:border-r-0 last:border-b-0 relative ${
                              r === LIVE_CHART_CURRENCIES.length - 1
                                ? "last:border-b-0"
                                : ""
                            }`}
                          >
                            <div
                              className={`cell-flash mx-1.5 my-1.5 rounded-lg px-2 py-3 text-center transition-all duration-500 ${
                                isDiagonal
                                  ? "bg-slate-800/80 text-slate-600 border border-white/5"
                                  : `${bg} ${fg} border border-transparent hover:brightness-125 hover:scale-[1.03] hover:shadow-inner cursor-crosshair`
                              }`}
                              title={
                                isDiagonal
                                  ? `${row.code} vs ${row.code}`
                                  : `${row.code}/${LIVE_CHART_CURRENCIES[c].code}: ${val > 0 ? "+" : ""}${val.toFixed(2)}%`
                              }
                            >
                              {isDiagonal ? (
                                <span className="text-[11px] font-bold text-slate-600 tracking-wider">
                                  —
                                </span>
                              ) : (
                                <span className="text-[13px] font-black tabular-nums">
                                  {val > 0 ? "+" : ""}
                                  {val.toFixed(2)}%
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Strength Legend
                </span>
                <div className="flex items-center gap-1 rounded-full border border-white/5 bg-slate-900/60 px-2 py-1.5">
                  <span className="text-[10px] font-bold text-red-400 mr-1">
                    Strong Bearish
                  </span>
                  {[0.08, 0.18, 0.28, 0.38, 0.48, 0.58].map((i) => (
                    <div
                      key={`l-bear-${i}`}
                      className="h-3 w-5 rounded-sm"
                      style={{
                        backgroundColor: `rgba(220, 38, 38, ${0.08 + i})`,
                      }}
                    />
                  ))}
                  <div className="h-3 w-5 rounded-sm bg-slate-700/70 mx-1" />
                  {[0.58, 0.48, 0.38, 0.28, 0.18, 0.08].map((i) => (
                    <div
                      key={`l-bull-${i}`}
                      className="h-3 w-5 rounded-sm"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${0.08 + i})`,
                      }}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-emerald-400 ml-1">
                    Strong Bullish
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-3 w-3 rounded bg-slate-800 border border-white/10" />
                  <span className="font-medium">Diagonal (self)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="font-semibold text-slate-500">
                    Avg Gain:
                  </span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    +{chartStats.avgPos.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="font-semibold text-slate-500">
                    Avg Loss:
                  </span>
                  <span className="text-red-400 font-bold tabular-nums">
                    {chartStats.avgNeg.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WelcomeBackModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        user={welcomeModalUser}
      />
    </DashboardLayout>
  );
}
