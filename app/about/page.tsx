export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              About FutureInvest
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              A partner for every stage of your wealth journey.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-slate-300 sm:text-base">
              FutureInvest is an independent wealth management firm focused on
              building resilient portfolios for professionals, families, and
              entrepreneurs. Our team brings together experience across public
              markets, macro research, and risk management to help you make
              confident decisions in complex environments.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              We believe high-quality investing blends disciplined process,
              transparent communication, and a long-term mindset. Every
              relationship begins with a thorough understanding of your current
              situation, constraints, and aspirations before any recommendation is
              made.
            </p>
            <div className="mt-8 grid gap-6 text-sm text-slate-200 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Fiduciary Duty
                </p>
                <p className="mt-2 text-sm">
                  We are obligated to put your interests ahead of our own on every
                  decision.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Research-Driven
                </p>
                <p className="mt-2 text-sm">
                  Our investment committee blends macro, factor, and fundamental
                  perspectives.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Long-Term Aligned
                </p>
                <p className="mt-2 text-sm">
                  We focus on multi-year outcomes rather than short-term
                  speculation.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-sm text-slate-200">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Our Mission
              </p>
              <p className="mt-2">
                To empower investors with institutional-quality portfolios,
                thoughtful planning, and clear reporting, regardless of account
                size.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Our Clients
              </p>
              <p className="mt-2">
                We serve busy professionals, business owners, and families looking
                for a partner to navigate markets, not just a product provider.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Our Philosophy
              </p>
              <p className="mt-2">
                We believe in diversification, evidence-based investing, and
                measured risk-taking aligned to your goals and time horizon.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

