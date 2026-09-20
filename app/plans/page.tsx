"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  BarChart3,
  Clock,
  BadgeCheck,
  Gift,
  Lock,
  Headphones,
  LineChart,
  Users,
  Globe,
  ArrowUpRight,
  Sparkles,
  Crown,
  Diamond,
  Info,
  ChevronRight,
  Percent,
  CalendarDays,
  Wallet,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  roi: string;
  roiDecimal: number;
  duration: string;
  durationDays: number;
  minAmount: number;
  maxAmount: number;
  referral: string;
  features: string[];
  color: "emerald" | "violet" | "amber" | "cyan";
  icon: any;
  popular?: boolean;
  highlight?: boolean;
  badge?: string;
  cta: { label: string; href: string };
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    tagline: "Ideal starter strategy",
    roi: "8% Daily",
    roiDecimal: 0.08,
    duration: "1 Day",
    durationDays: 1,
    minAmount: 200,
    maxAmount: 5000,
    referral: "4%",
    features: [
      "24/7 Dedicated Support",
      "Bank-Grade Security",
      "Instant Withdrawals",
      "Real-time Dashboard",
      "4% Direct Referral Bonus",
      "Daily Earnings Credit",
    ],
    color: "emerald",
    icon: Zap,
    cta: { label: "Get Started", href: "/register" },
  },
  {
    id: "silver",
    name: "Silver Plan",
    tagline: "Balanced growth portfolio",
    roi: "18% Daily",
    roiDecimal: 0.18,
    duration: "2 Days",
    durationDays: 2,
    minAmount: 5000,
    maxAmount: 20000,
    referral: "4%",
    popular: true,
    badge: "Most Popular",
    features: [
      "Priority Response Support",
      "Advanced Analytics Suite",
      "Compounding Available",
      "Portfolio Risk Dashboard",
      "4% Direct Referral Bonus",
      "Weekly Performance Report",
      "SMS Earnings Alerts",
    ],
    color: "violet",
    icon: TrendingUp,
    cta: { label: "Choose Plan", href: "/register" },
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    tagline: "Accelerated high-yield",
    roi: "25% Daily",
    roiDecimal: 0.25,
    duration: "4 Days",
    durationDays: 4,
    minAmount: 20000,
    maxAmount: 100000,
    referral: "4%",
    features: [
      "Personal Account Manager",
      "VIP Analytics Portal",
      "Capital Protection Layer",
      "Custom Entry / Exit",
      "4% Direct Referral Bonus",
      "Bi-weekly Payout Option",
      "Exclusive Webinars",
      "Tax Reporting Suite",
    ],
    color: "amber",
    icon: Crown,
    cta: { label: "Select Plan", href: "/register" },
  },
  {
    id: "vip",
    name: "VIP Plan",
    tagline: "Ultra-high net worth tier",
    roi: "40% Daily",
    roiDecimal: 0.4,
    duration: "6 Days",
    durationDays: 6,
    minAmount: 100000,
    maxAmount: 1000000,
    referral: "4%",
    highlight: true,
    badge: "Elite Tier",
    features: [
      "Dedicated Fund Manager",
      "White-glove VIP Access",
      "Maximum Capital Shield",
      "Off-market Deal Flow",
      "4% Direct Referral Bonus",
      "Daily Payout Eligibility",
      "Private Events & Retreats",
      "Family Office Support",
      "Custom Structured Products",
    ],
    color: "cyan",
    icon: Diamond,
    cta: { label: "Inquire Now", href: "/contact" },
  },
];

const colorMap: Record<
  Plan["color"],
  {
    text: string;
    textSoft: string;
    border: string;
    borderActive: string;
    bg: string;
    bgSoft: string;
    ring: string;
    gradient: string;
    glow: string;
  }
> = {
  emerald: {
    text: "text-emerald-400",
    textSoft: "text-emerald-300",
    border: "border-emerald-500/15",
    borderActive: "border-emerald-400/50",
    bg: "bg-emerald-500",
    bgSoft: "bg-emerald-500/10",
    ring: "ring-emerald-400/30",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  violet: {
    text: "text-violet-400",
    textSoft: "text-violet-300",
    border: "border-violet-500/15",
    borderActive: "border-violet-400/50",
    bg: "bg-violet-500",
    bgSoft: "bg-violet-500/10",
    ring: "ring-violet-400/30",
    gradient: "from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/25",
  },
  amber: {
    text: "text-amber-400",
    textSoft: "text-amber-300",
    border: "border-amber-500/15",
    borderActive: "border-amber-400/50",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-500/10",
    ring: "ring-amber-400/30",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
  cyan: {
    text: "text-cyan-400",
    textSoft: "text-cyan-300",
    border: "border-cyan-500/15",
    borderActive: "border-cyan-400/50",
    bg: "bg-cyan-500",
    bgSoft: "bg-cyan-500/10",
    ring: "ring-cyan-400/30",
    gradient: "from-cyan-400 to-violet-500",
    glow: "shadow-cyan-500/20",
  },
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function calcEarnings(amount: number, roiDecimal: number, days: number) {
  const daily = amount * roiDecimal;
  const total = daily * days;
  return {
    daily,
    total,
    totalReturn: amount + total,
    returnPct: (total / amount) * 100,
  };
}

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.18),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Premium Investment Vehicles
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
              Investment Plans Designed for{" "}
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Serious Capital Growth
              </span>
            </h1>

            <p className="mt-7 text-lg leading-relaxed text-slate-400">
              Four carefully calibrated strategies engineered to match your
              capital, time horizon, and growth appetite. Powered by institutional
              trading infrastructure with fully transparent earnings.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:brightness-110 hover:-translate-y-0.5"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#plans"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-8 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Browse All Plans
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* KPI strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: Users, t: "Active Investors", v: "50,000+", s: "150+ countries" },
              { icon: LineChart, t: "Total Paid Out", v: "$182M+", s: "Since inception" },
              { icon: ShieldCheck, t: "Assets Secured", v: "$420M+", s: "Multi-sig cold storage" },
              { icon: Clock, t: "Avg. Daily ROI", v: "22.75%", s: "Across all plans" },
            ].map((k) => (
              <div
                key={k.t}
                className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur p-4 lg:p-5 hover:bg-slate-900/80 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-emerald-400 mb-3">
                  <k.icon className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {k.t}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-50 tabular-nums">{k.v}</p>
                <p className="text-[11px] text-slate-500 mt-1">{k.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLAN COMPARISON STRIP ============ */}
      <section id="plans" className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-12">
          {/* Pill header */}
          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-slate-900/70 px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Active Strategies
              </span>
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <Info className="h-3.5 w-3.5" />
              Earnings credited daily · Principal returned at maturity
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid gap-5 lg:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => {
              const c = colorMap[plan.color];
              const demo = calcEarnings(plan.minAmount, plan.roiDecimal, plan.durationDays);

              return (
                <div
                  key={plan.id}
                  className={`group relative flex flex-col rounded-3xl border p-5 lg:p-6 transition-all duration-300 ${
                    plan.highlight
                      ? `border-cyan-400/30 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-1.5`
                      : plan.popular
                      ? `${c.borderActive} bg-slate-900 shadow-2xl ${c.glow} ring-4 ${c.ring} hover:-translate-y-1.5`
                      : `border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:border-white/10 hover:-translate-y-1 ${c.border}`
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        plan.highlight
                          ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-cyan-500/30"
                          : plan.popular
                          ? `bg-gradient-to-r ${c.gradient} text-white ${c.glow}`
                          : "border border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg ${c.glow}`}
                      >
                        <plan.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-50 leading-tight">
                          {plan.name}
                        </h3>
                        <p className={`text-[11px] font-semibold mt-0.5 ${c.text}`}>
                          {plan.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ROI headline */}
                  <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 mb-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Daily Return
                        </p>
                        <p className={`mt-1 text-3xl font-black ${c.text} tabular-nums`}>
                          {plan.roi}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Duration
                        </p>
                        <div className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-200">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {plan.duration}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${c.gradient}`}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-2.5 py-1.5">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider">
                          Min
                        </span>
                        <span className="font-black text-slate-200 tabular-nums">
                          {formatCurrency(plan.minAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-2.5 py-1.5">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider">
                          Max
                        </span>
                        <span className="font-black text-slate-200 tabular-nums">
                          {formatCurrency(plan.maxAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Example Earnings */}
                  <div className={`rounded-2xl border ${c.border} ${c.bgSoft} p-3.5 mb-4`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${c.textSoft} mb-2`}>
                      Example · Entry {formatCurrency(plan.minAmount)}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <p className="font-semibold text-slate-500">Daily Earnings</p>
                        <p className="font-black text-slate-100 tabular-nums mt-0.5">
                          +{formatCurrency(demo.daily)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-500">Total Return</p>
                        <p className={`font-black ${c.text} tabular-nums mt-0.5`}>
                          {formatCurrency(demo.totalReturn)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-2.5 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${c.text}`}
                        />
                        <span className="text-xs text-slate-300 leading-relaxed">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer referral pill + CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <Gift className="h-3 w-3" />
                        Referral
                      </span>
                      <span className={`text-[11px] font-black ${c.text}`}>
                        {plan.referral} Direct
                      </span>
                    </div>

                    <Link
                      href={plan.cta.href}
                      className={`group relative w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition active:scale-[0.98] ${
                        plan.popular || plan.highlight
                          ? `bg-gradient-to-r ${c.gradient} text-white shadow-lg ${c.glow} hover:brightness-110`
                          : `border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-white/15`
                      }`}
                    >
                      {plan.cta.label}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 mb-5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Simple 4-Step Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Start Earning In Minutes
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              A frictionless, audited onboarding flow backed by multi-layer KYC and
              automated earnings distribution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              {
                n: 1,
                icon: Users,
                title: "Create Your Account",
                desc: "Sign up with email in under 60 seconds. Verify identity to activate unlimited deposits.",
                tint: "emerald",
              },
              {
                n: 2,
                icon: Wallet,
                title: "Fund Your Wallet",
                desc: "Deposit BTC, ETH, USDT or XRP. All deposits auto-credited after on-chain confirmations.",
                tint: "violet",
              },
              {
                n: 3,
                icon: BarChart3,
                title: "Select Your Plan",
                desc: "Choose a strategy aligned with your capital. Your position is activated instantly.",
                tint: "amber",
              },
              {
                n: 4,
                icon: Percent,
                title: "Receive Daily Earnings",
                desc: "Returns are credited to your balance every 24h. Withdraw or reinvest automatically.",
                tint: "cyan",
              },
            ].map((s, i) => {
              const t = colorMap[s.tint as Plan["color"]];
              return (
                <div
                  key={s.n}
                  className="relative rounded-3xl border border-white/5 bg-slate-900/60 p-6 hover:bg-slate-900 transition group"
                >
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2.5 z-10 -translate-y-1/2">
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${t.gradient} text-white shadow-lg ${t.glow}`}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-5xl font-black text-white/[0.06] tabular-nums">
                      0{s.n}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-50">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PLAN COMPARISON TABLE ============ */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-slate-900/70 px-4 py-2 mb-5">
              <LineChart className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Side-by-side Comparison
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Find the Perfect Fit
            </h2>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/60 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/5">
              <div className="p-5 lg:p-6 col-span-1 lg:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Feature
                </p>
              </div>
              {PLANS.map((p) => (
                <div key={p.id} className="p-5 lg:p-6 border-l border-white/5">
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest text-center ${colorMap[p.color].text}`}
                  >
                    {p.name.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              {
                label: "Daily Return",
                values: PLANS.map((p) => ({ v: p.roi, strong: true, color: p.color })),
              },
              {
                label: "Duration",
                values: PLANS.map((p) => ({ v: p.duration, strong: false })),
              },
              {
                label: "Min Investment",
                values: PLANS.map((p) => ({ v: formatCurrency(p.minAmount), strong: false })),
              },
              {
                label: "Max Investment",
                values: PLANS.map((p) => ({ v: formatCurrency(p.maxAmount), strong: false })),
              },
              {
                label: "Daily Earnings Credit",
                values: PLANS.map(() => ({ v: "✓", check: true, color: "emerald" as Plan["color"] })),
              },
              {
                label: "Compounding Option",
                values: PLANS.map((p, i) => ({
                  v: i >= 1 ? "✓" : "—",
                  check: i >= 1,
                  color: (i >= 1 ? "emerald" : "emerald") as Plan["color"],
                })),
              },
              {
                label: "Advanced Analytics",
                values: PLANS.map((p, i) => ({
                  v: i >= 1 ? "✓" : "Basic",
                  check: i >= 1,
                  color: "emerald" as Plan["color"],
                })),
              },
              {
                label: "Account Manager",
                values: PLANS.map((p, i) => ({
                  v: i >= 2 ? "✓" : "—",
                  check: i >= 2,
                  color: "emerald" as Plan["color"],
                })),
              },
              {
                label: "VIP Support",
                values: PLANS.map((p, i) => ({
                  v: i >= 2 ? "✓" : i === 1 ? "Priority" : "Standard",
                  check: i >= 2,
                  color: "emerald" as Plan["color"],
                })),
              },
              {
                label: "Referral Bonus",
                values: PLANS.map(() => ({ v: "4% Direct", strong: false })),
              },
            ].map((row, idx) => (
              <div
                key={row.label}
                className={`grid grid-cols-5 ${idx % 2 ? "bg-white/[0.015]" : ""} border-b border-white/[0.03] last:border-b-0`}
              >
                <div className="p-4 lg:p-5 col-span-1 lg:col-span-2">
                  <p className="text-xs lg:text-sm font-semibold text-slate-300">
                    {row.label}
                  </p>
                </div>
                {row.values.map((vv: any, i) => (
                  <div
                    key={i}
                    className="p-4 lg:p-5 flex items-center justify-center border-l border-white/[0.03]"
                  >
                    {vv.check ? (
                      <BadgeCheck
                        className={`h-4 w-4 ${colorMap[(vv.color || "emerald") as Plan["color"]].text}`}
                      />
                    ) : (
                      <p
                        className={`text-xs lg:text-sm text-center ${vv.strong ? `font-black ${colorMap[(vv.color || "emerald") as Plan["color"]].text}` : "font-medium text-slate-400"} tabular-nums`}
                      >
                        {vv.v}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST / WHY CHOOSE US ============ */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 mb-6">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Institutional Grade
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1] text-white">
                Why serious investors choose our plans.
              </h2>
              <p className="mt-5 text-sm text-slate-400 leading-relaxed">
                Every strategy is audited monthly, with transparent trade
                execution and segregated client assets. We&apos;ve built a
                platform that institutional funds trust — now available to all
                account sizes.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Lock,
                    title: "Multi-Sig Cold Storage",
                    desc: "98% of client assets held in air-gapped, geographically distributed wallets.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Third-Party Audited",
                    desc: "Quarterly attestations from leading blockchain audit firms.",
                  },
                  {
                    icon: Globe,
                    title: "Global Licensing",
                    desc: "Registered entities in multiple jurisdictions with full compliance.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-slate-900/50 p-4 hover:bg-slate-900 transition"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <f.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{f.title}</p>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust cards grid */}
            <div className="grid grid-cols-2 gap-3.5 lg:gap-4">
              {[
                {
                  icon: ShieldCheck,
                  t: "Security",
                  d: "ISO 27001 & SOC 2 Type II compliant infrastructure.",
                  tnt: "emerald",
                },
                {
                  icon: Headphones,
                  t: "24/7 Support",
                  d: "Multi-channel support with sub-15 min response on VIP tiers.",
                  tnt: "violet",
                },
                {
                  icon: Clock,
                  t: "Instant Payouts",
                  d: "Most withdrawals processed in under 90 minutes.",
                  tnt: "amber",
                },
                {
                  icon: Gift,
                  t: "Referral Program",
                  d: "4% direct commissions + 3-level matrix override bonuses.",
                  tnt: "cyan",
                },
                {
                  icon: Building2,
                  t: "Transparent Fees",
                  d: "0 hidden fees. All performance charges disclosed upfront.",
                  tnt: "emerald",
                },
                {
                  icon: LineChart,
                  t: "Proven Track Record",
                  d: "5+ years audited performance across all market cycles.",
                  tnt: "violet",
                },
              ].map((card) => {
                const t = colorMap[card.tnt as Plan["color"]];
                return (
                  <div
                    key={card.t}
                    className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 hover:bg-slate-900 hover:border-white/10 transition"
                  >
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} text-white mb-4 shadow-lg ${t.glow}`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-black text-slate-50">{card.t}</p>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {card.d}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-slate-900/70 px-4 py-2 mb-5">
              <Info className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                Frequently Asked Questions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Plan Questions, Answered
            </h2>
            <p className="mt-4 text-sm text-slate-400">
              Everything you need to know before investing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "When do I start earning after I invest?",
                a: "Your investment activates instantly upon confirmation. Earnings are calculated from the time of activation and credited to your balance every 24 hours (midnight UTC). You'll receive an in-app notification and optional email/SMS alert for each credit.",
              },
              {
                q: "What happens when my plan reaches maturity?",
                a: "At the end of your plan duration, the full principal (initial amount invested) is returned to your available balance, along with any final earnings. You can then withdraw, reinvest into the same plan, or upgrade to a higher tier for greater returns.",
              },
              {
                q: "Is there a penalty for early cancellation?",
                a: "Basic and Silver plans can be cancelled early with a 10% administrative fee on the principal. Enterprise and VIP plans have lock-in periods; contact your account manager for structuring options tailored to liquidity needs.",
              },
              {
                q: "What is the minimum deposit amount?",
                a: "You can deposit any amount starting at $20 in any supported cryptocurrency (BTC, ETH, USDT, XRP). Individual plans require their specific minimum investment (Basic starts at $200).",
              },
              {
                q: "How does the 4% referral bonus work?",
                a: "Every referral you bring through your unique link earns you a 4% commission on their initial investment, credited instantly to your balance. Combined with our 3-level referral matrix, you can also earn overrides on their referrals.",
              },
              {
                q: "Can I run multiple plans at once?",
                a: "Yes! You can hold active positions across Basic, Silver, Enterprise and VIP simultaneously — each operates as an independent strategy with its own maturity date and earnings stream.",
              },
              {
                q: "How long do withdrawals take?",
                a: "Crypto withdrawals are processed in batches 6 times per day. Standard tier withdrawals: < 24h. Silver+: < 4h. Enterprise & VIP: priority queue with average 45-90 minute processing.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/5 bg-slate-900/60 p-5 open:bg-slate-900 open:border-white/10 transition"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-bold text-slate-100">
                    {f.q}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 group-open:rotate-45 group-open:bg-violet-500/10 group-open:text-violet-300 transition text-lg">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-slate-900 via-violet-950/40 to-slate-900 p-8 lg:p-14">
            <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Ready to begin?
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Your first earnings cycle{" "}
                  <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    starts today.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-base text-slate-400 leading-relaxed">
                  Join 50,000+ active investors. Create an account in 60 seconds,
                  fund your wallet, and select the plan that matches your goals.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/register"
                  className="group relative w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-5 text-base font-black text-white shadow-2xl shadow-emerald-500/25 transition hover:brightness-110 hover:-translate-y-0.5"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Contact Sales
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-5 pt-2 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    support@digitaltrend.com
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="h-3 w-3" />
                    24/7 Live Chat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
