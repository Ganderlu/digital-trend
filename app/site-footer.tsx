"use client";

import Link from "next/link";
import Image from "next/image";
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
    <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <Image
                  src="/images/trend.jpeg"
                  alt="TeveXtra"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TeveXtra
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-slate-400">
              Your trusted partner in institutional-grade wealth management. We
              combine data-driven insights with human expertise to build
              resilient portfolios for the future.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all hover:bg-emerald-500 hover:text-white hover:ring-emerald-500/30"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all hover:bg-emerald-500 hover:text-white hover:ring-emerald-500/30"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all hover:bg-emerald-500 hover:text-white hover:ring-emerald-500/30"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all hover:bg-emerald-500 hover:text-white hover:ring-emerald-500/30"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0"
                  />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-do"
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0"
                  />
                  What We Do
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0"
                  />
                  Investment Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400 flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={14}
                    className="opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0"
                  />
                  Common FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin
                  size={18}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <span>Financial District, New York, NY 10005, USA</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={18} className="text-emerald-400 shrink-0" />
                <a
                  href="mailto:helpdigitaltrend@gmail.com"
                  className="hover:text-emerald-400 transition-colors"
                >
                  helpdigitaltrend@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={18} className="text-emerald-400 shrink-0" />
                <span>+1 (555) 012-9876</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="mt-6 text-sm text-slate-400">
              Get the latest market updates and investment insights.
            </p>
            <form className="mt-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-colors hover:brightness-110"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} TeveXtra Investment. All rights
            reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
