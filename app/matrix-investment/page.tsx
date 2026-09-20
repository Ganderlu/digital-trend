"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Layers,
  Users,
  RefreshCw,
  Wallet,
  ChevronLeft,
  Gift,
  Crown,
  Diamond,
  Sparkles,
  DollarSign,
  Info,
  BadgeCheck,
  Circle,
  X,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
  referralCode?: string;
  matrixLevel?: number;
  matrixCycles?: number;
};

type MatrixPlan = {
  id: string;
  name: string;
  tagline: string;
  entryAmount: number;
  cyclePayout: number;
  totalPayout: number;
  positions: number;
  levels: number;
  features: string[];
  color: string;
  gradient: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
  badge?: string;
  popular?: boolean;
  highlight?: boolean;
};

const MATRIX_PLANS: MatrixPlan[] = [
  {
    id: "matrix-starter",
    name: "Bronze Matrix",
    tagline: "Perfect entry point",
    entryAmount: 50,
    cyclePayout: 120,
    totalPayout: 240,
    positions: 3,
    levels: 3,
    features: [
      "3x3 Matrix Structure",
      "Auto Pool Enabled",
      "Instant Re-entry",
      "Direct Referral: 10%",
      "Level Commissions",
      "24/7 Support",
    ],
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-500/30",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
    icon: Sparkles,
  },
  {
    id: "matrix-silver",
    name: "Silver Matrix",
    tagline: "Balanced growth",
    entryAmount: 200,
    cyclePayout: 480,
    totalPayout: 960,
    positions: 3,
    levels: 3,
    features: [
      "3x3 Matrix Structure",
      "Auto Pool Priority",
      "Priority Re-entry",
      "Direct Referral: 12%",
      "Level Commissions + Bonus",
      "Priority Support",
      "Advanced Analytics",
    ],
    color: "slate",
    gradient: "from-slate-400 to-slate-300",
    border: "border-slate-400/30",
    badgeBg: "bg-slate-400/10",
    badgeText: "text-slate-300",
    icon: ShieldCheck,
    badge: "Great Value",
  },
  {
    id: "matrix-gold",
    name: "Gold Matrix",
    tagline: "Accelerated earnings",
    entryAmount: 500,
    cyclePayout: 1200,
    totalPayout: 2400,
    positions: 3,
    levels: 3,
    features: [
      "3x3 Matrix Structure",
      "Premium Auto Pool",
      "Express Re-entry",
      "Direct Referral: 15%",
      "Enhanced Level Bonuses",
      "Dedicated Support",
      "VIP Dashboard",
      "Weekly Payouts",
    ],
    color: "yellow",
    gradient: "from-yellow-500 to-amber-400",
    border: "border-yellow-500/40",
    badgeBg: "bg-yellow-500/10",
    badgeText: "text-yellow-300",
    icon: Crown,
    popular: true,
  },
  {
    id: "matrix-diamond",
    name: "Diamond Matrix",
    tagline: "Maximum rewards",
    entryAmount: 1000,
    cyclePayout: 2400,
    totalPayout: 4800,
    positions: 3,
    levels: 3,
    features: [
      "3x3 Matrix Structure",
      "VIP Auto Pool Placement",
      "Instant Re-entry Priority",
      "Direct Referral: 20%",
      "Maximum Level Commissions",
      "Personal Account Manager",
      "Elite Dashboard Access",
      "Daily Payout Eligibility",
      "Exclusive Events",
    ],
    color: "cyan",
    gradient: "from-cyan-400 to-violet-500",
    border: "border-cyan-400/40",
    badgeBg: "bg-cyan-400/10",
    badgeText: "text-cyan-300",
    icon: Diamond,
    highlight: true,
    badge: "Top Tier",
  },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const colorMap: Record<
  string,
  { text: string; bg: string; border: string; ring: string }
> = {
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-400/40",
  },
  slate: {
    text: "text-slate-300",
    bg: "bg-slate-400/10",
    border: "border-slate-400/30",
    ring: "ring-slate-400/40",
  },
  yellow: {
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    ring: "ring-yellow-400/40",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    ring: "ring-cyan-400/40",
  },
};

function MatrixInvestmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams?.get("plan");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<MatrixPlan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    plan: MatrixPlan;
    amount: number;
  } | null>(null);

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

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const p = userDoc.data() as UserProfile;
        setProfile(p);

        if (preselectedPlan) {
          const match = MATRIX_PLANS.find((mp) => mp.id === preselectedPlan);
          if (match) {
            setSelectedPlan(match);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, preselectedPlan]);

  const handleSelectPlan = (plan: MatrixPlan) => {
    setSelectedPlan(plan);
    setError("");
    setSuccess(null);
  };

  const openConfirm = () => {
    if (!selectedPlan || !profile) return;
    setError("");
    if ((profile.balance || 0) < selectedPlan.entryAmount) {
      setError(
        "Insufficient balance. Please deposit funds to join this matrix.",
      );
      return;
    }
    setConfirmOpen(true);
  };

  const handleJoinMatrix = async () => {
    if (!user || !selectedPlan || !profile) return;
    setError("");
    setSubmitting(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/investments/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          planType: "matrix",
          amount: selectedPlan.entryAmount,
          totalReturn: selectedPlan.totalPayout,
          matrixStructure: "3x3",
          matrixCyclePayout: selectedPlan.cyclePayout,
          matrixLevel: 1,
        }),
      });

      const data = await response.json().catch(() => ({
        ok: false,
        error: "Unexpected server response",
      }));

      if (!data.ok || !response.ok) {
        throw new Error(data.error || "Failed to join matrix");
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              balance: (prev.balance || 0) - selectedPlan.entryAmount,
            }
          : null,
      );

      setConfirmOpen(false);
      setSuccess({ plan: selectedPlan, amount: selectedPlan.entryAmount });
    } catch (err: any) {
      console.error("Matrix join error:", err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Failed to join matrix. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSelectedPlan(null);
    setSuccess(null);
    setConfirmOpen(false);
    setError("");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading Matrix Plans...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/matrix-plan")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-50">
                Join Matrix Investment
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Select a matrix tier and start earning through our automated
                3-level referral matrix system.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/deposit")}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
            >
              <DollarSign className="h-3.5 w-3.5" />
              Top Up Balance
            </button>
            <div className="rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Available Balance
              </p>
              <p className="text-lg font-black text-emerald-400 tabular-nums">
                {formatCurrency(profile?.balance || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 p-5 lg:p-6">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                icon: Layers,
                label: "Structure",
                value: "3x3 Matrix",
                sub: "3 levels deep",
              },
              {
                icon: Users,
                label: "Total Slots",
                value: "39 Positions",
                sub: "3 + 9 + 27",
              },
              {
                icon: RefreshCw,
                label: "Auto Re-entry",
                value: "Enabled",
                sub: "Infinite cycles",
              },
              {
                icon: Gift,
                label: "Referral",
                value: "10-20%",
                sub: "Direct commission",
              },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {b.label}
                  </p>
                  <p className="text-base font-black text-slate-100 mt-0.5">
                    {b.value}
                  </p>
                  <p className="text-[11px] text-slate-500">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              n: 1,
              title: "Select Tier",
              desc: "Pick a matrix entry amount that fits your budget.",
              icon: Zap,
            },
            {
              n: 2,
              title: "Share & Refer",
              desc: "Invite others using your unique referral link.",
              icon: Users,
            },
            {
              n: 3,
              title: "Earn & Cycle",
              desc: "Receive payouts and re-enter automatically.",
              icon: TrendingUp,
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 flex items-start gap-3 hover:bg-slate-900/80 transition"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-sm font-black shadow-lg shadow-violet-500/20">
                {s.n}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <s.icon className="h-3.5 w-3.5 text-violet-400" />
                  {s.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
          {MATRIX_PLANS.map((plan) => {
            const active = selectedPlan?.id === plan.id;
            const c = colorMap[plan.color];
            const canAfford = (profile?.balance || 0) >= plan.entryAmount;

            return (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`group relative flex flex-col items-stretch text-left rounded-3xl border p-5 lg:p-6 transition-all ${
                  plan.highlight
                    ? active
                      ? `border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 shadow-2xl shadow-cyan-500/20 ring-4 ring-cyan-400/30`
                      : `border-cyan-400/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-slate-900/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/50`
                    : active
                      ? `border-violet-400/60 bg-slate-900 shadow-2xl shadow-violet-500/20 ring-4 ring-violet-400/30`
                      : `border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:border-white/10 ${c.border}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-yellow-500/30">
                    Most Popular
                  </div>
                )}
                {plan.badge && !plan.popular && (
                  <div className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">
                    {plan.badge}
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
                  >
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-50 leading-tight">
                      {plan.name}
                    </h3>
                    <p className={`text-[11px] font-semibold ${c.text} mt-0.5`}>
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Entry Amount */}
                <div className="mb-4 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Entry Amount
                      </p>
                      <p
                        className={`mt-1 text-3xl font-black ${c.text} tabular-nums`}
                      >
                        {formatCurrency(plan.entryAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        / Cycle Payout
                      </p>
                      <p className="mt-1 text-xl font-black text-emerald-400 tabular-nums">
                        +{formatCurrency(plan.cyclePayout)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${plan.gradient}`}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-semibold">
                      Total Payout Potential
                    </span>
                    <span className="font-black text-emerald-400 tabular-nums">
                      {formatCurrency(plan.totalPayout)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${c.text}`}
                      />
                      <span className="text-xs text-slate-300 leading-relaxed">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  className={`rounded-2xl border p-3 transition-all ${
                    active
                      ? `border-violet-400/40 bg-violet-500/10`
                      : `border-white/5 bg-white/[0.02] group-hover:bg-white/[0.04]`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {active ? (
                        <>
                          <BadgeCheck className="h-4 w-4 text-violet-400" />
                          <span className="text-xs font-bold text-violet-300">
                            Selected
                          </span>
                        </>
                      ) : canAfford ? (
                        <>
                          <Wallet className="h-4 w-4 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-300">
                            Balance OK
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <span className="text-[11px] font-semibold text-amber-300">
                            Low Balance
                          </span>
                        </>
                      )}
                    </div>
                    <span
                      className={`text-xs font-black ${
                        active
                          ? "text-violet-300"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {active ? `✓` : `Select →`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Plan Summary Bar */}
        {selectedPlan && !success && (
          <div className="sticky bottom-4 z-40">
            <div className="rounded-2xl border border-violet-400/30 bg-slate-950/95 backdrop-blur-xl p-4 lg:p-5 shadow-2xl shadow-black/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedPlan.gradient} text-white shadow-lg`}
                  >
                    <selectedPlan.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-50">
                        {selectedPlan.name}
                      </h3>
                      <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                        3x3 Matrix
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>
                        Entry:{" "}
                        <span className="font-bold text-slate-200">
                          {formatCurrency(selectedPlan.entryAmount)}
                        </span>
                      </span>
                      <span>
                        Cycle:{" "}
                        <span className="font-bold text-emerald-400">
                          +{formatCurrency(selectedPlan.cyclePayout)}
                        </span>
                      </span>
                      <span>
                        Total:{" "}
                        <span className="font-bold text-sky-400">
                          {formatCurrency(selectedPlan.totalPayout)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                  <button
                    onClick={() => router.push("/deposit")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/15"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    Deposit More
                  </button>
                  <button
                    onClick={openConfirm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 active:scale-[0.99]"
                  >
                    Join Matrix Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ / Matrix Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 lg:p-6">
            <h2 className="text-base font-black text-slate-100 mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-violet-400" />
              How the 3x3 Matrix Works
            </h2>
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                <p className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-2">
                  Level 1 · 3 Positions
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your direct referrals fill your first level. When these 3
                  spots are filled by people joining through your link, you earn
                  the direct referral commission (10-20%) + level bonus.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  Level 2 · 9 Positions
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When each of your 3 Level-1 referrals refer 3 people each,
                  those 9 people land on your Level 2. You earn override
                  commissions on every position here.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
                <p className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                  Level 3 · 27 Positions
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Level 2s each bring in 3 people, creating 27 spots on Level 3.
                  When all 39 positions (3+9+27) are filled, your matrix cycle
                  completes, and you receive your cycle payout.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 lg:p-6">
            <h2 className="text-base font-black text-slate-100 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Frequently Asked
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "When do I get paid out?",
                  a: "You earn referral commissions instantly when a referral joins. Cycle payouts are credited automatically when your 3x3 matrix completes all 39 positions.",
                },
                {
                  q: "Can I join multiple matrix tiers at once?",
                  a: "Yes! You can be active in Bronze, Silver, Gold, and Diamond matrices simultaneously — each operates as an independent 3x3 board.",
                },
                {
                  q: "What happens after a cycle completes?",
                  a: "Your cycle payout is credited to your balance, and your position auto-re-enters a fresh matrix so you can start earning again without any manual action.",
                },
                {
                  q: "Do I need referrals to earn?",
                  a: "Direct referrals accelerate your earnings significantly, but our Auto-Pool system can also place spillover into your matrix from the upline, helping you cycle even without personal referrals.",
                },
                {
                  q: "Is there a refund policy?",
                  a: "Matrix entries are final and non-refundable once the position is placed. Please ensure you understand the structure before joining.",
                },
              ].map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-white/5 bg-slate-950/60 p-4 open:bg-slate-900/60 transition"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-200">
                      {f.q}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-open:rotate-45 group-open:bg-violet-500/10 group-open:text-violet-300 transition">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: ShieldCheck,
              t: "Secure Protocol",
              d: "All entries verified",
            },
            { icon: Clock, t: "Auto Cycle", d: "No manual actions" },
            { icon: BadgeCheck, t: "Verified Matrix", d: "Audited logic" },
            { icon: Wallet, t: "Instant Credits", d: "Balance updated live" },
          ].map((b) => (
            <div
              key={b.t}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3.5 hover:bg-slate-900/60 transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-violet-400">
                <b.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {b.t}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedPlan.gradient} text-white shadow-lg`}
                >
                  <selectedPlan.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-50">
                    Confirm Matrix Entry
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedPlan.name} · 3x3 Cycle
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2.5 mb-4">
              {[
                {
                  l: "Entry Amount",
                  v: formatCurrency(selectedPlan.entryAmount),
                  c: "text-slate-100",
                },
                {
                  l: "Cycle Payout",
                  v: `+${formatCurrency(selectedPlan.cyclePayout)}`,
                  c: "text-emerald-400",
                },
                {
                  l: "Total Payout Potential",
                  v: formatCurrency(selectedPlan.totalPayout),
                  c: "text-sky-400",
                },
                {
                  l: "Referral Commission",
                  v: `${selectedPlan.id === "matrix-diamond" ? "20%" : selectedPlan.id === "matrix-gold" ? "15%" : selectedPlan.id === "matrix-silver" ? "12%" : "10%"} Direct`,
                  c: "text-violet-300",
                },
                { l: "Auto Re-entry", v: "Enabled", c: "text-emerald-400" },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{r.l}</span>
                  <span className={`text-xs font-bold ${r.c} tabular-nums`}>
                    {r.v}
                  </span>
                </div>
              ))}
              <div className="my-3 h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Your Balance After
                </span>
                <span className="text-sm font-black text-slate-100 tabular-nums">
                  {formatCurrency(
                    (profile?.balance || 0) - selectedPlan.entryAmount,
                  )}
                </span>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 mb-5">
              <div className="flex gap-2.5 items-start">
                <Circle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400 fill-amber-400" />
                <div className="space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
                  <p>
                    By confirming, you agree that this is a matrix position
                    entry and non-refundable once placed.
                  </p>
                  <p>
                    Commissions are subject to the matrix structure being filled
                    and payment rules.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-white/10 bg-transparent py-3.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinMatrix}
                disabled={submitting}
                className="flex-[1.4] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Joining Matrix...
                  </>
                ) : (
                  <>
                    Confirm &amp; Charge{" "}
                    {formatCurrency(selectedPlan.entryAmount)}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-slate-900 p-7 shadow-2xl text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle className="h-14 w-14" />
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-50">
              You&apos;re In!
            </h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Congratulations! You have successfully joined the{" "}
              <strong className={`${colorMap[success.plan.color].text}`}>
                {success.plan.name}
              </strong>{" "}
              for{" "}
              <strong className="text-emerald-400">
                {formatCurrency(success.amount)}
              </strong>
              . Your 3x3 matrix position is now active.
            </p>

            <div className="mt-6 rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Plan</span>
                <span className="text-xs font-bold text-slate-200">
                  {success.plan.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Entry Amount</span>
                <span className="text-xs font-bold text-slate-200 tabular-nums">
                  {formatCurrency(success.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Cycle Payout</span>
                <span className="text-xs font-bold text-emerald-400 tabular-nums">
                  +{formatCurrency(success.plan.cyclePayout)}
                </span>
              </div>
              <div className="h-px bg-white/5 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Status
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400" />
                  Active
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  resetAll();
                  router.push("/matrix-plan");
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
              >
                View My Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function MatrixInvestmentPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-slate-400">
              Loading Matrix Investment...
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <MatrixInvestmentContent />
    </Suspense>
  );
}
