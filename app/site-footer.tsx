"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export function SiteFooter() {
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
    <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/40">
                <span className="text-lg font-bold text-emerald-300">FI</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-100">
                FutureInvest
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering investors with professional tools, expert insights, and
              secure portfolio management strategies for long-term growth.
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-100">
                Subscribe to our newsletter
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Get the latest market updates and investment tips.
              </p>
              <form className="mt-3 flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Company</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/what-we-do"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    What We Do
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Investment Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Resources
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/faqs"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Market Insights
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-slate-100">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>21st Floor, Financial District, New York, NY</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>+1 (555) 012-9876</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-500" />
                  <a
                    href="mailto:support@futureinvest.com"
                    className="hover:text-emerald-400"
                  >
                    support@futureinvest.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} FutureInvest. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-600">
            <p>Regulated investment advisory firm.</p>
            <p>Disclosures available upon request.</p>
            <p>Past performance does not guarantee future results.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
