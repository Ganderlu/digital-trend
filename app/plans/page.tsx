export default function PlansPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="space-y-6 rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                Investment Plans
              </p>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                Plans aligned with your goals, time horizon, and risk appetite.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Each FutureInvest plan is built on the same disciplined research
                framework, then calibrated for different levels of risk and
                complexity. You can begin with a simpler allocation and graduate
                to more advanced strategies as your comfort and capital grow.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Minimum starting balance:{" "}
              <span className="font-semibold text-slate-200">$5,000</span>
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-3xl border border-white/5 bg-slate-950/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Starter
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-50">
                Core Growth
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                A diversified, low-cost portfolio designed for new investors
                building long-term wealth through broad market exposure.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                6&ndash;8% p.a.
              </div>
              <p className="text-xs text-slate-400">Targeted long-term return</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Global equity index exposure</li>
                <li>Investment-grade bonds</li>
                <li>Automatic rebalancing and cash management</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Ideal for investors with a 5+ year horizon seeking a disciplined
                introduction to markets.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl border border-emerald-400/70 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-slate-950/80 p-6 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Most Popular
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-50">
                Strategic Balanced
              </h2>
              <p className="mt-2 text-sm text-slate-100">
                A balanced allocation for investors seeking a blend of growth and
                capital stability with robust risk controls.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-200">
                7&ndash;10% p.a.
              </div>
              <p className="text-xs text-slate-100">
                Targeted long-term return with risk management overlays
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                <li>Core global equity and fixed income mix</li>
                <li>Dynamic tilts based on valuations and macro signals</li>
                <li>Quarterly portfolio and planning reviews</li>
              </ul>
              <p className="mt-4 text-xs text-slate-200">
                Well-suited for investors balancing growth objectives with
                drawdown sensitivity and income needs.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl border border-white/5 bg-slate-950/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Advanced
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-50">
                High Conviction
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                A concentrated portfolio for sophisticated investors comfortable
                with higher volatility in pursuit of excess returns.
              </p>
              <div className="mt-4 text-2xl font-semibold text-emerald-300">
                10%+ p.a.
              </div>
              <p className="text-xs text-slate-400">
                Targeted long-term return with elevated risk
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Focused sector and thematic exposures</li>
                <li>Active risk budgeting and downside guardrails</li>
                <li>Dedicated advisor check-ins and scenario analysis</li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Best for investors with meaningful experience and a long horizon
                who understand the trade-off between volatility and opportunity.
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            Return ranges are illustrative and not guaranteed. Actual outcomes
            will depend on market conditions, funding decisions, and individual
            circumstances. Past performance is not indicative of future results.  
          </p>
        </section>
      </div>
    </div>
  );
}

