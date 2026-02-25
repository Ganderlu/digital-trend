import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "./site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Investment Platform",
  description:
    "A modern investment platform with tailored plans, insights, and secure account access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-6 text-xs text-slate-500">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
              <p>
                © {new Date().getFullYear()} FutureInvest. All rights reserved.
              </p>
              <div className="flex gap-4">
                <span>Regulated investment advisory firm.</span>
                <span>Disclosures available upon request.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
