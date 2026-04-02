"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-emerald-500/40">
              <Image
                src="/images/trend.jpeg"
                alt="Digital-trend"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Digital-trend
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            About Us
          </Link>
          <Link
            href="/plans"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            Plans
          </Link>
          <Link
            href="/what-we-do"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            What we do
          </Link>
          <Link
            href="/faqs"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            Contact
          </Link>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button & Quick Actions */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
          <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-emerald-500/40">
                  <Image
                    src="/images/trend.jpeg"
                    alt="Digital-trend"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-cover"
                    priority
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Digital-trend
                </span>
              </Link>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="flex flex-col gap-6">
                <Link
                  href="/about"
                  className="text-lg font-bold text-slate-900"
                >
                  About Us
                </Link>
                <Link
                  href="/plans"
                  className="text-lg font-bold text-slate-900"
                >
                  Plans
                </Link>
                <Link
                  href="/what-we-do"
                  className="text-lg font-bold text-slate-900"
                >
                  What we do
                </Link>
                <Link href="/faqs" className="text-lg font-bold text-slate-900">
                  FAQs
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-bold text-slate-900"
                >
                  Contact
                </Link>
                <hr className="border-slate-200" />
                <div className="flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 font-bold text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex h-14 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white transition hover:bg-emerald-500"
                  >
                    Get Started
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
