import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { PublicChrome } from "@/components/public-chrome";
import { InvestmentNotification } from "@/components/investment-notification";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageProvider as KeyedLanguageProvider } from "@/components/language-context";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const PRODUCTION_URL = "https://tevextra.com";

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_URL),
  title: {
    default: "TeveXtra · Premium Investment Platform",
    template: "%s · TeveXtra",
  },
  description:
    "TeveXtra is a modern investment platform with transparent plans, a rewarding referral program, and secure account access — designed to help you grow and manage your wealth strategically.",
  applicationName: "TeveXtra",
  keywords: [
    "TeveXtra",
    "investment platform",
    "passive income",
    "referral program",
    "wealth management",
    "secure investments",
    "portfolio growth",
  ],
  authors: [{ name: "TeveXtra", url: PRODUCTION_URL }],
  creator: "TeveXtra",
  publisher: "TeveXtra",
  category: "Finance",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "any" },
      {
        url: "/images/tx.png",
        rel: "icon",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: ["/icon.png"],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "any" }],
    other: [
      {
        rel: "mask-icon",
        url: "/images/tx.png",
        color: "#059669",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PRODUCTION_URL,
    siteName: "TeveXtra",
    title: "TeveXtra · Premium Investment Platform",
    description:
      "Smart investing, transparent plans, and rewarding referrals. Grow and manage your wealth strategically with TeveXtra.",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TeveXtra · Premium Investment Platform",
    description:
      "Smart investing, transparent plans, and rewarding referrals. Grow and manage your wealth strategically with TeveXtra.",
    creator: "@tevextra",
    images: ["/images/tx.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const FAVICON_VERSION = "v=tevextra-tx-logo-v20260927";
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
        <link
          key="favicon-shortcut"
          rel="shortcut icon"
          href={`/favicon.png?${FAVICON_VERSION}`}
          type="image/png"
        />
        <link
          key="favicon-ico"
          rel="icon"
          href={`/favicon.ico?${FAVICON_VERSION}`}
          type="image/x-icon"
        />
        <link
          key="favicon-icon-32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/icon.png?${FAVICON_VERSION}`}
        />
        <link
          key="favicon-icon-128"
          rel="icon"
          type="image/png"
          sizes="128x128"
          href={`/images/tx.png?${FAVICON_VERSION}`}
        />
        <link
          key="favicon-apple"
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href={`/apple-icon.png?${FAVICON_VERSION}`}
        />
        <link
          key="favicon-mask"
          rel="mask-icon"
          href={`/images/tx.png?${FAVICON_VERSION}`}
          color="#059669"
        />
      </head>
      <body
        className={`${poppins.variable} antialiased transition-colors duration-300`}
        style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <KeyedLanguageProvider>
          <LanguageProvider />
          <PublicChrome>{children}</PublicChrome>
          <InvestmentNotification />
        </KeyedLanguageProvider>
      </body>
    </html>
  );
}
