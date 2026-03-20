"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Briefcase,
  Layers,
  LineChart,
  Users,
  Target,
  Zap,
} from "lucide-react";

export default function WhatWeDoPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-slate-900 group">
        <Image
          src="/images/julios.webp"
          alt="Investment Strategy"
          fill
          className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-white" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Our Expertise
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl max-w-5xl leading-[1.1]">
            Tailored Investment <br className="hidden md:block" /> Ecosystem
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-slate-200 leading-relaxed font-medium">
            We design diversified portfolios across global equities, fixed
            income, and alternative assets, precisely calibrated to your risk
            profile and aspirations.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-emerald-600/40 transition-all hover:bg-emerald-700 hover:-translate-y-1"
            >
              Start Your Journey
            </Link>
            <Link
              href="#services"
              className="rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:-translate-y-1"
            >
              Our Solutions
            </Link>
          </div>
        </div>
      </div>

      {/* Core Services Section */}
      <div id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px w-8 bg-emerald-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                What We Do
              </p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Comprehensive Wealth Management <br className="hidden md:block" />{" "}
              and Asset Protection
            </h2>
          </div>
          <Link
            href="/plans"
            className="group inline-flex items-center gap-3 text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            Explore investment plans{" "}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Service 1: Stock Broking */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <BarChart3 size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Stock Broking
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Execute precision transactions across global exchanges. Our team
                provides the infrastructure and insight needed to navigate
                equity markets with confidence and speed.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          {/* Service 2: Asset Management */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Briefcase size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Asset Management
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Passionate, independent management united by research-driven
                solutions. We align our performance incentives with your
                long-term financial prosperity.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          {/* Service 3: Alternative Assets */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Layers size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Alternative Assets
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Access non-traditional markets including commodities, ETPs, and
                digital assets. We provide the expertise to diversify beyond
                conventional equity and bond markets.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          {/* Service 4: Risk Advisory */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Risk Advisory
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Institutional-grade risk modeling and stress testing. We help
                you identify and mitigate asymmetric risks to ensure capital
                preservation across all market cycles.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          {/* Service 5: Market Intelligence */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <LineChart size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Market Intelligence
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Proprietary data analytics and high-frequency market tracking.
                We distill noise into actionable signals for informed
                decision-making.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>

          {/* Service 6: Strategic Consulting */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-emerald-50 transition-transform duration-700 group-hover:scale-[3]" />
            <div className="relative z-10">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Target size={32} />
              </div>
              <h4 className="mb-5 text-2xl font-bold text-slate-900">
                Strategic Consulting
              </h4>
              <p className="text-base leading-relaxed text-slate-600">
                Bespoke financial planning tailored to your unique objectives.
                Our senior advisors provide dedicated support to help you
                achieve your long-term vision.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-600">
                Learn more{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Programme Section */}
      <div className="bg-white border-y border-slate-100 py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                Referral Rewards
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Our Partnership Network
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Join our global network of partners and benefit from our shared
              success. We value the trust you place in us when recommending our
              services.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col gap-6 rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                <Users size={40} />
              </div>
              <div>
                <div className="text-5xl font-black text-slate-900 mb-2">
                  10%
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                  Referral Commission
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                Earn industry-leading commissions for every successful client
                you introduce to our platform.
              </p>
            </div>

            <div className="flex flex-col gap-6 rounded-[2.5rem] border border-emerald-100 bg-emerald-50/30 p-12 text-center transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="rounded-full bg-emerald-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                  Popular
                </div>
              </div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20">
                <Zap size={40} />
              </div>
              <div>
                <div className="text-5xl font-black text-slate-900 mb-2">
                  Instant
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                  Payout Process
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Benefit from automated, instant payouts directly to your secure
                account wallet upon confirmation.
              </p>
            </div>

            <div className="flex flex-col gap-6 rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center transition-all hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={40} />
              </div>
              <div>
                <div className="text-5xl font-black text-slate-900 mb-2">
                  24/7
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                  Partner Support
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                Dedicated support channels for our partners to ensure smooth
                onboarding and account management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="relative overflow-hidden rounded-[4rem] bg-slate-900 p-12 md:p-24 shadow-2xl group/cta">
          {/* Background Image with Overlay */}
          <Image
            src="/images/julios.webp"
            alt="Contact Background"
            fill
            className="object-cover opacity-20 transition-transform duration-1000 group-hover/cta:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-8">
              Ready to elevate your <br /> investment strategy?
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Schedule a private consultation with our senior advisors to
              discuss how we can help you achieve your financial aspirations.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-10 py-5 text-base font-bold text-white shadow-2xl shadow-emerald-600/40 transition-all hover:bg-emerald-700 hover:-translate-y-1"
              >
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded-full bg-white/10 px-10 py-5 text-base font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:-translate-y-1"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
