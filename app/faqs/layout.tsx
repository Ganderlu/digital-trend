import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | TeveXtra Support",
  description:
    "Find answers to common questions about TeveXtra: account security, fees, withdrawals, minimum deposits, ESG investing options, and how to contact our 24/7 support team.",
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    title: "Frequently Asked Questions | TeveXtra Support",
    description:
      "Find answers to common questions about TeveXtra: account security, fees, withdrawals, minimum deposits, ESG investing options, and how to contact our 24/7 support team.",
    url: "https://www.tevextra.com/faqs",
    type: "website",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra FAQs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | TeveXtra Support",
    description:
      "Find answers to common questions about TeveXtra: account security, fees, withdrawals, minimum deposits, ESG investing options, and how to contact our 24/7 support team.",
    images: ["/images/tx.png"],
  },
};

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
