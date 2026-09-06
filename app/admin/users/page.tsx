"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import ProfileAvatar from "@/components/profile-avatar";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  MapPin,
  X,
  User,
  Phone,
  Globe,
  Wallet,
  TrendingUp,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  Clock,
  Hash,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Info,
  CircleDollarSign,
  FileUser,
  Plus,
  Minus,
  Send,
} from "lucide-react";

type UserStats = {
  depositCount: number;
  depositTotal: number;
  approvedDeposits: number;
  approvedDepositTotal: number;
  withdrawCount: number;
  withdrawTotal: number;
  approvedWithdrawals: number;
  approvedWithdrawTotal: number;
  investmentCount: number;
  investmentTotal: number;
  activeInvestments: number;
  activeInvestmentTotal: number;
  referralCount: number;
  referralEarningsTotal: number;
};

type UserData = {
  id: string;
  uid?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  usernameDisplay?: string;
  role?: string;
  createdAt?: string | null;
  joinedDate?: string | null;
  lastActivityAt?: string | null;
  balance?: number;
  totalInvested?: number;
  referralEarnings?: number;
  activeDeposits?: number;
  status?: "active" | "banned" | string;
  accountStatus?: string;
  photoURL?: string;
  photoPublicId?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  timezone?: string;
  language?: string;
  referredBy?: string;
  referredByName?: string | null;
  profileVerificationStatus?: string;
  profileSubmittedAt?: string | null;
  profileImageUploaded?: boolean;
  registrationLocation?: {
    ip?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
    postal?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    latitudeLongitude?: string | null;
    timezone?: string | null;
    currency?: string | null;
    asn?: string | null;
    provider?: string | null;
    userSelectedCountry?: string | null;
    userSelectedRegion?: string | null;
    userSelectedCity?: string | null;
    registeredAt?: string | null;
    userAgent?: string | null;
    referer?: string | null;
    cityAuto?: string | null;
    regionAuto?: string | null;
    countryAuto?: string | null;
  } | null;
  stats?: UserStats;
  [key: string]: any;
};

type PageSummary = {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  pendingVerification: number;
  verified: number;
  totalBalance: number;
  totalDepositsAgg: number;
  totalWithdrawalsAgg: number;
};

const PAGE_SIZE = 12;

function formatDate(v: any, opts?: Intl.DateTimeFormatOptions) {
  if (!v) return "—";
  let date: Date | null = null;
  try {
    if (typeof v === "string") date = new Date(v);
    else if (typeof v.toDate === "function") date = v.toDate();
    else if (v && typeof v === "object" && typeof v._seconds === "number")
      date = new Date(v._seconds * 1000 + (v._nanoseconds || 0) / 1000000);
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

function relativeDays(from: any): string {
  if (!from) return "—";
  let d: Date | null = null;
  try {
    d = typeof from === "string" ? new Date(from) : new Date(from);
    if (!d || isNaN(d.getTime())) return "—";
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch {
    return "—";
  }
}

type FilterTab =
  | "all"
  | "active"
  | "banned"
  | "pending_review"
  | "verified"
  | "investors"
  | "referred";

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [summary, setSummary] = useState<PageSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "balance" | "deposits" | "invested" | "name"
  >("newest");
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    let unsubscribe: (() => void) | undefined;
    let live = true;

    unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      try {
        const idToken = await getIdToken(currentUser, true);
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (!live) return;
        if (data.success) {
          setUsers((data.users || []) as UserData[]);
          setSummary((data.summary || null) as PageSummary | null);
        } else {
          console.error("Failed to fetch users:", data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        if (live) setLoading(false);
      }
    });

    return () => {
      live = false;
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  const filteredUsers = useMemo(() => {
    let list = users.slice();

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.email || "").toLowerCase().includes(q) ||
          (u.username || "").toLowerCase().includes(q) ||
          (u.usernameDisplay || "").toLowerCase().includes(q) ||
          (u.firstName || "").toLowerCase().includes(q) ||
          (u.lastName || "").toLowerCase().includes(q) ||
          (u.fullName || "").toLowerCase().includes(q) ||
          (u.phone || "").toLowerCase().includes(q) ||
          (u.referredBy || "").toLowerCase().includes(q) ||
          (u.id || "").toLowerCase().includes(q) ||
          (u.registrationLocation?.ip || "").toLowerCase().includes(q) ||
          (u.country || "").toLowerCase().includes(q) ||
          (u.registrationLocation?.city || "").toLowerCase().includes(q),
      );
    }

    switch (filterTab) {
      case "active":
        list = list.filter((u) => !u.status || u.status === "active");
        break;
      case "banned":
        list = list.filter((u) => u.status === "banned");
        break;
      case "pending_review":
        list = list.filter(
          (u) => u.profileVerificationStatus === "pending_review",
        );
        break;
      case "verified":
        list = list.filter(
          (u) =>
            u.profileVerificationStatus === "approved" ||
            u.profileVerificationStatus === "verified",
        );
        break;
      case "investors":
        list = list.filter((u) => (u.stats?.investmentCount || 0) > 0);
        break;
      case "referred":
        list = list.filter((u) => !!u.referredBy);
        break;
    }

    switch (sortBy) {
      case "newest":
        list.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        break;
      case "balance":
        list.sort(
          (a, b) => (Number(b.balance) || 0) - (Number(a.balance) || 0),
        );
        break;
      case "deposits":
        list.sort(
          (a, b) =>
            (b.stats?.approvedDepositTotal || 0) -
            (a.stats?.approvedDepositTotal || 0),
        );
        break;
      case "invested":
        list.sort(
          (a, b) =>
            (b.stats?.investmentTotal || 0) - (a.stats?.investmentTotal || 0),
        );
        break;
      case "name":
        list.sort((a, b) => {
          const na =
            `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.email;
          const nb =
            `${b.firstName || ""} ${b.lastName || ""}`.trim() || b.email;
          return na.localeCompare(nb);
        });
        break;
    }

    return list;
  }, [users, searchTerm, filterTab, sortBy]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterTab, sortBy]);

  const pagedUsers = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const selectedUser = useMemo(
    () =>
      selectedUserId
        ? filteredUsers.find((u) => u.id === selectedUserId) ||
          users.find((u) => u.id === selectedUserId) ||
          null
        : null,
    [selectedUserId, filteredUsers, users],
  );

  const statsTabs: {
    key: FilterTab;
    label: string;
    count?: number;
    icon: any;
    accent: string;
  }[] = [
    {
      key: "all",
      label: "All",
      icon: Users,
      accent: "text-slate-300",
      count: summary?.totalUsers,
    },
    {
      key: "active",
      label: "Active",
      icon: CheckCircle,
      accent: "text-emerald-400",
      count: summary?.activeUsers,
    },
    {
      key: "pending_review",
      label: "Pending Review",
      icon: Clock,
      accent: "text-amber-400",
      count: summary?.pendingVerification,
    },
    {
      key: "verified",
      label: "Verified",
      icon: ShieldCheck,
      accent: "text-sky-400",
      count: summary?.verified,
    },
    {
      key: "investors",
      label: "Investors",
      icon: TrendingUp,
      accent: "text-violet-400",
      count: undefined,
    },
    {
      key: "referred",
      label: "Referred",
      icon: Sparkles,
      accent: "text-fuchsia-400",
      count: undefined,
    },
    {
      key: "banned",
      label: "Banned",
      icon: Ban,
      accent: "text-red-400",
      count: summary?.bannedUsers,
    },
  ];

  const toggleUserStatus = async (u: UserData) => {
    const newStatus: "active" | "banned" =
      u.status === "banned" ? "active" : "banned";
    setActionBusy(u.id);
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      const idToken = await getIdToken(currentUser, true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: u.id,
          action: "set_status",
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update status");
      }
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)),
      );
    } catch (e: any) {
      console.error(e);
      alert(`Failed to update user status: ${e?.message || "Unknown error"}`);
    } finally {
      setActionBusy(null);
    }
  };

  const setVerificationStatus = async (
    u: UserData,
    status: "approved" | "rejected" | "pending_review",
  ) => {
    setActionBusy(u.id + ":verification");
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      const idToken = await getIdToken(currentUser, true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: u.id,
          action: "set_verification",
          verificationStatus: status,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update verification status");
      }
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, profileVerificationStatus: status } : x,
        ),
      );
    } catch (e: any) {
      console.error(e);
      alert(
        `Failed to update verification status: ${e?.message || "Unknown error"}`,
      );
    } finally {
      setActionBusy(null);
    }
  };

  const adjustBalance = async (
    u: UserData,
    action: "increase_balance" | "decrease_balance",
    amount: number,
    note?: string,
  ) => {
    setActionBusy(u.id + ":balance");
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      const idToken = await getIdToken(currentUser, true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: u.id,
          action,
          amount,
          note,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to adjust balance");
      }
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id
            ? {
                ...x,
                balance: Number(data.newBalance) || 0,
              }
            : x,
        ),
      );
      return data;
    } catch (e: any) {
      console.error(e);
      alert(`Balance adjustment failed: ${e?.message || "Unknown error"}`);
      throw e;
    } finally {
      setActionBusy(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="h-7 w-7 animate-spin text-emerald-500" />
            <div className="text-sm font-medium">Loading users...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] p-5 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <Users className="h-3.5 w-3.5" />
              User Management
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              All registered users
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Click any row to view the full account profile, verification data,
              registration IP location, and activity.
            </p>
          </div>
          <div className="relative sm:min-w-[340px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, username, IP, country..."
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

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SummaryCard
            label="Total Users"
            value={formatNumber(summary?.totalUsers || users.length)}
            accent="from-slate-800 to-slate-900"
            icon={Users}
            iconColor="text-slate-300"
          />
          <SummaryCard
            label="Active"
            value={formatNumber(summary?.activeUsers || 0)}
            accent="from-emerald-500/20 to-emerald-500/5"
            icon={CheckCircle}
            iconColor="text-emerald-400"
          />
          <SummaryCard
            label="Pending Review"
            value={formatNumber(summary?.pendingVerification || 0)}
            accent="from-amber-500/20 to-amber-500/5"
            icon={Clock}
            iconColor="text-amber-400"
          />
          <SummaryCard
            label="Banned"
            value={formatNumber(summary?.bannedUsers || 0)}
            accent="from-red-500/20 to-red-500/5"
            icon={Ban}
            iconColor="text-red-400"
          />
          <SummaryCard
            label="Total Balance"
            value={formatCurrency(summary?.totalBalance)}
            accent="from-sky-500/20 to-sky-500/5"
            icon={Wallet}
            iconColor="text-sky-400"
          />
          <SummaryCard
            label="Net Deposited"
            value={formatCurrency(
              (summary?.totalDepositsAgg || 0) -
                (summary?.totalWithdrawalsAgg || 0),
            )}
            sub={`In ${formatCurrency(summary?.totalDepositsAgg || 0)} · Out ${formatCurrency(summary?.totalWithdrawalsAgg || 0)}`}
            accent="from-violet-500/20 to-violet-500/5"
            icon={CircleDollarSign}
            iconColor="text-violet-400"
          />
        </div>

        {/* Filter Tabs + Sort */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {statsTabs.map((t) => {
              const Icon = t.icon;
              const active = filterTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setFilterTab(t.key)}
                  className={`group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${t.accent}`} />
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                        active
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Sort by
            </label>
            <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              {[
                { k: "newest", label: "Newest" },
                { k: "balance", label: "Balance" },
                { k: "deposits", label: "Deposits" },
                { k: "invested", label: "Invested" },
                { k: "name", label: "Name" },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => setSortBy(o.k as any)}
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

        {/* Users Table */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    User
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Role / Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Balance · Invested
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Deposits / Withdrawals
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Location · IP
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    Joined
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pagedUsers.length > 0 ? (
                  pagedUsers.map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUserId(u.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-emerald-500/8" : "hover:bg-white/5"
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3 pr-4">
                            <div className="relative">
                              <ProfileAvatar
                                src={u.photoURL}
                                alt={`${u.firstName || ""} ${u.lastName || ""}`}
                                fallbackInitials={`${u.firstName || ""} ${u.lastName || u.email || ""}`}
                                size="h-10 w-10"
                                iconSize={16}
                              />
                              {u.status !== "banned" && (
                                <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                              )}
                              {u.status === "banned" && (
                                <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-slate-900 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-bold text-slate-100">
                                  {u.fullName ||
                                    (u.firstName && u.lastName
                                      ? `${u.firstName} ${u.lastName}`
                                      : u.usernameDisplay ||
                                        u.username ||
                                        u.email)}
                                </p>
                                {u.username && (
                                  <span className="shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                                    @{u.username}
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                                <Mail className="h-3 w-3" />
                                {u.email}
                              </p>
                              {u.referredBy && (
                                <p className="mt-0.5 truncate text-[11px] font-medium text-fuchsia-400">
                                  ↳ Referred by @{u.referredBy}
                                  {u.referredByName
                                    ? ` (${u.referredByName})`
                                    : ""}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <RoleBadge role={u.role} />
                            <StatusBadge
                              status={u.status}
                              profile={u.profileVerificationStatus}
                            />
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-1.5 font-bold text-slate-100">
                              <Wallet className="h-3.5 w-3.5 text-sky-400" />
                              {formatCurrency(u.balance)}
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                              <TrendingUp className="h-3 w-3 text-violet-400" />
                              {formatCurrency(
                                u.stats?.investmentTotal ||
                                  u.totalInvested ||
                                  0,
                              )}{" "}
                              invested
                              {(u.stats?.activeInvestments || 0) > 0 && (
                                <span className="ml-1 rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-violet-300">
                                  {u.stats?.activeInvestments} active
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400">
                              <ArrowDownToLine className="h-3.5 w-3.5" />
                              {formatCurrency(
                                u.stats?.approvedDepositTotal || 0,
                              )}
                              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-300">
                                {u.stats?.approvedDeposits || 0}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-orange-400">
                              <ArrowUpFromLine className="h-3.5 w-3.5" />
                              {formatCurrency(
                                u.stats?.approvedWithdrawTotal || 0,
                              )}
                              <span className="rounded-md bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-orange-300">
                                {u.stats?.approvedWithdrawals || 0}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5 pr-4">
                            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-200">
                              <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span className="truncate">
                                {u.registrationLocation?.city ||
                                  u.city ||
                                  u.registrationLocation?.region ||
                                  u.state ||
                                  u.country ||
                                  u.registrationLocation?.country ||
                                  "—"}
                              </span>
                            </div>
                            <p className="truncate text-[10px] font-mono text-slate-500">
                              IP: {u.registrationLocation?.ip || "—"}
                            </p>
                            {u.registrationLocation?.countryCode && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {u.registrationLocation?.countryCode}
                                {u.registrationLocation?.asn
                                  ? ` · ${u.registrationLocation.asn}`
                                  : ""}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-200">
                              <Calendar className="h-3 w-3 text-slate-500" />
                              {formatDateShort(u.createdAt || u.joinedDate)}
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {relativeDays(u.createdAt || u.joinedDate)}
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(u.id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                            >
                              <FileUser className="h-3.5 w-3.5" />
                              Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUserStatus(u);
                              }}
                              disabled={actionBusy === u.id}
                              className={`relative inline-flex items-center gap-1 rounded-xl border p-2 transition disabled:opacity-50 ${
                                u.status === "banned"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                  : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              }`}
                              title={
                                u.status === "banned"
                                  ? "Unban user"
                                  : "Ban user"
                              }
                            >
                              {actionBusy === u.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : u.status === "banned" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-slate-500"
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-white/5">
                        <Search className="h-6 w-6 text-slate-500" />
                      </div>
                      <p className="font-bold text-slate-400">No users found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try a different search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 px-5 py-4 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-300">
                  {page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, filteredUsers.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-300">
                  {filteredUsers.length}
                </span>{" "}
                users
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
            "Details" button to open the full user profile drawer. IP addresses
            and geo-location are captured server-side on registration and cannot
            be spoofed by the client.
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedUser && (
        <UserDetailDrawer
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
          onToggleStatus={toggleUserStatus}
          onSetVerification={setVerificationStatus}
          onAdjustBalance={adjustBalance}
          actionBusy={actionBusy}
        />
      )}
    </AdminLayout>
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
      <p className="text-xl font-black tracking-tight text-white">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

function RoleBadge({ role }: { role?: string }) {
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/20">
        <Shield className="h-3 w-3" /> Admin
      </span>
    );
  return (
    <span className="inline-flex items-center self-start rounded-full bg-slate-800/70 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 ring-1 ring-white/5">
      Standard User
    </span>
  );
}

function StatusBadge({
  status,
  profile,
}: {
  status?: string;
  profile?: string;
}) {
  if (status === "banned")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
        <Ban className="h-3 w-3" /> Banned
      </span>
    );
  if (profile === "approved" || profile === "verified")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-sky-300 ring-1 ring-sky-500/20">
        <ShieldCheck className="h-3 w-3" /> Verified
      </span>
    );
  if (profile === "rejected")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-rose-300 ring-1 ring-rose-500/20">
        <ShieldAlert className="h-3 w-3" /> Rejected
      </span>
    );
  if (profile === "pending_review")
    return (
      <span className="inline-flex items-center gap-1 self-start rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/20">
        <Clock className="h-3 w-3" /> Pending Review
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/20">
      <CheckCircle className="h-3 w-3" /> Active
    </span>
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
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3.5">
      <div className="mb-1.5 inline-flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${accent}`} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
      </div>
      <p className={`text-lg font-black tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}

function UserDetailDrawer({
  user,
  onClose,
  onToggleStatus,
  onSetVerification,
  onAdjustBalance,
  actionBusy,
}: {
  user: UserData;
  onClose: () => void;
  onToggleStatus: (u: UserData) => void;
  onSetVerification: (
    u: UserData,
    s: "approved" | "rejected" | "pending_review",
  ) => void;
  onAdjustBalance: (
    u: UserData,
    action: "increase_balance" | "decrease_balance",
    amount: number,
    note?: string,
  ) => Promise<any>;
  actionBusy: string | null;
}) {
  const loc = user.registrationLocation;
  const stats = user.stats;
  const [adjAmount, setAdjAmount] = useState<string>("");
  const [adjNote, setAdjNote] = useState<string>("");
  const [adjSubmitting, setAdjSubmitting] = useState<
    "increase" | "decrease" | null
  >(null);

  const handleAdjust = async (direction: "increase" | "decrease") => {
    const num = Number(adjAmount);
    if (!num || isNaN(num) || num <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }
    const confirmed = confirm(
      `Are you sure you want to ${direction} user's balance by ${formatCurrency(num)}?\n\nCurrent balance: ${formatCurrency(user.balance)}\nNew balance will be: ${formatCurrency(
        direction === "increase"
          ? (Number(user.balance) || 0) + num
          : (Number(user.balance) || 0) - num,
      )}${adjNote.trim() ? `\n\nNote: ${adjNote.trim()}` : ""}`,
    );
    if (!confirmed) return;
    setAdjSubmitting(direction);
    try {
      const action =
        direction === "increase" ? "increase_balance" : "decrease_balance";
      const result = await onAdjustBalance(
        user,
        action as any,
        num,
        adjNote.trim() || undefined,
      );
      if (result?.success) {
        setAdjAmount("");
        setAdjNote("");
      }
    } finally {
      setAdjSubmitting(null);
    }
  };

  const timeline = useMemo(() => {
    const items: {
      date: any;
      title: string;
      desc: string;
      color: string;
      icon: any;
    }[] = [];
    if (user.createdAt || user.joinedDate) {
      items.push({
        date: user.createdAt || user.joinedDate,
        title: "Account created",
        desc: loc
          ? `Registered from ${loc.city || loc.region || ""} ${
              loc.country ? `(${loc.country})` : ""
            } via IP ${loc.ip || "—"}`
          : "Account registered",
        color: "bg-emerald-500",
        icon: Sparkles,
      });
    }
    if (user.profileSubmittedAt) {
      items.push({
        date: user.profileSubmittedAt,
        title: "Profile submitted for review",
        desc: user.profileImageUploaded
          ? "Verification photo uploaded"
          : "Profile details submitted",
        color: "bg-sky-500",
        icon: FileUser,
      });
    }
    if (stats?.approvedDeposits && stats.approvedDeposits > 0) {
      items.push({
        date: null,
        title: `${stats.approvedDeposits} deposit${stats.approvedDeposits === 1 ? "" : "s"} approved`,
        desc: `Total ${formatCurrency(stats.approvedDepositTotal)} deposited`,
        color: "bg-emerald-400",
        icon: ArrowDownToLine,
      });
    }
    if (stats?.investmentCount && stats.investmentCount > 0) {
      items.push({
        date: null,
        title: `${stats.investmentCount} investment${stats.investmentCount === 1 ? "" : "s"} started`,
        desc: `Total ${formatCurrency(stats.investmentTotal)} invested · ${stats.activeInvestments} active`,
        color: "bg-violet-500",
        icon: TrendingUp,
      });
    }
    if (stats?.approvedWithdrawals && stats.approvedWithdrawals > 0) {
      items.push({
        date: null,
        title: `${stats.approvedWithdrawals} withdrawal${stats.approvedWithdrawals === 1 ? "" : "s"} paid`,
        desc: `Total ${formatCurrency(stats.approvedWithdrawTotal)} withdrawn`,
        color: "bg-orange-500",
        icon: ArrowUpFromLine,
      });
    }
    if (stats?.referralCount && stats.referralCount > 0) {
      items.push({
        date: null,
        title: `${stats.referralCount} referral${stats.referralCount === 1 ? "" : "s"}`,
        desc: `Total earnings ${formatCurrency(stats.referralEarningsTotal || user.referralEarnings || 0)}`,
        color: "bg-fuchsia-500",
        icon: Sparkles,
      });
    }
    if (user.status === "banned") {
      items.push({
        date: null,
        title: "Account banned",
        desc: "Access restricted by admin",
        color: "bg-red-500",
        icon: Ban,
      });
    }
    return items;
  }, [user, stats, loc]);

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-[fadeIn_.2s_ease]"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[620px] animate-[slideInRight_.25s_ease]">
        <div className="relative flex h-full w-full flex-col overflow-hidden border-l border-white/10 bg-slate-950 shadow-2xl">
          {/* Drawer Header */}
          <div className="relative border-b border-white/5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 pt-6 pb-5">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/5 to-transparent blur-3xl" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative">
                <ProfileAvatar
                  src={user.photoURL}
                  alt={user.fullName || user.email}
                  fallbackInitials={`${user.firstName || ""} ${user.lastName || user.email || ""}`}
                  size="h-16 w-16"
                  iconSize={24}
                />
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-900 ring-1 ring-white/10">
                  {user.role === "admin" ? (
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  ) : user.status === "banned" ? (
                    <Ban className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">
                    {user.fullName ||
                      (user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.usernameDisplay || user.username || user.email)}
                  </h2>
                  {user.username && (
                    <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[11px] font-bold text-slate-300 ring-1 ring-white/5">
                      @{user.username}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge
                    status={user.status}
                    profile={user.profileVerificationStatus}
                  />
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="relative mt-5 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onToggleStatus(user)}
                disabled={actionBusy === user.id}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${
                  user.status === "banned"
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20 hover:bg-emerald-500/25"
                    : "bg-red-500/15 text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/25"
                }`}
              >
                {actionBusy === user.id ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : user.status === "banned" ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <Ban className="h-3.5 w-3.5" />
                )}
                {user.status === "banned" ? "Unban Account" : "Ban Account"}
              </button>
              <button
                onClick={() => onSetVerification(user, "approved")}
                disabled={actionBusy === user.id + ":verification"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/15 px-4 py-2 text-xs font-bold text-sky-300 ring-1 ring-sky-500/20 transition hover:bg-sky-500/25 disabled:opacity-50"
              >
                {actionBusy === user.id + ":verification" ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                Mark Verified
              </button>
              <button
                onClick={() => onSetVerification(user, "rejected")}
                disabled={actionBusy === user.id + ":verification"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-300 ring-1 ring-rose-500/20 transition hover:bg-rose-500/25 disabled:opacity-50"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Reject KYC
              </button>
              <button
                onClick={() => onSetVerification(user, "pending_review")}
                disabled={actionBusy === user.id + ":verification"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-300 ring-1 ring-amber-500/20 transition hover:bg-amber-500/25 disabled:opacity-50"
              >
                <Clock className="h-3.5 w-3.5" />
                Reset Review
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">
            {/* Financial Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <StatTile
                label="Account Balance"
                value={formatCurrency(user.balance)}
                accent="text-sky-300"
                icon={Wallet}
              />
              <StatTile
                label="Total Invested"
                value={formatCurrency(
                  stats?.investmentTotal || user.totalInvested || 0,
                )}
                accent="text-violet-300"
                icon={TrendingUp}
              />
              <StatTile
                label="Deposited"
                value={formatCurrency(stats?.approvedDepositTotal || 0)}
                accent="text-emerald-300"
                icon={ArrowDownToLine}
              />
              <StatTile
                label="Withdrawn"
                value={formatCurrency(stats?.approvedWithdrawTotal || 0)}
                accent="text-orange-300"
                icon={ArrowUpFromLine}
              />
              <StatTile
                label="Referrals"
                value={`${stats?.referralCount || 0} · ${formatCurrency(
                  stats?.referralEarningsTotal || user.referralEarnings || 0,
                )}`}
                accent="text-fuchsia-300"
                icon={Sparkles}
              />
              <StatTile
                label="Active Investments"
                value={`${stats?.activeInvestments || 0} · ${formatCurrency(
                  stats?.activeInvestmentTotal || 0,
                )}`}
                accent="text-teal-300"
                icon={CreditCard}
              />
            </div>

            {/* Balance Adjustment */}
            <SectionCard
              title="Manual Balance Adjustment"
              icon={CircleDollarSign}
              accent="text-emerald-400"
              right={
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-sky-400" />
                  <span className="text-[11px] font-black text-sky-300">
                    {formatCurrency(user.balance)}
                  </span>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={adjAmount}
                        onChange={(e) => setAdjAmount(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Admin note (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manual bonus, correction, etc."
                      value={adjNote}
                      onChange={(e) => setAdjNote(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
                    />
                  </div>
                </div>

                {adjAmount && Number(adjAmount) > 0 && (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <p className="text-slate-500 uppercase tracking-widest font-black">
                          Current
                        </p>
                        <p className="mt-0.5 font-bold text-slate-200">
                          {formatCurrency(user.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase tracking-widest font-black">
                          After +
                        </p>
                        <p className="mt-0.5 font-bold text-emerald-300">
                          {formatCurrency(
                            (Number(user.balance) || 0) + Number(adjAmount),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase tracking-widest font-black">
                          After −
                        </p>
                        <p
                          className={`mt-0.5 font-bold ${
                            (Number(user.balance) || 0) - Number(adjAmount) < 0
                              ? "text-red-400"
                              : "text-orange-300"
                          }`}
                        >
                          {formatCurrency(
                            (Number(user.balance) || 0) - Number(adjAmount),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleAdjust("increase")}
                    disabled={
                      adjSubmitting !== null ||
                      !adjAmount ||
                      Number(adjAmount) <= 0
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-2.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/20 transition hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {adjSubmitting === "increase" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Increase Balance
                  </button>
                  <button
                    onClick={() => handleAdjust("decrease")}
                    disabled={
                      adjSubmitting !== null ||
                      !adjAmount ||
                      Number(adjAmount) <= 0 ||
                      Number(adjAmount) > (Number(user.balance) || 0)
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/15 px-3 py-2.5 text-xs font-bold text-orange-300 ring-1 ring-orange-500/20 transition hover:bg-orange-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {adjSubmitting === "decrease" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Minus className="h-3.5 w-3.5" />
                    )}
                    Decrease Balance
                  </button>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div>
                    <span className="font-bold">Important:</span> All
                    adjustments are permanently logged with admin identity, IP,
                    timestamp, and note.
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Personal Details */}
            <SectionCard
              title="Personal Information"
              icon={User}
              accent="text-sky-400"
              right={
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {user.language || "English"}
                </span>
              }
            >
              <KVRow
                icon={User}
                label="Full name"
                value={
                  user.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  "—"
                }
              />
              <KVRow
                icon={Hash}
                label="Username"
                value={
                  user.usernameDisplay || user.username
                    ? `@${user.usernameDisplay || user.username}`
                    : "—"
                }
              />
              <KVRow icon={Mail} label="Email" value={user.email} />
              <KVRow icon={Phone} label="Phone" value={user.phone || "—"} />
              <KVRow
                icon={Calendar}
                label="Joined"
                value={`${formatDate(user.createdAt || user.joinedDate)} · ${relativeDays(user.createdAt || user.joinedDate)}`}
              />
              <KVRow
                icon={Clock}
                label="Last activity"
                value={formatDate(user.lastActivityAt) || "—"}
              />
              <KVRow
                icon={FileUser}
                label="KYC status"
                value={(() => {
                  const p = user.profileVerificationStatus;
                  if (p === "approved" || p === "verified")
                    return (
                      <span className="font-bold text-sky-400">
                        Verified / Approved
                      </span>
                    );
                  if (p === "rejected")
                    return (
                      <span className="font-bold text-rose-400">Rejected</span>
                    );
                  if (p === "pending_review")
                    return (
                      <span className="font-bold text-amber-400">
                        Pending review
                      </span>
                    );
                  return p ? <span className="capitalize">{p}</span> : "—";
                })()}
              />
              <KVRow
                icon={Globe}
                label="Firebase UID"
                mono
                value={
                  <code className="break-all rounded bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                    {user.id}
                  </code>
                }
              />
            </SectionCard>

            {/* Registration IP Location */}
            <SectionCard
              title="Registration IP & Geo-location"
              icon={MapPin}
              accent="text-emerald-400"
              right={
                loc?.ip ? (
                  <a
                    href={`https://ipinfo.io/${encodeURIComponent(loc.ip)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/20 hover:bg-emerald-500/25"
                  >
                    Lookup <ChevronRight className="h-3 w-3" />
                  </a>
                ) : null
              }
            >
              <KVRow
                icon={MapPin}
                label="IP Address"
                mono
                value={loc?.ip || "—"}
                accent="text-emerald-400"
              />
              <KVRow
                icon={Globe}
                label="Country"
                value={loc?.country || user.country || "—"}
              />
              <KVRow
                icon={MapPin}
                label="Region / State"
                value={loc?.region || user.state || "—"}
              />
              <KVRow
                icon={MapPin}
                label="City"
                value={loc?.city || user.city || "—"}
              />
              <KVRow
                icon={Hash}
                label="Postal code"
                value={loc?.postal || user.postalCode || "—"}
              />
              <KVRow
                icon={Globe}
                label="Country code"
                value={loc?.countryCode || "—"}
              />
              <KVRow
                icon={Clock}
                label="Detected timezone"
                value={loc?.timezone || user.timezone || "—"}
              />
              <KVRow
                icon={CreditCard}
                label="Local currency"
                value={loc?.currency || "—"}
              />
              <KVRow
                icon={Info}
                label="Coordinates"
                mono
                value={
                  loc?.latitudeLongitude ||
                  (loc?.latitude && loc?.longitude
                    ? `${loc.latitude}, ${loc.longitude}`
                    : "—")
                }
              />
              <KVRow
                icon={Shield}
                label="ISP / Provider"
                value={loc?.provider || "—"}
              />
              <KVRow icon={Hash} label="ASN" mono value={loc?.asn || "—"} />
              <KVRow
                icon={Info}
                label="User-selected address"
                value={
                  user.address ? (
                    <div className="space-y-0.5 text-slate-300">
                      <div>{user.address}</div>
                      <div className="text-xs text-slate-400">
                        {[
                          user.city ? user.city : null,
                          user.state ? user.state : null,
                          user.country ? user.country : null,
                          user.postalCode ? user.postalCode : null,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
                    </div>
                  ) : (
                    "—"
                  )
                }
              />
              {loc?.userAgent && (
                <KVRow
                  icon={Info}
                  label="User agent"
                  mono
                  value={
                    <p className="break-all text-[11px] text-slate-400">
                      {loc.userAgent}
                    </p>
                  }
                />
              )}
              {loc?.referer && (
                <KVRow
                  icon={Globe}
                  label="Registration referer"
                  value={loc.referer}
                />
              )}
            </SectionCard>

            {/* Referrals */}
            <SectionCard
              title="Referrals"
              icon={Sparkles}
              accent="text-fuchsia-400"
            >
              <KVRow
                icon={Sparkles}
                label="Referred by"
                value={
                  user.referredBy ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-fuchsia-300">
                        @{user.referredBy}
                      </span>
                      {user.referredByName && (
                        <span className="text-[11px] text-slate-400">
                          {user.referredByName}
                        </span>
                      )}
                    </div>
                  ) : (
                    "Organic sign-up"
                  )
                }
              />
              <KVRow
                icon={Users}
                label="Users referred"
                value={
                  <span className="font-bold text-fuchsia-300">
                    {stats?.referralCount || 0}
                  </span>
                }
              />
              <KVRow
                icon={CircleDollarSign}
                label="Referral earnings"
                value={formatCurrency(
                  stats?.referralEarningsTotal || user.referralEarnings || 0,
                )}
              />
            </SectionCard>

            {/* Activity Timeline */}
            <SectionCard
              title="Account Activity Timeline"
              icon={Clock}
              accent="text-violet-400"
              right={
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {timeline.length} events
                </span>
              }
            >
              <ol className="relative border-l border-white/10 pl-5 py-1">
                {timeline.length === 0 && (
                  <li className="py-2 text-xs text-slate-500">
                    No activity events yet.
                  </li>
                )}
                {timeline.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <li key={i} className="mb-4 last:mb-0">
                      <span
                        className={`absolute -left-[7px] mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ${t.color} ring-4 ring-slate-950`}
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <p className="text-sm font-bold text-slate-100 inline-flex items-center gap-1.5">
                          <Icon
                            className={`h-3.5 w-3.5 ${
                              t.color === "bg-emerald-500"
                                ? "text-emerald-400"
                                : t.color === "bg-sky-500"
                                  ? "text-sky-400"
                                  : t.color === "bg-violet-500"
                                    ? "text-violet-400"
                                    : t.color === "bg-orange-500"
                                      ? "text-orange-400"
                                      : t.color === "bg-fuchsia-500"
                                        ? "text-fuchsia-400"
                                        : t.color === "bg-red-500"
                                          ? "text-red-400"
                                          : "text-slate-400"
                            }`}
                          />
                          {t.title}
                        </p>
                        {t.date && (
                          <p className="text-[11px] text-slate-500">
                            {formatDate(t.date)} · {relativeDays(t.date)}
                          </p>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {t.desc}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </SectionCard>

            <div className="pb-2">
              <p className="text-center text-[11px] text-slate-600">
                End of profile · #{user.id.slice(0, 8)}…
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
