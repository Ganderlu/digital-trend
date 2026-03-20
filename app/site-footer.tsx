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
    <footer className="bg-[#f0f9f4] pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                <span className="text-lg font-bold text-white">DT</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Digital-trend
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">
              Your trusted partner in institutional-grade wealth management. We combine data-driven insights with human expertise to build resilient portfolios for the future.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 transition-colors hover:text-emerald-600 flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do"
                  className="text-sm text-slate-600 transition-colors hover:text-emerald-600 flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                  What We Do
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-sm text-slate-600 transition-colors hover:text-emerald-600 flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                  Investment Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-slate-600 transition-colors hover:text-emerald-600 flex items-center gap-2 group"
                >
                  <ArrowRight size={14} className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" />
                  Common FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Contact
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Financial District, New York, NY 10005, USA</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={18} className="text-emerald-600 shrink-0" />
                <a href="mailto:advisors@Digital-trend.com" className="hover:text-emerald-600 transition-colors">
                  advisors@Digital-trend.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={18} className="text-emerald-600 shrink-0" />
                <span>+1 (555) 012-9876</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Newsletter
            </h3>
            <p className="mt-6 text-sm text-slate-600">
              Get the latest market updates and investment insights.
            </p>
            <form className="mt-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-200 pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Digital-trend Investment. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
