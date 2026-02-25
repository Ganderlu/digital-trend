export default function FaqsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
            Frequently Asked Questions
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Answers to common questions about how FutureInvest works.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            If you do not see your question here, our advisory team is happy to
            walk through any detail over a call or secure message. Transparency
            is central to how we work.
          </p>
          <div className="mt-8 space-y-6 divide-y divide-white/5">
            <div className="pt-3 first:pt-0">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                Is my money safe with FutureInvest?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Client assets are held with regulated third-party custodians in
                segregated accounts in your name. FutureInvest does not commingle
                assets and does not use your holdings for proprietary trading. We
                implement multi-factor authentication, encryption, and other
                controls to protect your online access.
              </p>
            </div>
            <div className="pt-3">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                What fees do you charge?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Our pricing is a transparent, all-in advisory fee based on assets
                under management. There are no trading commissions or hidden
                platform charges. You see the impact of fees on every performance
                report, and your advisor will review the structure with you
                before you fund your account.
              </p>
            </div>
            <div className="pt-3">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                Can I withdraw my money at any time?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Yes. You can request withdrawals at any time, subject to standard
                settlement periods for the underlying securities. Your advisor
                will help you plan liquidity so that withdrawal requests align
                with your portfolio strategy and tax considerations.
              </p>
            </div>
            <div className="pt-3">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                Do you offer socially responsible or ESG investing options?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Yes. We can incorporate environmental, social, and governance
                preferences directly into your portfolio design, including
                exclusions, tilts, and thematic allocations. We work with you to
                balance those preferences with diversification and risk
                management.
              </p>
            </div>
            <div className="pt-3">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                What is the minimum to get started?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Our standard minimum is $5,000, though institutional or bespoke
                mandates may require higher balances. Regardless of starting size,
                every client receives the same disciplined process and transparent
                reporting.
              </p>
            </div>
            <div className="pt-3">
              <h2 className="text-sm font-medium text-slate-100 sm:text-base">
                How often will I hear from my advisor?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                At minimum, we conduct a formal review at least annually, with
                additional check-ins during major life events or market changes.
                You can also schedule time with your advisor or send secure
                messages through the portal whenever questions arise.
              </p>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-slate-400">
            The information on this page is for informational purposes only and
            does not constitute personalized investment advice. Terms, conditions,
            and availability of services may vary by jurisdiction.
          </p>
        </section>
      </div>
    </div>
  );
}

