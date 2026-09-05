"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-[99999] border-b border-white/10 bg-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-1 ring-emerald-500/30">
              <Image
                src="/images/trend.jpeg"
                alt="TeveXtra"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TeveXtra
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            About Us
          </Link>
          <Link
            href="/plans"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            Plans
          </Link>
          <Link
            href="/what-we-do"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            What we do
          </Link>
          <Link
            href="/faqs"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            Contact
          </Link>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-emerald-500/30"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button & Quick Actions */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-emerald-500/30"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
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
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-1 ring-emerald-500/30">
                  <Image
                    src="/images/trend.jpeg"
                    alt="TeveXtra"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-cover"
                    priority
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  TeveXtra
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-emerald-500/30"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="flex flex-col gap-6">
                <Link href="/about" className="text-lg font-bold text-white">
                  About Us
                </Link>
                <Link href="/plans" className="text-lg font-bold text-white">
                  Plans
                </Link>
                <Link
                  href="/what-we-do"
                  className="text-lg font-bold text-white"
                >
                  What we do
                </Link>
                <Link href="/faqs" className="text-lg font-bold text-white">
                  FAQs
                </Link>
                <Link href="/contact" className="text-lg font-bold text-white">
                  Contact
                </Link>
                <hr className="border-white/10" />
                <div className="flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 font-bold text-white hover:bg-white/5 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:brightness-110"
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
