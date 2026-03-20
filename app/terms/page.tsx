export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Last updated: March 19, 2026
        </p>
        
        <div className="mt-12 space-y-10 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using Digital-trend&apos;s investment platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Investment Risks</h2>
            <p>
              All investments involve risk, including the possible loss of principal. Digital-trend provides institutional-grade management and research, but past performance is not indicative of future results. Clients are responsible for understanding their risk tolerance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Fees and Withdrawals</h2>
            <p>
              Advisory fees are charged as disclosed in your specific investment plan. Withdrawal requests are subject to standard settlement periods (T+1 or T+2) depending on the asset class and market liquidity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Regulatory Compliance</h2>
            <p>
              Digital-trend operates in accordance with applicable financial regulations. Users must provide accurate information for KYC (Know Your Customer) and AML (Anti-Money Laundering) verification purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
