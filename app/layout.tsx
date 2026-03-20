import type { Metadata } from "next";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { FloatingTranslate } from "@/components/floating-translate";
import { InvestmentNotification } from "@/components/investment-notification";
import "./globals.css";

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
        className="antialiased bg-white text-slate-900"
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <FloatingTranslate />
          <InvestmentNotification />
        </div>
      </body>
    </html>
  );
}
