import Link from "next/link";
import Image from "next/image";
import { CryptoTicker } from "@/components/crypto-ticker";
import { ForexHeatMap } from "@/components/forex-heatmap";
import { LiveTradeChart } from "@/components/live-trade-chart";

export default function Home() {
  return (
    <div className="bg-white text-slate-900 transition-colors duration-300">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/digital.mp4" type="video/mp4" />
          </video>
          {/* Subtle light overlay for cinematic feel that blends into white below */}
          <div className="absolute inset-0 bg-slate-950/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32 w-full">
          <div className="grid items-center gap-16 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-emerald-600">
                The Future of Wealth Management
              </p>
              <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-8xl">
                Institutional Investing, Simplified.
              </h1>
              <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-slate-100">
                Access sophisticated strategies, institutional-grade research,
                and expert guidance. Build a resilient portfolio with
                Digital-trend's data-driven approach.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-5">
                <Link
                  href="/plans"
                  className="rounded-full bg-emerald-600 px-10 py-5 text-sm font-bold text-white shadow-2xl shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:-translate-y-1"
                >
                  Start Investing
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-10 py-5 text-sm font-bold text-white transition-all hover:bg-white/20 hover:border-emerald-500/50"
                >
                  Consult an Expert
                </Link>
              </div>
              <div className="mt-16 flex flex-wrap gap-10">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-black text-white">12+</span>
                  <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
                    Years Experience
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-black text-white">$750M+</span>
                  <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
                    Assets Managed
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-black text-white">4.9/5</span>
                  <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
                    Client Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      Live Portfolio Analytics
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <div className="h-4 w-4 rounded-sm border-2 border-slate-200 opacity-50" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-white/10 border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">
                      Total Performance
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-white">
                        +24.8%
                      </span>
                      <span className="text-emerald-400 text-sm font-bold pb-1">
                        ▲ 1.2% Today
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-emerald-500/20 border border-emerald-500/30">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
                        Annual ROI
                      </p>
                      <span className="text-2xl font-black text-white">
                        9.4%
                      </span>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/10 border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1">
                        Volatility
                      </p>
                      <span className="text-2xl font-black text-white">
                        6.2%
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Asset Allocation
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Optimized
                      </span>
                    </div>
                    <div className="flex h-2 gap-1 rounded-full overflow-hidden bg-white/10">
                      <div className="w-[60%] bg-emerald-500" />
                      <div className="w-[25%] bg-sky-400" />
                      <div className="w-[15%] bg-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <CryptoTicker />
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-32 px-6 py-24 md:py-32">
        <section
          id="about"
          className="grid gap-12 rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-12 md:grid-cols-[1.2fr_0.8fr] shadow-sm transition-colors duration-300"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 mb-4">
              Our Legacy
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Pioneering the Future of Digital Wealth
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Digital-trend is a premier independent wealth management firm
              dedicated to helping families, and institutions build resilient,
              future-proof portfolios. Our investment philosophy blends rigorous
              macro research with advanced risk modeling.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              We align every strategy with your long-term vision, ensuring
              transparency, security, and consistent growth across all market
              cycles.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm transition-colors duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                Standard of Care
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Fiduciary Excellence
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating under a strict fiduciary standard, ensuring your
                interests always come first with absolute transparency.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-colors duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Innovation
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Leveraging proprietary algorithms and real-time data to capture
                alpha in evolving global markets.
              </p>
            </div>
          </div>
        </section>

        <section
          id="what-we-do"
          className="relative overflow-hidden grid gap-12 rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-12 md:grid-cols-[0.8fr_1.2fr] transition-colors duration-300 group/section"
        >
          {/* Section Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/julios.webp"
              alt="Section Background"
              fill
              className="object-cover transition duration-700 group-hover/section:scale-105"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-center gap-8 rounded-3xl border border-emerald-100 backdrop-blur-md p-8 transition-colors duration-300">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
                Core Philosophy
              </p>
              <h3 className="text-2xl font-extrabold text-white mb-4">
                Disciplined Risk Management
              </h3>
              <p className="text-white leading-relaxed">
                We focus on risk-adjusted outcomes, not speculation. Our
                multi-layered approach is designed for the serious, long-term
                investor seeking capital preservation and growth.
              </p>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-white font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Institutional-grade research access
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aligned performance incentives
              </li>
              <li className="flex items-center gap-3 text-white font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Transparent, fixed-fee structures
              </li>
            </ul>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tailored Investment Ecosystem
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white">
              We design diversified portfolios across global equities, fixed
              income, and alternative assets, precisely calibrated to your risk
              profile and aspirations.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="group relative rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm p-6 transition-all hover:bg-white hover:border-emerald-200">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 border border-emerald-200">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">
                    Goal-Based Portfolios
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Precision strategies for wealth accumulation and
                    preservation.
                  </p>
                </div>
              </div>
              <div className="group relative rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm p-6 transition-all hover:bg-white hover:border-sky-200">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-2xl bg-sky-100 flex items-center justify-center mb-4 border border-sky-200">
                    <svg
                      className="w-5 h-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">
                    Smart Risk Controls
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dynamic rebalancing and stress testing at the portfolio
                    level.
                  </p>
                </div>
              </div>
              <div className="group relative rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm p-6 transition-all hover:bg-white hover:border-purple-200">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 border border-purple-200">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">
                    Fiduciary Reporting
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Comprehensive dashboards with deep performance insights.
                  </p>
                </div>
              </div>
              <div className="group relative rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm p-6 transition-all hover:bg-white hover:border-amber-200">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 border border-amber-200">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">
                    Continuous Advisory
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dedicated expert support whenever you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="space-y-12">
          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
              Exclusive Opportunities
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Investment Plans
            </h2>
            <p className="max-w-2xl text-lg text-slate-500">
              Choose a strategy aligned with your capital requirements and risk
              tolerance. All plans feature institutional-grade oversight.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Plan 1 */}
            <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-xl hover:-translate-y-2">
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Basic Plan
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Basic Plan
                </h3>
              </div>
              <div className="mb-8">
                <div className="text-3xl font-black text-emerald-600">
                  8% Daily
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Duration: 1 Day
                </p>
              </div>
              <div className="mb-8 space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  $100 &ndash; $5,000
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Investment Range
                </p>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  24/7 Support
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure Investment
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Instant Withdrawal
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                  Silver Plan
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Silver Plan
                </h3>
              </div>
              <div className="mb-8">
                <div className="text-3xl font-black text-emerald-600">
                  18% Daily
                </div>
                <p className="text-xs text-emerald-600/70 uppercase tracking-widest font-bold mt-1">
                  Duration: 2 Days
                </p>
              </div>
              <div className="mb-8 space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  $5,000 &ndash; $20,000
                </p>
                <p className="text-xs text-emerald-600/50 uppercase tracking-widest font-bold">
                  Investment Range
                </p>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Priority Support
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Advanced Analytics
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Compounding Available
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-xl hover:-translate-y-2">
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Enterprise Plan
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Enterprise Plan
                </h3>
              </div>
              <div className="mb-8">
                <div className="text-3xl font-black text-emerald-600">
                  25% Daily
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Duration: 4 Days
                </p>
              </div>
              <div className="mb-8 space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  $10,000 &ndash; $30,000
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Investment Range
                </p>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Dedicated Manager
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  VIP Access
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Capital Protection
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            <div className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-xl hover:-translate-y-2">
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  VIP Plan
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Vip Plan
                </h3>
              </div>
              <div className="mb-8">
                <div className="text-3xl font-black text-emerald-600">
                  40% Daily
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Duration: 6 Days
                </p>
              </div>
              <div className="mb-8 space-y-2">
                <p className="text-sm font-bold text-slate-900">
                  $25,000 &ndash; $200,000
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Investment Range
                </p>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Dedicated Manager
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  VIP Access
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Capital Protection
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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

          <div className="flex justify-center pt-8">
            <p className="text-xs text-slate-400 font-medium">
              Minimum capital requirement:{" "}
              <span className="text-slate-900 font-bold">$100 USD</span>
            </p>
          </div>
        </section>

        <ForexHeatMap />

        <section
          id="why-choose-us"
          className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white py-24 sm:py-32 transition-colors duration-300"
        >
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
                Operational Excellence
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                The Digital-trend Standard
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                We combine human expertise with institutional-grade technology
                to deliver superior investment outcomes for our global client
                base.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col group">
                  <dt className="text-xl font-bold leading-7 text-slate-900">
                    <div className="relative mb-8 h-72 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-emerald-200/50">
                      <Image
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800"
                        alt="Expert Advisory Team"
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    Expert Advisory Team
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">
                      Our advisors are industry veterans with decades of
                      experience navigating complex market cycles and global
                      economic shifts.
                    </p>
                  </dd>
                </div>

                <div className="flex flex-col group">
                  <dt className="text-xl font-bold leading-7 text-slate-900">
                    <div className="relative mb-8 h-72 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-emerald-200/50">
                      <Image
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                        alt="Data-Driven Insights"
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    Data-Driven Insights
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">
                      We leverage institutional-grade analytics and
                      high-frequency market data to identify asymmetric
                      risk-reward opportunities.
                    </p>
                  </dd>
                </div>

                <div className="flex flex-col group">
                  <dt className="text-xl font-bold leading-7 text-slate-900">
                    <div className="relative mb-8 h-72 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-emerald-200/50">
                      <Image
                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
                        alt="Global Security Standards"
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    Global Security Standards
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">
                      Your assets are protected by military-grade security
                      protocols and held with top-tier regulated global
                      custodians.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          id="community"
          className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-16 shadow-sm transition-colors duration-300"
        >
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 lg:aspect-auto lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                alt="Community of investors collaborating"
                fill
                className="object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                </span>
                Global Network
              </div>
              <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Join a Global Network of Investors
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Connect with a community of thousands building their financial
                future. Access exclusive insights, market signals, and strategic
                briefings.
              </p>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Expert Network
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Verified financial strategists and analysts.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 border border-sky-200">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Strategic Briefs
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Weekly macro updates and opportunity signals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/40 transition hover:bg-emerald-700"
                >
                  Join the Community
                </Link>
              </div>
            </div>
          </div>
        </section>

        <LiveTradeChart />

        <section
          id="faqs"
          className="rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-16 shadow-sm transition-colors duration-300"
        >
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div className="order-2 lg:order-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
                Support Center
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Common Inquiries
              </h2>
              <p className="mt-6 text-lg text-slate-500">
                Detailed insights into our operations and security protocols.
                For specific advisory, please{" "}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:underline"
                >
                  contact our team
                </Link>
                .
              </p>

              <div className="mt-12 space-y-10">
                <div className="group">
                  <h3 className="flex items-center gap-4 text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-600 border border-emerald-200">
                      01
                    </span>
                    Asset Custody & Security
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 pl-12 border-l border-slate-100 ml-4">
                    Client capital is held in segregated accounts with Tier-1
                    regulated custodians. We utilize multi-sig cold storage and
                    end-to-end encryption for all digital assets.
                  </p>
                </div>

                <div className="group">
                  <h3 className="flex items-center gap-4 text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-600 border border-emerald-200">
                      02
                    </span>
                    Fee Structure Transparency
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 pl-12 border-l border-slate-100 ml-4">
                    Our model is built on a performance-aligned advisory fee.
                    Zero hidden commissions, zero platform spreads. You receive
                    full disclosure on every transaction.
                  </p>
                </div>

                <div className="group">
                  <h3 className="flex items-center gap-4 text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-600 border border-emerald-200">
                      03
                    </span>
                    Liquidity & Withdrawals
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 pl-12 border-l border-slate-100 ml-4">
                    We maintain high liquidity across our core strategies.
                    Withdrawal requests are processed within standard T+1 or T+2
                    settlement periods, depending on the asset class.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 lg:aspect-auto lg:h-[600px] shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                  alt="Customer support team"
                  fill
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <div className="rounded-3xl border border-white/20 bg-white/80 p-6 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white"
                          >
                            <Image
                              fill
                              src={"https://i.pravatar.cc/150?u=" + i}
                              alt="Advisor"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          Dedicated Support
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          Global advisory available 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative overflow-hidden grid gap-16 rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-16 md:grid-cols-[1fr_1.2fr] transition-colors duration-300 group/contact"
        >
          {/* Section Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/julios.webp"
              alt="Contact Background"
              fill
              className="object-cover opacity-15 transition duration-700 group-hover/contact:scale-105"
            />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
              Get in Touch
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Start Your Journey
            </h2>
            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              Consult with a senior advisor to receive a comprehensive analysis
              and a custom investment proposal tailored to your unique
              objectives.
            </p>
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Email
                  </p>
                  <a
                    href="mailto:advisors@Digital-trend.com"
                    className="text-slate-900 font-bold hover:text-emerald-600 transition-colors"
                  >
                    advisors@Digital-trend.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Location
                  </p>
                  <p className="text-slate-900 font-bold">
                    Financial District, New York, NY
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-xl transition-colors duration-300">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Alex Morgan"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="alex@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Inquiry Type
                </label>
                <select
                  id="subject"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white appearance-none"
                >
                  <option>Wealth Management Advisory</option>
                  <option>Institutional Solutions</option>
                  <option>Alternative Assets Inquiries</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your investment goals..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-600 py-5 text-sm font-bold text-white shadow-xl shadow-emerald-600/40 transition hover:bg-emerald-700"
              >
                Send Proposal Request
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
