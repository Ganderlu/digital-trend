import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { PublicChrome } from "@/components/public-chrome";
import { InvestmentNotification } from "@/components/investment-notification";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.setAttribute('data-theme', 'dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} antialiased transition-colors duration-300`}
        style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <LanguageProvider />
        <PublicChrome>{children}</PublicChrome>
        <InvestmentNotification />
      </body>
    </html>
  );
}
