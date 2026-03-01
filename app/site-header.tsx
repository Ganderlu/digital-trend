"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import GoogleTranslate from "@/components/google-translate";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/40">
              <span className="text-lg font-bold text-emerald-300">FI</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-100">
              FutureInvest
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            About Us
          </Link>
          <Link
            href="/plans"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            Plans
          </Link>
          <Link
            href="/what-we-do"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            What we do
          </Link>
          <Link
            href="/faqs"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            Contact
          </Link>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button & Quick Actions */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <Link
            href="/login"
            className="text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/40 transition hover:bg-emerald-500 hover:text-slate-950"
          >
            Register
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-100"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Menu */}
      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/40">
                  <span className="text-lg font-bold text-emerald-300">FI</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-100">
                  FutureInvest
                </span>
              </Link>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-100"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                  <Link
                    href="/about"
                    className="text-lg font-medium text-slate-300 hover:text-emerald-400"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/plans"
                    className="text-lg font-medium text-slate-300 hover:text-emerald-400"
                  >
                    Plans
                  </Link>
                  <Link
                    href="/what-we-do"
                    className="text-lg font-medium text-slate-300 hover:text-emerald-400"
                  >
                    What we do
                  </Link>
                  <Link
                    href="/faqs"
                    className="text-lg font-medium text-slate-300 hover:text-emerald-400"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium text-slate-300 hover:text-emerald-400"
                  >
                    Contact Us
                  </Link>
                </div>
                <div className="flex flex-col gap-4 pt-4">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 py-3 text-base font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-500 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Create Account
                  </Link>
                </div>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
