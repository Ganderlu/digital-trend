import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Plans | Basic, Silver, Enterprise & VIP Tiers",
  description:
    "Compare TeveXtra investment plans from Basic ($200) to VIP ($100K+). Each plan features transparent terms, daily earnings credit, referral bonuses, and institutional-grade security.",
  alternates: {
    canonical: "/plans",
  },
  openGraph: {
    title: "Investment Plans | Basic, Silver, Enterprise & VIP Tiers",
    description:
      "Compare TeveXtra investment plans from Basic ($200) to VIP ($100K+). Each plan features transparent terms, daily earnings credit, referral bonuses, and institutional-grade security.",
    url: "https://www.tevextra.com/plans",
    type: "website",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra Investment Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Plans | Basic, Silver, Enterprise & VIP Tiers",
    description:
      "Compare TeveXtra investment plans from Basic ($200) to VIP ($100K+). Each plan features transparent terms, daily earnings credit, referral bonuses, and institutional-grade security.",
    images: ["/images/tx.png"],
  },
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
