import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { LiveChatWidget } from "@/components/live-chat-widget";
import { TawkChat } from "@/components/tawk-chat";
import { FloatingTranslate } from "@/components/floating-translate";
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
          <SiteFooter />
          <LiveChatWidget />
          <TawkChat />
          <FloatingTranslate />
        </div>
      </body>
    </html>
  );
}
