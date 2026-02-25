export default function WhatWeDoPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              What We Do
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Institutional-grade portfolio management tailored to individual
              investors.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-slate-300 sm:text-base">
              We design globally diversified portfolios across equities, fixed
              income, and alternative strategies, calibrated to your risk profile
              and time horizon. Every mandate includes a clear investment policy,
              disciplined risk controls, and an explicit review cadence.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Our team continuously monitors markets, policy changes, and
              structural trends to adjust exposures responsibly. Rather than
              chasing headlines, we focus on scenario analysis, valuation, and
              portfolio resilience under a wide range of outcomes.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Portfolio Construction
                </p>
                <p className="mt-2 text-sm">
                  Strategic and tactical allocations grounded in long-term capital
                  market assumptions and risk budgeting.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Ongoing Oversight
                </p>
                <p className="mt-2 text-sm">
                  Daily monitoring of risk exposures, drawdowns, and key
                  portfolio-level metrics with automated alerts.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Rebalancing &amp; Tax
                </p>
                <p className="mt-2 text-sm">
                  Systematic rebalancing and tax-aware implementation to keep your
                  portfolio aligned and efficient.
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Holistic Planning
                </p>
                <p className="mt-2 text-sm">
                  Integration of your accounts, cash needs, and long-term goals
                  into a single, cohesive plan.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Our Process
              </p>
              <ol className="mt-3 space-y-3 text-sm text-slate-200">
                <li>
                  <span className="font-semibold text-emerald-300">1. Discover</span>{" "}
                  – Understand your balance sheet, objectives, constraints, and
                  preferences.
                </li>
                <li>
                  <span className="font-semibold text-emerald-300">2. Design</span>{" "}
                  – Build a target portfolio that maps each allocation to a clear
                  role and risk budget.
                </li>
                <li>
                  <span className="font-semibold text-emerald-300">3. Deploy</span>{" "}
                  – Implement in a cost-conscious way using best-in-class vehicles
                  and custodians.
                </li>
                <li>
                  <span className="font-semibold text-emerald-300">4. Review</span>{" "}
                  – Revisit assumptions, progress, and changes in your life at an
                  agreed cadence.
                </li>
              </ol>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Transparency Built In
              </p>
              <p className="mt-3 text-sm text-slate-200">
                Every client receives a clear view of holdings, performance,
                contribution analysis, and fees through a modern online portal,
                supported by a dedicated advisory team who knows your story.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

