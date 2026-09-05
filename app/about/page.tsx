"use client";

import Image from "next/image";
import {
  Globe,
  Users,
  FolderKanban,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Briefcase,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
            alt="Modern Financial Building"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.12),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-28 lg:pt-32 lg:pb-36">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                Discover Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white sm:text-6xl max-w-4xl">
              Driving Financial Innovation
              <span className="block mt-3 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Since 2012
              </span>
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
              A premier independent wealth management firm blending rigorous
              macro research with advanced risk modeling — built for serious
              investors who demand institutional-grade execution.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="relative border-y border-white/5 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-6">
                Who We Are
              </p>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-8 leading-[1.1]">
                A Global Leader in
                <span className="block text-emerald-400">Wealth Management</span>
              </h3>
              <div className="space-y-6 text-base leading-relaxed text-slate-400">
                <p>
                  <span className="font-semibold text-slate-200">
                    TeveXtra
                  </span>{" "}
                  is a premier independent wealth management firm dedicated to
                  helping families, individuals, and institutions build
                  resilient, future-proof portfolios. Our investment philosophy
                  blends rigorous macro research with advanced risk modeling.
                </p>
                <p>
                  Founded in 2012, we recognized that the traditional financial
                  landscape was evolving. Our mission was clear: to provide
                  institutional-grade investment strategies to a broader global
                  audience, ensuring transparency, security, and consistent
                  growth across all market cycles.
                </p>
                <p>
                  Today, we manage over{" "}
                  <span className="font-bold text-slate-200">$750M</span> in
                  assets for clients in{" "}
                  <span className="font-bold text-slate-200">47 countries</span>
                  , operating under a strict fiduciary standard that ensures
                  your interests always come first.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-5 border-t border-white/5 pt-8">
                {[
                  { n: "$750M+", l: "AUM Managed" },
                  { n: "47", l: "Countries" },
                  { n: "12+", l: "Years Live" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-2xl md:text-3xl font-black text-white tabular-nums">
                      {s.n}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-indigo-500/20 rounded-[2.75rem] blur-2xl" />
              <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070"
                  alt="Our Professional Team"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-8 -left-8 hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-7 text-white shadow-[0_20px_50px_-15px_rgba(16,185,129,0.5)] md:block">
                <div className="text-4xl font-black tabular-nums">12+</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-95 mt-1">
                  Years of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section id="approach" className="relative">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.1),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sky-400 mb-4">
              Our Methodology
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Disciplined Strategies for
              <span className="block text-sky-400">Long-Term Growth</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed">
              We leverage proprietary algorithms and real-time market data to
              identify asymmetric risk-reward opportunities across global
              markets.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Data-Driven Research",
                desc: "Our team utilizes sophisticated software to analyze daily market noise, forecasts, and announcements, identifying high-conviction opportunities before they become mainstream.",
                color: "emerald",
              },
              {
                icon: ShieldCheck,
                title: "Risk Management",
                desc: "Capital preservation is our first priority. We implement multi-layered risk controls and stress testing to protect portfolios against extreme market volatility.",
                color: "sky",
              },
              {
                icon: TrendingUp,
                title: "Strategic Allocation",
                desc: "We build diversified portfolios across global equities, fixed income, and alternative assets, tailored precisely to each client's unique time horizon and goals.",
                color: "indigo",
              },
            ].map((c) => {
              const map: Record<
                string,
                { bg: string; border: string; text: string; ring: string }
              > = {
                emerald: {
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  text: "text-emerald-400",
                  ring: "shadow-emerald-500/15",
                },
                sky: {
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/20",
                  text: "text-sky-400",
                  ring: "shadow-sky-500/15",
                },
                indigo: {
                  bg: "bg-indigo-500/10",
                  border: "border-indigo-500/20",
                  text: "text-indigo-400",
                  ring: "shadow-indigo-500/15",
                },
              };
              const s = map[c.color];
              return (
                <div
                  key={c.title}
                  className="group relative rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 transition-all duration-300 hover:bg-slate-900 hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.15)]"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} border ${s.border}`}
                  >
                    <c.icon className={`h-6 w-6 ${s.text}`} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">
                    {c.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {c.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Quote Section */}
      <section className="relative border-y border-white/5 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-10 md:p-16 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.08]">
              <svg className="h-full w-full" fill="none" viewBox="0 0 100 100">
                <pattern
                  id="about-grid"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 8 0 L 0 0 0 8"
                    stroke="white"
                    strokeWidth="0.3"
                  />
                </pattern>
                <rect width="100" height="100" fill="url(#about-grid)" />
              </svg>
            </div>

            <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto_1fr] items-center text-center lg:text-left">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 italic leading-[1.15]">
                  <span className="text-5xl md:text-6xl font-black text-emerald-500/25 leading-none align-[-10px] mr-1">
                    “
                  </span>
                  Our mission is to democratize institutional-grade investing,
                  providing the transparency and security every investor
                  deserves.
                  <span className="text-5xl md:text-6xl font-black text-emerald-500/25 leading-none align-[-10px] ml-1">
                    ”
                  </span>
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto lg:mx-0 mb-6" />
                <div>
                  <div className="text-xl font-bold text-white">
                    Michael Sterling
                  </div>
                  <div className="text-emerald-400 font-bold uppercase tracking-[0.25em] text-xs mt-1.5">
                    Founder &amp; CEO
                  </div>
                </div>
              </div>

              <div className="hidden lg:block h-32 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              <div className="grid grid-cols-2 gap-6 md:gap-8 text-white">
                {[
                  { n: "47+", l: "Countries Represented" },
                  { n: "$750M+", l: "Assets Under Management" },
                  { n: "110k+", l: "Global Clients" },
                  { n: "30+", l: "Expert Team Members" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-xl border border-white/5 bg-slate-950/40 p-5 text-left"
                  >
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tabular-nums">
                      {s.n}
                    </div>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fiduciary Section */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-500/15 rounded-[2.75rem] blur-2xl" />
              <div className="relative h-[420px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                  alt="Commitment to Excellence"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-indigo-400 mb-4">
                Our Standard
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                A Fiduciary Commitment to
                <span className="block text-indigo-400">Your Success</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                We operate under a strict fiduciary standard, which means we are
                legally and ethically bound to act in your best interests at all
                times. This commitment is the foundation of our long-term client
                relationships.
              </p>
              <ul className="space-y-4">
                {[
                  { t: "Absolute Fee Transparency" },
                  { t: "No Proprietary Product Conflicts" },
                  { t: "Aligned Performance Incentives" },
                  { t: "Full Portfolio Auditability" },
                ].map((item, i) => (
                  <li
                    key={item.t}
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/40 p-4 transition hover:bg-slate-900/60 hover:border-white/10"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="font-bold text-slate-100">{item.t}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Pillars Bar */}
      <section className="relative border-t border-white/5 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              {
                label: "Institutional Heritage",
                value: "Wall St.",
                icon: Briefcase,
                color: "emerald",
              },
              {
                label: "Fiduciary Standard",
                value: "100%",
                icon: UserCheck,
                color: "sky",
              },
              {
                label: "Global Reach",
                value: "140+",
                icon: Globe,
                color: "indigo",
              },
              {
                label: "Client Retention",
                value: "98.4%",
                icon: Users,
                color: "amber",
              },
            ].map((s, i) => {
              const map: Record<
                string,
                { bg: string; border: string; text: string }
              > = {
                emerald: {
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  text: "text-emerald-400",
                },
                sky: {
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/20",
                  text: "text-sky-400",
                },
                indigo: {
                  bg: "bg-indigo-500/10",
                  border: "border-indigo-500/20",
                  text: "text-indigo-400",
                },
                amber: {
                  bg: "bg-amber-500/10",
                  border: "border-amber-500/20",
                  text: "text-amber-400",
                },
              };
              const c = map[s.color];
              return (
                <div key={s.label} className="group">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} border ${c.border} mb-4`}
                  >
                    <s.icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tight">
                    {s.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
