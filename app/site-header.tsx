"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const hiddenRoutes = [
    "/dashboard",
    "/deposit",
    "/withdraw",
    "/deposit-list",
    "/account-history",
    "/referrals",
    "/account-settings",
    "/security-settings",
    "/investment-plans",
    "/admin",
  ];

  if (hiddenRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <input
          id="site-nav-toggle"
          type="checkbox"
          className="peer hidden md:hidden"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/40">
              <span className="text-lg font-semibold text-emerald-300">FI</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-slate-50">
                FutureInvest
              </div>
              <div className="text-xs text-slate-400">
                Wealth Management &amp; Advisory
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="site-nav-toggle"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-50 md:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-slate-100" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-100" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-100" />
              </span>
            </label>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
              <Link href="/about" className="transition hover:text-emerald-300">
                About Us
              </Link>
              <Link
                href="/what-we-do"
                className="transition hover:text-emerald-300"
              >
                What We Do
              </Link>
              <Link href="/plans" className="transition hover:text-emerald-300">
                Plans
              </Link>
              <Link href="/faqs" className="transition hover:text-emerald-300">
                FAQs
              </Link>
              <Link
                href="/contact"
                className="transition hover:text-emerald-300"
              >
                Contact Us
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-emerald-300/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
              >
                Account Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-3 hidden flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-sm font-medium text-slate-200 peer-checked:flex md:hidden">
          <Link
            href="/about"
            className="rounded-xl px-3 py-2 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            About Us
          </Link>
          <Link
            href="/what-we-do"
            className="rounded-xl px-3 py-2 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            What We Do
          </Link>
          <Link
            href="/plans"
            className="rounded-xl px-3 py-2 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            Plans
          </Link>
          <Link
            href="/faqs"
            className="rounded-xl px-3 py-2 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className="rounded-xl px-3 py-2 transition hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="mt-1 rounded-full border border-emerald-300/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-400/10"
          >
            Account Login
          </Link>
          <Link
            href="/register"
            className="mt-1 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
