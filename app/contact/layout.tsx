import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get Support & Advisor Consultations",
  description:
    "Contact TeveXtra for support, account questions, or a complimentary advisory consultation. Reach us by email, phone, or live chat — our team responds within 24 business hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Get Support & Advisor Consultations",
    description:
      "Contact TeveXtra for support, account questions, or a complimentary advisory consultation. Reach us by email, phone, or live chat — our team responds within 24 business hours.",
    url: "https://www.tevextra.com/contact",
    type: "website",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "Contact TeveXtra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Get Support & Advisor Consultations",
    description:
      "Contact TeveXtra for support, account questions, or a complimentary advisory consultation. Reach us by email, phone, or live chat — our team responds within 24 business hours.",
    images: ["/images/tx.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
