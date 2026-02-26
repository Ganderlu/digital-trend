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

export default function WhatWeDoPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-sm font-bold uppercase tracking-wider text-emerald-500">
            Our Services
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-emerald-500">/</span>
            <span className="text-slate-100">Our Services</span>
          </div>
        </div>
      </div>

      {/* Core Services Section */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          
          <Link
            href="/services"
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-emerald-500"
          >
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Service 1 */}
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000"
                alt="Stock Broking"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h4 className="mb-4 text-xl font-bold text-emerald-500">
                Stock Broking
              </h4>
              <p className="text-sm leading-7 text-slate-400">
                This means that we can implement any transaction upon the client's
                instructions for any company listed on local (Malta Stock Exchange)
                or foreign exchanges.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000"
                alt="Broad Scope"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h4 className="mb-4 text-xl font-bold text-emerald-500">
                Broad Scope
              </h4>
              <p className="text-sm leading-7 text-slate-400">
                We are a passionate, independent investment firm united by our
                commitment to research driven investment solutions for our clients.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000"
                alt="Commodities & Purpose Driven"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h4 className="mb-4 text-xl font-bold text-emerald-500">
                Commodities & Purpose Driven
              </h4>
              <p className="text-sm leading-7 text-slate-400">
                There are several ways to invest in commodities. One is to purchase
                varying amounts of physical raw commodities. Investors can also
                invest through the use of futures contracts or exchange-traded
                products(ETPs).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Programme Section */}
      <div className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              We offer a direct referral commission on every referral you sign up
              with your link
            </p>
            <h2 className="text-3xl font-bold text-emerald-500 sm:text-4xl">
              Affiliate Programme
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-slate-100">10%</div>
              <div className="text-sm font-bold text-emerald-500">
                Referral Commission
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-slate-100">Instant</div>
              <div className="text-sm font-bold text-emerald-500">
                Payout Time
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-slate-100">24/7</div>
              <div className="text-sm font-bold text-emerald-500">
                Customer Response
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-white p-8 sm:p-12">
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                CONTACT US NOW
              </p>
              <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
                Request a free consultation with us
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Need to speak to us? Do you have any queries or suggestions?
                Please contact us about all enquiries including membership and
                volunteer work.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              Contact Us
            </Link>
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
