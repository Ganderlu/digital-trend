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
  const services = [
    {
      icon: BarChart3,
      title: "Stock Broking",
      desc: "Execute precision transactions across global exchanges. Our team provides the infrastructure and insight needed to navigate equity markets with confidence and speed.",
      color: "emerald",
    },
    {
      icon: Briefcase,
      title: "Asset Management",
      desc: "Passionate, independent management united by research-driven solutions. We align our performance incentives with your long-term financial prosperity.",
      color: "sky",
    },
    {
      icon: Layers,
      title: "Alternative Assets",
      desc: "Access non-traditional markets including commodities, ETPs, and digital assets. We provide the expertise to diversify beyond conventional equity and bond markets.",
      color: "indigo",
    },
    {
      icon: ShieldCheck,
      title: "Risk Advisory",
      desc: "Institutional-grade risk modeling and stress testing. We help you identify and mitigate asymmetric risks to ensure capital preservation across all market cycles.",
      color: "amber",
    },
    {
      icon: LineChart,
      title: "Market Intelligence",
      desc: "Proprietary data analytics and high-frequency market tracking. We distill noise into actionable signals for informed decision-making.",
      color: "emerald",
    },
    {
      icon: Target,
      title: "Strategic Consulting",
      desc: "Bespoke financial planning tailored to your unique objectives. Our senior advisors provide dedicated support to help you achieve your long-term vision.",
      color: "sky",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[520px] w-full overflow-hidden group">
        <Image
          src="/images/julios.webp"
          alt="Investment Strategy"
          fill
          className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.12),_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Our Expertise
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-7xl max-w-5xl leading-[1.1]">
            Tailored Investment
            <br className="hidden md:block" /> Ecosystem
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-slate-300 leading-relaxed font-medium">
            We design diversified portfolios across global equities, fixed
            income, and alternative assets, precisely calibrated to your risk
            profile and aspirations.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-1"
            >
              Start Your Journey
            </Link>
            <Link
              href="#services"
              className="rounded-full border border-white/10 bg-white/5 backdrop-blur px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
            >
              Our Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <div id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px w-8 bg-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                What We Do
              </p>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Comprehensive Wealth Management
              <br className="hidden md:block" /> and Asset Protection
            </h2>
          </div>
          <Link
            href="/plans"
            className="group inline-flex items-center gap-3 text-sm font-bold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Explore investment plans
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const map: Record<
              string,
              {
                ring: string;
                iconBg: string;
                iconBorder: string;
                iconText: string;
              }
            > = {
              emerald: {
                ring: "from-emerald-500/25",
                iconBg: "bg-emerald-500/10",
                iconBorder: "border-emerald-500/20",
                iconText: "text-emerald-400",
              },
              sky: {
                ring: "from-sky-500/25",
                iconBg: "bg-sky-500/10",
                iconBorder: "border-sky-500/20",
                iconText: "text-sky-400",
              },
              indigo: {
                ring: "from-indigo-500/25",
                iconBg: "bg-indigo-500/10",
                iconBorder: "border-indigo-500/20",
                iconText: "text-indigo-400",
              },
              amber: {
                ring: "from-amber-500/25",
                iconBg: "bg-amber-500/10",
                iconBorder: "border-amber-500/20",
                iconText: "text-amber-400",
              },
            };
            const c = map[s.color];
            return (
              <div
                key={s.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/40 p-8 transition-all duration-300 hover:border-white/10 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.12)]`}
              >
                <div
                  className={`absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br ${c.ring} via-transparent to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <div
                    className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${c.iconBg} border ${c.iconBorder} ${c.iconText} transition-all duration-500`}
                  >
                    <s.icon size={30} />
                  </div>
                  <h4 className="mb-5 text-xl font-bold text-white">
                    {s.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {s.desc}
                  </p>
                  <div
                    className={`mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] ${c.iconText}`}
                  >
                    Learn more
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Affiliate Programme Section */}
      <div className="border-y border-white/5 bg-slate-900/30 py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 border border-emerald-500/20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Referral Rewards
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Our Partnership Network
            </h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Join our global network of partners and benefit from our shared
              success. We value the trust you place in us when recommending our
              services.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                icon: Users,
                n: "10%",
                l: "Referral Commission",
                p: "Earn industry-leading commissions for every successful client you introduce to our platform.",
                color: "emerald",
                popular: false,
              },
              {
                icon: Zap,
                n: "Instant",
                l: "Payout Process",
                p: "Benefit from automated, instant payouts directly to your secure account wallet upon confirmation.",
                color: "emerald",
                popular: true,
              },
              {
                icon: ShieldCheck,
                n: "24/7",
                l: "Partner Support",
                p: "Dedicated support channels for our partners to ensure smooth onboarding and account management.",
                color: "sky",
                popular: false,
              },
            ].map((t, i) => (
              <div
                key={t.l}
                className={`relative flex flex-col gap-6 rounded-2xl border p-10 text-center transition-all duration-300 hover:-translate-y-2 ${
                  t.popular
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-slate-900/50 shadow-[0_25px_60px_-20px_rgba(16,185,129,0.25)]"
                    : "border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-900/40 hover:border-white/10 hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.3)]"
                }`}
              >
                {t.popular && (
                  <div className="absolute top-0 right-0 p-4">
                    <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                      Popular
                    </div>
                  </div>
                )}
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${
                    t.popular
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  <t.icon size={36} />
                </div>
                <div>
                  <div className="text-5xl font-black text-white mb-2 tabular-nums">
                    {t.n}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                    {t.l}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                  {t.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-12 md:p-20 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] group/cta">
          <Image
            src="/images/julios.webp"
            alt="Contact Background"
            fill
            className="object-cover opacity-20 transition-transform duration-1000 group-hover/cta:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.2),_transparent_55%)]" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-8 leading-[1.1]">
              Ready to elevate your
              <br /> investment strategy?
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Schedule a private consultation with our senior advisors to
              discuss how we can help you achieve your financial aspirations.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-1"
              >
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur px-10 py-5 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
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
