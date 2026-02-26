"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Clock,
  Zap,
  Headphones,
  TrendingUp,
  Globe,
  Bitcoin,
} from "lucide-react";

export default function PlansPage() {
  return (
    <div className="bg-slate-950 min-h-screen">

      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-sm font-bold uppercase tracking-wider text-emerald-500">
            Our Plans
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-emerald-500">/</span>
            <span className="text-slate-100">Our Plans</span>
          </div>
        </div>
      </div>

      {/* Investment Plans Section */}
      <div className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {/* Plan 1 */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-emerald-700">First Plan</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1 text-slate-900">
                <span className="text-lg font-medium">$</span>
                <span className="text-4xl font-bold">100</span>
              </div>
              <p className="mt-2 text-xs font-bold text-emerald-600">$499</p>

              <div className="mt-8 w-full space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Weekly Profit: 2.5%
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  6 days
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full rounded-md border-2 border-emerald-600 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                Register Now
              </Link>
            </div>

            {/* Plan 2 */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-emerald-700">Second Plan</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1 text-slate-900">
                <span className="text-lg font-medium">$</span>
                <span className="text-4xl font-bold">500</span>
              </div>
              <p className="mt-2 text-xs font-bold text-emerald-600">$4,999</p>

              <div className="mt-8 w-full space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Weekly Profit: 3%
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  5 days
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full rounded-md border-2 border-emerald-600 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                Register Now
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-emerald-700">Third Plan</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1 text-slate-900">
                <span className="text-lg font-medium">$</span>
                <span className="text-4xl font-bold">5,000</span>
              </div>
              <p className="mt-2 text-xs font-bold text-emerald-600">Unlimited</p>

              <div className="mt-8 w-full space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Weekly Profit: 4.5%
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  10 days
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full rounded-md border-2 border-emerald-600 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                Register Now
              </Link>
            </div>

            {/* Plan 4 */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-emerald-700">Fourth Plan</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1 text-slate-900">
                <span className="text-lg font-medium">$</span>
                <span className="text-4xl font-bold">20,000</span>
              </div>
              <p className="mt-2 text-xs font-bold text-emerald-600">Unlimited</p>

              <div className="mt-8 w-full space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Weekly Profit: 6%
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  5 days
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full rounded-md border-2 border-emerald-600 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
