import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Free Account",
  description: "Create a TeveXtra account to explore investment plans, manage your portfolio, and start your investment journey.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
