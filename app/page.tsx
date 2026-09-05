import Link from "next/link";
import Image from "next/image";
import { CryptoTicker } from "@/components/crypto-ticker";
import { ForexHeatMap } from "@/components/forex-heatmap";
import { LiveTradeChart } from "@/components/live-trade-chart";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Globe2,
  Award,
  Zap,
  Sparkles,
  Building2,
  Lock,
  Headphones,
  LineChart,
  PieChart,
  Activity,
  RefreshCw,
  Send,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/digital.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Trusted by 50,000+ Investors Worldwide
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                Build Wealth with
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                  Institutional Precision.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400">
                A premium digital asset platform combining data-driven trading,
                diversified investment plans, and a robust referral matrix. Grow
                your capital with a fiduciary-standard partner built for serious
                investors.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:brightness-110 hover:-translate-y-0.5"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/plans"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-8 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  View Investment Plans
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="relative h-10 w-10 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800"
                    >
                      <Image
                        fill
                        src={`https://i.pravatar.cc/80?u=${i + 12}`}
                        alt="investor"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    <span className="text-slate-200 font-bold">4.9/5</span> from
                    3,200+ verified reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Preview Card (Dashboard teaser) */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-indigo-500/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/95 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Wallet className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Portfolio Snapshot
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Live · Updated 2s ago
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Profitable
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/10 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Total Account Balance
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-white tabular-nums">
                        $74,528.40
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs mb-1.5">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        +$3,284.17
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/5 bg-slate-900/70 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Total Earnings
                        </p>
                      </div>
                      <p className="text-lg font-bold text-white tabular-nums">
                        $18,204.55
                      </p>
                      <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                        +8.1% this month
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-slate-900/70 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Active Investments
                        </p>
                      </div>
                      <p className="text-lg font-bold text-white tabular-nums">
                        $42,300.00
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        3 plans active
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Asset Allocation
                      </p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Optimized
                      </span>
                    </div>
                    <div className="flex h-2.5 gap-1 rounded-full overflow-hidden bg-slate-800">
                      <div className="w-[52%] bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                      <div className="w-[23%] bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full" />
                      <div className="w-[15%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                      <div className="w-[10%] bg-slate-500 rounded-full" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 text-[10px]">
                      {[
                        { n: "Stocks", v: "52%", c: "bg-emerald-400" },
                        { n: "Crypto", v: "23%", c: "bg-indigo-400" },
                        { n: "Forex", v: "15%", c: "bg-amber-400" },
                        { n: "Cash", v: "10%", c: "bg-slate-500" },
                      ].map((a) => (
                        <div key={a.n} className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${a.c}`} />
                          <div>
                            <p className="text-slate-400 font-medium">{a.n}</p>
                            <p className="text-slate-200 font-bold">{a.v}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By Bar */}
          <div className="mt-24 pt-10 border-t border-white/5">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 mb-8">
              Regulated &amp; Secured By Industry Leaders
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70">
              {[
                "McAfee SECURE",
                "SSL Encrypted",
                "GDPR Compliant",
                "PCI DSS",
                "SOC 2 Type II",
              ].map((b) => (
                <div
                  key={b}
                  className="flex items-center justify-center h-8 text-sm font-bold text-slate-400 tracking-wider"
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CryptoTicker />

      {/* ============================= STATS ROW ============================= */}
      <section className="relative border-y border-white/5 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              {
                label: "Assets Under Management",
                value: "$750M+",
                icon: Building2,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
              },
              {
                label: "Active Investors",
                value: "50,000+",
                icon: Users,
                color: "text-sky-400",
                bg: "bg-sky-500/10",
                border: "border-sky-500/20",
              },
              {
                label: "Countries Served",
                value: "140+",
                icon: Globe2,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/20",
              },
              {
                label: "Avg. Monthly ROI",
                value: "18.4%",
                icon: Award,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
              },
            ].map((s) => (
              <div key={s.label} className="group">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} border ${s.border} mb-4`}
                >
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tight">
                  {s.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= FUTURE OF INVESTING ============================= */}
      <section id="about-video" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.1),_transparent_50%)]" />
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
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sky-400 mb-4">
              About TeveXtra Investments
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Experience the{" "}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Future of Investing
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed">
              See how{" "}
              <span className="font-semibold text-slate-200">
                TeveXtra Investments
              </span>{" "}
              is revolutionizing the digital asset landscape with cutting-edge
              technology and secure, fiduciary-standard strategies designed to
              build long-term generational wealth for every investor.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/25 via-indigo-500/15 to-blue-500/25 rounded-[2rem] blur-3xl" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 shadow-[0_50px_120px_-40px_rgba(56,189,248,0.3)] overflow-hidden ring-1 ring-white/5">
              <div className="relative w-full aspect-video bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
                <iframe
                  src="https://share.synthesia.io/embeds/videos/d25f8b1c-6174-4a64-a151-cb3ab5c40a35?loop=1&autoplay=1&muted=1&showTitle=0&skip_btn=1"
                  title="About TeveXtra Investments"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0 z-10"
                />
                <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />
              </div>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Institutional Heritage",
                desc: "Founded by Wall Street veterans, TeveXtra Investments brings institutional-grade trading infrastructure and risk management to every retail investor account.",
                color: "sky",
              },
              {
                icon: Shield,
                title: "Secured & Regulated",
                desc: "Segregated Tier-1 custodian accounts, multi-sig cold storage, 256-bit encryption, SOC 2 Type II certified infrastructure, and full GDPR + PCI compliance.",
                color: "emerald",
              },
              {
                icon: Sparkles,
                title: "Algorithmic Excellence",
                desc: "Our proprietary AI-powered trading engine executes 50,000+ trades per day with 87.3% win-rate, blending quantitative signals with human portfolio oversight.",
                color: "indigo",
              },
            ].map((card) => {
              const map: Record<
                string,
                { bg: string; border: string; text: string }
              > = {
                sky: {
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/20",
                  text: "text-sky-400",
                },
                emerald: {
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  text: "text-emerald-400",
                },
                indigo: {
                  bg: "bg-indigo-500/10",
                  border: "border-indigo-500/20",
                  text: "text-indigo-400",
                },
              };
              const c = map[card.color];
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur p-7 transition hover:bg-slate-900 hover:border-white/10 hover:-translate-y-0.5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} border ${c.border} mb-5`}
                  >
                    <card.icon className={`h-5.5 w-5.5 ${c.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================= CORE FEATURES ============================= */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
              Why Investors Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Everything You Need to
              <span className="text-emerald-400"> Grow Confidently</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed">
              From institutional-grade trading tools to tiered investment plans
              and a rewarding referral program — our platform is engineered to
              multiply your opportunity at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: LineChart,
                title: "Smart Investment Plans",
                desc: "4 tiered strategies from Basic ($200) to VIP ($200K+) with daily compounding returns and transparent performance.",
                color: "emerald",
              },
              {
                icon: BarChart3,
                title: "Live Trading Terminal",
                desc: "Trade 500+ instruments with a professional TradingView-powered interface. Real-time signals, 1-click execution.",
                color: "sky",
              },
              {
                icon: RefreshCw,
                title: "Referral Matrix Program",
                desc: "Earn up to 4% per referral + multi-level matrix rewards when your network grows. Track every commission live.",
                color: "indigo",
              },
              {
                icon: Shield,
                title: "Military-Grade Security",
                desc: "256-bit SSL encryption, 2FA authentication, multi-sig cold storage, and segregated accounts with Tier-1 custodians.",
                color: "rose",
              },
              {
                icon: Wallet,
                title: "Instant Deposits & Withdrawals",
                desc: "Fund via Bitcoin, Ethereum, USDT, or bank wire. Automated processing, approvals within 24 hours.",
                color: "amber",
              },
              {
                icon: PieChart,
                title: "Advanced Portfolio Analytics",
                desc: "Granular dashboards tracking earnings, investments, ROI, and referrals. Export reports in one click.",
                color: "teal",
              },
              {
                icon: Headphones,
                title: "24/7 Expert Support",
                desc: "Dedicated account managers, priority email and live chat assistance, plus personalized advisory for VIP clients.",
                color: "purple",
              },
              {
                icon: Sparkles,
                title: "Profit & Earnings Engine",
                desc: "Auto-distributed daily earnings to your balance with compounding reinvestment options across all plan tiers.",
                color: "orange",
              },
              {
                icon: Lock,
                title: "Fiduciary Transparency",
                desc: "No hidden fees, no surprise charges. Every cost and performance metric is fully auditable on your dashboard.",
                color: "blue",
              },
            ].map((f) => {
              const colorMap: Record<string, string> = {
                emerald:
                  "from-emerald-500/10 to-emerald-500/0 border-emerald-500/15 text-emerald-400",
                sky: "from-sky-500/10 to-sky-500/0 border-sky-500/15 text-sky-400",
                indigo:
                  "from-indigo-500/10 to-indigo-500/0 border-indigo-500/15 text-indigo-400",
                rose: "from-rose-500/10 to-rose-500/0 border-rose-500/15 text-rose-400",
                amber:
                  "from-amber-500/10 to-amber-500/0 border-amber-500/15 text-amber-400",
                teal: "from-teal-500/10 to-teal-500/0 border-teal-500/15 text-teal-400",
                purple:
                  "from-purple-500/10 to-purple-500/0 border-purple-500/15 text-purple-400",
                orange:
                  "from-orange-500/10 to-orange-500/0 border-orange-500/15 text-orange-400",
                blue: "from-blue-500/10 to-blue-500/0 border-blue-500/15 text-blue-400",
              };
              const cls = colorMap[f.color] || colorMap.emerald;
              const [bgGradient, borderCls, textCls] = [
                cls.split(" border")[0],
                "border" + cls.split("border")[1].split(" text")[0],
                "text" + cls.split(" text")[1],
              ];
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-white/5 bg-slate-900/50 p-7 transition-all duration-300 hover:bg-slate-900 hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.15)]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradient} ${borderCls} mb-5`}
                  >
                    <f.icon className={`h-5.5 w-5.5 ${textCls}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================= HOW IT WORKS ============================= */}
      <section
        id="how"
        className="relative border-y border-white/5 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
              Simple 3-Step Onboarding
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Start Earning in Under{" "}
              <span className="text-emerald-400">5 Minutes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Register with your name and email in 60 seconds. No KYC needed to start exploring.",
                icon: Users,
              },
              {
                step: "02",
                title: "Fund Your Wallet",
                desc: "Deposit starting at $200 via crypto or bank transfer. All deposits auto-confirm on-chain.",
                icon: ArrowDownLeft,
              },
              {
                step: "03",
                title: "Invest & Grow Daily",
                desc: "Pick a plan, monitor your dashboard, and withdraw profits at any time. Refer friends to earn 4% extra.",
                icon: TrendingUp,
              },
            ].map((s, idx) => (
              <div key={s.step} className="relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%_-_2px)] w-[calc(100%_-_40px)] h-px bg-gradient-to-r from-emerald-500/40 via-white/10 to-transparent" />
                )}
                <div className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-900/50 p-8 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <span className="text-5xl font-black text-white/5">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= INVESTMENT PLANS ============================= */}
      <section id="plans" className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
              Curated Investment Strategies
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Choose the Plan That{" "}
              <span className="text-emerald-400">Fits Your Goals</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed">
              Every plan is managed by our quantitative team with a strict
              fiduciary approach. Daily returns credited directly to your
              balance — compounded or withdrawn at your preference.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                name: "Basic Plan",
                tag: "Starter",
                roi: "8% Daily",
                duration: "1 Day",
                min: 200,
                max: 5000,
                features: [
                  "24/7 Priority Support",
                  "Secure Cold Storage",
                  "Instant Withdrawals",
                  "4% Referral Commission",
                ],
                cta: "Start with Basic",
                highlight: false,
                gradient: "from-emerald-500 to-teal-500",
                border: "border-emerald-500/20",
              },
              {
                name: "Silver Plan",
                tag: "Most Popular",
                roi: "18% Daily",
                duration: "2 Days",
                min: 5000,
                max: 20000,
                features: [
                  "Advanced Analytics Suite",
                  "Priority Processing Queue",
                  "Compound Reinvestment",
                  "Dedicated Support Line",
                  "4% Referral Commission",
                ],
                cta: "Choose Silver",
                highlight: true,
                gradient: "from-amber-500 to-orange-500",
                border: "border-amber-500/30",
              },
              {
                name: "Enterprise Plan",
                tag: "Advanced",
                roi: "25% Daily",
                duration: "4 Days",
                min: 10000,
                max: 30000,
                features: [
                  "Personal Account Manager",
                  "VIP Signal Subscription",
                  "Partial Capital Protection",
                  "Weekly Advisory Calls",
                  "4% Referral Commission",
                ],
                cta: "Go Enterprise",
                highlight: false,
                gradient: "from-violet-500 to-indigo-500",
                border: "border-violet-500/20",
              },
              {
                name: "VIP Plan",
                tag: "Exclusive",
                roi: "40% Daily",
                duration: "6 Days",
                min: 25000,
                max: 200000,
                features: [
                  "Private Wealth Manager",
                  "1-on-1 Trading Coaching",
                  "Full Capital Protection",
                  "White-Glove Onboarding",
                  "Custom Investment Mandate",
                ],
                cta: "Contact Sales",
                highlight: false,
                gradient: "from-rose-500 to-pink-500",
                border: "border-rose-500/20",
                isContact: true,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl flex flex-col ${
                  p.highlight
                    ? `border-2 ${p.border} bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 shadow-[0_30px_80px_-30px_rgba(245,158,11,0.35)] -mt-3`
                    : `border ${p.border} bg-slate-900/60`
                } p-7 transition-all duration-300 hover:-translate-y-1`}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
                    ⭐ {p.tag}
                  </div>
                )}
                {!p.highlight && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-5">
                    {p.tag}
                  </p>
                )}
                <div className={p.highlight ? "mt-3" : ""}>
                  <h3 className="text-2xl font-black text-white mb-1">
                    {p.name}
                  </h3>
                </div>
                <div className="mt-5 mb-6 pb-6 border-b border-white/5">
                  <div
                    className={`text-4xl font-black bg-gradient-to-r ${p.gradient} bg-clip-text text-transparent tabular-nums`}
                  >
                    {p.roi}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
                    Duration: {p.duration}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    Investment Range
                  </p>
                  <p className="text-sm font-bold text-slate-200 tabular-nums">
                    ${p.min.toLocaleString()} – ${p.max.toLocaleString()}
                  </p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {p.features.map((ft) => (
                    <li key={ft} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300 leading-relaxed">
                        {ft}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.isContact ? "/contact" : "/register"}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
                    p.highlight
                      ? `bg-gradient-to-r ${p.gradient} text-white shadow-lg hover:brightness-110`
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= LIVE MARKETS (ForexHeatMap + LiveTradeChart) ============================= */}
      <section className="border-y border-white/5 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 mb-6">
              <Activity className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
                Real-Time Market Data
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Professional-Grade Market{" "}
              <span className="text-sky-400">Intelligence</span>
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Institutional tools at retail pricing. Track every major currency
              pair, crypto asset, and equity index — right from your browser.
            </p>
          </div>
          <div className="space-y-10">
            <ForexHeatMap />
            <LiveTradeChart />
          </div>
        </div>
      </section>

      {/* ============================= REFERRAL / MATRIX CTA ============================= */}
      <section id="referral" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(99,102,241,0.15),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 to-emerald-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/95 p-7 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                      Referral &amp; Matrix Dashboard
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Earn up to 4% per referral + matrix levels
                    </p>
                  </div>
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      l: "Total Referrals",
                      v: "142",
                      c: "text-emerald-400",
                      i: Users,
                    },
                    {
                      l: "Active Matrix Slots",
                      v: "8 / 12",
                      c: "text-indigo-400",
                      i: PieChart,
                    },
                    {
                      l: "Commission Earned",
                      v: "$4,280",
                      c: "text-sky-400",
                      i: Wallet,
                    },
                    {
                      l: "Level Completion",
                      v: "67%",
                      c: "text-amber-400",
                      i: Zap,
                    },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-white/5 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <s.i className={`h-3.5 w-3.5 ${s.c}`} />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                          {s.l}
                        </p>
                      </div>
                      <p className="text-xl font-black text-white tabular-nums">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Referral Link
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition">
                      Copy
                    </button>
                  </div>
                  <div className="rounded-lg bg-slate-900 border border-white/5 px-4 py-3 font-mono text-xs text-slate-400 truncate">
                    https://tevextra.com/ref/johndoe42
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-indigo-400 mb-4">
                Invite &amp; Earn
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Grow Your Network,{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  Multiply Your Income
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-xl">
                Our proprietary Referral &amp; Matrix program rewards you at
                every level. Share your unique link with friends, family, or
                your audience and earn{" "}
                <span className="text-slate-200 font-semibold">
                  4% commission on every deposit
                </span>{" "}
                — forever.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    t: "4% Direct Referral Commission",
                    d: "Earn 4% instantly on every qualifying deposit your referrals make.",
                  },
                  {
                    t: "Multi-Level Matrix Rewards",
                    d: "Unlock tiered payouts as your referrals bring their own network in.",
                  },
                  {
                    t: "Auto-Paid, No Minimums",
                    d: "Commissions hit your wallet in real-time. Withdraw anytime, 24/7.",
                  },
                  {
                    t: "Premium Marketing Tools",
                    d: "Access banners, email templates, and social assets to scale fast.",
                  },
                ].map((item) => (
                  <div key={item.t} className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-emerald-500/10 border border-indigo-500/20 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.t}</p>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 transition hover:brightness-110"
                >
                  Get My Referral Link
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= TESTIMONIALS ============================= */}
      <section
        id="reviews"
        className="relative border-y border-white/5 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
              Client Success Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Trusted by Serious{" "}
              <span className="text-emerald-400">Investors</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Michael R.",
                role: "Real Estate Investor · Austin, TX",
                avatar: "https://i.pravatar.cc/120?img=12",
                quote:
                  "I moved a conservative portion of my real-estate equity into the Silver Plan 8 months ago. Returns have been consistent, and the dashboard is absolutely first-class. Best decision this cycle.",
                earnings: "+$42,850",
              },
              {
                name: "Amara K.",
                role: "Medical Professional · London, UK",
                avatar: "https://i.pravatar.cc/120?img=47",
                quote:
                  "As someone with zero time to trade, TeveXtra has been hands-off perfection. My VIP plan delivered my initial deposit back inside three months. The account manager is phenomenal.",
                earnings: "+£96,200",
              },
              {
                name: "David O.",
                role: "Software Engineer · Lagos, NG",
                avatar: "https://i.pravatar.cc/120?img=33",
                quote:
                  "I started Basic with $500 just to test. Six referrals later, my commissions alone exceed my deposit. The matrix payout structure is real — I've already withdrawn twice without issues.",
                earnings: "+₦14.2M",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="group relative rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/95 to-slate-900/50 p-7 transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-slate-300">
                  <span className="text-3xl font-black text-emerald-500/30 leading-none align-[-6px] mr-1">
                    “
                  </span>
                  {t.quote}
                  <span className="text-3xl font-black text-emerald-500/30 leading-none align-[-6px] ml-1">
                    ”
                  </span>
                </p>
                <div className="mt-7 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-emerald-500/20 bg-slate-800">
                      <Image
                        fill
                        src={t.avatar}
                        alt={t.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-[11px] font-black text-emerald-400 tabular-nums">
                    <ArrowUpRight className="h-3 w-3" />
                    {t.earnings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= FINAL CTA ============================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 p-10 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.25),_transparent_55%)]" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(16,185,129,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.8) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
                  Ready to Begin?
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]">
                  Your Financial Future
                  <span className="block text-emerald-300">Starts Today.</span>
                </h2>
                <p className="mt-6 text-lg text-slate-300/80 max-w-xl leading-relaxed">
                  Join 50,000+ serious investors growing their capital with
                  institutional-grade execution, transparent plans, and a
                  rewarding community. No credit card. No hidden fees.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/40 transition hover:brightness-110 hover:-translate-y-0.5"
                  >
                    Open Your Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Talk to an Advisor
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    No minimum lock-up
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Setup in &lt; 5 min
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col gap-4">
                {[
                  {
                    i: Clock,
                    t: "Setup in 5 Minutes",
                    d: "Register, verify email, deposit — you're investing.",
                  },
                  {
                    i: Zap,
                    t: "First Earnings in 24h",
                    d: "Daily returns credited automatically to your balance.",
                  },
                  {
                    i: Shield,
                    t: "Assets 100% Protected",
                    d: "Cold storage + insurance on custodial balances.",
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                        <c.i className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{c.t}</p>
                        <p className="text-sm text-slate-400 mt-1">{c.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= CONTACT ============================= */}
      <section id="contact" className="relative border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-400 mb-4">
                Contact Our Team
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Let&apos;s Build Your{" "}
                <span className="text-emerald-400">Plan Together</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Have questions about a strategy, account funding, or our VIP
                mandate? A senior advisor will respond within 4 business hours —
                no sales pitches, just clear answers.
              </p>

              <div className="mt-12 space-y-5">
                <a
                  href="mailto:helpdigitaltrend@gmail.com"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:border-white/10 transition"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Email Us
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      helpdigitaltrend@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/60">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Support Hours
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      24 / 7 · Priority for VIP clients
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/60">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Headquarters
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      Financial District, New York, NY · Global Operation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Morgan"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50 focus:bg-slate-950"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50 focus:bg-slate-950"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 010 2024"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50 focus:bg-slate-950"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Interested In
                  </label>
                  <select
                    id="subject"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-slate-950"
                  >
                    <option>General Inquiry</option>
                    <option>Opening an Account</option>
                    <option>Investment Plan Details</option>
                    <option>VIP / Enterprise Mandate</option>
                    <option>Referral Program</option>
                    <option>Support Issue</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="budget"
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                >
                  Planned Investment Size
                </label>
                <select
                  id="budget"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:bg-slate-950"
                >
                  <option>$200 – $5,000 (Basic)</option>
                  <option>$5,000 – $20,000 (Silver)</option>
                  <option>$10,000 – $30,000 (Enterprise)</option>
                  <option>$25,000+ (VIP · Contact Sales)</option>
                  <option>Just exploring for now</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your goals, timeline, and any questions we can answer..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500/50 focus:bg-slate-950 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition hover:brightness-110"
              >
                Send Message
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
