export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="grid gap-10 rounded-3xl border border-white/5 bg-slate-950/70 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              Contact Us
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Speak with a FutureInvest advisor.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Whether you are just starting to invest or looking to refine an
              existing strategy, our team is available to discuss your objectives,
              constraints, and questions. Share a few details and we will connect
              you with the right advisor.
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
              <p className="text-xs text-slate-400">
                Calls may be recorded for training, monitoring, and regulatory
                purposes.
              </p>
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
                  rows={4}
                  placeholder="Share a bit about your current situation and questions..."
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
              This form is for informational purposes only and does not constitute
              investment advice or an offer to buy or sell securities.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

