"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  Layers,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  X,
  Wallet,
  Trophy,
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Target,
  Gift,
  Gauge,
  Calendar,
  Hash,
  MapPin,
  DollarSign,
  Circle,
  User,
  Percent,
  Rocket,
} from "lucide-react";

type MatrixRow = {
  id: string;
  uid: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  usernameDisplay?: string;
  email?: string;
  photoURL?: string;
  country?: string;
  city?: string;
  status?: string;
  createdAt?: any;
  joinedDate?: any;
  referredBy?: string | null;
  referredByName?: string | null;
  matrixBalance: number;
  matrixLevel: number;
  matrixCycles: number;
  totalInvested: number;
  totalExpectedReturn: number;
  totalEarningsPaid: number;
  progressPct: number;
  totalPayouts: number;
  totalPaid: number;
  matrixPaid: number;
  referralPaid: number;
  cycles: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
  referrals: {
    total: number;
    active: number;
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    list: {
      id: string;
      email: string | null;
      fullName: string | null;
      createdAt: any;
      active: boolean;
    }[];
  };
};

type MatrixSummary = {
  totalParticipants: number;
  totalActiveInMatrix: number;
  totalWithReferrals: number;
  totalReferralCount: number;
  totalStaked: number;
  totalExpectedReturn: number;
  totalEarningsAllTime: number;
  totalMatrixPayouts: number;
  totalReferralPayouts: number;
  totalCycles: number;
  totalActiveCycles: number;
  totalCompletedCycles: number;
  averageStakedPerParticipant: number;
  roiToDate: number;
};

const PAGE_SIZE = 15;

function formatDate(v: any, opts?: Intl.DateTimeFormatOptions) {
  if (!v) return "—";
  try {
    let date: Date | null = null;
    if (typeof v === "string") date = new Date(v);
    else if (typeof v.toDate === "function") date = v.toDate();
    else if (v && typeof v === "object" && typeof v._seconds === "number")
      date = new Date(
        v._seconds * 1000 + (v._nanoseconds || 0) / 1000000,
      );
    else date = new Date(v);
    if (!date || isNaN(date.getTime())) return "—";
    const opt: Intl.DateTimeFormatOptions = opts || {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", opt).format(date);
  } catch {
    return "—";
  }
}

function formatDateShort(v: any) {
  return formatDate(v, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(n?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n ?? 0);
}

function formatNumber(n?: number) {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

function formatPct(n?: number, digits = 1) {
  return `${(n ?? 0).toFixed(digits)}%`;
}

type FilterTab = "all" | "active" | "withReferrals" | "topEarners" | "idle";
type SortKey = "newest" | "staked" | "paid" | "referrals" | "level" | "progress";

export default function AdminMatrixPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<MatrixRow[]>([]);
  const [summary, setSummary] = useState<MatrixSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortKey>("staked");
  const [minLevel, setMinLevel] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (force = false) => {
    if (force) setRefreshing(true);
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      const idToken = await getIdToken(currentUser, true);
      const res = await fetch("/api/admin/matrix", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setRows((data.rows || []) as MatrixRow[]);
        setSummary((data.summary || null) as MatrixSummary | null);
      }
    } catch (error) {
      console.error("Error fetching matrix:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    let live = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      if (!live) return;
      await loadData();
    });
    return () => {
      live = false;
      unsubscribe();
    };
  }, [router]);

  const maxLevel = useMemo(
    () => rows.reduce((m, r) => Math.max(m, r.matrixLevel || 0), 0),
    [rows],
  );

  const filteredRows = useMemo(() => {
    let list = rows.slice();

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.email || "").toLowerCase().includes(q) ||
          (r.fullName || "").toLowerCase().includes(q) ||
          ((r.firstName || "") + " " + (r.lastName || ""))
            .toLowerCase()
            .includes(q) ||
          (r.username || "").toLowerCase().includes(q) ||
          (r.usernameDisplay || "").toLowerCase().includes(q) ||
          (r.uid || "").toLowerCase().includes(q) ||
          (r.referredByName || "")?.toLowerCase().includes(q) ||
          (r.referredBy || "")?.toLowerCase().includes(q),
      );
    }

    switch (filterTab) {
      case "active":
        list = list.filter(
          (r) =>
            (r.cycles.active || 0) + (r.cycles.pending || 0) > 0 ||
            r.progressPct > 0,
        );
        break;
      case "withReferrals":
        list = list.filter((r) => (r.referrals.total || 0) > 0);
        break;
      case "topEarners":
        list = list.filter((r) => (r.totalPaid || 0) > 0);
        break;
      case "idle":
        list = list.filter(
          (r) =>
            (r.totalInvested || 0) === 0 &&
            (r.referrals.total || 0) === 0 &&
            (r.totalPaid || 0) === 0,
        );
        break;
    }

    if (minLevel > 0) list = list.filter((r) => (r.matrixLevel || 1) >= minLevel);

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        break;
      case "staked":
        list.sort((a, b) => (b.totalInvested || 0) - (a.totalInvested || 0));
        break;
      case "paid":
        list.sort((a, b) => (b.totalPaid || 0) - (a.totalPaid || 0));
        break;
      case "referrals":
        list.sort(
          (a, b) =>
            (b.referrals.total || 0) - (a.referrals.total || 0) ||
            (b.totalInvested || 0) - (a.totalInvested || 0),
        );
        break;
      case "level":
        list.sort(
          (a, b) =>
            (b.matrixLevel || 1) - (a.matrixLevel || 1) ||
            (b.matrixCycles || 0) - (a.matrixCycles || 0),
        );
        break;
      case "progress":
        list.sort((a, b) => (b.progressPct || 0) - (a.progressPct || 0));
        break;
    }

    return list;
  }, [rows, searchTerm, filterTab, sortBy, minLevel]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterTab, sortBy, minLevel]);

  const pagedRows = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const selectedRow = useMemo(
    () =>
      selectedId
        ? filteredRows.find((r) => r.id === selectedId) ||
          rows.find((r) => r.id === selectedId) ||
          null
        : null,
    [selectedId, filteredRows, rows],
  );

  const filteredAggs = useMemo(() => {
    return {
      count: filteredRows.length,
      staked: filteredRows.reduce((s, r) => s + (r.totalInvested || 0), 0),
      paid: filteredRows.reduce((s, r) => s + (r.totalPaid || 0), 0),
      referrals: filteredRows.reduce(
        (s, r) => s + (r.referrals.total || 0),
        0,
      ),
      cycles: filteredRows.reduce((s, r) => s + (r.cycles.total || 0), 0),
    };
  }, [filteredRows]);

  const filterTabs: {
    key: FilterTab;
    label: string;
    icon: any;
    accent: string;
    bg: string;
    count?: number;
  }[] = [
    {
      key: "all",
      label: "All Users",
      icon: Users,
      accent: "text-slate-300",
      bg: "from-slate-700/30 to-slate-800/10",
      count: summary?.totalParticipants,
    },
    {
      key: "active",
      label: "Active Cycles",
      icon: Activity,
      accent: "text-emerald-400",
      bg: "from-emerald-500/25 to-emerald-500/5",
      count: summary?.totalActiveInMatrix,
    },
    {
      key: "withReferrals",
      label: "With Referrals",
      icon: UserPlus,
      accent: "text-violet-400",
      bg: "from-violet-500/25 to-violet-500/5",
      count: summary?.totalWithReferrals,
    },
    {
      key: "topEarners",
      label: "Top Earners",
      icon: Trophy,
      accent: "text-amber-400",
      bg: "from-amber-500/25 to-amber-500/5",
      count: rows.filter((r) => (r.totalPaid || 0) > 0).length,
    },
    {
      key: "idle",
      label: "Idle",
      icon: Clock,
      accent: "text-slate-500",
      bg: "from-slate-600/25 to-slate-800/5",
      count: rows.filter(
        (r) =>
          (r.totalInvested || 0) === 0 &&
          (r.referrals.total || 0) === 0 &&
          (r.totalPaid || 0) === 0,
      ).length,
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="h-7 w-7 animate-spin text-violet-500" />
            <div className="text-sm font-medium">Loading matrix...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] p-5 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
              <Layers className="h-3.5 w-3.5" />
              Matrix Management
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Global matrix view
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track every participant&apos;s staked amount, cycle progress,
              referral tree by level, and matrix earnings from investments and
              referrals.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-slate-300 transition hover:border-violet-500/30 hover:text-violet-300 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin text-violet-400" : ""}`}
              />
              Refresh
            </button>
            <div className="relative sm:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search user, email, UID, referrer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/15"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SummaryCard
            label="Participants"
            value={formatNumber(summary?.totalParticipants || 0)}
            sub={`${formatNumber(summary?.totalActiveInMatrix || 0)} with cycles`}
            accent="from-slate-800 to-slate-900"
            icon={Users}
            iconColor="text-slate-300"
          />
          <SummaryCard
            label="Total Staked"
            value={formatCurrency(summary?.totalStaked || 0)}
            sub={`${formatCurrency(summary?.averageStakedPerParticipant || 0)} avg`}
            accent="from-violet-500/20 to-violet-500/5"
            icon={Wallet}
            iconColor="text-violet-400"
          />
          <SummaryCard
            label="All-Time Earnings"
            value={formatCurrency(summary?.totalEarningsAllTime || 0)}
            sub={
              (summary?.roiToDate || 0) >= 0
                ? `ROI +${formatPct(summary?.roiToDate || 0)}`
                : `ROI ${formatPct(summary?.roiToDate || 0)}`
            }
            accent="from-emerald-500/20 to-emerald-500/5"
            icon={Trophy}
            iconColor="text-emerald-400"
          />
          <SummaryCard
            label="Referral Network"
            value={formatNumber(summary?.totalReferralCount || 0)}
            sub={`${formatNumber(summary?.totalWithReferrals || 0)} hosts`}
            accent="from-sky-500/20 to-sky-500/5"
            icon={UserPlus}
            iconColor="text-sky-400"
          />
          <SummaryCard
            label="Active Cycles"
            value={formatNumber(summary?.totalActiveCycles || 0)}
            sub={`${formatNumber(summary?.totalCompletedCycles || 0)} completed`}
            accent="from-amber-500/20 to-amber-500/5"
            icon={Activity}
            iconColor="text-amber-400"
          />
          <SummaryCard
            label="Payouts"
            value={formatCurrency(summary?.totalMatrixPayouts || 0)}
            sub={`${formatCurrency(summary?.totalReferralPayouts || 0)} from refs`}
            accent="from-fuchsia-500/20 to-fuchsia-500/5"
            icon={Gift}
            iconColor="text-fuchsia-400"
          />
        </div>

        {/* Filter Segment + Filters + Sort */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/5 bg-slate-900/60 p-2">
            {filterTabs.map((t) => {
              const Icon = t.icon;
              const active = filterTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setFilterTab(t.key)}
                  className={`group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-3.5 py-2.5 text-xs font-black transition-all sm:flex-none ${
                    active
                      ? `bg-gradient-to-br ${t.bg} text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${t.accent}`} />
                  <span className="tracking-wide">{t.label}</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {formatNumber(t.count ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Min Level
                </label>
                <select
                  value={String(minLevel)}
                  onChange={(e) => setMinLevel(Number(e.target.value))}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-violet-500/40"
                >
                  <option value="0">All Levels</option>
                  {Array.from({ length: Math.max(0, maxLevel) }, (_, i) => i + 1).map(
                    (lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}+
                      </option>
                    ),
                  )}
                  {maxLevel === 0 && <option value="1">Level 1+</option>}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Sort by
              </label>
              <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                {[
                  { k: "staked", label: "Stake" },
                  { k: "paid", label: "Paid" },
                  { k: "referrals", label: "Referrals" },
                  { k: "level", label: "Level" },
                  { k: "progress", label: "Progress" },
                  { k: "newest", label: "Newest" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setSortBy(o.k as SortKey)}
                    className={`px-3 py-1.5 text-[11px] font-semibold transition ${
                      sortBy === o.k
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredAggs.count !== rows.length && (
            <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-2.5 text-xs text-violet-300">
              <span className="font-black">Filtered:</span>{" "}
              {formatNumber(filteredAggs.count)} users · Stake{" "}
              <span className="font-bold text-white">
                {formatCurrency(filteredAggs.staked)}
              </span>{" "}
              · Paid{" "}
              <span className="font-bold text-white">
                {formatCurrency(filteredAggs.paid)}
              </span>{" "}
              · Referrals{" "}
              <span className="font-bold text-white">
                {formatNumber(filteredAggs.referrals)}
              </span>{" "}
              · Cycles{" "}
              <span className="font-bold text-white">
                {formatNumber(filteredAggs.cycles)}
              </span>
            </div>
          )}
        </div>

        {/* Matrix Table */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    User
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Level · Cycles
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Staked · Expected
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Paid · P&L
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Progress
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Referrals (Levels)
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right font-bold"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pagedRows.length > 0 ? (
                  pagedRows.map((r) => {
                    const isSelected = selectedRow?.id === r.id;
                    const pnl = (r.totalPaid || 0) - (r.totalInvested || 0);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-violet-500/8"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3 pr-4">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700/70 to-fuchsia-800/70 text-xs font-black uppercase text-white ring-2 ring-violet-500/20">
                              {(r.fullName || r.email || r.uid || "U")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-100">
                                {r.fullName ||
                                  [r.firstName, r.lastName]
                                    .filter(Boolean)
                                    .join(" ")
                                    .trim() ||
                                  r.usernameDisplay ||
                                  r.email ||
                                  "Unnamed"}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {r.email || "no email"}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                                  <Hash className="h-2.5 w-2.5" />
                                  {r.uid?.slice(0, 8)}
                                </span>
                                {r.country && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                                    <MapPin className="h-2.5 w-2.5" />
                                    {r.country}
                                  </span>
                                )}
                                {r.referredByName && (
                                  <span
                                    title={`Referred by ${r.referredByName}`}
                                    className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 ring-1 ring-violet-500/15"
                                  >
                                    <UserPlus className="h-2.5 w-2.5" />
                                    Ref
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 px-2 py-0.5 text-[11px] font-black text-violet-200 ring-1 ring-violet-500/25">
                                <Rocket className="h-3 w-3" />
                                Level {r.matrixLevel || 1}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {formatNumber(r.matrixCycles || 0)} cycles
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-300">
                                {formatNumber(r.cycles.active || 0)} Active
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 font-bold text-amber-300">
                                {formatNumber(r.cycles.pending || 0)} Pend
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-1.5 py-0.5 font-bold text-sky-300">
                                {formatNumber(r.cycles.completed || 0)} Done
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-100">
                              <DollarSign className="h-3.5 w-3.5 text-violet-400" />
                              {formatCurrency(r.totalInvested || 0)}
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Target className="h-3 w-3 text-sky-400" />
                              Expecting {formatCurrency(r.totalExpectedReturn || 0)}
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                              <Trophy className="h-3.5 w-3.5" />
                              {formatCurrency(r.totalPaid || 0)}
                            </div>
                            <div
                              className={`inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[11px] font-black ${
                                pnl >= 0
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {pnl >= 0 ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              )}
                              {pnl >= 0
                                ? `+${formatCurrency(pnl)}`
                                : formatCurrency(pnl)}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Matrix{" "}
                              <span className="text-slate-300">
                                {formatCurrency(r.matrixPaid || 0)}
                              </span>{" "}
                              · Refs{" "}
                              <span className="text-slate-300">
                                {formatCurrency(r.referralPaid || 0)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="min-w-[140px] max-w-[160px] space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-300">
                                {formatPct(r.progressPct || 0, 0)}
                              </span>
                              <span className="text-slate-500">
                                {formatCurrency(r.totalEarningsPaid || 0)}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  (r.progressPct || 0) >= 90
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                                    : (r.progressPct || 0) >= 50
                                      ? "bg-gradient-to-r from-sky-500 to-violet-500"
                                      : "bg-gradient-to-r from-violet-500 to-amber-400"
                                }`}
                                style={{
                                  width: `${Math.min(100, r.progressPct || 0)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-500/5 px-2 py-0.5 text-[11px] font-black text-sky-200 ring-1 ring-sky-500/20">
                                <Users className="h-3 w-3" />
                                {formatNumber(r.referrals.total || 0)}
                              </span>
                              <span className="text-[10px] text-emerald-400">
                                {formatNumber(r.referrals.active || 0)} active
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                              <LevelDot lvl={1} filled={r.referrals.level1 || 0} max={2} />
                              <LevelDot lvl={2} filled={r.referrals.level2 || 0} max={4} />
                              <LevelDot lvl={3} filled={r.referrals.level3 || 0} max={8} />
                              <LevelDot lvl={4} filled={r.referrals.level4 || 0} max={16} />
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-200">
                              <Calendar className="h-3 w-3 text-slate-500" />
                              {formatDateShort(r.createdAt || r.joinedDate)}
                            </div>
                            {r.referredByName && (
                              <p
                                className="truncate text-[10px] text-violet-400"
                                title={`Referred by ${r.referredByName}`}
                              >
                                Via {r.referredByName}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(r.id);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                          >
                            <Info className="h-3.5 w-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-20 text-center text-slate-500"
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-white/5">
                        <Layers className="h-6 w-6 text-slate-500" />
                      </div>
                      <p className="font-bold text-slate-400">
                        No matrix rows match the filters
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try clearing filters, or wait for the first matrix
                        participant to join.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredRows.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 px-5 py-4 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-300">
                  {page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, filteredRows.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-300">
                  {filteredRows.length}
                </span>{" "}
                participants
              </p>
              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/50 px-2 py-1">
                  <span className="px-2 text-xs font-bold text-violet-400">
                    {page + 1}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="px-2 text-xs font-bold text-slate-500">
                    {totalPages}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-xs text-violet-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-bold">Tip:</span> Click any participant row
            to open the full matrix profile: balance, level, cycle counts,
            expected vs. paid return, per-level referral breakdown, and their
            direct referral list with activity status.
          </div>
        </div>
      </div>

      {selectedRow && (
        <MatrixDetailDrawer row={selectedRow} onClose={() => setSelectedId(null)} />
      )}
    </AdminLayout>
  );
}

function LevelDot({
  lvl,
  filled,
  max,
}: {
  lvl: number;
  filled: number;
  max: number;
}) {
  const pct = Math.min(100, Math.round((filled / max) * 100));
  const color =
    pct >= 100
      ? "bg-emerald-400"
      : pct >= 50
        ? "bg-sky-400"
        : pct > 0
          ? "bg-amber-400"
          : "bg-slate-700";
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 px-1.5 py-0.5">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="font-bold text-slate-300">L{lvl}</span>
      <span className="text-slate-500">
        {filled}/{max}
      </span>
    </span>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  icon: any;
  iconColor: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${accent} p-4`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/5 ${iconColor}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-xl font-black tracking-tight text-white break-all">
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

function KVRow({
  icon: Icon,
  label,
  value,
  mono,
  accent,
}: {
  icon?: any;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  accent?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
        {Icon && (
          <Icon className={`h-3.5 w-3.5 ${accent || "text-slate-400"}`} />
        )}
        {label}
      </div>
      <div
        className={`col-span-2 text-sm ${mono ? "font-mono" : ""} text-slate-200`}
      >
        {value !== null && value !== undefined && (value as any) !== "" ? (
          value
        ) : (
          <span className="text-slate-600 italic">—</span>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  accent,
  right,
  children,
}: {
  title: string;
  icon?: any;
  accent?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          {Icon && (
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/5 ${accent || "text-slate-300"}`}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
          <h3 className="text-sm font-black tracking-tight text-white">
            {title}
          </h3>
        </div>
        {right}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ReferralNode({
  name,
  email,
  active,
  createdAt,
  isPlaceholder = false,
}: {
  name?: string | null;
  email?: string | null;
  active?: boolean;
  createdAt?: any;
  isPlaceholder?: boolean;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0]?.toUpperCase() ?? "")
        .filter(Boolean)
        .slice(0, 2)
        .join("")
    : email?.slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`relative flex h-11 w-11 items-center justify-center rounded-full text-xs font-black transition-all ${
          isPlaceholder
            ? "bg-slate-800/40 ring-2 ring-white/5 border border-dashed border-white/10"
            : active
              ? "bg-emerald-600 ring-2 ring-emerald-500/30"
              : "bg-amber-700 ring-2 ring-amber-500/30"
        }`}
      >
        {isPlaceholder ? (
          <User className="h-4 w-4 text-slate-600 opacity-50" />
        ) : (
          <span className="text-white tracking-tight">
            {initials || (active ? "✓" : "·")}
          </span>
        )}
      </div>
      {!isPlaceholder ? (
        <div className="w-[90px] text-center">
          <p className="truncate text-[11px] font-semibold text-slate-200">
            {name || "User"}
          </p>
          <p className="truncate text-[10px] text-slate-500">{email}</p>
          <p
            className={`text-[10px] ${
              active ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {active ? "Active" : "Inactive"} · {formatDateShort(createdAt)}
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-600">Empty</p>
      )}
    </div>
  );
}

function MatrixDetailDrawer({
  row,
  onClose,
}: {
  row: MatrixRow;
  onClose: () => void;
}) {
  const pnl = (row.totalPaid || 0) - (row.totalInvested || 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative ml-auto flex h-full w-full max-w-[580px] flex-col overflow-y-auto border-l border-white/10 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/90 px-6 py-5 backdrop-blur">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-violet-300 ring-1 ring-violet-500/20">
                <Layers className="h-3 w-3" /> Participant Profile
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {row.fullName ||
                  [row.firstName, row.lastName].filter(Boolean).join(" ") ||
                  row.email ||
                  "Unnamed User"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                <span className="font-mono">{row.uid}</span> · {row.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Hero banner */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600/25 via-fuchsia-600/15 to-slate-900/60 p-4 ring-1 ring-violet-500/25">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">
                  Level
                </p>
                <p className="mt-0.5 text-2xl font-black text-white">
                  {row.matrixLevel || 1}
                </p>
                <p className="text-[10px] text-violet-300/80">
                  {row.matrixCycles || 0} total cycles
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">
                  Staked
                </p>
                <p className="mt-0.5 text-2xl font-black text-white">
                  {formatCurrency(row.totalInvested || 0)}
                </p>
                <p className="text-[10px] text-violet-300/80">
                  Target {formatCurrency(row.totalExpectedReturn || 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">
                  {pnl >= 0 ? "Net Profit" : "Net Deficit"}
                </p>
                <p
                  className={`mt-0.5 text-2xl font-black ${
                    pnl >= 0 ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {pnl >= 0
                    ? `+${formatCurrency(pnl)}`
                    : formatCurrency(pnl)}
                </p>
                <p className="text-[10px] text-violet-300/80">
                  Progress {formatPct(row.progressPct || 0, 0)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/5">
              <div
                className={`h-full rounded-full ${
                  (row.progressPct || 0) >= 90
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-200"
                    : (row.progressPct || 0) >= 50
                      ? "bg-gradient-to-r from-sky-400 to-violet-400"
                      : "bg-gradient-to-r from-violet-400 to-amber-300"
                }`}
                style={{ width: `${Math.min(100, row.progressPct || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 p-6 pb-10">
          <SectionCard title="Identity" icon={User} accent="text-sky-400">
            <KVRow
              icon={User}
              label="Full Name"
              value={
                row.fullName ||
                [row.firstName, row.lastName].filter(Boolean).join(" ") ||
                row.usernameDisplay ||
                row.username
              }
            />
            <KVRow icon={Mail} label="Email" value={row.email} />
            <KVRow
              icon={Hash}
              label="UID"
              value={<span className="font-mono text-xs">{row.uid}</span>}
              mono
            />
            <KVRow
              icon={MapPin}
              accent="text-emerald-400"
              label="Location"
              value={
                [row.city, row.country].filter(Boolean).join(", ") || null
              }
            />
            <KVRow
              icon={Calendar}
              accent="text-violet-400"
              label="Registered"
              value={formatDate(row.createdAt || row.joinedDate)}
            />
            <KVRow
              icon={UserPlus}
              accent="text-fuchsia-400"
              label="Referred By"
              value={
                row.referredByName ? (
                  <div>
                    <div className="font-bold text-fuchsia-300">
                      {row.referredByName}
                    </div>
                    {row.referredBy && (
                      <div className="font-mono text-[11px] text-slate-500">
                        {row.referredBy.slice(0, 10)}…
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-600 italic">None (organic)</span>
                )
              }
            />
          </SectionCard>

          <SectionCard
            title="Financials"
            icon={Wallet}
            accent="text-violet-400"
            right={
              <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-bold text-slate-300 ring-1 ring-white/5">
                Matrix Wallet
              </span>
            }
          >
            <KVRow
              icon={DollarSign}
              accent="text-violet-300"
              label="Matrix Balance"
              value={
                <span className="font-bold text-violet-300">
                  {formatCurrency(row.matrixBalance || 0)}
                </span>
              }
            />
            <KVRow
              icon={Layers}
              label="Invested"
              value={formatCurrency(row.totalInvested || 0)}
            />
            <KVRow
              icon={Target}
              accent="text-sky-400"
              label="Expected Return"
              value={formatCurrency(row.totalExpectedReturn || 0)}
            />
            <KVRow
              icon={Trophy}
              accent="text-emerald-400"
              label="Total Paid"
              value={formatCurrency(row.totalPaid || 0)}
            />
            <KVRow
              icon={Gift}
              accent="text-fuchsia-400"
              label="Matrix Payouts"
              value={formatCurrency(row.matrixPaid || 0)}
            />
            <KVRow
              icon={UserPlus}
              accent="text-amber-400"
              label="Referral Payouts"
              value={formatCurrency(row.referralPaid || 0)}
            />
            <KVRow
              icon={row.totalPaid - row.totalInvested >= 0 ? TrendingUp : Activity}
              accent={
                row.totalPaid - row.totalInvested >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }
              label="Net P&L"
              value={
                <span
                  className={`font-black ${
                    pnl >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {pnl >= 0
                    ? `+${formatCurrency(pnl)}`
                    : formatCurrency(pnl)}
                </span>
              }
            />
          </SectionCard>

          <SectionCard
            title="Cycles"
            icon={Gauge}
            accent="text-amber-400"
            right={
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ${
                  (row.progressPct || 0) >= 90
                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                    : "bg-violet-500/10 text-violet-300 ring-violet-500/20"
                }`}
              >
                {formatPct(row.progressPct || 0, 0)} overall
              </span>
            }
          >
            <KVRow
              icon={Rocket}
              accent="text-violet-300"
              label="Matrix Level"
              value={`Level ${row.matrixLevel || 1}`}
            />
            <KVRow
              icon={CheckCircle2}
              accent="text-sky-300"
              label="Completed Cycles"
              value={formatNumber(row.matrixCycles || row.cycles.completed || 0)}
            />
            <div className="grid grid-cols-3 gap-2 pt-1">
              <StatTile
                label="Active"
                value={formatNumber(row.cycles.active || 0)}
                color="emerald"
              />
              <StatTile
                label="Pending"
                value={formatNumber(row.cycles.pending || 0)}
                color="amber"
              />
              <StatTile
                label="Completed"
                value={formatNumber(row.cycles.completed || 0)}
                color="sky"
              />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Earnings progress</span>
                <span className="font-bold text-white">
                  {formatCurrency(row.totalEarningsPaid || 0)} /{" "}
                  {formatCurrency(row.totalExpectedReturn || 0)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    (row.progressPct || 0) >= 100
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-200"
                      : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400"
                  }`}
                  style={{ width: `${Math.min(100, row.progressPct || 0)}%` }}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Referral Tree"
            icon={Users}
            accent="text-sky-400"
            right={
              <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-300 ring-1 ring-sky-500/20">
                <UserPlus className="h-3 w-3" />
                {formatNumber(row.referrals.total || 0)} total
              </span>
            }
          >
            <div className="grid grid-cols-4 gap-2">
              <MatrixLevelTile
                level={1}
                filled={row.referrals.level1 || 0}
                of={2}
                accent="violet"
              />
              <MatrixLevelTile
                level={2}
                filled={row.referrals.level2 || 0}
                of={4}
                accent="sky"
              />
              <MatrixLevelTile
                level={3}
                filled={row.referrals.level3 || 0}
                of={8}
                accent="emerald"
              />
              <MatrixLevelTile
                level={4}
                filled={row.referrals.level4 || 0}
                of={16}
                accent="amber"
              />
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Level 1 · Direct Referrals ({row.referrals.level1 || 0}/2)
                </p>
                <ReferralGrid
                  count={2}
                  items={row.referrals.list.slice(0, 2)}
                />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Level 2 ({row.referrals.level2 || 0}/4)
                </p>
                <ReferralGrid
                  count={4}
                  items={row.referrals.list.slice(2, 6)}
                />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Level 3 ({row.referrals.level3 || 0}/8)
                </p>
                <ReferralGrid
                  count={8}
                  items={row.referrals.list.slice(6, 14)}
                />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Level 4 ({row.referrals.level4 || 0}/16)
                </p>
                <ReferralGrid
                  count={16}
                  items={row.referrals.list.slice(14, 30)}
                />
              </div>
              {row.referrals.total > 30 && (
                <p className="text-[10px] text-slate-500">
                  +{row.referrals.total - 30} more referrals beyond level 4 —
                  visible in referral reports.
                </p>
              )}
              {row.referrals.total === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-center text-xs text-slate-500">
                  <Users className="mx-auto mb-2 h-6 w-6 opacity-50" />
                  No direct referrals yet.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Payout Summary"
            icon={Gift}
            accent="text-fuchsia-400"
          >
            <KVRow
              icon={CheckCircle2}
              label="Transactions"
              value={formatNumber(row.totalPayouts || 0)}
            />
            <KVRow
              icon={Percent}
              label="Invested vs Paid"
              value={
                (row.totalInvested || 0) > 0 ? (
                  <span
                    className={`font-bold ${
                      (row.totalPaid || 0) / (row.totalInvested || 1) >= 1
                        ? "text-emerald-300"
                        : "text-slate-300"
                    }`}
                  >
                    {(
                      ((row.totalPaid || 0) / (row.totalInvested || 1)) *
                      100
                    ).toFixed(1)}
                    % returned of stake
                  </span>
                ) : (
                  <span className="text-slate-600 italic">
                    No investment yet
                  </span>
                )
              }
            />
            <KVRow
              icon={row.totalPaid - row.totalInvested >= 0 ? Trophy : Clock}
              accent={
                row.totalPaid - row.totalInvested >= 0
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
              label="Current Status"
              value={
                <span
                  className={`font-black ${
                    (row.totalInvested || 0) === 0
                      ? "text-slate-500"
                      : (row.totalPaid || 0) / (row.totalInvested || 1) >= 1
                        ? "text-emerald-400"
                        : (row.totalPaid || 0) === 0
                          ? "text-amber-300"
                          : "text-sky-300"
                  }`}
                >
                  {(row.totalInvested || 0) === 0
                    ? "No investment"
                    : (row.totalPaid || 0) / (row.totalInvested || 1) >= 1
                      ? "Profit cycle achieved ✓"
                      : (row.totalPaid || 0) === 0
                        ? "Awaiting payouts"
                        : "Earning into cycle"}
                </span>
              }
            />
          </SectionCard>
        </div>
      </aside>
    </div>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "emerald" | "amber" | "sky";
}) {
  const map = {
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-200 ring-emerald-500/20",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-200 ring-amber-500/20",
    sky: "from-sky-500/20 to-sky-500/5 text-sky-200 ring-sky-500/20",
  } as const;
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${map[color]} px-3 py-2 text-center ring-1`}
    >
      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-black">{value}</p>
    </div>
  );
}

function MatrixLevelTile({
  level,
  filled,
  of,
  accent,
}: {
  level: number;
  filled: number;
  of: number;
  accent: "violet" | "sky" | "emerald" | "amber";
}) {
  const pct = Math.min(100, Math.round((filled / of) * 100));
  const bg = {
    violet: "from-violet-500/20 to-violet-500/5 ring-violet-500/20 text-violet-200",
    sky: "from-sky-500/20 to-sky-500/5 ring-sky-500/20 text-sky-200",
    emerald: "from-emerald-500/20 to-emerald-500/5 ring-emerald-500/20 text-emerald-200",
    amber: "from-amber-500/20 to-amber-500/5 ring-amber-500/20 text-amber-200",
  }[accent];
  const bar = {
    violet: "bg-gradient-to-r from-violet-500 to-fuchsia-400",
    sky: "bg-gradient-to-r from-sky-500 to-cyan-300",
    emerald: "bg-gradient-to-r from-emerald-500 to-emerald-300",
    amber: "bg-gradient-to-r from-amber-500 to-yellow-300",
  }[accent];
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${bg} p-3 ring-1`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-90">
          L{level}
        </span>
        <span className="text-xs font-black">{filled}/{of}</span>
      </div>
      <p className="mt-1 text-[11px] font-bold opacity-80">{pct}%</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/20">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ReferralGrid({
  count,
  items,
}: {
  count: number;
  items: {
    id: string;
    email: string | null;
    fullName: string | null;
    createdAt: any;
    active: boolean;
  }[];
}) {
  const slots = Array.from({ length: count }, (_, i) => items[i] || null);
  return (
    <div
      className={`grid gap-y-3 ${
        count <= 2
          ? "grid-cols-2"
          : count <= 4
            ? "grid-cols-2 sm:grid-cols-4"
            : count <= 8
              ? "grid-cols-3 sm:grid-cols-4"
              : "grid-cols-4 sm:grid-cols-6"
      }`}
    >
      {slots.map((it, i) =>
        it ? (
          <ReferralNode
            key={it.id + i}
            name={it.fullName}
            email={it.email}
            active={it.active}
            createdAt={it.createdAt}
          />
        ) : (
          <ReferralNode key={`ph-${i}`} isPlaceholder />
        ),
      )}
    </div>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
