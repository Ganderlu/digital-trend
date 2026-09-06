"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trophy,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Percent,
  DollarSign,
  Activity,
  Hash,
  Calendar,
  X,
  Gauge,
  LineChart,
  CandlestickChart,
  Info,
} from "lucide-react";

type TradeStatus = "active" | "won" | "lost" | "settled";
type TradeDirection = "CALL" | "PUT";

type TradeRecord = {
  id: string;
  userId: string;
  userEmail: string;
  userFullName?: string | null;
  asset: string;
  assetName?: string;
  tvSymbol?: string;
  direction: TradeDirection;
  investment: number;
  entryPrice?: number;
  exitPrice?: number;
  expirySeconds?: number;
  timeframe?: string;
  status: TradeStatus;
  payoutRate?: number;
  payout: number;
  pnl: number;
  createdAt?: any;
  settledAt?: any;
  indicators?: {
    trend?: string;
    rsi?: number;
    macd?: number;
    support?: number;
    resistance?: number;
  };
};

type TradeSummary = {
  totalTrades: number;
  totalVolume: number;
  totalInvested: number;
  totalWon: number;
  totalLost: number;
  totalActive: number;
  totalSettled: number;
  totalPayout: number;
  totalPnl: number;
  winRate: number;
  uniqueTraders: number;
  avgProfitPerTrade: number;
};

const PAGE_SIZE = 15;

function formatDate(v: any, opts?: Intl.DateTimeFormatOptions) {
  if (!v) return "—";
  let date: Date | null = null;
  try {
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

function formatCurrency(amount?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function formatNumber(n?: number) {
  return new Intl.NumberFormat("en-US").format(n || 0);
}

function formatPct(n?: number, digits = 1) {
  return `${(n || 0).toFixed(digits)}%`;
}

type FilterTab = "all" | "active" | "won" | "lost";
type SortKey = "newest" | "investment" | "pnl" | "asset" | "user";

export default function AdminTradesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [summary, setSummary] = useState<TradeSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [directionFilter, setDirectionFilter] = useState<"all" | "CALL" | "PUT">("all");
  const [assetFilter, setAssetFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
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
      const res = await fetch("/api/admin/trades", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrades((data.trades || []) as TradeRecord[]);
        setSummary((data.summary || null) as TradeSummary | null);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
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

  const uniqueAssets = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => t.asset && set.add(t.asset));
    return Array.from(set).sort();
  }, [trades]);

  const filteredTrades = useMemo(() => {
    let list = trades.slice();

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (t) =>
          (t.userEmail || "").toLowerCase().includes(q) ||
          (t.userFullName || "").toLowerCase().includes(q) ||
          (t.asset || "").toLowerCase().includes(q) ||
          (t.assetName || "").toLowerCase().includes(q) ||
          (t.userId || "").toLowerCase().includes(q) ||
          (t.id || "").toLowerCase().includes(q),
      );
    }

    if (filterTab !== "all") {
      list = list.filter((t) => t.status === filterTab);
    }

    if (directionFilter !== "all") {
      list = list.filter((t) => t.direction === directionFilter);
    }

    if (assetFilter !== "all") {
      list = list.filter((t) => t.asset === assetFilter);
    }

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        break;
      case "investment":
        list.sort((a, b) => (b.investment || 0) - (a.investment || 0));
        break;
      case "pnl":
        list.sort((a, b) => (b.pnl || 0) - (a.pnl || 0));
        break;
      case "asset":
        list.sort((a, b) => (a.asset || "").localeCompare(b.asset || ""));
        break;
      case "user":
        list.sort((a, b) =>
          (a.userEmail || "").localeCompare(b.userEmail || ""),
        );
        break;
    }

    return list;
  }, [trades, searchTerm, filterTab, sortBy, directionFilter, assetFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterTab, sortBy, directionFilter, assetFilter]);

  const pagedTrades = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredTrades.slice(start, start + PAGE_SIZE);
  }, [filteredTrades, page]);

  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / PAGE_SIZE));

  const selectedTrade = useMemo(
    () =>
      selectedTradeId
        ? filteredTrades.find((t) => t.id === selectedTradeId) ||
          trades.find((t) => t.id === selectedTradeId) ||
          null
        : null,
    [selectedTradeId, filteredTrades, trades],
  );

  const filteredSummary = useMemo(() => {
    const s = filteredTrades;
    const won = s.filter((t) => t.status === "won").length;
    const lost = s.filter((t) => t.status === "lost").length;
    return {
      count: s.length,
      invested: s.reduce((a, t) => a + (t.investment || 0), 0),
      payout: s.reduce((a, t) => a + (t.payout || 0), 0),
      pnl: s.reduce((a, t) => a + (t.pnl || 0), 0),
      active: s.filter((t) => t.status === "active").length,
      won,
      lost,
      winRate: won + lost > 0 ? (won / (won + lost)) * 100 : 0,
    };
  }, [filteredTrades]);

  const filterTabs: {
    key: FilterTab;
    label: string;
    count?: number;
    icon: any;
    accent: string;
    bg: string;
  }[] = [
    {
      key: "all",
      label: "All Trades",
      icon: BarChart3,
      accent: "text-slate-300",
      bg: "from-slate-700/30 to-slate-800/10",
      count: summary?.totalTrades,
    },
    {
      key: "active",
      label: "Active",
      icon: Clock,
      accent: "text-amber-400",
      bg: "from-amber-500/25 to-amber-500/5",
      count: summary?.totalActive,
    },
    {
      key: "won",
      label: "Won",
      icon: Trophy,
      accent: "text-emerald-400",
      bg: "from-emerald-500/25 to-emerald-500/5",
      count: summary?.totalWon,
    },
    {
      key: "lost",
      label: "Lost",
      icon: Target,
      accent: "text-red-400",
      bg: "from-red-500/25 to-red-500/5",
      count: summary?.totalLost,
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="h-7 w-7 animate-spin text-emerald-500" />
            <div className="text-sm font-medium">Loading trades...</div>
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
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <BarChart3 className="h-3.5 w-3.5" />
              Trade Management
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              All user trades
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Monitor every binary options trade, including entry/exit prices,
              direction, P&L, and the technical indicators used at entry time.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-4 text-sm font-bold text-slate-300 transition hover:border-emerald-500/30 hover:text-emerald-300 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`}
              />
              Refresh
            </button>
            <div className="relative sm:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search user, asset, trade ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 pl-11 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
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

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SummaryCard
            label="Total Trades"
            value={formatNumber(summary?.totalTrades || 0)}
            sub={`${formatNumber(summary?.uniqueTraders || 0)} unique traders`}
            accent="from-slate-800 to-slate-900"
            icon={Activity}
            iconColor="text-slate-300"
          />
          <SummaryCard
            label="Total Volume"
            value={formatCurrency(summary?.totalVolume || 0)}
            sub="Sum of all investments"
            accent="from-sky-500/20 to-sky-500/5"
            icon={Wallet}
            iconColor="text-sky-400"
          />
          <SummaryCard
            label="Net P&L"
            value={
              (summary?.totalPnl || 0) >= 0
                ? `+${formatCurrency(summary?.totalPnl || 0)}`
                : formatCurrency(summary?.totalPnl || 0)
            }
            sub={
              (summary?.totalPnl || 0) >= 0
                ? "Users in profit"
                : "Users in loss"
            }
            accent={
              (summary?.totalPnl || 0) >= 0
                ? "from-emerald-500/20 to-emerald-500/5"
                : "from-red-500/20 to-red-500/5"
            }
            icon={
              (summary?.totalPnl || 0) >= 0 ? TrendingUp : TrendingDown
            }
            iconColor={
              (summary?.totalPnl || 0) >= 0 ? "text-emerald-400" : "text-red-400"
            }
          />
          <SummaryCard
            label="Win Rate"
            value={formatPct(summary?.winRate || 0)}
            sub={`${formatNumber(summary?.totalWon || 0)} W · ${formatNumber(summary?.totalLost || 0)} L`}
            accent="from-violet-500/20 to-violet-500/5"
            icon={Percent}
            iconColor="text-violet-400"
          />
          <SummaryCard
            label="Active Now"
            value={formatNumber(summary?.totalActive || 0)}
            sub="Open positions"
            accent="from-amber-500/20 to-amber-500/5"
            icon={Zap}
            iconColor="text-amber-400"
          />
          <SummaryCard
            label="Avg / Trade"
            value={
              (summary?.avgProfitPerTrade || 0) >= 0
                ? `+${formatCurrency(summary?.avgProfitPerTrade || 0)}`
                : formatCurrency(summary?.avgProfitPerTrade || 0)
            }
            sub="Per settled trade"
            accent="from-fuchsia-500/20 to-fuchsia-500/5"
            icon={Gauge}
            iconColor="text-fuchsia-400"
          />
        </div>

        {/* Filter Segment + Sort + Filters */}
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
                  Asset
                </label>
                <select
                  value={assetFilter}
                  onChange={(e) => setAssetFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-emerald-500/40"
                >
                  <option value="all">All Assets</option>
                  {uniqueAssets.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex items-center gap-1.5">
                <CandlestickChart className="h-3.5 w-3.5 text-slate-500" />
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Direction
                </label>
                <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                  {[
                    { k: "all", label: "All" },
                    { k: "CALL", label: "CALL / UP" },
                    { k: "PUT", label: "PUT / DOWN" },
                  ].map((o) => (
                    <button
                      key={o.k}
                      onClick={() =>
                        setDirectionFilter(o.k as "all" | "CALL" | "PUT")
                      }
                      className={`px-3 py-1.5 text-[11px] font-bold transition ${
                        directionFilter === o.k
                          ? o.k === "CALL"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : o.k === "PUT"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-white/10 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Sort by
              </label>
              <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                {[
                  { k: "newest", label: "Newest" },
                  { k: "investment", label: "Stake" },
                  { k: "pnl", label: "P&L" },
                  { k: "asset", label: "Asset" },
                  { k: "user", label: "User" },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setSortBy(o.k as SortKey)}
                    className={`px-3 py-1.5 text-[11px] font-semibold transition ${
                      sortBy === o.k
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredSummary.count !== trades.length && (
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-2.5 text-xs text-emerald-300">
              <span className="font-black">Filtered:</span>{" "}
              {formatNumber(filteredSummary.count)} trades · Stake{" "}
              <span className="font-bold text-white">
                {formatCurrency(filteredSummary.invested)}
              </span>{" "}
              · P&L{" "}
              <span
                className={`font-bold ${
                  filteredSummary.pnl >= 0
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {filteredSummary.pnl >= 0
                  ? `+${formatCurrency(filteredSummary.pnl)}`
                  : formatCurrency(filteredSummary.pnl)}
              </span>{" "}
              · Win rate{" "}
              <span className="font-bold text-white">
                {formatPct(filteredSummary.winRate)}
              </span>
            </div>
          )}
        </div>

        {/* Trades Table */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    User
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Asset · Direction
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Stake · Payout
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    P&L
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Entry / Exit
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Time · TF
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Status
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
                {pagedTrades.length > 0 ? (
                  pagedTrades.map((t) => {
                    const isSelected = selectedTrade?.id === t.id;
                    const pnlClass =
                      t.status === "active"
                        ? "text-amber-300"
                        : (t.pnl || 0) >= 0
                          ? "text-emerald-400"
                          : "text-red-400";
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTradeId(t.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-emerald-500/8"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3 pr-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-white/5">
                              <Users className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-100">
                                {t.userFullName || t.userEmail}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {t.userEmail}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] font-mono text-slate-600">
                                #{(t.id || "").slice(0, 10)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800/70 px-2 py-0.5 text-[11px] font-black text-slate-200 ring-1 ring-white/5">
                                <LineChart className="h-3 w-3 text-sky-400" />
                                {t.asset}
                              </span>
                              <DirectionBadge direction={t.direction} />
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {t.assetName || "—"}
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-100">
                              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                              {formatCurrency(t.investment)}
                            </div>
                            {t.status !== "active" && (
                              <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                                <Trophy className="h-3 w-3 text-amber-400" />
                                Payout {formatCurrency(t.payout)}
                              </div>
                            )}
                            {t.status === "active" && (
                              <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                                <Percent className="h-3 w-3 text-violet-400" />
                                {formatPct((t.payoutRate || 0) * 100, 0)} payout
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div
                            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 font-black ${
                              t.status === "active"
                                ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20"
                                : (t.pnl || 0) >= 0
                                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                  : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                            }`}
                          >
                            {(t.pnl || 0) >= 0 && t.status !== "active" ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : t.status === "active" ? (
                              <Clock className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}
                            <span className="text-xs tracking-tight">
                              {t.status === "active"
                                ? "—"
                                : (t.pnl || 0) >= 0
                                  ? `+${formatCurrency(t.pnl)}`
                                  : formatCurrency(t.pnl)}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5 text-[12px]">
                            <div className="inline-flex items-center gap-1.5 text-slate-300">
                              <span className="text-slate-500">Entry:</span>
                              <span className="font-mono font-semibold">
                                {formatPrice(t.entryPrice)}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-slate-400">
                              <span className="text-slate-500">Exit:</span>
                              <span className="font-mono font-semibold">
                                {formatPrice(t.exitPrice)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-200">
                              <Calendar className="h-3 w-3 text-slate-500" />
                              {formatDateShort(t.createdAt)}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              <Hash className="h-3 w-3" />
                              {t.timeframe || "—"} ·{" "}
                              {t.expirySeconds
                                ? t.expirySeconds >= 60
                                  ? `${Math.round(t.expirySeconds / 60)}m`
                                  : `${t.expirySeconds}s`
                                : "—"}
                            </div>
                            {t.settledAt && (
                              <p className="text-[10px] text-slate-600">
                                Settled {formatDateShort(t.settledAt)}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <StatusBadge status={t.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTradeId(t.id);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
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
                        <BarChart3 className="h-6 w-6 text-slate-500" />
                      </div>
                      <p className="font-bold text-slate-400">
                        No trades match the filters
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try removing filters, or wait for the first live trade.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredTrades.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 px-5 py-4 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-300">
                  {page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, filteredTrades.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-300">
                  {filteredTrades.length}
                </span>{" "}
                trades
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
                  <span className="px-2 text-xs font-bold text-emerald-400">
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

        {/* Helper caption */}
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-sky-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-bold">Tip:</span> Click any row or the
            &quot;View&quot; button to inspect the full trade context —
            including entry/exit prices, expiry, RSI / MACD / trend indicators
            captured by the client at the moment of entry.
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedTrade && (
        <TradeDetailDrawer
          trade={selectedTrade}
          onClose={() => setSelectedTradeId(null)}
        />
      )}
    </AdminLayout>
  );
}

function formatPrice(v?: number) {
  if (v === undefined || v === null || isNaN(v)) return "—";
  if (v >= 1000) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v);
  if (v >= 1) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(v);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(v);
}

function DirectionBadge({ direction }: { direction: TradeDirection }) {
  const isCall = direction === "CALL";
  return (
    <span
      className={`inline-flex items-center gap-1 self-start rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ${
        isCall
          ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25"
          : "bg-red-500/15 text-red-300 ring-red-500/25"
      }`}
    >
      {isCall ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {direction}
    </span>
  );
}

function StatusBadge({ status }: { status: TradeStatus }) {
  if (status === "won")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/25">
        <CheckCircle2 className="h-3 w-3" /> Won
      </span>
    );
  if (status === "lost")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-red-300 ring-1 ring-red-500/25">
        <XCircle className="h-3 w-3" /> Lost
      </span>
    );
  if (status === "settled")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-sky-300 ring-1 ring-sky-500/25">
        <CheckCircle2 className="h-3 w-3" /> Settled
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 self-start rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/25">
      <Clock className="h-3 w-3 animate-pulse" /> Active
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

function TradeDetailDrawer({
  trade,
  onClose,
}: {
  trade: TradeRecord;
  onClose: () => void;
}) {
  const pnlPositive = (trade.pnl || 0) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative ml-auto flex h-full w-full max-w-[560px] flex-col overflow-y-auto border-l border-white/10 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/90 px-6 py-5 backdrop-blur">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/20">
                <Activity className="h-3 w-3" /> Trade Detail
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {trade.asset} · {trade.direction}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Trade ID <span className="font-mono">{trade.id}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* P&L banner */}
          <div
            className={`rounded-2xl p-4 ring-1 ${
              trade.status === "active"
                ? "bg-amber-500/10 ring-amber-500/25"
                : pnlPositive
                  ? "bg-emerald-500/10 ring-emerald-500/25"
                  : "bg-red-500/10 ring-red-500/25"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    trade.status === "active"
                      ? "text-amber-300"
                      : pnlPositive
                        ? "text-emerald-300"
                        : "text-red-300"
                  }`}
                >
                  {trade.status === "active"
                    ? "Open position"
                    : pnlPositive
                      ? "Realized P&L"
                      : "Realized P&L"}
                </p>
                <p
                  className={`mt-1 text-2xl font-black tracking-tight ${
                    trade.status === "active"
                      ? "text-amber-100"
                      : pnlPositive
                        ? "text-emerald-100"
                        : "text-red-100"
                  }`}
                >
                  {trade.status === "active"
                    ? "Awaiting settlement"
                    : pnlPositive
                      ? `+${formatCurrency(trade.pnl)}`
                      : formatCurrency(trade.pnl)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={trade.status} />
                <DirectionBadge direction={trade.direction} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 p-6">
          <SectionCard
            title="Trader"
            icon={Users}
            accent="text-sky-400"
          >
            <KVRow
              icon={Users}
              label="User"
              value={
                <div>
                  <div className="font-bold text-slate-100">
                    {trade.userFullName || "—"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {trade.userEmail}
                  </div>
                </div>
              }
            />
            <KVRow
              icon={Hash}
              label="UID"
              value={<span className="font-mono text-xs">{trade.userId}</span>}
              mono
            />
          </SectionCard>

          <SectionCard
            title="Market"
            icon={LineChart}
            accent="text-violet-400"
          >
            <KVRow
              icon={CandlestickChart}
              label="Symbol"
              value={
                <div>
                  <div className="font-bold text-slate-100">{trade.asset}</div>
                  <div className="text-xs text-slate-500">
                    {trade.assetName || "—"} · {trade.tvSymbol || "—"}
                  </div>
                </div>
              }
            />
            <KVRow
              icon={Zap}
              label="Timeframe"
              value={`${trade.timeframe || "—"} · ${
                trade.expirySeconds
                  ? trade.expirySeconds >= 60
                    ? `${Math.round(trade.expirySeconds / 60)} min expiry`
                    : `${trade.expirySeconds}s expiry`
                  : "—"
              }`}
            />
          </SectionCard>

          <SectionCard
            title="Pricing"
            icon={DollarSign}
            accent="text-emerald-400"
          >
            <KVRow
              icon={ArrowUpRight}
              label="Entry Price"
              value={
                <span className="font-mono font-bold text-sky-300">
                  {formatPrice(trade.entryPrice)}
                </span>
              }
              mono
            />
            <KVRow
              icon={ArrowDownRight}
              label="Exit Price"
              value={
                <span className="font-mono font-bold text-white">
                  {formatPrice(trade.exitPrice)}
                </span>
              }
              mono
            />
            {trade.entryPrice !== undefined &&
              trade.exitPrice !== undefined &&
              trade.direction && (
                <KVRow
                  icon={Target}
                  label="Forecast ✓"
                  value={
                    <span
                      className={`font-black ${
                        ((trade.direction === "CALL" &&
                          (trade.exitPrice || 0) >=
                            (trade.entryPrice || 0)) ||
                          (trade.direction === "PUT" &&
                            (trade.exitPrice || 0) <=
                              (trade.entryPrice || 0)))
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {((trade.direction === "CALL" &&
                        (trade.exitPrice || 0) >=
                          (trade.entryPrice || 0)) ||
                        (trade.direction === "PUT" &&
                          (trade.exitPrice || 0) <=
                            (trade.entryPrice || 0)))
                        ? "Direction was correct"
                        : "Direction was incorrect"}
                    </span>
                  }
                />
              )}
          </SectionCard>

          <SectionCard
            title="Financials"
            icon={Wallet}
            accent="text-amber-400"
          >
            <KVRow
              icon={DollarSign}
              label="Investment"
              value={
                <span className="font-bold text-white">
                  {formatCurrency(trade.investment)}
                </span>
              }
            />
            <KVRow
              icon={Trophy}
              label="Payout"
              value={
                <span className="font-bold text-amber-300">
                  {formatCurrency(trade.payout)}
                </span>
              }
            />
            <KVRow
              icon={Percent}
              label="Payout Rate"
              value={formatPct((trade.payoutRate || 0) * 100, 0)}
            />
            <KVRow
              icon={trade.pnl >= 0 ? TrendingUp : TrendingDown}
              accent={pnlPositive ? "text-emerald-400" : "text-red-400"}
              label="Net P&L"
              value={
                <span
                  className={`font-black ${
                    trade.status === "active"
                      ? "text-amber-300"
                      : pnlPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                  }`}
                >
                  {trade.status === "active"
                    ? "—"
                    : pnlPositive
                      ? `+${formatCurrency(trade.pnl)}`
                      : formatCurrency(trade.pnl)}
                </span>
              }
            />
          </SectionCard>

          <SectionCard
            title="Timing"
            icon={Calendar}
            accent="text-fuchsia-400"
          >
            <KVRow
              icon={Calendar}
              label="Opened"
              value={
                <span className="text-slate-200">
                  {formatDate(trade.createdAt)}
                </span>
              }
            />
            <KVRow
              icon={CheckCircle2}
              label="Settled"
              value={
                <span className="text-slate-200">
                  {formatDate(trade.settledAt)}
                </span>
              }
            />
          </SectionCard>

          <SectionCard
            title="Entry Signals (Snapshot)"
            icon={Gauge}
            accent="text-sky-400"
            right={
              <span className="rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-white/5">
                At open time
              </span>
            }
          >
            <KVRow
              icon={TrendingUp}
              accent="text-emerald-400"
              label="Trend"
              value={
                <span
                  className={`font-bold ${
                    (trade.indicators?.trend || "") === "Bullish"
                      ? "text-emerald-400"
                      : (trade.indicators?.trend || "") === "Bearish"
                        ? "text-red-400"
                        : "text-slate-400"
                  }`}
                >
                  {trade.indicators?.trend || "—"}
                </span>
              }
            />
            <KVRow
              icon={Activity}
              accent="text-violet-400"
              label="RSI"
              value={
                trade.indicators?.rsi !== undefined
                  ? `${Number(trade.indicators.rsi).toFixed(2)} ${
                      trade.indicators.rsi > 70
                        ? "·  <span class='text-red-400'>Overbought</span>"
                        : trade.indicators.rsi < 30
                          ? '·  <span class="text-emerald-400">Oversold</span>'
                          : ""
                    }`
                  : "—"
              }
            />
            <KVRow
              icon={LineChart}
              accent="text-fuchsia-400"
              label="MACD"
              value={
                trade.indicators?.macd !== undefined
                  ? Number(trade.indicators.macd).toFixed(4)
                  : "—"
              }
              mono
            />
            <KVRow
              icon={Target}
              accent="text-sky-400"
              label="Support"
              value={
                trade.indicators?.support !== undefined
                  ? formatPrice(Number(trade.indicators.support))
                  : "—"
              }
              mono
            />
            <KVRow
              icon={Target}
              accent="text-red-400"
              label="Resistance"
              value={
                trade.indicators?.resistance !== undefined
                  ? formatPrice(Number(trade.indicators.resistance))
                  : "—"
              }
              mono
            />
          </SectionCard>
        </div>
      </aside>
    </div>
  );
}
