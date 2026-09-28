import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How TeveXtra Protects Your Data",
  description:
    "Read the TeveXtra Privacy Policy to understand how we collect, use, and protect your personal and financial information with industry-leading security measures.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | How TeveXtra Protects Your Data",
    description:
      "Read the TeveXtra Privacy Policy to understand how we collect, use, and protect your personal and financial information with industry-leading security measures.",
    url: "https://www.tevextra.com/privacy",
    type: "article",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | How TeveXtra Protects Your Data",
    description:
      "Read the TeveXtra Privacy Policy to understand how we collect, use, and protect your personal and financial information with industry-leading security measures.",
    images: ["/images/tx.png"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
