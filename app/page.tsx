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
          id="community"
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 p-8 sm:p-12"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-800 lg:aspect-auto lg:h-full">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                alt="Community of investors collaborating"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Growing Fast
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                Join Our Global Community
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                Connect with thousands of like-minded investors who are building
                their financial future. Get exclusive insights, market updates,
                and expert advice directly from our team.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 5.472m0 0a9.09 9.09 0 00-3.246 1.583m0 0a9.091 9.091 0 018.315-7.512M12 12.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-50">
                      Expert Network
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Access to verified financial advisors and market analysts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-50">
                      Live Discussions
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Weekly webinars and Q&A sessions with industry leaders.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <a
                  href="#register"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 hover:shadow-emerald-500/60"
                >
                  Join the Community
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faqs"
          className="rounded-3xl border border-white/5 bg-slate-950/60 p-8 sm:p-12"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-50">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Everything you need to know about investing with FutureInvest.
                Can&apos;t find the answer you&apos;re looking for?{" "}
                <a href="#contact" className="text-emerald-400 hover:underline">
                  Contact our team
                </a>
                .
              </p>

              <div className="mt-10 space-y-8">
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                      1
                    </span>
                    Is my money safe with FutureInvest?
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400 pl-9">
                    Client assets are held with regulated custodians in segregated
                    accounts. We implement multi-layer security controls on your
                    online portal and never use your assets for proprietary
                    trading.
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                      2
                    </span>
                    What fees do you charge?
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400 pl-9">
                    Our pricing is a transparent, all-in advisory fee based on
                    assets under management. There are no trading commissions or
                    hidden platform charges. You see the fee impact on every
                    report.
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                      3
                    </span>
                    Can I withdraw my money at any time?
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400 pl-9">
                    Yes. You can request withdrawals at any time, subject to
                    standard settlement periods for underlying securities. Your
                    advisor will help you plan liquidity so withdrawals align with
                    your goals.
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
                      4
                    </span>
                    Do you offer socially responsible investing options?
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400 pl-9">
                    We can design portfolios that reflect your ESG preferences,
                    excluding sectors or emphasizing themes that matter to you
                    while maintaining diversification.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-800 lg:aspect-auto lg:h-full">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
                  alt="Customer support team"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        <img
                          className="h-10 w-10 rounded-full border-2 border-slate-950"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
                          alt="User"
                        />
                        <img
                          className="h-10 w-10 rounded-full border-2 border-slate-950"
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64"
                          alt="User"
                        />
                        <img
                          className="h-10 w-10 rounded-full border-2 border-slate-950"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                          alt="User"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Still have questions?
                        </p>
                        <p className="text-xs text-slate-400">
                          Our team is ready to help 24/7
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

      </main>
    </div>
  );
}
