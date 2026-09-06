"use client";

import { useEffect, useState } from "react";
import ProfileAvatar from "./profile-avatar";
import {
  Sparkles,
  X,
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  Clock,
  Activity,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

type WelcomeBackModalProps = {
  open: boolean;
  onClose: () => void;
  user: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    username?: string;
    usernameDisplay?: string;
    photoURL?: string;
    balance?: number;
    createdAt?: any;
    lastActivityAt?: any;
  } | null;
};

function formatCurrency(amount?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

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

function relativeDays(from: any): string {
  if (!from) return "—";
  let d: Date | null = null;
  try {
    d = typeof from === "string" ? new Date(from) : new Date(from);
    if (!d || isNaN(d.getTime())) return "—";
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours <= 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? "just now" : `${mins} mins ago`;
      }
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch {
    return "—";
  }
}

const SUGGESTED_ACTIONS: {
  label: string;
  desc: string;
  href: string;
  accent: string;
  icon: any;
}[] = [
  {
    label: "Fund your wallet",
    desc: "Make a deposit to start earning",
    href: "/deposit",
    accent:
      "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20 text-emerald-300",
    icon: Wallet,
  },
  {
    label: "Browse investment plans",
    desc: "Explore strategies and yields",
    href: "/investment-plans",
    accent:
      "from-violet-500/15 to-violet-500/5 border-violet-500/20 text-violet-300",
    icon: Activity,
  },
  {
    label: "Security & settings",
    desc: "Review profile & 2FA options",
    href: "/security-settings",
    accent: "from-sky-500/15 to-sky-500/5 border-sky-500/20 text-sky-300",
    icon: ShieldCheck,
  },
];

export default function WelcomeBackModal({
  open,
  onClose,
  user,
}: WelcomeBackModalProps) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const t1 = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(t1);
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const displayName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.usernameDisplay || user?.username || user?.email || "there");
  const shortName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    user?.usernameDisplay ||
    user?.username ||
    "Friend";

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 5
      ? "Welcome back"
      : hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening";

  return (
    <div className="fixed inset-0 z-[99998]">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div
          className={`pointer-events-auto relative w-full max-w-[560px] transition-all duration-200 ease-out ${
            entered
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-3"
          }`}
        >
          <div className="relative flex max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/30 via-teal-500/15 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/25 via-sky-500/10 to-transparent blur-3xl" />

            <div className="relative z-10 shrink-0 border-b border-white/5 bg-gradient-to-b from-slate-900/70 to-slate-900/20 backdrop-blur px-7 pt-7 pb-5 sm:px-8 sm:pt-8">
              <button
                onClick={onClose}
                aria-label="Close welcome dialog"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
                  Signed in successfully
                </span>
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="relative shrink-0">
                  <ProfileAvatar
                    src={user?.photoURL}
                    alt={displayName}
                    fallbackInitials={`${user?.firstName || ""} ${user?.lastName || user?.email || ""}`}
                    size="h-16 w-16"
                    iconSize={26}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 ring-2 ring-emerald-400/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {greeting}
                  </p>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    Welcome back, {shortName}.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Great to see you again. Your dashboard is up to date with
                    the latest portfolio activity, market signals, and account
                    alerts.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-0 flex-1 overflow-y-auto custom-scrollbar px-7 py-5 sm:px-8">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-sky-500/10 to-sky-500/[0.02] p-3.5">
                  <div className="mb-1.5 inline-flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-sky-400" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Balance
                    </p>
                  </div>
                  <p className="text-lg font-black tracking-tight text-sky-300">
                    {formatCurrency(user?.balance)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.02] p-3.5">
                  <div className="mb-1.5 inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Last seen
                    </p>
                  </div>
                  <p className="text-sm font-bold tracking-tight text-emerald-300">
                    {relativeDays(user?.lastActivityAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/10 to-violet-500/[0.02] p-3.5">
                  <div className="mb-1.5 inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Session
                    </p>
                  </div>
                  <p className="text-sm font-bold tracking-tight text-violet-300">
                    Secured
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    What would you like to do?
                  </p>
                </div>
                <div className="space-y-2">
                  {SUGGESTED_ACTIONS.map((a) => {
                    const Icon = a.icon;
                    return (
                      <a
                        key={a.href}
                        href={a.href}
                        onClick={onClose}
                        className={`group flex items-center gap-3 rounded-2xl border bg-gradient-to-r ${a.accent} px-3.5 py-3 transition hover:brightness-110 hover:-translate-y-0.5`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{a.label}</p>
                          <p className="text-[11px] text-white/60">{a.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-3.5 py-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="text-[11px] leading-relaxed text-emerald-200/90">
                  <span className="font-black text-emerald-300">
                    Security tip —
                  </span>{" "}
                  This session is protected. Always confirm you are on the
                  official site before making deposits or sharing sensitive
                  information.
                </div>
              </div>
            </div>

            <div className="relative z-10 shrink-0 border-t border-white/5 bg-slate-950/60 backdrop-blur px-7 py-4 sm:px-8">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] text-slate-500 sm:min-w-0">
                  <span className="font-bold text-slate-400">
                    {formatDate(now, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>{" "}
                  ·{" "}
                  <span className="truncate">
                    {user?.email || "Account secured"}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Continue to dashboard
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
