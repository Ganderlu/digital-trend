import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-24 px-6 py-16 md:py-24">
        <section className="grid items-center gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              Premium Investment Solutions
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Grow and protect your wealth with confidence.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-slate-300 sm:text-base">
              FutureInvest combines institutional-grade research, disciplined
              risk management, and a human advisory team to help you reach your
              financial goals&mdash;from your first investment to long-term
              wealth preservation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/plans"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
              >
                Explore Plans
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200"
              >
                Talk to an Advisor
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-xs text-slate-300 sm:text-sm md:flex md:flex-wrap">
              <div>
                <div className="text-lg font-semibold text-emerald-300">
                  12+
                </div>
                <div className="text-slate-400">Years of market experience</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-300">
                  $750M+
                </div>
                <div className="text-slate-400">Assets under advisory</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-300">
                  4.9/5
                </div>
                <div className="text-slate-400">
                  Average client satisfaction
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-[0_0_60px_rgba(16,185,129,0.12)] sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-300/80">
                  Portfolio Snapshot
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Balanced Growth Strategy
                </p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Risk Level: Moderate
              </span>
            </div>
            <div className="mt-6 h-32 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-emerald-400/40 to-sky-400/40">
              <div className="flex h-full items-end justify-between px-3 pb-3">
                <div className="h-10 w-6 rounded-full bg-emerald-500/70" />
                <div className="h-16 w-6 rounded-full bg-emerald-400" />
                <div className="h-7 w-6 rounded-full bg-sky-400/80" />
                <div className="h-20 w-6 rounded-full bg-emerald-300" />
                <div className="h-12 w-6 rounded-full bg-slate-100/80" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-200">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Annualized Return
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    Last 5 years
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-emerald-300">
                  9.4%
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Volatility
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    vs. benchmark
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-emerald-300">
                  -18%
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              Past performance is not indicative of future results. Figures are
              hypothetical and for illustrative purposes only.
            </p>
          </div>
        </section>

        <section
          id="about"
          className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/60 p-6 sm:p-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              About Us
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              FutureInvest is an independent wealth management firm dedicated to
              helping professionals, families, and entrepreneurs build resilient
              portfolios. Our investment committee blends macro research, factor
              analysis, and risk modeling to craft strategies tailored to your
              objectives and time horizon.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              From diversified core portfolios to thematic strategies, we align
              every recommendation with a clear financial plan, transparent fee
              structure, and ongoing communication.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Regulated &amp; Transparent
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Independent advisors operating under a strict fiduciary standard
                with clear reporting.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Human + Technology
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Robust analytics platform enhanced by a dedicated advisory team
                that knows your goals.
              </p>
            </div>
          </div>
        </section>

        <section
          id="what-we-do"
          className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/60 p-6 sm:p-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              What We Do
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              We design diversified portfolios across public equities, fixed
              income, and alternative assets, aligned with your risk profile and
              long-term aspirations. Every portfolio is continuously monitored
              and rebalanced as markets, rates, and your life circumstances
              evolve.
            </p>
            <div className="mt-6 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Personalized Portfolios
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  Goal-based strategies for wealth building, income, and capital
                  preservation.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Ongoing Advisory
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  Dedicated advisors who review your plan and portfolio with you
                  regularly.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Smart Risk Controls
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  Scenario analysis, stress testing, and disciplined
                  diversification at the portfolio level.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Transparent Reporting
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  Clear dashboards, performance insights, and consolidated
                  statements in one portal.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Why Clients Choose Us
              </p>
              <p className="mt-3 text-sm text-slate-300">
                We focus on risk-adjusted outcomes, not speculation. Our
                approach is built for disciplined, long-term investors.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  Institutional-grade research accessible to individual
                  investors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Aligned incentives: we succeed when you do.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  Clear, transparent fee structures with no hidden charges.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section id="plans" className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Investment Plans
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Choose a plan aligned with your time horizon and risk appetite.
                All plans benefit from active oversight and downside protection
                frameworks.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Minimum starting balance:{" "}
              <span className="font-semibold text-slate-200">$5,000</span>
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-3xl border border-white/5 bg-slate-950/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Starter
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Core Growth
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A diversified, low-cost portfolio designed for new investors
                building long-term wealth.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                6&ndash;8% p.a.
              </div>
              <p className="text-xs text-slate-400">
                Targeted long-term return
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Global equity ETFs</li>
                <li>Investment-grade bonds</li>
                <li>Automatic rebalancing</li>
              </ul>
              <a
                href="#register"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-emerald-400/60 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
              >
                Get Started
              </a>
            </div>
            <div className="flex flex-col rounded-3xl border border-emerald-400/70 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-slate-950/80 p-6 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Most Popular
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                Strategic Balanced
              </h3>
              <p className="mt-2 text-sm text-slate-200">
                A balanced allocation for investors seeking a blend of growth
                and capital stability.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                7&ndash;10% p.a.
              </div>
              <p className="text-xs text-slate-200">
                Targeted long-term return with risk controls
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                <li>Blend of global equities &amp; fixed income</li>
                <li>Dynamic risk management overlays</li>
                <li>Quarterly portfolio reviews</li>
              </ul>
              <a
                href="#register"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
              >
                Choose Plan
              </a>
            </div>
            <div className="flex flex-col rounded-3xl border border-white/5 bg-slate-950/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Advanced
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-50">
                High Conviction
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                A concentrated portfolio for sophisticated investors comfortable
                with higher volatility.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                10%+ p.a.
              </div>
              <p className="text-xs text-slate-400">
                Targeted long-term return with elevated risk
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Sector &amp; thematic opportunities</li>
                <li>Active risk budgeting</li>
                <li>Dedicated advisor check-ins</li>
              </ul>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-200"
              >
                Book a Call
              </a>
            </div>
          </div>
        </section>

        <section
          id="faqs"
          className="rounded-3xl border border-white/5 bg-slate-950/60 p-6 sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            FAQs
          </h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Quick answers to common questions about how FutureInvest works.
          </p>
          <div className="mt-6 space-y-5 divide-y divide-white/5">
            <div className="pt-3 first:pt-0">
              <p className="text-sm font-medium text-slate-100 sm:text-base">
                Is my money safe with FutureInvest?
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Client assets are held with regulated custodians in segregated
                accounts. We implement multi-layer security controls on your
                online portal and never use your assets for proprietary trading.
              </p>
            </div>
            <div className="pt-3">
              <p className="text-sm font-medium text-slate-100 sm:text-base">
                What fees do you charge?
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Our pricing is a transparent, all-in advisory fee based on
                assets under management. There are no trading commissions or
                hidden platform charges. You see the fee impact on every report.
              </p>
            </div>
            <div className="pt-3">
              <p className="text-sm font-medium text-slate-100 sm:text-base">
                Can I withdraw my money at any time?
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Yes. You can request withdrawals at any time, subject to
                standard settlement periods for underlying securities. Your
                advisor will help you plan liquidity so withdrawals align with
                your goals.
              </p>
            </div>
            <div className="pt-3">
              <p className="text-sm font-medium text-slate-100 sm:text-base">
                Do you offer socially responsible investing options?
              </p>
              <p className="mt-2 text-sm text-slate-300">
                We can design portfolios that reflect your ESG preferences,
                excluding sectors or emphasizing themes that matter to you while
                maintaining diversification.
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/60 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Contact Us
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Share a few details and a dedicated advisor will reach out with a
              tailored proposal based on your objectives.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>
                Email:{" "}
                <a
                  href="mailto:advisors@futureinvest.com"
                  className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                >
                  advisors@futureinvest.com
                </a>
              </p>
              <p>Phone: +1 (555) 012-9876</p>
              <p>Office: 21st Floor, Financial District, New York, NY</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Quick Contact
            </p>
            <form className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-200"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Morgan"
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="goal"
                  className="text-xs font-medium text-slate-200"
                >
                  Primary Goal
                </label>
                <select
                  id="goal"
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 focus:border-emerald-400 focus:ring-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="build-wealth">Build long-term wealth</option>
                  <option value="retirement">Plan for retirement</option>
                  <option value="preserve-capital">
                    Preserve capital with lower risk
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="text-xs font-medium text-slate-200"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Share a bit about your current situation..."
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
              >
                Request a Call
              </button>
            </form>
            <p className="mt-3 text-[11px] text-slate-400">
              This form is for informational purposes only and does not
              constitute investment advice or an offer to buy or sell
              securities.
            </p>
          </div>
        </section>

        <section
          id="login"
          className="grid gap-8 rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10 md:grid-cols-2"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Account Login
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Access your personalized dashboard to monitor performance, review
              statements, and manage your funding preferences.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-600 bg-slate-900/80 p-6">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="text-xs font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-400 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
              >
                Sign In
              </button>
            </form>
          </div>
        </section>

        <section
          id="register"
          className="grid gap-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-slate-950/80 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Open Your Account
            </h2>
            <p className="mt-2 text-sm text-slate-200 sm:text-base">
              Create a FutureInvest account in minutes. Answer a few questions
              about your investment horizon and risk profile, and we will
              propose a tailored portfolio.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              <li>Digital onboarding with secure identity verification</li>
              <li>Connect your bank for seamless funding</li>
              <li>Update preferences anytime from your dashboard</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/70 p-6">
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-first-name"
                    className="text-xs font-medium text-slate-200"
                  >
                    First Name
                  </label>
                  <input
                    id="register-first-name"
                    type="text"
                    placeholder="Alex"
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-last-name"
                    className="text-xs font-medium text-slate-200"
                  >
                    Last Name
                  </label>
                  <input
                    id="register-last-name"
                    type="text"
                    placeholder="Morgan"
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-password"
                    className="text-xs font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-goal"
                    className="text-xs font-medium text-slate-200"
                  >
                    Investment Goal
                  </label>
                  <select
                    id="register-goal"
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 focus:border-emerald-400 focus:ring-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="build-wealth">Build long-term wealth</option>
                    <option value="retirement">Plan for retirement</option>
                    <option value="income">Generate income</option>
                    <option value="preserve-capital">
                      Preserve capital with lower risk
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-400 focus:ring-0"
                />
                <label htmlFor="terms">
                  I confirm that I have read and agree to the platform&apos;s
                  terms, disclosures, and privacy policy.
                </label>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
