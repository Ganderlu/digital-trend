"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  BarChart3,
  Globe,
  PieChart,
} from "lucide-react";

export default function PlansPage() {
  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1611974717528-587ce9430504?auto=format&fit=crop&q=80&w=2070"
          alt="Investment Strategy"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 mb-4">
            Investment Vehicles
          </h1>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl">
            Choose Your Path to Wealth
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Institutional-grade strategies tailored to your capital requirements and risk tolerance.
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Plan 1 */}
          <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <PieChart size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Starter Tier
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Starter Edge</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">5&ndash;7%</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Target Annual Return
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$100 &ndash; $499</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Diversified ETFs
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Quarterly Reports
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Standard Support
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-900 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="group relative flex flex-col rounded-[2.5rem] border border-emerald-200 bg-emerald-50 p-8 shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all hover:-translate-y-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              Most Popular
            </div>
            <div className="mb-8 pt-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <TrendingUp size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                Growth Tier
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Elite Growth</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">8&ndash;12%</div>
              <p className="text-xs text-emerald-600/70 uppercase tracking-widest font-bold mt-1">
                Target Annual Return
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$500 &ndash; $4,999</p>
              <p className="text-xs text-emerald-600/50 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Advanced Analytics
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Monthly Rebalancing
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Priority Support
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-full bg-emerald-600 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/40 transition hover:bg-emerald-700"
            >
              Choose Plan
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BarChart3 size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Advanced
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Strategic Wealth</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">12&ndash;18%</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Target Annual Return
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$5,000 &ndash; Unlimited</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Custom Portfolios
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Direct Advisory
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                24/7 Access
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-900 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
            >
              Select Wealth
            </Link>
          </div>

          {/* Plan 4 */}
          <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Institutional
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Legacy Alpha</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">20%+</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Target Annual Return
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$20,000 &ndash; Unlimited</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Institutional Grade
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Bespoke Strategies
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Concierge Support
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-900 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-slate-50 py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
            Need help choosing the right plan?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Our expert advisors are available to discuss your financial objectives and help you select the most appropriate strategy.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/40 transition hover:bg-emerald-700"
          >
            Consult an Expert
          </Link>
        </div>
      </div>
    </div>
  );
}
