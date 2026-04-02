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
                <Zap size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Basic Plan
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Basic Plan</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">8% Daily</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Duration: 1 Day
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$100 &ndash; $5,000</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                24/7 Support
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Secure Investment
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Instant Withdrawal
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Referral Bonus: 4%
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
                Silver Plan
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Silver Plan</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">18% Daily</div>
              <p className="text-xs text-emerald-600/70 uppercase tracking-widest font-bold mt-1">
                Duration: 2 Days
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$5,000 &ndash; $20,000</p>
              <p className="text-xs text-emerald-600/50 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Priority Support
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Advanced Analytics
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Compounding Available
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                Referral Bonus: 4%
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
                Enterprise Plan
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Enterprise Plan</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">25% Daily</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Duration: 4 Days
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$10,000 &ndash; $30,000</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Dedicated Manager
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                VIP Access
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Capital Protection
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Referral Bonus: 4%
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-4 text-sm font-bold text-slate-900 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
            >
              Select Plan
            </Link>
          </div>

          {/* Plan 4 */}
          <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                VIP Plan
              </p>
              <h3 className="text-2xl font-bold text-slate-900">Vip Plan</h3>
            </div>
            <div className="mb-8">
              <div className="text-4xl font-black text-emerald-600">40% Daily</div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                Duration: 6 Days
              </p>
            </div>
            <div className="mb-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">$25,000 &ndash; $200,000</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Investment Range</p>
            </div>
            <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Dedicated Manager
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                VIP Access
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Capital Protection
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-500" />
                Referral Bonus: 4%
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
