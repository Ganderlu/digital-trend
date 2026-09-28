import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TeveXtra Platform Agreement",
  description:
    "Review the TeveXtra Terms of Service including investment risk disclosures, account responsibilities, fee schedules, and regulatory compliance requirements.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | TeveXtra Platform Agreement",
    description:
      "Review the TeveXtra Terms of Service including investment risk disclosures, account responsibilities, fee schedules, and regulatory compliance requirements.",
    url: "https://www.tevextra.com/terms",
    type: "article",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | TeveXtra Platform Agreement",
    description:
      "Review the TeveXtra Terms of Service including investment risk disclosures, account responsibilities, fee schedules, and regulatory compliance requirements.",
    images: ["/images/tx.png"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
